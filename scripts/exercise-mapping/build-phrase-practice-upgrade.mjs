import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path,root),'utf8'));
const a11 = await read('docs/exercise-mapping/a11-phrase-bank.json');
const l13 = await read('docs/exercise-mapping/l13-phrases-bank.json');
const packets = await read('docs/exercise-mapping/l01-l13-practice-extensions.json');
const audio = (await read('src/data/phrase-practice-upgrade-audio.json')).assets;
const l14 = await read('docs/exercise-mapping/l14-practice-progression-catalog.json');
const core = [...a11.definitions, ...l13.questions, ...l13.legacyQuestions].map(q => ({...q, lessonId:q.lessonId ?? 'L13'}));
const metadata = new Map();
function remember(q,lessonId,practice) {
 const id=q.id??q.taskId,version=q.version??1,targetId=q.targetId??q.itemId;
 assert(id&&targetId&&q.subskill,`Missing binding ${id}`);
 metadata.set(`${id}:${version}`,{taskId:id,version,lessonId,targetId,subskill:q.subskill,practice:practice??{contextId:`core:${lessonId}:${targetId}`,familyId:targetId,stage:0,unlock:null}});
}
for(const q of core)remember(q,q.lessonId);
const extras=[];
for(const packet of packets) {
 const taught = new Set(packet.lessonId==='L13'?l13.groups.flatMap(g=>g.ids):a11.lessons.find(l=>l.lessonId===packet.lessonId).targets.map(t=>t.id));
 for(const q of packet.questions) {
  assert(taught.has(q.targetId)&&q.requiredItemIds.every(id=>taught.has(id)),`Untaught ${q.id}`);
  assert(!metadata.has(`${q.id}:${q.version}`),`Published ID reused ${q.id}`);
  assert(q.practice.stage===1?q.kind==='choice':q.kind==='cloze',`Stage/format ${q.id}`);
  assert(q.practice.stage<2||q.answerScope==='sentence',`Writing scope ${q.id}`);
  assert(q.difficultyRationale&&q.assistance&&q.explanation&&q.dialoguePrompt?.text,`Missing instructional metadata ${q.id}`);
  assert(q.acceptedAnswers.length&&q.acceptedAnswers[0].length<=54,`Answer length ${q.id}`);
  assert.equal(q.answerParts.map(part=>part.text).join(' '),q.acceptedAnswers[0],`Annotation ${q.id}`);
  for(const error of q.feedbackErrors??[])assert(!q.acceptedAnswers.includes(error.response),`Accepted distractor ${q.id}`);
  if(q.options)assert(q.options.includes(q.acceptedAnswers[0])&&new Set(q.options).size===q.options.length,`Choice ${q.id}`);
  assert(audio[q.id+'-A']?.status==='ready'&&audio[q.id+'-A'].text===q.dialoguePrompt.text&&audio[q.id+'-B']?.status==='ready'&&audio[q.id+'-B'].text===q.acceptedAnswers[0],`Audio ${q.id}`);
  remember(q,packet.lessonId,q.practice);extras.push({...q,lessonId:packet.lessonId});
 }
}
for(const row of l14.metadata)remember({id:row.taskId,version:row.version,targetId:row.targetId,subskill:row.subskill},'L14',row.practice.stage?row.practice:undefined);
for(const row of metadata.values())if(row.practice.unlock){
 const dependencies=[...metadata.values()].filter(other=>other.lessonId===row.lessonId&&other.targetId===row.targetId&&other.subskill===row.practice.unlock.subskill&&other.practice.stage<row.practice.stage);
 assert(dependencies.length,`Unreachable ${row.taskId}`);
 assert(new Set(dependencies.map(q=>q.practice.contextId)).size>=row.practice.unlock.minCorrectContexts,`Insufficient contexts ${row.taskId}`);
}
const project = q => ({id:q.id,version:q.version,lessonId:q.lessonId,targetId:q.targetId,topicId:q.topicId,kind:q.kind,subskill:q.subskill,acceptedAnswers:q.acceptedAnswers,...(q.options?{options:q.options}:{}),...(q.tokens?{tokens:q.tokens}:{})});
const a11New=extras.filter(q=>q.lessonId!=='L13').map(project);
const phraseNew=[...extras.filter(q=>q.lessonId==='L13'),...l14.definitions];
const sql = value => "'"+JSON.stringify(value).replaceAll("'","''")+"'::jsonb";
const rows=(table,definitions)=>`insert into public.${table}(id,version,definition) select value->>'id',(value->>'version')::integer,value from jsonb_array_elements(${sql(definitions)}) on conflict(id,version) do nothing;`;
const values=[...metadata.values()].map(row=>`('${row.taskId.replaceAll("'","''")}',${row.version},'${row.lessonId}','${row.targetId.replaceAll("'","''")}','${row.subskill}','${row.practice.contextId.replaceAll("'","''")}',${row.practice.stage},${row.practice.unlock?sql(row.practice.unlock):'null'})`);
await writeFile(new URL('supabase/migrations/20261111001000_phrase_practice_extension_catalog.sql',root),['-- Generated additive phrase definitions and progression metadata. Published questions remain immutable.','begin;',rows('a11_phrase_practice_questions',a11New),rows('phrase_practice_questions',phraseNew),'insert into public.phrase_practice_progression(task_id,version,lesson_id,target_id,subskill,context_id,stage,unlock) values\n'+values.join(',\n')+'\non conflict(task_id,version) do nothing;',"notify pgrst,'reload schema';",'commit;'].join('\n\n')+'\n');
const stages={};for(const row of metadata.values())stages[row.practice.stage]=(stages[row.practice.stage]??0)+1;
const version={schemaVersion:1,lessons:14,extensionTasks:extras.length+l14.definitions.length,metadataTasks:metadata.size,stages};
await writeFile(new URL('src/data/phrase-practice-upgrade-version.json',root),JSON.stringify(version,null,2)+'\n');
await writeFile(new URL('docs/exercise-mapping/phrase-practice-upgrade-bindings.json',root),JSON.stringify([...metadata.values()],null,2)+'\n');
console.log(JSON.stringify(version));
