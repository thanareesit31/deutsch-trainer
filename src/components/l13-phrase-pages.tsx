"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import catalog from '@/data/l13-phrases-catalog.json';
import {useLearning} from './learning-store';
import {useStore,isPhrasePracticeAvailable} from './store';
import {GrammarPilot} from './dative-pilot';
import {LearnActivity} from './learning-pages';
import {readL13PracticeHistory,recommendPractice,resumablePracticeSession} from '@/lib/practice-planner';
import {PhrasePracticeInsights,ResumePracticeDialog,type PhrasePracticeEvidence} from './phrase-practice-ui';
const previews={rating:'phraseRating',city:'phraseCity',favorite:'phraseFavorite',opinions:'phraseOpinions',basic:'phraseBasic',daily:'phraseDaily'} satisfies Record<string,Parameters<typeof GrammarPilot>[0]['topic']>;
type Recommendation=ReturnType<typeof recommendPractice>|{kind:'learn';title:string;description:string;href:string;action:string};
export function L13PhrasePages({mode,slug}:{mode:'learn'|'practice';slug?:string}){
 const {user}=useStore();const history=useLearning();
 const learned=new Set(history.exposures.filter(e=>e.item_id.startsWith('L13-R')).map(e=>e.item_id));
 const group=catalog.groups.find(g=>g.slug===slug);const allLearned=catalog.groups.every(g=>g.ids.every(id=>learned.has(id)));
 const [recommendation,setRecommendation]=useState<Recommendation|null>(null);
 const [evidence,setEvidence]=useState<PhrasePracticeEvidence[]>([]);
 const [resumeProgress,setResumeProgress]=useState<{done:number;total:number}|null>(null);
 const [showResume,setShowResume]=useState(true);
 useEffect(()=>{
  if(mode!=='practice'||slug||!history.ready||!user||!isPhrasePracticeAvailable(user))return;
  if(!learned.size){setRecommendation({kind:'learn',title:'เริ่มเรียนประโยคและสำนวนบท 13',description:'เรียนประโยคก่อน แล้วกลับมาฝึกจากสิ่งที่เรียนแล้ว',href:'/learn/L13/phrases',action:'ไปเรียน'});return;}
  const questions=catalog.questions.filter(question=>(question.requiredItemIds??[question.itemId]).every(id=>learned.has(id)));
  const sessions=readL13PracticeHistory(user.id,localStorage,'phrases');
  setRecommendation(recommendPractice(questions,sessions));
  setEvidence(sessions.flatMap(session=>session.items.flatMap(item=>item.result?.correct===true||item.result?.correct===false?[{correct:item.result.correct,topic:catalog.groups.find(g=>item.question.topicId.endsWith(g.slug))?.title??'ประโยคและสำนวน',at:item.result.submittedAt}]:[])).sort((a,b)=>b.at-a.at).slice(0,20).map(({correct,topic})=>({correct,topic})));
  const pending=resumablePracticeSession(sessions);
  setResumeProgress(pending?{done:pending.items.filter(item=>item.result).length,total:pending.items.length}:null);
 },[mode,slug,history.ready,history.exposures,user]);
 if(mode==='learn'&&group){const index=catalog.groups.indexOf(group);return <LearnActivity lessonId="L13" skill="phrases" group={group.group} practiceHref={allLearned?'/practice/L13/phrases/basic':'/practice/L13/phrases/'+group.slug} nextGroupHref={catalog.groups[index+1]?'/learn/L13/phrases/'+catalog.groups[index+1].slug:undefined} />;}
 if(!history.ready||history.error)return <div role="status"><p>{history.error?'โหลดประวัติการเรียนไม่ได้ กรุณาลองใหม่':'กำลังโหลดประโยคที่คุณเรียนแล้ว…'}</p>{history.error&&<button className="button secondary" onClick={()=>{void history.reload();}}>ลองใหม่</button>}</div>;
 if(mode==='practice'&&!isPhrasePracticeAvailable(user))return <p>กำลังเตรียมแบบฝึกหัด</p>;
 const preview=slug==='rating'||slug==='city'||slug==='favorite'||slug==='opinions'||slug==='basic'||slug==='daily'?previews[slug]:null;
 if(mode==='practice'&&preview&&user)return <GrammarPilot userId={user.id} topic={preview} learnedItemIds={[...learned]} />;
 if(mode==='practice'){
  if(!recommendation)return <main className="l14-practice-entry"><section className="l14-practice-entry-main" aria-busy="true"><p className="eyebrow">REDEMITTEL · LEKTION 13</p><h1>กำลังเตรียมชุดฝึกของคุณ…</h1></section></main>;
  return <main className="l14-practice-entry">
   <section className="l14-practice-entry-main" aria-label="ชุดฝึกแนะนำ">
    <PhrasePracticeInsights evidence={evidence} recommendation={recommendation.description}/>
    <Link className="button primary" href={recommendation.href} onClick={recommendation.kind==='resume'&&resumeProgress?.done?event=>{event.preventDefault();setShowResume(true);}:undefined}>{recommendation.kind==='resume'&&!resumeProgress?.done?'เริ่มฝึก':recommendation.kind==='resume'?'ฝึกต่อ':recommendation.action}<ArrowRight size={18}/></Link>
   </section>
   <details className="l14-practice-entry-topics"><summary>ฝึกเฉพาะหัวข้อ</summary><div className="practice-grammar-topic-list">{catalog.groups.map(g=>{
    const count=g.ids.filter(id=>learned.has(id)).length;
    const content=<><div><h2>{g.title}</h2><p>{count?`${count} ประโยคที่เรียนแล้ว · ครั้งละไม่เกิน 5 ข้อ`:'เรียนประโยคในหัวข้อนี้ก่อนเริ่มฝึก'}</p></div>{count>0&&<span>ทำแบบฝึกหัด <ArrowRight size={18}/></span>}</>;
    return count>0?<Link className="practice-grammar-topic" href={`/practice/L13/phrases/${g.slug}`} key={g.slug}>{content}</Link>:<div className="practice-grammar-topic unavailable" key={g.slug}>{content}<Link href={`/learn/L13/phrases/${g.slug}`}>ไปเรียน</Link></div>;
   })}</div></details>
   {recommendation.kind==='resume'&&resumeProgress&&resumeProgress.done>0&&showResume&&<ResumePracticeDialog href={recommendation.href} done={resumeProgress.done} total={resumeProgress.total} onClose={()=>setShowResume(false)}/>}
  </main>;
 }
 return <>
  {mode==='learn'&&allLearned&&isPhrasePracticeAvailable(user)&&<Link className="button primary" href="/practice/L13/phrases/basic">ทำแบบฝึกหัด</Link>}
  <div className="practice-grammar-topic-list">{catalog.groups.map(g=>{
   const count=g.ids.filter(id=>learned.has(id)).length;const available=mode==='learn'||count>0;
   const content=<><div><h2>{g.title}</h2><p>{mode==='learn'?`${count} / ${g.ids.length} ประโยคที่เรียนแล้ว`:count?`${count} ประโยคที่เรียนแล้ว · ครั้งละไม่เกิน 5 ข้อ`:'เรียนประโยคในหัวข้อนี้ก่อนเริ่มฝึก'}</p></div>{available&&<span>{mode==='learn'?'เรียนต่อ':'ทำแบบฝึกหัด'} <ArrowRight size={18}/></span>}</>;
   return available?<Link className="practice-grammar-topic" href={'/'+mode+'/L13/phrases/'+g.slug} key={g.slug}>{content}</Link>:<div className="practice-grammar-topic unavailable" key={g.slug}>{content}<Link href={'/learn/L13/phrases/'+g.slug}>ไปเรียน</Link></div>;
  })}</div>
 </>;
}
