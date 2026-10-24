"use client";
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import catalog from '@/data/l13-phrases-catalog.json';
import {useLearning} from './learning-store';
import {useStore,isPhrasePracticeAvailable} from './store';
import {GrammarPilot} from './dative-pilot';
import {LearnActivity} from './learning-pages';
const previews={rating:'phraseRating',city:'phraseCity',favorite:'phraseFavorite',opinions:'phraseOpinions',basic:'phraseBasic',daily:'phraseDaily'} satisfies Record<string,Parameters<typeof GrammarPilot>[0]['topic']>;
export function L13PhrasePages({mode,slug}:{mode:'learn'|'practice';slug?:string}){
 const {user}=useStore();const history=useLearning();
 const learned=new Set(history.exposures.filter(e=>e.item_id.startsWith('L13-R')).map(e=>e.item_id));
 const group=catalog.groups.find(g=>g.slug===slug);const allLearned=catalog.groups.every(g=>g.ids.every(id=>learned.has(id)));
 if(mode==='learn'&&group){const index=catalog.groups.indexOf(group);return <LearnActivity lessonId="L13" skill="phrases" group={group.group} practiceHref={allLearned?'/practice/L13/phrases/basic':'/practice/L13/phrases/'+group.slug} nextGroupHref={catalog.groups[index+1]?'/learn/L13/phrases/'+catalog.groups[index+1].slug:undefined} />;}
 if(!history.ready||history.error)return <div role="status"><p>{history.error?'โหลดประวัติการเรียนไม่ได้ กรุณาลองใหม่':'กำลังโหลดประโยคที่คุณเรียนแล้ว…'}</p>{history.error&&<button className="button secondary" onClick={()=>{void history.reload();}}>ลองใหม่</button>}</div>;
 if(mode==='practice'&&!isPhrasePracticeAvailable(user))return <p>กำลังเตรียมแบบฝึกหัด</p>;
 const preview=slug==='rating'||slug==='city'||slug==='favorite'||slug==='opinions'||slug==='basic'||slug==='daily'?previews[slug]:null;
 if(mode==='practice'&&preview&&user)return <GrammarPilot userId={user.id} topic={preview} learnedItemIds={[...learned]} />;
 return <>
  {mode==='learn'&&allLearned&&isPhrasePracticeAvailable(user)&&<Link className="button primary" href="/practice/L13/phrases/basic">ทำแบบฝึกหัด</Link>}
  <div className="practice-grammar-topic-list">{catalog.groups.map(g=>{
   const count=g.ids.filter(id=>learned.has(id)).length;const available=mode==='learn'||count>0;
   const content=<><div><h2>{g.title}</h2><p>{mode==='learn'?`${count} / ${g.ids.length} ประโยคที่เรียนแล้ว`:count?`${count} ประโยคที่เรียนแล้ว · ครั้งละไม่เกิน 5 ข้อ`:'เรียนประโยคในหัวข้อนี้ก่อนเริ่มฝึก'}</p></div>{available&&<span>{mode==='learn'?'เรียนต่อ':'ทำแบบฝึกหัด'} <ArrowRight size={18}/></span>}</>;
   return available?<Link className="practice-grammar-topic" href={'/'+mode+'/L13/phrases/'+g.slug} key={g.slug}>{content}</Link>:<div className="practice-grammar-topic unavailable" key={g.slug}>{content}<Link href={'/learn/L13/phrases/'+g.slug}>ไปเรียน</Link></div>;
  })}</div>
 </>;
}
