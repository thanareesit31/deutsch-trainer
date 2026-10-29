import { writeFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const groups = {
  ask: [
    ['ask-help','Entschuldigung. Können Sie mir helfen?','ขอโทษครับ/ค่ะ ช่วยฉันหน่อยได้ไหม','คุณกางแผนที่แล้วต้องการเริ่มขอความช่วยเหลืออย่างสุภาพ','คนแถวนั้นดูไม่แน่ใจว่าคุณต้องการอะไร คุณอยากถามก่อนว่าเขาช่วยได้ไหม','คุณต้องการความช่วยเหลือเรื่องเส้นทาง แต่ยังไม่ได้ถามหาสถานที่เฉพาะ','คุณเพิ่งหยุดคนเดินถนนและต้องการเปิดบทสนทนาอย่างสุภาพ','คุณต้องการขอความช่วยเหลือจากพนักงานในสถานี','คุณเห็นคนในพื้นที่และอยากเริ่มขอความช่วยเหลือก่อนถามรายละเอียด'],
    ['ask-place','Wo ist denn hier eine Bank?','แถวนี้มีธนาคารอยู่ที่ไหน','คุณกำลังมองหาธนาคารและต้องการถามตำแหน่ง','คุณมีเวลาแวะธนาคารและถามคนในพื้นที่ว่าธนาคารอยู่ตรงไหน','คุณเห็นคนท้องถิ่นและต้องการถามหาธนาคารใกล้ ๆ','คุณต้องการถามตำแหน่งธนาคาร ไม่ได้บอกเพียงว่ากำลังหา','คุณเดินอยู่ในย่านใหม่และอยากรู้ว่าธนาคารอยู่ที่ไหน'],
    ['ask-far','Ist das sehr weit?','ที่นั่นไกลมากไหม','มีคนบอกทางให้แล้ว คุณต้องการถามต่อเรื่องระยะทาง','คุณเข้าใจตำแหน่งปลายทางแล้ว แต่ยังไม่แน่ใจว่าเดินไกลหรือไม่','หลังฟังคำบอกทาง คุณอยากถามว่าใช้เวลาเดินทางไกลไหม','คุณต้องการตรวจสอบระยะทางของสถานที่ที่เพิ่งพูดถึง','เพื่อนชี้ปลายทางบนแผนที่ คุณถามว่าที่นั่นไกลหรือเปล่า','ก่อนเริ่มเดิน คุณต้องการยืนยันระยะทางกับคนที่บอกทาง'],
    ['ask-search','Eine Frage bitte: Ich suche die Post.','ขอถามหน่อย ฉันกำลังหาไปรษณีย์','คุณต้องการบอกคนแถวนั้นว่ากำลังหาไปรษณีย์','คุณขอถามก่อน แล้วบอกสถานที่ที่กำลังตามหา','คุณกำลังมองหาที่ทำการไปรษณีย์และอยากเริ่มบทสนทนา','คุณต้องการระบุว่ากำลังหาไปรษณีย์ ไม่ได้ถามว่าไกลไหม','คุณหยุดคนเดินถนนเพื่อบอกว่าต้องการหาไปรษณีย์'],
    ['ask-walk','Kann ich zu Fuß zum Café gehen?','ฉันเดินไปคาเฟ่ได้ไหม','คุณเห็นคาเฟ่อยู่บนแผนที่และถามว่าเดินไปได้ไหม','คุณไม่มีรถและต้องการถามว่าควรเดินไปคาเฟ่ได้หรือไม่','คุณถามคนในพื้นที่ว่าเส้นทางไปคาเฟ่เหมาะกับการเดินไหม','คุณอยากถามคำถามที่ตอบได้ว่าใช่หรือไม่ใช่ โดยใช้ Modalverb','คุณกำลังจะออกจากที่นี่และถามว่าสามารถเดินไปคาเฟ่ได้ไหม'],
  ],
  describe: [
    ['describe-straight','Sie gehen hier geradeaus.','เดินตรงไปจากตรงนี้','คุณเริ่มบอกทางและขั้นแรกคือเดินตรงไป','คนถามทางยืนอยู่ตรงจุดเริ่มต้น คุณบอกให้เดินตรงจากตรงนี้','คุณกำลังอธิบายเส้นทางโดยไม่มีจุดเลี้ยวในช่วงแรก','คุณต้องการบอกทิศทางช่วงแรกให้ตรงไป','ผู้เดินทางถามว่าจะเริ่มจากจุดนี้อย่างไร คุณชี้ให้ตรงไป'],
    ['describe-see','Da sehen Sie eine Apotheke.','ตรงนั้นคุณจะเห็นร้านขายยา','คุณชี้ไปที่ร้านขายยาเพื่อบอกว่าอีกฝ่ายจะเห็นอะไร','ระหว่างบอกทาง คุณต้องการระบุจุดสังเกตเป็นร้านขายยา','คุณมองเห็นร้านขายยาอยู่ข้างหน้าและชี้ตำแหน่งให้ผู้เดินทาง','ผู้ฟังถามว่าจะรู้ได้อย่างไรว่ามาถึงใกล้แล้ว คุณบอกว่าจะเห็นร้านขายยา','คุณต้องการใช้ประโยคชี้ว่าสถานที่ใดอยู่ตรงนั้น'],
    ['describe-turn','Vor der Bank biegen Sie nach rechts ab.','ก่อนถึงธนาคารให้เลี้ยวขวา','คุณบอกจุดสังเกตและทิศทางเลี้ยวขวา','ผู้เดินทางกำลังจะถึงธนาคาร คุณบอกให้เลี้ยวก่อนถึงธนาคาร','คุณอธิบายจุดเลี้ยวโดยเริ่มจากสถานที่ที่ใช้สังเกต','คุณต้องการบอกให้เลี้ยวขวาก่อนถึงธนาคาร','แผนที่แสดงธนาคารก่อนทางแยก และเส้นทางให้เลี้ยวขวา'],
    ['describe-distance','Das ist gar nicht weit.','ที่นั่นไม่ไกลเลย','ผู้เดินทางถามระยะทางและปลายทางอยู่ใกล้','คุณยืนยันกับคนถามทางว่าเส้นทางนี้ไม่ไกล','เพื่อนกังวลว่าจะต้องเดินนาน คุณตอบว่าระยะทางสั้น','หลังอธิบายตำแหน่ง คุณเสริมว่าสถานที่นั้นอยู่ไม่ไกล','มีคนถามว่าไกลหรือไม่ คุณตอบปฏิเสธอย่างชัดเจน'],
    ['describe-street','Sie gehen die fünfte Straße nach links.','เดินเข้าถนนสายที่ห้าทางซ้าย','คุณนับถนนจากจุดเริ่มต้นและให้เลี้ยวเข้าถนนสายที่ห้าทางซ้าย','ผู้เดินทางต้องผ่านสี่ถนนก่อน แล้วจึงเข้าถนนสายที่ห้าทางซ้าย','คุณบอกลำดับถนนและทิศทางเลี้ยวอย่างชัดเจน','คุณชี้ถนนสายที่ห้าและบอกให้ไปทางซ้าย','เส้นทางไม่ได้เลี้ยวถนนแรก แต่ให้ไปถึงถนนสายที่ห้าก่อน'],
    ['describe-direction','… nach rechts.','… ไปทางขวา','คุณต้องการบอกสั้น ๆ ว่าให้ไปทางขวา','เมื่อถึงทางแยก ผู้เดินทางควรไปด้านขวา','คุณกำลังเติมทิศทางท้ายคำสั่งเดินทาง','ผู้ฟังถามว่าควรเลือกทางแยกฝั่งไหน คุณตอบว่าทางขวา','คุณชี้ทางแยกและระบุทิศทางด้านขวา'],
  ],
  unknown: [
    ['unknown-local','Tut mir leid. Ich bin nicht von hier.','ขอโทษ ฉันไม่ใช่คนแถวนี้','มีคนขอทางแต่คุณเพิ่งมาที่นี่และไม่ใช่คนในพื้นที่','คุณอยากอธิบายอย่างสุภาพว่าตนเองไม่คุ้นกับเมืองนี้','ผู้เดินทางถามเส้นทาง แต่คุณไม่ได้อาศัยอยู่แถวนี้','คุณต้องการปฏิเสธคำขออย่างสุภาพพร้อมบอกว่าไม่ใช่คนท้องถิ่น'],
    ['unknown-answer','Das weiß ich leider nicht.','ขอโทษ ฉันไม่ทราบเรื่องนั้น','มีคนถามทางที่คุณไม่รู้คำตอบ','คุณทราบว่าตนเองไม่มีข้อมูลที่ถามและอยากตอบอย่างสุภาพ','คนแปลกหน้าถามตำแหน่งสถานที่ แต่คุณไม่ทราบ','คุณต้องการบอกว่าไม่รู้ข้อมูลนั้น โดยไม่ได้อ้างว่าไม่ใช่คนในพื้นที่'],
    ['unknown-new','Ich bin fremd hier.','ฉันไม่คุ้นกับแถวนี้','คุณเพิ่งมาถึงและไม่คุ้นกับบริเวณนี้','มีคนถามทาง คุณต้องการบอกสั้น ๆ ว่าแถวนี้เป็นที่ใหม่สำหรับคุณ','คุณกำลังเดินทางและไม่รู้จักพื้นที่นี้ดี','คุณต้องการอธิบายว่าตนเองเป็นคนมาใหม่ในบริเวณนี้'],
  ],
  thanks: [
    ['thanks-heart','Herzlichen Dank.','ขอบคุณมาก','มีคนช่วยคุณจนหาทางต่อได้ คุณกล่าวขอบคุณอย่างจริงใจ','อีกฝ่ายสละเวลาพาคุณไปถึงจุดเริ่มทาง คุณตอบขอบคุณอย่างอบอุ่น','คุณได้รับความช่วยเหลือที่สำคัญและอยากแสดงความซาบซึ้ง','หลังได้รับความช่วยเหลืออย่างมาก คุณเลือกคำขอบคุณที่จริงใจ'],
    ['thanks-kind','Sehr nett. Vielen Dank.','ใจดีมาก ขอบคุณมาก','คนแปลกหน้าช่วยบอกทาง คุณชมว่าใจดีและขอบคุณ','คุณอยากขอบคุณพร้อมบอกว่าอีกฝ่ายมีน้ำใจ','อีกฝ่ายหยุดช่วยคุณทั้งที่กำลังรีบ คุณตอบชมและขอบคุณ','คุณต้องการตอบรับความช่วยเหลือด้วยคำชมสั้น ๆ และคำขอบคุณ'],
    ['thanks-oh','Oh, danke schön.','อ๋อ ขอบคุณมาก','อีกฝ่ายเพิ่งอธิบายทางให้เข้าใจ คุณตอบรับและขอบคุณ','เมื่อเห็นตำแหน่งบนแผนที่แล้ว คุณพูดขอบคุณอย่างเป็นกันเอง','คุณเพิ่งเข้าใจคำอธิบายและอยากตอบรับพร้อมขอบคุณ','อีกฝ่ายช่วยชี้เส้นทางให้ คุณเข้าใจแล้วและกล่าวขอบคุณ'],
  ],
};

const topicOrder = ['ask','describe','unknown','thanks'];
const existingAnswers = {
  ask: ['Entschuldigung. Können Sie mir helfen?','Wo ist denn hier eine Bank?','Ist das sehr weit?','Eine Frage bitte: Ich suche die Post.','Kann ich zu Fuß zum Café gehen?'],
  describe: ['Sie gehen hier geradeaus.','Da sehen Sie eine Apotheke.','Vor der Bank biegen Sie nach rechts ab.','Das ist gar nicht weit.','Sie gehen die fünfte Straße nach links.','… nach rechts.'],
  unknown: ['Tut mir leid. Ich bin nicht von hier.','Das weiß ich leider nicht.','Ich bin fremd hier.'],
  thanks: ['Herzlichen Dank.','Sehr nett. Vielen Dank.','Oh, danke schön.'],
};
const variants=[];
for (const topic of topicOrder) for (const [targetId, answer, translation, ...prompts] of groups[topic]) {
  const count = prompts.length;
  for (let index=0; index<count; index++) {
    const alternatives = topic === 'unknown' || topic === 'thanks'
      ? ['Wo ist denn hier eine Bank?', 'Sie gehen hier geradeaus.', 'Ist das sehr weit?']
      : existingAnswers[topic].filter(value => value !== answer);
    const options = [answer, alternatives[index % alternatives.length], alternatives[(index + 1) % alternatives.length]].filter((value, position, list) => list.indexOf(value) === position);
    while (options.length < 3) options.push(existingAnswers[topicOrder[(topicOrder.indexOf(topic)+1)%topicOrder.length]][options.length]);
    const advanced = index === count - 1;
    variants.push({
      id: `variant-${targetId}-${String(index+1).padStart(2,'0')}`, targetId, topic,
      kind: index % 2 === 0 ? 'context' : 'dialogue', prompt: prompts[index], options, answer, translation,
      explanation: topic === 'unknown' ? `ประโยคนี้สื่อว่า${translation} เลือกให้ตรงกับข้อมูลที่ผู้พูดรู้หรือไม่รู้ในสถานการณ์` : topic === 'thanks' ? `กล่าว ${answer} หลังจากอีกฝ่ายช่วยเหลือหรืออธิบายทางให้` : `สถานการณ์ระบุหน้าที่การสื่อสารว่า${prompts[index]} ประโยค ${answer} ทำหน้าที่นั้น`,
      difficulty: advanced ? 3 : index >= 2 ? 2 : 1,
      difficultyRationale: advanced ? 'ผู้เรียนต้องเลือกสำนวนจากบทสนทนาที่มีข้อมูลหลายส่วน' : index >= 2 ? 'ผู้เรียนต้องแยกหน้าที่ของประโยคจากบริบทโดยไม่มีคำแปลตรงตัว' : 'บริบทระบุเจตนาการสื่อสารอย่างชัดเจน',
      assistance: advanced ? 'dialogue-context-no-picture' : 'thai-situation-and-three-options',
      subskill: index % 2 === 0 ? 'phrase_context' : 'phrase_dialogue',
      sourceId: topic === 'ask' || topic === 'describe' ? 'KB14-G6B' : 'KB14-G6A',
      authorship: 'newly_authored',
    });
  }
}
if (variants.length !== 81 || new Set(variants.map(task => task.id)).size !== 81) throw new Error(`Expected 81 unique L14 phrase variants; received ${variants.length}`);
const learnerVariants = variants.map(({ sourceId, authorship, ...variant }) => variant);
const provenance = variants.map(({ id, targetId, sourceId, authorship }) => ({ id, targetId, sourceId, authorship }));
await writeFile(new URL('src/data/l14-phrase-variants.json', root), JSON.stringify({ schemaVersion:1, scoredQuestionCount:variants.length, variants:learnerVariants }, null, 2) + '\n');
await writeFile(new URL('docs/exercise-mapping/l14-phrase-variants-provenance.json', root), JSON.stringify({ schemaVersion:1, provenance }, null, 2) + '\n');
const definitions=variants.map(({id,targetId,topic,subskill,answer,options,difficulty,difficultyRationale,assistance})=>({id,version:1,itemId:targetId,requiredItemIds:[targetId],topicId:`L14-phrases-${topic}`,subskill,kind:'choice',acceptedAnswers:[answer],options,difficulty,difficultyRationale,assistance}));
const migration=`begin;\ninsert into public.phrase_practice_questions(id,version,definition) select value->>'id',(value->>'version')::integer,value from jsonb_array_elements($l14_phrase_variants$${JSON.stringify(definitions)}$l14_phrase_variants$::jsonb) on conflict(id,version) do nothing;\ncommit;\n`;
await writeFile(new URL('supabase/migrations/20261028020000_l14_phrase_variants.sql', root), migration);
console.log(`Built ${variants.length} L14 phrase variants mapped to ${new Set(variants.map(task=>task.targetId)).size} existing targets.`);
