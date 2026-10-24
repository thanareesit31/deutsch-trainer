"""Build the internal A1.3 exercise mapping from reviewed project metadata."""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MAPPING = ROOT / "docs/exercise-mapping"
SOURCE = MAPPING / "A1_3_L13-L14_Exercise_Mapping_Codex.md"
OUTPUT = MAPPING / "A1_3_L13-L18_Exercise_Mapping_Codex.md"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def cell(value: object) -> str:
    return str(value if value is not None else "—").replace("|", "\\|").replace("\n", " ")


def table(headers: list[str], rows: list[list[object]]) -> str:
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join("---" for _ in headers) + "|"]
    out.extend("| " + " | ".join(cell(value) for value in row) + " |" for row in rows)
    return "\n".join(out)


skills = {
    "vocabulary": "คำศัพท์",
    "grammar": "ไวยากรณ์",
    "phrases": "สำนวนประโยค",
    "writing": "เขียน",
    "listening": "ฟัง",
    "reading": "อ่าน",
}
status = {
    "pilot_bank": "มีคลังทดลอง; รอตรวจอิสระ",
    "catalog_content_needs_question_audit": "มีเนื้อหาเรียน; ยังไม่มีคลังโจทย์ที่ตรวจรายข้อ",
    "other_learning_content_needs_question_audit": "มีหน้าเรียนเฉพาะ; ยังไม่มีคลังโจทย์ที่ตรวจรายข้อ",
    "content_and_question_audit_needed": "ต้องตรวจเนื้อหาและโจทย์รายข้อ",
}

inventory = read_json(MAPPING / "all-lessons-inventory.json")
course = read_json(MAPPING / "a13-coursebook-activity-audit.json")["activities"]
workbook = read_json(ROOT / "src/data/momente-arbeitsbuch-inventory.json")
item_audit = read_json(MAPPING / "a13-item-level-source-audit.json")["items"]
key_review = read_json(MAPPING / "a13-publisher-key-review.json")
key_by_id = {entry["sourceItemId"]: entry for entry in key_review["items"]}
key_counts = Counter(entry["reviewState"] for entry in key_review["items"])
audit_count = Counter(row["sourceId"] for row in item_audit)
audit_by_lesson = Counter(row["lessonId"] for row in item_audit)
pages = read_json(MAPPING / "course-source-page-index.json")["entries"]
page_by_lesson = {entry["lessonId"]: entry for entry in pages}
course_by_lesson = defaultdict(list)
for activity in course:
    course_by_lesson[activity["lessonId"]].append(activity)
workbook_by_lesson = defaultdict(list)
for activity in workbook:
    workbook_by_lesson[activity["lessonId"]].append(activity)

banks = {}
bindings = {}
for lesson in range(13, 19):
    stem = f"l{lesson}-grammar"
    bank_paths = sorted(MAPPING.glob(f"l{lesson}-*bank.json")) if lesson == 13 else [MAPPING / f"{stem}-bank.json"]
    for bank_path in bank_paths:
        bank = read_json(bank_path)
        banks[bank_path.stem] = bank
        provenance = read_json(bank_path.with_name(bank_path.name.replace("-bank.json", "-provenance.json")))
        bindings.update({entry["questionId"]: entry for entry in provenance["bindings"]})

topic_counts = Counter(question["topicId"] for bank in banks.values() for question in bank["questions"])
lesson_counts = Counter(bank["lessonId"] for bank in banks.values() for _ in bank["questions"])

