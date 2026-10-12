insert into public.content_items(id,lesson_id,skill,position,status,data) values
('L02-family-status-married','L02','vocabulary',1100,'published','{"id":"L02-family-status-married","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"verheiratet","meaning":"แต่งงานแล้ว","answer":"verheiratet","word":"verheiratet","type":"adjective","image":"verheiratet","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-divorced','L02','vocabulary',1101,'published','{"id":"L02-family-status-divorced","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"geschieden","meaning":"หย่าร้าง","answer":"geschieden","word":"geschieden","type":"adjective","image":"geschieden","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-children','L02','vocabulary',1102,'published','{"id":"L02-family-status-children","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"mit Kindern","meaning":"มีลูก","answer":"mit Kindern","word":"mit Kindern","type":"expression","image":"mit-kindern","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-no-children','L02','vocabulary',1103,'published','{"id":"L02-family-status-no-children","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"kinderlos","meaning":"ไม่มีลูก","answer":"kinderlos","word":"kinderlos","type":"adjective","image":"kinderlos","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-cohabiting','L02','vocabulary',1104,'published','{"id":"L02-family-status-cohabiting","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"zusammenleben","meaning":"อยู่ด้วยกัน","answer":"zusammenleben","word":"zusammenleben","type":"verb","image":"zusammenleben","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-single','L02','vocabulary',1105,'published','{"id":"L02-family-status-single","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Single","meaning":"โสด","answer":"Single","word":"Single","type":"other","image":"single","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-alone','L02','vocabulary',1106,'published','{"id":"L02-family-status-alone","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"allein","meaning":"อยู่คนเดียว","answer":"allein","word":"allein","type":"other","image":"allein","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb)
on conflict (id) do update set position = excluded.position, status = excluded.status, data = public.content_items.data || excluded.data;

update public.content_lessons
set data = jsonb_set(
  data,
  '{learningFlows,vocabulary,activities}',
  coalesce((
    select jsonb_agg(entry.value order by entry.position)
    from jsonb_array_elements(data->'learningFlows'->'vocabulary'->'activities') with ordinality as entry(value, position)
    where entry.value->>'id' not like 'L02-familienstand-%'
  ), '[]'::jsonb),
  true
)
where id = 'L02';
