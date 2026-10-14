"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Volume2 } from "lucide-react";
import { grammarDiscoveryLesson, type DiscoveryQuestion, type GrammarDiscoveryExample } from "@/lib/grammar-discovery";
import { grammarConjugationTopic } from "@/lib/grammar-conjugation";
import { completeDiscoveryTopic, completedDiscoveryTopics } from "@/lib/grammar-discovery-progress";
import { GermanListenText } from "./german-listen-text";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { useVocabularyAudio } from "./vocabulary-audio";

function GrammarExampleAudio({ example, nameRoot }: { example: GrammarDiscoveryExample; nameRoot: string }) {
  const { play, error } = useVocabularyAudio();
  const marker = `${nameRoot}s`;
  const start = example.de.indexOf(marker);
  if (start < 0) return <GermanListenText text={example.de} />;
  return <>
    <button type="button" className="german-listen-text" lang="de"
      aria-label={`ฟังเสียง ${example.de}`} onClick={() => play(example.de)}>
      <span>{example.de.slice(0, start)}<strong className="grammar-discovery-name">{nameRoot}<span className="grammar-discovery-name-s">s</span></strong>{example.de.slice(start + marker.length)}</span>
      <Volume2 size={16} aria-hidden="true" />
    </button>
    {error && <span role="status" className="audio-listen-error">{error}</span>}
  </>;
}

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

function PossessiveSpeechBubble() {
  const { play, error } = useVocabularyAudio();
  const sentence = "Das ist meine Schwester.";
  return <div className="possessive-family-speech">
    <span className="possessive-family-speaker">Jan พูดถึง Line</span>
    <button type="button" className="german-listen-text" lang="de"
      aria-label={`ฟังเสียง ${sentence}`} onClick={() => play(sentence)}>
      <span>Das ist <strong>meine</strong> Schwester.</span><Volume2 size={16} aria-hidden="true" />
    </button>
    <span lang="th">นี่คือน้องสาวของฉัน</span>
    {error && <span role="status" className="audio-listen-error">{error}</span>}
  </div>;
}

function PossessiveFamilyScene({ resolved, onResolved }: { resolved: boolean; onResolved: () => void }) {
  const [step, setStep] = useState(resolved ? 2 : 0);
  const [wrong, setWrong] = useState<string | null>(null);
  const choices = step === 0 ? ["deine", "meine"] : ["mein", "meine"];
  return <section className="possessive-family-scene" aria-labelledby="possessive-family-question">
    <span className="eyebrow">1 · ใครกำลังพูด?</span>
    <h2>ของฉัน หรือ ของเธอ?</h2>
    <div className="possessive-family-meaning">
      <p><strong lang="de">mein / meine</strong><span>ของฉัน — พูดถึงคนในครอบครัวของตัวเอง</span></p>
      <p><strong lang="de">dein / deine</strong><span>ของเธอ — ถามหรือพูดกับอีกคน</span></p>
    </div>
    <div className="possessive-family-photo">
      <Image src="/images/lektion-03-vocabulary/V027-family-grammar-color-v3.png" width={1536} height={1024}
        sizes="(max-width: 700px) 92vw, 400px" loading="eager" alt="ครอบครัวสี่คน: พ่อ Frank แม่ Aleksandra ลูกชาย Jan และลูกสาว Line" />
      <span className="possessive-family-name father">Frank</span>
      <span className="possessive-family-name mother">Aleksandra</span>
      <span className="possessive-family-name son">Jan</span>
      <span className="possessive-family-name daughter">Line</span>
      <PossessiveSpeechBubble />
    </div>
    <p className="possessive-family-explanation">Jan พูดว่า “ของฉัน” → <strong>mein</strong>; <strong lang="de">(die) Schwester</strong> เป็นคำนามเพศหญิง จึงใช้ <strong>meine</strong></p>
    {step === 1 && <p className="guided-feedback correct">ถูกต้อง เพื่อนพูดกับ Jan จึงใช้ <strong>deine</strong> แปลว่า “ของเธอ”</p>}
    <p id="possessive-family-question" className="guided-instruction">
      {step === 0 ? <>เพื่อนถาม Jan ถึง <span lang="de">(die) Schwester</span>: “นี่คือน้องสาวของเธอใช่ไหม?”<br /><span lang="de">Ist das ___ Schwester?</span></> : step === 1 ? <>Jan แนะนำ Frank พ่อของตัวเอง <span lang="de">(der) Vater</span>:<br /><span lang="de">Das ist ___ Vater.</span></> : "คำที่ใช้ขึ้นอยู่กับคนพูด และคำนามที่ตามหลัง"}
    </p>
    {step < 2 && <div className="possessive-family-choices">
      {choices.map((choice, index) => <button key={choice} type="button" lang="de"
        className={`guided-choice${wrong === choice ? " wrong" : ""}`}
        disabled={resolved}
        onClick={() => {
          if (index === 0) { setWrong(null); if (step === 0) setStep(1); else { setStep(2); onResolved(); } }
          else setWrong(choice);
        }}>{choice}</button>)}
    </div>}
    <p className={`guided-feedback${wrong ? " wrong" : resolved ? " correct" : ""}`} role="status">
      {wrong ? step === 0 ? "เพื่อนพูดกับ Jan ว่า ‘ของเธอ’ จึงเริ่มด้วย dein-" : "Jan พูดว่า ‘ของฉัน’ และ (der) Vater ใช้ mein" : resolved ? "เยี่ยม ต่อไปลองดูว่า (die) Eltern ซึ่งเป็นพหูพจน์ใช้รูปไหน" : step === 0 ? "เลือกคำที่หมายถึง ‘ของเธอ’" : "เลือกคำที่หมายถึง ‘ของฉัน’ หน้า (der) Vater"}
    </p>
    {resolved && <div className="possessive-family-reveal">
      <span className="eyebrow">2 · สรุปจากครอบครัวนี้</span>
      <div><strong lang="de">(die) Schwester → meine Schwester / deine Schwester</strong><span>น้องสาวของฉัน / ของเธอ</span></div>
      <div><strong lang="de">(der) Vater → mein Vater / dein Vater</strong><span>พ่อของฉัน / ของเธอ</span></div>
    </div>}
  </section>;
}

