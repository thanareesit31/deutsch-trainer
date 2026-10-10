-- Add the next A1 level's lesson entries; lesson content will be published separately.
insert into public.content_lessons(id, position, status, data)
select
  'L' || lpad(n::text, 2, '0'),
  n - 1,
  'published',
  jsonb_build_object(
    'id', 'L' || lpad(n::text, 2, '0'),
    'number', n,
    'level', 'A1.3',
    'title', 'Lektion ' || n,
    'thai', 'กำลังเตรียมเนื้อหา',
    'topics', ''
  )
from generate_series(13, 18) as n
on conflict (id) do nothing;