original = SOURCE.read_text(encoding="utf-8")
original = original.replace("# A1.3: ข้อมูลวิเคราะห์แบบฝึกหัด Lektion 13–14", "# A1.3: Exercise Mapping Lektion 13–18", 1)
original = original.replace("ปรับข้อมูลตามโปรเจกต์ `deutsch-trainer-next` วันที่ 20 ตุลาคม 2026", "ปรับข้อมูลตามโปรเจกต์ `deutsch-trainer-next` ถึงวันที่ 21 ตุลาคม 2026", 1)
original = original.replace("> ไฟล์นี้เป็นสำเนาอ่านสะดวกของข้อมูลใน repository.", "> เอกสารนี้เป็น snapshot อ่านสะดวกของข้อมูลใน repository.", 1)
original = original.replace("`docs/exercise-mapping/a13-coursebook-activity-audit.json`, `src/lib/source-catalog.ts`", "`docs/exercise-mapping/a13-coursebook-activity-audit.json`, `docs/exercise-mapping/a13-item-level-source-audit.json`, `src/lib/source-catalog.ts`", 1)
original = original.replace("## ขอบเขตและสถานะ", "## รายละเอียด L13–L14 ที่ตรวจระดับกิจกรรมและโจทย์แล้ว\n\n## ขอบเขตและสถานะ", 1)
original = original.replace("## โจทย์เว็บที่เขียนใหม่และหลักฐานรายข้อ", "## โจทย์เว็บ L13–L14 ที่เขียนใหม่และหลักฐานรายข้อ", 1)
original = original.replace("## UX และการบันทึกที่ใช้อยู่ตอนนี้", "## UX ของคลัง L13–L14 ที่ใช้อยู่ตอนนี้", 1)
original = original.replace("## เงื่อนไขก่อนเรียกว่าพร้อมเผยแพร่", "## เงื่อนไขก่อนเรียกว่าพร้อมเผยแพร่ L13–L14", 1)
original = original.replace("## ไฟล์ต้นทางที่ต้องแก้เมื่อข้อมูลเปลี่ยน", "## ไฟล์ต้นทางของรายละเอียด L13–L14", 1)
original = original.replace("โดยเฉพาะ L14 และ Grammatik aktiv ที่ยังไม่มีหลักฐานรายข้อใหม่ใน workspace", "โดยเฉพาะ L14; หลักฐาน Grammatik aktiv ที่ตรวจเพิ่มอยู่ในทะเบียนรายข้อท้ายเอกสาร")

summary = [
    "\n## ภาพรวม A1.3 ทั้ง 6 บท\n",
    "เอกสารนี้รวม **ครบ 36 ช่องบท × หมวด** และรายการที่มีหลักฐานในโปรเจกต์ ณ วันที่ 21 ตุลาคม 2026. "
    "คำว่า ‘ครบ’ หมายถึงมีสถานะและทางทำงานต่อทุกช่อง ไม่ได้หมายความว่าตรวจข้อหนังสือหรือสร้างโจทย์ครบทุกช่องแล้ว. "
    "ปัจจุบันมีโจทย์ใหม่ 90 ข้อใน 12 หัวข้อไวยากรณ์สำหรับบัญชีทดลองเท่านั้น; ไม่มีหมวดอื่นที่มีคลัง Practice พร้อมเผยแพร่. "
    f"L13 ตรวจหน่วยต้นทางละเอียด 78 หน่วย; Momente Kursbuch มีทะเบียน {len(course)} กิจกรรมใน L13–18 และ Arbeitsbuch มี 45 กิจกรรมเฉพาะ L13–14. ทะเบียนตรวจเพิ่มมี {len(item_audit)} ระเบียนจากหน้าจริง ครอบคลุม Arbeitsbuch L15–L18 และหนังสือเสริม. "
    "หน่วยตรวจต้นทางอาจเป็นทั้งกิจกรรม ช่องคำตอบ หรือตัวอย่าง จึงห้ามบวกรวมเป็นจำนวนโจทย์.\n",
    table(
        ["บท", "หน้า Kursbuch พิมพ์/PDF", "หัวข้อไวยากรณ์ที่มี bank", "ข้อทดลอง", "Kursbuch audit", "Arbeitsbuch audit", "audit เพิ่มทุกแหล่ง"],
        [
            [
                f"L{lesson}",
                f"{page_by_lesson[f'L{lesson}']['printedPages'][0]}–{page_by_lesson[f'L{lesson}']['printedPages'][1]} / "
                f"{page_by_lesson[f'L{lesson}']['pdfPages'][0]}–{page_by_lesson[f'L{lesson}']['pdfPages'][1]}",
                ", ".join(topic.replace(f"L{lesson}-", "") for topic in topic_counts if topic.startswith(f"L{lesson}-")),
                lesson_counts[f"L{lesson}"],
                f"{len(course_by_lesson[f'L{lesson}'])} กิจกรรม (visual {sum(a['inspectionStatus'] == 'visual_verified' for a in course_by_lesson[f'L{lesson}'])})",
                f"{len(workbook_by_lesson[f'L{lesson}'])} กิจกรรมใน inventory" if workbook_by_lesson[f"L{lesson}"] else f"{sum(a['lessonId'] == f'L{lesson}' and a['sourceId'] == 'MOMENTE_A1_2_AB' for a in item_audit)} ระเบียนใน audit ใหม่",
                audit_by_lesson[f"L{lesson}"],
            ]
            for lesson in range(13, 19)
        ],
    ),
    "\nเลขหน้าเป็นเลขพิมพ์และลำดับ PDF ตาม `course-source-page-index.json`. สถานะ `visual_verified` ตรวจภาพหน้าแล้ว; "
    "ทุกกิจกรรม Kursbuch ในทะเบียนนี้ตรวจภาพหน้าแล้ว. ระเบียนระดับกิจกรรมบางรายการยังไม่ได้แยกทุกช่องตอบ. "
    "พบเฉลยสำนักพิมพ์ของ Momente ออนไลน์และเฉลยท้ายเล่มของหนังสือเสริม; สถานะเทียบรายระเบียนอยู่ใน `a13-publisher-key-review.json`. "
    "ไฟล์ Kursbuch ที่ได้รับไม่มีหน้าเฉลยพิมพ์ 105 ที่หนังสืออ้างถึง. "
    "ถ้าทะเบียน L13 รุ่นก่อนเปิดช่องใช้โจทย์จากบทที่มีป้าย A2 ให้ยึดผลคัด `exclude_level` ของทะเบียนตรวจภาพล่าสุดสำหรับชุดพื้นฐาน A1.3.\n",
    "### สถานะครบทุกหมวด\n",
]

