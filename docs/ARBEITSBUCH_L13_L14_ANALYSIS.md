# MOMENTE Arbeitsbuch — L13–L14 analysis

## Source priority and file verification

Kursbuch determines lesson content and teaching order. Arbeitsbuch is the primary exercise source for the matching lesson. Grammatik aktiv and Wortschatz Training supplement mechanics only. Public exercises below are newly authored; no page scans, publisher audio or large source question sets are published.

| ID | Exact file | Pages | SHA-256 |
|---|---|---|---|
| MOMENTE_A1_1_AB | `แบบฝึกหัด Momente A1.1  บท1-12.pdf` | 123 | `fa0e7a5724dd3d7d1fcf5ba2c01c0c7bea84a756314c2389be3db917d60cdacf` |
| MOMENTE_A1_2_AB | `แบบฝึกหัด Momente A1.2 บท 13-24.pdf` | 123 | `d16bc4194ba8d4874a85b3597b0fddc61f94e6235625f41053322e74d9f69079` |

Both are under the user-specified Desktop/เรียนเยอรมัน folder. No matching duplicate filenames found in that tree/Downloads search. Fingerprints differ because they are different volumes, not duplicate editions. Both parse unlocked, with all123page objects accessible. Covers, interior activity pages and ending pages rendered. This verifies file accessibility and structural completeness, not a claim that every page was visually audited. A1.1 interior L01 pages6–7 (PDF5–6) checked for identity; no L01/L02 changes or new exercises.

A1.2 L13: printed6–9/PDF5–8; L14: printed10–13/PDF9–12, including the L14/4a scene on printed10 and answers on printed11. All25numbered activities reviewed, represented by39subactivity entries. Follow-up Noch mehr!: printed86/PDF85 and87/PDF86, six additional entries. Structured inventory: `src/data/momente-arbeitsbuch-inventory.json` (45entries, 27mechanic families). Every entry records the instruction in paraphrase, source display, response mode, knowledge, primary/secondary skills, difficulty, grading, hints, error explanation, web adaptation, actual page pair and source activity ID. Evidence means visual inspection; it never claims that missing audio was heard.

## Inventory by page

| Printed / PDF | Lesson and activities | Source formats |
|---|---|---|
| 6 / 5 | L13/1,2,3a–b | Shared bank, odd-one-out, picture map labeling, text-clue crossword |
| 7 / 6 | L13/3c,4a–c,5a–b | Partner messages; map-based article choices; derive rule table; contextual inflection; listening matrix; email |
| 8 / 7 | L13/6,7a–b,8a | Verb cloze; mark verb + pronoun in continuous blog text; derive pronoun table; pronoun dialogue cloze |
| 9 / 8 | L13/8b,9a–c,10a–b,11 | Partner questions; vowel discrimination/underlining/repetition; picture tags; opinion classification; photo caption |
| 10 / 9 | L14/1,2a–b,3,4a scene | Draw directions; complete/trace route; listening check; voice message; spatial scene |
| 11 / 10 | L14/4a–b,5,6,7 | Spatial cloze; Dativ table; article completion; image-based location sentences; own photo + partner description |
| 12 / 11 | L14/8,9,10,11a | Word riddles with extracted-letter solution; location replies; listening sequence; diphthong repetition |
| 13 / 12 | L14/11b–c,12,13,14 | Grapheme completion + repeat; ordinal street routes; phrase bank dialogue; spoken map directions |
| 86 / 85 | L13/6★,6★★,8★ | Verb/pronoun completion; communicative matching; pronoun choices in a letter |
| 87 / 86 | L13/8★★; L14/9★,9★★ | Meaning-preserving reformulation; location sentences; street description reply |

## Gap analysis

Before this work: 59course practice sets, 42original +2supplemental patterns; existing legacy vocabulary/guided/conjugation paths remain. Existing runtime mechanics include choices, multi-select, matching, categorization, cloze, context bank, word order, letter slots, picture crossword, word search, image hotspots, evidence judgments, open text, audio choice/route, recorded speech, dialogue order, map routes and self-rated flashcards. Census references: `l13-l14-course.ts`, `l13-l14-course-exercises.ts`, `guided-learning.ts`, `content.ts`, and Phase2 inventory.

- Existing and working: true picture crossword, word search, shared-bank context and original choice/matching/conjugation paths. Retain IDs, questions and stored responses.
- Same mechanic/different content: AB article/pronoun cloze, table/matching, dialogue bank, speaking, writing. Reuse existing renderers; add content only where a targeted gap remains (Dativ guided/controlled recall, full spatial phrase, contextual phrases).
- New interaction variant: annotate verb and Dativ-pronoun tokens inside continuous text. Categorization exists on isolated cards; this variant practices noticing evidence in running text and needs a text annotation surface, not another word list.
- Genuinely new composite mechanic: solve word clues, transfer specified letters, then type a final codeword. It is neither a crossword grid nor word search.
- Not added: drawing canvas, own-photo upload, new microphone/scoring pipeline or invented publisher listening audio. Existing map, writing and recording activities cover appropriate practice; pronunciation/listening formats requiring absent media are recorded as unavailable for source-faithful implementation.

## Additive exercise design

