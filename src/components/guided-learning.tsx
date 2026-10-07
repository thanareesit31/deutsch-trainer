"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  activityPairs,
  completeActivity,
  readGuidedState,
  validateFlow,
  vocabularyTrackActivities,
  type LearningFlow,
  type VocabularyTrack,
} from "@/lib/guided-learning";
import { useContent } from "./content-provider";
import { useLearning } from "./learning-store";
import { useLessonState } from "./lesson-state-provider";
import { AudioChoice, NumberChoice, PairMatching } from "./guided-activities";
import { NumberMatching } from "./number-matching";
import { NumberObservations } from "./number-observations";
import { NumberSummaryBoard } from "./number-summary-board";
import { TeenNumberExample } from "./teen-number-example";
import { prepareL02VocabularyFlow } from "@/lib/l02-number-learning";
import { Empty } from "./ui";

const sectionDescriptions: Record<string, string> = {
  "Zahlen · Einer + und + Zehner": "ตัวเลข · หลักหน่วย + und + หลักสิบ",
  "Zahlen · zusammengesetzte Zahlen": "ตัวเลข · ฟังจำนวนที่ประกอบจากหลักหน่วยและหลักสิบ",
  Handynummer: "หมายเลขโทรศัพท์มือถือ",
  "Berufe · Wort und Bild": "อาชีพ · จับคู่คำกับภาพ",
  "Berufe · Bild und Wort": "อาชีพ · เลือกคำจากภาพ",
  "Berufe · männlich / weiblich": "อาชีพ · รูปชายและรูปหญิง",
  "Arbeitsstatus · เพิ่มเติม": "สถานะการทำงาน · เนื้อหาเพิ่มเติม",
  "Berufe · เพิ่มเติมจากอาจารย์": "อาชีพ · เนื้อหาเพิ่มเติมจากอาจารย์",
  Traumberuf: "อาชีพในฝัน",
  Personalpronomen: "สรรพนามบุรุษ",
  arbeiten: "ทำงาน",
  machen: "ทำ",
  "sein · ใช้สิ่งที่เรียนใน L1": "เป็น / คือ / อยู่ · ใช้สิ่งที่เรียนในบท 1",
  "Was?": "คำถามว่าอะไร",
  "Was bist du von Beruf?": "คุณทำอาชีพอะไร",
  "Beruf · Ich bin ...": "บอกอาชีพของตัวเอง",
  "Arbeitsstatus · Anwendung": "ใช้คำบอกสถานะการทำงาน",
  "Beruf oder Arbeitsstatus?": "อาชีพหรือสถานะการทำงาน",
  "Beruf und Traumberuf": "อาชีพและอาชีพในฝัน",
};

export function GuidedLearningPage({
  lessonId,
  skill,
  track,
}: {
  lessonId: string;
  skill: "vocabulary" | "grammar";
  track?: VocabularyTrack;
}) {
  const { lessons, items } = useContent();
  const catalogFlow = lessons.find((l) => l.id === lessonId)?.learningFlows?.[skill];
  const flow = useMemo(() => catalogFlow && lessonId === "L02" && skill === "vocabulary" ? prepareL02VocabularyFlow(catalogFlow, items) : catalogFlow, [catalogFlow, lessonId, skill, items]);
  const errors = useMemo(
    () => (flow ? validateFlow(flow, items) : []),
    [flow, items],
  );
  if (!flow || errors.length)
    return (
      <Empty
        title="ยังเปิดบทเรียนชุดนี้ไม่ได้"
        text="โหลดเนื้อหาไม่สำเร็จ กรุณาลองเปิดบทเรียนอีกครั้ง"
      >
        <Link className="button secondary" href={`/lesson/${lessonId}`}>
          กลับบทเรียน
        </Link>
      </Empty>
    );
  return (
    <GuidedFlow
      key={`${lessonId}-${skill}-${track ?? "all"}`}
      flow={flow}
      lessonId={lessonId}
      skill={skill}
      track={track}
    />
  );
}

