begin;
-- Metadata is separate from canonical question definitions and immutable learner responses.
create table if not exists public.phrase_practice_progression (
 task_id text not null, version integer not null check(version>0),
 lesson_id text not null check(lesson_id ~ '^L(0[1-9]|1[0-4])$'),
 target_id text not null, subskill text not null, context_id text not null,
 stage integer not null check(stage between 0 and 3), unlock jsonb,
 primary key(task_id,version),
 check((stage=0 and unlock is null) or (stage>0 and jsonb_typeof(unlock)='object'
  and jsonb_typeof(unlock->'subskill')='string'
  and unlock->'requiresAttempt'='true'::jsonb
  and jsonb_typeof(unlock->'minCorrectContexts')='number'
  and jsonb_typeof(unlock->'minPracticeSessions')='number'
  and (unlock->>'minCorrectContexts')::integer>=case when stage>=2 then 2 else 0 end
  and (unlock->>'minPracticeSessions')::integer>=case when stage>=2 then 2 else 0 end) is true)
);
alter table public.phrase_practice_progression enable row level security;
revoke all on public.phrase_practice_progression from anon,authenticated;
grant select on public.phrase_practice_progression to authenticated;
drop policy if exists "Read phrase progression" on public.phrase_practice_progression;
create policy "Read phrase progression" on public.phrase_practice_progression for select to authenticated using(true);
create or replace function public.phrase_practice_lesson(bank text) returns text
language sql immutable set search_path='' as $$
 select case
 when bank ~ '^a11-phrases-l(0[1-9]|1[0-2])-(basic|daily)$' then upper(split_part(bank,'-',3))
 when bank in ('phrases-rating','phrases-city','phrases-favorite','phrases-opinions','phrases-basic','phrases-daily') then 'L13'
 when bank in ('phrase-l14-ask','phrase-l14-describe','phrase-l14-unknown','phrase-l14-thanks','phrase-l14-basic','phrase-l14-mixed','phrase-l14-daily') then 'L14'
 end;
$$;
revoke all on function public.phrase_practice_lesson(text) from public;
create or replace function public.phrase_practice_independent(entry jsonb) returns boolean
language sql immutable set search_path='' as $$
 select coalesce(
 entry->'attempt'->'correct'='true'::jsonb
 and entry->'attempt'->>'status'='completed'
 and entry->'hintUsed'='false'::jsonb
 and (entry->'translationUsed'='false'::jsonb or entry->'attempt'->'translationUsed'='false'::jsonb)
 and entry->'translationUsed' is distinct from 'true'::jsonb
 and entry->'attempt'->'translationUsed' is distinct from 'true'::jsonb
 and entry->'attempt'->'assisted' is distinct from 'true'::jsonb
 and entry->'attempt'->>'confidence' is distinct from 'guess'
 and (entry->'wordHelpTokens'='[]'::jsonb or entry->'attempt'->'wordHelpTokens'='[]'::jsonb)
 and (not(entry ? 'wordHelpTokens') or entry->'wordHelpTokens'='[]'::jsonb)
 and (not(entry->'attempt' ? 'wordHelpTokens') or entry->'attempt'->'wordHelpTokens'='[]'::jsonb),false);
$$;
revoke all on function public.phrase_practice_independent(jsonb) from public;
create or replace function public.merge_phrase_practice_help(stored jsonb,incoming jsonb,chosen jsonb) returns jsonb
language plpgsql immutable set search_path='' as $$
declare source jsonb; words jsonb:='[]'::jsonb; output jsonb:=chosen; helped boolean:=false;
begin
 -- Keep the chosen response and unknown legacy assistance. Only assistance can accumulate.
 for source in select value from jsonb_array_elements(jsonb_build_array(stored,incoming,chosen)) loop
  if source->'hintUsed'='true'::jsonb then output:=output||jsonb_build_object('hintUsed',true); helped:=true; end if;
  if source->'translationUsed'='true'::jsonb or source->'attempt'->'translationUsed'='true'::jsonb then output:=output||jsonb_build_object('translationUsed',true); helped:=true; end if;
  if source->'attempt'->'assisted'='true'::jsonb then helped:=true; end if;
  if jsonb_typeof(source->'wordHelpTokens')='array' then words:=words||(source->'wordHelpTokens'); end if;
  if jsonb_typeof(source->'attempt'->'wordHelpTokens')='array' then words:=words||(source->'attempt'->'wordHelpTokens'); end if;
 end loop;
 select coalesce(jsonb_agg(value order by value),'[]'::jsonb) into words from (select distinct value from jsonb_array_elements(words)) tokens;
 if jsonb_array_length(words)>0 then output:=output||jsonb_build_object('wordHelpTokens',words); helped:=true; end if;
 if helped and jsonb_typeof(output->'attempt')='object' then output:=jsonb_set(output,'{attempt,assisted}','true'::jsonb); end if;
 return output;
