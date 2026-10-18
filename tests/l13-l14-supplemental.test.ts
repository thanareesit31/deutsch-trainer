import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { l13L14PracticeSets } from "../src/lib/l13-l14-course-exercises";
import { supplementalPracticeSets } from "../src/lib/l13-l14-supplemental-exercises";
import { gradeSearch, gradeContext, searchPath, searchMatch } from "../src/lib/l13-l14-supplemental-grading";
import { l13L14SourceMetadata } from "../src/lib/l13-l14-source-metadata";
import { parseCourseProgress, recordCourseAttempt } from "../src/lib/l13-l14-course-progress";
import type { CourseAttempt } from "../src/lib/l13-l14-course";

test("all original sets, IDs, prompts, answers and sources are byte-equivalent to the pre-Phase-2 snapshot",()=>{
  const original=l13L14PracticeSets.slice(0,55);
  assert.equal(original.length,55);
  assert.equal(createHash("sha256").update(JSON.stringify(original)).digest("hex"),"df131badee1ab6c0b71cbf5784863e0842d0dec2063758a04a52c9947b84db0b");
});
test("word search grades actual horizontal/vertical paths, reverse selection and incomplete searches",()=>{
  assert.deepEqual(searchPath(["ABC","DEF","GHI"],0,2),[0,1,2]);
  assert.deepEqual(searchPath(["ABC","DEF","GHI"],2,0),[2,1,0]);
  assert.deepEqual(searchPath(["ABC","DEF","GHI"],0,6),[0,3,6]);
  for(const [a,b] of [[0,4],[-1,2],[0,99],[1.5,2],[0,0]]) assert.deepEqual(searchPath(["ABC","DEF","GHI"],a,b),[]);
  for(const set of supplementalPracticeSets) for(const question of set.questions) if(question.kind==="word_search") {
    assert.equal(gradeSearch(question,[]),false);
    for(const word of question.words) assert.equal(searchMatch(question,word.start,word.end),word.word);
    assert.equal(gradeSearch(question,question.words.map(word=>[word.end,word.start])),true);
    assert.equal(gradeSearch(question,[[question.words[0].start,question.words[0].end]]),false);
    assert.equal(gradeSearch(question,[[0,99]]),false);
  }
});
test("context blanks require correct content, order and actual word-bank entries",()=>{
  for(const set of supplementalPracticeSets) for(const question of set.questions) if(question.kind==="context_bank") {
    assert.equal(gradeContext(question,question.answers),true);
    assert.equal(gradeContext(question,question.answers.map(word=>` ${word.toLowerCase()} `)),true);
    assert.equal(gradeContext(question,[]),false);
    assert.equal(gradeContext(question,[...question.answers].reverse()),false);
    assert.equal(gradeContext(question,question.answers.map(()=>"unknown")),false);
    assert.equal(gradeContext({...question,bank:[]},question.answers),false);
  }
});
test("each new set and question has reviewed content and exercise-template evidence",()=>{
  assert.equal(supplementalPracticeSets.length,4);
  for(const set of supplementalPracticeSets) {
    assert(set.secondaryCompetencies?.length);
    for(const key of [`exercise_set:${set.id}`,...set.questions.map(question=>`question:${set.id}/${question.id}`)]) {
      const metadata=l13L14SourceMetadata.find(entry=>entry.recordKey===key);
      assert(metadata);
      assert.equal(metadata.verificationStatus,"verified");
      assert(metadata.contentSource.some(source=>source.sourceId==="MOMENTE_A1_2_KB"));
      assert(metadata.exerciseSource.some(source=>source.relationship==="exercise_template" && source.sourceId==="WORTSCHATZ_A1_TRAINING" && source.printedPage!==null && source.pdfPage!==null));
    }
  }
  assert.equal(l13L14SourceMetadata.find(entry=>entry.recordKey==="exercise_set:L13-VOC-SELECT")?.verificationStatus,"needs_review");
});
test("old and new attempts coexist without changing the version-1 persisted shape or resetting drafts",()=>{
  const base:CourseAttempt={attemptId:"old",exerciseId:"L13-GR-02",questionId:"l13-gr-cloze-1",lessonId:"L13",category:"grammar",topicIds:["l13-dative-pronouns"],primaryCompetency:"grammar.dative",patternId:"GR-05",response:"dir",startedAt:"2026-10-16T08:00:00Z",submittedAt:"2026-10-16T08:01:00Z",correctness:1,maxScore:1,hintsUsed:0,retryNumber:0,evaluationMethod:"deterministic",answerVersion:"v1"};
  const state={version:1 as const,completedTopics:["L13-dativ-pronomen"],attempts:[base],drafts:{existing:"keep this"}};
  const updated=recordCourseAttempt(state,{...base,attemptId:"new",exerciseId:"L13-SUP-SEARCH",patternId:"SUP-VOC-SEARCH",response:"[[30,33],[8,28]]",hintsUsed:1});
  const parsed=parseCourseProgress(JSON.stringify(updated));
  assert.equal(parsed.kind,"valid");
  if(parsed.kind!=="valid") throw new Error("Invalid persisted progress");
  assert.deepEqual(parsed.state.attempts[0],base);
  assert.deepEqual(parsed.state.completedTopics,state.completedTopics);
  assert.deepEqual(parsed.state.drafts,state.drafts);
  assert.equal(parsed.state.attempts[1].hintsUsed,1);
  assert.equal(state.attempts.length,1);
});
