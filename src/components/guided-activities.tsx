"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Volume2 } from "lucide-react";
import type { Item } from "@/lib/content";
import {
  activityPairs,
  optionValue,
  type LearningActivity,
  type LearningOption,
  type LearningPair,
} from "@/lib/guided-learning";
import { speakGermanText, useGermanVoice } from "./german-audio";
import { useVocabularyAudio } from "./vocabulary-audio";
import { GermanListenText } from "./german-listen-text";

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
    <span lang={/[\u0e00-\u0e7f]/u.test(value) ? "th" : "de"}>{value}</span>
  );
}

export function RouteDiagram({ route }: { route: NonNullable<LearningPair["leftVisual"]>["route"] }) {
  const markerId = `route-${useId().replaceAll(":", "")}`;
  if (route === "distance") return <svg className="guided-route-diagram" viewBox="0 0 150 120" role="img" aria-label="เส้นทางจากจุดเริ่มถึงหลักระยะ 50 เมตร">
    <path d="M18 78H132" stroke="#d8dfd6" strokeWidth="24" strokeLinecap="round" />
    <path d="M18 78H132" stroke="#fff" strokeWidth="2" strokeDasharray="5 7" />
    <circle cx="29" cy="78" r="10" fill="#258db3" stroke="#fff" strokeWidth="3" />
    <path d="M44 78H103" stroke="#258db3" strokeWidth="5" strokeLinecap="round" strokeDasharray="7 6" />
    <path d="M105 78L96 72V84Z" fill="#258db3" />
    <path d="M116 41V86" stroke="#315344" strokeWidth="3" strokeLinecap="round" />
    <path d="M116 42H134L128 52L134 62H116Z" fill="#e8b845" />
    <rect x="58" y="29" width="48" height="27" rx="8" fill="#fff" stroke="#8ba99a" strokeWidth="2" />
    <text x="82" y="47" textAnchor="middle" className="guided-route-distance-label">50 m</text>
  </svg>;
  const paths = {
    straight: "M75 104V20",
    right: "M28 55H116",
    left: "M122 55H34",
    "turn-right": "M75 111V55H125",
    "turn-left": "M75 111V55H25",
    cross: "M28 90L122 20",
  } as const;
  const end = {
    straight: [75, 20], right: [122, 55], left: [28, 55],
    "turn-right": [125, 55], "turn-left": [25, 55], cross: [122, 20],
  } as const;
  const labels = {
    straight: "แผนผังถนน ลูกศรตรงไป",
    right: "แผนผังถนน ลูกศรไปทางขวา",
    left: "แผนผังถนน ลูกศรไปทางซ้าย",
    "turn-right": "แผนผังถนน เลี้ยวขวาที่แยก",
    "turn-left": "แผนผังถนน เลี้ยวซ้ายที่แยก",
    cross: "แผนผังถนน เส้นทางข้ามถนน",
  } as const;
  const [x, y] = end[route];
  return <svg className="guided-route-diagram" viewBox="0 0 150 120" role="img" aria-label={labels[route]}>
    <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#258db3" /></marker></defs>
    <path d="M15 55H135M75 12V108" stroke="#d8dfd6" strokeWidth="20" strokeLinecap="round" />
    <path d="M15 55H135M75 12V108" stroke="#fff" strokeWidth="2" strokeDasharray="5 7" />
    <path d={paths[route]} fill="none" stroke="#258db3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" markerEnd={`url(#${markerId})`} />
    <circle cx={x} cy={y} r="4" fill="#258db3" />
  </svg>;
}