end $$;
revoke all on function public.merge_phrase_practice_help(jsonb,jsonb,jsonb) from public;
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

 if public.phrase_practice_lesson(p_bank_key) is not null and previous is not null then
  for i in 0..jsonb_array_length(merged->'items')-1 loop
   merged:=jsonb_set(merged,array['items',i::text],public.merge_phrase_practice_help(previous->'items'->i,p_state->'items'->i,merged->'items'->i));
  end loop;
 end if;
 insert into learner_practice_sessions(user_id,bank_key,session_id,state)
 values(uid,p_bank_key,p_state->>'id',merged)
 on conflict(user_id,bank_key,session_id) do update set state=excluded.state,updated_at=now();
end $$;
revoke all on function public.sync_practice_session(text,jsonb) from public;
grant execute on function public.sync_practice_session(text,jsonb) to authenticated;
create or replace function public.validate_phrase_practice_progression() returns trigger
language plpgsql security definer set search_path='' as $$
declare lesson text; entry jsonb; meta public.phrase_practice_progression%rowtype;
 has_attempt boolean; contexts integer; sessions integer;
begin
 lesson:=public.phrase_practice_lesson(new.bank_key);
 if lesson is null then return new; end if;
 -- ON CONFLICT invokes INSERT triggers; an already-started queue remains valid.
 if exists(select 1 from public.learner_practice_sessions where user_id=new.user_id and bank_key=new.bank_key and session_id=new.session_id) then return new; end if;
 for entry in select value from jsonb_array_elements(new.state->'items') loop
  select * into meta from public.phrase_practice_progression where task_id=entry->'question'->>'id' and version=(entry->'question'->>'version')::integer;
  if meta.task_id is null or meta.stage=0 then continue; end if;
  if meta.lesson_id is distinct from lesson then raise exception 'Phrase progression lesson changed'; end if;
  with evidence as (
   select m.context_id,s.session_id,i,
    row_number() over(partition by m.context_id order by (i->'attempt'->>'submittedAt')::timestamptz desc,s.session_id desc,s.bank_key desc) rank
   from public.learner_practice_sessions s
   cross join lateral jsonb_array_elements(s.state->'items') i
   join public.phrase_practice_progression m on m.task_id=i->'question'->>'id' and m.version=(i->'question'->>'version')::integer
   where s.user_id=new.user_id and public.phrase_practice_lesson(s.bank_key)=lesson
    and m.lesson_id=lesson and m.target_id=meta.target_id and m.subskill=meta.unlock->>'subskill'
    and i->'attempt'->>'status'='completed'
  ) select count(*)>0,count(distinct context_id) filter(where rank=1 and public.phrase_practice_independent(i)),count(distinct session_id) filter(where rank=1 and public.phrase_practice_independent(i)) into has_attempt,contexts,sessions from evidence;
  if not has_attempt then raise exception 'Phrase progression requires an earlier response'; end if;
  if contexts<(meta.unlock->>'minCorrectContexts')::integer or sessions<(meta.unlock->>'minPracticeSessions')::integer then raise exception 'Phrase progression needs independent contexts and sessions'; end if;
 end loop;
 return new;
end $$;
revoke all on function public.validate_phrase_practice_progression() from public;
drop trigger if exists validate_phrase_practice_progression on public.learner_practice_sessions;
create trigger validate_phrase_practice_progression before insert on public.learner_practice_sessions for each row execute function public.validate_phrase_practice_progression();
create or replace function public.phrase_practice_upgrade_readiness() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('schemaVersion',1,'metadataTasks',count(*),'extensionTasks',count(*) filter(where stage>0),'lessons',count(distinct lesson_id),'contextCatalogReady',count(*)>0 and not exists(
 select 1 from public.phrase_practice_progression m where not exists(select 1 from public.a11_phrase_practice_questions q where q.id=m.task_id and q.version=m.version) and not exists(select 1 from public.phrase_practice_questions q where q.id=m.task_id and q.version=m.version)
 )) from public.phrase_practice_progression;
$$;
revoke all on function public.phrase_practice_upgrade_readiness() from public;
grant execute on function public.phrase_practice_upgrade_readiness() to anon,authenticated;
notify pgrst,'reload schema';
commit;
