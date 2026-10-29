import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const definitions = new Map();

function add(question, lesson, historical = false) {
  const { id, version, targetId, topicId, subskill, kind, acceptedAnswers, options, tokens } = question;
  if (typeof id !== 'string' || !Number.isInteger(version) || !topicId?.startsWith(`${lesson}-`) || !subskill || !['choice', 'cloze', 'order'].includes(kind) || !Array.isArray(acceptedAnswers) || !acceptedAnswers.length) throw new Error(`Invalid grammar definition ${id}`);
  if (!historical && !targetId?.startsWith(`${lesson}-G`)) throw new Error(`Missing target for ${id}`);
  const definition = { id, version, lessonId: lesson, ...(historical ? {} : { targetId }), topicId, subskill, kind, acceptedAnswers, ...(options ? { options } : {}), ...(tokens ? { tokens } : {}) };
  const key = `${id}:${version}`;
  const prior = definitions.get(key);
  if (prior && JSON.stringify(prior) !== JSON.stringify(definition)) throw new Error(`Conflicting definition ${key}`);
  definitions.set(key, definition);
}

for (const slug of ['es-gibt', 'dative', 'verbs', 'grammar-basic', 'daily']) {
  const { html } = await read(`src/data/l13-${slug}-preview.json`);
  const match = html.match(/<script id="bank" type="application\/json">([\s\S]*?)<\/script>/u);
  if (!match) throw new Error(`Missing L13 bank ${slug}`);
  for (const question of JSON.parse(match[1]).questions) add(question, 'L13');
}
const legacyVerbs = (await read('docs/exercise-mapping/l13-verbs-bank.json')).questions;
for (const question of legacyVerbs.filter(item => ['A13-L13-VRB-005', 'A13-L13-VRB-009', 'A13-L13-VRB-012'].includes(item.id))) add(question, 'L13', true);
const l14 = await read('docs/exercise-mapping/l14-grammar-bank.json');
for (const question of l14.questions) add(question, 'L14');
for (const question of l14.historicalQuestions ?? []) add(question, 'L14', true);
const catalog = [...definitions.values()];
if (catalog.filter(q => q.lessonId === 'L13').length !== 103 || catalog.filter(q => q.lessonId === 'L14').length !== 102) throw new Error(`Unexpected grammar catalog size ${catalog.length}`);

