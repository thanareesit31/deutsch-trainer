"use client";
import { useLearning } from './learning-store';
import { useLessonState, lessonStateKeys } from './lesson-state-provider';
import { readLearnedImageVocabularyIds } from '@/lib/vocabulary-image-learning-storage';

export function useL13VocabularyEligibility() {
  const history = useLearning();
  const lessons = useLessonState();
  return {
    ready: history.ready && !history.error,
    error: history.error,
    retry: history.reload,
    ids: [...new Set([
      ...readLearnedImageVocabularyIds(lessons.read(lessonStateKeys.l13Images)),
      ...history.exposures.filter(row => row.item_id.startsWith('L13-V')).map(row => row.item_id),
    ])],
  };
}
