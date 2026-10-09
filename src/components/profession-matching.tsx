"use client";

import { useEffect, useRef, useState } from "react";
import type { Item } from "@/lib/content";
import type { LearningActivity } from "@/lib/guided-learning";
import { Volume2 } from "lucide-react";
import { useVocabularyAudio } from "./vocabulary-audio";
import {
  articleColors,
  personLayout,
  shuffle,
  professionImageSource,
} from "@/lib/profession-learning";

export function ArticleDot({ article }: { article: string }) {
  return (
    <span
      className="article-dot"
      style={{
        backgroundColor: articleColors[article as keyof typeof articleColors],
      }}
      aria-hidden="true"
    />
  );
}
export function ArticleLegend() {
  const legendRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const legend = legendRef.current;
    const container = legend?.closest<HTMLElement>(".profession-learning");
    if (!legend || !container) return;
    const progress = container.querySelector<HTMLElement>(".vocabulary-image-progress");
    const updateHeight = () => {
      container.style.setProperty("--article-legend-height", `${legend.getBoundingClientRect().height}px`);
      container.style.setProperty("--profession-progress-height", `${progress?.getBoundingClientRect().height ?? 0}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(legend);
    if (progress) observer.observe(progress);
    return () => {
      observer.disconnect();
      container.style.removeProperty("--article-legend-height");
      container.style.removeProperty("--profession-progress-height");
    };
  }, []);
  return (
    <aside ref={legendRef} className="article-legend" aria-label="สี Artikel">
      <span>
        <ArticleDot article="der" />
        der · Maskulin
      </span>
      <span>
        <ArticleDot article="die" />
        die · Feminin
      </span>
      <span>
        <ArticleDot article="das" />
        das · Neutrum
      </span>
      <span title="พหูพจน์ ไม่ใช่เพศทางไวยากรณ์ที่สี่">
        <ArticleDot article="plural" />
        die · Plural
      </span>
    </aside>
  );
}

export function ProfessionMatching({
  activity,
  items,
  matchedIds,
  busy,
  wrongCounts,
  onMatch,
  onWrong,
  showFormNote = false,
}: {
  activity: LearningActivity;
  items: Item[];
  matchedIds: string[];
  busy: boolean;
  wrongCounts: Record<string, { wrong: number }>;
  onMatch: (id: string) => Promise<void>;
  onWrong: (id: string) => void;
  showFormNote?: boolean;
}) {
  const [board] = useState(() =>
    activity.pairs!.map((p) => personLayout(items.find((i) => i.id === p.id)!)),
  );
  const [options] = useState(() =>
    shuffle(
      board.map((row) => ({
        id: row.item.id,
        label: row.people.find((p) => !p.given)!.label.text,
      })),
    ),
  );
  const { play, error: audioError } = useVocabularyAudio();
  function playWord(item: Item, form: "masculine" | "feminine", text: string) {
    play(text, form === "feminine" ? item.professionContent?.feminineAudioRef : item.professionContent?.masculineAudioRef ?? item.audio);
  }
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  async function place(id: string) {
    if (!selected || busy || matchedIds.includes(id)) return;
    setSelected(null);
    if (selected !== id) {
      onWrong(id);
      setFeedback((old) => ({
        ...old,
        [id]: "ยังไม่ตรงกัน ลองเลือกใหม่ได้เลย",
      }));
      return;
    }
    const row = board.find(({ item }) => item.id === id)!;
    const answer = row.people.find((person) => !person.given)!;
    // Start in the user's tap handler, before an asynchronous progress save.
    playWord(row.item, answer.form, answer.label.text);
    await onMatch(id);
  }
  const done = board.every(({ item }) => matchedIds.includes(item.id));
  return (
    <div className="profession-matching">
      {!done && (
        <div className="matching-options-sticky profession-options-sticky">
          <div
            className="profession-options"
            role="group"
            aria-label="ตัวเลือกคำศัพท์"
          >
            {options
              .filter((o) => !matchedIds.includes(o.id))
              .map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`profession-option${selected === o.id ? " selected" : ""}`}
                  aria-pressed={selected === o.id}
                  disabled={busy}
                  onClick={() => setSelected(o.id)}
                  lang="de"
                >
                  {o.label}
                </button>
              ))}
          </div>
        </div>
      )}
      {done && (
        <p className="profession-complete" role="status">
          ✓ จับคู่ครบแล้ว ทบทวนก่อนกดหน้าถัดไป
        </p>
      )}
      {audioError && <p className="profession-error" role="status">{audioError}</p>}
      <div className="profession-grid">
        {board.map(({ item, people }, index) => {
          const matched = matchedIds.includes(item.id);
          const leftForm = people[0].form;
          return (
            <article
              className="profession-pair"
              key={item.id}
              data-profession-id={item.id}
              data-matched={matched}
            >
              {matched && <p className="profession-meaning">{item.meaning}</p>}
              <img
                className={`profession-pair-image${leftForm === "feminine" ? " mirrored" : ""}`}
                src={professionImageSource(item)}
                alt={`${matched ? item.meaning : "ภาพคู่ผู้ประกอบอาชีพ"} · ${leftForm === "masculine" ? "ผู้ชายซ้าย ผู้หญิงขวา" : "ผู้หญิงซ้าย ผู้ชายขวา"}`}
                data-left-form={leftForm}
                width={1536}
                height={1024}
              />
              <div className="profession-people">
                {people.map(({ form, label, given }) => (
                  <div key={form} data-form={form}>
                    {given || matched ? (
                      <button
                        type="button"
                        className="profession-label profession-audio-word"
                        aria-label={`ฟัง ${label.text}`}
                        title="กดเพื่อฟังเสียง"
                        onClick={() => playWord(item, form, label.text)}
                      >
                        <ArticleDot article={label.article} />
                        <span lang="de">{label.text}</span>
                        <Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" />
                        {!given && <span aria-label="ถูกต้อง"> ✓</span>}
                      </button>
                    ) : (
                      <button
                        className="profession-slot"
                        type="button"
                        aria-label={`วางคำศัพท์ ${item.meaning} ${form === "masculine" ? "ผู้ชาย" : "ผู้หญิง"}`}
                        disabled={!selected || busy}
                        onClick={() => void place(item.id)}
                      >
                        วางคำศัพท์ที่นี่
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {showFormNote && index === 0 && (
                <p className="profession-first-note">
                  ชื่ออาชีพผู้หญิงหลายคำเติม <strong lang="de">-in</strong> เช่น{" "}
                  <span lang="de">Lehrer → Lehrerin</span> แต่บางคำเปลี่ยนรูป
                  เช่น <span lang="de">Arzt → Ärztin</span>
                </p>
              )}
              {!matched && (
                <>
                  {feedback[item.id] && (
                    <p role="status" className="profession-error">
                      {feedback[item.id]}
                    </p>
                  )}
                  {(wrongCounts[item.id]?.wrong ?? 0) >= 2 && (
                    <p className="profession-hint">
                      คำใบ้: ดูว่าช่องว่างอยู่ใต้ผู้ชายหรือผู้หญิง
                      แล้วเทียบรากคำกับคำที่ให้ไว้
                      {item.professionContent!.feminine !==
                      item.professionContent!.masculine + "in"
                        ? " คู่นี้มีรูปพิเศษ"
                        : " รูปหญิงของคู่นี้ลงท้าย -in"}
                    </p>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
