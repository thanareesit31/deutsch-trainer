import { arbeitsbuchSourceReviews } from "./l13-l14-arbeitsbuch-source-reviews";
import { supplementalPracticeSets } from "./l13-l14-supplemental-exercises";
import { citationFromEvidence, type SourceMetadata } from "./source-metadata";

export type SourceReviewDecision = Pick<SourceMetadata, "contentSource" | "exerciseSource" | "authorship" | "verificationStatus" | "reviewNote">;

/** Per-activity review decisions override inherited defaults, never content IDs. */
const legacyReviews: Readonly<Partial<Record<string, SourceReviewDecision>>> = {
  "question:L13-GR-02/l13-gr-cloze-1": {
    contentSource: [
      citationFromEvidence("KB13-G5A", "topic_basis", "Checked 2026-10-16: the web prompt Ich helfe ___ targets du→dir; source table and Dativ verb list establish this knowledge."),
      citationFromEvidence("WEB-AUTHORED", "authored_in_project", "Web sentence and answer authored in l13-l14-course-exercises.ts, not transcribed from the book."),
    ],
    exerciseSource: [
      citationFromEvidence("WEB-AUTHORED", "authored_in_project", "Actual origin of the web cloze."),
      citationFromEvidence("GA-PRON-54", "comparable_mechanic", "Retrospective comparison checked 2026-10-16: exercise 21/3 fills Dativ pronouns. Different sentences/context; no claim that this source was used during initial authorship."),
    ],
    authorship: "newly_authored",
    verificationStatus: "verified",
    reviewNote: "Attribution checked against the actual web prompt and inspected PDF pages on 2026-10-16. Confirms topic basis, code-authored origin and comparable cloze mechanic; does not upgrade the parent set or other questions.",
  },
};


const supplementalReviews: Record<string, SourceReviewDecision> = {};
for (const set of supplementalPracticeSets) {
  const topicEvidence = set.lessonId === "L13" ? ["KB13-VOC-10", "KB13-VOC-11", ...(set.patternId === "SUP-VOC-CONTEXT" ? ["KB13-G4", "KB13-G5A", "KB13-G5B"] : [])] : ["KB14-VOC-14", "KB14-VOC-15", ...(set.patternId === "SUP-VOC-CONTEXT" ? ["KB14-G4A", "KB14-G6A", "KB14-G6B"] : [])];
  const [first, ...others] = topicEvidence;
  const decision: SourceReviewDecision = {
    contentSource: [citationFromEvidence(first, "topic_basis", "City vocabulary and current lesson knowledge checked against the actual newly authored prompts."), ...others.map(id => citationFromEvidence(id, "topic_basis", "Inspected current/prior lesson knowledge; no later grammar imported.")), citationFromEvidence("WEB-AUTHORED", "authored_in_project", "New city prompts in l13-l14-supplemental-exercises.ts; no source exercise text copied.")],
    exerciseSource: [citationFromEvidence(set.patternId === "SUP-VOC-SEARCH" ? "WS-SEARCH-48" : "WS-CONTEXT-37", "exercise_template", "Phase 2 actual design basis: visually inspected grid search or connected shared-bank completion. Source subject matter replaced with MOMENTE city content."), citationFromEvidence("WEB-AUTHORED", "authored_in_project", "New grid, prompts, answers and interactive web implementation.")],
    authorship: "newly_authored", verificationStatus: "verified",
    reviewNote: "Phase 2: each of the two prompts, target words/answers and source-mechanic alignment reviewed against rendered source pages. Attribution verified; this is not original publisher content.",
  };
  supplementalReviews[`exercise_set:${set.id}`] = decision;
  for (const question of set.questions) supplementalReviews[`question:${set.id}/${question.id}`] = decision;
}
const crosswordReview: SourceReviewDecision = {
  contentSource: [citationFromEvidence("KB14-VOC-14", "topic_basis", "POST, POLIZEI and BANK checked in the institution picture lexicon."), citationFromEvidence("KB14-VOC-15", "topic_basis", "AMPEL and ZENTRUM checked in the places/roads picture lexicon."), citationFromEvidence("WEB-AUTHORED", "authored_in_project", "Existing project clue assets and code retained.")],
  exerciseSource: [citationFromEvidence("USER-CROSSWORD", "exercise_template", "Actual origin: existing user-provided 15×8 preset, five words, four intersections."), citationFromEvidence("WS-CROSS-33", "comparable_mechanic", "Retrospective comparison only: source has text clues; it is not a picture crossword."), citationFromEvidence("WEB-AUTHORED", "authored_in_project", "Existing shared-cell inputs and grading retained unchanged.")],
  authorship: "newly_authored", verificationStatus: "verified",
  reviewNote: "Phase 2 reviewed all five target words against MOMENTE printed/PDF 14–15, preset coordinates and image-asset mapping. Existing activity preserved; supplemental crossword supports only a comparable grid mechanic, not picture clues.",
};
export const reviewedActivitySources: Readonly<Partial<Record<string, SourceReviewDecision>>> = { ...legacyReviews, ...supplementalReviews, ...arbeitsbuchSourceReviews,
  "exercise_set:L14-VOC-CROSSWORD": crosswordReview,
  "question:L14-VOC-CROSSWORD/l14-crossword-q1": crosswordReview,
};
