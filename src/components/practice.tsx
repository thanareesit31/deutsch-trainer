"use client";
import Link from "next/link";
import { useContent } from "./content-provider";
import { ArticleDot, ArticleLegend } from "./profession-matching";
import { NounText, NounPrefix } from "./noun-text";
import { nounPresentation } from "@/lib/noun-presentation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Volume2,
  Trophy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  modeLabels,
  skillName,
} from "@/lib/content";
import { type Question } from "@/lib/engine";
import { useStore } from "./store";
import { Meter } from "./ui";
import type { StartSession } from "./trainer";
import { useLearning } from "./learning-store";
import { diagnose, dimensionLabels } from "@/lib/learning";
import { speakGermanText, useGermanVoice } from "./german-audio";

export interface SessionPlan {
  id: string;
  questions: Question[];
  title: string;
  origin: string;
  position: number;
  completed: boolean;
}
export function Session({
  plan,
  start,
}: {
  plan: SessionPlan;
  start: StartSession;
}) {
  const history = useLearning();
  const position = plan.position;
  const results = history.attempts
    .filter((a) => a.session_id === plan.id)
    .map((a) => ({
      question: plan.questions[a.ordinal],
      correct: a.correct,
      input: a.input,
    }));
  const { data } = useStore();
  const [error, setError] = useState("");
  async function next() {
    try {
      await history.act("advance", { sessionId: plan.id, position });
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const question = plan.questions[position];
  const finished = position >= plan.questions.length;
  const correct = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => !r.correct);
  if (finished)
    return (
      <div className="result-page">
        <span className="result-trophy">
          <Trophy size={37} />
        </span>
        <span className="eyebrow">GUT GEMACHT!</span>
        <h1>อีกก้าวเล็ก ๆ สำเร็จแล้ว</h1>
        <p>{plan.title} · บันทึกผลเรียบร้อย</p>
        <div className="result-score">
          <strong>
            {correct}
            <span> / {results.length}</span>
          </strong>
          <span>
            {Math.round((correct / results.length) * 100)}% ตอบถูกครั้งแรก
          </span>
        </div>
        <div className="result-metrics">
          <div>
            <CheckCircle2 size={21} />
            <strong>{correct}</strong>
            <span>ตอบถูก</span>
          </div>
          <div>
            <RotateCcw size={21} />
            <strong>{wrong.length}</strong>
            <span>กลับมาทบทวน</span>
          </div>
        </div>
        <div className="result-wrong panel">
          <h3>ผลแยกตามช่อง</h3>
          {results.map((r) => (
            <div key={r.question.item.id}>
              <span>
                <NounText text={r.question.item.title} item={r.question.item} />
                <small>{r.question.item.meaning}</small>
              </span>
              <strong
                className={r.correct ? "result-correct" : "result-incorrect"}
              >
                {r.correct ? "ถูก" : `ทบทวน · ${r.question.answer}`}
              </strong>
            </div>
          ))}
        </div>
        {wrong.length > 0 && (
          <div className="result-wrong panel">
            <h3>เก็บอีกนิด ก็จำได้แล้ว</h3>
            {wrong.map((r) => (
              <div key={r.question.item.id}>
                <span>
                  <NounText text={r.question.item.title} item={r.question.item} />
                  <small>{r.question.item.meaning}</small>
                </span>
                <strong>{r.question.answer}</strong>
              </div>
            ))}
          </div>
        )}
        <div className="result-actions">
          {wrong.length > 0 && (
            <button
              className="button primary"
              onClick={() =>
                start(
                  wrong.map((r) => r.question.item),
                  plan.questions.every((q) => q.mode === plan.questions[0].mode)
                    ? plan.questions[0].mode
                    : "review",
                  0,
                  "ฝึกข้อที่ผิด",
                  plan.origin,
                )
              }
            >
              ฝึกเฉพาะ {wrong.length} ข้อที่ผิด <RotateCcw size={17} />
            </button>
          )}
          <button
            className="button secondary"
            onClick={() =>
              start(
                plan.questions.map((q) => q.item),
                plan.questions.every((q) => q.mode === plan.questions[0].mode)
                  ? plan.questions[0].mode
                  : "review",
                data.settings.sessionSize,
                plan.title,
                plan.origin,
              )
            }
          >
            ฝึกอีกครั้ง
          </button>
          <Link href={plan.origin} className="text-link">
            กลับไปเลือกแบบฝึก
          </Link>
        </div>
      </div>
    );
  return (
    <>
      <div className="session-heading">
        <Link
          href={plan.origin}
          className="icon-button"
          aria-label="ออกจากรอบฝึก"
        >
          <X size={22} />
        </Link>
        <div>
          <span className="eyebrow">{plan.title}</span>
          <strong>
            ข้อ {position + 1} / {plan.questions.length}
          </strong>
        </div>
        <span className="session-score">
          <Check size={17} />
          {correct} ถูก
        </span>
      </div>
      <Meter
        value={(position / plan.questions.length) * 100}
        label="ความคืบหน้ารอบฝึก"
      />
      <QuestionCard
        key={position}
        question={question}
        sessionId={plan.id}
        position={position}
        onNext={() => void next()}
        isLast={position + 1 === plan.questions.length}
      />
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <div className="session-save">
        <CheckCircle2 size={14} />
        ทุกคำตอบถูกบันทึกก่อนแสดงเฉลย
      </div>
    </>
  );
}

function QuestionCard({
  question: q,
  sessionId,
  position,
  onNext,
  isLast,
}: {
  question: Question;
  sessionId: string;
  position: number;
  onNext: () => void;
  isLast: boolean;
}) {
  const history = useLearning();
  const { items } = useContent();
  const attempt = history.attempts.find(
    (a) => a.session_id === sessionId && a.ordinal === position,
  );
  const pending = useRef<{
    input: string;
    correct: boolean;
    evidence: ReturnType<typeof diagnose>["evidence"];
  } | null>(null);
  const voice = useGermanVoice();
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState(attempt?.input || "");
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const feedback = attempt?.correct ?? null;
  const [error, setError] = useState("");
  const [heard, setHeard] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const answered = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isChoice = ["de-th", "th-de", "article", "choice"].includes(q.mode);
  const isFlash = q.mode === "flash";
  const isOrder = q.mode === "order";
  const isListening = q.item.skill === "listening";
  async function check(value = answer, selfReport?: boolean) {
    if (answered.current || attempt || history.busy) return;
    answered.current = true;
    const result = diagnose(q, value);
    if (!pending.current) pending.current = { input: value, ...result };
    try {
      await history.act("submit", { sessionId, position, ...pending.current });
      setAnswer(pending.current.input);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      answered.current = false;
    }
  }
  function speak() {
    if (!voice || !("speechSynthesis" in window)) {
      setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิดใช้งานเสียงก่อน");
      return;
    }
    setError("");
    setSpeaking(true);
    const started = speakGermanText(
      q.item.audio || q.item.title,
      voice,
      {
        onEnd: () => {
          setSpeaking(false);
          setHeard(true);
        },
        onError: () => {
          setSpeaking(false);
          setError("เล่นเสียงไม่สำเร็จ ลองกดฟังอีกครั้ง");
        },
      },
      0.8,
    );
    if (!started) {
      setSpeaking(false);
      setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิดใช้งานเสียงก่อน");
    }
  }
  function addChar(char: string) {
    const field = inputRef.current;
    const start = field?.selectionStart ?? answer.length;
    const end = field?.selectionEnd ?? start;
    setAnswer(answer.slice(0, start) + char + answer.slice(end));
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + 1, start + 1);
    });
  }
  return (
    <div className="question-wrap">
      {q.item.skill === "vocabulary" && <ArticleLegend />}
      <div className="question-meta">
        <span className="quiet-pill">
          {skillName(q.item.skill)} · {modeLabels[q.mode]}
        </span>
        {q.item.collection && (
          <span>
            {q.item.collection === "core" ? "ศัพท์หลัก" : "ศัพท์เสริม"} ·{" "}
            {q.item.group}
          </span>
        )}
      </div>
      {q.item.passage && (
        <div className="reading-passage">
          <span className="eyebrow">LINA UND SUN</span>
          <p lang="de">{q.item.passage}</p>
        </div>
      )}
      <section className="question-card">
        {isListening ? (
          <>
            <span className="eyebrow">HÖR GUT ZU</span>
            <button
              className={`listen-button ${speaking ? "speaking" : ""}`}
              onClick={speak}
              disabled={!voice || speaking}
              aria-label="ฟังเสียงภาษาเยอรมัน"
            >
              <Volume2 size={38} />
            </button>
            <h2>คุณได้ยินคำว่าอะไร?</h2>
            <p>
              {voice
                ? "กดฟังให้จบก่อนเลือกคำตอบ ฟังซ้ำได้เสมอ"
                : "ไม่พบเสียงเยอรมัน กรุณาเปิดเสียงในอุปกรณ์ก่อน"}
            </p>
          </>
        ) : (
          <>
            <span className="eyebrow">
              {isFlash
                ? "นึกความหมายก่อน แล้วค่อยพลิกดู"
                : isOrder
                  ? "เรียงคำให้เป็นประโยคที่ถูกต้อง"
                  : q.mode === "article"
                    ? "เลือก Artikel ให้ตรงกับคำศัพท์"
                    : q.mode === "typing"
                      ? "พิมพ์คำตอบให้ตรงกับคำใบ้"
                      : "เลือกคำตอบที่ถูกต้อง"}
            </span>
            <h2
              className={q.mode === "dialogue" ? "dialogue-prompt" : ""}
              lang={
                q.mode === "de-th" ||
                q.mode === "article" ||
                (isFlash && q.item.skill === "vocabulary")
                  ? "de"
                  : undefined
              }
            >
              {isFlash && q.item.skill !== "vocabulary"
                ? q.item.meaning
                : q.mode === "article" ? q.prompt : <NounText text={q.prompt} items={items} />}
            </h2>
          </>
        )}
        {q.item.pluralOnly && (q.mode !== "article" || feedback !== null) && (
          <span className="plural-label">Plural · พหูพจน์ ใช้ die</span>
        )}
        {q.mode === "article" && <p>{q.item.meaning}</p>}
        {isFlash && (
          <>
            {revealed ? (
              <div className="flash-answer">
                <span className="flash-divider" />
                <h3>
                  {q.item.skill === "vocabulary"
                    ? q.item.meaning
                    : q.item.answer}
                </h3>
                <strong lang="de"><NounText text={q.item.title} item={q.item} /></strong>
                {q.item.plural && <p>Plural: <ArticleDot article="plural" />die {q.item.plural}</p>}
              </div>
            ) : (
              <button
                className="button secondary flip-button"
                onClick={() => setRevealed(true)}
              >
                <RotateCcw size={17} />
                พลิกการ์ดดูคำตอบ
              </button>
            )}
          </>
        )}
        {!isFlash && !isChoice && !isOrder && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (feedback === null) check();
              else if (!history.busy)
                onNext();
            }}
          >
            <div className="typing-area">
              {q.hint && (
                <div className="typing-hint">
                  <span>
                    ตัวช่วย ·{" "}
                    {q.item.article
                      ? `อย่าลืม ${q.item.article}`
                      : "พิมพ์คำเต็ม"}
                  </span>
                  <strong lang="de">
                    <NounPrefix noun={nounPresentation(q.item)} />
                    {q.hint.text}
                  </strong>
                </div>
              )}
              {!q.hint && q.item.skill === "vocabulary" && <NounPrefix noun={nounPresentation(q.item)} />}
              <label htmlFor="answer-input" className="sr-only">
                คำตอบภาษาเยอรมัน
              </label>
              <input
                id="answer-input"
                ref={inputRef}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={feedback !== null || history.busy}
                placeholder={
                  q.item.article ? "Artikel + คำศัพท์" : "คำตอบภาษาเยอรมัน…"
                }
                autoFocus
              />
              <div className="special-chars">
                {["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"].map((c) => (
                  <button
                    type="button"
                    disabled={feedback !== null || history.busy}
                    key={c}
                    onClick={() => addChar(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <small>ตรวจตัวพิมพ์ใหญ่–เล็ก และ ä / ö / ü / ß ด้วยนะ</small>
            </div>
            <button
              className="button primary wide"
              type="submit"
              disabled={
                history.busy ||
                (!answer.trim() && feedback === null)
              }
            >
              {feedback === null
                ? "ตรวจคำตอบ"
                : isLast
                  ? "ดูผลการฝึก"
                  : "ข้อต่อไป"}
              <ArrowRight size={17} />
            </button>
          </form>
        )}
        {isOrder && (
          <>
            <div className="sentence-answer" aria-label="ประโยคที่เรียง">
              {selectedTokens.length === 0 && (
                <span>แตะคำด้านล่างเพื่อเรียงประโยค</span>
              )}
              {selectedTokens.map((index, pos) => (
                <button
                  key={`${index}-${pos}`}
                  disabled={feedback !== null || history.busy}
                  onClick={() =>
                    setSelectedTokens((old) => old.filter((_, i) => i !== pos))
                  }
                >
                  {q.tokens[index]}
                </button>
              ))}
            </div>
            <div className="word-bank">
              {q.tokens.map((token, i) => (
                <button
                  disabled={selectedTokens.includes(i) || feedback !== null}
                  key={i}
                  onClick={() => setSelectedTokens((old) => [...old, i])}
                >
                  {token}
                </button>
              ))}
            </div>
            {feedback === null && (
              <button
                className="button primary wide"
                disabled={selectedTokens.length !== q.tokens.length}
                onClick={() =>
                  check(selectedTokens.map((i) => q.tokens[i]).join(" "))
                }
              >
                ตรวจคำตอบ <Check size={17} />
              </button>
            )}
          </>
        )}
        {isChoice && (
          <div
            className={`answer-options ${
              q.mode === "article" ? "article-options" : ""
            }`}
          >
            {q.options.map((option, index) => (
              <button
                className={
                  feedback !== null
                    ? option === q.answer
                      ? "correct"
                      : option === answer
                        ? "incorrect"
                        : "muted"
                    : ""
                }
                disabled={
                  feedback !== null || history.busy || (isListening && !heard)
                }
                key={option}
                onClick={() => check(option)}
              >
                <span className="answer-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span lang={q.mode === "de-th" ? "th" : "de"}>{q.mode === "article" ? <span className="noun-text"><ArticleDot article={option} />{option}</span> : <NounText text={option} items={items} />}</span>
                {feedback !== null && option === q.answer && (
                  <Check size={19} />
                )}
              </button>
            ))}
          </div>
        )}
        {isFlash && revealed && feedback === null && (
          <div className="flash-actions">
            <button
              className="button secondary"
              onClick={() => check("ยังไม่จำ", false)}
            >
              <RotateCcw size={17} />
              ยังไม่จำ
            </button>
            <button
              className="button primary"
              onClick={() => check(q.answer, true)}
            >
              <Check size={17} />
              จำได้
            </button>
          </div>
        )}
      </section>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {feedback === false && (
        <div className="notice">
          จุดที่ควรฝึก:{" "}
          {history.evidence
            .filter(
              (e) =>
                e.session_id === sessionId &&
                e.ordinal === position &&
                !e.correct,
            )
            .map((e) => dimensionLabels[e.dimension])
            .join(", ")}
        </div>
      )}
      {feedback !== null && (
        <div
          className={`answer-feedback ${feedback ? "success" : "retry"}`}
          aria-live="polite"
        >
          <div className="feedback-heading">
            {feedback ? <CheckCircle2 size={23} /> : <AlertCircle size={23} />}
            <div>
              <strong>
                {feedback
                  ? "ถูกต้อง เก่งขึ้นอีกนิดแล้ว!"
                  : "อีกนิดเดียว ลองจำคำตอบนี้นะ"}
              </strong>
              <p>
                คำตอบ: <b lang="de">{q.mode === "article" ? <NounText text={q.item.answer} item={q.item} /> : <NounText text={q.answer} items={items} />}</b>
              </p>
              {q.item.skill === "grammar" && <p>{q.item.meaning}</p>}
              {q.item.skill === "vocabulary" && q.item.article && (
                <p lang="de">
                  <NounText text={q.item.title} item={q.item} />
                  {q.item.plural ? ` · Plural: die ${q.item.plural}` : ""}
                </p>
              )}
              {!feedback && !isFlash && <small>คุณตอบ: {answer || "—"}</small>}
            </div>
          </div>
          {(isChoice || isFlash || isOrder) && (
            <button
              className="button primary"
              disabled={
                history.busy
              }
              autoFocus
              onClick={onNext}
            >
              {isLast ? "ดูผลการฝึก" : "ข้อต่อไป"}
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
