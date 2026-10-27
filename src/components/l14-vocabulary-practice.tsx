"use client";

import Image from "next/image";
import { ArticleLegend, ArticleDot } from "./profession-matching";
import { NounText, NounPrefix } from "./noun-text";
import { nounPresentation } from "@/lib/noun-presentation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Item } from "@/lib/content";
import type { L14RouteKind } from "@/lib/guided-learning";
import { buildL14VocabularyFlow } from "@/lib/a13-grammar-learning";
import { readGuidedState } from "@/lib/guided-learning";
import { catalogVocabularyImageSource } from "@/lib/vocabulary-image-content";
import { readLearnedImageVocabularyIds } from "@/lib/vocabulary-image-learning-storage";
import { RouteDiagram } from "./guided-activities";
import { useContent } from "./content-provider";
import { useLearning } from "./learning-store";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { isL14VocabularyPracticeAvailable, useStore } from "./store";
import { PracticeLanding } from "./practice-landing";
import type { PhrasePracticeEvidence } from "./phrase-practice-ui";
import { VocabularyFeedbackAudio } from "./vocabulary-feedback-audio";
import { l14VocabularyContextCases } from "@/lib/l14-vocabulary-context-bank";

type Topic = "institutions" | "places" | "directions";
type Kind = "meaning" | "article" | "spelling" | "context";
type Subskill = "vocabulary_meaning" | "vocabulary_article" | "vocabulary_spelling" | "vocabulary_context";
type Difficulty = 1 | 2 | 3;
type QuestionBase = {
  id: string;
  itemId: string;
  topic: Topic;
  answer: string;
  options: string[];
  meaning: string;
  german: string;
  subskill: Subskill;
  difficulty: Difficulty;
  assistance: string;
  requiredItemIds: string[];
  version: 1;
  image?: string;
  route?: L14RouteKind;
};
type Question = QuestionBase & (
  | { kind: "meaning" | "article" | "spelling" }
  | { kind: "context"; prompt: string; translation: string }
);
type Evidence = { taskVersion: 1; targetId: string; subskill: Subskill; difficulty: Difficulty; assistanceAvailable: string; assistanceUsed: string[]; selectionReason: string; policyVersion: "l14-vocab-2" };
type Attempt = { questionId: string; answer: string; correct: boolean; submittedAt: string; evidence?: Evidence };
type Run = { id: string; bank: string; questionIds: string[]; position: number; attempts: Attempt[]; drafts: Record<string, string>; completed: boolean; updatedAt: string; selectionReasons?: Record<string, string>; helpUsed?: Record<string, boolean> };
type Sessions = { version: 1; banks: Record<string, Run>; history: Run[] };

