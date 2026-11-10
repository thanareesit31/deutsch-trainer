#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build 35 product-authored bounded grammar transfer tasks; never rewrite published tasks."""
import argparse
import json
from pathlib import Path


def part(text, role, label, position=None):
    value = dict(text=text, role=role, label=label)
    if position: value['position'] = position
    return value


def statement(subject, verb, rest):
    return [part(subject, 'subject', 'ประธาน', 'ตำแหน่ง 1'), part(verb, 'verb', 'กริยาหลัก (ผันแล้ว)', 'ตำแหน่ง 2'), part(rest, 'other', 'ข้อมูลที่บอก')]


def modal(subject, verb, rest, infinitive):
    return [part(subject, 'subject', 'ประธาน', 'ตำแหน่ง 1'), part(verb, 'auxiliary', 'กริยาช่วย (ผันแล้ว)', 'ตำแหน่ง 2'), part(rest, 'other', 'ข้อมูลประกอบ'), part(infinitive, 'verb', 'กริยารูป Infinitiv', 'ท้ายประโยค')]


def imperative(verb, rest):
    return [part(verb, 'verb', 'กริยาคำขอสุภาพ', 'ตำแหน่ง 1'), part('Sie', 'subject', 'ประธานแบบสุภาพ'), part(rest, 'other', 'สิ่งที่ขอให้ทำ')]


def timed_statement(subject, verb, time, middle=None):
    parts = statement(subject, verb, middle)[:2]
    if middle: parts.append(part(middle, 'other', 'ข้อมูลประกอบ'))
    return parts + [part(time, 'time', 'กลุ่มบอกเวลา')]


def row(context, cue, answer, parts, meaning, wrong, reason, options=None, prompt=None):
    return dict(context=context, cue=cue, answer=answer, parts=parts, meaning=meaning, wrong=wrong, reason=reason, options=options, prompt=prompt)


