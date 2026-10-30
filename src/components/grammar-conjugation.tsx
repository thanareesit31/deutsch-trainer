"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { grammarDiscoveryLesson } from "@/lib/grammar-discovery";
import { conjugationSentence, conjugationSubjects, grammarConjugationTopic, type GrammarConjugationVerb } from "@/lib/grammar-conjugation";
import { completeConjugationRow, completedConjugationRows, completedDiscoveryTopics } from "@/lib/grammar-discovery-progress";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { ConjugationAudioForm } from "./conjugation-matching";
import { GermanListenText } from "./german-listen-text";
import { useVocabularyAudio } from "./vocabulary-audio";
import { LearnPracticeLink } from "./learn-practice-link";

function formWithHighlights(verb: GrammarConjugationVerb, form: string, index: number) {
  if (verb.id === "sein") {
    const parts = form === "bin" ? ["b", "in"] : form === "sind" ? ["s", "in", "d"] : ["", form];
    return <>{parts[0]}<span className="ending-result">{parts[1]}</span>{parts[2] ?? ""}</>;
  }
  const expectedEnding = ["e", "st", "t", "en", "t", "en"][index];
  const ending = form.endsWith(expectedEnding) && form.length > expectedEnding.length ? expectedEnding : "";
  const body = ending ? form.slice(0, -ending.length) : form;
  let start = 0;
  while (start < body.length && start < verb.stem.length && body[start] === verb.stem[start]) start++;
  let end = 0;
  while (end < body.length - start && end < verb.stem.length - start && body[body.length - 1 - end] === verb.stem[verb.stem.length - 1 - end]) end++;
  const changed = body.slice(start, body.length - end);
  const suffix = end ? body.slice(-end) : "";
  return <>{body.slice(0, start)}{changed && <span className="ending-result">{changed}</span>}{suffix}{ending && <span className="ending-result">{ending}</span>}</>;
}

function SentenceConjugationBoard({ verb, matched, onMatch }: {
  verb: GrammarConjugationVerb;
  matched: string[];
  onMatch: (subjectId: string) => void;
}) {
  const { play, error } = useVocabularyAudio();
  const [order] = useState(() => {
    const ids: string[] = conjugationSubjects.map((subject) => subject.id);
    for (let index = ids.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[other]] = [ids[other], ids[index]];
    }
    return ids;
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ row: string; token: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const remaining = [...order];
  for (const rowId of matched) {
    const index = conjugationSubjects.findIndex((subject) => subject.id === rowId);
    if (index < 0) continue;
    const tokenIndex = remaining.findIndex((tokenId) => verb.forms[conjugationSubjects.findIndex((subject) => subject.id === tokenId)] === verb.forms[index]);
    if (tokenIndex >= 0) remaining.splice(tokenIndex, 1);
  }
  function playSentence(rowId: string) {
    const index = conjugationSubjects.findIndex((subject) => subject.id === rowId);
    if (index < 0) return;
    play(conjugationSentence(verb.sentence, conjugationSubjects[index]).replace("___", verb.forms[index]));
  }
  function assign(rowId: string, tokenId = selected) {
    if (matched.includes(rowId) || !tokenId || !remaining.includes(tokenId)) return;
    const rowIndex = conjugationSubjects.findIndex((subject) => subject.id === rowId);
    const tokenIndex = conjugationSubjects.findIndex((subject) => subject.id === tokenId);
    if (rowIndex < 0 || tokenIndex < 0) return;
    setSelected(null);
    if (timer.current) clearTimeout(timer.current);
    if (verb.forms[rowIndex] !== verb.forms[tokenIndex]) {
      setWrong({ row: rowId, token: tokenId });
      timer.current = setTimeout(() => setWrong(null), 650);
      return;
    }
    setWrong(null);
    playSentence(rowId);
    onMatch(rowId);
  }
  return <>
    <div className="matching-board sentence-conjugation-board" aria-label={`จับคู่รูปผัน ${verb.infinitive} ในประโยค`}>
      <div className="matching-column">
        <h2>ประโยค</h2>
        {conjugationSubjects.map((subject, index) => {
          const correct = matched.includes(subject.id);
          return <button type="button" key={subject.id} className={`matching-subject${selected ? " target-ready" : ""}`}
            data-pair-id={subject.id}
            title={correct ? "กดฟังประโยคซ้ำ" : "วางรูปผันที่ถูกต้องข้างประโยค"}
            onClick={() => correct ? playSentence(subject.id) : assign(subject.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); assign(subject.id, event.dataTransfer.getData("text/plain")); }}>
            <span className="sentence-conjugation-prompt" lang="de">{conjugationSentence(verb.sentence, subject).replace("___", "…")}</span>
            <span className={`matching-drop${correct ? " filled correct" : wrong?.row === subject.id ? " incorrect" : ""}`}>
              {correct ? <span lang="de">{verb.forms[index]} <Volume2 size={15} aria-hidden="true" /></span> : "เลือกคำตอบ"}
            </span>
          </button>;
        })}
      </div>
      <div className="matching-column">
        <h2>รูปกริยา</h2>
        <div className="matching-bank">{remaining.map((tokenId) => {
          const index = conjugationSubjects.findIndex((subject) => subject.id === tokenId);
          const form = verb.forms[index];
          return <button type="button" key={tokenId} lang="de" draggable
            className={`matching-token${selected === tokenId ? " selected" : ""}${wrong?.token === tokenId ? " incorrect" : ""}`}
            aria-pressed={selected === tokenId}
            onClick={() => { setSelected(tokenId); play(form); }}
            onDragStart={(event) => { event.dataTransfer.setData("text/plain", tokenId); event.dataTransfer.effectAllowed = "move"; setSelected(tokenId); }}>
            {form} <Volume2 size={15} aria-hidden="true" />
          </button>;
        })}{remaining.length === 0 && <p className="sentence-conjugation-done">จับคู่ครบทุกประโยคแล้ว</p>}</div>
        <p className="conjugation-hint">แตะรูปกริยาแล้วแตะประโยค หรือลากรูปกริยาไปวางข้างประโยค</p>
      </div>
    </div>
    <p className={`guided-feedback${wrong ? " wrong" : ""}`} role="status">{wrong ? "ลองใหม่" : error}</p>
  </>;
}

