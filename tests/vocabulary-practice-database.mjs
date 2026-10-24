import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDatabase,userId} from './learning-database.mjs';
const bank=JSON.parse(readFileSync('docs/exercise-mapping/l13-vocabulary-bank.json','utf8'));
const db=await createDatabase();
const q=bank.questions.find(q=>q.itemId==='L13-V003'&&q.subskill==='vocabulary_spelling');
const state={id:'vocab-db-ready-check',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),position:0,completed:false,items:[{question:q,response:'',selected:[],tokenOrder:[],attempt:null,translationUsed:false}]};
const sync=async s=>db.query('select public.sync_practice_session($1,$2::jsonb)',['vocab-basic',JSON.stringify(s)]);
try{
 await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[userId]);
 await assert.rejects(sync(state),/has not been learned/);
 await db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3::jsonb)',[userId,'deutsch-trainer-vocabulary-image-learning-v1-L13',JSON.stringify([q.itemId])]);
 const invalid=structuredClone(state);delete invalid.position;await assert.rejects(sync(invalid),/Invalid vocabulary history/);
 await sync(state);await sync(state);
 assert.equal((await db.query('select * from public.learner_practice_sessions')).rows.length,1);
 const forged=structuredClone(state);forged.items[0].question.acceptedAnswers=['wrong'];await assert.rejects(sync(forged),/changed vocabulary question/);
 const attempted=structuredClone(state);attempted.items[0].attempt={response:'wrong',correct:true,confidence:'easy',submittedAt:new Date().toISOString(),status:'completed'};await sync(attempted);
 assert.equal((await db.query('select state from public.learner_practice_sessions')).rows[0].state.items[0].attempt.correct,false);
 const stale=structuredClone(state);stale.updatedAt=new Date(Date.now()+1000).toISOString();await sync(stale);assert.equal((await db.query('select state from public.learner_practice_sessions')).rows[0].state.items[0].attempt.response,'wrong');
 const pending=structuredClone(state);pending.id='vocab-db-confidence';pending.items[0].attempt={response:'Park',correct:true,confidence:null,submittedAt:new Date().toISOString(),status:'pending'};await sync(pending);
 const completed=structuredClone(pending);completed.updatedAt=new Date(Date.now()+2000).toISOString();completed.completed=true;completed.items[0].attempt.confidence=null;completed.items[0].attempt.status='completed';await sync(completed);
 assert.equal((await db.query('select state from public.learner_practice_sessions where session_id=$1',[completed.id])).rows[0].state.completed,true);
 const uncertain=structuredClone(completed);uncertain.items[0].attempt.confidence='guess';await sync(uncertain);await sync(completed);
 assert.equal((await db.query('select state from public.learner_practice_sessions where session_id=$1',[completed.id])).rows[0].state.items[0].attempt.confidence,'guess','optional uncertainty survives stale uploads without changing first answer');
 const premature=structuredClone(state);premature.id='vocab-db-premature';premature.completed=true;await assert.rejects(sync(premature),/not complete/);
 await assert.rejects(db.query('select * from public.vocabulary_practice_questions'),/permission denied/);
 for(const itemId of new Set(bank.questions.map(q=>q.itemId))) await db.query("select public.learning_action('expose',$1::jsonb)",[JSON.stringify({itemId})]);
 let checked=0;
 for(const question of bank.questions) for(const answer of question.acceptedAnswers){
  const round={id:'vocab-db-all-'+checked++,createdAt:new Date().toISOString(),position:0,completed:true,items:[{question,response:answer,selected:[],tokenOrder:[],attempt:{response:answer,correct:false,confidence:'easy',submittedAt:new Date().toISOString(),status:'completed'}}]};
  await sync(round);
  assert.equal((await db.query('select state from public.learner_practice_sessions where session_id=$1',[round.id])).rows[0].state.items[0].attempt.correct,true,question.id+' '+answer);
 }
 console.log('Validated all '+bank.questions.length+' vocabulary questions and '+checked+' accepted-answer variants against server grading.');
 await db.query("select set_config('request.jwt.claim.sub',$1,false)",['22222222-2222-4222-8222-222222222222']);assert.equal((await db.query('select * from public.learner_practice_sessions')).rows.length,0);await assert.rejects(sync(state),/not been learned/);
 console.log('PASS vocabulary database: learned-only, canonical questions, server grading, deduplication, stale preservation, confidence completion and account isolation');
}finally{await db.close();}