| New ID | Category | Stage | Primary / secondary | Mechanism basis |
|---|---|---|---|---|
| L13-AB-MARK | Grammatik | 1 Recognition | Grammar / reading | L13/7a printed8/PDF7 |
| L13-AB-DATIV-BANK | Grammatik | 2 Guided Recall | Grammar / contextual reading | L13/8a printed8/PDF7; Noch mehr!6★ printed86/PDF85 |
| L13-AB-VERBS | Grammatik | 3 Controlled Production | Verb inflection / reading | L13/6 printed8/PDF7 |
| L14-AB-CODEWORD | Wortschatz | 4 Independent Recall | Vocabulary/spelling | L14/8 printed12/PDF11 |
| L14-AB-ORT | Grammatik | 5 Contextual Application | Wo? + Dativ / visual reading | L14/6 printed11/PDF10;9★ printed87/PDF86 |
| L14-AB-DIALOG | Redemittel | 5 Contextual Application | Communicative phrases / reading | L14/13 printed13/PDF12 |

Each new set has at least3closed-response prompts; the Dativ bank has4 to cover all eight personal-pronoun forms (19new prompts total). Only current/prior lesson vocabulary and grammar are used. New annotations and codeword puzzles have dedicated grading and mobile/keyboard UI; other sets reuse current cloze/context bank. Hint use remains separate from independent evidence. No secondary skill is automatically awarded mastery. New bank-based sets mark built-in support as assisted evidence even when no extra hint button is used. Formal Ihnen capitalization is checked explicitly; no silent ß/ss or umlaut transliteration is accepted in the new codeword grader.

## Progress integration

The earlier local DB failure was reproduced: preexisting course keys were missing from the existing constraint. Migration `20261017000000_course_learning_state_keys.sql` ORs only the two explicit L13/L14 keys into the full prior expression. It does not replace the old allowed keys, modify rows, add columns/tables or change RLS. Reapplication is a no-op. Local migration tests retain sentinel L01/L02 and arbitrary earlier allowances, reject L15/other-account writes and compare old states byte-for-byte. Production application is not authorized and is not performed.

Account-scoped version1CourseAttempt retains knowledge topics, primary competency, pattern, response, correctness, timestamps, hints and retry history. New optional learning-stage/secondary-skill fields are content descriptors, not a persisted Progress migration. Existing stable policy stays unchanged: one correct answer never proves retention.


## Verification and current limitations

- `npm run test:arbeitsbuch`:35automated tests (34course/content/source/regression +1migration/RLS/idempotence). Covers59existing-set digest, source evidence/coverage, all eight Dativ pronouns, formal capitalization, annotation extra/wrong marks, codeword extraction and German spelling, version1state compatibility and one-answer-not-stable.
- Browser full run: all19new prompts on desktop1440andmobile320, plus tablet820; wrong answers, hints, touch/click/keyboard, explanations, reload and actual DB state reads. Follow-up smoke checks canonical topic IDs at390px after the new content's topic labels were normalized; old activity/state IDs are not normalized or rewritten.
- Phase2 strict regression covers8earlier supplemental prompts and existing Picture Crossword, now including successful DB saves and original-attempt preservation.
- Test DB preservation: before restart two identical backups were taken for both test accounts. Original guided-learning state compared exactly unchanged; no old row keys missing from exposures/derived state. New rows added by active use are retained, not treated as a reset. Backup files stay ignored under `.tools/arbeitsbuch/`.
- PDF inspection found no annotations or EmbeddedFiles dictionary in either document, consistent with book references to separate audio CDs. Listening/phonetic source-faithful additions require those audio assets and appropriate usage rights. Existing labeled synthetic audio/recording activities remain.
- Source metadata:251records total,58verified/193needs_review. All25new web metadata records are verified. Old pending records retain evidence-specific explanations; no blanket status upgrades.
- This pilot audits L13–14 activity pages and referenced extras, not all activities in both123-page volumes. A1.1 is registered and visually confirmed; no activities for L01–L12 were added or changed.
- Production migration/deployment is pending user authorization. No production DB data, main-branch push or deployment performed.

## Routes

Use `http://localhost:3002/learn/L13/course/ueben/grammar` and the equivalent L14 vocabulary/grammar/phrases menus. Added IDs: `L13-AB-MARK`, `L13-AB-DATIV-BANK`, `L13-AB-VERBS`, `L14-AB-CODEWORD`, `L14-AB-ORT`, `L14-AB-DIALOG`. Direct route: `/learn/{lesson}/course/ueben/{category}/{setId}`. Test login: `tester@deutsch.test` / `TestOnly123!`; automated browser runs use tester2 to isolate the user-facing test account.


Final gates: production Webpack build and TypeScript passed; `sources:check` reports251records/0errors/193review warnings. Menu smoke at390px opens all6new sets through their actual Üben cards and verifies Thai wrong-answer diagnostics plus canonical-topic persistence. Protected L01/L02 entries and L02 pronoun/verb pages passed route smoke. The older L02 database-driven catalogue test's missing `publicverheiratet` path remains an acknowledged preexisting test issue, outside the35-test Arbeitsbuch suite; it is not counted as passed.
