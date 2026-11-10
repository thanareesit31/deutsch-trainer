import type { DialogueAnnotatedPart } from './phrase-dialogue-learning';

export type ReleaseSkill = 'vocabulary' | 'grammar' | 'phrases';
export type ReleaseModel = { text: string; meaning: string; sentences: DialogueAnnotatedPart[][]; audio: string; speaker?: 'A' | 'B' };
export type ReleaseNoun = { article: string; word: string; plural: boolean };
export type ReleaseCard = {
  id: string; title: string; purpose: string; notes: string[]; context: string[][];
  models: ReleaseModel[]; targetIds: string[]; noun: ReleaseNoun | null; wordAudio: string | null;
};
export type ReleaseTask = {
  id: string; version: number; targetId: string; subskill: string; difficulty: number; difficultyRationale: string;
  requiredCardIds: string[]; kind: 'choice' | 'order' | 'write'; prompt: string; cue: string;
  context: string[][]; options: string[]; tokens: string[]; startWith: string; acceptedAnswers: string[];
  assistance: string[]; feedback: { reason: string; models: ReleaseModel[] };
  noun: ReleaseNoun | null; articleTarget: boolean; spelling: boolean;
};
export type ReleaseCourse = { lessonId: string; skill: ReleaseSkill; title: string; purpose: string; cards: ReleaseCard[]; tasks: ReleaseTask[]; glossary: { text: string; meaning: string; noun: ReleaseNoun | null; audio: string }[] };
export type ReleaseAttempt = { id: string; taskId: string; response: string; correct: boolean; helpUsed: boolean; submittedAt: string; selectionReason: string };
export type ReleaseActive = { taskId: string; draft: string; helpUsed: boolean; startedAt: string; selectionReason: string; origin: 'learn' | 'practice' | null; learningCardId: string | null };
export type ReleaseState = { version: 1; learned: string[]; cursor: number; active: ReleaseActive | null; attempts: ReleaseAttempt[]; round: { id: string; startedAt: string; limit: number } | null };
export const releaseStateKey = (course: Pick<ReleaseCourse, 'lessonId' | 'skill'>) => `deutsch-trainer-release-course-v1-${course.lessonId}-${course.skill}`;
export const emptyReleaseState = (): ReleaseState => ({ version: 1, learned: [], cursor: 0, active: null, attempts: [], round: null });
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string';
export const normalizeReleaseAnswer = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase('de');
export function gradeReleaseTask(task: ReleaseTask, response: string) {
  return task.acceptedAnswers.some(answer => task.spelling ? answer.normalize('NFC').trim() === response.normalize('NFC').trim() : normalizeReleaseAnswer(answer) === normalizeReleaseAnswer(response));
}

export function parseReleaseState(raw: string | null, course: ReleaseCourse): ReleaseState {
  if (raw === null) return emptyReleaseState();
  const value: unknown = JSON.parse(raw);
  if (!record(value) || value.version !== 1 || !Array.isArray(value.learned) || !value.learned.every(text) || !Number.isInteger(value.cursor) || typeof value.cursor !== 'number' || value.cursor < 0 || value.cursor > course.cards.length || !Array.isArray(value.attempts)) throw Error('ข้อมูลบทเรียนไม่สมบูรณ์ กรุณาโหลดใหม่');
  const cardIds = new Set(course.cards.map(card => card.id));
  const learned = value.learned;
  if (value.learned.some(id => !cardIds.has(id)) || new Set(value.learned).size !== value.learned.length) throw Error('ไม่พบเนื้อหาที่บันทึกไว้');
  const tasks = new Map(course.tasks.map(task => [task.id, task]));
  let active: ReleaseActive | null = null;
  if (value.active !== null) {
    const a = value.active;
    if (!record(a) || !text(a.taskId) || !tasks.has(a.taskId) || !text(a.draft) || typeof a.helpUsed !== 'boolean' || !text(a.startedAt) || !Number.isFinite(Date.parse(a.startedAt))) throw Error('ข้อมูลร่างคำตอบไม่สมบูรณ์');
    active = { taskId: a.taskId, draft: a.draft, helpUsed: a.helpUsed, startedAt: a.startedAt, selectionReason: text(a.selectionReason) ? a.selectionReason : 'กลับมาทำโจทย์ที่ค้างไว้', origin: a.origin === 'learn' || a.origin === 'practice' ? a.origin : null, learningCardId: text(a.learningCardId) && cardIds.has(a.learningCardId) ? a.learningCardId : null };
  }
  const attempts = value.attempts.map((a): ReleaseAttempt => {
    if (!record(a) || !text(a.id) || !text(a.taskId) || !text(a.response) || typeof a.correct !== 'boolean' || typeof a.helpUsed !== 'boolean' || !text(a.submittedAt) || !Number.isFinite(Date.parse(a.submittedAt)) || !text(a.selectionReason)) throw Error('ข้อมูลคำตอบไม่สมบูรณ์');
    const task = tasks.get(a.taskId);
    if (!task || gradeReleaseTask(task, a.response) !== a.correct || task.requiredCardIds.some(id => !learned.includes(id))) throw Error('คำตอบไม่ตรงกับบทเรียนที่บันทึก');
    return { id: a.id, taskId: a.taskId, response: a.response, correct: a.correct, helpUsed: a.helpUsed, submittedAt: a.submittedAt, selectionReason: a.selectionReason };
  });
  if (new Set(attempts.map(a => a.id)).size !== attempts.length) throw Error('รหัสคำตอบซ้ำ');
  let round: ReleaseState['round'] = null;
  if (value.round !== null && value.round !== undefined) {
    const r = value.round;
    if (!record(r) || !text(r.id) || !text(r.startedAt) || !Number.isFinite(Date.parse(r.startedAt)) || r.limit !== 10) throw Error('ข้อมูลรอบฝึกไม่สมบูรณ์');
    round = { id: r.id, startedAt: r.startedAt, limit: r.limit };
  }
  return { version: 1, learned, cursor: value.cursor, active, attempts, round };
}

