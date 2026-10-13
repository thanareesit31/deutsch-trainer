begin;

update public.content_items as item
set data = jsonb_set(item.data, '{image}', to_jsonb('/images/lektion-05-vocabulary/' || images.filename))
from (values
  ('V217', 'V217-holz-v2.jpg'),
  ('V218', 'V218-papier-v2.jpg'),
  ('V219', 'V219-metall-v2.jpg'),
  ('V220', 'V220-plastik-v2.jpg'),
  ('V221', 'V221-glas-v2.jpg'),
  ('V222', 'V222-weiss-v2.svg'),
  ('V223', 'V223-gelb-v2.svg'),
  ('V224', 'V224-orange-v2.svg'),
  ('V225', 'V225-rot-v2.svg'),
  ('V226', 'V226-gruen-v2.svg'),
  ('V227', 'V227-blau-v2.svg'),
  ('V228', 'V228-braun-v2.svg'),
  ('V229', 'V229-schwarz-v2.svg')
) as images(id, filename)
where item.id = images.id;

commit;
