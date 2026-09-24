"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, X, RotateCcw, Volume2, Sparkles, Trophy, ArrowLeft, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { availableModes, items, lessons, modeLabels, skillName, type Item, type Mode, type Skill } from "@/lib/content";
import { isCorrect, record, type Question } from "@/lib/engine";
import { useStore } from "./store";
import { Empty, Meter, SectionTitle } from "./ui";
import type { StartSession } from "./trainer";

export interface SessionPlan { id: number; questions: Question[]; title: string; origin: string }
function useGermanVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => setVoice(window.speechSynthesis.getVoices().find(v => v.lang.startsWith("de")) || null);
    load(); window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => { window.speechSynthesis.removeEventListener("voiceschanged", load); window.speechSynthesis.cancel(); };
  }, []);
  return voice;
}
export function PracticeSetup({ lessonId, skill, start }: { lessonId: string; skill: Skill; start: StartSession }) {
  const { data } = useStore();
  const voice = useGermanVoice();
  const lesson = lessons.find(l => l.id === lessonId)!;
  const all = items.filter(i => i.lessonId === lessonId && i.skill === skill);
  const groups = [...new Set(all.map(i => i.group))];
  const [collection, setCollection] = useState("core");
  const [group, setGroup] = useState(groups[0] || "");
  const [mode, setMode] = useState<Mode>(skill === "vocabulary" ? data.settings.direction : availableModes(skill, groups[0])[0]);
  const [count, setCount] = useState(data.settings.sessionSize);
  const [notice, setNotice] = useState("");
  const [prioritize, setPrioritize] = useState(data.settings.prioritize);
  const { commit } = useStore();
  const pool = all.filter(i => (skill !== "vocabulary" || collection === "all" || i.collection === collection) && (skill !== "grammar" || i.group === group));
  const available = mode === "article" ? pool.filter(i => i.article) : pool;
  const modes = availableModes(skill, group);
  function begin() {
    if (!available.length) { setNotice(mode === "article" ? "ชุดนี้ไม่มีคำนามที่มี Artikel เลือกศัพท์เสริม หรือเลือกรูปแบบฝึกอื่นได้เลย" : "ชุดนี้ยังไม่มีเนื้อหาสำหรับฝึก"); return; }
    if (skill === "listening" && !voice) { setNotice("ยังไม่พบเสียงภาษาเยอรมันในอุปกรณ์ กรุณาเปิดหรือติดตั้งเสียงภาษาเยอรมัน แล้วโหลดหน้านี้ใหม่"); return; }
    try { commit({ ...data, settings: { ...data.settings, prioritize } }); }
    catch (e) { setNotice((e as Error).message); return; }
    start(available, mode, count, `${lessonId} · ${skillName(skill)}`, `/practice/${lessonId}/${skill}`, prioritize);
  }
  return <><Link href={`/lesson/${lessonId}`} className="back-link">← กลับไปเลือกทักษะ</Link><div className="page-heading"><div><span className="eyebrow">{lesson.level} / {lessonId} / {lesson.title}</span><h1>ฝึก{skillName(skill)}</h1><p>เลือกรูปแบบที่ชอบ แล้วเริ่มรอบเล็ก ๆ ของคุณ</p></div></div>{all.length === 0 ? <Empty title="กำลังเตรียมเนื้อหาทักษะนี้" text="กลับไปฝึกคำศัพท์ประจำบทก่อนได้เลย"><Link className="button primary" href={`/practice/${lessonId}/vocabulary`}>ฝึกคำศัพท์</Link></Empty> : <div className="setup-layout"><section className="panel setup-panel">
    {skill === "vocabulary" && <><SectionTitle eyebrow="01 · WORTSCHATZ" title="เลือกชุดคำศัพท์" /><div className="collection-options">{[{ id: "core", name: "ศัพท์หลัก", sub: "ชุดเดิมจากบทเรียน" }, { id: "extra", name: "ศัพท์เสริม", sub: "คำเพิ่มเติมในบริบท" }, { id: "all", name: "ทั้งหมด", sub: "ฝึกสองชุดด้วยกัน" }].map(c => <button className={collection === c.id ? "selected" : ""} onClick={() => { setCollection(c.id); setNotice(""); }} key={c.id}><strong>{c.name}</strong><small>{c.sub}</small><span>{all.filter(i => c.id === "all" || i.collection === c.id).length} คำ</span></button>)}</div></>}
    {skill === "grammar" && <><SectionTitle eyebrow="01 · GRAMMATIK" title="เลือกหัวข้อไวยากรณ์" /><div className="topic-options">{groups.map(g => <button className={group === g ? "selected" : ""} onClick={() => { setGroup(g); setMode(availableModes(skill, g)[0]); }} key={g}>{g}<span>{all.filter(i => i.group === g).length} ข้อ</span></button>)}</div></>}
    <SectionTitle eyebrow={skill === "vocabulary" || skill === "grammar" ? "02 · ÜBUNG" : "01 · ÜBUNG"} title="เลือกวิธีฝึก" /><div className="mode-options">{modes.map(m => <button key={m} className={mode === m ? "selected" : ""} onClick={() => { setMode(m); setNotice(""); }}><span className="radio-dot" />{modeLabels[m]}</button>)}</div>
    {mode === "typing" && skill === "vocabulary" && <div className="help-text"><Sparkles size={17} /><span>Adaptive Typing: ตัวช่วยจะค่อย ๆ ลดลงเมื่อจำได้ สุ่มช่องว่างใหม่ทุกรอบ และพิมพ์คำเต็มพร้อม Artikel</span></div>}
    {skill === "writing" && <div className="help-text"><Info size={17} /><span>เขียนจากคำใบ้และตรวจเทียบประโยคตัวอย่าง รองรับคำตอบทางเลือกที่ระบุไว้ในบทเรียน</span></div>}
    {skill === "listening" && <div className={`notice ${voice ? "" : "warning"}`}><Volume2 size={19} /><span>{voice ? `ใช้เสียงสังเคราะห์ภาษาเยอรมันจากอุปกรณ์: ${voice.name}` : "ยังไม่พบเสียงภาษาเยอรมันในอุปกรณ์ เปิดหรือติดตั้งเสียงภาษาเยอรมันเพื่อเริ่มฝึกฟัง"}</span></div>}
    <SectionTitle eyebrow="DEINE SESSION" title="จำนวนข้อต่อรอบ" /><div className="count-options">{[5, 10, 20, 0].map(n => <button key={n} onClick={() => setCount(n)} className={count === n ? "selected" : ""}>{n || "ทั้งหมด"}{n > 0 && <small>ข้อ</small>}</button>)}</div><label className="check-label"><input type="checkbox" checked={prioritize} onChange={e => setPrioritize(e.target.checked)} />เน้นข้อที่เคยผิดหรือถึงเวลาทบทวน</label>
    {notice && <div role="alert" className="notice warning">{notice}</div>}
    <button className="button primary wide" onClick={begin}>เริ่มฝึก {count ? Math.min(count, available.length) : available.length} ข้อ <ArrowRight size={18} /></button>
  </section><aside className="setup-aside"><span className="large-spark">✳</span><h3>ค่อย ๆ จำ<br />จนกลายเป็นความมั่นใจ</h3><p>ฝึกเป็นรอบ มีจุดเริ่มและจุดจบ<br />ไม่สุ่มข้อเดิมซ้ำในรอบเดียวกัน</p><ul><li><Check size={16} />บันทึกทุกคำตอบทันที</li><li><Check size={16} />ดูเฉลยก่อนข้อต่อไป</li><li><Check size={16} />กลับมาฝึกเฉพาะข้อผิดได้</li></ul><span className="aside-caption">Du schaffst das.</span></aside></div>}</>;
}

