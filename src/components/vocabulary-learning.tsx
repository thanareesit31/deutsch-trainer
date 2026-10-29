"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import alphabetData from "@/data/alphabet.json";
import { readAlphabetLearningState } from "@/lib/alphabet-learning-storage";
import { readLearnedImageVocabularyIds } from "@/lib/vocabulary-image-learning-storage";
import { vocabularyImageActivity, vocabularyImageGroups, l13VocabularyImageGroups, l13VocabularyImageEntries, vocabularyImageEntries, lessonVocabularyImageEntries, lessonVocabularyImageGroups, catalogVocabularyImageSource } from "@/lib/vocabulary-image-content";
import { readGuidedState, vocabularyTrackActivities } from "@/lib/guided-learning";
import { useContent } from "./content-provider";
import { prepareL02VocabularyFlow } from "@/lib/l02-number-learning";

import { useLessonState, lessonStateKeys } from "./lesson-state-provider";
import { isL14VocabularyPracticeAvailable, isL13GrammarPracticeAvailable, isTestWorkspaceUser, isVocabularyPracticeAvailable, useStore } from "./store";
import { CountryFlag } from "./vocabulary-image-matching";
import { l03FamilyPluralPairs } from "@/lib/vocabulary-image-content";
import { FamilyPluralLearning } from "./family-plural-learning";
import { buildL13GrammarFlow, buildL14VocabularyFlow } from "@/lib/a13-grammar-learning";
import { L12MonthCalendar } from "./l12-month-calendar";
import { useL13VocabularyEligibility } from "./use-l13-vocabulary-eligibility";
import { useLearning } from "./learning-store";

const alphabetItemIds = alphabetData.items.map((item) => item.id);

