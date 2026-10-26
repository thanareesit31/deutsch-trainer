-- Move L14 Redemittel rounds onto the shared account-backed practice-session path.
begin;

alter table public.learner_practice_sessions drop constraint if exists learner_practice_sessions_bank_key_check;
alter table public.learner_practice_sessions add constraint learner_practice_sessions_bank_key_check check (bank_key in (
  'es-gibt','dativ','verbs','grammar-basic','daily',
  'vocab-urban','vocab-culture','vocab-leisure','vocab-extra','vocab-basic','vocab-daily',
  'phrases-rating','phrases-city','phrases-favorite','phrases-opinions','phrases-basic','phrases-daily',
  'phrase-l14-ask','phrase-l14-describe','phrase-l14-unknown','phrase-l14-thanks',
  'phrase-l14-basic','phrase-l14-daily','phrase-l14-mixed'
));

insert into public.phrase_practice_questions(id,version,definition)
select value->>'id',(value->>'version')::integer,value
from jsonb_array_elements($l14_phrase_questions$[
  {"id":"ask-help","version":1,"itemId":"ask-help","requiredItemIds":["ask-help"],"topicId":"L14-phrases-ask","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Entschuldigung. Können Sie mir helfen?"],"options":["Entschuldigung. Können Sie mir helfen?","Tut mir leid. Ich bin nicht von hier.","Herzlichen Dank."]},
  {"id":"ask-place","version":1,"itemId":"ask-place","requiredItemIds":["ask-place"],"topicId":"L14-phrases-ask","subskill":"phrase_context","kind":"choice","acceptedAnswers":["Wo ist denn hier eine Bank?"],"options":["Wo ist denn hier eine Bank?","Da sehen Sie eine Bank.","Das ist gar nicht weit."]},
  {"id":"ask-far","version":1,"itemId":"ask-far","requiredItemIds":["ask-far"],"topicId":"L14-phrases-ask","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Ist das sehr weit?"],"options":["Ist das sehr weit?","Wie komme ich hierher?","Das weiß ich leider nicht."]},
  {"id":"ask-search","version":1,"itemId":"ask-search","requiredItemIds":["ask-search"],"topicId":"L14-phrases-ask","subskill":"phrase_context","kind":"choice","acceptedAnswers":["Eine Frage bitte: Ich suche die Post."],"options":["Eine Frage bitte: Ich suche die Post.","Da sehen Sie die Post.","Ich bin fremd hier."]},
  {"id":"ask-walk","version":1,"itemId":"ask-walk","requiredItemIds":["ask-walk"],"topicId":"L14-phrases-ask","subskill":"phrase_order","kind":"order","acceptedAnswers":["Kann ich zu Fuß zum Café gehen?"],"tokens":["Kann","ich","zu","Fuß","zum","Café","gehen?"]},
  {"id":"ask-walk-reply","version":1,"itemId":"ask-walk","requiredItemIds":["ask-walk"],"topicId":"L14-phrases-ask","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Ja, das ist gar nicht weit."],"options":["Ja, das ist gar nicht weit.","Das weiß ich leider nicht.","Herzlichen Dank."]},
  {"id":"describe-straight","version":1,"itemId":"describe-straight","requiredItemIds":["describe-straight"],"topicId":"L14-phrases-describe","subskill":"phrase_context","kind":"choice","acceptedAnswers":["Sie gehen hier geradeaus."],"options":["Sie gehen hier geradeaus.","Ist das sehr weit?","Ich bin fremd hier."]},
  {"id":"describe-see","version":1,"itemId":"describe-see","requiredItemIds":["describe-see"],"topicId":"L14-phrases-describe","subskill":"phrase_context","kind":"choice","acceptedAnswers":["Da sehen Sie eine Apotheke."],"options":["Da sehen Sie eine Apotheke.","Wo ist denn hier eine Apotheke?","Das weiß ich leider nicht."]},
  {"id":"describe-turn","version":1,"itemId":"describe-turn","requiredItemIds":["describe-turn"],"topicId":"L14-phrases-describe","subskill":"phrase_order","kind":"order","acceptedAnswers":["Vor der Bank biegen Sie nach rechts ab."],"tokens":["Vor","der","Bank","biegen","Sie","nach","rechts","ab."]},
  {"id":"describe-distance","version":1,"itemId":"describe-distance","requiredItemIds":["describe-distance"],"topicId":"L14-phrases-describe","subskill":"phrase_context","kind":"choice","acceptedAnswers":["Das ist gar nicht weit."],"options":["Das ist gar nicht weit.","Das ist sehr weit.","Ich suche den Bahnhof."]},
  {"id":"describe-street","version":1,"itemId":"describe-street","requiredItemIds":["describe-street"],"topicId":"L14-phrases-describe","subskill":"phrase_order","kind":"order","acceptedAnswers":["Sie gehen die zweite Straße nach links."],"tokens":["Sie","gehen","die","zweite","Straße","nach","links."]},
  {"id":"describe-direction","version":1,"itemId":"describe-direction","requiredItemIds":["describe-direction"],"topicId":"L14-phrases-describe","subskill":"phrase_context","kind":"choice","acceptedAnswers":["… nach rechts."],"options":["… nach rechts.","… nach links.","… geradeaus."]},
  {"id":"match-describe-see","version":1,"itemId":"describe-see","requiredItemIds":["describe-see"],"topicId":"L14-phrases-describe","subskill":"phrase_match","kind":"choice","acceptedAnswers":["Da sehen Sie eine Apotheke."],"options":["Da sehen Sie eine Apotheke.","Das ist gar nicht weit."],"interaction":"match","matchGroupId":"describe-place-distance-match"},
  {"id":"match-describe-distance","version":1,"itemId":"describe-distance","requiredItemIds":["describe-distance"],"topicId":"L14-phrases-describe","subskill":"phrase_match","kind":"choice","acceptedAnswers":["Das ist gar nicht weit."],"options":["Da sehen Sie eine Apotheke.","Das ist gar nicht weit."],"interaction":"match","matchGroupId":"describe-place-distance-match"},
  {"id":"unknown-local","version":1,"itemId":"unknown-local","requiredItemIds":["unknown-local"],"topicId":"L14-phrases-unknown","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Tut mir leid. Ich bin nicht von hier."],"options":["Tut mir leid. Ich bin nicht von hier.","Da sehen Sie den Bahnhof.","Herzlichen Dank."]},
  {"id":"unknown-answer","version":1,"itemId":"unknown-answer","requiredItemIds":["unknown-answer"],"topicId":"L14-phrases-unknown","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Das weiß ich leider nicht."],"options":["Das weiß ich leider nicht.","Das ist gar nicht weit.","Kann ich zu Fuß gehen?"]},
  {"id":"unknown-new","version":1,"itemId":"unknown-new","requiredItemIds":["unknown-new"],"topicId":"L14-phrases-unknown","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Ich bin fremd hier."],"options":["Ich bin fremd hier.","Ich suche die Post.","Sie gehen hier geradeaus."]},
  {"id":"thanks-heart","version":1,"itemId":"thanks-heart","requiredItemIds":["thanks-heart"],"topicId":"L14-phrases-thanks","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Herzlichen Dank."],"options":["Herzlichen Dank.","Ist das sehr weit?","Ich bin nicht von hier."]},
  {"id":"thanks-kind","version":1,"itemId":"thanks-kind","requiredItemIds":["thanks-kind"],"topicId":"L14-phrases-thanks","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Sehr nett. Vielen Dank."],"options":["Sehr nett. Vielen Dank.","Das weiß ich leider nicht.","Wo ist denn hier ein Café?"]},
  {"id":"thanks-oh","version":1,"itemId":"thanks-oh","requiredItemIds":["thanks-oh"],"topicId":"L14-phrases-thanks","subskill":"phrase_dialogue","kind":"choice","acceptedAnswers":["Oh, danke schön."],"options":["Oh, danke schön.","Vor der Bank biegen Sie ab.","Kann ich zu Fuß gehen?"]}
]$l14_phrase_questions$::jsonb) on conflict(id,version) do nothing;

