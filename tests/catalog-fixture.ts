import seed from "../supabase/seed/catalog.json";
import type { Catalog } from "../src/lib/content";
export const { items, lessons } = seed as Catalog;
export const coreVocabulary = items.filter(
  (i) => i.skill === "vocabulary" && i.collection === "core",
);
export const extraVocabulary = items.filter(
  (i) => i.skill === "vocabulary" && i.collection === "extra",
);
export const itemById = new Map(items.map((i) => [i.id, i]));
