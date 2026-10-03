import rawLessons from "@/data/lessons.json";
import rawVocabulary from "@/data/vocabulary.json";

export type Skill =
  | "vocabulary"
  | "grammar"
  | "phrases"
  | "writing"
  | "listening"
  | "reading";
export type Mode =
  | "flash"
  | "de-th"
  | "th-de"
  | "article"
  | "typing"
  | "choice"
  | "order"
  | "dialogue";
export interface Item {
  id: string;
  lessonId: string;
  skill: Skill;
  group: string;
  title: string;
  meaning: string;
  answer: string;
  word?: string;
  article?: string;
  plural?: string;
  pluralOnly?: boolean;
  collection?: "core" | "extra";
  options?: string[];
  prompt?: string;
  reply?: string;
  passage?: string;
  audio?: string;
  accepted?: string[];
}
export const skills: {
  id: Skill;
  de: string;
  th: string;
  description: string;
  color: string;
}[] = [
  {
    id: "vocabulary",
    de: "Wortschatz",
    th: "คำศัพท์",
    description: "จำคำ ความหมาย และ Artikel ไปด้วยกัน",
    color: "green",
  },
  {
    id: "grammar",
    de: "Grammatik",
    th: "ไวยากรณ์",
    description: "เข้าใจการผันกริยาและโครงสร้างประโยค",
    color: "purple",
  },
  {
    id: "phrases",
    de: "Redemittel",
    th: "ประโยคและสำนวน",
    description: "เลือกคำพูดให้เหมาะกับสถานการณ์",
    color: "orange",
  },
  {
    id: "writing",
    de: "Schreiben",
    th: "การเขียน",
    description: "เริ่มเขียนประโยคสั้น ๆ จากคำใบ้",
    color: "blue",
  },
  {
    id: "listening",
    de: "Hören",
    th: "การฟัง",
    description: "ฟังคำทักทายจากเสียงสังเคราะห์ภาษาเยอรมัน",
    color: "pink",
  },
  {
    id: "reading",
    de: "Lesen",
    th: "การอ่าน",
    description: "อ่านเรื่องสั้นแล้วค้นหาข้อมูลสำคัญ",
    color: "yellow",
  },
];
export const lessons = rawLessons.map((l, index) => ({
  id: l.Lesson_ID,
  number: index + 1,
  level: index < 6 ? "A1.1" : "A1.2",
  title: l.Title_German,
  thai: l.Title_Thai,
  topics: l.Main_Topics,
}));
export const coreVocabulary: Item[] = rawVocabulary.map((w) => {
  const pluralOnly = w.Gender.toLowerCase() === "plural";
  const article = pluralOnly
    ? "die"
    : ["der", "die", "das"].includes(w.Gender)
    ? w.Gender
    : undefined;
  const title = article ? `${article} ${w.Word_German}` : w.Word_German;
  return {
    id: w.Vocab_ID,
    lessonId: w.Lesson_ID,
    skill: "vocabulary",
    group: w.Category,
    title,
    meaning: w.Word_Thai,
    answer: title,
    word: w.Word_German,
    article,
    plural: w.Plural === "-" ? undefined : w.Plural,
    pluralOnly,
    collection: "core",
  };
});