export function Session({ plan, start }: { plan: SessionPlan; start: StartSession }) {
  const [position, setPosition] = useState(0);
  const [results, setResults] = useState<{ question: Question; correct: boolean; input: string }[]>([]);
  const { data } = useStore();
  const question = plan.questions[position];
  const finished = position >= plan.questions.length;
  const correct = results.filter(r => r.correct).length;
  const wrong = results.filter(r => !r.correct);
  if (finished) return <div className="result-page"><span className="result-trophy"><Trophy size={37} /></span><span className="eyebrow">GUT GEMACHT!</span><h1>อีกก้าวเล็ก ๆ สำเร็จแล้ว</h1><p>{plan.title} · บันทึกผลเรียบร้อย</p><div className="result-score"><strong>{correct}<span> / {results.length}</span></strong><span>{Math.round(correct / results.length * 100)}% ตอบถูก</span></div><div className="result-metrics"><div><CheckCircle2 size={21} /><strong>{correct}</strong><span>ตอบถูก</span></div><div><RotateCcw size={21} /><strong>{wrong.length}</strong><span>กลับมาทบทวน</span></div></div>{wrong.length > 0 && <div className="result-wrong panel"><h3>เก็บอีกนิด ก็จำได้แล้ว</h3>{wrong.map(r => <div key={r.question.item.id}><span>{r.question.item.title}<small>{r.question.item.meaning}</small></span><strong>{r.question.answer}</strong></div>)}</div>}<div className="result-actions">{wrong.length > 0 && <button className="button primary" onClick={() => start(wrong.map(r => r.question.item), plan.questions.every(q => q.mode === plan.questions[0].mode) ? plan.questions[0].mode : "review", 0, "ฝึกข้อที่ผิด", plan.origin)}>ฝึกเฉพาะ {wrong.length} ข้อที่ผิด <RotateCcw size={17} /></button>}<button className="button secondary" onClick={() => start(plan.questions.map(q => q.item), plan.questions.every(q => q.mode === plan.questions[0].mode) ? plan.questions[0].mode : "review", data.settings.sessionSize, plan.title, plan.origin)}>ฝึกอีกครั้ง</button><Link href={plan.origin} className="text-link">กลับไปเลือกแบบฝึก</Link></div></div>;
  return <><div className="session-heading"><Link href={plan.origin} className="icon-button" aria-label="ออกจากรอบฝึก"><X size={22} /></Link><div><span className="eyebrow">{plan.title}</span><strong>ข้อ {position + 1} / {plan.questions.length}</strong></div><span className="session-score"><Check size={17} />{correct} ถูก</span></div><Meter value={position / plan.questions.length * 100} label="ความคืบหน้ารอบฝึก" /><QuestionCard key={position} question={question} onRecorded={(ok, input) => setResults(old => [...old, { question, correct: ok, input }])} onNext={() => setPosition(n => n + 1)} isLast={position + 1 === plan.questions.length} /><div className="session-save"><CheckCircle2 size={14} />ทุกคำตอบถูกบันทึกก่อนแสดงเฉลย</div></>;
}

