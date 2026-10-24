# A1.3: ข้อมูลวิเคราะห์แบบฝึกหัด Lektion 13–14

ปรับข้อมูลตามโปรเจกต์ `deutsch-trainer-next` วันที่ 20 ตุลาคม 2026 เอกสารนี้เป็นทะเบียนวิเคราะห์ภายในสำหรับออกแบบโจทย์และตรวจย้อนกลับ ไม่ใช่คลังโจทย์ที่เว็บอ่านโดยตรง และไม่ใช่ข้อความที่แสดงแก่ผู้เรียน

> ไฟล์นี้เป็นสำเนาอ่านสะดวกของข้อมูลใน repository. เมื่อข้อมูลขัดกัน ให้ใช้ `docs/exercise-mapping/*-source-items.json`, `*-provenance.json`, `*-bank.json`, `docs/exercise-mapping/a13-coursebook-activity-audit.json`, `src/lib/source-catalog.ts` และ `docs/PRODUCT_BASELINE.md` ใน repository เป็นหลัก

## ขอบเขตและสถานะ

- ระดับในแอปคือ A1.3 สำหรับ Lektion 13–18 ส่วนหนังสือ Momente เล่มที่ใช้กับบท 13–14 ลงทะเบียนชื่อ A1.2 Kursbuch และ Arbeitsbuch ชื่อเล่มกับระดับในแอปเป็นคนละข้อมูล
- Momente Kursbuch หน้า 9–12 ใช้กำหนดขอบเขต L13 และหน้า 13–16 ใช้กำหนดขอบเขต L14. หน้า PDF และหน้าพิมพ์ของช่วงนี้ตรงกันตามทะเบียนที่ตรวจแล้ว. หนังสือเล่มอื่นต้องบันทึกเลขหน้าพิมพ์และ PDF แยกสำหรับหลักฐานแต่ละรายการ ไม่ใช้สูตรเลื่อนหน้าทั้งเล่ม
- L13 มีชุดทดลอง Es gibt + Akkusativ, Personalpronomen im Dativ และ Verben หัวข้อละ 15 ข้อ รวม 45 ข้อ. L14 มี Lokale Präpositionen และ Wo? + Dativ หัวข้อละ 5 ข้อ รวม 10 ข้อ
- ชุดทดลองเปิดเฉพาะบัญชี tester ใน `dev:test`. ข้อที่ทำเก็บใน browser storage แยกบัญชีและชุด ไม่บันทึกเป็น Learning History หรือ Progress หลัก. คลังมีสถานะ `review_prototype_not_published` และยังไม่มีครูอิสระตรวจเฉลย
- โจทย์เว็บทั้งหมดเขียนใหม่. ข้อมูลหนังสืออยู่ใน metadata ภายใน ไม่แสดงชื่อเล่ม หน้า ข้อ หรือ provenance ในหน้าโจทย์

## หัวข้อที่ฝึกและขอบเขต

| บท | หัวข้อในระบบ | สิ่งที่วัด | แหล่งกำหนดขอบเขต | ข้อจำกัด |
|---|---|---|---|---|
| L13 | Es gibt + Akkusativ | เลือกและสร้างรูป Artikel, รูปปฏิเสธ และพหูพจน์ รวมถึงลำดับ `gibt es` | Kursbuch หน้า 11 ข้อ 4 | Das Training บท 28 เป็นหลักฐานกฎ Akkusativ บางส่วน ไม่ใช่โจทย์ `es gibt` โดยตรง |
| L13 | Personalpronomen im Dativ | เลือกและพิมพ์ `mir, dir, ihm, ihr, uns, euch, ihnen, Ihnen` จากผู้ถูกอ้างถึงในประโยค | Kursbuch หน้า 11 ข้อ 5a และ Arbeitsbuch L13 | การเลือกคำยังไม่พิสูจน์ว่าพิมพ์รูปคำเองได้ |
| L13 | Verben | ผัน Präsens ของ `gefallen, gehören, helfen, danken` และทบทวน `finden, besuchen`; วางคำในประโยค | Kursbuch หน้า 11 ข้อ 5a และหน้า 12 Schnelltest G รวม Arbeitsbuch | การผันกริยาถูกไม่พิสูจน์ว่าเลือก Dativpronomen ถูก |
| L14 | Lokale Präpositionen | เลือกคำบอกตำแหน่ง Wo? จากบริบท | Kursbuch หน้า 14 ข้อ 4a | อย่ารวม Wo?/Wohin? กับ Akkusativ เต็มระบบ |
| L14 | Wo? + Dativ | เลือก Artikel หลังคำบุพบทตำแหน่ง; เนื้อหาเรียนรวมรูปย่อ `im/am` | Kursbuch หน้า 15 ข้อ 4b | ชุดโจทย์ปัจจุบันยังมีเพียง 5 ข้อและยังไม่วัดทุกบริบทของรูปย่อ |

ทักษะการอ่าน ฟัง เขียน และสำนวนในหนังสือมีความเกี่ยวข้องกับบท 13–14 แต่ชุดโจทย์ Grammar pilot ข้างบนไม่ได้วัดทักษะเหล่านั้นโดยตรง. อย่าแปลงผลตอบแบบเลือกคำเป็นคะแนนการเขียนหรือความชำนาญทั้งหมด

## แผนที่หนังสือเสริมที่ตรวจในโปรเจกต์

| บท | หนังสือและตำแหน่ง | ความเกี่ยวข้องและการคัด |
|---|---|---|
| L13 | Grammatik A1 – das Training บท 28 หน้า 51; บท 32 หน้า 57 | บท 28 ใช้ทบทวน Akkusativ บางส่วน; บท 32 มี Dativpronomen และกริยาที่เกี่ยวข้อง แต่ข้อ 1 ผสมหลาย Case ต้องตรวจรายช่อง |
| L13 | Grammatik aktiv บท 21 หน้า 54, บท 23 หน้า 58–59 | บท 21 ข้อ 3 มีกรรม Akkusativ และ Dativ ร่วมกันทุกข้อ; บท 23 ระบุระดับ A2 ต้องคัดกริยาและลดภาระ Dativartikel จึงเป็นแนวกลไกบางส่วน |
| L14 | Grammatik A1 – das Training บท 34 หน้า 59; บท 36 หน้า 61; บท 37 หน้า 63 | บท 34 เป็นกฎ Case; บท 36 ผสมตำแหน่ง ทิศทาง และ modal; บท 37 ใช้เฉพาะฝั่ง Wo? หากตรวจรายข้อผ่าน |
| L14 | Grammatik aktiv บท 35 หน้า 86–87; บท 36 หน้า 88–89 | บท 35 เกี่ยวกับ Wo? + Dativ; บท 36 ระบุ A2 และผสม Wo?/Wohin? จึงพักไว้จากชุดหลัก L14 |
| L14 | Schreiben A1 – das Training บท 10 หน้า 40/PDF 36 ข้อ 1b | ใช้เป็นแนวการเรียงส่วนประโยคเพื่ออธิบายเส้นทางในหมวดเขียนหรือสำนวน ไม่ใช่หลักฐานโจทย์ Case ของ Grammar pilot |

