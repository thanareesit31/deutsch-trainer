import type { Item } from "./content";

export const l02StatusExamples = [
  { id: "L02-status-praktikum", word: "das Praktikum", meaning: "การฝึกงาน", de: "Ich mache ein Praktikum.", th: "ฉันกำลังฝึกงาน" },
  { id: "L02-status-arbeitslos", word: "arbeitslos", meaning: "ว่างงาน", de: "Ich bin arbeitslos.", th: "ฉันว่างงาน" },
  { id: "L02-status-nicht-arbeiten", word: "nicht arbeiten", meaning: "ไม่ได้ทำงาน", de: "Ich arbeite nicht.", th: "ฉันไม่ได้ทำงาน" },
  { id: "L02-status-freiberuflich", word: "freiberuflich", meaning: "ทำงานฟรีแลนซ์ / อาชีพอิสระ", de: "Ich bin freiberuflich.", th: "ฉันทำงานฟรีแลนซ์" },
  { id: "L02-status-selbststaendig", word: "selbstständig", meaning: "ประกอบอาชีพอิสระ", de: "Ich bin selbstständig.", th: "ฉันประกอบอาชีพอิสระ" },
  { id: "L02-status-angestellt", word: "angestellt", meaning: "เป็นลูกจ้าง", de: "Ich bin angestellt.", th: "ฉันเป็นลูกจ้าง" },
];
export const l02StatusWords = ["L02-status-arbeitslos", "L02-status-freiberuflich", "L02-status-selbststaendig", "L02-status-angestellt", "L02-status-praktikum"];

// Preserve the original IDs, examples and source metadata for existing histories.
export function prepareL02PhraseItem(item: Item): Item {
  if (item.lessonId !== "L02") return item;
  if (item.id === "L02-question-was") return { ...item, skill: "phrases" };
  const example = l02StatusExamples.find((entry) => entry.id === item.id);
  if (example) return { ...item, skill: "phrases", group: "Beruflicher Status", meaning: example.meaning, example: example.de, ...(item.id === "L02-status-praktikum" ? { article: "das" } : {}) };
  return item.id === "L02-traumberuf" ? { ...item, skill: "phrases" } : item;
}
