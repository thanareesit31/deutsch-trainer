insert into public.content_items(id,lesson_id,skill,position,status,data) values
('L02-family-status-married','L02','vocabulary',1100,'published','{"id":"L02-family-status-married","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Wir sind verheiratet.","meaning":"เราแต่งงานแล้ว","answer":"Wir sind verheiratet.","word":"verheiratet","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-divorced','L02','vocabulary',1101,'published','{"id":"L02-family-status-divorced","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Wir sind geschieden.","meaning":"เราหย่ากันแล้ว","answer":"Wir sind geschieden.","word":"geschieden","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-children','L02','vocabulary',1102,'published','{"id":"L02-family-status-children","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Wir haben ein Kind / zwei Kinder.","meaning":"เรามีลูกหนึ่งคน / สองคน","answer":"Wir haben ein Kind / zwei Kinder.","word":"ein Kind / zwei Kinder haben","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-no-children','L02','vocabulary',1103,'published','{"id":"L02-family-status-no-children","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Wir haben keine Kinder.","meaning":"เราไม่มีลูก","answer":"Wir haben keine Kinder.","word":"keine Kinder haben","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-cohabiting','L02','vocabulary',1104,'published','{"id":"L02-family-status-cohabiting","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Wir sind nicht verheiratet, aber wir leben zusammen.","meaning":"เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน","answer":"Wir sind nicht verheiratet, aber wir leben zusammen.","word":"nicht verheiratet; zusammen leben","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb),
('L02-family-status-single','L02','vocabulary',1105,'published','{"id":"L02-family-status-single","lessonId":"L02","skill":"vocabulary","group":"Familienstand","title":"Ich bin Single. / Ich lebe allein.","meaning":"ฉันโสด / ฉันอยู่คนเดียว","answer":"Ich bin Single. / Ich lebe allein.","word":"Single; allein leben","sourceScope":"core_book","sources":[{"document":"Moment A1 Lektion 1-12","pdfPage":16,"printedPage":15}],"collection":"core"}'::jsonb)
on conflict (id) do nothing;

update public.content_lessons
set data = jsonb_set(
  data,
  '{learningFlows,vocabulary,activities}',
  (data->'learningFlows'->'vocabulary'->'activities') || jsonb_build_array(
    jsonb_build_object(
      'id','L02-familienstand-married',
      'type','multiple_choice',
      'section','Familienstand · Bedeutung',
      'instruction','อ่านประโยคแล้วเลือกความหมาย',
      'sourceScope','core_book',
      'contentIds',jsonb_build_array('L02-family-status-married'),
      'prompt',jsonb_build_object('id','L02-family-status-married','ref',jsonb_build_object('itemId','L02-family-status-married','field','answer')),
      'options',jsonb_build_array(
        jsonb_build_object('id','married','text','เราแต่งงานแล้ว'),
        jsonb_build_object('id','divorced','text','เราหย่ากันแล้ว'),
        jsonb_build_object('id','children','text','เรามีลูกหนึ่งคน / สองคน'),
        jsonb_build_object('id','no-children','text','เราไม่มีลูก'),
        jsonb_build_object('id','cohabiting','text','เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน'),
        jsonb_build_object('id','single','text','ฉันโสด / ฉันอยู่คนเดียว')
      ),
      'correctOptionId','married'
    ),
    jsonb_build_object(
      'id','L02-familienstand-divorced',
      'type','multiple_choice',
      'section','Familienstand · Bedeutung',
      'instruction','อ่านประโยคแล้วเลือกความหมาย',
      'sourceScope','core_book',
      'contentIds',jsonb_build_array('L02-family-status-divorced'),
      'prompt',jsonb_build_object('id','L02-family-status-divorced','ref',jsonb_build_object('itemId','L02-family-status-divorced','field','answer')),
      'options',jsonb_build_array(
        jsonb_build_object('id','married','text','เราแต่งงานแล้ว'),
        jsonb_build_object('id','divorced','text','เราหย่ากันแล้ว'),
        jsonb_build_object('id','children','text','เรามีลูกหนึ่งคน / สองคน'),
        jsonb_build_object('id','no-children','text','เราไม่มีลูก'),
        jsonb_build_object('id','cohabiting','text','เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน'),
        jsonb_build_object('id','single','text','ฉันโสด / ฉันอยู่คนเดียว')
      ),
      'correctOptionId','divorced'
    ),
    jsonb_build_object(
      'id','L02-familienstand-children',
      'type','multiple_choice',
      'section','Familienstand · Bedeutung',
      'instruction','อ่านประโยคแล้วเลือกความหมาย',
      'sourceScope','core_book',
      'contentIds',jsonb_build_array('L02-family-status-children'),
      'prompt',jsonb_build_object('id','L02-family-status-children','ref',jsonb_build_object('itemId','L02-family-status-children','field','answer')),
      'options',jsonb_build_array(
        jsonb_build_object('id','married','text','เราแต่งงานแล้ว'),
        jsonb_build_object('id','divorced','text','เราหย่ากันแล้ว'),
        jsonb_build_object('id','children','text','เรามีลูกหนึ่งคน / สองคน'),
        jsonb_build_object('id','no-children','text','เราไม่มีลูก'),
        jsonb_build_object('id','cohabiting','text','เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน'),
        jsonb_build_object('id','single','text','ฉันโสด / ฉันอยู่คนเดียว')
      ),
      'correctOptionId','children'
    ),
    jsonb_build_object(
      'id','L02-familienstand-no-children',
      'type','multiple_choice',
      'section','Familienstand · Bedeutung',
      'instruction','อ่านประโยคแล้วเลือกความหมาย',
      'sourceScope','core_book',
      'contentIds',jsonb_build_array('L02-family-status-no-children'),
      'prompt',jsonb_build_object('id','L02-family-status-no-children','ref',jsonb_build_object('itemId','L02-family-status-no-children','field','answer')),
      'options',jsonb_build_array(
        jsonb_build_object('id','married','text','เราแต่งงานแล้ว'),
        jsonb_build_object('id','divorced','text','เราหย่ากันแล้ว'),
        jsonb_build_object('id','children','text','เรามีลูกหนึ่งคน / สองคน'),
        jsonb_build_object('id','no-children','text','เราไม่มีลูก'),
        jsonb_build_object('id','cohabiting','text','เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน'),
        jsonb_build_object('id','single','text','ฉันโสด / ฉันอยู่คนเดียว')
      ),
      'correctOptionId','no-children'
    ),
    jsonb_build_object(
      'id','L02-familienstand-cohabiting',
      'type','multiple_choice',
      'section','Familienstand · Bedeutung',
      'instruction','อ่านประโยคแล้วเลือกความหมาย',
      'sourceScope','core_book',
      'contentIds',jsonb_build_array('L02-family-status-cohabiting'),
      'prompt',jsonb_build_object('id','L02-family-status-cohabiting','ref',jsonb_build_object('itemId','L02-family-status-cohabiting','field','answer')),
      'options',jsonb_build_array(
        jsonb_build_object('id','married','text','เราแต่งงานแล้ว'),
        jsonb_build_object('id','divorced','text','เราหย่ากันแล้ว'),
        jsonb_build_object('id','children','text','เรามีลูกหนึ่งคน / สองคน'),
        jsonb_build_object('id','no-children','text','เราไม่มีลูก'),
        jsonb_build_object('id','cohabiting','text','เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน'),
        jsonb_build_object('id','single','text','ฉันโสด / ฉันอยู่คนเดียว')
      ),
      'correctOptionId','cohabiting'
    ),
    jsonb_build_object(
      'id','L02-familienstand-single',
      'type','multiple_choice',
      'section','Familienstand · Bedeutung',
      'instruction','อ่านประโยคแล้วเลือกความหมาย',
      'sourceScope','core_book',
      'contentIds',jsonb_build_array('L02-family-status-single'),
      'prompt',jsonb_build_object('id','L02-family-status-single','ref',jsonb_build_object('itemId','L02-family-status-single','field','answer')),
      'options',jsonb_build_array(
        jsonb_build_object('id','married','text','เราแต่งงานแล้ว'),
        jsonb_build_object('id','divorced','text','เราหย่ากันแล้ว'),
        jsonb_build_object('id','children','text','เรามีลูกหนึ่งคน / สองคน'),
        jsonb_build_object('id','no-children','text','เราไม่มีลูก'),
        jsonb_build_object('id','cohabiting','text','เราไม่ได้แต่งงาน แต่เราอยู่ด้วยกัน'),
        jsonb_build_object('id','single','text','ฉันโสด / ฉันอยู่คนเดียว')
      ),
      'correctOptionId','single'
    )
  ),
  true
)
where id = 'L02'
  and not exists (
    select 1
    from jsonb_array_elements(data->'learningFlows'->'vocabulary'->'activities') as activities(activity)
    where activity->>'id' = 'L02-familienstand-married'
  );
