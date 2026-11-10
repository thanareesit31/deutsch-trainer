"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { a13ReleaseCourses } from '@/data/a13-release';
import { gradeReleaseTask, parseReleaseState, releaseOrderIndices, releaseStateKey, selectReleaseTask, type ReleaseCard, type ReleaseCourse, type ReleaseModel, type ReleaseState } from '@/lib/a13-release';
import { AnnotatedReply } from './phrase-sentence';
import { DialogueAudio } from './phrase-dialogue-media';
import { useLessonState } from './lesson-state-provider';
import { NounPrefix, NounText } from './noun-text';
import { ArticleLegend } from './profession-matching';
import type { Item } from '@/lib/content';
import { useStore } from './store';
import { readL13PracticeHistory, type PracticeHistory } from '@/lib/practice-planner';

export function findReleaseCourse(lessonId: string, skill: string): ReleaseCourse | undefined {
  return process.env.NEXT_PUBLIC_A13_RELEASE_LESSONS === 'false' ? undefined : a13ReleaseCourses.find(course => course.lessonId === lessonId && course.skill === skill);
}
export function nounItem(noun: NonNullable<ReleaseCard['noun']>): Item {
  return { id: '', lessonId: '', skill: 'vocabulary', group: '', title: `${noun.article} ${noun.word}`, answer: `${noun.article} ${noun.word}`, meaning: '', word: noun.word, article: noun.article, pluralOnly: noun.plural };
}
export function Models({ models, noun }: { models: ReleaseModel[]; noun?: ReleaseCard['noun'] }) {
  return <div className="release-models phrase-teaching-models">{models.map((model, index) => <div className="release-model" key={index}>
    {model.speaker && <span className="release-speaker">{model.speaker}</span>}
    <div>{noun && model.text === `${noun.article} ${noun.word}` ? <p lang="de"><NounText text={model.text} item={nounItem(noun)} /></p> : <AnnotatedReply sentences={model.sentences} />}<p lang="th">{model.meaning}</p><DialogueAudio source={model.audio} label={model.speaker ? `ฟัง ${model.speaker}` : 'ฟังตัวอย่าง'} /></div>
  </div>)}</div>;
}
export function Context({ rows }: { rows: string[][] }) {
  return rows.length ? <dl className="release-context">{rows.map((row, index) => <div key={index}><dt>{row[0]}</dt><dd>{row.slice(1).join(' · ')}</dd></div>)}</dl> : null;
}
export function Card({ card }: { card: ReleaseCard }) {
  return <article className="release-card">
    <h2>{card.noun ? <NounText text={card.title} item={nounItem(card.noun)} /> : card.title}</h2>
    <p>{card.purpose}</p><Context rows={card.context} />
    {card.wordAudio && <DialogueAudio source={card.wordAudio} label="ฟังคำศัพท์" />}
    <Models models={card.models} noun={card.noun} />
    {card.notes.map((note, index) => <p className="release-note" key={index}>{note}</p>)}
  </article>;
}

export function ReleaseEvidenceSummary({ lesson = 'all', skill = 'all' }: { lesson?: string; skill?: string }) {
  const storage = useLessonState();
  const { user } = useStore();
  const [practice, setPractice] = useState<PracticeHistory[]>([]);
  useEffect(() => {
    function refresh() { if (user) setPractice(readL13PracticeHistory(user.id, localStorage).filter(h => /^\/practice\/L1[5-8]\//.test(h.href))); }
    refresh(); window.addEventListener('practice-progress-updated', refresh); window.addEventListener('release-practice-history-refreshed', refresh); window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('practice-progress-updated', refresh); window.removeEventListener('release-practice-history-refreshed', refresh); window.removeEventListener('storage', refresh); };
  }, [user]);
  const rows = a13ReleaseCourses.filter(c => (lesson === 'all' || c.lessonId === lesson) && (skill === 'all' || c.skill === skill)).map(course => {
    const state = parseReleaseState(storage.read(releaseStateKey(course)), course);
    const observations = practice.filter(h => h.href.startsWith(`/practice/${course.lessonId}/${course.skill}/`)).flatMap(h => h.items.flatMap(item => item.result && typeof item.result.correct === 'boolean' ? [{ id: `${h.id}:${item.question.id}`, taskId: item.question.id, response: '', correct: item.result.correct, helpUsed: item.result.assisted !== false, submittedAt: new Date(item.result.submittedAt).toISOString(), selectionReason: 'ประวัติรอบฝึก' }] : []));
    return { course, state: { ...state, attempts: [...state.attempts, ...observations].sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt)) } };
  }).filter(row => row.state.learned.length || row.state.attempts.length);
  if (!rows.length) return null;
  return <section className="release-evidence"><h2>ผลเรียนและฝึกบท 15–18</h2><p>แยกคำตอบแรกและการใช้ตัวช่วยตามทักษะ การตอบถูกครั้งเดียวยังไม่ใช่หลักฐานว่าชำนาญ</p>{rows.map(({ course, state }) => {
    const first = [...new Map([...state.attempts].reverse().map(a => [a.taskId, a])).values()];
    const subskills = [...new Set(course.tasks.map(q => q.subskill))];
    return <details className="release-card" key={`${course.lessonId}:${course.skill}`}><summary>บท {course.lessonId.slice(1)} · {course.title} · เรียน {state.learned.length}/{course.cards.length} ประเด็น · ตอบ {state.attempts.length} ครั้ง</summary>{subskills.map(subskill => {
      const ids = new Set(course.tasks.filter(q => q.subskill === subskill).map(q => q.id));
      const observations = first.filter(a => ids.has(a.taskId));
      return <p key={subskill}>{releaseSubskillLabel(subskill)}: คำตอบแรก {observations.length} ข้อ · ถูกโดยไม่เปิดตัวช่วย {observations.filter(a => a.correct && !a.helpUsed).length} · เปิดตัวช่วย {observations.filter(a => a.helpUsed).length}</p>;
    })}<Link className="button secondary" href={`/practice/${course.lessonId}/${course.skill}`}>ฝึกต่อ</Link></details>;
  })}</section>;
}

