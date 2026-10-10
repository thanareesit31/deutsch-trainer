"use client";

import Link from "next/link";
import { Volume2 } from "lucide-react";
import { useState } from "react";
import { useLearning } from "./learning-store";
import { useVocabularyAudio } from "./vocabulary-audio";

const contextWords = {
  spazieren: { id: "L13-V066", text: "spazieren gehen", meaning: "เดินเล่น" },
  nearby: { id: "L13-V043", text: "in der Nähe", meaning: "ในบริเวณใกล้เคียง" },
  bridge: { id: "L13-V048", text: "die Brücke", meaning: "สะพาน" },
  unfortunately: { id: "L13-V042", text: "leider", meaning: "น่าเสียดาย" },
  fishing: { id: "L13-V067", text: "angeln", meaning: "ตกปลา" },
  boat: { id: "L13-V068", text: "ein Boot mieten", meaning: "เช่าเรือ" },
  picnic: { id: "L13-V054", text: "das Picknick", meaning: "การปิกนิก" },
} as const;
const storyAudio = "Am Samstag möchte ich am See spazieren gehen. In der Nähe gibt es eine alte Brücke. Leider regnet es leicht. Trotzdem möchte ich angeln oder ein Boot mieten. Danach mache ich ein Picknick.";

type ContextWordKey = keyof typeof contextWords;

export function L13ContextLesson({ mode }: { mode: "reading" | "listening" }) {
  const learning = useLearning();
  const { play, error: audioError } = useVocabularyAudio();
  const [selectedKey, setSelectedKey] = useState<ContextWordKey | null>(null);
  const [error, setError] = useState("");
  const [transcriptOpen, setTranscriptOpen] = useState(mode === "reading");
  const selected = selectedKey ? contextWords[selectedKey] : null;

  async function selectWord(key: ContextWordKey) {
    setSelectedKey(key);
    setError("");
    const word = contextWords[key];
    if (learning.exposures.some((exposure) => exposure.item_id === word.id)) return;
    try {
      await learning.act("expose", { itemId: word.id });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "บันทึกคำที่เปิดดูไม่สำเร็จ");
    }
  }

  function word(key: ContextWordKey, text: string) {
    return (
      <button
        key={key}
        type="button"
        className={`l13-context-word${selectedKey === key ? " selected" : ""}`}
        aria-pressed={selectedKey === key}
        disabled={learning.busy}
        onClick={() => void selectWord(key)}
      >
        {text}
      </button>
    );
  }

  return (
    <main className="l13-context-reading">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{mode === "reading" ? "LESEN" : "HÖREN"} · L13</span>
          <h1>Ein Tag am See</h1>
          <p>{mode === "reading"
            ? "อ่านเรื่องสั้น แล้วแตะคำที่ขีดเส้นใต้เพื่อดูความหมายและฟังเสียง"
            : "ลองฟังเรื่องสั้นก่อน แล้วเปิดข้อความเพื่อแตะดูความหมายของศัพท์เสริม"}</p>
        </div>
      </div>

      {mode === "listening" && (
        <div className="l13-context-listening-actions">
          <button className="button primary" type="button" onClick={() => play(storyAudio)}>
            <Volume2 size={17} aria-hidden="true" /> ฟังเรื่องสั้น
          </button>
          <button className="button secondary" type="button" onClick={() => play(storyAudio, null, 0.55)}>
            <Volume2 size={17} aria-hidden="true" /> ฟังช้า
          </button>
          {!transcriptOpen && <button className="button secondary" type="button" onClick={() => setTranscriptOpen(true)}>เปิดข้อความและคำศัพท์</button>}
        </div>
      )}

      {transcriptOpen && (
        <article className="l13-context-story" lang="de">
          <p>
            Am Samstag möchte ich am See {word("spazieren", "spazieren gehen")}.
            {" "} {word("nearby", "In der Nähe")} gibt es eine alte {word("bridge", "Brücke")}.
          </p>
          <p>
            {word("unfortunately", "Leider")} regnet es leicht. Trotzdem möchte ich
            {" "}{word("fishing", "angeln")} oder {word("boat", "ein Boot mieten")}.
            Danach mache ich {word("picnic", "ein Picknick")}.
          </p>
        </article>
      )}

      {selected && (
        <section className="l13-context-definition" aria-live="polite" aria-label="ความหมายของคำที่เลือก">
          <div>
            <strong lang="de">{selected.text}</strong>
            <span>{selected.meaning}</span>
          </div>
          <button type="button" className="button secondary" onClick={() => play(selected.text)}>
            <Volume2 size={17} aria-hidden="true" /> ฟังเสียง
          </button>
        </section>
      )}

      {(error || audioError) && <p className="notice error" role="status">{error || audioError}</p>}
      <p className="l13-context-note">ตัวอย่างการเรียนศัพท์เสริมจากบริบทในหมวด{mode === "reading" ? "อ่าน" : "ฟัง"}</p>
      <div className="guided-navigation">
        <Link className="button secondary" href="/lesson/L13">กลับไปหน้าบทเรียน</Link>
      </div>
    </main>
  );
}