export function VocabularyLearningEntryPoints({ lessonId }: { lessonId: string }) {
  const { user } = useStore();
  const lessonState = useLessonState();
  const { lessons, items } = useContent();
  const l13Eligibility = useL13VocabularyEligibility();
  const history = useLearning();
  const catalogFlow = lessons.find((lesson) => lesson.id === lessonId)?.learningFlows?.vocabulary;
  const flow = catalogFlow && lessonId === "L02" ? prepareL02VocabularyFlow(catalogFlow, items) : catalogFlow;
  const catalogImageGroups = useMemo(
    () => lessonId === "L02"
      ? lessonVocabularyImageGroups(items, lessonId, ["Familienstand"])
      : /^L(?:0[3-9]|1[0-2]|1[4-5])$/u.test(lessonId) ? lessonVocabularyImageGroups(items, lessonId) : [],
    [items, lessonId],
  );
  const catalogImageDefinitions = useMemo(() => lessonVocabularyImageEntries(items, catalogImageGroups), [items, catalogImageGroups]);
  const imageGroups = lessonId === "L01" ? vocabularyImageGroups : lessonId === "L13" ? l13VocabularyImageGroups : catalogImageGroups;
  const imageDefinitions = lessonId === "L01" ? vocabularyImageEntries : lessonId === "L13" ? l13VocabularyImageEntries : catalogImageDefinitions;
  const guidedState = flow ? readGuidedState(lessonState.read(flow.stateKey), flow, items) : null;
  const [alphabetStatus, setAlphabetStatus] = useState<"learned" | null>(null);
  const [learnedImageVocabularyIds, setLearnedImageVocabularyIds] = useState<string[]>([]);
  const [learnedFamilyPluralIds, setLearnedFamilyPluralIds] = useState<string[]>([]);
  const l14DirectionIds = lessonId === "L14" ? readGuidedState(lessonState.read(lessonStateKeys.l14Vocabulary), buildL14VocabularyFlow(), items).learnedContentIds : [];
  const l14PracticeReady = lessonId === "L14" && (learnedImageVocabularyIds.length > 0 || l14DirectionIds.length > 0 || history.exposures.some(exposure => exposure.item_id.startsWith("L14-V")));

  useEffect(() => {
    const imageLesson = lessonId === "L01" || lessonId === "L02" || lessonId === "L13" || /^L(?:0[3-9]|1[0-2]|1[4-5])$/u.test(lessonId);
    if (!imageLesson) return;

    const syncImageVocabularyStatus = () => {
      const stateKey = lessonId === "L01" ? lessonStateKeys.images : lessonId === "L02" ? lessonStateKeys.l02Vocabulary : lessonId === "L13" ? lessonStateKeys.l13Images : lessonStateKeys.vocabularyImages(lessonId);
      const learnedIds = readLearnedImageVocabularyIds(lessonState.read(stateKey));
      setLearnedImageVocabularyIds(learnedIds);
    };
    const syncAlphabetLearning = () => {
      const learningState = readAlphabetLearningState(lessonState.read(lessonStateKeys.alphabet));
      const learnedIds = new Set(learningState.learnedItemIds);
      const isLearned = alphabetItemIds.every((id) => learnedIds.has(id));
      setAlphabetStatus(
        isLearned ? "learned" : null,
      );
    };

    syncImageVocabularyStatus();
    if (lessonId === "L03") setLearnedFamilyPluralIds(readLearnedImageVocabularyIds(lessonState.read(lessonStateKeys.l03FamilyPlural)));
    syncAlphabetLearning();
    window.addEventListener("storage", syncImageVocabularyStatus);
    if (lessonId === "L01") window.addEventListener("storage", syncAlphabetLearning);
    return () => {
      window.removeEventListener("storage", syncImageVocabularyStatus);
      if (lessonId === "L01") window.removeEventListener("storage", syncAlphabetLearning);
    };
  }, [lessonId, lessonState.read, catalogImageGroups]);

  return (
    <main className="vocabulary-learning">
      {lessonId === "L13" && isVocabularyPracticeAvailable(user) && l13Eligibility.ids.length > 0 && <Link className="button primary" href="/practice/L13/vocabulary/basic">ฝึกคำที่เรียนแล้ว</Link>}
      {lessonId === "L14" && isL14VocabularyPracticeAvailable(user) && l14PracticeReady && <Link className="button primary" href="/practice/L14/vocabulary/basic">ฝึกคำที่เรียนแล้ว</Link>}

      {lessonId === "L02" && (
        <>
          {([
            { id: "numbers", symbol: "123", eyebrow: "HÖREN & ZUORDNEN", title: "Die Zahlen", description: "เรียนรู้การอ่านและจับคู่ตัวเลขภาษาเยอรมัน" },
            { id: "core", symbol: "Beruf", eyebrow: vocabularyImageActivity.eyebrow.toLocaleUpperCase("de"), title: vocabularyImageActivity.title.toLocaleUpperCase("de"), description: "เรียนรู้คำศัพท์ประจำบท" },
          ] as const).map((track) => {
            const activities = flow ? vocabularyTrackActivities(flow, items, track.id) : [];
            const learned = activities.length > 0 && activities.every((activity) => guidedState?.learnedActivityIds.includes(activity.id));
            return (
              <Link key={track.id} className={`alphabet-entry-card${track.id === "core" ? " vocabulary-image-entry-card" : ""}`} href={`/learn/${lessonId}/vocabulary/${track.id}`}>
                <span className={track.id === "core" ? "vocabulary-image-entry-art" : "alphabet-entry-symbols"} aria-hidden="true">{track.symbol}</span>
                <span className="alphabet-entry-copy">
                  <span className="eyebrow">{track.eyebrow}</span>
                  <span className="alphabet-entry-title">
                    <strong>{track.title}</strong>
                    {learned && <span className="alphabet-entry-status">เรียนแล้ว</span>}
                  </span>
                  <small>{track.description}</small>
                </span>
                <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
              </Link>
            );
          })}
        </>
      )}

      {lessonId === "L01" && (
        <Link className="alphabet-entry-card" href="/learn/L01/vocabulary/alphabet">
          <span className="alphabet-entry-symbols" aria-hidden="true">ABCD</span>
          <span className="alphabet-entry-copy">
            <span className="eyebrow">AUSSPRACHE</span>
            <span className="alphabet-entry-title">
              <strong>Das Alphabet</strong>
              {alphabetStatus && (
                <span className="alphabet-entry-status">
                  เรียนแล้ว
                </span>
              )}
            </span>
            <small>เรียนรู้ตัวอักษรและเสียงภาษาเยอรมัน</small>
          </span>
          <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
        </Link>
      )}

      {(lessonId === "L01" || lessonId === "L02" || lessonId === "L13" || catalogImageGroups.length > 0) && imageGroups.map((group) => {
        const learnedCount = group.wordOrder.filter((id) => learnedImageVocabularyIds.includes(id)).length;
        const previewEntry = group.wordOrder.map((id) => imageDefinitions.find((entry) => entry.id === id)).find((entry) => entry?.image || entry?.flag);
        const previewSrc = lessonId === "L01" && previewEntry?.image
          ? `/images/lektion-1-core-vocabulary-images/${previewEntry.image}.jpg`
          : lessonId === "L13" && previewEntry?.image
            ? `/images/lektion-13-city/${previewEntry.image}-places.webp`
            : lessonId !== "L01" && lessonId !== "L13" && previewEntry?.image
              ? catalogVocabularyImageSource(lessonId, previewEntry.image)
              : undefined;
        return (
          <Link key={group.id} className="alphabet-entry-card vocabulary-image-entry-card" href={group.route}>
            <span className="vocabulary-image-entry-art" aria-hidden="true">
              {lessonId === "L12" && group.id === "l12-monate"
                ? <L12MonthCalendar itemId="V172" />
                : lessonId === "L01" && previewEntry?.flag
                ? <CountryFlag flag={previewEntry.flag} />
                : previewSrc && <Image src={previewSrc} alt="" width={960} height={640} sizes="88px" />}
            </span>
            <span className="alphabet-entry-copy">
              <span className="eyebrow">{vocabularyImageActivity.germanTitle.toLocaleUpperCase("de")}</span>
              <span className="alphabet-entry-title"><strong>{group.germanTitle}</strong>{learnedCount === group.wordOrder.length && <span className="alphabet-entry-status">เรียนแล้ว</span>}</span>
              <small>{group.title} · จับคู่คำศัพท์กับรูปภาพ · {learnedCount} / {group.wordOrder.length} คำ</small>
            </span>
            <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
          </Link>
        );
      })}

      {lessonId === "L03" && <Link className="alphabet-entry-card vocabulary-image-entry-card" href="/learn/L03/vocabulary/familie-plural">
        <span className="vocabulary-image-entry-art" aria-hidden="true">Plural</span>
        <span className="alphabet-entry-copy">
          <span className="eyebrow">WORTSCHATZ</span>
          <span className="alphabet-entry-title"><strong>Familienplural</strong>{learnedFamilyPluralIds.length === l03FamilyPluralPairs.length && <span className="alphabet-entry-status">เรียนแล้ว</span>}</span>
          <small>ครอบครัว · จับคู่เอกพจน์กับพหูพจน์ · {learnedFamilyPluralIds.length} / {l03FamilyPluralPairs.length} คู่</small>
        </span>
        <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
      </Link>}

      {lessonId === "L14" && (() => {
        const directionFlow = buildL14VocabularyFlow();
        const directionIds = new Set(directionFlow.activities.flatMap((activity) => activity.contentIds));
        const learnedCount = readGuidedState(lessonState.read(directionFlow.stateKey), directionFlow, items).learnedContentIds.filter((id) => directionIds.has(id)).length;
        return <Link className="alphabet-entry-card" href="/learn/L14/vocabulary/directions">
          <span className="alphabet-entry-symbols" aria-hidden="true">→</span>
          <span className="alphabet-entry-copy">
            <span className="eyebrow">WORTSCHATZ</span>
            <span className="alphabet-entry-title"><strong>Wege und Richtungen</strong>{learnedCount === 7 && <span className="alphabet-entry-status">เรียนแล้ว</span>}</span>
            <small>คำบอกทาง · จับคู่แผนผังกับคำเยอรมัน · {learnedCount} / 7 คำ</small>
          </span>
          <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
        </Link>;
      })()}

    </main>
  );
}

