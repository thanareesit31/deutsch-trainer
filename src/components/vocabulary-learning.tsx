"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import alphabetData from "@/data/alphabet.json";
import type { Item } from "@/lib/content";
import { readAlphabetLearningState } from "@/lib/alphabet-learning-storage";
import {
  advanceIntroduction,
  buildRecallHint,
  buildVocabularySets,
  continueVocabularyActivity,
  createEmptyVocabularyState,
  getActivityChoices,
  getActivityExpectedAnswer,
  getActivityPrompt,
  getActivitySentence,
  normalizeVocabularyAnswer,
  recordIntroduced,
  recordVocabularyActivity,
  retryVocabularyActivity,
  startVocabularySet,
  type VocabularyActivity,
  type VocabularyLearningEvent,
  type VocabularyLearningState,
  type VocabularyWord,
} from "@/lib/vocabulary-learning";
import {
  readVocabularyLearningState,
  resetVocabularyLearningState,
  writeVocabularyLearningState,
} from "@/lib/vocabulary-learning-storage";

const activityNames: Record<VocabularyActivity["type"], string> = {
  recognition: "จำแนกคำกับความหมาย",
  guided_recall: "ลองนึกพร้อมคำใบ้",
  recall: "ลองนึกด้วยตัวเอง",
  context_encounter: "พบคำในบริบท",
};

const eventNames: Record<VocabularyLearningEvent["type"], string> = {
  introduced: "introduced",
  recognition: "recognition",
  guided_recall: "guided recall",
  recall: "recall",
  context_encounter: "context encounter",
  learning_completed: "learning completed",
};
const alphabetItemIds = alphabetData.items.map((item) => item.id);