slot_rows = []
for slot in inventory["slots"]:
    if slot["lessonId"] not in {f"L{i}" for i in range(13, 19)}:
        continue
    items = slot.get("topicWorkItems") or []
    topics = ", ".join(item["title"] for item in items) or (
        ", ".join(slot.get("curriculumTopics") or []) or "ต้องแจกแจงจากต้นฉบับ"
    )
    refs = [a["id"] for a in course_by_lesson[slot["lessonId"]] if slot["skill"] in a["skills"]]
    ab = [a["id"] for a in workbook_by_lesson[slot["lessonId"]] if slot["skill"] in [a.get("primarySkill"), *(a.get("secondarySkills") or [])]]
    slot_rows.append([
        slot["lessonId"], skills[slot["skill"]], topics,
        f"KB {', '.join(refs) or 'ยังไม่ระบุกิจกรรม'}; AB {', '.join(ab) or 'ยังไม่ระบุกิจกรรม'}",
        (slot.get("plan") or {}).get("objective", "—"),
        ", ".join((slot.get("plan") or {}).get("candidatePatterns") or []),
        status[slot["status"]],
        lesson_counts[slot["lessonId"]] if slot["skill"] == "grammar" else 0,
    ])
summary.append(table(["บท", "หมวด", "หัวข้อ/กลุ่มที่ลงทะเบียน", "กิจกรรมที่มีหลักฐาน", "วัตถุประสงค์", "รูปแบบที่เสนอ", "สถานะ", "ข้อเว็บ"], slot_rows))
summary.append(
    "\nหมายเหตุ: กิจกรรมที่แสดงในช่องอาจมีทักษะรองร่วม แต่ยังไม่ใช่การอนุมัติให้ทำเป็นโจทย์หมวดนั้น. "
    "หมวดการพูดเป็นงานที่ต้องทำบัญชีแยกจาก 6 หมวด Practice ปัจจุบัน.\n"
)
original = original.replace("## รายละเอียด L13–L14 ที่ตรวจระดับกิจกรรมและโจทย์แล้ว", "\n".join(summary) + "\n## รายละเอียด L13–L14 ที่ตรวจระดับกิจกรรมและโจทย์แล้ว", 1)

