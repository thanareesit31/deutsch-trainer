export type PhraseVisualPrompt = {
  question: string;
  questionThai: string;
  image: string;
  imageAlt: string;
  wordMeanings?: Record<string, string>;
};

const imageRoot = "/images/lektion-14-phrases-practice";

export const phraseVisualPrompts: Record<string, PhraseVisualPrompt> = {
  "ask-help": { question: "Sie brauchen Hilfe bei der Wegsuche. Was sagen Sie zuerst?", questionThai: "คุณต้องการขอความช่วยเหลือในการหาทาง ควรเริ่มพูดว่าอะไร", image: `${imageRoot}/ask-help.jpg`, imageAlt: "ผู้ถือแผนที่เข้าหาคนในเมืองเพื่อขอความช่วยเหลือ" },
  "ask-place": { question: "Sie suchen eine Bank. Was fragen Sie die Person?", questionThai: "คุณกำลังหาธนาคาร จะถามคนตรงหน้าอย่างไร", image: `${imageRoot}/search-bank.jpg`, imageAlt: "ผู้ถือแผนที่กำลังถามคนในเมือง ใกล้อาคารธนาคารที่มีสัญลักษณ์เหรียญ" },
  "ask-far": { question: "Der Bahnhof ist noch entfernt. Was möchten Sie wissen?", questionThai: "สถานีรถไฟอยู่ห่างออกไป คุณอยากถามอะไรเกี่ยวกับระยะทาง", image: `${imageRoot}/ask-distance.jpg`, imageAlt: "ถนนคดเคี้ยวไปยังสถานีรถไฟที่อยู่ไกล ผู้ถือแผนที่มองเส้นทางอย่างสงสัย" },
  "ask-search": { question: "Sie suchen die Post. Wie beginnen Sie das Gespräch?", questionThai: "คุณกำลังหาที่ทำการไปรษณีย์ จะเริ่มถามอย่างไร", image: `${imageRoot}/search-post.jpg`, imageAlt: "ผู้ถือแผนที่ถามคนในเมืองใกล้ที่ทำการไปรษณีย์ซึ่งมีสัญลักษณ์ซองจดหมาย" },
  "ask-walk-reply": { question: "Das Café ist gleich um die Ecke. A fragt: Kann ich zu Fuß zum Café gehen? Was antworten Sie?", questionThai: "คาเฟ่อยู่ใกล้ ๆ อีกฝ่ายถามว่าเดินไปคาเฟ่ได้ไหม คุณจะตอบอย่างไร", image: `${imageRoot}/ask-walk-reply.jpg`, imageAlt: "คนในเมืองชี้คาเฟ่ที่อยู่ใกล้ ๆ ให้ผู้ถือแผนที่ดู", wordMeanings: { zu: "ด้วย (ใน zu Fuß)", fuß: "เท้า (zu Fuß = เดินเท้า)", zum: "ไปยังคาเฟ่" } },
  "describe-straight": { question: "Wohin zeigt die Person im Bild? Was sagen Sie?", questionThai: "คนในภาพชี้ไปทางไหน คุณจะบอกทางอย่างไร", image: `${imageRoot}/straight.jpg`, imageAlt: "คนชี้ไปตามถนนที่ทอดตรงไปข้างหน้า" },
  "describe-see": { question: "Sie zeigen einer Person die Apotheke. Was sagen Sie?", questionThai: "คุณชี้ร้านขายยาให้อีกคนดู จะพูดว่าอย่างไร", image: `${imageRoot}/pharmacy.jpg`, imageAlt: "คนในเมืองชี้ร้านขายยาที่มีสัญลักษณ์กากบาทสีเขียวให้ผู้ถือแผนที่ดู" },
  "describe-distance": { question: "Das Ziel ist gleich um die Ecke. Was sagen Sie zur Entfernung?", questionThai: "จุดหมายอยู่เลยหัวมุมไปใกล้ ๆ จะบอกระยะทางอย่างไร", image: `${imageRoot}/nearby.jpg`, imageAlt: "คนชี้จุดหมายที่อยู่เลยหัวมุมถนนใกล้ ๆ ให้ผู้ถือแผนที่ดู" },
  "describe-direction": { question: "Wohin zeigt die Person im Bild?", questionThai: "คนในภาพชี้ไปทางไหน", image: `${imageRoot}/turn-right.jpg`, imageAlt: "คนชี้ไปยังถนนด้านขวาที่ทางแยก" },
  "unknown-local": { question: "Sie sind nicht von hier. Jemand fragt Sie nach dem Weg. Was sagen Sie?", questionThai: "คุณไม่ใช่คนแถวนี้ แต่มีคนถามทาง จะตอบอย่างไร", image: `${imageRoot}/unknown.jpg`, imageAlt: "ผู้ถือกระเป๋าเดินทางยักไหล่เมื่อมีคนมาถามทาง" },
  "unknown-answer": { question: "Sie kennen den Weg nicht. Was sagen Sie?", questionThai: "คุณไม่รู้เส้นทาง จะตอบอย่างไร", image: `${imageRoot}/unknown-answer.jpg`, imageAlt: "คนที่ถูกถามทางกางมือและยักไหล่เพราะไม่รู้เส้นทาง" },
  "unknown-new": { question: "Sie sind zum ersten Mal in dieser Stadt. Was sagen Sie?", questionThai: "คุณเพิ่งมาเมืองนี้เป็นครั้งแรก จะตอบอย่างไร", image: `${imageRoot}/unknown-new.jpg`, imageAlt: "ผู้มาใหม่ถือแผนที่และกระเป๋าเดินทางยืนงงอยู่หน้าสถานีรถไฟ" },
  "thanks-heart": { question: "Die Person hat Ihnen sehr geholfen. Wie bedanken Sie sich?", questionThai: "อีกคนช่วยคุณมาก คุณจะขอบคุณอย่างไร", image: `${imageRoot}/grateful.jpg`, imageAlt: "ผู้ได้รับความช่วยเหลือยิ้มและแสดงความขอบคุณจากใจ" },
  "thanks-kind": { question: "Die Person war besonders freundlich. Was sagen Sie zum Dank?", questionThai: "อีกคนใจดีมาก คุณจะชมและขอบคุณอย่างไร", image: `${imageRoot}/grateful.jpg`, imageAlt: "คนสองคนยิ้มให้กันหลังจากช่วยบอกทาง" },
  "thanks-oh": { question: "Sie haben den Weg gerade verstanden. Wie reagieren Sie?", questionThai: "คุณเพิ่งเข้าใจทางที่อีกคนบอก จะตอบรับอย่างไร", image: `${imageRoot}/thanks-info.jpg`, imageAlt: "ผู้ถือแผนที่เข้าใจเส้นทางแล้วและยิ้มขอบคุณผู้บอกทาง" },
};

