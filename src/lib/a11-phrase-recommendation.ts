import inventory from '../../docs/exercise-mapping/a11-phrase-bank.json';
import extensions from '../../docs/exercise-mapping/l01-l13-practice-extensions.json';
import { planDailyPractice, readL13PracticeHistory, resumablePracticeSession } from './practice-planner';

export function recommendA11PhrasePractice(userId: string, storage: Pick<Storage, 'getItem'>, learnedIds: readonly string[]) {
  const learned = new Set(learnedIds);
  const history = readL13PracticeHistory(userId, storage, 'phrases');
  const candidates = inventory.lessons.flatMap(lesson => {
    const questions = [...inventory.definitions.filter(q => q.lessonId === lesson.lessonId), ...(extensions.find(packet => packet.lessonId === lesson.lessonId)?.questions ?? [])].filter(q => learned.has(q.targetId));
    if (!questions.length) return [];
    const knownIds = new Set(questions.map(q => q.id));
    const sessions = history.filter(session => session.href.startsWith(`/practice/${lesson.lessonId}/phrases/`));
    const pending = resumablePracticeSession(sessions.filter(session => session.items.every(item => knownIds.has(item.question.id))));
    const activityAt = Math.max(0, ...sessions.map(session => session.createdAt), ...sessions.flatMap(session => session.items.map(item => item.result?.submittedAt ?? 0)));
    if (pending) return [{ kind: 'resume', title: `ฝึกประโยคบท ${Number(lesson.lessonId.slice(1))} ต่อ`, description: `กลับไปข้อ ${pending.position + 1} จาก ${pending.items.length} พร้อมคำตอบที่บันทึกไว้`, href: `${pending.href}?resume=${encodeURIComponent(pending.id)}`, action: 'ฝึกต่อ', activityAt }];
    const plan = planDailyPractice(questions, sessions);
    return [{ kind: plan.evidenceCount ? 'daily' : 'start', title: `ฝึกประโยคบท ${Number(lesson.lessonId.slice(1))}`, description: plan.evidenceCount ? plan.reason : 'เริ่มจากประโยคที่เรียนแล้ว', href: `/practice/${lesson.lessonId}/phrases/${plan.evidenceCount ? 'daily' : 'basic'}`, action: plan.evidenceCount ? 'เริ่มรอบแนะนำ' : 'เริ่มฝึก', activityAt }];
  });
  return candidates.sort((a, b) => Number(b.kind === 'resume') - Number(a.kind === 'resume') || b.activityAt - a.activityAt)[0] ?? null;
}
