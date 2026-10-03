export type AlphabetActivityType =
  | "listen_and_choose"
  | "find_sound";

export interface AlphabetItem {
  id: string;
  symbol: string;
  order: number;
  pronunciation: string;
  audio: string | null;
  specialSoundType?: "umlaut" | "eszett";
}

export interface AlphabetSet {
  id: string;
  position: number;
  activity: AlphabetActivityType;
  itemIds: string[];
}

export interface AlphabetLessonConfiguration {
  lessonId: string;
  sectionId: string;
  title: string;
  sets: AlphabetSet[];
  items: AlphabetItem[];
}

export function shuffle<T>(values: readonly T[]): T[] {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]];
  }
  return shuffled;
}

export function resolveAlphabetSetItems(
  set: AlphabetSet,
  catalog: AlphabetItem[],
): AlphabetItem[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return set.itemIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export function alphabetSetIsValid(
  set: AlphabetSet,
  items: AlphabetItem[],
): boolean {
  return items.length === 5 && new Set(items.map((item) => item.id)).size === 5;
}
