export type DiscoveryVisual = { version: string } & (
  | { kind: 'scene'; image: string; alt: string; caption: string; time: string | null; cue: 'none' | 'unclear-name' | 'write-name' | 'spelled-name' }
  | { kind: 'identity'; role: string; givenName: string; familyName: string | null }
  | { kind: 'introduction'; selfName: string; otherName: string }
  | { kind: 'origin'; person: string; role: string; country: 'TH' | 'DE' }
);
export type DiscoveryTask = {
  id: string;
  targetId: string;
  objectiveId: string;
  sourceExampleId: string;
  context: string;
  visual: DiscoveryVisual;
  prompt: string;
  promptTh: string;
  answer: string;
  answerTh: string;
  explanation: string;
  wordHelp: boolean;
  difficulty: number;
  difficultyRationale: string;
  assistance: string[];
} & ({ kind: 'choice'; subskill: 'phrase_dialogue_response'; options: string[] }
  | { kind: 'order'; subskill: 'phrase_word_order'; tokens: string[] }
  | { kind: 'letters'; subskill: 'name_letter_order'; tokens: string[]; listening: { version: 'name-listening-v1'; targetId: 'L01-SUP-S02-listening-target'; subskill: 'name_letter_listening'; audioText: string; audioSource: string; difficulty: number; difficultyRationale: string; assistance: string[] } });