export function L03FamilyPluralPage() {
  const { items } = useContent();
  return <FamilyPluralLearning items={items.filter((item) => item.lessonId === "L03" && item.group === "Familie" && typeof item.plural === "string")} />;
}

export function A13GrammarEntryPoints({ lessonId }: { lessonId: "L13" | "L14" | "L15" }) {
  const { items } = useContent();
  const { user } = useStore();
  const pilotAvailable = isTestWorkspaceUser(user) || (lessonId === "L13" && isL13GrammarPracticeAvailable(user));
  const lessonState = useLessonState();
  const l13Flow = useMemo(() => lessonId === "L13" ? buildL13GrammarFlow(items) : null, [lessonId, items]);
  const l13State = l13Flow ? readGuidedState(lessonState.read(l13Flow.stateKey), l13Flow, items) : null;
  const l13TopicActivities = l13Flow ? [
    l13Flow.activities.filter((activity) => activity.id.startsWith("L13-es-gibt-")),
    l13Flow.activities.filter((activity) => activity.id.startsWith("L13-dativ-")),
    l13Flow.activities.filter((activity) => !!activity.verbId),
  ] : [];
  const learnedTopics = l13TopicActivities.filter((activities) =>
    activities.length > 0 && activities.every((activity) => l13State?.learnedActivityIds.includes(activity.id)),
  ).length;
  const cards = lessonId === "L13" ? [
    { group: "es gibt + Akkusativ", route: "es-gibt", title: "Es gibt + Akkusativ", description: "รูปคำนามหลัง es gibt", symbol: "A" },
    { group: "Personalpronomen im Dativ", route: "dativ", title: "Personalpronomen im Dativ", description: "สรรพนามรูป Dativ", symbol: "D" },
    { group: "Verben", route: "verbs", title: "Verben", description: "กริยาที่ใช้พูดถึงเมืองและสถานที่", symbol: "V" },
  ] : lessonId === "L14" ? [
    { group: "Lokale Präpositionen", route: "lokale-praepositionen", title: "ตำแหน่ง", description: "คำบุพบทบอกตำแหน่ง", symbol: "Wo?" },
    { group: "Wo? + Dativ", route: "wo-dativ", title: "Wo? + Dativ", description: "Dativ และรูปย่อ im / am", symbol: "D" },
  ] : [
    { group: "Possessivartikel", route: "possessivartikel", title: "Possessivartikel: ihr / sein", description: "คำแสดงความเป็นเจ้าของใน Nominativ และ Akkusativ", symbol: "ihr" },
  ];
  return <main className="vocabulary-learning">
    {cards.map((card, index) => {
      const count = lessonId === "L14" ? 2 : items.filter((item) => item.lessonId === lessonId && item.skill === "grammar" && item.group === card.group).length;
      const learned = l13TopicActivities[index]?.length > 0 && l13TopicActivities[index].every((activity) => l13State?.learnedActivityIds.includes(activity.id));
      return <Link key={card.group} className="alphabet-entry-card" href={`/learn/${lessonId}/grammar/${card.route}`}>
        <span className="alphabet-entry-symbols" aria-hidden="true">{card.symbol}</span>
        <span className="alphabet-entry-copy"><span className="eyebrow">GRAMMATIK</span><span className="alphabet-entry-title"><strong>{card.title}</strong></span><small>{card.description} · {lessonId === "L13" ? learned ? "เรียนแล้ว" : "ยังเรียนไม่ครบ" : `${count} คำ`}</small></span>
        <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
      </Link>;
    })}
    {lessonId === "L13" && learnedTopics === 3 && (
      <section className="grammar-practice-handoff">
        <span className="eyebrow">เรียนครบ 3/3 หัวข้อ</span>
        <h2>{pilotAvailable ? "อยากฝึกต่อไหม?" : "เรียนไวยากรณ์ครบแล้ว"}</h2>
        <p>{pilotAvailable ? "ฝึกต่อเนื่อง Es gibt, Dativ และ Verben ได้ทันที" : "แบบฝึกพื้นฐานกำลังเตรียมเนื้อหา"}</p>
        <div>
          {pilotAvailable && <Link className="button primary" href="/practice/L13/grammar/basic">ทำแบบฝึกหัด</Link>}
          <Link className="button secondary" href="/lesson/L13">กลับหน้าบทเรียน</Link>
        </div>
      </section>
    )}
  </main>;
}
