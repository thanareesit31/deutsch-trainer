begin;
alter table public.learner_practice_sessions drop constraint if exists learner_practice_sessions_bank_key_check;
alter table public.learner_practice_sessions add constraint learner_practice_sessions_bank_key_check check (bank_key in (
 'es-gibt','dativ','verbs','grammar-basic','daily',
 'vocab-urban','vocab-culture','vocab-leisure','vocab-extra','vocab-basic','vocab-daily','phrases-rating','phrases-city','phrases-favorite','phrases-opinions','phrases-basic','phrases-daily'
));
commit;
