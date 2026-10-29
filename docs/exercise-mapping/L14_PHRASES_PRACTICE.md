# Redemittel Lektion 14: practice inventory

Reviewed 2026-10-24. Production builds enable this practice for signed-in learner accounts by default; set `NEXT_PUBLIC_L14_PHRASES_PRACTICE=false` to disable it. Development requires the flag to be `true`; test accounts always have access. The bank uses `GUIDED_AND_PERSONALIZED_PRACTICE` from `docs/PRACTICE_FLOW_STANDARD.md`.

## Scope and source review

Learning targets are the 17 phrases already taught in `src/components/l14-phrase-learning.tsx`. The publisher evidence inventory records page 16 activity 6a (`KB14-G6A`) for phrase functions and activity 6b (`KB14-G6B`) for asking for and giving directions. Each question uses the function inventory as its topic basis; ask/describe tasks also use the pair-work activity as the interaction basis. Unknown-direction and thanks targets are practiced as phrase functions, not presented as publisher dialogue keys. These references support the communicative targets only; scenarios, distractors, Thai translations and feedback are authored for this product. No publisher answer key is claimed or copied. Provenance stays in this document and the source catalog, not in learner-facing content.

## Coverage

| Topic | Guided question IDs | Count | Target |
| --- | --- | ---: | --- |
| ถามทาง | `ask-help`, `ask-place`, `ask-far`, `ask-search`, `ask-walk` | 5 | ขอความช่วยเหลือ, ถามตำแหน่ง/ระยะทาง, บอกสิ่งที่กำลังหา, ถามว่าเดินไปได้ไหม |
| บอกทาง | `describe-straight`, `match-describe-see`, `describe-turn`, `match-describe-distance`, `describe-street`, `describe-direction` | 6 | ตรงไป, ชี้ตำแหน่ง, เลี้ยว, ระยะทาง, ลำดับถนนและทิศ |
| บอกว่าไม่รู้ทาง | `unknown-local`, `unknown-answer`, `unknown-new` | 3 | ไม่ใช่คนพื้นที่, ไม่ทราบข้อมูล, ไม่คุ้นพื้นที่ |
| ขอบคุณ | `thanks-heart`, `thanks-kind`, `thanks-oh` | 3 | ขอบคุณอย่างจริงใจ, ชมความมีน้ำใจ, ตอบรับหลังได้รับความช่วยเหลือ |
| **รวมรอบพื้นฐาน** |  | **17** | ทุกสำนวนเป้าหมายใช้หนึ่งครั้งต่อรอบ |

## Task design and flow

### Extended scored bank

- The runnable bank contains 100 independently scored responses: the 16 original authored tasks, two separately scored answers from the matching screen, one existing reply variant, and 81 new context/dialogue variants. The guided first round still covers the same 17 taught targets; these extra items are not inserted into that first pass.
- The 81 new variants are defined in `src/data/l14-phrase-variants.json`. Each maps to one of the existing 17 phrase targets and to `phrase_context` or `phrase_dialogue`, and records a difficulty rationale and available assistance. Their product-authored situations and source basis are recorded separately in `l14-phrase-variants-provenance.json`; the learner data does not contain these source references.
- Mixed and daily selection can choose a variant only after prior attempt evidence exists for its target. A round chooses at most one task per target; variants do not repeat the phrase's original task in the same round. The current selector remains history-based practice, not calibrated mastery estimation.
- Migration `20261028020000_l14_phrase_variants.sql` registers the new response definitions and their target/subskill metadata with the shared server validator. Apply it before making the added response IDs available to production accounts.

