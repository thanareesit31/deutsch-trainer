import type { CourseCategory } from "./l13-l14-course";
import { isRegisteredSourceId, sourceCatalog, sourceEvidence, type RegisteredSourceId } from "./source-catalog";

export type SourceCitation = {
  sourceId: RegisteredSourceId;
  relationship: "topic_basis" | "authored_in_project" | "exercise_template" | "comparable_mechanic";
  printedPage: number | null;
  pdfPage: number | null;
  originalActivityId: string | null;
  note: string;
} & (
  | { verificationStatus: "verified"; evidenceId: string }
  | { verificationStatus: "unverified"; evidenceId: null }
);

export type MetadataSubject = {
  recordKey: string;
  activityId: string;
  entityType: "lesson" | "topic" | "guided_check" | "exercise_set" | "question";
  parentKey: string | null;
  level: string;
  lessonId: string;
  category: CourseCategory | "all";
  knowledgeTopics: readonly string[];
  activityType: string;
};

/** Supplementary metadata: IDs and learner state are owned by existing content. */
export type SourceMetadata = MetadataSubject & {
  schemaVersion: 1;
  contentSource: readonly [SourceCitation, ...SourceCitation[]];
  exerciseSource: readonly [SourceCitation, ...SourceCitation[]];
  authorship: "source_original" | "adapted" | "newly_authored" | "unknown";
  verificationStatus: "verified" | "needs_review" | "unverified";
  reviewNote: string;
  legacyClaims: readonly string[];
};
export type MetadataIssue = { severity: "error" | "warning"; recordKey: string; code: string; message: string };

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const page = (value: unknown) => value === null || (typeof value === "number" && Number.isInteger(value) && value > 0);
const stringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(nonempty);

export function citationFromEvidence(evidenceId: string, relationship: SourceCitation["relationship"], note: string): SourceCitation {
  const evidence = sourceEvidence.find((entry) => entry.id === evidenceId);
  if (!evidence) throw new Error(`Unknown source evidence: ${evidenceId}`);
  return { sourceId: evidence.sourceId, printedPage: evidence.printedPage, pdfPage: evidence.pdfPage,
    originalActivityId: evidence.originalActivityId, verificationStatus: "verified", evidenceId, relationship, note };
}

