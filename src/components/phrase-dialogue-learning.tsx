"use client";
import { ExerciseReportButton } from "./exercise-report";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Users, Tag, Palette, Phone, Star, CalendarDays, Utensils, TrainFront, History, Gift } from 'lucide-react';
import { canCheckDialogue, emptyDialogueResponse, gradeDialogue, dialogueAnswer, dialogueStorageKey, dialogueUnits, newDialogueRun, parseDialogueHistory, type DialogueTopic, type DialogueHistory, type DialogueResponse, type DialogueRun, type DialogueVisual, type DialogueGrammarPattern } from '@/lib/phrase-dialogue-learning';
import { useLessonState } from './lesson-state-provider';
import { useContent } from './content-provider';
import { useLearning } from './learning-store';
import { findNoun } from '@/lib/noun-presentation';
import { NounPrefix, NounText } from './noun-text';
import { ArticleLegend } from './profession-matching';
import { GermanListenText } from './german-listen-text';
import { PracticeGermanText } from './practice-german-text';
import { DialogueAudio, FeedbackDialogueAudio } from './phrase-dialogue-media';
import { AnnotatedReply, AnnotatedTurn } from './phrase-sentence';
import { presentDialogueTopics } from '@/lib/phrase-presentation';

function HighlightedGerman({ text, focus = [] }: { text: string; focus?: string[] }) {
  if (!focus.length) return <>{text}</>;
  const escaped = [...focus].sort((a, b) => b.length - a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const expression = new RegExp(`(${escaped.join('|')})`, 'gi');
  const terms = new Set(focus.map(term => term.toLocaleLowerCase('de')));
  return <>{text.split(expression).map((part, index) => terms.has(part.toLocaleLowerCase('de')) ? <strong className="phrase-discovery-highlight" key={index}>{part}</strong> : part)}</>;
}
function visualHasNouns(visual: DialogueVisual | null) {
  return visual?.kind === 'board' && (/^(der|die|das) /.test(visual.title) || visual.rows.some(([,value])=>/^(der|die|das) /.test(value)));
}
function StickyArticleLegend() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => element.parentElement?.style.setProperty('--dialogue-legend-height', `${element.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update); observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="dialogue-sticky-legend" ref={ref}><ArticleLegend /></div>;
}
function Explanation({ text }: { text: string }) {
  return <div className="phrase-discovery-explanation">{text.split('\n').filter(Boolean).map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}</div>;
}
function PerfektPatternCard({ pattern }: { pattern: DialogueGrammarPattern }) {
  return <article className="phrase-perfekt-pattern">
    <div className="phrase-perfekt-pattern-heading"><h3>{pattern.title}</h3><DialogueAudio source={pattern.audio} label="ฟังตัวอย่าง" /></div>
    <div className="phrase-perfekt-form"><span>Präsens · ปัจจุบัน</span><div className="phrase-perfekt-diagram"><AnnotatedReply sentences={[pattern.presentParts]} /></div><p lang="th">{pattern.presentMeaning}</p></div>
    <div className="phrase-perfekt-form past"><span>Perfekt · อดีต</span><div className="phrase-perfekt-diagram"><AnnotatedReply sentences={[pattern.pastParts]} /></div><p lang="th">{pattern.pastMeaning}</p></div>
  </article>;
}
function Visual({ visual }: { visual: DialogueVisual }) {
  switch (visual.kind) {
    case 'clock': {
      const minute = visual.minute * 6, hour = (visual.hour % 12) * 30 + visual.minute / 2;
      return <svg className="dialogue-clock" viewBox="0 0 240 240" role="img" aria-label={`นาฬิกา ${visual.hour}:${String(visual.minute).padStart(2, '0')}`}><circle cx="120" cy="120" r="108" fill="white" stroke="#688473" strokeWidth="4" />{Array.from({length:12},(_,i)=><text key={i} x={120+88*Math.sin((i+1)*Math.PI/6)} y={126-88*Math.cos((i+1)*Math.PI/6)} textAnchor="middle" fontSize="16" fill="#294a38">{i+1}</text>)}<line x1="120" y1="120" x2="120" y2="62" transform={`rotate(${hour} 120 120)`} stroke="#294a38" strokeWidth="7" strokeLinecap="round" /><line x1="120" y1="120" x2="120" y2="38" transform={`rotate(${minute} 120 120)`} stroke="#688473" strokeWidth="4" strokeLinecap="round" /><circle cx="120" cy="120" r="6" fill="#294a38" /></svg>;
    }
    case 'board': {
      const icons = { family: Users, price: Tag, object: Palette, phone: Phone, ability: Star, calendar: CalendarDays, menu: Utensils, transport: TrainFront, timeline: History, celebration: Gift };
      const Icon = icons[visual.theme];
      return <div className={`dialogue-board dialogue-board-${visual.theme}`}><div className="dialogue-board-heading"><Icon size={30} aria-hidden="true" /><strong><NounText text={visual.title} /></strong></div><dl>{visual.rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd><NounText text={value} /></dd></div>)}</dl></div>;
    }
    case 'image': return <figure className="phrase-visual phrase-visual-scene"><Image src={visual.src} alt={visual.alt} width={480} height={480} sizes="(max-width: 700px) 240px, 300px" /><figcaption>{visual.caption}</figcaption></figure>;
    case 'facts': return <div className="phrase-person-card l02-person-facts"><dl>{visual.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
    case 'reading': return <div className="phrase-person-card l02-person-reading" lang="de">{visual.text}</div>;
  }
}
export function PhraseDialogueLearning({ lessonId, topics:sourceTopics, scope }: { lessonId: string; topics: readonly DialogueTopic[]; scope?: {id:string;title:string;completionHref:string;completionLabel:string} }) {
  const topics=useMemo(()=>presentDialogueTopics(lessonId,sourceTopics),[lessonId,sourceTopics]);
  const storageKey = dialogueStorageKey(lessonId)+(scope?'-'+scope.id:''), presentation = (lessonId === 'L02' ? 'l02-dialogue-v1' : `${lessonId}-dialogue-v1`)+(scope?'-'+scope.id:'');
  const lessonNumber = Number(lessonId.slice(1));
  const storage = useLessonState(), learning = useLearning(), content = useContent();
  const [history, setHistory] = useState<DialogueHistory | null>(() => {
    try { const parsed = parseDialogueHistory(storage.read(storageKey), topics, presentation); return parsed.runs.length ? parsed : { ...parsed, runs: [newDialogueRun(topics)] }; } catch { return null; }
  });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => { if (history) storage.write(storageKey, JSON.stringify(history)); }, [history, storage.write, storageKey]);
  const run = history?.runs.at(-1);
  if (!history || !run) return <p role="alert">เปิดรอบที่บันทึกไว้ไม่ได้ กรุณาโหลดหน้าใหม่ ข้อมูลเดิมยังเก็บอยู่</p>;
  function update(change: (value: DialogueRun) => DialogueRun) { setHistory(old => old ? { ...old, runs: old.runs.map(value => value.id === run?.id ? change(value) : value) } : old); }
  if (run.step === run.queue.length) return <section className={`guided-learning phrase-discovery phrase-dialogue-learning${lessonId === 'L02' ? ' l02-phrase-discovery' : ''}`}><div className="guided-card"><h1>{scope?`เรียน${scope.title}ครบแล้ว`:`เรียนประโยคบท ${lessonNumber} ครบแล้ว`}</h1><div className="guided-navigation"><button className="button secondary" onClick={() => setHistory(old => old ? { ...old, runs: [...old.runs, newDialogueRun(topics)] } : old)}>ลองอีกรอบ</button><Link className="button primary" href={scope?.completionHref??`/lesson/${lessonId}`}>{scope?.completionLabel??'จบ'} <ArrowRight size={17} /></Link></div></div></section>;
  const step = run.queue[run.step], isModel = step.startsWith('model:');
  const topic = topics.find(value => isModel ? value.id === step.slice(6) : value.tasks.some(task => task.id === step));
  if (!topic) return <p role="alert">ไม่พบกิจกรรมในรอบนี้</p>;
  async function advance() {
    if (busy) return;
    if (isModel && topic) {
      setBusy(true); setError('');
      try {
        for (const id of topic.legacyIds) if (content.items.some(item => item.id === id) && !learning.exposures.some(exposure => exposure.item_id === id)) await learning.act('expose', { itemId: id });
      } catch { setError('บันทึกการเรียนไม่สำเร็จ กรุณาลองอีกครั้ง'); setBusy(false); return; }
      setBusy(false);
    } else if (!run?.responses[step]?.first) return;
    update(value => ({ ...value, step: value.step + 1, models: isModel && topic ? [...new Set([...value.models, topic.id])] : value.models }));
  }
  const progress = <div className="vocabulary-image-progress" aria-label={`กิจกรรม ${run.step + 1} จาก ${run.queue.length}`}><span>{topic.title} · {run.step + 1} / {run.queue.length}</span><div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${run.step / run.queue.length * 100}%` }} /></div></div>;
  const back = <button className="button secondary" disabled={run.step === 0 || busy} onClick={() => update(value => ({ ...value, step: value.step - 1 }))}>ย้อนกลับ</button>;
  const modelHasNouns = topic.models.some(model => visualHasNouns(model.visual ?? topic.modelVisual));
  if (isModel && topic.grammarPatterns) return <section className="guided-learning phrase-discovery phrase-dialogue-learning phrase-perfekt-learning">{progress}<div className="page-heading"><h1>{topic.title}</h1></div><div className="guided-card">
    <section className="phrase-perfekt-intro"><h2>Perfekt ใช้เล่าเหตุการณ์ที่เกิดขึ้นแล้ว (อดีต)</h2><p>เริ่มจากประโยคบอกเล่า แล้วดูว่าตำแหน่งของ haben เปลี่ยนเมื่อเป็นคำถาม</p><ul>{topic.note.slice(1).map(note => <li key={note}>{note}</li>)}</ul></section>
    <div className="phrase-perfekt-patterns">{topic.grammarPatterns.map(pattern => <PerfektPatternCard key={pattern.id} pattern={pattern} />)}</div>
    {error && <p role="alert">{error}</p>}<div className="guided-navigation">{back}<button className="button primary" disabled={busy} onClick={() => void advance()}>{busy ? 'กำลังบันทึก' : 'ลองตอบ'} <ArrowRight size={17} /></button></div>
  </div></section>;
  if (isModel) return <section className={`guided-learning phrase-discovery phrase-dialogue-learning${lessonId === 'L02' ? ' l02-phrase-discovery' : ''} phrase-teaching-models`}>{modelHasNouns && <StickyArticleLegend />}{progress}<div className="page-heading"><h1>{topic.title}</h1></div><div className="guided-card">
    {topic.models.some(model => model.audio) ? <section className="phrase-discovery-teaching"><h2>หลักการ</h2><ul className="phrase-discovery-note">{topic.note.map(note => <li key={note}>{note}</li>)}</ul></section> : <DialogueAudio key={topic.id} source={topic.audio} />}
    {topic.models.some(model => model.audio) && <h2 className="phrase-discovery-examples-heading">ตัวอย่าง</h2>}
    <div className="phrase-discovery-models">{topic.models.map((model, index) => <div className={`phrase-discovery-model${model.audio ? ' phrase-discovery-model-audio' : ''}${model.replySentences ? ' phrase-model-annotated' : ''}`} key={index}>
      <div className="phrase-model-visual">{model.audio && <div className="phrase-model-audio"><DialogueAudio key={model.audio} source={model.audio} label="ฟังตัวอย่างนี้" /></div>}<Visual visual={model.visual ?? topic.modelVisual} /></div>
      <div className="phrase-model-dialogue">
        {model.teachingIntro?.map((line, at) => <p className="phrase-model-teaching" lang="th" key={at}>{line}</p>)}
        {model.questionSentences ? <AnnotatedTurn speaker="A" sentences={model.questionSentences} meaning={model.questionMeaning} /> : <div className="phrase-discovery-turn"><span lang="de">A</span><div><p className="phrase-discovery-german-line" lang="de"><HighlightedGerman text={model.question} focus={model.questionTeaching?.focus} /></p>{model.questionTeaching?.structure.map((line, at) => <p className="phrase-discovery-structure" lang="th" key={at}>{line}</p>)}<p lang="th">{model.questionMeaning}</p></div></div>}
        <div className="phrase-discovery-turn reply"><span lang="de">B</span><div>{model.replySentences ? <AnnotatedReply sentences={model.replySentences} /> : <><p className="phrase-discovery-german-line" lang="de"><HighlightedGerman text={model.reply} focus={model.replyTeaching?.focus} /></p>{model.replyTeaching?.structure.map((line, at) => <p className="phrase-discovery-structure" lang="th" key={at}>{line}</p>)}</>}<p lang="th">{model.replyMeaning}</p></div></div>
      </div>
    </div>)}</div>
    {!topic.models.some(model => model.audio) && <ul className="guided-note phrase-discovery-note">{topic.note.map(note => <li key={note}>{note}</li>)}</ul>}{error && <p role="alert">{error}</p>}<div className="guided-navigation">{back}<button className="button primary" disabled={busy} onClick={() => void advance()}>{busy ? 'กำลังบันทึก' : 'ลองตอบ'} <ArrowRight size={17} /></button></div>
  </div></section>;
  const task = topic.tasks.find(value => value.id === step);
  if (!task) return <p role="alert">ไม่พบคำถาม</p>;
  const responseSpeaker=task.responseSpeaker??'B',promptSpeaker=responseSpeaker==='A'?'B':'A';
  const topicId = topic.id;
  const response = run.responses[task.id] ?? emptyDialogueResponse(), checked = response.first !== null;
  function edit(change: (value: DialogueResponse) => DialogueResponse) { update(value => { const old = value.responses[step] ?? emptyDialogueResponse(); return old.first ? value : { ...value, responses: { ...value.responses, [step]: change(old) } }; }); }
  function check() { if (!task) return; update(value => { const old = value.responses[step] ?? emptyDialogueResponse(); if (old.first || !value.models.includes(topicId) || !canCheckDialogue(task, old)) return value; return { ...value, responses: { ...value.responses, [step]: { ...old, first: gradeDialogue(task, old, new Date().toISOString(), presentation) } } }; }); }
  return <section className={`guided-learning phrase-discovery phrase-dialogue-learning${lessonId === 'L02' ? ' l02-phrase-discovery' : ''} phrase-teaching-task`} aria-label={`ลองตอบบทสนทนาบท ${lessonNumber}`}>{(visualHasNouns(task.visual) || (task.kind === 'profile' ? task.fields.some(field => field.unit.nounLabel) : !!task.unit.nounLabel)) && <StickyArticleLegend />}{progress}<div className="guided-card">
    {task.promptMeaning && <p className="l11-task-instruction">{task.kind === 'order' ? `แตะคำเพื่อเรียงคำตอบของ ${responseSpeaker} ตามข้อมูลที่ให้ ถ้าต้องการแก้ ให้แตะคำที่วางไว้เพื่อนำกลับ` : `เลือกคำตอบของ ${responseSpeaker} ให้ตรงกับข้อมูลที่ให้`}</p>}
    <div className="phrase-discovery-task-layout"><div className="l02-task-context">{task.audio && <DialogueAudio key={task.id} source={task.audio} onComplete={() => edit(value => ({ ...value, plays: value.plays + 1 }))} />}{task.visual && <Visual visual={task.visual} />}</div>
      <div className="phrase-discovery-task-copy"><h1 lang={task.promptMeaning ? 'de' : 'th'}>{task.promptMeaning && <><span className="phrase-discovery-prompt-speaker" aria-label={`ผู้พูด ${promptSpeaker}`}>{promptSpeaker}</span> </>}<span className="phrase-discovery-prompt-text"><PracticeGermanText text={task.prompt} enabled={!!task.promptMeaning && !task.audio} onHelp={word => edit(value => ({ ...value, helpWords: [...new Set([...value.helpWords, word])] }))} /></span></h1>
      {task.kind === 'choice' && <div className="guided-choices">{task.options.map((option, index) => <button type="button" key={option} lang="de" className={`guided-choice${response.selection[0] === index ? ' selected' : ''}${checked && option === task.unit.answer ? ' correct' : ''}${checked && response.selection[0] === index && option !== task.unit.answer ? ' wrong' : ''}`} aria-pressed={response.selection[0] === index} disabled={checked} onClick={() => edit(value => ({ ...value, selection: [index] }))}>{option}</button>)}</div>}
      {task.kind === 'order' && <div className="phrase-discovery-order"><div className="phrase-discovery-answer" aria-label="คำตอบที่เรียง"><span className="phrase-discovery-prompt-speaker">{responseSpeaker}</span>{!response.selection.length && <span className="phrase-order-placeholder">คำตอบของ {responseSpeaker} จะแสดงที่นี่</span>}{response.selection.map((index, position) => <button type="button" className="button secondary" key={index} disabled={checked} aria-label={`นำ ${task.tokens[index]} กลับ`} onClick={() => edit(value => ({ ...value, selection: value.selection.filter((_, at) => at !== position) }))}>{task.tokens[index]}</button>)}</div>{<p className="phrase-word-bank-label">คำที่ให้</p>}<div className="phrase-discovery-word-bank" aria-label="คำที่ให้">{task.tokens.map((token, index) => <button className="button secondary" key={index} disabled={checked || response.selection.includes(index)} onClick={() => edit(value => ({ ...value, selection: [...value.selection, index] }))}>{token}</button>)}</div></div>}
      {(task.kind === 'digits' || task.kind === 'text') && <label className="l02-field">{task.label}{task.unit.nounLabel && <NounPrefix noun={findNoun(task.unit.nounLabel, [])} />}<input inputMode={task.kind === 'digits' ? 'numeric' : 'text'} autoComplete="off" aria-label={task.label} maxLength={task.maxLength} value={response.text} disabled={checked} onChange={event => edit(value => ({ ...value, text: task.kind === 'digits' ? event.target.value.replace(/[^0-9]/g, '') : event.target.value }))} /></label>}
      {task.kind === 'profile' && <div className="l02-profile-fields">{task.fields.map(field => <label className="l02-field" key={field.unit.id}>{field.label}{field.unit.nounLabel && <NounPrefix noun={findNoun(field.unit.nounLabel, [])} />}<input autoComplete="off" aria-label={field.label} disabled={checked} value={response.fields[field.unit.id] ?? ''} onChange={event => { const text = event.target.value; edit(value => ({ ...value, fields: { ...value.fields, [field.unit.id]: text } })); }} /></label>)}</div>}
      </div></div>
      {response.first && <div className={`phrase-discovery-feedback${Object.values(response.first).some(unit => !unit.correct) ? ' wrong' : ' correct'}`} role="status">
        <strong>{Object.values(response.first).every(unit => unit.correct) ? 'ถูกต้อง' : 'ยังไม่ถูก'}</strong>
        {task.feedbackDialogue && responseSpeaker==='A' ? <><AnnotatedTurn speaker="A" sentences={task.feedbackDialogue.reply} meaning={dialogueUnits(task)[0].meaning}/><AnnotatedTurn speaker="B" sentences={task.feedbackDialogue.question} meaning={task.promptMeaning} audio={{source:task.feedbackAudio,text:`${dialogueUnits(task)[0].answer} ${task.prompt}`}}/></> : task.feedbackDialogue ? <AnnotatedTurn speaker={promptSpeaker} sentences={task.feedbackDialogue.question} meaning={task.promptMeaning} /> : task.promptMeaning && task.prompt !== dialogueUnits(task)[0].answer && <div className="phrase-discovery-question-meaning"><strong>A: <span lang="de">{task.prompt}</span></strong><p>{task.promptMeaning}</p></div>}
        {!(task.feedbackDialogue&&responseSpeaker==='A')&&dialogueUnits(task).map(unit => <div className="l02-unit-feedback" key={unit.id}>{task.feedbackDialogue ? <AnnotatedTurn speaker={responseSpeaker} sentences={task.feedbackDialogue.reply} meaning={unit.meaning} audio={{source: task.feedbackAudio, text: `${task.prompt} ${unit.answer}`}} /> : task.promptMeaning ? <><strong>B: <span lang="de">{unit.answer}</span> <FeedbackDialogueAudio source={task.feedbackAudio} text={`${task.prompt} ${unit.answer}`} /></strong><p>{unit.meaning}</p></> : <><strong>{`${task.kind === 'profile' ? task.fields.find(field => field.unit.id === unit.id)?.label + ': ' : ''}${response.first?.[unit.id].correct ? 'ถูกต้อง' : 'ลองดูคำตอบนี้'}`}</strong>{task.answerSentences ? <AnnotatedReply sentences={task.answerSentences} /> : <p lang="de">{task.kind === 'digits' || task.kind === 'text' || task.kind === 'profile' ? <NounText text={unit.nounLabel ?? unit.answer} /> : <GermanListenText text={unit.answer} />}</p>}<p>{unit.meaning}</p></>}</div>)}
        <div className="phrase-discovery-reason"><strong>เหตุผล</strong><Explanation text={task.explanation} /></div>
      </div>}
      {dialogueUnits(task).map(unit=>{const first=response.first?.[unit.id];return <ExerciseReportButton key={unit.id} context={{lessonId,skill:"phrases",questionId:unit.id,questionVersion:null,bankKey:dialogueStorageKey(lessonId),sessionId:run.id,prompt:task.kind==='profile'?`${task.prompt} · ${task.fields.find(field=>field.unit.id===unit.id)?.label??''}`:task.prompt,learnerAnswer:first?.response??dialogueAnswer(task,response,unit),checked:!!first,...(first?{correct:first.correct,expectedAnswers:[unit.answer],feedback:task.explanation}:{})}}/>;})}
      <div className="guided-navigation">{back}{checked ? <button className="button primary" onClick={() => void advance()}>{run.step === run.queue.length - 1 ? 'จบการเรียน' : 'ต่อไป'} <ArrowRight size={17} /></button> : <button className="button primary" disabled={!canCheckDialogue(task, response)} onClick={check}>ตรวจคำตอบ</button>}</div>
    </div></section>;
}
