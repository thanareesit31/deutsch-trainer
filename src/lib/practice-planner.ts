export const l13PracticeTopics = [
  { id: 'L13-es-gibt-akkusativ', title: 'Es gibt + Akkusativ', href: '/practice/L13/grammar/es-gibt', storage: 'es-gibt', frame: 'es-gibt' },
  { id: 'L13-dativ-pronomen', title: 'Personalpronomen im Dativ', href: '/practice/L13/grammar/dativ-pilot', storage: 'dativ', frame: 'dative' },
  { id: 'L13-verben-mit-dativ', title: 'Verben', href: '/practice/L13/grammar/verbs', storage: 'verbs', frame: 'verbs' },
];

export const l13VocabularyTopics = [
  { id: 'L13-vocab-urban', title: 'สถานที่ในเมือง', href: '/practice/L13/vocabulary/urban', storage: 'vocab-urban', frame: 'vocab-urban' },
  { id: 'L13-vocab-culture', title: 'ร้านค้าและวัฒนธรรม', href: '/practice/L13/vocabulary/culture', storage: 'vocab-culture', frame: 'vocab-culture' },
  { id: 'L13-vocab-leisure', title: 'สันทนาการและธรรมชาติ', href: '/practice/L13/vocabulary/leisure', storage: 'vocab-leisure', frame: 'vocab-leisure' },
  { id: 'L13-vocab-extra', title: 'คำศัพท์เพิ่มเติม', href: '/practice/L13/vocabulary/extra', storage: 'vocab-extra', frame: 'vocab-extra' },
];

export const l13PhraseTopics = [
  { id:'L13-phrases-rating', title:'แสดงความคิดเห็นต่อสถานที่', href:'/practice/L13/phrases/rating', storage:'phrases-rating', frame:'phrases-rating' },
  { id:'L13-phrases-city', title:'สิ่งที่มีในเมือง', href:'/practice/L13/phrases/city', storage:'phrases-city', frame:'phrases-city' },
  { id:'L13-phrases-favorite', title:'สถานที่โปรด', href:'/practice/L13/phrases/favorite', storage:'phrases-favorite', frame:'phrases-favorite' },
  { id:'L13-phrases-opinions', title:'ถามและแลกเปลี่ยนความคิดเห็น', href:'/practice/L13/phrases/opinions', storage:'phrases-opinions', frame:'phrases-opinions' },
];
export const l14PhrasePracticeTopics = [
  { href: '/practice/L14/phrases/ask', storage: 'phrase-l14-ask', frame: 'phrase-l14-ask' },
  { href: '/practice/L14/phrases/describe', storage: 'phrase-l14-describe', frame: 'phrase-l14-describe' },
  { href: '/practice/L14/phrases/unknown', storage: 'phrase-l14-unknown', frame: 'phrase-l14-unknown' },
  { href: '/practice/L14/phrases/thanks', storage: 'phrase-l14-thanks', frame: 'phrase-l14-thanks' },
  { href: '/practice/L14/phrases/basic', storage: 'phrase-l14-basic', frame: 'phrase-l14-basic' },
  { href: '/practice/L14/phrases/daily', storage: 'phrase-l14-daily', frame: 'phrase-l14-daily' },
  { href: '/practice/L14/phrases/mixed', storage: 'phrase-l14-mixed', frame: 'phrase-l14-mixed' },
];
export type L13PracticeSkill = 'grammar' | 'vocabulary' | 'phrases';
export function l13PracticeSkill(href: string): L13PracticeSkill {
  return href.includes('/phrases/') ? 'phrases' : href.includes('/vocabulary/') ? 'vocabulary' : 'grammar';
}
const practiceSkillName = { grammar:'ไวยากรณ์', vocabulary:'คำศัพท์', phrases:'ประโยคและสำนวน' };
export const l13PracticeStores = [
  ...l13PracticeTopics,
  { href: '/practice/L13/grammar/basic', storage: 'grammar-basic', frame: 'grammar-basic' },
  { href: '/practice/L13/grammar/daily', storage: 'daily', frame: 'daily' },
  { href: '/practice/L14/grammar/basic', storage: 'l14-grammar', frame: 'l14-grammar' },
  { href: '/practice/L14/grammar/daily', storage: 'l14-grammar-daily', frame: 'l14-grammar-daily' },
  { href: '/practice/L14/grammar/lokale-praepositionen', storage: 'l14-lokale-praepositionen', frame: 'l14-lokale-praepositionen' },
  { href: '/practice/L14/grammar/wo-dativ', storage: 'l14-wo-dativ', frame: 'l14-wo-dativ' },
  ...l13VocabularyTopics,
  ...l13PhraseTopics,
  ...l14PhrasePracticeTopics,
  { href:"/practice/L13/phrases/basic",storage:"phrases-basic",frame:"phrases-basic" },
  { href:"/practice/L13/phrases/daily",storage:"phrases-daily",frame:"phrases-daily" },
  { href: '/practice/L13/vocabulary/basic', storage: 'vocab-basic', frame: 'vocab-basic' },
  { href: '/practice/L13/vocabulary/daily', storage: 'vocab-daily', frame: 'vocab-daily' },
];

