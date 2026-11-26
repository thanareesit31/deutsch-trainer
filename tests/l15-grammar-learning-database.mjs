import assert from 'node:assert/strict';
import {createDatabase,userId} from './learning-database.mjs';
import {a13ReleaseCourses} from '../src/data/a13-release.ts';
import {emptyReleaseState,parseReleaseState,mergeReleaseStates,selectReleaseTask} from '../src/lib/a13-release.ts';
import {emptyL15GuidedState,commitL15GuidedState,guidedAttemptId} from '../src/lib/l15-grammar-state.ts';
import {l15GrammarLearningCards} from '../src/data/l15-grammar-learning.ts';
import {l15GuidedTasks,l15GuidedCardIds} from '../src/lib/l15-grammar-catalog.ts';
const db=await createDatabase();
const key='deutsch-trainer-release-course-v1-L15-grammar';
const other='22222222-2222-4222-8222-222222222222';
const course=a13ReleaseCourses.find(c=>c.lessonId==='L15'&&c.skill==='grammar');
const save=(state,owner=userId)=>db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3) on conflict(user_id,lesson_key) do update set state=excluded.state',[owner,key,state]);
const read=async()=> (await db.query('select state from public.learner_lesson_states where lesson_key=$1',[key])).rows[0]?.state;
try {
 const legacy=course.tasks.find(q=>!q.id.startsWith('A13-L15-GUIDED-'));
 const historic={id:'old-first',taskId:legacy.id,response:legacy.acceptedAnswers[0],correct:true,helpUsed:true,submittedAt:'2026-11-20T00:00:00Z',selectionReason:'historical'};
 let state={...emptyReleaseState(),learned:['L15-possessivartikel'],attempts:[historic],active:{taskId:legacy.id,draft:'ร่างเดิม',helpUsed:true,startedAt:'2026-11-21T00:00:00Z',selectionReason:'old pending',origin:'learn',learningCardId:'L15-possessivartikel'}};
 await save(state);
 assert.equal((await db.query("select count(*) from public.release_course_tasks where task_id like 'A13-L15-GUIDED-%'")).rows[0].count,10);
 const g=emptyL15GuidedState();g.updatedAt=new Date().toISOString();
 const mutate=async fn=>{fn(g);state=commitL15GuidedState(state,structuredClone(g));await save(state);state=parseReleaseState(JSON.stringify(await read()),course);};
 await assert.rejects(save({...state,learned:[...state.learned,l15GuidedCardIds[0]]}),/requires guided teaching/);
 await assert.rejects(save({...state,guidedL15:{...g,owner:{...g.owner,view:{kind:'try',owner:'anna',answer:null}}}}),/teaching pages/);
 await mutate(g=>{g.owner.seen=[0,1,2];g.owner.view={kind:'try',owner:'anna',answer:'sein'};g.owner.drafts={anna:'sein'};});
 await mutate(g=>{g.owner.responses.anna='sein';g.owner.view={kind:'feedback',owner:'anna',answer:'sein'};});
 assert.equal(state.attempts.find(a=>a.id===guidedAttemptId('A13-L15-GUIDED-OWNER-01')).correct,false);
 await assert.rejects(save({...state,attempts:state.attempts.map(a=>a.id.startsWith('l15-guided')?{...a,correct:true}:a)}),/grading/);
 const changed=structuredClone(state);changed.guidedL15.owner.responses.anna='ihr';
 await assert.rejects(save(changed),/first answer|immutable/);
 await mutate(g=>{g.owner.testOwner='tom';g.owner.view={kind:'try',owner:'tom',answer:null};});
 await mutate(g=>{g.owner.responses.tom='sein';g.owner.view={kind:'feedback',owner:'tom',answer:'sein'};});
 for(const [index,card]of l15GrammarLearningCards.entries()){
  await mutate(g=>{g.active=index+1;g.cards[card.id].seen=Array.from({length:card.pages.length+1},(_,i)=>i);g.cards[card.id].page=card.pages.length+1;});
  for(const [offset,task]of card.tasks.entries()){
   const expected={'A13-L15-GUIDED-NOM-01':'seine','A13-L15-GUIDED-NOM-02':'ihr','A13-L15-GUIDED-AKK-01':'seinen','A13-L15-GUIDED-AKK-02':'ihren','A13-L15-GUIDED-USE-01':'ihre','A13-L15-GUIDED-USE-02':'Ihren Sessel finde ich schön.','A13-L15-GUIDED-PLURAL-01':'ของทอมกับอันนา','A13-L15-GUIDED-PLURAL-02':'ihr'}[task.id];
   assert.equal(task.answer,expected);
   const selection=task.kind==='order'?['Ihren Sessel','finde','ich','schön.'].map(word=>task.tokens.indexOf(word)):[];
   await mutate(g=>{g.cards[card.id].page=card.pages.length+1+offset;g.cards[card.id].testPage=g.cards[card.id].page;g.cards[card.id].responses[task.id]={kind:'draft',text:expected,selection,reviewed:true};});
   assert.equal((await read()).guidedL15.cards[card.id].responses[task.id].kind,'draft');
   await mutate(g=>{g.cards[card.id].responses[task.id]={kind:'checked',text:expected,selection,reviewed:true,correct:true,taskId:task.id,version:1,targetId:task.targetId,subskill:task.subskill};});
  }
 }
 await mutate(g=>{g.complete=true;});
 assert.equal(state.attempts.length,11);
 assert.deepEqual(state.attempts[0],historic);
 assert.deepEqual(state.active.draft,'ร่างเดิม');
 assert.equal(state.learned.length,6);
 assert.equal(state.guidedL15.complete,true);
 assert.equal(state.attempts.filter(a=>a.helpUsed&&a.id.startsWith('l15-guided')).length,8);
 const oldClient={...state};delete oldClient.guidedL15;await save(oldClient);
 assert.equal((await read()).guidedL15.complete,true,'Older clients cannot erase new progress');
 const merged=mergeReleaseStates(state,{...state,guidedL15:{...g,active:0,complete:false,updatedAt:new Date().toISOString()}});
 assert.equal(merged.attempts.length,11);
 assert.equal(merged.guidedL15.owner.responses.anna,'sein');
 const unlearned={...emptyReleaseState(),learned:[]};
 assert.equal(selectReleaseTask(course,unlearned),null);
 const ownerOnly={...emptyReleaseState(),learned:[l15GuidedCardIds[0]],attempts:state.attempts.filter(a=>a.taskId.startsWith('A13-L15-GUIDED-OWNER'))};
 assert.equal(selectReleaseTask(course,ownerOnly).task.subskill,'possessor_reference');
 await db.exec(`set request.jwt.claim.sub='${other}'`);
 assert.equal(await read(),undefined,'Other accounts cannot read this checkpoint');
 await assert.rejects(save(state,userId),/row-level security/);
 await save(emptyReleaseState(),other);
 assert.deepEqual((await read()).attempts,[]);
 console.log('L15 ordinary-account DB: registry, eligibility, firsts, legacy history/pending draft, UI resume, old-client preservation, Practice selection and RLS isolation passed.');
}finally{await db.close();}
