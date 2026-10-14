import assert from "node:assert/strict";
import { test } from "node:test";
import { grammarDiscoveryLessons } from "../src/lib/grammar-discovery";
import { completeConjugationRow, completeDiscoveryTopic, completedConjugationRows, completedDiscoveryTopics } from "../src/lib/grammar-discovery-progress";

test("each Grammar Discovery lesson keeps only completed topics", () => {
  assert.deepEqual(grammarDiscoveryLessons.map((lesson) => lesson.id),
    ["L03", "L04", "L05", "L06", "L07", "L08", "L09", "L10", "L11", "L12"]);
  for (const lesson of grammarDiscoveryLessons) {
    let saved: string | null = null;
    for (const topic of lesson.topics) {
      saved = completeDiscoveryTopic(saved, lesson, topic.slug);
      assert.ok(completedDiscoveryTopics(saved, lesson).includes(topic.slug), `${lesson.id}: ${topic.slug}`);
    }
    saved = completeDiscoveryTopic(saved, lesson, lesson.topics[0].slug);
    assert.deepEqual(completedDiscoveryTopics(saved, lesson), lesson.topics.map((topic) => topic.slug));
    assert.deepEqual(completedDiscoveryTopics('{"completedTopics":["invalid",4]}', lesson), []);
  }
});

test("matching a verb row survives finishing another discovery topic", () => {
  const lesson = grammarDiscoveryLessons.find((entry) => entry.id === "L03");
  assert.ok(lesson);
  const started = completeDiscoveryTopic(null, lesson, "sprechen");
  const matched = completeConjugationRow(started, lesson, "sprechen", "sprechen", "du");
  const updated = completeDiscoveryTopic(matched, lesson, "mein-dein");
  assert.deepEqual(completedConjugationRows(updated, "sprechen", "sprechen"), ["du"]);
  assert.deepEqual(completedDiscoveryTopics(updated, lesson), ["sprechen", "mein-dein"]);
});
