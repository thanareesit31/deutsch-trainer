import {arbeitsbuchPracticeSets} from "./l13-l14-arbeitsbuch-exercises";
import {citationFromEvidence} from "./source-metadata";
import type {SourceReviewDecision} from "./l13-l14-source-reviews";

const templates:Readonly<Record<string,readonly [string,...string[]]>>={
 "L13-AB-MARK":["AB12-13-7a"],
 "L13-AB-DATIV-BANK":["AB12-13-8a","AB12-13-6-extra-one"],
 "L13-AB-VERBS":["AB12-13-6"],
 "L14-AB-CODEWORD":["AB12-14-8"],
 "L14-AB-ORT":["AB12-14-6","AB12-14-9-extra-one"],
 "L14-AB-DIALOG":["AB12-14-13"],
};
const content:Readonly<Record<string,readonly [string,...string[]]>>={
 "L13-AB-MARK":["KB13-G5A"],
 "L13-AB-DATIV-BANK":["KB13-G5A"],
 "L13-AB-VERBS":["KB13-G5A","KB13-G5B"],
 "L14-AB-CODEWORD":["KB14-VOC-14","KB13-VOC-10","KB13-VOC-11"],
 "L14-AB-ORT":["KB14-G4A","KB14-G4B"],
 "L14-AB-DIALOG":["KB14-G6A","KB14-G6B"],
};
const reviews:Record<string,SourceReviewDecision>={};
for(const set of arbeitsbuchPracticeSets) {
 const basis=content[set.id],mechanics=templates[set.id];
 if(!basis||!mechanics) throw new Error(`Arbeitsbuch set lacks an explicit source review: ${set.id}`);
 const [first,...others]=basis,[exercise,...additional]=mechanics;
 const review:SourceReviewDecision={
  contentSource:[citationFromEvidence(first,"topic_basis","MOMENTE Kursbuch current/prior lesson knowledge checked against each new web prompt."),...others.map(id=>citationFromEvidence(id,"topic_basis","Additional inspected prerequisite vocabulary/grammar.")),citationFromEvidence("WEB-AUTHORED","authored_in_project","New web scenarios, Thai clues, answers and project-owned diagrams; publisher questions/media not copied.")],
  exerciseSource:[citationFromEvidence(exercise,"exercise_template","Actual design basis: visually inspected MOMENTE Arbeitsbuch activity. Web prompts are newly authored adaptations."),...additional.map(id=>citationFromEvidence(id,"exercise_template","Additional inspected Arbeitsbuch exercise supporting guided/contextual progression.")),citationFromEvidence("WEB-AUTHORED","authored_in_project","Interactive implementation and all public prompts authored in project.")],
  authorship:"newly_authored",verificationStatus:"verified",
  reviewNote:"Reviewed 2026-10-17: all prompts (three per set; four Dativ-bank prompts), correct answers, primary/secondary skill distinction and exact source page/activity alignment checked. Attribution verified; no original audio/transcript or source image attribution is claimed.",
 };
 reviews[`exercise_set:${set.id}`]=review;
 for(const question of set.questions) reviews[`question:${set.id}/${question.id}`]=review;
}
export const arbeitsbuchSourceReviews:Readonly<Record<string,SourceReviewDecision>>=reviews;
