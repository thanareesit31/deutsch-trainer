begin;
do $migration$
declare previous_expression text;
begin
 select pg_get_expr(conbin,conrelid) into previous_expression from pg_constraint
 where conrelid='public.learner_lesson_states'::regclass and conname='learner_lesson_states_lesson_key_check';
 if previous_expression is null then raise exception 'Lesson state allowlist missing'; end if;
 if position('release-course-v1' in previous_expression)>0 then return; end if;
 alter table public.learner_lesson_states drop constraint learner_lesson_states_lesson_key_check;
 execute format('alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check ((%s) or lesson_key ~ %L or lesson_key ~ %L or lesson_key in (%L,%L) or lesson_key ~ %L)',previous_expression,
 '^deutsch-trainer-phrase-discovery-v1-L(0[1-9]|1[0-4])$',
 '^deutsch-trainer-phrase-discovery-v1-L13-(rating|city|favorite|opinions)$',
 'deutsch-trainer-phrase-observations-v1-L14','deutsch-trainer-phrase-guidance-v1-L14',
 '^deutsch-trainer-release-course-v1-L1[5-8]-(vocabulary|grammar|phrases)$');
end $migration$;
create table if not exists public.release_course_cards (
 lesson_id text not null, skill text not null, card_id text not null,
 primary key(lesson_id,skill,card_id)
);
create table if not exists public.release_course_tasks (
 lesson_id text not null, skill text not null, task_id text not null, version integer not null,
 accepted_answers jsonb not null check(jsonb_typeof(accepted_answers)='array' and jsonb_array_length(accepted_answers)>0),
 required_card_ids jsonb not null check(jsonb_typeof(required_card_ids)='array'),
 primary key(lesson_id,skill,task_id,version)
);
alter table public.release_course_tasks add column if not exists case_sensitive boolean not null default false;
alter table public.release_course_tasks add column if not exists definition jsonb;
alter table public.release_course_cards enable row level security;
alter table public.release_course_tasks enable row level security;
drop policy if exists "Read release course cards" on public.release_course_cards;
create policy "Read release course cards" on public.release_course_cards for select to authenticated using(true);
drop policy if exists "Read release course tasks" on public.release_course_tasks;
create policy "Read release course tasks" on public.release_course_tasks for select to authenticated using(true);
grant select on public.release_course_cards,public.release_course_tasks to authenticated;
create or replace function public.normalize_release_course_answer_case(value text) returns text
language sql immutable strict set search_path='' as $$
 select normalize(btrim(value, chr(32)||chr(9)||chr(10)||chr(13)||chr(12)||chr(11)||chr(160)||chr(5760)||chr(8192)||chr(8193)||chr(8194)||chr(8195)||chr(8196)||chr(8197)||chr(8198)||chr(8199)||chr(8200)||chr(8201)||chr(8202)||chr(8232)||chr(8233)||chr(8239)||chr(8287)||chr(12288)||chr(65279)),NFC)
$$;
create or replace function public.normalize_release_course_answer(value text) returns text
language sql immutable strict set search_path='' as $$
 select lower(public.normalize_release_course_answer_case(value))
$$;
create or replace function public.validate_release_course_state() returns trigger
language plpgsql security definer set search_path='' as $$
declare lesson text; course_skill text; entry jsonb; canonical public.release_course_tasks%rowtype;
 active jsonb; learned_id text; previous_count integer; ordinal integer;