extra = [
    "\n## ขอบเขต L15–L18 และแหล่งเสริมที่คัดแล้ว\n",
    "ส่วนนี้เทียบหัวข้อกับ `docs/A13_EXERCISE_SOURCE_MAPPING.md` และทะเบียนรายข้อที่ตรวจภาพหน้าเพิ่ม. "
    "การอ้างบท/หน้าเป็นหลักฐานหัวข้อ; รายละเอียดข้อที่ตรวจอยู่ในตารางรายข้อด้านล่าง.\n",
    table(
        ["บท", "เนื้อหาใหม่ / ทบทวน", "Grammatik A1 – das Training", "Grammatik aktiv", "Schreiben A1 – das Training", "ข้อจำกัด"],
        [
            ["L15", "ใหม่: Possessivartikel ihr/sein ใน Nominativ/Akkusativ; ทบทวนเพศ จำนวน และ Akkusativ", "บท 30 หน้า 54 ตรงหัวข้อแต่กว้างกว่า; บท 28 หน้า 51 ทบทวน Case", "บท 19 หน้า 50 ตรงหัวข้อแต่กว้างกว่า; บท 17 หน้า 46 ทบทวน", "ยังไม่มีบทที่ตรวจโจทย์ตรงโดยตรง", "อย่านับรูป possessive ทุกบุรุษเป็นเนื้อหาใหม่"],
            ["L16", "ใหม่: in/vor/nach สำหรับการนัดหมาย; ทบทวน Dativ และคำบอกเวลา", "บท 35 หน้า 60 ตรงบางส่วน; บท 34 หน้า 59 กฎ Case", "บท 32 หน้า 80 ตรงบางส่วน; บท 33 หน้า 82 กฎ Dativ", "บท 6 Termine machen หน้า 23–24 ตรวจรูปแบบเรียงข้อความและเขียนนัดหมายแล้ว", "แยกการฝึกความหมายเวลาออกจากการเขียนนัดหมาย"],
            ["L17", "ใหม่: werden Präsens, mit/ohne, wollen + Infinitiv; ทบทวน Präsens/Modalverb", "บท 16 หน้า 25, 17 หน้า 28 ทบทวนรูปผัน; บท 20–21 หน้า 37–38 modal; บท 34 หน้า 59 mit/ohne", "บท 2 หน้า 12, 6 หน้า 20 บางส่วน; บท 64 หน้า 150 Futur I เกินขอบเขต", "ยังไม่พบบทที่ตรวจโจทย์ werden ตรงโดยตรง", "ไม่ดึง Futur I มาเป็นโจทย์ L17"],
            ["L18", "ใหม่: Imperativ Sie, sollen + Infinitiv/Satzklammer; ทบทวน Präsens/ลำดับคำ", "บท 4 หน้า 11, 24 หน้า 45 Imperativ; บท 7 หน้า 15, 20–21 หน้า 38–39 modal", "บท 9 หน้า 26–27 Imperativ; บท 6 หน้า 20 ไม่มี sollen", "บท 14 Beim Arzt หน้า 49–50 บริบทสุขภาพบางส่วน; บท 17 หน้า 56 sollen บริบทอื่น", "บท 9 บางกิจกรรมมีป้าย A2; modal ต้องมีบริบทหรือรองรับหลายเฉลย"],
        ],
    ),
    "\nGrammatik aktiv PDF ฉบับที่ผู้ใช้ระบุเปิดตรวจภาพแล้ว. Schreiben A1 – das Training ใช้เทียบรูปแบบการเขียน/สถานการณ์; รายการที่ตรวจจริงอยู่ในทะเบียนด้านล่าง.\n",
    "## ทะเบียนกิจกรรม Momente Kursbuch L13–L18\n",
    "ตารางนี้แสดงทุกกิจกรรมใน `a13-coursebook-activity-audit.json` โดยระบุระดับหลักฐานจริง. "
    "รายการยังเป็น **subset** ของหนังสือ ไม่ใช่การตรวจครบทุกข้อในหน้าที่อ้าง.\n",
    table(
        ["บท", "Evidence ID", "พิมพ์/PDF", "ข้อ", "หมวดที่เกี่ยว", "กลไกหนังสือ", "สิ่งที่วัด", "สถานะ"],
        [[a["lessonId"], f"`{a['id']}`", f"{a['printedPage']}/{a['pdfPage']}", a["originalActivityId"], ", ".join(skills.get(s, s) for s in a["skills"]), f"`{a['mechanic']}`", a["objective"], a["inspectionStatus"]] for a in course],
    ),
    "\nกิจกรรมที่ใช้เสียง/ภาพต้องมีสิทธิ์ใช้งานหรือสร้างสื่อใหม่สำหรับเว็บ. กิจกรรมแบบจับคู่จากภาพ วาดแผนที่ หรือเติมบทสนทนาต้องแต่งข้อความและเฉลยใหม่ พร้อมตรวจว่าทักษะที่วัดตรงกับหมวด.\n",
    "## ทะเบียนกิจกรรม Momente Arbeitsbuch ที่มีแล้ว\n",
    "`momente-arbeitsbuch-inventory.json` มีทะเบียน 45 กิจกรรม L13–L14. "
    "สำหรับ L15–L18 มีทะเบียนตรวจภาพเพิ่มใน `a13-item-level-source-audit.json`; บางกิจกรรมเปิดกว้างจึงบันทึกระดับกิจกรรม ไม่ได้สร้างเลขช่องที่หนังสือไม่ได้พิมพ์.\n",
    table(
        ["บท", "Evidence ID", "พิมพ์/PDF", "ข้อ", "หมวดหลัก", "กลไก", "การกระทำผู้เรียน", "สถานะ"],
        [[a["lessonId"], f"`{a['id']}`", f"{a['printedPage']}/{a['pdfPage']}", a["originalActivityId"], skills.get(a.get("primarySkill"), a.get("primarySkill")), f"`{a['mechanic']}`", a["learnerAction"], a["verificationStatus"]] for a in workbook],
    ),
    "\n## ทะเบียนต้นทางระดับข้อที่ตรวจภาพเพิ่ม\n",
    f"มี {len(item_audit)} ระเบียน: " + ", ".join(f"`{source}` {count}" for source, count in sorted(audit_count.items())) + ". "
    "หนึ่งระเบียนหมายถึงหนึ่งช่อง/ข้อที่ระบุได้ หรือหนึ่งกิจกรรมที่ไม่มีเลขข้อย่อย; จึงไม่ใช่จำนวนโจทย์เว็บ. "
    "ทุกแถวบันทึกเลขพิมพ์/ลำดับ PDF กลไก ทักษะที่วัด ผลคัด และวิธีแปลงเป็น UX. `labelKind=internal_*` คือรหัสช่องที่ผู้ตรวจตั้งเพื่ออ้างอิง ไม่ใช่เลขข้อพิมพ์. `numbered_group` และ `row_contains_multiple_response_parts` ยังมีหลายคำตอบในหนึ่งระเบียน. "
    f"ทะเบียนเฉลยมี {key_counts['source_slot_and_publisher_fixed_key_crosschecked']} ช่องที่เทียบกับคำตอบตายตัว, {key_counts['source_row_and_publisher_solution_compared']} แถวที่ตรวจรูปประโยค, และ {key_counts['source_activity_and_publisher_solution_compared']} กิจกรรมที่ตรวจรูปแบบกับเฉลย; {key_counts['publisher_open_answer']} ระเบียนมีคำตอบอิสระ/ตัวอย่าง, {key_counts['printed_model_excluded']} ตัวอย่างที่ทำให้ดูแล้ว, และ {key_counts['publisher_no_answer_entry']} กิจกรรมที่ไม่มีรายการในเฉลย; ที่เหลือยังไม่ได้เทียบคำตอบรายข้อ. "
    "โจทย์เว็บต้องแต่งใหม่ ไม่คัดลอกข้อความหรือภาพของหนังสือ.\n",
    table(
        ["บท", "Source item ID", "พิมพ์/PDF", "ข้อ", "ระดับ", "รหัสข้อ", "การแยกคำตอบ", "รูปแบบต้นทาง", "ทักษะ", "ผลคัด", "สถานะเฉลย", "แนว UX", "หมายเหตุ"],
        [[a["lessonId"], f"`{a['id']}`", f"{a['printedPage']}/{a['pdfPage']}", a["sourceRef"], a["granularity"], a["labelKind"], a["itemizationStatus"], a["mechanic"], a["target"], a["decision"], key_by_id[a["id"]]["reviewState"], a["webAdaptation"], a["auditNote"] or "—"] for a in item_audit],
    ),
    "\n## คลังโจทย์เว็บ L15–L18 และ provenance รายข้อ\n",
    "โจทย์ 35 ข้อต่อไปนี้แต่งใหม่ทั้งหมด; รูปแบบและขอบเขตเชื่อมกับ evidence ID ใน metadata. "
    "`contentBasis` ระบุขอบเขตเนื้อหา; `exerciseBasis` ระบุแนวการฝึก. คำสั่ง ตัวเลือก คำใบ้ คำอธิบาย และการจัดการข้อผิดอยู่ใน bank JSON. "
    "สถานะทุก bank คือ `review_prototype_not_published`.\n",
]

