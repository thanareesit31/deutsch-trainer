"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import {useLessonState} from './lesson-state-provider';
import {gradeReleaseTask,parseReleaseState,mergeReleaseStates,releaseStateKey,type ReleaseCourse} from '@/lib/a13-release';
import {emptyL15GuidedState,commitL15GuidedState,type GrammarProgress,type GuidedResponse as Response,type L15GuidedState} from '@/lib/l15-grammar-state';
import {l15GuidedTasks} from '@/lib/l15-grammar-catalog';
import { ArrowRight, ChevronLeft, Volume2 } from 'lucide-react';
import { l15GrammarLearningCards, type L15LearningCard, type L15LearningTask } from '@/data/l15-grammar-learning';
import { L15OwnershipLearning } from './l15-ownership-learning';
import { AnnotatedReply } from './phrase-sentence';
import { useVocabularyAudio } from './vocabulary-audio';
import { NounText } from './noun-text';
import { ArticleLegend } from './profession-matching';
import type { Item } from '@/lib/content';

const emptyDraft = ():Response => ({kind:'draft',text:'',selection:[],reviewed:false});
function ContextText({text}: {text:string}) {
  return <>{text.split(/(der Sessel|der Balkon|das Zimmer|die Lampe[n]?)/u).map((part,index) => {
    const plural = part === 'die Lampen';
    const item: Item | undefined = plural ? {id:'',lessonId:'L15',skill:'vocabulary',group:'',title:part,answer:part,meaning:'',article:'die',word:'Lampen',pluralOnly:true} : undefined;
    return /^(der|die|das) /u.test(part) ? <NounText key={index} text={part} item={item} /> : <span key={index}>{part}</span>;
  })}</>;
}
function GrammarCard({card, number, progress, onChange, onPrevious, onNext}: {card:L15LearningCard; number:number; progress:GrammarProgress; onChange:(patch:Partial<GrammarProgress>)=>void; onPrevious:()=>void; onNext:()=>void}) {
  const {page,testPage,responses}=progress;
  const ready=Array.from({length:card.pages.length+1},(_,index)=>index).every(index=>progress.seen.includes(index));
  const setResponses=(responses:GrammarProgress['responses'])=>onChange({responses});
  const {play,error} = useVocabularyAudio();
  const summaryAt = card.pages.length;
  const task = card.tasks[page-summaryAt-1];
  const response = task ? responses[task.id] ?? emptyDraft() : null;
  const lessonPage = card.pages[page];
  const total = card.pages.length+1+card.tasks.length;
  function go(next:number) {
    if (next <= summaryAt && task && response?.kind === 'draft') setResponses({...responses,[task.id]:{...response,reviewed:true}});
    if(next>summaryAt&&!ready){next=Array.from({length:summaryAt+1},(_,index)=>index).find(index=>!progress.seen.includes(index))??0;}
    onChange({page:next,...(next>summaryAt?{testPage:next}:{seen:[...new Set([...progress.seen,next])]})});
  }
  function update(draft:Response) { if (task) setResponses({...responses,[task.id]:draft}); }
  function check() {
    if (!task || !response || response.kind === 'checked' || !response.text.trim()) return;
    update({...response,kind:'checked',correct:gradeReleaseTask(l15GuidedTasks.find(entry=>entry.id===task.id)??missingTask(),response.text),taskId:task.id,version:task.version,targetId:task.targetId,subskill:task.subskill});
  }
  const examples = lessonPage?.examples ?? (task && response?.kind === 'checked' ? [task.model] : []);
  return <main className="guided-learning ownership-preview l15-continuation" data-card={card.id}>
    <div className="l15-card-title">การ์ด {number} / 5 · {card.title}</div>
    <nav className="learning-category-tabs" aria-label="หัวข้อที่กำลังเรียน">
      <button aria-current={page===0?'page':undefined} onClick={()=>go(0)}>หลักการ</button>
      <button aria-current={page>0&&page<summaryAt?'page':undefined} onClick={()=>go(1)}>ตัวอย่าง</button>
      <button aria-current={page===summaryAt?'page':undefined} onClick={()=>go(summaryAt)}>สรุป</button>
      <button disabled={!ready} aria-current={page>summaryAt?'page':undefined} onClick={()=>go(testPage)}>ทดสอบ</button>
    </nav>
    <div className="vocabulary-image-progress"><span>{page+1} / {total}</span><div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{width:`${(page+1)/total*100}%`}} /></div></div>
    <ArticleLegend />
    <section className="guided-card ownership-teaching-card">
      <header className={`ownership-heading${response?.kind==='checked' ? ' l15-checked-heading' : ''}`}><h1>{lessonPage?.title ?? (page===summaryAt?card.title:task?.prompt)}</h1></header>
      {page===summaryAt ? <><table className="ownership-summary-table"><thead><tr>{card.summary.headers.map(header=><th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{card.summary.rows.map(row=><tr key={row[0]}>{row.map((cell,index)=>index===0?<th scope="row" key={index}><ContextText text={cell}/></th>:<td key={index}><ContextText text={cell}/></td>)}</tr>)}</tbody></table><p className="l15-summary-note">{card.summary.rule}</p></> : <>
        <div className="ownership-detail-layout l15-explanation-layout">
          <aside className="l15-context"><ContextText text={lessonPage?.context ?? (response?.kind==='checked' ? task?.context.split('\n').filter(line=>!line.includes('_____')).join('\n') : task?.context) ?? ''}/>{lessonPage && <p className="l15-explanation">{lessonPage.explanation}</p>}{task && response?.kind==='checked' && <div className="ownership-feedback" role="status"><h2>{response.correct?'ถูกต้อง':'ลองเทียบกับตัวอย่าง'}</h2><p>คุณตอบ <span lang="de">{response.text}</span></p><p>{task.reason}</p></div>}</aside>
          <div className="ownership-detail-copy">
            {task && response && response.kind==='draft' && <div className="l15-response">
              {task.kind==='choice' && <div className="ownership-options">{task.options.map(option=><button className={`button secondary${response.text===option?' selected':''}`} key={option} aria-pressed={response.text===option} onClick={()=>update({...response,text:option})}>{option}</button>)}</div>}
              {task.kind==='write' && <label>คำตอบ<input autoComplete="off" spellCheck={false} value={response.text} onChange={event=>update({...response,text:event.target.value})} /></label>}
              {task.kind==='order' && <>
                <div className="l15-order-answer" aria-label="ประโยคที่เรียง">{response.selection.map((index,at)=><button key={index} onClick={()=>{const selection=response.selection.filter((_,position)=>position!==at);update({...response,selection,text:selection.map(index=>task.tokens[index]).join(' ')});}}>{task.tokens[index]}</button>)}</div>
                <div className="l15-order-tokens" aria-label="คำที่ให้">{task.tokens.map((token,index)=><button key={index} disabled={response.selection.includes(index)} onClick={()=>{const selection=[...response.selection,index];update({...response,selection,text:selection.map(index=>task.tokens[index]).join(' ')});}}>{token}</button>)}</div>
              </>}
            </div>}

            {examples.map(model=><div className="ownership-example l15-annotated-model" key={model.sentence}><AnnotatedReply sentences={[model.parts]}/><div className="l15-model-meaning"><span>{model.meaning}</span><button className="ownership-sentence-audio" onClick={()=>play(model.sentence)} aria-label={`ฟัง ${model.sentence}`}><Volume2 size={18}/></button></div></div>)}
          </div>
        </div>
      </>}
      {error && <p role="alert">{error}</p>}
    </section>
    <footer className="ownership-footer" aria-label="ควบคุมบทเรียน"><button className="button secondary" onClick={()=>page===0?onPrevious():go(page-1)}><ChevronLeft size={18}/>ย้อนกลับ</button>
      {response?.kind==='draft'?<button className="button primary" disabled={!response.text.trim()} onClick={check}>ตรวจคำตอบ</button>:<button className="button primary" onClick={()=>page+1===total?onNext():go(page+1)}>หน้าถัดไป<ArrowRight size={18}/></button>}
    </footer>
  </main>;
}

export function L15GrammarLearning({course}:{course:ReleaseCourse}) {
  const storage=useLessonState();
  const key=releaseStateKey(course);
  const [state,setState]=useState(()=>parseReleaseState(storage.read(key),course));
  const current=useRef(state);
  const guided=state.guidedL15??emptyL15GuidedState();
  function update(change:(value:L15GuidedState)=>L15GuidedState) {
    const remote=parseReleaseState(storage.read(key),course);
    const base=mergeReleaseStates(remote,current.current);
    const next=commitL15GuidedState(base,{...change(base.guidedL15??emptyL15GuidedState()),updatedAt:new Date().toISOString()});
    current.current=next;setState(next);storage.write(key,JSON.stringify(next));
  }
  function enter(active:number) {
    update(value=>{const card=l15GrammarLearningCards[active-1];return {...value,active,...(card?{cards:{...value.cards,[card.id]:{...value.cards[card.id],seen:[...new Set([...value.cards[card.id].seen,0])]}}}:{})};});
  }
  return <div className="l15-grammar-preview-course">
    <div hidden={guided.active!==0||guided.complete}><L15OwnershipLearning progress={guided.owner} onChange={patch=>update(value=>({...value,owner:{...value.owner,...patch}}))} onNextCard={()=>enter(1)}/></div>
    {l15GrammarLearningCards.map((card,index)=><div key={card.id} hidden={guided.active!==index+1||guided.complete}><GrammarCard card={card} number={index+2} progress={guided.cards[card.id]} onChange={patch=>update(value=>({...value,cards:{...value.cards,[card.id]:{...value.cards[card.id],...patch}}}))} onPrevious={()=>enter(index)} onNext={()=>index+1===l15GrammarLearningCards.length?update(value=>({...value,complete:true})):enter(index+2)}/></div>)}
    {guided.complete && <main className="guided-learning ownership-preview"><section className="guided-card ownership-teaching-card"><h1>เรียนครบเรื่อง sein / ihr แล้ว</h1><p>เลือกคำตามเจ้าของ แล้วดูเพศ จำนวน และหน้าที่ของคำนามในประโยค</p></section><footer className="ownership-footer"><button className="button secondary" onClick={()=>update(value=>({...value,complete:false}))}>ย้อนกลับ</button><Link className="button primary" href="/practice/L15/grammar">ฝึกสิ่งที่เรียนแล้ว<ArrowRight size={18}/></Link><button className="button secondary" onClick={()=>update(value=>({...value,complete:false,active:0}))}>กลับไปดูการ์ดแรก</button></footer></main>}
  </div>;
}
function missingTask():never {throw Error('ไม่พบโจทย์บทเรียน');}