export function validateSourceMetadata(value: unknown): MetadataIssue[] {
  const issues: MetadataIssue[] = [];
  const key = record(value) && nonempty(value.recordKey) ? value.recordKey : "<unknown>";
  const error = (code: string, message: string) => issues.push({ severity: "error", recordKey: key, code, message });
  const warning = (code: string, message: string) => issues.push({ severity: "warning", recordKey: key, code, message });
  if (!record(value)) { error("invalid_metadata", "Metadata must be an object"); return issues; }
  if (value.schemaVersion !== 1) error("schema_version", "Expected source metadata schemaVersion 1");
  for (const field of ["recordKey", "activityId", "level", "lessonId", "activityType", "reviewNote"])
    if (!nonempty(value[field])) error("required_field", `${field} must be nonempty`);
  if (!/^L\d{2}$/u.test(String(value.lessonId))) error("lesson_id", "lessonId must use the existing Lxx format");
  if (!/^[ABC][12](?:\.[1-9]\d*)?$/u.test(String(value.level))) error("language_level", "level must be a CEFR level or an application subdivision such as A1.3");
  if (!["lesson", "topic", "guided_check", "exercise_set", "question"].includes(String(value.entityType))) error("entity_type", "Unknown entityType");
  if (!["all", "vocabulary", "grammar", "phrases", "listening", "speaking", "reading", "writing"].includes(String(value.category))) error("category", "Unknown learning category");
  if (value.parentKey !== null && !nonempty(value.parentKey)) error("parent_key", "parentKey must be a key or null");
  if (!stringArray(value.knowledgeTopics) || !value.knowledgeTopics.length) error("knowledge_topics", "At least one knowledge topic is required");
  if (!stringArray(value.legacyClaims)) error("legacy_claims", "legacyClaims must be an array of unverified reference descriptions");
  if (!["source_original", "adapted", "newly_authored", "unknown"].includes(String(value.authorship))) error("authorship", "Unknown authorship");
  if (value.verificationStatus === "verified" && value.authorship === "unknown") error("unknown_authorship", "Verified attribution needs an explicit authorship assessment");
  if (!["verified", "needs_review", "unverified"].includes(String(value.verificationStatus))) error("review_status", "Explicit verificationStatus is required");
  else if (value.verificationStatus !== "verified") warning("review_pending", String(value.reviewNote));

  for (const role of ["contentSource", "exerciseSource"]) {
    const refs = value[role];
    if (!Array.isArray(refs) || !refs.length) { error("missing_source", `${role} requires at least one reference`); continue; }
    for (const ref of refs) {
      if (!record(ref)) { error("invalid_reference", `${role} reference must be an object`); continue; }
      if (!isRegisteredSourceId(ref.sourceId)) { error("unknown_source", `${role}: unknown sourceId ${String(ref.sourceId)}`); continue; }
      if (!nonempty(ref.note)) error("reference_note", `${role}: explain the use of the source`);
      if (!["topic_basis", "authored_in_project", "exercise_template", "comparable_mechanic"].includes(String(ref.relationship))) error("reference_relationship", `${role}: unknown relationship`);
      if (role === "contentSource" && ["exercise_template", "comparable_mechanic"].includes(String(ref.relationship))) error("wrong_source_role", "Exercise mechanics belong in exerciseSource");
      if (role === "exerciseSource" && ref.relationship === "topic_basis") error("wrong_source_role", "Content topics belong in contentSource");
      if (!page(ref.printedPage) || !page(ref.pdfPage)) error("invalid_page", "Pages must be positive one-based integers or explicit null");
      if (ref.originalActivityId !== null && !nonempty(ref.originalActivityId)) error("activity_locator", "originalActivityId must be a nonempty code or null");
      const document = sourceCatalog[ref.sourceId];
      if (typeof ref.pdfPage === "number" && document.pdfPageCount !== null && ref.pdfPage > document.pdfPageCount) error("pdf_page_range", "PDF page exceeds the identified document");
      if (document.kind !== "book" && (ref.printedPage !== null || ref.pdfPage !== null)) error("nonbook_page", "Repository sources do not have book/PDF pages");
      if (ref.verificationStatus === "verified") {
        const evidence = sourceEvidence.find((entry) => entry.id === ref.evidenceId);
        if (!evidence) error("missing_evidence", `Verified reference needs registered evidence: ${String(ref.evidenceId)}`);
        else if (evidence.sourceId !== ref.sourceId || evidence.printedPage !== ref.printedPage || evidence.pdfPage !== ref.pdfPage || evidence.originalActivityId !== ref.originalActivityId)
          error("evidence_mismatch", "Source, book page, PDF page and activity must match inspected evidence exactly");
        if (document.kind === "book" && (ref.printedPage === null || ref.pdfPage === null)) error("verified_book_locator", "Verified book references require both printedPage and pdfPage");
        if (document.kind === "book" && !document.sha256) error("unidentified_edition", "Verified book references require an inspected document fingerprint");
      } else if (ref.verificationStatus === "unverified" && ref.evidenceId === null) {
        warning("reference_pending", `${role}: ${ref.sourceId} has not been verified`);
        if (value.verificationStatus === "verified") error("false_verification", "An item with unverified references cannot be verified");
      } else error("reference_status", "Reference needs verified evidence or explicit unverified status with null evidenceId");
    }
  }
  return issues;
}