new_question_rows = []
for name, bank in banks.items():
    if bank["lessonId"] in {"L13", "L14"}:
        continue
    for question in bank["questions"]:
        binding = bindings.get(question["id"], {})
        answer = ", ".join(question.get("acceptedAnswers") or [])
        new_question_rows.append([
            question["topicId"], f"`{question['id']}`", question["kind"],
            question.get("sentence") or question.get("prompt") or "—", answer,
            question.get("subskill", "—"), question.get("difficulty", "—"),
            ", ".join(binding.get("contentBasis") or []) or "—",
            ", ".join(binding.get("exerciseBasis") or []) or "—",
        ])
extra.append(table(["บท/หัวข้อ", "Question ID", "รูปแบบ", "ประโยคโจทย์", "เฉลย", "Subskill", "ระดับ", "Content basis", "Exercise basis"], new_question_rows))
extra.extend([
    "\n### หัวข้อและวัตถุประสงค์ของโจทย์ทดลอง L15–L18\n",
    table(
        ["บท/หัวข้อ", "ข้อในคลัง", "รูปแบบที่มี", "วัตถุประสงค์", "ข้อที่ยังขาด"],
        [
            ["L15 Possessivartikel ihr/sein", 5, "เลือกคำ, พิมพ์, เรียงคำ", "เลือกฐานและ Endung ตามเจ้าของ เพศ และ Case", "ขยายบริบทและตรวจเฉลยอิสระ"],
            ["L16 in/vor/nach", 5, "เลือกคำ, พิมพ์, เรียงคำ", "แยกความหมายก่อน/หลัง/อีก...ข้างหน้า และใช้รูปคำในบริบท", "ขยายช่วงเวลาและตรวจโจทย์จากหน้าต้นฉบับ"],
            ["L17 werden", 5, "เลือกคำ, พิมพ์, เรียงคำ", "ผัน werden ใน Präsens กับแผนอาชีพ", "ไม่ทดสอบ Futur I; ขยายบุรุษและบริบท"],
            ["L17 mit/ohne", 5, "เลือกคำ, พิมพ์, เรียงคำ", "เลือก preposition และ Case ที่เหมาะสม", "เพิ่มบริบทหลายคำนามและตรวจความกำกวม"],
            ["L17 wollen + Infinitiv", 5, "เลือกคำ, พิมพ์, เรียงคำ", "ผัน wollen และจัด Satzklammer", "ขยายประธานและกริยาปลายประโยค"],
            ["L18 Imperativ Sie", 5, "เลือกคำ, พิมพ์, เรียงคำ", "สร้างคำแนะนำสุภาพกับ Sie", "เพิ่มการใช้ bitte และเครื่องหมายวรรคตอน"],
            ["L18 sollen + Infinitiv", 5, "เลือกคำ, พิมพ์, เรียงคำ", "ผัน sollen และวาง Infinitiv ท้ายประโยค", "ให้บริบทชัดและรองรับคำตอบถูกหลายแบบ"],
        ],
    ),
    "\n## สัญญา UX สำหรับการขยาย Practice ทุกหมวด\n",
    table(
        ["รูปแบบ", "หน้าจอและการกด", "สิ่งที่วัด", "การตรวจและทางไปต่อ"],
        [
            ["meaning_choice / form_choice / situation_choice", "แสดงคำหรือสถานการณ์และ 3–4 ตัวเลือก; แตะหนึ่งคำแล้วกดตรวจ", "จำความหมาย/รูปคำ/ความเหมาะสมของสำนวน", "แสดงเหตุผลสั้นและประโยคเต็ม; กดข้อต่อไป"],
            ["word_recall / form_input", "แสดงบริบทพร้อมช่องว่าง; แตะช่องและพิมพ์เอง", "ดึงรูปคำจากความจำ แยกจากการเดาตัวเลือก", "เทียบ normalized answer และ acceptedAnswers; ระบุข้อผิดด้าน Case/การผัน/สะกดเมื่อระบุได้"],
            ["word_order / sentence_order", "แสดงการ์ดคำ; แตะเรียงลงแถบคำตอบ; แตะคำที่ลงแล้วเพื่อแก้", "สร้างลำดับคำและ Satzklammer", "ตรวจทั้งลำดับและรูปคำ; แสดงประโยคที่ถูกแล้วกดต่อ"],
            ["dialogue_completion", "แสดงบทสนทนาสั้นกับช่องว่าง; เลือกหรือพิมพ์คำตอบ", "ใช้สำนวนตอบให้ตรงหน้าที่สื่อสาร", "รับทุกคำตอบที่เหมาะกับบริบท; อธิบายเหตุผลก่อนข้อถัดไป"],
            ["text_detail / text_inference", "อ่านบทความที่แต่งใหม่; แตะคำตอบหรือไฮไลต์ช่วงข้อความ", "ค้นข้อเท็จจริงหรือตีความโดยอ้างข้อความ", "ชี้หลักฐานในข้อความหลังตรวจ; กดข้อถัดไป"],
            ["audio_choice / audio_detail", "กดเล่นเสียงใหม่; ฟังซ้ำได้; เลือกคำตอบจากข้อมูลที่ได้ยิน", "จับใจความหรือรายละเอียดจากเสียงจริง", "หลังตรวจเปิด transcript/เหตุผล; กดข้อถัดไป"],
            ["guided_writing / short_response", "อ่านข้อความสถานการณ์และคำแนะนำสั้น; พิมพ์ข้อความตอบ", "สื่อความหมายด้วยประโยคที่ผู้เรียนสร้างเอง", "ใช้เกณฑ์ตรวจหลายมิติหรือการตรวจโดยคนเมื่ออัตโนมัติไม่มั่นใจ; แสดงข้อเสนอแก้ แล้วกดต่อ"],
        ],
    ) + "\n",
    "1. จากหน้าเรียนเมื่อจบการ์ดของหมวดนั้น ให้ปุ่ม `ทำแบบฝึกหัด` เปิดรอบพื้นฐานของหมวดนั้นทันที หากยังไม่มีคลังที่ผ่านตรวจ ให้แสดงสถานะเตรียมเนื้อหาตามระบบปัจจุบัน. หน้า Practice ใช้ทางเลือก A1.3 → บท → หมวด → หัวข้อสำหรับกลับมาฝึกเฉพาะเรื่อง.\n"
    "2. รอบพื้นฐานของไวยากรณ์ที่มีหลายหัวข้อเรียงตามลำดับเรียน; แต่ละหัวข้อเริ่มจากเลือกคำ แล้วพิมพ์ แล้วเรียงคำ. L13 รอบใหม่ใช้ 3 × 5 = 15 ข้อ พร้อมจุดพักทุก 5 ข้อและชุดแนะนำตาม `docs/PRACTICE_FLOW_STANDARD.md`; L14 ใช้ 2 × 3 = 6 ข้อ; L15–L18 ใช้ 3 ข้อต่อหัวข้อ. การฝึกเฉพาะหัวข้อเริ่มรอบละ 5 ข้อ. สิ่งนี้อธิบาย pilot ปัจจุบัน ไม่ใช่เกณฑ์รับรองความชำนาญ.\n"
    "3. หน้าโจทย์มีชื่อหัวข้อ จำนวนข้อ/ทั้งหมด แถบคืบหน้า ประโยค และปุ่มคำตอบตามชนิด `choice`/`cloze`/`order`. ผู้เรียนกดตัวเลือก พิมพ์ หรือแตะเรียงคำ แล้วกด `ตรวจคำตอบ`; หลังตรวจเห็นผล เฉลย คำอธิบาย และปุ่ม `ข้อต่อไป`. ปุ่มตรวจพร้อมใช้เมื่อกรอกครบ.\n"
    "4. หน้าสรุปแยกหัวข้อและรูปแบบการตอบ เปิดทบทวนข้อผิดได้. การเริ่มรอบใหม่เลือกข้อที่ยังไม่เคยเจอก่อนเมื่อคลังพอ; ห้ามใช้ข้อเดิมซ้ำในรอบเดียว. เมื่อตัวเลือกหมดจึงวนกลับพร้อมคำนึงถึงข้อผิด. จำนวนคลังเป้าหมายตาม inventory คือ 15 ข้อต่อหัวข้อ; L14–L18 ยังมีเพียง 5 ข้อต่อหัวข้อ.\n"
    "5. ขณะนี้ pilot เก็บความคืบหน้าเฉพาะ browser storage แยกบัญชี ไม่เข้า Learning History/Progress หลัก. ก่อนเปิดจริงต้องบันทึก question ID + version, topic, subskill, kind, first attempt, attempts, hint, result, เวลา และ exposure โดยแยกความสามารถเลือกคำ พิมพ์คำ และสร้างประโยค.\n"
    "6. สำหรับหมวดคำศัพท์/สำนวน/อ่าน/ฟัง/เขียน ให้เริ่มจากวัตถุประสงค์ใน `all-lessons-inventory.json` และกิจกรรมที่ตรวจแล้ว. "
    "คำศัพท์ใช้จำความหมาย/Artikel แล้วดึงคำเอง; สำนวนใช้เลือกประโยคตามบริบทแล้วจัดบทสนทนา; อ่านใช้ข้อความใหม่พร้อมหลักฐานในข้อความ; ฟังต้องมีเสียงใหม่และคำถามที่วัดการฟังจริง; เขียนรับข้อความสั้นพร้อมเกณฑ์ตรวจหลายคำตอบ. "
    "ทั้งหมดเป็นแนวออกแบบที่ **ยังไม่ใช่โจทย์พร้อมใช้** และต้องเพิ่ม bank + provenance รายข้อก่อนเปิด.\n",
    "## งานที่ยังต้องทำก่อนเรียกว่า Exercise Mapping รายข้อสมบูรณ์\n",
    "- ตรวจทุกช่องของกิจกรรมเปิดและกิจกรรมสื่อใน Momente Kursbuch/Arbeitsbuch L13–L18 เพิ่มเติม; ทะเบียนปัจจุบันมีทั้งระดับกิจกรรม ระดับกลุ่ม และระดับช่อง. ระเบียนที่ `itemizationStatus` เป็น `activity_only` หรือ `group_contains_multiple_responses` ยังไม่ถือว่าตรวจครบทุกคำตอบ.\n"
    "- ตรวจช่องย่อยของหนังสือเสริมที่ยังบันทึกระดับกิจกรรมหรือกลุ่ม และเทียบเฉลยกับกฎหรือเฉลยสำนักพิมพ์เมื่อมี. ป้าย A2 และตัวอย่างที่ทำให้ดูแล้วต้องไม่เข้า pool ฝึก A1.3.\n"
    "- แต่งโจทย์ใหม่และผูก provenance ทุกข้อสำหรับอีก 30 ช่องที่ยังไม่มี bank; ตรวจภาษาเยอรมัน คำตอบกำกวม distractor คำใบ้ และการใช้บทเรียนที่ผู้เรียนยังไม่ผ่าน. ครูอิสระต้องตรวจเฉลยก่อนเผยแพร่.\n"
    "- เพิ่มคลังอย่างน้อยตามเป้าหมาย 15 ข้อต่อหัวข้อ ทำรอบซ้ำที่เลือกข้อใหม่และกลับมาทบทวนข้อผิดได้โดยไม่ทิ้งชนิดทักษะ. ตรวจ UX บนมือถือและการบันทึก Progress จริงก่อนเปลี่ยนสถานะจาก pilot.\n",
    "## ไฟล์ข้อมูลหลักของ A1.3\n",
    table(
        ["หน้าที่", "ไฟล์ใน repository"],
        [
            ["ขอบเขตหนังสือและการคัดหัวข้อ L13–L18", "`docs/A13_EXERCISE_SOURCE_MAPPING.md`"],
            ["36 ช่องบท × หมวดและแผนโจทย์", "`docs/exercise-mapping/all-lessons-inventory.json`"],
            ["หน้า Kursbuch/บท", "`docs/exercise-mapping/course-source-page-index.json`"],
            ["กิจกรรม Kursbuch", "`docs/exercise-mapping/a13-coursebook-activity-audit.json`"],
            ["กิจกรรม Arbeitsbuch L13–L14", "`src/data/momente-arbeitsbuch-inventory.json`"],
            ["ทะเบียนตรวจภาพระดับข้อ L13–L18", "`docs/exercise-mapping/a13-item-level-source-audit.json`"],
            ["หน่วยตรวจหนังสือเสริม L13", "`docs/exercise-mapping/l13-dative-source-items.json`, `l13-other-topics-source-items.json`"],
            ["คลังโจทย์และ provenance", "`docs/exercise-mapping/l13-*-bank.json`, `l13-*-provenance.json`, `l14-grammar-bank.json` ถึง `l18-grammar-bank.json` และไฟล์ provenance คู่กัน"],
            ["สถานะ publication และแผนคัดครบ 18 บท", "`docs/exercise-mapping/ALL_LESSONS_PREPARATION.md`"],
        ],
    ),
    "\nเอกสารนี้เป็นดัชนีวิเคราะห์ภายใน. เมื่อ bank หรือทะเบียนหลักเปลี่ยน ให้สร้างเอกสารใหม่ด้วย `python3 scripts/exercise-mapping/build-a13-consolidated.py` และตรวจความหมายของตารางก่อนใช้ตัดสินใจ.\n",
])

OUTPUT.write_text(original.rstrip() + "\n" + "\n".join(extra), encoding="utf-8")
print(f"Wrote {OUTPUT}: {len(slot_rows)} slots, {len(course)} course activities, {len(workbook)} workbook activities, {sum(lesson_counts.values())} questions")
