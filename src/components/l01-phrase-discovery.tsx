"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2 } from 'lucide-react';
import { l01PhraseDiscovery } from '@/data/l01-phrase-discovery';
import { canCheckDiscovery, discoveryAnswer, discoverySteps, emptyDiscoveryResponse, newDiscoveryRun, parseDiscoveryHistory, phraseDiscoveryKey, type DiscoveryHistory, type DiscoveryRun, type DiscoveryScope, type DiscoveryTask } from '@/lib/phrase-discovery';
import { useLessonState } from './lesson-state-provider';
import { PhraseDiscoveryVisual } from './phrase-discovery-visual';
import { GermanListenText } from './german-listen-text';
import { PracticeGermanText } from './practice-german-text';
import { AnnotatedTurn } from './phrase-sentence';
import { DialogueAudio } from './phrase-dialogue-media';
import { sentencePresentation, dialogueRecording } from '@/lib/phrase-presentation';
import { taughtDiscoveryItemIds } from '@/lib/phrase-discovery';
import { useLearning } from './learning-store';
import { useContent } from './content-provider';

function DiscoveryTurn({speaker,text,meaning,question,reply,feedback=false}:{speaker:'A'|'B';text:string;meaning:string;question:string;reply:string;feedback?:boolean}){
 const sentences=sentencePresentation('L01',text);
 return sentences?<AnnotatedTurn speaker={speaker} sentences={sentences} meaning={meaning} audio={feedback?{source:dialogueRecording('L01',question,reply),text:question+' '+reply}:undefined}/>:<div className={`phrase-discovery-turn${speaker==='B'?' reply':''}`}><span>{speaker}</span><div><GermanListenText text={text}/><p>{meaning}</p></div></div>;
}

function DiscoveryReply({ task }: { task: DiscoveryTask }) {
  return task.kind === 'letters'
    ? <div className="phrase-discovery-letter-sounds" aria-label="ฟังตัวอักษรทีละตัว">{task.answer.replace(/\.$/, '').split('-').map((letter, index) => <GermanListenText key={index} text={letter} />)}</div>
    : <GermanListenText text={task.answer} />;
}

function ListenToName({ source, onComplete }: { source: string; onComplete: () => void }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => {
    if (audio.current) {
      audio.current.onended = null;
      audio.current.onerror = null;
      audio.current.pause();
    }
  }, []);
  function play() {
    setError('');
    setPlaying(true);
    const sound = new Audio(source);
    audio.current = sound;
    const failed = () => { setPlaying(false); setError('เล่นเสียงไม่สำเร็จ กดฟังอีกครั้ง'); };
    sound.onended = () => { setPlaying(false); onComplete(); };
    sound.onerror = failed;
    void sound.play().catch(failed);
  }
  return <div className="phrase-visual phrase-visual-facts">
    <button type="button" className="button primary" disabled={playing} onClick={play}><Volume2 size={24} aria-hidden="true" />{playing ? 'กำลังเล่นเสียง' : 'ฟังการสะกดชื่อ'}</button>
    <p>กดฟังซ้ำได้</p>{error && <p role="alert">{error}</p>}
  </div>;
}

