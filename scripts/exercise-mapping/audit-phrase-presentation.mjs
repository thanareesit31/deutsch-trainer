import assert from 'node:assert/strict';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {a11PhraseDialogues} from '../../src/data/a11-phrase-dialogues.ts';
import {l02PhraseDiscovery} from '../../src/data/l02-phrase-discovery.ts';
import {l01PhraseDiscovery} from '../../src/data/l01-phrase-discovery.ts';
import {l13PhraseLearning} from '../../src/data/l13-phrase-learning.ts';
import {phrasePresentation} from '../../src/data/phrase-presentation.ts';
import {presentDialogueTopics} from '../../src/lib/phrase-presentation.ts';
import {dialogueUnits,emptyDialogueResponse,newDialogueRun,gradeDialogue,parseDialogueHistory} from '../../src/lib/phrase-dialogue-learning.ts';
const l14=JSON.parse(readFileSync('docs/exercise-mapping/l14-phrase-teaching-models.json'));
const banks={L02:l02PhraseDiscovery,...a11PhraseDialogues,L13:l13PhraseLearning},report=[];
for(const[id,raw]of Object.entries(banks)){
 const topics=presentDialogueTopics(id,raw);
 assert.deepEqual(topics.flatMap(t=>t.tasks).map(t=>({id:t.id,units:dialogueUnits(t),kind:t.kind,options:t.options,tokens:t.tokens,audio:t.audio})),raw.flatMap(t=>t.tasks).map(t=>({id:t.id,units:dialogueUnits(t),kind:t.kind,options:t.options,tokens:t.tokens,audio:t.audio})),id+' assessment changed');
 let models=0,checks=0;
 for(const topic of topics){for(const model of topic.models){assert(model.questionSentences&&model.replySentences,id+' unannotated model');assert(model.audio&&existsSync('public'+model.audio),id+' missing audio '+model.audio);models++;}for(const task of topic.tasks){if(task.promptMeaning){assert(task.feedbackDialogue,id+' missing feedback '+task.id);assert(task.feedbackAudio&&existsSync('public'+task.feedbackAudio),id+' feedback audio '+task.id);}checks++;}}
 report.push({id,topics:topics.length,models:topics.reduce((n,t)=>n+(t.grammarPatterns?.length??t.models.length),0),authoredModels:models,checks});
}
for(const topic of l01PhraseDiscovery)for(const task of topic.tasks){const p=phrasePresentation.L01;assert(p.annotations[task.prompt]&&p.annotations[task.answer]);assert(existsSync('public'+p.dialogues[JSON.stringify([task.prompt,task.answer])]))}
for(const[id,entry]of Object.entries(phrasePresentation)){for(const[text,sentences]of Object.entries(entry.annotations)){assert.equal(sentences.map(s=>s.map(p=>p.text).join(' ')).join(' '),text,id);for(const parts of sentences)for(const p of parts){assert.notEqual(p.label,'วลีสื่อสาร');if(p.role==='participle')assert(!p.label.includes('Infinitiv'));}}for(const turns of Object.values(entry.turns))for(const path of Object.values(turns))assert(existsSync('public'+path),path);}
report.unshift({id:'L01',topics:l01PhraseDiscovery.length,models:l01PhraseDiscovery.flatMap(t=>t.tasks).length,checks:l01PhraseDiscovery.flatMap(t=>t.tasks).length});
assert.equal(l14.groups.flatMap(g=>g.models).length,17);
report.push({id:'L14',groups:l14.groups.length,models:17,status:'retained-controller-with-teaching-supplement'});
for(let n=15;n<=18;n++)report.push({id:'L'+n,status:'no-published-phrase-content'});
writeFileSync('docs/exercise-mapping/phrase-presentation-audit-results.json',JSON.stringify({scope:'local tester Learn presentation; not deployment or adaptive-selector migration',lessons:report},null,2)+'\n');
console.log(JSON.stringify(report));