begin
 if new.lesson_key !~ '^deutsch-trainer-release-course-v1-L1[5-8]-(vocabulary|grammar|phrases)$' then return new; end if;
 lesson:=split_part(new.lesson_key,'-',6); course_skill:=split_part(new.lesson_key,'-',7);
 if jsonb_typeof(new.state) is distinct from 'object' or new.state->>'version' is distinct from '1'
 or jsonb_typeof(new.state->'learned') is distinct from 'array'
 or jsonb_typeof(new.state->'attempts') is distinct from 'array'
 or jsonb_typeof(new.state->'cursor') is distinct from 'number'
 or (new.state->>'cursor') !~ '^[0-9]+$'
 or not(new.state ? 'active') then raise exception 'Invalid release course state'; end if;
 for learned_id in select jsonb_array_elements_text(new.state->'learned') loop
  if not exists(select 1 from public.release_course_cards where lesson_id=lesson and skill=course_skill and card_id=learned_id)
  then raise exception 'Unknown release course card'; end if;
 end loop;
 if tg_op='UPDATE' then
  if old.state->'active'->'helpUsed'='true'::jsonb and new.state->'active'->>'taskId'=old.state->'active'->>'taskId'
   and new.state->'active'->>'startedAt'=old.state->'active'->>'startedAt' then
   new.state:=jsonb_set(new.state,'{active,helpUsed}','true'::jsonb);
  end if;
  if old.state->'active'->'helpUsed'='true'::jsonb then
   for ordinal in jsonb_array_length(old.state->'attempts')..jsonb_array_length(new.state->'attempts')-1 loop
    if new.state->'attempts'->ordinal->>'taskId'=old.state->'active'->>'taskId' then
     new.state:=jsonb_set(new.state,array['attempts',ordinal::text,'helpUsed'],'true'::jsonb);
    end if;
   end loop;
  end if;
  previous_count:=jsonb_array_length(old.state->'attempts');
  if jsonb_array_length(new.state->'attempts')<previous_count then raise exception 'Course answers cannot be removed'; end if;
  for ordinal in 0..previous_count-1 loop
   if new.state->'attempts'->ordinal is distinct from old.state->'attempts'->ordinal
   then raise exception 'Course answers are immutable'; end if;
  end loop;
  if not ((new.state->'learned') @> (old.state->'learned')) then raise exception 'Learned cards cannot be removed'; end if;
 end if;
 if (select count(distinct value->>'id') from jsonb_array_elements(new.state->'attempts'))<>jsonb_array_length(new.state->'attempts')
 then raise exception 'Duplicate course answer IDs'; end if;
 for entry in select value from jsonb_array_elements(new.state->'attempts') loop
  select * into canonical from public.release_course_tasks where lesson_id=lesson and skill=course_skill and task_id=entry->>'taskId' order by version desc limit 1;
  if canonical.task_id is null then raise exception 'Unknown course task'; end if;
  if not((new.state->'learned') @> canonical.required_card_ids) then raise exception 'Course task has not been learned'; end if;
  if coalesce(entry->>'id','')='' or jsonb_typeof(entry->'response') is distinct from 'string'
  or jsonb_typeof(entry->'correct') is distinct from 'boolean'
  or jsonb_typeof(entry->'helpUsed') is distinct from 'boolean'
  or jsonb_typeof(entry->'selectionReason') is distinct from 'string'
  or coalesce(entry->>'submittedAt','')='' then raise exception 'Invalid course answer'; end if;
  perform (entry->>'submittedAt')::timestamptz;
  if (entry->>'correct')::boolean is distinct from exists(select 1 from jsonb_array_elements_text(canonical.accepted_answers) answer where case when canonical.case_sensitive then public.normalize_release_course_answer_case(answer)=public.normalize_release_course_answer_case(entry->>'response') else public.normalize_release_course_answer(answer)=public.normalize_release_course_answer(entry->>'response') end)
  then raise exception 'Incorrect course grading'; end if;
 end loop;
 active:=new.state->'active';
 if active is distinct from 'null'::jsonb then
  select * into canonical from public.release_course_tasks where lesson_id=lesson and skill=course_skill and task_id=active->>'taskId' order by version desc limit 1;
  if canonical.task_id is null or jsonb_typeof(active->'draft') is distinct from 'string'
  or jsonb_typeof(active->'helpUsed') is distinct from 'boolean' or coalesce(active->>'startedAt','')=''
  or not((new.state->'learned') @> canonical.required_card_ids) then raise exception 'Invalid active course task'; end if;
  perform (active->>'startedAt')::timestamptz;
 end if;
 return new;
end $$;
revoke all on function public.validate_release_course_state() from public;
drop trigger if exists validate_release_course_state on public.learner_lesson_states;
create trigger validate_release_course_state before insert or update on public.learner_lesson_states for each row execute function public.validate_release_course_state();
commit;