type PracticeQuestion = { id: string; topicId: string; subskill: string; kind: 'choice' | 'cloze' | 'order' | 'write'; phraseItemIds: string[]; targetIds: string[] };
type PracticeResult = { correct: boolean | null; submittedAt: number; assisted: boolean | null; confidence: string | null };
export type PracticeHistory = {
  id: string; href: string; createdAt: number; completed: boolean; archived: boolean; position: number; hasDraft: boolean;
  items: { question: PracticeQuestion; result: PracticeResult | null }[];
};

function isPlannerRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parsePlannerQuestion(value: unknown): PracticeQuestion | null {
  if (!isPlannerRecord(value) || typeof value.id !== 'string' || typeof value.topicId !== 'string' || typeof value.subskill !== 'string') return null;
  if (value.kind !== 'choice' && value.kind !== 'cloze' && value.kind !== 'order' && value.kind !== 'write') return null;
  const phraseItemIds = value.topicId.startsWith('L13-phrases-') || value.topicId.startsWith('L14-phrases-')
    ? Array.isArray(value.coverageItemIds) && value.coverageItemIds.length > 0 && value.coverageItemIds.every((id: unknown) => typeof id === 'string')
      ? value.coverageItemIds
      : Array.isArray(value.requiredItemIds) && value.requiredItemIds.every((id: unknown) => typeof id === 'string')
      ? value.requiredItemIds
      : typeof value.itemId === 'string' ? [value.itemId] : [value.id.replace(/-(context|completion|order|dialogue)$/, '')]
    : [];
  const targetIds = Array.isArray(value.targetIds) && value.targetIds.every((id: unknown) => typeof id === 'string')
    ? value.targetIds
    : typeof value.targetId === 'string' ? [value.targetId]
    : typeof value.itemId === 'string' ? [value.itemId]
    : phraseItemIds;
  return { id: value.id, topicId: value.topicId, subskill: value.subskill, kind: value.kind, phraseItemIds, targetIds };
}

export function parsePracticeHistory(raw: string | null, href: string): PracticeHistory[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!isPlannerRecord(value) || value.version !== 1 || !Array.isArray(value.sessions)) throw new Error('Invalid practice history');
  return value.sessions.map((session: unknown) => {
    if (!isPlannerRecord(session) || typeof session.id !== 'string' || typeof session.createdAt !== 'string' || !Number.isFinite(Date.parse(session.createdAt)) || typeof session.completed !== 'boolean' || typeof session.position !== 'number' || !Number.isInteger(session.position) || !Array.isArray(session.items) || session.items.length === 0 || session.position < 0 || session.position >= session.items.length) throw new Error('Invalid practice session');
    const items = session.items.map((item: unknown) => {
      if (!isPlannerRecord(item)) throw new Error('Invalid practice item');
      const parsedQuestion = parsePlannerQuestion(item.question);
      if (!parsedQuestion) throw new Error('Invalid practice question');
      let result: PracticeResult | null = null;
      if (item.attempt !== null && item.attempt !== undefined) {
        const attempt = item.attempt;
        if (!isPlannerRecord(attempt) || (typeof attempt.correct !== 'boolean' && !(parsedQuestion.kind === 'write' && attempt.correct === null && attempt.selfAssessed === true)) || typeof attempt.submittedAt !== 'string' || !Number.isFinite(Date.parse(attempt.submittedAt))) throw new Error('Invalid practice attempt');
        result = { correct: attempt.correct, submittedAt: Date.parse(attempt.submittedAt), assisted: item.hintUsed === true || item.translationUsed === true || attempt.translationUsed === true ? true : typeof item.translationUsed === 'boolean' || typeof attempt.translationUsed === 'boolean' ? false : null, confidence: typeof attempt.confidence === 'string' ? attempt.confidence : null };
      }
      return { question: parsedQuestion, result };
    });
    const hasDraft = session.items.some(item => isPlannerRecord(item) && (
      typeof item.response === 'string' && item.response.length > 0 ||
      Array.isArray(item.selected) && item.selected.length > 0 ||
      Array.isArray(item.rubricChecks) && item.rubricChecks.length > 0 ||
      item.hintUsed === true || item.translationUsed === true
    ));
    return { id: session.id, href, createdAt: Date.parse(session.createdAt), completed: session.completed, archived: session.archived === true, position: session.position, hasDraft, items };
  });
}