export function AudioChoice({
  ids,
  items,
  onPlayed,
  feminine = false,
  label,
  buttonClassName = "button secondary",
  showNotice = true,
  ariaLabel,
}: {
  ids: string[];
  items: Item[];
  onPlayed?: () => void;
  feminine?: boolean;
  label?: ReactNode;
  buttonClassName?: string;
  showNotice?: boolean;
  ariaLabel?: string;
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
      <button type="button" className={buttonClassName} onClick={play} aria-label={ariaLabel}>
        {label ?? <><Volume2 size={20} />{feminine ? "ฟังรูปหญิง" : "ฟังเสียง"}</>}
      </button>
      {showNotice && !targets.every((i) =>
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
          {activity.type === "pronoun_choice"
            ? <GermanListenText text={optionValue(activity.prompt, items)} />
            : <LearningValue option={activity.prompt} items={items} />}
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
  const { play, error: audioError } = useVocabularyAudio();
  const hasSpeech = activity.type === "conjugation" || !!activity.speakRight;
  const pairs = activityPairs(activity, items);
  function readPair(pair: (typeof pairs)[number]) {
    play(activity.speakRight
      ? optionValue(pair.right, items)
      : `${optionValue(pair.left, items).split("/")[0].trim()} ${optionValue(pair.right, items)}`);
  }
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
    if (hasSpeech) readPair(left);
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
      onClick={() => {
        if (hasSpeech && (!selection || selection.side === side) && (activity.type === "conjugation" || side === "right"))
          play(optionValue(pair[side], items));
        void choose(side, pair.id);
      }}
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
            if (!busy && !wrong.length) {
              if (hasSpeech) readPair(left);
              void onMatch(left.id);
            }
          } else {
            setWrong([`left:${left.id}`, `right:${right.id}`]);
            timer.current = setTimeout(() => setWrong([]), 700);
          }
        }
      }}
    >
      {side === "left" && pair.leftVisual?.kind === "l14-route"
        ? <RouteDiagram route={pair.leftVisual.route} />
        : <LearningValue option={pair[side]} items={items} />}
      {hasSpeech && (activity.type === "conjugation" || side === "right") && <Volume2 size={16} aria-hidden="true" />}
    </button>
  );
  if (pairs.length > 0 && pairs.every((pair) => pair.leftVisual?.kind === "l14-route")) {
    return <>
      <div className="matching-options-sticky guided-route-options" aria-label="เลือกคำบอกทาง">
        {remainingRight.map((pair) => token(pair, "right"))}
      </div>
      <div className="guided-route-picture-grid" aria-label="จับคู่รูปกับคำบอกทาง">
        {pairs.map((pair) => {
          const matched = matchedIds.includes(pair.id);
          return <article key={pair.id} className={`guided-route-picture-card${matched ? " matched" : ""}`}>
            {matched && pair.leftVisual
              ? <RouteDiagram route={pair.leftVisual.route} />
              : token(pair, "left")}
            {matched ? <>
              <button type="button" className="german-listen-text" onClick={() => readPair(pair)}>
                <LearningValue option={pair.right} items={items} /><Volume2 size={16} aria-hidden="true" />
              </button>
              <small>{items.find((item) => item.id === pair.contentIds[0])?.meaning}</small>
            </> : <button type="button" className="guided-route-slot" disabled={busy || !!wrong.length || selection?.side !== "right"} onClick={() => void choose("left", pair.id)}>
              {selection?.side === "right" ? "จับคู่คำนี้กับภาพ" : "เลือกคำศัพท์ด้านบนก่อน"}
            </button>}
          </article>;
        })}
      </div>
      <p role="status" className="guided-feedback wrong">{wrong.length ? "ลองใหม่" : ""}</p>
      {audioError && <p role="status">{audioError}</p>}
    </>;
  }
  return (
    <>
      <div className="guided-locked">
        {pairs
          .filter((p) => matchedIds.includes(p.id))
          .map((p) => (
            <div key={p.id} className="guided-locked-pair">
              {p.leftVisual?.kind === "l14-route" ? <RouteDiagram route={p.leftVisual.route} /> : <LearningValue option={p.left} items={items} />}
              <LearningValue option={p.right} items={items} />
              {hasSpeech && <button type="button" className="german-listen-text"
                aria-label={`ฟังเสียง ${optionValue(p.left, items)} ${optionValue(p.right, items)}`}
                onClick={() => readPair(p)}><Volume2 size={16} aria-hidden="true" /></button>}
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
      {audioError && <p role="status">{audioError}</p>}
    </>
  );
}
