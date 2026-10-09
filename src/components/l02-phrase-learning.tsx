"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Volume2 } from "lucide-react";
import { l02StatusExamples, l02StatusWords } from "@/lib/l02-phrase-content";
import { useContent } from "./content-provider";
import { useLearning } from "./learning-store";
import { CategoryTabLabel, LearningCategoryTabs } from "./learning-breadcrumbs";
import { useVocabularyAudio } from "./vocabulary-audio";

const categories = [
  { de: "Beruflicher Status", th: "สถานะการทำงาน" },
  { de: "Traumberuf", th: "อาชีพในฝัน" },
  { de: "Weitere Redemittel", th: "ประโยคและสำนวนอื่น" },
];

export function L02PhraseLearning() {
  const { items } = useContent();
  const history = useLearning();
  const { play: playWord, error: audioError } = useVocabularyAudio();
  const [category, setCategory] = useState(0);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const root = useRef<HTMLElement>(null);
  const pending = useRef(new Set<string>());
  const recording = useRef(false);
  const mounted = useRef(true);
  const previousCategory = useRef(category);
  const pool = items.filter((item) => item.lessonId === "L02" && item.skill === "phrases");
  const seen = new Set(history.exposures.map((entry) => entry.item_id));
  const seenKey = pool.filter((item) => seen.has(item.id)).map((item) => item.id).join("|");
  const others = pool.filter((item) => item.id !== "L02-traumberuf" && item.id !== "L02-question-was" && !l02StatusExamples.some((entry) => entry.id === item.id));
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  useLayoutEffect(() => {
    if (previousCategory.current !== category) {
      previousCategory.current = category;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [category]);

  // Reuse ItemExposure and record only content actually visible to the learner.
  useEffect(() => {
    async function flushVisible() {
      if (recording.current) return;
      recording.current = true;
      try {
        while (mounted.current && pending.current.size) {
          const id = pending.current.values().next().value!;
          await history.act("expose", { itemId: id });
          pending.current.delete(id);
        }
      } catch {
        pending.current.clear();
        if (mounted.current) setError("บันทึกการเรียนไม่สำเร็จ กรุณาลองอีกครั้ง");
      } finally {
        recording.current = false;
      }
    }
    const observer = new IntersectionObserver((entries) => {
      if (document.visibilityState !== "visible") return;
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.learningItem;
        if (!entry.isIntersecting || !id || seen.has(id) || pending.current.has(id)) continue;
        pending.current.add(id);
      }
      void flushVisible();
    }, { threshold: 0.3 });
    const observe = () => {
      if (document.visibilityState !== "visible") return;
      observer.disconnect();
      root.current?.querySelectorAll<HTMLElement>("[data-learning-item]").forEach((element) => observer.observe(element));
    };
    observe();
    document.addEventListener("visibilitychange", observe);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", observe); };
  }, [category, seenKey, retry]); // eslint-disable-line react-hooks/exhaustive-deps

  function audio(text: string) {
    return <button className="vocabulary-word-audio" type="button" lang="de" aria-label={`ฟัง ${text}`} onClick={() => playWord(text)}><span>{text}</span><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /></button>;
  }
  return <main ref={root} className="guided-learning l02-phrase-learning">
    <h1 className="sr-only">ประโยคและสำนวน Lektion 2</h1>
    <LearningCategoryTabs currentKey={category} ariaLabel="หมวดประโยคและสำนวน">
      {categories.filter((_, index) => index !== 2 || others.length > 0).map((entry, index) => <button key={entry.de} className={`learning-category-tab${category === index ? " current" : ""}`} type="button" aria-current={category === index ? "page" : undefined} onClick={() => setCategory(index)}><CategoryTabLabel german={entry.de} thai={entry.th} /></button>)}
    </LearningCategoryTabs>
    <Link className="alphabet-entry-card l02-sentence-entry-card" href="/learn/L02/phrases/sentences">
      <span className="alphabet-entry-symbols" aria-hidden="true">Was? · Satz</span>
      <span className="alphabet-entry-copy"><span className="eyebrow">REDEMITTEL</span><span className="alphabet-entry-title"><strong>Fragen und Sätze</strong></span><small>คำถามและโครงสร้างประโยค</small></span>
      <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
    </Link>
    <div className="vocabulary-image-progress" aria-live="polite"><span>เรียนแล้ว {pool.filter((item) => seen.has(item.id)).length} / {pool.length} รายการ</span><div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${pool.length ? pool.filter((item) => seen.has(item.id)).length / pool.length * 100 : 0}%` }} /></div></div>
    <section className="guided-card">
      {category === 0 ? <>
        <h2>Beruflicher Status <small>— สถานะการทำงาน</small></h2>
        <p className="phrase-source">ที่มา: ชีทหน้า PDF 23 และสไลด์อาจารย์ Lektion 2</p>
        <table className="phrase-vocabulary-table"><thead><tr><th>คำศัพท์</th><th>ความหมาย</th></tr></thead><tbody>{l02StatusWords.map((id) => {
          const entry = l02StatusExamples.find((example) => example.id === id)!;
          return <tr key={id} data-learning-item={id}><td>{audio(entry.word)}</td><td>{entry.meaning}</td></tr>;
        })}</tbody></table>
        <h3>ตัวอย่างประโยค</h3>
        <div className="phrase-example-list">{l02StatusExamples.map((entry) => <div key={entry.id} data-learning-item={entry.id}>{audio(entry.de)}<p>{entry.th}</p></div>)}</div>
      </> : category === 1 ? <div data-learning-item="L02-traumberuf">
        <h2>{audio("Traumberuf")}</h2><p>อาชีพในฝัน</p>
        <div className="phrase-example-list"><div>{audio("Schreiben Sie Ihren Beruf und Traumberuf.")}<p>เขียนอาชีพและอาชีพในฝันของคุณ</p></div></div>
      </div> : <div className="phrase-example-list">{others.map((item) => <div key={item.id} data-learning-item={item.id}>{audio(item.answer)}<p>{item.meaning}</p>{item.example && item.example !== item.answer && <p lang="de">{item.example}</p>}</div>)}</div>}
      {(error || audioError) && <p role="alert">{error || audioError}{error && <button type="button" className="button secondary" onClick={() => { setError(""); setRetry((value) => value + 1); }}>ลองบันทึกใหม่</button>}</p>}
      <div className="guided-navigation"><button className="button secondary" type="button" disabled={category === 0} onClick={() => setCategory((value) => value - 1)}>ย้อนกลับ</button>{category < (others.length ? 2 : 1) ? <button className="button primary" type="button" onClick={() => setCategory((value) => value + 1)}>หน้าถัดไป</button> : <Link className="button primary" href="/learn/L02/phrases/sentences">เรียนคำถามและโครงสร้างประโยคต่อ</Link>}</div>
    </section>
  </main>;
}
