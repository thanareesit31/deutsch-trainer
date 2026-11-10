begin;
do $migration$
declare previous_expression text;
begin
 select pg_get_expr(conbin,conrelid) into previous_expression from pg_constraint
 where conrelid='public.learner_practice_sessions'::regclass and conname='learner_practice_sessions_bank_key_check';
 if previous_expression is null then raise exception 'Practice bank allowlist missing'; end if;
 if position('a13-release' in previous_expression)>0 then return; end if;
 alter table public.learner_practice_sessions drop constraint learner_practice_sessions_bank_key_check;
 execute format('alter table public.learner_practice_sessions add constraint learner_practice_sessions_bank_key_check check ((%s) or bank_key ~ %L)',previous_expression,'^a13-release-l1[5-8]-(vocabulary|grammar|phrases)$');
end $migration$;
create or replace function public.sync_practice_session(p_bank_key text,p_state jsonb) returns void
language plpgsql security definer set search_path=public as $$
declare
 uid uuid:=auth.uid();
 previous jsonb;
 merged jsonb;
 incoming jsonb;
 stored jsonb;
 items jsonb:='[]'::jsonb;
 i integer;
 first_incomplete integer;
 next_position integer;
 round_completed boolean;
begin
 if uid is null then raise exception 'Login required'; end if;
 if jsonb_typeof(p_state)<>'object' or coalesce(p_state->>'id','')=''
   or jsonb_typeof(p_state->'items')<>'array'
   or jsonb_array_length(p_state->'items') not between 1 and 100
   or jsonb_typeof(p_state->'position') is distinct from 'number'
   or (p_state->>'position')::integer not between 0 and jsonb_array_length(p_state->'items')-1
   or jsonb_typeof(p_state->'completed') is distinct from 'boolean'
   or octet_length(p_state::text)>500000 then raise exception 'Invalid practice session'; end if;
 -- Serialize a session across devices, including concurrent first inserts.
 perform pg_advisory_xact_lock(hashtextextended(uid::text||p_bank_key||(p_state->>'id'),0));
 select state into previous from learner_practice_sessions where user_id=uid and bank_key=p_bank_key and session_id=p_state->>'id';
 if p_bank_key ~ '^a13-release-l1[5-8]-(vocabulary|grammar|phrases)$' and previous is not null then
  for i in 0..jsonb_array_length(p_state->'items')-1 loop
   stored:=previous->'items'->i;
   incoming:=p_state->'items'->i;
   if stored->'question'->>'id'=incoming->'question'->>'id'
    and (stored->'attempt' is null or stored->'attempt'='null'::jsonb)
    and stored->'hintUsed'='true'::jsonb then
    incoming:=incoming||jsonb_build_object('hintUsed',true);
    if incoming->'attempt' is not null and incoming->'attempt'<>'null'::jsonb then
     incoming:=jsonb_set(incoming,'{attempt,assisted}','true'::jsonb);
    end if;
    p_state:=jsonb_set(p_state,array['items',i::text],incoming);
   end if;
  end loop;
 end if;
 if previous is null then
  merged:=p_state;
 else
  if previous->'items'->0->'question'->>'id' is distinct from p_state->'items'->0->'question'->>'id' or jsonb_array_length(previous->'items')<>jsonb_array_length(p_state->'items') then raise exception 'Session questions changed'; end if;
  merged:=case when coalesce(p_state->>'updatedAt',p_state->>'createdAt','')>=coalesce(previous->>'updatedAt',previous->>'createdAt','') then p_state else previous end;
  for i in 0..jsonb_array_length(previous->'items')-1 loop
   stored:=previous->'items'->i;
   incoming:=p_state->'items'->i;
   if stored->'question'->>'id' is distinct from incoming->'question'->>'id' then raise exception 'Session questions changed'; end if;
   -- First submitted answers cannot be erased by a stale device.
   items:=items||jsonb_build_array(case when stored->'attempt' is not null and stored->'attempt'<>'null'::jsonb then case when (stored->'attempt'->>'status'='pending' or (stored->'attempt'->>'confidence' is null and incoming->'attempt'->>'confidence'='guess')) and incoming->'attempt'->>'status'='completed' and stored->'attempt'->>'submittedAt'=incoming->'attempt'->>'submittedAt' and stored->'attempt'->>'response'=incoming->'attempt'->>'response' then incoming else stored end when incoming->'attempt' is not null and incoming->'attempt'<>'null'::jsonb then incoming else merged->'items'->i end);
   if p_bank_key ~ '^a13-release-l1[5-8]-(vocabulary|grammar|phrases)$'
    and (stored->'attempt' is null or stored->'attempt'='null'::jsonb)
    and (stored->'hintUsed'='true'::jsonb or incoming->'hintUsed'='true'::jsonb) then
    items:=jsonb_set(items,array[i::text,'hintUsed'],'true'::jsonb);
    if items->i->'attempt' is not null and items->i->'attempt'<>'null'::jsonb then
     items:=jsonb_set(items,array[i::text,'attempt','assisted'],'true'::jsonb);
    end if;
   end if;
  end loop;
  merged:=merged||jsonb_build_object('items',items);
 end if;

 select min((ordinality-1)::integer) into first_incomplete
 from jsonb_array_elements(merged->'items') with ordinality as entry(item,ordinality)
 where entry.item->'attempt' is null
   or entry.item->'attempt'='null'::jsonb
   or coalesce(entry.item->'attempt'->>'status','')<>'completed';

 if coalesce((p_state->>'completed')::boolean,false) and first_incomplete is not null then
  raise exception 'Practice round is not complete';
 end if;

 next_position:=greatest(
  coalesce((previous->>'position')::integer,0),
  coalesce((p_state->>'position')::integer,0)
 );
 round_completed:=coalesce((previous->>'completed')::boolean,false)
   or coalesce((p_state->>'completed')::boolean,false);
 if first_incomplete is not null then
  -- Keep forward progress unless a stale cursor points past unanswered work.
  next_position:=least(next_position,first_incomplete);
  round_completed:=false;
 end if;
 merged:=merged||jsonb_build_object(
  'position',next_position,
  'completed',round_completed
 );

 insert into learner_practice_sessions(user_id,bank_key,session_id,state)
 values(uid,p_bank_key,p_state->>'id',merged)
 on conflict(user_id,bank_key,session_id) do update set state=excluded.state,updated_at=now();
