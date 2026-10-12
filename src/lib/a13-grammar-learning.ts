import type { Item } from "./content";
import type { LearningActivity, LearningFlow, LearningPair } from "./guided-learning";
import { buildL13VerbFlow } from "./l13-grammar-learning";

function pairs(
  activityId: string,
  entries: readonly { ids: string[]; left: string; answerId: string }[],
): LearningPair[] {
  return entries.map(({ ids, left, answerId }, index) => ({
    id: `${activityId}-${index + 1}`,
    left: { id: `left-${index + 1}`, text: left },
    right: { id: `right-${index + 1}`, ref: { itemId: answerId, field: "answer" } },
    contentIds: ids,
  }));
}

function board(
  id: string,
  section: string,
  instruction: string,
  note: string,
  entries: readonly { ids: string[]; left: string; answerId: string }[],
): LearningActivity {
  return {
    id, type: "pair_matching", section, instruction, note,
    sourceScope: "core_book",
    contentIds: entries.flatMap((entry) => entry.ids),
    pairs: pairs(id, entries),
    speakRight: true,
  };
}

function entry(id: string, left: string, ids = [id]) {
  return { ids, left, answerId: id };
}

export function buildL13GrammarFlow(items: Item[]): LearningFlow {
  const verbs = buildL13VerbFlow(items);
  const esGibt = [
    board("L13-es-gibt-positive", "Es gibt + Akkusativ · มี",
      "จับคู่รูปคำนามกับรูปที่ใช้หลัง es gibt",
      "หลัง es gibt ใช้ Akkusativ: คำนามเพศชาย ein → einen; เพศหญิงและเพศกลางคงรูปเดิม",
      [
        entry("L13-G001", "ein Park → es gibt ..."),
        entry("L13-G002", "eine Kirche → es gibt ..."),
        entry("L13-G003", "ein Schloss → es gibt ..."),
        entry("L13-G004", "Parks → es gibt ..."),
      ]),
    board("L13-es-gibt-negative", "Es gibt + Akkusativ · ไม่มี",
      "จับคู่คำปฏิเสธหลัง es gibt ให้ตรงกับคำนาม",
      "kein ผันตามเพศและจำนวน; เพศชาย Akkusativ เป็น keinen ส่วนพหูพจน์ใช้ keine",
      [
        entry("L13-G005", "kein Park → es gibt ..."),
        entry("L13-G006", "keine Kirche → es gibt ..."),
        entry("L13-G007", "kein Schloss → es gibt ..."),
        entry("L13-G008", "keine Parks → es gibt ..."),
      ]),
  ];
  const dativ = [
    board("L13-dativ-singular", "Personalpronomen im Dativ · เอกพจน์",
      "จับคู่ประธานกับสรรพนามรูป Dativ",
      "ผู้ที่รู้สึกถูกใจหรือได้รับผลจาก gefallen, danken, helfen และ gehören ใช้ Dativ",
      [
        entry("L13-G009", "ich"),
        entry("L13-G010", "du"),
        entry("L13-G011", "er / es", ["L13-G011", "L13-G012"]),
        entry("L13-G013", "sie (เอกพจน์)"),
      ]),
    board("L13-dativ-plural", "Personalpronomen im Dativ · พหูพจน์และสุภาพ",
      "จับคู่ประธานกับสรรพนามรูป Dativ",
      "sie พหูพจน์ใช้ ihnen; Sie สุภาพใช้ Ihnen ด้วยตัวพิมพ์ใหญ่",
      [
        entry("L13-G014", "wir"),
        entry("L13-G015", "ihr"),
        entry("L13-G016", "sie (พหูพจน์)"),
        entry("L13-G017", "Sie (สุภาพ)"),
      ]),
  ];
  return { ...verbs, title: "Grammatik", activities: [...esGibt, ...dativ, ...verbs.activities] };
}

export function buildL14VocabularyFlow(): LearningFlow {
  const blocks = [
    board("L14-directions-basic", "Wegbeschreibung · ทิศทาง",
      "จับคู่ความหมายกับคำบอกทาง",
      "เริ่มจากคำบอกทิศทางสั้น ๆ แล้วจึงใช้ในประโยคบอกทาง",
      [
        entry("L14-V019", "ตรงไป"),
        entry("L14-V020", "ไปทางขวา"),
        entry("L14-V021", "ไปทางซ้าย"),
        entry("L14-V022", "เลี้ยวขวา"),
      ]),
    board("L14-directions-next", "Wegbeschreibung · ระหว่างทาง",
      "จับคู่ความหมายกับคำที่ใช้บอกทาง",
      "คำว่า über die Straße หมายถึงข้ามถนน; zu Fuß หมายถึงเดินเท้า",
      [
        entry("L14-V023", "เลี้ยวซ้าย"),
        entry("L14-V024", "ข้ามถนน"),
        entry("L14-V025", "เดินเท้า"),
        entry("L14-V026", "หลังจาก 50 เมตร"),
      ]),
    board("L14-directions-places", "Wegbeschreibung · ชื่อสถานที่",
      "จับคู่คำเรียกสถานที่ที่พบในการบอกทาง",
      "Stadtmitte มีความหมายใกล้กับ Zentrum; Hauptbahnhof คือสถานีรถไฟหลัก",
      [
        entry("L14-V017", "ใจกลางเมือง"),
        entry("L14-V018", "สถานีรถไฟหลัก"),
      ]),
  ];
  return {
    stateKey: "deutsch-trainer-guided-learning-L14-vocabulary",
    title: "Wege und Richtungen",
    activities: blocks,
  };
}

