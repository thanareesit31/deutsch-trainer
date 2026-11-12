"use client";

import help from "@/data/practice-word-help.json";

const glossary: Readonly<Record<string, string>> = help.glossary;

export function PracticeGermanText({ text, onHelp, enabled = true, meanings }: { text: string; onHelp?: (word: string) => void; enabled?: boolean; meanings?: Readonly<Record<string, string>> }) {
  if (!enabled) return <>{text}</>;
  return <>{(text.match(/[\p{L}\p{M}]+|\s+|[^\p{L}\p{M}\s]+/gu) ?? []).map((word, index) => {
    const meaning = meanings?.[word] ?? meanings?.[word.toLocaleLowerCase("de")] ?? glossary[word] ?? glossary[word.toLocaleLowerCase("de")];
    if (!meaning) return word;
    return <span key={index} className="practice-word-meaning" tabIndex={0} data-th={meaning} aria-label={`${word}: ${meaning}`} onPointerEnter={() => onHelp?.(word)} onFocus={() => onHelp?.(word)} onClick={event => { event.currentTarget.focus(); onHelp?.(word); }}>{word}</span>;
  })}</>;
}
