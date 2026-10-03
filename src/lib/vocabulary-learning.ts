import type { Item, VocabularyWordType } from "@/lib/content";

export const LEARNING_SET_SIZE = 4;
export const VOCABULARY_LEARNING_LESSON = "L01";

export type VocabularyActivityType =
  | "recognition"
  | "guided_recall"
  | "recall"
  | "context_encounter";
export type VocabularyLearningPhase = "introduce" | "activities" | "summary";
export type VocabularyEventType =
  | "introduced"
  | VocabularyActivityType
  | "learning_completed";

export interface VocabularyWord extends Item {
  type: VocabularyWordType;
  german: string;
  displayGerman: string;
  example?: string;
  chunk?: string;
  contextAnswer?: string;
}

export interface VocabularyLearningEvent {
  id: string;
  itemId: string;
  type: VocabularyEventType;
  timestamp: string;
  success?: boolean;
  response?: string;
  hintsUsed?: number;
  adaptiveRepeat?: boolean;
}

export interface VocabularyItemState {
  introduced: boolean;
  learningCompleted: boolean;
  events: VocabularyLearningEvent[];
}

export interface VocabularyActivity {
  id: string;
  itemId: string;
  type: VocabularyActivityType;
  adaptiveRepeat?: boolean;
}

export interface VocabularyActivityFeedback {
  success: boolean;
  response: string;
  hintsUsed: number;
  attempts: number;
}

export interface VocabularySession {
  setId: string;
  setIndex: number;
  itemIds: string[];
  phase: VocabularyLearningPhase;
  introIndex: number;
  activities: VocabularyActivity[];
  activityIndex: number;
  activityAttempts: number;
  feedback: VocabularyActivityFeedback | null;
}

export interface VocabularyPerformance {
  misses: number;
  successes: number;
  successStreak: number;
  adaptiveRepeats: number;
}

export interface VocabularyLearningState {
  version: 1;
  lessonId: string;
  items: Record<string, VocabularyItemState>;
  performance: Record<string, VocabularyPerformance>;
  completedSetIds: string[];
  session: VocabularySession | null;
}

const LEKTION_1_STARTER_IDS = [
  "extra-L01-2", // Deutschland
  "extra-L01-3", // Österreich
  "extra-L01-1", // Thailand
  "extra-L01-11", // kommen
];

const VOCABULARY_CONTEXT: Record<
  string,
  Pick<VocabularyWord, "type" | "example" | "chunk" | "contextAnswer">
> = {
  "extra-L01-1": {
    type: "country",
    example: "Ich komme aus Thailand.",
  },
  "extra-L01-2": {
    type: "country",
    example: "Ich komme aus Deutschland.",
  },
  "extra-L01-3": {
    type: "country",
    example: "Ich komme aus Österreich.",
  },
  "extra-L01-11": {
    type: "verb",
    chunk: "Ich komme aus ...",
    example: "Ich komme aus Thailand.",
    contextAnswer: "komme",
  },
};

export function createEmptyVocabularyState(lessonId: string): VocabularyLearningState {
  return {
    version: 1,
    lessonId,
    items: {},
    performance: {},
    completedSetIds: [],
    session: null,
  };
}

export function getVocabularyWord(item: Item): VocabularyWord {
  const fallback = VOCABULARY_CONTEXT[item.id];
  const article = item.article ?? item.answer.match(/^(der|die|das)\s+/i)?.[1];
  const german = (item.word || item.answer).replace(/^(der|die|das)\s+/i, "");
  const type = item.type ?? fallback?.type ?? inferWordType(item, article);
  const displayGerman = article ? `${article} ${german}` : item.answer || german;

  return {
    ...item,
    type,
    german,
    displayGerman,
    example: item.example ?? fallback?.example,
    chunk: item.chunk ?? fallback?.chunk,
    contextAnswer: fallback?.contextAnswer,
  };
}

function inferWordType(item: Item, article?: string): VocabularyWordType {
  if (item.group === "ประเทศ") return "country";
  if (item.group === "กริยา") return "verb";
  if (article || item.group === "คำนาม") return "noun";
  if (item.group === "คำคุณศัพท์") return "adjective";
  if (["Begrüßung", "Abschied"].includes(item.group)) return "expression";
  return "other";
}

export function buildVocabularySets(
  lessonId: string,
  items: Item[],
  setSize = LEARNING_SET_SIZE,
): VocabularyWord[][] {
  const words = items
    .filter((item) => item.lessonId === lessonId && item.skill === "vocabulary")
    .map(getVocabularyWord);
  if (!words.length) return [];

  const byId = new Map(words.map((word) => [word.id, word]));
  const starter =
    lessonId === VOCABULARY_LEARNING_LESSON
      ? LEKTION_1_STARTER_IDS.flatMap((id) => {
          const word = byId.get(id);
          return word ? [word] : [];
        })
      : [];
  const starterIds = new Set(starter.map((word) => word.id));
  const ordered = [...starter, ...words.filter((word) => !starterIds.has(word.id))];
  const size = Math.max(1, Math.floor(setSize));
  const sets: VocabularyWord[][] = [];
  for (let index = 0; index < ordered.length; index += size) {
    sets.push(ordered.slice(index, index + size));
  }
  return sets;
}

