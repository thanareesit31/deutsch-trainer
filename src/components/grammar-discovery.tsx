"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { grammarDiscoveryLesson, type DiscoveryQuestion } from "@/lib/grammar-discovery";
import { GermanListenText } from "./german-listen-text";

function DiscoveryChoices({ question, onCorrect }: { question: DiscoveryQuestion; onCorrect: () => void }) {
  const [wrong, setWrong] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  return <>
    <p className="guided-instruction">{question.prompt}</p>
    <div className="guided-choices">
      {question.choices.map((choice) => <button key={choice} type="button"
        className={`guided-choice${correct && choice === question.answer ? " correct" : ""}${wrong === choice ? " wrong" : ""}`}
        disabled={correct}
        onClick={() => {
          if (choice === question.answer) { setCorrect(true); setWrong(null); onCorrect(); }
          else setWrong(choice);
        }}>
        {choice}
      </button>)}
    </div>
    <p className={`guided-feedback${wrong ? " wrong" : correct ? " correct" : ""}`} role="status">
      {wrong ? question.hint : correct ? "ถูกต้อง" : "เลือกคำตอบจากตัวอย่างด้านบน"}
    </p>
  </>;
}

export function GrammarDiscoveryPage({ lessonId, topicSlug }: { lessonId: string; topicSlug?: string }) {
  const lesson = grammarDiscoveryLesson(lessonId);
  const topic = lesson?.topics.find((entry) => entry.slug === topicSlug);
  const [observed, setObserved] = useState(false);
  const [applied, setApplied] = useState(false);
  if (!lesson) return null;
  if (!topic) return <main className="vocabulary-learning grammar-learning-entry">
    <header className="vocabulary-image-heading"><h1>Grammatik</h1><p>เลือกหัวข้อ แล้วสังเกตรูปภาษาเยอรมันจากตัวอย่าง</p></header>
    {lesson.topics.map((entry, index) => <Link key={entry.slug} className="alphabet-entry-card" href={`/learn/${lessonId}/grammar/${entry.slug}`}>
      <span className="alphabet-entry-symbols" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className="alphabet-entry-copy"><span className="eyebrow">GRAMMATIK</span><span className="alphabet-entry-title"><strong>{entry.title}</strong></span><small>{entry.thai}</small></span>
      <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
    </Link>)}
  </main>;
  const index = lesson.topics.indexOf(topic);
  const next = lesson.topics[index + 1];
  return <main className="guided-learning grammar-discovery">
    <Link className="back-link" href={`/learn/${lessonId}/grammar`}><ArrowLeft size={17} /> หัวข้อ Grammatik</Link>
    <div className="vocabulary-image-progress" aria-label={`หัวข้อ ${index + 1} จาก ${lesson.topics.length}`}>
      <span>หัวข้อ {index + 1} / {lesson.topics.length}</span>
      <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${(index + 1) / lesson.topics.length * 100}%` }} /></div>
    </div>
    <section className="guided-card">
      <span className="eyebrow">ENTDECKEN · สังเกตภาษา</span>
      <h1>{topic.title}</h1>
      <p>{topic.thai}</p>
      <div className="grammar-discovery-examples">
        {topic.examples.map((example) => <div key={example.de} className="grammar-discovery-example">
          <GermanListenText text={example.de} /><span lang="th">{example.th}</span>
        </div>)}
      </div>
      <DiscoveryChoices key={`${topic.slug}-observe`} question={topic.observe} onCorrect={() => setObserved(true)} />
      {observed && <div className="guided-note grammar-discovery-rule"><Check size={18} aria-hidden="true" /><span>{topic.rule}</span></div>}
      {observed && <div className="grammar-discovery-apply">
        <span className="eyebrow">ANWENDEN · ลองใช้</span>
        <DiscoveryChoices key={`${topic.slug}-apply`} question={topic.apply} onCorrect={() => setApplied(true)} />
      </div>}
      {applied && <div className="grammar-discovery-next">
        <p>ลองใช้รูปที่เพิ่งค้นพบได้แล้ว</p>
        <Link className="button primary" href={next ? `/learn/${lessonId}/grammar/${next.slug}` : `/learn/${lessonId}/grammar`}>
          {next ? "หัวข้อถัดไป" : "กลับหัวข้อไวยากรณ์"} <ArrowRight size={17} />
        </Link>
      </div>}
    </section>
  </main>;
}