export function resumablePracticeSession(history: readonly PracticeHistory[]) {
  return [...history].filter(session => !session.completed && !session.archived && (session.position > 0 || session.hasDraft || session.items.some(item => item.result))).sort((a, b) => b.createdAt - a.createdAt)[0];
}

export function practiceStorageKey(storage: string, frame: string, userId: string) {
  const lessonPrefix = storage.startsWith('l14-') ? '' : 'l13-';
  return `deutsch-trainer:review-prototype:${lessonPrefix}${storage}:v1:${frame}-account-${userId}`;
}

export function readL13PracticeHistory(userId: string, storage: Pick<Storage, 'getItem'>, skill?: L13PracticeSkill): PracticeHistory[] {
  return l13PracticeStores.filter(entry => !skill || entry.href.includes('/'+skill+'/')).flatMap(entry => parsePracticeHistory(storage.getItem(practiceStorageKey(entry.storage, entry.frame, userId)), entry.href));
}

export function planDailyPractice(rawQuestions: readonly unknown[], history: readonly PracticeHistory[], now: number = Date.now()) {
  const questions = rawQuestions.map(parsePlannerQuestion).filter(q => q !== null);
  const eligibleTopics = new Set(questions.map(q => q.topicId));
  const latest = new Map<string, { question: PracticeQuestion; result: PracticeResult }>();
  for (const session of history) for (const item of session.items) {
    if (eligibleTopics.has(item.question.topicId) && item.result && (!latest.has(item.question.id) || item.result.submittedAt > (latest.get(item.question.id)?.result.submittedAt ?? 0))) latest.set(item.question.id, { question: item.question, result: item.result });
  }
  const practicedTopics = new Set([...latest.values()].map(item => item.question.topicId));
  const seen = new Set(history.flatMap(session => session.items.map(item => item.question.id)));
  const sameSkill = (a: PracticeQuestion, b: PracticeQuestion) => a.topicId === b.topicId && a.subskill === b.subskill && a.targetIds.some(id => b.targetIds.includes(id));
  const evidence = [...latest.values()];
  const weak = evidence.filter(item => item.result.correct === false || item.result.assisted || item.result.confidence === 'guess');
  const eligible = questions.filter(q => practicedTopics.size === 0 || practicedTopics.has(q.topicId));
  const score = (q: PracticeQuestion) => {
    const previous = latest.get(q.id);
    const needsPractice = weak.some(item => sameSkill(q, item.question));
    let value = needsPractice ? 60 : 0;
    if (!seen.has(q.id)) value += 25;
    if (previous && now - previous.result.submittedAt >= 3 * 86400000) value += 35;
    if (previous && previous.result.correct === false) value += 15;
    if (previous && previous.result.correct === true && now - previous.result.submittedAt < 86400000) value -= 30;
    return value;
  };
  const ranked = eligible.map((q, index) => ({ q, index, score: score(q) })).sort((a, b) => b.score - a.score || a.index - b.index);
  const selected: PracticeQuestion[] = [];
  const topicUses = new Map<string, number>();
  const kindUses = new Map<string, number>();
  const phraseItems = new Set<string>();
  const selectedTargets = new Set<string>();
  const count = Math.min(10, ranked.length);
  while (selected.length < count) {
    ranked.sort((a, b) => (b.score - (topicUses.get(b.q.topicId) ?? 0) * 12 - (kindUses.get(b.q.kind) ?? 0) * 8) - (a.score - (topicUses.get(a.q.topicId) ?? 0) * 12 - (kindUses.get(a.q.kind) ?? 0) * 8) || a.index - b.index);
    const nextIndex = ranked.findIndex(item => !item.q.targetIds.some(id => selectedTargets.has(id)));
    const [next] = nextIndex < 0 ? [] : ranked.splice(nextIndex, 1);
    if (!next) break;
    selected.push(next.q);
    next.q.phraseItemIds.forEach(id => phraseItems.add(id));
    next.q.targetIds.forEach(id => selectedTargets.add(id));
    for (let index = ranked.length - 1; index >= 0; index--) {
      if (ranked[index].q.phraseItemIds.some(id => phraseItems.has(id)) || ranked[index].q.targetIds.some(id => selectedTargets.has(id))) ranked.splice(index, 1);
    }
    topicUses.set(next.q.topicId, (topicUses.get(next.q.topicId) ?? 0) + 1);
    kindUses.set(next.q.kind, (kindUses.get(next.q.kind) ?? 0) + 1);
  }
  const focus = weak.sort((a, b) => b.result.submittedAt - a.result.submittedAt)[0];
  const title = focus ? [...l13PracticeTopics, ...l13VocabularyTopics, ...l13PhraseTopics].find(topic => topic.id === focus.question.topicId)?.title ?? 'ไวยากรณ์บท 13' : 'ไวยากรณ์บท 13';
  const reason = focus ? `${focus.question.subskill === 'phrase_context' ? 'ลองเลือกประโยคตามสถานการณ์' : focus.question.subskill === 'phrase_match' ? 'ลองจับคู่คำถามกับคำตอบ' : focus.question.subskill === 'phrase_dialogue' ? 'ลองเรียงบทสนทนา' : focus.question.subskill === 'vocabulary_article' ? 'ลองฝึกเลือก Artikel' : focus.question.subskill === 'vocabulary_meaning' ? 'ลองฝึกจำความหมาย' : focus.question.kind === 'cloze' ? 'ลองฝึกพิมพ์คำตอบเอง' : focus.question.kind === 'order' ? 'ลองฝึกเรียงประโยค' : 'กลับมาฝึกเลือกคำ'}ในเรื่อง ${title} อีกนิด พร้อมทบทวนสิ่งที่เคยฝึก` : 'ทบทวนสิ่งที่เคยฝึก โดยเลือกข้อที่ยังไม่เคยเจอก่อน';
  return { questionIds: selected.map(q => q.id), reason, evidenceCount: latest.size };
}

