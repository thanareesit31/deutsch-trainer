export function readLearnedImageVocabularyIds(value: string | null): string[] {
  try {
    const parsed: unknown = value ? JSON.parse(value) : [];
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string");
    if (!parsed || typeof parsed !== "object") return [];
    const saved = Object.fromEntries(Object.entries(parsed));
    const ids: unknown = saved.imageVocabularyIds;
    return Array.isArray(ids) ? ids.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function writeLearnedImageVocabularyIds(value: string | null, ids: string[]): string {
  try {
    const parsed: unknown = value ? JSON.parse(value) : null;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      return JSON.stringify({ ...Object.fromEntries(Object.entries(parsed)), imageVocabularyIds: ids });
  } catch {
    // Replace malformed state with the current, validated list of learned items.
  }
  return JSON.stringify(ids);
}
