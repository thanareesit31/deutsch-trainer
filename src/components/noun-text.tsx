"use client";

import type { Item } from "@/lib/content";
import { findNoun, nounPresentation, type NounPresentation } from "@/lib/noun-presentation";
import { ArticleDot } from "./profession-matching";

export function NounPrefix({ noun }: { noun: NounPresentation | null }) {
  return noun ? <span className="noun-prefix" lang="de"><ArticleDot article={noun.color} />{noun.article}</span> : null;
}

export function NounText({ text, item, items = [] }: { text: string; item?: Item; items?: readonly Item[] }) {
  const noun = item ? nounPresentation(item) : findNoun(text, items);
  return noun ? <span className="noun-text" lang="de"><ArticleDot article={noun.color} />{noun.label}</span> : <>{text}</>;
}
