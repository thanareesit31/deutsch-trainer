import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

// Wave/formality and shared singular/plural family scenes do not identify one answer.
const unclearTargets=new Set(['V001','V002','V003','V004','V005','V006','V007','V026','V028','V036','V038']);
export function pictureMeaningQuestions({words,questions,cues,suffix,root,aliases={}}){
 const label=word=>(word.article||word.pluralOnly?`${word.article||'die'} `:'')+word.word;
 return words.flatMap((word,index)=>{
  const cue=cues[word.id];
  if(cue?.kind!=='image'||unclearTargets.has(word.id))return [];
  assert(existsSync(new URL('public'+cue.src,root)),`Missing picture ${word.id}`);
  const source=questions.find(q=>q.itemId===word.id&&q.subskill==='vocabulary_meaning');
  if(!source)return [];
  const other=words.filter(candidate=>candidate.id!==word.id&&candidate.meaning!==word.meaning
   &&candidate.word!==word.word&&!(aliases[word.word]??[]).includes(candidate.word));
  const options=[label(word),...new Set([...other.slice(index%Math.max(1,other.length)),...other].map(label))].slice(0,4);
  if(options.length!==4)return [];
  const imageCue={src:cue.src,...(cue.portrait?{portrait:cue.portrait}:{})};
  return [{...source,id:word.id+suffix,interaction:'picture-choice',subskill:'vocabulary_picture_meaning',recognitionMode:'image-to-german',sentence:'',optionsLang:'de',prompt:'เลือกคำเยอรมันที่ตรงกับภาพ',options,acceptedAnswers:[label(word)],imageCue,difficulty:1,difficultyRationale:'จำแนกคำที่ตรงกับภาพจากคำเยอรมันสี่ตัวเลือก ไม่วัดการสะกดหรือจำ Artikel เอง',assistance:'picture-and-four-german-choices',explanation:''}];
 });
}
