"use client";

import { useEffect, useRef, useState } from "react";
import type { Item } from "@/lib/content";
import { speakGermanText, useGermanVoice } from "./german-audio";

const additionalNumbers = [
  { value: 26, written: "sechsundzwanzig" },
  { value: 37, written: "siebenunddreißig" },
  { value: 76, written: "sechsundsiebzig" },
].map((number) => ({
  id: `number-summary-${number.value}`,
  lessonId: "L02",
  skill: "vocabulary" as const,
  group: "summary",
  title: number.written,
  meaning: number.written,
  answer: number.written,
  numberContent: { ...number, audioRef: null, group: "summary", order: number.value },
}));
type SummaryItem = Item & { numberContent: NonNullable<Item["numberContent"]> };

function SummaryWord({ item }: { item: SummaryItem }) {
  const { value, written } = item.numberContent;
  if (value >= 13 && value <= 19) {
    const root = value === 16 ? "sech" : value === 17 ? "sieb" : written.slice(0, -4);
    return <><span>{root}</span><span className="teen-tens">zehn</span></>;
  }
  if (value === 20) return <><span>zwan</span><span className="teen-tens">zig</span></>;
  if (value >= 21 && value < 100 && value % 10 !== 0) {
    const [units, tens] = written.split("und");
    return <><span>{units}</span><span className="compound-connector">und</span><span className="teen-tens">{tens}</span></>;
  }
  if (value >= 30 && value < 100 && value % 10 === 0) {
    const ending = value === 30 ? "ßig" : "zig";
    return <><span>{written.slice(0, -ending.length)}</span><span className="teen-tens">{ending}</span></>;
  }
  return <>{written}</>;
}

export function NumberSummaryBoard({ items }: { items: Item[] }) {
  const voice = useGermanVoice();
  const sound = useRef<HTMLAudioElement | null>(null);
  const active = useRef(true);
  const generation = useRef(0);
  const [error, setError] = useState("");
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; generation.current++; sound.current?.pause(); };
  }, []);
  function play(item: SummaryItem) {
    const current = ++generation.current;
    sound.current?.pause();
    window.speechSynthesis?.cancel();
    setError("");
    const failed = () => { if (active.current && generation.current === current) setError("เล่นเสียงไม่สำเร็จ กรุณาลองอีกครั้ง"); };
    if (item.numberContent?.audioRef) {
      const audio = new Audio(item.numberContent.audioRef);
      sound.current = audio;
      audio.onerror = failed;
      void audio.play().catch(failed);
    } else if (!speakGermanText(item.numberContent!.written, voice, { onError: failed })) {
      setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิด German voice แล้วลองอีกครั้ง");
    }
  }
  return (
    <section aria-label="ตารางสรุปตัวเลขที่เรียนแล้ว">
      <div className="alphabet-board-header"><p>แตะตัวเลขเพื่อฟังเสียง</p></div>
      <div className="alphabet-board-grid number-summary-grid">
        {[
          ...items.filter((item): item is SummaryItem => !!item.numberContent && item.id.startsWith("L02-number-")),
          ...additionalNumbers,
        ].sort((a,b)=>a.numberContent.value-b.numberContent.value).map((item) => (
          <button type="button" key={item.id} className={item.numberContent!.value > 12 ? "number-summary-wide" : undefined} aria-label={`ฟังเสียง ${item.numberContent!.value}`} onClick={() => play(item)}>
            <span className="number-summary-digit">{item.numberContent!.value}</span>
            <span className="number-summary-word" lang="de"><SummaryWord item={item} /></span>
          </button>
        ))}
      </div>
      {error && <p role="status" className="guided-feedback wrong">{error}</p>}
    </section>
  );
}
