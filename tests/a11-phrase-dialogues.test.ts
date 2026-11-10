import assert from 'node:assert/strict';
import test from 'node:test';
import {existsSync} from 'node:fs';
import {a11PhraseDialogues} from '../src/data/a11-phrase-dialogues';
import {canCheckDialogue,dialogueQueue,dialogueUnits,emptyDialogueResponse,gradeDialogue,newDialogueRun,parseDialogueHistory,type DialogueTask,type DialogueResponse} from '../src/lib/phrase-dialogue-learning';
const when='2026-11-06T12:00:00.000Z';
function correct(task:DialogueTask):DialogueResponse{
 const response=emptyDialogueResponse();response.plays=task.audio?1:0;
 if(task.kind==='choice')response.selection=[task.options.indexOf(task.unit.answer)];
 else if(task.kind==='order')for(const word of task.unit.answer.split(' ')){const index=task.tokens.findIndex((v,i)=>v===word&&!response.selection.includes(i));assert(index>=0);response.selection.push(index);}
 else if(task.kind==='profile')for(const f of task.fields)response.fields[f.unit.id]=f.unit.answer;
 else response.text=task.unit.answer;
 return response;
}
test('ten banks have unique bindings and all local clips, without provenance in runtime tasks',()=>{
 assert.equal(Object.keys(a11PhraseDialogues).length,10);const taskIds=new Set(),unitIds=new Set();let count=0,units=0;
 for(const [lesson,topics] of Object.entries(a11PhraseDialogues)){
  assert.equal(topics.length,new Set(topics.map(t=>t.id)).size);
  for(const topic of topics){assert(topic.models.length&&topic.note.length);assert(existsSync('public'+topic.audio));
   for(const task of topic.tasks){assert(!taskIds.has(task.id));taskIds.add(task.id);count++;
    assert(task.id.startsWith(lesson));assert(!('sources' in task));assert(!('sourceFindingIds' in task));
    if(task.audio){assert.equal(task.visual,null);assert(existsSync('public'+task.audio));}
    for(const unit of dialogueUnits(task)){assert(!unitIds.has(unit.id));unitIds.add(unit.id);units++;assert(unit.targetId&&unit.rationale&&unit.difficulty);}
   }
  }
 }
 assert.equal(count,103);assert.equal(units,107);
});
for(const [lesson,topics] of Object.entries(a11PhraseDialogues))test(`${lesson} grades and restores every unit with its own immutable presentation`,()=>{
 const tag=lesson+'-dialogue-v1',run=newDialogueRun(topics);run.models=topics.map(t=>t.id);run.step=run.queue.length;
 for(const task of topics.flatMap(t=>t.tasks)){const response=correct(task);assert(canCheckDialogue(task,response));response.first=gradeDialogue(task,response,when,tag);assert(Object.values(response.first).every(e=>e.correct));run.responses[task.id]=response;}
 const serialized=JSON.stringify({version:1,runs:[run]});assert.deepEqual(parseDialogueHistory(serialized,topics,tag).runs[0],run);
 assert.throws(()=>parseDialogueHistory(serialized,topics,'l02-dialogue-v1'),/evidence/);
 assert.deepEqual(run.queue,dialogueQueue(topics));
});
test('spelling and email listen without a visible answer and require playback',()=>{
 const spell=a11PhraseDialogues.L05.flatMap(t=>t.tasks).find(t=>t.kind==='text'&&t.unit.subskill==='word_spelling_listening');assert(spell);assert.equal(spell.visual,null);
 const response=correct(spell);response.plays=0;assert.equal(canCheckDialogue(spell,response),false);response.plays=2;response.text='schirm';assert.equal(Object.values(gradeDialogue(spell,response,when,'L05-dialogue-v1'))[0].correct,true);
 const mail=a11PhraseDialogues.L05.flatMap(t=>t.tasks).find(t=>t.kind==='text'&&t.unit.subskill==='email_listening');assert(mail);const draft=correct(mail);draft.text='nora42@example.com';assert.equal(Object.values(gradeDialogue(mail,draft,when,'L05-dialogue-v1'))[0].correct,false);
});
test('profile fields preserve distinct reading evidence when one field is wrong',()=>{
 const task=a11PhraseDialogues.L12.flatMap(t=>t.tasks).find(t=>t.kind==='profile');assert(task&&task.kind==='profile');const response=correct(task);response.fields[task.fields[1].unit.id]='2020';assert.deepEqual(Object.values(gradeDialogue(task,response,when,'L12-dialogue-v1')).map(e=>e.correct),[true,false]);
});
