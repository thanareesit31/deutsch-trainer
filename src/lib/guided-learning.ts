import type { Item } from "./content";

export type ContentField =
  | "title"
  | "meaning"
  | "word"
  | "answer"
  | "image"
  | "number"
  | "written"
  | "pattern"
  | "pronoun"
  | "masculine"
  | "feminine"
  | "example";
export interface ContentRef {
  itemId: string;
  field: ContentField;
}
export interface LearningOption {
  id: string;
  ref?: ContentRef;
  text?: string;
}
export interface LearningPair {
  id: string;
  left: LearningOption;
  right: LearningOption;
  contentIds: string[];
  legacyActivityIds?: string[];
  legacyMatches?: { activityId: string; pairId: string }[];
}
export interface LearningActivity {
  id: string;
  type:
    | "profession_matching"
    | "number_matching"
    | "number_to_word"
    | "word_to_number"
    | "audio_to_number"
    | "compound_pattern"
    | "multiple_choice"
    | "image_matching"
    | "image_to_word"
    | "pair_matching"
    | "pronoun_choice"
    | "pronoun_matching"
    | "conjugation"
    | "sentence_completion";
  section: string;
  instruction: string;
  note?: string;
  sourceScope: NonNullable<Item["sourceScope"]>;
  contentIds: string[];
  studyIds?: string[];
  prompt?: LearningOption;
  audioIds?: string[];
  options?: LearningOption[];
  correctOptionId?: string;
  pairs?: LearningPair[];
  legacyMatchActivityIds?: string[];
  verbId?: string;
  prerequisiteRefs?: string[];
  personalWriting?: { prompt: string; placeholders: [string, string] };
}
export interface LearningFlow {
  stateKey: string;
  title: string;
  activities: LearningActivity[];
}
export type VocabularyTrack = "numbers" | "core";

export function vocabularyTrackActivities(
  flow: LearningFlow,
  items: Item[],
  track: VocabularyTrack,
): LearningActivity[] {
  const hasProfessionBoards = flow.activities.some((a) => a.type === "profession_matching");
  const hasNumberBoards = flow.activities.some((activity) => activity.type === "number_matching");
  const activities = flow.activities.filter((activity) => {
    // Retire this page from navigation without deleting its historical evidence.
    if (activity.id === "L02-dream-meaning") return false;
    if (activity.id.startsWith("L02-berufe-") && !activity.id.startsWith("L02-berufe-v2-")) return false;
    if (activity.section.split(" · ")[0] === "Arbeitsstatus") return false;
    const isNumberActivity = activity.contentIds.some((id) => {
      const item = items.find((candidate) => candidate.id === id);
      return !!item?.numberContent || item?.group === "Handynummer";
    });
    // The revised number lesson has four boards and an observation page.
    // Keep older number activities in the full flow for restoring historical state.
    return track === "numbers"
      ? isNumberActivity && (!hasNumberBoards || activity.type === "number_matching")
      : !isNumberActivity && (!hasProfessionBoards || activity.type === "profession_matching" || !activity.contentIds.some((id) => items.find((i) => i.id === id)?.professionContent));
  });
  if (track === "core" && hasProfessionBoards) {
    const sections = ["Berufe", "Traumberuf", "Arbeitsstatus"];
    const rank = (activity: LearningActivity) => {
      const index = sections.indexOf(activity.section.split(" · ")[0]);
      return index < 0 ? sections.length : index;
    };
    // Sort the visible track only; historical flow IDs and stored evidence stay intact.
    activities.sort((left, right) => rank(left) - rank(right));
  }
  return activities;
}
export interface GuidedState {
  professionIntroSeen?: boolean;
  professionAnswers?: Record<string, { correct: number; wrong: number; hints: number }>;
  numberEndPage?: "observations" | "board";
  learnedActivityIds: string[];
  learnedContentIds: string[];
  matches: Record<string, string[]>;
  resumeIndex: number;
}
export const emptyGuidedState = (): GuidedState => ({
  learnedActivityIds: [],
  learnedContentIds: [],
  matches: {},
  resumeIndex: 0,
});

export function contentValue(ref: ContentRef, items: Item[]): string {
  const item = items.find((i) => i.id === ref.itemId);
  if (!item) throw new Error(`Missing learning content: ${ref.itemId}`);
  switch (ref.field) {
    case "number":
      return String(item.numberContent?.value ?? "");
    case "written":
      return item.numberContent?.written ?? "";
    case "pattern":
      return item.numberContent?.pattern ?? "";
    case "pronoun":
      return item.pronounContent?.pronoun ?? "";
    case "masculine":
      return item.professionContent?.masculine ?? "";
    case "feminine":
      return item.professionContent?.feminine ?? "";
    default:
      return item[ref.field] ?? "";
  }
}
export const optionValue = (option: LearningOption, items: Item[]) =>
  option.ref ? contentValue(option.ref, items) : (option.text ?? "");

export function activityPairs(
  activity: LearningActivity,
  items: Item[],
): LearningPair[] {
  if (!activity.verbId) return activity.pairs ?? [];
  const item = items.find((i) => i.id === activity.verbId);
  return (item?.verbContent?.conjugations ?? []).map((row, index) => ({
    id: `${activity.id}-${index}`,
    left: { id: `subject-${index}`, text: row.subject },
    right: { id: `form-${index}`, text: row.form },
    contentIds: [activity.verbId!],
  }));
}