ไฟล์ Grammatik aktiv ไม่อยู่ใน workspace รอบขยาย Es gibt และ Verben วันที่ 20 ตุลาคม 2026. รายการจากเล่มนั้นข้างบนอาศัยทะเบียนหลักฐานเดิมและการตรวจ Dativ ก่อนหน้า ไม่ยืนยันกิจกรรมอื่นเพิ่ม. Das Training บท 32 หน้า 57/PDF 57 เป็นคู่หน้าที่ตรวจตรงกัน แต่ไม่อนุมานว่าทุกหน้าของทั้งเล่มตรงกัน. Grammatik aktiv หน้า 58/PDF 54 และหน้า 86/PDF 82 เป็นคู่หน้าที่ตรวจแล้ว ไม่ใช้สูตร `PDF + 4` กับหน้าที่ไม่ได้ตรวจ

## กิจกรรม Momente L14 และระดับหลักฐาน

ตารางนี้บอกกิจกรรมที่มีทะเบียนในโปรเจกต์. สถานะ `visual_verified` หมายถึงตรวจรูปแบบกิจกรรมจากภาพหน้าแล้ว ไม่ใช่การตรวจเฉลยสำนักพิมพ์

| Evidence ID | หน้า/ข้อ | กลไกเดิม | สถานะ | เงื่อนไขใช้บนเว็บ |
|---|---|---|---|---|
| `A13-KB-L14-3a` | 14/3a | `listen_trace_route` | `visual_verified` | original audio is unavailable for web reuse; author and record new audio |
| `A13-KB-L14-4a` | 14/4a | `match_position_to_preposition` | `visual_verified` | เขียนข้อความโจทย์และเฉลยใหม่; คัดตามขอบเขตบท |
| `A13-KB-L14-4b` | 15/4b | `extract_article_rule` | `visual_verified` | เขียนข้อความโจทย์และเฉลยใหม่; คัดตามขอบเขตบท |
| `A13-KB-L14-5a` | 15/5a | `read_map_complete_place_names` | `visual_verified` | เขียนข้อความโจทย์และเฉลยใหม่; คัดตามขอบเขตบท |
| `A13-KB-L14-6` | 16/6a | `classify_direction_phrases` | `visual_verified` | เขียนข้อความโจทย์และเฉลยใหม่; คัดตามขอบเขตบท |
| `A13-KB-L14-6b` | 16/6b | `partner_route_roleplay` | `visual_verified` | งานสนทนาคู่; ต้องตรวจหน้าคู่ 83/101 และสร้างสถานการณ์ใหม่ |

Kursbuch L14 ข้อ 6a หน้า 16 เป็นการจัดสำนวนตามหน้าที่สื่อสาร ส่วน 6b เป็นการถามและบอกทางเป็นคู่. ข้อ 4a หน้า 14 วัดคำบุพบทตำแหน่ง และข้อ 4b หน้า 15 วัด Wo? + Dativ. กิจกรรมแผนที่หรือเสียงต้องใช้ภาพและเสียงที่สร้างใหม่เมื่อทำเป็นโจทย์เว็บ

กิจกรรมหน้า 13 ข้อ 1–2, หน้า 14 ข้อ 3b, หน้า 15 ข้อ 5b และ Schnelltest หน้า 16 ที่ร่างเดิมแจกแจงไว้ยังไม่มีรายการตรวจรายข้อในทะเบียน A1.3 ชุดนี้ จึงเป็นคิวตรวจต่อ ไม่ใช้คำอธิบายรูปแบบในร่างเดิมเป็นหลักฐานว่าเปิดโจทย์ได้แล้ว

## ทะเบียนกิจกรรมต้นทาง L13 ที่ตรวจในโปรเจกต์

รายการต่อไปนี้รวมกิจกรรม ตาราง ช่องคำตอบ และตัวอย่างที่มีเฉลยอยู่แล้ว. สถานะ `in_scope` หมายถึงเนื้อหาหรือกลไกตรงขอบเขต ไม่ได้อนุญาตให้คัดข้อความโจทย์หรือถือว่าทุกช่องพร้อมเผยแพร่. เหตุผลและตำแหน่งช่องฉบับเต็มอยู่ใน JSON ต้นทาง

