"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import alphabetData from "@/data/alphabet.json";
import { readAlphabetLearningState } from "@/lib/alphabet-learning-storage";
import { readLearnedImageVocabularyIds } from "@/lib/vocabulary-image-learning-storage";
import { vocabularyImageEntries } from "@/lib/vocabulary-image-content";

import { useLessonState, lessonStateKeys } from "./lesson-state-provider";

const alphabetItemIds = alphabetData.items.map((item) => item.id);

export function VocabularyLearningEntryPoints({ lessonId }: { lessonId: string }) {
  const lessonState = useLessonState();
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
