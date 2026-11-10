import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const migrations = [
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
await writeFile(new URL('../.tools/enable-lessons-15-18.sql', import.meta.url), '-- Reviewed L15-L18 release. Additive schema; preserves learner history.\n\n' + parts.join('\n\n'));
console.log(`Prepared ${migrations.length} migrations in .tools/enable-lessons-15-18.sql`);
