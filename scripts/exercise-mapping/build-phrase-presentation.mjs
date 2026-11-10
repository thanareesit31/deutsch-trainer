import {readFileSync,writeFileSync,existsSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {l01PhraseDiscovery} from '../../src/data/l01-phrase-discovery.ts';
import {l02PhraseDiscovery} from '../../src/data/l02-phrase-discovery.ts';
import {a11PhraseDialogues} from '../../src/data/a11-phrase-dialogues.ts';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
function publish(path,text){const pending=path+'.pending';writeFileSync(pending,text);renameSync(pending,path);}
const authoring=read('docs/exercise-mapping/phrase-presentation-annotations.json');
const allowed=new Set(['time','sequence','auxiliary','subject','other','participle','verb','question']);
const data={},clips=new Map(),turns=new Map();
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0,20);
const entry=id=>data[id]??=( {annotations:authoring.lessons[id]??{},dialogues:{},turns:{},notes:{}} );
function addTurn(id,text,speaker){
 const voice=speaker==='A'?'de-DE-KatjaNeural':'de-DE-ConradNeural';
 const path='/audio/phrases/turn-'+digest([voice,text])+'.mp3';
 turns.set(path,{path,voice,text});
 (entry(id).turns[text]??={})[speaker]=path;
 return {voice,text};
}
function pair(id,question,reply,existing){
 const key=JSON.stringify([question,reply]);
 const path=existing??'/audio/phrases/dialogue-'+digest([question,reply])+'.m4a';
 entry(id).dialogues[key]=path;
 const speech=[addTurn(id,question,'A'),addTurn(id,reply,'B')];
 if(existing&&!clips.has(existing))assert(existsSync('public'+existing),existing);
 else clips.set(path,{path,turns:speech});
}
for(const topic of l01PhraseDiscovery)for(const task of topic.tasks)pair('L01',task.prompt,task.answer);
for(const [id,topics]of Object.entries({L02:l02PhraseDiscovery,...a11PhraseDialogues})){
 entry(id);
 for(const topic of topics){
  for(const model of topic.models)pair(id,model.question,model.reply,model.audio);
  for(const task of topic.tasks)if(task.promptMeaning&&'unit'in task)pair(id,task.prompt,task.unit.answer,task.feedbackAudio??entry(id).dialogues[JSON.stringify([task.prompt,task.unit.answer])]);
 }
}
const l13Path='docs/exercise-mapping/l13-phrase-teaching-models.json';
if(existsSync(l13Path))for(const model of read(l13Path).models)pair('L13',model.question,model.reply);
const l14Path='docs/exercise-mapping/l14-phrase-teaching-models.json';
if(existsSync(l14Path)){
 const source=read(l14Path);
 for(const group of source.groups)for(const model of group.models)pair('L14',model.question,model.reply);
 for(const model of source.dialoguePairs)pair('L14',model.question,model.reply);
 for(const text of Object.keys(entry('L14').annotations)){addTurn('L14',text,'A');addTurn('L14',text,'B');}
}
for(const [id,lesson]of Object.entries(data)){
 for(const[text,sentences]of Object.entries(lesson.annotations)){
  assert(Array.isArray(sentences)&&sentences.length>0,id+': '+text);
  assert.equal(sentences.map(parts=>parts.map(part=>part.text).join(' ')).join(' '),text,id);
  for(const sentence of sentences)for(const part of sentence){assert(allowed.has(part.role)&&part.label,id+': '+text);if(part.label==='ประธาน'||part.label.includes('(ประธาน)'))assert.equal(part.role,'subject',id+' subject color: '+text);}
 }
 for(const key of Object.keys(lesson.dialogues))for(const text of JSON.parse(key))assert(lesson.annotations[text],id+' missing annotations: '+text);
}
data.L10.notes['L10-COMM-04']=['อ่านชื่อขบวนหรือปลายทางก่อนหาชานชาลาหรือทางออก','เมื่อฟังประกาศ ให้จับชื่อขบวนหรือปลายทาง แล้วจึงฟังหมายเลขชานชาลาหรือทางออก'];
publish('src/data/phrase-presentation.ts','import type { DialogueAnnotatedPart } from "@/lib/phrase-dialogue-learning";\nexport const phrasePresentation: Readonly<Record<string, {annotations:Record<string,DialogueAnnotatedPart[][]>;dialogues:Record<string,string>;turns:Record<string,{A?:string;B?:string}>;notes:Record<string,string[]>}>> = '+JSON.stringify(data,null,2)+';\n');
publish('docs/exercise-mapping/phrase-presentation-audio.json',JSON.stringify({version:1,origin:'Synthetic two-role dialogue recordings for existing canonical teaching and feedback text; no personal voice cloning',speechNormalization:'Hyphenated spelling sequences use German letter names',turns:[...turns.values()],clips:[...clips.values()]},null,2)+'\n');
console.log(JSON.stringify({lessons:Object.keys(data),annotations:Object.values(data).reduce((n,x)=>n+Object.keys(x.annotations).length,0),dialogues:clips.size,turns:turns.size}));
