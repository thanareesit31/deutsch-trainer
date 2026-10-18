import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createDatabase,userId} from "./learning-database.mjs";
const migration=await readFile(new URL("../supabase/migrations/20261017000000_course_learning_state_keys.sql",import.meta.url),"utf8");
test("course allowlist extension preserves existing states, arbitrary previous allowances, idempotence and account RLS",async()=>{
 const db=await createDatabase();
 try {
  await db.exec("reset role");
  await db.exec(await readFile(new URL("../supabase/migrations/20261014120000_grammar_discovery_states.sql",import.meta.url),"utf8"));
  const previous=(await db.query("select pg_get_expr(conbin,conrelid) expression from pg_constraint where conname='learner_lesson_states_lesson_key_check'")).rows[0].expression;
  await db.exec(`alter table public.learner_lesson_states drop constraint learner_lesson_states_lesson_key_check; alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check ((${previous}) or lesson_key='previous-custom-allowance');`);
  const keys=["deutsch-trainer-alphabet-learning-v1-L01","deutsch-trainer-guided-learning-L02-grammar","deutsch-trainer-grammar-discovery-v1-L03","previous-custom-allowance"];
  for(const [index,key] of keys.entries()) await db.query("insert into public.learner_lesson_states values($1,$2,$3)",[userId,key,JSON.stringify({sentinel:index,attempts:[{id:`old-${index}`,correctness:1}],draft:"keep"})]);
  const before=(await db.query("select * from public.learner_lesson_states order by lesson_key")).rows;
  await assert.rejects(db.query("insert into public.learner_lesson_states values($1,$2,$3)",[userId,"deutsch-trainer-course-learning-v1-L13","{}"]),/lesson_key_check/);
  await db.exec(migration);await db.exec(migration);
  assert.deepEqual((await db.query("select * from public.learner_lesson_states order by lesson_key")).rows,before);
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${userId}'`);
  for(const lesson of ["L13","L14"]) await db.query("insert into public.learner_lesson_states values($1,$2,$3)",[userId,`deutsch-trainer-course-learning-v1-${lesson}`,JSON.stringify({version:1,completedTopics:[],attempts:[],drafts:{keep:"yes"}})]);
  await assert.rejects(db.query("insert into public.learner_lesson_states values($1,$2,$3)",[userId,"deutsch-trainer-course-learning-v1-L15","{}"]),/lesson_key_check/);
  await db.exec("set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'");
  assert.equal((await db.query("select * from public.learner_lesson_states")).rows.length,0);
  await assert.rejects(db.query("insert into public.learner_lesson_states values($1,$2,$3)",[userId,"deutsch-trainer-course-learning-v1-L13","{}"]),/row.level security/);
 } finally {await db.close();}
});
