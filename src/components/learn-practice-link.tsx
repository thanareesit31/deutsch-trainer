"use client";

import Link from "next/link";
import { isA11GrammarPracticeAvailable, isA11PhrasePracticeAvailable, isA11VocabularyPracticeAvailable, useStore } from "./store";

type PracticeSkill = "vocabulary" | "grammar" | "phrases";

export function LearnPracticeLink({ lessonId, skill, className = "button primary" }: {
  lessonId: string;
  skill: PracticeSkill;
  className?: string;
}) {
  const { user } = useStore();
  const available = skill === "vocabulary" ? isA11VocabularyPracticeAvailable(user)
    : skill === "grammar" ? isA11GrammarPracticeAvailable(user)
      : isA11PhrasePracticeAvailable(user);
  if (!/^L(?:0[1-9]|1[0-2])$/.test(lessonId) || !available) return null;
  return <Link className={className} href={`/practice/${lessonId}/${skill}/basic`}>ทำแบบฝึกหัด</Link>;
}
