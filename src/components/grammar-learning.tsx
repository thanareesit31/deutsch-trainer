"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function GrammarLearningEntryPoints({ lessonId }: { lessonId: string }) {
  const cards = [
    ...(lessonId === "L02" ? [
      { id: "pronouns", symbol: "ich / du", title: "Personalpronomen", description: "สรรพนามบุรุษ · จับคู่สรรพนามกับภาพบุคคล" },
    ] : []),
    { id: "verbs", symbol: "Verb", title: "Verben", description: "กริยาและการผันตามประธาน" },
  ];
  return <main className="vocabulary-learning grammar-learning-entry">
    {cards.map((card) => <Link key={card.id} className="alphabet-entry-card" href={`/learn/${lessonId}/grammar/${card.id}`}>
      <span className="alphabet-entry-symbols" aria-hidden="true">{card.symbol}</span>
      <span className="alphabet-entry-copy"><span className="eyebrow">GRAMMATIK</span><span className="alphabet-entry-title"><strong>{card.title}</strong></span><small>{card.description}</small></span>
      <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
    </Link>)}
  </main>;
}

// Keep old bookmarks usable after removing the separate pronoun page.
export function L01GrammarEntryRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/learn/L01/grammar"); }, [router]);
  return <GrammarLearningEntryPoints lessonId="L01" />;
}

export function L02SentencesRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/learn/L02/phrases/sentences"); }, [router]);
  return <Link href="/learn/L02/phrases/sentences">คำถามและโครงสร้างประโยค</Link>;
}