- The guided lesson route starts at the first question and continues through all 17 targets in the order above. It does not stop for a result page between topics.
- The manual entry page resumes an unfinished round first. Otherwise, it offers the guided round before any practice result, or a history-based daily round of at most 10 targets after practice. The same recommendation can appear on the home and practice overview pages. The four topic cards remain inside an optional "ฝึกเฉพาะหัวข้อ" section and show only learned targets; a match pair is eligible when both targets have been learned. The guided route remains available from the lesson handoff and covers all 17 targets once across 16 screens after the learner completes the lesson.
- Daily selection uses the latest result per target, prioritizes unanswered and incorrect targets and targets last practiced at least three days ago, and reduces recently correct items. It distributes questions across topics and task formats, keeps the two matching pairs together, and selects at most one task variant per target. The `ask-walk-reply` response choice may replace the original ordering task after that target has been practiced. The daily set contains at most 10 scored targets, not necessarily 10 screens.
- The mixed round samples 4 asking, 5 giving-direction, 3 unknown-direction, and 3 thanks targets without repeating a target in one run. The giving-direction sample includes the two-pair matching screen and three of the four remaining targets. Within each topic, unseen targets have first priority, then targets last answered incorrectly, then targets last answered correctly; ties are shuffled. The 15 selected targets use 14 screens: choice and matching screens are shuffled across topics, followed by shuffled word-order screens. A new round samples again, so omitted targets can appear in the next run. This is a practice selection rule, not a mastery claim.
- The `ask-walk-reply` review task reuses the learned question `Kann ich zu Fuß zum Café gehen?` as a dialogue stimulus and asks the learner to choose a sensible response when the café is nearby. It becomes eligible only after the original `ask-walk` task was completed in an earlier round. The mixed sampler chooses at most one task per learned target, so the word-order and response-choice versions cannot appear together in one run. The guided, mixed and separately selected topic sets use the two-pair matching task for the two giving-direction targets. After finishing the guided round, `ฝึกเพิ่ม` opens the mixed round.
- From question two onward, the in-card back button reviews the previous question and its saved answer without submitting it again. The breadcrumb returns to topic selection. A draft on the current question remains available when moving forward to it again. In word-order tasks, tapping a placed word removes only that word and restores it at its original option position; drafts in any valid partial order survive reload.
- Independently selected topic routes contain only their actual target count (5/6/3/3); the content is not padded to five where only three taught targets exist.
- Questions progress from contextual choice and short dialogue choice through one two-pair question–answer match in giving directions, then three word-order tasks at the end. The matching screen measures `describe-see` and `describe-distance` separately; those targets do not repeat in the guided round. The three word-order tasks build three other distinct targets.
- The matching screen pairs `Wo ist die Apotheke?` with `Da sehen Sie eine Apotheke.` and `Ist es weit bis zur Apotheke?` with `Das ist gar nicht weit.` The first asks for a place, the second for distance. The learner selects a question and an answer; the answer appears on that question's row and can be returned to the bank before checking. Feedback displays the German question and answer, their Thai meanings, and a short reason for each pair. Each pair creates its own attempt and retains its draft on reload. Existing in-progress routes, including the former 15-target mixed route, retain their saved task IDs.
- The round shows Thai meaning and a short explanation after checking. A wrong answer can continue. The end screen identifies the finished topic or mixed round, hides the score, and offers the next topic only when one remains in the ordered topic list; the guided and mixed rounds and the final topic offer more practice or exit without a misleading next-topic link.
- `ask-help` feedback now explains the two functions in the learned phrase: `Entschuldigung` politely opens the exchange and `Können Sie mir helfen?` asks for help. This is product-authored teaching guidance for the same reviewed source target; it does not repeat the scenario or add publisher wording.
- For the three word-order targets, learner feedback gives only the grammar rule needed to build the target and the meaning of useful word groups. In `Kann ich zu Fuß zum Café gehen?`, feedback names the Ja/Nein-Frage and Modalverb pattern: finite `Kann` first, subject `ich` next, and infinitive `gehen` at the end. It also states the usual order in this sentence, manner `zu Fuß` before destination `zum Café`, without presenting it as mandatory for every sentence. The authored guidance is not a publisher answer key.
- Practice targets have stable task IDs, phrase target IDs, topic IDs and subskills (`phrase_context`, `phrase_dialogue`, `phrase_match`, `phrase_order`). Matching answers remain separate target-level attempts. These IDs and first-answer outcomes support later per-target analysis; they do not by themselves establish adaptive mastery.
- This first set does not test route comprehension, multi-turn ordering, or free production. Advanced work should use the lesson's actual city map/dialogues and remain separate from this first pass.

## Situational illustrations and learner copy

The 14 original choice tasks and one review choice task use 14 product-authored illustrations in `public/images/lektion-14-phrases-practice/`. The images were generated for this project using the existing L14 branching city map in `public/images/lektion-14-vocabulary/phrase-city-map-branching.png` as a visual style reference: colorful illustrated streets, simple landmarks, maps and visible gestures. They are illustrative contexts, not reproductions of book artwork or evidence for a publisher answer key. Files are 800 px wide JPEGs; each unknown-direction task has its own scene, while two gratitude tasks reuse one scene. The three word-order tasks do not use illustrations.

| Illustration | Choice task IDs | Intended visible cue |
| --- | --- | --- |
| `ask-help.jpg` | `ask-help` | Visitor with map approaching a local person |
| `search-bank.jpg` | `ask-place` | Bank with coin symbol |
| `ask-distance.jpg` | `ask-far` | Train station farther along the route |
| `search-post.jpg` | `ask-search` | Post office with envelope symbol |
| `ask-walk-reply.jpg` | `ask-walk-reply` | Walkable café just around the corner from the visitor |
| `straight.jpg` | `describe-straight` | Street leading straight ahead |
| `pharmacy.jpg` | `describe-see` | Pharmacy with green cross |
| `nearby.jpg` | `describe-distance` | Nearby destination just beyond a bend |
| `turn-right.jpg` | `describe-direction` | Person pointing right at a junction |
| `unknown.jpg` | `unknown-local` | Visitor with luggage explains that they are not from this area |
| `unknown-answer.jpg` | `unknown-answer` | Local person shrugs when asked for a route they do not know |
| `unknown-new.jpg` | `unknown-new` | New arrival with luggage and a map outside the train station |
| `grateful.jpg` | `thanks-heart`, `thanks-kind` | Person thanking someone for directions |
| `thanks-info.jpg` | `thanks-oh` | Person understanding directions on a map |

The German question and click-to-reveal Thai word meanings are recorded in `src/lib/l14-phrase-visual-prompts.ts`. The question does not include the full Thai answer before checking. The illustration only gives a context; the learner still chooses the appropriate learned phrase. Keep this asset inventory and any later source review here, not on the learner page.

## Readiness limits

The lesson's checked phrase results determine which targets ordinary learners may practice. Eligibility is checked for new and saved queues, so a saved test-account run cannot bypass the learning requirement after an account changes access level. L14 uses the shared `learner_practice_sessions` account store and `PracticeAccountSync` used by L13. Its question definitions are checked by the server against `phrase_practice_questions`, and the first submitted answer is retained. Migration `20261026000000_l14_phrase_sessions.sql` registers the L14 banks, question definitions and learned-target validation. The previous `learner_lesson_states` record is read as a one-time import source so existing L14 answers can be carried into the shared store; new attempts are written only through shared practice sessions. Recommendations remain limited to this phrase bank and are not a mastery score or part of main Progress. Apply the migration before enabling the bank. Production builds enable it by default unless `NEXT_PUBLIC_L14_PHRASES_PRACTICE=false`; this repository's local configuration enables it for verification.