function GrammarConjugationSummary({ verbs }: { verbs: readonly GrammarConjugationVerb[] }) {
  return <section className={`verb-summary${verbs.length === 1 ? " single-verb" : ""}`}>
    <h2>ตารางสรุปการผัน</h2>
    <p>กดรูปกริยาเพื่อฟังประธานและคำที่ผันแล้ว</p>
    <div className="verb-summary-scroll" role="region" aria-label="ตารางสรุปการผันกริยา" tabIndex={0}>
      <table>
        <thead><tr><th scope="col">ประธาน</th>{verbs.map((verb) => <th key={verb.id} scope="col" lang="de">{verb.infinitive}</th>)}</tr></thead>
        <tbody>{conjugationSubjects.map((subject, index) => <tr key={subject.id}>
          <th scope="row" lang="de">{subject.label}</th>
          {verbs.map((verb) => <td key={verb.id} data-label={verb.infinitive}><ConjugationAudioForm speechText={`${subject.sentence} ${verb.forms[index]}`}>
            <strong>{formWithHighlights(verb, verb.forms[index], index)}</strong>
          </ConjugationAudioForm></td>)}
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}

export function GrammarConjugationPage({ lessonId, topicSlug, verbId, summary = false }: {
  lessonId: string;
  topicSlug: string;
  verbId?: string;
  summary?: boolean;
}) {
  const lesson = grammarDiscoveryLesson(lessonId);
  const topic = lesson?.topics.find((entry) => entry.slug === topicSlug);
  const conjugation = grammarConjugationTopic(lessonId, topicSlug);
  const verb = conjugation?.verbs.find((entry) => entry.id === verbId);
  const storage = useLessonState();
  const stateKey = lessonStateKeys.discoveryGrammar(lessonId);
  const [raw, setRaw] = useState(() => storage.read(stateKey));
  if (!lesson || !topic || !conjugation || (!summary && !verb)) return null;
  const base = `/learn/${lessonId}/grammar/${topicSlug}`;
  const learned = completedDiscoveryTopics(raw, lesson).includes(topicSlug);
  const allMatched = conjugation.verbs.every((entry) => completedConjugationRows(raw, topicSlug, entry.id).length === conjugationSubjects.length);
  const firstIncomplete = conjugation.verbs.find((entry) => completedConjugationRows(raw, topicSlug, entry.id).length < conjugationSubjects.length);
  const boardRoute = `${base}/conjugation/${firstIncomplete?.id ?? conjugation.verbs[0].id}`;
  if (!learned || (summary && !allMatched)) return <main className="guided-learning grammar-conjugation-learning">
    <section className="guided-card">
      <h1>{topic.title}</h1>
      <p>{!learned ? "สังเกตและลองใช้รูปกริยาในหน้าบทเรียนก่อน" : "จับคู่รูปกริยาให้ครบก่อนดูตารางสรุป"}</p>
      <Link className="button primary" href={!learned ? base : boardRoute}>
        {!learned ? "กลับไปเรียน" : "ไปหน้าจับคู่"} <ArrowRight size={17} />
      </Link>
    </section>
  </main>;
  if (summary) {
    const last = conjugation.verbs[conjugation.verbs.length - 1];
    const next = lesson.topics[lesson.topics.indexOf(topic) + 1];
    return <main className="guided-learning grammar-conjugation-learning">
      <Link className="back-link" href={`${base}/conjugation/${last.id}`}><ArrowLeft size={17} /> กลับไปดูกระดาน</Link>
      <section className="guided-card">
        <span className="eyebrow">ÜBERSICHT · ตารางสรุป</span>
        <h1>{topic.title}</h1>
        <GrammarConjugationSummary verbs={conjugation.verbs} />
        <div className="grammar-discovery-next"><p>เรียนหัวข้อนี้แล้ว</p>
          <Link className="button primary" href={next ? `/learn/${lessonId}/grammar/${next.slug}` : `/learn/${lessonId}/grammar`}>
            {next ? "หัวข้อถัดไป" : "กลับหัวข้อไวยากรณ์"} <ArrowRight size={17} />
          </Link>
          {!next && <LearnPracticeLink lessonId={lessonId} skill="grammar" />}
        </div>
      </section>
    </main>;
  }
  if (!verb) return null;
  const matched = completedConjugationRows(raw, topicSlug, verb.id);
  const verbIndex = conjugation.verbs.indexOf(verb);
  const nextVerb = conjugation.verbs[verbIndex + 1];
  return <main className="guided-learning grammar-conjugation-learning">
    <Link className="back-link" href={base}><ArrowLeft size={17} /> กลับไปดูตัวอย่าง</Link>
    <section className="guided-card">
      <span className="eyebrow">ZUORDNEN · จับคู่รูปกริยา</span>
      <h1 lang="de">{verb.infinitive}</h1>
      <p>{verb.meaning}</p>
      <p className="guided-note">{verb.note}</p>
      <div className="grammar-discovery-examples"><div className="grammar-discovery-example">
        <GermanListenText text={conjugationSentence(verb.sentence, conjugationSubjects[0]).replace("___", verb.forms[0])} />
      </div></div>
      <p className="guided-instruction">เลือกกริยาที่ผันแล้วให้ตรงกับประธานในแต่ละประโยค</p>
      <div className="vocabulary-image-progress" aria-live="polite">
        <span>จับคู่แล้ว {matched.length} / {conjugationSubjects.length} ประโยค</span>
        <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${matched.length / conjugationSubjects.length * 100}%` }} /></div>
      </div>
      <SentenceConjugationBoard verb={verb} matched={matched} onMatch={(subjectId) => {
        const next = completeConjugationRow(storage.read(stateKey), lesson, topicSlug, verb.id, subjectId);
        storage.write(stateKey, next);
        setRaw(next);
      }} />
      {matched.length === conjugationSubjects.length && <div className="grammar-discovery-next">
        <p>จับคู่ครบแล้ว</p>
        <Link className="button primary" href={nextVerb ? `${base}/conjugation/${nextVerb.id}` : `${base}/summary`}>
          {nextVerb ? "กริยาถัดไป" : "ดูตารางสรุป"} <ArrowRight size={17} />
        </Link>
      </div>}
    </section>
  </main>;
}
