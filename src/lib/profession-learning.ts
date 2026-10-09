import type { Item } from "./content";
import type {
  GuidedState,
  LearningActivity,
  LearningFlow,
} from "./guided-learning";

export type PersonForm = "masculine" | "feminine";
export function professionImageSource(item: Item) {
  return `/images/lektion-2-profession-pairs/${item.professionContent!.conceptKey}.webp`;
}
// Keep installed catalogs compatible until the spelling migration is applied.
// The concept key and item ID stay stable so existing learning evidence survives.
export function prepareProfessionItem(item: Item): Item {
  if (item.lessonId !== "L02" || !item.professionContent) return item;
  const corrected = item.professionContent.conceptKey === "modell"
    ? { ...item, title: "Model", answer: "Model", word: "Model",
        professionContent: { ...item.professionContent, masculine: "Model", feminine: "Model" } }
    : item;
  return { ...corrected, image: professionImageSource(corrected) };
}
export const articleColors = {
  der: "#1686B2",
  die: "#D94B77",
  das: "#40A66B",
  plural: "#E6B83E",
};
export function professionLabel(item: Item, form: PersonForm) {
  const article =
    item.professionContent!.conceptKey === "modell"
      ? "das"
      : form === "masculine"
        ? "der"
        : "die";
  return {
    article,
    word: item.professionContent![form]!,
    text: `${article} ${item.professionContent![form]}`,
  };
}
export function formExplanation(item: Item) {
  const { masculine, feminine } = item.professionContent!;
  return `${masculine} → ${feminine}: ${feminine === masculine + "in" ? "เติม -in" : feminine === masculine ? "รูปคำเหมือนกัน ดู Artikel ประกอบ" : "เปลี่ยนรูปคำ ใช้รูปคู่นี้ในการเรียน"}`;
}
export function shuffle<T>(values: T[], random = Math.random): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function personLayout(item: Item, random = Math.random) {
  const given: PersonForm = random() < 0.5 ? "masculine" : "feminine";
  const forms: PersonForm[] =
    random() < 0.5 ? ["masculine", "feminine"] : ["feminine", "masculine"];
  return {
    item,
    given,
    people: forms.map((form) => ({
      form,
      label: professionLabel(item, form),
      given: form === given,
    })),
  };
}

// Keep all historical activities in the full flow; only the core track switches to these boards.
export function professionBoards(
  flow: LearningFlow,
  items: Item[],
  pageSize = 6,
): LearningActivity[] {
  const professions = items.filter(
    (i) => i.lessonId === "L02" && i.professionContent?.feminine,
  );
  const pages: LearningActivity[] = [];
  const previousBoards = pageSize === 4 ? [] : professionBoards(flow, items, 4);
  for (const collection of ["core", "extra"] as const) {
    const words = professions
      .filter((i) => i.collection === collection)
      .sort(
        (a, b) =>
          Number(
            a.professionContent!.feminine !==
              a.professionContent!.masculine + "in",
          ) -
          Number(
            b.professionContent!.feminine !==
              b.professionContent!.masculine + "in",
          ),
      );
    // Balance pages so a final page never contains just one or two professions.
    const count = Math.ceil(words.length / pageSize);
    for (let page = 0, offset = 0; page < count; page++) {
      const size = Math.ceil((words.length - offset) / (count - page));
      const group = words.slice(offset, offset + size);
      offset += size;
      const pairs = group.map((item) => {
        const legacyPairs = flow.activities
          .filter((a) => a.type === "pair_matching")
          .flatMap((a) =>
            (a.pairs ?? [])
              .filter((p) => p.contentIds.includes(item.id))
              .map((pair) => ({ activity: a, pair })),
          );
        return {
          id: item.id,
          left: {
            id: `${item.id}-male`,
            ref: { itemId: item.id, field: "masculine" as const },
          },
          right: {
            id: `${item.id}-female`,
            ref: { itemId: item.id, field: "feminine" as const },
          },
          contentIds: [
            ...new Set([
              item.id,
              ...legacyPairs.flatMap(({ pair }) => pair.contentIds),
            ]),
          ],
          // A completed old forms board is valid learning evidence, not a new answer.
          legacyActivityIds: legacyPairs.map(({ activity }) => activity.id),
          legacyMatches: legacyPairs.map(({ activity, pair }) => ({
            activityId: activity.id,
            pairId: pair.id,
          })).concat(previousBoards.filter((board) => board.pairs?.some((pair) => pair.id === item.id)).map((board) => ({ activityId: board.id, pairId: item.id }))),
        };
      });
      pages.push({
        id: pageSize === 4 ? `L02-berufe-${collection}-${page}` : `L02-berufe-v2-${collection}-${page}`,
        type: "profession_matching",
        section: "Berufe",
        instruction: "เลือกคำศัพท์ แล้วกดช่องว่างใต้ภาพที่ตรงกัน",
        sourceScope: collection === "core" ? "core_book" : "teacher_extension",
        contentIds: [...new Set(pairs.flatMap((p) => p.contentIds))],
        pairs,
      });
    }
  }
  return pages;
}

export function recordProfessionAnswer(
  state: GuidedState,
  itemId: string,
  correct: boolean,
): GuidedState {
  const old = state.professionAnswers?.[itemId] ?? {
    correct: 0,
    wrong: 0,
    hints: 0,
  };
  const next = {
    ...old,
    correct: old.correct + Number(correct),
    wrong: old.wrong + Number(!correct),
    hints: old.hints + Number(!correct && old.wrong === 1),
  };
  return {
    ...state,
    professionAnswers: { ...state.professionAnswers, [itemId]: next },
  };
}
