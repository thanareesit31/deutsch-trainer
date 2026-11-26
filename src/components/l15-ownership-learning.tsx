"use client";

import Image from 'next/image';
import { ArrowRight, ChevronLeft, Volume2 } from 'lucide-react';
import { useVocabularyAudio } from './vocabulary-audio';

import type {Owner,OwnerAnswer as Answer,OwnerView as View,OwnerProgress} from '@/lib/l15-grammar-state';
const people = {
  tom: { name: 'Tom', thai: 'ทอม', gender: 'ผู้ชาย', word: 'sein', meaning: 'ห้องของเขา' },
  anna: { name: 'Anna', thai: 'อันนา', gender: 'ผู้หญิง', word: 'ihr', meaning: 'ห้องของเธอ' },
};

function OwnershipPicture({ owner, compact = false }: { owner: Owner; compact?: boolean }) {
  const person = people[owner];
  return <figure className={`ownership-picture ownership-room${compact ? ' ownership-picture--compact' : ''}`}>
    <div className={`ownership-scene ownership-scene--${owner}`}>
      <Image src="/images/l15-ownership-preview/owners-in-room-v2.png" width={1536} height={1024} alt={`${person.name} ยืนในห้องของ${person.thai}`} unoptimized />
    </div>
    <figcaption><span lang="de">{person.name}</span> · ห้องของ{person.thai}</figcaption>
  </figure>;
}

