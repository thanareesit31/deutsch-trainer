-- Keep only verb and adjective entries in the two L13 grammar study cards.
begin;
update public.content_items
set data = jsonb_set(data, '{group}', '"Verben"'::jsonb)
where lesson_id = 'L13'
  and id between 'L13-V022' and 'L13-V031';
update public.content_items
set data = jsonb_set(data, '{group}', '"Adjektive"'::jsonb)
where lesson_id = 'L13'
  and id between 'L13-V032' and 'L13-V041';
update public.content_items
set skill = 'vocabulary',
    data = jsonb_set(
      jsonb_set(
        jsonb_set(data, '{skill}', '"vocabulary"'::jsonb),
        '{collection}', '"extra"'::jsonb
      ),
      '{group}', '"Adverbien & Wendungen"'::jsonb
    )
where lesson_id = 'L13'
  and id in ('L13-V042', 'L13-V043');
commit;
