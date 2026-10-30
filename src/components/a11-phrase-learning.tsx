"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import targets from "@/data/a11-phrase-targets.json";
import { useLearning } from "./learning-store";
import { useVocabularyAudio } from "./vocabulary-audio";

export function A11PhraseLearning({ lessonId }: { lessonId: string }) {
  const history = useLearning();
  const { play, error: audioError } = useVocabularyAudio();
  const phrases = targets.filter(target => target.lessonId === lessonId);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const restoredLesson = useRef("");
  const target = phrases[index];
  const learned = new Set(history.exposures.map(entry => entry.item_id));
  const learnedCount = phrases.filter(phrase => learned.has(phrase.id)).length;
  useEffect(() => {
    if (!history.ready || restoredLesson.current === lessonId || !phrases.length) return;
    restoredLesson.current = lessonId;
    const next = phrases.findIndex(phrase => !learned.has(phrase.id));
    setIndex(next < 0 ? phrases.length - 1 : next);
  }, [history.ready, lessonId, phrases, learned]);
  if (!target || !/^L(?:0[3-9]|1[0-2])$/.test(lessonId)) return <p role="alert">ไม่พบประโยคของบทนี้</p>;
  const done = phrases.every(phrase => learned.has(phrase.id));
  async function advance() {
    if (busy) return;
    setBusy(true);
    setSaveError(false);
    try {
      if (!learned.has(target.id)) await history.act("expose", { itemId: target.id });
      if (index < phrases.length - 1) setIndex(index + 1);
    } catch { setSaveError(true); }
    finally { setBusy(false); }
  }
  return <main className="a11-phrase-learning">
    <Link href={`/lesson/${lessonId}`} className="back-link"><ArrowLeft size={17} /> กลับไปบทเรียน</Link>
    <div className="page-heading"><div><span className="eyebrow">REDEMITTEL · LEKTION {lessonId.slice(1)}</span><h1>เรียนประโยคที่ใช้ในบทนี้</h1><p>อ่านความหมาย ฟังเสียง แล้วกดเรียนแล้วทีละประโยค</p></div></div>
    <section className="a11-phrase-learning-card" aria-label={`ประโยค ${index + 1} จาก ${phrases.length}`}>
      <p className="eyebrow">เรียนแล้ว {learnedCount} / {phrases.length} ประโยค</p>
      <div className="practice-progress-track"><span style={{ width: `${learnedCount / phrases.length * 100}%` }} /></div>
      <h2 lang="de">{target.de}</h2>
      <button type="button" className="button secondary" onClick={() => play(target.de)}><Volume2 size={17} /> ฟังเสียง</button>
      <p lang="th" className="a11-phrase-learning-meaning">{target.th}</p>
      {audioError && <p role="status">{audioError}</p>}
      {saveError && <p role="alert">บันทึกการเรียนไม่สำเร็จ กรุณาลองอีกครั้ง</p>}
      <div className="a11-phrase-learning-actions">
        {index > 0 && <button type="button" className="button secondary" onClick={() => setIndex(index - 1)}>ย้อนกลับ</button>}
        {index < phrases.length - 1
          ? <button type="button" className="button primary" onClick={() => void advance()} disabled={busy}>{learned.has(target.id) ? "ต่อไป" : "เรียนแล้ว · ต่อไป"} <ArrowRight size={17} /></button>
          : learned.has(target.id) && done
            ? <Link className="button primary" href={`/practice/${lessonId}/phrases/basic`}>ทำแบบฝึกหัด <ArrowRight size={17} /></Link>
            : <button type="button" className="button primary" onClick={() => void advance()} disabled={busy}>เรียนแล้ว <ArrowRight size={17} /></button>}
      </div>
    </section>
  </main>;
}
