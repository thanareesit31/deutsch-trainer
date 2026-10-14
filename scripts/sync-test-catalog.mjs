// One-time, scoped sync of the 2026-10-14 test catalog differences.
// Run with Node 20+: node --env-file=.env.local scripts/sync-test-catalog.mjs [--apply]
import pg from "pg";
import { mkdir, writeFile } from "node:fs/promises";

const apply = process.argv.includes("--apply");
const testBase = "http://localhost:3002/__test-db";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const databaseUrl = process.env.DATABASE_URL;
if (!supabaseUrl || !databaseUrl) throw new Error("Supabase URL and DATABASE_URL are required");
const project = new URL(supabaseUrl).hostname.split(".")[0];
if (new URL(databaseUrl).hostname !== `db.${project}.supabase.co`)
  throw new Error("DATABASE_URL and Supabase URL point to different projects");

const lessonIds = new Set(["L01", "L02"]);
const itemIds = new Set([
  "L02-family-status-alone",
  ...["children", "cohabiting", "divorced", "married", "no-children", "single"]
    .map((suffix) => `L02-family-status-${suffix}`),
  "L14-V017", "L14-V018",
  ...Array.from({ length: 13 }, (_, index) => `V${217 + index}`),
  ...Array.from({ length: 8 }, (_, index) => `V${190 + index}`),
  ...[42, 43, 44, 45, 46, 50, 51, 52, 53, 54, ...Array.from({ length: 14 }, (_, index) => 56 + index)]
    .map((number) => `L13-V${String(number).padStart(3, "0")}`),
]);

const columns = {
  content_lessons: ["id", "position", "status", "data"],
  content_items: ["id", "lesson_id", "skill", "position", "status", "data"],
};
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}
function equal(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}
async function readTest(table) {
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const url = `${testBase}/rest/v1/${table}?select=${columns[table].join(",")}&status=eq.published&order=id.asc&limit=500&offset=${offset}`;
    const response = await fetch(url, { headers: { apikey: "local-test-publishable-key" } });
    if (!response.ok) throw new Error(`Test catalog ${table} returned HTTP ${response.status}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < 500) return rows;
  }
}
async function readDatabase(client, table) {
  const fields = columns[table].join(",");
  return (await client.query(`select ${fields} from public.${table} order by id`)).rows;
}
function publicRows(rows) {
  return rows.filter((row) => row.status === "published");
}
function changes(testRows, databaseRows, allowedIds) {
  const existing = new Map(databaseRows.map((row) => [row.id, row]));
  const testIds = new Set(testRows.map((row) => row.id));
  const extra = publicRows(databaseRows).filter((row) => !testIds.has(row.id));
  if (extra.length) throw new Error(`Unexpected production-only published IDs: ${extra.map((row) => row.id).join(", ")}`);
  const changed = testRows.filter((row) => !equal(row, existing.get(row.id)));
  const unexpected = changed.filter((row) => !allowedIds.has(row.id));
  if (unexpected.length) throw new Error(`Unexpected catalog differences: ${unexpected.map((row) => row.id).join(", ")}`);
  return changed;
}

const health = await fetch(`${testBase}/health`);
if (!health.ok || (await health.json()).testWorkspace !== true)
  throw new Error("The local test workspace is not running at localhost:3002");
const test = {
  content_lessons: await readTest("content_lessons"),
  content_items: await readTest("content_items"),
};
if (test.content_lessons.length !== 18 || test.content_items.length !== 602)
  throw new Error("Test catalog size changed; review the scope before syncing");

const client = new pg.Client({ connectionString: databaseUrl, connectionTimeoutMillis: 15000 });
await client.connect();
let transactionOpen = false;
try {
  await client.query("begin isolation level serializable");
  transactionOpen = true;
  const before = {
    content_lessons: await readDatabase(client, "content_lessons"),
    content_items: await readDatabase(client, "content_items"),
  };
  const lessonChanges = changes(test.content_lessons, before.content_lessons, lessonIds);
  const itemChanges = changes(test.content_items, before.content_items, itemIds);
  const summary = { lessons: lessonChanges.map((row) => row.id), items: itemChanges.map((row) => row.id) };
  console.log(JSON.stringify({ mode: apply ? "apply" : "preview", counts: { lessons: lessonChanges.length, items: itemChanges.length }, summary }));

  if (apply && (lessonChanges.length || itemChanges.length)) {
    const backup = {
      createdAt: new Date().toISOString(),
      project,
      content_lessons: lessonChanges.map((row) => before.content_lessons.find((old) => old.id === row.id) ?? null),
      content_items: itemChanges.map((row) => before.content_items.find((old) => old.id === row.id) ?? null),
    };
    await mkdir(".tools", { recursive: true });
    const backupPath = `.tools/catalog-sync-backup-${Date.now()}.json`;
    await writeFile(backupPath, JSON.stringify(backup, null, 2) + "\n", { mode: 0o600 });
    console.log(`Backup: ${backupPath}`);
    for (const row of lessonChanges)
      await client.query(
        "insert into public.content_lessons(id,position,status,data) values($1,$2,$3,$4::jsonb) on conflict(id) do update set position=excluded.position,status=excluded.status,data=excluded.data",
        [row.id, row.position, row.status, JSON.stringify(row.data)],
      );
    for (const row of itemChanges)
      await client.query(
        "insert into public.content_items(id,lesson_id,skill,position,status,data) values($1,$2,$3,$4,$5,$6::jsonb) on conflict(id) do update set lesson_id=excluded.lesson_id,skill=excluded.skill,position=excluded.position,status=excluded.status,data=excluded.data",
        [row.id, row.lesson_id, row.skill, row.position, row.status, JSON.stringify(row.data)],
      );
    const after = {
      content_lessons: await readDatabase(client, "content_lessons"),
      content_items: await readDatabase(client, "content_items"),
    };
    for (const table of Object.keys(test)) {
      const remaining = changes(test[table], after[table], new Set());
      if (remaining.length) throw new Error(`${table} still differs after sync`);
    }
  }
  await client.query(apply ? "commit" : "rollback");
  transactionOpen = false;
  if (apply) console.log("Catalog sync verified and committed");
} catch (error) {
  if (transactionOpen) await client.query("rollback");
  throw error;
} finally {
  await client.end();
}
