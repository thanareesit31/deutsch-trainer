import type { GrammarDiscoveryLesson } from "./grammar-discovery";
import { conjugationSubjects, grammarConjugationTopic } from "./grammar-conjugation";

function storedMatches(raw: string | null): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object" || !("conjugationMatches" in value)) return {};
    const matches = value.conjugationMatches;
    return matches && typeof matches === "object" && !Array.isArray(matches) ? Object.fromEntries(Object.entries(matches)) : {};
  } catch { return {}; }
}

export function completedConjugationRows(raw: string | null, topicSlug: string, verbId: string): string[] {
  const value = storedMatches(raw)[`${topicSlug}:${verbId}`];
  if (!Array.isArray(value)) return [];
  const valid = new Set<string>(conjugationSubjects.map((subject) => subject.id));
  return [...new Set(value.filter((id): id is string => typeof id === "string" && valid.has(id)))];
}

function validConjugationMatches(raw: string | null, lesson: GrammarDiscoveryLesson): Record<string, string[]> {
  const matches: Record<string, string[]> = {};
  for (const topic of lesson.topics) {
    for (const verb of grammarConjugationTopic(lesson.id, topic.slug)?.verbs ?? []) {
      const key = `${topic.slug}:${verb.id}`;
      const rows = completedConjugationRows(raw, topic.slug, verb.id);
      if (rows.length) matches[key] = rows;
    }
  }
  return matches;
}

export function completedDiscoveryTopics(raw: string | null, lesson: GrammarDiscoveryLesson): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || !("completedTopics" in value) || !Array.isArray(value.completedTopics)) return [];
    const valid = new Set(lesson.topics.map((topic) => topic.slug));
    return [...new Set(value.completedTopics.filter((slug): slug is string => typeof slug === "string" && valid.has(slug)))];
  } catch {
    return [];
  }
}

export function completeDiscoveryTopic(raw: string | null, lesson: GrammarDiscoveryLesson, slug: string): string {
  return JSON.stringify({
    completedTopics: [...new Set([...completedDiscoveryTopics(raw, lesson), slug])],
    conjugationMatches: validConjugationMatches(raw, lesson),
  });
}

export function completeConjugationRow(raw: string | null, lesson: GrammarDiscoveryLesson, topicSlug: string, verbId: string, subjectId: string): string {
  const topic = grammarConjugationTopic(lesson.id, topicSlug);
  if (!topic?.verbs.some((verb) => verb.id === verbId) || !conjugationSubjects.some((subject) => subject.id === subjectId)) return raw ?? "{}";
  const key = `${topicSlug}:${verbId}`;
  const conjugationMatches = validConjugationMatches(raw, lesson);
  conjugationMatches[key] = [...new Set([...(conjugationMatches[key] ?? []), subjectId])];
  return JSON.stringify({ completedTopics: completedDiscoveryTopics(raw, lesson), conjugationMatches });
}