const sql = `begin;
alter table public.learner_practice_sessions drop constraint if exists learner_practice_sessions_bank_key_check;
alter table public.learner_practice_sessions add constraint learner_practice_sessions_bank_key_check check (bank_key in (
  'es-gibt','dativ','verbs','grammar-basic','daily',
  'vocab-urban','vocab-culture','vocab-leisure','vocab-extra','vocab-basic','vocab-daily',
  'phrases-rating','phrases-city','phrases-favorite','phrases-opinions','phrases-basic','phrases-daily',
  'phrase-l14-ask','phrase-l14-describe','phrase-l14-unknown','phrase-l14-thanks','phrase-l14-basic','phrase-l14-daily','phrase-l14-mixed',
  'l14-grammar','l14-grammar-daily','l14-lokale-praepositionen','l14-wo-dativ'
));
create table if not exists public.grammar_practice_questions (
  id text not null, version integer not null, definition jsonb not null,
  primary key (id, version)
);
alter table public.grammar_practice_questions enable row level security;
revoke all on public.grammar_practice_questions from anon, authenticated;
insert into public.grammar_practice_questions (id, version, definition)
select value->>'id', (value->>'version')::integer, value
from jsonb_array_elements($grammar_catalog$${JSON.stringify(catalog)}$grammar_catalog$::jsonb)
on conflict (id, version) do update set definition=excluded.definition;

create or replace function public.validate_grammar_practice_session() returns trigger
language plpgsql security definer set search_path='' as $$
declare entry jsonb; q jsonb; expected jsonb; attempt jsonb; validated jsonb:='[]'::jsonb; answer text; is_correct boolean; required_id text; lesson text;
begin
  if new.bank_key not in ('es-gibt','dativ','verbs','grammar-basic','daily','l14-grammar','l14-grammar-daily','l14-lokale-praepositionen','l14-wo-dativ') then return new; end if;
  lesson:=case when new.bank_key like 'l14-%' then 'L14' else 'L13' end;
  if new.session_id is distinct from new.state->>'id'
    or jsonb_typeof(new.state->'items') is distinct from 'array'
    or jsonb_array_length(new.state->'items') not between 1 and 100
    or jsonb_typeof(new.state->'completed') is distinct from 'boolean'
    or jsonb_typeof(new.state->'position') is distinct from 'number'
    or (new.state->>'position')::integer not between 0 and jsonb_array_length(new.state->'items')-1
    or coalesce(new.state->>'createdAt','')='' then raise exception 'Invalid grammar session'; end if;
  perform (new.state->>'createdAt')::timestamptz;
  for entry in select value from jsonb_array_elements(new.state->'items') loop
    q:=entry->'question';
    select definition into expected from public.grammar_practice_questions where id=q->>'id' and version=(q->>'version')::integer;
    if expected is null or expected->>'lessonId' is distinct from lesson
      or q->>'topicId' is distinct from expected->>'topicId'
      or q->>'kind' is distinct from expected->>'kind'
      or q->>'subskill' is distinct from expected->>'subskill'
      or q->'acceptedAnswers' is distinct from expected->'acceptedAnswers'
      or q->'tokens' is distinct from expected->'tokens'
      or (expected->'options' is not null and (jsonb_typeof(q->'options') is distinct from 'array' or ((q->'options') @> (expected->'options')) is not true or ((expected->'options') @> (q->'options')) is not true or jsonb_array_length(q->'options')<>jsonb_array_length(expected->'options')))
      then raise exception 'Unknown or changed grammar question'; end if;
    if new.bank_key in ('es-gibt','dativ','verbs','l14-lokale-praepositionen','l14-wo-dativ') and q->>'topicId' is distinct from
      (case new.bank_key when 'es-gibt' then 'L13-es-gibt-akkusativ' when 'dativ' then 'L13-dativ-pronomen' when 'verbs' then 'L13-verben-mit-dativ' when 'l14-lokale-praepositionen' then 'L14-lokale-praepositionen' else 'L14-wo-dativ' end)
      then raise exception 'Grammar topic changed'; end if;
    required_id:=expected->>'targetId';
    if required_id is not null then
      if q->>'targetId' is not null and q->>'targetId' is distinct from required_id then raise exception 'Grammar target changed'; end if;
      if not exists(select 1 from public.item_exposures where user_id=new.user_id and item_id=required_id) then raise exception 'Grammar target has not been learned'; end if;
      q:=q||jsonb_build_object('targetId',required_id);
      entry:=jsonb_set(entry,'{question}',q);
    end if;
    if jsonb_typeof(entry->'response') is distinct from 'string' or jsonb_typeof(entry->'selected') is distinct from 'array' or jsonb_typeof(entry->'tokenOrder') is distinct from 'array' then raise exception 'Invalid grammar draft'; end if;
    attempt:=entry->'attempt';
    if attempt is not null and attempt<>'null'::jsonb then
      if jsonb_typeof(attempt) is distinct from 'object' or jsonb_typeof(attempt->'response') is distinct from 'string' or coalesce(attempt->>'submittedAt','')='' then raise exception 'Invalid grammar answer'; end if;
      perform (attempt->>'submittedAt')::timestamptz;
      answer:=btrim(regexp_replace(regexp_replace(normalize(btrim(attempt->>'response'),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''));
      select exists(select 1 from jsonb_array_elements_text(expected->'acceptedAnswers') value where btrim(regexp_replace(regexp_replace(normalize(btrim(value),NFC),'[[:space:]]+',' ','g'),'[.!?]+$',''))=answer) into is_correct;
      attempt:=attempt||jsonb_build_object('correct',is_correct,'status','completed');
      entry:=entry||jsonb_build_object('attempt',attempt);
    end if;
    validated:=validated||jsonb_build_array(entry);
  end loop;
  if (select count(distinct value->'question'->>'id') from jsonb_array_elements(validated))<>jsonb_array_length(validated) then raise exception 'Duplicate grammar questions'; end if;
  if exists(select 1 from jsonb_array_elements(validated) with ordinality item(value,ordinal) where ordinal-1<(new.state->>'position')::integer and (value->'attempt' is null or value->'attempt'='null'::jsonb)) then raise exception 'Earlier grammar answers are incomplete'; end if;
  if (new.state->>'completed')::boolean and exists(select 1 from jsonb_array_elements(validated) item where item->'attempt' is null or item->'attempt'='null'::jsonb) then raise exception 'Grammar round is not complete'; end if;
  new.state:=jsonb_set(new.state,'{items}',validated);
  return new;
end $$;
revoke all on function public.validate_grammar_practice_session() from public;
drop trigger if exists validate_grammar_practice_session on public.learner_practice_sessions;
create trigger validate_grammar_practice_session before insert or update on public.learner_practice_sessions for each row execute function public.validate_grammar_practice_session();
commit;
`;
await writeFile(new URL('supabase/migrations/20261029000000_grammar_practice_validation.sql', root), sql);
console.log(`Built trusted grammar catalog with ${catalog.length} definitions`);
