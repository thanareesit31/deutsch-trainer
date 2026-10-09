-- Relocate existing concepts; never delete items or learner evidence.
update public.content_items
set skill = 'phrases', data = data || jsonb_build_object('skill', 'phrases')
where lesson_id = 'L02' and id in (
  'L02-status-praktikum', 'L02-status-arbeitslos', 'L02-status-nicht-arbeiten',
  'L02-status-freiberuflich', 'L02-status-selbststaendig', 'L02-status-angestellt',
  'L02-traumberuf'
);
update public.content_items
set data = data || jsonb_build_object('group', 'Beruflicher Status',
  'meaning', case id
    when 'L02-status-praktikum' then 'การฝึกงาน'
    when 'L02-status-arbeitslos' then 'ว่างงาน'
    when 'L02-status-nicht-arbeiten' then 'ไม่ได้ทำงาน'
    when 'L02-status-freiberuflich' then 'ทำงานฟรีแลนซ์ / อาชีพอิสระ'
    when 'L02-status-selbststaendig' then 'ประกอบอาชีพอิสระ'
    when 'L02-status-angestellt' then 'เป็นลูกจ้าง' end)
where lesson_id = 'L02' and id in (
  'L02-status-praktikum', 'L02-status-arbeitslos', 'L02-status-nicht-arbeiten',
  'L02-status-freiberuflich', 'L02-status-selbststaendig', 'L02-status-angestellt'
);
update public.content_items set data = data || '{"article":"das"}'::jsonb
where id = 'L02-status-praktikum' and lesson_id = 'L02';
