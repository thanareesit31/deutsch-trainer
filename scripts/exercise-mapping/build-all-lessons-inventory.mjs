import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import discoveryModule from "../../src/lib/grammar-discovery.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const catalog = read("supabase/seed/catalog.json");
const arbeitsbuch = read("src/data/momente-arbeitsbuch-inventory.json");
const coursebookAudit = read("docs/exercise-mapping/a13-coursebook-activity-audit.json");
const discoveryLessons = discoveryModule.grammarDiscoveryLessons;
const pilotBanks = [
  ["es-gibt", "docs/exercise-mapping/l13-es-gibt-bank.json", "docs/exercise-mapping/l13-es-gibt-provenance.json"],
  ["dativ", "docs/exercise-mapping/l13-dative-bank.json", "docs/exercise-mapping/l13-dative-provenance.json"],
  ["verbs", "docs/exercise-mapping/l13-verbs-bank.json", "docs/exercise-mapping/l13-verbs-provenance.json"],
].map(([topic, bankPath, provenancePath]) => {
  const bank = read(bankPath);
  const provenance = read(provenancePath);
  const boundIds = new Set(provenance.bindings.map((entry) => entry.questionId));
  if (bank.questions.some((question) => !boundIds.has(question.id))) {
    throw new Error(`${bankPath} contains a question without provenance`);
  }
  return {
    lessonId: "L13",
    topic,
    bankPath,
    provenancePath,
    status: bank.status,
    questionIds: bank.questions.map((question) => question.id),
    kinds: [...new Set(bank.questions.map((question) => question.kind))],
  };
});
const additionalPilotBanks = ["L14", "L15", "L16", "L17", "L18"].map((lessonId) => {
  const name = lessonId.toLowerCase();
  const bankPath = `docs/exercise-mapping/${name}-grammar-bank.json`;
  const provenancePath = `docs/exercise-mapping/${name}-grammar-provenance.json`;
  const bank = read(bankPath);
  const provenance = read(provenancePath);
  const boundIds = new Set(provenance.bindings.map((entry) => entry.questionId));
  if (bank.questions.some((question) => !boundIds.has(question.id))) throw new Error(`${bankPath} contains a question without provenance`);
  return {
    lessonId, topic: "grammar", bankPath, provenancePath, status: bank.status,
    questionIds: bank.questions.map((question) => question.id),
    kinds: [...new Set(bank.questions.map((question) => question.kind))],
    topicIds: [...new Set(bank.questions.map((question) => question.topicId))],
  };
});
const allPilotBanks = [...pilotBanks, ...additionalPilotBanks];

const skillPlans = {
  vocabulary: { objective: "จำความหมาย รูปคำ และ Artikel ของคำที่เรียนในบท", patterns: ["meaning_choice", "word_recall", "article_choice"] },
  grammar: { objective: "ใช้รูปคำและโครงสร้างประโยคตามหัวข้อไวยากรณ์ของบท", patterns: ["form_choice", "form_input", "word_order"] },
  phrases: { objective: "เลือกและใช้สำนวนให้เหมาะกับสถานการณ์", patterns: ["situation_choice", "dialogue_completion", "sentence_order"] },
  writing: { objective: "เขียนข้อความสั้นที่สื่อความหมายตามสถานการณ์", patterns: ["guided_writing", "short_response"] },
  listening: { objective: "ฟังแล้วจับข้อมูลหรือความหมายที่ได้ยิน", patterns: ["audio_choice", "audio_detail"] },
  reading: { objective: "อ่านแล้วหาข้อมูลและตีความจากข้อความ", patterns: ["text_detail", "text_inference"] },
};

const a13GrammarTopics = {
  L13: ["Es gibt + Akkusativ", "Personalpronomen im Dativ", "Verben mit Dativ"],
  L14: ["Lokale Präpositionen", "Wo? + Dativ"],
  L15: ["Possessivartikel ihr/sein im Nominativ und Akkusativ"],
  L16: ["Temporale Präpositionen in/vor/nach"],
  L17: ["werden im Präsens", "wollen + Infinitiv", "mit/ohne"],
  L18: ["Imperativ Sie", "Modalverb sollen"],
};
const customLearningTopics = {
  "L02:grammar": { topics: ["Personalpronomen", "Verben im Präsens", "Satzbau"], evidence: "src/components/trainer.tsx" },
  "L02:phrases": { topics: ["Beruflicher Status", "Traumberuf"], evidence: "src/components/l02-phrase-learning.tsx" },
  "L14:phrases": { topics: ["Wegbeschreibungen"], evidence: "src/components/l14-phrase-learning.tsx" },
};

