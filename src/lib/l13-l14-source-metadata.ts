import { l13L14Curriculum, type CourseLessonId, type SourceRef } from "./l13-l14-course";
import { l13L14PracticeSets } from "./l13-l14-course-exercises";
import { citationFromEvidence, type MetadataSubject, type SourceCitation, type SourceMetadata } from "./source-metadata";
import { reviewedActivitySources } from "./l13-l14-source-reviews";

/** Explicit, inspected topic-to-page mapping; legacy sourceRefs are not promoted automatically. */
const topicEvidence: Readonly<Record<string, readonly [string, ...string[]]>> = {
  "L13-ort-in-der-stadt": ["KB13-VOC-10", "KB13-VOC-11"],
  "L13-es-gibt-akkusativ": ["KB13-G4"],
  "L13-dativ-pronomen": ["KB13-G5A"],
  "L13-verben-mit-dativ": ["KB13-G5A"],
  "L13-ort-bewerten": ["KB13-G5B"],
  "L13-stadt-hoeren": ["KB13-VOC-10", "KB13-G5B"],
  "L13-stadt-sprechen": ["KB13-G5B", "KB13-G6A"],
  "L13-stadt-lesen": ["KB13-G3A"],
  "L13-lieblingsort-schreiben": ["KB13-G6B"],
  "L14-orte-in-der-stadt": ["KB14-VOC-14", "KB14-VOC-15"],
  "L14-wo-dativ-lokale-praepositionen": ["KB14-G4A", "KB14-G4B"],
  "L14-nach-dem-weg-fragen": ["KB14-G6A", "KB14-G6B"],
  "L14-weg-hoeren": ["KB14-G3A"],
  "L14-weg-sprechen": ["KB14-G6B"],
  "L14-weg-lesen": ["KB14-G6A"],
  "L14-weg-schreiben": ["KB14-G6A"],
};

/** Interpret old topic labels without changing those labels in stored exercise/progress data. */
const topicAliases: Readonly<Record<string, string>> = {
  "l13-city-places": "L13-ort-in-der-stadt",
  "l13-es-gibt-akk": "L13-es-gibt-akkusativ",
  "l13-dative-pronouns": "L13-dativ-pronomen",
  "l13-dative-verbs": "L13-verben-mit-dativ",
  "l13-dativ-verben": "L13-verben-mit-dativ",
  "l13-dative-verben": "L13-verben-mit-dativ",
  "l13-favorite-place": "L13-ort-bewerten",
  "l13-city-blog": "L13-stadt-lesen",
  "l14-city-places": "L14-orte-in-der-stadt",
  "l14-local-prepositions": "L14-wo-dativ-lokale-praepositionen",
  "l14-directions": "L14-nach-dem-weg-fragen",
  "l14-map-directions": "L14-weg-lesen",
};

const comparableMechanics: Readonly<Record<string, readonly string[]>> = {
  "L13-GR-02": ["GA-PRON-54"],
  "L13-GR-DAT-MATCH": ["KB13-G5A"],
  "L13-GR-TRANSFORM": ["KB13-ST-G"],
  "L13-GR-ROLES": ["GA-VERB-58"],
  "L13-VOC-BAUSTEINE": ["KB13-ST-W"],
  "L13-VOC-SELECT": ["WS-SORT-36"],
  "L14-VOC-SELECT": ["WS-SORT-36"],
  "L13-LES-HEADINGS": ["KB13-G3A"],
  "L13-SCH-PLAN": ["KB13-G6A"],
  "L13-SCH-01": ["KB13-G6B"],
  "L14-VOC-CROSSWORD": ["WS-CROSS-33"],
  "L14-GR-IMAGE": ["KB14-G4A", "GA-PREP-86"],
  "L14-GR-NOTICE": ["KB14-G4B"],
  "L14-HOE-02": ["KB14-G3A"],
  "L14-RED-02": ["KB14-ST-K"],
  "L13-RED-CATEGORIZE": ["KB14-G6A"],
};

function lessonTopics(lessonId: CourseLessonId) {
  const lesson = l13L14Curriculum.find((entry) => entry.id === lessonId);
  if (!lesson) throw new Error(`No curriculum for ${lessonId}`);
  return lesson.categories.flatMap((entry) => entry.topics.map((topic) => topic.id));
}
function resolveTopic(id: string) {
  const canonical = topicAliases[id] ?? id;
  if (!topicEvidence[canonical]) throw new Error(`Missing explicit source mapping for knowledge topic ${id}`);
  return canonical;
}
function makeSubjects(): MetadataSubject[] {
  const subjects: MetadataSubject[] = [];
  for (const lesson of l13L14Curriculum) {
    const parentKey = `lesson:${lesson.id}`;
    subjects.push({ recordKey: parentKey, activityId: lesson.id, entityType: "lesson", parentKey: null,
      level: lesson.level, lessonId: lesson.id, category: "all", knowledgeTopics: lessonTopics(lesson.id), activityType: "course_lesson" });
    for (const category of lesson.categories) for (const topic of category.topics) {
      resolveTopic(topic.id);
      const topicKey = `topic:${topic.id}`;
      const context = { level: lesson.level, lessonId: lesson.id, category: category.category, knowledgeTopics: [topic.id] };
      subjects.push({ ...context, recordKey: topicKey, activityId: topic.id, entityType: "topic", parentKey, activityType: "discovery_learning" });
      for (const check of topic.guidedChecks) subjects.push({ ...context, recordKey: `guided_check:${topic.id}/${check.id}`,
        activityId: check.id, entityType: "guided_check", parentKey: topicKey, activityType: "multiple_choice" });
    }
  }
  for (const set of l13L14PracticeSets) {
    const lesson = l13L14Curriculum.find((entry) => entry.id === set.lessonId);
    if (!lesson) throw new Error(`No lesson for ${set.id}`);
    const categoryTopics = lesson.categories.find((entry) => entry.category === set.category)?.topics.map((topic) => topic.id) ?? [];
    const knowledgeTopics = [...new Set([...(categoryTopics.length === 1 ? categoryTopics : []), ...set.topicIds.map(resolveTopic)])];
    const context = { level: lesson.level, lessonId: set.lessonId, category: set.category, knowledgeTopics };
    const setKey = `exercise_set:${set.id}`;
    subjects.push({ ...context, recordKey: setKey, activityId: set.id, entityType: "exercise_set", parentKey: `lesson:${set.lessonId}`, activityType: set.questions[0]?.kind ?? "missing_questions" });
    for (const question of set.questions) subjects.push({ ...context, recordKey: `question:${set.id}/${question.id}`,
      activityId: question.id, entityType: "question", parentKey: setKey, activityType: question.kind });
  }
  return subjects;
}

