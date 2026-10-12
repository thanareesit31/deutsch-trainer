-- Align L04 vocabulary with the three textbook categories while preserving learner history.
begin;

update public.content_items
set status = 'archived'
where id = 'V049';

update public.content_items
set data = jsonb_set(data, '{group}', '"Elektrogeräte"'::jsonb)
where id = 'V046';

insert into public.content_items(id, lesson_id, skill, position, status, data) values
('V182', 'L04', 'vocabulary', 300, 'published', '{"id":"V182","lessonId":"L04","skill":"vocabulary","group":"Elektrogeräte","title":"der Fernseher","meaning":"โทรทัศน์","answer":"der Fernseher","word":"Fernseher","article":"der","plural":"Fernseher","pluralOnly":false,"collection":"core"}'::jsonb),
('V183', 'L04', 'vocabulary', 301, 'published', '{"id":"V183","lessonId":"L04","skill":"vocabulary","group":"Elektrogeräte","title":"der Herd","meaning":"เตา","answer":"der Herd","word":"Herd","article":"der","plural":"Herde","pluralOnly":false,"collection":"core"}'::jsonb),
('V184', 'L04', 'vocabulary', 302, 'published', '{"id":"V184","lessonId":"L04","skill":"vocabulary","group":"Elektrogeräte","title":"der Kühlschrank","meaning":"ตู้เย็น","answer":"der Kühlschrank","word":"Kühlschrank","article":"der","plural":"Kühlschränke","pluralOnly":false,"collection":"core"}'::jsonb),
('V185', 'L04', 'vocabulary', 303, 'published', '{"id":"V185","lessonId":"L04","skill":"vocabulary","group":"Elektrogeräte","title":"die Waschmaschine","meaning":"เครื่องซักผ้า","answer":"die Waschmaschine","word":"Waschmaschine","article":"die","plural":"Waschmaschinen","pluralOnly":false,"collection":"core"}'::jsonb),
('V186', 'L04', 'vocabulary', 304, 'published', '{"id":"V186","lessonId":"L04","skill":"vocabulary","group":"Elektrogeräte","title":"der Ventilator","meaning":"พัดลม","answer":"der Ventilator","word":"Ventilator","article":"der","plural":"Ventilatoren","pluralOnly":false,"collection":"core"}'::jsonb),
('V187', 'L04', 'vocabulary', 305, 'published', '{"id":"V187","lessonId":"L04","skill":"vocabulary","group":"Bad","title":"die Badewanne","meaning":"อ่างอาบน้ำ","answer":"die Badewanne","word":"Badewanne","article":"die","plural":"Badewannen","pluralOnly":false,"collection":"core"}'::jsonb),
('V188', 'L04', 'vocabulary', 306, 'published', '{"id":"V188","lessonId":"L04","skill":"vocabulary","group":"Bad","title":"die Dusche","meaning":"ฝักบัว / ห้องอาบน้ำ","answer":"die Dusche","word":"Dusche","article":"die","plural":"Duschen","pluralOnly":false,"collection":"core"}'::jsonb),
('V189', 'L04', 'vocabulary', 307, 'published', '{"id":"V189","lessonId":"L04","skill":"vocabulary","group":"Bad","title":"das Waschbecken","meaning":"อ่างล้างหน้า","answer":"das Waschbecken","word":"Waschbecken","article":"das","plural":"Waschbecken","pluralOnly":false,"collection":"core"}'::jsonb)
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  skill = excluded.skill,
  position = excluded.position,
  status = excluded.status,
  data = excluded.data;

commit;
