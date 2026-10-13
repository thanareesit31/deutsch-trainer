"use client";

import Link from "next/link";
import { CategoryTabLabel, LearningCategoryTabs } from "./learning-breadcrumbs";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  activityPairs,
  completeActivity,
  optionValue,
  readGuidedState,
  validateFlow,
  vocabularyTrackActivities,
  type LearningFlow,
  type VocabularyTrack,
} from "@/lib/guided-learning";
import { useContent } from "./content-provider";
import { useLearning } from "./learning-store";
import { useLessonState } from "./lesson-state-provider";
import { AudioChoice, NumberChoice, PairMatching, RouteDiagram } from "./guided-activities";
import { NumberMatching } from "./number-matching";
import { NumberObservations } from "./number-observations";
import { NumberSummaryBoard } from "./number-summary-board";
import { TeenNumberExample } from "./teen-number-example";
import { prepareL02VocabularyFlow } from "@/lib/l02-number-learning";
import { Empty } from "./ui";
import { ArticleLegend, ProfessionMatching } from "./profession-matching";
import { recordProfessionAnswer } from "@/lib/profession-learning";
import { grammarTrackActivities, type GrammarTrack } from "@/lib/grammar-learning";
import { GermanListenText } from "./german-listen-text";
import { ConjugationMatching, ConjugationSummary } from "./conjugation-matching";
import { PronounMatching, PronounSummary } from "./pronoun-matching";
import { prepareL02GrammarFlow, pronounGroups } from "@/lib/pronoun-learning";
import { buildL13GrammarFlow, buildL14GrammarFlow, buildL14VocabularyFlow, buildL15GrammarFlow } from "@/lib/a13-grammar-learning";
import { isTestWorkspaceUser, useStore } from "./store";
import type { Item } from "@/lib/content";
import type { LearningActivity } from "@/lib/guided-learning";

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

function PatternSummary({ title, activities, items }: {
  title: string;
  activities: LearningActivity[];
  items: Item[];
}) {
  const hasRoutePictures = activities.some((activity) => activityPairs(activity, items).some((pair) => pair.leftVisual?.kind === "l14-route"));
  return <div className="guided-pattern-summary">
    <h2>{title}</h2>
    <p>ทบทวนคู่คำและรูปที่เรียนแล้ว กดคำเยอรมันเพื่อฟังเสียงได้</p>
    <div className="guided-pattern-summary-scroll">
      <table className={hasRoutePictures ? "guided-route-summary" : undefined}>
        <thead><tr>{hasRoutePictures && <th scope="col">รูปภาพ</th>}<th scope="col">{hasRoutePictures ? "ความหมาย" : "จุดสังเกต"}</th><th scope="col">{hasRoutePictures ? "คำบอกทาง" : "รูปที่ใช้"}</th></tr></thead>
        <tbody>{activities.flatMap((activity) => activityPairs(activity, items).map((pair) => {
          const left = optionValue(pair.left, items);
          const right = optionValue(pair.right, items);
          return <tr key={pair.id}>
            {hasRoutePictures && <td>{pair.leftVisual?.kind === "l14-route" && <RouteDiagram route={pair.leftVisual.route} />}</td>}
            <td lang={/[\u0e00-\u0e7f]/u.test(left) ? "th" : "de"}>{left}</td>
            <td><GermanListenText text={right} /></td>
          </tr>;
        }))}</tbody>
      </table>
    </div>
  </div>;
}

export function GuidedLearningPage({
  lessonId,
  skill,
  track,
  grammarTrack,
}: {
  lessonId: string;
  skill: "vocabulary" | "grammar";
  track?: VocabularyTrack;
  grammarTrack?: GrammarTrack;
}) {
  const { lessons, items } = useContent();
  const catalogFlow = lessons.find((l) => l.id === lessonId)?.learningFlows?.[skill];
  const flow = useMemo(() => {
    if (lessonId === "L13" && skill === "grammar") return buildL13GrammarFlow(items);
    if (lessonId === "L14" && skill === "vocabulary") return buildL14VocabularyFlow();
    if (lessonId === "L14" && skill === "grammar") return buildL14GrammarFlow();
    if (lessonId === "L15" && skill === "grammar") return buildL15GrammarFlow();
    if (catalogFlow && lessonId === "L02") return skill === "vocabulary"
      ? prepareL02VocabularyFlow(catalogFlow, items)
      : prepareL02GrammarFlow(catalogFlow, items);
    return catalogFlow;
  }, [catalogFlow, lessonId, skill, items]);
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
      key={`${lessonId}-${skill}-${track ?? grammarTrack ?? "all"}`}
      flow={flow}
      lessonId={lessonId}
      skill={skill}
      track={track}
      grammarTrack={grammarTrack}
    />
  );
}