export const l13L14MetadataSubjects: readonly MetadataSubject[] = makeSubjects();
for (const key of Object.keys(reviewedActivitySources)) {
  if (!l13L14MetadataSubjects.some((subject) => subject.recordKey === key)) throw new Error(`Source review has no existing activity: ${key}`);
}
const webContent = () => citationFromEvidence("WEB-AUTHORED", "authored_in_project", "Original web explanations, prompts, audio scripts and answers; not transcribed source exercises.");
function contentSources(subject: MetadataSubject): readonly [SourceCitation, ...SourceCitation[]] {
  const ids = [...new Set(subject.knowledgeTopics.flatMap((id) => topicEvidence[id] ?? []))];
  const bookReferences = ids.map((id) => citationFromEvidence(id, "topic_basis", "Verified topic basis only; this does not assert that the web question occurs on the source page."));
  const [primary, ...additional] = bookReferences;
  if (!primary) throw new Error(`No verified topic-basis page for ${subject.recordKey}`);
  return [primary, ...additional, webContent()];
}
function setFor(subject: MetadataSubject) {
  return l13L14PracticeSets.find((set) => subject.entityType === "exercise_set" ? set.id === subject.activityId : subject.parentKey === `exercise_set:${set.id}`);
}
function legacyClaims(subject: MetadataSubject): string[] {
  let refs: readonly SourceRef[] = [];
  if (subject.entityType === "topic") refs = l13L14Curriculum.flatMap((lesson) => lesson.categories.flatMap((category) => category.topics)).find((topic) => topic.id === subject.activityId)?.sourceRefs ?? [];
  if (subject.entityType === "exercise_set") refs = setFor(subject)?.sourceRefs ?? [];
  return refs.map((ref) => `Unverified legacy sourceRefs claim (not a verified citation): ${JSON.stringify(ref)}`);
}

export const l13L14SourceMetadata: readonly SourceMetadata[] = l13L14MetadataSubjects.map((subject) => {
  const set = setFor(subject);
  const exerciseSource: [SourceCitation, ...SourceCitation[]] = [webContent()];
  if (set?.id === "L14-VOC-CROSSWORD") exerciseSource.push(citationFromEvidence("USER-CROSSWORD", "exercise_template", "Actual user-provided coordinate layout; vocabulary images and web interactions are project assets/code."));
  for (const evidenceId of set ? comparableMechanics[set.id] ?? [] : []) exerciseSource.push(citationFromEvidence(evidenceId, "comparable_mechanic", "Retrospective mechanic comparison. Page/activity inspected; not a claim that this page was used to author the existing prompt."));
  const needsReview = ["guided_check", "exercise_set", "question"].includes(subject.entityType);
  let reviewNote = needsReview
    ? "Topic pages and code origin checked. Individual prompt, vocabulary scope and exact template alignment still require review."
    : "Topic-to-source relationship checked visually; web explanations/examples are newly authored. This status verifies attribution, not all pedagogy or language answers.";
  if (set?.id === "L14-GR-CATEGORIZE") reviewNote += " Concrete unresolved scope issue: old prompt uses Wohin?/in den Park, while inspected L14 pages establish Wo? + Dativ. Do not verify until earlier-lesson evidence establishes this prerequisite; original prompt retained.";
  if (set?.id === "L14-LES-01") reviewNote += " Concrete unresolved task-context issue: inspected book 5a is place-name completion, not this web route-reading task; the web prompt needs an independently checked reading instruction. Original activity retained.";
  if (set?.id === "L13-GR-02" && subject.activityId !== "l13-gr-cloze-1") reviewNote += " Parent/mixed-topic check remains open: the Bahnhof/es gibt question targets Akkusativ, but the old set topic labels identify Dativ. Only the separately reviewed du→dir question is verified.";
  if (set?.patternId === "VOC-09") reviewNote += " VOC-09 currently uses multi_select, not the word-search grid inspected at WORTSCHATZ_A1_TRAINING printed 48 / PDF 47; no word-search template attribution is granted.";
  if (["L13-stadt-hoeren", "L14-weg-lesen", "L14-weg-schreiben"].some((id) => subject.knowledgeTopics.includes(id))) reviewNote += " Added web skill activity; book references establish knowledge topics, not an identical source activity or original recording.";
  return { ...subject, schemaVersion: 1, contentSource: contentSources(subject), exerciseSource,
    authorship: "newly_authored", verificationStatus: needsReview ? "needs_review" : "verified", reviewNote, legacyClaims: legacyClaims(subject),
    ...reviewedActivitySources[subject.recordKey] };
});

export function findSourceMetadata(activityId: string) {
  return l13L14SourceMetadata.filter((entry) => entry.activityId === activityId || entry.recordKey === activityId);
}
