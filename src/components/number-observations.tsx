"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import type { Item } from "@/lib/content";
import { speakGermanText, useGermanVoice } from "./german-audio";

const comparisons = [
  { base: 1, root: "ein", removed: "s", related: [21] },
  { base: 6, root: "sech", removed: "s", related: [16, 60] },
  { base: 7, root: "sieb", removed: "en", related: [17, 70] },
];

export function NumberObservations({ items }: { items: Item[] }) {
  const voice = useGermanVoice();
  const sound = useRef<HTMLAudioElement | null>(null);
  const generation = useRef(0);
  const [error, setError] = useState("");
  useEffect(() => () => { generation.current++; sound.current?.pause(); }, []);
  function play(value: number) {
    const item = items.find((item) => item.lessonId === "L02" && item.numberContent?.value === value);
    if (!item?.numberContent) return;
    const current = ++generation.current;
    sound.current?.pause();
    window.speechSynthesis?.cancel();
    setError("");
    const failed = () => { if (generation.current === current) setError("เล่นเสียงไม่สำเร็จ กรุณาลองอีกครั้ง"); };
    if (item.numberContent.audioRef) {
      const audio = new Audio(item.numberContent.audioRef);
      audio.playbackRate = 0.5;
      audio.onerror = failed;
      sound.current = audio;
      void audio.play().catch(failed);
    } else if (!speakGermanText(item.numberContent.written, voice, { onError: failed }, 0.5)) {
      setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิด German voice แล้วลองอีกครั้ง");
    }
  }
  const written = (value: number) => items.find((item) => item.lessonId === "L02" && item.numberContent?.value === value)?.numberContent?.written ?? "";
  return (
    <><section className="number-observations" aria-label="จุดสังเกตรูปคำของตัวเลข">
      {comparisons.map((comparison) => (
        <article className="number-observation-card" key={comparison.base}>
          <button type="button" className="number-observation-row number-observation-base" aria-label={`ฟังเสียง ${comparison.base}`} onClick={() => play(comparison.base)}>
            <span className="number-observation-digit">{comparison.base}</span>
            <span lang="de">{comparison.root}<span className="number-removed-ending">{comparison.removed}</span></span>
            <Volume2 size={18} aria-hidden="true" />
          </button>
          {comparison.related.map((value) => (
            <button type="button" className="number-observation-row" key={value} aria-label={`ฟังเสียง ${value}`} onClick={() => play(value)}>
              <span className="number-observation-digit">{value}</span>
              <span lang="de"><u className="number-retained-root">{comparison.root}</u>{value === 21 ? <><span className="compound-connector">und</span><span className="teen-tens">zwanzig</span></> : <span className="number-observation-ending">{written(value).slice(comparison.root.length)}</span>}</span>
              <Volume2 size={18} aria-hidden="true" />
            </button>
          ))}
        </article>
      ))}
    </section>{error && <p role="status" className="guided-feedback wrong">{error}</p>}</>
  );
}
