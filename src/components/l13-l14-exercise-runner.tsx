"use client";
import { ArbeitsbuchActivity } from "./l13-l14-arbeitsbuch-activity";
import { SupplementalActivity } from "./l13-l14-supplemental-activity";

import { useMemo, useRef, useState } from "react";
import {
  courseAssets,
  type CourseAttempt,
  type CourseCategory,
  type CourseLessonId,
  type CourseQuestion,
  courseCompetencyLabel,
  learningStageLabels,
} from "@/lib/l13-l14-course";
import type { PracticeSet } from "@/lib/l13-l14-course-exercises";
import { buildCrosswordGrid, crosswordEntries } from "@/lib/l13-l14-crossword";
const crosswordAnswers = crosswordEntries;
const { cells: crosswordCells, errors: crosswordErrors } = buildCrosswordGrid();
if (crosswordErrors.length) throw new Error(crosswordErrors.join("; "));
const byCell = new Map(crosswordCells.map((cell) => [`${cell.row}:${cell.col}`, cell]));
const emptyCrossword = () => Object.fromEntries(crosswordCells.map((cell) => [`${cell.row}:${cell.col}`, ""]));
const norm = (value: string) => value.normalize("NFC").trim().toLocaleUpperCase("de-DE");

function Crossword({ onComplete }: { onComplete: (answer: string, correct: boolean, hintCount: number) => void }) {
  const [cells, setCells] = useState<Record<string, string>>(emptyCrossword);
  const [active, setActive] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [hints, setHints] = useState(0);
  const lastIntersection = useRef("");
  const current = crosswordAnswers.find((entry) => entry.number === active) ?? crosswordAnswers[0];
  const image = courseAssets.find((asset) => asset.id === current.assetId);
  const path = (index: number) => ({
    row: current.row + (current.direction === "down" ? index : 0),
    col: current.col + (current.direction === "across" ? index : 0),
  });
  function focusCell(row: number, col: number) {
    document.getElementById(`crossword-${row}-${col}`)?.focus();
  }
  function typeLetter(row: number, col: number, letter: string) {
    setCells((previous) => ({ ...previous, [`${row}:${col}`]: letter }));
    const entry = crosswordAnswers.find((item) => item.number === active)!;
    const position = [...entry.answer].findIndex((_char, index) => {
      const point = path(index);
      return point.row === row && point.col === col;
    });
    if (position < entry.answer.length - 1) {
      const next = path(position + 1);
      focusCell(next.row, next.col);
    }
    setFeedback("");
  }
  function check() {
    const answer = crosswordAnswers.map((entry) => [...entry.answer].map((_char, index) => {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const col = entry.col + (entry.direction === "across" ? index : 0);
      return cells[`${row}:${col}`] ?? "";
    }).join("")).join("|");
    const correct = crosswordAnswers.every((entry) => [...entry.answer].every((_char, index) => {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const col = entry.col + (entry.direction === "across" ? index : 0);
      return norm(cells[`${row}:${col}`] ?? "") === entry.answer[index];
    }));
    setFeedback(correct ? "ถูกต้อง ครบทุกคำแล้ว" : "ยังมีตัวอักษรที่ไม่ตรง ลองตรวจแต่ละคำอีกครั้ง");
    onComplete(answer, correct, hints);
  }
  function revealFirst() {
    const index = [...current.answer].findIndex((_char, i) => {
      const point = path(i);
      return !cells[`${point.row}:${point.col}`];
    });
    if (index < 0) return;
    const point = path(index);
    setCells((previous) => ({ ...previous, [`${point.row}:${point.col}`]: current.answer[index] }));
    setHints((value) => value + 1);
    focusCell(point.row, point.col);
  }
  return (
    <div className="a13-course-crossword">
      <div className="a13-course-crossword-grid-wrap" aria-label="ตารางคำไขว้">
        <div className="a13-course-crossword-grid">
          {Array.from({ length: 8 }, (_row, row) => Array.from({ length: 15 }, (_col, col) => {
            const cell = byCell.get(`${row}:${col}`);
            if (!cell) return <span className="crossword-void" key={`${row}:${col}`} aria-hidden="true" />;
            const selected = cell.entries.includes(active);
            return (
              <span className={`crossword-cell ${selected ? "active" : ""}`} key={`${row}:${col}`}>
                {cell.number && <small aria-hidden="true">{cell.number}</small>}
                <input
                  id={`crossword-${row}-${col}`}
                  aria-label={`แถว ${row + 1} คอลัมน์ ${col + 1}${cell.number ? ` คำที่ ${cell.number}` : ""}`}
                  maxLength={2}
                  value={cells[`${row}:${col}`] ?? ""}
                  onFocus={() => { if (cell.entries.length === 1) setActive(cell.entries[0]); }}
                  onClick={() => {
                    if (cell.entries.length < 2) return;
                    const key = `${row}:${col}`;
                    if (lastIntersection.current === key) setActive(cell.entries[(cell.entries.indexOf(active) + 1) % cell.entries.length]);
                    else if (!cell.entries.includes(active)) setActive(cell.entries[0]);
                    lastIntersection.current = key;
                  }}
                  onChange={(event) => {
                    const character = [...event.target.value.normalize("NFC").toLocaleUpperCase("de-DE")].at(-1) ?? "";
                    if (character) typeLetter(row, col, character);
                    else setCells((previous) => ({ ...previous, [`${row}:${col}`]: "" }));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Tab" && cell.entries.length > 1) {
                      event.preventDefault();
                      setActive(cell.entries[(cell.entries.indexOf(active) + 1) % cell.entries.length]);
                    }
                    if (event.key === "Backspace" && !cells[`${row}:${col}`]) {
                      const entry = crosswordAnswers.find((item) => item.number === active)!;
                      const index = [...entry.answer].findIndex((_char, i) => { const point = path(i); return point.row === row && point.col === col; });
                      const previous = path(Math.max(0, index - 1));
                      setCells((before) => ({ ...before, [`${previous.row}:${previous.col}`]: "" }));
                      focusCell(previous.row, previous.col);
                    }
                    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
                      event.preventDefault();
                      const deltas: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };
                      const [dr, dc] = deltas[event.key];
                      const next = byCell.get(`${row + dr}:${col + dc}`);
                      if (next) focusCell(next.row, next.col);
                    }
                  }}
                />
              </span>
            );
          }))}
        </div>
      </div>
      <aside className="a13-course-crossword-clues">
        <div className="a13-course-crossword-entry-tabs" role="group" aria-label="เลือกคำใบ้">
          {crosswordAnswers.map((entry) => <button key={entry.number} type="button" aria-pressed={entry.number === active} onClick={() => setActive(entry.number)}>{entry.number} · {entry.direction === "down" ? "ลง" : "ขวาง"}</button>)}
        </div>
        {image && <img src={image.src} alt={image.alt} />}
        <p>{current.number}. {current.clue}</p>
        <div className="a13-course-actions">
          <button type="button" className="button secondary" onClick={revealFirst}>เปิดตัวอักษรหนึ่งช่อง</button>
          <button type="button" className="button primary" onClick={check}>ตรวจคำไขว้</button>
        </div>
        {feedback && <p role="status" className="a13-course-feedback">{feedback}</p>}
        <button type="button" className="button secondary" onClick={() => setCells(emptyCrossword())}>ล้างตาราง</button>
      </aside>
    </div>
  );
}

