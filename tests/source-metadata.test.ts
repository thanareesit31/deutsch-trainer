import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { l13L14Curriculum } from "../src/lib/l13-l14-course";
import { l13L14PracticeSets } from "../src/lib/l13-l14-course-exercises";
import { l13L14MetadataSubjects, l13L14SourceMetadata, findSourceMetadata } from "../src/lib/l13-l14-source-metadata";
import { citationFromEvidence, inspectLegacySourceMetadata, validateLegacyCatalogSources, validateSourceMetadata, validateSourceRegistry } from "../src/lib/source-metadata";
import { parseCourseProgress } from "../src/lib/l13-l14-course-progress";

function metadataFor(id: string) {
  const [metadata] = findSourceMetadata(id);
  assert(metadata, `missing source metadata for ${id}`);
  return metadata;
}

test("new L13–L14 lessons, topics, guided checks, exercise sets and every question have linked source metadata", () => {
  const issues = validateSourceRegistry(l13L14SourceMetadata, l13L14MetadataSubjects);
  assert.deepEqual(issues.filter((issue) => issue.severity === "error"), []);
  for (const lesson of l13L14Curriculum) {
    assert.equal(metadataFor(lesson.id).entityType, "lesson");
    for (const category of lesson.categories) for (const topic of category.topics) {
      assert.equal(metadataFor(topic.id).category, category.category);
      for (const check of topic.guidedChecks) assert.equal(metadataFor(check.id).parentKey, `topic:${topic.id}`);
    }
  }
  for (const set of l13L14PracticeSets) {
    assert.equal(metadataFor(set.id).activityId, set.id);
    for (const question of set.questions) {
      const metadata = metadataFor(`question:${set.id}/${question.id}`);
      assert.equal(metadata.activityId, question.id);
      assert.equal(metadata.parentKey, `exercise_set:${set.id}`);
      assert.equal(metadata.activityType, question.kind);
      assert.equal(metadata.authorship, "newly_authored");
    }
  }
});

test("a Dativ cloze distinguishes MOMENTE knowledge from a retrospective Grammatik aktiv mechanic", () => {
  const metadata = metadataFor("l13-gr-cloze-1");
  assert.equal(metadata.contentSource[0].sourceId, "MOMENTE_A1_2_KB");
  assert.equal(metadata.contentSource[0].printedPage, 11);
  assert.equal(metadata.contentSource[0].pdfPage, 11);
  const exerciseRef = metadata.exerciseSource.find((entry) => entry.sourceId === "GRAMMATIK_AKTIV_A1_B1");
  assert(exerciseRef);
  assert.equal(exerciseRef.printedPage, 54);
  assert.equal(exerciseRef.pdfPage, 50);
  assert.equal(exerciseRef.originalActivityId, "21/3");
  assert.equal(exerciseRef.relationship, "comparable_mechanic");
  assert.equal(metadata.verificationStatus, "verified");
  assert.equal(metadataFor("L13-GR-02").verificationStatus, "needs_review");
  assert.equal(metadataFor("l13-gr-cloze-2").verificationStatus, "needs_review");
});

test("crossword metadata keeps city content, user grid origin and hotel-book mechanic separate", () => {
  const metadata = metadataFor("l14-crossword-q1");
  assert.equal(metadata.contentSource[0].sourceId, "MOMENTE_A1_2_KB");
  const grid = metadata.exerciseSource.find((entry) => entry.sourceId === "USER_L14_CROSSWORD_PRESET");
  assert.equal(grid?.relationship, "exercise_template");
  const reference = metadata.exerciseSource.find((entry) => entry.sourceId === "WORTSCHATZ_A1_TRAINING");
  assert.equal(reference?.printedPage, 33);
  assert.equal(reference?.pdfPage, 32);
  assert.equal(reference?.originalActivityId, "B6/8");
  assert.equal(reference?.relationship, "comparable_mechanic");
});

test("unverified legacy claims and the VOC-09 mismatch never become verified template citations", () => {
  const metadata = metadataFor("L13-VOC-SELECT");
  assert.equal(metadata.verificationStatus, "needs_review");
  assert.match(metadata.reviewNote, /not the word-search grid/);
  assert(!metadata.exerciseSource.some((entry) => entry.evidenceId === "WS-SEARCH-48"));
  assert(metadata.legacyClaims.length > 0);
});

test("missing content sources, review status and unknown source links are rejected", () => {
  const metadata = metadataFor("L13-GR-02");
  assert(validateSourceMetadata({ ...metadata, contentSource: [] }).some((issue) => issue.code === "missing_source"));
  assert(validateSourceMetadata({ ...metadata, verificationStatus: undefined }).some((issue) => issue.code === "review_status"));
  assert(validateSourceMetadata({ ...metadata, level: "not-a-level" }).some((issue) => issue.code === "language_level"));
  assert(validateSourceMetadata({ ...metadata, contentSource: [{ ...metadata.contentSource[0], sourceId: "NOT_A_SOURCE" }] }).some((issue) => issue.code === "unknown_source"));
});

