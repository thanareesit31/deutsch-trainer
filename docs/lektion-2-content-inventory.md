# Lektion 2 — verified inventory and learning design

Verified 2026-10-07 by visual inspection of supplied PDFs. PDF pages are one-based. Moment PDF 14–17 correspond to printed pages 13–16; printed page 17 begins L03 and is excluded. Scans/extracted images remain in ignored `.tools/l02-source`, never shipped as artwork.

## Sources and inventory

- **Moment**, PDF 15 / printed 14: numbers 0–13, 15–17, 20, 21, 30, 60, 70, 100 `(ein)hundert`; blanks 14, 18, 19, 40, 50, 80, 90 are filled in **teacher slide 36**. Compound examples 21, 28, 35 establish units + und + tens (ein in 21).
- **Worksheet**, PDF 11–14: number discrimination, personal phone number question/answer and compounds 21, 32, 43, 54, 65, 76, 87, 98, 99, 72. These reinforce the book's pattern; their scope remains worksheet_support.
- **Moment**, PDF 15–16 / printed 14–15, picture lexicon: Ingenieur, Kfz-Mechatroniker, Student, Journalistin, Friseur, Architektin, Ärztin, Lehrer, Verkäufer, Kellnerin, Paketzusteller. These are the 11 core profession concepts.
- **Moment**, PDF 16: explicitly printed opposite forms Ingenieurin, Studentin, Kellner, Arzt; PDF 17 also prints Friseurin. **Teacher slide 68** confirms both forms of all 11: Ingenieur/Ingenieurin, Kfz-Mechatroniker/Kfz-Mechatronikerin, Student/Studentin, Journalist/Journalistin, Friseur/Friseurin, Architekt/Architektin, Arzt/Ärztin, Lehrer/Lehrerin, Verkäufer/Verkäuferin, Kellner/Kellnerin, Paketzusteller/Paketzustellerin. Form provenance must distinguish book evidence from teacher evidence; a core concept does not automatically make each form book-attested.
- **Moment**, PDF 17 communication box: Schüler, Studentin, Kellner, Rentnerin also occur in sentence patterns. Schüler and Rentnerin are recorded as contextual mentions, not silently promoted to core picture vocabulary.
- **Teacher slide 59**, reinforced by worksheet 18/21: ich, du, er, sie (singular), wir, ihr, sie (plural), Sie (formal, one or many). No `es` in this presentation. Personal reference, singular/plural and politeness are taught through Thai situation discrimination.
- **Moment**, PDF 16: arbeiten; ich arbeite, du arbeitest, er/sie arbeitet, sie arbeiten. Teacher slide 71 adds wir/Sie to arbeiten and the general conjugation grid on slide 60 supports ihr -t. Full six-row activity applies those attested patterns to the explicitly requested forms; it is pedagogical composition, not a claim that every row is printed in Moment.
- **machen**: Moment PDF 14 lesson title, PDF 17 communication box (Ich mache eine Ausbildung / ein Praktikum), teacher slides 65/70 (Was machst du beruflich? / Was machen Sie beruflich? / Ich mache ein Praktikum). Full six-row conjugation uses the teacher slide 60 regular endings and the user-specified table. This is a documented application of the taught pattern; no full machen table was located in these pages.
- **sein**: reuse the six `grammar-L01-sein-*` IDs. L02 presents only ich, du, er/sie, wir, ihr, sie/Sie; the pre-existing L01 row mentions es, so L02 does not display that row's original prompt. Book profession response, teacher slide 60 and status slide 70 support reuse.
- **Was? / Beruf**: Moment PDF 17 and teacher slides 65–66: Was bist du von Beruf? / Ich bin ... . This extends the L01 W-question concept.
- **Handynummer**: teacher slide 35, worksheet PDF 12: Wie ist deine Handynummer? / Meine Handynummer ist ... . Tagged teacher_extension, reinforced by worksheet; number references are shared with Zahlen.
- **Arbeitsstatus**, teacher slide 70 / worksheet 23: Praktikum, arbeitslos, nicht arbeiten, freiberuflich, selbstständig, angestellt, with the six supplied example sentences. Keep Beruf vs status discrimination explicit.
- **Traumberuf**, teacher slides 72–73: writing about current/dream job. Confirmed extra paired concepts Millionär(in), Fußballspieler(in), Astronaut(in). The worksheet is not evidence that all practice words are core.
- **Additional teacher professions**, slide 69 / worksheet 22: Autor/Autorin, Cafébesitzer/Cafébesitzerin, Diplomat/Diplomatin, Dolmetscher/Dolmetscherin, Flugbegleiter/Flugbegleiterin, Fotograf/Fotografin, Geschäftsmann/Geschäftsfrau, Hausmann/Hausfrau, Influencer/Influencerin, Investor/Investorin, Jurist/Juristin, Koch/Köchin, Krankenpfleger/Krankenschwester, Modell/Modell, Musiker/Musikerin, Politiker/Politikerin, Polizist/Polizistin, Programmierer/Programmiererin, Regisseur/Regisseurin, Reiseleiter/Reiseleiterin, Rezeptionist/Rezeptionistin, Sänger/Sängerin, Schauspieler/Schauspielerin, Schüler/Schülerin, Sekretär/Sekretärin, Soldat/Soldatin, Student/Studentin (reuse core concept).