function releaseSubskillLabel(subskill: string) {
  const labels: Record<string, string> = { word_meaning: 'ความหมายของคำ', lexical_chunk_meaning: 'ความหมายของวลี', noun_article: 'Artikel เอกพจน์', plural_article: 'Artikel พหูพจน์', word_spelling: 'สะกดคำ', lexical_chunk_form: 'ประกอบวลี', phrase_dialogue_response: 'เลือกบทตอบ', phrase_word_order: 'เรียงคำถามและคำตอบ', possessor_reference: 'ระบุเจ้าของ', possessive_case_ending: 'รูปท้ายคำแสดงเจ้าของ', possessive_reference_and_inflection: 'เลือกและผันคำแสดงเจ้าของ', declarative_word_order: 'เรียงประโยคบอกเล่า', temporal_relation: 'ความสัมพันธ์ของเวลา', temporal_dative_inflection: 'รูป Dativ หลังคำบอกเวลา', werden_conjugation: 'ผัน werden', wollen_conjugation: 'ผัน wollen', sollen_conjugation: 'ผัน sollen', preposition_case_inflection: 'รูปคำหลังบุพบท', accompaniment_presence_meaning: 'บอกว่ามีหรือไม่มีสิ่งที่ไปด้วย', modal_sentence_word_order: 'เรียงประโยค Modalverb', formal_imperative_form: 'รูปคำสั่งสุภาพ', formal_imperative_word_order: 'เรียงคำสั่งสุภาพ' };
  return labels[subskill] ?? 'เลือกใช้โครงสร้าง';
}

