import assert from "node:assert/strict";
import test from "node:test";
import { parsePracticeHistory, recommendPractice } from "../src/lib/practice-planner";

const question = { id: "L13-phrases-rating-test", itemId: "L13-R001", topicId: "L13-phrases-rating", subskill: "phrase_context", kind: "choice" };
const item = (response = "", checked = false) => ({
  question,
  response,
  attempt: checked ? { correct: true, submittedAt: "2026-10-25T10:00:00.000Z" } : null,
});
const session = (id: string, createdAt: string, items: ReturnType<typeof item>[], position = 0) => ({
  id, createdAt, completed: false, position, items,
});

test("an untouched newer set does not hide a real unfinished round", () => {
  const history = parsePracticeHistory(JSON.stringify({ version: 1, sessions: [
    session("worked", "2026-10-25T10:00:00.000Z", [item("answer", true), item()], 1),
    session("opened-only", "2026-10-25T11:00:00.000Z", [item(), item()]),
  ] }), "/practice/L13/phrases/rating");

  const recommendation = recommendPractice([question], history);
  assert.equal(recommendation.kind, "resume");
  assert.equal(recommendation.href, "/practice/L13/phrases/rating?resume=worked");
});

test("a first-question draft can still be resumed", () => {
  const history = parsePracticeHistory(JSON.stringify({ version: 1, sessions: [
    session("draft", "2026-10-25T11:00:00.000Z", [item("partial")]),
  ] }), "/practice/L13/phrases/rating");

  const recommendation = recommendPractice([question], history);
  assert.equal(recommendation.kind, "resume");
  assert.equal(recommendation.href, "/practice/L13/phrases/rating?resume=draft");
});