export function L15OwnershipLearning({ progress, onChange, onNextCard }: { progress:OwnerProgress; onChange:(patch:Partial<OwnerProgress>)=>void; onNextCard:()=>void }) {
  const {view,testOwner,responses}=progress;
  const { play, error } = useVocabularyAudio();
  const ready=[0,1,2].every(step=>progress.seen.includes(step));
  function setView(next:View) {
    const seen=next.kind==='learn'?[...new Set([...progress.seen,next.step])]:progress.seen;
    const reviewed=next.kind==='learn'&&view.kind==='try'?[...new Set([...progress.reviewed,view.owner])]:progress.reviewed;
    onChange({view:next,seen,reviewed});
  }
  function openTest(current: Owner) {
    if(!ready){const step=![...progress.seen].includes(0)?0:!progress.seen.includes(1)?1:2;setView({kind:'learn',step});return;}
    const answer = responses[current];
    onChange({testOwner:current,view:answer?{kind:'feedback',owner:current,answer}:{kind:'try',owner:current,answer:progress.drafts[current]??null}});
  }
  const page = view.kind === 'learn' ? view.step + 1 : view.owner === 'anna' ? 4 : 5;
  const owner = view.kind === 'learn' ? view.step === 1 ? 'anna' : 'tom' : view.owner;
  const person = people[owner];
  function listen(current: Owner) { play(`${people[current].word} Zimmer`); }
  function back() {
    if (view.kind !== 'learn' && view.owner === 'tom') openTest('anna');
    else if (view.kind !== 'learn') setView({ kind: 'learn', step: 2 });
    else if (view.step === 2) setView({ kind: 'learn', step: 1 });
    else if (view.step === 1) setView({ kind: 'learn', step: 0 });
  }
  return <main className="guided-learning ownership-preview">
    <nav className="learning-category-tabs" aria-label="หัวข้อที่กำลังเรียน">
      {([0, 1, 2] satisfies (0 | 1 | 2)[]).map(step => <button key={step} aria-current={view.kind === 'learn' && view.step === step ? 'page' : undefined} onClick={() => setView({kind: 'learn', step})}><span className="category-tab-german" lang={step === 2 ? 'th' : 'de'}>{['sein', 'ihr', 'สรุป'][step]}</span><span className="category-tab-thai">{['ของเขา', 'ของเธอ', 'เทียบเจ้าของ'][step]}</span></button>)}
      <button disabled={!ready} aria-current={view.kind !== 'learn' ? 'page' : undefined} onClick={() => openTest(testOwner)}><span className="category-tab-german">ทดสอบ</span></button>
    </nav>
    <div className="vocabulary-image-progress">
      <span>{page} / 5</span>
      <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{width:`${page * 20}%`}} /></div>
    </div>
    <section className="guided-card ownership-teaching-card">
      <header className="ownership-heading">
        <h1>{view.kind === 'learn' ? view.step === 2 ? 'เลือก sein หรือ ihr ตามเจ้าของ ไม่ใช่เพศของสิ่งของ' : 'แสดงความเป็นเจ้าของ' : 'ห้องของใคร ใช้คำไหน?'}</h1>

      </header>
      {view.kind === 'learn' && view.step === 2 ? <>
        <table className="ownership-summary-table" aria-label="เลือกคำตามเจ้าของ">
          <thead><tr><th scope="col">เจ้าของ</th><th scope="col">ใช้คำ</th><th scope="col">ตัวอย่าง</th></tr></thead>
          <tbody>{(['tom', 'anna'] satisfies Owner[]).map(current => <tr key={current}>
            <th scope="row">{people[current].gender}<span lang="de">{people[current].name}</span></th>
            <td><strong lang="de">{people[current].word}</strong><span>ของ{current === 'tom' ? 'เขา' : 'เธอ'}</span></td>
            <td><span className="ownership-summary-example" lang="de">{people[current].word} Zimmer<button className="ownership-sentence-audio" onClick={() => listen(current)} aria-label={`ฟัง ${people[current].word} Zimmer`}><Volume2 size={18} /></button></span></td>
          </tr>)}</tbody>
        </table>
      </> : <>
        <div className="ownership-detail-layout"><OwnershipPicture owner={owner} /><div className="ownership-detail-copy">
        {view.kind === 'learn' ? <>
          <div className="ownership-phrase">
            <p lang="de"><strong>{person.word}</strong> Zimmer</p><span>ใช้บอกว่าเป็นของ{owner === 'tom' ? 'เขา' : 'เธอ'}</span>
            <button className="ownership-audio" onClick={() => listen(owner)} aria-label={`ฟัง ${person.word} Zimmer`}><Volume2 size={22} /></button>
          </div>
          <div className="ownership-example"><p lang="de">Das ist {person.word} Zimmer.<button className="ownership-sentence-audio" onClick={() => play(`Das ist ${person.word} Zimmer.`)} aria-label="ฟังประโยคตัวอย่าง"><Volume2 size={18} /></button></p><p>นี่คือห้องของ{owner === 'tom' ? 'เขา' : 'เธอ'}</p></div>
        </> : <>
          {view.kind === 'try' && <>
            <p className="ownership-question" lang="de"><span className="ownership-blank">_____</span> Zimmer</p>
            <div className="ownership-options" aria-label="เลือกคำแสดงความเป็นเจ้าของ">{(['sein', 'ihr'] satisfies Answer[]).map(answer => <button key={answer} className={`button secondary${view.answer === answer ? ' selected' : ''}`} aria-pressed={view.answer === answer} onClick={() => onChange({view:{...view,answer},drafts:{...progress.drafts,[view.owner]:answer}})} lang="de">{answer}</button>)}</div>
          </>}
          {view.kind === 'feedback' && <div className="ownership-feedback" role="status">
            <h2>{view.answer === person.word ? 'ถูกต้อง' : 'ลองเทียบกับเจ้าของห้อง'}</h2>
            <p>คุณเลือก <span lang="de">{view.answer}</span></p>
            <div className="ownership-phrase"><p lang="de"><strong>{person.word}</strong> Zimmer</p><span>{person.meaning}</span><button className="ownership-audio" onClick={() => listen(owner)} aria-label={`ฟัง ${person.word} Zimmer`}><Volume2 size={20} /></button></div>
            <p>ห้องเป็นของ{person.thai} จึงใช้ <strong lang="de">{person.word}</strong></p>
          </div>}
        </>}
        </div></div>
      </>}
      {error && <p role="alert">{error}</p>}
    </section>
    <footer className="ownership-footer" aria-label="ควบคุมบทเรียน">
      <button className="button secondary" disabled={view.kind === 'learn' && view.step === 0} onClick={back}><ChevronLeft size={18} />ย้อนกลับ</button>
      {view.kind === 'learn' && <button className="button primary" onClick={() => {if (view.step === 2) openTest(testOwner); else setView({kind:'learn', step:view.step === 0 ? 1 : 2});}}>หน้าถัดไป<ArrowRight size={18} /></button>}
      {view.kind === 'try' && <button className="button primary" disabled={!view.answer} onClick={() => {if (view.answer) {onChange({responses:{...responses,[view.owner]:view.answer},view:{kind:'feedback',owner:view.owner,answer:view.answer}});}}}>ตรวจคำตอบ</button>}
      {view.kind === 'feedback' && view.owner === 'anna' && <button className="button primary" onClick={() => openTest('tom')}>หน้าถัดไป<ArrowRight size={18} /></button>}
      {view.kind === 'feedback' && view.owner === 'tom' && <button className="button primary" disabled={!onNextCard} onClick={onNextCard}>หน้าถัดไป<ArrowRight size={18} /></button>}
    </footer>
  </main>;
}