function QuestionCard({ question: q, onRecorded, onNext, isLast }: { question: Question; onRecorded: (ok: boolean, input: string) => void; onNext: () => void; isLast: boolean }) {
  const { data, commit } = useStore();
  const voice = useGermanVoice();
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [heard, setHeard] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const answered = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isChoice = ["de-th", "th-de", "article", "choice"].includes(q.mode);
  const isFlash = q.mode === "flash";
  const isOrder = q.mode === "order";
  const isListening = q.item.skill === "listening";
  function check(value = answer, selfReport?: boolean) {
    if (answered.current) return;
    const correct = selfReport ?? isCorrect(value, q.answer, q.item.accepted);
    const firstWord = value.trim().split(/\s+/)[0];
    const articleWrong = !!q.item.article && !correct && (q.mode === "article" || (q.mode === "typing" && firstWord !== q.item.article));
    const spellingWrong = q.mode === "typing" && !correct && (!q.item.article || !isCorrect(value.replace(/^(der|die|das)\s+/, ""), q.item.word || q.answer));
    try { commit(record(data, q.item.id, correct, q.mode, Date.now(), { hidden: q.hint?.hidden, articleWrong, spellingWrong })); }
    catch (e) { setError((e as Error).message); return; }
    answered.current = true; setAnswer(value); setFeedback(correct); setError(""); onRecorded(correct, value);
  }
  function speak() {
    if (!voice || !("speechSynthesis" in window)) { setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิดใช้งานเสียงก่อน"); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(q.item.audio || q.item.title);
    utterance.lang = "de-DE"; utterance.voice = voice; utterance.rate = .8;
    utterance.onend = () => { setSpeaking(false); setHeard(true); };
    utterance.onerror = () => { setSpeaking(false); setError("เล่นเสียงไม่สำเร็จ ลองกดฟังอีกครั้ง"); };
    setError(""); setSpeaking(true); window.speechSynthesis.speak(utterance);
  }
  function addChar(char: string) {
    const field = inputRef.current; const start = field?.selectionStart ?? answer.length; const end = field?.selectionEnd ?? start;
    setAnswer(answer.slice(0, start) + char + answer.slice(end));
    requestAnimationFrame(() => { field?.focus(); field?.setSelectionRange(start + 1, start + 1); });
  }
  return <div className="question-wrap"><div className="question-meta"><span className="quiet-pill">{skillName(q.item.skill)} · {modeLabels[q.mode]}</span>{q.item.collection && <span>{q.item.collection === "core" ? "ศัพท์หลัก" : "ศัพท์เสริม"} · {q.item.group}</span>}</div>
    {q.item.passage && <div className="reading-passage"><span className="eyebrow">LINA UND SUN</span><p lang="de">{q.item.passage}</p></div>}
    <section className="question-card">
      {isListening ? <><span className="eyebrow">HÖR GUT ZU</span><button className={`listen-button ${speaking ? "speaking" : ""}`} onClick={speak} disabled={!voice || speaking} aria-label="ฟังเสียงภาษาเยอรมัน"><Volume2 size={38} /></button><h2>คุณได้ยินคำว่าอะไร?</h2><p>{voice ? "กดฟังให้จบก่อนเลือกคำตอบ ฟังซ้ำได้เสมอ" : "ไม่พบเสียงเยอรมัน กรุณาเปิดเสียงในอุปกรณ์ก่อน"}</p></> : <><span className="eyebrow">{isFlash ? "นึกความหมายก่อน แล้วค่อยพลิกดู" : isOrder ? "เรียงคำให้เป็นประโยคที่ถูกต้อง" : q.mode === "article" ? "เลือก Artikel ให้ตรงกับคำศัพท์" : q.mode === "typing" ? "พิมพ์คำตอบให้ตรงกับคำใบ้" : "เลือกคำตอบที่ถูกต้อง"}</span><h2 className={q.mode === "dialogue" ? "dialogue-prompt" : ""} lang={q.mode === "de-th" || q.mode === "article" || (isFlash && q.item.skill === "vocabulary") ? "de" : undefined}>{isFlash && q.item.skill !== "vocabulary" ? q.item.meaning : q.prompt}</h2></>}
      {q.item.pluralOnly && <span className="plural-label">Plural · พหูพจน์ ใช้ die</span>}
      {q.mode === "article" && <p>{q.item.meaning}</p>}
      {isFlash && <>{revealed ? <div className="flash-answer"><span className="flash-divider" /><h3>{q.item.skill === "vocabulary" ? q.item.meaning : q.item.answer}</h3><strong lang="de">{q.item.title}</strong>{q.item.plural && <p>Plural: die {q.item.plural}</p>}</div> : <button className="button secondary flip-button" onClick={() => setRevealed(true)}><RotateCcw size={17} />พลิกการ์ดดูคำตอบ</button>}</>}
      {!isFlash && !isChoice && !isOrder && <form onSubmit={e => { e.preventDefault(); if (feedback === null) check(); else onNext(); }}><div className="typing-area">{q.hint && <div className="typing-hint"><span>ตัวช่วย · {q.item.article ? `อย่าลืม ${q.item.article}` : "พิมพ์คำเต็ม"}</span><strong lang="de">{q.item.article && `${q.item.article} `}{q.hint.text}</strong></div>}<label htmlFor="answer-input" className="sr-only">คำตอบภาษาเยอรมัน</label><input id="answer-input" ref={inputRef} autoComplete="off" autoCapitalize="off" spellCheck={false} value={answer} onChange={e => setAnswer(e.target.value)} disabled={feedback !== null} placeholder={q.item.article ? "Artikel + คำศัพท์" : "คำตอบภาษาเยอรมัน…"} autoFocus /><div className="special-chars">{["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"].map(c => <button type="button" disabled={feedback !== null} key={c} onClick={() => addChar(c)}>{c}</button>)}</div><small>ตรวจตัวพิมพ์ใหญ่–เล็ก และ ä / ö / ü / ß ด้วยนะ</small></div><button className="button primary wide" type="submit" disabled={!answer.trim() && feedback === null}>{feedback === null ? "ตรวจคำตอบ" : isLast ? "ดูผลการฝึก" : "ข้อต่อไป"}<ArrowRight size={17} /></button></form>}
      {isOrder && <><div className="sentence-answer" aria-label="ประโยคที่เรียง">{selectedTokens.length === 0 && <span>แตะคำด้านล่างเพื่อเรียงประโยค</span>}{selectedTokens.map((index, pos) => <button key={`${index}-${pos}`} disabled={feedback !== null} onClick={() => setSelectedTokens(old => old.filter((_, i) => i !== pos))}>{q.tokens[index]}</button>)}</div><div className="word-bank">{q.tokens.map((token, i) => <button disabled={selectedTokens.includes(i) || feedback !== null} key={i} onClick={() => setSelectedTokens(old => [...old, i])}>{token}</button>)}</div>{feedback === null && <button className="button primary wide" disabled={selectedTokens.length !== q.tokens.length} onClick={() => check(selectedTokens.map(i => q.tokens[i]).join(" "))}>ตรวจคำตอบ <Check size={17} /></button>}</>}
      {isChoice && <div className={`answer-options ${q.mode === "article" ? "article-options" : ""}`}>{q.options.map((option, index) => <button className={feedback !== null ? option === q.answer ? "correct" : option === answer ? "incorrect" : "muted" : ""} disabled={feedback !== null || (isListening && !heard)} key={option} onClick={() => check(option)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span lang={q.mode === "de-th" ? "th" : "de"}>{option}</span>{feedback !== null && option === q.answer && <Check size={19} />}</button>)}</div>}
      {isFlash && revealed && feedback === null && <div className="flash-actions"><button className="button secondary" onClick={() => check("ยังไม่จำ", false)}><RotateCcw size={17} />ยังไม่จำ</button><button className="button primary" onClick={() => check(q.answer, true)}><Check size={17} />จำได้</button></div>}
    </section>
    {error && <div className="notice error" role="alert">{error}</div>}
    {feedback !== null && <div className={`answer-feedback ${feedback ? "success" : "retry"}`} aria-live="polite"><div className="feedback-heading">{feedback ? <CheckCircle2 size={23} /> : <AlertCircle size={23} />}<div><strong>{feedback ? "ถูกต้อง เก่งขึ้นอีกนิดแล้ว!" : "อีกนิดเดียว ลองจำคำตอบนี้นะ"}</strong><p>คำตอบ: <b lang="de">{q.answer}</b></p>{q.item.skill === "vocabulary" && q.item.article && <p lang="de">{q.item.title}{q.item.plural ? ` · Plural: die ${q.item.plural}` : ""}</p>}{!feedback && !isFlash && <small>คุณตอบ: {answer || "—"}</small>}</div></div>{(isChoice || isFlash || isOrder) && <button className="button primary" autoFocus onClick={onNext}>{isLast ? "ดูผลการฝึก" : "ข้อต่อไป"}<ArrowRight size={17} /></button>}</div>}
  </div>;
}