const extras = [
  ["Thailand", "ประเทศไทย", "", "ประเทศ"],
  ["Deutschland", "ประเทศเยอรมนี", "", "ประเทศ"],
  ["Österreich", "ประเทศออสเตรีย", "", "ประเทศ"],
  ["Schweiz", "ประเทศสวิตเซอร์แลนด์", "die", "ประเทศ"],
  ["Türkei", "ประเทศตุรกี", "die", "ประเทศ"],
  ["Japan", "ประเทศญี่ปุ่น", "", "ประเทศ"],
  ["China", "ประเทศจีน", "", "ประเทศ"],
  ["Frankreich", "ประเทศฝรั่งเศส", "", "ประเทศ"],
  ["Spanien", "ประเทศสเปน", "", "ประเทศ"],
  ["Italien", "ประเทศอิตาลี", "", "ประเทศ"],
  ["kommen", "มา / มาจาก", "", "กริยา"],
  ["heißen", "มีชื่อว่า", "", "กริยา"],
  ["lernen", "เรียน", "", "กริยา"],
  ["sein", "เป็น / อยู่ / คือ", "", "กริยา"],
  ["sprechen", "พูด", "", "กริยา"],
  ["wohnen", "อาศัยอยู่", "", "กริยา"],
];
export const extraVocabulary: Item[] = extras.map(
  ([word, meaning, article, group], i) => ({
    id: `extra-L01-${i + 1}`,
    lessonId: "L01",
    skill: "vocabulary",
    collection: "extra",
    group,
    word,
    article: article || undefined,
    title: article ? `${article} ${word}` : word,
    answer: article ? `${article} ${word}` : word,
    meaning,
  })
);
const persons = ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"];
const verbs: [string, string[], string][] = [
  [
    "kommen",
    ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"],
    "Verbkonjugation · kommen",
  ],
  [
    "heißen",
    ["heiße", "heißt", "heißt", "heißen", "heißt", "heißen"],
    "Verbkonjugation · heißen",
  ],
  [
    "lernen",
    ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"],
    "Verbkonjugation · lernen",
  ],
  ["sein", ["bin", "bist", "ist", "sind", "seid", "sind"], "sein"],
];
const grammar: Item[] = verbs.flatMap(([verb, forms, group]) =>
  persons.map((person, i) => ({
    id: `grammar-L01-${verb}-${i}`,
    lessonId: "L01",
    skill: "grammar" as const,
    group,
    title: `${person} + ${verb}`,
    prompt: `${person} + ${verb}`,
    answer: forms[i],
    meaning: `ผัน ${verb} ให้ตรงกับประธาน ${person}`,
    options: [...new Set(forms)],
  }))
);
const pronouns = [
  ["ฉัน", "ich"],
  ["เธอ / คุณ (กันเอง)", "du"],
  ["เขา (ผู้ชาย)", "er"],
  ["เธอ (ผู้หญิง)", "sie"],
  ["พวกเรา", "wir"],
  ["พวกเธอ", "ihr"],
  ["คุณ (สุภาพ)", "Sie"],
];
pronouns.forEach(([meaning, answer], i) =>
  grammar.push({
    id: `grammar-L01-pronoun-${i}`,
    lessonId: "L01",
    skill: "grammar",
    group: "Personalpronomen",
    title: meaning,
    prompt: `สรรพนามสำหรับ “${meaning}” คืออะไร?`,
    meaning,
    answer,
    options: [...new Set([answer, "ich", "du", "wir", "er", "Sie"])],
  })
);
const structures = [
  ["ฉันมาจากประเทศไทย", "Ich komme aus Thailand."],
  ["คุณมาจากที่ไหน (กันเอง)", "Woher kommst du?"],
  ["ฉันชื่อซัน", "Ich heiße Sun."],
  ["คุณชื่ออะไร (สุภาพ)", "Wie heißen Sie?"],
  ["พวกเราเรียนภาษาเยอรมัน", "Wir lernen Deutsch."],
  ["คุณคืออันนาใช่ไหม", "Bist du Anna?"],
];
structures.forEach(([meaning, answer], i) =>
  grammar.push({
    id: `grammar-L01-order-${i}`,
    lessonId: "L01",
    skill: "grammar",
    group: "Satzbau",
    title: answer,
    prompt: meaning,
    meaning,
    answer,
  })
);
const phraseData = [
  [
    "ถามชื่อเพื่อนใหม่แบบกันเอง",
    "Wie heißt du?",
    "Ich heiße Anna.",
    "คุณชื่ออะไร",
  ],
  [
    "ถามชื่ออย่างสุภาพ",
    "Wie heißen Sie?",
    "Ich heiße Herr Müller.",
    "คุณชื่ออะไร (สุภาพ)",
  ],
  [
    "ถามว่าเพื่อนมาจากที่ไหน",
    "Woher kommst du?",
    "Ich komme aus Thailand.",
    "คุณมาจากที่ไหน",
  ],
  [
    "ถามสารทุกข์สุกดิบกับเพื่อน",
    "Wie geht es dir?",
    "Gut, danke.",
    "คุณสบายดีไหม",
  ],
  [
    "บอกว่าคุณสบายดีและขอบคุณ",
    "Gut, danke.",
    "Wie geht es dir?",
    "สบายดี ขอบคุณ",
  ],
  ["ตอบว่าคุณรู้สึกเรื่อย ๆ", "Es geht.", "Wie geht es dir?", "ก็เรื่อย ๆ"],
  [
    "บอกลาคนที่เพิ่งพบอย่างสุภาพ",
    "Auf Wiedersehen!",
    "Auf Wiedersehen!",
    "แล้วพบกันใหม่",
  ],
  ["บอกชื่อของตัวเอง", "Ich heiße Sun.", "Wie heißt du?", "ฉันชื่อซัน"],
  [
    "บอกว่าตัวเองมาจากประเทศไทย",
    "Ich komme aus Thailand.",
    "Woher kommst du?",
    "ฉันมาจากประเทศไทย",
  ],
];
const phrases: Item[] = phraseData.map(
  ([prompt, answer, reply, meaning], i) => ({
    id: `phrases-L01-${i}`,
    lessonId: "L01",
    skill: "phrases",
    group: "ทักทายและแนะนำตัว",
    title: answer,
    prompt,
    answer,
    meaning,
    reply,
    options: [
      answer,
      ...phraseData.filter((x) => x[1] !== answer).map((x) => x[1]),
    ],
  })
);
const writing: Item[] = [
  ["บอกชื่อของคุณตามคำใบ้: Sun", "Ich heiße Sun.", "Mein Name ist Sun."],
  ["บอกประเทศของคุณตามคำใบ้: Thailand", "Ich komme aus Thailand."],
  ["เขียนว่าคุณเรียนภาษาเยอรมัน: ich / lernen / Deutsch", "Ich lerne Deutsch."],
  ["ถามชื่อเพื่อนใหม่ โดยใช้ du", "Wie heißt du?"],
  ["ถามประเทศที่มาของคู่สนทนา โดยใช้ Sie", "Woher kommen Sie?"],
].map(([prompt, answer, alternative], i) => ({
  id: `writing-L01-${i}`,
  lessonId: "L01",
  skill: "writing",
  group: "เขียนจากคำใบ้",
  title: prompt,
  meaning: prompt,
  prompt,
  answer,
  accepted: alternative ? [alternative] : [],
}));
const passage =
  "Hallo! Ich heiße Lina. Ich komme aus Deutschland. Ich wohne in Berlin. Ich lerne Deutsch und Thai. Mein Freund heißt Sun. Er kommt aus Thailand. Wir lernen zusammen.";
