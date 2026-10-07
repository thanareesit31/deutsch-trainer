"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import type { Item } from "@/lib/content";
import {
  activityPairs,
  optionValue,
  type LearningActivity,
  type LearningOption,
} from "@/lib/guided-learning";
import { speakGermanText, useGermanVoice } from "./german-audio";

function shuffled<T>(values: T[]): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function LearningValue({
  option,
  items,
}: {
  option: LearningOption;
  items: Item[];
}) {
  const value = optionValue(option, items);
  return option.ref?.field === "image" ? (
    // Native image preserves the original SVG; alt text must not disclose the match.
    <img
      className="guided-profession-image"
      src={value}
      alt="ภาพประกอบอาชีพ"
      width={240}
      height={180}
    />
  ) : (
    <span lang="de">{value}</span>
  );
}

export function AudioChoice({
  ids,
  items,
  onPlayed,
  feminine = false,
}: {
  ids: string[];
  items: Item[];
  onPlayed?: () => void;
  feminine?: boolean;
}) {
  const voice = useGermanVoice();
  const audio = useRef<HTMLAudioElement | null>(null);
  const stopped = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    stopped.current = false;
    return () => {
      stopped.current = true;
      audio.current?.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);
  const targets = ids
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is Item => !!i);
  function play() {
    audio.current?.pause();
    setError("");
    const staticRef =
      targets.length === 1
        ? feminine
          ? targets[0].professionContent?.feminineAudioRef
          : (targets[0].numberContent?.audioRef ??
            targets[0].professionContent?.masculineAudioRef ??
            targets[0].audio)
        : null;
    if (staticRef) {
      const sound = new Audio(staticRef);
      audio.current = sound;
      sound.onerror = () => {
        if (!stopped.current) setError("เล่นเสียงไม่สำเร็จ ลองอีกครั้ง");
      };
      void sound
        .play()
        .then(() => {
          if (!stopped.current) onPlayed?.();
        })
        .catch(() => {
          if (!stopped.current) setError("เล่นเสียงไม่สำเร็จ ลองอีกครั้ง");
        });
    } else {
      const text = targets
        .map((i) =>
          feminine
            ? (i.professionContent?.feminine ?? i.word ?? i.title)
            : (i.numberContent?.written ?? i.word ?? i.title),
        )
        .join(", ");
      if (
        !speakGermanText(text, voice, {
          onError: () => {
            if (!stopped.current) setError("เล่นเสียงไม่สำเร็จ ลองอีกครั้ง");
          },
        })
      )
        setError(
          "อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิด German voice แล้วลองอีกครั้ง",
        );
      else onPlayed?.();
    }
  }
  return (
    <div className="guided-audio">
      <button type="button" className="button secondary" onClick={play}>
        <Volume2 size={20} />
        {feminine ? "ฟังรูปหญิง" : "ฟังเสียง"}
      </button>
      {!targets.every((i) =>
        feminine
          ? i.professionContent?.feminineAudioRef
          : (i.numberContent?.audioRef ??
            i.professionContent?.masculineAudioRef ??
            i.audio),
      ) && <small>เสียงสังเคราะห์ภาษาเยอรมันอาจต่างกันตามอุปกรณ์</small>}
      {error && (
        <p role="status" className="guided-feedback wrong">
          {error}
        </p>
      )}
    </div>
  );
}

export function NumberChoice({
  activity,
  items,
  completed,
  busy,
  onCorrect,
}: {
  activity: LearningActivity;
  items: Item[];
  completed: boolean;
  busy: boolean;
  onCorrect: () => Promise<void>;
}) {
  const [options] = useState(() => shuffled(activity.options ?? []));
  const [wrong, setWrong] = useState<string | null>(null);
  const [heard, setHeard] = useState(false);
  const audioRequired = !!activity.audioIds?.length;
  async function choose(id: string) {
    if (busy || completed || (audioRequired && !heard)) return;
    if (id !== activity.correctOptionId) {
      setWrong(id);
      return;
    }
    setWrong(null);
    await onCorrect();
  }
  return (
    <>
      {activity.prompt && (
        <div className="guided-prompt">
          <LearningValue option={activity.prompt} items={items} />
        </div>
      )}
      {activity.audioIds && (
        <AudioChoice
          ids={activity.audioIds}
          items={items}
          onPlayed={() => setHeard(true)}
        />
      )}
      <div className="guided-choices" aria-label="ตัวเลือก">
        {options.map((o) => (
          <button
            type="button"
            key={o.id}
            disabled={busy || completed || (audioRequired && !heard)}
            className={`guided-choice ${completed && o.id === activity.correctOptionId ? "correct" : wrong === o.id ? "wrong" : ""}`}
            onClick={() => void choose(o.id)}
          >
            <LearningValue option={o} items={items} />
          </button>
        ))}
      </div>
      <p
        role="status"
        className={`guided-feedback ${completed ? "correct" : wrong ? "wrong" : ""}`}
      >
        {completed ? "ถูกต้อง" : wrong ? "ลองใหม่" : ""}
      </p>
    </>
  );
}

