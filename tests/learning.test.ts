import test from "node:test";
import assert from "node:assert/strict";
import {
  completedAttempts,
  diagnose,
  isCompletedAttempt,
  reviewCandidates,
} from "../src/lib/learning";
import { makeQuestion } from "../src/lib/engine";
import { items, type Item } from "../src/lib/content";
const noun: Item = {
  id: "noun",
  lessonId: "L01",
  skill: "vocabulary",
  group: "noun",
  title: "der Tisch",
  answer: "der Tisch",
  word: "Tisch",
  article: "der",
  meaning: "โต๊ะ",
};
test("noun diagnosis retains simultaneous article and spelling errors", () => {
  const q = makeQuestion(noun, "typing");
  assert.deepEqual(diagnose(q, "die Tish"), {
    correct: false,
    evidence: [
      { dimension: "article", correct: false },
      { dimension: "spelling", correct: false },
      { dimension: "wordRecall", correct: false },
    ],
  });
  assert.deepEqual(diagnose(q, "die Tisch").evidence, [
    { dimension: "article", correct: false },
    { dimension: "spelling", correct: true },
  ]);
  assert.deepEqual(diagnose(q, "Tisch").evidence, [
    { dimension: "article", correct: false },
    { dimension: "spelling", correct: true },
  ]);
  assert.equal(diagnose(q, "der Tisch").correct, true);
});
test("choice, verb, grammar, structure and application assess their actual dimensions", () => {
  for (const [item, mode, dimension] of [
    [noun, "de-th", "wordRecall"],
    [noun, "article", "article"],
    [items.find((i) => i.id === "grammar-L01-sein-0")!, "typing", "verbForm"],
    [items.find((i) => i.group === "Personalpronomen")!, "choice", "grammar"],
    [items.find((i) => i.group === "Satzbau")!, "order", "sentenceStructure"],
    [items.find((i) => i.skill === "writing")!, "typing", "application"],
  ] as const) {
    const q = makeQuestion(item, mode);
    assert.deepEqual(diagnose(q, q.answer).evidence, [
      { dimension, correct: true },
    ]);
    assert.equal(diagnose(q, "incorrect").correct, false);
  }
});
test("accepted writing alternatives are evidence of a correct answer", () => {
  const item = items.find((i) => i.skill === "writing" && i.accepted?.length)!;
  assert.equal(
    diagnose(makeQuestion(item, "typing"), item.accepted![0]).correct,
    true
  );
});
test("a correct attempt is pending until confidence and wrong attempts complete immediately", () => {
  assert.equal(isCompletedAttempt({ correct: true, confidence: null }), false);
  assert.equal(isCompletedAttempt({ correct: true, confidence: "easy" }), true);
  assert.equal(
    isCompletedAttempt({ correct: true, confidence: "thought" }),
    true
  );
  assert.equal(
    isCompletedAttempt({ correct: true, confidence: "guess" }),
    true
  );
  assert.equal(isCompletedAttempt({ correct: false, confidence: null }), true);
  assert.equal(
    completedAttempts([
      { correct: true, confidence: null },
      { correct: false, confidence: null },
    ]).length,
    1
  );
});
test("review candidates use the latest completed answer, ignoring pending correct attempts", () => {
  const selected = items.filter((item) =>
    ["V001", "V002", "V003", "V004", "V005", "V006"].includes(item.id)
  );
  const sessionItems = selected.map((item, ordinal) => ({
    session_id: "review-session",
    ordinal,
    item_id: item.id,
  }));
  const attempts = [
    {
      session_id: "review-session",
      ordinal: 0,
      input: "right",
      correct: true,
      confidence: "easy" as const,
      submitted_at: "2026-01-01T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 0,
      input: "wrong",
      correct: false,
      confidence: null,
      submitted_at: "2026-01-02T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 1,
      input: "right",
      correct: true,
      confidence: "thought" as const,
      submitted_at: "2026-01-02T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 2,
      input: "right",
      correct: true,
      confidence: "easy" as const,
      submitted_at: "2026-01-02T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 3,
      input: "wrong",
      correct: false,
      confidence: null,
      submitted_at: "2026-01-01T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 3,
      input: "right",
      correct: true,
      confidence: "easy" as const,
      submitted_at: "2026-01-03T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 4,
      input: "right",
      correct: true,
      confidence: null,
      submitted_at: "2026-01-03T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 5,
      input: "wrong",
      correct: false,
      confidence: null,
      submitted_at: "2026-01-01T00:00:00Z",
    },
    {
      session_id: "review-session",
      ordinal: 5,
      input: "right but pending",
      correct: true,
      confidence: null,
      submitted_at: "2026-01-03T00:00:00Z",
    },
  ];
  assert.deepEqual(
    reviewCandidates(selected, sessionItems, attempts).map((item) => item.id),
    ["V001", "V002", "V006"]
  );
});