export function VocabularyLearningActivity({
  lessonId,
  items,
}: {
  lessonId: string;
  items: Item[];
}) {
  const sets = useMemo(() => buildVocabularySets(lessonId, items), [lessonId, items]);
  const [state, setState] = useState<VocabularyLearningState>(() =>
    createEmptyVocabularyState(lessonId),
  );
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [debugOpen, setDebugOpen] = useState(false);
  const [alphabetStatus, setAlphabetStatus] = useState<"learned" | "replaying" | null>(null);
  const developerMode = process.env.NODE_ENV !== "production";
  const session = state.session;
  const setWords = session
    ? session.itemIds.flatMap((id) => {
        const word = sets.flat().find((entry) => entry.id === id);
        return word ? [word] : [];
      })
    : [];
  const currentWord = session
    ? session.phase === "introduce"
      ? setWords[session.introIndex]
      : setWords.find((word) => word.id === session.activities[session.activityIndex]?.itemId)
    : undefined;
  const activity =
    session?.phase === "activities"
      ? session.activities[session.activityIndex]
      : undefined;
  const setIndex = state.completedSetIds.length;
  const nextSet = sets[setIndex];
  const activityProgress =
    session?.phase === "activities" && session.activities.length
      ? Math.min(session.activityIndex + 1, session.activities.length)
      : 0;

  useEffect(() => {
    setState(readVocabularyLearningState(lessonId));
    setReady(true);
  }, [lessonId]);

  useEffect(() => {
    if (ready) writeVocabularyLearningState(state);
  }, [ready, state]);

  useEffect(() => {
    if (lessonId !== "L01") {
      setAlphabetStatus(null);
      return;
    }
    const syncAlphabetLearning = () => {
      const learningState = readAlphabetLearningState();
      const learnedIds = new Set(learningState.learnedItemIds);
      const isLearned = alphabetItemIds.every((id) => learnedIds.has(id));
      setAlphabetStatus(
        isLearned ? learningState.revisitIndex !== null ? "replaying" : "learned" : null,
      );
    };
    syncAlphabetLearning();
    window.addEventListener("storage", syncAlphabetLearning);
    return () => window.removeEventListener("storage", syncAlphabetLearning);
  }, [lessonId]);

  useEffect(() => {
    if (!session || session.phase !== "introduce") return;
    const word = setWords[session.introIndex];
    if (!word || state.items[word.id]?.introduced) return;
    setState((current) => recordIntroduced(current, word.id));
  }, [session, setWords, state.items]);

  useEffect(() => {
    setDraft("");
  }, [activity?.id]);

  function beginSet(index = state.completedSetIds.length) {
    setState((current) => startVocabularySet(current, sets, index));
  }

  function submitAnswer(response: string) {
    if (!session || !activity || !currentWord) return;
    const expected = getActivityExpectedAnswer(activity, currentWord);
    const success = normalizeVocabularyAnswer(response) === normalizeVocabularyAnswer(expected);
    const previousAttempts = session.activityAttempts;
    setState((current) =>
      recordVocabularyActivity(current, activity, {
        success,
        response,
        hintsUsed:
          activity.type === "guided_recall"
            ? Math.max(1, previousAttempts + (success ? 0 : 1))
            : 0,
        attempts: previousAttempts + 1,
      }),
    );
    setDraft("");
  }

  function continueActivity() {
    setState((current) => continueVocabularyActivity(current));
  }

  function resetData() {
    resetVocabularyLearningState(lessonId);
    setState(createEmptyVocabularyState(lessonId));
    setDebugOpen(false);
  }

  if (!ready) return <div className="loading">กำลังเปิดชุดเรียนคำศัพท์…</div>;
  if (!sets.length)
    return (
      <section className="panel vocabulary-learning-empty">
        <h1>ยังไม่มีคำศัพท์ใน Lektion นี้</h1>
        <Link className="button secondary" href={`/lesson/${lessonId}`}>
          กลับไปที่ Lektion
        </Link>
      </section>
    );

  return (
    <main className="vocabulary-learning">
      <Link className="back-link" href={`/lesson/${lessonId}`}>
        ← กลับ Lektion {lessonId.slice(1)}
      </Link>
      {lessonId === "L01" && (
        <Link className="alphabet-entry-card" href="/learn/L01/vocabulary/alphabet">
          <span className="alphabet-entry-symbols" aria-hidden="true">ABCD</span>
          <span className="alphabet-entry-copy">
            <span className="eyebrow">AUSSPRACHE</span>
            <span className="alphabet-entry-title">
              <strong>Das Alphabet</strong>
              {alphabetStatus && (
                <span className="alphabet-entry-status">
                  {alphabetStatus === "replaying" ? "เรียนซ้ำ" : "เรียนแล้ว"}
                </span>
              )}
            </span>
            <small>เรียนรู้ตัวอักษรและเสียงภาษาเยอรมัน</small>
          </span>
          <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
        </Link>
      )}

      {!session && nextSet && (
        <section className="vocabulary-set-launch">
          <span className="eyebrow">WORTSCHATZ · LEKTION {lessonId.slice(1)}</span>
          <h1>เรียนคำศัพท์เป็นชุดเล็ก ๆ</h1>
          <p>
            ชุดที่ {setIndex + 1} · {nextSet.length} คำ
          </p>
          <button className="button primary" onClick={() => beginSet()}>
            เริ่มเรียนชุดที่ {setIndex + 1}
          </button>
        </section>
      )}

      {!session && !nextSet && (
        <section className="vocabulary-set-launch">
          <span className="eyebrow">WORTSCHATZ · LEKTION {lessonId.slice(1)}</span>
          <h1>เรียนครบทุกชุดในรอบนี้แล้ว</h1>
          <p>คุณได้ทำกิจกรรมเรียนรู้กับคำศัพท์ทุกชุดแล้ว โดยยังไม่มีการสรุปว่า mastered</p>
          <Link className="button primary" href={`/lesson/${lessonId}`}>
            กลับหน้าคำศัพท์
          </Link>
        </section>
      )}

      {session?.phase === "introduce" && currentWord && (
        <section className="vocabulary-learning-card">
          <VocabularySetProgress
            phase="ทำความรู้จักคำใหม่"
            current={session.introIndex + 1}
            total={session.itemIds.length}
          />
          <VocabularyWordDetails word={currentWord} />
          <div className="vocabulary-learning-actions">
            <button className="button primary" onClick={() => setState(advanceIntroduction)}>
              {session.introIndex + 1 < session.itemIds.length
                ? "คำถัดไป"
                : "เริ่มกิจกรรมเรียนรู้"}
            </button>
          </div>
        </section>
      )}

      {session?.phase === "activities" && activity && currentWord && (
        <section className="vocabulary-learning-card">
          <VocabularySetProgress
            phase={activityNames[activity.type]}
            current={activityProgress}
            total={session.activities.length}
          />
          <div className="vocabulary-activity-prompt">
            <span className="eyebrow">{activityNames[activity.type]}</span>
            <h1>{getActivityPrompt(activity, currentWord)}</h1>
            {getActivitySentence(activity, currentWord) && (
              <p className="vocabulary-context-sentence" lang="de">
                {getActivitySentence(activity, currentWord)}
              </p>
            )}
          </div>

          {activity.type === "recognition" && (
            <div className="vocabulary-choice-list">
              {getActivityChoices(activity, setWords).map((choice) => {
                const isAnswer =
                  normalizeVocabularyAnswer(choice) ===
                  normalizeVocabularyAnswer(getActivityExpectedAnswer(activity, currentWord));
                const isSelected =
                  session.feedback?.response !== undefined &&
                  normalizeVocabularyAnswer(choice) ===
                    normalizeVocabularyAnswer(session.feedback.response);
                return (
                  <button
                    key={choice}
                    className={
                      session.feedback
                        ? isAnswer
                          ? "is-answer"
                          : isSelected
                            ? "is-picked-wrong"
                            : ""
                        : ""
                    }
                    disabled={!!session.feedback}
                    onClick={() => submitAnswer(choice)}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          )}

          {!session.feedback && activity.type === "context_encounter" &&
            currentWord.type !== "verb" && currentWord.type !== "country" && (
              <div className="vocabulary-choice-list">
                {getActivityChoices(activity, setWords).map((choice) => (
                  <button key={choice} onClick={() => submitAnswer(choice)}>
                    {choice}
                  </button>
                ))}
              </div>
            )}

          {!session.feedback &&
            (activity.type === "guided_recall" ||
              activity.type === "recall" ||
              (activity.type === "context_encounter" && currentWord.type === "verb")) && (
              <form
                className="vocabulary-recall-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitAnswer(draft);
                }}
              >
                {activity.type === "guided_recall" && (
                  <p className="vocabulary-hint">
                    คำใบ้: {buildRecallHint(currentWord, session.activityAttempts > 0 ? 2 : 1)}
                  </p>
                )}
                <label className="sr-only" htmlFor="vocabulary-recall-answer">
                  พิมพ์คำตอบภาษาเยอรมัน
                </label>
                <input
                  id="vocabulary-recall-answer"
                  autoComplete="off"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="พิมพ์คำศัพท์ภาษาเยอรมัน"
                />
                <button className="button primary" disabled={!draft.trim()}>
                  ลองตอบ
                </button>
              </form>
            )}

          {session.feedback && (
            <div className={`vocabulary-feedback ${session.feedback.success ? "is-correct" : "needs-practice"}`}>
              {session.feedback.success ? (
                <p>ใช่แล้ว คำนี้คือ <strong lang="de">{getActivityExpectedAnswer(activity, currentWord)}</strong></p>
              ) : (
                <>
                  <p>
                    {activity.type === "guided_recall" && session.feedback.attempts === 1
                      ? "เกือบแล้ว ลองอีกครั้งโดยมีคำใบ้เพิ่ม"
                      : "คำนี้คือ"}{" "}
                    <strong lang="de">{getActivityExpectedAnswer(activity, currentWord)}</strong>
                  </p>
                  {activity.type === "guided_recall" && session.feedback.attempts === 1 && (
                    <p className="vocabulary-hint">
                      คำใบ้เพิ่ม: {buildRecallHint(currentWord, 2)}
                    </p>
                  )}
                  <p>{currentWord.meaning}</p>
                </>
              )}
              <button
                className="button primary"
                onClick={() => {
                  if (
                    activity.type === "guided_recall" &&
                    !session.feedback?.success &&
                    session.feedback?.attempts === 1
                  ) {
                    setState((current) => retryVocabularyActivity(current));
                  } else {
                    continueActivity();
                  }
                }}
              >
                {activity.type === "guided_recall" &&
                !session.feedback.success &&
                session.feedback.attempts === 1
                  ? "ลองใหม่พร้อมคำใบ้"
                  : "เข้าใจแล้ว · ไปต่อ"}
              </button>
              {activity.type === "guided_recall" &&
                !session.feedback.success &&
                session.feedback.attempts === 1 && (
                  <button className="button secondary" onClick={continueActivity}>
                    ดูคำตอบแล้วไปต่อ
                  </button>
                )}
            </div>
          )}
        </section>
      )}

      {session?.phase === "summary" && (
        <section className="vocabulary-set-summary">
          <span className="eyebrow">LEARNING SET {session.setIndex + 1}</span>
          <h1>เรียนคำศัพท์ชุดนี้แล้ว</h1>
          <div className="vocabulary-summary-words">
            {setWords.map((word) => (
              <div key={word.id}>
                <strong lang="de">{word.displayGerman}</strong>
                <span>{word.meaning}</span>
              </div>
            ))}
          </div>
          <ul className="vocabulary-summary-activities">
            <li>ได้รู้จักคำใหม่</li>
            <li>เชื่อมคำกับความหมาย</li>
            <li>ลองนึกคำด้วยตัวเอง</li>
            <li>พบคำในบริบทของ Lektion</li>
          </ul>
          {sets[session.setIndex + 1] ? (
            <button className="button primary" onClick={() => beginSet(session.setIndex + 1)}>
              เรียนชุดถัดไป
            </button>
          ) : (
            <Link className="button primary" href={`/lesson/${lessonId}`}>
              กลับหน้าคำศัพท์
            </Link>
          )}
        </section>
      )}

      {developerMode && (
        <aside className="vocabulary-debug">
          <button className="button secondary" onClick={() => setDebugOpen((open) => !open)}>
            {debugOpen ? "ซ่อน Debug panel" : "Developer · Debug panel"}
          </button>
          {debugOpen && (
            <div className="vocabulary-debug-panel">
              <div className="vocabulary-debug-heading">
                <div>
                  <h2>Vocabulary learning state</h2>
                  <p>ข้อมูล prototype ใน localStorage ของเบราว์เซอร์นี้ · แยกจาก Practice exposure เดิม</p>
                </div>
                <button className="button secondary" onClick={resetData}>
                  Reset Vocabulary Learning Data
                </button>
              </div>
              {sets.flat().map((word) => {
                const itemState = state.items[word.id];
                return (
                  <details key={word.id} className="vocabulary-debug-item">
                    <summary lang="de">{word.displayGerman}</summary>
                    <p>introduced: {String(itemState?.introduced ?? false)}</p>
                    <p>learningCompleted: {String(itemState?.learningCompleted ?? false)}</p>
                    <ul>
                      {(itemState?.events ?? []).map((event) => (
                        <li key={event.id}>
                          {eventNames[event.type]}
                          {event.success !== undefined && ` · ${event.success ? "success" : "needs support"}`}
                          {event.response ? ` · response: ${event.response}` : ""}
                          {event.hintsUsed ? ` · hints ${event.hintsUsed}` : ""}
                          {event.adaptiveRepeat ? " · adaptive repeat" : ""}
                          {` · ${new Date(event.timestamp).toLocaleString("th-TH")}`}
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          )}
        </aside>
      )}
    </main>
  );
}

function VocabularySetProgress({
  phase,
  current,
  total,
}: {
  phase: string;
  current: number;
  total: number;
}) {
  const progress = total ? Math.round((current / total) * 100) : 0;
  return (
    <div className="vocabulary-set-progress">
      <div>
        <strong>{phase}</strong>
        <span>{current} / {total}</span>
      </div>
      <div className="vocabulary-progress-track" aria-label={`ความคืบหน้า ${current} จาก ${total}`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function VocabularyWordDetails({ word }: { word: VocabularyWord }) {
  return (
    <div className="vocabulary-word-details">
      <span className="vocabulary-word-type">{word.type}</span>
      {word.image && <img src={word.image} alt="" />}
      <h1 lang="de">{word.displayGerman}</h1>
      <p className="vocabulary-word-meaning">{word.meaning}</p>
      {word.type === "noun" && word.plural && (
        <p className="vocabulary-word-meta" lang="de">Plural: {word.plural}</p>
      )}
      {word.type === "verb" && word.chunk && (
        <p className="vocabulary-word-example" lang="de">{word.chunk}</p>
      )}
      {word.example && (
        <div className="vocabulary-word-example">
          <span>ตัวอย่าง</span>
          <p lang="de">{word.example}</p>
        </div>
      )}
      {word.type === "country" && !word.example && (
        <p className="vocabulary-word-meta">ชื่อประเทศ</p>
      )}
      {word.type === "adjective" && word.notes && (
        <p className="vocabulary-word-meta">{word.notes}</p>
      )}
      {word.type === "other" && word.notes && (
        <p className="vocabulary-word-meta">{word.notes}</p>
      )}
      {word.audio && <audio controls preload="none" src={word.audio}>เล่นเสียงตัวอย่าง</audio>}
    </div>
  );
}