export function recommendPractice(rawQuestions: readonly unknown[], history: readonly PracticeHistory[], now: number = Date.now()) {
  const pending = resumablePracticeSession(history);
  if(pending) return {kind:'resume',title:'ทำต่อจากครั้งก่อน',description:practiceSkillName[l13PracticeSkill(pending.href)]+'บท 13 · ข้อ '+(pending.position+1)+' จาก '+pending.items.length,href:pending.href+'?resume='+encodeURIComponent(pending.id),action:'ฝึกต่อ'};
  const latest = history.flatMap(session=>session.items.filter(item=>item.result).map(item=>({skill:l13PracticeSkill(session.href),time:item.result?.submittedAt??0}))).sort((a,b)=>b.time-a.time)[0];
  const skill = latest?.skill ?? (rawQuestions.some(q=>isPlannerRecord(q)&&typeof q.topicId==='string'&&q.topicId.startsWith('L13-phrases-')) ? 'phrases' : rawQuestions.some(q=>isPlannerRecord(q)&&typeof q.topicId==='string'&&q.topicId.startsWith('L13-vocab-')) ? 'vocabulary' : 'grammar');
  const pool=rawQuestions.filter(q=>isPlannerRecord(q)&&typeof q.topicId==='string'&&(skill==='phrases'?q.topicId.startsWith('L13-phrases-'):skill==='vocabulary'?q.topicId.startsWith('L13-vocab-'):!q.topicId.startsWith('L13-vocab-')&&!q.topicId.startsWith('L13-phrases-')));
  const plan=planDailyPractice(pool,history,now);
  return {kind:plan.evidenceCount?'daily':'start',title:plan.evidenceCount?(skill==='grammar'?'ฝึกต่อวันนี้':'ฝึก'+practiceSkillName[skill]+'ต่อวันนี้'):'เริ่มฝึก'+practiceSkillName[skill]+'บท 13',description:plan.evidenceCount?plan.reason:skill==='grammar'?'ฝึก 3 หัวข้อต่อเนื่อง หัวข้อละ 5 ข้อ เริ่มจากสิ่งที่เรียนมา':skill==='phrases'?'ฝึก 4 หัวข้อ หัวข้อละ 5 ข้อ เริ่มจากเลือกตอบ จับคู่ แล้วเรียงคำเป็นประโยค':'ฝึกความหมาย Artikel และการพิมพ์ จากคำที่เรียนแล้ว',href:'/practice/L13/'+skill+'/'+(plan.evidenceCount?'daily':'basic'),action:plan.evidenceCount?'เริ่มฝึก '+plan.questionIds.length+' ข้อ':skill==='grammar'?'เริ่มฝึก 15 ข้อ':'ทำแบบฝึกหัด'};
}
