update public.content_items
set skill = 'phrases',
    data = jsonb_set(data, '{skill}', to_jsonb('phrases'::text), true)
where id = 'L02-question-was'
  and lesson_id = 'L02'
  and skill = 'grammar';
