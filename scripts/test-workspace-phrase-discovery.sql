-- Local test adapter only. Keeps the existing allowlist and RLS policies.
do $$
declare current_rule text;
begin
  select pg_get_expr(conbin,conrelid) into strict current_rule
  from pg_constraint
  where conrelid='public.learner_lesson_states'::regclass
    and conname='learner_lesson_states_lesson_key_check';
  alter table public.learner_lesson_states drop constraint learner_lesson_states_lesson_key_check;
  execute format('alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check ((%s) or (lesson_key in (%L,%L) or lesson_key ~ ''^deutsch-trainer-phrase-discovery-v1-L(0[3-9]|1[0-2])$'' or lesson_key = ''deutsch-trainer-phrase-observations-v1-L14'' or lesson_key = ''deutsch-trainer-phrase-guidance-v1-L14'' or lesson_key ~ ''^deutsch-trainer-phrase-discovery-v1-L13-(rating|city|favorite|opinions)$''))',current_rule,'deutsch-trainer-phrase-discovery-v1-L01','deutsch-trainer-phrase-discovery-v1-L02');
end $$;
