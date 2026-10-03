"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { shuffle, type AlphabetItem } from "@/lib/alphabet-learning";

interface AlphabetActivityProps {
  item: AlphabetItem;
  items: AlphabetItem[];
  play: (item: AlphabetItem) => boolean;
  audioError: string;
  onLearned: () => void;
  onContinue: () => void;
  onBack: () => void;
  canGoBack: boolean;
  onReturnToBoard?: () => void;
}

export function ListenAndChoose({ item, items, play, audioError, onLearned, onContinue, onBack, canGoBack, onReturnToBoard }: AlphabetActivityProps) {
  const [options] = useState(() => shuffle(items));
  const [heard, setHeard] = useState(false);
  const [feedback, setFeedback] = useState<"wrong" | "correct" | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);

  function listenAgain() {
    play(item);
    setHeard(true);
  }

  function choose(option: AlphabetItem) {
    if (!heard || feedback === "correct") return;
    if (option.id === item.id) {
      setWrongId(null);
      setFeedback("correct");
      onLearned();
      play(item);
    } else {
      setWrongId(option.id);
      setFeedback("wrong");
    }
  }

  return (
    <section className="alphabet-activity-card" aria-live="polite">
      <p className="alphabet-activity-instruction">ฟังเสียงเรียกตัวอักษร แล้วเลือกตัวที่ตรงกัน</p>
      <button className="alphabet-listen-button" onClick={listenAgain}>
        <Volume2 size={22} />{heard ? "ฟังเสียงอีกครั้ง" : "ฟังเสียงตัวอักษร"}
      </button>
      <div className="alphabet-letter-options" aria-label="ตัวเลือกตัวอักษร">
        {options.map((option) => (
          <button
            key={option.id}
            disabled={!heard || feedback === "correct"}
            className={feedback === "correct" && option.id === item.id ? "is-correct" : wrongId === option.id ? "is-wrong" : ""}
            onClick={() => choose(option)}
          >{option.symbol}</button>
        ))}
      </div>
      {feedback === "wrong" && <p className="alphabet-friendly-feedback" role="status">ยังไม่ใช่ ลองอีกครั้งได้</p>}
      {feedback === "correct" && (
        <div className="alphabet-friendly-feedback is-correct">
          <p>ใช่แล้ว เสียงนี้คือตัวอักษร <strong>{item.symbol}</strong></p>
        </div>
      )}
      {audioError && <p className="alphabet-audio-error" role="status">{audioError}</p>}
      <div className="alphabet-activity-navigation">
        <button className="button secondary" disabled={!canGoBack} onClick={onBack}>← ย้อนกลับ</button>
        {onReturnToBoard && <button className="button secondary" onClick={onReturnToBoard}>กลับกระดานตัวอักษร</button>}
        {feedback === "correct" && <button className="button primary" onClick={onContinue}>ไปต่อ</button>}
      </div>
    </section>
  );
}

export function FindSound({ item, items, play, audioError, onLearned, onContinue, onBack, canGoBack, onReturnToBoard }: AlphabetActivityProps) {
  const [options] = useState(() => shuffle(items));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"wrong" | "correct" | null>(null);

  function select(option: AlphabetItem) {
    if (feedback === "correct") return;
    play(option);
    setSelectedId(option.id);
    setWrongId(null);
    setFeedback(null);
  }

  function checkSelection() {
    if (!selectedId || feedback === "correct") return;
    if (selectedId === item.id) {
      setFeedback("correct");
      onLearned();
      play(item);
    } else {
      setWrongId(selectedId);
      setSelectedId(null);
      setFeedback("wrong");
    }
  }

  return (
    <section className="alphabet-activity-card" aria-live="polite">
      <p className="alphabet-activity-instruction">
        {item.specialSoundType === "umlaut"
          ? "ตามหาเสียงเรียกของ Umlaut นี้"
          : item.specialSoundType === "eszett"
            ? "ตามหาเสียงเรียกของ Eszett นี้"
            : "ตามหาเสียงเรียกของตัวอักษรนี้"}
      </p>
      <p className="alphabet-find-target">{item.symbol}</p>
      <div className="alphabet-sound-options" aria-label="ตัวเลือกเสียง">
        {options.map((option, index) => (
          <button
            key={option.id}
            aria-label={`ฟังเสียงตัวเลือก ${index + 1}`}
            aria-pressed={selectedId === option.id}
            disabled={feedback === "correct"}
            className={feedback === "correct" && option.id === item.id ? "is-correct" : wrongId === option.id ? "is-wrong" : selectedId === option.id ? "is-selected" : ""}
            onClick={() => select(option)}
          ><Volume2 size={22} /><span>เสียง {index + 1}</span></button>
        ))}
      </div>
      {selectedId && !feedback && <button className="button primary" onClick={checkSelection}>เลือกเสียงนี้</button>}
      {feedback === "wrong" && <p className="alphabet-friendly-feedback" role="status">ยังไม่ใช่ ลองฟังเสียงอื่นแล้วเลือกใหม่ได้</p>}
      {feedback === "correct" && (
        <div className="alphabet-friendly-feedback is-correct">
          <p>ใช่แล้ว นี่คือเสียงของ <strong>{item.symbol}</strong></p>
        </div>
      )}
      {audioError && <p className="alphabet-audio-error" role="status">{audioError}</p>}
      <div className="alphabet-activity-navigation">
        <button className="button secondary" disabled={!canGoBack} onClick={onBack}>← ย้อนกลับ</button>
        {onReturnToBoard && <button className="button secondary" onClick={onReturnToBoard}>กลับกระดานตัวอักษร</button>}
        {feedback === "correct" && <button className="button primary" onClick={onContinue}>ไปต่อ</button>}
      </div>
    </section>
  );
}
