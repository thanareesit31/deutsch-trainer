import { items, itemById, type Item, type Mode } from "./content";

export type Status = "new" | "learning" | "mastered" | "review";
export interface Progress {
  right: number;
  wrong: number;
  streak: number;
  score: number;
  lastPracticed: number;
  lastWrong: number;
  nextReview: number;
  lastResult: "right" | "wrong" | "";
  lastHidden: number[];
  articleWrong: number;
  spellingWrong: number;
  modes: Record<string, { right: number; wrong: number }>;
}
export interface Settings {
  sessionSize: number;
  prioritize: boolean;
  direction: "de-th" | "th-de";
}
export interface Store {
  version: 5;
  progress: Record<string, Progress>;
  settings: Settings;
  days: Record<string, number>;
}
export const STORAGE_KEY = "deutsch-mit-sun-v5";
export const emptyProgress = (): Progress => ({
  right: 0,
  wrong: 0,
  streak: 0,
  score: 0,
  lastPracticed: 0,
  lastWrong: 0,
  nextReview: 0,
  lastResult: "",
  lastHidden: [],
  articleWrong: 0,
  spellingWrong: 0,
  modes: {},
});
export const emptyStore = (): Store => ({
  version: 5,
  progress: {},
  settings: { sessionSize: 10, prioritize: true, direction: "de-th" },
  days: {},
});
export function status(p?: Progress, now = Date.now()): Status {
  if (!p || p.right + p.wrong === 0) return "new";
  if (p.lastResult === "wrong" || p.nextReview <= now) return "review";
  if (p.streak >= 3 && p.score >= 6 && p.right / (p.right + p.wrong) >= 0.75)
    return "mastered";
  return "learning";
}
export const mastery = (p?: Progress) =>
  p ? Math.min(100, Math.round((p.score / 10) * 100)) : 0;
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}
export function record(
  store: Store,
  id: string,
  correct: boolean,
  mode: Mode,
  now = Date.now(),
  meta: {
    hidden?: number[];
    articleWrong?: boolean;
    spellingWrong?: boolean;
  } = {}
): Store {
  if (!itemById.has(id)) throw new Error("ไม่พบเนื้อหานี้");
  const previous = store.progress[id] || emptyProgress();
  const weight = ["typing", "order", "dialogue"].includes(mode) ? 2 : 1;
  const streak = correct ? previous.streak + 1 : 0;
  const interval = [1, 1, 3, 7, 14, 30][Math.min(streak, 5)];
  const stats = previous.modes[mode] || { right: 0, wrong: 0 };
  const next: Progress = {
    ...previous,
    right: previous.right + Number(correct),
    wrong: previous.wrong + Number(!correct),
    streak,
    score: Math.max(0, Math.min(10, previous.score + (correct ? weight : -3))),
    lastPracticed: now,
    lastWrong: correct ? previous.lastWrong : now,
    nextReview: correct ? now + interval * 86400000 : now,
    lastResult: correct ? "right" : "wrong",
    lastHidden: meta.hidden ?? previous.lastHidden,
    articleWrong: previous.articleWrong + Number(!!meta.articleWrong),
    spellingWrong: previous.spellingWrong + Number(!!meta.spellingWrong),
    modes: {
      ...previous.modes,
      [mode]: {
        right: stats.right + Number(correct),
        wrong: stats.wrong + Number(!correct),
      },
    },
  };
  const day = dayKey(new Date(now));
  return {
    ...store,
    progress: { ...store.progress, [id]: next },
    days: { ...store.days, [day]: (store.days[day] || 0) + 1 },
  };
}
export function shuffled<T>(input: T[], rng = Math.random): T[] {
  const result = [...input];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function sessionItems(
  pool: Item[],
  count: number,
  progress: Store["progress"],
  prioritize: boolean,
  now = Date.now()
): Item[] {
  let result = shuffled([...new Map(pool.map((i) => [i.id, i])).values()]);
  if (prioritize)
    result = result.sort(
      (a, b) =>
        Number(status(progress[b.id], now) === "review") -
        Number(status(progress[a.id], now) === "review")
    );
  return count === 0 ? result : result.slice(0, count);
}
export function normalize(input: string): string {
  return input
    .normalize("NFC")
    .trim()
    .replace(/[.!?]+$/u, "")
    .replace(/\s+/g, " ");
}
export const isCorrect = (
  input: string,
  answer: string,
  accepted: string[] = []
) => [answer, ...accepted].some((a) => normalize(input) === normalize(a));
export function adaptiveHint(
  word: string,
  p?: Progress,
  rng = Math.random
): { text: string; hidden: number[] } {
  const chars = Array.from(word);
  const eligible = chars
    .map((c, i) => (/[\p{L}]/u.test(c) ? i : -1))
    .filter((i) => i >= 0);
  const fraction =
    (p?.score || 0) >= 6 ? 1 : (p?.score || 0) >= 3 ? 0.65 : 0.35;
  const count = Math.max(1, Math.ceil(eligible.length * fraction));
  let hidden = shuffled(eligible, rng)
    .slice(0, count)
    .sort((a, b) => a - b);
  if (count < eligible.length && p?.lastHidden.join() === hidden.join()) {
    const alternative = eligible.find((i) => !hidden.includes(i));
    if (alternative !== undefined)
      hidden = [...hidden.slice(1), alternative].sort((a, b) => a - b);
  }
  return {
    text: chars.map((c, i) => (hidden.includes(i) ? "_" : c)).join(""),
    hidden,
  };
}
export interface Question {
  item: Item;
  mode: Mode;
  prompt: string;
  answer: string;
  options: string[];
  tokens: string[];
  hint?: ReturnType<typeof adaptiveHint>;
}
export function makeQuestion(
  item: Item,
  mode: Mode,
  progress?: Progress
): Question {
  let prompt = item.prompt || item.meaning;
  let answer = item.answer;
  let options: string[] = item.options || [];
  if (item.skill === "vocabulary") {
    const related = items.filter(
      (i) =>
        i.skill === "vocabulary" &&
        i.lessonId === item.lessonId &&
        i.id !== item.id
    );
    if (mode === "de-th") {
      prompt = item.title;
      answer = item.meaning;
      options = related.map((i) => i.meaning);
    } else if (mode === "article") {
      prompt = `___ ${item.word}`;
      answer = item.article || "";
      options = ["der", "die", "das"];
    } else {
      prompt = mode === "flash" ? item.title : item.meaning;
      options = related.map((i) => i.title);
    }
  }
  if (mode === "dialogue") prompt = `${item.prompt}\nคู่สนทนา: ${item.reply}`;
  options = [...new Set(options)].filter((o) => o !== answer);
  options = shuffled([answer, ...shuffled(options).slice(0, 3)]);
  return {
    item,
    mode,
    prompt,
    answer,
    options,
    tokens: shuffled(item.answer.split(" ")),
    hint:
      item.skill === "vocabulary" && mode === "typing"
        ? adaptiveHint(item.word || item.answer, progress)
        : undefined,
  };
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
function nonnegative(value: unknown, fallback = 0) {
  if (value === undefined) return fallback;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > Number.MAX_SAFE_INTEGER
  )
    throw new Error("ไฟล์มีตัวเลข Progress ไม่ถูกต้อง");
  return value;
}
export function parseBackup(input: unknown): Store {
  if (!isObject(input)) throw new Error("ไฟล์สำรองต้องเป็น JSON object");
  if (
    input.version !== undefined &&
    ![1, 2, 3, 4, 5].includes(Number(input.version))
  )
    throw new Error("ยังไม่รองรับไฟล์สำรองเวอร์ชันนี้");
  const source = input.progress ?? input;
  if (!isObject(source)) throw new Error("ไม่พบข้อมูล Progress ที่ถูกต้อง");
  const result = emptyStore();
  const entries = Object.entries(source);
  let recognized = 0;
  for (const [id, value] of entries) {
    if (!itemById.has(id)) continue;
    recognized++;
    if (!isObject(value)) throw new Error(`ข้อมูล ${id} ไม่ถูกต้อง`);
    const p = emptyProgress();
    p.right = nonnegative(value.right);
    p.wrong = nonnegative(value.wrong);
    p.streak = nonnegative(value.streak);
    p.score = Math.min(
      10,
      nonnegative(value.score, Math.max(0, Math.min(10, p.right - p.wrong)))
    );
    p.lastPracticed = nonnegative(value.lastPracticed ?? value.lastSeen);
    p.lastWrong = nonnegative(value.lastWrong);
    p.nextReview = nonnegative(value.nextReview);
    p.lastResult =
      value.lastResult === "right"
        ? "right"
        : value.lastResult === "wrong"
        ? "wrong"
        : "";
    p.articleWrong = nonnegative(value.articleWrong);
    p.spellingWrong = nonnegative(value.spellingWrong);
    p.lastHidden = Array.isArray(value.lastHidden)
      ? value.lastHidden.map((v) => nonnegative(v))
      : [];
    if (isObject(value.modes))
      for (const [mode, stats] of Object.entries(value.modes)) {
        if (
          !isObject(stats) ||
          ["__proto__", "constructor", "prototype"].includes(mode)
        )
          throw new Error("ข้อมูลแบบฝึกไม่ถูกต้อง");
        p.modes[mode] = {
          right: nonnegative(stats.right),
          wrong: nonnegative(stats.wrong),
        };
      }
    result.progress[id] = p;
  }
  if (entries.length > 0 && recognized === 0)
    throw new Error("ไม่พบรหัสเนื้อหาที่รองรับในไฟล์นี้");
  if (isObject(input.settings)) {
    const s = input.settings;
    if ([0, 5, 10, 20].includes(Number(s.sessionSize)))
      result.settings.sessionSize = Number(s.sessionSize);
    if (typeof s.prioritize === "boolean")
      result.settings.prioritize = s.prioritize;
    if (s.direction === "de-th" || s.direction === "th-de")
      result.settings.direction = s.direction;
  }
  if (isObject(input.days))
    for (const [day, count] of Object.entries(input.days)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day))
        result.days[day] = nonnegative(count);
    }
  return result;
}
export function mergeStore(current: Store, imported: Store): Store {
  const progress = { ...current.progress };
  for (const [id, p] of Object.entries(imported.progress)) {
    const old = progress[id];
    if (
      !old ||
      p.lastPracticed > old.lastPracticed ||
      (p.lastPracticed === old.lastPracticed &&
        p.right + p.wrong > old.right + old.wrong)
    )
      progress[id] = p;
  }
  const days = { ...current.days };
  for (const [key, value] of Object.entries(imported.days))
    days[key] = Math.max(days[key] || 0, value);
  return { ...current, progress, days };
}
