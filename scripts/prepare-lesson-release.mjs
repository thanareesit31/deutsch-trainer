import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const phraseUpgrade = process.argv.includes('--phrase-upgrade');
const practiceUpgrade = process.argv.includes('--practice-upgrade');
const migrations = phraseUpgrade ? ['20261111000000_phrase_practice_progression.sql', '20261111001000_phrase_practice_extension_catalog.sql'] : practiceUpgrade ? ['20261110000000_release_practice_progression.sql', '20261110001000_release_practice_extension_catalog.sql'] : [
  '20261109000000_release_course_lesson_states.sql',
  '20261109001000_a13_release_course_catalog.sql',
  '20261109002000_release_shared_practice.sql',
  '20261109003000_release_health.sql',
];
const parts = await Promise.all(migrations.map(async name => {
  const sql = await readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8');
  return `-- ${name}\n-- SHA256 ${createHash('sha256').update(sql).digest('hex')}\n${sql}`;
}));
await mkdir(new URL('../.tools/', import.meta.url), { recursive: true });
const output = phraseUpgrade ? 'enable-phrase-practice-1-14.sql' : 'enable-lessons-15-18.sql';
await writeFile(new URL('../.tools/'+output, import.meta.url), '-- Reviewed additive schema; preserves learner history.\n\n' + parts.join('\n\n'));
console.log(`Prepared ${migrations.length} migrations in .tools/${output}`);
