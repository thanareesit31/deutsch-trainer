begin;

update public.content_items
set data = jsonb_set(data, '{meaning}', to_jsonb('การมาถึง (ใช้กับการเดินทางหลายแบบ)'::text), true)
where lesson_id = 'L10' and id = 'V211';

commit;
