import {l15GrammarLearningCards} from '@/data/l15-grammar-learning';
import {l15GuidedCardIds,l15GuidedTasks,l15OwnerTaskIds} from './l15-grammar-catalog';
import type {ReleaseAttempt,ReleaseState} from './a13-release';

export type Owner='anna'|'tom';
export type OwnerAnswer='sein'|'ihr';
export type OwnerView={kind:'learn';step:0|1|2}|{kind:'try';owner:Owner;answer:OwnerAnswer|null}|{kind:'feedback';owner:Owner;answer:OwnerAnswer};
export type OwnerProgress={view:OwnerView;testOwner:Owner;responses:Partial<Record<Owner,OwnerAnswer>>;drafts:Partial<Record<Owner,OwnerAnswer>>;seen:number[];reviewed:Owner[]};
export type GuidedResponse={kind:'draft';text:string;selection:number[];reviewed:boolean}|{kind:'checked';text:string;selection:number[];reviewed:boolean;correct:boolean;taskId:string;version:1;targetId:string;subskill:string};
export type GrammarProgress={page:number;testPage:number;seen:number[];responses:Record<string,GuidedResponse>};
export type L15GuidedState={version:1;updatedAt:string;active:number;complete:boolean;owner:OwnerProgress;cards:Record<string,GrammarProgress>};
export const emptyGrammarProgress=(pages:number):GrammarProgress=>({page:0,testPage:pages+1,seen:[],responses:{}});
export const emptyL15GuidedState=():L15GuidedState=>({version:1,updatedAt:new Date(0).toISOString(),active:0,complete:false,owner:{view:{kind:'learn',step:0},testOwner:'anna',responses:{},drafts:{},seen:[0],reviewed:[]},cards:Object.fromEntries(l15GrammarLearningCards.map(card=>[card.id,emptyGrammarProgress(card.pages.length)]))});
const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const integer=(value:unknown,max:number):value is number=>typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<=max;
const owner=(value:unknown):value is Owner=>value==='anna'||value==='tom';
const answer=(value:unknown):value is OwnerAnswer=>value==='sein'||value==='ihr';
function numbers(value:unknown,max:number):number[]{if(!Array.isArray(value)||!value.every(entry=>integer(entry,max))||new Set(value).size!==value.length)throw Error('ข้อมูลลำดับบทเรียนไม่สมบูรณ์');return value;}
export const guidedAttemptId=(taskId:string)=>`l15-guided-v1:${taskId}`;
function checkedAttempt(attempts:readonly ReleaseAttempt[],taskId:string,text:string){
 const attempt=attempts.find(entry=>entry.id===guidedAttemptId(taskId));
 if(!attempt||attempt.taskId!==taskId||attempt.response!==text)throw Error('คำตอบแรกไม่ตรงกับหลักฐานที่บันทึก');
 return attempt;
}
export function parseL15GuidedState(value:unknown,attempts:readonly ReleaseAttempt[]):L15GuidedState {
 if(!record(value)||value.version!==1||typeof value.updatedAt!=='string'||!Number.isFinite(Date.parse(value.updatedAt))||!integer(value.active,4)||typeof value.complete!=='boolean'||!record(value.owner)||!record(value.cards))throw Error('ข้อมูลหน้าสอนไม่สมบูรณ์');
 const source=value.owner;
 if(!record(source.view)||!owner(source.testOwner)||!record(source.responses)||!record(source.drafts)||!Array.isArray(source.reviewed)||!source.reviewed.every(owner))throw Error('ข้อมูลการเรียนเรื่องเจ้าของไม่สมบูรณ์');
 let view:OwnerView;
 const v=source.view;
 if(v.kind==='learn'&&(v.step===0||v.step===1||v.step===2))view={kind:'learn',step:v.step};
 else if(v.kind==='try'&&owner(v.owner)&&(v.answer===null||answer(v.answer)))view={kind:'try',owner:v.owner,answer:v.answer};
 else if(v.kind==='feedback'&&owner(v.owner)&&answer(v.answer))view={kind:'feedback',owner:v.owner,answer:v.answer};
 else throw Error('ข้อมูลหน้าที่ค้างไม่สมบูรณ์');
 const responses:OwnerProgress['responses']={};
 for(const [key,text]of Object.entries(source.responses)){
  if(!owner(key)||!answer(text))throw Error('คำตอบเรื่องเจ้าของไม่สมบูรณ์');
  checkedAttempt(attempts,l15OwnerTaskIds[key],text);responses[key]=text;
 }
 const drafts:OwnerProgress['drafts']={};
 for(const [key,text]of Object.entries(source.drafts)){if(!owner(key)||!answer(text))throw Error('ร่างคำตอบไม่สมบูรณ์');drafts[key]=text;}
 if(view.kind==='feedback'&&responses[view.owner]!==view.answer)throw Error('ไม่พบผลตรวจคำตอบเดิม');
 const cards:Record<string,GrammarProgress>={};
 for(const card of l15GrammarLearningCards){
  const state=value.cards[card.id];
  if(!record(state)||!integer(state.page,card.pages.length+2)||!integer(state.testPage,card.pages.length+2)||state.testPage<=card.pages.length||!record(state.responses))throw Error('ข้อมูลการ์ดไม่สมบูรณ์');
  const firsts:Record<string,GuidedResponse>={};
  for(const [id,raw]of Object.entries(state.responses)){
   const task=card.tasks.find(entry=>entry.id===id);
   if(!task||!record(raw)||typeof raw.text!=='string'||typeof raw.reviewed!=='boolean')throw Error('ไม่พบโจทย์ที่บันทึก');
   const selection=numbers(raw.selection,task.kind==='order'?task.tokens.length-1:0);
   if(task.kind!=='order'&&selection.length)throw Error('ข้อมูลคำตอบไม่สมบูรณ์');
   if(task.kind==='order'&&selection.map(index=>task.tokens[index]).join(' ')!==raw.text)throw Error('คำเรียงไม่ตรงกับร่าง');
   if(raw.kind==='draft')firsts[id]={kind:'draft',text:raw.text,selection,reviewed:raw.reviewed};
   else if(raw.kind==='checked'){
    const attempt=checkedAttempt(attempts,id,raw.text);
    if(raw.correct!==attempt.correct||raw.taskId!==id||raw.version!==1||raw.targetId!==task.targetId||raw.subskill!==task.subskill)throw Error('ผลตรวจคำตอบไม่ตรงกับโจทย์');
    firsts[id]={kind:'checked',text:raw.text,selection,reviewed:raw.reviewed,correct:attempt.correct,taskId:id,version:1,targetId:task.targetId,subskill:task.subskill};
   }else throw Error('สถานะคำตอบไม่สมบูรณ์');
  }
  cards[card.id]={page:state.page,testPage:state.testPage,seen:numbers(state.seen,card.pages.length),responses:firsts};
 }
 return {version:1,updatedAt:value.updatedAt,active:value.active,complete:value.complete,owner:{view,testOwner:source.testOwner,responses,drafts,seen:numbers(source.seen,2),reviewed:source.reviewed},cards};
}
export function mergeL15GuidedState(remote:L15GuidedState|undefined,pending:L15GuidedState|undefined):L15GuidedState|undefined {
 if(!remote)return pending;if(!pending)return remote;
 const latest=Date.parse(pending.updatedAt)>=Date.parse(remote.updatedAt)?pending:remote;
 const cards={...latest.cards};
 for(const card of l15GrammarLearningCards){
  const firsts={...remote.cards[card.id].responses,...pending.cards[card.id].responses};
  for(const [id,response]of Object.entries(remote.cards[card.id].responses))if(response.kind==='checked')firsts[id]=response;
  cards[card.id]={...latest.cards[card.id],seen:[...new Set([...remote.cards[card.id].seen,...pending.cards[card.id].seen])],responses:firsts};
 }
 return {...latest,cards,owner:{...latest.owner,seen:[...new Set([...remote.owner.seen,...pending.owner.seen])],reviewed:[...new Set([...remote.owner.reviewed,...pending.owner.reviewed])],responses:{...pending.owner.responses,...remote.owner.responses}}};
}
export function commitL15GuidedState(base:ReleaseState,guided:L15GuidedState):ReleaseState {
 const learned=new Set(base.learned),attempts=[...base.attempts];
 const add=(taskId:string,text:string,reviewed:boolean)=>{
  const task=l15GuidedTasks.find(entry=>entry.id===taskId);
  if(!task||!task.requiredCardIds.every(id=>learned.has(id)))throw Error('เรียนหน้าสอนให้ครบก่อนทดสอบ');
  const id=guidedAttemptId(taskId),saved=attempts.find(entry=>entry.id===id);
  if(saved){if(saved.response!==text)throw Error('คำตอบแรกเปลี่ยนไม่ได้');return;}
  attempts.push({id,taskId,response:text,correct:task.acceptedAnswers.some(answer=>answer.normalize('NFC').trim().toLocaleLowerCase('de')===text.normalize('NFC').trim().toLocaleLowerCase('de')),helpUsed:reviewed,submittedAt:new Date().toISOString(),selectionReason:'ลองใช้สิ่งที่เพิ่งเรียนในบท 15'});
 };
 if(guided.owner.view.kind!=='learn'&&guided.owner.seen.length===3)learned.add(l15GuidedCardIds[0]);
 for(const current of ['anna','tom'] satisfies Owner[])if(guided.owner.responses[current])add(l15OwnerTaskIds[current],guided.owner.responses[current],guided.owner.reviewed.includes(current));
 for(const [index,card]of l15GrammarLearningCards.entries()){
  const progress=guided.cards[card.id];
  if(progress.page>card.pages.length&&progress.seen.length===card.pages.length+1)learned.add(l15GuidedCardIds[index+1]);
  for(const [id,response]of Object.entries(progress.responses))if(response.kind==='checked')add(id,response.text,response.reviewed);
 }
 const completed=[Object.keys(guided.owner.responses).length===2,...l15GrammarLearningCards.map(card=>card.tasks.every(task=>guided.cards[card.id].responses[task.id]?.kind==='checked'))];
 if(!completed.slice(0,guided.active).every(Boolean)||guided.complete&&!completed.every(Boolean))throw Error('ทำคำตอบของการ์ดก่อนหน้าให้ครบก่อน');
 if(completed.every(Boolean))learned.add('L15-possessivartikel');
 const state={...base,learned:[...learned],attempts,guidedL15:guided};
 parseL15GuidedState(guided,attempts);
 return state;
}
