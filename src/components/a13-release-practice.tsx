"use client";
import { ExerciseReportButton } from "./exercise-report";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { releasePracticeQuestion as question, type ReleasePracticeQuestion as Question } from '@/lib/a13-release-question';
import { practiceStorageKey, parsePracticeHistory } from '@/lib/practice-planner';
import { gradeReleaseTask, parseReleaseState, releaseStateKey, selectReleaseRound, type ReleaseCourse, type ReleaseTask, type ReleaseAttempt } from '@/lib/a13-release';
import { useLessonState } from './lesson-state-provider';
import { Card, Context, Models, nounItem } from './a13-release-course';
import { NounText, NounPrefix } from './noun-text';
import { releaseResponseFeedback } from '@/lib/a13-response-feedback';
import { ArticleLegend } from './profession-matching';

type Attempt = { response: string; correct: boolean; status: 'completed'; submittedAt: string; assisted: boolean; confidence: null };
type Entry = { selectionReason: string; question: Question; response: string; selected: number[]; tokenOrder: number[]; hintUsed: boolean; translationUsed: false; attempt: Attempt | null };
type Session = { id: string; createdAt: string; updatedAt: string; completed: boolean; position: number; items: Entry[] };
export type ReleasePracticeSnapshot = { version: 1; activeId: string | null; sessions: Session[] };
type Snapshot = ReleasePracticeSnapshot;
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
function indices(v: unknown, size: number): number[] {
  if (!Array.isArray(v) || !v.every((i: unknown) => typeof i === 'number' && Number.isInteger(i) && i >= 0 && i < size) || new Set(v).size !== v.length) throw Error('ลำดับคำตอบไม่สมบูรณ์');
  return v;
}
export function parseReleasePracticeSnapshot(raw: string | null, course: ReleaseCourse): Snapshot {
  if (!raw) return { version: 1, activeId: null, sessions: [] };
  parsePracticeHistory(raw, `/practice/${course.lessonId}/${course.skill}/basic`);
  const v: unknown = JSON.parse(raw);
  if (!record(v) || v.version !== 1 || !Array.isArray(v.sessions) || !(v.activeId === null || typeof v.activeId === 'string')) throw Error('ประวัติแบบฝึกไม่สมบูรณ์');
  const sessions = v.sessions.map((s: unknown): Session => {
    if (!record(s) || typeof s.id !== 'string' || typeof s.createdAt !== 'string' || typeof s.updatedAt !== 'string' || typeof s.completed !== 'boolean' || typeof s.position !== 'number' || !Array.isArray(s.items)) throw Error('รอบฝึกไม่สมบูรณ์');
    const items = s.items.map((i: unknown): Entry => {
      if (!record(i) || !record(i.question) || typeof i.response !== 'string' || typeof i.hintUsed !== 'boolean' || i.translationUsed !== false) throw Error('คำตอบที่บันทึกไม่สมบูรณ์');
      const q = i.question;
      const task = course.tasks.find(t => t.id === q.id);
      if (!task || q.version !== task.version || q.targetId !== task.targetId || q.topicId !== `${course.lessonId}-${course.skill}` || q.subskill !== task.subskill || q.kind !== (task.kind === 'write' ? 'cloze' : task.kind) || !Array.isArray(q.acceptedAnswers) || q.acceptedAnswers.length !== task.acceptedAnswers.length || !q.acceptedAnswers.every((answer: unknown, at: number) => answer === task.acceptedAnswers[at])) throw Error('รูปโจทย์ที่บันทึกไม่ตรงกับบทเรียน');
      let attempt: Attempt | null = null;
      if (i.attempt !== null) {
        const a = i.attempt;
        if (!record(a) || typeof a.response !== 'string' || typeof a.correct !== 'boolean' || a.status !== 'completed' || typeof a.submittedAt !== 'string' || !Number.isFinite(Date.parse(a.submittedAt)) || typeof a.assisted !== 'boolean' || a.confidence !== null || gradeReleaseTask(task, a.response) !== a.correct) throw Error('ผลตรวจที่บันทึกไม่สมบูรณ์');
        attempt = { response: a.response, correct: a.correct, status: 'completed', submittedAt: a.submittedAt, assisted: a.assisted, confidence: null };
      }
      return { selectionReason: typeof i.selectionReason === 'string' ? i.selectionReason : 'กลับมาทำรอบที่บันทึกไว้', question: question(course, task), response: i.response, selected: indices(i.selected, task.options.length), tokenOrder: indices(i.tokenOrder, task.tokens.length), hintUsed: i.hintUsed, translationUsed: false, attempt };
    });
    return { id: s.id, createdAt: s.createdAt, updatedAt: s.updatedAt, completed: s.completed, position: s.position, items };
  });
  return { version: 1, activeId: v.activeId, sessions };
}
export function resumeReleasePracticeSnapshot(snapshot: Snapshot, course: ReleaseCourse, learnedIds: readonly string[], resumeId?: string): Snapshot {
  const eligible = snapshot.sessions.filter(session => session.items.every(item => {
    const task = course.tasks.find(task => task.id === item.question.id);
    return task && task.requiredCardIds.every(id => learnedIds.includes(id));
  }));
  const pending = eligible.filter(session => !session.completed);
  const requested = pending.find(session => session.id === resumeId);
  const active = eligible.find(session => session.id === snapshot.activeId);
  const latestPending = [...pending].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
  const next = requested ?? (active && !active.completed ? active : latestPending) ?? active;
  return next?.id === snapshot.activeId ? snapshot : { ...snapshot, activeId: next?.id ?? null };
}
function observations(snapshot: Snapshot): ReleaseAttempt[] {
  return snapshot.sessions.flatMap(s => s.items.flatMap((i, index) => i.attempt ? [{ id: `${s.id}:${index}`, sessionId: s.id, taskId: i.question.id, response: i.attempt.response, correct: i.attempt.correct, helpUsed: i.hintUsed, submittedAt: i.attempt.submittedAt, selectionReason: i.selectionReason }] : []));
}

