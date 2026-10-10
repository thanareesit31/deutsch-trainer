import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import type { Item } from "../src/lib/content";
import { grammarTrackActivities } from "../src/lib/grammar-learning";
import { activityPairs, emptyGuidedState, readGuidedState, validateFlow } from "../src/lib/guided-learning";
import { buildL13VerbFlow, prepareL13VerbItem } from "../src/lib/l13-grammar-learning";

test("L13 verbs use ten matching boards with separate account state and retain existing item IDs", async () => {
  const { createDatabase, userId } = await import("./learning-database.mjs");
  const db = await createDatabase();
  try {
    const source = (await db.query<{ data: Item }>("select data from public.content_items where status='published' order by position,id")).rows.map(row => row.data);
    const items = source.map(prepareL13VerbItem);
    const flow = buildL13VerbFlow(items);
    assert.deepEqual(validateFlow(flow, items), []);
    const boards = grammarTrackActivities(flow, items, "verbs");
    assert.deepEqual(boards.map(board => board.contentIds), [
      ["L13-V022"], ["L13-V023"], ["L13-V024"], ["L13-V025"], ["L13-V026"],
      ["L13-V027"], ["L13-V028"], ["L13-V029"], ["L13-V030"], ["L13-V031"],
    ]);
    assert.deepEqual(boards.map(board => activityPairs(board, items).length), [6, 6, 6, 6, 6, 6, 6, 1, 6, 6]);
    assert.deepEqual(items.filter(item => item.lessonId !== "L13"), source.filter(item => item.lessonId !== "L13"));
    assert.deepEqual(items.map(item => item.id), source.map(item => item.id));
    await db.query("insert into public.learner_lesson_states(user_id,lesson_key,state) values ($1,$2,$3::jsonb)", [userId, flow.stateKey, JSON.stringify(emptyGuidedState())]);
    assert.equal((await db.query<{ lesson_key: string }>("select lesson_key from public.learner_lesson_states")).rows[0].lesson_key, "deutsch-trainer-guided-learning-L13-grammar");
    await db.exec("reset role");
    for (const file of [
      "20261007020000_l02_lesson_states.sql",
      "20261010010000_l13_image_learning_state.sql",
      "20261010040000_l13_verb_learning_state.sql",
    ]) await db.exec(await readFile(new URL("../supabase/migrations/" + file, import.meta.url), "utf8"));
    assert.deepEqual((await db.query<{ state: unknown }>("select state from public.learner_lesson_states")).rows, [{ state: emptyGuidedState() }]);
    await db.exec("set role authenticated");
    await db.exec("set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'");
    assert.deepEqual((await db.query("select * from public.learner_lesson_states")).rows, []);

    const first = boards[0];
    const partial = readGuidedState(JSON.stringify({ ...emptyGuidedState(), matches: { [first.id]: [first.id + "-0"] } }), flow, items);
    assert.deepEqual(partial.matches[first.id], [first.id + "-0"]);
    assert.deepEqual(partial.learnedContentIds, []);
    assert.deepEqual(partial.learnedActivityIds, []);
  } finally {
    await db.close();
  }
});

test("L13 irregular forms highlight the changed vowel and es gibt remains impersonal", () => {
  const makeItem = (id: string, answer: string): Item => ({ id, answer, lessonId: "L13", skill: "grammar", group: "Verben", title: answer, meaning: "", type: "verb" });
  const gefallen = prepareL13VerbItem(makeItem("L13-V022", "gefallen")).verbContent;
  const helfen = prepareL13VerbItem(makeItem("L13-V024", "helfen")).verbContent;
  const expression = prepareL13VerbItem({ ...makeItem("L13-V029", "es gibt"), type: "expression" }).verbContent;
  assert.deepEqual(gefallen?.conjugations.map(row => row.form), ["gefalle", "gefällst", "gefällt", "gefallen", "gefallt", "gefallen"]);
  assert.deepEqual(helfen?.conjugations.map(row => row.form), ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"]);
  assert.deepEqual(gefallen?.conjugations[1].segments?.filter(segment => segment.changed).map(segment => segment.text), ["ä", "st"]);
  assert.deepEqual(helfen?.conjugations[2].segments?.filter(segment => segment.changed).map(segment => segment.text), ["i", "t"]);
  assert.deepEqual(expression?.conjugations, [{ subject: "es", form: "gibt", ending: "t" }]);
  assert.equal(expression?.examples[0].de, "Es gibt einen Park in der Stadt.");
});
