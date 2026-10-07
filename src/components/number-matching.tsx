"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import type { Item } from "@/lib/content";
import { activityPairs, optionValue, type LearningActivity } from "@/lib/guided-learning";
import { speakGermanText, useGermanVoice } from "./german-audio";

function shuffled<T>(values: T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function NumberMatching({ activity, items, matchedIds, busy, onMatch }: {
  activity: LearningActivity;
  items: Item[];
  matchedIds: string[];
  busy: boolean;
  onMatch: (id: string) => Promise<void>;
}) {
  const pairs = activityPairs(activity, items);
  const compoundPage = activity.id === "L02-number-matching-21-100";
  const readingRate = compoundPage ? 0.65 : 0.8;
  const [order] = useState(() => shuffled(pairs));
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [audioError, setAudioError] = useState("");
  const voice = useGermanVoice();
  const sound = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      sound.current?.pause();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function listen(id: string) {
    if (busy || wrong) return;
    const item = items.find((candidate) => candidate.id === id)!;
    sound.current?.pause();
    window.speechSynthesis?.cancel();
    setAudioError("");
    setSelected(matchedIds.includes(id) ? null : id);
    const failed = () => { if (active.current) setAudioError("เล่นเสียงไม่สำเร็จ กรุณาลองอีกครั้ง"); };
    if (item.numberContent?.audioRef) {
      const audio = new Audio(item.numberContent.audioRef);
      audio.playbackRate = compoundPage ? 0.65 : 1;
      sound.current = audio;
      audio.onerror = failed;
      void audio.play().catch(failed);
    } else if (!speakGermanText(item.numberContent!.written, voice, { onError: failed }, readingRate)) {
      setAudioError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิด German voice แล้วลองอีกครั้ง");
    }
  }

  async function choose(id: string) {
    if (!selected || busy || wrong) return;
    if (selected !== id) {
      setWrong(id);
      timer.current = setTimeout(() => { setWrong(null); setSelected(null); }, 700);
      return;
    }
    await onMatch(id);
    if (active.current) setSelected(null);
  }

  function numberButton(pair: (typeof pairs)[number], matched = false) {
    return (
      <button type="button" aria-label={optionValue(pair.left, items)} aria-pressed={selected === pair.id} disabled={busy || !!wrong}
        className={`guided-choice number-digit${matched ? " correct" : ""}${selected === pair.id ? wrong ? " wrong" : " selected" : ""}`}
        onClick={() => listen(pair.id)}>
        <span>{optionValue(pair.left, items)}</span><Volume2 size={18} aria-hidden="true" />
      </button>
    );
  }

  function writtenWord(pair: (typeof pairs)[number]) {
    const written = optionValue(pair.right, items);
    if (!compoundPage) return written;
    if (items.find((item) => item.id === pair.id)?.numberContent?.value === 100)
      return <span className="number-word-part">{written}</span>;
    const [units, tens] = written.split("und");
    // hundert is a single word, not a unit + und + tens compound.
    if (!tens) return <span className="number-word-part">{written}</span>;
    return <><span className="number-word-part">{units}</span><wbr /><span className="number-word-part compound-connector">und</span><wbr /><span className="number-word-part teen-tens">{tens}</span></>;
  }

  return (
    <>
      <p className="number-audio-note">เสียงสังเคราะห์ภาษาเยอรมันอาจต่างกันตามอุปกรณ์</p>
      <div className="guided-match-board number-match-board">
        <div aria-label="บัตรตัวเลข" className="number-digit-bank">
          {pairs.filter((pair) => !matchedIds.includes(pair.id)).map((pair) => (
            <div key={pair.id} className="number-match-row">{numberButton(pair)}</div>
          ))}
        </div>
        <div aria-label="บัตรคำภาษาเยอรมัน" className="number-word-bank">
          {order.filter((pair) => !matchedIds.includes(pair.id)).map((pair) => (
            <button key={pair.id} type="button" lang="de" disabled={!selected || busy || !!wrong}
              className={`guided-choice${wrong === pair.id ? " wrong" : ""}`} onClick={() => void choose(pair.id)}>
              {writtenWord(pair)}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="guided-feedback wrong">{wrong ? "ลองใหม่" : audioError}</p>
      {matchedIds.length > 0 && (
        <section className="number-completed-pairs" aria-label="คู่ที่จับถูกแล้ว">
          {pairs.filter((pair) => matchedIds.includes(pair.id)).map((pair) => (
            <div key={pair.id} className="number-match-row guided-locked-pair">
              {numberButton(pair, true)}
              <span className="number-matched-word" lang="de">{writtenWord(pair)}</span>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
