import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const { sourceCatalog } = createRequire(import.meta.url)('../../src/lib/source-catalog.ts');
const root = new URL('../../', import.meta.url);
const read = async name => JSON.parse(await readFile(new URL(`docs/exercise-mapping/${name}.json`, root), 'utf8'));
const [audit, bank, provenance] = await Promise.all(['l13-dative-source-items', 'l13-dative-bank', 'l13-dative-provenance'].map(read));
const unique = (items, label) => assert.equal(new Set(items).size, items.length, `${label}: duplicate IDs`);
unique(audit.entries.map(x => x.id), 'source');
unique(bank.questions.map(x => x.id), 'question');
unique(provenance.bindings.map(x => x.questionId), 'binding');
for (const e of audit.entries) {
  assert(sourceCatalog[e.sourceId], `${e.id}: unknown source`);
  assert(Number.isInteger(e.printedPage) && e.printedPage > 0);
  assert(Number.isInteger(e.pdfPage) && e.pdfPage > 0 && e.pdfPage <= sourceCatalog[e.sourceId].pdfPageCount);
  assert(e.originalActivityId && e.reason && e.prerequisites.length);
  assert(['in_scope', 'partial', 'review_only', 'mechanic_only', 'adjacent_skill', 'exclude_from_pilot'].includes(e.decision));
  assert(audit.documents.some(d => d.sourceId === e.sourceId && d.pdfPage === e.pdfPage && d.printedPage === e.printedPage));
}
const topics = await readFile(new URL('src/lib/l13-l14-course.ts', root), 'utf8');
const sourceIds = new Set(audit.entries.map(x => x.id));
for (const q of bank.questions) {
  assert(q.version > 0 && q.explanation && q.hint && q.subskill && q.variantGroup);
  assert(q.difficulty >= 1 && q.difficulty <= 4);
  assert(topics.includes(`id: "${q.topicId}"`), `Unmapped topic ${q.topicId}`);
  for (const topic of q.requiredLearnedTopics) assert(topics.includes(`id: "${topic}"`));
  assert(q.acceptedAnswers.length > 0);
  assert(!/Grammatik aktiv|Das Training|printedPage|pdfPage|sourceId/.test(JSON.stringify(q)), 'Provenance leaked into bank');
  if (q.version === 3) {
    assert(!Object.hasOwn(q, 'context'), `${q.id}: separate context remains`);
    assert(!/[()]/.test(q.sentence), `${q.id}: person cue remains in brackets`);
    assert(q.sentence.indexOf('.') < q.sentence.indexOf('___'), `${q.id}: antecedent must be part of the question`);
    assert(!q.prompt.includes('วงเล็บ'), `${q.id}: stale instruction`);
  }
  if (q.kind === 'choice') {
    unique(q.options, q.id);
    assert.equal(q.options.filter(x => q.acceptedAnswers.includes(x)).length, 1);
    for (const option of q.options.filter(x => !q.acceptedAnswers.includes(x))) assert(q.knownErrors[option]);
  } else if (q.kind === 'cloze') {
    assert.equal(q.sentence.split('___').length, 2);
    assert(q.acceptedAnswers.every(x => /^\p{L}+$/u.test(x)));
  } else if (q.kind === 'order') {
    assert.equal(q.tokens.join(' ') + '.', q.acceptedAnswers[0]);
    assert.equal(q.subskill, 'order_supplied_dative_sentence');
    assert.equal(q.builtInSupport, 'all_words_supplied');
  } else assert.fail(`Unknown interaction ${q.kind}`);
  for (const answer of q.acceptedAnswers) assert(!Object.hasOwn(q.knownErrors, answer));
  const binding = provenance.bindings.find(x => x.questionId === q.id);
  assert(binding && binding.authorship === 'newly_authored');
  for (const id of [...binding.contentBasis, ...binding.exerciseBasis]) assert(sourceIds.has(id), `Missing provenance ${id}`);
}
assert.equal(provenance.bindings.length, bank.questions.length);
assert.equal(bank.questions.length, 15);
assert.equal(audit.entries.length, 44);
const typed = new Set(bank.questions.filter(q => q.kind === 'cloze').flatMap(q => q.acceptedAnswers));
for (const form of ['mir', 'dir', 'ihm', 'ihr', 'uns', 'euch', 'ihnen', 'Ihnen']) assert(typed.has(form));
const decisions = {};
for (const entry of audit.entries) decisions[entry.decision] = (decisions[entry.decision] || 0) + 1;
console.log(JSON.stringify({ sourceEntries: audit.entries.length, decisions, questions: bank.questions.length, typedDativeForms: typed.size, provenanceBindings: provenance.bindings.length }, null, 2));