function ExerciseQuestion({ question, onAnswer }: { question: CourseQuestion; onAnswer: (answer: string, correct: boolean | null, hints: number, evaluation: CourseAttempt["evaluationMethod"]) => void }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hints, setHints] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [recorded, setRecorded] = useState<Blob | null>(null);
  const [recordUrl, setRecordUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [activeLeft, setActiveLeft] = useState("");
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [ordered, setOrdered] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(() => question.kind === "map_route" ? [question.startNode] : []);
  const asset = "assetId" in question ? courseAssets.find((entry) => entry.id === question.assetId) : undefined;

  function submit(value: string, correct: boolean | null, evaluation: CourseAttempt["evaluationMethod"] = "deterministic", hintCount = hints) {
    setFeedback(correct === null ? "บันทึกคำตอบแล้ว ใช้รายการตรวจด้านล่างประเมินด้วยตนเอง" : correct ? question.explanation : "wrongExplanation" in question && question.wrongExplanation ? `ยังไม่ตรง: ${question.wrongExplanation}` : "ยังไม่ตรง ลองอีกครั้งหรือเปิดคำใบ้");
    onAnswer(value, correct, hintCount, evaluation);
  }
  function speak(text: string) {
    const voices = typeof window !== "undefined" ? window.speechSynthesis?.getVoices() ?? [] : [];
    const voice = voices.find((entry) => entry.lang.toLowerCase().startsWith("de"));
    if (!voice || !window.speechSynthesis) { setFeedback("อุปกรณ์นี้ไม่มีเสียงสังเคราะห์ภาษาเยอรมัน จึงไม่บันทึกคะแนนการฟัง"); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice.lang;
    utterance.voice = voice;
    utterance.onend = () => setAudioPlayed(true);
    window.speechSynthesis.speak(utterance);
  }
  const isQuestionCorrect = (candidate: string) => {
    switch (question.kind) {
      case "multiple_choice": case "image_hotspot": return candidate === question.answerId;
      case "multi_select": return JSON.stringify([...candidate.split("|")].sort()) === JSON.stringify([...question.answerIds].sort());
      case "cloze": return (!question.audioText || audioPlayed) && question.acceptedAnswers.some((entry) => question.caseSensitive ? candidate.trim() === entry : norm(candidate) === norm(entry));
      case "word_order": return question.acceptedOrders.some((entry) => JSON.stringify(entry) === JSON.stringify(candidate.split("|")));
      case "dialogue_builder": return (!question.audioText || audioPlayed) && question.acceptedOrders.some((entry) => JSON.stringify(entry) === JSON.stringify(candidate.split("|")));
      case "true_false_evidence": return candidate === String(question.answer);
      case "audio_mcq": return candidate === question.answerId && audioPlayed;
      case "audio_route": case "map_route": return question.acceptedRoutes.some((entry) => JSON.stringify(entry) === JSON.stringify(candidate.split("|")));
      case "letter_slots": case "flashcard_recall": return norm(candidate) === norm(question.answer);
      case "matching": return Object.entries(question.answerPairs).every(([left, right]) => candidate.split("|").includes(`${left}:${right}`));
      case "categorization": return Object.entries(question.answerBuckets).every(([item, bucket]) => candidate.split("|").includes(`${item}:${bucket}`));
      default: return false;
    }
  };
  const canSubmit = answer.length > 0;
  const prompt = "prompt" in question ? question.prompt : question.kind === "true_false_evidence" ? question.statement : "ทำกิจกรรม";
  const choices = "options" in question ? question.options : [];

  let interaction;
  switch (question.kind) {
    case "text_marking": case "codeword_riddle":
      interaction = <ArbeitsbuchActivity question={question} onAnswer={(value,correct,hintCount)=>onAnswer(value,correct,hintCount,"deterministic")} />;
      break;
    case "word_search": case "context_bank":
      interaction = <SupplementalActivity question={question} onAnswer={(value,correct,hintCount)=>onAnswer(value,correct,hintCount,"deterministic")} />;
      break;
    case "multiple_choice": case "image_hotspot": case "audio_mcq":
      interaction = <>
        {asset && <img className="a13-course-question-image" src={asset.src} alt={asset.alt} />}
        {question.kind === "audio_mcq" && <button type="button" className="button secondary" onClick={() => speak(question.audioText)}>▶ ฟังเสียงสังเคราะห์ภาษาเยอรมัน</button>}
        <div className="a13-course-choices" role="group" aria-label="ตัวเลือก">
          {choices.map((option) => <button type="button" key={option.id} className={answer === option.id ? "selected" : ""} aria-pressed={answer === option.id} onClick={() => setAnswer(option.id)}>{option.text}</button>)}
        </div>
        {question.kind === "audio_mcq" && !audioPlayed && <small>ฟังก่อนส่งคำตอบ ระบบจะนับเฉพาะเมื่อมีเสียงภาษาเยอรมันให้ฟัง</small>}
      </>;
      break;
    case "multi_select":
      interaction = <div className="a13-course-choices">{question.options.map((option) => <button type="button" key={option.id} aria-pressed={selected.includes(option.id)} className={selected.includes(option.id) ? "selected" : ""} onClick={() => setSelected((old) => old.includes(option.id) ? old.filter((id) => id !== option.id) : [...old, option.id])}>{option.text}</button>)}<button type="button" className="button primary" onClick={() => { const value = selected.join("|"); setAnswer(value); submit(value, isQuestionCorrect(value)); }}>ตรวจคำตอบ</button></div>;
      break;
    case "matching":
      interaction = <div className="a13-course-match">{question.left.map((left) => <div key={left.id}><span>{left.text}</span><select aria-label={`จับคู่ ${left.text}`} value={pairs[left.id] ?? ""} onChange={(event) => setPairs((old) => ({ ...old, [left.id]: event.target.value }))}><option value="">เลือกคำคู่กัน</option>{question.right.map((right) => <option key={right.id} value={right.id}>{right.text}</option>)}</select></div>)}<button type="button" className="button primary" onClick={() => { const value = Object.entries(pairs).map(([a,b]) => `${a}:${b}`).join("|"); setAnswer(value); submit(value, isQuestionCorrect(value)); }}>ตรวจการจับคู่</button></div>;
      break;
    case "cloze":
      interaction = <>{asset && <img className="a13-course-question-image" src={asset.src} alt={asset.alt} />}<p lang="de">{question.sentence.replace("___", "____")}</p>{question.audioText && <button type="button" className="button secondary" onClick={() => speak(question.audioText!)}>▶ ฟังเสียงสังเคราะห์ภาษาเยอรมัน</button>}<label className="a13-course-answer"><span>คำตอบ</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} /></label>{question.audioText && !audioPlayed && <small>ต้องฟังเสียงก่อนส่งคำตอบ · ใช้เสียงสังเคราะห์จากอุปกรณ์</small>}</>;
      break;
    case "word_order": case "dialogue_builder": {
      const tokens = question.kind === "word_order" ? question.tokens : question.turns.map((entry) => entry.id);
      const labels: Record<string, string> = question.kind === "word_order" ? Object.fromEntries(question.tokens.map((token, index) => [`${index}`, token])) : Object.fromEntries(question.turns.map((entry) => [entry.id, entry.text]));
      const orderedIds = ordered.length ? ordered : [];
      interaction = <div className="a13-course-word-order">{question.kind === "dialogue_builder" && question.audioText && <button type="button" className="button secondary" onClick={() => speak(question.audioText!)}>▶ ฟังเสียงสังเคราะห์ภาษาเยอรมัน</button>}<p>เลือกคำตามลำดับประโยค:</p><div className="a13-course-choices">{tokens.map((token, index) => {const id = question.kind === "word_order" ? `${index}` : token; return <button key={id} type="button" disabled={orderedIds.includes(id)} onClick={() => setOrdered((old) => [...old, id])}>{labels[id]}</button>;})}</div><ol>{orderedIds.map((id) => <li key={id}>{labels[id]}</li>)}</ol>{question.kind === "dialogue_builder" && question.audioText && !audioPlayed && <small>ฟังเสียงก่อนส่งคำตอบ</small>}<button type="button" className="button secondary" onClick={() => setOrdered([])}>เริ่มเรียงใหม่</button></div>;
      break;
    }
    case "letter_slots":
      interaction = <><p className="a13-course-letter-slots" aria-label={`${question.answer.length} ช่อง`}>{Array.from({length:[...question.answer].length},(_v,index)=><span key={index}>{answer[index] ?? "_"}</span>)}</p><label className="a13-course-answer"><span>พิมพ์คำตอบ</span><input autoCapitalize="characters" value={answer} onChange={(event)=>setAnswer(event.target.value)} /></label></>;
      break;
    case "crossword":
      interaction = <Crossword onComplete={(value, correct, hintCount) => { setHints(hintCount); submit(value, correct, "deterministic", hintCount); }} />;
      break;
    case "categorization":
      interaction = <div className="a13-course-match">{question.items.map((item) => <label key={item.id}><span>{item.text}</span><select value={assignments[item.id] ?? ""} onChange={(event) => setAssignments((old) => ({...old,[item.id]:event.target.value}))}><option value="">เลือกหมวด</option>{question.buckets.map((bucket) => <option key={bucket.id} value={bucket.id}>{bucket.text}</option>)}</select></label>)}</div>;
      break;
    case "true_false_evidence":
      interaction = <><blockquote lang="de">{question.passage}</blockquote><div className="a13-course-choices">{[["true","ถูก"],["false","ผิด"]].map(([key,label])=><button key={key} type="button" className={answer===key?"selected":""} aria-pressed={answer===key} onClick={()=>setAnswer(key)}>{label}</button>)}</div>{feedback && <details><summary>ดูหลักฐานในข้อความ</summary><p lang="de">{question.evidence}</p></details>}</>;
      break;
    case "text_response":
      interaction = <><textarea rows={5} value={answer} onChange={(event)=>setAnswer(event.target.value)} aria-label="เขียนคำตอบ" placeholder="เขียนคำตอบของคุณเป็นภาษาเยอรมัน"/><p>เป้าหมาย: อย่างน้อย {question.minimumWords} คำ</p><ul>{question.rubric.map((rule)=><li key={rule}><label><input type="checkbox" /> {rule}</label></li>)}</ul></>;
      break;
    case "audio_route": case "map_route": {
      const route = selected;
      const mapNodes = [
        { id: "bahnhof", label: "Bahnhof", x: 10, y: 38 }, { id: "ampel", label: "Ampel", x: 42, y: 38 },
        { id: "post", label: "Post", x: 72, y: 18 }, { id: "bank", label: "Bank", x: 72, y: 58 },
        { id: "cafe", label: "Café", x: 42, y: 76 }, { id: "zentrum", label: "Zentrum", x: 72, y: 88 },
        { id: "polizei", label: "Polizei", x: 91, y: 58 },
      ];
      interaction = <><div className="a13-course-map" role="group" aria-label="แผนผังเมือง เลือกจุดตามลำดับเส้นทาง"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M5 38 H48 M42 12 V90 M42 38 L75 18 M42 38 L75 58 M72 58 H96 M42 76 H75 M72 18 V88" /></svg>{mapNodes.map((node)=><button key={node.id} type="button" className={route.includes(node.id)?"chosen":""} aria-pressed={route.includes(node.id)} style={{left:`${node.x}%`,top:`${node.y}%`}} onClick={()=>{const next=route.includes(node.id)?route: [...route,node.id];setSelected(next);setAnswer(next.join("|"));}}>{route.includes(node.id)&&<b>{route.indexOf(node.id)+1}. </b>}{node.label}</button>)}</div>{question.kind === "audio_route" && <button type="button" className="button secondary" onClick={()=>speak(question.audioText)}>▶ ฟังเส้นทางเสียงสังเคราะห์</button>}<p>จุดที่เลือก: {route.map((node)=>mapNodes.find((entry)=>entry.id===node)?.label).filter(Boolean).join(" → ") || "ยังไม่ได้เลือก"}</p><button type="button" className="button secondary" onClick={()=>{setSelected([]);setAnswer("");}}>ล้างเส้นทาง</button></>;
      break;
    }
    case "recorded_speech":
      interaction = <><p lang="de" className="a13-course-speech-model">{question.example}</p><ul>{question.checklist.map((item)=><li key={item}><label><input type="checkbox"/> {item}</label></li>)}</ul><div className="a13-course-actions"><button type="button" className="button secondary" disabled={recording} onClick={async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});const recorder=new MediaRecorder(stream);const chunks:BlobPart[]=[];recorder.ondataavailable=(event)=>chunks.push(event.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType});setRecorded(blob);setRecordUrl(URL.createObjectURL(blob));stream.getTracks().forEach((track)=>track.stop());};recorder.start();setRecording(true);window.setTimeout(()=>{if(recorder.state!=="inactive")recorder.stop();setRecording(false);},15000);setTimeout(()=>{if(recorder.state!=="inactive")recorder.stop();setRecording(false);},15000);}catch{setFeedback("เปิดไมโครโฟนไม่ได้ คุณยังทำกิจกรรมด้วยการอ่านตัวอย่างและ checklist ได้");}}}>{recording?"กำลังบันทึก (สูงสุด 15 วินาที)":"เริ่มบันทึกเสียงในอุปกรณ์"}</button>{recorded&&<audio controls src={recordUrl} aria-label="ฟังเสียงที่บันทึก"/>}</div></>;
      break;
    case "flashcard_recall":
      interaction = <><div className="a13-course-flashcard"><strong lang="de">{question.prompt}</strong>{revealed&&<p>{question.answer} · {question.meaning}</p>}</div><button type="button" className="button secondary" onClick={()=>setRevealed(true)}>{revealed?"ทบทวนคำตอบ":"เปิดดูคำตอบ"}</button>{revealed&&<div className="a13-course-choices"><button type="button" onClick={()=>{setAnswer("จำได้");submit(question.answer,true,"manual");}}>จำได้</button><button type="button" onClick={()=>{setHints((value)=>value+1);setAnswer("ทบทวน");submit(question.answer,false,"manual");}}>ต้องทบทวน</button></div>}</>;
      break;
  }

  const evidenceQuestions = question.kind === "text_response" || question.kind === "recorded_speech" || question.kind === "flashcard_recall";
  return <article className="a13-course-exercise-question">
    <h3>{prompt}</h3>
    {"passage" in question && <blockquote lang="de">{question.passage}</blockquote>}
    {interaction}
    {"hint" in question && question.kind !== "crossword" && question.kind !== "word_search" && question.kind !== "context_bank" && question.kind !== "text_marking" && question.kind !== "codeword_riddle" && <div className="a13-course-actions"><button type="button" className="button secondary" onClick={()=>{setHints((n)=>n+1);setFeedback(`คำใบ้: ${question.hint}`);}}>ขอคำใบ้</button>
      {!evidenceQuestions && question.kind !== "multi_select" && <button type="button" className="button primary" disabled={(!canSubmit && !["matching","categorization","word_order","dialogue_builder","audio_route","map_route"].includes(question.kind)) || ((question.kind === "audio_mcq" || question.kind === "audio_route" || (question.kind === "cloze" && !!question.audioText) || (question.kind === "dialogue_builder" && !!question.audioText)) && !audioPlayed)} onClick={()=>{let value=answer; if(question.kind==="word_order")value=ordered.map((tokenIndex)=>question.tokens[Number(tokenIndex)]).join("|");if(question.kind==="dialogue_builder")value=ordered.join("|");if(question.kind==="matching")value=Object.entries(pairs).map(([a,b])=>`${a}:${b}`).join("|");if(question.kind==="categorization")value=Object.entries(assignments).map(([a,b])=>`${a}:${b}`).join("|");if(question.kind==="audio_route"||question.kind==="map_route")value=selected.join("|");setAnswer(value);submit(value,isQuestionCorrect(value));}}>ตรวจคำตอบ</button>}
      {evidenceQuestions && <button type="button" className="button primary" disabled={!answer && question.kind === "text_response"} onClick={()=>submit(answer,null,question.kind === "recorded_speech" ? "manual" : "rubric")}>{question.kind === "text_response" ? "บันทึกฉบับร่างและประเมิน" : "ประเมินกิจกรรมด้วยตนเอง"}</button>}
    </div>}
    {feedback&&<p role="status" className="a13-course-feedback">{feedback}</p>}
  </article>;
}