function createActivities(itemIds: string[], setIndex: number): VocabularyActivity[] {
  if (itemIds.length < 2) {
    return itemIds.flatMap((itemId, index) =>
      (["recognition", "guided_recall", "recall", "context_encounter"] as const).map(
        (type, round) => ({
          id: `set-${setIndex}-${index}-${type}-${round}`,
          itemId,
          type,
        }),
      ),
    );
  }

  const [first, second, third, fourth = first] = itemIds;
  const plan: Array<[VocabularyActivityType, string]> = [
    ["recognition", second],
    ["guided_recall", third],
    ["recognition", first],
    ["context_encounter", fourth],
    ["guided_recall", first],
    ["recall", second],
    ["context_encounter", third],
    ["recall", fourth],
  ];
  return plan.map(([type, itemId], index) => ({
    id: `set-${setIndex}-${index}-${type}-${itemId}`,
    itemId,
    type,
  }));
}

function createLearningEvent(
  itemId: string,
  type: VocabularyEventType,
  detail: Partial<Pick<VocabularyLearningEvent, "success" | "response" | "hintsUsed" | "adaptiveRepeat">> = {},
): VocabularyLearningEvent {
  return {
    id: `${itemId}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId,
    type,
    timestamp: new Date().toISOString(),
    ...detail,
  };
}

function itemState(state: VocabularyLearningState, itemId: string): VocabularyItemState {
  return state.items[itemId] ?? {
    introduced: false,
    learningCompleted: false,
    events: [],
  };
}

export function startVocabularySet(
  state: VocabularyLearningState,
  sets: VocabularyWord[][],
  setIndex = state.completedSetIds.length,
): VocabularyLearningState {
  const set = sets[setIndex];
  if (!set?.length) return state;
  return {
    ...state,
    session: {
      setId: `${state.lessonId}:set-${setIndex + 1}`,
      setIndex,
      itemIds: set.map((word) => word.id),
      phase: "introduce",
      introIndex: 0,
      activities: createActivities(set.map((word) => word.id), setIndex),
      activityIndex: 0,
      activityAttempts: 0,
      feedback: null,
    },
  };
}

export function recordIntroduced(
  state: VocabularyLearningState,
  itemId: string,
): VocabularyLearningState {
  const current = itemState(state, itemId);
  if (current.introduced) return state;
  const event = createLearningEvent(itemId, "introduced");
  return {
    ...state,
    items: {
      ...state.items,
      [itemId]: { ...current, introduced: true, events: [...current.events, event] },
    },
  };
}

export function advanceIntroduction(state: VocabularyLearningState): VocabularyLearningState {
  const session = state.session;
  if (!session || session.phase !== "introduce") return state;
  if (session.introIndex < session.itemIds.length - 1) {
    return { ...state, session: { ...session, introIndex: session.introIndex + 1 } };
  }
  return { ...state, session: { ...session, phase: "activities", activityIndex: 0 } };
}

export function recordVocabularyActivity(
  state: VocabularyLearningState,
  activity: VocabularyActivity,
  feedback: VocabularyActivityFeedback,
): VocabularyLearningState {
  const current = itemState(state, activity.itemId);
  const event = createLearningEvent(activity.itemId, activity.type, {
    success: feedback.success,
    response: feedback.response,
    hintsUsed: feedback.hintsUsed,
    adaptiveRepeat: activity.adaptiveRepeat,
  });
  const performance = state.performance[activity.itemId] ?? {
    misses: 0,
    successes: 0,
    successStreak: 0,
    adaptiveRepeats: 0,
  };
  const updatedPerformance = feedback.success
    ? {
        ...performance,
        successes: performance.successes + 1,
        successStreak: performance.successStreak + 1,
      }
    : {
        ...performance,
        misses: performance.misses + 1,
        successStreak: 0,
      };
  return {
    ...state,
    items: {
      ...state.items,
      [activity.itemId]: { ...current, events: [...current.events, event] },
    },
    performance: { ...state.performance, [activity.itemId]: updatedPerformance },
    session: state.session
      ? { ...state.session, activityAttempts: feedback.attempts, feedback }
      : null,
  };
}

export function retryVocabularyActivity(
  state: VocabularyLearningState,
): VocabularyLearningState {
  if (!state.session || !state.session.feedback) return state;
  return {
    ...state,
    session: { ...state.session, feedback: null },
  };
}

export function continueVocabularyActivity(
  state: VocabularyLearningState,
): VocabularyLearningState {
  const session = state.session;
  if (!session || session.phase !== "activities" || !session.feedback) return state;
  const currentActivity = session.activities[session.activityIndex];
  if (!currentActivity) return state;
  let activities = [...session.activities];
  const performance = state.performance[currentActivity.itemId];

  if (session.feedback.success && (performance?.successStreak ?? 0) >= 2) {
    activities = activities.filter(
      (activity, index) =>
        index <= session.activityIndex ||
        !activity.adaptiveRepeat ||
        activity.itemId !== currentActivity.itemId,
    );
  } else if (
    !session.feedback.success &&
    performance &&
    performance.adaptiveRepeats < 2
  ) {
    const repeatType: VocabularyActivityType =
      performance.misses === 1 ? "guided_recall" : "recall";
    const repeat: VocabularyActivity = {
      id: `${session.setId}-repeat-${currentActivity.itemId}-${performance.adaptiveRepeats + 1}`,
      itemId: currentActivity.itemId,
      type: repeatType,
      adaptiveRepeat: true,
    };
    const insertAt = Math.min(session.activityIndex + 3, activities.length);
    activities.splice(insertAt, 0, repeat);
    state = {
      ...state,
      performance: {
        ...state.performance,
        [currentActivity.itemId]: {
          ...performance,
          adaptiveRepeats: performance.adaptiveRepeats + 1,
        },
      },
    };
  }

  const nextIndex = session.activityIndex + 1;
  if (nextIndex >= activities.length) return completeVocabularySet(state, session);
  return {
    ...state,
    session: {
      ...session,
      activities,
      activityIndex: nextIndex,
      activityAttempts: 0,
      feedback: null,
    },
  };
}

function completeVocabularySet(
  state: VocabularyLearningState,
  session: VocabularySession,
): VocabularyLearningState {
  const items = { ...state.items };
  for (const itemId of session.itemIds) {
    const current = itemState(state, itemId);
    if (current.learningCompleted) continue;
    items[itemId] = {
      ...current,
      learningCompleted: true,
      events: [...current.events, createLearningEvent(itemId, "learning_completed")],
    };
  }
  return {
    ...state,
    items,
    completedSetIds: state.completedSetIds.includes(session.setId)
      ? state.completedSetIds
      : [...state.completedSetIds, session.setId],
    session: { ...session, phase: "summary", feedback: null },
  };
}

export function getActivityChoices(
  activity: VocabularyActivity,
  setWords: VocabularyWord[],
): string[] {
  const word = setWords.find((entry) => entry.id === activity.itemId);
  if (!word) return [];
  if (activity.type === "context_encounter" && word.type === "verb") {
    return ["komme", "kommst", "kommt"];
  }
  if (activity.type === "context_encounter" && word.type === "country") {
    return setWords.filter((entry) => entry.type === "country").map((entry) => entry.displayGerman);
  }
  const choices = setWords.map((entry) => entry.displayGerman);
  const rotateBy = activity.id.length % Math.max(1, choices.length);
  return [...choices.slice(rotateBy), ...choices.slice(0, rotateBy)];
}

export function getActivityExpectedAnswer(
  activity: VocabularyActivity,
  word: VocabularyWord,
): string {
  if (activity.type === "context_encounter") {
    if (word.contextAnswer) return word.contextAnswer;
    return word.displayGerman;
  }
  return word.displayGerman;
}

export function getActivityPrompt(
  activity: VocabularyActivity,
  word: VocabularyWord,
): string {
  if (activity.type === "recognition") return `คำไหนหมายถึง “${word.meaning}” ?`;
  if (activity.type === "guided_recall") return `นึกคำเยอรมันจากความหมาย: ${word.meaning}`;
  if (activity.type === "recall") return `ลองนึกคำเยอรมันด้วยตัวเอง: ${word.meaning}`;
  if (word.type === "country") return "เติมชื่อประเทศในประโยคให้สมบูรณ์";
  if (word.type === "verb") return "เลือกคำที่ใช้ในประโยคนี้";
  return word.example
    ? `คำนี้ปรากฏในบริบท: ${word.example}`
    : `สถานการณ์: ${word.meaning} · คำไหนเหมาะกับสถานการณ์นี้?`;
}

export function getActivitySentence(
  activity: VocabularyActivity,
  word: VocabularyWord,
): string | null {
  if (activity.type !== "context_encounter") return null;
  if (word.type === "country") return "Ich komme aus ________.";
  if (word.type === "verb") return "Ich ______ aus Thailand.";
  return word.example ?? word.chunk ?? null;
}

export function buildRecallHint(word: VocabularyWord, level: 1 | 2): string {
  const answer = word.displayGerman;
  if (level === 1) {
    return [...answer]
      .map((character, index) => (index === 0 || character === " " ? character : "_"))
      .join("");
  }
  return [...answer]
    .map((character, index) => (index < 3 || character === " " ? character : "_"))
    .join("");
}

export function normalizeVocabularyAnswer(value: string): string {
  return value.trim().toLocaleLowerCase("de-DE").replace(/[\s.,!?;:]+/g, " ");
}
