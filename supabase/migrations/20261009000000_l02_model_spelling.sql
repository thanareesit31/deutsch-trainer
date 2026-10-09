-- Correct the fashion profession while keeping all IDs and learner evidence.
update public.content_items
set data = data || jsonb_build_object(
  'title', 'Model', 'answer', 'Model', 'word', 'Model',
  'professionContent', (data->'professionContent') ||
    jsonb_build_object('masculine', 'Model', 'feminine', 'Model')
)
where data->>'lessonId' = 'L02'
  and data->'professionContent'->>'conceptKey' = 'modell';
