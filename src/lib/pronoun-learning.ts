import type { Item } from "./content";
import type { LearningFlow, LearningActivity } from "./guided-learning";

const art = "/images/lektion-2-pronoun-scenes/";
export const pronounScenes: Record<string, { caption: string; image: string; target: string; self?: boolean; group?: boolean; speakerImage?: string }> = {
  "L02-pronoun-ich": { caption: "ผู้พูดพูดถึงตัวเอง", image: art + "ich.webp", target: "ผู้พูด", self: true },
  "L02-pronoun-du": { caption: "พูดกับเพื่อนหนึ่งคน", image: art + "du.webp", target: "ผู้ฟัง" },
  "L02-pronoun-er": { caption: "กล่าวถึงผู้ชายหนึ่งคน", image: art + "er.webp", target: "คนที่พูดถึง" },
  "L02-pronoun-sie-sg": { caption: "กล่าวถึงผู้หญิงหนึ่งคน", image: art + "sie-singular.webp", target: "คนที่พูดถึง" },
  "L02-pronoun-wir": { caption: "ผู้พูดพูดถึงกลุ่มที่รวมตัวเองด้วย", image: art + "wir.webp", target: "กลุ่มที่มีผู้พูด", self: true, group: true },
  "L02-pronoun-ihr": { caption: "พูดกับเพื่อนหลายคน", image: art + "ihr.webp", target: "ผู้ฟังหลายคน", group: true },
  "L02-pronoun-sie-pl": { caption: "กล่าวถึงคนกลุ่มอื่น", image: art + "sie-plural.webp", target: "กลุ่มคนที่พูดถึง", group: true },
  "L02-pronoun-Sie": { caption: "พูดกับผู้ฟังหนึ่งคนแบบสุภาพ", image: art + "polite-singular.webp", target: "ผู้ฟังหนึ่งคน (สุภาพ)" },
};

export const politePluralScene: (typeof pronounScenes)[string] = { caption: "พูดกับผู้ฟังหลายคนแบบสุภาพ", image: art + "polite-plural.webp", target: "ผู้ฟังหลายคน (สุภาพ)", group: true };
export const pronounGroups = [
  { label: "1. Person", thai: "เกี่ยวกับตัวเอง", ids: ["L02-pronoun-ich", "L02-pronoun-wir"] },
  { label: "2. Person", thai: "พูดกับผู้ฟังโดยตรง", ids: ["L02-pronoun-du", "L02-pronoun-Sie", "L02-pronoun-ihr"] },
  { label: "3. Person", thai: "พูดถึงคนอื่น", ids: ["L02-pronoun-er", "L02-pronoun-sie-sg", "L02-pronoun-sie-pl"] },
];

export function prepareL02GrammarFlow(flow: LearningFlow, items: Item[]): LearningFlow {
  if (flow.activities.some(a => a.id === "L02-pronoun-images-v4-1")) return flow;
  const old = flow.activities.filter(a => a.type === "pronoun_choice");
  const entries = Object.keys(pronounScenes).filter(id => items.some(i => i.id === id) && old.some(a => a.contentIds.includes(id)));
  if (!entries.length) return flow;
  const boards: LearningActivity[] = [];
  for (const [index, group] of pronounGroups.entries()) {
    const ids = group.ids.filter(id => entries.includes(id));
    if (!ids.length) continue;
    boards.push({
      id: `L02-pronoun-images-v4-${index + 1}`,
      type: "pronoun_matching",
      section: `Personalpronomen · ${group.label}`,
      instruction: "เลือกสรรพนาม แล้วแตะภาพที่ตรงกัน",
      sourceScope: old[0].sourceScope,
      contentIds: ids,
      legacyMatchActivityIds: ["L02-pronoun-images-v1-1", "L02-pronoun-images-v1-2", "L02-pronoun-images-v2-1", "L02-pronoun-images-v2-2", "L02-pronoun-images-v2-3"],
      pairs: ids.map(id => ({ id, left: {id, text: pronounScenes[id].caption}, right: {id, ref: {itemId: id, field: "pronoun"}}, contentIds: [id], legacyActivityIds: old.filter(a => a.contentIds.includes(id)).map(a => a.id) })),
    });
  }
  const first = flow.activities.findIndex(a => a.type === "pronoun_choice" || a.type === "pronoun_matching");
  const historicalBoards: LearningActivity[] = [];
  for (let offset = 0; offset < entries.length; offset += 4) {
    const id = `L02-pronoun-images-v1-${offset / 4 + 1}`;
    if (flow.activities.some(activity => activity.id === id)) continue;
    const ids = entries.slice(offset, offset + 4);
    historicalBoards.push({
      id, type: "pronoun_matching",
      section: offset === 0 ? "Personalpronomen · Einzahl" : "Personalpronomen · Mehrzahl und Sie",
      instruction: "เลือกสรรพนาม แล้วแตะภาพที่ตรงกัน", sourceScope: old[0].sourceScope,
      contentIds: ids,
      pairs: ids.map(id => ({id, left: {id, text: pronounScenes[id].caption}, right: {id, ref: {itemId: id, field: "pronoun"}}, contentIds: [id], legacyActivityIds: old.filter(a => a.contentIds.includes(id)).map(a => a.id)})),
    });
  }
  const previousGroups = [
    {label: "Einzahl", ids: ["L02-pronoun-ich", "L02-pronoun-du", "L02-pronoun-er", "L02-pronoun-sie-sg"]},
    {label: "Mehrzahl", ids: ["L02-pronoun-wir", "L02-pronoun-ihr", "L02-pronoun-sie-pl"]},
    {label: "Höfliche Form", ids: ["L02-pronoun-Sie"]},
  ];
  for (const [index, group] of previousGroups.entries()) {
    const id = `L02-pronoun-images-v2-${index + 1}`;
    if (flow.activities.some(activity => activity.id === id)) continue;
    const ids = group.ids.filter(id => entries.includes(id));
    if (!ids.length) continue;
    historicalBoards.push({
      id, type: "pronoun_matching", section: `Personalpronomen · ${group.label}`,
      instruction: "เลือกสรรพนาม แล้วแตะภาพที่ตรงกัน", sourceScope: old[0].sourceScope,
      contentIds: ids,
      pairs: ids.map(id => ({id, left: {id, text: pronounScenes[id].caption}, right: {id, ref: {itemId: id, field: "pronoun"}}, contentIds: [id], legacyActivityIds: old.filter(a => a.contentIds.includes(id)).map(a => a.id)})),
    });
  }
  // Retain all historical activities for restoring their learned IDs and evidence.
  return {...flow, activities: [...flow.activities.slice(0, first), ...boards, ...historicalBoards, ...flow.activities.slice(first)]};
}