end $$;

create or replace function public.validate_release_practice_session() returns trigger
language plpgsql security definer set search_path='' as $$
declare lesson text; course_skill text; learned jsonb; entry jsonb; question jsonb; attempt jsonb; canonical public.release_course_tasks%rowtype; index_value jsonb; previous_item jsonb;
begin
 if new.bank_key !~ '^a13-release-l1[5-8]-(vocabulary|grammar|phrases)$' then return new; end if;
 lesson:=upper(split_part(new.bank_key,'-',3)); course_skill:=split_part(new.bank_key,'-',4);
 if new.session_id is distinct from new.state->>'id' or jsonb_typeof(new.state->'items') is distinct from 'array'
 or jsonb_array_length(new.state->'items') not between 1 and 100
 or jsonb_typeof(new.state->'completed') is distinct from 'boolean'
 or jsonb_typeof(new.state->'position') is distinct from 'number'
 or (new.state->>'position') !~ '^[0-9]+$'
 or (new.state->>'position')::integer>=jsonb_array_length(new.state->'items')
 or coalesce(new.state->>'createdAt','')='' then raise exception 'Invalid release practice session'; end if;
 perform (new.state->>'createdAt')::timestamptz;
 if new.state ? 'updatedAt' then perform (new.state->>'updatedAt')::timestamptz; end if;
 select state->'learned' into learned from public.learner_lesson_states where user_id=new.user_id
 and lesson_key='deutsch-trainer-release-course-v1-'||lesson||'-'||course_skill;
 for entry in select value from jsonb_array_elements(new.state->'items') loop
  question:=entry->'question';
  select * into canonical from public.release_course_tasks where lesson_id=lesson and skill=course_skill and task_id=question->>'id' and version=(question->>'version')::integer;
  if canonical.definition is null or question is distinct from canonical.definition then raise exception 'Unknown or changed release practice question'; end if;
  if course_skill='phrases' and not exists(select 1 from public.phrase_practice_questions where id=question->>'id' and version=(question->>'version')::integer and definition=question) then raise exception 'Unknown or changed release phrase question'; end if;
  if not coalesce(learned @> canonical.required_card_ids,false) then raise exception 'Release practice task has not been learned'; end if;
  if jsonb_typeof(entry->'response') is distinct from 'string' or jsonb_typeof(entry->'selected') is distinct from 'array'
  or jsonb_typeof(entry->'tokenOrder') is distinct from 'array' or jsonb_typeof(entry->'hintUsed') is distinct from 'boolean'
  or entry->'translationUsed' is distinct from 'false'::jsonb then raise exception 'Invalid release practice draft'; end if;
  for index_value in select value from jsonb_array_elements((entry->'selected')||(entry->'tokenOrder')) loop
   if jsonb_typeof(index_value) is distinct from 'number' or index_value::text !~ '^[0-9]+$' then raise exception 'Invalid release practice selection'; end if;
  end loop;
  if tg_op='UPDATE' then
   select value into previous_item from jsonb_array_elements(old.state->'items') where value->'question'->>'id'=question->>'id';
   if previous_item->'hintUsed'='true'::jsonb and entry->'hintUsed'<>'true'::jsonb then raise exception 'Release practice assistance cannot be removed'; end if;
  end if;
  attempt:=entry->'attempt';
  if attempt is not null and attempt<>'null'::jsonb then
   if jsonb_typeof(attempt->'response') is distinct from 'string' or jsonb_typeof(attempt->'correct') is distinct from 'boolean'
   or attempt->>'status' is distinct from 'completed' or coalesce(attempt->>'submittedAt','')=''
   or jsonb_typeof(attempt->'assisted') is distinct from 'boolean' or attempt->'confidence' is distinct from 'null'::jsonb
   then raise exception 'Invalid release practice answer'; end if;
   if attempt->'assisted' is distinct from entry->'hintUsed' then raise exception 'Release practice assistance does not match'; end if;
   perform (attempt->>'submittedAt')::timestamptz;
   if (attempt->>'correct')::boolean is distinct from exists(select 1 from jsonb_array_elements_text(canonical.accepted_answers) answer where case when canonical.case_sensitive then public.normalize_release_course_answer_case(answer)=public.normalize_release_course_answer_case(attempt->>'response') else public.normalize_release_course_answer(answer)=public.normalize_release_course_answer(attempt->>'response') end)
   then raise exception 'Incorrect release practice grading'; end if;
  end if;
 end loop;
 if (select count(distinct value->'question'->>'id') from jsonb_array_elements(new.state->'items'))<>jsonb_array_length(new.state->'items') then raise exception 'Duplicate release practice questions'; end if;
 if exists(select 1 from jsonb_array_elements(new.state->'items') with ordinality i(item,idx) where (idx-1<(new.state->>'position')::integer or (new.state->>'completed')::boolean) and (item->'attempt' is null or item->'attempt'='null'::jsonb)) then raise exception 'Release practice answers incomplete'; end if;
 return new;
end $$;
revoke all on function public.validate_release_practice_session() from public;
drop trigger if exists validate_release_practice_session on public.learner_practice_sessions;
create trigger validate_release_practice_session before insert or update on public.learner_practice_sessions for each row execute function public.validate_release_practice_session();
commit;
