import assert from "node:assert/strict";
import test from "node:test";
import { l13ChallengeResponses, l13VocabularyChallengeActivities } from "../src/lib/l13-vocabulary-challenge-bank";
import { activityResponseIds, nextChallengeRound, readChallengeState, readPartOrder, type VocabularyChallengeState } from "../src/lib/l13-vocabulary-challenge-state";

test("a saved sentence-by-sentence round resumes as the full story without losing its first answer or draft", () => {
  const state = readChallengeState(JSON.stringify({
    version: 1, id: "legacy-round", position: 1, completed: false,
    responses: { "story-market": { answer: "L13-V010", correct: true, submittedAt: "2026-10-24T00:00:00.000Z" } },
    drafts: { "story-museum": "L13-V019" },
  }), l13VocabularyChallengeActivities);
  assert(state);
  assert.equal(state.round.position, 0);
  assert.equal(state.round.activityIds[0], "story-day");
  assert.equal(state.round.activityIds.length, 12);
  assert.deepEqual(state.round.responses["story-market"], { answer: "L13-V010", correct: true, submittedAt: "2026-10-24T00:00:00.000Z" });
  assert.equal(state.round.drafts["story-museum"], "L13-V019");
});

function complete(state: VocabularyChallengeState): VocabularyChallengeState {
  const roundIds = new Set(state.round.activityIds);
  const responseIds = new Set(l13VocabularyChallengeActivities.filter(activity => roundIds.has(activity.id)).flatMap(activityResponseIds));
  const responses = Object.fromEntries(l13ChallengeResponses.filter(response => responseIds.has(response.id)).map(response => [response.id, { answer: response.answer, correct: true, confidence: "easy" as const, submittedAt: "2026-10-24T00:00:00.000Z", ...(response.assessment ? { assessment: response.assessment } : {}) }]));
  return { ...state, round: { ...state.round, position: state.round.activityIds.length, responses, completedAt: "2026-10-24T00:00:00.000Z" } };
}

test("practice uses at most 15 activities and reaches all 88 before repeating an unseen activity", () => {
  let state = readChallengeState(null, l13VocabularyChallengeActivities);
  assert(state);
  const seen = new Set<string>();
  for (let round = 0; round < 6; round++) {
    assert.equal(state.round.activityIds.length, 15);
    if (round < 5) assert(state.round.activityIds.every(id => !seen.has(id)));
    for (const id of state.round.activityIds) seen.add(id);
    state = nextChallengeRound(complete(state), l13VocabularyChallengeActivities);
  }
  assert.equal(seen.size, 88);
});

test("fresh queues use only activities whose required targets were learned", () => {
  const learned = new Set(["L13-V003", "L13-V015", "L13-V047", "L13-V020"]);
  const eligible = l13VocabularyChallengeActivities.filter(activity => activity.requiredItemIds.every(id => learned.has(id)));
  const state = readChallengeState(null, eligible);
  assert(state);
  assert(state.round.activityIds.length > 0);
  assert(state.round.activityIds.every(id => eligible.some(activity => activity.id === id)));
  assert(!state.round.activityIds.includes("story-day"));
});

test("saved rounds retain drafts, responses and archived history", () => {
  const initial = readChallengeState(null, l13VocabularyChallengeActivities);
  assert(initial);
  const state = nextChallengeRound(complete(initial), l13VocabularyChallengeActivities);
  assert.deepEqual(readChallengeState(JSON.stringify(state), l13VocabularyChallengeActivities), state);
  assert.equal(state.history.length, 1);
});

test("word-part drafts reject duplicate positions and retain a valid editable order", () => {
  assert.deepEqual(readPartOrder("[1,0]", 2), [1, 0]);
  assert.deepEqual(readPartOrder("[0,0]", 2), []);
  assert.deepEqual(readPartOrder("[2]", 2), []);
});

test("picture-Artikel practice keeps the mixed round and binds evidence only to Artikel", () => {
  const initial = readChallengeState(null, l13VocabularyChallengeActivities);
  assert(initial);
  const focused = nextChallengeRound(initial, l13VocabularyChallengeActivities, "pictureArticle");
  assert.deepEqual(focused.round, initial.round);
  assert.equal(focused.articleRound?.activityIds.length, 15);
  assert(focused.articleRound?.activityIds.every(id => id.startsWith("picture-article-")));
  const completed = complete({ ...focused, round: focused.articleRound });
  const saved = { ...focused, articleRound: completed.round };
  const reloaded = readChallengeState(JSON.stringify(saved), l13VocabularyChallengeActivities);
  assert(reloaded);
  assert(reloaded.articleRound);
  assert.deepEqual(reloaded.round, initial.round);
  assert(Object.values(reloaded.articleRound.responses).every(response => response.assessment?.subskill === "vocabulary_article" && response.assessment.assistance === "image-and-noun-no-article"));
  const invalid = structuredClone(saved);
  const first = Object.values(invalid.articleRound.responses)[0];
  delete first.assessment;
  assert.equal(readChallengeState(JSON.stringify(invalid), l13VocabularyChallengeActivities), null);
});

test("correct answers resume and complete with unknown confidence", () => {
  const activity = l13VocabularyChallengeActivities.find(activity => activity.id === "picture-brunnen");
  assert(activity && activity.kind === "picture");
  const state = readChallengeState(null, [activity]);
  assert(state);
  state.round.responses[activity.id] = { answer: activity.answer, correct: true, confidence: null, submittedAt: "2026-10-25T00:00:00.000Z" };
  assert.deepEqual(readChallengeState(JSON.stringify(state), [activity]), state);
  state.round.completedAt = "2026-10-25T00:00:00.000Z";
  assert.deepEqual(readChallengeState(JSON.stringify(state), [activity]), state);
  state.round.responses[activity.id].confidence = "guess";
  assert.deepEqual(readChallengeState(JSON.stringify(state), [activity]), state);
});

test("correct guessed or effortful answers are reviewed before confidently correct answers", () => {
  const activities = l13VocabularyChallengeActivities.filter(activity => ["picture-brunnen", "picture-hafen"].includes(activity.id));
  for (const confidence of ["guess", "thought"] satisfies ("guess" | "thought")[]) {
    const initial = readChallengeState(null, activities);
    assert(initial);
    const completed = complete(initial);
    completed.round.responses["picture-brunnen"].confidence = confidence;
    const next = nextChallengeRound(completed, activities);
    assert.equal(next.round.activityIds[0], "picture-brunnen");
  }
});