test("a verified citation cannot invent page offsets, activity IDs, evidence or mix source roles", () => {
  const metadata = metadataFor("L13-GR-02");
  const reference = citationFromEvidence("GA-PRON-54", "comparable_mechanic", "Inspected reference");
  for (const invalid of [
    { ...reference, pdfPage: 54 },
    { ...reference, originalActivityId: "made-up-activity" },
    { ...reference, evidenceId: "invented-evidence" },
  ]) assert(validateSourceMetadata({ ...metadata, exerciseSource: [invalid] }).some((issue) => issue.severity === "error"));
  assert(validateSourceMetadata({ ...metadata, contentSource: [reference] }).some((issue) => issue.code === "wrong_source_role"));
  assert(validateSourceMetadata({ ...metadata, exerciseSource: [{ ...reference, pdfPage: 9999 }] }).some((issue) => issue.code === "pdf_page_range"));
  assert(validateSourceMetadata({ ...metadata, verificationStatus: "verified", exerciseSource: [{ ...reference, verificationStatus: "unverified", evidenceId: null }] }).some((issue) => issue.code === "false_verification"));
});

test("missing metadata, broken parents, changed activity identity and unknown topics fail coverage", () => {
  const missing = l13L14SourceMetadata.slice(1);
  assert(validateSourceRegistry(missing, l13L14MetadataSubjects).some((issue) => issue.code === "missing_metadata"));
  const first = l13L14SourceMetadata[0];
  const mutated = [{ ...first, activityId: "changed-id", parentKey: "not-a-parent", knowledgeTopics: ["unregistered-topic"] }, ...l13L14SourceMetadata.slice(1)];
  const codes = validateSourceRegistry(mutated, l13L14MetadataSubjects).map((issue) => issue.code);
  assert(codes.includes("content_identity_mismatch"));
  assert(codes.includes("missing_parent"));
  assert(codes.includes("unknown_topic"));
});

test("existing JSONB catalog and unannotated legacy sources remain readable without guesses or mutation", () => {
  const raw = readFileSync(new URL("../supabase/seed/catalog.json", import.meta.url), "utf8");
  const catalog: unknown = JSON.parse(raw);
  assert.deepEqual(validateLegacyCatalogSources(catalog), []);
  assert.equal(JSON.stringify(catalog), JSON.stringify(JSON.parse(raw)));
  const item = Object.freeze({ id: "V001", sources: Object.freeze([{ document: "old teacher file", pdfPage: 15 }]) });
  const result = inspectLegacySourceMetadata(item);
  assert.equal(result.kind, "legacy_unannotated");
  assert.equal(result.legacySources, item.sources);
  assert.deepEqual(result.issues, []);
  assert.equal(inspectLegacySourceMetadata({ ...item, sourceMetadata: {} }).kind, "invalid");
});

test("looking up provenance preserves existing learning and attempt IDs and serialized progress", () => {
  const saved = JSON.stringify({ version: 1, completedTopics: ["L13-dativ-pronomen"], attempts: [], drafts: { "L13-dativ-pronomen": "existing learner draft" } });
  const restored = parseCourseProgress(saved);
  assert.equal(restored.kind, "valid");
  assert.equal(metadataFor("L13-dativ-pronomen").activityId, "L13-dativ-pronomen");
  assert.equal(JSON.stringify(restored.state), saved);
});

function runInspector(...args: string[]) {
  return spawnSync(process.execPath, ["--import", "tsx", "scripts/source-metadata.ts", ...args], {
    cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8",
  });
}

test("the admin CLI reports one existing activity and fails instead of inventing unknown records", () => {
  const found = runInspector("report", "--id", "l13-gr-cloze-1");
  assert.equal(found.status, 0, found.stderr);
  const report = JSON.parse(found.stdout);
  assert.equal(report.metadata.length, 1);
  assert.equal(report.metadata[0].activityId, "l13-gr-cloze-1");
  assert.equal(report.metadata[0].verificationStatus, "verified");
  const missing = runInspector("report", "--id", "unregistered-old-activity");
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /No metadata/);
});

test("the build check permits explicit review warnings while strict review and wrong document files fail", () => {
  const check = runInspector("check");
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /0 errors/);
  assert.match(check.stderr, /REVIEW/);
  const strict = runInspector("check", "--strict");
  assert.equal(strict.status, 1);
  const wrongFile = runInspector("verify-file", "GRAMMATIK_AKTIV_A1_B1", "package.json");
  assert.equal(wrongFile.status, 1);
  assert.match(wrongFile.stderr, /fingerprint mismatch/);
});
