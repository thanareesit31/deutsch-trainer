begin;

update public.content_items
set data = jsonb_set(
  jsonb_set(
    jsonb_set(data, '{collection}', '"core"'::jsonb),
    '{group}', '"Plätze und Wege"'::jsonb
  ),
  '{image}', to_jsonb(case id
    when 'L14-V017' then '/images/lektion-14-vocabulary/zentrum.png'
    when 'L14-V018' then '/images/lektion-14-vocabulary/bahnhof.png'
  end)
)
where id in ('L14-V017', 'L14-V018')
  and lesson_id = 'L14'
  and skill = 'vocabulary';

update public.content_items
set data = jsonb_set(data, '{meaning}', '"ใจกลางเมือง · มีความหมายใกล้กับ das Zentrum"'::jsonb)
where id = 'L14-V017';

commit;
