"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { a11GrammarPreviews } from "@/data/a11-grammar-previews";
import { useA11Preview } from "./a11-preview";
import inventory from "../../docs/exercise-mapping/a11-grammar-bank.json";
import { grammarDiscoveryLesson } from "@/lib/grammar-discovery";
import { completedDiscoveryTopics } from "@/lib/grammar-discovery-progress";
import { parsePracticeHistory, planDailyPractice, practiceStorageKey, resumablePracticeSession, type PracticeHistory } from "@/lib/practice-planner";
import { GrammarPilot } from "./dative-pilot";
import { useLearning } from "./learning-store";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { PracticeLanding } from "./practice-landing";
import { useStore } from "./store";

export function A11GrammarPractice({ lessonId, slug }: { lessonId: string; slug?: string }) {
  const { user } = useStore();
  const learning = useLearning();
  const lessonState = useLessonState();
  const lesson = inventory.lessons.find(entry => entry.lessonId === lessonId);
  const [revision, setRevision] = useState(0);
  const [history, setHistory] = useState<PracticeHistory[]>([]);
  const [historyError, setHistoryError] = useState(false);
  const bankSlug = slug === "daily" ? "daily" : "basic";
  const loader = slug === "basic" || slug === "daily" ? Object.entries(a11GrammarPreviews).find(([key]) => key === `${lessonId}-${bankSlug}`)?.[1] : undefined;
  const preview = useA11Preview(loader);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener("practice-progress-updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("practice-progress-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  useEffect(() => {
    if (!user) return;
    try {
      setHistory((['basic', 'daily'] as const).flatMap(entry => {
        const key = `a11-grammar-${lessonId.toLowerCase()}-${entry}`;
        return parsePracticeHistory(localStorage.getItem(practiceStorageKey(key, key, user.id)), `/practice/${lessonId}/grammar/${entry}`);
      }));
      setHistoryError(false);
    } catch { setHistoryError(true); }
  }, [user, lessonId, revision]);
  if (!user || !lesson || !learning.ready) return <p role="status">กำลังโหลดบทเรียนและประวัติการฝึก…</p>;
  const discovery = grammarDiscoveryLesson(lessonId);
  const completed = discovery ? completedDiscoveryTopics(lessonState.read(lessonStateKeys.discoveryGrammar(lessonId)), discovery) : [];
  const learned = lessonId === "L01" || lessonId === "L02"
    ? learning.exposures.map(entry => entry.item_id).filter(id => lesson.topics.some(topic => inventory.definitions.some(question => question.lessonId === lessonId && question.topicId === `${lessonId}-grammar-${topic.slug}` && question.targetId === id)))
    : completed.map(slug => `${lessonId}-GD-${slug}`);
  const storage = `a11-grammar-${lessonId.toLowerCase()}-${bankSlug}`;
  if (slug === "basic" || slug === "daily") {
    if (!loader || preview.error) return <p role="alert">โหลดชุดฝึกไวยากรณ์บทนี้ไม่สำเร็จ กรุณาลองใหม่</p>;
    if (!preview.html) return <p role="status">กำลังโหลดชุดฝึกไวยากรณ์…</p>;
    return <GrammarPilot userId={user.id} preview={{ html: preview.html, title: `แบบฝึกไวยากรณ์บท ${lessonId.slice(1)}`, accountPrefix: storage }} learnedItemIds={learned} />;
  }
  if (historyError) return <p role="alert">อ่านประวัติฝึกไม่ได้ กรุณาโหลดหน้าใหม่</p>;
  const pending = resumablePracticeSession(history);
  const done = pending?.items.filter(item => item.result).length ?? 0;
  const questionPool = inventory.definitions.filter(question => question.lessonId === lessonId && learned.includes(question.targetId));
  const plan = planDailyPractice(questionPool, history);
  const evidence = history.flatMap(session => session.items.flatMap(item => typeof item.result?.correct === "boolean" ? [{ correct: item.result.correct, topic: lesson.topics.find(topic => `${lessonId}-grammar-${topic.slug}` === item.question.topicId)?.title ?? "ไวยากรณ์", at: item.result.submittedAt }] : [])).sort((a, b) => b.at - a.at).slice(0, 20).map(({ correct, topic }) => ({ correct, topic }));
  const href = pending ? `${pending.href}?resume=${encodeURIComponent(pending.id)}` : learned.length ? `/practice/${lessonId}/grammar/${evidence.length ? 'daily' : 'basic'}` : `/learn/${lessonId}/grammar`;
  const recommendation = pending ? "ทำรอบที่ค้างไว้ต่อ" : evidence.length ? plan.reason : learned.length ? "เริ่มฝึกกฎและรูปคำที่เรียนแล้ว" : "เรียนไวยากรณ์ก่อน แล้วกลับมาฝึกหัวข้อที่เรียนแล้ว";
  return <PracticeLanding eyebrow={`GRAMMATIK · LEKTION ${lessonId.slice(1)}`} title={`ฝึกไวยากรณ์บท ${lessonId.slice(1)}`} description={recommendation} href={href} action={pending ? "ฝึกต่อ" : evidence.length ? "ฝึกต่อวันนี้" : learned.length ? "เริ่มฝึก" : "ไปเรียน"} ariaLabel={`ทางเข้าฝึกไวยากรณ์บท ${lessonId.slice(1)}`} insights={{ evidence, recommendation }} resume={pending && done > 0 ? { done, total: pending.items.length } : undefined}>
    <p className="practice-catalog-note">หัวข้อที่เรียนแล้ว {lessonId === 'L01' || lessonId === 'L02' ? new Set(questionPool.map(question => question.topicId)).size : completed.length} จาก {lesson.topicCount} · คลัง {lesson.questionDefinitions} ข้อ</p>
    <Link className="practice-grammar-topic" href={`/practice/${lessonId}/grammar/basic`}><div><h2>ฝึกต่อเนื่อง</h2><p>เริ่มจากหัวข้อที่เรียนแล้ว</p></div></Link>
    <Link className="practice-grammar-topic" href={`/practice/${lessonId}/grammar/daily`}><div><h2>ฝึกต่อวันนี้</h2><p>เลือกจากผลรายเป้าหมายและทักษะที่เคยตอบ</p></div></Link>
    <p className="practice-catalog-note">บันทึกผลไว้ในบัญชีเพื่อแนะนำโจทย์ครั้งต่อไป แยกจากคะแนนความก้าวหน้าหลัก</p>
  </PracticeLanding>;
}