export function CourseExerciseRunner({ set, onAttempt }: { set: PracticeSet; onAttempt: (attempt: CourseAttempt) => void }) {
  const [index,setIndex]=useState(0);
  const [attemptCount,setAttemptCount]=useState(0);
  const question=set.questions[index];
  const startedAt=useMemo(()=>new Date().toISOString(),[set.id,index]);
  return <section className="a13-course-runner">
    <div className="a13-course-runner-heading"><span className="eyebrow">ระดับ {set.difficulty}</span><h2>{set.title}</h2>{set.learningStage && <p>{learningStageLabels[set.learningStage]}</p>}{set.builtInSupport && <p>มีคลังคำให้ใช้ ชุดนี้จึงนับเป็นการฝึกแบบมีตัวช่วย</p>}<p>ทักษะหลักที่ฝึก: {(set.id.includes("-SUP-") || set.id.includes("-AB-")) ? courseCompetencyLabel(set.primaryCompetency) : set.primaryCompetency.replaceAll("."," · ")}</p>{set.secondaryCompetencies && <p>ทักษะรองที่ฝึก: {set.secondaryCompetencies.map(courseCompetencyLabel).join(" · ")}</p>}<small>ข้อ {index+1} / {set.questions.length} · ส่งคำตอบแล้ว {attemptCount} ครั้ง</small></div>
    <ExerciseQuestion key={question.id} question={question} onAnswer={(response,correctness,hintsUsed,evaluationMethod)=>{
      const recordedHints=set.builtInSupport ? Math.max(1,hintsUsed) : hintsUsed;
      setAttemptCount((count)=>count+1);
      const wrongTag = correctness === false
        ? set.patternId.startsWith("GR-03") ? "wrong_preposition"
          : set.patternId === "GR-04" || set.patternId === "GR-07" ? "wrong_dative_pronoun"
            : set.category === "vocabulary" ? "misspelled_ort"
              : set.category === "listening" && set.patternId === "HOE-04" ? "route_sequence"
                : set.category === "reading" ? "reading_detail"
                  : set.category === "phrases" ? "context_mismatch" : "answer_mismatch"
        : undefined;
      onAttempt({attemptId:crypto.randomUUID(),exerciseId:set.id,questionId:question.id,lessonId:set.lessonId,category:set.category,topicIds:set.topicIds,primaryCompetency:set.primaryCompetency,patternId:set.patternId,response,startedAt,submittedAt:new Date().toISOString(),correctness:correctness===null?null:correctness?1:0,errorTag:wrongTag,maxScore:1,hintsUsed:recordedHints,retryNumber:attemptCount,evaluationMethod,answerVersion:"v1"});
    }}/>
    {index>0&&<button type="button" className="button secondary" onClick={()=>setIndex((n)=>n-1)}>คำถามก่อนหน้า</button>}{index<set.questions.length-1&&<button type="button" className="button primary" onClick={()=>setIndex((n)=>n+1)}>คำถามถัดไป</button>}
  </section>;
}