Thai meanings/pronunciations are editorial learner aids, not literal Thai transcriptions from the book; slide Thai meanings are used where supplied. Synthetic sound reuses the existing shared German voice. `hundert` and `einhundert` are accepted alternatives; number canonical display uses hundert.

## Objectives → interactions → feedback → flow

| Content | Objective | Retrieval interaction | Dependencies |
| --- | --- | --- | --- |
| Base numbers / tens | number ↔ word ↔ sound | number_to_word, word_to_number, audio_to_number with group reference | none |
| Compounds | notice units → und → tens | select compound decomposition and number | base numbers/tens |
| Handynummer | understand question; use numbers as individual digits | question/answer discrimination; audio digit sequence choice | Zahlen |
| Professions | associate concept and both forms | word/image matching, image-to-word, explicit form pairs | none |
| Pronouns | distinguish self, addressee, third person and number/formality | scenario → pronoun | L01 subject concept |
| arbeiten / machen | link subject to form, observe endings | introduction → drag/tap matching (duplicate forms have interchangeable tokens) | pronouns |
| sein reuse | apply previously introduced forms to Beruf | six subject/form pairs referencing L01 IDs | pronouns, L01 sein |
| Was / Beruf | connect question and answer slot | meaning, response and sentence completion | professions + sein |
| Extensions | distinguish job from status, apply dream-job vocabulary | status/meaning and status/profession discrimination; explicit extension form pairs; personal optional writing with retrieval | machen / sein for full sentence application |

Content lives once in Supabase catalog. Ordered activity configuration in lesson metadata references it repeatedly. Match pairs lock green; wrong choices/pairs show red and retry without a revealed correct answer. Continue is enabled only after success; no learning scores or Practice attempts. Learned activity IDs and content IDs persist separately from a forward-only resume position. Back changes only the visible activity. Each step is inspectable again after completion.

## Ambiguity and intentional exclusions

- Teacher slide 73 spells the beauty-queen term `Schönheitkönigin` (missing s). Do not silently seed a corrected term or infer a male pair. The phrases reiche Arbeitslose/reicher Arbeitsloser are not profession pairs; omit them from profession vocabulary.
- No book-attested Koch/Köchin in L02; teacher extension only.
- No `es`, cases, L03 family content, marriage-status flow, additional verbs wohnen/leben/haben, mastery, spaced repetition or copied illustrations in this implementation scope, although some occur in L02 source pages.
- The auxiliary Buch PDF and misnamed worksheet 12-12 are still placeholders; the actual requested worksheet Lektion 1–12 is available and verified, so these extra documents are not prerequisites.
