import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createDatabase, userId } from './learning-database.mjs';

const migration = await readFile(new URL('../supabase/migrations/20261024000000_l14_phrase_practice_state.sql', import.meta.url), 'utf8');

test('L14 phrase practice can save account state without widening other lesson keys', async () => {
  const db = await createDatabase();
  try {
    await db.exec('reset role');
    await db.exec(migration);
    await db.exec(`set role authenticated; set request.jwt.claim.sub='${userId}'`);
    const state = { version: 1, banks: { daily: { runId: 'saved-round', taskIds: ['ask-help'], position: 0, attempts: [], draft: null, completed: false } }, runs: [] };
    await db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3)', [userId, 'deutsch-trainer-phrase-practice-v1-L14', JSON.stringify(state)]);
    const rows = await db.query('select state from public.learner_lesson_states where lesson_key=$1', ['deutsch-trainer-phrase-practice-v1-L14']);
    assert.deepEqual(rows.rows[0].state, state);
    await assert.rejects(db.query('insert into public.learner_lesson_states(user_id,lesson_key,state) values($1,$2,$3)', [userId, 'unsupported-phrase-practice', '{}']), /lesson_key_check/);
  } finally {
    await db.close();
  }
});
