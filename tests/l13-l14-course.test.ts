import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import {
  courseAssets,
  courseCategories,
  courseExercisePatterns,
  l13L14Curriculum,
  validateCurriculum,
  validateCourseRegistry,
} from "../src/lib/l13-l14-course";
import { l13L14PracticeSets } from "../src/lib/l13-l14-course-exercises";
import { buildCrosswordGrid, l14CrosswordPreset } from "../src/lib/l13-l14-crossword";
import {
  completeCourseTopic,
  parseCourseProgress,
  saveCourseDraft,
  summarizeCourseProgress,
} from "../src/lib/l13-l14-course-progress";

test("L13–L14 register all 42 scoped exercise patterns across seven categories", () => {
  assert.deepEqual(validateCourseRegistry(), []);
  assert.equal(courseExercisePatterns.length, 42);
  assert.equal(courseCategories.length, 7);
  for (const category of courseCategories)
    assert(courseExercisePatterns.some((pattern) => pattern.category === category.id));
});

test("both lesson curricula include independent learning routes for all seven categories", () => {
  assert.deepEqual(validateCurriculum(), []);
  assert.deepEqual(l13L14Curriculum.map((lesson) => lesson.id), ["L13", "L14"]);
  for (const lesson of l13L14Curriculum) {
    assert.equal(lesson.categories.length, 7);
    for (const category of lesson.categories) {
      assert(category.topics.length > 0);
      for (const topic of category.topics)
        assert(topic.guidedChecks.length >= 2);
    }
  }
});

test("course image clues resolve to repository assets", () => {
  for (const asset of courseAssets)
    assert(existsSync(`public${asset.src}`), `${asset.id} points to missing ${asset.src}`);
});

test("each lesson exposes two distinct working exercise patterns in all seven categories", () => {
  for (const lessonId of ["L13", "L14"] as const) {
    for (const category of courseCategories) {
      const sets = l13L14PracticeSets.filter((set) => set.lessonId === lessonId && set.category === category.id);
      assert(sets.length >= 2, `${lessonId} ${category.id} has fewer than two exercise sets`);
      assert(new Set(sets.map((set) => set.patternId)).size >= 2, `${lessonId} ${category.id} repeats an exercise pattern`);
      for (const set of sets) {
        if (set.patternId !== "VOC-06") assert(set.questions.length >= 2, `${set.id} needs at least two prompts`);
        assert.equal(set.questions.every((question) => question.kind === set.questions[0].kind), true, `${set.id} mixes plugin kinds`);
      }
    }
  }
});

test("every exercise plugin kind has a live L13 or L14 prompt", () => {
  const promptKinds = new Set(l13L14PracticeSets.flatMap((set) => set.questions.map((question) => question.kind)));
  for (const kind of new Set(courseExercisePatterns.map((pattern) => pattern.kind)))
    assert(promptKinds.has(kind), `no live question uses ${kind}`);
});

test("every pattern in the master exercise matrix has an authored L13–L14 practice set in its category", () => {
  const setPatterns = new Set(l13L14PracticeSets.map((set) => set.patternId));
  assert.equal(new Set(l13L14PracticeSets.map((set) => set.id)).size, l13L14PracticeSets.length, "practice set IDs must be unique");
  for (const pattern of courseExercisePatterns) {
    assert(setPatterns.has(pattern.id), `${pattern.id} has no practice set`);
    assert(l13L14PracticeSets.filter((set) => set.patternId === pattern.id).every((set) => set.category === pattern.category), `${pattern.id} is routed under the wrong category`);
    assert(l13L14PracticeSets.filter((set) => set.patternId === pattern.id).every((set) => set.questions.every((question) => question.kind === pattern.kind)), `${pattern.id} uses the wrong exercise plugin`);
  }
  for (const set of l13L14PracticeSets) {
    assert.equal(set.isOriginalPractice, true);
    assert(set.sourceRefs.length > 0, `${set.id} needs source provenance`);
    assert.equal(new Set(set.questions.map((question) => question.id)).size, set.questions.length, `${set.id} repeats a prompt ID`);
  }
});

test("the provided L14 crossword preset builds a valid 15×8 grid with four intersections", () => {
  const result = buildCrosswordGrid();
  assert.equal(l14CrosswordPreset.gridWidth, 15);
  assert.equal(l14CrosswordPreset.gridHeight, 8);
  assert.deepEqual(result.errors, []);
  assert.equal(result.intersections, 4);
  assert.deepEqual(l14CrosswordPreset.entries.map((entry) => entry.answer), ["POLIZEI", "POST", "AMPEL", "ZENTRUM", "BANK"]);
});

test("course progress updates preserve other categories, drafts, and stored attempts", () => {
  const empty = parseCourseProgress(null);
  assert.equal(empty.kind, "empty");
  const learned = completeCourseTopic(empty.state, "L13-ort-in-der-stadt");
  const drafted = saveCourseDraft(learned, "L14-weg-schreiben", "Gehen Sie geradeaus.");
  const restored = parseCourseProgress(JSON.stringify(drafted));
  assert.equal(restored.kind, "valid");
  if (restored.kind === "valid") {
    assert.deepEqual(restored.state.completedTopics, ["L13-ort-in-der-stadt"]);
    assert.equal(restored.state.drafts["L14-weg-schreiben"], "Gehen Sie geradeaus.");
    assert.deepEqual(restored.state.attempts, []);
  }
});

test("unrecognized course progress remains untouched instead of being overwritten", () => {
  const raw = JSON.stringify({ version: 8, unknown: true });
  const parsed = parseCourseProgress(raw);
  assert.deepEqual(parsed, { kind: "invalid", raw });
});

test("stable progress requires enough independent practice, different patterns, sessions and retention", () => {
  const empty = parseCourseProgress(null);
  assert.equal(empty.kind, "empty");
  const state = empty.state;
  const dates = ["2026-10-01T12:00:00Z", "2026-10-01T12:01:00Z", "2026-10-01T12:02:00Z", "2026-10-01T12:03:00Z", "2026-10-02T12:00:00Z", "2026-10-02T12:01:00Z", "2026-10-02T12:02:00Z", "2026-10-02T12:03:00Z"];
  const attempts = dates.map((submittedAt, index) => ({
    attemptId: `a${index}`, exerciseId: `e${index}`, questionId: `q${index}`, lessonId: "L13" as const,
    category: "grammar" as const, topicIds: ["L13-dativ-pronomen"], primaryCompetency: "grammar.dative",
    patternId: (["GR-02", "GR-05", "GR-07"] as const)[index % 3], response: "mir", startedAt: submittedAt,
    submittedAt, correctness: 1, maxScore: 1, hintsUsed: index === 0 ? 1 : 0, retryNumber: 0,
    evaluationMethod: "deterministic" as const, answerVersion: "v1",
  }));
  const summary = summarizeCourseProgress({ ...state, attempts });
  assert.equal(summary.independentAttempts, 7);
  assert.equal(summary.stable, false);
  const ready = summarizeCourseProgress({ ...state, attempts: [...attempts, { ...attempts[0], attemptId: "a8", submittedAt: "2026-10-03T12:00:00Z", startedAt: "2026-10-03T12:00:00Z", hintsUsed: 0 }] });
  assert.equal(ready.independentAttempts, 8);
  assert.equal(ready.uniquePatterns, 3);
  assert.equal(ready.sessions, 3);
  assert.equal(ready.retentionCheck, true);
  assert.equal(ready.stable, true);
});
