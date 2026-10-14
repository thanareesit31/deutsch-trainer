export type DiscoveryQuestion = {
  prompt: string;
  choices: readonly [string, string, ...string[]];
  answer: string;
  hint: string;
};

export type GrammarDiscoveryExample = {
  de: string;
  th: string;
  nounHint?: string;
  nameRoot?: string;
};

export type GrammarDiscoveryTopic = {
  slug: string;
  title: string;
  thai: string;
  examples: readonly [GrammarDiscoveryExample, GrammarDiscoveryExample];
  observe: DiscoveryQuestion;
  rule: string;
  apply: DiscoveryQuestion;
};

export type GrammarDiscoveryLesson = {
  id: string;
  topics: readonly [GrammarDiscoveryTopic, ...GrammarDiscoveryTopic[]];
};

export const grammarDiscoveryLessons: readonly GrammarDiscoveryLesson[] = [
  {
    id: "L03",
    topics: [
      { slug: "namen-genitiv", title: "Genitiv bei Namen", thai: "ชื่อที่แสดงความเป็นเจ้าของ",
        examples: [{ de: "Das ist Marias Schwester.", th: "นี่คือพี่สาวหรือน้องสาวของมาเรีย", nameRoot: "Maria" }, { de: "Das ist Peters Vater.", th: "นี่คือพ่อของเพเทอร์", nameRoot: "Peter" }],
        observe: { prompt: "ชื่อเจ้าของเปลี่ยนอย่างไร?", choices: ["เติม -s หลังชื่อ", "เติม -n หลังชื่อ", "ไม่เปลี่ยนชื่อ"], answer: "เติม -s หลังชื่อ", hint: "เทียบ Maria กับ Marias และ Peter กับ Peters" },
        rule: "เมื่อต้องการบอกว่าเป็นของใคร ให้วางชื่อเจ้าของหน้าคำนามและเติม -s เช่น Marias Schwester",
        apply: { prompt: "พ่อของ Anna คือข้อใด?", choices: ["Annas Vater", "Anna Vater", "Vater Annas"], answer: "Annas Vater", hint: "เริ่มด้วยชื่อเจ้าของแล้วเติม -s" } },
      { slug: "mein-dein", title: "mein und dein", thai: "คำแสดงความเป็นเจ้าของ",
        examples: [{ de: "Das ist mein Vater.", th: "นี่คือพ่อของฉัน", nounHint: "(der) Vater" }, { de: "Das sind meine Eltern.", th: "นี่คือพ่อแม่ของฉัน", nounHint: "(die) Eltern · พหูพจน์" }],
        observe: { prompt: "หน้า (der) Vater กับ (die) Eltern ใช้ mein รูปเดียวกันไหม?", choices: ["Vater ใช้ mein; Eltern ใช้ meine", "ทั้งคู่ใช้ mein", "ทั้งคู่ใช้ meine"], answer: "Vater ใช้ mein; Eltern ใช้ meine", hint: "(der) Vater เป็นคำนามเพศชายเอกพจน์ ส่วน (die) Eltern เป็นพหูพจน์" },
        rule: "รูปประธาน (Nominativ): der และ das ใช้ mein/dein; die เพศหญิงและพหูพจน์ใช้ meine/deine",
        apply: { prompt: "เติมคำหน้า (die) Mutter: Das ist ___ Mutter.", choices: ["meine", "mein", "meinen"], answer: "meine", hint: "(die) Mutter ใช้รูป meine" } },
      { slug: "sprechen", title: "sprechen", thai: "การผันกริยา sprechen",
        examples: [{ de: "Ich spreche Deutsch.", th: "ฉันพูดภาษาเยอรมัน" }, { de: "Du sprichst Englisch.", th: "เธอพูดภาษาอังกฤษ" }],
        observe: { prompt: "เมื่อประธานเป็น du สระของ sprechen เปลี่ยนอย่างไร?", choices: ["e → i", "e → a", "ไม่เปลี่ยน"], answer: "e → i", hint: "เทียบ spreche กับ sprichst" },
        rule: "sprechen เปลี่ยน e เป็น i ใน du sprichst และ er/sie/es spricht",
        apply: { prompt: "เติมคำ: Meine Schwester ___ Deutsch.", choices: ["spricht", "sprechst", "spreche"], answer: "spricht", hint: "Meine Schwester ใช้รูปเดียวกับ sie" } },
    ],
  },
  {
    id: "L04",
    topics: [
      { slug: "bestimmter-artikel", title: "der, die, das", thai: "Artikel ชี้เฉพาะ",
        examples: [{ de: "Der Tisch ist schön.", th: "โต๊ะตัวนั้นสวย" }, { de: "Die Lampe ist schön.", th: "โคมไฟดวงนั้นสวย" }],
        observe: { prompt: "อะไรทำให้คำหน้า Tisch กับ Lampe ต่างกัน?", choices: ["เพศของคำนาม", "ความยาวประโยค", "คำคุณศัพท์ schön"], answer: "เพศของคำนาม", hint: "Tisch ใช้ der ส่วน Lampe ใช้ die" },
        rule: "คำนามเยอรมันมี Artikel: der สำหรับเพศชาย, die สำหรับเพศหญิง, das สำหรับเพศกลาง; พหูพจน์ใช้ die",
        apply: { prompt: "เติมคำ: ___ Bild ist schön.", choices: ["Das", "Der", "Die"], answer: "Das", hint: "Bild เป็น das Bild" } },
      { slug: "er-sie-es", title: "er, sie, es", thai: "สรรพนามแทนสิ่งของ",
        examples: [{ de: "Der Tisch ist schön. Er ist neu.", th: "โต๊ะสวย มันใหม่" }, { de: "Die Lampe ist schön. Sie ist neu.", th: "โคมไฟสวย มันใหม่" }],
        observe: { prompt: "คำแทน Tisch และ Lampe เลือกตามอะไร?", choices: ["Artikel ของคำนาม", "ขนาดสิ่งของ", "ตำแหน่งในห้อง"], answer: "Artikel ของคำนาม", hint: "der Tisch → er; die Lampe → sie" },
        rule: "ใช้ er แทน der, sie แทน die และ es แทน das เมื่อไม่ต้องการพูดคำนามซ้ำ",
        apply: { prompt: "Das Bild ist schön. ___ ist neu.", choices: ["Es", "Er", "Sie"], answer: "Es", hint: "Bild ใช้ das" } },
    ],
  },
  {
    id: "L05",
    topics: [
      { slug: "ein-eine", title: "ein und eine", thai: "Artikel ไม่ชี้เฉพาะ",
        examples: [{ de: "Das ist ein Tisch.", th: "นี่คือโต๊ะตัวหนึ่ง" }, { de: "Das ist eine Lampe.", th: "นี่คือโคมไฟดวงหนึ่ง" }],
        observe: { prompt: "คำนามเพศหญิงใช้คำใดหน้า Lampe?", choices: ["eine", "ein", "einen"], answer: "eine", hint: "สังเกต das ist eine Lampe" },
        rule: "Nominativ ใช้ ein กับ der/das และ eine กับ die",
        apply: { prompt: "เติมคำ: Ist das ___ Bild?", choices: ["ein", "eine", "einen"], answer: "ein", hint: "Bild เป็น das Bild" } },
      { slug: "kein-keine", title: "kein und keine", thai: "ปฏิเสธคำนาม",
        examples: [{ de: "Das ist kein Tisch.", th: "นี่ไม่ใช่โต๊ะ" }, { de: "Das ist keine Lampe.", th: "นี่ไม่ใช่โคมไฟ" }],
        observe: { prompt: "เมื่อปฏิเสธคำนามเพศหญิง ใช้รูปใด?", choices: ["keine", "kein", "nicht ein"], answer: "keine", hint: "ดูคำหน้า Lampe" },
        rule: "ใช้ kein/keine ปฏิเสธคำนามที่มี ein/eine; เพศหญิงและพหูพจน์ใช้ keine",
        apply: { prompt: "เติมคำ: Das ist ___ Bild.", choices: ["kein", "keine", "keinen"], answer: "kein", hint: "Bild เป็น das Bild" } },
      { slug: "sehen", title: "sehen", thai: "การผันกริยา sehen",
        examples: [{ de: "Ich sehe das Bild.", th: "ฉันเห็นรูปภาพ" }, { de: "Du siehst die Lampe.", th: "เธอเห็นโคมไฟ" }],
        observe: { prompt: "เมื่อประธานเป็น du สระของ sehen เปลี่ยนอย่างไร?", choices: ["e → ie", "e → i", "ไม่เปลี่ยน"], answer: "e → ie", hint: "เทียบ sehe กับ siehst" },
        rule: "sehen เปลี่ยน e เป็น ie กับ du siehst และ er/sie/es sieht",
        apply: { prompt: "เติมคำ: Er ___ das Bild.", choices: ["sieht", "siehst", "sehe"], answer: "sieht", hint: "er ใช้ sieht" } },
    ],
  },
  {
    id: "L06",
    topics: [
      { slug: "plural", title: "Singular und Plural", thai: "เอกพจน์และพหูพจน์",
        examples: [{ de: "Die Nachricht ist neu. Die Nachrichten sind neu.", th: "ข้อความหนึ่งฉบับใหม่ ข้อความหลายฉบับใหม่" }, { de: "Die Maus ist klein. Die Mäuse sind klein.", th: "เมาส์หนึ่งตัวเล็ก เมาส์หลายตัวเล็ก" }],
        observe: { prompt: "รูปพหูพจน์ของ Nachricht และ Maus เปลี่ยนเหมือนกันหรือไม่?", choices: ["ต่างกัน: -en และสระเปลี่ยน + -e", "เหมือนกัน: เติม -en", "ทั้งสองไม่เปลี่ยน"], answer: "ต่างกัน: -en และสระเปลี่ยน + -e", hint: "เทียบ Nachrichten กับ Mäuse" },
        rule: "รูปพหูพจน์มีหลายแบบ เช่น Nachricht → Nachrichten และ Maus → Mäuse; Artikel พหูพจน์ใช้ die",
        apply: { prompt: "พหูพจน์ของ die Maus คือข้อใด?", choices: ["die Mäuse", "die Mausen", "der Mäuse"], answer: "die Mäuse", hint: "Maus เปลี่ยน au → äu และเติม -e" } },
      { slug: "akkusativ-artikel", title: "Artikel im Akkusativ", thai: "Artikel เมื่อเป็นกรรม",
        examples: [{ de: "Das ist der Termin. Wir haben den Termin.", th: "นี่คือนัด เรามีนัด" }, { de: "Das ist die Lampe. Ich habe die Lampe.", th: "นี่คือโคมไฟ ฉันมีโคมไฟ" }],
        observe: { prompt: "Artikel ใดเปลี่ยนรูปเมื่อเป็นกรรมของ haben?", choices: ["der → den", "die → den", "das → den"], answer: "der → den", hint: "เทียบ der Termin กับ den Termin" },
        rule: "Akkusativ เปลี่ยน Artikel เพศชาย der → den; die และ das คงรูปเดิม",
        apply: { prompt: "เติมคำ: Ich habe ___ Computer.", choices: ["den", "der", "die"], answer: "den", hint: "Computer เป็น der Computer และอยู่หลัง habe" } },
      { slug: "einen", title: "einen und keinen", thai: "คำไม่ชี้เฉพาะใน Akkusativ",
        examples: [{ de: "Wir haben einen Termin.", th: "เรามีนัดหนึ่งรายการ" }, { de: "Wir haben keinen Termin.", th: "เราไม่มีนัด" }],
        observe: { prompt: "ein และ kein หน้า Termin เปลี่ยนอย่างไร?", choices: ["เติม -en", "เติม -e", "ไม่เปลี่ยน"], answer: "เติม -en", hint: "สังเกต einen กับ keinen" },
        rule: "Akkusativ เพศชายเปลี่ยน ein → einen และ kein → keinen; เพศหญิงและกลางคงรูป Nominativ",
        apply: { prompt: "เติมคำ: Ich habe ___ Drucker.", choices: ["einen", "ein", "eine"], answer: "einen", hint: "Drucker เป็น der Drucker" } },
    ],
  },
  {
    id: "L07",
    topics: [
      { slug: "koennen", title: "können", thai: "บอกความสามารถ",
        examples: [{ de: "Ich kann tanzen.", th: "ฉันเต้นได้" }, { de: "Sie können gut tanzen.", th: "คุณเต้นเก่ง" }],
        observe: { prompt: "ich ใช้รูปใดของ können?", choices: ["kann", "könne", "können"], answer: "kann", hint: "อ่านประโยค Ich kann tanzen" },
        rule: "können ผันเป็น ich kann, du kannst, er/sie/es kann, wir/sie/Sie können และ ihr könnt",
        apply: { prompt: "เติมคำ: Du ___ super tanzen!", choices: ["kannst", "kann", "können"], answer: "kannst", hint: "du ใช้ -st" } },
      { slug: "satzklammer", title: "Satzklammer", thai: "กริยาสองส่วนในประโยค",
        examples: [{ de: "Ich kann gut tanzen.", th: "ฉันเต้นได้ดี" }, { de: "Kannst du gut singen?", th: "เธอร้องเพลงได้ดีไหม" }],
        observe: { prompt: "กริยาหลักที่ไม่ผันอยู่ตรงไหน?", choices: ["ท้ายประโยค", "หน้าประธาน", "หลังประธานทันที"], answer: "ท้ายประโยค", hint: "ดูตำแหน่ง tanzen และ singen" },
        rule: "เมื่อใช้ können ให้ผัน können ตามประธาน แล้ววางกริยาหลักรูป Infinitiv ไว้ท้ายประโยค",
        apply: { prompt: "เรียงประโยคที่ถูกต้อง", choices: ["Ich kann gut singen.", "Ich singen kann gut.", "Ich kann singen gut."], answer: "Ich kann gut singen.", hint: "กริยาหลัก singen อยู่ท้าย" } },
    ],
  },
  {
    id: "L08",
    topics: [
      { slug: "zeitangaben", title: "am und um", thai: "วันและเวลา",
        examples: [{ de: "Am Montag habe ich Zeit.", th: "วันจันทร์ฉันว่าง" }, { de: "Um acht Uhr habe ich Zeit.", th: "ตอนแปดโมงฉันว่าง" }],
        observe: { prompt: "เมื่อตามด้วยเวลาบนนาฬิกา ใช้คำใด?", choices: ["um", "am", "im"], answer: "um", hint: "ดู acht Uhr" },
        rule: "ใช้ am กับวันหรือช่วงของวัน และ um กับเวลาบนนาฬิกา",
        apply: { prompt: "เติมคำ: ___ Freitag habe ich Zeit.", choices: ["Am", "Um", "Im"], answer: "Am", hint: "Freitag เป็นวัน" } },
      { slug: "verbposition", title: "Verbposition", thai: "ตำแหน่งกริยาเมื่อเริ่มด้วยเวลา",
        examples: [{ de: "Ich habe am Montag Zeit.", th: "ฉันว่างวันจันทร์" }, { de: "Am Montag habe ich Zeit.", th: "วันจันทร์ฉันว่าง" }],
        observe: { prompt: "เมื่อย้าย Am Montag ไปต้นประโยค กริยาผันอยู่ตรงไหน?", choices: ["ตำแหน่งที่สอง", "ท้ายประโยค", "ตำแหน่งที่สาม"], answer: "ตำแหน่งที่สอง", hint: "นับ Am Montag เป็นหนึ่งส่วน แล้วดู habe" },
        rule: "ประโยคบอกเล่ามีกริยาผันในตำแหน่งที่สอง แม้เริ่มด้วยคำบอกเวลา; ประธานจึงย้ายหลังกริยา",
        apply: { prompt: "เลือกประโยคที่ถูก", choices: ["Am Dienstag habe ich Zeit.", "Am Dienstag ich habe Zeit.", "Am Dienstag Zeit ich habe."], answer: "Am Dienstag habe ich Zeit.", hint: "ให้ habe เป็นส่วนที่สอง" } },
      { slug: "wissen", title: "wissen", thai: "บอกว่าสิ่งใดทราบหรือไม่ทราบ",
        examples: [{ de: "Ich weiß das nicht.", th: "ฉันไม่รู้เรื่องนั้น" }, { de: "Weißt du das?", th: "เธอรู้เรื่องนั้นไหม" }],
        observe: { prompt: "du ใช้รูปใดของ wissen?", choices: ["weißt", "weiß", "wissen"], answer: "weißt", hint: "ดู Weißt du das?" },
        rule: "wissen ผันเป็น ich weiß, du weißt, er/sie/es weiß; คำถามใช่หรือไม่ขึ้นต้นด้วยกริยาผัน",
        apply: { prompt: "เติมคำ: Ich ___ das nicht.", choices: ["weiß", "weißt", "wissen"], answer: "weiß", hint: "ich ใช้ weiß" } },
    ],
  },
  {
    id: "L09",
    topics: [
      { slug: "moegen", title: "mögen", thai: "บอกสิ่งที่ชอบ",
        examples: [{ de: "Ich mag Hamburger.", th: "ฉันชอบแฮมเบอร์เกอร์" }, { de: "Magst du Pizza?", th: "เธอชอบพิซซ่าไหม" }],
        observe: { prompt: "ich ใช้รูปใดของ mögen?", choices: ["mag", "möge", "mögen"], answer: "mag", hint: "อ่าน Ich mag Hamburger" },
        rule: "mögen เปลี่ยนสระในเอกพจน์: ich mag, du magst, er/sie/es mag",
        apply: { prompt: "เติมคำ: Du ___ Pizza.", choices: ["magst", "mag", "mögen"], answer: "magst", hint: "du ใช้ -st" } },
      { slug: "essen-kein", title: "essen und kein", thai: "กินและปฏิเสธอาหาร",
        examples: [{ de: "Ich esse einen Hamburger.", th: "ฉันกินแฮมเบอร์เกอร์หนึ่งชิ้น" }, { de: "Ich esse keinen Hamburger.", th: "ฉันไม่กินแฮมเบอร์เกอร์" }],
        observe: { prompt: "ปฏิเสธ Hamburger ซึ่งเป็น der ใน Akkusativ ใช้คำใด?", choices: ["keinen", "kein", "keine"], answer: "keinen", hint: "ดูคำหน้า Hamburger ในประโยคที่สอง" },
        rule: "หลัง essen คำนามเป็นกรรม Akkusativ; เพศชายใช้ einen หรือ keinen ส่วน du essen ผันเป็น isst",
        apply: { prompt: "เติมคำ: Du ___ einen Hamburger.", choices: ["isst", "esst", "esse"], answer: "isst", hint: "essen เปลี่ยน e เป็น i กับ du" } },
      { slug: "moechte", title: "möchte", thai: "บอกความต้องการอย่างสุภาพ",
        examples: [{ de: "Ich möchte einen Hamburger.", th: "ฉันอยากได้แฮมเบอร์เกอร์หนึ่งชิ้น" }, { de: "Möchtest du einen Tee?", th: "เธออยากได้ชาสักแก้วไหม" }],
        observe: { prompt: "du ใช้รูปใดของ möchte?", choices: ["möchtest", "möchte", "möchten"], answer: "möchtest", hint: "ดูคำต้นประโยคคำถาม" },
        rule: "ใช้ möchte เพื่อบอกความต้องการอย่างสุภาพ: ich möchte, du möchtest, er/sie/es möchte",
        apply: { prompt: "เติมคำ: Ich ___ eine Pizza.", choices: ["möchte", "möchtest", "möchten"], answer: "möchte", hint: "ich ใช้ möchte" } },
    ],
  },
  {
    id: "L10",
    topics: [
      { slug: "trennbare-verben", title: "Trennbare Verben", thai: "กริยาแยกส่วน",
        examples: [{ de: "Der Zug kommt um acht Uhr an.", th: "รถไฟมาถึงตอนแปดโมง" }, { de: "Ich steige in Berlin ein.", th: "ฉันขึ้นรถที่เบอร์ลิน" }],
        observe: { prompt: "ส่วนหน้า an-/ein- ไปอยู่ที่ไหนในประโยคบอกเล่า?", choices: ["ท้ายประโยค", "หน้าประธาน", "หน้ากริยาผัน"], answer: "ท้ายประโยค", hint: "ดู an และ ein ในตัวอย่าง" },
        rule: "กริยาแยกส่วนผันส่วนกริยาตามประธาน แล้ววางคำนำหน้าไว้ท้ายประโยค เช่น kommt ... an",
        apply: { prompt: "เติมคำ: Der Bus fährt um neun Uhr ___.", choices: ["ab", "an", "ein"], answer: "ab", hint: "abfahren หมายถึงออกเดินทาง" } },
      { slug: "ankommen-frage", title: "Wann kommst du an?", thai: "ถามเวลาเดินทาง",
        examples: [{ de: "Wann kommst du an?", th: "เธอมาถึงเมื่อไร" }, { de: "Ich komme um acht Uhr an.", th: "ฉันมาถึงตอนแปดโมง" }],
        observe: { prompt: "ในคำถาม Wann... ส่วน an อยู่ที่ไหน?", choices: ["ท้ายคำถาม", "หลัง Wann", "หน้าประธาน"], answer: "ท้ายคำถาม", hint: "อ่าน Wann kommst du an?" },
        rule: "คำถาม W-Frage เริ่มด้วยคำถาม ตามด้วยกริยาผันและประธาน; คำนำหน้าของกริยาแยกส่วนยังอยู่ท้าย",
        apply: { prompt: "เลือกคำถามที่ถูก", choices: ["Wann fährst du ab?", "Wann du fährst ab?", "Wann abfährst du?"], answer: "Wann fährst du ab?", hint: "กริยาผันตามหลัง Wann" } },
    ],
  },
  {
    id: "L11",
    topics: [
      { slug: "perfekt-haben", title: "Perfekt mit haben", thai: "เล่าเรื่องที่ผ่านมา",
        examples: [{ de: "Ich habe gestern gearbeitet.", th: "เมื่อวานฉันทำงาน" }, { de: "Wir haben Musik gehört.", th: "พวกเราฟังเพลงแล้ว" }],
        observe: { prompt: "ส่วนใดอยู่ท้ายประโยค Perfekt?", choices: ["Partizip II", "haben ที่ผันแล้ว", "ประธาน"], answer: "Partizip II", hint: "ดู gearbeitet และ gehört" },
        rule: "Perfekt กับ haben ใช้ haben ที่ผันในตำแหน่งกริยา และ Partizip II ไว้ท้ายประโยค",
        apply: { prompt: "เติมคำ: Ich habe gestern Musik ___.", choices: ["gehört", "hören", "höre"], answer: "gehört", hint: "Perfekt ใช้ Partizip II" } },
      { slug: "partizip", title: "Partizip II", thai: "รูปกริยาสำหรับ Perfekt",
        examples: [{ de: "Ich habe einen Termin gemacht.", th: "ฉันได้นัดหมายแล้ว" }, { de: "Ich habe Musik gespielt.", th: "ฉันเล่นดนตรีแล้ว" }],
        observe: { prompt: "Partizip II ของกริยาปกติลงท้ายอย่างไร?", choices: ["-t", "-en เสมอ", "-st"], answer: "-t", hint: "ดู gemacht และ gespielt" },
        rule: "กริยาปกติสร้าง Partizip II ด้วย ge- + รากคำ + -t เช่น machen → gemacht และ spielen → gespielt",
        apply: { prompt: "เติมคำ: Was hast du gestern ___?", choices: ["gemacht", "machen", "machst"], answer: "gemacht", hint: "ใช้ Partizip II ของ machen" } },
      { slug: "von-bis-ab", title: "von ... bis und ab", thai: "ช่วงเวลาและเวลาเริ่ม",
        examples: [{ de: "Ich arbeite von neun bis fünf Uhr.", th: "ฉันทำงานตั้งแต่เก้าโมงถึงห้าโมง" }, { de: "Ab fünf Uhr habe ich Zeit.", th: "ตั้งแต่ห้าโมงฉันว่าง" }],
        observe: { prompt: "ถ้าต้องบอกทั้งเวลาเริ่มและเวลาสิ้นสุด ใช้รูปใด?", choices: ["von ... bis", "ab ... bis", "um ... am"], answer: "von ... bis", hint: "ดูประโยคที่มี neun และ fünf Uhr" },
        rule: "von ... bis บอกช่วงเวลาเริ่มถึงสิ้นสุด; ab บอกเวลาเริ่มโดยยังไม่ระบุเวลาสิ้นสุด",
        apply: { prompt: "เติมคำ: Ich arbeite ___ acht ___ zwölf Uhr.", choices: ["von ... bis", "ab ... um", "am ... bis"], answer: "von ... bis", hint: "โจทย์มีทั้งเวลาเริ่มและสิ้นสุด" } },
    ],
  },
  {
    id: "L12",
    topics: [
      { slug: "perfekt-sein", title: "Perfekt mit sein", thai: "การเดินทางในอดีต",
        examples: [{ de: "Ich bin nach Hamburg gefahren.", th: "ฉันเดินทางไปฮัมบวร์กแล้ว" }, { de: "Wir sind nach Berlin gefahren.", th: "พวกเราเดินทางไปเบอร์ลินแล้ว" }],
        observe: { prompt: "fahren ใน Perfekt ใช้กริยาช่วยคำใด?", choices: ["sein", "haben", "können"], answer: "sein", hint: "ดู bin และ sind" },
        rule: "กริยาการเคลื่อนที่บางคำ เช่น fahren ใช้ sein เป็นกริยาช่วยใน Perfekt: bin/sind ... gefahren",
        apply: { prompt: "เติมคำ: Wir ___ nach Hamburg gefahren.", choices: ["sind", "haben", "seid"], answer: "sind", hint: "wir ใช้ sind" } },
      { slug: "war-hatte", title: "war und hatte", thai: "รูปอดีตของ sein และ haben",
        examples: [{ de: "Gestern war ich in Hamburg.", th: "เมื่อวานฉันอยู่ฮัมบวร์ก" }, { de: "Gestern hatte ich Zeit.", th: "เมื่อวานฉันมีเวลา" }],
        observe: { prompt: "war เป็นอดีตของกริยาคำใด?", choices: ["sein", "haben", "fahren"], answer: "sein", hint: "เทียบ Ich bin in Hamburg กับ Gestern war ich in Hamburg" },
        rule: "เมื่อเล่าอดีตของ sein และ haben ใช้รูป Präteritum ได้: ich war และ ich hatte",
        apply: { prompt: "เติมคำ: Gestern ___ ich keine Zeit.", choices: ["hatte", "war", "habe"], answer: "hatte", hint: "พูดว่า 'มีเวลา' ใช้ haben ในอดีต" } },
      { slug: "im-seit", title: "im und seit", thai: "เดือน ฤดู และเวลาที่ต่อเนื่อง",
        examples: [{ de: "Im Frühling fahre ich nach Hamburg.", th: "ในฤดูใบไม้ผลิฉันเดินทางไปฮัมบวร์ก" }, { de: "Seit Montag bin ich in Hamburg.", th: "ฉันอยู่ฮัมบวร์กตั้งแต่วันจันทร์จนถึงตอนนี้" }],
        observe: { prompt: "คำใดสื่อว่าเริ่มตั้งแต่เวลาหนึ่งและยังต่อเนื่องอยู่?", choices: ["seit", "im", "um"], answer: "seit", hint: "ดู Seit Montag bin ich in Hamburg" },
        rule: "im ใช้กับเดือนและฤดู; seit ใช้กับจุดเริ่มของช่วงเวลาที่ยังต่อเนื่องถึงปัจจุบัน",
        apply: { prompt: "เติมคำ: ___ Winter habe ich Urlaub.", choices: ["Im", "Seit", "Um"], answer: "Im", hint: "Winter เป็นฤดู" } },
    ],
  },
];

export function grammarDiscoveryLesson(id: string): GrammarDiscoveryLesson | undefined {
  return grammarDiscoveryLessons.find((lesson) => lesson.id === id);
}
