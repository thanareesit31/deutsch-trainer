"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import alphabetData from "@/data/alphabet.json";
import {
  resolveAlphabetSetItems,
  type AlphabetItem,
  type AlphabetLessonConfiguration,
} from "@/lib/alphabet-learning";
import {
  emptyAlphabetLearningState,
  readAlphabetLearningState,
  writeAlphabetLearningState,
  type AlphabetLearningState,
} from "@/lib/alphabet-learning-storage";
import { useAlphabetAudio } from "./alphabet-audio";
import { FindSound, ListenAndChoose } from "./alphabet-activities";

const configuration = alphabetData as AlphabetLessonConfiguration;

export function AlphabetLearningPage() {
  const sets = useMemo(
    () => [...configuration.sets].sort((left, right) => left.position - right.position),
    [],
  );
  const flow = useMemo(() => sets.flatMap((set) =>
    resolveAlphabetSetItems(set, configuration.items).map((item) => ({ item, set }))), [sets]);
  const [learningState, setLearningState] = useState<AlphabetLearningState>(emptyAlphabetLearningState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [revisitingFromBoard, setRevisitingFromBoard] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { play, error, voiceAvailable } = useAlphabetAudio();
  const hasMissingAudio = configuration.items.some((item) => !item.audio);

  useEffect(() => {
    const saved = readAlphabetLearningState();
    const resumeIndex = Math.min(saved.resumeIndex, flow.length);
    const revisitIndex = resumeIndex >= flow.length ? saved.revisitIndex : null;
    const isRevisiting = revisitIndex !== null;
    setLearningState({ ...saved, resumeIndex, revisitIndex });
    setCurrentIndex(isRevisiting ? revisitIndex : resumeIndex);
    setRevisitingFromBoard(isRevisiting);
    setShowBoard(resumeIndex >= flow.length && !isRevisiting);
    setHydrated(true);
  }, [flow.length]);

  useEffect(() => {
    if (hydrated) writeAlphabetLearningState(learningState);
  }, [hydrated, learningState]);

  function startReplayFromBeginning() {
    setCurrentIndex(0);
    setRevisitingFromBoard(true);
    setShowBoard(false);
    setLearningState((state) => ({ ...state, revisitIndex: 0 }));
  }

  if (!hydrated) return <main className="alphabet-learning-page" aria-busy="true" />;

  if (learningState.resumeIndex >= flow.length && showBoard) {
    return (
      <main className="alphabet-learning-page">
        <div className="alphabet-board-top-navigation">
          <Link className="back-link" href="/learn/L01/vocabulary">← กลับ Wortschatz</Link>
          <button className="button secondary" onClick={startReplayFromBeginning}>เรียนซ้ำ</button>
        </div>
        <header className="alphabet-learning-heading">
          <span className="eyebrow">LEKTION 1 · WORTSCHATZ</span>
          <h1>Das Alphabet</h1>
        </header>
        <AlphabetBoard items={configuration.items} play={play} />
        {error && <p className="alphabet-audio-error" role="status">{error}</p>}
        <div className="result-actions alphabet-board-actions">
          <button
            className="button secondary"
            onClick={() => {
              setCurrentIndex(Math.max(flow.length - 1, 0));
              setRevisitingFromBoard(true);
              setShowBoard(false);
              setLearningState((state) => ({
                ...state,
                revisitIndex: Math.max(flow.length - 1, 0),
              }));
            }}
          >← ย้อนกลับ</button>
          <Link className="button secondary" href="/learn/L01/vocabulary/core-images">
            เรียนคำศัพท์ต่อ
          </Link>
          <Link className="button primary" href="/practice/L01/vocabulary">
            แบบฝึกหัด
          </Link>
        </div>
      </main>
    );
  }

  const current = flow[currentIndex];
  if (!current) return null;
  const groupItems = resolveAlphabetSetItems(current.set, configuration.items);
  const Activity = current.set.activity === "listen_and_choose" ? ListenAndChoose : FindSound;
  const learned = new Set(learningState.learnedItemIds);

  function markLearned() {
    if (currentIndex === flow.length - 1 && !revisitingFromBoard) setShowBoard(true);
    setLearningState((state) => {
      const resumeIndex = currentIndex >= state.resumeIndex
        ? Math.min(currentIndex + 1, flow.length)
        : state.resumeIndex;
      return {
        ...state,
        learnedItemIds: state.learnedItemIds.includes(current.item.id)
          ? state.learnedItemIds
          : [...state.learnedItemIds, current.item.id],
        resumeIndex,
      };
    });
  }

  function continueFlow() {
    if (revisitingFromBoard) {
      if (currentIndex >= flow.length - 1) {
        setShowBoard(true);
        setRevisitingFromBoard(false);
        setLearningState((state) => ({ ...state, revisitIndex: null }));
      } else {
        goToIndex(Math.min(currentIndex + 1, flow.length - 1));
      }
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, flow.length - 1));
  }

  function goToIndex(index: number) {
    const nextIndex = Math.max(0, Math.min(index, flow.length - 1));
    setCurrentIndex(nextIndex);
    if (revisitingFromBoard) {
      setLearningState((state) => ({ ...state, revisitIndex: nextIndex }));
    }
  }

  function returnToBoard() {
    setShowBoard(true);
    setRevisitingFromBoard(false);
    setLearningState((state) => ({ ...state, revisitIndex: null }));
  }

  return (
    <main className="alphabet-learning-page">
      <Link className="back-link" href="/learn/L01/vocabulary">← กลับ Wortschatz</Link>
      <header className="alphabet-learning-heading">
        <span className="eyebrow">LEKTION 1 · WORTSCHATZ</span>
        <h1>Das Alphabet</h1>
      </header>
      <div className="alphabet-set-progress">
        <div className="alphabet-set-progress-count">
          <strong>{currentIndex + 1} / {flow.length}</strong>
        </div>
        <div className="alphabet-item-progress-track" aria-label={`ตัวอักษรที่ ${currentIndex + 1} จาก ${flow.length}`}>
          <span style={{ width: `${((currentIndex + 1) / flow.length) * 100}%` }} />
        </div>
      </div>
      {hasMissingAudio && (
        <p className="alphabet-audio-notice">
          เสียงสังเคราะห์อาจแตกต่างกันตามเครื่องและเบราว์เซอร์ที่ใช้เรียน
        </p>
      )}
      {!voiceAvailable && hasMissingAudio && (
        <p className="alphabet-audio-error" role="status">ยังไม่พบ German voice ในอุปกรณ์นี้ หากกดฟังแล้วไม่มีเสียง ให้เลือก German voice ในระบบก่อน</p>
      )}
      {learned.has(current.item.id) && <p className="alphabet-learned-indicator">เรียนแล้ว</p>}
      <Activity
        key={current.item.id}
        item={current.item}
        items={groupItems}
        play={play}
        audioError={error}
        onLearned={markLearned}
        onContinue={continueFlow}
        onBack={() => goToIndex(currentIndex - 1)}
        canGoBack={currentIndex > 0}
        onReturnToBoard={revisitingFromBoard ? returnToBoard : undefined}
      />
    </main>
  );
}

function AlphabetBoard({
  items,
  play,
}: {
  items: AlphabetItem[];
  play: (item: AlphabetItem) => boolean;
}) {
  const orderedItems = [...items].sort((left, right) => left.order - right.order);
  return (
    <section className="alphabet-board" aria-label="กระดานตัวอักษรภาษาเยอรมัน">
      <div className="alphabet-board-header">
        <p>แตะตัวอักษรเพื่อฟังเสียง</p>
      </div>
      <div className="alphabet-board-grid">
        {orderedItems.map((item) => (
          <button key={item.id} aria-label={`ฟังเสียง ${item.symbol}`} onClick={() => play(item)}>
            {item.symbol}
          </button>
        ))}
      </div>
    </section>
  );
}
