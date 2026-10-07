import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { Item, Lesson } from "../src/lib/content";
import { prepareL02VocabularyFlow } from "../src/lib/l02-number-learning";
import {
  activityPairs,
  completeActivity,
  emptyGuidedState,
  readGuidedState,
  validateFlow,
  vocabularyTrackActivities,
} from "../src/lib/guided-learning";

test("L02 catalog references, provenance, dependencies, assets and state migration", async () => {
  const { createDatabase } = await import("./learning-database.mjs");
  const db = await createDatabase();
  try {
    const items = (
      await db.query<{ data: Item }>(
        "select data from public.content_items where status='published'",
      )
    ).rows.map((r) => r.data);
    const lesson = (
      await db.query<{ data: Lesson }>(
        "select data from public.content_lessons where id='L02'",
      )
    ).rows[0].data;
    const originalVocabulary = lesson.learningFlows!.vocabulary!;
    lesson.learningFlows!.vocabulary = prepareL02VocabularyFlow(originalVocabulary, items);
    const boards = lesson.learningFlows!.vocabulary.activities.slice(0, 4);
    assert.deepEqual(boards.map((a) => a.pairs!.map((p) => items.find((i) => i.id === p.contentIds[0])!.numberContent!.value)), [Array.from({ length: 13 }, (_, n) => n), Array.from({ length: 7 }, (_, n) => n + 13), Array.from({ length: 8 }, (_, n) => (n + 2) * 10), [21, 48, 63, 89, 100]]);
    const legacyState = { ...emptyGuidedState(), learnedActivityIds: ["L02-number-0-word"] };
    const migrated = readGuidedState(JSON.stringify(legacyState), lesson.learningFlows!.vocabulary, items);
    assert.deepEqual(migrated.matches[boards[0].id], ["L02-number-0"]);
    assert.equal(migrated.resumeIndex, 0);
    assert.ok(migrated.learnedContentIds.includes("L02-number-0"));
    const oldBoard = { ...emptyGuidedState(), matches: { "L02-number-matching-13-20": ["L02-number-13", "L02-number-14", "L02-number-20"] } };
    const restoredBoard = readGuidedState(JSON.stringify(oldBoard), lesson.learningFlows!.vocabulary, items);
    assert.deepEqual(restoredBoard.matches[boards[1].id], ["L02-number-13", "L02-number-14"]);
    assert.deepEqual(restoredBoard.matches[boards[2].id], ["L02-number-20"]);
    assert.ok(lesson.learningFlows!.vocabulary.activities.slice(2).some((a) => a.contentIds.includes("L02-number-20")), "20 remains available after the teen board");

    for (const flow of Object.values(lesson.learningFlows!)) {
      assert.deepEqual(validateFlow(flow!, items), []);
      for (const a of flow!.activities) {
        for (const id of a.contentIds)
          assert.ok(
            items.find((i) => i.id === id)?.lessonId === "L02" ||
              id.startsWith("grammar-L01-sein-"),
            `no L03+ reference: ${id}`,
          );
      }
      let state = emptyGuidedState();
      for (const [index, a] of flow!.activities.entries()) {
        state.matches[a.id] = activityPairs(a, items).map((p) => p.id);
        state = completeActivity(state, a, index);
        const restored = readGuidedState(JSON.stringify(state), flow!, items);
        assert.equal(restored.resumeIndex, index + 1);
      }
      assert.equal(
        readGuidedState(JSON.stringify(state), flow!, items).resumeIndex,
        flow!.activities.length,
      );
      const revisited = completeActivity(state, flow!.activities[0], 0);
      assert.equal(
        revisited.resumeIndex,
        state.resumeIndex,
        "revisit must not regress resume",
      );
      assert.deepEqual(
        revisited.learnedActivityIds,
        state.learnedActivityIds,
        "revisit must not remove learned IDs",
      );
      assert.equal(
        readGuidedState('{"matches":null,"resumeIndex":9999}', flow!, items)
          .resumeIndex,
        0,
      );
    }
    const vocabulary = lesson.learningFlows!.vocabulary!;
    const numbers = vocabularyTrackActivities(vocabulary, items, "numbers");
    const coreActivities = vocabularyTrackActivities(vocabulary, items, "core");
    assert.ok(numbers.length && coreActivities.length);
    assert.deepEqual(numbers.map((a) => a.id), boards.map((a) => a.id), "the number track ends after four boards");
    assert.ok(vocabulary.activities.some((a) => a.id === "L02-phone-question"), "retired activities remain available for historical state");
    const retired = vocabulary.activities.find((a) => a.id === "L02-number-28-pattern")!;
    const archivedState = completeActivity(emptyGuidedState(), retired, vocabulary.activities.indexOf(retired));
    assert.ok(readGuidedState(JSON.stringify(archivedState), vocabulary, items).learnedActivityIds.includes(retired.id));
    assert.equal(coreActivities[0].type, "image_matching");
    const coreFirst = coreActivities[0];
    const coreState = emptyGuidedState();
    coreState.matches[coreFirst.id] = activityPairs(coreFirst, items).map((p) => p.id);
    const learnedCore = completeActivity(coreState, coreFirst, vocabulary.activities.indexOf(coreFirst));
    const restoredCore = readGuidedState(JSON.stringify(learnedCore), vocabulary, items);
    assert.ok(restoredCore.learnedActivityIds.includes(coreFirst.id), "core can be learned before numbers");
    assert.equal(restoredCore.resumeIndex, 0, "numbers remain unfinished");
    const restoredBoth = readGuidedState(JSON.stringify(completeActivity(restoredCore, numbers[0], 0)), vocabulary, items);
    assert.ok(restoredBoth.learnedActivityIds.includes(coreFirst.id), "learning numbers preserves core history and matches");
    assert.deepEqual(restoredBoth.matches[coreFirst.id], coreState.matches[coreFirst.id]);
    assert.ok(
      [
        "number_matching",
        "compound_pattern",
        "image_matching",
        "image_to_word",
        "pair_matching",
      ].every((t) => vocabulary.activities.some((a) => a.type === t)),
    );
    const grammar = lesson.learningFlows!.grammar!;
    const verbActivity = grammar.activities.find((a) => a.verbId)!;
    const partial = emptyGuidedState();
    partial.matches[verbActivity.id] = [activityPairs(verbActivity, items)[0].id];
    assert.ok(!readGuidedState(JSON.stringify(partial), grammar, items).learnedContentIds.includes(verbActivity.verbId!), "partial conjugation must not mark the whole verb learned");

    assert.ok(
      grammar.activities.findIndex((a) => a.verbId) >
        grammar.activities.findIndex((a) => a.type === "pronoun_choice"),
    );
    assert.equal(
      items.filter((i) => i.lessonId === "L02" && i.pronounContent).length,
      8,
    );
    assert.ok(
      !items.some(
        (i) => i.lessonId === "L02" && i.pronounContent?.pronoun === "es",
      ),
    );
    assert.ok(
      !items.some(
        (i) => i.lessonId === "L02" && i.verbContent?.infinitive === "sein",
      ),
    );
    const core = items.filter(
      (i) =>
        i.lessonId === "L02" &&
        i.professionContent &&
        i.sourceScope === "core_book",
    );
    assert.equal(core.length, 11);
    for (const item of items.filter((i) => i.lessonId === "L02")) {
      assert.ok(
        item.sourceScope && item.sources?.length,
        `${item.id}: provenance`,
      );
      if (item.image)
        assert.ok(
          (
            await readFile(
              new URL("../public" + item.image, import.meta.url),
              "utf8",
            )
          ).includes("<svg"),
        );
    }
    const cook = items.find((i) => i.professionContent?.masculine === "Koch")!;
    assert.equal(cook.sourceScope, "teacher_extension");
    assert.equal(cook.professionContent!.feminine, "Köchin");
    await db.exec("reset role");
    for (const file of [
      "20261007010000_l02_learning_content.sql",
      "20261007020000_l02_lesson_states.sql",
      "20261008000000_l02_number_page_four.sql",
    ])
      await db.exec(
        await readFile(
          new URL("../supabase/migrations/" + file, import.meta.url),
          "utf8",
        ),
      );
    assert.equal(
      (
        await db.query<{ count: number }>(
          "select count(*)::int as count from public.content_items where lesson_id='L02'",
        )
      ).rows[0].count,
      112,
    );
    await db.exec("set role authenticated");
    for (const skill of ["vocabulary", "grammar"])
      await db.query(
        "insert into public.learner_lesson_states(user_id,lesson_key,state) values(auth.uid(),$1,$2)",
        ["deutsch-trainer-guided-learning-L02-" + skill, emptyGuidedState()],
      );
    assert.equal(
      (await db.query("select * from public.learning_attempts")).rows.length,
      0,
    );
    await db.exec(
      "set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'",
    );
    assert.equal(
      (await db.query("select * from public.learner_lesson_states")).rows
        .length,
      0,
      "L02 drafts are private to their owner",
    );
  } finally {
    await db.close();
  }
});
