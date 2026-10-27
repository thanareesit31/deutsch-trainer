"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import grammarCatalog from "@/data/l13-practice-catalog.json";
import vocabularyCatalog from "@/data/l13-vocabulary-catalog.json";
import { l13PracticeTopics, l13VocabularyTopics, parsePracticeHistory, readL13PracticeHistory, recommendPractice, resumablePracticeSession } from "@/lib/practice-planner";
import { PhrasePracticeInsights, ResumePracticeDialog, type PhrasePracticeEvidence } from "./phrase-practice-ui";
import { useStore } from "./store";
import { useLearning } from "./learning-store";

export function PracticeLanding({
  eyebrow,
  title,
  description,
  href,
  action,
  children,
  ariaLabel,
  insights,
  resume,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  children: ReactNode;
  ariaLabel: string;
  insights?: { evidence: PhrasePracticeEvidence[]; recommendation: string };
  resume?: { done: number; total: number };
}) {
  const [showResume, setShowResume] = useState(false);
  useEffect(() => { setShowResume(Boolean(resume?.done)); }, [href, resume?.done, resume?.total]);
  return (
    <main className="l14-practice-entry practice-landing">
      <section className="l14-practice-entry-main" aria-label={ariaLabel}>
        {insights ? <><h1 className="sr-only">{title}</h1><PhrasePracticeInsights {...insights} /></> : <>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </>}
        <Link className="button primary" href={href} onClick={resume?.done ? event => { event.preventDefault(); setShowResume(true); } : undefined}>
          {action} <ArrowRight size={18} />
        </Link>
      </section>
      <details className="l14-practice-entry-topics">
        <summary>ฝึกเฉพาะหัวข้อ</summary>
        <div className="practice-grammar-topic-list">{children}</div>
      </details>
      {resume && resume.done > 0 && showResume && <ResumePracticeDialog href={href} done={resume.done} total={resume.total} onClose={() => setShowResume(false)} />}
    </main>
  );
}

export function L13PracticeLanding({ skill, learnedItemIds, ...props }: Omit<Parameters<typeof PracticeLanding>[0], "insights"> & {
  skill: "grammar" | "vocabulary";
  learnedItemIds?: readonly string[];
}) {
  const { user } = useStore();
  const learning = useLearning();
  const [state, setState] = useState<{ evidence: PhrasePracticeEvidence[]; recommendation: ReturnType<typeof recommendPractice> | null; resume: { done: number; total: number } | null; error: boolean }>({ evidence: [], recommendation: null, resume: null, error: false });
  const learnedKey = learnedItemIds?.join(",");
  useEffect(() => {
    if (!user || !learning.ready) return;
    function refresh() {
      if (!user) return;
      try {
        const history = readL13PracticeHistory(user.id, localStorage, skill).filter(session => session.href.startsWith(`/practice/L13/${skill}/`));
        const topics = skill === "grammar" ? l13PracticeTopics : l13VocabularyTopics;
        const evidence = history.flatMap(session => session.items.flatMap(item => typeof item.result?.correct === "boolean"
          ? [{ correct: item.result.correct, topic: topics.find(topic => topic.id === item.question.topicId)?.title ?? "หัวข้อที่เคยฝึก", at: item.result.submittedAt }]
          : [])).sort((a, b) => b.at - a.at).slice(0, 20).map(({ correct, topic }) => ({ correct, topic }));
        const learned = new Set(learnedKey?.split(",") ?? []);
        const questions = skill === "grammar" ? grammarCatalog.questions : vocabularyCatalog.questions.filter(question => learned.has(question.itemId));
        const recommendation = questions.length ? recommendPractice(questions, history) : null;
        const pending = recommendation?.kind === "resume" ? resumablePracticeSession(history) : undefined;
        const done = pending?.items.filter(item => item.result).length ?? 0;
        setState({ evidence, recommendation, resume: pending && done > 0 ? { done, total: pending.items.length } : null, error: false });
      } catch {
        setState({ evidence: [], recommendation: null, resume: null, error: true });
      }
    }
    refresh();
    window.addEventListener("practice-progress-updated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("practice-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user, learning.ready, skill, learnedKey]);
  if (state.error) return <p role="alert">อ่านประวัติฝึกไม่ได้ กรุณาโหลดหน้าใหม่</p>;
  const recommendation = state.recommendation;
  return <PracticeLanding {...props}
    href={recommendation?.href ?? props.href}
    action={recommendation?.action ?? props.action}
    insights={{ evidence: state.evidence, recommendation: recommendation?.description ?? props.description }}
    resume={state.resume ?? undefined}
  />;
}

const l14GrammarStores = [
  { storage: "l14-grammar", href: "/practice/L14/grammar/basic", title: "ไวยากรณ์บท 14" },
  { storage: "l14-lokale-praepositionen", href: "/practice/L14/grammar/lokale-praepositionen", title: "Lokale Präpositionen" },
  { storage: "l14-wo-dativ", href: "/practice/L14/grammar/wo-dativ", title: "Wo? + Dativ" },
] as const;

export function L14GrammarPracticeLanding(props: Omit<Parameters<typeof PracticeLanding>[0], "insights">) {
  const { user } = useStore();
  const [state, setState] = useState<{ evidence: PhrasePracticeEvidence[]; pendingHref: string | null; resume: { done: number; total: number } | null; error: boolean }>({ evidence: [], pendingHref: null, resume: null, error: false });
  useEffect(() => {
    if (!user) return;
    function refresh() {
      if (!user) return;
      try {
        const history = l14GrammarStores.flatMap(entry => parsePracticeHistory(
          localStorage.getItem(`deutsch-trainer:review-prototype:${entry.storage}:v1:${entry.storage}-account-${user.id}`), entry.href,
        ).map(session => ({ ...session, topicTitle: entry.title })));
        const evidence = history.flatMap(session => session.items.flatMap(item => typeof item.result?.correct === "boolean"
          ? [{ correct: item.result.correct, topic: session.topicTitle, at: item.result.submittedAt }]
          : [])).sort((a, b) => b.at - a.at).slice(0, 20).map(({ correct, topic }) => ({ correct, topic }));
        const pending = history.filter(session => !session.completed && !session.archived && session.items.some(item => item.result))
          .sort((a, b) => b.createdAt - a.createdAt)[0];
        const done = pending?.items.filter(item => item.result).length ?? 0;
        setState({ evidence, pendingHref: pending?.href ?? null, resume: pending && done > 0 ? { done, total: pending.items.length } : null, error: false });
      } catch {
        setState({ evidence: [], pendingHref: null, resume: null, error: true });
      }
    }
    refresh();
    window.addEventListener("practice-progress-updated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("practice-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);
  if (state.error) return <p role="alert">อ่านประวัติฝึกไม่ได้ กรุณาโหลดหน้าใหม่</p>;
  return <PracticeLanding {...props}
    href={state.pendingHref ?? props.href}
    action={state.pendingHref ? "ฝึกต่อ" : props.action}
    insights={{ evidence: state.evidence, recommendation: state.pendingHref ? "ทำรอบไวยากรณ์ที่ค้างไว้ต่อ" : props.description }}
    resume={state.resume ?? undefined}
  />;
}