export function A13ReleaseCourse({ course, mode }: { course: ReleaseCourse; mode: 'learn' | 'practice' }) {
  const storage = useLessonState();
  const [state, setState] = useState<ReleaseState>(() => parseReleaseState(storage.read(releaseStateKey(course)), course));
  const [feedbackId, setFeedbackId] = useState<string | null>(() => state.active ? state.attempts.filter(a => a.taskId === state.active?.taskId && Date.parse(a.submittedAt) >= Date.parse(state.active.startedAt)).at(-1)?.id ?? null : null);
  const [phase, setPhase] = useState<'model' | 'activity'>(() => state.active ? 'activity' : 'model');
  const persist = (next: ReleaseState) => { storage.write(releaseStateKey(course), JSON.stringify(next)); setState(next); };
  const task = course.tasks.find(q => q.id === state.active?.taskId);
  const checked = state.attempts.find(a => a.id === feedbackId);
  const card = course.cards[state.cursor];
  function begin(next: ReleaseState, cardId?: string) {
    const choice = selectReleaseTask(course, next, Date.now(), cardId);
    if (!choice) return;
    setFeedbackId(null); setPhase('activity');
    const now = new Date().toISOString();
    persist({ ...next, round: mode === 'practice' ? next.round ?? { id: crypto.randomUUID(), startedAt: now, limit: 10 } : next.round, active: { taskId: choice.task.id, draft: '', helpUsed: false, startedAt: now, selectionReason: choice.reason, origin: mode, learningCardId: mode === 'learn' ? cardId ?? null : null } });
  }
  function learnAndTry() {
    if (!card) return;
    const next = { ...state, learned: [...new Set([...state.learned, card.id])] };
    begin(next, card.id);
  }
  function draft(value: string) {
    if (state.active && !checked) persist({ ...state, active: { ...state.active, draft: value } });
  }
  function check() {
    if (!task || !state.active || checked) return;
    const response = task.kind === 'order' ? releaseOrderIndices(state.active.draft, task).map(index => task.tokens[index]).join(' ') : state.active.draft.trim();
    const attempt = { id: crypto.randomUUID(), taskId: task.id, response, correct: gradeReleaseTask(task, response), helpUsed: state.active.helpUsed, submittedAt: new Date().toISOString(), selectionReason: state.active.selectionReason };
    persist({ ...state, attempts: [...state.attempts, attempt] }); setFeedbackId(attempt.id);
  }
  function next() {
    if (state.active?.origin !== mode) {
      const taughtCurrent = state.active?.origin === 'learn' && state.active.learningCardId === card?.id;
      persist({ ...state, active: null, cursor: taughtCurrent ? Math.min(course.cards.length, state.cursor + 1) : state.cursor });
      setFeedbackId(null); setPhase('model'); return;
    }
    if (mode === 'practice') {
      if (state.round && state.attempts.filter(a => Date.parse(a.submittedAt) >= Date.parse(state.round?.startedAt ?? '')).length >= state.round.limit) {
        persist({ ...state, active: null, round: null }); setFeedbackId(null); setPhase('model'); return;
      }
      begin({ ...state, active: null }); return;
    }
    persist({ ...state, cursor: state.active.learningCardId === card?.id ? Math.min(course.cards.length, state.cursor + 1) : state.cursor, active: null }); setFeedbackId(null); setPhase('model');
  }
  const selected = task && state.active ? releaseOrderIndices(state.active.draft, task) : [];
  const canCheck = task && state.active && (task.kind === 'order' ? selected.length === task.tokens.length : !!state.active.draft.trim());
  return <section className="release-course phrase-teaching-models">
    <header className="page-heading"><Link href={`/lesson/${course.lessonId}`}>บท {Number(course.lessonId.slice(1))}</Link><h1>{course.title}</h1><p>{course.purpose}</p></header>
    {course.skill === 'vocabulary' && <div className="release-article-legend"><ArticleLegend /></div>}
    <nav className="release-navigation"><Link href={`/learn/${course.lessonId}/${course.skill}`}>เรียนรู้</Link><Link href={`/practice/${course.lessonId}/${course.skill}`}>ฝึกสิ่งที่เรียนแล้ว</Link></nav>
    {(mode === 'learn' && phase === 'model' || !!state.active?.helpUsed && !checked) && course.glossary.length > 0 && <details className="release-glossary"><summary>คำศัพท์ช่วยเข้าใจตัวอย่าง</summary>{course.glossary.map(entry => <div key={entry.text}><p lang="de">{entry.noun ? <NounText text={entry.text} item={nounItem(entry.noun)} /> : entry.text} · {entry.meaning}</p><DialogueAudio source={entry.audio} label="ฟังคำศัพท์" /></div>)}</details>}
    {phase === 'activity' && task && state.active ? <article className="release-card phrase-teaching-task">
      {state.active.origin !== mode && <p role="status">ทำโจทย์ที่ค้างให้เสร็จ แล้วกลับไป{mode === 'learn' ? 'เรียน' : 'ฝึก'}</p>}<p className="release-note">{state.active.selectionReason}</p>{mode === 'practice' && state.round && <p>รอบละไม่เกิน 10 ข้อ · ตอบแล้ว {state.attempts.filter(a => Date.parse(a.submittedAt) >= Date.parse(state.round?.startedAt ?? '')).length}</p>}<h2>{task.prompt}</h2><Context rows={task.context} />
      {task.cue && <p lang="de" className="release-cue">{!task.articleTarget && !task.spelling && task.noun ? <NounText text={task.cue} item={nounItem(task.noun)} /> : task.cue}</p>}
      {task.startWith && <p>เริ่มด้วย <strong lang="de">{task.startWith}</strong></p>}
      {task.kind === 'choice' && <div className="release-options">{task.options.map(option => <button className={`button secondary${state.active?.draft === option ? ' selected' : ''}`} aria-pressed={state.active?.draft === option} disabled={!!checked} onClick={() => draft(option)} key={option}>{option}</button>)}</div>}
      {task.kind === 'write' && <div className="release-answer-area">{task.spelling && task.noun && <NounPrefix noun={{ article: task.noun.article, color: task.noun.plural ? 'plural' : task.noun.article, label: `${task.noun.article} ${task.noun.word}` }} />}<input aria-label="คำตอบภาษาเยอรมัน" autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={!!checked} value={state.active.draft} onChange={event => draft(event.target.value)} />{!checked && <div className="release-characters">{['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'].map(letter => <button className="button secondary" key={letter} onClick={() => draft((state.active?.draft ?? '') + letter)}>{letter}</button>)}</div>}</div>}
      {task.kind === 'order' && <><div className="release-order-answer" lang="de" aria-live="polite">{selected.length ? selected.map((index, at) => <button className="button secondary" key={index} disabled={!!checked} aria-label={`คืนคำ ${task.tokens[index]}`} onClick={() => draft(JSON.stringify(selected.filter((_, position) => position !== at)))}>{task.tokens[index]}</button>) : 'เลือกคำตามลำดับ'}</div><div className="release-options">{task.tokens.map((token, index) => <button className="button secondary" key={index} disabled={!!checked || selected.includes(index)} onClick={() => draft(JSON.stringify([...selected, index]))}>{token}</button>)}</div>{!checked && <button className="button secondary" onClick={() => draft(JSON.stringify(selected.slice(0, -1)))}>ย้อนคำล่าสุด</button>}</>}
      {!checked ? <div className="release-actions"><button className="button primary" disabled={!canCheck} onClick={check}>ตรวจคำตอบ</button><button className="button secondary" disabled={state.active.helpUsed} onClick={() => persist({ ...state, active: state.active ? { ...state.active, helpUsed: true } : null })}>ดูตัวอย่างช่วย</button></div> : <div className="release-feedback" role="status"><h3>{checked.correct ? 'ถูกต้อง' : 'ลองเทียบกับตัวอย่างนี้'}</h3><p>คำตอบของคุณ: <span lang="de">{checked.response}</span></p><p>คำตอบ: <span lang="de">{task.spelling && task.noun ? <NounText text={`${task.noun.article} ${task.noun.word}`} item={nounItem(task.noun)} /> : task.acceptedAnswers[0]}</span></p>{task.articleTarget && task.noun && <p><NounText text={`${task.noun.article} ${task.noun.word}`} item={nounItem(task.noun)} /></p>}<Models models={task.feedback.models} noun={task.noun} /><p>{task.feedback.reason}</p><button className="button primary" onClick={next}>{mode === 'learn' ? 'เรียนประเด็นต่อไป' : 'โจทย์แนะนำถัดไป'}</button>{mode === 'learn' && <Link className="button secondary" href={`/practice/${course.lessonId}/${course.skill}/basic?guided=${encodeURIComponent(state.active.learningCardId ?? '')}`} onClick={() => persist({ ...state, active: null, cursor: state.active?.learningCardId === card?.id ? Math.min(course.cards.length, state.cursor + 1) : state.cursor })}>ฝึกสิ่งที่เพิ่งเรียน</Link>}</div>}
      {state.active.helpUsed && !checked && <div className="release-help"><p>คำตอบนี้จะบันทึกว่าใช้ตัวช่วย</p>{course.cards.filter(c => task.requiredCardIds.includes(c.id)).map(c => <Card card={c} key={c.id} />)}</div>}
    </article> : mode === 'learn' && card ? <><p>ประเด็น {state.cursor + 1} / {course.cards.length}</p><progress value={state.cursor} max={course.cards.length} /><Card card={card} /><button className="button primary" onClick={learnAndTry}>ลองใช้สิ่งที่เพิ่งเรียน</button></> : <article className="release-card"><h2>{mode === 'learn' ? 'เรียนครบส่วนนี้แล้ว' : 'ฝึกจากสิ่งที่เรียนแล้ว'}</h2><p>เรียนแล้ว {state.learned.length} / {course.cards.length} ประเด็น</p><p>ผลจะแยกตามสิ่งที่โจทย์วัด การดูตัวอย่างหรือทำถูกครั้งเดียวยังไม่ถือว่าชำนาญ</p>{state.learned.length ? <button className="button primary" onClick={() => begin({ ...state, active: null })}>เริ่มรอบแนะนำ</button> : <Link className="button primary" href={`/learn/${course.lessonId}/${course.skill}`}>เริ่มเรียนก่อนฝึก</Link>}<div className="release-topic-list">{course.cards.filter(c => state.learned.includes(c.id)).map(c => <button className="button secondary" key={c.id} onClick={() => begin({ ...state, active: null }, c.id)}>ฝึก {c.title}</button>)}</div></article>}
  </section>;
}
