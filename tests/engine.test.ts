import test from "node:test";
import assert from "node:assert/strict";
import {
  coreVocabulary,
  extraVocabulary,
  items,
  lessons,
  itemById,
} from "../src/lib/content";
import {
  adaptiveHint,
  emptyStore,
  isCorrect,
  makeQuestion,
  mastery,
  mergeStore,
  parseBackup,
  record,
  sessionItems,
  status,
} from "../src/lib/engine";

test("preserves all 181 core identifiers across 12 lessons and keeps extra vocabulary separate", () => {
  assert.equal(coreVocabulary.length, 181);
  assert.equal(lessons.length, 12);
  assert.equal(new Set(coreVocabulary.map((w) => w.id)).size, 181);
  assert.equal(coreVocabulary.filter((w) => w.lessonId === "L01").length, 7);
  assert.equal(extraVocabulary.length, 16);
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  for (let i = 1; i <= 181; i++)
    assert(itemById.has(`V${String(i).padStart(3, "0")}`));
});
test("keeps articles on nouns, distinguishes plural-only nouns", () => {
  const parent = coreVocabulary.find((w) => w.word === "Eltern")!;
  assert.equal(parent.title, "die Eltern");
  assert.equal(parent.pluralOnly, true);
  for (const w of coreVocabulary.filter((i) => i.article))
    assert(w.title.startsWith(w.article + " "));
  assert.equal(
    coreVocabulary.filter((w) => w.lessonId === "L01" && w.article).length,
    0
  );
});
test("sessions cap at available content and never duplicate IDs", () => {
  const pool = coreVocabulary.filter((i) => i.lessonId === "L01");
  const queue = sessionItems([...pool, pool[0]], 20, {}, true);
  assert.equal(queue.length, 7);
  assert.equal(new Set(queue.map((i) => i.id)).size, 7);
  assert.equal(sessionItems(pool, 5, {}, false).length, 5);
});
test("wrong answers become due immediately and are prioritized", () => {
  const state = record(emptyStore(), "V001", false, "typing", 1000);
  assert.equal(status(state.progress.V001, 1000), "review");
  assert.equal(
    sessionItems(coreVocabulary, 5, state.progress, true, 1000)[0].id,
    "V001"
  );
});
test("one correct choice is not mastery and review intervals grow", () => {
  let state = record(emptyStore(), "V001", true, "de-th", 1000);
  assert.equal(status(state.progress.V001, 1000), "learning");
  const firstDue = state.progress.V001.nextReview;
  state = record(state, "V001", true, "typing", 2000);
  state = record(state, "V001", true, "typing", 3000);
  state = record(state, "V001", true, "typing", 4000);
  assert.equal(status(state.progress.V001, 4000), "mastered");
  assert(state.progress.V001.nextReview > firstDue);
  assert.equal(
    status(state.progress.V001, state.progress.V001.nextReview),
    "review"
  );
});
test("typing has higher weight and errors distinguish article from spelling", () => {
  const choice = record(emptyStore(), "V008", true, "th-de", 1000);
  const typed = record(emptyStore(), "V008", true, "typing", 1000);
  assert(mastery(typed.progress.V008) > mastery(choice.progress.V008));
  const wrong = record(typed, "V008", false, "typing", 2000, {
    articleWrong: true,
    spellingWrong: false,
  });
  assert.equal(wrong.progress.V008.articleWrong, 1);
  assert.equal(wrong.progress.V008.spellingWrong, 0);
  assert.equal(wrong.progress.V008.streak, 0);
});
test("answer normalization preserves German capitalization and umlauts", () => {
  assert(isCorrect("  Ich  heiße Sun! ", "Ich heiße Sun."));
  assert(!isCorrect("ich heiße Sun", "Ich heiße Sun."));
  assert(!isCorrect("schon", "schön"));
  assert(!isCorrect("sie", "Sie"));
  assert(
    isCorrect("Mein Name ist Sun.", "Ich heiße Sun.", ["Mein Name ist Sun."])
  );
});
test("adaptive hint avoids the last mask and eventually reaches full recall", () => {
  const first = adaptiveHint("Deutschland", undefined, () => 0.3);
  let state = record(emptyStore(), "extra-L01-2", true, "typing", 1000, {
    hidden: first.hidden,
  });
  const second = adaptiveHint(
    "Deutschland",
    state.progress["extra-L01-2"],
    () => 0.3
  );
  assert.notDeepEqual(first.hidden, second.hidden);
  for (let i = 0; i < 3; i++)
    state = record(state, "extra-L01-2", true, "typing", 2000 + i);
  assert.equal(
    adaptiveHint("Deutschland", state.progress["extra-L01-2"]).text,
    "___________"
  );
});
test("question choices include exactly one correct answer", () => {
  for (const item of items) {
    const q = makeQuestion(
      item,
      item.skill === "vocabulary" ? "de-th" : "choice"
    );
    assert.equal(q.options.filter((v) => v === q.answer).length, 1);
    assert.equal(new Set(q.options).size, q.options.length);
  }
});
test("legacy progress imports counters with the original IDs", () => {
  const result = parseBackup({
    version: 1,
    progress: {
      V001: {
        right: 5,
        wrong: 2,
        streak: 3,
        lastSeen: 1234,
        lastResult: "right",
        articleWrong: 1,
        lastHidden: [1, 3],
      },
    },
  });
  assert.equal(result.progress.V001.right, 5);
  assert.equal(result.progress.V001.lastPracticed, 1234);
  assert.equal(result.progress.V001.articleWrong, 1);
  assert.equal(result.version, 5);
});
test("malformed backups fail without accepting arbitrary objects", () => {
  for (const input of [
    [],
    null,
    { hello: "world" },
    { version: 999, progress: {} },
    { progress: { V001: { right: -1 } } },
    { progress: { V001: { right: "3" } } },
    { progress: [] },
    { progress: { V001: { right: Infinity } } },
  ])
    assert.throws(() => parseBackup(input));
});
test("backup roundtrip keeps settings, counters, modes and daily activity", () => {
  const state = record(
    emptyStore(),
    "V001",
    true,
    "typing",
    Date.UTC(2026, 8, 24, 9)
  );
  state.settings.sessionSize = 20;
  assert.deepEqual(parseBackup(JSON.parse(JSON.stringify(state))), state);
});
test("imports merge latest per item, preserve other items and avoid double counting", () => {
  let current = record(emptyStore(), "V001", true, "typing", 3000);
  current = record(current, "V002", true, "typing", 2000);
  const older = record(emptyStore(), "V001", false, "typing", 1000);
  assert.deepEqual(mergeStore(current, older).progress, current.progress);
  assert.deepEqual(mergeStore(current, current), current);
  const newer = record(emptyStore(), "V001", false, "typing", 4000);
  assert.equal(mergeStore(current, newer).progress.V001.lastResult, "wrong");
  assert(mergeStore(current, newer).progress.V002);
});
