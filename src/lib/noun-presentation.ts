import type { Item } from "./content";

export type NounPresentation = { article: string; color: string; label: string };

export function nounPresentation(item: Item | undefined): NounPresentation | null {
  if (!item || item.skill !== "vocabulary") return null;
  const article = item.pluralOnly ? "die" : item.article || /^(der|die|das)\s/u.exec(item.answer)?.[1];
  if (!article) return null;
  const word = item.word || item.answer.replace(/^(der|die|das)\s/u, "");
  return { article, color: item.pluralOnly ? "plural" : article, label: `${article} ${word}` };
}

export function findNoun(text: string, items: readonly Item[]): NounPresentation | null {
  const key = text.normalize("NFC").toLocaleLowerCase("de");
  const plural = items.find(item => item.plural && (`die ${item.plural}`).normalize("NFC").toLocaleLowerCase("de") === key);
  if (plural) return { article: "die", color: "plural", label: `die ${plural.plural}` };
  const item = items.find(item => nounPresentation(item) && [item.answer, item.title, item.word].some(value => value?.normalize("NFC").toLocaleLowerCase("de") === key));
  if (item) return nounPresentation(item);
  const barePlural = items.find(item => item.plural?.normalize("NFC").toLocaleLowerCase("de") === key);
  if (barePlural) return { article: "die", color: "plural", label: `die ${barePlural.plural}` };
  const match = /^(der|die|das)\s+\S+(?:\s+\S+)?$/u.exec(text);
  return match ? { article: match[1], color: match[1], label: text } : null;
}
