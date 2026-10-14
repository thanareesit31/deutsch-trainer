import test from "node:test";
import assert from "node:assert/strict";
import lessons from "../src/data/lessons.json";
import { grammarDiscoveryLesson, grammarDiscoveryLessons } from "../src/lib/grammar-discovery";

for (let number = 3; number <= 12; number++) {
  const id = `L${String(number).padStart(2, "0")}`;
  test(`${id} has ordered discovery and application activities`, () => {
    const lesson = grammarDiscoveryLesson(id);
    assert.ok(lesson, `${id} must have a grammar route`);
    assert.equal(lessons.find((entry) => entry.Lesson_ID === id)?.Lektion_No, `Lektion ${number}`);
    assert.ok(lesson.topics.length >= 2);
    assert.equal(new Set(lesson.topics.map((topic) => topic.slug)).size, lesson.topics.length);
    for (const topic of lesson.topics) {
      assert.ok(topic.title && topic.thai && topic.rule);
      assert.equal(topic.examples.length, 2);
      for (const question of [topic.observe, topic.apply]) {
        assert.ok(question.choices.includes(question.answer));
        assert.equal(new Set(question.choices).size, question.choices.length);
        assert.ok(question.prompt && question.hint);
      }
    }
  });
}

test("protected lessons have no discovery routes", () => {
  assert.equal(grammarDiscoveryLesson("L01"), undefined);
  assert.equal(grammarDiscoveryLesson("L02"), undefined);
  assert.deepEqual(grammarDiscoveryLessons.map((lesson) => lesson.id),
    Array.from({ length: 10 }, (_, index) => `L${String(index + 3).padStart(2, "0")}`));
});
