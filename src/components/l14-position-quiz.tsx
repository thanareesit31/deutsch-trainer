"use client";

import Image from "next/image";
import { useState } from "react";
import type { L14PositionKind } from "@/lib/guided-learning";
import { GermanListenText } from "./german-listen-text";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";

const questions = [
  { position: "in", word: "in", start: "Die Katze sitzt", end: "der Tasche.", meaning: "แมวนั่งอยู่ในกระเป๋า" },
  { position: "auf", word: "auf", start: "Die Katze liegt", end: "dem Tisch.", meaning: "แมวนอนอยู่บนโต๊ะ" },
  { position: "ueber", word: "über", start: "Die Katze sitzt", end: "dem Sofa.", meaning: "แมวอยู่เหนือโซฟา" },
  { position: "unter", word: "unter", start: "Die Katze schläft", end: "dem Bett.", meaning: "แมวนอนอยู่ใต้เตียง" },
  { position: "an", word: "an", start: "Die Katze sitzt", end: "der Tür.", meaning: "แมวนั่งอยู่ชิดประตู" },
  { position: "vor", word: "vor", start: "Die Katze sitzt", end: "dem Kamin.", meaning: "แมวนั่งอยู่หน้าเตาผิง" },
  { position: "hinter", word: "hinter", start: "Die Katze versteckt sich", end: "dem Vorhang.", meaning: "แมวซ่อนอยู่หลังม่าน" },
  { position: "neben", word: "neben", start: "Die Katze sitzt", end: "dem Fahrrad.", meaning: "แมวนั่งอยู่ข้างจักรยาน" },
  { position: "zwischen", word: "zwischen", start: "Die Katze sitzt", end: "den Stühlen.", meaning: "แมวนั่งอยู่ระหว่างเก้าอี้สองตัว" },
] satisfies { position: L14PositionKind; word: string; start: string; end: string; meaning: string }[];

const pageSize = 3;
const pageCount = questions.length / pageSize;
type QuizState = { page: number; solved: L14PositionKind[] };

function readQuizState(raw: string | null): QuizState {
  if (!raw) return { page: 0, solved: [] };
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return { page: 0, solved: [] };
    const solved = "solved" in value && Array.isArray(value.solved)
      ? questions.filter((question) => value.solved.includes(question.position)).map((question) => question.position)
      : [];
    const page = "page" in value && typeof value.page === "number" && Number.isInteger(value.page)
      ? Math.max(0, Math.min(value.page, pageCount - 1))
      : 0;
    return { page, solved };
  } catch {
    return { page: 0, solved: [] };
  }
}

export function L14PositionQuiz() {
  const storage = useLessonState();
  const [state, setState] = useState(() => readQuizState(storage.read(lessonStateKeys.l14PositionQuiz)));
  const [selected, setSelected] = useState<L14PositionKind | null>(null);
  const [wrong, setWrong] = useState(false);
  const pageQuestions = questions.slice(state.page * pageSize, (state.page + 1) * pageSize);
  const pageComplete = pageQuestions.every((question) => state.solved.includes(question.position));

  function persist(next: QuizState) {
    storage.write(lessonStateKeys.l14PositionQuiz, JSON.stringify(next));
    setState(next);
    setSelected(null);
    setWrong(false);
  }

  return <section className="l14-position-quiz">
    <h2>เติมคำจากภาพ</h2>
    <p>เลือกคำบอกตำแหน่งด้านบน แล้วแตะช่องว่างใต้ภาพแมว</p>
    <div className="l14-position-quiz-progress" aria-label={`หน้า ${state.page + 1} จาก ${pageCount}`}>
      <span>{state.page + 1}/{pageCount}</span>
      <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${state.solved.length / questions.length * 100}%` }} /></div>
    </div>
    <div className="l14-position-quiz-bank" aria-label="คำบอกตำแหน่งทั้ง 9 คำ">
      {questions.map((question) => <button
        key={question.position}
        type="button"
        className={`l14-position-quiz-word${selected === question.position ? " selected" : ""}${state.solved.includes(question.position) ? " used" : ""}`}
        aria-pressed={selected === question.position}
        disabled={state.solved.includes(question.position)}
        onClick={() => { setSelected(question.position); setWrong(false); }}
      ><span lang="de">{question.word}</span></button>)}
    </div>
    <div className="l14-position-quiz-grid">
      {pageQuestions.map((question, index) => {
        const solved = state.solved.includes(question.position);
        return <article key={question.position} className="l14-position-quiz-card">
          <Image
            className="l14-position-quiz-image"
            src={`/images/lektion-14-vocabulary/position-quiz-scenes-v2/${question.position}.jpg`}
            alt={`ภาพแมวสีส้มกับสิ่งของข้อ ${state.page * pageSize + index + 1}`}
            width={1536}
            height={1024}
            sizes="(max-width: 700px) 136px, 156px"
          />
          <div className="l14-position-quiz-sentence" lang="de">
            <span>{question.start}</span>
            <button
              type="button"
              className={`l14-position-quiz-slot${solved ? " solved" : ""}`}
              disabled={solved || !selected}
              aria-label={solved ? `คำตอบข้อ ${state.page * pageSize + index + 1}: ${question.word}` : `เติมคำในภาพข้อ ${state.page * pageSize + index + 1}`}
              onClick={() => {
                if (selected !== question.position) { setWrong(true); return; }
                persist({ ...state, solved: [...state.solved, question.position] });
              }}
            >{solved ? question.word : "_____"}</button>
            <span>{question.end}</span>
          </div>
          {solved && <div className="l14-position-quiz-result">
            <GermanListenText text={`${question.start} ${question.word} ${question.end}`} />
            <span>{question.meaning}</span>
          </div>}
        </article>;
      })}
    </div>
    {wrong && <p className="guided-feedback wrong" role="status">ลองอีกครั้ง</p>}
    {state.solved.length === questions.length && <p className="guided-feedback" role="status">เติมครบทั้ง 9 ภาพแล้ว</p>}
    <div className="guided-navigation">
      <button type="button" className="button secondary" disabled={state.page === 0}
        onClick={() => persist({ ...state, page: state.page - 1 })}>ก่อนหน้า</button>
      {state.page < pageCount - 1 && <button type="button" className="button primary" disabled={!pageComplete}
        onClick={() => persist({ ...state, page: state.page + 1 })}>หน้าถัดไป</button>}
    </div>
  </section>;
}
