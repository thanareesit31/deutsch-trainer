"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { a11VocabularyPreviews } from "@/data/a11-vocab-previews";
import inventory from "../../docs/exercise-mapping/a11-vocabulary-bank.json";
import { readLearnedImageVocabularyIds } from "@/lib/vocabulary-image-learning-storage";
import { parsePracticeHistory, planDailyPractice, practiceStorageKey, resumablePracticeSession, type PracticeHistory } from "@/lib/practice-planner";
import { ArticleLegend } from "./profession-matching";
import { useA11Preview } from "./a11-preview";
import { GrammarPilot } from "./dative-pilot";
import { useLearning } from "./learning-store";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { PracticeLanding } from "./practice-landing";
import { useStore } from "./store";

export function A11VocabularyPractice({ lessonId, slug }: { lessonId: string; slug?: string }) {
  const { user } = useStore();
  const learning = useLearning();
  const lessonState = useLessonState();
  const lesson = inventory.lessons.find(entry => entry.lessonId === lessonId);
  const [revision, setRevision] = useState(0);
  const [history, setHistory] = useState<PracticeHistory[]>([]);
  const [historyError, setHistoryError] = useState(false);
  const bankSlug = slug === "daily" ? "daily" : "basic";
  const loader = slug === "basic" || slug === "daily" ? Object.entries(a11VocabularyPreviews).find(([key]) => key === `${lessonId}-${bankSlug}`)?.[1] : undefined;
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
      const sessions = (['basic', 'daily'] as const).flatMap(entry => {
        const key = `a11-vocab-${lessonId.toLowerCase()}-${entry}`;
        return parsePracticeHistory(localStorage.getItem(practiceStorageKey(key, key, user.id)), `/practice/${lessonId}/vocabulary/${entry}`);
      });
      setHistory(sessions);
      setHistoryError(false);
    } catch {
      setHistoryError(true);
    }
  }, [user, lessonId, revision]);
  if (!user || !lesson || !learning.ready) return <p role="status">กำลังโหลดบทเรียนและประวัติการฝึก…</p>;
  const stateKey = lessonId === "L02" ? lessonStateKeys.l02Vocabulary : lessonStateKeys.vocabularyImages(lessonId);
  const imageIds = lessonId === "L02" ? [] : readLearnedImageVocabularyIds(lessonState.read(stateKey));
  const learned = [...new Set([...learning.exposures.map(entry => entry.item_id), ...imageIds])].filter(id => lesson.groups.some(group => group.itemIds.includes(id)));
  const storage = `a11-vocab-${lessonId.toLowerCase()}-${bankSlug}`;
  if (slug === "basic" || slug === "daily") {
    if (!loader || preview.error) return <p role="alert">โหลดชุดฝึกคำศัพท์บทนี้ไม่สำเร็จ กรุณาลองใหม่</p>;
    if (!preview.html) return <p role="status">กำลังโหลดชุดฝึกคำศัพท์…</p>;
    return <main className="l13-vocab-basic-practice"><ArticleLegend /><GrammarPilot userId={user.id} preview={{ html: preview.html, title: `แบบฝึกคำศัพท์บท ${lessonId.slice(1)}`, accountPrefix: storage }} vocabularyAudio learnedItemIds={learned} /></main>;
  }
  if (historyError) return <p role="alert">อ่านประวัติฝึกไม่ได้ กรุณาโหลดหน้าใหม่</p>;
  const pending = resumablePracticeSession(history);
  const done = pending?.items.filter(item => item.result).length ?? 0;
  const questionPool = inventory.definitions.filter(question => question.lessonId === lessonId && learned.includes(question.itemId));
  const plan = planDailyPractice(questionPool, history);
  const evidence = history.flatMap(session => session.items.flatMap(item => typeof item.result?.correct === "boolean" ? [{ correct: item.result.correct, topic: lesson.groups.find(group => group.topicId === item.question.topicId)?.title ?? "คำศัพท์", at: item.result.submittedAt }] : [])).sort((a, b) => b.at - a.at).slice(0, 20).map(({ correct, topic }) => ({ correct, topic }));
  const href = pending ? `${pending.href}?resume=${encodeURIComponent(pending.id)}` : learned.length ? `/practice/${lessonId}/vocabulary/${evidence.length ? 'daily' : 'basic'}` : `/learn/${lessonId}/vocabulary`;
  const recommendation = pending ? "ทำรอบที่ค้างไว้ต่อ" : evidence.length ? plan.reason : learned.length ? "เริ่มจากคำที่เรียนแล้ว แต่ละคำมีโจทย์วัดความหมาย Artikel หรือการสะกดแยกกัน" : "เรียนคำศัพท์ก่อน แล้วกลับมาฝึกคำที่เรียนแล้ว";
  return <PracticeLanding eyebrow={`WORTSCHATZ · LEKTION ${lessonId.slice(1)}`} title={`ฝึกคำศัพท์บท ${lessonId.slice(1)}`} description={recommendation} href={href} action={pending ? "ฝึกต่อ" : evidence.length ? "ฝึกต่อวันนี้" : learned.length ? "เริ่มฝึก" : "ไปเรียน"} ariaLabel={`ทางเข้าฝึกคำศัพท์บท ${lessonId.slice(1)}`} insights={{ evidence, recommendation }} resume={pending && done > 0 ? { done, total: pending.items.length } : undefined}>
    <p className="practice-catalog-note">คำที่เรียนแล้ว {learned.length} คำ · คลัง {lesson.questionDefinitions} ข้อ</p>
    <Link className="practice-grammar-topic" href={`/practice/${lessonId}/vocabulary/basic`}><div><h2>ฝึกต่อเนื่อง</h2><p>เริ่มจากคำที่เรียนแล้ว</p></div></Link>
    <Link className="practice-grammar-topic" href={`/practice/${lessonId}/vocabulary/daily`}><div><h2>ฝึกต่อวันนี้</h2><p>เลือกจากผลรายคำและทักษะที่เคยตอบ</p></div></Link>
    <p className="practice-catalog-note">บันทึกผลไว้ในบัญชีเพื่อแนะนำโจทย์ครั้งต่อไป แยกจากคะแนนความก้าวหน้าหลัก</p>
  </PracticeLanding>;
}
