import type { ReleaseAttempt, ReleaseCourse, ReleaseState, ReleaseTask } from './a13-release';

export const releasePracticePolicy = { roundLimit: 10, reviewAfterMs: 24 * 60 * 60 * 1000 };
type Lane = 'weak' | 'new' | 'due' | 'review';
export type ReleaseSelection = { task: ReleaseTask; reason: string; lane: Lane };

function sessionFirsts(attempts: readonly ReleaseAttempt[]) {
  const unique = new Map<string, ReleaseAttempt>();
  for (const attempt of [...attempts].sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt) || (a.sessionId ?? '').localeCompare(b.sessionId ?? '') || a.id.localeCompare(b.id))) {
    const key = attempt.sessionId ? `${attempt.sessionId}:${attempt.taskId}` : `learn:${attempt.id}`;
    if (!unique.has(key)) unique.set(key, attempt);
  }
  return [...unique.values()];
}

function relatedEvidence(course: ReleaseCourse, attempts: readonly ReleaseAttempt[], targetId: string, subskill: string) {
  const definitions = new Map(course.tasks.filter(t => t.targetId === targetId && t.subskill === subskill).map(t => [t.id, t]));
  return sessionFirsts(attempts).filter(a => definitions.has(a.taskId)).map(attempt => ({ attempt, contextId: definitions.get(attempt.taskId)?.practice?.contextId ?? attempt.taskId }));
}

export function isReleaseTaskUnlocked(course: ReleaseCourse, state: ReleaseState, task: ReleaseTask) {
  if (!task.requiredCardIds.every(id => state.learned.includes(id))) return false;
  const unlock = task.practice?.unlock;
  if (!unlock) return true;
  const evidence = relatedEvidence(course, state.attempts, task.targetId, unlock.subskill);
  if (unlock.requiresAttempt && evidence.length === 0) return false;
  const latestContexts = new Map<string, ReleaseAttempt>();
  for (const { attempt, contextId } of evidence) if (attempt.sessionId) latestContexts.set(contextId, attempt);
  const independent = [...latestContexts.values()].filter(a => a.correct && !a.helpUsed);
  return independent.length >= unlock.minCorrectContexts && new Set(independent.map(a => a.sessionId)).size >= unlock.minPracticeSessions;
}

function candidates(course: ReleaseCourse, state: ReleaseState, now: number, cardId?: string) {
  const firsts = sessionFirsts(state.attempts);
  return course.tasks.filter(task => isReleaseTaskUnlocked(course, state, task) && (!cardId || task.requiredCardIds.includes(cardId))).map(task => {
    const related = relatedEvidence(course, firsts, task.targetId, task.subskill);
    const contexts = new Map<string, ReleaseAttempt>();
    related.forEach(({ attempt, contextId }) => contexts.set(contextId, attempt));
    const own = firsts.filter(a => a.taskId === task.id);
    const last = own.at(-1);
    const weak = [...contexts.values()].some(a => !a.correct || a.helpUsed);
    const mostRecent = related.at(-1)?.attempt;
    const failedStage = mostRecent && (!mostRecent.correct || mostRecent.helpUsed) ? course.tasks.find(t => t.id === mostRecent.taskId)?.practice?.stage ?? 0 : -1;
    const due = !!last && now - Date.parse(last.submittedAt) >= releasePracticePolicy.reviewAfterMs;
    const lane: Lane = weak ? 'weak' : !last ? 'new' : due ? 'due' : 'review';
    const stage = task.practice?.stage ?? 0;
    const reason = lane === 'weak' ? 'ทบทวนทักษะที่ยังตอบผิดหรือเคยเปิดตัวช่วย' : lane === 'new' && stage >= 2 ? 'เคยใช้โครงนี้ได้ในหลายบริบทแล้ว ลองเขียนจากข้อมูลใหม่' : lane === 'new' ? 'ยังไม่มีหลักฐานของโจทย์นี้' : lane === 'due' ? 'ทบทวนหลังเว้นระยะ' : 'ฝึกเพิ่มเติมในทักษะเดิม ยังไม่สรุปว่าชำนาญ';
    const recovery = failedStage > stage ? 2 : mostRecent?.helpUsed === true && failedStage === stage ? 1 : 0;
    return { task, reason: recovery ? 'กลับมาฝึกแบบมีตัวช่วยก่อน แล้วค่อยลองจากข้อมูลใหม่' : reason, lane, stage, recovery, ownWrong: last?.correct === false, repetitions: own.length, last: last ? Date.parse(last.submittedAt) : 0 };
  });
}

/** Keeps each started queue stable; the mix applies only when building a new round. */
export function selectReleaseRound(course: ReleaseCourse, state: ReleaseState, now = Date.now(), cardId?: string, limit = releasePracticePolicy.roundLimit): ReleaseSelection[] {
  const pool = candidates(course, state, now, cardId);
  const selected: ReleaseSelection[] = [];
  const used = new Set<string>();
  const mix: Lane[] = ['weak', 'new', 'due', 'new', 'weak', 'due', 'new', 'weak', 'due', 'new'];
  const lanes: Lane[] = ['weak', 'new', 'due', 'review'];
  for (let at = 0; at < Math.min(limit, releasePracticePolicy.roundLimit); at++) {
    const preferred = mix[at % mix.length];
    const fallback: Lane[] = [preferred, ...lanes.filter(lane => lane !== preferred)];
    const remaining = pool.filter(c => !used.has(c.task.targetId));
    let picked: (typeof pool)[number] | undefined;
    for (const lane of fallback) {
      const eligible = remaining.filter(c => c.lane === lane).sort((a, b) => {
        if (lane === 'weak') return Number(b.recovery) - Number(a.recovery) || (a.recovery && b.recovery ? b.stage - a.stage : 0) || Number(b.ownWrong) - Number(a.ownWrong) || a.stage - b.stage || a.repetitions - b.repetitions || a.last - b.last || a.task.id.localeCompare(b.task.id);
        // Once unlocked, a new challenge can replace a familiar scaffold in later rounds.
        return (lane === 'new' ? b.stage - a.stage : 0) || a.repetitions - b.repetitions || a.last - b.last || a.task.difficulty - b.task.difficulty || a.task.id.localeCompare(b.task.id);
      });
      if (eligible[0]) { picked = eligible[0]; break; }
    }
    if (!picked) break;
    selected.push({ task: picked.task, reason: picked.reason, lane: picked.lane });
    used.add(picked.task.targetId);
  }
  return selected;
}

export function selectReleaseTask(course: ReleaseCourse, state: ReleaseState, now = Date.now(), cardId?: string) {
  return selectReleaseRound(course, state, now, cardId, 1)[0] ?? null;
}