| กลุ่ม | ID | หนังสือ | หน้าพิมพ์/PDF | ข้อ | กลไก | ผลคัด | เงื่อนไขสำคัญ |
|---|---|---|---|---|---|---|---|
| Dativ | `GT32-1-1` | Grammatik A1 – das Training | 57/57 | 32/1/1 | `dialogue_cloze` | `review_only` | บทสนทนาทักทาย ใช้ es geht และมุมมองผู้พูด ไม่ใช่กริยาเป้าหมายใหม่ของ L13 ช่อง: review 3, worked_example 1 |
| Dativ | `GT32-1-2` | Grammatik A1 – das Training | 57/57 | 32/1/2 | `dialogue_cloze` | `mechanic_only` | มี vorstellen ซึ่งใช้กรรมสองตัว และ von + Dativ จึงใช้แนวเติมบทสนทนาเท่านั้น ช่อง: outside_target 2 |
| Dativ | `GT32-1-3` | Grammatik A1 – das Training | 57/57 | 32/1/3 | `dialogue_cloze` | `partial` | สองช่องแรกใช้ gehören กับผู้ฟังหลายคนและผู้ตอบหลายคน สองช่องหลังเป็น Nominativ ช่อง: in_scope 2, outside_target 2 |
| Dativ | `GT32-1-4` | Grammatik A1 – das Training | 57/57 | 32/1/4 | `dialogue_cloze` | `mechanic_only` | มี Sie ทั้ง Nominativ/Akkusativ และ Dativ หลัง mit/zu ไม่ใช่การเลือก Dativ หลังสี่กริยาของ L13 ช่อง: outside_target 4 |
| Dativ | `GT32-1-5` | Grammatik A1 – das Training | 57/57 | 32/1/5 | `dialogue_cloze` | `mechanic_only` | มี Akkusativ หลัง sehen และ Dativ หลัง mit รวมทั้ง Perfekt ต้องตรวจ prerequisite ก่อนนำบริบทมาใช้ ช่อง: outside_target 2 |
| Dativ | `GT32-1-6` | Grammatik A1 – das Training | 57/57 | 32/1/6 | `dialogue_cloze` | `mechanic_only` | สลับบุคคลและ Case ในบทสนทนางาน ใช้ mit/von และ Modalverben หลายตัว ช่อง: outside_target 6 |
| Dativ | `GA21-3-1` | Grammatik aktiv A1–B1 | 54/50 | 21/3/1 | `pronoun_replacement_cloze` | `mechanic_only` | ทุกข้อมีกรรม Akkusativ และผู้รับ Dativ ร่วมกัน ใช้แนวแทนกลุ่มคำนามด้วยสรรพนาม แต่เปลี่ยนเป็น gefallen/gehören/helfen/danken ในโจทย์เว็บ |
| Dativ | `GA21-3-2` | Grammatik aktiv A1–B1 | 54/50 | 21/3/2 | `pronoun_replacement_cloze` | `mechanic_only` | ทุกข้อมีกรรม Akkusativ และผู้รับ Dativ ร่วมกัน ใช้แนวแทนกลุ่มคำนามด้วยสรรพนาม แต่เปลี่ยนเป็น gefallen/gehören/helfen/danken ในโจทย์เว็บ |
| Dativ | `GA21-3-3` | Grammatik aktiv A1–B1 | 54/50 | 21/3/3 | `pronoun_replacement_cloze` | `mechanic_only` | ทุกข้อมีกรรม Akkusativ และผู้รับ Dativ ร่วมกัน ใช้แนวแทนกลุ่มคำนามด้วยสรรพนาม แต่เปลี่ยนเป็น gefallen/gehören/helfen/danken ในโจทย์เว็บ |
| Dativ | `GA21-3-4` | Grammatik aktiv A1–B1 | 54/50 | 21/3/4 | `pronoun_replacement_cloze` | `mechanic_only` | ทุกข้อมีกรรม Akkusativ และผู้รับ Dativ ร่วมกัน ใช้แนวแทนกลุ่มคำนามด้วยสรรพนาม แต่เปลี่ยนเป็น gefallen/gehören/helfen/danken ในโจทย์เว็บ |
| Dativ | `GA21-3-5` | Grammatik aktiv A1–B1 | 54/50 | 21/3/5 | `pronoun_replacement_cloze` | `mechanic_only` | ทุกข้อมีกรรม Akkusativ และผู้รับ Dativ ร่วมกัน ใช้แนวแทนกลุ่มคำนามด้วยสรรพนาม แต่เปลี่ยนเป็น gefallen/gehören/helfen/danken ในโจทย์เว็บ |
| Dativ | `GA21-3-6` | Grammatik aktiv A1–B1 | 54/50 | 21/3/6 | `pronoun_replacement_cloze` | `mechanic_only` | ทุกข้อมีกรรม Akkusativ และผู้รับ Dativ ร่วมกัน ใช้แนวแทนกลุ่มคำนามด้วยสรรพนาม แต่เปลี่ยนเป็น gefallen/gehören/helfen/danken ในโจทย์เว็บ |
| Dativ | `GA21-4-1` | Grammatik aktiv A1–B1 | 55/51 | 21/4/1 | `write_short_answer` | `review_only` | ฝึกตอบเรื่องสุขภาพด้วย es geht และเปลี่ยนมุมมองผู้พูด เหมาะเป็นทบทวนรูปสรรพนาม ไม่ใช่หลักฐานการใช้กริยาใหม่ L13 |
| Dativ | `GA21-4-2` | Grammatik aktiv A1–B1 | 55/51 | 21/4/2 | `write_short_answer` | `review_only` | ฝึกตอบเรื่องสุขภาพด้วย es geht และเปลี่ยนมุมมองผู้พูด เหมาะเป็นทบทวนรูปสรรพนาม ไม่ใช่หลักฐานการใช้กริยาใหม่ L13 |
| Dativ | `GA21-4-3` | Grammatik aktiv A1–B1 | 55/51 | 21/4/3 | `write_short_answer` | `review_only` | ฝึกตอบเรื่องสุขภาพด้วย es geht และเปลี่ยนมุมมองผู้พูด เหมาะเป็นทบทวนรูปสรรพนาม ไม่ใช่หลักฐานการใช้กริยาใหม่ L13 |
| Dativ | `GA21-4-4` | Grammatik aktiv A1–B1 | 55/51 | 21/4/4 | `write_short_answer` | `review_only` | ฝึกตอบเรื่องสุขภาพด้วย es geht และเปลี่ยนมุมมองผู้พูด เหมาะเป็นทบทวนรูปสรรพนาม ไม่ใช่หลักฐานการใช้กริยาใหม่ L13 |
| Dativ | `GA21-4-5` | Grammatik aktiv A1–B1 | 55/51 | 21/4/5 | `write_short_answer` | `review_only` | ฝึกตอบเรื่องสุขภาพด้วย es geht และเปลี่ยนมุมมองผู้พูด เหมาะเป็นทบทวนรูปสรรพนาม ไม่ใช่หลักฐานการใช้กริยาใหม่ L13 |
| Dativ | `GA21-4-6` | Grammatik aktiv A1–B1 | 55/51 | 21/4/6 | `write_short_answer` | `review_only` | ฝึกตอบเรื่องสุขภาพด้วย es geht และเปลี่ยนมุมมองผู้พูด เหมาะเป็นทบทวนรูปสรรพนาม ไม่ใช่หลักฐานการใช้กริยาใหม่ L13 |
| Dativ | `GA23-1-1` | Grammatik aktiv A1–B1 | 58/54 | 23/1/1 | `picture_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยานี้อยู่นอกสี่กริยาเป้าหมายของ pilot |
| Dativ | `GA23-1-2` | Grammatik aktiv A1–B1 | 58/54 | 23/1/2 | `picture_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยานี้อยู่นอกสี่กริยาเป้าหมายของ pilot |
| Dativ | `GA23-1-3` | Grammatik aktiv A1–B1 | 58/54 | 23/1/3 | `picture_cued_sentence_construction` | `mechanic_only` | บทมีป้าย A2; helfen ตรงกริยา L13 แต่ต้นฉบับต้องสร้าง Dativartikel จึงเปลี่ยนเป็นสรรพนามในการออกแบบเว็บ |
| Dativ | `GA23-1-4` | Grammatik aktiv A1–B1 | 58/54 | 23/1/4 | `picture_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยานี้อยู่นอกสี่กริยาเป้าหมายของ pilot |
| Dativ | `GA23-2-1` | Grammatik aktiv A1–B1 | 58/54 | 23/2/1 | `word_cued_sentence_construction` | `mechanic_only` | บทมีป้าย A2; กริยาตรง L13 แต่ต้องผัน Artikel/คำนาม Dativ ใช้เพียงแนวสร้างประโยคโดยเปลี่ยนผู้รับเป็นสรรพนาม |
| Dativ | `GA23-2-2` | Grammatik aktiv A1–B1 | 58/54 | 23/2/2 | `word_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยาและความหมายอยู่นอก pilot นี้ |
| Dativ | `GA23-2-3` | Grammatik aktiv A1–B1 | 58/54 | 23/2/3 | `word_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยาและความหมายอยู่นอก pilot นี้ |
| Dativ | `GA23-2-4` | Grammatik aktiv A1–B1 | 58/54 | 23/2/4 | `word_cued_sentence_construction` | `mechanic_only` | บทมีป้าย A2; กริยาตรง L13 แต่ต้องผัน Artikel/คำนาม Dativ ใช้เพียงแนวสร้างประโยคโดยเปลี่ยนผู้รับเป็นสรรพนาม |
| Dativ | `GA23-2-5` | Grammatik aktiv A1–B1 | 58/54 | 23/2/5 | `word_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยาและความหมายอยู่นอก pilot นี้ |
| Dativ | `GA23-2-6` | Grammatik aktiv A1–B1 | 58/54 | 23/2/6 | `word_cued_sentence_construction` | `mechanic_only` | บทมีป้าย A2; กริยาตรง L13 แต่ต้องผัน Artikel/คำนาม Dativ ใช้เพียงแนวสร้างประโยคโดยเปลี่ยนผู้รับเป็นสรรพนาม |
| Dativ | `GA23-2-7` | Grammatik aktiv A1–B1 | 58/54 | 23/2/7 | `word_cued_sentence_construction` | `exclude_from_pilot` | บทมีป้าย A2; กริยาและความหมายอยู่นอก pilot นี้ |
| Dativ | `KB13-5a-1` | Momente Kursbuch | 11/11 | L13/5a/1 | `reference_arrows` | `in_scope` | กำหนดขอบเขตจาก Kursbuch: ระบุสิ่ง/บุคคลที่สรรพนามอ้างถึงและแยกประธานจาก Dativ |
| Dativ | `KB13-5a-2` | Momente Kursbuch | 11/11 | L13/5a/2 | `reference_arrows` | `in_scope` | กำหนดขอบเขตจาก Kursbuch: ระบุสิ่ง/บุคคลที่สรรพนามอ้างถึงและแยกประธานจาก Dativ |
| Dativ | `KB13-5a-3` | Momente Kursbuch | 11/11 | L13/5a/3 | `reference_arrows` | `in_scope` | กำหนดขอบเขตจาก Kursbuch: ระบุสิ่ง/บุคคลที่สรรพนามอ้างถึงและแยกประธานจาก Dativ |
| Dativ | `KB13-5b` | Momente Kursbuch | 11/11 | L13/5b | `partner_information_exchange` | `partial` | หน้าที่ตรวจบอกให้ทำงานคู่และชี้ไปหน้า 81/100; ตรวจเฉพาะคำสั่งหน้า 11 ยังไม่ตรวจคู่หน้าปลายทาง จึงใช้เป็นหลักฐานขอบเขตเท่านั้น |
| Dativ | `AB13-6-A` | Momente Arbeitsbuch | 8/7 | L13/6/A | `picture_verb_cloze` | `adjacent_skill` | ต้นฉบับให้สรรพนามมาแล้วและให้เติมกริยา จึงวัดรูปกริยา ไม่ใช่การสร้างสรรพนาม Dativ |
| Dativ | `AB13-6-B` | Momente Arbeitsbuch | 8/7 | L13/6/B | `picture_verb_cloze` | `adjacent_skill` | ต้นฉบับให้สรรพนามมาแล้วและให้เติมกริยา จึงวัดรูปกริยา ไม่ใช่การสร้างสรรพนาม Dativ |
| Dativ | `AB13-6-C` | Momente Arbeitsbuch | 8/7 | L13/6/C | `picture_verb_cloze` | `adjacent_skill` | ต้นฉบับให้สรรพนามมาแล้วและให้เติมกริยา จึงวัดรูปกริยา ไม่ใช่การสร้างสรรพนาม Dativ |
| Dativ | `AB13-6-D` | Momente Arbeitsbuch | 8/7 | L13/6/D | `picture_verb_cloze` | `adjacent_skill` | ต้นฉบับให้สรรพนามมาแล้วและให้เติมกริยา จึงวัดรูปกริยา ไม่ใช่การสร้างสรรพนาม Dativ |
| Dativ | `AB13-7a` | Momente Arbeitsbuch | 8/7 | L13/7a | `mark_verbs_and_pronouns` | `in_scope` | กิจกรรมอ่านข้อความแล้วทำเครื่องหมายกริยากับสรรพนาม เหมาะกับ recognition; การพบคำในข้อความไม่ใช่หลักฐานว่าพิมพ์รูปคำเองได้ |
| Dativ | `AB13-7b` | Momente Arbeitsbuch | 8/7 | L13/7b | `derive_pronoun_table` | `in_scope` | ใช้รูปสรรพนามจาก 7a เติมตาราง มีรูปตัวอย่างให้แล้ว เป็นการฝึกแบบมีตัวช่วย ช่อง: in_scope 6, worked_example 3 |
| Dativ | `AB13-8a-1` | Momente Arbeitsbuch | 8/7 | L13/8a/1 | `dialogue_pronoun_cloze` | `in_scope` | แบบฝึกหลักประจำบท ใช้บริบทผู้พูด/กลุ่มคนเลือกสรรพนามหลัง gefallen; เขียนบริบทใหม่สำหรับเว็บ |
| Dativ | `AB13-8a-2` | Momente Arbeitsbuch | 8/7 | L13/8a/2 | `dialogue_pronoun_cloze` | `in_scope` | แบบฝึกหลักประจำบท ใช้บริบทผู้พูด/กลุ่มคนเลือกสรรพนามหลัง gehören; เขียนบริบทใหม่สำหรับเว็บ |
| Dativ | `AB13-8a-3` | Momente Arbeitsbuch | 8/7 | L13/8a/3 | `dialogue_pronoun_cloze` | `in_scope` | แบบฝึกหลักประจำบท ใช้บริบทผู้พูด/กลุ่มคนเลือกสรรพนามหลัง danken; เขียนบริบทใหม่สำหรับเว็บ |
| Dativ | `AB13-8a-4` | Momente Arbeitsbuch | 8/7 | L13/8a/4 | `dialogue_pronoun_cloze` | `in_scope` | แบบฝึกหลักประจำบท ใช้บริบทผู้พูด/กลุ่มคนเลือกสรรพนามหลัง helfen; เขียนบริบทใหม่สำหรับเว็บ |
| Dativ | `AB13-8a-5` | Momente Arbeitsbuch | 8/7 | L13/8a/5 | `dialogue_pronoun_cloze` | `in_scope` | แบบฝึกหลักประจำบท ใช้บริบทผู้พูด/กลุ่มคนเลือกสรรพนามหลัง gefallen; เขียนบริบทใหม่สำหรับเว็บ |
| Es gibt/Verben | `KB13-3C` | Momente Kursbuch | 11/11 | 3c | `spoken_opinion` | `adjacent_skill` | finden with Akkusativ is review, not the new Dativ verb pattern. |
| Es gibt/Verben | `KB13-4` | Momente Kursbuch | 11/11 | 4 | `spoken_place_description` | `in_scope` | Rule box explicitly gives es gibt + Akkusativ across masculine, neuter, feminine and plural. |
| Es gibt/Verben | `KB13-5A` | Momente Kursbuch | 11/11 | 5a | `referent_arrows_and_pronoun_table` | `in_scope` | gefallen, danken, helfen and gehören appear with Dativ pronouns; conjugation itself is not tested in 5a. |
| Es gibt/Verben | `KB13-6A` | Momente Kursbuch | 11/11 | 6a/3 | `guided_notes` | `partial` | The prompt asks what exists at a favorite place; open response is not machine gradable without a rubric. |
| Es gibt/Verben | `KB13-6B` | Momente Kursbuch | 12/12 | 6b | `guided_writing` | `mechanic_only` | Model uses es gibt and evaluation expressions; newly authored web sentences are shorter and constrained. |
| Es gibt/Verben | `KB13-6C` | Momente Kursbuch | 12/12 | 6c | `peer_question` | `mechanic_only` | Question with Gibt es appears as a model; open partner exchange is beyond the pilot. |
| Es gibt/Verben | `KB13-12-GA` | Momente Kursbuch | 12/12 | Schnelltest G/a | `sentence_transformation` | `in_scope` | Transforms finden opinion into gefallen sentence; web tokens are new. |
| Es gibt/Verben | `KB13-12-GB` | Momente Kursbuch | 12/12 | Schnelltest G/b | `sentence_transformation` | `in_scope` | Transforms ownership statement into gehören sentence; web prompts are new. |
| Es gibt/Verben | `KB13-12-GC` | Momente Kursbuch | 12/12 | Schnelltest G/c | `sentence_transformation` | `in_scope` | Transforms a thanks expression into danken sentence; web prompts are new. |
| Es gibt/Verben | `AB13-1` | Momente Arbeitsbuch | 6/5 | 1 | `text_category_cloze` | `partial` | es gibt occurs repeatedly, but exercise tests city vocabulary rather than article case. |
| Es gibt/Verben | `AB13-4A-1` | Momente Arbeitsbuch | 7/6 | 4a/1 | `map_multiple_choice` | `mechanic_only` | Selects negative plural with Bars; pilot has new context without book map. |
| Es gibt/Verben | `AB13-4A-2` | Momente Arbeitsbuch | 7/6 | 4a/2 | `map_multiple_choice` | `mechanic_only` | Selects ein/kein with Rathaus; pilot has new context. |
| Es gibt/Verben | `AB13-4A-3` | Momente Arbeitsbuch | 7/6 | 4a/3 | `map_multiple_choice` | `mechanic_only` | Selects einen/keinen with Park; pilot has new context. |
| Es gibt/Verben | `AB13-4A-4` | Momente Arbeitsbuch | 7/6 | 4a/4 | `map_multiple_choice` | `mechanic_only` | Selects eine/keine with Kirche; pilot has new context. |
| Es gibt/Verben | `AB13-4B` | Momente Arbeitsbuch | 7/6 | 4b | `article_pattern_table` | `in_scope` | Sorts forms by gender, number and positive/negative count. |
| Es gibt/Verben | `AB13-4C-1` | Momente Arbeitsbuch | 7/6 | 4c/example | `text_cloze` | `worked_example` | viele with plural Cafés is prefilled and not scored as a source question. |
| Es gibt/Verben | `AB13-4C-2` | Momente Arbeitsbuch | 7/6 | 4c/2 | `text_cloze` | `in_scope` | Single article or quantity blank before Kirche; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-3` | Momente Arbeitsbuch | 7/6 | 4c/3 | `text_cloze` | `in_scope` | Single article or quantity blank before Markt; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-4` | Momente Arbeitsbuch | 7/6 | 4c/4 | `text_cloze` | `in_scope` | Single article or quantity blank before Brunnen; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-5` | Momente Arbeitsbuch | 7/6 | 4c/5 | `text_cloze` | `in_scope` | Single article or quantity blank before Rathaus; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-6` | Momente Arbeitsbuch | 7/6 | 4c/6 | `text_cloze` | `in_scope` | Single article or quantity blank before Schloss; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-7` | Momente Arbeitsbuch | 7/6 | 4c/7 | `text_cloze` | `in_scope` | Single article or quantity blank before Spielplätze; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-8` | Momente Arbeitsbuch | 7/6 | 4c/8 | `text_cloze` | `in_scope` | Single article or quantity blank before Tierpark; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-9` | Momente Arbeitsbuch | 7/6 | 4c/9 | `text_cloze` | `in_scope` | Single article or quantity blank before See; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-4C-10` | Momente Arbeitsbuch | 7/6 | 4c/10 | `text_cloze` | `in_scope` | Single article or quantity blank before Schwimmbad; web sentence and answer are newly authored. |
| Es gibt/Verben | `AB13-6-A` | Momente Arbeitsbuch | 8/7 | 6/A | `picture_verb_cloze` | `in_scope` | Picture prompt asks for the correct form of gehören; pilot uses a new sentence without reproducing the picture. |
| Es gibt/Verben | `AB13-6-B` | Momente Arbeitsbuch | 8/7 | 6/B | `picture_verb_cloze` | `in_scope` | Picture prompt asks for the correct form of gefallen; pilot uses a new sentence without reproducing the picture. |
| Es gibt/Verben | `AB13-6-C` | Momente Arbeitsbuch | 8/7 | 6/C | `picture_verb_cloze` | `in_scope` | Picture prompt asks for the correct form of danken; pilot uses a new sentence without reproducing the picture. |
| Es gibt/Verben | `AB13-6-D` | Momente Arbeitsbuch | 8/7 | 6/D | `picture_verb_cloze` | `in_scope` | Picture prompt asks for the correct form of helfen; pilot uses a new sentence without reproducing the picture. |
| Es gibt/Verben | `AB13-7A` | Momente Arbeitsbuch | 8/7 | 7a | `verb_and_pronoun_marking` | `review_only` | Recognition of Dativ verbs in a blog, not conjugation production. |
| Es gibt/Verben | `AB13-8B` | Momente Arbeitsbuch | 9/8 | 8b | `sentence_transformation` | `in_scope` | Partner writes a response by changing finden to gefallen; web uses a new city object. |
| Es gibt/Verben | `GT28-CASE` | Grammatik A1 – das Training | 51/51 | 28/rule table | `case_reference` | `prerequisite_only` | Masculine singular Akkusativ -en is a prerequisite, not an es gibt exercise. |
| Es gibt/Verben | `GT28-2` | Grammatik A1 – das Training | 51/51 | 28/2 | `accusative_matching` | `mechanic_only` | Matching verb complements does not directly practice es gibt. |
| Es gibt/Verben | `GT32-RULE` | Grammatik A1 – das Training | 57/57 | 32/rule table | `case_reference` | `prerequisite_only` | Lists Dativ verbs and pronouns; does not test verb conjugation in this table. |

