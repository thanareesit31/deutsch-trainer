#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add teaching presentations while preserving the L14 activity controller."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]
s=(root/'src/components/l14-phrase-learning.tsx').read_text()
phrases=[dict(zip(['id','text','thai','spoken','group'],m)) for m in re.findall(r'\{ id: "([^"]+)", text: "([^"]+)", thai: "([^"]+)", spoken: "([^"]+)", group: "([^"]+)" \}',s)]
def p(text,role,label,position=None):
 d=dict(text=text,role=role,label=label)
 if position:d['position']=position
 return d
def part(t,r,l,pos=None):return p(t,r,l,'ตำแหน่ง '+str(pos) if pos else None)
annotations={}
def clause(t):
 subj=lambda x,pos=None:part(x,'subject','ประธาน',pos)
 verb=lambda x,pos=2:part(x,'verb','กริยาหลัก (ผันแล้ว)',pos)
 other=lambda x,l='ส่วนขยาย':part(x,'other',l)
 aux=lambda x,pos=2:part(x,'auxiliary','กริยาช่วย (ผันแล้ว)',pos)
 inf=lambda x:p(x,'verb','กริยาหลัก · Infinitiv','ท้ายประโยค')
 if t.startswith('Wo ist denn hier '):return [part('Wo','question','ถามสถานที่',1),verb('ist'),other('denn hier','บริเวณนี้'),subj(t[17:])]
 if t.startswith('Eine Frage bitte: '):return [other('Eine Frage bitte:','ขออนุญาตถาม'),subj('Ich',1),verb('suche'),other(t[len('Eine Frage bitte: Ich suche '):],'สิ่งที่กำลังหา (Akkusativ)')]
 if t.startswith('Können Sie mir '):return [aux('Können',1),subj('Sie'),other('mir','ผู้รับความช่วยเหลือ (Dativ)'),inf('helfen?')]
 if t.startswith('Kann ich zu Fuß '):
  end=t[len('Kann ich zu Fuß '):-len('gehen?')].strip()
  return [aux('Kann',1),subj('ich'),other('zu Fuß','วิธีเดินทาง')]+([other(end,'จุดหมาย')]if end else[])+[inf('gehen?')]
 if t.startswith('Sie gehen '):return [subj('Sie',1),verb('gehen'),other(t[10:],'เส้นทางและทิศทาง')]
 if t.startswith('Da sehen Sie '):return [part('Da','other','สถานที่',1),verb('sehen'),subj('Sie'),other(t[13:],'สิ่งที่เห็น (Akkusativ)')]
 if t.startswith('Vor der '):
  loc,tail=t.split(' biegen Sie ');direction=tail[:-4]
  return [part(loc,'other','สถานที่อ้างอิง',1),verb('biegen'),subj('Sie'),other(direction,'ทิศทาง'),p('ab.','verb','ส่วนแยกของ abbiegen','ท้ายประโยค')]
 if t.startswith('Folgen Sie '):return [verb('Folgen',1),subj('Sie'),other(t[11:],'เส้นทางที่เดินตาม (Dativ)')]
 if t.startswith('Dann gehen Sie '):return [part('Dann','sequence','ลำดับเหตุการณ์',1),verb('gehen'),subj('Sie'),other(t[15:],'สถานที่และทิศทาง')]
 fixed={
 'Ist das sehr weit?':[verb('Ist',1),subj('das'),other('sehr weit?','ถามระยะทาง')],
 'Das ist gar nicht weit.':[subj('Das',1),verb('ist'),other('gar nicht weit.','ระยะทาง: ไม่ไกลเลย')],
 'Das weiß ich leider nicht.':[part('Das','other','เรื่องที่ไม่รู้ (กรรม)',1),verb('weiß'),subj('ich'),other('leider nicht.','บอกว่าไม่ทราบ')],
 'Ich bin nicht von hier.':[subj('Ich',1),verb('bin'),other('nicht','ปฏิเสธ'),other('von hier.','ถิ่นที่มา')],
 'Ich bin fremd hier.':[subj('Ich',1),verb('bin'),other('fremd','ไม่คุ้นเคย'),other('hier.','สถานที่')],
 'Ja, das können Sie.':[other('Ja,','ตอบรับ'),part('das','other','สิ่งที่ทำได้ (กรรม)',1),aux('können'),subj('Sie.')],
 'Wo muss ich dann abbiegen?':[part('Wo','question','ถามจุดเลี้ยว',1),aux('muss'),subj('ich'),part('dann','sequence','ลำดับเหตุการณ์'),inf('abbiegen?')],
 'Ja, das ist weit.':[other('Ja,','ตอบรับ'),subj('das',1),verb('ist'),other('weit.','ระยะทาง: ไกล')],
 'Nein, das ist gar nicht weit.':[other('Nein,','ตอบปฏิเสธ'),subj('das',1),verb('ist'),other('gar nicht weit.','ระยะทาง: ไม่ไกลเลย')],
 }
 if t in fixed:return fixed[t]
 label={'Entschuldigung.':'ขออนุญาตเริ่มสนทนา','Tut mir leid.':'กล่าวขอโทษ','Herzlichen Dank.':'กล่าวขอบคุณ','Sehr nett.':'ชมความใจดี','Vielen Dank.':'กล่าวขอบคุณ','Oh, danke schön.':'กล่าวขอบคุณ','Bitte schön.':'ตอบรับคำขอบคุณ','Ja, gern.':'ยินดีช่วย'}.get(t)
 if label:return [other(t,label)]
 raise ValueError(t)
