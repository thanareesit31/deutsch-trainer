import { mergePhrasePracticeAssistance } from '../src/lib/phrase-practice-assistance';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import packets from '../docs/exercise-mapping/l01-l13-practice-extensions.json';
import bank from '../docs/exercise-mapping/a11-phrase-bank.json';
import { isPracticeQuestionUnlocked, parsePracticeHistory, planDailyPractice } from '../src/lib/practice-planner';
const packet=packets[0], tasks=packet.questions.filter(q=>q.targetId===packet.questions[0].targetId);
const first=tasks.filter(q=>q.practice.stage===1),supported=tasks.filter(q=>q.practice.stage===2),full=tasks.find(q=>q.practice.stage===3)!;
const foundation=bank.definitions.find(q=>q.targetId===first[0].targetId&&q.subskill==='phrase_comprehension')!;
let tick=0;
function history(question: unknown,id: string,correct=true,help=false,href='/practice/L01/phrases/daily') {
 const time=new Date(Date.UTC(2026,10,11,0,0,++tick)).toISOString();
 return parsePracticeHistory(JSON.stringify({version:1,sessions:[{id,createdAt:time,position:0,completed:true,items:[{question,response:'test',hintUsed:help,translationUsed:help,wordHelpTokens:help?['example']:[],attempt:{correct,response:'test',status:'completed',submittedAt:time,confidence:null}}]}]}),href);
}
test('new contexts require a real response and production needs two independent contexts and sessions',()=>{
 assert.equal(isPracticeQuestionUnlocked(first[0],[]),false);
 const base=history(foundation,'core');
 assert.equal(isPracticeQuestionUnlocked(first[0],base),true);
 const one=[...base,...history(first[0],'one')];
 assert.equal(isPracticeQuestionUnlocked(supported[0],one),false);
 assert.equal(isPracticeQuestionUnlocked(supported[0],[...one,...history(first[0],'repeat')]),false);
 assert.equal(isPracticeQuestionUnlocked(supported[0],[...one,...history(first[1],'one')]),false,'same actual session cannot count twice');
 assert.equal(isPracticeQuestionUnlocked(supported[0],[...one,...history(first[1],'two',true,true)]),false);
 assert.equal(isPracticeQuestionUnlocked(supported[0],[...one,...history(first[1],'two')]),true);
 assert.equal(isPracticeQuestionUnlocked(full,[...one,...history(first[1],'two')]),false,'recognition cannot establish writing');
});
test('mirrored bank sessions and unknown help do not inflate independent evidence',()=>{
 const base=history(foundation,'base');
 const mirrored=[...base,...history(first[0],'same',true,false,'/practice/L01/phrases/basic'),...history(first[1],'same')];
 assert.equal(isPracticeQuestionUnlocked(supported[0],mirrored),false);
 const unknown=history(first[1],'unknown');unknown[0].items[0].result!.assisted=null;
 assert.equal(isPracticeQuestionUnlocked(supported[0],[...base,...history(first[0],'one'),...unknown]),false);
 const pending=history(foundation,'pending');pending[0].items[0].result!.completed=false;
 assert.equal(isPracticeQuestionUnlocked(first[0],pending),false);
});
test('failure after help returns to supported writing, then retries the harder response after recovery',()=>{
 const initial=[...history(foundation,'core'),...history(first[0],'one'),...history(first[1],'two'),...history(supported[0],'three'),...history(supported[1],'four')];
 assert.equal(isPracticeQuestionUnlocked(full,initial),true);
 const failed=[...initial,...history(full,'failed',false,true)];
 const choice=planDailyPractice(tasks,failed).questionIds[0];
 assert.ok(supported.some(q=>q.id===choice));
 const recovered=[...failed,...history(supported.find(q=>q.id===choice)!,'recovered')];
 assert.equal(planDailyPractice(tasks,recovered).questionIds[0],full.id);
});
test('daily round mixes weak, new and due targets without duplicate target IDs',()=>{
 const questions=Array.from({length:15},(_,i)=>({id:`q${i}`,topicId:'L01-phrases-core',subskill:'phrase_comprehension',kind:'choice',targetId:`target${i}`}));
 const evidence=questions.slice(0,10).flatMap((q,i)=>history(q,`round${i}`,i>=5));
 const plan=planDailyPractice(questions,evidence,Date.UTC(2026,10,20));
 assert.equal(plan.questionIds.length,10);
 assert.ok(plan.questionIds.some(id=>Number(id.slice(1))<5));
 assert.ok(plan.questionIds.some(id=>Number(id.slice(1))>=10));
 assert.ok(plan.questionIds.some(id=>Number(id.slice(1))>=5&&Number(id.slice(1))<10));
 assert.equal(new Set(plan.questionIds).size,10);
});

test('normalized phrase assistance keeps the first response and never invents known support',()=>{
 const first={hintUsed:false,translationUsed:false,wordHelpTokens:[],attempt:{response:'original',correct:false,wordHelpTokens:[]}};
 const remote={hintUsed:false,translationUsed:false,wordHelpTokens:['Post'],attempt:{response:'changed',correct:true,wordHelpTokens:[],assisted:true}};
 const merged=mergePhrasePracticeAssistance(first,first,remote);
 assert.deepEqual(merged.attempt,{response:'original',correct:false,wordHelpTokens:['Post'],assisted:true});assert.deepEqual(merged.wordHelpTokens,['Post']);
 const unknown={attempt:{response:'legacy',correct:true}};
 const retained=mergePhrasePracticeAssistance(unknown,first,unknown);
 assert.equal('wordHelpTokens' in retained,false);
 assert.deepEqual(retained.attempt,unknown.attempt);
});
