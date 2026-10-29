import assert from 'node:assert/strict';
import { createDatabase, userId } from './learning-database.mjs';

const db = await createDatabase();
try {
  await db.exec('reset role');
  const variants = (await db.query("select definition from public.phrase_practice_questions where id like 'variant-%' order by id")).rows.map(row => row.definition);
  assert.equal(variants.length, 81);
  const learned = Object.fromEntries(variants.map(question => [question.itemId, 'correct']));
  await db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3::jsonb)', [userId, 'deutsch-trainer-phrase-learning-v1-L14', JSON.stringify({ results: learned })]);
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${userId}'`);
  const sync = state => db.query('select public.sync_practice_session($1,$2::jsonb)', ['phrase-l14-daily', JSON.stringify(state)]);
  const round = (question, id) => ({ id, createdAt: new Date().toISOString(), position: 0, completed: true, items: [{
    question, response: '', selected: [], tokenOrder: [], attempt: { response: question.acceptedAnswers[0], correct: false, status: 'completed', confidence: null, submittedAt: new Date().toISOString() },
  }] });
  for (const [index, question] of variants.entries()) {
    const state = round(question, `l14-variant-${index}`);
    await sync(state);
    const saved = (await db.query('select state from public.learner_practice_sessions where session_id=$1', [state.id])).rows[0].state;
    assert.equal(saved.items[0].attempt.correct, true, question.id);
  }
  const forged = round({ ...variants[0], acceptedAnswers: ['wrong'] }, 'l14-forged');
  await assert.rejects(sync(forged), /Unknown or changed L14 phrase question/);
  console.log('PASS L14 phrase variants: 81 canonical answers and forgery rejection');
} finally {
  await db.close();
}