export function PairMatching({
  activity,
  items,
  matchedIds,
  busy,
  onMatch,
}: {
  activity: LearningActivity;
  items: Item[];
  matchedIds: string[];
  busy: boolean;
  onMatch: (id: string) => Promise<void>;
}) {
  const pairs = activityPairs(activity, items);
  const [rightOrder] = useState(() => shuffled(pairs));
  const [selection, setSelection] = useState<{
    side: "left" | "right";
    id: string;
  } | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function choose(side: "left" | "right", id: string) {
    if (busy || wrong.length) return;
    if (!selection || selection.side === side) {
      setSelection({ side, id });
      return;
    }
    const leftId = side === "left" ? id : selection.id,
      rightId = side === "right" ? id : selection.id;
    const left = pairs.find((p) => p.id === leftId)!,
      right = pairs.find((p) => p.id === rightId)!;
    setSelection(null);
    // Equal conjugation forms are interchangeable; profession/image pairs retain identity.
    const correct =
      leftId === rightId ||
      (activity.type === "conjugation" &&
        optionValue(left.right, items) === optionValue(right.right, items));
    if (!correct) {
      setWrong([`left:${leftId}`, `right:${rightId}`]);
      timer.current = setTimeout(() => setWrong([]), 700);
      return;
    }
    await onMatch(leftId);
  }
  const remainingRight = [...rightOrder];
  // Consume one token per saved subject, including equivalent duplicate forms.
  for (const id of matchedIds) {
    const pair = pairs.find((p) => p.id === id);
    const index = remainingRight.findIndex((p) =>
      activity.type === "conjugation"
        ? optionValue(p.right, items) === optionValue(pair!.right, items)
        : p.id === id,
    );
    if (index >= 0) remainingRight.splice(index, 1);
  }
  const token = (pair: (typeof pairs)[number], side: "left" | "right") => (
    <button
      type="button"
      key={pair.id}
      draggable={!busy}
      disabled={busy || !!wrong.length}
      className={`guided-choice ${selection?.id === pair.id && selection.side === side ? "selected" : ""} ${wrong.includes(`${side}:${pair.id}`) ? "wrong" : ""}`}
      aria-pressed={selection?.id === pair.id && selection.side === side}
      onClick={() => void choose(side, pair.id)}
      onDragStart={(event) =>
        event.dataTransfer.setData("text/plain", `${side}:${pair.id}`)
      }
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const [sourceSide, ...parts] = event.dataTransfer
          .getData("text/plain")
          .split(":");
        const sourceId = parts.join(":");
        if (
          (sourceSide === "left" || sourceSide === "right") &&
          sourceSide !== side &&
          pairs.some((p) => p.id === sourceId)
        ) {
          setSelection({ side: sourceSide, id: sourceId });
          /* The next click is unnecessary: resolve the same two tokens. */ const left =
              pairs.find(
                (p) => p.id === (side === "left" ? pair.id : sourceId),
              )!,
            right = pairs.find(
              (p) => p.id === (side === "right" ? pair.id : sourceId),
            )!;
          setSelection(null);
          if (
            left.id === right.id ||
            (activity.type === "conjugation" &&
              optionValue(left.right, items) ===
                optionValue(right.right, items))
          ) {
            if (!busy && !wrong.length) void onMatch(left.id);
          } else {
            setWrong([`left:${left.id}`, `right:${right.id}`]);
            timer.current = setTimeout(() => setWrong([]), 700);
          }
        }
      }}
    >
      <LearningValue option={pair[side]} items={items} />
    </button>
  );
  return (
    <>
      <div className="guided-locked">
        {pairs
          .filter((p) => matchedIds.includes(p.id))
          .map((p) => (
            <div key={p.id} className="guided-locked-pair">
              <LearningValue option={p.left} items={items} />
              <LearningValue option={p.right} items={items} />
              {activity.type !== "conjugation" && (
                <small>
                  {items.find((i) => i.id === p.contentIds[0])?.meaning}
                </small>
              )}
            </div>
          ))}
      </div>
      <div className="guided-match-board">
        <div aria-label="ชุดซ้าย">
          {pairs
            .filter((p) => !matchedIds.includes(p.id))
            .map((p) => token(p, "left"))}
        </div>
        <div aria-label="ชุดขวา">
          {remainingRight.map((p) => token(p, "right"))}
        </div>
      </div>
      <p role="status" className="guided-feedback wrong">
        {wrong.length ? "ลองใหม่" : ""}
      </p>
    </>
  );
}
