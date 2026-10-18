import type { Item } from "./content";
import type { L14PositionKind, L14RouteKind, LearningActivity, LearningFlow, LearningPair } from "./guided-learning";
import { buildL13VerbFlow } from "./l13-grammar-learning";
import { l14DativRows } from "./l14-dativ-learning";

function pairs(
  activityId: string,
  entries: readonly { ids: string[]; left: string; answerId: string; route?: L14RouteKind; position?: L14PositionKind; pairIndex?: number }[],
): LearningPair[] {
  return entries.map(({ ids, left, answerId, route, position, pairIndex }, index) => ({
    id: `${activityId}-${pairIndex ?? index + 1}`,
    left: { id: `left-${index + 1}`, text: left },
    right: { id: `right-${index + 1}`, ref: { itemId: answerId, field: "answer" } },
    contentIds: ids,
    ...(route ? { leftVisual: { kind: "l14-route" as const, route } } : {}),
    ...(position ? { leftVisual: { kind: "l14-position" as const, position } } : {}),
  }));
}

function board(
  id: string,
  section: string,
  instruction: string,
  note: string,
  entries: readonly { ids: string[]; left: string; answerId: string; route?: L14RouteKind; position?: L14PositionKind; pairIndex?: number }[],
): LearningActivity {
  return {
    id, type: "pair_matching", section, instruction, note,
    sourceScope: "core_book",
    contentIds: entries.flatMap((entry) => entry.ids),
    pairs: pairs(id, entries),
    speakRight: true,
  };
}

function entry(id: string, left: string, ids = [id], route?: L14RouteKind, pairIndex?: number) {
  return { ids, left, answerId: id, ...(route ? { route } : {}), ...(pairIndex ? { pairIndex } : {}) };
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
      "เลือกคำบอกทางด้านบน แล้วจับคู่กับรูปด้านล่าง",
      "",
      [
        entry("L14-V019", "ตรงไป", ["L14-V019"], "straight"),
        entry("L14-V020", "ไปทางขวา", ["L14-V020"], "right"),
        entry("L14-V021", "ไปทางซ้าย", ["L14-V021"], "left"),
        entry("L14-V022", "เลี้ยวขวา", ["L14-V022"], "turn-right"),
      ]),
    board("L14-directions-next", "Wegbeschreibung · ระหว่างทาง",
      "เลือกคำบอกทางด้านบน แล้วจับคู่กับรูปด้านล่าง",
      "",
      [
        entry("L14-V023", "เลี้ยวซ้าย", ["L14-V023"], "turn-left"),
        entry("L14-V024", "ข้ามถนน", ["L14-V024"], "cross"),
        entry("L14-V026", "หลังจาก 50 เมตร", ["L14-V026"], "distance", 4),
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
    ["L14-G001", "ใน", "in"], ["L14-G002", "บน", "auf"], ["L14-G003", "เหนือ", "ueber"],
    ["L14-G004", "ใต้", "unter"], ["L14-G005", "ชิดหรือที่", "an"],
    ["L14-G006", "ด้านหน้า", "vor"], ["L14-G007", "ด้านหลัง", "hinter"],
    ["L14-G008", "ข้าง", "neben"], ["L14-G009", "ระหว่าง", "zwischen"],
  ] as const;
  const positionBoards = [
    board("L14-position-words-1", "Lokale Präpositionen · 1",
      "เลือกคำบุพบทด้านบน แล้วจับคู่กับภาพตำแหน่งด้านล่าง",
      "Wo? ถามตำแหน่งที่อยู่ ไม่ใช่ทิศทางการเคลื่อนที่",
      prepositions.slice(0, 5).map(([id, left, position]) => ({ ids: [id], left, answerId: id, position }))),
    board("L14-position-words-2", "Lokale Präpositionen · 2",
      "เลือกคำบุพบทด้านบน แล้วจับคู่กับภาพตำแหน่งด้านล่าง",
      "vor, hinter, neben และ zwischen ใช้บอกตำแหน่งเทียบกับสิ่งอื่น",
      prepositions.slice(5).map(([id, left, position]) => ({ ids: [id], left, answerId: id, position }))),
  ].map((activity, boardIndex) => ({
    ...activity,
    pairs: activity.pairs?.map((pair, index) => ({
      ...pair,
      legacyActivityIds: ["L14-position-words"],
      legacyMatches: [{ activityId: "L14-position-words", pairId: `L14-position-words-${boardIndex === 0 ? index + 1 : index + 6}` }],
    })),
  }));
  const dativBoard = board("L14-position-dativ", "Wo? + Dativ",
    "ดูคำนามรูปเดิมและคำบอกตำแหน่ง แล้วเลือกคำนำหน้านามรูป Dativ",
    "เมื่อบอกตำแหน่ง Wo? คำนำหน้านามเปลี่ยนเป็นรูป Dativ",
    l14DativRows.map((row) => entry(row.contentId, row.nominative)));
  return {
    stateKey: "deutsch-trainer-guided-learning-L14-grammar",
    title: "Lokale Präpositionen",
    activities: [
      ...positionBoards,
      {
        ...dativBoard,
        pairs: dativBoard.pairs?.map((pair, index) => ({
          ...pair,
          right: { id: pair.right.id, text: `${l14DativRows[index].correct} ${l14DativRows[index].noun}` },
        })),
      },
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
