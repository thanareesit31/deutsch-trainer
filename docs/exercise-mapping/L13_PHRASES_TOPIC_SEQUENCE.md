# L13 phrase topic sequence

Generated from scripts/exercise-mapping/l13-phrase-sequence.mjs. Internal content review, 2026-10-28.

The guided round remains 20 tasks: 20 distinct phrase targets, five per learning topic. Each topic contains two contextual choices, two matching responses on one screen, and one contextual word-order task. Extra variants are available only to the history-based daily selector; one phrase target can occur at most once per round. The full catalog contains 114 scored variants. Four self-reviewed writing activities remain excluded from scored-round counts. Difficulty values indicate task demand and assistance, not calibrated learner levels.

Target answers come from supabase/seed/catalog.json. Dialogue cues, factual contexts and distractors are product-authored. Source metadata remains internal. Historical question IDs and submitted answers are retained. Required learned items include supporting phrase targets used in contexts; only the target response receives coverage credit.

| Question ID | Target item | Required learned items | Topic position | Difficulty | Subskill | Cue / context | Accepted answer |
| --- | --- | --- | ---: | ---: | --- | --- | --- |
| L13-phrases-rating-sequence-1 | L13-R001 | L13-R001 | 1 | 1 | phrase_context | A: Gefällt Ihnen Berlin?<br>B: ___ | Berlin gefällt mir. |
| L13-phrases-rating-sequence-2 | L13-R006 | L13-R006 | 2 | 1 | phrase_context | A: Ist diese Stadt genauso wie andere Städte?<br>B: ___ | Die Stadt ist einfach anders. |
| L13-phrases-rating-sequence-3 | L13-R004 | L13-R004 | 3 | 2 | phrase_match | Finden Sie die Stadt toll? | Ich finde die Stadt toll. |
| L13-phrases-rating-sequence-4 | L13-R007 | L13-R007 | 4 | 2 | phrase_match | Ist die Stadt zu groß? | Die Stadt ist zu groß. |
| L13-phrases-rating-sequence-5 | L13-R005 | L13-R005 | 5 | 3 | phrase_order | คุณคิดว่าเบอร์ลินน่าสนใจ<br>A: Wie finden Sie Berlin?<br>B: | Ich finde Berlin interessant. |
| L13-phrases-city-sequence-1 | L13-R011 | L13-R011 | 1 | 1 | phrase_context | เมืองนี้มีสวนสาธารณะหนึ่งแห่ง<br>A: Gibt es hier einen Park?<br>B: ___ | Hier gibt es einen Park. |
| L13-phrases-city-sequence-2 | L13-R012 | L13-R012 | 2 | 1 | phrase_context | เมืองนี้มีโบสถ์หลายแห่ง<br>A: Gibt es hier Kirchen?<br>B: ___ | Es gibt viele Kirchen. |
| L13-phrases-city-sequence-3 | L13-R013 | L13-R013, L13-R010 | 3 | 2 | phrase_match | Was gibt es hier? | Es gibt auch ein Café. |
| L13-phrases-city-sequence-4 | L13-R015 | L13-R015 | 4 | 2 | phrase_match | Gibt es hier einen Hafen? | Leider gibt es keinen Hafen. |
| L13-phrases-city-sequence-5 | L13-R016 | L13-R016 | 5 | 3 | phrase_order | เมืองนี้ไม่มีย่านเมืองเก่า<br>A: Gibt es eine Altstadt?<br>B: | Es gibt keine Altstadt. |
| L13-phrases-favorite-sequence-1 | L13-R018 | L13-R018, L13-R017 | 1 | 1 | phrase_context | A: Was ist Ihr Lieblingsort?<br>B: ___ | Mein Lieblingsort ist der Park. |
| L13-phrases-favorite-sequence-2 | L13-R019 | L13-R019 | 2 | 1 | phrase_context | A: Warum sind Sie gern in der Natur?<br>B: ___ | Ich liebe die Natur. |
| L13-phrases-favorite-sequence-3 | L13-R020 | L13-R020 | 3 | 2 | phrase_match | Kann man dort spazieren gehen? | Dort kann man spazieren gehen. |
| L13-phrases-favorite-sequence-4 | L13-R021 | L13-R021 | 4 | 2 | phrase_match | Kann man dort auch angeln? | Dort kann man auch angeln. |
| L13-phrases-favorite-sequence-5 | L13-R022 | L13-R022 | 5 | 3 | phrase_order | พวกเราไปพบเพื่อนที่นั่น<br>A: Was macht ihr dort zusammen?<br>B: | Dort treffen wir Freunde. |
| L13-phrases-opinions-sequence-1 | L13-R024 | L13-R024, L13-R005 | 1 | 1 | phrase_context | A: ___<br>B: Ich finde Berlin interessant. | Wie finden Sie Berlin? |
| L13-phrases-opinions-sequence-2 | L13-R025 | L13-R025 | 2 | 1 | phrase_context | A: ___<br>B: Ja, ich möchte Berlin besuchen. | Möchten Sie Berlin besuchen? |
| L13-phrases-opinions-sequence-3 | L13-R028 | L13-R028 | 3 | 2 | phrase_match | Das Café am See gefällt mir besonders gut. | Was gefällt Ihnen besonders? |
| L13-phrases-opinions-sequence-4 | L13-R029 | L13-R029 | 4 | 2 | phrase_match | Ein Fußballplatz fehlt mir. | Was fehlt Ihnen? |
| L13-phrases-opinions-sequence-5 | L13-R026 | L13-R026, L13-R024 | 5 | 3 | phrase_order | คุณคิดว่าเบอร์ลินน่าสนใจมาก<br>A: Wie finden Sie Berlin?<br>B: | Ich glaube, Berlin ist sehr interessant. |
| L13-R001-context | L13-R001 | L13-R001 | undefined | 1 | phrase_context | คุณอยากบอกว่าชอบเบอร์ลิน โดยยังไม่เน้นว่าชอบมาก — ___ | Berlin gefällt mir. |
| L13-R001-completion | L13-R001 | L13-R001 | undefined | 1 | phrase_completion | Berlin ___ mir. | gefällt |
| L13-R001-order | L13-R001 | L13-R001 | undefined | 2 | phrase_order | undefined | Berlin gefällt mir. |
| L13-R002-context | L13-R002 | L13-R002 | undefined | 1 | phrase_context | คุณชอบเบอร์ลินมาก และต้องการเน้นระดับความชอบ — ___ | Berlin gefällt mir sehr. |
| L13-R002-completion | L13-R002 | L13-R002 | undefined | 1 | phrase_completion | Berlin gefällt mir ___. | sehr |
| L13-R002-order | L13-R002 | L13-R002 | undefined | 2 | phrase_order | undefined | Berlin gefällt mir sehr. |
| L13-R003-context | L13-R003 | L13-R003 | undefined | 1 | phrase_context | คุณกำลังชี้สิ่งหนึ่งและบอกว่าชอบสิ่งนั้นเป็นพิเศษ — ___ | Das gefällt mir besonders gut. |
| L13-R003-completion | L13-R003 | L13-R003 | undefined | 1 | phrase_completion | Das gefällt mir ___ gut. | besonders |
| L13-R003-order | L13-R003 | L13-R003 | undefined | 2 | phrase_order | undefined | Das gefällt mir besonders gut. |
| L13-R004-context | L13-R004 | L13-R004 | undefined | 1 | phrase_context | คุณอยากชมว่าเมืองนี้ยอดเยี่ยม โดยใช้ ich finde — ___ | Ich finde die Stadt toll. |
| L13-R004-completion | L13-R004 | L13-R004 | undefined | 1 | phrase_completion | Ich ___ die Stadt toll. | finde |
| L13-R004-order | L13-R004 | L13-R004 | undefined | 2 | phrase_order | undefined | Ich finde die Stadt toll. |
| L13-R005-context | L13-R005 | L13-R005 | undefined | 1 | phrase_context | คุณอยากบอกว่าเบอร์ลินน่าสนใจ โดยใช้ ich finde — ___ | Ich finde Berlin interessant. |
| L13-R005-completion | L13-R005 | L13-R005 | undefined | 1 | phrase_completion | Ich finde Berlin ___. | interessant |
| L13-R005-order | L13-R005 | L13-R005 | undefined | 2 | phrase_order | undefined | Ich finde Berlin interessant. |
| L13-R006-context | L13-R006 | L13-R006 | undefined | 1 | phrase_context | คุณอยากบอกว่าเมืองนี้แตกต่างจริง ๆ โดยไม่ได้บอกว่าใหญ่หรือเล็ก — ___ | Die Stadt ist einfach anders. |
| L13-R006-completion | L13-R006 | L13-R006 | undefined | 1 | phrase_completion | Die Stadt ist einfach ___. | anders |
| L13-R006-order | L13-R006 | L13-R006 | undefined | 2 | phrase_order | undefined | Die Stadt ist einfach anders. |
| L13-R007-context | L13-R007 | L13-R007 | undefined | 1 | phrase_context | คุณรู้สึกว่าเมืองนี้ใหญ่เกินไป โดยเริ่มพูดถึง die Stadt — ___ | Die Stadt ist zu groß. |
| L13-R007-completion | L13-R007 | L13-R007 | undefined | 1 | phrase_completion | Die Stadt ist ___ groß. | zu |
| L13-R007-order | L13-R007 | L13-R007 | undefined | 2 | phrase_order | undefined | Die Stadt ist zu groß. |
| L13-R008-context | L13-R008 | L13-R008 | undefined | 1 | phrase_context | เพื่อนบอกข่าวดี คุณตอบรับด้วยคำว่า super — ___ | Das ist super! |
| L13-R008-completion | L13-R008 | L13-R008 | undefined | 1 | phrase_completion | Das ist ___! | super |
| L13-R008-order | L13-R008 | L13-R008 | undefined | 2 | phrase_order | undefined | Das ist super! |
| L13-R009-context | L13-R009 | L13-R009 | undefined | 1 | phrase_context | เพื่อนเล่าเรื่องน่าตื่นเต้น คุณตอบรับด้วยคำว่า cool — ___ | Das ist cool! |
| L13-R009-completion | L13-R009 | L13-R009 | undefined | 1 | phrase_completion | Das ist ___! | cool |
| L13-R009-order | L13-R009 | L13-R009 | undefined | 2 | phrase_order | undefined | Das ist cool! |
| L13-R010-context | L13-R010 | L13-R010 | undefined | 1 | phrase_context | คุณต้องการถามว่าที่นี่มีอะไรบ้าง — ___ | Was gibt es hier? |
| L13-R010-completion | L13-R010 | L13-R010 | undefined | 1 | phrase_completion | Was ___ es hier? | gibt |
| L13-R010-order | L13-R010 | L13-R010 | undefined | 2 | phrase_order | undefined | Was gibt es hier? |
| L13-R011-context | L13-R011 | L13-R011 | undefined | 1 | phrase_context | คุณต้องการบอกว่าที่นี่มีสวนสาธารณะ — ___ | Hier gibt es einen Park. |
| L13-R011-completion | L13-R011 | L13-R011 | undefined | 1 | phrase_completion | Hier gibt es ___ Park. | einen |
| L13-R011-order | L13-R011 | L13-R011 | undefined | 2 | phrase_order | undefined | Hier gibt es einen Park. |
| L13-R012-context | L13-R012 | L13-R012 | undefined | 1 | phrase_context | คุณต้องการบอกว่ามีโบสถ์หลายแห่ง — ___ | Es gibt viele Kirchen. |
| L13-R012-completion | L13-R012 | L13-R012 | undefined | 1 | phrase_completion | Es gibt ___ Kirchen. | viele |
| L13-R012-order | L13-R012 | L13-R012 | undefined | 2 | phrase_order | undefined | Es gibt viele Kirchen. |
| L13-R013-context | L13-R013 | L13-R013 | undefined | 1 | phrase_context | คุณกำลังเพิ่มข้อมูลว่ามีคาเฟ่ด้วย — ___ | Es gibt auch ein Café. |
| L13-R013-completion | L13-R013 | L13-R013 | undefined | 1 | phrase_completion | Es gibt ___ ein Café. | auch |
| L13-R013-order | L13-R013 | L13-R013 | undefined | 2 | phrase_order | undefined | Es gibt auch ein Café. |
| L13-R014-context | L13-R014 | L13-R014 | undefined | 1 | phrase_context | คุณต้องการบอกว่าบริเวณใกล้เคียงมีทะเลสาบด้วย — ___ | In der Nähe gibt es auch einen See. |
| L13-R014-completion | L13-R014 | L13-R014 | undefined | 1 | phrase_completion | In der ___ gibt es auch einen See. | Nähe |
| L13-R014-order | L13-R014 | L13-R014 | undefined | 2 | phrase_order | undefined | In der Nähe gibt es auch einen See. |
| L13-R015-context | L13-R015 | L13-R015 | undefined | 1 | phrase_context | คุณเสียดายที่ไม่มีท่าเรือ — ___ | Leider gibt es keinen Hafen. |
| L13-R015-completion | L13-R015 | L13-R015 | undefined | 1 | phrase_completion | Leider gibt es ___ Hafen. | keinen |
| L13-R015-order | L13-R015 | L13-R015 | undefined | 2 | phrase_order | undefined | Leider gibt es keinen Hafen. |
| L13-R016-context | L13-R016 | L13-R016 | undefined | 1 | phrase_context | คุณต้องการบอกว่าไม่มีย่านเมืองเก่า โดยไม่เพิ่มความรู้สึกเสียดาย — ___ | Es gibt keine Altstadt. |
| L13-R016-completion | L13-R016 | L13-R016 | undefined | 1 | phrase_completion | Es gibt ___ Altstadt. | keine |
| L13-R016-order | L13-R016 | L13-R016 | undefined | 2 | phrase_order | undefined | Es gibt keine Altstadt. |
| L13-R017-context | L13-R017 | L13-R017 | undefined | 1 | phrase_context | คุณถามคู่สนทนาอย่างสุภาพว่าสถานที่โปรดคือที่ไหน — ___ | Was ist Ihr Lieblingsort? |
| L13-R017-completion | L13-R017 | L13-R017 | undefined | 1 | phrase_completion | Was ist ___ Lieblingsort? | Ihr |
| L13-R017-order | L13-R017 | L13-R017 | undefined | 2 | phrase_order | undefined | Was ist Ihr Lieblingsort? |
| L13-R018-context | L13-R018 | L13-R018 | undefined | 1 | phrase_context | คุณบอกว่าสถานที่โปรดของคุณคือสวนสาธารณะ — ___ | Mein Lieblingsort ist der Park. |
| L13-R018-completion | L13-R018 | L13-R018 | undefined | 1 | phrase_completion | ___ Lieblingsort ist der Park. | Mein |
| L13-R018-order | L13-R018 | L13-R018 | undefined | 2 | phrase_order | undefined | Mein Lieblingsort ist der Park. |
| L13-R019-context | L13-R019 | L13-R019 | undefined | 1 | phrase_context | คุณบอกว่ารักธรรมชาติ — ___ | Ich liebe die Natur. |
| L13-R019-completion | L13-R019 | L13-R019 | undefined | 1 | phrase_completion | Ich ___ die Natur. | liebe |
| L13-R019-order | L13-R019 | L13-R019 | undefined | 2 | phrase_order | undefined | Ich liebe die Natur. |
| L13-R020-context | L13-R020 | L13-R020 | undefined | 1 | phrase_context | คุณบอกว่าสามารถเดินเล่นที่นั่นได้ — ___ | Dort kann man spazieren gehen. |
| L13-R020-completion | L13-R020 | L13-R020 | undefined | 1 | phrase_completion | Dort kann man ___ gehen. | spazieren |
| L13-R020-order | L13-R020 | L13-R020 | undefined | 2 | phrase_order | undefined | Dort kann man spazieren gehen. |
| L13-R021-context | L13-R021 | L13-R021 | undefined | 1 | phrase_context | คุณเพิ่มข้อมูลว่าสามารถตกปลาที่นั่นได้ด้วย — ___ | Dort kann man auch angeln. |
| L13-R021-completion | L13-R021 | L13-R021 | undefined | 1 | phrase_completion | Dort kann man auch ___. | angeln |
| L13-R021-order | L13-R021 | L13-R021 | undefined | 2 | phrase_order | undefined | Dort kann man auch angeln. |
| L13-R022-context | L13-R022 | L13-R022 | undefined | 1 | phrase_context | คุณบอกว่าพวกเราพบเพื่อนที่นั่น — ___ | Dort treffen wir Freunde. |
| L13-R022-completion | L13-R022 | L13-R022 | undefined | 1 | phrase_completion | Dort ___ wir Freunde. | treffen |
| L13-R022-order | L13-R022 | L13-R022 | undefined | 2 | phrase_order | undefined | Dort treffen wir Freunde. |
| L13-R023-context | L13-R023 | L13-R023 | undefined | 1 | phrase_context | คุณเสียดายที่ไม่มีสนามฟุตบอล — ___ | Leider gibt es keinen Fußballplatz. |
| L13-R023-completion | L13-R023 | L13-R023 | undefined | 1 | phrase_completion | Leider gibt es ___ Fußballplatz. | keinen |
| L13-R023-order | L13-R023 | L13-R023 | undefined | 2 | phrase_order | undefined | Leider gibt es keinen Fußballplatz. |
| L13-R024-context | L13-R024 | L13-R024 | undefined | 1 | phrase_context | คุณถามความเห็นของคู่สนทนาอย่างสุภาพเกี่ยวกับเบอร์ลิน — ___ | Wie finden Sie Berlin? |
| L13-R024-completion | L13-R024 | L13-R024 | undefined | 1 | phrase_completion | Wie ___ Sie Berlin? | finden |
| L13-R024-order | L13-R024 | L13-R024 | undefined | 2 | phrase_order | undefined | Wie finden Sie Berlin? |
| L13-R025-context | L13-R025 | L13-R025 | undefined | 1 | phrase_context | คุณถามอย่างสุภาพว่าอยากไปเที่ยวเบอร์ลินไหม — ___ | Möchten Sie Berlin besuchen? |
| L13-R025-completion | L13-R025 | L13-R025 | undefined | 1 | phrase_completion | Möchten Sie Berlin ___? | besuchen |
| L13-R025-order | L13-R025 | L13-R025 | undefined | 2 | phrase_order | undefined | Möchten Sie Berlin besuchen? |
| L13-R026-context | L13-R026 | L13-R026 | undefined | 1 | phrase_context | คุณคิดว่าเบอร์ลินน่าสนใจมาก และต้องการเริ่มด้วย ich glaube — ___ | Ich glaube, Berlin ist sehr interessant. |
| L13-R026-completion | L13-R026 | L13-R026 | undefined | 1 | phrase_completion | Ich ___, Berlin ist sehr interessant. | glaube |
| L13-R026-order | L13-R026 | L13-R026 | undefined | 2 | phrase_order | undefined | Ich glaube, Berlin ist sehr interessant. |
| L13-R027-context | L13-R027 | L13-R027 | undefined | 1 | phrase_context | คุณอยากบอกความเห็นว่าเมืองนี้ใหญ่เกินไป โดยใช้ ich finde — ___ | Ich finde die Stadt zu groß. |
| L13-R027-completion | L13-R027 | L13-R027 | undefined | 1 | phrase_completion | Ich finde die Stadt zu ___. | groß |
| L13-R027-order | L13-R027 | L13-R027 | undefined | 2 | phrase_order | undefined | Ich finde die Stadt zu groß. |
| L13-R028-context | L13-R028 | L13-R028 | undefined | 1 | phrase_context | คุณถามคู่สนทนาอย่างสุภาพว่าชอบอะไรเป็นพิเศษ — ___ | Was gefällt Ihnen besonders? |
| L13-R028-completion | L13-R028 | L13-R028 | undefined | 1 | phrase_completion | Was gefällt ___ besonders? | Ihnen |
| L13-R028-order | L13-R028 | L13-R028 | undefined | 2 | phrase_order | undefined | Was gefällt Ihnen besonders? |
| L13-R029-context | L13-R029 | L13-R029 | undefined | 1 | phrase_context | คุณถามอย่างสุภาพว่าคู่สนทนารู้สึกว่าขาดอะไร — ___ | Was fehlt Ihnen? |
| L13-R029-completion | L13-R029 | L13-R029 | undefined | 1 | phrase_completion | Was ___ Ihnen? | fehlt |
| L13-R029-order | L13-R029 | L13-R029 | undefined | 2 | phrase_order | undefined | Was fehlt Ihnen? |
| L13-R010-dialogue | L13-R010 | L13-R010, L13-R011 | undefined | 2 | phrase_dialogue | undefined | Was gibt es hier? Hier gibt es einen Park. |
| L13-R017-dialogue | L13-R017 | L13-R017, L13-R018 | undefined | 2 | phrase_dialogue | undefined | Was ist Ihr Lieblingsort? Mein Lieblingsort ist der Park. |
| L13-R024-dialogue | L13-R024 | L13-R024, L13-R026 | undefined | 2 | phrase_dialogue | undefined | Wie finden Sie Berlin? Ich glaube, Berlin ist sehr interessant. |
| L13-R004-comprehension | L13-R004 | L13-R004, L13-R005, L13-R006 | undefined | 2 | phrase_comprehension | Ich finde die Stadt toll. Ich finde Berlin interessant. Die Stadt ist einfach anders. | ฉันคิดว่าเมืองนี้ยอดเยี่ยม |
| L13-R013-comprehension | L13-R013 | L13-R013, L13-R014, L13-R015 | undefined | 2 | phrase_comprehension | Es gibt auch ein Café. In der Nähe gibt es auch einen See. Leider gibt es keinen Hafen. | มีคาเฟ่ด้วย |
| L13-R020-comprehension | L13-R020 | L13-R020, L13-R021, L13-R022 | undefined | 2 | phrase_comprehension | Dort kann man spazieren gehen. Dort kann man auch angeln. Dort treffen wir Freunde. | ที่นั่นสามารถเดินเล่นได้ |
| L13-R027-comprehension | L13-R027 | L13-R027, L13-R028, L13-R029 | undefined | 2 | phrase_comprehension | Ich finde die Stadt zu groß. Was gefällt Ihnen besonders? Was fehlt Ihnen? | ฉันคิดว่าเมืองนี้ใหญ่เกินไป |
