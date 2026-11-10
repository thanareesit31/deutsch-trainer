import test from 'node:test';
import assert from 'node:assert/strict';
import { l02PhraseDiscovery } from '../src/data/l02-phrase-discovery';
import {canCheckDialogue, emptyDialogueResponse, gradeDialogue, dialogueQueue, dialogueUnits, newDialogueRun, parseDialogueHistory, type DialogueTask, type DialogueRun} from '../src/lib/phrase-dialogue-learning';
const tasks=l02PhraseDiscovery.flatMap<DialogueTask>(t=>t.tasks);
const date='2026-11-06T12:00:00.000Z';
const find=(id:string)=>{const t=tasks.find(t=>t.id===id);assert(t);return t;};
test('seven taught topics cover eighteen activities with twenty independent response units',()=>{
 assert.equal(l02PhraseDiscovery.length,7);assert.equal(tasks.length,18);assert.equal(tasks.flatMap(dialogueUnits).length,20);assert.equal(dialogueQueue(l02PhraseDiscovery).length,25);
 assert.equal(new Set(tasks.flatMap(dialogueUnits).map(u=>u.id)).size,20);
});
test('listening requires a completed play, preserves leading zero, and distinguishes wrong digits',()=>{
 const task=find('L02-UX-PHONE-01');const response={...emptyDialogueResponse(),text:'0301234567'};
 assert.equal(canCheckDialogue(task,response),false);assert.throws(()=>gradeDialogue(task,response,date));
 const heard={...response,plays:2};assert.equal(canCheckDialogue(task,heard),true);
 const evidence=gradeDialogue(task,heard,date)['L02-UX-PHONE-01-response'];
 assert.equal(evidence.response,'0301234567');assert.equal(evidence.correct,true);assert.equal(evidence.subskill,'phone_digit_listening');assert.equal(evidence.completedPlays,2);
 assert.equal(gradeDialogue(task,{...heard,text:'301234567'},date)['L02-UX-PHONE-01-response'].correct,false);
});
test('the three profile fields are scored independently as reading',()=>{
 const task=find('L02-UX-PROFILE-01');const response={...emptyDialogueResponse(),fields:{'L02-UX-PROFILE-01-age':'28','L02-UX-PROFILE-01-home':'berlin','L02-UX-PROFILE-01-work':'Wrong'}};
 const result=gradeDialogue(task,response,date);assert.deepEqual(Object.values(result).map(v=>v.correct),[true,true,false]);assert(Object.values(result).every(v=>v.subskill==='person_detail_reading'));
 assert.equal(canCheckDialogue(task,{...response,fields:{}}),false);
});
test('pending drafts and an incorrect first response survive reload; malformed data is not reset',()=>{
 const task=find('L02-UX-PROF-01'),draft={...emptyDialogueResponse(),selection:[0]};const first=gradeDialogue(task,draft,date);assert.equal(first['L02-UX-PROF-01-response'].correct,false);
 const run: DialogueRun={...newDialogueRun(l02PhraseDiscovery),step:1,models:['work'],responses:{[task.id]:{...draft,first}}};
 const result=parseDialogueHistory(JSON.stringify({version:1,runs:[run]}),l02PhraseDiscovery);assert.deepEqual(result.runs[0].responses[task.id].first,first);
 const later={...emptyDialogueResponse(),selection:[2,3],helpWords:['bei']};run.responses['L02-UX-WORK-01']=later;
 assert.deepEqual(parseDialogueHistory(JSON.stringify({version:1,runs:[run]}),l02PhraseDiscovery).runs[0].responses['L02-UX-WORK-01'],later);
 assert.throws(()=>parseDialogueHistory(JSON.stringify({version:1,runs:[{...run,step:4}]}),l02PhraseDiscovery),/Skipped/);
 assert.throws(()=>parseDialogueHistory('{broken',l02PhraseDiscovery));
});
