begin;

insert into public.content_items(id,lesson_id,skill,position,status,data) values
('V190','L03','vocabulary',43,'published','{"id":"V190","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"der Mann","meaning":"ผู้ชาย / สามี","answer":"der Mann","word":"Mann","article":"der","plural":"Männer","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V191','L03','vocabulary',44,'published','{"id":"V191","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"die Frau","meaning":"ผู้หญิง / ภรรยา","answer":"die Frau","word":"Frau","article":"die","plural":"Frauen","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V192','L03','vocabulary',45,'published','{"id":"V192","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"der Onkel","meaning":"ลุง / น้า / อา","answer":"der Onkel","word":"Onkel","article":"der","plural":"Onkel","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V193','L03','vocabulary',46,'published','{"id":"V193","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"die Tante","meaning":"ป้า / น้า / อา","answer":"die Tante","word":"Tante","article":"die","plural":"Tanten","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V194','L03','vocabulary',47,'published','{"id":"V194","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"der Neffe","meaning":"หลานชาย / ลูกของพี่น้อง","answer":"der Neffe","word":"Neffe","article":"der","plural":"Neffen","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V195','L03','vocabulary',48,'published','{"id":"V195","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"die Nichte","meaning":"หลานสาว / ลูกของพี่น้อง","answer":"die Nichte","word":"Nichte","article":"die","plural":"Nichten","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V196','L03','vocabulary',49,'published','{"id":"V196","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"der Freund","meaning":"เพื่อนชาย / แฟนชาย","answer":"der Freund","word":"Freund","article":"der","plural":"Freunde","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb),
('V197','L03','vocabulary',50,'published','{"id":"V197","lessonId":"L03","skill":"vocabulary","group":"Familie","title":"die Freundin","meaning":"เพื่อนหญิง / แฟนหญิง","answer":"die Freundin","word":"Freundin","article":"die","plural":"Freundinnen","collection":"extra","sourceScope":"worksheet_support","sources":[{"document":"ชีท Lektion 1-12.pdf","pdfPage":29}]}'::jsonb)
on conflict (id) do update set status = excluded.status, data = excluded.data;

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
 'deutsch-trainer-guided-learning-L13-grammar',
 'deutsch-trainer-family-plural-learning-v1-L03'
));

commit;