function PossessiveSummaryTable() {
  const rows = [
    { article: "der", noun: "Vater", meaning: "พ่อ", mine: "mein Vater", yours: "dein Vater" },
    { article: "die", noun: "Schwester", meaning: "พี่สาว / น้องสาว", mine: "meine Schwester", yours: "deine Schwester" },
    { article: "das", noun: "Kind", meaning: "ลูก", mine: "mein Kind", yours: "dein Kind" },
    { article: "die", noun: "Eltern", meaning: "พ่อแม่ · พหูพจน์", mine: "meine Eltern", yours: "deine Eltern" },
  ] as const;
  return <section className="possessive-summary" aria-labelledby="possessive-summary-title">
    <h2 id="possessive-summary-title">ตารางสรุป mein / dein</h2>
    <p>ดูเพศและจำนวนของคำนามก่อนเลือกรูปคำ ตารางนี้ใช้กับรูปประธาน (Nominativ)</p>
    <div className="possessive-summary-scroll">
      <table>
        <thead><tr><th scope="col">คำนาม</th><th scope="col">ของฉัน</th><th scope="col">ของเธอ</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.noun}>
          <th scope="row"><span lang="de">({row.article}) {row.noun}</span><small>{row.meaning}</small></th>
          <td lang="de" data-label="ของฉัน">{row.mine}</td><td lang="de" data-label="ของเธอ">{row.yours}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}

export function PossessiveSummaryPage() {
  const lesson = grammarDiscoveryLesson("L03");
  const topic = lesson?.topics.find((entry) => entry.slug === "mein-dein");
  const storage = useLessonState();
  const completed = lesson ? completedDiscoveryTopics(storage.read(lessonStateKeys.discoveryGrammar("L03")), lesson) : [];
  const lessonRoute = "/learn/L03/grammar/mein-dein";
  if (!lesson || !topic) return null;
  if (!completed.includes(topic.slug)) return <main className="guided-learning grammar-discovery">
    <Link className="back-link" href={lessonRoute}><ArrowLeft size={17} /> กลับไปเรียน mein und dein</Link>
    <section className="guided-card">
      <h1>ตารางสรุป mein / dein</h1>
      <p>ทำกิจกรรมในหน้าบทเรียนให้ครบก่อน แล้วจึงเปิดตารางสรุปได้</p>
      <Link className="button primary" href={lessonRoute}>กลับไปทำกิจกรรม <ArrowRight size={17} /></Link>
    </section>
  </main>;
  const next = lesson.topics[lesson.topics.indexOf(topic) + 1];
  return <main className="guided-learning grammar-discovery grammar-discovery-summary-page">
    <Link className="back-link" href={lessonRoute}><ArrowLeft size={17} /> กลับไปดูตัวอย่าง</Link>
    <div className="vocabulary-image-progress" aria-label="หน้าสรุปของหัวข้อ mein und dein">
      <span>mein und dein · หน้า 2 / 2</span>
      <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: "100%" }} /></div>
    </div>
    <section className="guided-card">
      <span className="eyebrow">ZUSAMMENFASSUNG · สรุป</span>
      <h1>mein und dein</h1>
      <div className="guided-note grammar-discovery-rule"><Check size={18} aria-hidden="true" /><span>{topic.rule}</span></div>
      <PossessiveSummaryTable />
      <div className="grammar-discovery-next">
        <p>เรียนหัวข้อนี้แล้ว</p>
        <Link className="button primary" href={next ? `/learn/L03/grammar/${next.slug}` : "/learn/L03/grammar"}>
          {next ? "หัวข้อถัดไป" : "กลับหัวข้อไวยากรณ์"} <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  </main>;
}

