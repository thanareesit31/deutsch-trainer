import {
  createEmptyVocabularyState,
  type VocabularyLearningState,
} from "@/lib/vocabulary-learning";

export const vocabularyLearningStorageKey = (lessonId: string) =>
  `deutsch-trainer-vocabulary-learning-v1-${lessonId}`;

export function readVocabularyLearningState(
  lessonId: string,
): VocabularyLearningState {
  const key = vocabularyLearningStorageKey(lessonId);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return createEmptyVocabularyState(lessonId);
    const parsed = JSON.parse(raw) as VocabularyLearningState;
    if (
      parsed.version !== 1 ||
      parsed.lessonId !== lessonId ||
      !parsed.items ||
      !parsed.performance ||
      !Array.isArray(parsed.completedSetIds)
    ) {
      return createEmptyVocabularyState(lessonId);
    }
    return parsed;
  } catch {
    return createEmptyVocabularyState(lessonId);
  }
}

export function writeVocabularyLearningState(state: VocabularyLearningState): void {
  try {
    window.localStorage.setItem(
      vocabularyLearningStorageKey(state.lessonId),
      JSON.stringify(state),
    );
  } catch {
    // Keep the active learning session usable when browser storage is unavailable.
  }
}

export function resetVocabularyLearningState(lessonId: string): void {
  window.localStorage.removeItem(vocabularyLearningStorageKey(lessonId));
}
