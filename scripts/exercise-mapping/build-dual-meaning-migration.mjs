import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../../',import.meta.url);
const a11=JSON.parse(await readFile(new URL('docs/exercise-mapping/a11-vocabulary-bank.json',root),'utf8')).definitions.filter(q=>q.interaction==='picture-choice');
const l13=JSON.parse(await readFile(new URL('docs/exercise-mapping/l13-vocabulary-bank.json',root),'utf8')).questions.filter(q=>q.interaction==='picture-choice').map(({id,version,itemId,topicId,subskill,kind,acceptedAnswers,options,interaction,imageCue})=>({id,version,itemId,topicId,subskill,kind,acceptedAnswers,options,interaction,imageCue}));
const insert=(table,rows)=>`insert into public.${table}(id,version,definition) select value->>'id',(value->>'version')::integer,value from jsonb_array_elements($dual_meaning$${JSON.stringify(rows)}$dual_meaning$::jsonb) on conflict(id,version) do nothing;`;
const sql=`-- New question IDs only. Historical definitions and answers remain valid.
begin;
${insert('a11_vocabulary_practice_questions',a11)}
${insert('vocabulary_practice_questions',l13)}
create or replace function public.validate_vocabulary_picture_cue() returns trigger
language plpgsql security definer set search_path='' as $$
declare entry jsonb; q jsonb; expected jsonb;
begin
 if new.bank_key not like 'a11-vocab-%' and new.bank_key not like 'vocab-%' then return new; end if;
 for entry in select value from jsonb_array_elements(new.state->'items') loop
  q:=entry->'question';
  if new.bank_key like 'a11-vocab-%' then
   select definition into expected from public.a11_vocabulary_practice_questions where id=q->>'id' and version=(q->>'version')::integer;
  else
   select definition into expected from public.vocabulary_practice_questions where id=q->>'id' and version=(q->>'version')::integer;
  end if;
  if q->>'interaction'='picture-choice' and expected->>'interaction' is distinct from 'picture-choice' then raise exception 'Unknown picture question'; end if;
  if expected->>'interaction'='picture-choice' then
   if q->'imageCue' is distinct from expected->'imageCue' or q->'interaction' is distinct from expected->'interaction'
    or jsonb_typeof(q->'options') is distinct from 'array'
    or ((q->'options') @> (expected->'options')) is not true or ((expected->'options') @> (q->'options')) is not true
    or jsonb_array_length(q->'options')<>jsonb_array_length(expected->'options') then raise exception 'Unknown or changed picture cue or options'; end if;
  end if;
 end loop;
 return new;
end $$;
revoke all on function public.validate_vocabulary_picture_cue() from public;
drop trigger if exists validate_vocabulary_picture_cue on public.learner_practice_sessions;
create trigger validate_vocabulary_picture_cue before insert or update on public.learner_practice_sessions for each row execute function public.validate_vocabulary_picture_cue();
commit;
`;
await writeFile(new URL('supabase/migrations/20261101000000_dual_vocabulary_meaning.sql',root),sql);
console.log('Added picture choice definitions:',a11.length,'A1.1/A1.2;',l13.length,'L13');