function GuidedFlow({
  flow,
  lessonId,
  skill,
  track,
  grammarTrack,
}: {
  flow: LearningFlow;
  lessonId: string;
  skill: "vocabulary" | "grammar";
  track?: VocabularyTrack;
  grammarTrack?: GrammarTrack;
}) {
  const { user } = useStore();
  const allowIncompleteNavigation = isTestWorkspaceUser(user);
  const { items } = useContent(),
    history = useLearning(),
    storage = useLessonState();
  const stateKey = flow.stateKey;
  const [state, setState] = useState(() =>
    readGuidedState(storage.read(stateKey), flow, items),
  );
  const activities = grammarTrack ? grammarTrackActivities(flow, items, grammarTrack) : track ? vocabularyTrackActivities(flow, items, track) : flow.activities;
  const hasPatternSummary = (lessonId === "L14" && skill === "vocabulary") ||
    ["es-gibt", "dativ", "lokale-praepositionen", "possessivartikel"].includes(grammarTrack ?? "");
  const hasEndContent = track === "numbers" || grammarTrack === "verbs" || grammarTrack === "pronouns" || hasPatternSummary;
  const [position, setPosition] = useState(() => {
    const first = activities.findIndex((a) => !state.learnedActivityIds.includes(a.id));
    return first < 0 ? hasEndContent ? activities.length + (track === "numbers" && state.numberEndPage === "board" ? 1 : 0) : Math.max(0, activities.length - 1) : first;
  });
  const previousPosition = useRef(position);
  useLayoutEffect(() => {
    if (previousPosition.current === position) return;
    previousPosition.current = position;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [position]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const lock = useRef(false);
  const activity = activities[position];
  const showNumberBoard = track === "numbers" && position > activities.length;
  const summaryIds = new Set(activities.flatMap((a) => a.contentIds));
  const summaryItems = items.filter((item) => item.numberContent && summaryIds.has(item.id));
  const title = track === "numbers" ? "Zahlen" : track === "core" ? "WORTSCHATZ" : track === "familienstand" ? "Familienstand"
    : grammarTrack === "es-gibt" ? "Es gibt + Akkusativ"
    : grammarTrack === "dativ" ? "Personalpronomen im Dativ"
    : flow.title;
  const sectionTitle = activity?.section.split(" · ")[0] ?? (track === "numbers" ? showNumberBoard ? "Zahlen" : "Beobachtungen" : "Übersicht");
  const sectionDescription = activity
    ? sectionDescriptions[activity.section] ?? (activity.section.startsWith("Zahlen · ") ? activity.section.replace("Zahlen · ", "ตัวเลข · ") : "")
    : track === "numbers" ? showNumberBoard ? "0–100" : "จุดสังเกต" : title;
  const progressItemIds = [...new Set(activities.flatMap((entry) => {
    const pairs = activityPairs(entry, items);
    return pairs.length ? pairs.flatMap((pair) => pair.contentIds) : entry.contentIds;
  }))];
  const progressTotal = progressItemIds.length;
  const progressLearned = progressItemIds.filter((id) => state.learnedContentIds.includes(id)).length;
  const progressUnit = track === "numbers" ? "จำนวน" : track === "familienstand" || grammarTrack === "sentences" ? "ประโยค" : grammarTrack === "verbs" ? "คำกริยา" : hasPatternSummary && skill === "grammar" ? "รูป" : "คำ";
  const categories: { key: string; label: string; thai: string; positions: number[] }[] = [];
  if (skill === "vocabulary" || grammarTrack) {
    activities.forEach((entry, index) => {
      const pronoun = grammarTrack === "pronouns" ? items.find((item) => item.id === entry.contentIds[0])?.pronounContent?.pronoun : undefined;
      const key = track === "numbers" || grammarTrack === "pronouns" ? entry.id : entry.section.split(" · ")[0];
      const existing = categories.find((category) => category.key === key);
      if (existing) existing.positions.push(index);
      else categories.push({ key, label: track === "numbers" ? entry.section.replace("Zahlen · ", "")
        : entry.type === "pronoun_matching" ? entry.section.split(" · ")[1] : pronoun ?? key, thai: entry.type === "pronoun_matching" ? (pronounGroups.find(group => entry.section.endsWith(group.label))?.thai ?? "") : track === "numbers" ? "ตัวเลข" : grammarTrack ? (items.find((item) => item.id === (entry.verbId ?? entry.contentIds[0]))?.meaning ?? "") : ({ Berufe: "อาชีพ", Arbeitsstatus: "สถานะการทำงาน", Traumberuf: "อาชีพในฝัน" }[key] ?? ""), positions: [index] });
    });
    if (track === "numbers") categories.push(
      { key: "observations", label: "Beobachtungen", thai: "จุดสังเกต", positions: [activities.length] },
      { key: "summary", label: "Übersicht", thai: "ตารางสรุป", positions: [activities.length + 1] },
    );
    if (grammarTrack === "verbs" || grammarTrack === "pronouns" || hasPatternSummary) categories.push({ key: "summary", label: "Übersicht", thai: "ตารางสรุป", positions: [activities.length] });
  }
  const completed =
    !!activity && state.learnedActivityIds.includes(activity.id);
  const canAdvance = completed || allowIncompleteNavigation;
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
      if (activity.type === "profession_matching" && pairId) next = recordProfessionAnswer(next, pairId, true);
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
  const isProfession = activity?.type === "profession_matching";
  const professionActivities = activities.filter((a) => a.type === "profession_matching");
  const study = (activity?.studyIds ?? [])
    .map((id) => items.find((i) => i.id === id))
    .filter((i) => !!i);
  const verb = activity?.verbId
    ? items.find((i) => i.id === activity.verbId)?.verbContent
    : null;
  const continuation = lessonId === "L14" && skill === "vocabulary"
    ? { href: "/learn/L14/grammar", label: "เรียนไวยากรณ์ต่อ" }
    : grammarTrack === "es-gibt"
      ? { href: "/learn/L13/grammar/dativ", label: "เรียน Dativ ต่อ" }
      : grammarTrack === "dativ"
        ? { href: "/learn/L13/grammar/verbs", label: "เรียนกริยาต่อ" }
        : hasPatternSummary && skill === "grammar"
          ? { href: `/learn/${lessonId}/grammar`, label: "กลับหัวข้อไวยากรณ์" }
    : skill === "vocabulary"
      ? { href: `/learn/${lessonId}/phrases`, label: "เรียนประโยคและสำนวนต่อ" }
    : grammarTrack === "pronouns"
      ? { href: `/learn/${lessonId}/grammar/verbs`, label: "เรียนการผันกริยาต่อ" }
      : grammarTrack === "sentences"
        ? { href: `/learn/${lessonId}/phrases`, label: "กลับประโยคและสำนวน" }
      : { href: `/lesson/${lessonId}`, label: "กลับบทเรียน" };
  return (
    <main className={`guided-learning${isProfession ? " profession-learning" : ""}`}>
      {skill === "vocabulary" && (activity || track === "numbers") && <h1 className="sr-only">{isProfession ? "Berufe" : sectionTitle}</h1>}
      {skill === "vocabulary" || grammarTrack ? (
        <LearningCategoryTabs currentKey={position} ariaLabel={skill === "grammar" ? "หมวดไวยากรณ์" : "หมวดคำศัพท์"}>
          {categories.map((category) => {
            const first = category.positions[0];
            const active = category.positions.includes(position);
            const previouslyLearned = category.positions.every((index) => index < activities.length && state.learnedActivityIds.includes(activities[index].id));
            const available = allowIncompleteNavigation || previouslyLearned || activities.slice(0, Math.min(first, activities.length))
              .every((entry) => state.learnedActivityIds.includes(entry.id))
              && (first <= activities.length || position >= activities.length || !!state.numberEndPage);
            return <button key={category.key} type="button" disabled={!available || busy}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                const unfinished = category.positions.find((index) => index < activities.length && !state.learnedActivityIds.includes(activities[index].id));
                const target = unfinished !== undefined && activities.slice(0, unfinished).every((entry) => state.learnedActivityIds.includes(entry.id)) ? unfinished : first;
                setPosition(target);
                if (target >= activities.length && track === "numbers")
                  persist({ ...state, numberEndPage: target > activities.length ? "board" : "observations" });
              }}>
              <CategoryTabLabel german={category.label} thai={category.thai} />
            </button>;
          })}
        </LearningCategoryTabs>
      ) : <header className="vocabulary-image-heading">
        <h1 lang={activity ? "de" : "th"}>{sectionTitle}</h1>
        <p>{sectionDescription}</p>
      </header>}
      {isProfession && <ArticleLegend />}
      <div className="vocabulary-image-progress" aria-live="polite">
        <span>เรียนแล้ว {progressLearned} / {progressTotal} {progressUnit}</span>
        <div className="vocabulary-image-progress-track" aria-hidden="true">
          <span style={{ width: `${progressTotal ? progressLearned / progressTotal * 100 : 0}%` }} />
        </div>
      </div>
      {activity ? (
        <section className={`guided-card${isProfession ? " profession-learning-card" : ""}${activity.type === "number_matching" ? " number-learning-card" : ""}${["L02-number-matching-13-19", "L02-number-matching-20-90", "L02-number-matching-21-100"].includes(activity.id) ? " teen-number-learning-card" : ""}${activity.id === "L02-number-matching-21-100" ? " compound-number-learning-card" : ""}`} key={activity.id}>
          {!isProfession && activity.type !== "pronoun_matching" && activity.sourceScope !== "core_book" && (
            <span className="quiet-pill">
              {activity.sourceScope === "teacher_extension"
                ? "เนื้อหาเสริมจากอาจารย์"
                : "ฝึกเสริมจากชีท"}
            </span>
          )}
          {verb && (
            <div className="guided-verb-intro">
              <h2 lang="de" aria-label={verb.infinitive}><GermanListenText text={verb.infinitive} /></h2>
              <p>{items.find((i) => i.id === activity.verbId)?.meaning}</p>
              {verb.examples.map((e) => (
                <div key={e.de}>
                  <strong lang="de"><GermanListenText text={e.de} /></strong>
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
          {!isProfession && activity.type !== "pronoun_matching" && <p className="guided-instruction">{activity.instruction}</p>}
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
                    <span>{i.meaning}</span>
                    <AudioChoice ids={[i.id]} items={items} />
                    {i.professionContent?.feminine && (
                      <AudioChoice ids={[i.id]} items={items} feminine />
                    )}
                  </article>
                ))}
              </div>
            </details>
          )}
          {isProfession ? <ProfessionMatching activity={activity} items={items} matchedIds={matchedIds} busy={busy} wrongCounts={state.professionAnswers ?? {}} onMatch={saveCorrect} onWrong={(id) => persist(recordProfessionAnswer(state, id, false))} showFormNote={activity.id === professionActivities[0]?.id} /> : activity.type === "number_matching" ? (
            <NumberMatching activity={activity} items={items} matchedIds={matchedIds} busy={busy} onMatch={saveCorrect} />
          ) : activity.type === "pronoun_matching" ? (
            <PronounMatching activity={activity} items={items} matchedIds={matchedIds} busy={busy} onMatch={saveCorrect} />
          ) : activity.type === "conjugation" && activity.verbId ? (
            <ConjugationMatching activity={activity} items={items} matchedIds={matchedIds} busy={busy} onMatch={saveCorrect} />
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
            {canAdvance && position === activities.length - 1 && !hasEndContent ? (
              <Link className="button primary" href={continuation.href}>{continuation.label}</Link>
            ) : <button
              type="button"
              className="button primary"
              disabled={!canAdvance || busy}
              onClick={() => setPosition((p) => p + 1)}
            >
              {isProfession || grammarTrack ? "หน้าถัดไป" : "ไปต่อ"}
            </button>}
          </div>
        </section>
      ) : (
        <section className="guided-card">
          {grammarTrack === "pronouns" ? <PronounSummary items={items} /> : grammarTrack === "verbs" ? <ConjugationSummary activities={activities} items={items} /> : hasPatternSummary ? <PatternSummary title={title} activities={activities} items={items} /> : track === "numbers" ? showNumberBoard ? <NumberSummaryBoard items={summaryItems} /> : <NumberObservations items={items} /> : null}
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
            ) : hasPatternSummary ? (
              <Link className="button primary" href={continuation.href}>{continuation.label}</Link>
            ) : skill === "vocabulary" ? (
              <Link
                className="button primary"
                href={`/learn/${lessonId}/phrases`}
              >
                เรียนประโยคและสำนวนต่อ
              </Link>
            ) : grammarTrack && grammarTrack !== "sentences" ? (
              <Link className="button primary" href={grammarTrack === "pronouns" ? `/learn/${lessonId}/grammar/verbs` : `/learn/${lessonId}/phrases/sentences`}>
                {grammarTrack === "pronouns" ? "เรียนการผันกริยาต่อ" : "เรียนคำถามและประโยคต่อ"}
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