export function validateSourceRegistry(metadata: readonly SourceMetadata[], expected: readonly MetadataSubject[]): MetadataIssue[] {
  const issues = metadata.flatMap(validateSourceMetadata);
  const add = (key: string, code: string, message: string) => issues.push({ severity: "error", recordKey: key, code, message });
  const evidenceIds = new Set<string>();
  for (const evidence of sourceEvidence) {
    if (evidenceIds.has(evidence.id)) add(`evidence:${evidence.id}`, "duplicate_evidence", "Evidence IDs must be unique");
    evidenceIds.add(evidence.id);
    const document = sourceCatalog[evidence.sourceId];
    if (!nonempty(evidence.note) || !Number.isFinite(Date.parse(evidence.inspectedAt))) add(`evidence:${evidence.id}`, "evidence_review", "Evidence needs a review date and inspection note");
    if (!page(evidence.pdfPage) || !page(evidence.printedPage)) add(`evidence:${evidence.id}`, "invalid_page", "Evidence pages must be one-based integers or null");
    if (document.kind === "book" && (!document.sha256 || evidence.printedPage === null || evidence.pdfPage === null || document.pdfPageCount === null || evidence.pdfPage > document.pdfPageCount)) add(`evidence:${evidence.id}`, "evidence_document", "Book evidence needs a fingerprint and valid printed/PDF page pair");
  }
  const byKey = new Map<string, SourceMetadata>();
  const topics = new Map(metadata.filter((entry) => entry.entityType === "topic").map((entry) => [entry.activityId, entry]));
  for (const entry of metadata) {
    if (byKey.has(entry.recordKey)) add(entry.recordKey, "duplicate_key", "Metadata recordKey must be unique");
    byKey.set(entry.recordKey, entry);
  }
  for (const subject of expected) {
    const entry = byKey.get(subject.recordKey);
    if (!entry) { add(subject.recordKey, "missing_metadata", "New content requires source metadata"); continue; }
    for (const field of ["activityId", "entityType", "parentKey", "level", "lessonId", "category", "activityType"] as const)
      if (entry[field] !== subject[field]) add(entry.recordKey, "content_identity_mismatch", `${field} differs from the existing content identity`);
  }
  const expectedKeys = new Set(expected.map((entry) => entry.recordKey));
  for (const entry of metadata) {
    if (!expectedKeys.has(entry.recordKey)) add(entry.recordKey, "orphan_metadata", "No corresponding content record");
    if (entry.parentKey && !byKey.has(entry.parentKey)) add(entry.recordKey, "missing_parent", "Metadata parent was not found");
    for (const topicId of entry.knowledgeTopics) {
      const topic = topics.get(topicId);
      if (!topic) add(entry.recordKey, "unknown_topic", `Unknown knowledge topic ${topicId}`);
      else if (Number(topic.lessonId.slice(1)) > Number(entry.lessonId.slice(1))) add(entry.recordKey, "future_topic", `Future-lesson knowledge ${topicId}`);
    }
  }
  return issues;
}

/** Existing JSON/JSONB remains readable without backfilling or inventing provenance. */
export function inspectLegacySourceMetadata(item: { id: string; sourceMetadata?: unknown; sources?: unknown }) {
  if (item.sourceMetadata === undefined) return { kind: "legacy_unannotated", activityId: item.id, legacySources: item.sources ?? null, issues: [] };
  const issues = validateSourceMetadata(item.sourceMetadata);
  if (record(item.sourceMetadata) && item.sourceMetadata.activityId !== item.id)
    issues.push({ severity: "error", recordKey: item.id, code: "content_identity_mismatch", message: "Metadata activityId differs from the legacy item ID" });
  return { kind: issues.some((issue) => issue.severity === "error") ? "invalid" : "annotated", activityId: item.id, legacySources: item.sources ?? null, issues };
}

export function validateLegacyCatalogSources(value: unknown): MetadataIssue[] {
  if (!record(value) || !Array.isArray(value.items) || !Array.isArray(value.lessons))
    return [{ severity: "error", recordKey: "legacy_catalog", code: "catalog_shape", message: "Expected existing catalog lessons/items arrays" }];
  const issues: MetadataIssue[] = [];
  for (const item of [...value.lessons, ...value.items]) {
    if (!record(item) || !nonempty(item.id)) {
      issues.push({ severity: "error", recordKey: "legacy_catalog", code: "legacy_id", message: "Legacy records must retain their ID" });
      continue;
    }
    issues.push(...inspectLegacySourceMetadata({ id: item.id, sources: item.sources, sourceMetadata: item.sourceMetadata }).issues);
  }
  return issues;
}
