export type Skill =
  "vocabulary" | "grammar" | "phrases" | "writing" | "listening" | "reading";
export type VocabularyWordType =
  "noun" | "verb" | "adjective" | "country" | "expression" | "other";
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
  type?: VocabularyWordType;
  example?: string;
  chunk?: string;
  image?: string;
  notes?: string;
  accepted?: string[];
  sourceScope?: "core_book" | "teacher_extension" | "worksheet_support";
  sources?: { document: string; pdfPage?: number; printedPage?: number }[];
  thaiPronunciation?: string;
  numberContent?: {
    value: number;
    written: string;
    group: string;
    pattern?: string;
    audioRef: string | null;
    order: number;
  };
  pronounContent?: {
    pronoun: string;
    personReference: string;
    number: "singular" | "plural" | "both";
    politeness?: string;
  };
  professionContent?: {
    conceptKey: string;
    masculine: string;
    feminine?: string;
    masculineReading: string;
    feminineReading?: string;
    masculineAudioRef: string | null;
    feminineAudioRef: string | null;
    formScopes: { masculine: string; feminine?: string };
  };
  verbContent?: {
    infinitive: string;
    stem: string;
    examples: { de: string; th: string }[];
    conjugations: { subject: string; form: string; ending: string }[];
  };
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
export interface VerbIntroduction {
  infinitive: string;
  thaiMeaning: string;
  meaningNote?: string;
  examples: { de: string; th: string }[];
}
export interface Lesson {
  id: string;
  number: number;
  level: string;
  title: string;
  thai: string;
  topics: string;
  learningFlows?: Partial<
    Record<"vocabulary" | "grammar", import("./guided-learning").LearningFlow>
  >;
  verbIntroductions?: VerbIntroduction[];
  verbPrinciples?: {
    title: string;
    infinitive: string;
    stem: string;
    infinitiveEnding: string;
    explanation: string;
    note: string;
    rows: { subject: string; thaiSubject: string; ending: string }[];
  };
}
export interface Catalog {
  lessons: Lesson[];
  items: Item[];
}
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