function GuidedFlow({
  flow,
  lessonId,
  skill,
  track,
}: {
  flow: LearningFlow;
  lessonId: string;
  skill: "vocabulary" | "grammar";
  track?: VocabularyTrack;
}) {
  const { items } = useContent(),
    history = useLearning(),
    storage = useLessonState();
  const stateKey = flow.stateKey;
  const [state, setState] = useState(() =>
    readGuidedState(storage.read(stateKey), flow, items),
  );
  const activities = track ? vocabularyTrackActivities(flow, items, track) : flow.activities;
  const [position, setPosition] = useState(() => {
    const first = activities.findIndex((a) => !state.learnedActivityIds.includes(a.id));
    return first < 0 ? activities.length + (track === "numbers" && state.numberEndPage === "board" ? 1 : 0) : first;
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const lock = useRef(false);
  const activity = activities[position];
  const showNumberBoard = track === "numbers" && position > activities.length;
  const summaryIds = new Set(activities.flatMap((a) => a.contentIds));
  const summaryItems = items.filter((item) => item.numberContent && summaryIds.has(item.id));
  const title = track === "numbers" ? "Zahlen" : track === "core" ? "WORTSCHATZ" : flow.title;
  const eyebrowTitle = track === "numbers" || track === "core" ? "WORTSCHATZ" : title;
  const sectionTitle = activity?.section.split(" · ")[0] ?? (track === "numbers" ? showNumberBoard ? "Zahlen" : "Beobachtungen" : "เรียนครบแล้ว");
  const sectionDescription = activity
    ? sectionDescriptions[activity.section] ?? (activity.section.startsWith("Zahlen · ") ? activity.section.replace("Zahlen · ", "ตัวเลข · ") : "")
    : track === "numbers" ? showNumberBoard ? "0–100" : "จุดสังเกต" : title;
  const completedCount = activities.filter((a) => state.learnedActivityIds.includes(a.id)).length
    + (track === "numbers" && position >= activities.length ? 1 : 0)
    + (showNumberBoard ? 1 : 0);
  const activityCount = activities.length + (track === "numbers" ? 2 : 0);
  const completed =
    !!activity && state.learnedActivityIds.includes(activity.id);
  const pairs = activity ? activityPairs(activity, items) : [];
  const matchedIds = activity ? (state.matches[activity.id] ?? []) : [];
  function persist(next: typeof state) {
    storage.write(stateKey, JSON.stringify(next));
    setState(next);
  }
  async function saveCorrect(pairId?: string) {
    if (lock.current || !activity || completed) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const nextMatches = pairId ? [...new Set([...matchedIds, pairId])] : [];
      const done = !pairs.length || nextMatches.length === pairs.length;
      // A verb is exposed only after the whole conjugation board; profession pairs can expose their concept immediately.
      const pairContent =
        pairId && !activity.verbId
          ? (pairs.find((p) => p.id === pairId)?.contentIds ?? [])
          : [];
      const learnedIds = [
        ...new Set([...pairContent, ...(done ? activity.contentIds : [])]),
      ];
      for (const id of learnedIds) {
        if (!history.exposures.some((e) => e.item_id === id))
          await history.act("expose", { itemId: id });
      }
      let next = {
        ...state,
        learnedContentIds: [
          ...new Set([...state.learnedContentIds, ...learnedIds]),
        ],
        matches: pairId
          ? { ...state.matches, [activity.id]: nextMatches }
          : state.matches,
      };
      if (done) next = completeActivity(next, activity, flow.activities.indexOf(activity));
      persist(next);
    } catch {
      setError(
        "บันทึกผลไม่สำเร็จ กรุณาเลือกคำตอบที่ถูกอีกครั้งเพื่อลองบันทึกใหม่",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const study = (activity?.studyIds ?? [])
    .map((id) => items.find((i) => i.id === id))
    .filter((i) => !!i);
  const verb = activity?.verbId
    ? items.find((i) => i.id === activity.verbId)?.verbContent
    : null;
  return (
    <main className="guided-learning">
      <div className="vocabulary-image-navigation">
        <Link className="back-link" href={track ? `/learn/${lessonId}/vocabulary` : `/lesson/${lessonId}`}>
          {track ? "← กลับ Wortschatz" : "← กลับบทเรียน"}
        </Link>
      </div>
      <header className="vocabulary-image-heading">
        <span className="eyebrow">LEKTION {Number(lessonId.slice(1))} · {eyebrowTitle}</span>
        <h1 lang={activity || track === "numbers" ? "de" : "th"}>{sectionTitle}</h1>
        <p>{sectionDescription}</p>
      </header>
      <div className="vocabulary-image-progress" aria-live="polite">
        <span>เรียนแล้ว {completedCount} / {activityCount} กิจกรรม</span>
        <div className="vocabulary-image-progress-track" aria-hidden="true">
          <span style={{ width: `${activityCount ? completedCount / activityCount * 100 : 0}%` }} />
        </div>
      </div>
      {activity ? (
        <section className={`guided-card${activity.type === "number_matching" ? " number-learning-card" : ""}${["L02-number-matching-13-19", "L02-number-matching-20-90", "L02-number-matching-21-100"].includes(activity.id) ? " teen-number-learning-card" : ""}${activity.id === "L02-number-matching-21-100" ? " compound-number-learning-card" : ""}`} key={activity.id}>
          {activity.sourceScope !== "core_book" && (
            <span className="quiet-pill">
              {activity.sourceScope === "teacher_extension"
                ? "เนื้อหาเสริมจากอาจารย์"
                : "ฝึกเสริมจากชีท"}
            </span>
          )}
          {verb && (
            <div className="guided-verb-intro">
              <h2 lang="de">{verb.infinitive}</h2>
              <p>{items.find((i) => i.id === activity.verbId)?.meaning}</p>
              {verb.examples.map((e) => (
                <div key={e.de}>
                  <strong lang="de">{e.de}</strong>
                  <p>{e.th}</p>
                </div>
              ))}
              <p>
                ส่วนหลัก <strong lang="de">{verb.stem}</strong> ·
                ลองเชื่อมประธานกับรูปผัน
              </p>
            </div>
          )}
          {activity.id === "L02-number-matching-13-19" && <TeenNumberExample />}
          {activity.id === "L02-number-matching-20-90" && <TeenNumberExample tens />}
          {activity.id === "L02-number-matching-21-100" && <TeenNumberExample compound />}
          <p className="guided-instruction">{activity.instruction}</p>
          {activity.note && <p className="guided-note">{activity.note}</p>}
          {!!study.length && (
            <details className="guided-reference">
              <summary>ดูเนื้อหาประกอบ</summary>
              <div className="guided-study">
                {study.map((i) => (
                  <article key={i.id}>
                    {i.image && (
                      <img
                        className="guided-profession-image"
                        src={i.image}
                        alt="ภาพประกอบอาชีพ"
                        width={240}
                        height={180}
                      />
                    )}
                    <strong lang="de">
                      {i.numberContent
                        ? `${i.numberContent.value} · ${i.numberContent.written}`
                        : i.professionContent
                          ? `${i.professionContent.masculine}${i.professionContent.feminine ? ` / ${i.professionContent.feminine}` : ""}`
                          : i.title}
                    </strong>
                    <span>
                      {i.thaiPronunciation && `(${i.thaiPronunciation})`}{" "}
                      {i.meaning}
                    </span>
                    {i.professionContent?.feminineReading && (
                      <small>
                        รูปหญิง: ({i.professionContent.feminineReading})
                      </small>
                    )}
                    <AudioChoice ids={[i.id]} items={items} />
                    {i.professionContent?.feminine && (
                      <AudioChoice ids={[i.id]} items={items} feminine />
                    )}
                  </article>
                ))}
              </div>
            </details>
          )}
          {activity.type === "number_matching" ? (
            <NumberMatching activity={activity} items={items} matchedIds={matchedIds} busy={busy} onMatch={saveCorrect} />
          ) : pairs.length ? (
            <PairMatching
              activity={activity}
              items={items}
              matchedIds={matchedIds}
              busy={busy}
              onMatch={saveCorrect}
            />
          ) : (
            <NumberChoice
              activity={activity}
              items={items}
              completed={completed}
              busy={busy}
              onCorrect={() => saveCorrect()}
            />
          )}
          {activity.personalWriting && completed && (
            <div className="guided-personal-writing">
              <p>{activity.personalWriting.prompt}</p>
              {activity.personalWriting.placeholders.map((text, i) => (
                <label key={text}>
                  {text}
                  <input
                    type="text"
                    placeholder={text}
                    maxLength={200}
                    lang="de"
                    aria-label={text}
                  />
                </label>
              ))}
              <small>
                เขียนเพื่อทดลองใช้กับตัวเอง ไม่มีคะแนน และไม่บันทึกข้อมูลส่วนตัว
              </small>
            </div>
          )}
          {error && (
            <p role="alert" className="guided-feedback wrong">
              {error}
            </p>
          )}
          <div className="guided-navigation">
            <button
              type="button"
              className="button secondary"
              disabled={position === 0 || busy}
              onClick={() => setPosition((p) => p - 1)}
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              className="button primary"
              disabled={!completed || busy}
              onClick={() => setPosition((p) => p + 1)}
            >
              ไปต่อ
            </button>
          </div>
        </section>
      ) : (
        <section className="guided-card">
          {track === "numbers" ? showNumberBoard ? <NumberSummaryBoard items={summaryItems} /> : <NumberObservations items={items} /> : <>
            <h2>{title}</h2>
            <p>ย้อนกลับไปดูสิ่งที่เรียนได้ โดยสถานะการเรียนยังคงอยู่</p>
          </>}
          <div className="guided-navigation">
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                if (showNumberBoard) {
                  persist({ ...state, numberEndPage: "observations" });
                  setPosition(activities.length);
                } else setPosition(activities.length - 1);
              }}
            >
              ย้อนกลับ
            </button>
            {track === "numbers" && !showNumberBoard ? (
              <button type="button" className="button primary" onClick={() => {
                persist({ ...state, numberEndPage: "board" });
                setPosition(activities.length + 1);
              }}>ไปต่อ</button>
            ) : track === "numbers" ? (
              <Link className="button primary" href={`/learn/${lessonId}/vocabulary/core`}>
                เรียนคำศัพท์ต่อ
              </Link>
            ) : skill === "vocabulary" ? (
              <Link
                className="button primary"
                href={`/learn/${lessonId}/grammar`}
              >
                เรียน Grammatik ต่อ
              </Link>
            ) : (
              <Link className="button primary" href={`/lesson/${lessonId}`}>
                กลับบทเรียน
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
