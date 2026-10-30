import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../../', import.meta.url);
const inventory = JSON.parse(await readFile(new URL('docs/exercise-mapping/a11-vocabulary-bank.json', root), 'utf8'));
const previous = await readFile(new URL('supabase/migrations/20261029000000_grammar_practice_validation.sql', root), 'utf8');
const allowlist = previous.match(/check \(bank_key in \(([\s\S]*?)\)\);/)?.[1];
assert(allowlist && inventory.definitions.length === 669);
const sql = `begin;
alter table public.learner_practice_sessions drop constraint if exists learner_practice_sessions_bank_key_check;
alter table public.learner_practice_sessions add constraint learner_practice_sessions_bank_key_check check (bank_key in (${allowlist}) or bank_key ~ '^a11-vocab-l(0[1-9]|1[0-2])-(basic|daily)$');
create table if not exists public.a11_vocabulary_practice_questions (
  id text not null, version integer not null, definition jsonb not null,
  primary key(id,version)
);
alter table public.a11_vocabulary_practice_questions enable row level security;
revoke all on public.a11_vocabulary_practice_questions from anon, authenticated;
insert into public.a11_vocabulary_practice_questions(id,version,definition)
select value->>'id',(value->>'version')::integer,value
from jsonb_array_elements($a11_catalog$${JSON.stringify(inventory.definitions)}$a11_catalog$::jsonb)
on conflict(id,version) do update set definition=excluded.definition;

create or replace function public.validate_a11_vocabulary_practice_session() returns trigger
language plpgsql security definer set search_path='' as $$
declare entry jsonb; q jsonb; expected jsonb; attempt jsonb; validated jsonb:='[]'::jsonb;
  answer text; is_correct boolean; lesson text; required_id text; learned_state jsonb;
begin
  if new.bank_key !~ '^a11-vocab-l(0[1-9]|1[0-2])-(basic|daily)$' then return new; end if;
  lesson:=upper(split_part(new.bank_key,'-',3));
  if new.session_id is distinct from new.state->>'id'
    or jsonb_typeof(new.state->'items') is distinct from 'array'
    or jsonb_array_length(new.state->'items') not between 1 and 100
    or jsonb_typeof(new.state->'completed') is distinct from 'boolean'
    or jsonb_typeof(new.state->'position') is distinct from 'number'
    or (new.state->>'position')::integer not between 0 and jsonb_array_length(new.state->'items')-1
    or coalesce(new.state->>'createdAt','')='' then raise exception 'Invalid vocabulary session'; end if;
  perform (new.state->>'createdAt')::timestamptz;
  select state into learned_state from public.learner_lesson_states
    where user_id=new.user_id and lesson_key='deutsch-trainer-vocabulary-image-learning-v1-'||lesson;
  learned_state:=case when jsonb_typeof(learned_state)='array' then learned_state
    when jsonb_typeof(learned_state->'imageVocabularyIds')='array' then learned_state->'imageVocabularyIds'
    else '[]'::jsonb end;
  for entry in select value from jsonb_array_elements(new.state->'items') loop
    q:=entry->'question';
    select definition into expected from public.a11_vocabulary_practice_questions
      where id=q->>'id' and version=(q->>'version')::integer;
    if expected is null or expected->>'lessonId' is distinct from lesson
      or q->>'itemId' is distinct from expected->>'itemId'
      or q->>'topicId' is distinct from expected->>'topicId'
      or q->>'subskill' is distinct from expected->>'subskill'
      or q->>'kind' is distinct from expected->>'kind'
      or q->'acceptedAnswers' is distinct from expected->'acceptedAnswers'
      or (expected->'options' is not null and (jsonb_typeof(q->'options') is distinct from 'array'
        or ((q->'options') @> (expected->'options')) is not true
        or ((expected->'options') @> (q->'options')) is not true
        or jsonb_array_length(q->'options')<>jsonb_array_length(expected->'options')))
      then raise exception 'Unknown or changed vocabulary question'; end if;
    required_id:=expected->>'itemId';
    if not (learned_state ? required_id)
      and not exists(select 1 from public.item_exposures where user_id=new.user_id and item_id=required_id)
      then raise exception 'Vocabulary target has not been learned'; end if;
    if jsonb_typeof(entry->'response') is distinct from 'string'
      or jsonb_typeof(entry->'selected') is distinct from 'array'
      or jsonb_typeof(entry->'tokenOrder') is distinct from 'array' then raise exception 'Invalid vocabulary draft'; end if;
    attempt:=entry->'attempt';
    if attempt is not null and attempt<>'null'::jsonb then
      if jsonb_typeof(attempt) is distinct from 'object'
        or jsonb_typeof(attempt->'response') is distinct from 'string'
        or coalesce(attempt->>'submittedAt','')='' then raise exception 'Invalid vocabulary answer'; end if;
      perform (attempt->>'submittedAt')::timestamptz;
      answer:=btrim(regexp_replace(regexp_replace(normalize(btrim(attempt->>'response'),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''));
      select exists(select 1 from jsonb_array_elements_text(expected->'acceptedAnswers') value
        where btrim(regexp_replace(regexp_replace(normalize(btrim(value),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''))=answer) into is_correct;
      attempt:=attempt||jsonb_build_object('correct',is_correct,'status','completed');
      entry:=entry||jsonb_build_object('attempt',attempt);
    end if;
    validated:=validated||jsonb_build_array(entry);
  end loop;
  if (select count(distinct value->'question'->>'id') from jsonb_array_elements(validated))<>jsonb_array_length(validated)
    then raise exception 'Duplicate vocabulary questions'; end if;
  if exists(select 1 from jsonb_array_elements(validated) with ordinality item(value,ordinal)
    where ordinal-1<(new.state->>'position')::integer and (value->'attempt' is null or value->'attempt'='null'::jsonb))
    then raise exception 'Earlier vocabulary answers are incomplete'; end if;
  if (new.state->>'completed')::boolean and exists(select 1 from jsonb_array_elements(validated) item
    where item->'attempt' is null or item->'attempt'='null'::jsonb) then raise exception 'Vocabulary round is not complete'; end if;
  new.state:=jsonb_set(new.state,'{items}',validated);
  return new;
end $$;
revoke all on function public.validate_a11_vocabulary_practice_session() from public;
drop trigger if exists validate_a11_vocabulary_practice_session on public.learner_practice_sessions;
create trigger validate_a11_vocabulary_practice_session before insert or update
  on public.learner_practice_sessions for each row execute function public.validate_a11_vocabulary_practice_session();
commit;
`;
await writeFile(new URL('supabase/migrations/20261030000000_a11_vocabulary_practice.sql', root), sql);
console.log(`Built A1.1/A1.2 vocabulary migration with ${inventory.definitions.length} answer definitions.`);