const skillIds = Object.keys(skillPlans);
const candidateSourceIds = (lessonId, skill) => {
  const early = Number(lessonId.slice(1)) <= 12;
  const core = early ? ["MOMENTE_A1_1_KB", "MOMENTE_A1_1_AB"] : ["MOMENTE_A1_2_KB", "MOMENTE_A1_2_AB"];
  if (skill === "grammar") return [...core, "GRAMMATIK_A1_DAS_TRAINING"];
  if (skill === "writing") return [...core, "SCHREIBEN_A1_DAS_TRAINING"];
  if (skill === "vocabulary") return [...core, "WORTSCHATZ_A1_TRAINING"];
  return core;
};
const slots = catalog.lessons.flatMap((lesson) => skillIds.map((skill) => {
  const items = catalog.items.filter((item) => item.lessonId === lesson.id && item.skill === skill);
  const groups = [...new Set(items.map((item) => item.group).filter(Boolean))];
  const sourceRefs = items.flatMap((item) => (item.sources ?? []).map((source) => ({ itemId: item.id, ...source })));
  const sourceActivities = arbeitsbuch.filter((entry) => entry.lessonId === lesson.id && entry.primarySkill === skill)
    .map((entry) => ({ inventoryId: entry.id, evidenceId: entry.evidenceId, sourceId: entry.sourceId, verificationStatus: entry.verificationStatus, mechanic: entry.mechanic, printedPage: entry.printedPage, pdfPage: entry.pdfPage, originalActivityId: entry.originalActivityId }));
  const adjacentSourceActivities = arbeitsbuch.filter((entry) => entry.lessonId === lesson.id && (entry.secondarySkills ?? []).includes(skill))
    .map((entry) => ({ inventoryId: entry.id, evidenceId: entry.evidenceId, sourceId: entry.sourceId, verificationStatus: entry.verificationStatus, primarySkill: entry.primarySkill, mechanic: entry.mechanic, printedPage: entry.printedPage, pdfPage: entry.pdfPage, originalActivityId: entry.originalActivityId }));
  const pilots = skill === "grammar" ? allPilotBanks.filter((bank) => bank.lessonId === lesson.id) : [];
  const discovery = skill === "grammar" ? discoveryLessons.find((entry) => entry.id === lesson.id) : undefined;
  const custom = customLearningTopics[`${lesson.id}:${skill}`];
  const otherLearning = discovery
    ? { topics: discovery.topics.map((topic) => ({ id: topic.slug, title: topic.title })), evidence: "src/lib/grammar-discovery.ts" }
    : custom
      ? { topics: custom.topics.map((title) => ({ id: null, title })), evidence: custom.evidence }
      : null;
  const topicWorkItems = groups.map((title) => ({
    title,
    origin: "published_catalog",
    catalogItemIds: items.filter((item) => item.group === title).map((item) => item.id),
    questionBankStatus: "needs_item_audit",
  }));
  const hasTopic = (title) => topicWorkItems.some((entry) => entry.title.toLocaleLowerCase("de-DE") === title.toLocaleLowerCase("de-DE"));
  for (const topic of otherLearning?.topics ?? []) {
    if (!hasTopic(topic.title)) {
      topicWorkItems.push({ title: topic.title, origin: "special_learning_page", catalogItemIds: [], questionBankStatus: "needs_item_audit" });
    }
  }
  for (const title of skill === "grammar" ? (a13GrammarTopics[lesson.id] ?? []) : []) {
    if (!hasTopic(title)) {
      topicWorkItems.push({ title, origin: "curriculum_mapping", catalogItemIds: [], questionBankStatus: "needs_item_audit" });
    }
  }
  if (pilots.length) {
    const pilotTitles = { "es-gibt": "es gibt + Akkusativ", dativ: "Personalpronomen im Dativ", verbs: "Verben" };
    for (const pilot of pilots.filter((entry) => entry.lessonId === "L13")) {
      const workItem = topicWorkItems.find((entry) => entry.title.toLocaleLowerCase("de-DE") === pilotTitles[pilot.topic].toLocaleLowerCase("de-DE"));
      if (workItem) workItem.questionBankStatus = "pilot_bank";
    }
    const dativVerbs = topicWorkItems.find((entry) => entry.title === "Verben mit Dativ");
    if (dativVerbs) dativVerbs.questionBankStatus = "partial_coverage_in_verbs_pilot";
    const adjectives = topicWorkItems.find((entry) => entry.title === "Adjektive");
    if (adjectives) adjectives.questionBankStatus = "review_only_scope_check";
    const additionalTopicTitles = {
      L14: ["Lokale Präpositionen", "Wo? + Dativ"],
      L15: ["Possessivartikel ihr/sein im Nominativ und Akkusativ"],
      L16: ["Temporale Präpositionen in/vor/nach"],
      L17: ["werden im Präsens", "wollen + Infinitiv", "mit/ohne"],
      L18: ["Imperativ Sie", "Modalverb sollen"],
    };
    for (const title of additionalTopicTitles[lesson.id] ?? []) {
      const workItem = topicWorkItems.find((entry) => entry.title === title);
      if (workItem) workItem.questionBankStatus = "pilot_bank";
    }
  }
  const status = pilots.length ? "pilot_bank" : items.length ? "catalog_content_needs_question_audit" : otherLearning ? "other_learning_content_needs_question_audit" : "content_and_question_audit_needed";
  return {
    lessonId: lesson.id,
    level: lesson.level,
    lessonTitle: lesson.title,
    skill,
    status,
    lessonContextTopics: lesson.topics,
    candidateSourceIdsForInspection: candidateSourceIds(lesson.id, skill),
    curriculumTopics: skill === "grammar" ? (a13GrammarTopics[lesson.id] ?? []) : [],
    catalogGroups: groups,
    topicWorkItems,
    catalogItemIds: items.map((item) => item.id),
    catalogItemsWithPrompt: items.filter((item) => item.prompt && item.answer).length,
    otherLearning,
    catalogSourceRefsPendingReview: sourceRefs,
    inspectedSourceActivities: sourceActivities,
    adjacentSourceActivities,
    coursebookActivityRefs: coursebookAudit.activities.filter((activity) => activity.lessonId === lesson.id && activity.skills.includes(skill))
      .map(({ id, printedPage, pdfPage, originalActivityId, mechanic, inspectionStatus }) => ({ id, printedPage, pdfPage, originalActivityId, mechanic, inspectionStatus })),
    pilotBanks: pilots,
    plan: {
      objective: skillPlans[skill].objective,
      candidatePatterns: skillPlans[skill].patterns,
      firstRoundTarget: 5,
      questionBankTargetPerTopic: 15,
      sequence: "recognition_then_production",
      reuseRule: "prefer_unseen_then_review_errors",
    },
    nextAction: pilots.length
      ? "independent_answer_review_then_progress_integration"
      : items.length || otherLearning
        ? "audit_source_items_then_author_and_review_questions"
        : "map_primary_lesson_and_add_learning_content_before_authoring_questions",
  };
}));

