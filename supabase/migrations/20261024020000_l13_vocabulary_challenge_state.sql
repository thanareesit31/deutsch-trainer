-- Keep the advanced L13 vocabulary round in the learner's account.
begin;
do $migration$
declare
  previous_expression text;
begin
  select pg_get_expr(conbin, conrelid) into previous_expression
  from pg_constraint
  where conrelid = 'public.learner_lesson_states'::regclass
    and conname = 'learner_lesson_states_lesson_key_check' and contype = 'c';
  if previous_expression is null then
    raise exception 'Expected learner_lesson_states allowlist is missing; inspect before migrating';
  end if;
  if position('deutsch-trainer-vocabulary-challenge-v1-L13' in previous_expression) > 0 then
    return;
  end if;
  alter table public.learner_lesson_states drop constraint learner_lesson_states_lesson_key_check;
  execute format(
    'alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check ((%s) or lesson_key = %L)',
    previous_expression,
    'deutsch-trainer-vocabulary-challenge-v1-L13'
  );
end
$migration$;
commit;
