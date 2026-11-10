# L01 supplementary phrase review

Reviewed 2026-11-04 after the spelling-name gap was raised during prototype use. This addendum extends the earlier Kursbuch-only function audit. It does not change the running activities or claim that supplements for all twelve lessons were reviewed.

## Finding

The L01 teacher slides explicitly teach **Wie bitte? Wie schreibt man das?** in a name interview. PDF 9 asks learners to interview seven people and write their first/family names. The preceding turns are `Wie ist dein Familienname/Vorname?` and `Mein Familienname/Vorname ist …`. PDF 7 also has a handwritten `Wie schreibt man das?` above the alphabet.

The worksheet's L01 section occupies PDF 1–9, with L02 starting at PDF 10. Those L01 pages do not show an explicit spelling request. They do include a `du oder Sie?` interview with `Freut mich!` / `Freut mich auch!` at PDF 8. The teacher slides reinforce that pair at PDF 4 and 32; L02 starts at PDF 33.

The earlier finding about the Kursbuch remains scoped to that source: PDF 12/printed 10, activity 2c, supplies a name, `Entschuldigung. Wie bitte?`, letter-by-letter spelling and thanks. The teacher slides make the request for the written/spelled form explicit. Do not describe `Buchstabieren Sie bitte` as a verified quotation from the reviewed material.

Source filenames, exact PDF pages, source roles, SHA-256 fingerprints and per-finding status are in `l01-phrase-supplement-review.json`. All page numbers here are PDF page numbers except where explicitly marked printed.

## Gaps to fill

| Function | Source-supported content | Current prototype | Required design work |
| --- | --- | --- | --- |
| Request spelling | Wie bitte? Wie schreibt man das? | Not present; it asks for repetition only | Teach the request, then choose it when a name needs to be written |
| Supply the spelling | Name → sequence of letters | Spelling appears only in the preceding turn of the thanks example | Let the learner supply or reconstruct a name's letters. Distinguish supplied-letter ordering from recalling letters independently |
| Ask first name versus surname | Wie ist dein Vorname/Familienname? | No separate response units | Provide a clear person card with der Vorname and der Familienname, then ask for one field at a time |
| Respond after an introduction | Freut mich! / Freut mich auch! | Absent | Teach a reciprocal introduction before assessing its reply |
| Night-time farewell | Gute Nacht! | Absent | Contrast leaving/before sleep with an evening meeting; do not treat every evening greeting as Gute Nacht |

The worksheet has mixed notes. Its PDF 2 includes an occupation block within the L01 divider, so page grouping alone cannot establish lesson scope. PDF 3 handwriting reads `Guten Nacht`; the slides show the correct `Gute Nacht!`. Source fidelity does not mean reproducing a source typo. The book remains the primary source for lesson boundaries.

## Evidence boundary for the extension

Keep these response units distinct:

- Understanding or choosing a spelling request measures communication in context.
- Arranging supplied letters measures supported letter order, not independent spelling recall.
- Typing a name from an already written person card is copying; mark that assistance explicitly.
- Writing a name from audio can measure sound-to-letter mapping only after the letter audio, naming convention and alternatives are checked. No such listening task or audio was verified in this source pass.
- Selecting first name versus surname measures the requested information field, rather than general spelling skill.

Link new tasks to L01-COMM-05 or L01-COMM-02 as appropriate, keep original IDs/first responses, and add new response definitions rather than changing old answers. New teaching eligibility must precede the corresponding learning check. Do not retroactively interpret the existing thanks response as evidence of spelling ability.

Adding checks also changes the screen count and saved numeric positions. Before extending the active prototype, version or migrate its queue so completed and pending 15-screen runs remain readable. New targets, variants, accepted answers, account state and next-task selection are still design work. No new account evidence, adaptive selection or deployment was implemented in this review.

## Implementation follow-up, 5 November 2026

All five gap areas above now have local tester Learn checks in [L01_PHRASE_DISCOVERY_PREVIEW.md](L01_PHRASE_DISCOVERY_PREVIEW.md#supplemental-activities-5-november-2026). The table's “current prototype” column describes the initial review snapshot. Source JSON retains that original status as `runtimeStatusAtReview` and separately records implementation task IDs. Spelling remains supplied-letter ordering with the name visible; independent spelling/listening and adaptive selection remain unimplemented.
