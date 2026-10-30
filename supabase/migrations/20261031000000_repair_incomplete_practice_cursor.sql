begin;

create or replace function public.sync_practice_session(p_bank_key text,p_state jsonb) returns void
language plpgsql security definer set search_path=public as $$
declare
 uid uuid:=auth.uid();
 previous jsonb;
 merged jsonb;
 incoming jsonb;
 stored jsonb;
 items jsonb:='[]'::jsonb;
 i integer;
 first_incomplete integer;
 next_position integer;
 round_completed boolean;
begin
 if uid is null then raise exception 'Login required'; end if;
 if jsonb_typeof(p_state)<>'object' or coalesce(p_state->>'id','')=''
   or jsonb_typeof(p_state->'items')<>'array'
   or jsonb_array_length(p_state->'items') not between 1 and 100
   or jsonb_typeof(p_state->'position') is distinct from 'number'
   or (p_state->>'position')::integer not between 0 and jsonb_array_length(p_state->'items')-1
   or jsonb_typeof(p_state->'completed') is distinct from 'boolean'
   or octet_length(p_state::text)>500000 then raise exception 'Invalid practice session'; end if;
 -- Serialize a session across devices, including concurrent first inserts.
 perform pg_advisory_xact_lock(hashtextextended(uid::text||p_bank_key||(p_state->>'id'),0));
 select state into previous from learner_practice_sessions where user_id=uid and bank_key=p_bank_key and session_id=p_state->>'id';
 if previous is null then
  merged:=p_state;
 else
  if previous->'items'->0->'question'->>'id' is distinct from p_state->'items'->0->'question'->>'id' or jsonb_array_length(previous->'items')<>jsonb_array_length(p_state->'items') then raise exception 'Session questions changed'; end if;
  merged:=case when coalesce(p_state->>'updatedAt',p_state->>'createdAt','')>=coalesce(previous->>'updatedAt',previous->>'createdAt','') then p_state else previous end;
  for i in 0..jsonb_array_length(previous->'items')-1 loop
   stored:=previous->'items'->i;
   incoming:=p_state->'items'->i;
   if stored->'question'->>'id' is distinct from incoming->'question'->>'id' then raise exception 'Session questions changed'; end if;
   -- First submitted answers cannot be erased by a stale device.
   items:=items||jsonb_build_array(case when stored->'attempt' is not null and stored->'attempt'<>'null'::jsonb then case when (stored->'attempt'->>'status'='pending' or (stored->'attempt'->>'confidence' is null and incoming->'attempt'->>'confidence'='guess')) and incoming->'attempt'->>'status'='completed' and stored->'attempt'->>'submittedAt'=incoming->'attempt'->>'submittedAt' and stored->'attempt'->>'response'=incoming->'attempt'->>'response' then incoming else stored end when incoming->'attempt' is not null and incoming->'attempt'<>'null'::jsonb then incoming else merged->'items'->i end);
  end loop;
  merged:=merged||jsonb_build_object('items',items);
 end if;

 select min((ordinality-1)::integer) into first_incomplete
 from jsonb_array_elements(merged->'items') with ordinality as entry(item,ordinality)
 where entry.item->'attempt' is null
   or entry.item->'attempt'='null'::jsonb
   or coalesce(entry.item->'attempt'->>'status','')<>'completed';

 if coalesce((p_state->>'completed')::boolean,false) and first_incomplete is not null then
  raise exception 'Practice round is not complete';
 end if;

 next_position:=greatest(
  coalesce((previous->>'position')::integer,0),
  coalesce((p_state->>'position')::integer,0)
 );
 round_completed:=coalesce((previous->>'completed')::boolean,false)
   or coalesce((p_state->>'completed')::boolean,false);
 if first_incomplete is not null then
  -- Keep forward progress unless a stale cursor points past unanswered work.
  next_position:=least(next_position,first_incomplete);
  round_completed:=false;
 end if;
 merged:=merged||jsonb_build_object(
  'position',next_position,
  'completed',round_completed
 );

 insert into learner_practice_sessions(user_id,bank_key,session_id,state)
 values(uid,p_bank_key,p_state->>'id',merged)
 on conflict(user_id,bank_key,session_id) do update set state=excluded.state,updated_at=now();
end $$;

revoke all on function public.sync_practice_session(text,jsonb) from public;
grant execute on function public.sync_practice_session(text,jsonb) to authenticated;

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
  if q->>'interaction' is distinct from expected->>'interaction' or q->>'matchGroupId' is distinct from expected->>'matchGroupId' then raise exception 'Changed practice interaction'; end if;
  if expected->>'interaction'='match' and not ((q->'options') @> (expected->'options') and (expected->'options') @> (q->'options') and jsonb_array_length(q->'options')=jsonb_array_length(expected->'options')) then raise exception 'Changed matching options'; end if;
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
    attempt:=attempt||jsonb_build_object('correct',is_correct,'status','completed');
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

commit;
