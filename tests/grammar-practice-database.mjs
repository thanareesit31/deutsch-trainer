import assert from 'node:assert/strict';
import { createDatabase, userId } from './learning-database.mjs';

const db = await createDatabase();
try {
  await db.exec('reset role');
  const definitions = (await db.query('select definition from public.grammar_practice_questions order by id')).rows.map(row => row.definition);
  assert.equal(definitions.length, 205);
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${userId}'`);
  const sync = (bankKey, state) => db.query('select public.sync_practice_session($1,$2::jsonb)', [bankKey, JSON.stringify(state)]);
  const round = (question, id, response = question.acceptedAnswers[0]) => ({
    id, createdAt: new Date().toISOString(), position: 0, completed: true,
    items: [{ question, response: '', selected: [], tokenOrder: [], attempt: { response, correct: false, status: 'completed', confidence: null, submittedAt: new Date().toISOString() } }],
  });
  const l14 = definitions.find(question => question.id === 'A13-L14-WOD-99');
  await assert.rejects(sync('l14-wo-dativ', round(l14, 'unlearned')), /has not been learned/);
  for (const targetId of new Set(definitions.map(question => question.targetId).filter(Boolean)))
    await db.query("select public.learning_action('expose',$1::jsonb)", [JSON.stringify({ itemId: targetId })]);
  for (const [index, question] of definitions.entries()) {
    const bankKey = question.lessonId === 'L14' ? 'l14-grammar' : 'grammar-basic';
    const state = round(question, `all-${index}`);
    await sync(bankKey, state);
    const saved = (await db.query('select state from public.learner_practice_sessions where session_id=$1', [state.id])).rows[0].state;
    assert.equal(saved.items[0].attempt.correct, true, question.id);
    if (question.targetId) assert.equal(saved.items[0].question.targetId, question.targetId, question.id);
  }
  const forged = round({ ...l14, acceptedAnswers: ['wrong'] }, 'forged');
  await assert.rejects(sync('l14-wo-dativ', forged), /Unknown or changed grammar question/);
  const wrong = round(l14, 'wrong-answer', 'wrong');
  await sync('l14-wo-dativ', wrong);
  const wrongSaved = (await db.query('select state from public.learner_practice_sessions where session_id=$1', [wrong.id])).rows[0].state;
  assert.equal(wrongSaved.items[0].attempt.correct, false);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", ['22222222-2222-4222-8222-222222222222']);
  assert.equal((await db.query('select count(*)::int count from public.learner_practice_sessions')).rows[0].count, 0);
  await assert.rejects(sync('l14-wo-dativ', round(l14, 'other-account')), /has not been learned/);
  console.log(`PASS grammar database: ${definitions.length} canonical answers, learned eligibility, forgery rejection and account isolation`);
} finally {
  await db.close();
}
