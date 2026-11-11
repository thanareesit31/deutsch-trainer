import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=process.env.PRACTICE_SOURCE_ROOT??fileURLToPath(new URL('../',import.meta.url));
const {createDatabase,userId}=await import(pathToFileURL(root+'/tests/learning-database.mjs'));
const db=await createDatabase();
const migration=await readFile(new URL('../supabase/migrations/20261111000000_phrase_practice_progression.sql',import.meta.url),'utf8');
let tick=0;
const make=(question,id,{correct=true,help=false,complete=true,known=true}={})=>{const time=new Date(Date.UTC(2026,10,11,0,0,++tick)).toISOString();return{id,createdAt:time,updatedAt:time,position:0,completed:complete,items:[{question,response:complete?(correct?'sein':'wrong'):'draft',selected:[],tokenOrder:[],...(known?{hintUsed:help,translationUsed:false,wordHelpTokens:[]}:{}),attempt:complete?{response:correct?'sein':'wrong',correct,status:'completed',submittedAt:time,confidence:null,...(known?{hintUsed:help,translationUsed:false,wordHelpTokens:[],assisted:help}:{})}:null}]};};
let isolationQuestion;
const sync=(bank,state)=>db.query('select public.sync_practice_session($1,$2::jsonb)',[bank,JSON.stringify(state)]);
try{
 await db.exec('reset role');await db.exec(migration);await db.exec(migration);
 const sources=[
  {lesson:'L02',bank:'a11-phrases-l02-daily',other:'a11-phrases-l02-basic',registry:'a11_phrase_practice_questions',target:'L02-status-praktikum',topic:'L02-phrases-core'},
  {lesson:'L13',bank:'phrases-daily',other:'phrases-basic',registry:'phrase_practice_questions',target:'L13-R001',topic:'L13-phrases-rating'},
  {lesson:'L14',bank:'phrase-l14-daily',other:'phrase-l14-basic',registry:'phrase_practice_questions',target:'ask-place',topic:'L14-phrases-ask'}
 ];
 for(const source of sources){
  const questions={};
  for(const [suffix,context,stage] of [['base1','one',0],['base1repeat','one',0],['base2','two',0],['transfer','three',1],['writing','four',2]]){
   const id=`test-${source.lesson}-${suffix}`;const subskill=stage===2?'test_production':'test_comprehension';
   const question={id,version:1,itemId:source.target,targetId:source.target,requiredItemIds:[source.target],lessonId:source.lesson,topicId:source.topic,kind:'cloze',subskill,acceptedAnswers:['sein']};questions[suffix]=question;
   await db.query(`insert into public.${source.registry}(id,version,definition) values($1,1,$2)`,[id,question]);
   await db.query('insert into public.phrase_practice_progression values($1,1,$2,$3,$4,$5,$6,$7)',[id,source.lesson,source.target,subskill,context,stage,stage?{subskill:'test_comprehension',requiresAttempt:true,minCorrectContexts:stage>=2?2:0,minPracticeSessions:stage>=2?2:0}:null]);
  }
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${userId}'`);
  await assert.rejects(sync(source.bank,make(questions.writing,`${source.lesson}-unlearned`)),/not been learned|earlier response/);
  if(source.lesson==='L14')await db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3)',[userId,'deutsch-trainer-phrase-learning-v1-L14',{results:{[source.target]:'correct'}}]);
  else await db.query("select public.learning_action('expose',$1::jsonb)",[JSON.stringify({itemId:source.target})]);
  await assert.rejects(sync(source.bank,make(questions.transfer,`${source.lesson}-view-only`)),/earlier response/);
  const one=make(questions.base1,`${source.lesson}-one-session`);one.items.push(make(questions.base2,'unused').items[0]);await sync(source.bank,one);
  await assert.rejects(sync(source.bank,make(questions.writing,`${source.lesson}-one-session-denied`)),/independent/);
  await sync(source.other,make(questions.base1,`${source.lesson}-wrong-one`,{correct:false}));
  await sync(source.bank,make(questions.base2,`${source.lesson}-wrong-two`,{correct:false}));
  await sync(source.bank,make(questions.transfer,`${source.lesson}-real-trial`,{correct:false}));
  await sync(source.bank,make(questions.base1,`${source.lesson}-one-correct`));
  await sync(source.other,make(questions.base1repeat,`${source.lesson}-same-context`));
  await assert.rejects(sync(source.bank,make(questions.writing,`${source.lesson}-same-context-denied`)),/independent/);
  await sync(source.bank,make(questions.base2,`${source.lesson}-unknown-help`,{known:false}));
  await assert.rejects(sync(source.bank,make(questions.writing,`${source.lesson}-unknown-denied`)),/independent/);
  await sync(source.bank,make(questions.base2,`${source.lesson}-helped`,{help:true}));
  await assert.rejects(sync(source.bank,make(questions.writing,`${source.lesson}-help-denied`)),/independent/);
  await sync(source.other,make(questions.base2,`${source.lesson}-two-correct`));
  isolationQuestion=questions.writing;
  const unlocked=make(questions.writing,`${source.lesson}-unlocked`,{complete:false});await sync(source.bank,unlocked);
  await sync(source.bank,make(questions.base2,`${source.lesson}-later-wrong`,{correct:false}));
  await assert.rejects(sync(source.bank,make(questions.writing,`${source.lesson}-new-queue-denied`)),/independent/);
  const completed=structuredClone(unlocked);completed.items[0].response='sein';completed.items[0].attempt=make(questions.writing,'unused').items[0].attempt;completed.completed=true;completed.updatedAt=new Date().toISOString();await sync(source.bank,completed);
  const delayed=structuredClone(unlocked);delayed.items[0].wordHelpTokens=['sein'];await sync(source.bank,delayed);
  const stored=(await db.query('select state from public.learner_practice_sessions where bank_key=$1 and session_id=$2',[source.bank,unlocked.id])).rows[0].state;
  assert.equal(stored.items[0].attempt.response,'sein','first response stays');assert.equal(stored.items[0].attempt.assisted,true,'delayed word help remains');assert.deepEqual(stored.items[0].wordHelpTokens,['sein']);
  const changed=structuredClone(completed);changed.id=`${source.lesson}-forged`;changed.items[0].question.acceptedAnswers=['forged'];await assert.rejects(sync(source.bank,changed),/changed|independent/);
  await db.exec('reset role');
 }
 await db.exec(`set role authenticated;set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'`);
 assert.equal((await db.query('select * from public.learner_practice_sessions')).rows.length,0,'RLS isolates practice');
 await db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3)',['22222222-2222-4222-8222-222222222222','deutsch-trainer-phrase-learning-v1-L14',{results:{'ask-place':'correct'}}]);
 await assert.rejects(sync('phrase-l14-daily',make(isolationQuestion,'isolated-stage')),/earlier response/);
 await assert.rejects(db.query("insert into public.phrase_practice_progression values('forged',1,'L01','target','skill','context',0,null)"),/permission denied/);
 console.log('Phrase progression real DB passed for L02/L13/L14: canonical grading, learned boundary, contexts/sessions, help/unknown exclusion, latest recovery, saved queues, delayed help and isolation.');
}finally{await db.close();}