export type DiscoveryTopic = { introducedIn: 1 | 2; id: string; title: string; note: string; tasks: DiscoveryTask[] };
export type DiscoveryStep = { kind: 'model'; topic: DiscoveryTopic } | { kind: 'task'; topic: DiscoveryTopic; task: DiscoveryTask };
export type DiscoveryListening = { version: 'name-listening-v1'; targetId: 'L01-SUP-S02-listening-target'; subskill: 'name_letter_listening'; completedPlays: number };
export type DiscoveryAttempt = { response: string; correct: boolean; submittedAt: string; helpWords: string[]; modelSeen: boolean; assistance: string[] | null; visualContext: string | null; listening: DiscoveryListening | null };
export type DiscoveryResponse = { selection: number[]; helpWords: string[]; audioPlays?: number; first: DiscoveryAttempt | null };
export type DiscoveryScope = 'all' | 'supplement';
export type DiscoveryRun = { bankVersion: 1 | 2; scope: DiscoveryScope; id: string; step: number; modelIds: string[]; responses: Record<string, DiscoveryResponse>; completed: boolean };
export type DiscoveryHistory = { version: 1; runs: DiscoveryRun[] };
export function taughtDiscoveryItemIds(topic: DiscoveryTopic, items: readonly { id: string; lessonId: string; skill: string; answer: string }[]): string[] {
  const taught = new Set(topic.tasks.flatMap(task => [task.prompt, task.answer])
    .flatMap(text => [text, ...text.split(/(?<=[.!?])\s+/)]));
  const explanationExamples = topic.note.split('\n').map(line => line.split(' = ')[0].split(': ').at(-1));
  return items.filter(item => item.lessonId === 'L01' && item.skill === 'phrases' && (taught.has(item.answer) || explanationExamples.includes(item.answer))).map(item => item.id);
}
export const phraseDiscoveryKey = 'deutsch-trainer-phrase-discovery-v1-L01';
export const emptyDiscoveryResponse = (): DiscoveryResponse => ({ selection: [], helpWords: [], first: null });
export function discoverySteps(topics: readonly DiscoveryTopic[], bank: Pick<DiscoveryRun, 'bankVersion' | 'scope'> = { bankVersion: 2, scope: 'all' }): DiscoveryStep[] {
  return topics.filter(topic => topic.introducedIn <= bank.bankVersion && (bank.scope === 'all' || topic.introducedIn === 2))
    .flatMap(topic => [{ kind: 'model', topic }, ...topic.tasks.map(task => ({ kind: 'task', topic, task } satisfies DiscoveryStep))] satisfies DiscoveryStep[]);
}
export function newDiscoveryRun({ scope = 'all' }: { scope?: DiscoveryScope } = {}): DiscoveryRun {
  return { bankVersion: 2, scope, id: `l01-dialogue-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, step: 0, modelIds: [], responses: {}, completed: false };
}
export function discoveryAnswer(task: DiscoveryTask, selection: number[]): string {
  switch (task.kind) {
    case 'choice': return task.options[selection[0]] ?? '';
    case 'order': return selection.map(index => task.tokens[index]).join(' ');
    case 'letters': return selection.length ? selection.map(index => task.tokens[index]).join('-') + '.' : '';
    default: { const exhaustive: never = task; return exhaustive; }
  }
}
export function canCheckDiscovery(task: DiscoveryTask, selection: number[]): boolean {
  return task.kind === 'choice' ? selection.length === 1 : selection.length === task.tokens.length;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(entry => typeof entry === 'string');
}
export function parseDiscoveryHistory(raw: string | null, topics: readonly DiscoveryTopic[]): DiscoveryHistory {
  if (!raw) return { version: 1, runs: [] };
  const value: unknown = JSON.parse(raw);
  if (!record(value) || value.version !== 1 || !Array.isArray(value.runs)) throw new Error('Invalid discovery history');
  const runs: DiscoveryRun[] = [];
  for (const candidate of value.runs) {
    if (!record(candidate)) throw new Error('Invalid discovery run');
    const bankVersion = candidate.bankVersion === undefined ? 1 : candidate.bankVersion;
    const scope = candidate.scope === undefined ? 'all' : candidate.scope;
    if ((bankVersion !== 1 && bankVersion !== 2) || (scope !== 'all' && scope !== 'supplement') || (bankVersion === 1 && scope !== 'all')) throw new Error('Invalid discovery bank');
    const steps = discoverySteps(topics, { bankVersion, scope });
    const availableTopics = topics.filter(topic => topic.introducedIn <= bankVersion && (scope === 'all' || topic.introducedIn === 2));
    const tasks = availableTopics.flatMap(topic => topic.tasks);
    if (typeof candidate.id !== 'string' || runs.some(run => run.id === candidate.id)
      || typeof candidate.step !== 'number' || !Number.isInteger(candidate.step) || candidate.step < 0 || candidate.step > steps.length
      || typeof candidate.completed !== 'boolean' || !strings(candidate.modelIds) || !record(candidate.responses)
      || candidate.modelIds.some(id => !availableTopics.some(topic => topic.id === id))) throw new Error('Invalid discovery run');
    const responses: DiscoveryRun['responses'] = {};
    for (const [id, input] of Object.entries(candidate.responses)) {
      const task = tasks.find(entry => entry.id === id);
      if (!task || !record(input) || !Array.isArray(input.selection) || !strings(input.helpWords)) throw new Error('Invalid discovery response');
      const size = task.kind === 'choice' ? task.options.length : task.tokens.length;
      const selection: number[] = [];
      for (const index of input.selection) {
        if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= size || selection.includes(index)) throw new Error('Invalid discovery selection');
        selection.push(index);
      }
      if (task.kind === 'choice' && selection.length > 1) throw new Error('Invalid discovery choice');
      const audioPlays = input.audioPlays ?? 0;
      if (typeof audioPlays !== 'number' || !Number.isInteger(audioPlays) || audioPlays < 0) throw new Error('Invalid audio count');
      let first: DiscoveryAttempt | null = null;
      if (input.first !== null) {
        const attempt = input.first;
        if (!record(attempt) || typeof attempt.response !== 'string' || typeof attempt.correct !== 'boolean'
          || typeof attempt.submittedAt !== 'string' || !Number.isFinite(Date.parse(attempt.submittedAt))
          || !strings(attempt.helpWords) || typeof attempt.modelSeen !== 'boolean'
          || (attempt.assistance != null && !strings(attempt.assistance))
          || (attempt.visualContext != null && typeof attempt.visualContext !== 'string')
          || !canCheckDiscovery(task, selection) || attempt.response !== discoveryAnswer(task, selection)
          || attempt.correct !== (attempt.response === task.answer)) throw new Error('Invalid first response');
        let listening: DiscoveryListening | null = null;
        if (attempt.listening != null) {
          const audio = attempt.listening;
          if (!record(audio) || task.kind !== 'letters' || audio.version !== 'name-listening-v1' || audio.targetId !== 'L01-SUP-S02-listening-target' || audio.subskill !== 'name_letter_listening' || typeof audio.completedPlays !== 'number' || !Number.isInteger(audio.completedPlays) || audio.completedPlays < 1 || audio.completedPlays > audioPlays) throw new Error('Invalid listening evidence');
          listening = {version: audio.version, targetId: audio.targetId, subskill: audio.subskill, completedPlays: audio.completedPlays};
        }
        first = { listening, response: attempt.response, correct: attempt.correct, submittedAt: attempt.submittedAt, helpWords: attempt.helpWords, modelSeen: attempt.modelSeen, assistance: strings(attempt.assistance) ? attempt.assistance : null, visualContext: typeof attempt.visualContext === 'string' ? attempt.visualContext : null };
      }
      responses[id] = { selection, helpWords: input.helpWords, audioPlays, first };
    }
    const modelIds = candidate.modelIds;
    // A saved position cannot skip learning or an unanswered task.
    for (const step of steps.slice(0, candidate.step)) {
      if (step.kind === 'model' ? !modelIds.includes(step.topic.id) : !responses[step.task.id]?.first) throw new Error('Incomplete discovery history');
    }
    if (candidate.completed !== (candidate.step === steps.length)) throw new Error('Invalid completion');
    runs.push({ bankVersion, scope, id: candidate.id, step: candidate.step, modelIds, responses, completed: candidate.completed });
  }
  return { version: 1, runs };
}
