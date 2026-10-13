begin;

update public.content_items
set data = jsonb_set(data, '{image}', to_jsonb(case id
  when 'L14-V005' then '/images/lektion-14-vocabulary/bank-v2.jpg'
  when 'L14-V002' then '/images/lektion-14-vocabulary/kindergarten-v2.jpg'
  when 'L14-V003' then '/images/lektion-14-vocabulary/schule-v2.jpg'
  when 'L14-V004' then '/images/lektion-14-vocabulary/post-v2.jpg'
  when 'L14-V013' then '/images/lektion-14-vocabulary/bruecke-v2.jpg'
end))
where id in ('L14-V002', 'L14-V003', 'L14-V004', 'L14-V005', 'L14-V013')
  and lesson_id = 'L14'
  and skill = 'vocabulary';

update public.content_items
set status = 'archived'
where id = 'L14-V025'
  and lesson_id = 'L14'
  and skill = 'vocabulary';

commit;
