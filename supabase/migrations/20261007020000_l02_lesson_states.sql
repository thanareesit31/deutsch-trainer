-- Add L02 drafts to the existing account-scoped state table; retain L01 keys/RLS.
begin;
alter table public.learner_lesson_states drop constraint if exists learner_lesson_states_lesson_key_check;
alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check (lesson_key in (
 'deutsch-trainer-alphabet-learning-v1-L01',
 'deutsch-trainer-vocabulary-image-learning-v1-L01',
 'deutsch-trainer-verb-learning-L01',
 'deutsch-trainer-guided-learning-L02-vocabulary',
 'deutsch-trainer-guided-learning-L02-grammar'
));
commit;
