begin;
do $migration$
declare previous_expression text;
begin
 select pg_get_expr(conbin, conrelid) into previous_expression
 from pg_constraint where conrelid='public.learner_lesson_states'::regclass
 and conname='learner_lesson_states_lesson_key_check' and contype='c';
 if previous_expression is null then raise exception 'Lesson state allowlist missing'; end if;
 if position('grammar-discovery-v1' in previous_expression)>0
 and position('deutsch-trainer-phrase-practice-v1-L14' in previous_expression)>0
 and position('deutsch-trainer-vocabulary-practice-v1-L14' in previous_expression)>0
 and position('deutsch-trainer-vocabulary-challenge-v1-L13' in previous_expression)>0 then return; end if;
 alter table public.learner_lesson_states drop constraint learner_lesson_states_lesson_key_check;
 execute format('alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check ((%s) or lesson_key ~ %L or lesson_key in (%L,%L,%L))',
 previous_expression,'^deutsch-trainer-grammar-discovery-v1-L(0[3-9]|1[0-2])$',
 'deutsch-trainer-phrase-practice-v1-L14',
 'deutsch-trainer-vocabulary-practice-v1-L14',
 'deutsch-trainer-vocabulary-challenge-v1-L13');
end $migration$;
commit;