ชุด Dativ ตรวจ 44 รายการ ส่วนชุด Es gibt/Verben ตรวจ 34 รายการ. จำนวนนี้เป็นหน่วยตรวจ ไม่ใช่จำนวนข้อเว็บ และสองทะเบียนอาจอ้างกิจกรรมหนังสือเดียวกันจากคนละมุม. โปรเจกต์ยังไม่ได้เทียบเฉลยสำนักพิมพ์

## โจทย์เว็บที่เขียนใหม่และหลักฐานรายข้อ

แถวต่อไปนี้คือคลังปัจจุบันครบ 55 ข้อสำหรับ L13–L14. ข้อความในคอลัมน์ “ประโยคโจทย์” เป็นข้อความใหม่ของเว็บ. `contentBasis` อ้างหลักฐานขอบเขตเนื้อหา; `exerciseBasis` อ้างแนวกลไก ไม่ได้หมายถึงการนำโจทย์หนังสือมาคัดลอก. คำสั่งเต็ม ตัวเลือก คำใบ้ คำอธิบายและ `knownErrors` อยู่ใน bank JSON ตาม question ID

| บท/หัวข้อ | Question ID | รูปแบบ | ประโยคโจทย์ | เฉลย | Subskill | ระดับ | Content basis | Exercise basis |
|---|---|---|---|---|---|---:|---|---|
| L13-es-gibt-akkusativ | `A13-L13-ESG-001` | `choice` | In meiner Straße gibt es ___ Park. | einen | `es_gibt_article` | 1 | KB13-4 | AB13-4A-3, GT28-CASE |
| L13-es-gibt-akkusativ | `A13-L13-ESG-002` | `choice` | In unserem Viertel gibt es ___ Apotheke. | eine | `es_gibt_article` | 1 | KB13-4 | AB13-4C-2 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-003` | `choice` | In diesem Ort gibt es ___ Rathaus. | ein | `es_gibt_article` | 1 | KB13-4 | AB13-4A-2 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-004` | `choice` | Auf dem Platz gibt es ___ Cafés. | viele | `es_gibt_plural` | 1 | KB13-4 | AB13-4C-1 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-005` | `choice` | Hier gibt es ___ Hafen. Wir fahren deshalb zum Hafen im Nachbarort. | keinen | `es_gibt_negation` | 1 | KB13-4 | AB13-4A-3 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-006` | `cloze` | In unserer Stadt gibt es ___ Zoo. | einen | `es_gibt_article` | 2 | KB13-4 | AB13-4C-3 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-007` | `cloze` | Neben dem Bahnhof gibt es ___ Kino. | ein | `es_gibt_article` | 2 | KB13-4 | GT28-CASE |
| L13-es-gibt-akkusativ | `A13-L13-ESG-008` | `cloze` | Am Marktplatz gibt es ___ Kirche. | eine | `es_gibt_article` | 2 | KB13-4 | AB13-4A-4 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-009` | `cloze` | In diesem Dorf gibt es ___ Museum. Das nächste Museum ist in der Stadt. | kein | `es_gibt_negation` | 2 | KB13-4 | AB13-4C-6 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-010` | `cloze` | Hier gibt es ___ See. Zum Schwimmen fahren wir in den Nachbarort. | keinen | `es_gibt_negation` | 2 | KB13-4 | AB13-4C-9 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-011` | `cloze` | In unserem Ort gibt es ___ Spielplätze. Die Kinder fahren in den Nachbarort. | keine | `es_gibt_negation` | 2 | KB13-4 | AB13-4C-7 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-012` | `cloze` | In der Innenstadt gibt es ___ Geschäfte. | viele | `es_gibt_plural` | 2 | KB13-4 | AB13-4C-1 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-013` | `cloze` | Gibt es hier ___ Bushaltestelle? | eine | `es_gibt_question` | 2 | KB13-6A | AB13-4C-2 |
| L13-es-gibt-akkusativ | `A13-L13-ESG-014` | `order` | เรียงประโยค โดยเริ่มด้วย In der Altstadt | In der Altstadt gibt es ein Museum | `es_gibt_word_order` | 2 | KB13-4, KB13-6B | — |
| L13-es-gibt-akkusativ | `A13-L13-ESG-015` | `order` | เรียงคำให้เป็นคำถาม | Gibt es hier einen Park | `es_gibt_question` | 2 | KB13-6C, KB13-4 | — |
| L13-dativ-pronomen | `A13-L13-DAT-001` | `choice` | Ich finde den Markt schön. Der Markt gefällt ___. | mir | `recognize_dative_pronoun` | 1 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | — |
| L13-dativ-pronomen | `A13-L13-DAT-002` | `choice` | Du findest die Fotos schön. Die Fotos gefallen ___. | dir | `recognize_dative_pronoun` | 1 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | — |
| L13-dativ-pronomen | `A13-L13-DAT-003` | `choice` | Er findet den Park schön. Der Park gefällt ___. | ihm | `recognize_dative_pronoun` | 1 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | — |
| L13-dativ-pronomen | `A13-L13-DAT-004` | `choice` | Mia hat ein Fahrrad. Das Fahrrad gehört ___. | ihr | `recognize_dative_pronoun` | 1 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | — |
| L13-dativ-pronomen | `A13-L13-DAT-005` | `choice` | Das Kind braucht Hilfe. Ich helfe ___. | ihm | `recognize_dative_pronoun` | 1 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | — |
| L13-dativ-pronomen | `A13-L13-DAT-006` | `cloze` | Ich finde den See schön. Der See gefällt ___. | mir | `produce_dative_form` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-007` | `cloze` | Du hilfst uns. Wir danken ___ sehr. | dir | `produce_dative_form` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-008` | `cloze` | Der Mann braucht Hilfe. Wir helfen ___. | ihm | `produce_dative_form` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-009` | `cloze` | Die Frau braucht Hilfe. Ich helfe ___. | ihr | `produce_dative_form` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-010` | `cloze` | Wir finden die Stadt schön. Die Stadt gefällt ___. | uns | `produce_dative_form` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-011` | `cloze` | Ihr braucht Hilfe. Wir helfen ___ gern. | euch | `produce_dative_form` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-012` | `cloze` | Mia und Ben finden den Park schön. Der Park gefällt ___. | ihnen | `produce_dative_from_context` | 3 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-013` | `cloze` | Guten Tag, Frau Weber! Ich danke ___. | Ihnen | `produce_dative_from_context` | 3 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | AB13-8a-2, AB13-8a-3, AB13-8a-4, AB13-8a-5 |
| L13-dativ-pronomen | `A13-L13-DAT-014` | `order` | เรียงประโยคโดยขึ้นต้นด้วย Das Museum | Das Museum gefällt uns. | `order_supplied_dative_sentence` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | GA23-2-1, GA23-2-4 |
| L13-dativ-pronomen | `A13-L13-DAT-015` | `order` | เรียงประโยคโดยขึ้นต้นด้วย Die Fahrräder | Die Fahrräder gehören euch. | `order_supplied_dative_sentence` | 2 | KB13-5a-1, KB13-5a-2, KB13-5a-3 | GA23-2-1, GA23-2-4 |
| L13-verben-mit-dativ | `A13-L13-VRB-001` | `choice` | Die Musik ___ mir. | gefällt | `verb_conjugation` | 1 | KB13-5A | AB13-6-B |
| L13-verben-mit-dativ | `A13-L13-VRB-002` | `choice` | Die Museen ___ uns. | gefallen | `verb_conjugation` | 1 | KB13-5A | AB13-6-B |
| L13-verben-mit-dativ | `A13-L13-VRB-003` | `choice` | Das Fahrrad ___ meinem Bruder. | gehört | `verb_conjugation` | 1 | KB13-5A | AB13-6-A |
| L13-verben-mit-dativ | `A13-L13-VRB-004` | `choice` | Ich ___ dir für deine Hilfe. | danke | `verb_conjugation` | 1 | KB13-5A | AB13-6-C |
| L13-verben-mit-dativ | `A13-L13-VRB-005` | `choice` | Er ___ das Museum interessant. | findet | `verb_conjugation` | 1 | KB13-3C | GT28-CASE |
| L13-verben-mit-dativ | `A13-L13-VRB-006` | `cloze` | Wir ___ den Kindern. | helfen | `verb_conjugation` | 2 | KB13-5A | AB13-6-D |
| L13-verben-mit-dativ | `A13-L13-VRB-007` | `cloze` | Du ___ deiner Schwester. | hilfst | `verb_conjugation` | 2 | KB13-5A | AB13-6-D |
| L13-verben-mit-dativ | `A13-L13-VRB-008` | `cloze` | Ihr ___ den Gästen. | helft | `verb_conjugation` | 2 | KB13-5A | AB13-6-D |
| L13-verben-mit-dativ | `A13-L13-VRB-009` | `cloze` | Frau Meier ___ die Stadt. | besucht | `verb_conjugation` | 2 | KB13-3C | GT28-CASE |
| L13-verben-mit-dativ | `A13-L13-VRB-010` | `cloze` | Die Jacke ___ meiner Freundin. | gehört | `verb_conjugation` | 2 | KB13-5A | AB13-6-A |
| L13-verben-mit-dativ | `A13-L13-VRB-011` | `cloze` | Die Parks ___ den Touristen. | gefallen | `verb_conjugation` | 2 | KB13-5A | AB13-6-B |
| L13-verben-mit-dativ | `A13-L13-VRB-012` | `cloze` | Du ___ den Zoo schön. | findest | `verb_conjugation` | 2 | KB13-3C | GT28-CASE |
| L13-verben-mit-dativ | `A13-L13-VRB-013` | `cloze` | Wir ___ dir. | danken | `verb_conjugation` | 2 | KB13-5A | AB13-6-C |
| L13-verben-mit-dativ | `A13-L13-VRB-014` | `order` | Wir finden den Brunnen schön. เรียงประโยคใหม่โดยใช้ gefallen | Der Brunnen gefällt uns | `verb_sentence_transform` | 2 | KB13-12-GA | AB13-8B |
| L13-verben-mit-dativ | `A13-L13-VRB-015` | `order` | เรียงคำเป็นประโยคขอบคุณ | Ich danke dir | `verb_word_order` | 2 | KB13-5A | AB13-6-C |
| L14-lokale-praepositionen | `A13-L14-LOKALE-PRAEPOSITIONEN-001` | `choice` | Das Café steht direkt rechts vom Kino. Es ist ___ dem Kino. | neben | `lokale-praepositionen-choice` | 1 | A13-KB-L14-4a | A13-KB-L14-4a |
| L14-lokale-praepositionen | `A13-L14-LOKALE-PRAEPOSITIONEN-002` | `choice` | Der Hund ist nicht vor dem Haus. Er ist auf der Rückseite, also ___ dem Haus. | hinter | `lokale-praepositionen-choice` | 1 | A13-KB-L14-4a | A13-KB-L14-4a |
| L14-lokale-praepositionen | `A13-L14-LOKALE-PRAEPOSITIONEN-003` | `cloze` | Die Brücke ist über dem Fluss. Der Fluss ist ___ der Brücke. | unter | `lokale-praepositionen-cloze` | 2 | A13-KB-L14-4a | A13-KB-L14-4a |
| L14-lokale-praepositionen | `A13-L14-LOKALE-PRAEPOSITIONEN-004` | `cloze` | Die Post steht in der Mitte: links die Bank, rechts die Schule. Die Post ist ___ der Bank und der Schule. | zwischen | `lokale-praepositionen-cloze` | 2 | A13-KB-L14-4a | A13-KB-L14-4a |
| L14-lokale-praepositionen | `A13-L14-LOKALE-PRAEPOSITIONEN-005` | `order` | Die Bank ist neben dem Bahnhof. | Die Bank ist neben dem Bahnhof. | `lokale-praepositionen-order` | 3 | A13-KB-L14-4a | A13-KB-L14-4a |
| L14-wo-dativ | `A13-L14-WO-DATIV-001` | `choice` | Die Bank ist neben ___ Kino. | dem | `wo-dativ-choice` | 1 | A13-KB-L14-4b | A13-KB-L14-4b |
| L14-wo-dativ | `A13-L14-WO-DATIV-002` | `choice` | Der Bus hält vor ___ Schule. | der | `wo-dativ-choice` | 1 | A13-KB-L14-4b | A13-KB-L14-4b |
| L14-wo-dativ | `A13-L14-WO-DATIV-003` | `cloze` | Das Café ist zwischen ___ Park und der Post. | dem | `wo-dativ-cloze` | 2 | A13-KB-L14-4b | A13-KB-L14-4b |
| L14-wo-dativ | `A13-L14-WO-DATIV-004` | `cloze` | Die Frau wartet an ___ Ampel. | der | `wo-dativ-cloze` | 2 | A13-KB-L14-4b | A13-KB-L14-4b |
| L14-wo-dativ | `A13-L14-WO-DATIV-005` | `order` | Das Auto steht vor dem Kaufhaus. | Das Auto steht vor dem Kaufhaus. | `wo-dativ-order` | 3 | A13-KB-L14-4b | A13-KB-L14-4b |

## UX และการบันทึกที่ใช้อยู่ตอนนี้

1. ผู้เรียนเข้าหน้า Practice เลือกบทและหมวด Grammatik. บัญชีทดลองเลือกหัวข้อเพื่อฝึกทันที หรือกดรอบพื้นฐาน. ปุ่มจากการเรียน L13 เปิดรอบพื้นฐานโดยตรง
2. L13 รอบพื้นฐานใหม่มี 15 ข้อ: Es gibt, Dativ, Verben หัวข้อละ 5 ข้อ โดยเลือกคำก่อน พิมพ์คำ และเรียงคำ. L14 รอบพื้นฐานมี 6 ข้อ: สองหัวข้อ หัวข้อละ 3 ข้อ. การ์ดแยกหัวข้อเริ่มรอบละ 5 ข้อ
3. หน้าโจทย์แสดงความคืบหน้า ประโยค และวิธีตอบตาม `kind`. เลือกคำได้จากปุ่ม พิมพ์คำลงช่อง หรือแตะคำเพื่อเรียงประโยค. ปุ่มตรวจพร้อมใช้เมื่อคำตอบครบ. หลังตรวจแสดงผล เฉลย คำอธิบาย และทางไปข้อต่อไป
4. รอบที่ค้างทำต่อได้. รอบใหม่พยายามเลือกข้อที่ยังไม่เคยถูกจัดก่อน. หน้าสรุปแยกผลตามหัวข้อและเปิดทบทวนข้อผิดหรือข้อที่ผู้เรียนบอกว่าต้องคิดหรือเดาได้. ยังไม่มีคิวทบทวนสะสมข้ามทุก session
5. ผลบันทึกใน browser storage ของ pilot เท่านั้น. การเปิดโจทย์ใหม่ไม่ได้สร้าง exposure, LearningAttempt, AttemptEvidence หรือคะแนน Mastery ในระบบจริง. ที่มา หน้า และข้อหนังสือไม่อยู่ในข้อมูลที่ส่งให้หน้าเว็บ

รูปแบบเลือกคำ พิมพ์คำ และเรียงคำเป็นรูปแบบที่เปิดใช้ใน pilot. `multi_blank_chip_bank`, `image_position_choice`, `table_fill`, `route_builder`, `error_correction` และ `guided_writing` ในเอกสารร่างก่อนหน้าเป็นข้อเสนอ ยังไม่ใช่รูปแบบของคลัง Grammar pilot นี้. โจทย์เปิดหรือการเขียนอิสระต้องมี rubric หรือวิธีรับหลายคำตอบก่อนให้คะแนนอัตโนมัติ

## เงื่อนไขก่อนเรียกว่าพร้อมเผยแพร่

- ให้ผู้ตรวจอิสระตรวจความถูกต้องของโจทย์ คำตอบ และคำอธิบาย. งานปัจจุบันตรวจโดยผู้จัดทำ และไม่ได้ตรวจเล่มเฉลยสำนักพิมพ์
- แจกแจงคำตอบภายในกิจกรรมเปิดและกิจกรรมแบบตารางที่ยังบันทึกไว้ระดับกลุ่ม. ทะเบียนตรวจภาพ Grammatik aktiv ที่เพิ่มภายหลังอยู่ใน `a13-item-level-source-audit.json`; ยังไม่ได้ตรวจเฉลยสำนักพิมพ์
- กำหนดความสัมพันธ์ระหว่าง question ID, topic, learned item และ exposure ก่อนเชื่อม Practice จริง. ผลเลือกคำต้องไม่กลบข้อผิดจากการพิมพ์หรือสร้างประโยค
- เพิ่มความหลากหลายของคลัง L14. ตอนนี้มีเพียง 5 ข้อต่อหัวข้อ. อย่าอ้างว่าแบบฝึกทุกหมวดหรือทุกบทพร้อมใช้งานจากการมีหน้าเลือกบท
- แก้โจทย์ที่มีหลายคำตอบถูกด้วย `acceptedAnswers` หรือคำสั่งจำกัดรูปคำก่อนเปิดใช้. เก็บเวอร์ชันและ snapshot ของโจทย์ที่ผู้เรียนทำแล้วเมื่อแก้เฉลยในอนาคต

## ไฟล์ต้นทางที่ต้องแก้เมื่อข้อมูลเปลี่ยน

| ข้อมูล | ไฟล์ใน repository |
|---|---|
| กฎผลิตภัณฑ์และสถานะ pilot | `docs/PRODUCT_BASELINE.md` |
| ทะเบียนหนังสือ หน้า และหลักฐาน | `src/lib/source-catalog.ts`, `docs/SOURCE_METADATA.md` |
| กิจกรรม Momente A1.3 | `docs/exercise-mapping/a13-coursebook-activity-audit.json` |
| กิจกรรมต้นทาง L13 ระดับกิจกรรมและช่อง | `docs/exercise-mapping/l13-dative-source-items.json`, `docs/exercise-mapping/l13-other-topics-source-items.json` |
| โจทย์ใหม่และเฉลย | `docs/exercise-mapping/l13-dative-bank.json`, `l13-es-gibt-bank.json`, `l13-verbs-bank.json`, `l14-grammar-bank.json` ในโฟลเดอร์เดียวกัน |
| ที่มาของโจทย์แต่ละข้อ | `docs/exercise-mapping/l13-dative-provenance.json`, `l13-es-gibt-provenance.json`, `l13-verbs-provenance.json`, `l14-grammar-provenance.json` ในโฟลเดอร์เดียวกัน |
| บันทึกการตรวจและข้อจำกัด | `docs/exercise-mapping/L13_DATIVE_PILOT.md`, `L13_ES_GIBT_VERBEN_PILOT.md`, `docs/A13_EXERCISE_SOURCE_MAPPING.md` |


ปรับปรุง 22 ตุลาคม 2026: แนวทางฝึกต่อเนื่องและการ์ดคำแนะนำหน้าแรก/Practice ของ L13 อยู่ใน `docs/PRACTICE_FLOW_STANDARD.md`. การ์ดใช้ประวัติเบราว์เซอร์แยกบัญชีทดลอง; เปิดรอบค้างก่อน หรือรอบแนะนำ 10 ข้อ. รอบเดิม 9 ข้อไม่ถูกเขียนทับ.
