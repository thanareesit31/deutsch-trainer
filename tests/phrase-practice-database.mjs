import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDatabase,userId} from './learning-database.mjs';
const bank=JSON.parse(readFileSync('docs/exercise-mapping/l13-phrases-bank.json','utf8'));const db=await createDatabase();
const round=(question,response,id)=>({id,createdAt:new Date().toISOString(),position:0,completed:true,items:[{question:structuredClone(question),response,selected:[],tokenOrder:[],attempt:{response,correct:false,confidence:'easy',submittedAt:new Date().toISOString(),status:'completed'}}]});
const sync=s=>db.query('select public.sync_practice_session($1,$2::jsonb)',['phrases-basic',JSON.stringify(s)]);
const expose=id=>db.query("select public.learning_action('expose',$1::jsonb)",[JSON.stringify({itemId:id})]);
try{
 await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[userId]);
 const dialogue=bank.legacyQuestions.find(q=>q.subskill==='phrase_dialogue');await expose(dialogue.itemId);await assert.rejects(sync(round(dialogue,dialogue.acceptedAnswers[0],'dialogue-unseen')),/has not been learned/);
 const needsQuestion=bank.questions.find(q=>q.id==='L13-phrases-favorite-sequence-1');await expose(needsQuestion.itemId);await assert.rejects(sync(round(needsQuestion,needsQuestion.acceptedAnswers[0],'question-not-learned')),/has not been learned/);
 for(const id of new Set([...bank.questions,...bank.legacyQuestions].flatMap(q=>q.requiredItemIds)))await expose(id);
 let count=0;for(const q of [...bank.questions,...bank.legacyQuestions])for(const answer of q.acceptedAnswers){const state=round(q,answer,'phrase-all-'+count++);await sync(state);const saved=(await db.query('select state from public.learner_practice_sessions where session_id=$1',[state.id])).rows[0].state;assert.equal(saved.items[0].attempt.correct,true,q.id);}
 const matching=bank.questions.filter(q=>q.interaction==='match');assert.equal(matching.length,8);
 const changedGroup=round(matching[0],matching[0].acceptedAnswers[0],'changed-match-group');changedGroup.items[0].question.matchGroupId='forged';await assert.rejects(sync(changedGroup),/Changed practice interaction/);
 const changedOptions=round(matching[0],matching[0].acceptedAnswers[0],'changed-match-options');changedOptions.items[0].question.options=['forged'];await assert.rejects(sync(changedOptions),/Changed matching options/);
 const pair=matching.slice(0,2);const pairRound=round(pair[0],pair[0].acceptedAnswers[0],'matching-pair-results');pairRound.items.push(round(pair[1],'wrong','unused').items[0]);pairRound.position=1;await sync(pairRound);const pairSaved=(await db.query('select state from public.learner_practice_sessions where session_id=$1',[pairRound.id])).rows[0].state;assert.deepEqual(pairSaved.items.map(item=>item.attempt.correct),[true,false]);
 const forged=round(dialogue,dialogue.acceptedAnswers[0],'forged');forged.items[0].question.tokens.reverse();await assert.rejects(sync(forged),/Invalid sentence tokens/);
 const changed=round(bank.questions[0],'wrong','answer-forgery');changed.items[0].question.acceptedAnswers=['wrong'];await assert.rejects(sync(changed),/changed vocabulary question/);
 await assert.rejects(db.query('select * from public.phrase_practice_questions'),/permission denied/);
 await db.query("select set_config('request.jwt.claim.sub',$1,false)",['22222222-2222-4222-8222-222222222222']);assert.equal((await db.query('select * from public.learner_practice_sessions')).rows.length,0);await assert.rejects(sync(round(bank.questions[0],bank.questions[0].acceptedAnswers[0],'other-account')),/has not been learned/);
 console.log('PASS phrase database: all '+count+' answers, required dialogue phrases, canonical tokens/answers and account isolation');
}finally{await db.close();}