TOPICS = [
('L15', 'L15-possessivartikel', 'possessive_reference_and_inflection', [
 row([['เจ้าของ', 'Jonas (ผู้ชาย) เป็นเจ้าของโซฟา'], ['คำนามต้นทาง', 'das Sofa']], 'Jonas hat ein Sofa. Ich finde ___ Sofa bequem.', 'sein', statement('Ich', 'finde', 'sein Sofa bequem.'), 'ฉันคิดว่าโซฟาของเขานั่งสบาย', ('seinen', 'case_ending', 'Sofa เป็นเพศกลาง จึงใช้ sein ใน Akkusativ; seinen ใช้กับคำนามเพศชาย'), 'เจ้าของคือ Jonas จึงใช้ราก sein; Sofa เป็นเพศกลางและเป็นกรรม จึงคงรูป sein', ['sein', 'seinen', 'ihr']),
 row([['เจ้าของ', 'Mira (ผู้หญิง) เป็นเจ้าของสวน'], ['คำนามต้นทาง', 'der Garten']], 'Mira hat einen Garten. Ich mag ___ Garten.', 'ihren', statement('Ich', 'mag', 'ihren Garten.'), 'ฉันชอบสวนของเธอ', ('ihr', 'case_ending', 'Garten เป็นกรรมเพศชายหลัง mag จึงใช้ ihren แทน ihr'), 'เจ้าของคือ Mira จึงใช้ ihr; Garten เป็นกรรมเพศชาย จึงเปลี่ยนเป็น ihren', ['ihren', 'ihr', 'seinen']),
 row([['เจ้าของ', 'Mira (ผู้หญิง)'], ['สิ่งที่ชี้ให้ดู', 'die Küche']], 'Das ist ___.', 'ihre Küche', statement('Das', 'ist', 'ihre Küche.'), 'นี่คือห้องครัวของเธอ', ('ihr Küche', 'case_ending', 'Küche เป็นเพศหญิง จึงต้องใช้ ihre Küche'), 'เติมเฉพาะกลุ่มคำนาม: เจ้าของหญิงใช้ ihr และ Küche เพศหญิงทำให้เป็น ihre Küche', prompt='เขียนกลุ่มคำในช่องว่าง ใช้ Küche และบอกว่าเป็นของ Mira'),
 row([['เจ้าของ', 'Jonas (ผู้ชาย)'], ['คำนามต้นทาง', 'der Balkon']], 'Ich finde ___ schön.', 'seinen Balkon', statement('Ich', 'finde', 'seinen Balkon schön.'), 'ฉันคิดว่าระเบียงของเขาสวย', ('sein Balkon', 'case_ending', 'Balkon เป็นกรรมเพศชายหลัง finde จึงเปลี่ยน sein เป็น seinen'), 'เขียนเฉพาะกลุ่มกรรม: เจ้าของ Jonas ใช้ sein และ der Balkon ใน Akkusativ เป็น seinen Balkon', prompt='เขียนกลุ่มคำในช่องว่าง ใช้ Balkon และบอกว่าเป็นของ Jonas'),
 row([['เจ้าของ', 'Jonas (ผู้ชาย)'], ['คำนามต้นทาง', 'das Zimmer'], ['ข้อมูลที่ต้องบอก', 'ห้องของเขาสว่าง'], ['รูปคำที่ให้', 'das Zimmer · sein · hell'], ['คำศัพท์ประกอบ', 'hell = สว่าง'], ['คำเริ่มต้น', 'Sein']], '', 'Sein Zimmer ist hell.', statement('Sein Zimmer', 'ist', 'hell.'), 'ห้องของเขาสว่าง', ('Seinen Zimmer ist hell.', 'case_ending', 'Zimmer เป็นประธานเพศกลาง จึงใช้ Sein Zimmer ไม่ใช่ Seinen Zimmer'), 'เริ่มด้วยกลุ่มประธาน Sein Zimmer แล้ววาง ist ตำแหน่ง 2 และ hell บอกลักษณะห้อง', prompt='เขียนหนึ่งประโยคตามข้อมูล เริ่มด้วย Sein ใช้ Zimmer และ hell แล้วผัน sein ให้ถูกต้อง'),
]),
('L16', 'L16-temporale-praepositionen', 'temporal_relation', [
 row([['เวลาตอนนี้', '14:00'], ['เวลาที่ช่างจะมาถึง', '16:00'], ['กลุ่มเวลาที่ให้', 'zwei Stunden']], 'Der Techniker kommt ___ zwei Stunden.', 'in', timed_statement('Der Techniker', 'kommt', 'in zwei Stunden.'), 'ช่างจะมาในอีกสองชั่วโมง', ('vor', 'temporal_relation', 'vor zwei Stunden หมายถึงสองชั่วโมงก่อน แต่ข้อมูลนี้บอกเวลาที่กำลังจะมาถึง'), 'จาก 14:00 ถึง 16:00 เป็นเวลาอีกสองชั่วโมงในอนาคต จึงใช้ in', ['in', 'vor', 'um']),
 row([['เวลานัด', '11:00'], ['เวลาที่ Lina โทร', '10:30'], ['เหตุการณ์อ้างอิง', 'der Termin']], 'Lina telefoniert ___ dem Termin.', 'vor', timed_statement('Lina', 'telefoniert', 'vor dem Termin.'), 'Lina โทรศัพท์ก่อนเวลานัด', ('nach', 'temporal_relation', 'nach dem Termin แปลว่าหลังนัด แต่ 10:30 อยู่ก่อนนัด 11:00'), 'เวลาที่โทรอยู่ก่อนเหตุการณ์อ้างอิง จึงใช้ vor dem Termin; ไม่ได้หมายถึงอดีตจากเวลาตอนนี้', ['vor', 'nach', 'in']),
 row([['เวลาตอนนี้', '08:00'], ['เวลาที่ B จะมาถึง', '10:00'], ['รูปคำนามที่ให้', 'zwei Stunden']], 'Ich komme ___.', 'in zwei Stunden', timed_statement('Ich', 'komme', 'in zwei Stunden.'), 'ฉันจะมาในอีกสองชั่วโมง', ('vor zwei Stunden', 'temporal_relation', 'เวลามาถึงเป็นอนาคตจากตอนนี้ จึงต้องใช้ in ไม่ใช่ vor'), 'เขียนกลุ่มเวลาในอนาคตจากตอนนี้: in zwei Stunden; โจทย์ให้รูปคำนามแล้ว จึงไม่ได้วัดการผันคำนามเอง', prompt='เติมเฉพาะกลุ่มเวลา ใช้ zwei Stunden และเลือกคำบุพบทให้ตรงข้อมูล'),
 row([['คอร์สเลิก', '17:00'], ['เวลาเจอกัน', '17:30'], ['คำนามต้นทาง', 'der Kurs']], 'Wir treffen uns ___.', 'nach dem Kurs', timed_statement('Wir', 'treffen', 'nach dem Kurs.', 'uns'), 'พวกเราเจอกันหลังคอร์สเลิก', ('nach der Kurs', 'case_ending', 'Kurs เป็นเพศชาย หลัง nach ใช้ Dativ จึงเป็น nach dem Kurs'), 'พบกันหลังคอร์สและ nach ใช้ Dativ: der Kurs เปลี่ยนเป็น dem Kurs', prompt='เติมเฉพาะกลุ่มเวลา ใช้ Kurs พร้อมคำบุพบทและ Artikel ที่ถูกต้อง'),
 row([['เวลาตอนนี้', 'วันจันทร์'], ['เวลาเจอกัน', 'วันพุธ'], ['กลุ่มคำนามที่ให้', 'zwei Tagen'], ['กริยารูปตั้งต้น', 'sich treffen = เจอกัน'], ['คำเริ่มต้น', 'Wir']], '', 'Wir treffen uns in zwei Tagen.', timed_statement('Wir', 'treffen', 'in zwei Tagen.', 'uns'), 'พวกเราจะเจอกันในอีกสองวัน', ('Wir treffen uns vor zwei Tagen.', 'temporal_relation', 'วันพุธยังมาไม่ถึงเมื่อเทียบกับวันจันทร์ จึงใช้ in zwei Tagen ไม่ใช่ vor'), 'นับจากวันจันทร์ไปวันพุธเป็นอีกสองวัน ใช้ in zwei Tagen; Wir เป็นประธานและ treffen อยู่ตำแหน่ง 2', prompt='เขียนหนึ่งประโยคตามข้อมูล เริ่มด้วย Wir ใช้คำที่กำหนดและเพิ่มกลุ่มเวลาที่ถูกต้อง'),
]),
('L17', 'L17-werden', 'werden_conjugation', [
 row([['ผู้พูด', 'พี่ชายสองคน: Leo und Ben'], ['คำอาชีพที่ให้', 'die Ärzte → Ärzte หลัง werden']], 'Leo und Ben ___ Ärzte.', 'werden', statement('Leo und Ben', 'werden', 'Ärzte.'), 'Leo กับ Ben จะเป็นแพทย์', ('wird', 'subject_verb_agreement', 'Leo und Ben เป็นหลายคน จึงใช้ werden ไม่ใช่ wird'), 'ประธานสองคนเทียบกับ sie พหูพจน์ จึงผัน werden เป็น werden', ['werden', 'wird', 'wirst']),
 row([['ผู้พูด', 'ฉัน: Lea'], ['คำอาชีพที่ให้', 'die Pilotin → Pilotin หลัง werden']], 'Ich ___ Pilotin.', 'werde', statement('Ich', 'werde', 'Pilotin.'), 'ฉันจะเป็นนักบินหญิง', ('wird', 'subject_verb_agreement', 'เมื่อประธานเป็น Ich ต้องใช้ werde ไม่ใช่ wird'), 'Ich ใช้ werde; เมื่อบอกอาชีพหลัง werden แบบนี้ไม่เติม ein/eine', ['werde', 'wird', 'werdet']),
 row([['ผู้ที่กล่าวถึง', 'du'], ['คำอาชีพที่ให้', 'der Koch → Koch หลัง werden'], ['รูปกริยาต้นทาง', 'werden']], 'Du ___.', 'wirst Koch', statement('Du', 'wirst', 'Koch.'), 'เธอจะเป็นพ่อครัว', ('werde Koch', 'subject_verb_agreement', 'Du ผัน werden เป็น wirst; werde ใช้กับ ich'), 'เขียนภาคแสดงที่กำหนด: du ใช้ wirst ตามด้วย Koch โดยไม่เติม ein', prompt='เติมกริยา werden ที่ผันแล้วพร้อมอาชีพ Koch โดยไม่เขียน Du ซ้ำ'),
 row([['ผู้พูด', 'wir'], ['คำนามที่ให้', 'die Eltern → Eltern หลัง werden'], ['รูปกริยาต้นทาง', 'werden']], 'Wir ___.', 'werden Eltern', statement('Wir', 'werden', 'Eltern.'), 'พวกเราจะเป็นพ่อแม่', ('wird Eltern', 'subject_verb_agreement', 'Wir ใช้ werden ไม่ใช่ wird'), 'ประธาน Wir ต้องใช้ werden แล้วตามด้วยสถานะ Eltern', prompt='เติมกริยา werden ที่ผันแล้วพร้อม Eltern โดยไม่เขียน Wir ซ้ำ'),
 row([['บุคคล', 'Paul'], ['ข้อมูล', 'เขาจะเป็นพ่อครัว'], ['คำอาชีพที่ให้', 'der Koch = พ่อครัว'], ['กริยาต้นทาง', 'werden'], ['คำเริ่มต้น', 'Paul']], '', 'Paul wird Koch.', statement('Paul', 'wird', 'Koch.'), 'Paul จะเป็นพ่อครัว', ('Paul werden Koch.', 'subject_verb_agreement', 'Paul เป็นคนเดียว จึงผันเป็น wird ไม่ใช่ werden'), 'Paul เป็นบุรุษที่สามเอกพจน์ ใช้ wird ตำแหน่ง 2 ตามด้วย Koch; ไม่ได้วัดการคิดอาชีพเอง', prompt='เขียนหนึ่งประโยคตามข้อมูล เริ่มด้วย Paul ใช้ werden และ Koch'),
]),
('L17', 'L17-wollen', 'wollen_conjugation', [
 row([['ผู้ที่เล่าแผน', 'du'], ['แผน', 'เรียนภาษาเยอรมัน']], 'Du ___ Deutsch lernen.', 'willst', modal('Du', 'willst', 'Deutsch', 'lernen.'), 'เธอตั้งใจจะเรียนภาษาเยอรมัน', ('will', 'subject_verb_agreement', 'Du ต้องใช้ willst; will ใช้กับ ich หรือบุคคลที่สามเอกพจน์'), 'ผัน wollen ตาม Du เป็น willst ส่วน lernen เป็น Infinitiv ท้ายประโยค', ['willst', 'will', 'wollt']),
 row([['ผู้ที่เล่าแผน', 'Nora und Ali'], ['แผน', 'เดินทางไป Berlin']], 'Nora und Ali ___ nach Berlin reisen.', 'wollen', modal('Nora und Ali', 'wollen', 'nach Berlin', 'reisen.'), 'Nora กับ Ali ตั้งใจจะเดินทางไป Berlin', ('will', 'subject_verb_agreement', 'Nora und Ali เป็นสองคน จึงใช้ wollen ไม่ใช่ will'), 'ประธานหลายคนใช้ wollen; nach Berlin เป็นจุดหมายและ reisen อยู่ท้าย', ['wollen', 'will', 'wollt']),
 row([['ผู้พูด', 'ich'], ['แผนที่กำหนด', 'Deutsch lernen'], ['กริยาที่ต้องใช้', 'wollen']], 'Ich ___.', 'will Deutsch lernen', modal('Ich', 'will', 'Deutsch', 'lernen.'), 'ฉันตั้งใจจะเรียนภาษาเยอรมัน', ('will lernen Deutsch', 'verb_position', 'หลัง will วาง Deutsch ก่อน แล้วเก็บ Infinitiv lernen ไว้ท้ายประโยค'), 'เขียนภาคแสดงจากคำที่ให้: ich ใช้ will และ lernen ต้องอยู่ท้าย', prompt='เติมเฉพาะส่วนหลัง Ich ใช้ wollen ที่ผันแล้วและ Deutsch lernen'),
 row([['ผู้พูด', 'wir'], ['แผนที่กำหนด', 'im Ausland leben'], ['กริยาที่ต้องใช้', 'wollen']], 'Wir ___.', 'wollen im Ausland leben', modal('Wir', 'wollen', 'im Ausland', 'leben.'), 'พวกเราตั้งใจจะอยู่ต่างประเทศ', ('will im Ausland leben', 'subject_verb_agreement', 'Wir ต้องใช้ wollen ไม่ใช่ will'), 'Wir ใช้ wollen; im Ausland บอกสถานที่ ส่วน leben เป็น Infinitiv อยู่ท้าย', prompt='เติมเฉพาะส่วนหลัง Wir ใช้ wollen ที่ผันแล้วและ im Ausland leben'),
 row([['บุคคล', 'Mira'], ['แผนในวันพรุ่งนี้', 'เรียนภาษาเยอรมัน'], ['รูปคำที่ให้', 'morgen · Deutsch · lernen'], ['คำศัพท์ประกอบ', 'morgen = พรุ่งนี้; lernen = เรียน'], ['กริยาที่ต้องใช้', 'wollen'], ['คำเริ่มต้น', 'Mira']], '', 'Mira will morgen Deutsch lernen.', [part('Mira', 'subject', 'ประธาน', 'ตำแหน่ง 1'), part('will', 'auxiliary', 'กริยาช่วย (ผันแล้ว)', 'ตำแหน่ง 2'), part('morgen', 'time', 'เวลา'), part('Deutsch', 'other', 'สิ่งที่เรียน'), part('lernen.', 'verb', 'กริยารูป Infinitiv', 'ท้ายประโยค')], 'Mira ตั้งใจจะเรียนภาษาเยอรมันพรุ่งนี้', ('Mira will lernen morgen Deutsch.', 'verb_position', 'lernen เป็น Infinitiv จึงต้องอยู่ท้าย ไม่วางก่อนข้อมูลเวลาและภาษา'), 'Mira เป็นคนเดียวใช้ will ตำแหน่ง 2; morgen บอกเวลาและ lernen ปิดท้ายประโยค', prompt='เขียนหนึ่งประโยคตามข้อมูล เริ่มด้วย Mira ใช้ wollen และเก็บ lernen ไว้ท้าย'),
]),
('L17', 'L17-mit-ohne', 'preposition_case_inflection', [
 row([['สิ่งที่ไปด้วย', 'ein Kind'], ['คำบุพบทที่กำหนด', 'mit']], 'Eva fährt mit ___ Kind.', 'einem', statement('Eva', 'fährt', 'mit einem Kind.'), 'Eva เดินทางไปกับเด็กหนึ่งคน', ('einen', 'case_ending', 'Kind เป็นเพศกลางและ mit ใช้ Dativ จึงเป็น einem Kind ไม่ใช่ einen'), 'โจทย์ให้ mit มาแล้ว วัดการผัน Artikel: ein Kind เปลี่ยนเป็น einem Kind', ['einem', 'einen', 'ein']),
 row([['สิ่งที่ไม่ได้พาไป', 'ein Hund'], ['คำบุพบทที่กำหนด', 'ohne']], 'Omar reist ohne ___ Hund.', 'einen', statement('Omar', 'reist', 'ohne einen Hund.'), 'Omar เดินทางโดยไม่พาสุนัขไปหนึ่งตัว', ('einem', 'case_ending', 'ohne ใช้ Akkusativ; ein Hund เพศชายเปลี่ยนเป็น einen Hund ไม่ใช่ einem'), 'โจทย์ให้ ohne มาแล้ว วัดการผัน ein Hund ใน Akkusativ เป็น einen Hund', ['einen', 'einem', 'ein']),
 row([['คำนามต้นทาง', 'eine Freundin'], ['คำบุพบทที่ต้องใช้', 'mit']], 'Ich komme ___.', 'mit einer Freundin', statement('Ich', 'komme', 'mit einer Freundin.'), 'ฉันมากับเพื่อนผู้หญิงหนึ่งคน', ('mit eine Freundin', 'case_ending', 'mit ใช้ Dativ จึงเปลี่ยน eine Freundin เป็น einer Freundin'), 'เขียนกลุ่มคำที่กำหนด: mit + Dativ ทำให้ eine เปลี่ยนเป็น einer; ไม่ได้วัดการเลือกว่ามาด้วยหรือไม่', prompt='เติมกลุ่มคำด้วย mit และ eine Freundin โดยเปลี่ยน Case ให้ถูกต้อง'),
 row([['คำนามต้นทาง', 'ein Schirm'], ['คำบุพบทที่ต้องใช้', 'ohne']], 'Ich gehe ___.', 'ohne einen Schirm', statement('Ich', 'gehe', 'ohne einen Schirm.'), 'ฉันไปโดยไม่มีร่ม', ('ohne einem Schirm', 'case_ending', 'ohne ใช้ Akkusativ; ein Schirm เพศชายจึงเป็น einen Schirm'), 'ใช้ ohne ตามที่กำหนด แล้วผัน ein Schirm เป็น einen Schirm ใน Akkusativ', prompt='เติมกลุ่มคำด้วย ohne และ ein Schirm โดยเปลี่ยน Case ให้ถูกต้อง'),
 row([['ผู้พูด', 'ich'], ['การเดินทาง', 'เดินทางไปกับเพื่อนชายหนึ่งคน'], ['รูปคำที่ให้', 'kommen · mit · ein Freund'], ['คำนามต้นทาง', 'der Freund = เพื่อนผู้ชาย'], ['คำเริ่มต้น', 'Ich']], '', 'Ich komme mit einem Freund.', statement('Ich', 'komme', 'mit einem Freund.'), 'ฉันมากับเพื่อนผู้ชายหนึ่งคน', ('Ich komme mit einen Freund.', 'case_ending', 'mit ใช้ Dativ จึงต้องเป็น einem Freund แทน einen Freund'), 'เริ่ม Ich แล้ววาง komme ตำแหน่ง 2; mit เปลี่ยน ein Freund เป็น einem Freund', prompt='เขียนหนึ่งประโยค เริ่มด้วย Ich ใช้คำที่กำหนดและผัน ein Freund ให้ถูกต้อง'),
]),
('L18', 'L18-imperativ-sie', 'formal_imperative_form', [
 row([['ผู้รับคำขอ', 'ผู้ใหญ่ที่ใช้ Sie'], ['สิ่งที่ขอ', 'เปิดประตู'], ['กริยาต้นทาง', 'öffnen']], '___ Sie bitte die Tür.', 'Öffnen', imperative('Öffnen', 'bitte die Tür.'), 'กรุณาเปิดประตู', ('Öffnest', 'imperative_form', 'Öffnest เป็นรูป du; คำขอสุภาพกับ Sie ใช้ Öffnen Sie'), 'ใช้รูป Öffnen ขึ้นต้นคำขอ ตามด้วย Sie และ bitte; ไม่ได้ให้คำแนะนำด้านสุขภาพ', ['Öffnen', 'Öffnest', 'Öffnet']),
 row([['ผู้รับคำขอ', 'ผู้ใหญ่ที่ใช้ Sie'], ['สิ่งที่ขอ', 'อ่านประโยค'], ['กริยาต้นทาง', 'lesen']], '___ Sie bitte den Satz.', 'Lesen', imperative('Lesen', 'bitte den Satz.'), 'กรุณาอ่านประโยค', ('Liest', 'imperative_form', 'Liest ไม่ใช่รูปคำขอสุภาพกับ Sie; ต้องใช้ Lesen Sie'), 'คำขอแบบ Sie ใช้ Lesen แล้วตามด้วย Sie ไม่ใช้รูป du liest', ['Lesen', 'Liest', 'Lest']),
 row([['กริยาที่ให้', 'warten'], ['ข้อมูลประกอบ', 'bitte hier'], ['ผู้รับคำขอ', 'Sie']], '___ bitte hier.', 'Warten Sie', imperative('Warten', 'bitte hier.'), 'กรุณารอที่นี่', ('Sie warten', 'verb_position', 'กลุ่มคำขอต้องวางกริยาก่อน Sie: Warten Sie ไม่ใช่ Sie warten'), 'เขียนกลุ่มคำขอจาก warten โดยวาง Warten ก่อน Sie แล้วจึงตามด้วย bitte hier ในกรอบ', prompt='เติมกลุ่มกริยากับ Sie ให้เป็นคำขอสุภาพจาก warten ไม่เขียน bitte hier ซ้ำ'),
 row([['กริยาที่ให้', 'sprechen'], ['ข้อมูลประกอบ', 'bitte langsam'], ['ผู้รับคำขอ', 'Sie']], '___ bitte langsam.', 'Sprechen Sie', imperative('Sprechen', 'bitte langsam.'), 'กรุณาพูดช้า ๆ', ('Sie sprechen', 'verb_position', 'กลุ่มคำขอต้องเป็น Sprechen Sie โดยวางกริยาก่อน Sie'), 'ใช้ Sprechen Sie เป็นกลุ่มคำขอสุภาพ; ข้อนี้วัดการประกอบกลุ่มกริยากับ Sie ไม่ใช่การเลือกคำกริยาเอง', prompt='เติมกลุ่มกริยากับ Sie ให้เป็นคำขอสุภาพจาก sprechen ไม่เขียน bitte langsam ซ้ำ'),
 row([['กริยาที่ให้', 'öffnen'], ['สิ่งที่ขอ', 'das Fenster'], ['คำสุภาพนำหน้า', 'Bitte'], ['ผู้รับคำขอ', 'Sie'], ['คำเริ่มต้น', 'Bitte']], '', 'Bitte öffnen Sie das Fenster.', [part('Bitte', 'other', 'คำขอสุภาพ'), part('öffnen', 'verb', 'กริยาคำขอสุภาพ', 'ก่อน Sie'), part('Sie', 'subject', 'ประธานแบบสุภาพ'), part('das Fenster.', 'other', 'สิ่งที่ขอให้เปิด')], 'กรุณาเปิดหน้าต่าง', ('Bitte Sie öffnen das Fenster.', 'verb_position', 'หลัง Bitte ในคำขอนี้ต้องวางกริยา öffnen ก่อน Sie: Bitte öffnen Sie'), 'Bitte เป็นคำขอสุภาพนำหน้าแกนคำขอ; öffnen อยู่ก่อน Sie แล้วตามด้วย das Fenster ไม่ใช่ Bitte Sie öffnen', prompt='เขียนคำขอหนึ่งประโยค เริ่มด้วย Bitte ใช้ öffnen ที่ผันแล้ว ตามด้วย Sie และ das Fenster'),
]),
('L18', 'L18-sollen', 'sollen_conjugation', [
 row([['ผู้บอก', 'ครูบอกกับผู้เรียนหลายคน'], ['ข้อความที่ต้องรายงาน', 'ให้พวกเธออ่านบทความ'], ['กริยาที่ใช้รายงาน', 'sollen']], 'Ihr ___ den Text lesen.', 'sollt', modal('Ihr', 'sollt', 'den Text', 'lesen.'), 'พวกเธอต้องอ่านบทความตามที่ครูบอก', ('sollen', 'subject_verb_agreement', 'ประธาน Ihr ต้องใช้ sollt ไม่ใช่ sollen'), 'กำลังรายงานคำบอกของครู; Ihr ผัน sollen เป็น sollt และ lesen อยู่ท้าย', ['sollt', 'sollen', 'soll']),
 row([['ผู้บอก', 'ครูบอกกับ Nora'], ['ข้อความที่ต้องรายงาน', 'ให้เขียนประโยคหนึ่งประโยค'], ['กริยาที่ใช้รายงาน', 'sollen']], 'Nora ___ einen Satz schreiben.', 'soll', modal('Nora', 'soll', 'einen Satz', 'schreiben.'), 'Nora ต้องเขียนประโยคหนึ่งประโยคตามที่ครูบอก', ('sollst', 'subject_verb_agreement', 'Nora เป็นบุคคลที่สามเอกพจน์ จึงใช้ soll; sollst ใช้กับ du'), 'รายงานคำบอกของครูโดยใช้ Nora soll; schreiben เป็น Infinitiv ท้ายประโยค', ['soll', 'sollst', 'sollen']),
 row([['ผู้บอก', 'ครูบอกกับฉัน'], ['ข้อความที่ต้องรายงาน', 'ให้ทำแบบฝึกนี้'], ['คำที่กำหนด', 'diese Übung machen'], ['กริยาที่ใช้รายงาน', 'sollen']], 'Ich ___.', 'soll diese Übung machen', modal('Ich', 'soll', 'diese Übung', 'machen.'), 'ฉันต้องทำแบบฝึกนี้ตามที่ครูบอก', ('soll machen diese Übung', 'verb_position', 'machen เป็น Infinitiv ต้องอยู่ท้าย หลัง diese Übung'), 'ich ใช้ soll และวาง machen ไว้ท้าย; เขียนตามข้อความครู ไม่ใช่แผนที่คิดขึ้นเอง', prompt='เติมเฉพาะส่วนหลัง Ich ใช้ sollen ที่ผันแล้วและ diese Übung machen'),
 row([['ผู้บอก', 'ครูบอกกับพวกเรา'], ['ข้อความที่ต้องรายงาน', 'ให้เรียนคำศัพท์'], ['คำที่กำหนด', 'die Wörter lernen'], ['กริยาที่ใช้รายงาน', 'sollen']], 'Wir ___.', 'sollen die Wörter lernen', modal('Wir', 'sollen', 'die Wörter', 'lernen.'), 'พวกเราต้องเรียนคำศัพท์ตามที่ครูบอก', ('soll die Wörter lernen', 'subject_verb_agreement', 'Wir ต้องใช้ sollen ไม่ใช่ soll'), 'Wir ใช้ sollen ตำแหน่ง 2 และเก็บ lernen ไว้ท้ายประโยค', prompt='เติมเฉพาะส่วนหลัง Wir ใช้ sollen ที่ผันแล้วและ die Wörter lernen'),
 row([['ผู้บอก', 'ครูบอกกับ Paul'], ['ข้อความที่ต้องรายงาน', 'ให้มาในวันพรุ่งนี้'], ['คำที่กำหนด', 'morgen · kommen'], ['กริยาที่ใช้รายงาน', 'sollen'], ['คำเริ่มต้น', 'Paul']], '', 'Paul soll morgen kommen.', [part('Paul', 'subject', 'ประธาน', 'ตำแหน่ง 1'), part('soll', 'auxiliary', 'กริยาช่วย (ผันแล้ว)', 'ตำแหน่ง 2'), part('morgen', 'time', 'เวลา'), part('kommen.', 'verb', 'กริยารูป Infinitiv', 'ท้ายประโยค')], 'Paul ต้องมาพรุ่งนี้ตามที่ครูบอก', ('Paul will morgen kommen.', 'communicative_intent', 'will บอกความตั้งใจของ Paul เอง แต่ข้อมูลนี้ให้รายงานสิ่งที่ครูบอก จึงต้องใช้ soll'), 'Paul เป็นคนเดียวจึงใช้ soll ตำแหน่ง 2 แล้ววาง kommen ท้ายเพื่อรายงานคำบอกของครู', prompt='เขียนหนึ่งประโยคตามข้อความครู เริ่มด้วย Paul และใช้ sollen, morgen, kommen'),
]),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', type=Path, required=True)
    args = parser.parse_args()
    output = Path(__file__).resolve().parents[2]
    courses = {}
    assets = []
    baseline_ids = set()
    bindings = []
    for lesson_id, topic, base_subskill, rows in TOPICS:
        source = json.loads((args.source_root / ('docs/lesson-preparation/l%s-content.json' % lesson_id[1:])).read_text())
        originals = source['practiceCandidates']
        original_primary = [q for q in originals if q.get('topicId') == topic and q['subskill'] == base_subskill]
        assert original_primary and all(q['targetId'] == topic for q in original_primary), (topic, base_subskill)
        bindings.append(dict(familyId=topic, targetId=topic, originalSubskill=base_subskill, originalQuestionIds=[q['id'] for q in original_primary]))
        baseline_ids.update(q['id'] for q in originals)
        course = courses.setdefault(lesson_id, dict(lessonId=lesson_id, skill='grammar', tasks=[]))
        for index, spec in enumerate(rows, 1):
            stage = 1 if index <= 2 else 2 if index <= 4 else 3
            task_id = '%s-XG-S%d-C%d-v1' % (topic, stage, index)
            audio_id = task_id + '-feedback-audio'
            full = ' '.join(p['text'] for p in spec['parts'])
            answer = spec['answer']
            answers = [answer]
            if answer.endswith(('.', '!', '?')): answers.append(answer[:-1])
            # Explicit alternatives are accepted only where the bounded prompt permits them.
            if topic == 'L18-imperativ-sie' and stage == 3:
                answers += ['Bitte, öffnen Sie das Fenster.', 'Bitte, öffnen Sie das Fenster']
            if topic == 'L17-wollen' and stage == 3:
                answers += ['Mira will Deutsch morgen lernen.', 'Mira will Deutsch morgen lernen']
            unlock = dict(subskill=base_subskill if stage < 3 else 'grammar_bounded_production', minCorrectContexts=0 if stage == 1 else 2, minPracticeSessions=0 if stage == 1 else 2, requiresAttempt=True)
            wrong, category, message = spec['wrong']
            if stage == 1:
                prompt = spec['prompt'] or 'เลือกคำเติมประโยคให้ตรงข้อมูลที่กำหนด'
                assistance = ['provided-context', 'provided-sentence-frame', 'answer-options', 'optional-topic-model']
                rationale = 'เลือกหนึ่งรูปในบริบทใหม่ที่ให้ข้อมูลพอตอบ โดยยังเห็นกรอบประโยคและตัวเลือก; วัด %s ไม่ใช่การเขียนอิสระ' % base_subskill
            elif stage == 2:
                prompt = spec['prompt']
                assistance = ['provided-context', 'provided-sentence-frame', 'supplied-lexical-forms', 'german-character-keyboard', 'optional-topic-model']
                rationale = 'เขียนเฉพาะส่วนที่ระบุจากรูปคำและกรอบที่ให้ ต้องเลือกหรือผันรูปภาษาเอง; เป็น bounded production ไม่วัดการคิดเนื้อหาเอง'
            else:
                prompt = spec['prompt']
                assistance = ['provided-context', 'supplied-lexical-forms', 'provided-start', 'german-character-keyboard', 'optional-topic-model']
                rationale = 'เขียนทั้งประโยคตามข้อมูลและคำเริ่มต้นที่จำกัด ไม่มีคลังคำให้แตะ; วัดการเรียกคืนรูปและลำดับใน bounded production ไม่ใช่ free production'
            context = [list(row) for row in spec['context']]
            if topic == 'L16-temporale-praepositionen' and index in (3, 5):
                context.append(['โครงที่ต้องใช้ในข้อนี้', 'ใช้ in เพื่อบอกอีกช่วงเวลาหนึ่งนับจากขณะนี้'])
                if index == 3:
                    prompt = 'เติมเฉพาะกลุ่มเวลา ใช้ in กับ zwei Stunden เพื่อบอกอีกสองชั่วโมงนับจากขณะนี้'
                    task_wrong = 'nach zwei Stunden'
                else:
                    prompt = 'เขียนหนึ่งประโยค เริ่มด้วย Wir ใช้ sich treffen และ in เพื่อบอกอีกสองวันนับจากขณะนี้'
                    task_wrong = 'Wir treffen uns nach zwei Tagen.'
            else:
                task_wrong = None
            if topic == 'L15-possessivartikel' and index == 1: context.append(['คำศัพท์ประกอบ', 'das Sofa = โซฟา; bequem = นั่งสบาย'])
            if topic == 'L18-imperativ-sie' and index in (1, 2, 5): context.append(['คำศัพท์ประกอบ', 'öffnen = เปิด; lesen = อ่าน; das Fenster = หน้าต่าง; der Satz = ประโยค'])
            task = dict(id=task_id, version=1, targetId=topic, subskill=base_subskill if stage == 1 else 'grammar_bounded_production', difficulty=2 if stage == 1 else 3 if stage == 2 else 4, difficultyRationale=rationale, requiredCardIds=[topic], kind='choice' if stage == 1 else 'write', prompt=prompt, cue=spec['cue'], context=context, options=spec['options'] or [], tokens=[], startWith=answer.split()[0] if stage == 3 else '', acceptedAnswers=answers, assistance=assistance, feedback=dict(reason=spec['reason'], models=[dict(text=full, meaning=spec['meaning'], sentences=[spec['parts']], audio=audio_id)], errors=[dict(response=wrong, category=category, message=message)]), noun=None, articleTarget=False, spelling=False, practice=dict(familyId=topic, contextId=task_id + '-context', stage=stage, unlock=unlock))
            if stage == 1:
                for distractor in task['options']:
                    if distractor == answer or distractor == wrong: continue
                    task['feedback']['errors'].append(dict(response=distractor, category='target_form_or_relation', message='รูป “%s” ไม่ตรงกับข้อมูลและกรอบประโยคนี้: %s' % (distractor, spec['reason'])))
            if task_wrong:
                task['assistance'].append('provided-time-preposition-in')
                task['difficultyRationale'] += '; ข้อนี้ให้ in และรูปกลุ่มคำนามมาแล้ว จึงไม่วัดการเลือกบุพบทหรือผันคำนามอย่างอิสระ'
                task['feedback']['errors'].append(dict(response=task_wrong, category='bounded_lexical_constraint', message='ข้อนี้กำหนดให้ใช้ in สำหรับระยะเวลานับจากปัจจุบัน จึงต้องเขียนด้วย in; ไม่ได้หมายความว่า nach + ระยะเวลาใช้ไม่ได้ในทุกบริบท'))
            course['tasks'].append(task)
            assets.append(dict(id=audio_id, kind='grammar_model_audio', text=full, voice='de-DE-KatjaNeural', status='not_generated'))
    flat = [t for c in courses.values() for t in c['tasks']]
    assert len(flat) == 35 and len({t['id'] for t in flat}) == 35
    assert not baseline_ids.intersection(t['id'] for t in flat)
    for task in flat:
        assert task['prompt'] and task['feedback']['reason']
        assert task['acceptedAnswers'] and all(task['acceptedAnswers'])
        if task['kind'] == 'choice':
            assert len(task['options']) == len(set(task['options'])) == 3
            assert task['acceptedAnswers'][0] in task['options']
        for model in task['feedback']['models']:
            assert ' '.join(' '.join(p['text'] for p in sent) for sent in model['sentences']) == model['text']
        assert task['feedback']['errors'][0]['response'] not in task['acceptedAnswers']
    folder = output / 'docs/lesson-preparation'
    folder.mkdir(parents=True, exist_ok=True)
    for name, value in [('grammar-practice-extensions.json', dict(schemaVersion=1, provenance=dict(status='product-authored', basis='existing-seven-published-grammar-topics', assessment='bounded-production-only', topicBindings=bindings), courses=list(courses.values()))), ('grammar-practice-extension-audio.json', dict(schemaVersion=1, defaultLexicalVoice='de-DE-KatjaNeural', assets=assets))]:
        (folder / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(courses=len(courses), topics=len(TOPICS), newTasks=len(flat), audioAssets=len(assets), stages={stage:sum(t['practice']['stage']==stage for t in flat) for stage in (1,2,3)})))

if __name__ == '__main__': main()