const reading: Item[] = [
  ["Wie heißt die Person?", "Lina", "Sun", "Anna", "Miriam"],
  [
    "Woher kommt Lina?",
    "Aus Deutschland",
    "Aus Thailand",
    "Aus Japan",
    "Aus Österreich",
  ],
  ["Wo wohnt Lina?", "In Berlin", "In Bangkok", "In Wien", "In Hamburg"],
  [
    "Was lernt Lina?",
    "Deutsch und Thai",
    "Deutsch und Englisch",
    "Thai und Japanisch",
    "Nur Deutsch",
  ],
  [
    "Woher kommt Sun?",
    "Aus Thailand",
    "Aus Deutschland",
    "Aus China",
    "Aus Italien",
  ],
].map(([prompt, answer, ...others], i) => ({
  id: `reading-L01-${i}`,
  lessonId: "L01",
  skill: "reading",
  group: "Lina und Sun",
  title: prompt,
  meaning: "อ่านเรื่องแล้วเลือกคำตอบ",
  prompt,
  answer,
  options: [answer, ...others],
  passage,
}));
const listening: Item[] = coreVocabulary
  .filter((w) => w.lessonId === "L01")
  .map((w) => ({
    ...w,
    id: `listening-${w.id}`,
    skill: "listening",
    group: "ฟังคำทักทาย",
    audio: w.title,
    prompt: "เลือกคำที่คุณได้ยิน",
    options: coreVocabulary
      .filter((v) => v.lessonId === "L01")
      .map((v) => v.title),
  }));
export const items: Item[] = [
  ...coreVocabulary,
  ...extraVocabulary,
  ...grammar,
  ...phrases,
  ...writing,
  ...reading,
  ...listening,
];
export const itemById = new Map(items.map((i) => [i.id, i]));
export const skillName = (id: Skill) =>
  skills.find((s) => s.id === id)?.th || id;
export const getLevel = (id: string) =>
  Number(id.slice(1)) <= 6 ? "A1.1" : "A1.2";
export const modeLabels: Record<Mode, string> = {
  flash: "Flashcards",
  "de-th": "เยอรมัน → ไทย",
  "th-de": "ไทย → เยอรมัน",
  article: "Artikel",
  typing: "พิมพ์คำตอบ",
  choice: "เลือกคำตอบ",
  order: "เรียงประโยค",
  dialogue: "เติมบทสนทนา",
};
export function availableModes(skill: Skill, group?: string): Mode[] {
  if (skill === "vocabulary")
    return ["flash", "de-th", "th-de", "article", "typing"];
  if (skill === "grammar")
    return group === "Satzbau" ? ["order", "typing"] : ["choice", "typing"];
  if (skill === "phrases")
    return ["flash", "choice", "dialogue", "order", "typing"];
  return skill === "writing" ? ["typing"] : ["choice"];
}