/** Choose only taught targets. A new subskill remains unknown even when another is correct. */
export function selectReleaseTask(course: ReleaseCourse, state: ReleaseState, now = Date.now(), cardId?: string) {
  const eligible = course.tasks.filter(task => task.requiredCardIds.every(id => state.learned.includes(id)) && (!cardId || task.requiredCardIds.includes(cardId)));
  const scored = eligible.map(task => {
    const taskAttempts = state.attempts.filter(a => a.taskId === task.id);
    const latest = taskAttempts.at(-1);
    const relatedIds = new Set(course.tasks.filter(q => q.targetId === task.targetId && q.subskill === task.subskill).map(q => q.id));
    const related = state.attempts.filter(a => relatedIds.has(a.taskId));
    const first = new Map<string, ReleaseAttempt>();
    related.forEach(a => { if (!first.has(a.taskId)) first.set(a.taskId, a); });
    const independent = [...first.values()].filter(a => a.correct && !a.helpUsed);
    const days = new Set(independent.map(a => a.submittedAt.slice(0, 10)));
    const due = !!latest && now - Date.parse(latest.submittedAt) >= 24 * 60 * 60 * 1000;
    const reason = !latest ? 'ยังไม่มีหลักฐานของโจทย์นี้' : !latest.correct ? 'ทบทวนจุดที่ตอบผิด พร้อมตัวช่วยให้เลือกใช้' : latest.helpUsed ? 'ลองทักษะเดิมโดยไม่เปิดตัวอย่าง' : due ? 'ทบทวนหลังเว้นระยะ' : 'เก็บหลักฐานเพิ่มเติม ยังไม่สรุปว่าชำนาญ';
    // Avoid repeated retries crowding out unseen, independently measurable targets.
    const priority = !latest ? 0 : due && !latest.correct ? 1 : due ? 2 : !latest.correct ? 3 : latest.helpUsed ? 4 : independent.length < 3 || days.size < 2 ? 5 : 6;
    return { task, reason, priority, repetitions: taskAttempts.length, last: latest ? Date.parse(latest.submittedAt) : 0 };
  });
  scored.sort((a, b) => a.priority - b.priority || a.repetitions - b.repetitions || a.last - b.last || a.task.difficulty - b.task.difficulty || a.task.id.localeCompare(b.task.id));
  const best = scored[0];
  return best ? { task: best.task, reason: best.reason } : null;
}

export function releaseOrderIndices(draft: string, task: ReleaseTask): number[] {
  if (!draft) return [];
  try {
    const value: unknown = JSON.parse(draft);
    return Array.isArray(value) && value.every((index: unknown) => typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < task.tokens.length) && new Set(value).size === value.length ? value : [];
  } catch { return []; }
}

export function mergeReleaseStates(remote: ReleaseState, pending: ReleaseState): ReleaseState {
  const ids = new Set(remote.attempts.map(a => a.id));
  for (const attempt of pending.attempts) {
    const saved = remote.attempts.find(a => a.id === attempt.id);
    const serverAddedKnownHelp = saved?.helpUsed === true && !attempt.helpUsed && JSON.stringify(saved) === JSON.stringify({ ...attempt, helpUsed: true });
    if (saved && JSON.stringify(saved) !== JSON.stringify(attempt) && !serverAddedKnownHelp) throw Error('คำตอบที่บันทึกแล้วเปลี่ยนแปลงไม่ได้');
  }
  const sameTrial = remote.active && pending.active && remote.active.taskId === pending.active.taskId && remote.active.startedAt === pending.active.startedAt;
  const active = sameTrial && pending.active ? { ...pending.active, helpUsed: pending.active.helpUsed || remote.active?.helpUsed === true } : pending.active;
  const incoming = pending.attempts.filter(a => !ids.has(a.id)).map(attempt => remote.active?.helpUsed && attempt.taskId === remote.active.taskId && Date.parse(attempt.submittedAt) >= Date.parse(remote.active.startedAt) ? { ...attempt, helpUsed: true } : attempt);
  return { ...pending, active, learned: [...new Set([...remote.learned, ...pending.learned])], cursor: Math.max(remote.cursor, pending.cursor), attempts: [...remote.attempts, ...incoming] };
}
