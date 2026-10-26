// Apply only additive account-practice schema; does not import historical attempts.
import pg from 'pg';
import { readFile } from 'node:fs/promises';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  for (const file of ['20261022000000_practice_account_sessions.sql', '20261022010000_vocabulary_practice_banks.sql', '20261022020000_vocabulary_session_validation.sql', '20261022030000_phrase_practice.sql', '20261022040000_phrase_pathway.sql', '20261022050000_phrase_topic_sequence.sql', '20261025000000_optional_practice_confidence.sql', '20261026000000_l14_phrase_sessions.sql']) {
    await client.query(await readFile(new URL('../supabase/migrations/'+file, import.meta.url),'utf8'));
  }
  await client.query("notify pgrst, 'reload schema'");
  console.log('Account practice schema applied; existing learner history preserved.');
} catch (error) {
  console.error('Practice migration failed:', error.code ?? error.name);
  process.exitCode=1;
} finally { await client.end(); }
