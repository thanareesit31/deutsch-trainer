import { l13ChallengeResponses, l13VocabularyChallengeActivities, type ArticleAssessment, type VocabularyChallengeActivity } from "./l13-vocabulary-challenge-bank";

export type ChallengeConfidence = "easy" | "thought" | "guess";
export type ChallengeResponse = { answer: string; correct: boolean; submittedAt: string; confidence?: ChallengeConfidence | null; assessment?: ArticleAssessment };
export type ChallengeRound = { id: string; activityIds: string[]; position: number; responses: Record<string, ChallengeResponse>; drafts: Record<string, string>; completedAt: string | null };
type ArchivedRound = Omit<ChallengeRound, "position" | "drafts">;
export type VocabularyChallengeState = { version: 2; round: ChallengeRound; articleRound?: ChallengeRound; history: ArchivedRound[] };
const byId = new Map(l13VocabularyChallengeActivities.map(activity => [activity.id, activity]));
const responseById = new Map(l13ChallengeResponses.map(response => [response.id, response]));
const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const timestamp = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
export const activityResponseIds = (activity: VocabularyChallengeActivity) => activity.kind === "story" ? activity.gaps.map(gap => gap.id) : activity.kind === "crossword" ? activity.rows.map(row => row.id) : [activity.id];

export function readPartOrder(raw: string | undefined, count: number): number[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(value) && value.every(index => typeof index === "number" && Number.isInteger(index) && index >= 0 && index < count) && new Set(value).size === value.length ? value : [];
  } catch { return []; }
}

function parseResponses(value: unknown, allowed: Set<string>): Record<string, ChallengeResponse> | null {
  if (!record(value)) return null;
  const responses: Record<string, ChallengeResponse> = {};
  for (const [id, response] of Object.entries(value)) {
    const definition = responseById.get(id);
    if (!definition || !allowed.has(id) || !record(response) || typeof response.answer !== "string" || response.answer.length > 100
      || (definition.choices !== null && !definition.choices.includes(response.answer))
      || response.correct !== (response.answer === definition.answer) || !timestamp(response.submittedAt)) return null;
    if (definition.assessment) {
      const assessment = response.assessment;
      if (!record(assessment) || Object.entries(definition.assessment).some(([key, expected]) => assessment[key] !== expected)) return null;
    }
    const confidence = response.confidence;
    if (confidence !== undefined && confidence !== null && confidence !== "easy" && confidence !== "thought" && confidence !== "guess") return null;
    responses[id] = { answer: response.answer, correct: response.correct, submittedAt: response.submittedAt, ...("confidence" in response ? { confidence } : {}), ...(definition.assessment ? { assessment: definition.assessment } : {}) };
  }
  return responses;
}

function parseRound(value: unknown): ChallengeRound | null {
  if (!record(value) || typeof value.id !== "string" || !Array.isArray(value.activityIds)
    || !value.activityIds.every(id => typeof id === "string" && byId.has(id)) || new Set(value.activityIds).size !== value.activityIds.length
    || typeof value.position !== "number" || !Number.isInteger(value.position) || value.position < 0 || value.position > value.activityIds.length
    || !(value.completedAt === null || timestamp(value.completedAt)) || !record(value.drafts)) return null;
  const activityIds = value.activityIds.map(String);
  const allowed = new Set(activityIds.flatMap(id => { const activity = byId.get(id); return activity ? activityResponseIds(activity) : []; }));
  const responses = parseResponses(value.responses, allowed);
  if (!responses) return null;
  const drafts: Record<string, string> = {};
  for (const [id, draft] of Object.entries(value.drafts)) {
    if (!allowed.has(id) || typeof draft !== "string" || draft.length > 100) return null;
    if (!responses[id]) drafts[id] = draft;
  }
  if (value.completedAt !== null && [...allowed].some(id => !responses[id])) return null;
  return { id: value.id, activityIds, position: value.position, completedAt: value.completedAt, responses, drafts };
}

