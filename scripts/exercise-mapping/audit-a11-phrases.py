#!/usr/bin/env python3
"""Render the reviewed source comparison; --check detects catalog/review/report drift."""
import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REVIEW = ROOT / 'docs/exercise-mapping/a11-phrase-source-review.json'
REPORT = ROOT / 'docs/exercise-mapping/A11_A12_PHRASE_SOURCE_AUDIT.md'


def read(path):
    return json.loads((ROOT / path).read_text())


def cell(value):
    return str(value).replace('|', '\\|').replace('\n', ' ')


def render():
    review = json.loads(REVIEW.read_text())
    bank = read('docs/exercise-mapping/a11-phrase-bank.json')
    targets = [target for lesson in bank['lessons'] for target in lesson['targets']]
    digest = hashlib.sha256(json.dumps(targets, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    if digest != review['reviewedTargetsSha256']:
        raise ValueError('Phrase text/metadata changed: re-review source mappings before updating reviewedTargetsSha256')
    if targets != read('src/data/a11-phrase-targets.json'):
        raise ValueError('Learn target catalog and bank inventory differ')
    by_id = {target['id']: target for target in targets}
    if len(by_id) != len(targets):
        raise ValueError('Duplicate target IDs')
    if [lesson['lessonId'] for lesson in review['lessons']] != [f'L{n:02}' for n in range(1, 13)]:
        raise ValueError('Review must cover L01–L12 in order')
    definitions = bank['definitions']
    if len({d['id'] for d in definitions}) != len(definitions):
        raise ValueError('Duplicate response IDs')
    for definition in definitions:
        if definition['targetId'] not in by_id:
            raise ValueError(f"Unknown response target: {definition['id']}")
    status_names = {'partial': 'มีบางส่วน', 'absent': 'ไม่มีในคลังนี้', 'supporting': 'บริบทประกอบ', 'supplement': 'เสริม/ทบทวนขอบเขต'}
    lines = [
        '# ตรวจคลังประโยค L01–L12 เทียบแหล่งเรียน', '',
        f"วันที่ตรวจ: {review['reviewedAt']}. สร้างรายงานจาก metadata ที่ตรวจด้วยตาใน `a11-phrase-source-review.json` และคลังจริงด้วย `python3 scripts/exercise-mapping/audit-a11-phrases.py`. ตรวจความตรงกันด้วย `--check`.", '',
        '## ขอบเขตและความหมายของผล', '',
        'ตรวจครบ 12 บทในระดับหน้าที่สื่อสาร และผูกประโยคเดิมทุกรายการกับหน้าที่หรือบริบทประกอบ. นี่เป็นการตรวจช่องว่างของคลังที่ใช้สร้างโจทย์ ไม่ใช่การรวบรวมสำนวนทุกบรรทัดในหนังสือ ไม่ใช่การรับรองคำแปล/ตัวลวงทุกข้อ และยังไม่ใช่กิจกรรม Learn ที่ออกแบบใหม่.', '',
        'คำว่า “ไม่มี” หมายถึงไม่มี target ใน phrase bank นี้เท่านั้น. เนื้อหาอาจปรากฏใน Wortschatz/Grammatik หรือหน้าเรียนเดิมอื่น เช่น สถานภาพครอบครัว L02. ก่อนเพิ่ม target ต้องเชื่อม ID และหลักฐานที่มีอยู่ เพื่อลดข้อมูลซ้ำ.', '',
        f"แหล่งหลัก: `{review['source']['fileName']}` ({review['source']['pdfPages']} หน้า PDF). SHA-256 `{review['source']['sha256']}`. เลขหน้า PDF เป็นหนึ่งฐานและแยกจากเลขพิมพ์. อ่านต้นฉบับในเครื่อง; ภาพตรวจอยู่ใน ignored `.tools` และไม่ใช่สื่อสำหรับผู้เรียน.", '',
        'ข้อจำกัดแหล่งที่ตรวจ:', '',
    ]
    lines += [f'- {limitation}' for limitation in review['source']['limitations']]
    lines += ['', '## จำนวนจริงและช่องว่างรายบท', '',
              '| บท | ประโยคเดิม | นิยามคำตอบ | หน้าที่หลักที่มีบางส่วน | หน้าที่หลักที่ยังไม่มี |',
              '| --- | ---: | ---: | ---: | ---: |']
    for lesson in review['lessons']:
        lid = lesson['lessonId']
        actual = [t for t in targets if t['lessonId'] == lid]
        funcs = lesson['objectives']
        counts = Counter(f['status'] for f in funcs)
        mapped = [i for f in funcs for i in f['targetIds']]
        if len(mapped) != len(set(mapped)) or set(mapped) != {t['id'] for t in actual}:
            raise ValueError(f'{lid}: map every target once to its primary function or supporting context')
        for f in funcs:
            if f['status'] not in status_names or (f['status'] == 'absent' and f['targetIds']):
                raise ValueError(f"Invalid objective: {f['id']}")
        if set(lesson['targetFlags']) - set(mapped):
            raise ValueError(f'{lid}: target flag points outside reviewed targets')
        response_count = sum(d['lessonId'] == lid for d in definitions)
        inventory = next(l for l in bank['lessons'] if l['lessonId'] == lid)
        if (len(actual), response_count) != (inventory['targetCount'], inventory['questionDefinitions']):
            raise ValueError(f'{lid}: inventory count differs from actual data')
        lines.append(f"| {lid} | {len(actual)} | {response_count} | {counts['partial']} | {counts['absent']} |")
    counts = Counter(f['status'] for l in review['lessons'] for f in l['objectives'])
    lines += [f'| รวม | {len(targets)} | {len(definitions)} | {counts["partial"]} | {counts["absent"]} |', '',
              'จำนวนหน้าที่เป็นหน่วยวิเคราะห์ที่เลือกในรอบนี้ ไม่ใช่คะแนนความครอบคลุมหรือเปอร์เซ็นต์ความชำนาญ. หน้าที่กว้างและแคบมีขนาดไม่เท่ากัน. ประโยคเดิมแต่ละรายการผูกหน้าที่หลักหนึ่งแห่งเพื่อให้นับซ้ำไม่ได้; บางประโยคใช้ประกอบหลายหน้าที่ได้ภายหลัง.', '',
              'L01 ดึง 9 รายการจาก seed catalog; L02 ดึงคำถาม 2 รายการและสถานะงาน 6 ตัวอย่าง; L03–L12 ใช้ตัวอย่างที่แต่งบทละ 10 รายการ. จำนวนไม่ได้คำนวณจากความครอบคลุมหน้าที่สื่อสารในหนังสือ. ตัวสร้างขยายหนึ่งประโยคเป็นเลือกความหมาย เลือกประโยคจากคำแปลไทย และเรียงคำเมื่อมีอย่างน้อยสามคำ. 346 นิยามจึงไม่เท่ากับ 346 สำนวนหรือสถานการณ์ใหม่.', '',
              '## ผลตรวจรายบทและ mapping ประโยคเดิม', '']
    for lesson in review['lessons']:
        lines += [f"### {lesson['lessonId']}", '', lesson['note'], '',
                  'หลักฐานที่ตรวจด้วยตา: ' + '; '.join(f"PDF {s['pdfPage']} / พิมพ์ {s['printedPage']} ({s['label']})" for s in lesson['sources']) + '.', '',
                  '| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |', '| --- | --- | --- | --- |']
        for f in lesson['objectives']:
            lines.append('| ' + ' | '.join(map(cell, [f['id'], f['name'], status_names[f['status']], f['gap']])) + ' |')
        lines += ['', '| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |', '| --- | --- | --- | --- |']
        for f in lesson['objectives']:
            for target_id in f['targetIds']:
                target = by_id[target_id]
                note = target['sourceStatus']
                if target_id in lesson['targetFlags']:
                    note += '; ' + lesson['targetFlags'][target_id]
                lines.append('| ' + ' | '.join(map(cell, [target_id, target['de'], f['id'], note])) + ' |')
        lines += ['']
    lines += [
        '## ข้อค้นพบด้านรูปแบบและความถูกต้องของการประเมิน', '',
        '- `*-a11-situation` ในตัวสร้างใช้คำแปลไทยของประโยคเป็น prompt และให้เลือกประโยคเยอรมัน. จึงเป็นหลักฐานจับคู่ความหมายแบบมีตัวเลือก ยังไม่ใช่การเลือกตอบในสถานการณ์สนทนาจริง แม้ชื่อ subskill จะเป็น `phrase_situation_choice`.',
        '- ตัวลวงเลือกจากประโยคอื่นในบทตามลำดับ ไม่ได้ทบทวนความเป็นไปได้ของการตอบในบริบท. เมื่อสร้างสถานการณ์ใหม่ต้องกำหนดข้อมูลที่ทำให้คำตอบเดียวเหมาะสม และตรวจความกำกวมรายข้อ.',
        '- Basic ใช้โจทย์เลือกความหมายเท่านั้น; Daily ใช้ชุดตัวเลือกและเรียงคำจากประโยคเดิม. คลังนี้ยังไม่มีคู่บทสนทนา เงื่อนไขเมนู/นัดหมาย หรือ rubric คำตอบอิสระสำหรับเป้าหมายที่ขาด.',
        '- L05 มีตัวอย่าง Akkusativ สามรายการในคลังประโยคก่อนหัวข้อนี้เป็นแกน L06. เป็นข้อเสนอให้ทบทวน prerequisite/ตำแหน่ง ไม่ใช่เหตุให้ลบประวัติหรือย้าย ID ทันที.',
        '- สถานะ `existing-published-*` ระบุที่มาของข้อมูลในระบบ ไม่ยืนยันว่าพิมพ์อยู่ในหนังสือ. การตรวจรอบนี้ยืนยันหน้าที่สื่อสารที่ระบุ พร้อมคงสถานะ product-authored ของตัวอย่างเดิม. ยังไม่ยกระดับทั้งคลังเป็น publisher-verified.', '',
        '## ลำดับงานออกแบบต่อ', '',
        '1. ปิดช่องว่างที่แทนเป้าหมายหลักผิดกลุ่มก่อน: L02 ข้อมูลบุคคล/อาชีพจริง, L05 ขอคำศัพท์/บรรยาย/อีเมล, L06 โทรศัพท์, L09 ร้านอาหาร. ทุกบทต้องมีรายการเป้าหมายหลักครบตามแหล่งที่ตรวจ โดยไม่มีโควตา 10 ประโยคหรือ 100 โจทย์.',
        '2. ตรวจแหล่งเสริมและ partner pages ที่จำเป็นต่อเป้าหมายใหม่ โดยเฉพาะต้นทาง Handynummer/สถานะงาน L02. บันทึก source metadata แยกจากข้อความที่ผู้เรียนเห็น.',
        '3. ออกแบบต้นแบบ L01 ตามหน้าที่ห้ากลุ่มที่พบ แล้วทดสอบก่อนขยายรูปแบบ. คัดตัวอย่าง/ตัวแปรและคู่ถามตอบจากเป้าหมายที่ตรวจแล้ว ไม่เพิ่มคำแทนในแม่แบบเพื่อให้ครบจำนวน.',
        '4. ก่อนเพิ่มกิจกรรมให้ทำแผนตอบรับ/บริบท/คำตอบที่ยอมรับและหลักฐานตามส่วนถัดไป. ระบุ ID ใหม่เมื่อเพิ่มเป้าหมายใหม่ และคง ID/คำตอบ/รอบฝึกของเดิม.', '',
        '## แผนหลักฐานสำหรับการออกแบบรอบถัดไป', '',
        'Objective IDs `Lxx-COMM-nn` ในรายงานเป็นรหัสงานออกแบบภายใน ไม่ใช่ target IDs ที่เปิดใช้งานหรือมีคะแนนแล้ว. รายการ missing ยังไม่มี task/response IDs, accepted answers หรือ eligibility ที่ทำงานจริง. ตารางนี้เป็นข้อกำหนดสำหรับรอบออกแบบ ไม่ใช่การเปิด adaptive policy ใหม่.', '',
        '| หลักฐานย่อย | ความยากและความช่วยเหลือที่เสนอ | สิ่งที่ต้องแยกวัด/งานต่อ |',
        '| --- | --- | --- |',
        '| เข้าใจความหมาย | เลือกจากข้อความสั้น มีตัวเลือก; ไม่ใช้คำแปลเป็นสถานการณ์จำลอง | ผูก target เดิมกับ comprehension; ไม่สรุปว่าสนทนาได้ |',
        '| ตอบบทสนทนา | ให้ผู้พูดก่อนหน้าและข้อมูลภาพ/บัตรบุคคล/เมนู/ตารางที่ตัดคำตอบกำกวม | เพิ่ม response ID และ `dialogue_response` ตาม schema ที่อนุมัติในรอบ implementation; รู้ความหมายไม่แทนการตอบได้ |',
        '| เรียงคำ | ให้คำทั้งหมดและจุดเริ่มประโยคเมื่อมีคำตอบได้หลายลำดับ | ใช้ subskill word order; supplied words เป็น assistance |',
        '| สร้างคำตอบ | ลดคำที่ให้จากเติมช่องเป็นพิมพ์เองเฉพาะเป้าหมายที่มี grader/accepted variants | ต้องออกแบบตัวตรวจและรูปแปรก่อนเปิดใช้; ชื่อ/อาชีพ/ความชอบอิสระไม่มีคำตอบเดียว |',
        '| ฟัง/พูด | ต้องมีเสียง/งานพูดและเกณฑ์เฉพาะ | การอ่าน การกดฟัง หรือเรียงคำไม่สร้างหลักฐานฟัง/พูดอัตโนมัติ |', '',
        'เริ่มสถานะ unknown ต่อ target/subskill. เก็บคำตอบแรก ความถูกต้อง เวอร์ชันและตัวช่วยก่อนตอบแยกกัน. หากผิดทักษะใดให้ฝึกทักษะนั้นด้วยบริบทชัดขึ้น; หากถูกแบบมีตัวช่วยยังไม่เลื่อนเป็น independent production. เกณฑ์จำนวนหลักฐานและช่วงทบทวนต้องกำหนดและตรวจเมื่อมี variants จริง ยังไม่กำหนดตัวเลข mastery จากรายงานนี้.', '',
        '| เส้นทาง | สถานะที่ตรวจจาก repository / งานที่ขาด |',
        '| --- | --- |',
        '| Learn → exposure | L03–L12 `A11PhraseLearning` เรียก `history.act("expose", { itemId })`; L01 ใช้หน้า Learn เดิม, L02 ใช้เนื้อหาเฉพาะบท. รายงานตรวจ 117 รายการที่ตัวสร้างคลังใช้ ไม่ยืนยันว่ารวมข้อความทุกหน้า Learn ของ L02 |',
        '| Response → target/subskill | ตัวสร้าง `build-a11-phrases.mjs` ผูก IDs เดิมใน 346 definitions; mapping ระหว่าง objective ในรายงานกับ targets ยังเป็น metadata ออกแบบ |',
        '| Answer → account evidence | `PracticeAccountSync` และ `learner_practice_sessions`; validator A1.1 phrase ใน migration generator. รอบนี้ไม่รันหรือเปลี่ยนฐานข้อมูล |',
        '| Evidence → next task | `planDailyPractice` เป็น history ranking เดิม; ยังขาด learner state ที่สอบเทียบและ durable decision reason ตาม assessment plan |',
        '| Objective ใหม่ → eligibility/graded response/selector | ยังไม่ implement; ต้องเชื่อม Learn → response → บัญชี → target/subskill state → next task จริงก่อนอ้างว่าเปิดใช้ |',
        '| การ deploy | งานนี้เป็น audit metadata/documentation เท่านั้น ไม่มีหน้าใหม่ ไม่มีการเปลี่ยนคะแนนหรือ deploy |', '',
        '## การตรวจรายงาน', '',
        'สคริปต์อ่านข้อมูลจริง ตรวจความตรงกันของ Learn catalog กับ inventory, จำนวนรายบท, IDs ไม่ซ้ำ, ทุก target ผูกหน้าที่หลักหนึ่งแห่ง และทุก response อ้าง target ที่มีจริง. Fingerprint ของข้อมูลที่ทบทวนทำให้การเปลี่ยนคลังต้องกลับมาตรวจแหล่งใหม่. `--check` ตรวจว่ารายงานที่เก็บไว้ตรงกับ metadata โดยไม่เขียนไฟล์. การผ่านสคริปต์ไม่ใช่หลักฐานความถูกต้องทางภาษา; หลักฐานเนื้อหาคือการอ่านหน้าที่ระบุด้วยตา.', '',
        'แผนระบบเดิมและช่องว่างการเชื่อมบัญชี: [A11_A12_ASSESSMENT_PLAN.md](A11_A12_ASSESSMENT_PLAN.md).', '',
    ]
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    content = render()
    if args.check:
        if not REPORT.exists() or REPORT.read_text() != content:
            raise SystemExit('Audit report is stale: run python3 scripts/exercise-mapping/audit-a11-phrases.py')
        print('Audit current: 12 lessons, 117 targets, 346 response definitions; all mappings valid.')
    else:
        REPORT.write_text(content)
        print(f'Wrote {REPORT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
