-- Place the L13 verb and adjective study sets under Grammatik as requested.
begin;
update public.content_items
set skill = 'grammar',
    data = jsonb_set(
      jsonb_set(data, '{skill}', '"grammar"'::jsonb),
      '{group}',
      to_jsonb(case when data->>'type' = 'verb' then 'Verben' else 'Adjektive' end)
    )
where lesson_id = 'L13'
  and id between 'L13-V022' and 'L13-V043';
commit;
