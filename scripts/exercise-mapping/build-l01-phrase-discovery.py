#!/usr/bin/env python3
"""Build the tester-only Learn prototype from reviewed draft and supplemental examples."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
draft=json.loads((ROOT/'docs/exercise-mapping/a11-phrase-expansion-draft.json').read_text())
examples={e['id']:e for l in draft['lessons'] for o in l['objectives'] for e in o['examples']}
# Options intentionally depend on role, time, facts or turn function, not a generic pool.
configs=[
 ('L01-COMM-01','ทักทายและลา','ตอนเช้า: Guten Morgen! = สวัสดีตอนเช้า\nตอนกลางวัน: Guten Tag! = สวัสดี\nตอนเย็น: Guten Abend! = สวัสดีตอนเย็น\nลาเพื่อน: Tschüs! = ลาก่อน\nลาแบบสุภาพ: Auf Wiedersehen! = แล้วพบกันใหม่',[
  ('D01','เวลา 08:00 น. · พบครูที่ห้องเรียน',['Guten Abend!','Guten Morgen!','Auf Wiedersehen!'],'เวลา 08:00 น. เป็นตอนเช้า จึงทักทายด้วย Guten Morgen!\nGuten Abend! ใช้ตอนเย็น ส่วน Auf Wiedersehen! ใช้ลา',False),
  ('D04','กำลังแยกย้ายกลับบ้าน · คุยกับเพื่อน',['Guten Tag!','Guten Morgen!','Tschüs!'],'คุณกำลังลาเพื่อน จึงใช้ Tschüs!\nGuten Tag! และ Guten Morgen! ใช้ทักทายเมื่อพบกัน',False)]),
 ('L01-COMM-02','บอกชื่อและแนะนำคนอื่น','บอกชื่อของคุณ: Ich heiße Mali. หรือ Ich bin Mali. = ฉันชื่อมะลิ\nแนะนำคนอื่น: Das ist Mali. = นี่คือมะลิ',[
  ('D01','คุณชื่อ Mali · คุยกับเพื่อนร่วมชั้น',None,'ในข้อนี้ Ich bin ใช้แนะนำตัวว่า ฉันชื่อ…\nวางชื่อ Mali ไว้หลัง bin',True),
  ('D03','คุณคือ Anna · กำลังแนะนำเพื่อนชื่อ Mali',['Ich bin Anna.','Das ist Mali.','Ich komme aus Thailand.'],'คุณกำลังแนะนำ Mali จึงใช้ Das ist ตามด้วยชื่อ\nIch bin ใช้บอกชื่อของตัวคุณเอง',True)]),
 ('L01-COMM-03','ถามว่าเป็นอย่างไรบ้าง',"ถามเพื่อน: Wie geht's dir? = เธอเป็นอย่างไรบ้าง\nถามแบบสุภาพ: Wie geht es Ihnen? = คุณเป็นอย่างไรบ้าง\nถามกลับว่า แล้วเธอ/คุณล่ะ: Und dir? กับเพื่อน หรือ Und Ihnen? แบบสุภาพ\nคำตอบบอกความรู้สึก: Gut = สบายดี · Nicht so gut = ไม่ค่อยดี",[
  ('D02','คุณสบายดี · คุยกับเจ้าหน้าที่อย่างสุภาพ',['Gut, danke. Und dir?','Ich heiße Mali.','Gut, danke. Und Ihnen?'],'คุณคุยกับเจ้าหน้าที่อย่างสุภาพ จึงถามกลับด้วย Und Ihnen?\nUnd dir? ใช้ถามกลับแบบกันเอง เช่น เมื่อคุยกับเพื่อน',True),
  ('D03','วันนี้คุณรู้สึกไม่ค่อยดี · คุยกับเพื่อน',['Sehr gut.','Nicht so gut.','Auf Wiedersehen!'],'วันนี้คุณรู้สึกไม่ค่อยดี จึงตอบ Nicht so gut.\nSehr gut. หมายถึงสบายดีมาก',True)]),
 ('L01-COMM-04','ถามว่ามาจากไหน','บอกประเทศของคุณ: Ich komme aus Thailand. = ฉันมาจากประเทศไทย\nบอกประเทศของ Anna: Sie kommt aus Deutschland. = เธอมาจากเยอรมนี\nSie ในตัวอย่างนี้หมายถึง Anna',[
  ('D01','คุณมาจากประเทศไทย · คุยกับเจ้าหน้าที่อย่างสุภาพ',None,'เริ่มด้วย Ich komme เพื่อพูดถึงตัวคุณเอง\nตามด้วย aus Thailand เพื่อบอกว่ามาจากประเทศไทย',True),
  ('D02','Anna มาจากเยอรมนี · คุณกำลังบอกว่าเธอมาจากไหน',['Ich komme aus Thailand.','Sie kommt aus Deutschland.','Sie heißt Mali.'],'Sie ในคำตอบนี้หมายถึง Anna จึงใช้ kommt\naus Deutschland บอกว่าเธอมาจากเยอรมนี',True)]),
 ('L01-COMM-05','ขอให้พูดซ้ำและขอบคุณ','ฟังไม่ชัด: Entschuldigung. Wie bitte? = ขอโทษนะ อะไรนะ\nอีกฝ่ายช่วยพูดซ้ำหรือสะกดให้แล้ว: Danke. = ขอบคุณ',[
  ('D01','คุณฟังชื่อที่เพิ่งได้ยินไม่ชัด',['Auf Wiedersehen!','Entschuldigung. Wie bitte?','Ich komme aus Thailand.'],'คุณฟังชื่อไม่ชัด จึงใช้ Wie bitte? เพื่อขอให้อีกฝ่ายพูดซ้ำ\nเติม Entschuldigung. ข้างหน้าเพื่อกล่าวขอโทษอย่างสุภาพ',False),
  ('D03','อีกฝ่ายเพิ่งสะกดชื่อให้แล้ว · คุณต้องการขอบคุณ',['Danke.','Wie heißt du?','Guten Abend!'],'อีกฝ่ายช่วยสะกดชื่อให้แล้ว จึงตอบ Danke. เพื่อขอบคุณ',False)])]
topics=[]
for oid,title,note,rows in configs:
 tasks=[]
 for suffix,context,options,explanation,word_help in rows:
  eid=f'{oid}-{suffix}';e=examples[eid]
  task=dict(id=f'{eid}-learn-v1',targetId=e['proposedAssessment']['targetId'],objectiveId=oid,sourceExampleId=eid,context=context,prompt=e['precedingTurn']['de'],promptTh=e['precedingTurn']['th'],answer=e['reply']['de'],answerTh=e['reply']['th'],explanation=explanation,wordHelp=word_help,difficulty=2 if options is None else e['proposedAssessment']['difficulty'],assistance=['model-dialogue','supplied-words'] if options is None else ['model-dialogue','authored-context','german-reply-options'],difficultyRationale='มีตัวอย่างการสอนก่อนตอบและมีคำให้ทั้งหมด; วัดลำดับคำ' if options is None else e['proposedAssessment']['difficultyRationale'])
  if options is None:
   task.update(kind='order',subskill='phrase_word_order',tokens=e['reply']['de'].split()[::-1])
  else:
   assert len(options)==len(set(options)) and options.count(e['reply']['de'])==1
   task.update(kind='choice',subskill='phrase_dialogue_response',options=options)
  tasks.append(task)
 topics.append(dict(id=oid,title=title,note=note,introducedIn=1,tasks=tasks))
supplement=json.loads((ROOT/'docs/exercise-mapping/l01-phrase-supplement-activities.json').read_text())
source_review=json.loads((ROOT/'docs/exercise-mapping/l01-phrase-supplement-review.json').read_text())
findings={f['id']:f for f in source_review['findings']}
for topic in supplement['topics']:
 for task in topic['tasks']:
  assert task['sources']==findings[task['sourceFindingId']]['sources']
  if task['kind']=='choice':assert task['options'].count(task['answer'])==1 and len(set(task['options']))==len(task['options'])
  else:assert task['answer']=='-'.join(['M','A','L','I'])+'.'
 # Detailed provenance stays in the project-side catalog.
 topics.append({**topic,'tasks':[{k:v for k,v in task.items() if k not in ('sources','sourceFindingId','sourceStatus')} for task in topic['tasks']]})
assert len({task['id'] for topic in topics for task in topic['tasks']})==sum(len(t['tasks']) for t in topics)
visuals=json.loads((ROOT/'docs/exercise-mapping/l01-phrase-visual-contexts.json').read_text())
assert set(visuals['visuals'])=={task['id'] for topic in topics for task in topic['tasks']}
for topic in topics:
 for task in topic['tasks']:
  visual=visuals['visuals'][task['id']]
  if visual['kind']=='scene':assert (ROOT/'public'/visual['image'].lstrip('/')).is_file()
  task['visual']={'version':visuals['version'],**visual}
  if task['kind']=='letters':assert (ROOT/'public'/task['listening']['audioSource'].lstrip('/')).is_file()
out=ROOT/'src/data/l01-phrase-discovery.ts'
out.write_text('import type { DiscoveryTopic } from "@/lib/phrase-discovery";\n\nexport const l01PhraseDiscovery = '+json.dumps(topics,ensure_ascii=False,indent=2)+' satisfies readonly DiscoveryTopic[];\n')
print(f'Built {len(topics)} Learn topics and {sum(len(t["tasks"]) for t in topics)} supported checks; original version-1 tasks preserved.')
