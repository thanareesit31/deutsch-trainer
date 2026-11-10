import {phrasePresentation} from '@/data/phrase-presentation';
import type {DialogueTopic} from './phrase-dialogue-learning';

export const phraseDialogueKey=(question:string,reply:string)=>JSON.stringify([question,reply]);
export const sentencePresentation=(lessonId:string,text:string)=>phrasePresentation[lessonId]?.annotations[text];
export const dialogueRecording=(lessonId:string,question:string,reply:string)=>phrasePresentation[lessonId]?.dialogues[phraseDialogueKey(question,reply)];
export const turnRecording=(lessonId:string,text:string,speaker:'A'|'B')=>phrasePresentation[lessonId]?.turns[text]?.[speaker];

const readingReasons:Readonly<Record<string,string>>={
 'L03-COMM-01-PROFILE-learn-v1':'Lena ist Annas Schwester บอกว่าน้องสาวชื่อ Lena ส่วน Thai und Deutsch บอกว่าพูดไทยและเยอรมัน',
 'L09-COMM-03-PROFILE-learn-v1':'Nora ต้องการ einen Salat ส่วน Tim ต้องการ einen Kuchen จึงเลือกอาหารตามชื่อคนในข้อความ',
 'L12-COMM-03-PROFILE-learn-v1':'im Mai บอกเดือนพฤษภาคม ส่วน seit 2000 บอกว่ามีงานมาตั้งแต่ปี 2000',
};
export function presentDialogueTopics(lessonId:string,topics:readonly DialogueTopic[]):DialogueTopic[]{
 return topics.map(topic=>({...topic,
  note:phrasePresentation[lessonId]?.notes[topic.id]??topic.note,
  models:topic.models.map(model=>({...model,
   questionSentences:sentencePresentation(lessonId,model.question)??model.questionSentences,
   replySentences:sentencePresentation(lessonId,model.reply)??model.replySentences,
   audio:dialogueRecording(lessonId,model.question,model.reply)??model.audio,
  })),
  tasks:topic.tasks.map(task=>{
   const question=task.promptMeaning?sentencePresentation(lessonId,task.prompt):undefined;
   const reply='unit'in task&&!task.audio?sentencePresentation(lessonId,task.unit.answer):undefined;
   return {...task,
    explanation:readingReasons[task.id]??task.explanation,
    ...(question&&reply&&'unit'in task?{feedbackDialogue:{question,reply},feedbackAudio:dialogueRecording(lessonId,task.responseSpeaker==='A'?task.unit.answer:task.prompt,task.responseSpeaker==='A'?task.prompt:task.unit.answer)??task.feedbackAudio}:{}),
    ...(!task.promptMeaning&&reply?{answerSentences:reply}:{}),
   };
  }),
 }));
}
