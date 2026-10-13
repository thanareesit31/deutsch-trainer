begin;

update public.content_items
set status = 'archived'
where lesson_id = 'L10' and id = 'V151';

commit;
