begin;

update public.content_items
set data = jsonb_set(data, '{group}', to_jsonb('Verkehrsmittel'::text), true)
where lesson_id = 'L10' and id in ('V144', 'V145', 'V149', 'V150', 'V151', 'V153', 'V154', 'V198', 'V199', 'V200', 'V201', 'V202', 'V203', 'V204');

update public.content_items
set data = jsonb_set(data, '{group}', to_jsonb('Gepäck'::text), true)
where lesson_id = 'L10' and id in ('V147', 'V148', 'V152', 'V155');

update public.content_items
set data = jsonb_set(data, '{group}', to_jsonb('Orte'::text), true)
where lesson_id = 'L10' and id in ('V143', 'V146', 'V205', 'V206');

commit;
