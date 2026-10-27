export type L14VocabularyContextCase = {
  targetId: string;
  prompt: string;
  translation: string;
  optionIds: readonly [string, string, string];
};

// These original situations use only vocabulary taught in Lektion 14.
// Provenance for the taught words stays in the catalog and the practice inventory.
export const l14VocabularyContextCases: readonly L14VocabularyContextCase[] = [
  { targetId: "L14-V001", prompt: "Sie möchten Kleidung und Schuhe in einem großen Geschäft kaufen. Wohin gehen Sie?", translation: "คุณต้องการซื้อเสื้อผ้าและรองเท้าในร้านขนาดใหญ่ จะไปที่ไหน?", optionIds: ["L14-V001", "L14-V002", "L14-V008"] },
  { targetId: "L14-V002", prompt: "Ein Kind ist vier Jahre alt. Wo spielt und lernt es mit anderen kleinen Kindern?", translation: "เด็กอายุสี่ขวบเล่นและเรียนกับเด็กเล็กคนอื่นที่ไหน?", optionIds: ["L14-V002", "L14-V003", "L14-V008"] },
  { targetId: "L14-V003", prompt: "Kinder lernen hier lesen, schreiben und rechnen. Wohin gehen sie?", translation: "เด็ก ๆ เรียนอ่าน เขียน และคิดเลขที่ไหน?", optionIds: ["L14-V003", "L14-V002", "L14-V001"] },
  { targetId: "L14-V004", prompt: "Sie möchten einen Brief verschicken. Wohin gehen Sie?", translation: "คุณต้องการส่งจดหมาย จะไปที่ไหน?", optionIds: ["L14-V004", "L14-V005", "L14-V007"] },
  { targetId: "L14-V005", prompt: "Sie möchten Geld abheben. Wohin gehen Sie?", translation: "คุณต้องการถอนเงิน จะไปที่ไหน?", optionIds: ["L14-V005", "L14-V004", "L14-V007"] },
  { targetId: "L14-V006", prompt: "Sie brauchen ein Medikament. Wohin gehen Sie?", translation: "คุณต้องการยา จะไปที่ไหน?", optionIds: ["L14-V006", "L14-V008", "L14-V005"] },
  { targetId: "L14-V007", prompt: "Sie möchten einen Diebstahl melden. Wohin gehen Sie?", translation: "คุณต้องการแจ้งเหตุลักทรัพย์ จะไปที่ไหน?", optionIds: ["L14-V007", "L14-V005", "L14-V004"] },
  { targetId: "L14-V008", prompt: "Eine Person ist schwer krank und braucht Hilfe von Ärzten. Wohin kommt sie?", translation: "คนหนึ่งป่วยหนักและต้องให้แพทย์ช่วย จะไปที่ไหน?", optionIds: ["L14-V008", "L14-V006", "L14-V002"] },
  { targetId: "L14-V009", prompt: "Sie möchten mit dem Zug in eine andere Stadt fahren. Wo beginnt Ihre Reise?", translation: "คุณต้องการนั่งรถไฟไปอีกเมืองหนึ่ง การเดินทางเริ่มที่ไหน?", optionIds: ["L14-V009", "L14-V004", "L14-V005"] },
  { targetId: "L14-V010", prompt: "Sie möchten in die Mitte der Stadt gehen. Welcher Ort passt?", translation: "คุณต้องการไปใจกลางเมือง สถานที่ใดตรงกับความหมายนี้?", optionIds: ["L14-V010", "L14-V014", "L14-V011"] },
  { targetId: "L14-V011", prompt: "Autos fahren hier zwischen Häusern. Was ist das?", translation: "รถยนต์วิ่งผ่านตรงนี้ระหว่างอาคาร สิ่งนี้คืออะไร?", optionIds: ["L14-V011", "L14-V013", "L14-V014"] },
  { targetId: "L14-V012", prompt: "An der Kreuzung sehen Sie Rot, Gelb und Grün. Was zeigt diese Farben?", translation: "ที่สี่แยกคุณเห็นสีแดง เหลือง และเขียว สิ่งใดแสดงสีเหล่านี้?", optionIds: ["L14-V012", "L14-V015", "L14-V016"] },
  { targetId: "L14-V013", prompt: "Sie gehen über einen Fluss, ohne ins Wasser zu gehen. Was benutzen Sie?", translation: "คุณข้ามแม่น้ำโดยไม่ลงน้ำ ใช้อะไรข้าม?", optionIds: ["L14-V013", "L14-V011", "L14-V014"] },
  { targetId: "L14-V014", prompt: "Vor dem Rathaus gibt es eine große offene Fläche. Dort treffen sich viele Menschen. Was ist das?", translation: "หน้าศาลาว่าการมีพื้นที่โล่งขนาดใหญ่ที่ผู้คนมาพบกัน ที่นั่นคืออะไร?", optionIds: ["L14-V014", "L14-V011", "L14-V016"] },
  { targetId: "L14-V015", prompt: "Zwei Straßen treffen sich. Sie können in mehrere Richtungen fahren. Wo sind Sie?", translation: "ถนนสองสายมาบรรจบกัน และคุณไปได้หลายทิศทาง คุณอยู่ที่ไหน?", optionIds: ["L14-V015", "L14-V016", "L14-V013"] },
  { targetId: "L14-V016", prompt: "Gehen Sie bis zum Ende der Häuserreihe. Dort treffen zwei Hausseiten aufeinander. Was ist dort?", translation: "เดินไปจนสุดแถวอาคาร ตรงนั้นด้านของอาคารสองด้านมาบรรจบกัน จุดนั้นคืออะไร?", optionIds: ["L14-V016", "L14-V015", "L14-V014"] },
  { targetId: "L14-V017", prompt: "Sie möchten direkt in die Mitte der Stadt. Welches Wort bezeichnet diesen Teil der Stadt?", translation: "คุณต้องการไปตรงใจกลางเมือง คำใดเรียกบริเวณนี้?", optionIds: ["L14-V017", "L14-V011", "L14-V013"] },
  { targetId: "L14-V018", prompt: "Sie suchen den wichtigsten und größten Bahnhof der Stadt. Welcher Ort ist gemeint?", translation: "คุณกำลังหาสถานีรถไฟหลักที่ใหญ่ที่สุดของเมือง หมายถึงสถานที่ใด?", optionIds: ["L14-V018", "L14-V009", "L14-V014"] },
  { targetId: "L14-V019", prompt: "Sie gehen weiter, ohne links oder rechts abzubiegen. Wie gehen Sie?", translation: "คุณเดินต่อไปโดยไม่เลี้ยวซ้ายหรือขวา เดินอย่างไร?", optionIds: ["L14-V019", "L14-V020", "L14-V021"] },
  { targetId: "L14-V020", prompt: "Das Ziel liegt auf Ihrer rechten Seite. In welche Richtung gehen Sie?", translation: "จุดหมายอยู่ทางขวามือ คุณไปทางไหน?", optionIds: ["L14-V020", "L14-V021", "L14-V019"] },
  { targetId: "L14-V021", prompt: "Das Ziel liegt auf Ihrer linken Seite. In welche Richtung gehen Sie?", translation: "จุดหมายอยู่ทางซ้ายมือ คุณไปทางไหน?", optionIds: ["L14-V021", "L14-V020", "L14-V019"] },
  { targetId: "L14-V022", prompt: "An der nächsten Ecke ändern Sie Ihre Richtung nach rechts. Was machen Sie?", translation: "ที่หัวมุมถัดไปคุณเปลี่ยนทิศทางไปทางขวา คุณทำอะไร?", optionIds: ["L14-V022", "L14-V023", "L14-V019"] },
  { targetId: "L14-V023", prompt: "An der nächsten Ecke ändern Sie Ihre Richtung nach links. Was machen Sie?", translation: "ที่หัวมุมถัดไปคุณเปลี่ยนทิศทางไปทางซ้าย คุณทำอะไร?", optionIds: ["L14-V023", "L14-V022", "L14-V019"] },
  { targetId: "L14-V024", prompt: "Die Apotheke liegt auf der anderen Straßenseite. Welcher Ausdruck beschreibt Ihren Weg dorthin?", translation: "ร้านขายยาอยู่อีกฝั่งของถนน วลีใดบอกทางที่คุณต้องไป?", optionIds: ["L14-V024", "L14-V019", "L14-V020"] },
  { targetId: "L14-V026", prompt: "Sie gehen zuerst 50 Meter. Erst danach biegen Sie ab. Wann biegen Sie ab?", translation: "คุณเดินไปก่อน 50 เมตรแล้วจึงเลี้ยว คุณเลี้ยวเมื่อไร?", optionIds: ["L14-V026", "L14-V019", "L14-V021"] },
];
