import assert from 'node:assert/strict';
import { createDatabase, userId } from './learning-database.mjs';

const db = await createDatabase();
try {
  await db.exec('reset role');
  const definitions = (await db.query('select definition from public.a11_grammar_practice_questions order by id')).rows.map(row => row.definition);
  assert.equal(definitions.length, 156);
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${userId}'`);
  const sync = (bankKey, state) => db.query('select public.sync_practice_session($1,$2::jsonb)', [bankKey, JSON.stringify(state)]);
  const round = (question, id, response = question.acceptedAnswers[0]) => ({
    id, createdAt: new Date().toISOString(), position: 0, completed: true,
    items: [{ question, response: '', selected: [], tokenOrder: [], attempt: { response, correct: false, status: 'completed', confidence: null, submittedAt: new Date().toISOString() } }],
  });
  const first = definitions.find(question => question.lessonId === 'L03');
  await assert.rejects(sync('a11-grammar-l03-basic', round(first, 'unlearned')), /has not been learned/);
  for (const question of definitions.filter(question => ['L01', 'L02'].includes(question.lessonId)))
    await db.query("select public.learning_action('expose',$1::jsonb)", [JSON.stringify({ itemId: question.targetId })]);
  for (const lessonId of [...new Set(definitions.map(question => question.lessonId))].filter(id => !['L01', 'L02'].includes(id))) {
    const completedTopics = [...new Set(definitions.filter(question => question.lessonId === lessonId).map(question => question.requiredTopicSlug))];
    await db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3::jsonb)', [userId, `deutsch-trainer-grammar-discovery-v1-${lessonId}`, JSON.stringify({ completedTopics })]);
  }
  for (const [index, question] of definitions.entries()) {
    const state = round(question, `grammar-${index}`);
    await sync(`a11-grammar-${question.lessonId.toLowerCase()}-daily`, state);
    const saved = (await db.query('select state from public.learner_practice_sessions where session_id=$1', [state.id])).rows[0].state;
    assert.equal(saved.items[0].attempt.correct, true, question.id);
  }
  await assert.rejects(sync('a11-grammar-l03-basic', round({ ...first, acceptedAnswers: ['wrong'] }, 'forged')), /Unknown or changed grammar question/);
  await sync('a11-grammar-l03-basic', round(first, 'wrong', 'wrong'));
  const wrong = (await db.query("select state from public.learner_practice_sessions where session_id='wrong'")).rows[0].state;
  assert.equal(wrong.items[0].attempt.correct, false);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", ['22222222-2222-4222-8222-222222222222']);
  assert.equal((await db.query('select count(*)::int count from public.learner_practice_sessions')).rows[0].count, 0);
  await assert.rejects(sync('a11-grammar-l03-basic', round(first, 'other-account')), /has not been learned/);
  console.log(`PASS A1.1/A1.2 grammar database: ${definitions.length} canonical answers, eligibility, forgery rejection, isolation`);
} finally {
  await db.close();
}