def add(t):
 sentences=[clause(x)for x in re.split(r'(?<=[.?!])\s+',t)]
 actual=' '.join(' '.join(x['text']for x in a)for a in sentences)
 assert actual==t,(t,actual)
 annotations[t]=sentences
 return t
prompts={'ask':('Entschuldigung. Können Sie mir helfen?','ขอโทษ ช่วยฉันหน่อยได้ไหม','Ja, gern.','ได้เลย ยินดี'), 'describe':('Wo ist denn hier eine Bank?','แถวนี้มีธนาคารอยู่ที่ไหน',None,None),'unknown':('Wo ist denn hier die Post?','ไปรษณีย์อยู่ที่ไหน',None,None),'thanks':('Ja, das können Sie.','ได้ คุณเดินไปได้',None,None)}
notes={'ask':['เริ่มด้วยการขอความช่วยเหลือ แล้วถามสถานที่ ระยะทาง หรือวิธีเดินทางทีละเรื่อง','คำถาม Können / Kann ขึ้นต้นด้วยกริยาช่วย ส่วน helfen / gehen อยู่ท้ายประโยค'], 'describe':['บอกเส้นทางตามลำดับ: ถนนที่ต้องเข้า → ทิศทาง → จุดสังเกต','ถ้าขึ้นต้นด้วยสถานที่ เช่น Vor der Bank กริยาผันยังอยู่ตำแหน่ง 2; ab อยู่ท้ายประโยค'], 'unknown':['บอกอย่างสุภาพว่าไม่ทราบ แล้วอธิบายว่าไม่ใช่คนแถวนี้หรือยังไม่คุ้นทาง'], 'thanks':['เมื่อได้รับความช่วยเหลือ ให้กล่าวขอบคุณ; อีกฝ่ายตอบ Bitte schön. ได้']}
groups=[]
for gid in ['ask','describe','unknown','thanks']:
 models=[]
 for phrase in [x for x in phrases if x['group']==gid]:
  q,qm,r,rm=prompts[gid]
  if gid=='ask':
   q=phrase['spoken'];qm=phrase['thai']
   if phrase['id']=='ask-place':r='Sie gehen die erste Straße nach rechts. Da sehen Sie die Bank.';rm='เลี้ยวขวาเข้าถนนสายแรก แล้วจะเห็นธนาคาร'
   elif phrase['id']=='ask-far':r='Nein, das ist gar nicht weit.';rm='ไม่ไกลเลย'
   elif phrase['id']=='ask-walk':r='Ja, das können Sie.';rm='ได้ คุณเดินไปได้'
   elif phrase['id']=='ask-search':r='Sie gehen die zweite Straße nach rechts. Da sehen Sie die Post.';rm='เลี้ยวขวาเข้าถนนสายที่สอง แล้วจะเห็นไปรษณีย์'
  else:
   r=phrase['spoken'];rm=phrase['thai']
   if phrase['id']=='describe-distance':q='Ist das sehr weit?';qm='ไกลมากไหม'
  models.append(dict(id=phrase['id'],question=add(q),reply=add(r),questionMeaning=qm,replyMeaning=rm))
 groups.append(dict(id=gid,title={'ask':'ถามทาง','describe':'บอกทาง','unknown':'เมื่อไม่รู้ทาง','thanks':'ขอบคุณ'}[gid],note=notes[gid],models=models))
# Actual route variants: annotate only after the existing activity reveals them.
for field in ['question','turn']:
 for t in re.findall(field+r': "([^"]+)"',s):add(t)
for t in ['Wo muss ich dann abbiegen?','Ist das sehr weit?','Ja, das ist weit.','Nein, das ist gar nicht weit.','Kann ich zu Fuß gehen?','Ja, das können Sie.','Herzlichen Dank.','Sehr nett. Vielen Dank.','Oh, danke schön.','Bitte schön.']:add(t)
for dest in re.findall(r'destination: "([^"]+)"',s):add('Eine Frage bitte: Ich suche '+dest+'.')
for dest in re.findall(r'walkDestination: "([^"]+)"',s):add('Kann ich zu Fuß '+dest+' gehen?')
path=root/'docs/exercise-mapping/phrase-presentation-annotations.json';author=json.loads(path.read_text());author['lessons']['L14']=annotations;path.write_text(json.dumps(author,ensure_ascii=False,indent=2)+'\n')
result=dict(version=1,origin='Concrete spoken examples from existing L14 phrases and route variants; assessment IDs and controller unchanged',groups=groups,dialoguePairs=[])
(root/'docs/exercise-mapping/l14-phrase-teaching-models.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(root/'src/data/l14-phrase-teaching.ts').write_text('export const l14PhraseTeaching = '+json.dumps(groups,ensure_ascii=False,indent=2)+';\n')
print('L14',len(phrases),'models;',len(annotations),'annotated actual turns')