export function A13ReleasePractice({ course, userId, guidedCardId, resumeId }: { course: ReleaseCourse; userId: string; guidedCardId?: string; resumeId?: string }) {
  const storage = useLessonState();
  const bank = `a13-release-${course.lessonId.toLowerCase()}-${course.skill}`;
  const key = practiceStorageKey(bank, bank, userId);
  const learned = parseReleaseState(storage.read(releaseStateKey(course)), course);
  const learnedIdsKey = learned.learned.join('|');
  const [snapshot, setSnapshot] = useState<Snapshot | null>(() => { try { return resumeReleasePracticeSnapshot(parseReleasePracticeSnapshot(localStorage.getItem(key), course), course, learned.learned, resumeId); } catch { return null; } });
  const [error, setError] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [guidedConsumed, setGuidedConsumed] = useState(false);
  function persist(next: Snapshot) {
    try { localStorage.setItem(key, JSON.stringify(next)); setSnapshot(next); window.dispatchEvent(new Event('practice-progress-updated')); setError(''); } catch { setError('บันทึกคำตอบไม่สำเร็จ กรุณาลองใหม่'); }
  }
  function begin(cardId?: string) {
    if (!snapshot) return;
    setReviewing(false);
    const latest = resumeReleasePracticeSnapshot(parseReleasePracticeSnapshot(localStorage.getItem(key), course), course, learned.learned, resumeId);
    const pending = latest.sessions.find(s => s.id === latest.activeId && !s.completed);
    if (pending) { setSnapshot(latest); return; }
    const evidence = [...learned.attempts, ...observations(latest)].sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt));
    const tasks = selectReleaseRound(course, { ...learned, attempts: evidence }, Date.now(), cardId);
    if (!tasks.length) return;
    const now = new Date().toISOString();
    const session: Session = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, completed: false, position: 0, items: tasks.map(({ task: t, reason }) => ({ selectionReason: reason, question: question(course, t), response: '', selected: [], tokenOrder: [], hintUsed: false, translationUsed: false, attempt: null })) };
    persist({ version: 1, activeId: session.id, sessions: [...latest.sessions, session] });
  }
  useEffect(() => {
    function refresh(event?: Event) {
      try {
        const latest = parseReleasePracticeSnapshot(localStorage.getItem(key), course);
        const next = event ? latest : resumeReleasePracticeSnapshot(latest, course, learned.learned, resumeId);
        if (next.activeId !== latest.activeId) persist(next);
        else setSnapshot(next);
      } catch { setError('โหลดประวัติที่อัปเดตไม่ได้ ข้อมูลเดิมยังเก็บอยู่ กรุณาโหลดหน้าใหม่'); }
    }
    refresh();
    window.addEventListener('release-practice-history-refreshed', refresh);
    return () => window.removeEventListener('release-practice-history-refreshed', refresh);
  }, [key, course, resumeId, learnedIdsKey]);
  const session = snapshot?.sessions.find(s => s.id === snapshot.activeId);
  const entry = session?.items[session.position];
  const task = entry ? course.tasks.find(t => t.id === entry.question.id) : undefined;
  // The explicit guided entry is the learner's Learn → Practice action, not an automatic answer.
  useEffect(() => {
    if (guidedCardId && !guidedConsumed) {
      setGuidedConsumed(true);
      if (!session || session.completed) begin(guidedCardId);
    }
  }, [guidedCardId, guidedConsumed]);
  if (!snapshot) return <p role="alert">เปิดประวัติแบบฝึกไม่ได้ ข้อมูลเดิมยังเก็บอยู่ กรุณาโหลดหน้าใหม่</p>;
  function edit(change: (old: Entry) => Entry) {
    if (!snapshot || !session || !entry || entry.attempt) return;
    persist({ ...snapshot, sessions: snapshot.sessions.map(s => s.id === session.id ? { ...s, updatedAt: new Date().toISOString(), items: s.items.map((i, at) => {
      if (at !== s.position) return i;
      const next = change(i);
      return task?.kind === 'order' ? { ...next, response: next.tokenOrder.map(index => task.tokens[index]).join(' ') } : next;
    }) } : s) });
  }
  function check() {
    if (!entry || !task || entry.attempt) return;
    const response = task.kind === 'order' ? entry.tokenOrder.map(i => task.tokens[i]).join(' ') : entry.response;
    edit(i => ({ ...i, attempt: { response, correct: gradeReleaseTask(task, response), status: 'completed', submittedAt: new Date().toISOString(), assisted: i.hintUsed, confidence: null } }));
  }
  function move(delta: number) {
    if (!snapshot || !session || !entry || (delta > 0 && !entry.attempt)) return;
    const last = session.position === session.items.length - 1;
    if (last && delta > 0) setReviewing(false);
    persist({ ...snapshot, sessions: snapshot.sessions.map(s => s.id === session.id ? { ...s, updatedAt: new Date().toISOString(), position: Math.max(0, Math.min(s.items.length - 1, s.position + delta)), completed: s.completed || (delta > 0 && last) } : s) });
  }
  const checked = entry?.attempt;
  return <section className="release-course phrase-teaching-models">
    <header className="page-heading"><h1>ฝึก{course.title} · บท {Number(course.lessonId.slice(1))}</h1><Link href={`/learn/${course.lessonId}/${course.skill}`}>กลับไปเรียน</Link></header>
    {course.skill === 'vocabulary' && <div className="release-article-legend"><ArticleLegend /></div>}
    {error && <p role="alert">{error}</p>}
    {!session || (session.completed && !reviewing) ? <article className="release-card"><h2>{session ? 'จบรอบฝึกแล้ว' : 'ฝึกจากสิ่งที่เรียนแล้ว'}</h2>{session && <><p>บันทึกคำตอบครบ {session.items.length} ข้อแล้ว เลือกทบทวนคำตอบหรือฝึกต่อได้</p><button className="button secondary" onClick={() => setReviewing(true)}>ทบทวนคำตอบรอบนี้</button></>}{learned.learned.length ? <><p>รอบฝึกผสมข้อใหม่กับจุดที่ควรทบทวน เมื่อใช้โครงสร้างได้ในหลายบริบท จะมีโจทย์ให้ลองเขียนมากขึ้น</p><button className="button primary" onClick={() => begin()}>{session ? 'ฝึกเพิ่ม' : 'เริ่มรอบแนะนำ'}</button><details className="release-manual"><summary>เลือกฝึกเฉพาะเรื่อง</summary><div className="release-topic-list">{course.cards.filter(c => learned.learned.includes(c.id)).map(c => <button className="button secondary" key={c.id} onClick={() => begin(c.id)}>ฝึก {c.title}</button>)}</div></details>{session && <Link className="button secondary" href={`/lesson/${course.lessonId}`}>จบและกลับหน้าบทเรียน</Link>}</> : <Link href={`/learn/${course.lessonId}/${course.skill}`}>เริ่มเรียนก่อนฝึก</Link>}</article> : task && entry ? <article className="release-card phrase-teaching-task">
      <p className="release-note">{entry.selectionReason}</p><p>ข้อ {session.position + 1} / {session.items.length} · รอบละไม่เกิน 10 ข้อ</p><h2>{task.prompt}</h2>{task.practice && task.practice.stage >= 2 && <p className="release-demand">{task.answerScope === 'fragment' ? 'พิมพ์เฉพาะส่วนที่เว้นไว้ในโครงประโยค' : task.practice.stage === 2 ? 'ใช้โครงช่วย แล้วพิมพ์คำตอบทั้งประโยค รวมคำเริ่มต้นที่ให้ไว้' : 'เขียนประโยคจากข้อมูลและคำเริ่มต้น'}</p>}<Context rows={task.context} />
      {task.cue && <p lang="de">{task.noun && !task.articleTarget && !task.spelling ? <NounText text={task.cue} item={nounItem(task.noun)} /> : task.cue}</p>}
      {task.startWith && <p>เริ่มด้วย <strong lang="de">{task.startWith}</strong></p>}
      {task.kind === 'choice' && <div className="release-options">{task.options.map((option, index) => <button className={`button secondary${entry.response === option ? ' selected' : ''}`} disabled={!!checked} aria-pressed={entry.response === option} key={option} onClick={() => edit(i => ({ ...i, response: option, selected: [index] }))}>{option}</button>)}</div>}
      {task.kind === 'write' && <div className="release-answer-area">{task.spelling && task.noun && <NounPrefix noun={{ article: task.noun.article, color: task.noun.plural ? 'plural' : task.noun.article, label: `${task.noun.article} ${task.noun.word}` }} />}{task.answerScope === 'sentence' ? <textarea rows={3} aria-label="คำตอบภาษาเยอรมัน" value={entry.response} disabled={!!checked} spellCheck={false} autoCapitalize="off" autoComplete="off" onChange={e => edit(i => ({ ...i, response: e.target.value }))}/> : <input aria-label="คำตอบภาษาเยอรมัน" value={entry.response} disabled={!!checked} spellCheck={false} autoCapitalize="off" autoComplete="off" onChange={e => edit(i => ({ ...i, response: e.target.value }))}/>}{!checked && <div className="release-characters">{['ä','ö','ü','ß','Ä','Ö','Ü'].map(letter => <button className="button secondary" key={letter} onClick={() => edit(i => ({ ...i, response: i.response + letter }))}>{letter}</button>)}</div>}</div>}
      {task.kind === 'order' && <><div className="release-order-answer" lang="de">{entry.tokenOrder.map((index, at) => <button className="button secondary" disabled={!!checked} key={index} aria-label={`คืนคำ ${task.tokens[index]}`} onClick={() => edit(i => ({ ...i, tokenOrder: i.tokenOrder.filter((_, p) => p !== at) }))}>{task.tokens[index]}</button>)}</div><div className="release-options">{task.tokens.map((token, index) => <button className="button secondary" key={index} disabled={!!checked || entry.tokenOrder.includes(index)} onClick={() => edit(i => ({ ...i, tokenOrder: [...i.tokenOrder, index] }))}>{token}</button>)}</div></>}
      {checked ? <div className="release-feedback" role="status"><h3>{checked.correct ? 'ถูกต้อง' : 'ลองเทียบกับตัวอย่างนี้'}</h3><p>คำตอบของคุณ: <span lang="de">{checked.response}</span></p><p>คำตอบ: <span lang="de">{task.noun && (task.spelling || task.articleTarget) ? <NounText text={`${task.noun.article} ${task.noun.word}`} item={nounItem(task.noun)} /> : task.acceptedAnswers[0]}</span></p><Models models={task.feedback.models} noun={task.noun}/><p data-feedback-category={releaseResponseFeedback(course, task, checked.response).category}>{releaseResponseFeedback(course, task, checked.response).message}</p><button className="button primary" onClick={() => move(1)}>{session.position === session.items.length - 1 ? 'จบรอบฝึก' : 'ต่อไป'}</button></div> : <div className="release-actions"><button className="button primary" onClick={check} disabled={task.kind === 'order' ? entry.tokenOrder.length !== task.tokens.length : !entry.response.trim()}>ตรวจคำตอบ</button><button className="button secondary" disabled={entry.hintUsed} onClick={() => edit(i => ({ ...i, hintUsed: true }))}>ดูตัวอย่างช่วย</button></div>}
      <ExerciseReportButton context={{lessonId:course.lessonId,skill:course.skill,questionId:task.id,questionVersion:task.version,bankKey:bank,sessionId:session.id,prompt:[task.prompt,task.cue,task.startWith?"เริ่มด้วย "+task.startWith:"",...task.context.map(row=>row.join(" · ")),task.kind==='choice'?task.options.join(" | "):""].filter(Boolean).join("\n"),learnerAnswer:task.kind==='order'?entry.tokenOrder.map(index=>task.tokens[index]).join(' '):entry.response,checked:!!checked,...(checked?{correct:checked.correct,expectedAnswers:task.acceptedAnswers,feedback:releaseResponseFeedback(course,task,checked.response).message}:{})}} />
      {entry.hintUsed && !checked && <div className="release-help"><p>คำตอบนี้บันทึกว่าใช้ตัวช่วย</p>{course.cards.filter(c => task.requiredCardIds.includes(c.id)).map(c => <Card card={c} key={c.id}/>)}</div>}
      {session.position > 0 && <button className="button secondary" onClick={() => move(-1)}>ย้อนดูข้อก่อน</button>}
    </article> : <p role="alert">ไม่พบโจทย์ที่บันทึกไว้</p>}
  </section>;
}