export function L01PhraseDiscovery({ scope = 'all' }: { scope?: DiscoveryScope }) {
  const storage = useLessonState();
  const learning = useLearning();
  const content = useContent();
  const [busy, setBusy] = useState(false);
  const [exposureError, setExposureError] = useState('');
  const [history, setHistory] = useState<DiscoveryHistory | null>(() => {
    try {
      const saved = parseDiscoveryHistory(storage.read(phraseDiscoveryKey), l01PhraseDiscovery);
      return saved.runs.some(run => run.scope === scope) ? saved : { ...saved, runs: [...saved.runs, newDiscoveryRun({ scope })] };
    } catch { return null; }
  });
  useEffect(() => {
    if (history) storage.write(phraseDiscoveryKey, JSON.stringify(history));
  }, [history, storage.write]);
  const run = history?.runs.filter(entry => entry.scope === scope).at(-1);
  if (!history || !run) return <div role="alert">เปิดรอบที่บันทึกไว้ไม่ได้ กรุณาโหลดหน้าใหม่ ข้อมูลเดิมยังเก็บอยู่</div>;
  function update(change: (current: DiscoveryRun) => DiscoveryRun) {
    setHistory(current => {
      if (!current) return current;
      return { ...current, runs: current.runs.map(entry => entry.id === run?.id ? change(entry) : entry) };
    });
  }
  const steps = discoverySteps(l01PhraseDiscovery, run);
  if (run.completed) return <section className="guided-learning phrase-discovery">
    <div className="guided-card"><h1>{scope === 'supplement' ? 'เรียนกิจกรรมเพิ่มเติมครบแล้ว' : 'เรียนบทสนทนาครบแล้ว'}</h1>
      {run.bankVersion === 1 && <p>มีกิจกรรมขอให้สะกดชื่อและแนะนำตัวเพิ่มเติมให้ลอง</p>}
      <div className="guided-navigation">
        <button className="button secondary" onClick={() => setHistory(current => current ? { ...current, runs: [...current.runs, newDiscoveryRun({ scope })] } : current)}>ลองอีกรอบ</button>
        {run.bankVersion === 1 && <Link className="button primary" href="/learn/L01/phrases/discovery?part=supplement">เรียนกิจกรรมที่เพิ่ม <ArrowRight size={17} /></Link>}
        <Link className="button primary" href="/lesson/L01">จบ <ArrowRight size={17} /></Link>
        {learning.exposures.some(exposure => content.items.some(item => item.id === exposure.item_id && item.lessonId === 'L01' && item.skill === 'phrases')) && <Link className="button primary" href="/practice/L01/phrases">ฝึกสิ่งที่เรียนแล้ว <ArrowRight size={17} /></Link>}
      </div>
    </div>
  </section>;
  const step = steps[run.step];
  if (!step) return <p role="alert">ไม่พบกิจกรรมในรอบนี้</p>;
  async function advance() {
    if (busy) return;
    if (step.kind === 'model') {
      if (!learning.ready || learning.busy || learning.error) return;
      setBusy(true);
      setExposureError('');
      try {
        for (const itemId of taughtDiscoveryItemIds(step.topic, content.items)) {
          if (!learning.exposures.some(exposure => exposure.item_id === itemId)) await learning.act('expose', { itemId });
        }
      } catch {
        setExposureError('บันทึกการเรียนไม่สำเร็จ กรุณาลองอีกครั้ง');
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    update(current => {
      const active = steps[current.step];
      if (!active || (active.kind === 'task' && !current.responses[active.task.id]?.first)) return current;
      const next = current.step + 1;
      return { ...current, step: next, completed: next === steps.length,
        modelIds: active.kind === 'model' ? [...new Set([...current.modelIds, active.topic.id])] : current.modelIds };
    });
  }
  const progress = <div className="vocabulary-image-progress" aria-label={`กิจกรรม ${run.step + 1} จาก ${steps.length}`}>
    <span>{step.topic.title} · {run.step + 1} / {steps.length}</span>
    <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${run.step / steps.length * 100}%` }} /></div>
  </div>;
  if (step.kind === 'model') return <section className="guided-learning phrase-discovery phrase-dialogue-learning phrase-teaching-models">
    {progress}
    <div className="page-heading"><div><span className="eyebrow">REDEMITTEL · LEKTION 01</span><h1>{step.topic.title}</h1><p>อ่านหรือฟังตัวอย่าง แล้วลองตอบในสถานการณ์</p></div></div>
    <div className="guided-card">
      <section className="phrase-discovery-teaching"><h2>หลักการ</h2><ul className="guided-note phrase-discovery-note">{step.topic.note.split("\n").map(line => <li key={line}>{line}</li>)}</ul></section>
      <h2 className="phrase-discovery-examples-heading">ตัวอย่าง</h2>
      <div className="phrase-discovery-models">{step.topic.tasks.map(task => <div className="phrase-discovery-model phrase-model-annotated" key={task.id}>
        <div className="phrase-model-visual">{dialogueRecording('L01',task.prompt,task.answer)&&<DialogueAudio source={dialogueRecording('L01',task.prompt,task.answer)??''} label="ฟังตัวอย่างนี้"/>}<PhraseDiscoveryVisual visual={task.visual} /></div>
        <div className="phrase-model-dialogue"><DiscoveryTurn speaker="A" text={task.prompt} meaning={task.promptTh} question={task.prompt} reply={task.answer}/><DiscoveryTurn speaker="B" text={task.answer} meaning={task.answerTh} question={task.prompt} reply={task.answer}/></div>
      </div>)}</div>
      <div className="guided-navigation">
        {run.step > 0 && <button className="button secondary" onClick={() => update(current => ({ ...current, step: current.step - 1 }))}>ย้อนกลับ</button>}
        <button className="button primary" disabled={busy || learning.busy || !learning.ready || Boolean(learning.error)} onClick={advance}>ลองตอบ <ArrowRight size={17} /></button>
      </div>
      {(exposureError || learning.error) && <p role="alert">{exposureError || learning.error}</p>}
    </div>
  </section>;
  const task = step.task;
  const response = run.responses[task.id] ?? emptyDiscoveryResponse();
  const checked = response.first !== null;
  function edit(change: (value: typeof response) => typeof response) {
    update(current => {
      const previous = current.responses[task.id] ?? emptyDiscoveryResponse();
      return previous.first ? current : { ...current, responses: { ...current.responses, [task.id]: change(previous) } };
    });
  }
  function check() {
    update(current => {
      const value = current.responses[task.id] ?? emptyDiscoveryResponse();
      if (value.first || (task.kind === 'letters' && !(value.audioPlays && value.audioPlays > 0)) || !canCheckDiscovery(task, value.selection) || !current.modelIds.includes(step.topic.id)) return current;
      const answer = discoveryAnswer(task, value.selection);
      return { ...current, responses: { ...current.responses, [task.id]: { ...value, first: {
        response: answer, correct: answer === task.answer, submittedAt: new Date().toISOString(), helpWords: [...value.helpWords], modelSeen: true, assistance: task.kind === 'letters' ? [...task.listening.assistance] : [...task.assistance], visualContext: task.kind === 'letters' ? task.listening.version : task.visual.version,
        listening: task.kind === 'letters' ? { version: task.listening.version, targetId: task.listening.targetId, subskill: task.listening.subskill, completedPlays: value.audioPlays ?? 0 } : null,
      } } } };
    });
  }
  return <section className="guided-learning phrase-discovery phrase-dialogue-learning phrase-teaching-task" aria-label="ลองตอบบทสนทนา">
    {progress}
    <div className="guided-card">
      <div className="phrase-discovery-task-layout">
      {task.kind === 'letters' && !checked ? <ListenToName source={task.listening.audioSource} key={`${run.id}:${task.id}`} onComplete={() => edit(value => ({ ...value, audioPlays: (value.audioPlays ?? 0) + 1 }))} /> : <PhraseDiscoveryVisual visual={task.visual} />}
      <div className="phrase-discovery-task-copy"><h1 lang={task.kind === 'letters' ? 'th' : 'de'}>{task.kind === 'letters' ? 'ฟังแล้วเรียงตัวอักษร' : <><span className="phrase-discovery-prompt-speaker" aria-label="ผู้พูด A">A</span> <span className="phrase-discovery-prompt-text"><PracticeGermanText text={task.prompt} enabled={task.wordHelp} onHelp={word => edit(value => ({ ...value, helpWords: [...new Set([...value.helpWords, word])] }))} /></span></>}</h1>
      {task.kind !== 'letters' && <p className="guided-instruction">{task.kind === 'choice' ? 'ถ้าเป็นคุณ จะตอบว่าอย่างไร' : 'แตะคำด้านล่างเพื่อเรียงคำตอบ\nถ้าต้องการแก้ ให้แตะคำที่วางไว้เพื่อนำกลับ'}</p>}
      {task.kind === 'choice' ? <div className="guided-choices">{task.options.map((option, index) => <button type="button" key={option} lang="de" aria-pressed={response.selection.includes(index)} disabled={checked}
        className={`guided-choice${response.selection.includes(index) ? ' selected' : ''}${checked && option === task.answer ? ' correct' : ''}${checked && response.selection.includes(index) && option !== task.answer ? ' wrong' : ''}`}
        onClick={() => edit(value => ({ ...value, selection: [index] }))}>{option}</button>)}</div>
        : <div className="phrase-discovery-order">
          <div className="phrase-discovery-answer" aria-label="คำตอบที่เรียง" aria-live="polite">{response.selection.length ? response.selection.map((index, position) => <button type="button" className="button secondary" key={index} disabled={checked} lang="de" aria-label={`นำ ${task.tokens[index]} กลับ`} onClick={() => edit(value => ({ ...value, selection: value.selection.filter((_, at) => at !== position) }))}>{task.tokens[index]}</button>) : <span>คำตอบของคุณ</span>}</div>
          <div className="phrase-discovery-word-bank" aria-label={task.kind === 'letters' ? 'ตัวอักษรที่ให้' : 'คำที่ให้'}>{task.tokens.map((token, index) => <button type="button" className="button secondary" key={index} lang="de" disabled={checked || response.selection.includes(index)} onClick={() => edit(value => ({ ...value, selection: [...value.selection, index] }))}>{token}</button>)}</div>
        </div>}
      </div></div>
      {response.first && <div className={`phrase-discovery-feedback ${response.first.correct ? 'correct' : 'wrong'}`} role="status">
        <strong>{response.first.correct ? 'ถูกต้อง' : 'ยังไม่ถูก'}</strong>
        <DiscoveryTurn speaker="A" text={task.prompt} meaning={task.promptTh} question={task.prompt} reply={task.answer}/>
        <DiscoveryTurn speaker="B" text={task.answer} meaning={task.answerTh} question={task.prompt} reply={task.answer} feedback/>
        {task.kind==='letters'&&<DiscoveryReply task={task}/>}
        <div className="phrase-discovery-reason">{task.explanation.split("\n").map(line => <p key={line}>{line}</p>)}</div>
      </div>}
      <div className="guided-navigation">
        <button className="button secondary" onClick={() => update(current => ({ ...current, step: current.step - 1 }))}>ย้อนกลับ</button>
        {checked ? <button className="button primary" onClick={advance}>{run.step === steps.length - 1 ? 'จบการเรียน' : 'ต่อไป'} <ArrowRight size={17} /></button>
          : <button className="button primary" disabled={!canCheckDiscovery(task, response.selection) || (task.kind === 'letters' && !(response.audioPlays && response.audioPlays > 0))} onClick={check}>ตรวจคำตอบ</button>}
      </div>
    </div>
  </section>;
}