export function makeChallengeRound(eligible: VocabularyChallengeActivity[], history: ArchivedRound[], now = new Date().toISOString()): ChallengeRound {
  const seen = new Map<string, { priority: number; at: string }>();
  for (const round of history) for (const id of round.activityIds) {
    const activity = byId.get(id);
    if (!activity) continue;
    const responses = activityResponseIds(activity).map(id => round.responses[id]);
    const at = round.completedAt ?? now;
    const priority = responses.some(response => !response?.correct || response.confidence === "guess" || response.confidence === "thought") ? 1
      : responses.some(response => response.confidence === undefined || response.confidence === null) ? 2 : 3;
    if (!seen.has(id) || (seen.get(id)?.at ?? "") < at) seen.set(id, { priority, at });
  }
  const remaining = [...eligible];
  const chosen: VocabularyChallengeActivity[] = [];
  const kinds: VocabularyChallengeActivity["kind"][] = ["story", "picture", "pictureArticle", "odd", "category", "riddle", "build", "crossword"];
  while (remaining.length && chosen.length < 15) {
    const wanted = kinds[chosen.length % kinds.length];
    const overlap = (activity: VocabularyChallengeActivity) => activity.requiredItemIds.filter(id => chosen.some(other => other.requiredItemIds.includes(id))).length;
    const rank = (activity: VocabularyChallengeActivity) => seen.get(activity.id)?.priority ?? 0;
    remaining.sort((a, b) => rank(a) - rank(b) || Number(a.kind !== wanted) - Number(b.kind !== wanted)
      || overlap(a) - overlap(b) || (seen.get(a.id)?.at ?? "").localeCompare(seen.get(b.id)?.at ?? ""));
    const candidate = remaining.shift();
    if (candidate) chosen.push(candidate);
  }
  chosen.sort((a, b) => a.difficulty - b.difficulty);
  return { id: crypto.randomUUID(), activityIds: chosen.map(activity => activity.id), position: 0, responses: {}, drafts: {}, completedAt: null };
}

export function readChallengeState(raw: string | null, eligible: VocabularyChallengeActivity[]): VocabularyChallengeState | null {
  if (!raw) return { version: 2, round: makeChallengeRound(eligible, []), history: [] };
  try {
    const value: unknown = JSON.parse(raw);
    if (!record(value)) return null;
    if (value.version === 2) {
      const round = parseRound(value.round);
      if (!round || !Array.isArray(value.history)) return null;
      const history: ArchivedRound[] = [];
      for (const archived of value.history) {
        if (!record(archived)) return null;
        const parsed = parseRound({ ...archived, position: 0, drafts: {} });
        if (!parsed || !parsed.completedAt) return null;
        history.push({ id: parsed.id, activityIds: parsed.activityIds, responses: parsed.responses, completedAt: parsed.completedAt });
      }
      const articleRound = value.articleRound === undefined ? undefined : parseRound(value.articleRound);
      if (articleRound === null || articleRound?.activityIds.some(id => byId.get(id)?.kind !== "pictureArticle")) return null;
      return { version: 2, round: round.activityIds.length ? round : makeChallengeRound(eligible, history), history, ...(articleRound ? { articleRound } : {}) };
    }
    if (value.version !== 1 || typeof value.id !== "string" || typeof value.position !== "number" || !Number.isInteger(value.position)
      || value.position < 0 || typeof value.completed !== "boolean") return null;
    const original = eligible.filter(activity => !activity.added);
    const slots = original.flatMap(activityResponseIds);
    const responses = parseResponses(value.responses, new Set(slots));
    if (!responses || value.position > slots.length) return null;
    const slot = slots[value.position];
    const position = slot ? original.findIndex(activity => activityResponseIds(activity).includes(slot)) : original.length;
    const completedAt = value.completed ? Object.values(responses).map(response => response.submittedAt).sort().at(-1) ?? new Date().toISOString() : null;
    const round = parseRound({ id: value.id, activityIds: original.map(activity => activity.id), position, responses, drafts: record(value.drafts) ? value.drafts : {}, completedAt });
    return round ? { version: 2, round, history: [] } : null;
  } catch { return null; }
}

export function nextChallengeRound(state: VocabularyChallengeState, eligible: VocabularyChallengeActivity[], format?: "pictureArticle"): VocabularyChallengeState {
  const active = format === "pictureArticle" ? state.articleRound : state.round;
  const history = active?.completedAt
    ? [...state.history, { id: active.id, activityIds: active.activityIds, responses: active.responses, completedAt: active.completedAt }]
    : state.history;
  const round = makeChallengeRound(format === "pictureArticle" ? eligible.filter(activity => activity.kind === format) : eligible, history);
  return format === "pictureArticle" ? { ...state, articleRound: round, history } : { ...state, round, history };
}
