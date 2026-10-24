begin;
insert into public.phrase_practice_questions(id,version,definition) select value->>'id',(value->>'version')::integer,value from jsonb_array_elements($phrase_pathway$[{"id":"L13-R004-comprehension","version":1,"itemId":"L13-R004","requiredItemIds":["L13-R004","L13-R005","L13-R006"],"topicId":"L13-phrases-rating","subskill":"phrase_comprehension","kind":"choice","acceptedAnswers":["ฉันคิดว่าเมืองนี้ยอดเยี่ยม"]},{"id":"L13-phrases-rating-write","version":2,"itemId":"L13-R001","requiredItemIds":["L13-R001","L13-R002","L13-R003"],"topicId":"L13-phrases-rating","subskill":"phrase_application","kind":"write","acceptedAnswers":[],"rubric":["เขียน 2–3 ประโยคเกี่ยวกับสถานที่หรือหัวข้อที่เลือก","บอกความเห็นหรือข้อมูลให้เข้าใจได้","ใช้สำนวนจากบทเรียนอย่างน้อยหนึ่งประโยค"],"writeMinimum":30},{"id":"L13-R013-comprehension","version":1,"itemId":"L13-R013","requiredItemIds":["L13-R013","L13-R014","L13-R015"],"topicId":"L13-phrases-city","subskill":"phrase_comprehension","kind":"choice","acceptedAnswers":["มีคาเฟ่ด้วย"]},{"id":"L13-phrases-city-write","version":2,"itemId":"L13-R010","requiredItemIds":["L13-R010","L13-R011","L13-R012"],"topicId":"L13-phrases-city","subskill":"phrase_application","kind":"write","acceptedAnswers":[],"rubric":["เขียน 2–3 ประโยคเกี่ยวกับสถานที่หรือหัวข้อที่เลือก","บอกความเห็นหรือข้อมูลให้เข้าใจได้","ใช้สำนวนจากบทเรียนอย่างน้อยหนึ่งประโยค"],"writeMinimum":30},{"id":"L13-R020-comprehension","version":1,"itemId":"L13-R020","requiredItemIds":["L13-R020","L13-R021","L13-R022"],"topicId":"L13-phrases-favorite","subskill":"phrase_comprehension","kind":"choice","acceptedAnswers":["ที่นั่นสามารถเดินเล่นได้"]},{"id":"L13-phrases-favorite-write","version":2,"itemId":"L13-R017","requiredItemIds":["L13-R017","L13-R018","L13-R019"],"topicId":"L13-phrases-favorite","subskill":"phrase_application","kind":"write","acceptedAnswers":[],"rubric":["เขียน 2–3 ประโยคเกี่ยวกับสถานที่หรือหัวข้อที่เลือก","บอกความเห็นหรือข้อมูลให้เข้าใจได้","ใช้สำนวนจากบทเรียนอย่างน้อยหนึ่งประโยค"],"writeMinimum":30},{"id":"L13-R027-comprehension","version":1,"itemId":"L13-R027","requiredItemIds":["L13-R027","L13-R028","L13-R029"],"topicId":"L13-phrases-opinions","subskill":"phrase_comprehension","kind":"choice","acceptedAnswers":["ฉันคิดว่าเมืองนี้ใหญ่เกินไป"]},{"id":"L13-phrases-opinions-write","version":2,"itemId":"L13-R024","requiredItemIds":["L13-R024","L13-R025","L13-R026"],"topicId":"L13-phrases-opinions","subskill":"phrase_application","kind":"write","acceptedAnswers":[],"rubric":["เขียน 2–3 ประโยคเกี่ยวกับสถานที่หรือหัวข้อที่เลือก","บอกความเห็นหรือข้อมูลให้เข้าใจได้","ใช้สำนวนจากบทเรียนอย่างน้อยหนึ่งประโยค"],"writeMinimum":30}]$phrase_pathway$::jsonb) on conflict(id,version) do nothing;
create or replace function public.validate_vocabulary_practice_session() returns trigger
language plpgsql security definer set search_path='' as $$
declare entry jsonb; q jsonb; expected jsonb; target text; image_state jsonb; learned jsonb; attempt jsonb; response text; is_correct boolean; validated jsonb:='[]'::jsonb; confidence text; required_id text;
begin
 if new.bank_key not like 'vocab-%' and new.bank_key not like 'phrases-%' then return new; end if;
 if jsonb_typeof(new.state->'position') is distinct from 'number' or jsonb_typeof(new.state->'createdAt') is distinct from 'string' or (new.state->>'createdAt') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T' then raise exception 'Invalid vocabulary history'; end if;
 perform (new.state->>'createdAt')::timestamptz;
 if new.session_id is distinct from new.state->>'id' or jsonb_typeof(new.state->'items') is distinct from 'array' or jsonb_typeof(new.state->'completed') is distinct from 'boolean' then raise exception 'Invalid vocabulary session'; end if;
 if jsonb_array_length(new.state->'items') not between 1 and 100 or (new.state->>'position')::integer not between 0 and jsonb_array_length(new.state->'items')-1 then raise exception 'Invalid vocabulary session size or position'; end if;
 select state into image_state from public.learner_lesson_states where user_id=new.user_id and lesson_key='deutsch-trainer-vocabulary-image-learning-v1-L13';
 learned:=case when jsonb_typeof(image_state)='array' then image_state when jsonb_typeof(image_state->'imageVocabularyIds')='array' then image_state->'imageVocabularyIds' else '[]'::jsonb end;
 for entry in select value from jsonb_array_elements(new.state->'items') loop
  if jsonb_typeof(entry->'response') is distinct from 'string' or jsonb_typeof(entry->'selected') is distinct from 'array' or jsonb_typeof(entry->'tokenOrder') is distinct from 'array' then raise exception 'Invalid vocabulary draft'; end if;
  q:=entry->'question'; target:=q->>'itemId';
  if new.bank_key like 'phrases-%' then
   select definition into expected from public.phrase_practice_questions where id=q->>'id' and version=(q->>'version')::integer;
  else
   select definition into expected from public.vocabulary_practice_questions where id=q->>'id' and version=(q->>'version')::integer;
  end if;
  if expected is null or target is distinct from expected->>'itemId' or q->'acceptedAnswers' is distinct from expected->'acceptedAnswers' or q->>'kind' is distinct from expected->>'kind' or q->>'subskill' is distinct from expected->>'subskill' or q->>'topicId' is distinct from expected->>'topicId' then raise exception 'Unknown or changed vocabulary question'; end if;
  if q->>'kind'='choice' and jsonb_typeof(q->'options') is distinct from 'array' then raise exception 'Invalid vocabulary options'; end if;
  if q->>'kind'='order' and (jsonb_typeof(q->'tokens') is distinct from 'array' or q->'tokens' is distinct from expected->'tokens') then raise exception 'Invalid sentence tokens'; end if;
  if new.bank_key not in ('vocab-basic','vocab-daily','phrases-basic','phrases-daily') and q->>'topicId' is distinct from 'L13-'||new.bank_key then raise exception 'Vocabulary topic changed'; end if;
  for required_id in select value from jsonb_array_elements_text(coalesce(expected->'requiredItemIds',jsonb_build_array(target))) loop
   if not (new.bank_key like 'vocab-%' and learned ? required_id) and not exists(select 1 from public.item_exposures where user_id=new.user_id and item_id=required_id) then raise exception 'Practice item has not been learned'; end if;
  end loop;
  attempt:=entry->'attempt';
  if attempt is not null and attempt<>'null'::jsonb then
   if jsonb_typeof(attempt)<>'object' or jsonb_typeof(attempt->'response') is distinct from 'string' or coalesce(attempt->>'submittedAt','')='' then raise exception 'Invalid vocabulary answer'; end if;
   perform (attempt->>'submittedAt')::timestamptz;
   confidence:=attempt->>'confidence';
   if confidence is not null and confidence not in ('easy','thought','guess') then raise exception 'Invalid confidence'; end if;
   response:=btrim(regexp_replace(regexp_replace(normalize(btrim(attempt->>'response'),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''));
   if q->>'kind'='write' then
    if length(btrim(response)) < (expected->>'writeMinimum')::integer or attempt->'selfAssessed' is distinct from 'true'::jsonb or attempt->'selfAssessment' is distinct from expected->'rubric' then raise exception 'Invalid self-reviewed writing'; end if;
    attempt:=attempt||jsonb_build_object('correct',null,'status','completed');
   else
    select exists(select 1 from jsonb_array_elements_text(expected->'acceptedAnswers') answer where btrim(regexp_replace(regexp_replace(normalize(btrim(answer),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''))=response) into is_correct;
    attempt:=attempt||jsonb_build_object('correct',is_correct,'status',case when is_correct and confidence is null then 'pending' else 'completed' end);
   end if;
   entry:=entry||jsonb_build_object('attempt',attempt);
  end if;
  validated:=validated||jsonb_build_array(entry);
 end loop;
 if (select count(distinct value->'question'->>'id') from jsonb_array_elements(validated))<>jsonb_array_length(validated) then raise exception 'Duplicate vocabulary questions'; end if;
 if exists(select 1 from jsonb_array_elements(validated) with ordinality i(item,idx) where idx-1<(new.state->>'position')::integer and (item->'attempt' is null or item->'attempt'='null'::jsonb or item->'attempt'->>'status'<>'completed')) then raise exception 'Earlier vocabulary answers are incomplete'; end if;
 if (new.state->>'completed')::boolean and exists(select 1 from jsonb_array_elements(validated) i where i->'attempt' is null or i->'attempt'='null'::jsonb or i->'attempt'->>'status'<>'completed') then raise exception 'Vocabulary round is not complete'; end if;
 new.state:=jsonb_set(new.state,'{items}',validated);
 return new;
end $$;
revoke all on function public.validate_vocabulary_practice_session() from public;
drop trigger if exists validate_vocabulary_practice_session on public.learner_practice_sessions;
create trigger validate_vocabulary_practice_session before insert or update on public.learner_practice_sessions for each row execute function public.validate_vocabulary_practice_session();

commit;
