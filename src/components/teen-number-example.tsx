"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { useGermanVoice } from "./german-audio";

export function TeenNumberExample({ tens = false, compound = false }: { tens?: boolean; compound?: boolean }) {
  const example = compound ? { number: "21", root: "ein", ending: "zwanzig" } : tens ? { number: "40", root: "vier", ending: "zig" } : { number: "13", root: "drei", ending: "zehn" };
  const voice = useGermanVoice();
  const markerId = useId().replace(/:/g, "");
  const [part, setPart] = useState<"units" | "connector" | "tens" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);
  useEffect(() => () => {
    generation.current++;
    window.speechSynthesis?.cancel();
  }, []);

  function play() {
    const current = ++generation.current;
    window.speechSynthesis?.cancel();
    setPart(null);
    setError("");
    if (!voice || !("speechSynthesis" in window)) {
      setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิด German voice แล้วลองอีกครั้ง");
      return;
    }
    setPlaying(true);
    // Read each part separately so arrow timing follows real speech events,
    // rather than guessing syllable timing from a browser-dependent voice.
    function read(text: string, phase: "units" | "connector" | "tens", next?: () => void) {
      if (generation.current !== current) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.voice = voice;
      utterance.rate = 0.65;
      utterance.onstart = () => { if (generation.current === current) setPart(phase); };
      utterance.onend = () => {
        if (generation.current !== current) return;
        if (next) next();
        else { setPart(null); setPlaying(false); }
      };
      utterance.onerror = (event) => {
        if (generation.current !== current) return;
        generation.current++;
        setPart(null);
        setPlaying(false);
        if (event.error !== "canceled" && event.error !== "interrupted")
          setError("เล่นเสียงไม่สำเร็จ กรุณาลองอีกครั้ง");
      };
      window.speechSynthesis.speak(utterance);
    }
    read(example.root, "units", () => compound ? read("und", "connector", () => read(example.ending, "tens")) : read(example.ending, "tens"));
  }

  return (
    <section className="teen-number-example" aria-label={`ตัวอย่างการอ่านเลข ${example.number}`}>
      <button type="button" className={`teen-example-card${playing ? " is-playing" : ""}`} onClick={play} aria-label={`ฟังตัวอย่างเลข ${example.number} ช้า ๆ`}>
        <span className={`teen-example-diagram${compound ? " compound-example-diagram" : ""}`} data-active-part={part ?? "none"} aria-hidden="true">
          <span className="teen-example-digits">{example.number.split("").map((digit, index) => {
            const isEnding = tens ? index === 1 : index === 0;
            const active = part === (isEnding ? "tens" : "units");
            return <span key={index} className={`${isEnding ? "teen-tens" : ""}${active ? " is-active" : ""}`}>{digit}</span>;
          })}</span>
          <svg className="teen-example-arrows" viewBox="0 0 240 58" fill="none">
            <defs>
              <marker id={`${markerId}-units`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="currentColor" /></marker>
              <marker id={`${markerId}-tens`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="#bc4141" /></marker>
            </defs>
            <path className={`teen-arrow teen-units-arrow${part === "units" ? " is-active" : ""}`} d={compound ? "M65 52L140 7" : tens ? "M83 52L100 7" : "M83 52L140 7"} markerEnd={`url(#${markerId}-units)`} />
            <path className={`teen-arrow teen-tens-arrow${part === "tens" ? " is-active" : ""}`} d={compound ? "M178 52L100 7" : tens ? "M157 52L140 7" : "M157 52L100 7"} markerEnd={`url(#${markerId}-tens)`} />
          </svg>
          <span className="teen-example-written" lang="de"><span className={part === "units" ? "is-active" : ""}>{example.root}</span>{compound && <span className={`compound-connector${part === "connector" ? " is-active" : ""}`}>und</span>}<span className={`teen-tens${part === "tens" ? " is-active" : ""}`}>{example.ending}</span></span>
        </span>
        <span className="teen-example-listen"><Volume2 size={18} aria-hidden="true" />กดฟังช้า ๆ</span>
      </button>
      {error && <p role="status" className="guided-feedback wrong">{error}</p>}
    </section>
  );
}
