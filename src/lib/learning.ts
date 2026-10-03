import { isCorrect, normalize, type Question } from "./engine";
import type { Item } from "./content";
export type Dimension =
  | "wordRecall"
  | "article"
  | "spelling"
  | "verbForm"
  | "grammar"
  | "sentenceStructure"
  | "application";
export const dimensionLabels: Record<Dimension, string> = {
  wordRecall: "Word Recall",
  article: "Artikel",
  spelling: "Spelling",
  verbForm: "Verb Form",
  grammar: "Grammar",
  sentenceStructure: "Sentence Structure",
  application: "Application",
};
export type Confidence = "easy" | "thought" | "guess";
export interface ItemExposure {
  item_id: string;
  seen_at: string;
}
export interface AttemptEvidence {
  session_id: string;
  ordinal: number;
  dimension: Dimension;
  correct: boolean;
}
export interface LearningAttempt {
  session_id: string;
  ordinal: number;
  input: string;
  correct: boolean;
  confidence: Confidence | null;
  submitted_at: string;
}
export function isCompletedAttempt(
  attempt: Pick<LearningAttempt, "correct" | "confidence">
) {
  return !attempt.correct || attempt.confidence !== null;
}
export function completedAttempts<
  T extends { correct: boolean; confidence: Confidence | null }
>(attempts: T[]) {
  return attempts.filter(isCompletedAttempt);
}
export interface KnowledgeState {
  item_id: string;
  seen_at: string;
  attempts: number;
  correct: number;
  errors: number;
}
export interface PracticeSession {
  id: string;
  title: string;
  origin: string;
  position: number;
  completed: boolean;
  created_at: string;
}
export interface SessionItem {
  session_id: string;
  ordinal: number;
  item_id: string;
  question: Question;
}
export function reviewCandidates(
  items: Item[],
  sessionItems: Pick<SessionItem, "session_id" | "ordinal" | "item_id">[],
  attempts: Pick<
    LearningAttempt,
    "session_id" | "ordinal" | "correct" | "confidence" | "submitted_at"
  >[]
) {
  const itemByAttempt = new Map(
    sessionItems.map((entry) => [
      `${entry.session_id}:${entry.ordinal}`,
      entry.item_id,
    ])
  );
  const latestByItem = new Map<string, (typeof attempts)[number]>();
  for (const attempt of completedAttempts(attempts)) {
    const itemId = itemByAttempt.get(
      `${attempt.session_id}:${attempt.ordinal}`
    );
    if (!itemId) continue;
    const previous = latestByItem.get(itemId);
    if (!previous || attempt.submitted_at > previous.submitted_at)
      latestByItem.set(itemId, attempt);
  }
  return items.filter((item) => {
    const latest = latestByItem.get(item.id);
    return latest && (!latest.correct || latest.confidence !== "easy");
  });
}
export function diagnose(
  q: Question,
  input: string
): {
  correct: boolean;
  evidence: { dimension: Dimension; correct: boolean }[];
} {
  const correct = isCorrect(input, q.answer, q.item.accepted);
  const evidence: { dimension: Dimension; correct: boolean }[] = [];
  const add = (dimension: Dimension, ok = correct) =>
    evidence.push({ dimension, correct: ok });
  if (q.mode === "article") add("article");
  else if (q.item.skill === "vocabulary") {
    if (q.mode === "typing") {
      const noun = q.item.article;
      const words = normalize(input).split(" ");
      const hasArticle = /^(der|die|das)$/i.test(words[0]);
      const word = hasArticle ? words.slice(1).join(" ") : normalize(input);
      if (noun) add("article", words[0] === noun);
      const spellingCorrect = isCorrect(word, q.item.word || q.answer);
      add("spelling", spellingCorrect);
      if (!spellingCorrect) add("wordRecall", false);
    } else add("wordRecall");
  } else if (q.item.skill === "grammar") {
    if (q.item.group === "Satzbau") add("sentenceStructure");
    else if (q.item.group === "Personalpronomen") add("grammar");
    else add("verbForm");
  } else if (q.mode === "order") add("sentenceStructure");
  else add("application");
  return { correct, evidence };
}
