export interface AlphabetLearningState {
  version: 1;
  learnedItemIds: string[];
  resumeIndex: number;
  revisitIndex: number | null;
}

export function emptyAlphabetLearningState(): AlphabetLearningState {
  return { version: 1, learnedItemIds: [], resumeIndex: 0, revisitIndex: null };
}

export function readAlphabetLearningState(
  raw: string | null,
): AlphabetLearningState {
  try {
    const parsed = JSON.parse(
      raw ?? "null",
    ) as Partial<AlphabetLearningState> | null;
    if (
      !parsed ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.learnedItemIds) ||
      !parsed.learnedItemIds.every((id) => typeof id === "string") ||
      !Number.isInteger(parsed.resumeIndex) ||
      (parsed.resumeIndex ?? -1) < 0
    )
      return emptyAlphabetLearningState();
    return {
      version: 1,
      learnedItemIds: [...new Set(parsed.learnedItemIds)],
      resumeIndex: Math.min(parsed.resumeIndex!, 30),
      revisitIndex:
        Number.isInteger(parsed.revisitIndex) &&
        parsed.revisitIndex! >= 0 &&
        parsed.revisitIndex! < 30
          ? parsed.revisitIndex!
          : null,
    };
  } catch {
    return emptyAlphabetLearningState();
  }
}
