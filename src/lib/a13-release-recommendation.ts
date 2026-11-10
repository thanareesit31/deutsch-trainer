import { a13ReleaseCourses } from '@/data/a13-release';
import { parseReleaseState, releaseStateKey, selectReleaseTask, type ReleaseAttempt } from './a13-release';
import { readL13PracticeHistory } from './practice-planner';

export function recommendReleasePractice(userId: string, storage: Pick<Storage, 'getItem'>, readLesson: (key: string) => string | null) {
  if (process.env.NEXT_PUBLIC_A13_RELEASE_LESSONS === 'false') return null;
  const histories = readL13PracticeHistory(userId, storage).filter(h => /^\/practice\/L1[5-8]\/(vocabulary|grammar|phrases)/.test(h.href));
  const candidates = a13ReleaseCourses.flatMap(course => {
    const state = parseReleaseState(readLesson(releaseStateKey(course)), course);
    const eligibleIds = new Set(course.tasks.filter(q => q.requiredCardIds.every(id => state.learned.includes(id))).map(q => q.id));
    const history = histories.filter(h => h.href.startsWith(`/practice/${course.lessonId}/${course.skill}/`));
    const pending = history.filter(h => !h.archived && !h.completed && h.items.every(item => eligibleIds.has(item.question.id))).sort((a, b) => b.createdAt - a.createdAt)[0];
    if (pending) return [{ kind: 'resume', title: `ฝึกต่อบท ${Number(course.lessonId.slice(1))} · ${course.title}`, description: `กลับไปข้อ ${pending.position + 1} จาก ${pending.items.length} พร้อมคำตอบที่ทำค้าง`, href: `${pending.href}?resume=${encodeURIComponent(pending.id)}`, action: 'ฝึกต่อ', activityAt: pending.createdAt }];
    const observations: ReleaseAttempt[] = history.flatMap(h => h.items.flatMap(item => item.result && typeof item.result.correct === 'boolean' ? [{ id: `${h.id}:${item.question.id}`, taskId: item.question.id, response: '', correct: item.result.correct, helpUsed: item.result.assisted !== false, submittedAt: new Date(item.result.submittedAt).toISOString(), selectionReason: 'ประวัติรอบฝึก' }] : []));
    const choice = selectReleaseTask(course, { ...state, attempts: [...state.attempts, ...observations].sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt)) });
    if (!choice) return [];
    return [{ kind: observations.length ? 'daily' : 'start', title: `ฝึก${course.title} · บท ${Number(course.lessonId.slice(1))}`, description: choice.reason, href: `/practice/${course.lessonId}/${course.skill}/basic`, action: 'เริ่มรอบแนะนำ', activityAt: Math.max(0, ...[...state.attempts, ...observations].map(a => Date.parse(a.submittedAt))) }];
  });
  return candidates.sort((a, b) => Number(b.kind === 'resume') - Number(a.kind === 'resume') || b.activityAt - a.activityAt)[0] ?? null;
}