export const phraseQuestionWordMeanings: Record<string, string> = {
  zeigen: "ชี้ให้ดู", fragt: "ถาม", café: "คาเฟ่", a: "ผู้ถาม", kann: "ได้ไหม", ich: "ฉัน", zu: "โดย / ไปยัง", fuß: "เท้า", gehen: "เดิน / ไป", antworten: "ตอบ",
  sie: "คุณ", brauchen: "ต้องการ", hilfe: "ความช่วยเหลือ", bei: "ในการ", der: "คำนำหน้านาม", wegsuche: "การหาทาง", was: "อะไร", sagen: "พูด", zuerst: "ก่อน", suchen: "กำลังหา", eine: "คำนำหน้านาม", bank: "ธนาคาร", fragen: "ถาม", die: "คำนำหน้านาม", person: "คน", bahnhof: "สถานีรถไฟ", ist: "อยู่ / คือ", noch: "ยัง", entfernt: "ห่างออกไป", möchten: "ต้องการ", wissen: "รู้", post: "ที่ทำการไปรษณีย์", wie: "อย่างไร", beginnen: "เริ่ม", das: "คำนำหน้านาม", gespräch: "บทสนทนา", wohin: "ไปทางไหน", zeigt: "ชี้", im: "ใน", bild: "ภาพ", einer: "กับคนหนึ่ง", apotheke: "ร้านขายยา", ziel: "จุดหมาย", gleich: "ใกล้ ๆ", um: "รอบ / เลย", ecke: "หัวมุม", zur: "เกี่ยวกับ", entfernung: "ระยะทาง", sind: "เป็น / อยู่", nicht: "ไม่", von: "จาก", hier: "ที่นี่", jemand: "บางคน", nach: "เกี่ยวกับ / ไปยัง", dem: "คำนำหน้านาม", weg: "ทาง", kennen: "รู้จัก / รู้ทาง", den: "คำนำหน้านาม", zum: "เป็น / ถึง", ersten: "แรก", mal: "ครั้ง", in: "ใน", dieser: "นี้", stadt: "เมือง", hat: "ได้", ihnen: "แก่คุณ", sehr: "มาก", geholfen: "ช่วยแล้ว", bedanken: "ขอบคุณ", sich: "ตนเอง", war: "เป็น / เคยเป็น", besonders: "เป็นพิเศษ", freundlich: "ใจดี", dank: "คำขอบคุณ", haben: "ได้", gerade: "เพิ่ง", verstanden: "เข้าใจแล้ว", reagieren: "ตอบกลับ", 
};