export function buildL14GrammarFlow(): LearningFlow {
  const prepositions = [
    ["L14-G001", "ใน"], ["L14-G002", "บน"], ["L14-G003", "เหนือ"],
    ["L14-G004", "ใต้"], ["L14-G005", "ชิดหรือที่"],
    ["L14-G006", "ด้านหน้า"], ["L14-G007", "ด้านหลัง"],
    ["L14-G008", "ข้าง"], ["L14-G009", "ระหว่าง"],
  ] as const;
  return {
    stateKey: "deutsch-trainer-guided-learning-L14-grammar",
    title: "Lokale Präpositionen",
    activities: [
      board("L14-position-words-1", "Lokale Präpositionen · 1",
        "สังเกตความสัมพันธ์ของตำแหน่ง แล้วจับคู่กับคำบุพบท",
        "Wo? ถามตำแหน่งที่อยู่ ไม่ใช่ทิศทางการเคลื่อนที่",
        prepositions.slice(0, 5).map(([id, left]) => entry(id, left))),
      board("L14-position-words-2", "Lokale Präpositionen · 2",
        "จับคู่ความหมายตำแหน่งกับคำบุพบท",
        "vor, hinter, neben และ zwischen ใช้บอกตำแหน่งเทียบกับสิ่งอื่น",
        prepositions.slice(5).map(([id, left]) => entry(id, left))),
      board("L14-position-dativ", "Wo? + Dativ",
        "จับคู่คำนามเดิมกับวลีที่ใช้ตอบคำถาม Wo?",
        "เมื่อบอกตำแหน่ง Wo? ใช้ Dativ: der/das → dem, die → der, พหูพจน์ → den และคำนามมักเติม -n",
        [
          entry("L14-G010", "der Baum → อยู่ด้านหน้า"),
          entry("L14-G011", "ein Kaufhaus → อยู่ด้านข้าง"),
          entry("L14-G012", "die Ampel → อยู่ที่"),
          entry("L14-G013", "die Bäume → อยู่ระหว่าง"),
        ]),
      board("L14-position-short", "Kurzformen · รูปย่อ",
        "จับคู่รูปเต็มกับรูปย่อที่ใช้บ่อย",
        "in dem ย่อเป็น im และ an dem ย่อเป็น am",
        [
          entry("L14-G014", "in dem"),
          entry("L14-G015", "an dem"),
        ]),
    ],
  };
}

export function buildL15GrammarFlow(): LearningFlow {
  const nouns = [
    ["Sessel (Nominativ, der)", "Sessel"],
    ["Zimmer (Nominativ, das)", "Zimmer"],
    ["Lampe (Nominativ, die)", "Lampe"],
    ["Lampen (Nominativ, Plural)", "Lampen"],
    ["Teppich (Akkusativ, der)", "Teppich"],
  ] as const;
  const ownerBoard = (owner: "Sheila" | "Massood", start: number) => board(
    `L15-possessive-${owner.toLowerCase()}`, "Possessivartikel · ihr / sein",
    `จับคู่สิ่งของของ${owner === "Sheila" ? "ชีลา" : "มัสซูด"}กับรูป Possessivartikel ที่ถูกต้อง`,
    owner === "Sheila"
      ? "Sheila → ihr: Nominativ ชาย/กลาง ihr, หญิง/พหูพจน์ ihre; Akkusativ ชาย ihren"
      : "Massood → sein: Nominativ ชาย/กลาง sein, หญิง/พหูพจน์ seine; Akkusativ ชาย seinen",
    nouns.map(([label], index) => entry(
      `L15-G${String(start + index).padStart(3, "0")}`,
      `${owner}s ${label}`,
    )),
  );
  return {
    stateKey: "deutsch-trainer-guided-learning-L15-grammar",
    title: "Possessivartikel: ihr und sein",
    activities: [ownerBoard("Sheila", 1), ownerBoard("Massood", 6)],
  };
}
