import test from "node:test";
import { prepareL02GrammarFlow, pronounScenes, politePluralScene } from "../src/lib/pronoun-learning";
import { grammarTrackActivities } from "../src/lib/grammar-learning";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { Item, Lesson } from "../src/lib/content";
import { prepareL02VocabularyFlow } from "../src/lib/l02-number-learning";
import { l02StatusExamples, l02StatusWords, prepareL02PhraseItem } from "../src/lib/l02-phrase-content";
import { personLayout, professionLabel, professionImageSource, prepareProfessionItem, recordProfessionAnswer, shuffle } from "../src/lib/profession-learning";
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
    const grammar = lesson.learningFlows!.grammar!;
    const tracks = ["pronouns", "verbs", "sentences"] as const;
    const visibleGrammar = tracks.flatMap(track => grammarTrackActivities(grammar, items, track));
    assert.equal(visibleGrammar.length, grammar.activities.length - 1);
    assert.ok(!visibleGrammar.some(a => a.id === "L02-sein-reuse"));
    assert.deepEqual(grammarTrackActivities(grammar, items, "verbs").map(a => a.verbId), ["L02-verb-arbeiten", "L02-verb-machen"]);
    assert.equal(grammarTrackActivities(grammar, items, "pronouns").length, 8);
    const preparedGrammar = prepareL02GrammarFlow(grammar, items);
    assert.deepEqual(prepareL02GrammarFlow(preparedGrammar, items), preparedGrammar);
    assert.deepEqual(validateFlow(preparedGrammar, items), []);
    const pronounBoards = grammarTrackActivities(preparedGrammar, items, "pronouns");
    assert.deepEqual(pronounBoards.map(a => a.pairs!.length), [2, 3, 3]);
    assert.deepEqual(pronounBoards.map(a => a.section.split(" · ")[1]), ["1. Person", "2. Person", "3. Person"]);
    assert.equal(pronounScenes["L02-pronoun-Sie"].group, undefined);
    assert.equal(politePluralScene.group, true);
    await readFile(`public${politePluralScene.image}`);
    const v1State = {...emptyGuidedState(), matches: {"L02-pronoun-images-v1-2": ["L02-pronoun-wir", "L02-pronoun-Sie"]}};
    const restoredV1 = readGuidedState(JSON.stringify(v1State), preparedGrammar, items);
    assert.deepEqual(restoredV1.matches[pronounBoards[0].id], ["L02-pronoun-wir"]);
    assert.deepEqual(restoredV1.matches[pronounBoards[1].id], ["L02-pronoun-Sie"]);
    assert.ok(!restoredV1.learnedActivityIds.includes(pronounBoards[1].id));
    assert.deepEqual(restoredV1.matches["L02-pronoun-images-v1-2"], ["L02-pronoun-wir", "L02-pronoun-Sie"]);
    const completedV1 = readGuidedState(JSON.stringify({...emptyGuidedState(), learnedActivityIds: ["L02-pronoun-images-v1-2"], matches: {"L02-pronoun-images-v1-2": ["L02-pronoun-wir", "L02-pronoun-ihr", "L02-pronoun-sie-pl", "L02-pronoun-Sie"]}}), preparedGrammar, items);
    assert.ok(completedV1.learnedActivityIds.includes("L02-pronoun-images-v1-2"));
    assert.deepEqual(new Set(completedV1.matches[pronounBoards[1].id]), new Set(["L02-pronoun-Sie", "L02-pronoun-ihr"]));
    const v2State = {...emptyGuidedState(), matches: {"L02-pronoun-images-v2-1": ["L02-pronoun-ich", "L02-pronoun-er"], "L02-pronoun-images-v2-3": ["L02-pronoun-Sie"]}, learnedActivityIds: ["L02-pronoun-images-v2-3"]};
    const restoredV2 = readGuidedState(JSON.stringify(v2State), preparedGrammar, items);
    assert.deepEqual(restoredV2.matches[pronounBoards[0].id], ["L02-pronoun-ich"]);
    assert.deepEqual(restoredV2.matches[pronounBoards[1].id], ["L02-pronoun-Sie"]);
    assert.deepEqual(restoredV2.matches[pronounBoards[2].id], ["L02-pronoun-er"]);
    assert.ok(restoredV2.learnedActivityIds.includes("L02-pronoun-images-v2-3"));
    assert.deepEqual(restoredV2.matches["L02-pronoun-images-v2-1"], v2State.matches["L02-pronoun-images-v2-1"]);
    assert.equal(grammarTrackActivities(preparedGrammar, items, "sentences").some(a => a.type === "pronoun_matching" || a.type === "pronoun_choice"), false);
    const oldPronouns = grammar.activities.filter(a => a.type === "pronoun_choice");
    const oldPronounState = {...emptyGuidedState(), learnedActivityIds: oldPronouns.map(a => a.id)};
    const restoredPronouns = readGuidedState(JSON.stringify(oldPronounState), preparedGrammar, items);
    assert.ok(oldPronouns.every(a => restoredPronouns.learnedActivityIds.includes(a.id)));
    assert.ok(pronounBoards.every(a => restoredPronouns.learnedActivityIds.includes(a.id)));
    assert.ok(pronounBoards.flatMap(a => a.contentIds).every(id => restoredPronouns.learnedContentIds.includes(id)));
    for (const scene of Object.values(pronounScenes)) await readFile(`public${scene.image}`);
    const firstPronoun = pronounBoards[0].pairs![0].id;
    const partialPronoun = readGuidedState(JSON.stringify({...emptyGuidedState(), matches:{[pronounBoards[0].id]:[firstPronoun]}}), preparedGrammar, items);
    assert.deepEqual(partialPronoun.matches[pronounBoards[0].id], [firstPronoun]);
    assert.ok(!partialPronoun.learnedActivityIds.includes(pronounBoards[0].id));
    const reusedSein = grammar.activities.find(a => a.id === "L02-sein-reuse")!;
    const historicalGrammar = readGuidedState(JSON.stringify({...emptyGuidedState(), learnedActivityIds: [reusedSein.id], matches: {[reusedSein.id]: activityPairs(reusedSein, items).map(p => p.id)}}), grammar, items);
    assert.ok(historicalGrammar.learnedActivityIds.includes("L02-sein-reuse"));
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
    assert.equal(coreActivities[0].type, "profession_matching");
    assert.deepEqual([...new Set(coreActivities.map((activity) => activity.section.split(" · ")[0]))], ["Berufe"], "status and dream job belong to phrases");
    assert.ok(!coreActivities.some((activity) => activity.id === "L02-dream-meaning"));
    assert.equal(l02StatusWords.length, 5);
    assert.equal(l02StatusExamples.length, 6);
    for (const id of [...l02StatusExamples.map((entry) => entry.id), "L02-traumberuf"]) {
      const item = items.find((entry) => entry.id === id)!;
      assert.equal(item.skill, "phrases", "relocated records keep IDs and use the phrase skill");
      assert.ok(!coreActivities.some((activity) => activity.contentIds.includes(id)));
      assert.equal(prepareL02PhraseItem({ ...item, skill: "vocabulary" }).skill, "phrases", "installed old catalogs get the same relocation");
    }
    const retiredDream = vocabulary.activities.find((activity) => activity.id === "L02-dream-meaning")!;
    assert.ok(retiredDream, "retired page stays in the historical flow");
    const dreamHistory = completeActivity(emptyGuidedState(), retiredDream, vocabulary.activities.indexOf(retiredDream));
    assert.ok(readGuidedState(JSON.stringify(dreamHistory), vocabulary, items).learnedActivityIds.includes(retiredDream.id));
    const model = items.find((item) => item.professionContent?.conceptKey === "modell")!;
    assert.equal(model.answer, "Model");
    assert.equal(professionLabel(model, "masculine").text, "das Model");
    assert.equal(professionLabel(model, "feminine").text, "das Model");
    const legacyModel = { ...model, word: "Modell", title: "Modell", answer: "Modell", professionContent: { ...model.professionContent!, masculine: "Modell", feminine: "Modell" } };
    const restoredModel = prepareProfessionItem(legacyModel);
    assert.equal(professionLabel(restoredModel, "masculine").text, "das Model", "already installed catalogs show the correction before migration");
    assert.equal(restoredModel.id, legacyModel.id);
    assert.equal(restoredModel.professionContent!.conceptKey, legacyModel.professionContent.conceptKey);
    assert.equal(legacyModel.answer, "Modell", "catalog normalization does not mutate the input");
    const professionPages = coreActivities.filter((a) => a.type === "profession_matching");
    assert.equal(professionPages.length, 7);
    assert.equal(professionPages.flatMap((a) => a.pairs!).length, 40);
    for (const page of professionPages) {
      assert.ok(page.pairs!.length >= 5 && page.pairs!.length <= 6);
      for (const pair of page.pairs!) {
        const item = items.find((i) => i.id === pair.id)!;
        const illustration = await readFile(new URL(`../public${professionImageSource(item)}`, import.meta.url));
        assert.equal(illustration.subarray(0, 4).toString(), "RIFF", "paired illustration is a real WebP asset");
        assert.equal(illustration.subarray(8, 12).toString(), "WEBP");
        for (const givenRandom of [.1, .9]) for (const sideRandom of [.1, .9]) {
          const values = [givenRandom, sideRandom];
          const row = personLayout(item, () => values.shift()!);
          assert.equal(row.people.filter((p) => p.given).length, 1);
          for (const person of row.people) {
            assert.equal(person.label.word, item.professionContent![person.form]);
            assert.deepEqual(person.label, professionLabel(item, person.form));
          }
          assert.equal(row.people[0].form, sideRandom < .5 ? "masculine" : "feminine");
          assert.equal(row.given, givenRandom < .5 ? "masculine" : "feminine");
        }
        for (const old of pair.legacyMatches ?? []) {
          const restored = readGuidedState(JSON.stringify({ ...emptyGuidedState(), matches: { [old.activityId]: [old.pairId] } }), vocabulary, items);
          assert.ok(restored.matches[page.id].includes(pair.id), "restore a partial legacy forms board");
          assert.ok(restored.matches[old.activityId].includes(old.pairId), "preserve original evidence");
        }
      }
    }
    assert.deepEqual(shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1]);
    const before = { ...emptyGuidedState(), numberEndPage: "board" as const, matches: { unrelated: ["keep"] } };
    let answers = recordProfessionAnswer(before, "V018", false);
    answers = recordProfessionAnswer(answers, "V018", false);
    answers = recordProfessionAnswer(answers, "V018", true);
    assert.deepEqual(answers.professionAnswers!.V018, { correct: 1, wrong: 2, hints: 1 });
    assert.deepEqual(answers.matches, before.matches);
    assert.equal(answers.numberEndPage, "board");
    assert.deepEqual(answers.learnedContentIds, [], "answer counters do not create mastery or learning evidence");
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
