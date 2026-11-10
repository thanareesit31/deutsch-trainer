export type DialogueVisual = { kind: 'image'; src: string; alt: string; caption: string } | { kind: 'facts'; rows: [string, string][] } | { kind: 'reading'; text: string } | { kind: 'board'; theme: 'family' | 'price' | 'object' | 'phone' | 'ability' | 'calendar' | 'menu' | 'transport' | 'timeline' | 'celebration'; title: string; rows: [string, string][] } | { kind: 'clock'; hour: number; minute: number };
export type DialogueUnit = { nounLabel?: string; id: string; targetId: string; subskill: 'phrase_dialogue_response' | 'phrase_word_order' | 'age_listening' | 'phone_digit_listening' | 'person_detail_reading' | 'current_vs_dream_meaning' | 'detail_listening' | 'information_reading' | 'email_listening' | 'word_spelling_listening' | 'price_listening'; difficulty: number; rationale: string; answer: string; meaning: string };
type Common = { id: string; prompt: string; promptMeaning: string; visual: DialogueVisual | null; audio: string | null; feedbackAudio?: string; feedbackDialogue?: { question: DialogueAnnotatedPart[][]; reply: DialogueAnnotatedPart[][] }; answerSentences?: DialogueAnnotatedPart[][]; responseSpeaker?: 'A'|'B'; explanation: string; assistance: string[] };
export type DialogueTask = Common & (
  | { kind: 'choice'; unit: DialogueUnit; options: string[] }
  | { kind: 'order'; unit: DialogueUnit; tokens: string[] }
  | { kind: 'digits'; unit: DialogueUnit; maxLength: number; label: string }
  | { kind: 'text'; unit: DialogueUnit; maxLength: number; label: string }
  | { kind: 'profile'; fields: { label: string; unit: DialogueUnit }[] }
);
export type DialogueTeaching = { focus: string[]; structure: string[] };
export type DialogueAnnotatedPart = { text: string; role: 'time' | 'sequence' | 'auxiliary' | 'subject' | 'other' | 'participle' | 'verb' | 'question'; label: string; position?: string };
export type DialoguePatternPart = { text: string; role: 'question' | 'subject' | 'auxiliary' | 'other' | 'participle'; position?: string };
export type DialogueGrammarPattern = { id: string; title: string; present: string; past: string; presentMeaning: string; pastMeaning: string; parts: DialoguePatternPart[]; presentParts: DialogueAnnotatedPart[]; pastParts: DialogueAnnotatedPart[]; structure: string[]; audio: string };
export type DialogueTopic = { id: string; objective: string; title: string; modelVisual: DialogueVisual; note: string[]; audio: string; grammarPatterns?: DialogueGrammarPattern[]; models: { visual?: DialogueVisual; audio?: string; teachingIntro?: string[]; question: string; reply: string; questionMeaning: string; replyMeaning: string; questionTeaching?: DialogueTeaching; replyTeaching?: DialogueTeaching; questionSentences?: DialogueAnnotatedPart[][]; replySentences?: DialogueAnnotatedPart[][] }[]; legacyIds: string[]; tasks: DialogueTask[] };
export type DialogueEvidence = { targetId: string; subskill: DialogueUnit['subskill']; difficulty: number; response: string; correct: boolean; submittedAt: string; assistance: string[]; helpWords: string[]; completedPlays: number; presentation: string };
export type DialogueResponse = { selection: number[]; text: string; fields: Record<string, string>; helpWords: string[]; plays: number; first: Record<string, DialogueEvidence> | null };
export type DialogueRun = { id: string; queue: string[]; step: number; models: string[]; responses: Record<string, DialogueResponse> };
export type DialogueHistory = { version: 1; runs: DialogueRun[] };
export const dialogueStorageKey = (lessonId: string) => `deutsch-trainer-phrase-discovery-v1-${lessonId}`;
export const emptyDialogueResponse = (): DialogueResponse => ({ selection: [], text: '', fields: {}, helpWords: [], plays: 0, first: null });
export function dialogueQueue(topics: readonly DialogueTopic[]) { return topics.flatMap(topic => [`model:${topic.id}`, ...topic.tasks.map(task => task.id)]); }
export function newDialogueRun(topics: readonly DialogueTopic[]): DialogueRun { return { id: crypto.randomUUID(), queue: dialogueQueue(topics), step: 0, models: [], responses: {} }; }
export const dialogueUnits = (task: DialogueTask) => task.kind === 'profile' ? task.fields.map(field => field.unit) : [task.unit];
export function dialogueAnswer(task: DialogueTask, response: DialogueResponse, unit: DialogueUnit) {
  switch (task.kind) {
    case 'choice': return task.options[response.selection[0]] ?? '';
    case 'order': return response.selection.map(index => task.tokens[index]).join(' ');
    case 'text': return response.text.trim();
    case 'digits': return response.text.replace(/[\s()-]/g, '');
    case 'profile': return response.fields[unit.id]?.trim() ?? '';
  }
}
export function canCheckDialogue(task: DialogueTask, response: DialogueResponse) {
  if (task.audio && response.plays === 0) return false;
  if (task.kind === 'choice') return response.selection.length === 1;
  if (task.kind === 'order') return response.selection.length === task.tokens.length;
  if (task.kind === 'text') return !!response.text.trim();
  if (task.kind === 'digits') return /^\d+$/.test(dialogueAnswer(task, response, task.unit));
  return task.fields.every(field => !!response.fields[field.unit.id]?.trim());
}
export function gradeDialogue(task: DialogueTask, response: DialogueResponse, now: string, presentation = 'l02-dialogue-v1'): Record<string, DialogueEvidence> {
  if (!canCheckDialogue(task, response)) throw Error('Incomplete response');
  return Object.fromEntries(dialogueUnits(task).map(unit => { const answer = dialogueAnswer(task, response, unit); return [unit.id, { targetId: unit.targetId, subskill: unit.subskill, difficulty: unit.difficulty, response: answer, correct: answer.toLocaleLowerCase('de') === unit.answer.toLocaleLowerCase('de'), submittedAt: now, assistance: [...task.assistance], helpWords: [...response.helpWords], completedPlays: response.plays, presentation } satisfies DialogueEvidence]; }));
}
function object(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function strings(value: unknown): value is string[] { return Array.isArray(value) && value.every(v => typeof v === 'string'); }
function integer(value: unknown): value is number { return typeof value === 'number' && Number.isInteger(value) && value >= 0; }
export function parseDialogueHistory(raw: string | null, topics: readonly DialogueTopic[], presentation = 'l02-dialogue-v1'): DialogueHistory {
  if (!raw) return { version: 1, runs: [] };
  const data: unknown = JSON.parse(raw);
  if (!object(data) || data.version !== 1 || !Array.isArray(data.runs)) throw Error('Invalid history');
  const queue = dialogueQueue(topics), tasks = topics.flatMap(topic => topic.tasks), runs: DialogueRun[] = [];
  for (const value of data.runs) {
    if (!object(value) || typeof value.id !== 'string' || runs.some(r => r.id === value.id) || !strings(value.queue) || JSON.stringify(value.queue) !== JSON.stringify(queue) || !integer(value.step) || value.step > queue.length || !strings(value.models) || value.models.some(id => !topics.some(t => t.id === id)) || !object(value.responses)) throw Error('Invalid run');
    const responses: DialogueRun['responses'] = {};
    for (const [id, saved] of Object.entries(value.responses)) {
      const task = tasks.find(t => t.id === id);
      if (!task || !object(saved) || !Array.isArray(saved.selection) || !strings(saved.helpWords) || typeof saved.text !== 'string' || !integer(saved.plays) || !object(saved.fields) || !Object.values(saved.fields).every(v => typeof v === 'string')) throw Error('Invalid response');
      const selection: number[] = [], size = task.kind === 'choice' ? task.options.length : task.kind === 'order' ? task.tokens.length : 0;
      for (const index of saved.selection) { if (!integer(index) || index >= size || selection.includes(index)) throw Error('Invalid selection'); selection.push(index); }
      if (task.kind === 'choice' && selection.length > 1) throw Error('Invalid choice');
      const fields: Record<string, string> = {}; for (const [key, entry] of Object.entries(saved.fields)) { if (typeof entry !== 'string') throw Error('Invalid field'); fields[key] = entry; }
      const response: DialogueResponse = { selection, text: saved.text, fields, helpWords: saved.helpWords, plays: saved.plays, first: null };
      if (saved.first !== null) {
        if (!object(saved.first) || !canCheckDialogue(task, response) || Object.keys(saved.first).length !== dialogueUnits(task).length) throw Error('Invalid evidence');
        const first: Record<string, DialogueEvidence> = {};
        for (const unit of dialogueUnits(task)) {
          const e = saved.first[unit.id];
          if (!object(e) || e.targetId !== unit.targetId || e.subskill !== unit.subskill || e.difficulty !== unit.difficulty || typeof e.response !== 'string' || typeof e.correct !== 'boolean' || typeof e.submittedAt !== 'string' || !Number.isFinite(Date.parse(e.submittedAt)) || !strings(e.assistance) || !strings(e.helpWords) || !integer(e.completedPlays) || e.completedPlays > response.plays || e.presentation !== presentation || (task.audio && e.completedPlays < 1) || e.response !== dialogueAnswer(task, response, unit) || e.correct !== (e.response.toLocaleLowerCase('de') === unit.answer.toLocaleLowerCase('de'))) throw Error('Invalid evidence');
          first[unit.id] = {targetId: unit.targetId, subskill: unit.subskill, difficulty: unit.difficulty, response: e.response, correct: e.correct, submittedAt: e.submittedAt, assistance: e.assistance, helpWords: e.helpWords, completedPlays: e.completedPlays, presentation: e.presentation};
        }
        response.first = first;
      }
      responses[id] = response;
    }
    for (const id of queue.slice(0, value.step)) { if (id.startsWith('model:') ? !value.models.includes(id.slice(6)) : !responses[id]?.first) throw Error('Skipped step'); }
    runs.push({ id: value.id, queue: value.queue, step: value.step, models: value.models, responses });
  }
  return { version: 1, runs };
}
