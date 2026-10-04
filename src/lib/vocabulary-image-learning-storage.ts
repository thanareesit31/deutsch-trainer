const STORAGE_KEY = "deutsch-trainer-vocabulary-image-learning-v1-L01";

export function readLearnedImageVocabularyIds(): string[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeLearnedImageVocabularyIds(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Keep the current activity usable when browser storage is unavailable.
  }
}