const stateKey = lessonStateKeys.l14VocabularyPractice;
const topicOrder: Topic[] = ["institutions", "places", "directions"];
const topicInfo: Record<Topic, { title: string; group: string; learnHref: string }> = {
  institutions: { title: "สถานที่ราชการและบริการ", group: "Institutionen", learnHref: "/learn/L14/vocabulary/images/institutionen" },
  places: { title: "สถานที่และทางในเมือง", group: "Plätze und Wege", learnHref: "/learn/L14/vocabulary/images/platze-und-wege" },
  directions: { title: "คำบอกทาง", group: "Wegbeschreibung", learnHref: "/learn/L14/vocabulary/directions" },
};
const directionRoute: Record<string, L14RouteKind> = {
  "L14-V019": "straight", "L14-V020": "right", "L14-V021": "left", "L14-V022": "turn-right",
  "L14-V023": "turn-left", "L14-V024": "cross", "L14-V026": "distance",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function topicFor(item: Item): Topic | null {
  return topicOrder.find(topic => topicInfo[topic].group === item.group) ?? null;
}
function stem(item: Item) { return item.answer.replace(/^(der|die|das)\s/u, ""); }
function article(item: Item) { return /^(der|die|das)\s/u.exec(item.answer)?.[1] ?? null; }
function makeOptions(item: Item, topic: Topic, words: Item[], index: number): string[] {
  const ambiguous = (candidate: Item) => ["L14-V010", "L14-V017"].includes(item.id) && ["L14-V010", "L14-V017"].includes(candidate.id);
  const alternatives = words.filter(candidate => candidate.id !== item.id && candidate.answer !== item.answer
    && topicFor(candidate) === topic && candidate.meaning !== item.meaning && !ambiguous(candidate));
  const others = words.filter(candidate => candidate.id !== item.id && candidate.answer !== item.answer
    && !alternatives.includes(candidate) && candidate.meaning !== item.meaning && !ambiguous(candidate));
  const distractors = [...alternatives, ...others].slice((index * 2) % Math.max(1, alternatives.length), (index * 2) % Math.max(1, alternatives.length) + 2);
  for (const candidate of [...alternatives, ...others]) {
    if (distractors.length === 2) break;
    if (!distractors.some(existing => existing.id === candidate.id)) distractors.push(candidate);
  }
  const options = distractors.map(candidate => candidate.answer);
  options.splice(index % 3, 0, item.answer);
  return options;
}
function questionBank(items: Item[]): Question[] {
  const words = items.filter(item => item.lessonId === "L14" && item.skill === "vocabulary" && topicFor(item));
  return words.flatMap((item, index) => {
    const topic = topicFor(item);
    if (!topic) return [];
    const common = {
      itemId: item.id, topic, meaning: item.meaning, german: item.answer,
      ...(item.image ? { image: catalogVocabularyImageSource("L14", item.image) } : {}),
      ...(directionRoute[item.id] ? { route: directionRoute[item.id] } : {}),
    };
    const questions: Question[] = [
      { ...common, id: `${item.id}-meaning`, kind: "meaning", answer: item.answer, options: makeOptions(item, topic, words, index), subskill: "vocabulary_meaning", difficulty: 1, assistance: "picture-or-route-and-three-choices", requiredItemIds: [item.id], version: 1 },
      { ...common, id: `${item.id}-spelling`, kind: "spelling", answer: stem(item), options: [], subskill: "vocabulary_spelling", difficulty: 2, assistance: "thai-meaning-first-letter-and-artikel", requiredItemIds: [item.id], version: 1 },
    ];
    const correctArticle = article(item);
    if (correctArticle) questions.push({ ...common, id: `${item.id}-article`, kind: "article", answer: correctArticle, options: ["der", "die", "das"], subskill: "vocabulary_article", difficulty: 2, assistance: "noun-without-artikel-and-three-choices", requiredItemIds: [item.id], version: 1 });
    return questions;
  }).concat(l14VocabularyContextCases.flatMap((context, index) => {
    const target = words.find(item => item.id === context.targetId);
    const options = context.optionIds.map(id => words.find(item => item.id === id)).filter((item): item is Item => Boolean(item));
    const topic = target && topicFor(target);
    if (!target || !topic || options.length !== 3) return [];
    return ([
      { id: `${target.id}-context-supported`, itemId: target.id, topic, kind: "context", answer: target.answer, options: options.map(option => option.answer), meaning: target.meaning, german: target.answer, subskill: "vocabulary_context", difficulty: 2, assistance: "thai-translation-and-three-choices", requiredItemIds: [...context.optionIds], version: 1, prompt: context.prompt, translation: context.translation },
      { id: `${target.id}-context`, itemId: target.id, topic, kind: "context", answer: target.answer, options: options.map(option => option.answer), meaning: target.meaning, german: target.answer, subskill: "vocabulary_context", difficulty: 3, assistance: "german-situation-three-choices-optional-translation", requiredItemIds: [...context.optionIds], version: 1, prompt: context.prompt, translation: context.translation },
    ] satisfies Question[]).map(question => ({ ...question, options: [...question.options.slice(index % 3), ...question.options.slice(0, index % 3)] }));
  }));
}
export function l14VocabularyLearnedIds(items: Item[], imageRaw: string | null, guidedRaw: string | null, exposedIds: readonly string[]): Set<string> {
  const flow = buildL14VocabularyFlow();
  return new Set([
    ...readLearnedImageVocabularyIds(imageRaw),
    ...readGuidedState(guidedRaw, flow, items).learnedContentIds,
    ...exposedIds.filter(id => id.startsWith("L14-V")),
  ]);
}
function parseRun(raw: unknown, questions: Map<string, Question>): Run | null {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.bank !== "string" || !Array.isArray(raw.questionIds)
    || !raw.questionIds.every(id => typeof id === "string" && questions.has(id))
    || typeof raw.position !== "number" || !Number.isInteger(raw.position) || raw.position < 0 || raw.position > raw.questionIds.length
    || !Array.isArray(raw.attempts) || !isRecord(raw.drafts) || typeof raw.updatedAt !== "string"
    || !Number.isFinite(Date.parse(raw.updatedAt)) || typeof raw.completed !== "boolean") return null;
  const questionIds = raw.questionIds.map(id => String(id));
  if (Object.entries(raw.drafts).some(([id, draft]) => !questionIds.includes(id) || typeof draft !== "string")) return null;
  const attempts: Attempt[] = [];
  for (const value of raw.attempts) {
    if (!isRecord(value) || typeof value.questionId !== "string" || !questionIds.includes(value.questionId)
      || typeof value.answer !== "string" || typeof value.correct !== "boolean" || typeof value.submittedAt !== "string"
      || !Number.isFinite(Date.parse(value.submittedAt))) return null;
    const question = questions.get(value.questionId);
    if (!question || value.correct !== (value.answer.trim() === question.answer)) return null;
    let evidence: Evidence | undefined;
    if (value.evidence !== undefined) {
      const detail = value.evidence;
      if (!isRecord(detail) || detail.taskVersion !== question.version || detail.targetId !== question.itemId
        || detail.subskill !== question.subskill || detail.difficulty !== question.difficulty
        || detail.assistanceAvailable !== question.assistance || !Array.isArray(detail.assistanceUsed)
        || !detail.assistanceUsed.every(entry => typeof entry === "string")
        || typeof detail.selectionReason !== "string" || detail.policyVersion !== "l14-vocab-2") return null;
      evidence = { taskVersion: question.version, targetId: question.itemId, subskill: question.subskill,
        difficulty: question.difficulty, assistanceAvailable: question.assistance,
        assistanceUsed: detail.assistanceUsed, selectionReason: detail.selectionReason, policyVersion: "l14-vocab-2" };
    }
    attempts.push({ questionId: value.questionId, answer: value.answer, correct: value.correct, submittedAt: value.submittedAt, ...(evidence ? { evidence } : {}) });
  }
  const reasons = raw.selectionReasons;
  if (reasons !== undefined && !isRecord(reasons)) return null;
  const selectionReasons: Record<string, string> = {};
  if (reasons) for (const [id, reason] of Object.entries(reasons)) {
    if (!questionIds.includes(id) || typeof reason !== "string") return null;
    selectionReasons[id] = reason;
  }
  const helped = raw.helpUsed;
  if (helped !== undefined && !isRecord(helped)) return null;
  const helpUsed: Record<string, boolean> = {};
  if (helped) for (const [id, used] of Object.entries(helped)) {
    if (!questionIds.includes(id) || used !== true) return null;
    helpUsed[id] = true;
  }
  return { id: raw.id, bank: raw.bank, questionIds, position: raw.position, attempts, drafts: Object.fromEntries(Object.entries(raw.drafts).map(([id, draft]) => [id, String(draft)])), completed: raw.completed, updatedAt: raw.updatedAt,
    ...(reasons ? { selectionReasons } : {}), ...(helped ? { helpUsed } : {}) };
}
function readSessions(raw: string | null, questions: Map<string, Question>): Sessions {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!isRecord(value) || !isRecord(value.banks)) return { version: 1, banks: {}, history: [] };
    const banks = Object.fromEntries(Object.entries(value.banks).flatMap(([bank, run]) => {
      const parsed = parseRun(run, questions);
      return parsed && parsed.bank === bank ? [[bank, parsed]] : [];
    }));
    const history = Array.isArray(value.history) ? value.history.map(run => parseRun(run, questions)).filter((run): run is Run => run !== null) : [];
    return { version: 1, banks, history };
  } catch { return { version: 1, banks: {}, history: [] }; }
}
function allAttempts(sessions: Sessions): Attempt[] {
  return [...sessions.history, ...Object.values(sessions.banks)].flatMap(run => run.attempts);
}
function selectQuestions(bank: string, sessions: Sessions, learned: Set<string>, questions: Question[], now = Date.now()): string[] {
  const questionById = new Map(questions.map(question => [question.id, question]));
  const runs = [...sessions.history, ...Object.values(sessions.banks)];
  const attemptsFor = (id: string, subskill?: Subskill) => runs.flatMap(run => run.attempts
    .filter(attempt => { const question = questionById.get(attempt.questionId); return question?.itemId === id && (!subskill || question.subskill === subskill); })
    .map(attempt => ({ attempt, runId: run.id }))).sort((a, b) => a.attempt.submittedAt.localeCompare(b.attempt.submittedAt));
  const candidates = [...new Set(questions.filter(question => learned.has(question.itemId) && question.kind !== "context").map(question => question.itemId))];
  const score = (id: string) => {
    const bySubskill = (["vocabulary_meaning", "vocabulary_article", "vocabulary_spelling", "vocabulary_context"] satisfies Subskill[])
      .map(subskill => attemptsFor(id, subskill).at(-1)?.attempt);
    if (bySubskill.some(attempt => attempt && !attempt.correct)) return 80;
    const latest = attemptsFor(id).at(-1)?.attempt;
    if (!latest) return 55;
    const age = now - Date.parse(latest.submittedAt);
    return (bySubskill.some(attempt => !attempt) ? 45 : 10) + (age >= 3 * 86400000 ? 25 : 0) - (age < 86400000 ? 20 : 0);
  };
  const contextQuestionFor = (id: string) => {
    const contextAttempts = attemptsFor(id, "vocabulary_context");
    const last = contextAttempts.at(-1);
    const supportedSuccesses = new Set(contextAttempts.filter(({ attempt }) => attempt.correct && attempt.evidence?.difficulty === 2).map(entry => entry.runId));
    const independentSuccess = last?.attempt.correct && last.attempt.evidence?.difficulty === 3
      && !last.attempt.evidence.assistanceUsed.includes("thai-translation");
    const probe = last?.attempt.correct && (independentSuccess || supportedSuccesses.size >= 2);
    return questions.find(question => question.itemId === id && question.id === `${id}-${probe ? "context" : "context-supported"}`);
  };
  const questionFor = (id: string, order: number, includeContext: boolean) => {
    const variants = questions.filter(question => question.itemId === id);
    const first: Kind[] = order % 5 === 4 ? ["meaning", "spelling", "article"] : ["meaning", "article", "spelling"];
    const latestBySkill = new Map<Subskill, Attempt>();
    for (const { attempt } of attemptsFor(id)) {
      const question = questionById.get(attempt.questionId);
      if (question) latestBySkill.set(question.subskill, attempt);
    }
    const wrong = [...latestBySkill.entries()].find(([, attempt]) => !attempt.correct)?.[0];
    if (wrong === "vocabulary_context" && includeContext) return contextQuestionFor(id);
    if (wrong) {
      const variant = variants.find(question => question.subskill === wrong && question.kind !== "context");
      if (variant) return variant;
    }
    const newKind = first.find(kind => variants.some(question => question.kind === kind && !latestBySkill.has(question.subskill)));
    if (newKind) return variants.find(question => question.kind === newKind);
    if (includeContext && variants.some(question => question.kind === "context" && question.requiredItemIds.every(target => learned.has(target)))) return contextQuestionFor(id);
    return first.map(kind => variants.find(question => question.kind === kind))
      .filter((question): question is Question => Boolean(question))
      .sort((a, b) => (latestBySkill.get(a.subskill)?.submittedAt ?? "").localeCompare(latestBySkill.get(b.subskill)?.submittedAt ?? ""))[0];
  };
  if (bank === "challenge") return candidates.filter(id => {
    const context = questions.find(question => question.id === `${id}-context-supported`);
    return context?.requiredItemIds.every(target => learned.has(target));
  }).sort((a, b) => score(b) - score(a)).slice(0, 15).flatMap(id => contextQuestionFor(id)?.id ?? []);
  if (bank === "daily") {
    const chosen: string[] = [];
    const topicUses = new Map<Topic, number>();
    while (chosen.length < 10) {
      const next = candidates.filter(id => !chosen.includes(id)).sort((a, b) => {
        const topicA = questions.find(question => question.itemId === a)?.topic;
        const topicB = questions.find(question => question.itemId === b)?.topic;
        return score(b) - (topicB ? (topicUses.get(topicB) ?? 0) * 8 : 0) - score(a) + (topicA ? (topicUses.get(topicA) ?? 0) * 8 : 0);
      })[0];
      if (!next) break;
      chosen.push(next);
      const topic = questions.find(question => question.itemId === next)?.topic;
      if (topic) topicUses.set(topic, (topicUses.get(topic) ?? 0) + 1);
    }
    return chosen.flatMap((id, index) => questionFor(id, index, true)?.id ?? []);
  }
  const topics = bank === "basic" ? topicOrder : topicOrder.filter(topic => topic === bank);
  return topics.flatMap(topic => candidates.filter(id => questions.some(question => question.itemId === id && question.topic === topic))
    .sort((a, b) => score(b) - score(a)).slice(0, 5).flatMap((id, index) => questionFor(id, index, false)?.id ?? []));
}
function newRun(bank: string, sessions: Sessions, learned: Set<string>, questions: Question[]): Run {
  const questionIds = selectQuestions(bank, sessions, learned, questions);
  const prior = allAttempts(sessions);
  const selectionReasons = Object.fromEntries(questionIds.map(id => {
    const question = questions.find(entry => entry.id === id);
    const previous = prior.filter(attempt => questions.find(entry => entry.id === attempt.questionId)?.itemId === question?.itemId
      && questions.find(entry => entry.id === attempt.questionId)?.subskill === question?.subskill)
      .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt)).at(-1);
    const reason = !previous ? "explore-unmeasured-subskill"
      : !previous.correct ? "retry-same-subskill"
      : question?.difficulty === 3 && previous.evidence?.difficulty === 2 ? "reduce-help-after-supported-success"
      : "review-previously-correct-subskill";
    return [id, reason];
  }));
  return { id: crypto.randomUUID(), bank, questionIds, position: 0,
    attempts: [], drafts: {}, completed: false, updatedAt: new Date().toISOString(), selectionReasons, helpUsed: {} };
}
export function recommendL14VocabularyPractice(raw: string | null, items: Item[], learned: Set<string>) {
  const questions = questionBank(items);
  const sessions = readSessions(raw, new Map(questions.map(question => [question.id, question])));
  const eligible = (run: Run) => run.questionIds.length > 0 && run.questionIds.every(id => questions.find(question => question.id === id)?.requiredItemIds.every(target => learned.has(target)));
  const pending = Object.values(sessions.banks).filter(run => !run.completed && run.attempts.length > 0 && eligible(run))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const activityAt = Math.max(0, ...allAttempts(sessions).map(attempt => Date.parse(attempt.submittedAt)), pending ? Date.parse(pending.updatedAt) : 0);
  if (pending) return { kind: "resume", title: "ทำคำศัพท์บท 14 ต่อ", description: `ตรวจแล้ว ${pending.attempts.length} จาก ${pending.questionIds.length} ข้อ`,
    href: `/practice/L14/vocabulary/${pending.bank}`, action: "ฝึกต่อ", activityAt };
  if (!learned.size) return { kind: "learn", title: "เรียนคำศัพท์บท 14", description: "เริ่มจากจับคู่คำกับภาพ แล้วกลับมาฝึกคำที่เรียนแล้ว",
    href: "/learn/L14/vocabulary", action: "ไปเรียน", activityAt };
  const practiced = allAttempts(sessions).length > 0;
  const count = selectQuestions(practiced ? "daily" : "basic", sessions, learned, questions).length;
  return { kind: practiced ? "daily" : "start", title: practiced ? "ทบทวนคำศัพท์บท 14 วันนี้" : "ฝึกคำศัพท์บท 14",
    description: practiced ? "คละคำใหม่ คำที่เคยผิด และคำที่เว้นฝึก" : "ฝึกคำที่เรียนแล้วจากสถานที่และคำบอกทาง",
    href: `/practice/L14/vocabulary/${practiced ? "daily" : "basic"}`, action: `เริ่มฝึก ${count} ข้อ`, activityAt };
}

