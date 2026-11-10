#!/usr/bin/env python3
"""Validate and render the internal, unregistered L01–L12 dialogue-content draft."""
import argparse
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIRECTORY = ROOT / 'docs/exercise-mapping'
REPORT = DIRECTORY / 'A11_A12_PHRASE_EXPANSION_DRAFT.md'


def load(name):
    return json.loads((DIRECTORY / name).read_text())


def cell(text):
    return str(text).replace('|', '\\|').replace('\n', ' ')


def render():
    draft = load('a11-phrase-expansion-draft.json')
    audit = load('a11-phrase-source-review.json')
    catalog = json.loads((ROOT / 'src/data/a11-phrase-targets.json').read_text())
    old = {t['id']: t for t in catalog}
    objectives = {o['id']: (l, o) for l in audit['lessons'] for o in l['objectives'] if o['status'] in ('partial', 'absent')}
    if draft['sourceSha256'] != audit['source']['sha256']:
        raise ValueError('Source fingerprint differs from the reviewed audit')
    if [l['lessonId'] for l in draft['lessons']] != [f'L{n:02}' for n in range(1, 13)]:
        raise ValueError('Draft must include L01–L12 exactly once in order')
    seen_objectives, seen_examples, seen_responses, seen_targets = set(), set(), set(), set()
    counts = Counter()
    for lesson in draft['lessons']:
        for o in lesson['objectives']:
            oid = o['objectiveId']
            if oid not in objectives or oid in seen_objectives:
                raise ValueError(f'Unknown or repeated objective: {oid}')
            seen_objectives.add(oid)
            source_lesson, source_objective = objectives[oid]
            if (lesson['lessonId'] != source_lesson['lessonId'] or o['sources'] != source_lesson['sources']
                    or o['legacyTargetIds'] != source_objective['targetIds'] or o['gap'] != source_objective['gap']):
                raise ValueError(f'{oid}: source or legacy binding drifted; re-review it')
            if not o['examples']:
                raise ValueError(f'{oid}: missing example')
            for e in o['examples']:
                if e['id'] in seen_examples or not e['id'].startswith(oid + '-D'):
                    raise ValueError(f"Invalid example ID: {e['id']}")
                seen_examples.add(e['id'])
                for field in ['context', 'precedingTurn', 'reply']:
                    if not e[field]:
                        raise ValueError(f"{e['id']}: missing {field}")
                for turn in ['precedingTurn', 'reply']:
                    if not e[turn]['de'] or not e[turn]['th']:
                        raise ValueError(f"{e['id']}: missing German/Thai turn")
                matches = [t['id'] for t in catalog if t['lessonId'] == lesson['lessonId'] and t['de'] == e['reply']['de']]
                if matches != e['legacyExactReplyMatches']:
                    raise ValueError(f"{e['id']}: exact-reply match metadata is stale")
                a = e['proposedAssessment']
                if a['status'] != 'design-only-not-registered' or a['id'] in seen_responses:
                    raise ValueError(f"{e['id']}: response must be unregistered and unique")
                seen_responses.add(a['id'])
                if a['targetId'] in seen_targets or a['targetId'] in old:
                    raise ValueError(f"{e['id']}: candidate target collides with another ID")
                seen_targets.add(a['targetId'])
                if a['requiredLearnedContent'] != [e['id'] + '-preceding-turn', e['id'] + '-reply']:
                    raise ValueError(f"{e['id']}: both dialogue turns need planned teaching eligibility")
                if a['difficulty'] not in (1, 2) or not a['difficultyRationale']:
                    raise ValueError(f"{e['id']}: missing justified provisional demand level")
                if a['difficultyStatus'] != 'provisional-design-level-not-learner-mastery':
                    raise ValueError(f"{e['id']}: difficulty must remain a design setting")
                if a['profileId'] not in draft['assessmentProfiles']:
                    raise ValueError(f"{e['id']}: missing assessment profile")
                if e['sourceStatus'] != 'product-authored-example-for-reviewed-function':
                    raise ValueError(f"{e['id']}: authored wording must retain its source status")
                counts[lesson['lessonId']] += 1
    if seen_objectives != set(objectives):
        raise ValueError(f'Uncovered objectives: {set(objectives) - seen_objectives}')
    lines = ['# ร่างเติมคลังประโยคและคู่สนทนา L01–L12', '',
             f"วันที่จัดทำ: {draft['authoredAt']}. สถานะ: ร่างเนื้อหาและแผนประเมินภายใน ยังไม่ใช่คลังที่เปิดให้ผู้เรียนใช้.", '',
             '## สิ่งที่ร่างนี้เพิ่ม', '',
             f'มีตัวอย่าง {sum(counts.values())} สถานการณ์สำหรับ {len(seen_objectives)} หน้าที่สื่อสารที่ audit ระบุว่ามีบางส่วนหรือไม่มีในคลัง. ตัวอย่างทุกชิ้นมีบริบท คำพูดก่อนหน้า คำตอบ และคำแปลไทย. จำนวนนี้เป็นจำนวนตัวอย่างการสอน ไม่ใช่จำนวนประโยคไม่ซ้ำ คะแนน หรือหลักฐานว่าออกแบบครบทุกกิจกรรมแล้ว.', '',
             'หน้าที่สื่อสารและแหล่งอ้างอิงอิงการตรวจด้วยตาใน `a11-phrase-source-review.json`. ประโยค ตัวละคร ป้ายราคา ตารางนัด ประกาศ และข้อมูลเทศกาลในร่างนี้เรียบเรียงใหม่สำหรับผลิตภัณฑ์. ไม่ใช่บทสนทนาหรือเฉลยที่คัดจากหนังสือ. ข้อมูลเทศกาลและตารางเดินทางที่ระบุว่าสมมติไม่ใช่ข้อเท็จจริงสำหรับการเดินทางจริง.', '',
             'ตัวอย่างได้รับการอ่านทบทวนโดยผู้เขียนร่าง แต่ยังรอตรวจโดยผู้สอนอิสระ. บริบทภาษาไทยเป็นบันทึกให้ผู้ออกแบบ ไม่ใช่ข้อความ prompt ที่พร้อมแสดง. ก่อนสร้างโจทย์ต้องเปลี่ยนเป็นภาพหรือข้อมูลข้อเท็จจริงที่ไม่แปลคำตอบให้ตรง ๆ และตรวจคำศัพท์ที่ผู้เรียนเคยพบ.', '',
             '## จำนวนตัวอย่างรายบท', '', '| บท | หน้าที่ที่เติม | สถานการณ์ตัวอย่าง |', '| --- | ---: | ---: |']
    for lesson in draft['lessons']:
        lines.append(f"| {lesson['lessonId']} | {len(lesson['objectives'])} | {counts[lesson['lessonId']]} |")
    lines += ['', '## คู่สนทนาและบริบท', '',
              'รหัส `Lxx-COMM-yy` อ้างหน้าที่ใน audit. รหัส `…-Dnn` ระบุตัวอย่างร่าง. เลขหน้าและ provenance ด้านล่างเป็น metadata ภายในเท่านั้น.', '']
    for lesson in draft['lessons']:
        lines += [f"### {lesson['lessonId']}", '']
        for o in lesson['objectives']:
            lines += [f"#### {o['objectiveId']} · {o['name']}", '', f"ช่องว่างที่เติม: {o['gap']}", '',
                      'เป้าหมายเดิมที่เกี่ยวข้อง: ' + (', '.join(f'`{i}`' for i in o['legacyTargetIds']) or 'ยังไม่มีในคลังเดิม') + '.', '',
                      'หลักฐานหน้าที่: ' + '; '.join(f"PDF {s['pdfPage']} / พิมพ์ {s['printedPage']} ({s['label']})" for s in o['sources']) + '.', '',
                      '| ตัวอย่าง | ข้อมูลสถานการณ์ | คนก่อนหน้าพูด | ตัวอย่างคำตอบ |', '| --- | --- | --- | --- |']
            for e in o['examples']:
                prompt = f"{e['precedingTurn']['de']}<br>{e['precedingTurn']['th']}"
                reply = f"{e['reply']['de']}<br>{e['reply']['th']}"
                lines.append('| ' + ' | '.join(map(cell, [e['id'], e['context'], prompt, reply])) + ' |')
            lines += ['']
    lines += ['## ขอบเขตภาษาและคำตอบที่ต้องตรวจต่อ', '',
              '- L01 ต้องแยก du กับ Sie และคำตอบตามบทบาท. L03 ต้องแยก ja/nein/doch จากข้อเท็จจริงและรูปคำถาม ไม่ตัดสินจากคำแปลไทยเพียงอย่างเดียว.',
              '- L04 ใช้คำถามเกี่ยวกับตู้แบบที่ไม่เพิ่ม den/ihn เป็น prerequisite ก่อน L06. Noun ในประโยคคงรูปการกและคำย่อที่ถูกต้อง; คำศัพท์เดี่ยวในกิจกรรมจริงต้องใช้ Artikel และ component ร่วม.',
              '- L05 สอน Ich weiß nicht เป็นสำนวนที่ต้นทางบทนี้ใช้ ไม่ถือว่าได้เรียนการผัน wissen ทุกบุคคล. ตัวอย่างอีเมลใช้โดเมน example.com และเป็นข้อมูลสมมติ.',
              '- L08 เวลา 15:30 ตอบได้ทั้ง halb vier และ fünfzehn Uhr dreißig รวมรูปตัวเลขตามรูปแบบงาน. ห้ามใช้เวลาเดียวกันสองรูปเป็นตัวลวงคนละคำตอบ. ยังต้องตรวจ accepted variants ก่อนเปิดตัวตรวจ.',
              '- L09 ต้องแสดงเมนูและสินค้าที่หมด หากยอมเปลี่ยนอาหารต้องมีข้อมูลว่าลูกค้ายอมรับอะไร. การปฏิเสธกับการรับอาหารอาจถูกได้ทั้งคู่ถ้าไม่กำหนดความต้องการ.',
              '- L10 ประกาศในร่างเป็นงานอ่าน. ถ้าจะประเมินการฟังต้องมีสื่อเสียงที่ตรวจแล้วและบันทึกการใช้ transcript เป็นความช่วยเหลือ. คำเตือนและสื่อเสียงยังต้องออกแบบเพิ่มก่อนถือว่าครบ Durchsagen verstehen.',
              '- L11 ระบุช่วงเวลาและลำดับจากปฏิทินให้ชัด. L12 แยกเวลาอดีตของการเดินทางออกจากเวลาปัจจุบันของป้ายเทศกาล และระบุบริบทฤดูกาลเยอรมนี.',
              '- ทุกบทยังต้องทบทวนคำตอบภาษาเยอรมันที่เทียบเท่า คำแปลไทย ตัวลวง และความรู้ก่อนเรียนรายคำ. ตัวอย่างคำตอบในรายงานไม่ใช่ acceptedAnswers ที่พร้อมนำไปตรวจคำตอบอิสระ.', '',
              '## แผนประเมินตามเป้าหมายและทักษะย่อย', '',
              (
                  'แต่ละตัวอย่างมี `proposedAssessment.id`, candidate `targetId`, `profileId`, ระดับความยากพร้อมเหตุผลเฉพาะกลุ่มเป้าหมาย และรายการทั้งสอง turn ที่ต้องสอนก่อนฝึก. '
                  'ระดับ 1 ใช้สำนวนสูตรสั้นหรืออ่านข้อมูลหนึ่งเที่ยว; ระดับ 2 ต้องเชื่อมข้อมูลเวลา บทบาท หรือการยืนยัน/ปฏิเสธ. '
                  'ตัวเลขนี้เป็นค่าร่างของเนื้อหา ไม่ใช่ความชำนาญผู้เรียน. '
                  'ดู JSON สำหรับ mapping รายตัวอย่างทั้งหมด. '
                  'IDs เหล่านี้ยังไม่ลงทะเบียนใน content catalog หรือฐานคำตอบ จึงยังไม่มี eligibility จริง. '
                  'หากคำตอบตรงประโยคเดิม field `legacyExactReplyMatches` จะระบุไว้ให้ตรวจ reuse. '
                  'ห้ามสร้าง target ซ้ำหรือ alias ด้วยข้อความตรงกันอัตโนมัติ; ต้องตรวจความหมายและบริบทก่อนเลือก ID เดิม.'
              ), '',
              '| Profile | หลักฐาน | ระดับและความช่วยเหลือ | ข้อจำกัดการตรวจ |',
              '| --- | --- | --- | --- |']
    for name, p in draft['assessmentProfiles'].items():
        lines.append('| ' + ' | '.join(map(cell, [name, p['subskill'], f"{p['difficulty']}: {p['difficultyRationale']}; assistance: {', '.join(p['assistance'])}", p['gradingStatus']])) + ' |')
    lines += ['', 'ข้อเสนอสำหรับ variant ภายในเป้าหมายเดียวกัน:', '',
              '| ทักษะย่อย | ตัวช่วยเริ่มต้น | งานถัดไปเมื่อมีหลักฐานเหมาะสม | สถานะ |',
              '| --- | --- | --- | --- |',
              '| comprehension | ข้อความและตัวเลือกความหมาย | บริบทใหม่ที่ยังวัดความหมาย ไม่เลื่อนเป็นสนทนาโดยอัตโนมัติ | คลังเดิมมี; ต้องตรวจตัวลวงใหม่ |',
              '| dialogue response | คำพูดก่อนหน้าและข้อมูลสถานการณ์ พร้อมตัวเลือก | เปลี่ยนข้อเท็จจริงหรือบทบาท แล้วลดตัวช่วยเฉพาะทักษะนี้ | มีคู่สนทนาร่าง; ตัวลวงและ task ยังไม่ implement |',
              '| word order | คำทั้งหมดและคำขึ้นต้นเมื่อจำเป็น | ลดคำที่ให้เฉพาะเมื่อมี grader สำหรับรูปแปร | ยังต้องออกแบบรายข้อ; supplied words ไม่ใช่ production |',
              '| bounded production | facts ชัดเจน มีช่องคำหรือโครงประโยค | เรียกคืนคำตอบที่มี accepted variants ตรวจแล้ว | ยังไม่เขียน task/ตัวตรวจ; ข้อมูลส่วนตัวอิสระไม่ตรวจด้วยเฉลยเดียว |',
              '| announcement reading | บัตรประกาศและตัวเลือกข้อมูล | ข้อความใหม่ที่เปลี่ยนหมายเลข/สถานที่; listening แยกต่างหาก | ร่าง 2 ตัวอย่าง ไม่มีเสียง |', '',
              'เริ่มสถานะ unknown ต่อ target/subskill. ใช้คำตอบแรก ความถูกต้อง และการใช้ตัวช่วยที่บันทึกจริง. เมื่อผิดให้ฝึกทักษะเดิมด้วยบริบทชัดขึ้น ไม่สรุปว่าอ่อนทั้งบท. การตอบถูกแบบมีตัวเลือกไม่ปลดล็อก production อัตโนมัติ. เกณฑ์เพิ่มความยาก จำนวนหลักฐาน และช่วงทบทวนยังรอ variants จริงและการตรวจนโยบาย. ต้องเก็บเหตุผลการเลือกโจทย์และรักษาคิว/คำตอบแรกของรอบเดิม.', '',
              '## Learn → evidence → next task', '',
              '| ขั้น | ระบบเดิม | งานสำหรับร่างใหม่นี้ |', '| --- | --- | --- |',
              '| Learn → target exposure | คลังเดิมใช้ item_exposures และหน้าเรียนเฉพาะบท | ตัดสิน reuse/new IDs และสอนทั้งคำพูดก่อนหน้าและคำตอบ; ยังไม่มี account exposure ของ draft |',
              '| Response → target/subskill | 346 definitions เดิมมี binding และตัวตรวจเดิม | candidate IDs/profile อยู่ใน JSON; ต้องเพิ่ม reviewed tasks, variants และ private server definitions |',
              '| First answer + assistance → account | PracticeAccountSync → learner_practice_sessions | ใช้ store เดิมและการแยกบัญชี; ต้องตรวจ resume/queue/first answer กับนิยามใหม่ |',
              '| History → learner state | history ranking ของ planDailyPractice | ต้องแยก contextual response จาก translation choices เดิม; ไม่ยกระดับผลเก่าเป็นหลักฐานทักษะใหม่ |',
              '| State → next task | daily selector เดิม | ต้องเชื่อม variants และเหตุผลเลือกงาน; ยังไม่มี selection ของ draft |',
              '| Home/manual/after-learning entry | มีระบบเดิมตาม assessment plan | ต้องต่อเป้าหมายใหม่เมื่อเนื้อหาพร้อม โดย after-learning เริ่มข้อแรกตรง ๆ |',
              '| Deployment | ไม่มีการ deploy ในงานนี้ | รอตรวจภาษา กิจกรรม ตัวตรวจ บัญชี และ eligibility ก่อนเปิดให้ผู้เรียน |', '',
              '## วิธีตรวจไฟล์ร่าง', '',
              'รัน `python3 scripts/exercise-mapping/review-a11-phrase-expansion.py` เพื่อสร้างรายงาน หรือเติม `--check` เพื่อตรวจโดยไม่เขียนไฟล์. สคริปต์ตรวจว่าทั้ง 41 หน้าที่มีตัวอย่าง, IDs ไม่ซ้ำ, แหล่งและ legacy mapping ตรงกับ audit, แต่ละตัวอย่างมีสองภาษาและ profile การประเมิน. การผ่านตรวจนี้เป็นการตรวจโครงสร้างและความตรงกันของข้อมูล ไม่ใช่การรับรองภาษาโดยผู้สอนหรือผลทดสอบกิจกรรมในเว็บ.', '',
              'เอกสารที่เกี่ยวข้อง: [ผลตรวจคลังเดิม](A11_A12_PHRASE_SOURCE_AUDIT.md), [แผนประเมินระบบเดิม](A11_A12_ASSESSMENT_PLAN.md).', '']
    return '\n'.join(lines), sum(counts.values()), len(seen_objectives)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    content, example_count, objective_count = render()
    if args.check:
        if not REPORT.exists() or REPORT.read_text() != content:
            raise SystemExit('Draft report stale: run python3 scripts/exercise-mapping/review-a11-phrase-expansion.py')
        print(f'Draft current: 12 lessons, {objective_count} objectives, {example_count} authored examples. No runtime registration.')
    else:
        REPORT.write_text(content)
        print(f'Wrote {REPORT.relative_to(ROOT)}: {example_count} examples.')


if __name__ == '__main__':
    main()
