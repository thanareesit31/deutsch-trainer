import { professionBoards } from "./profession-learning";
import type { Item } from "./content";
import type { LearningActivity, LearningFlow } from "./guided-learning";

// Replace the old individual questions with four learning boards, using catalog content.
export function prepareL02VocabularyFlow(flow: LearningFlow, items: Item[]): LearningFlow {
  const boards = [[0, 12], [13, 19], [20, 90], [21, 100]].map(([from, to]): LearningActivity => {
    const numbers = items.filter((item) => item.lessonId === "L02" && item.numberContent && item.numberContent.value >= from && item.numberContent.value <= to && (from !== 20 || item.numberContent.value % 10 === 0) && (from !== 21 || [21, 48, 63, 89, 100].includes(item.numberContent.value)))
      .sort((a, b) => a.numberContent!.value - b.numberContent!.value);
    return {
      id: `L02-number-matching-${from}-${to}`,
      type: "number_matching",
      section: `Zahlen · ${from}–${to}`,
      instruction: "กดตัวเลขเพื่อฟังเสียง แล้วเลือกคำภาษาเยอรมันที่ตรงกัน",
      sourceScope: "core_book",
      contentIds: numbers.map((item) => item.id),
      ...((from === 13 || from === 20) ? { legacyMatchActivityIds: ["L02-number-matching-13-20"] } : {}),
      pairs: numbers.map((item) => ({
        id: item.id,
        left: { id: `${item.id}-digit`, ref: { itemId: item.id, field: "number" } },
        right: { id: `${item.id}-written`, ref: { itemId: item.id, field: "written" } },
        contentIds: [item.id],
        legacyActivityIds: flow.activities.filter((activity) => activity.contentIds.length === 1 && activity.contentIds[0] === item.id && ["number_to_word", "word_to_number", "audio_to_number", "compound_pattern"].includes(activity.type)).map((activity) => activity.id),
      })),
    };
  });
  const replacedTypes = new Set(["number_to_word", "word_to_number", "audio_to_number", "compound_pattern"]);
  return {
    ...flow,
    activities: [...boards, ...professionBoards(flow, items), ...professionBoards(flow, items, 4), ...flow.activities.filter((activity) => {
      if (["number_matching", "profession_matching"].includes(activity.type)) return false;
      return !(replacedTypes.has(activity.type) && activity.contentIds.some((id) => {
        const number = items.find((item) => item.id === id)?.numberContent;
        return number && (number.value <= 19 || (number.value >= 20 && number.value <= 90 && number.value % 10 === 0) || [21, 48, 63, 89, 100].includes(number.value));
      }));
    })],
  };
}
