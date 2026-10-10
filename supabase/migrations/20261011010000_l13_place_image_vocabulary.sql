begin;

update public.content_items
set status = 'draft'
where lesson_id = 'L13'
  and skill = 'vocabulary'
  and data->>'collection' = 'extra'
  and id not in ('L13-V047', 'L13-V048', 'L13-V049', 'L13-V055');

commit;