create or replace function public.validate_l14_phrase_practice_session() returns trigger
language plpgsql security definer set search_path='' as $$
declare entry jsonb; q jsonb; expected jsonb; attempt jsonb; learning jsonb; response text; correct_answer boolean; validated jsonb:='[]'::jsonb; required_id text; qid text;
begin
  if new.bank_key not like 'phrase-l14-%' then return new; end if;
  if jsonb_typeof(new.state->'position') is distinct from 'number'
     or jsonb_typeof(new.state->'createdAt') is distinct from 'string'
     or jsonb_typeof(new.state->'completed') is distinct from 'boolean'
     or new.session_id is distinct from new.state->>'id'
     or jsonb_typeof(new.state->'items') is distinct from 'array'
     or jsonb_array_length(new.state->'items') not between 1 and 100
     or (new.state->>'position')::integer not between 0 and jsonb_array_length(new.state->'items')-1
     or octet_length(new.state::text)>500000 then raise exception 'Invalid L14 phrase session'; end if;
  perform (new.state->>'createdAt')::timestamptz;
  select state into learning from public.learner_lesson_states where user_id=new.user_id and lesson_key='deutsch-trainer-phrase-learning-v1-L14';
  for entry in select value from jsonb_array_elements(new.state->'items') loop
    q:=entry->'question'; qid:=q->>'id';
    select definition into expected from public.phrase_practice_questions where id=qid and version=(q->>'version')::integer;
    if expected is null or q->>'itemId' is distinct from expected->>'itemId'
      or q->'requiredItemIds' is distinct from expected->'requiredItemIds'
      or q->'acceptedAnswers' is distinct from expected->'acceptedAnswers'
      or q->>'topicId' is distinct from expected->>'topicId'
      or q->>'subskill' is distinct from expected->>'subskill'
      or q->>'kind' is distinct from expected->>'kind'
      or q->'options' is distinct from expected->'options'
      or q->'tokens' is distinct from expected->'tokens'
      or q->>'interaction' is distinct from expected->>'interaction'
      or q->>'matchGroupId' is distinct from expected->>'matchGroupId' then raise exception 'Unknown or changed L14 phrase question'; end if;
    if q->>'topicId' is distinct from 'L14-phrases-'||substr(new.bank_key,length('phrase-l14-')+1) and new.bank_key not in ('phrase-l14-basic','phrase-l14-daily','phrase-l14-mixed') then raise exception 'L14 phrase topic changed'; end if;
    for required_id in select value from jsonb_array_elements_text(expected->'requiredItemIds') loop
      if learning->'results'->>required_id is distinct from 'correct' then raise exception 'L14 phrase has not been learned'; end if;
    end loop;
    if jsonb_typeof(entry->'response') is distinct from 'string' or jsonb_typeof(entry->'selected') is distinct from 'array' or jsonb_typeof(entry->'tokenOrder') is distinct from 'array' then raise exception 'Invalid L14 phrase draft'; end if;
    attempt:=entry->'attempt';
    if attempt is not null and attempt<>'null'::jsonb then
      if jsonb_typeof(attempt)<>'object' or jsonb_typeof(attempt->'response') is distinct from 'string' or coalesce(attempt->>'submittedAt','')='' then raise exception 'Invalid L14 phrase answer'; end if;
      perform (attempt->>'submittedAt')::timestamptz;
      response:=btrim(regexp_replace(regexp_replace(normalize(btrim(attempt->>'response'),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''));
      select exists(select 1 from jsonb_array_elements_text(expected->'acceptedAnswers') answer where btrim(regexp_replace(regexp_replace(normalize(btrim(answer),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''))=response) into correct_answer;
      attempt:=attempt||jsonb_build_object('correct',correct_answer,'status','completed');
      entry:=entry||jsonb_build_object('attempt',attempt);
    end if;
    validated:=validated||jsonb_build_array(entry);
  end loop;
  if (select count(distinct value->'question'->>'id') from jsonb_array_elements(validated))<>jsonb_array_length(validated) then raise exception 'Duplicate L14 phrase questions'; end if;
  if exists(select 1 from jsonb_array_elements(validated) with ordinality i(item,idx) where idx-1<(new.state->>'position')::integer and (item->'attempt' is null or item->'attempt'='null'::jsonb or item->'attempt'->>'status'<>'completed')) then raise exception 'Earlier L14 phrase answers are incomplete'; end if;
  if (new.state->>'completed')::boolean and exists(select 1 from jsonb_array_elements(validated) i where i->'attempt' is null or i->'attempt'='null'::jsonb or i->'attempt'->>'status'<>'completed') then raise exception 'L14 phrase round is not complete'; end if;
  new.state:=jsonb_set(new.state,'{items}',validated);
  return new;
end $$;
revoke all on function public.validate_l14_phrase_practice_session() from public;
drop trigger if exists validate_l14_phrase_practice_session on public.learner_practice_sessions;
create trigger validate_l14_phrase_practice_session before insert or update on public.learner_practice_sessions for each row execute function public.validate_l14_phrase_practice_session();

commit;