export function GrammarDiscoveryPage({ lessonId, topicSlug }: { lessonId: string; topicSlug?: string }) {
  const lesson = grammarDiscoveryLesson(lessonId);
  const storage = useLessonState();
  const stateKey = lessonStateKeys.discoveryGrammar(lessonId);
  const [completed, setCompleted] = useState(() => lesson ? completedDiscoveryTopics(storage.read(stateKey), lesson) : []);
  const topic = lesson?.topics.find((entry) => entry.slug === topicSlug);
  const isPossessive = lessonId === "L03" && topicSlug === "mein-dein";
  const [familyResolved, setFamilyResolved] = useState(() => isPossessive && completed.includes("mein-dein"));
  const [observed, setObserved] = useState(() => !!topicSlug && completed.includes(topicSlug));
  const [applied, setApplied] = useState(() => !!topicSlug && completed.includes(topicSlug));
  function saveCompletion() {
    if (!lesson || !topic) return;
    const next = completeDiscoveryTopic(storage.read(stateKey), lesson, topic.slug);
    storage.write(stateKey, next);
    setCompleted(completedDiscoveryTopics(next, lesson));
    setApplied(true);
  }
  if (!lesson) return null;
  if (!topic) return <main className="vocabulary-learning grammar-learning-entry">
    <header className="vocabulary-image-heading"><h1>Grammatik</h1><p>เลือกหัวข้อ แล้วสังเกตรูปภาษาเยอรมันจากตัวอย่าง</p></header>
    <div className="vocabulary-image-progress" aria-live="polite">
      <span>เรียนแล้ว {completed.length} / {lesson.topics.length} หัวข้อ</span>
      <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${completed.length / lesson.topics.length * 100}%` }} /></div>
    </div>
    {lesson.topics.map((entry, index) => <Link key={entry.slug} className="alphabet-entry-card" href={`/learn/${lessonId}/grammar/${entry.slug}`}>
      <span className="alphabet-entry-symbols" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className="alphabet-entry-copy"><span className="eyebrow">{completed.includes(entry.slug) ? "เรียนแล้ว" : "GRAMMATIK"}</span><span className="alphabet-entry-title"><strong>{entry.title}</strong></span><small>{entry.thai}</small></span>
      <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
    </Link>)}
  </main>;
  const index = lesson.topics.indexOf(topic);
  const next = lesson.topics[index + 1];
  const conjugation = grammarConjugationTopic(lessonId, topic.slug);
  return <main className="guided-learning grammar-discovery">
    {!isPossessive && <Link className="back-link" href={`/learn/${lessonId}/grammar`}><ArrowLeft size={17} /> หัวข้อ Grammatik</Link>}
    <div className="vocabulary-image-progress" aria-label={`หัวข้อ ${index + 1} จาก ${lesson.topics.length}`}>
      <span>หัวข้อ {index + 1} / {lesson.topics.length}</span>
      <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${(index + 1) / lesson.topics.length * 100}%` }} /></div>
    </div>
    <section className="guided-card">
      <span className="eyebrow">ENTDECKEN · สังเกตภาษา{isPossessive ? " · หน้า 1 / 2" : ""}</span>
      <h1>{topic.title}</h1>
      <p>{topic.thai}</p>
      {isPossessive && <PossessiveFamilyScene resolved={familyResolved} onResolved={() => setFamilyResolved(true)} />}
      {(!isPossessive || familyResolved) && <div className="grammar-discovery-examples">
        {topic.examples.map((example) => <div key={example.de} className="grammar-discovery-example">
          {example.nameRoot ? <GrammarExampleAudio example={example} nameRoot={example.nameRoot} /> : <GermanListenText text={example.de} />}
          {example.nounHint && <small className="grammar-discovery-noun-hint" lang="de">{example.nounHint}</small>}
          <span lang="th">{example.th}</span>
        </div>)}
      </div>}
      {(!isPossessive || familyResolved) && <DiscoveryChoices key={`${topic.slug}-observe`} question={topic.observe} onCorrect={() => setObserved(true)} />}
      {observed && <div className="grammar-discovery-apply">
        <span className="eyebrow">ANWENDEN · ลองใช้</span>
        <DiscoveryChoices key={`${topic.slug}-apply`} question={topic.apply} onCorrect={saveCompletion} />
      </div>}
      {applied && !isPossessive && <div className="guided-note grammar-discovery-rule" aria-live="polite"><Check size={18} aria-hidden="true" /><span>{topic.rule}</span></div>}
      {applied && <div className="grammar-discovery-next">
        <p>{isPossessive ? "ทำกิจกรรมครบแล้ว" : "เรียนหัวข้อนี้แล้ว"}</p>
        <Link className="button primary" href={isPossessive ? "/learn/L03/grammar/mein-dein/summary" : conjugation ? `/learn/${lessonId}/grammar/${topic.slug}/conjugation/${conjugation.verbs[0].id}` : next ? `/learn/${lessonId}/grammar/${next.slug}` : `/learn/${lessonId}/grammar`}>
          {isPossessive ? "ดูตารางสรุป" : conjugation ? "ฝึกผันกริยา" : next ? "หัวข้อถัดไป" : "กลับหัวข้อไวยากรณ์"} <ArrowRight size={17} />
        </Link>
      </div>}
    </section>
  </main>;
}
