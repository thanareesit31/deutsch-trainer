-- Permit per-lesson image vocabulary progress keys for L03–L12.
begin;
alter table public.learner_lesson_states drop constraint if exists learner_lesson_states_lesson_key_check;
alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check (lesson_key in (
 'deutsch-trainer-alphabet-learning-v1-L01',
 'deutsch-trainer-vocabulary-image-learning-v1-L01',
 'deutsch-trainer-verb-learning-L01',
 'deutsch-trainer-guided-learning-L02-vocabulary',
 'deutsch-trainer-guided-learning-L02-grammar',
 'deutsch-trainer-vocabulary-image-learning-v1-L03',
 'deutsch-trainer-vocabulary-image-learning-v1-L04',
 'deutsch-trainer-vocabulary-image-learning-v1-L05',
 'deutsch-trainer-vocabulary-image-learning-v1-L06',
 'deutsch-trainer-vocabulary-image-learning-v1-L07',
 'deutsch-trainer-vocabulary-image-learning-v1-L08',
 'deutsch-trainer-vocabulary-image-learning-v1-L09',
 'deutsch-trainer-vocabulary-image-learning-v1-L10',
 'deutsch-trainer-vocabulary-image-learning-v1-L11',
 'deutsch-trainer-vocabulary-image-learning-v1-L12',
 'deutsch-trainer-vocabulary-image-learning-v1-L13',
 'deutsch-trainer-guided-learning-L13-grammar'
));
commit;
