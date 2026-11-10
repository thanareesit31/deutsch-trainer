begin;
create table if not exists public.release_practice_metadata (
 lesson_id text not null, skill text not null, task_id text not null,
 context_id text not null, family_id text not null,
 stage integer not null check(stage between 0 and 3), unlock jsonb,
 is_extension boolean not null default false,
 primary key(lesson_id,skill,task_id),
 check(unlock is null or jsonb_typeof(unlock)='object')
);
alter table public.release_practice_metadata enable row level security;
drop policy if exists "Read release practice metadata" on public.release_practice_metadata;
create policy "Read release practice metadata" on public.release_practice_metadata for select to authenticated using(true);
grant select on public.release_practice_metadata to authenticated;
create or replace function public.validate_release_practice_progression() returns trigger
language plpgsql security definer set search_path='' as $$
declare lesson text; course_skill text; entry jsonb; meta public.release_practice_metadata%rowtype;
 target text; measured_skill text; has_attempt boolean; contexts integer; sessions integer;
begin
 if new.bank_key !~ '^a13-release-l1[5-8]-(vocabulary|grammar|phrases)$' then return new; end if;
 -- INSERT ... ON CONFLICT also invokes INSERT triggers for existing saved queues.
 if exists(select 1 from public.learner_practice_sessions where user_id=new.user_id and bank_key=new.bank_key and session_id=new.session_id) then return new; end if;
 lesson:=upper(split_part(new.bank_key,'-',3)); course_skill:=split_part(new.bank_key,'-',4);
 for entry in select value from jsonb_array_elements(new.state->'items') loop
  select * into meta from public.release_practice_metadata where lesson_id=lesson and skill=course_skill and task_id=entry->'question'->>'id';
  if meta.task_id is null or meta.stage=0 then continue; end if;
  if meta.unlock is null or jsonb_typeof(meta.unlock->'subskill') is distinct from 'string' then raise exception 'Practice progression policy missing'; end if;
  select definition->>'targetId' into target from public.release_course_tasks where lesson_id=lesson and skill=course_skill and task_id=meta.task_id and version=(entry->'question'->>'version')::integer;
  measured_skill:=meta.unlock->>'subskill';
  select exists(
   select 1 from public.learner_practice_sessions s cross join lateral jsonb_array_elements(s.state->'items') i
   join public.release_course_tasks t on t.lesson_id=lesson and t.skill=course_skill and t.task_id=i->'question'->>'id' and t.version=(i->'question'->>'version')::integer
   where s.user_id=new.user_id and s.bank_key=new.bank_key and t.definition->>'targetId'=target and t.definition->>'subskill'=measured_skill and i->'attempt'->>'status'='completed'
   union all
   select 1 from public.learner_lesson_states s cross join lateral jsonb_array_elements(s.state->'attempts') a
   join public.release_course_tasks t on t.lesson_id=lesson and t.skill=course_skill and t.task_id=a->>'taskId'
   left join public.release_practice_metadata m on m.lesson_id=t.lesson_id and m.skill=t.skill and m.task_id=t.task_id
   where s.user_id=new.user_id and s.lesson_key='deutsch-trainer-release-course-v1-'||lesson||'-'||course_skill
   and t.definition->>'targetId'=target and t.definition->>'subskill'=measured_skill and coalesce(m.is_extension,false)=false
  ) into has_attempt;
  if coalesce((meta.unlock->>'requiresAttempt')::boolean,false) and not has_attempt then raise exception 'Practice progression requires an earlier response'; end if;
  with evidence as (
   select coalesce(m.context_id,t.task_id) context_id,s.session_id,
    i->'attempt' attempt,
    row_number() over(partition by coalesce(m.context_id,t.task_id) order by (i->'attempt'->>'submittedAt')::timestamptz desc,s.session_id desc) rank
   from public.learner_practice_sessions s cross join lateral jsonb_array_elements(s.state->'items') i
   join public.release_course_tasks t on t.lesson_id=lesson and t.skill=course_skill and t.task_id=i->'question'->>'id' and t.version=(i->'question'->>'version')::integer
   left join public.release_practice_metadata m on m.lesson_id=t.lesson_id and m.skill=t.skill and m.task_id=t.task_id
   where s.user_id=new.user_id and s.bank_key=new.bank_key and t.definition->>'targetId'=target and t.definition->>'subskill'=measured_skill and i->'attempt'->>'status'='completed'
  ) select count(distinct context_id),count(distinct session_id) into contexts,sessions from evidence where rank=1 and attempt->'correct'='true'::jsonb and attempt->'assisted'='false'::jsonb;
  if contexts<greatest(coalesce((meta.unlock->>'minCorrectContexts')::integer,0),case when meta.stage>=2 then 2 else 0 end)
   or sessions<greatest(coalesce((meta.unlock->>'minPracticeSessions')::integer,0),case when meta.stage>=2 then 2 else 0 end)
  then raise exception 'Practice progression needs independent contexts and sessions'; end if;
 end loop;
 return new;
end $$;
revoke all on function public.validate_release_practice_progression() from public;
drop trigger if exists validate_release_practice_progression on public.learner_practice_sessions;
create trigger validate_release_practice_progression before insert on public.learner_practice_sessions for each row execute function public.validate_release_practice_progression();
create or replace function public.release_course_readiness() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
 'courses',(select count(distinct(lesson_id,skill)) from public.release_course_cards),
 'cards',(select count(*) from public.release_course_cards),
 'tasks',(select count(*) from public.release_course_tasks t left join public.release_practice_metadata m using(lesson_id,skill,task_id) where t.definition is not null and not coalesce(m.is_extension,false)),
 'extensionTasks',(select count(*) from public.release_course_tasks t join public.release_practice_metadata m using(lesson_id,skill,task_id) where t.definition is not null and m.is_extension),
 'phraseTasks',(select count(*) from public.phrase_practice_questions where id ~ '^L1[5-8]-D[0-9]{2}-[AB]-try-v1$'),
 'practiceSyncReady',position('a13-release' in pg_get_functiondef('public.sync_practice_session(text,jsonb)'::regprocedure))>0,
 'practiceVersion',2,
 'contextCatalogReady',((select count(*)=372 from public.release_practice_metadata where not is_extension) and not exists(select 1 from public.release_course_tasks t where not exists(select 1 from public.release_practice_metadata m where m.lesson_id=t.lesson_id and m.skill=t.skill and m.task_id=t.task_id)))
 );
$$;
revoke all on function public.release_course_readiness() from public;
grant execute on function public.release_course_readiness() to anon,authenticated;
notify pgrst,'reload schema';
commit;