if (catalog.lessons.length !== 18 || new Set(catalog.lessons.map((lesson) => lesson.id)).size !== 18 || slots.length !== 18 * skillIds.length) {
  throw new Error("Expected exactly 18 unique lessons and 6 slots per lesson");
}
const output = {
  schemaVersion: 1,
  generatedAt: "2026-10-20",
  purpose: "Internal preparation inventory, not a learner question bank or publication approval",
  statusDefinitions: {
    pilot_bank: "Newly authored questions and per-question provenance exist; tester-only and pending independent review",
    catalog_content_needs_question_audit: "Learning content exists, but source-to-question mapping and a reviewed exercise bank do not",
    other_learning_content_needs_question_audit: "Learning content exists outside the published catalog; source-to-question mapping and a reviewed exercise bank do not",
    content_and_question_audit_needed: "No catalog items or identified special learning page for this lesson and skill; curriculum and source exercises need inspection",
  },
  topicStatusDefinitions: {
    pilot_bank: "A tester-only bank exists for this card topic",
    partial_coverage_in_verbs_pilot: "Some verb content is exercised in the Verben pilot; the catalog group is not a separate reviewed bank",
    review_only_scope_check: "Catalog grouping needs a curriculum scope check before becoming a practice topic",
    needs_item_audit: "Group or mapped topic has no individually audited question bank",
  },
  questionContract: {
    required: ["id", "lessonId", "skill", "topicId", "kind", "prompt", "subskill", "difficulty", "hint", "explanation", "variantGroup"],
    grading: "Use acceptedAnswers for closed questions or a reviewed rubric for open writing",
    provenanceRequired: ["questionId", "contentBasis", "exerciseBasis", "authorship"],
    bankReviewStatusRequired: true,
    sourceLocatorRequiredForBookEvidence: ["sourceId", "printedPage", "pdfPage", "originalActivityId", "inspectionStatus"],
    publicationGate: "Every question has an independently reviewed answer and learner copy contains no source attribution",
  },
  counts: {
    lessons: catalog.lessons.length,
    skills: skillIds.length,
    slots: slots.length,
    pilotBankSlots: slots.filter((slot) => slot.status === "pilot_bank").length,
    catalogOnlySlots: slots.filter((slot) => slot.status === "catalog_content_needs_question_audit").length,
    otherLearningSlots: slots.filter((slot) => slot.status === "other_learning_content_needs_question_audit").length,
    emptySlots: slots.filter((slot) => slot.status === "content_and_question_audit_needed").length,
    existingPilotQuestions: allPilotBanks.reduce((sum, bank) => sum + bank.questionIds.length, 0),
    identifiedGroupsAndCurriculumTopics: slots.reduce((sum, slot) => sum + slot.topicWorkItems.length, 0),
    inspectedPrimaryActivityRefs: slots.reduce((sum, slot) => sum + slot.inspectedSourceActivities.length, 0),
    adjacentActivityRefs: slots.reduce((sum, slot) => sum + slot.adjacentSourceActivities.length, 0),
    coursebookActivitySkillRefs: slots.reduce((sum, slot) => sum + slot.coursebookActivityRefs.length, 0),
  },
  slots,
};
writeFileSync(resolve(root, "docs/exercise-mapping/all-lessons-inventory.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output.counts));