export function L14VocabularyPractice({ slug }: { slug?: string }) {
  const { user } = useStore();
  const { items } = useContent();
  const history = useLearning();
  const storage = useLessonState();
  const questions = useMemo(() => questionBank(items), [items]);
  const questionById = useMemo(() => new Map(questions.map(question => [question.id, question])), [questions]);
  const exposureIds = useMemo(() => history.exposures.map(exposure => exposure.item_id), [history.exposures]);
  const learned = useMemo(() => l14VocabularyLearnedIds(items, storage.read(lessonStateKeys.vocabularyImages("L14")), storage.read(lessonStateKeys.l14Vocabulary), exposureIds), [items, storage, exposureIds]);
  const [sessions, setSessions] = useState(() => readSessions(storage.read(stateKey), questionById));
  const bank = slug && (slug === "basic" || slug === "daily" || slug === "challenge" || topicOrder.includes(slug as Topic)) ? slug : null;
  const run = bank ? sessions.banks[bank] : undefined;
  const eligible = run?.questionIds.every(id => questionById.get(id)?.requiredItemIds.every(target => learned.has(target))) ?? true;
  const question = run ? questionById.get(run.questionIds[run.position]) : undefined;
  const attempt = question ? run?.attempts.find(entry => entry.questionId === question.id) : undefined;
  useEffect(() => { if (user && isL14VocabularyPracticeAvailable(user)) storage.write(stateKey, JSON.stringify(sessions)); }, [sessions, storage, user]);
  useEffect(() => {
    if (!bank) return;
    const previous = sessions.banks[bank];
    if (previous && (previous.questionIds.length > 0 || selectQuestions(bank, sessions, learned, questions).length === 0)) return;
    setSessions(current => ({ ...current, banks: { ...current.banks, [bank]: newRun(bank, current, learned, questions) } }));
  }, [bank, sessions, learned, questions]);
  const changeRun = (update: (current: Run) => Run) => {
    if (!bank) return;
    setSessions(current => {
      const previous = current.banks[bank];
      if (!previous) return current;
      return { ...current, banks: { ...current.banks, [bank]: { ...update(previous), updatedAt: new Date().toISOString() } } };
    });
  };
  const begin = (nextBank: string) => {
    const previous = sessions.banks[nextBank];
    const history = previous?.completed ? [...sessions.history, previous] : sessions.history;
    const base = { ...sessions, history };
    const next = { ...base, banks: { ...base.banks, [nextBank]: previous && !previous.completed ? previous : newRun(nextBank, base, learned, questions) } };
    storage.write(stateKey, JSON.stringify(next));
    setSessions(next);
  };
  if (!isL14VocabularyPracticeAvailable(user)) return <main className="l14-vocab-practice"><h1>กำลังเตรียมแบบฝึกคำศัพท์บท 14</h1><Link href="/learn/L14/vocabulary">ไปเรียนคำศัพท์</Link></main>;
  if (!bank) {
    const recommendation = recommendL14VocabularyPractice(JSON.stringify(sessions), items, learned);
    const pending = recommendation.kind === "resume"
      ? Object.values(sessions.banks).find(run => !run.completed && recommendation.href === `/practice/L14/vocabulary/${run.bank}`)
      : undefined;
    const evidence: PhrasePracticeEvidence[] = allAttempts(sessions)
      .flatMap(entry => {
        const source = questionById.get(entry.questionId);
        return source ? [{ correct: entry.correct, topic: topicInfo[source.topic].title, at: Date.parse(entry.submittedAt) || 0 }] : [];
      })
      .sort((a, b) => b.at - a.at)
      .slice(0, 20)
      .map(({ correct, topic }) => ({ correct, topic }));
    const challengeCount = selectQuestions("challenge", sessions, learned, questions).length;
    return <PracticeLanding eyebrow="WORTSCHATZ · LEKTION 14" title={recommendation.title} description={recommendation.description}
      href={recommendation.href} action={recommendation.action} ariaLabel="ชุดฝึกคำศัพท์บท 14"
      insights={{ evidence, recommendation: recommendation.description }}
      resume={pending && pending.attempts.length > 0 ? { done: pending.attempts.length, total: pending.questionIds.length } : undefined}>
      <section className="practice-landing-extra" aria-label="แบบฝึกคำศัพท์ในสถานการณ์บท 14">
        <div><h2>ใช้คำศัพท์ในสถานการณ์</h2><p>อ่านสถานการณ์แล้วเลือกสถานที่หรือคำบอกทาง ครั้งละไม่เกิน 15 ข้อ เริ่มด้วยคำแปลช่วย แล้วค่อยฝึกจากภาษาเยอรมันอย่างเดียว</p></div>
        {challengeCount > 0
          ? <Link href="/practice/L14/vocabulary/challenge" onClick={() => begin("challenge")}>ฝึกขั้นสูง <ArrowRight size={18} /></Link>
          : <span>เรียนคำในตัวเลือกก่อน</span>}
      </section>
      {topicOrder.map(topic => {
        const count = selectQuestions(topic, sessions, learned, questions).length;
        const content = <><div><h2>{topicInfo[topic].title}</h2><p>{count ? `${count} ข้อจากคำที่เรียนแล้ว` : "เรียนคำในหัวข้อนี้ก่อน"}</p></div>{count > 0 && <span>ฝึกหัวข้อนี้ <ArrowRight size={18} /></span>}</>;
        return count > 0
          ? <Link key={topic} className="practice-grammar-topic" href={`/practice/L14/vocabulary/${topic}`} onClick={() => begin(topic)}>{content}</Link>
          : <div key={topic} className="practice-grammar-topic unavailable">{content}<Link href={topicInfo[topic].learnHref}>ไปเรียน</Link></div>;
      })}
    </PracticeLanding>;
  }
  if (!run) return <main className="l14-vocab-practice" aria-busy="true">กำลังเตรียมข้อฝึก…</main>;
  if (!eligible || !run.questionIds.length) return <main className="l14-vocab-practice"><p>เรียนคำศัพท์ในชุดนี้ก่อนเริ่มฝึก</p><Link className="button primary" href="/learn/L14/vocabulary">ไปเรียนคำศัพท์</Link></main>;
  if (run.completed || !question) {
    const nextTopic = topicOrder.includes(bank as Topic) ? topicOrder[topicOrder.indexOf(bank as Topic) + 1] : undefined;
    const nextCount = nextTopic ? selectQuestions(nextTopic, sessions, learned, questions).length : 0;
    return <main className="l14-vocab-practice"><section className="l14-vocab-practice-card"><p className="eyebrow">WORTSCHATZ · LEKTION 14</p><h1>จบรอบฝึกแล้ว</h1><p>บันทึกคำตอบไว้เพื่อแนะนำการฝึกครั้งต่อไป</p><div className="l14-vocab-actions">
      {nextTopic && nextCount > 0 && <Link className="button primary" href={`/practice/L14/vocabulary/${nextTopic}`} onClick={() => begin(nextTopic)}>ฝึกหัวข้อถัดไป</Link>}
      <Link className={nextTopic && nextCount > 0 ? "button secondary" : "button primary"} href="/practice/L14/vocabulary/daily" onClick={() => begin("daily")}>ฝึกเพิ่ม</Link>
      <Link className="button secondary" href="/practice/L14">จบ</Link>
    </div></section></main>;
  }
  const picked = attempt?.answer ?? run.drafts[question.id] ?? "";
  const isCorrect = attempt?.correct ?? false;
  const spelling = question.kind === "spelling";
  const submit = () => {
    if (!picked.trim() || attempt) return;
    const value = picked.trim();
    const assistanceUsed = question.kind === "context"
      ? ["three-choices", ...(question.difficulty === 2 || run.helpUsed?.[question.id] ? ["thai-translation"] : [])]
      : [question.assistance];
    const evidence: Evidence = { taskVersion: question.version, targetId: question.itemId, subskill: question.subskill,
      difficulty: question.difficulty, assistanceAvailable: question.assistance, assistanceUsed,
      selectionReason: run.selectionReasons?.[question.id] ?? "saved-queue", policyVersion: "l14-vocab-2" };
    changeRun(current => ({ ...current, drafts: Object.fromEntries(Object.entries(current.drafts).filter(([id]) => id !== question.id)), attempts: [...current.attempts, { questionId: question.id, answer: value, correct: value === question.answer, submittedAt: new Date().toISOString(), evidence }] }));
  };
  return <main className="l14-vocab-practice">
    <div className="noun-practice-sticky"><ArticleLegend /></div>
    <div className="l14-vocab-progress"><span>{run.position + 1} / {run.questionIds.length} ข้อ</span><div role="progressbar" aria-valuenow={run.position + 1} aria-valuemin={1} aria-valuemax={run.questionIds.length}><span style={{ width: `${(run.position + 1) / run.questionIds.length * 100}%` }} /></div></div>
    <section className="l14-vocab-practice-card"><p className="eyebrow">{topicInfo[question.topic].title}</p>
      <h1>{question.kind === "context" ? "เลือกคำให้ตรงกับสถานการณ์" : question.kind === "meaning" ? "คำไหนตรงกับภาพนี้?" : question.kind === "article" ? "คำนามนี้ใช้ Artikel อะไร?" : "เขียนคำเยอรมันให้ตรงกับความหมาย"}</h1>
      <div className="l14-vocab-question-layout">{question.kind === "context"
        ? <div className="l14-vocab-context"><p lang="de">{question.prompt}</p>{(question.difficulty === 2 || run.helpUsed?.[question.id]) && <p lang="th">{question.translation}</p>}{question.difficulty === 3 && !run.helpUsed?.[question.id] && !attempt && <button type="button" className="button secondary" onClick={() => changeRun(current => ({ ...current, helpUsed: { ...current.helpUsed, [question.id]: true } }))}>ดูคำแปล</button>}</div>
        : <div className="l14-vocab-visual">{question.kind === "article" ? <strong lang="de">{question.german.replace(/^(der|die|das)\s/u, "")}</strong> : question.image ? <Image src={question.image} alt="ภาพประกอบคำศัพท์" width={480} height={320} loading="eager" /> : question.route ? <RouteDiagram route={question.route} /> : <span>{question.meaning}</span>}</div>}
        <div className="l14-vocab-answer"><p>{question.kind === "context" ? "สถานที่หรือคำบอกทางใดเหมาะกับสถานการณ์นี้?" : spelling ? <>{question.meaning} · ขึ้นต้นด้วย <strong lang="de">{question.answer[0]}</strong></> : question.kind === "article" ? "เลือก der, die หรือ das" : "เลือกคำเยอรมันที่ตรงกับภาพ"}</p>
          {spelling ? <label>คำตอบภาษาเยอรมัน<span className="noun-spelling-answer"><NounPrefix noun={nounPresentation(items.find(item => item.id === question.itemId))} /><input lang="de" value={picked} disabled={Boolean(attempt)} onChange={event => changeRun(current => ({ ...current, drafts: { ...current.drafts, [question.id]: event.target.value } }))} onKeyDown={event => { if (event.key === "Enter") submit(); }} autoComplete="off" /></span></label>
            : <div className="l14-vocab-options">{question.options.map(option => <button type="button" key={option} aria-pressed={picked === option} disabled={Boolean(attempt)} onClick={() => changeRun(current => ({ ...current, drafts: { ...current.drafts, [question.id]: option } }))}>{question.kind === "article" ? <span className="noun-text"><ArticleDot article={option} />{option}</span> : <NounText text={option} items={items} />}</button>)}</div>}</div></div>
      {attempt && <div className={`l14-vocab-feedback${isCorrect ? " correct" : " incorrect"}`} role="status"><strong>{isCorrect ? "ถูกต้อง" : "ยังไม่ถูก"}</strong>{question.kind === "context" && <p>คำแปลสถานการณ์: {question.translation}</p>}<p>คำตอบ: <span lang="de"><NounText text={question.german} items={items} /></span> — {question.meaning} <VocabularyFeedbackAudio text={question.german} item={items.find(item => item.id === question.itemId)} /></p>{question.kind === "article" && <p>Artikel ของคำนี้คือ <span lang="de">{question.answer}</span></p>}</div>}
      <div className="l14-vocab-actions"><button type="button" className="button secondary" onClick={() => changeRun(current => ({ ...current, position: Math.max(0, current.position - 1) }))} disabled={run.position === 0}>← ย้อนกลับ</button>
        {attempt ? <button type="button" className="button primary" onClick={() => changeRun(current => ({ ...current, position: current.position + 1, completed: current.position + 1 >= current.questionIds.length }))}>{run.position + 1 === run.questionIds.length ? "จบรอบ" : "ข้อต่อไป"}</button>
          : <button type="button" className="button primary" onClick={submit} disabled={!picked.trim()}>ตรวจคำตอบ</button>}</div>
    </section></main>;
}
