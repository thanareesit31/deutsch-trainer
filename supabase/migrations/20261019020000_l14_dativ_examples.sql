begin;

update public.content_items as item
set data = item.data || jsonb_build_object('title', example.answer, 'answer', example.answer, 'meaning', example.meaning)
from (values
  ('L14-G010', 'dem Spielplatz', 'vor dem Spielplatz · der → dem'),
  ('L14-G011', 'einem Kino', 'neben einem Kino · ein → einem'),
  ('L14-G012', 'der Post', 'an der Post · die → der'),
  ('L14-G013', 'den Häusern', 'zwischen den Häusern · พหูพจน์ die → den และเติม -n')
) as example(id, answer, meaning)
where item.id = example.id and item.lesson_id = 'L14';

commit;
