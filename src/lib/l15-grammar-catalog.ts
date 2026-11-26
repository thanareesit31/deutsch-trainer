import type { ReleaseCard, ReleaseCourse, ReleaseModel, ReleaseTask } from './a13-release';
import { l15GrammarLearningCards } from '@/data/l15-grammar-learning';

export const l15GuidedCardIds = ['L15-grammar-owner','L15-grammar-nominativ','L15-grammar-akkusativ','L15-grammar-connected','L15-grammar-plural-owners'];
export const l15OwnerTaskIds = {anna:'A13-L15-GUIDED-OWNER-01',tom:'A13-L15-GUIDED-OWNER-02'};
const model = (text:string, meaning:string, sentences:ReleaseModel['sentences']):ReleaseModel => ({text,meaning,sentences,audio:''});
export const l15GuidedCards:ReleaseCard[] = [
 {id:l15GuidedCardIds[0],title:'แสดงความเป็นเจ้าของ',purpose:'เลือก sein หรือ ihr ตามเจ้าของ',notes:[],context:[['เจ้าของผู้ชาย','sein'],['เจ้าของผู้หญิง','ihr']],models:[],targetIds:['L15-possessivartikel-owner'],noun:null,wordAudio:null},
 ...l15GrammarLearningCards.map((card,index)=>({id:l15GuidedCardIds[index+1],title:card.title,purpose:card.summary.rule,notes:card.pages.map(page=>page.explanation),context:card.summary.rows,models:card.pages.flatMap(page=>page.examples.map(entry=>model(entry.sentence,entry.meaning,[entry.parts]))),targetIds:[...new Set(card.tasks.map(task=>task.targetId))],noun:null,wordAudio:null})),
];
const ownerTask = (owner:'anna'|'tom'):ReleaseTask => ({
 id:l15OwnerTaskIds[owner],version:1,targetId:'L15-possessivartikel-owner',subskill:'possessor_reference',difficulty:1,difficultyRationale:'มีเจ้าของและคำนามให้ เลือก sein หรือ ihr จากสองตัวเลือก',requiredCardIds:[l15GuidedCardIds[0]],kind:'choice',prompt:'ห้องของใคร ใช้คำไหน?',cue:owner==='anna'?'Anna เป็นเจ้าของห้อง':'Tom เป็นเจ้าของห้อง',context:[['เจ้าของ',owner==='anna'?'Anna':'Tom'],['ประโยค','_____ Zimmer']],options:['sein','ihr'],tokens:[],startWith:'',acceptedAnswers:[owner==='anna'?'ihr':'sein'],assistance:['ภาพเจ้าของ','ชื่อเจ้าของ','คำนามที่ให้','ตัวเลือก'],feedback:{reason:`เจ้าของคือ ${owner==='anna'?'Anna จึงใช้ ihr':'Tom จึงใช้ sein'}`,models:[]},noun:null,articleTarget:false,spelling:false,
 practice:{familyId:'L15-possessivartikel-owner:possessor_reference',contextId:l15OwnerTaskIds[owner],stage:0,unlock:null},
});
export const l15GuidedTasks:ReleaseTask[] = [ownerTask('anna'),ownerTask('tom'),...l15GrammarLearningCards.flatMap((card,index)=>card.tasks.map((task):ReleaseTask=>({
 id:task.id,version:task.version,targetId:task.targetId,subskill:task.subskill,difficulty:task.difficulty,difficultyRationale:task.difficultyRationale,requiredCardIds:[l15GuidedCardIds[index+1]],kind:task.kind,prompt:task.prompt,cue:task.context,context:[],options:task.kind==='choice'?task.options:[],tokens:task.kind==='order'?task.tokens:[],startWith:task.kind==='order'?'Ihren Sessel':'',acceptedAnswers:[task.answer],assistance:task.assistance,feedback:{reason:task.reason,models:[model(task.model.sentence,task.model.meaning,[task.model.parts])]},noun:null,articleTarget:false,spelling:false,practice:{familyId:`${task.targetId}:${task.subskill}`,contextId:task.id,stage:0,unlock:null},
})))];
export function attachL15GrammarLearning(course:ReleaseCourse):ReleaseCourse {
 return course.lessonId==='L15'&&course.skill==='grammar' ? {...course,cards:[...course.cards,...l15GuidedCards],tasks:[...course.tasks,...l15GuidedTasks]} : course;
}
