"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import alphabetData from "@/data/alphabet.json";
import { readAlphabetLearningState } from "@/lib/alphabet-learning-storage";
import { readLearnedImageVocabularyIds } from "@/lib/vocabulary-image-learning-storage";
import { vocabularyImageEntries } from "@/lib/vocabulary-image-content";
import { readGuidedState, vocabularyTrackActivities } from "@/lib/guided-learning";
import { useContent } from "./content-provider";
import { prepareL02VocabularyFlow } from "@/lib/l02-number-learning";

import { useLessonState, lessonStateKeys } from "./lesson-state-provider";

const alphabetItemIds = alphabetData.items.map((item) => item.id);

export function VocabularyLearningEntryPoints({ lessonId }: { lessonId: string }) {
  const lessonState = useLessonState();
  const { lessons, items } = useContent();
  const catalogFlow = lessons.find((lesson) => lesson.id === lessonId)?.learningFlows?.vocabulary;
  const flow = catalogFlow && lessonId === "L02" ? prepareL02VocabularyFlow(catalogFlow, items) : catalogFlow;
  const guidedState = flow ? readGuidedState(lessonState.read(flow.stateKey), flow, items) : null;
  const [alphabetStatus, setAlphabetStatus] = useState<"learned" | "replaying" | null>(null);
  const [imageVocabularyLearned, setImageVocabularyLearned] = useState(false);

  useEffect(() => {
    if (lessonId !== "L01") return;

    const syncImageVocabularyStatus = () => {
      const learnedIds = new Set(readLearnedImageVocabularyIds(lessonState.read(lessonStateKeys.images)));
      setImageVocabularyLearned(
        vocabularyImageEntries.every((entry) => learnedIds.has(entry.id)),
      );
    };
    const syncAlphabetLearning = () => {
      const learningState = readAlphabetLearningState(lessonState.read(lessonStateKeys.alphabet));
      const learnedIds = new Set(learningState.learnedItemIds);
      const isLearned = alphabetItemIds.every((id) => learnedIds.has(id));
      setAlphabetStatus(
        isLearned ? learningState.revisitIndex !== null ? "replaying" : "learned" : null,
      );
    };

    syncImageVocabularyStatus();
    syncAlphabetLearning();
    window.addEventListener("storage", syncImageVocabularyStatus);
    window.addEventListener("storage", syncAlphabetLearning);
    return () => {
      window.removeEventListener("storage", syncImageVocabularyStatus);
      window.removeEventListener("storage", syncAlphabetLearning);
    };
  }, [lessonId, lessonState.read]);

  return (
    <main className="vocabulary-learning">
      <Link className="back-link" href={`/lesson/${lessonId}`}>
        ← กลับ Lektion {lessonId.slice(1)}
      </Link>

      {lessonId === "L02" && (
        <>
          {([
            { id: "numbers", symbol: "123", eyebrow: "HÖREN & ZUORDNEN", title: "Die Zahlen", description: "เรียนรู้การอ่านและจับคู่ตัวเลขภาษาเยอรมัน" },
            { id: "core", symbol: "Beruf", eyebrow: "BILDER", title: "WORTSCHATZ", description: "เรียนรู้คำศัพท์ประจำบท" },
          ] as const).map((track) => {
            const activities = flow ? vocabularyTrackActivities(flow, items, track.id) : [];
            const learned = activities.length > 0 && activities.every((activity) => guidedState?.learnedActivityIds.includes(activity.id));
            return (
              <Link key={track.id} className={`alphabet-entry-card${track.id === "core" ? " vocabulary-image-entry-card" : ""}`} href={`/learn/${lessonId}/vocabulary/${track.id}`}>
                <span className={track.id === "numbers" ? "alphabet-entry-symbols" : "vocabulary-image-entry-art"} aria-hidden="true">{track.symbol}</span>
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
        <>
          <Link className="alphabet-entry-card" href="/learn/L01/vocabulary/alphabet">
            <span className="alphabet-entry-symbols" aria-hidden="true">ABCD</span>
            <span className="alphabet-entry-copy">
              <span className="eyebrow">AUSSPRACHE</span>
              <span className="alphabet-entry-title">
                <strong>Das Alphabet</strong>
                {alphabetStatus && (
                  <span className="alphabet-entry-status">
                    {alphabetStatus === "replaying" ? "เรียนซ้ำ" : "เรียนแล้ว"}
                  </span>
                )}
              </span>
              <small>เรียนรู้ตัวอักษรและเสียงภาษาเยอรมัน</small>
            </span>
            <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
          </Link>

          <Link className="alphabet-entry-card vocabulary-image-entry-card" href="/learn/L01/vocabulary/core-images">
            <span className="vocabulary-image-entry-art" aria-hidden="true">Hallo!</span>
            <span className="alphabet-entry-copy">
              <span className="eyebrow">BILDER</span>
              <span className="alphabet-entry-title">
                <strong>WORTSCHATZ</strong>
                {imageVocabularyLearned && <span className="alphabet-entry-status">เรียนแล้ว</span>}
              </span>
              <small>เรียนรู้คำศัพท์ประจำบท</small>
            </span>
            <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
          </Link>
        </>
      )}
    </main>
  );
}
