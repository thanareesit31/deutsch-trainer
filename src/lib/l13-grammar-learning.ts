import type { Item } from "./content";
import type { LearningFlow } from "./guided-learning";
import { l13VerbContent } from "./l13-verb-content";

const verbNotes: Record<string, string> = {
  "L13-V022": "gefallen ใช้ Dativ กับผู้ที่รู้สึกถูกใจ · du / er / sie / es เปลี่ยน a เป็น ä",
  "L13-V023": "gehören ใช้ Dativ เพื่อบอกว่าเป็นของใคร",
  "L13-V024": "helfen ใช้ Dativ กับผู้ที่ได้รับความช่วยเหลือ · du / er / sie / es เปลี่ยน e เป็น i",
  "L13-V025": "danken ใช้ Dativ กับผู้ที่เราขอบคุณ",
  "L13-V026": "finden มี e ช่วยก่อน -st / -t · ใช้พูดถึงความคิดเห็นเกี่ยวกับสถานที่",
  "L13-V029": "es gibt ใช้บอกว่ามีสิ่งใดอยู่ · es เป็นประธานคงที่ และสิ่งที่มีใช้ Akkusativ",
};

export function prepareL13VerbItem(item: Item): Item {
  const verbContent = l13VerbContent[item.id];
  return item.lessonId === "L13" && item.group === "Verben" && verbContent
    ? { ...item, verbContent }
    : item;
}

export function buildL13VerbFlow(items: Item[]): LearningFlow {
  return {
    stateKey: "deutsch-trainer-guided-learning-L13-grammar",
    title: "Verben",
    activities: items.filter(item => item.lessonId === "L13" && item.group === "Verben" && item.verbContent).map(item => ({
      id: `L13-conjugation-${item.id}`,
      type: "conjugation",
      section: item.answer,
      instruction: "จับคู่ประธานกับรูปผันที่ถูกต้อง",
      note: verbNotes[item.id] ?? "สังเกตส่วนท้ายของรูปผันตามประธาน",
      sourceScope: item.sourceScope ?? "core_book",
      contentIds: [item.id],
      verbId: item.id,
    })),
  };
}
