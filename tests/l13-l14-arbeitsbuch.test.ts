import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import inventory from "../src/data/momente-arbeitsbuch-inventory.json";
import {sourceCatalog,sourceEvidence} from "../src/lib/source-catalog";
import {arbeitsbuchPracticeSets} from "../src/lib/l13-l14-arbeitsbuch-exercises";
import {l13L14PracticeSets} from "../src/lib/l13-l14-course-exercises";
import {allCourseExercisePatterns,type CodewordQuestion,type CourseAttempt} from "../src/lib/l13-l14-course";
import {extractCodeword,gradeCodeword,gradeTextMarking,validateCodeword} from "../src/lib/l13-l14-arbeitsbuch-grading";
import {gradeContext} from "../src/lib/l13-l14-supplemental-grading";
import {l13L14SourceMetadata} from "../src/lib/l13-l14-source-metadata";
import {parseCourseProgress,recordCourseAttempt,summarizeCourseProgress} from "../src/lib/l13-l14-course-progress";

test("all 59 existing sets remain unchanged in their original order",()=>{
 assert.equal(createHash("sha256").update(JSON.stringify(l13L14PracticeSets.slice(0,59))).digest("hex"),"0d175392bd078be4997e51901760af575605c00ba62ff2df88ba0549e92b7332");
 assert.equal(l13L14PracticeSets.length,65);
});
test("both actual Arbeitsbuch identities and explicit inspected page pairs are registered",()=>{
 assert.equal(sourceCatalog.MOMENTE_A1_1_AB.pdfPageCount,123);
 assert.equal(sourceCatalog.MOMENTE_A1_2_AB.sha256,"d16bc4194ba8d4874a85b3597b0fddc61f94e6235625f41053322e74d9f69079");
 assert.equal(sourceCatalog.MOMENTE_A1_1_AB.sha256,"fa0e7a5724dd3d7d1fcf5ba2c01c0c7bea84a756314c2389be3db917d60cdacf");
 assert.equal(inventory.length,45);
 assert.equal(new Set(inventory.map(entry=>entry.mechanic)).size,27);
 for(const [lesson,count] of [["L13",11],["L14",14]] as const) for(let number=1;number<=count;number++) {
   assert(inventory.some(entry=>entry.lessonId===lesson && new RegExp(`^${lesson}/${number}(?:[abc]|$)`).test(entry.originalActivityId)),`${lesson}/${number} missing`);
 }
 for(const entry of inventory) {
  for(const field of ["instruction","input","learnerAction","responseMode","primarySkill","grading","hint","errorExplanation","webAdaptation"]) assert(entry[field as keyof typeof entry],`${entry.id}/${field}`);
  const evidence=sourceEvidence.find(evidence=>evidence.id===entry.evidenceId);
  assert(evidence);assert.equal(evidence.printedPage,entry.printedPage);assert.equal(evidence.pdfPage,entry.pdfPage);assert.equal(evidence.originalActivityId,entry.originalActivityId);assert.equal(evidence.method,"visual_pdf");
 }
 assert.equal(sourceEvidence.find(entry=>entry.id==="AB12-13-7a")?.printedPage,8);
 assert.equal(sourceEvidence.find(entry=>entry.id==="AB12-13-7a")?.pdfPage,7);
 assert.equal(sourceEvidence.find(entry=>entry.id==="AB12-14-8")?.printedPage,12);
});
test("text annotation grades word positions and roles, including wrong or extra markings",()=>{
 const question=arbeitsbuchPracticeSets[0].questions[0];assert.equal(question.kind,"text_marking");
 if(question.kind!=="text_marking") throw new Error("Wrong mechanic");
 assert.equal(gradeTextMarking(question,{"2":"verb","3":"dative","6":"verb","7":"dative"}),true);
 assert.equal(gradeTextMarking(question,{"2":"dative","3":"verb","6":"verb","7":"dative"}),false);
 assert.equal(gradeTextMarking(question,{"2":"verb","3":"dative"}),false);
 assert.equal(gradeTextMarking(question,{...question.answerRoles,"0":"dative"}),false);
});
test("codeword grading requires all source words and extracted letters as well as final solution",()=>{
 const question=arbeitsbuchPracticeSets.find(set=>set.id==="L14-AB-CODEWORD")!.questions[0];assert.equal(question.kind,"codeword_riddle");
 if(question.kind!=="codeword_riddle") throw new Error("Wrong mechanic");
 const answers={post:"Post",park:"Park",rathaus:"Rathaus",kirche:"Kirche"};
 assert.equal(extractCodeword(question,answers),"PARK");
 assert.equal(gradeCodeword(question,answers,"park"),true);
 assert.equal(gradeCodeword(question,{},"PARK"),false);
 assert.equal(gradeCodeword(question,{...answers,post:"PARK"},"PARK"),false);
 assert.equal(gradeCodeword(question,answers,"BANK"),false);
 assert.deepEqual(validateCodeword({...question,solution:"WRONG"}),["extracted codeword differs from solution"]);
 for(const set of arbeitsbuchPracticeSets) for(const question of set.questions) if(question.kind==="codeword_riddle") assert.deepEqual(validateCodeword(question),[]);
});
test("orthographic grading does not silently fold umlauts or ß into other spellings",()=>{
 const question:CodewordQuestion={id:"unicode",kind:"codeword_riddle",prompt:"",clues:[{id:"a",clueTh:"",answer:"Straße",extractIndex:4}],solution:"ẞ",hint:"",explanation:""};
 assert.equal(gradeCodeword(question,{a:"Straße"},"ß"),true);
 assert.equal(gradeCodeword(question,{a:"STRASSE"},"ß"),false);
 const umlaut={...question,clues:[{id:"a",clueTh:"",answer:"Bär",extractIndex:1}],solution:"Ä"};
 assert.equal(gradeCodeword(umlaut,{a:"BÄR"},"Ä"),true);
 assert.equal(gradeCodeword(umlaut,{a:"Baer"},"Ä"),false);
});
test("guided recall covers all eight Dativ forms and distinguishes formal Ihnen capitalization",()=>{
 const set=arbeitsbuchPracticeSets.find(set=>set.id==="L13-AB-DATIV-BANK")!;
 const forms=set.questions.flatMap(question=>question.kind==="context_bank"?question.answers:[]);
 assert.deepEqual([...forms].sort(),["mir","dir","ihm","ihr","uns","euch","ihnen","Ihnen"].sort());
 const formal=set.questions[2];assert.equal(formal.kind,"context_bank");
 if(formal.kind!=="context_bank")throw new Error("Wrong mechanic");
 assert.equal(gradeContext(formal,["Ihnen","ihr"]),true);
 assert.equal(gradeContext(formal,["ihnen","ihr"]),false);
 assert.equal(set.builtInSupport,true);
});
test("new sets reuse valid plugins, have reviewed MOMENTE content/AB templates and no future topics",()=>{
 assert.equal(arbeitsbuchPracticeSets.length,6);
 assert.equal(arbeitsbuchPracticeSets.reduce((sum,set)=>sum+set.questions.length,0),19);
 for(const set of arbeitsbuchPracticeSets) {
  assert(set.questions.length>=3);assert(set.learningStage);assert(set.secondaryCompetencies?.length);assert(set.topicIds.every(topic=>/^L(13|14)-/.test(topic)));
  const pattern=allCourseExercisePatterns.find(pattern=>pattern.id===set.patternId);assert(pattern);
  assert.equal(pattern.category,set.category);assert(set.difficulty>=pattern.minDifficulty&&set.difficulty<=pattern.maxDifficulty);
  assert(set.questions.every(question=>question.kind===pattern.kind));
  for(const key of [`exercise_set:${set.id}`,...set.questions.map(question=>`question:${set.id}/${question.id}`)]) {
   const metadata=l13L14SourceMetadata.find(record=>record.recordKey===key);assert(metadata);
   assert.equal(metadata.verificationStatus,"verified");
   assert(metadata.contentSource.some(ref=>ref.sourceId==="MOMENTE_A1_2_KB"));
   assert(metadata.exerciseSource.some(ref=>ref.sourceId==="MOMENTE_A1_2_AB"&&ref.relationship==="exercise_template"));
   assert(metadata.knowledgeTopics.every(topic=>/^L(13|14)-/.test(topic)));
  }
 }
});
test("new attempt payloads retain old history and never become stable after one success",()=>{
 const attempt:CourseAttempt={attemptId:"ab-one",exerciseId:"L13-AB-MARK",questionId:"l13-ab-mark-1",lessonId:"L13",category:"grammar",topicIds:["l13-dative-pronouns"],primaryCompetency:"grammar.dative",patternId:"AB-GR-MARK",response:'{"roles":{"2":"verb"}}',startedAt:"2026-10-17T00:00:00Z",submittedAt:"2026-10-17T00:00:01Z",correctness:1,maxScore:1,hintsUsed:0,retryNumber:0,evaluationMethod:"deterministic",answerVersion:"v1"};
 const state={version:1 as const,completedTopics:["old-topic"],drafts:{old:"text"},attempts:[]};
 const updated=recordCourseAttempt(state,attempt);
 assert.equal(parseCourseProgress(JSON.stringify(updated)).kind,"valid");
 assert.deepEqual(updated.drafts,{old:"text"});assert.deepEqual(updated.completedTopics,["old-topic"]);
 assert.equal(summarizeCourseProgress(updated).stable,false);
 assert.equal(summarizeCourseProgress({...updated,attempts:[{...attempt,hintsUsed:1}]}).independentAttempts,0);
});