// Validate references before allowing an activity to create learned evidence.
export function validateFlow(flow: LearningFlow, items: Item[]): string[] {
  const errors: string[] = [],
    ids = new Set<string>();
  if (!flow.stateKey) errors.push("Missing lesson state key");
  for (const a of flow.activities) {
    if (ids.has(a.id)) errors.push(`Duplicate activity ${a.id}`);
    ids.add(a.id);
    for (const id of [
      ...a.contentIds,
      ...(a.studyIds ?? []),
      ...(a.audioIds ?? []),
      ...(a.prerequisiteRefs ?? []),
      ...(a.verbId ? [a.verbId] : []),
    ])
      if (!items.some((i) => i.id === id)) errors.push(`Missing content ${id}`);
    const options = a.options ?? [];
    const pairs = activityPairs(a, items);
    for (const pair of pairs) {
      for (const id of pair.contentIds) {
        if (!items.some((item) => item.id === id))
          errors.push(`Missing pair content ${id}`);
      }
    }
    for (const o of [
      ...options,
      ...(a.prompt ? [a.prompt] : []),
      ...pairs.flatMap((p) => [p.left, p.right]),
    ]) {
      try {
        if (!optionValue(o, items)) errors.push(`Empty reference in ${a.id}`);
      } catch {
        errors.push(`Invalid reference in ${a.id}`);
      }
    }
    if (
      options.length &&
      (!options.some((o) => o.id === a.correctOptionId) ||
        new Set(options.map((o) => o.id)).size !== options.length)
    )
      errors.push(`Invalid options in ${a.id}`);
    if (!options.length && !pairs.length) errors.push(`Empty activity ${a.id}`);
  }
  return errors;
}

export function readGuidedState(
  raw: string | null,
  flow: LearningFlow,
  items: Item[],
): GuidedState {
  let saved: Partial<GuidedState> = {};
  try {
    saved = JSON.parse(raw ?? "{}");
  } catch {
    return emptyGuidedState();
  }
  if (!saved || typeof saved !== "object") return emptyGuidedState();
  const completed = new Set(
    Array.isArray(saved.learnedActivityIds) ? saved.learnedActivityIds : [],
  );
  const matches: Record<string, string[]> = {};
  const learnedActivityIds: string[] = [],
    learnedContentIds = new Set<string>();
  for (const a of flow.activities) {
    const pairs = activityPairs(a, items),
      validIds = new Set(pairs.map((p) => p.id));
    const rawMatches =
      saved.matches && typeof saved.matches === "object"
        ? saved.matches[a.id]
        : undefined;
    matches[a.id] = Array.isArray(rawMatches)
      ? [...new Set(rawMatches.filter((id) => validIds.has(id)))]
      : [];
    for (const legacyId of a.legacyMatchActivityIds ?? []) {
      const legacyMatches = saved.matches?.[legacyId];
      if (Array.isArray(legacyMatches))
        matches[a.id] = [...new Set([...matches[a.id], ...legacyMatches.filter((id) => validIds.has(id))])];
    }
    for (const pair of pairs) {
      if ((pair.legacyActivityIds?.some((id) => completed.has(id)) || pair.legacyMatches?.some(({ activityId, pairId }) => saved.matches?.[activityId]?.includes(pairId))) && !matches[a.id].includes(pair.id))
        matches[a.id].push(pair.id);
    }
    if (
      (completed.has(a.id) || (["number_matching", "profession_matching", "pronoun_matching"].includes(a.type) && pairs.length > 0 && matches[a.id].length === pairs.length)) &&
      (!pairs.length || matches[a.id].length === pairs.length)
    ) {
      learnedActivityIds.push(a.id);
      a.contentIds.forEach((id) => learnedContentIds.add(id));
    }
    pairs
      .filter((p) => !a.verbId && matches[a.id].includes(p.id))
      .forEach((p) => p.contentIds.forEach((id) => learnedContentIds.add(id)));
  }
  // First unfinished position is derived; a stale/corrupt cursor cannot skip content.
  const first = flow.activities.findIndex(
    (a) => !learnedActivityIds.includes(a.id),
  );
  return {
    learnedActivityIds,
    professionIntroSeen: saved.professionIntroSeen === true,
    professionAnswers: Object.fromEntries(Object.entries(saved.professionAnswers ?? {}).filter(([, value]) => value && [value.correct, value.wrong, value.hints].every((n) => Number.isInteger(n) && n >= 0))),
    ...(saved.numberEndPage === "observations" || saved.numberEndPage === "board" ? { numberEndPage: saved.numberEndPage } : {}),
    learnedContentIds: [...learnedContentIds],
    matches,
    resumeIndex: first < 0 ? flow.activities.length : first,
  };
}

export function completeActivity(
  state: GuidedState,
  activity: LearningActivity,
  index: number,
): GuidedState {
  return {
    ...state,
    learnedActivityIds: [
      ...new Set([...state.learnedActivityIds, activity.id]),
    ],
    learnedContentIds: [
      ...new Set([...state.learnedContentIds, ...activity.contentIds]),
    ],
    resumeIndex: Math.max(state.resumeIndex, index + 1),
  };
}
