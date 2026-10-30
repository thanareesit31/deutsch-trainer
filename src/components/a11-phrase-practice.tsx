"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import inventory from "../../docs/exercise-mapping/a11-phrase-bank.json";
import { a11PhrasePreviews } from "@/data/a11-phrase-previews";
import { useA11Preview } from "./a11-preview";
import { parsePracticeHistory, practiceStorageKey, resumablePracticeSession, type PracticeHistory } from "@/lib/practice-planner";
import { GrammarPilot } from "./dative-pilot";
import { useLearning } from "./learning-store";
import { PracticeLanding } from "./practice-landing";
import { useStore } from "./store";

export function A11PhrasePractice({ lessonId, slug }: { lessonId: string; slug?: string }) {
  const { user } = useStore();
  const learning = useLearning();
  const lesson = inventory.lessons.find(entry => entry.lessonId === lessonId);
  const [revision, setRevision] = useState(0);
  const [history, setHistory] = useState<PracticeHistory[]>([]);
  const [historyError, setHistoryError] = useState(false);
  const bankSlug = slug === "daily" ? "daily" : "basic";
  const loader = slug === "basic" || slug === "daily" ? Object.entries(a11PhrasePreviews).find(([key]) => key === `${lessonId}-${bankSlug}`)?.[1] : undefined;
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
        const key = `a11-phrases-${lessonId.toLowerCase()}-${entry}`;
        return parsePracticeHistory(localStorage.getItem(practiceStorageKey(key, key, user.id)), `/practice/${lessonId}/phrases/${entry}`);
      }));
      setHistoryError(false);
    } catch { setHistoryError(true); }
  }, [user, lessonId, revision]);
  if (!user || !lesson || !learning.ready) return <p role="status">กำลังโหลดบทเรียนและประวัติการฝึก…</p>;
  const learned = learning.exposures.map(entry => entry.item_id).filter(id => lesson.targets.some(target => target.id === id));
  const storage = `a11-phrases-${lessonId.toLowerCase()}-${bankSlug}`;
  if (slug === "basic" || slug === "daily") {
    if (!loader || preview.error) return <p role="alert">โหลดชุดฝึกประโยคบทนี้ไม่สำเร็จ กรุณาลองใหม่</p>;
    if (!preview.html) return <p role="status">กำลังโหลดชุดฝึกประโยค…</p>;
    return <GrammarPilot userId={user.id} preview={{ html: preview.html, title: `แบบฝึกประโยคบท ${lessonId.slice(1)}`, accountPrefix: storage }} learnedItemIds={learned} />;
  }
  if (historyError) return <p role="alert">อ่านประวัติฝึกไม่ได้ กรุณาโหลดหน้าใหม่</p>;
  const pending = resumablePracticeSession(history);
  const done = pending?.items.filter(item => item.result).length ?? 0;
  const evidence = history.flatMap(session => session.items.flatMap(item => typeof item.result?.correct === "boolean" ? [{ correct: item.result.correct, topic: item.question.subskill === 'phrase_word_order' ? 'เรียงประโยค' : item.question.subskill === 'phrase_situation_choice' ? 'เลือกใช้ตามสถานการณ์' : 'เข้าใจประโยค', at: item.result.submittedAt }] : [])).sort((a, b) => b.at - a.at).slice(0, 20).map(({ correct, topic }) => ({ correct, topic }));
  const focus = evidence.find(item => !item.correct);
  const recommendation = pending ? "ทำรอบที่ค้างไว้ต่อ" : evidence.length ? focus ? `ทบทวน${focus.topic}จากผลครั้งก่อน แล้วคละกับประโยคที่เรียนแล้ว` : "ฝึกประโยคในสถานการณ์และรูปแบบใหม่จากสิ่งที่เรียนแล้ว" : learned.length ? "เริ่มจากประโยคที่เรียนแล้วหนึ่งข้อ ต่อหนึ่งเป้าหมาย" : "เรียนประโยคก่อน แล้วกลับมาฝึกจากสิ่งที่เรียนแล้ว";
  const href = pending ? `${pending.href}?resume=${encodeURIComponent(pending.id)}` : learned.length ? `/practice/${lessonId}/phrases/${evidence.length ? 'daily' : 'basic'}` : `/learn/${lessonId}/phrases`;
  return <PracticeLanding eyebrow={`REDEMITTEL · LEKTION ${lessonId.slice(1)}`} title={`ฝึกประโยคบท ${lessonId.slice(1)}`} description={recommendation} href={href} action={pending ? "ฝึกต่อ" : evidence.length ? "ฝึกต่อวันนี้" : learned.length ? "เริ่มฝึก" : "ไปเรียน"} ariaLabel={`ทางเข้าฝึกประโยคบท ${lessonId.slice(1)}`} insights={{ evidence, recommendation }} resume={pending && done > 0 ? { done, total: pending.items.length } : undefined}>
    <p className="practice-catalog-note">ประโยคที่เรียนแล้ว {learned.length} จาก {lesson.targetCount} · คลัง {lesson.questionDefinitions} ข้อ</p>
    <Link className="practice-grammar-topic" href={`/practice/${lessonId}/phrases/basic`}><div><h2>ฝึกต่อเนื่อง</h2><p>ประโยคที่เรียนแล้วหนึ่งข้อต่อหนึ่งเป้าหมาย</p></div></Link>
    <Link className="practice-grammar-topic" href={`/practice/${lessonId}/phrases/daily`}><div><h2>ฝึกต่อวันนี้</h2><p>ฝึกความเข้าใจ การเลือกใช้ และลำดับคำจากผลครั้งก่อน</p></div></Link>
    <p className="practice-catalog-note">บันทึกผลไว้ในบัญชีเพื่อแนะนำโจทย์ครั้งต่อไป แยกจากคะแนนความก้าวหน้าหลัก</p>
  </PracticeLanding>;
}
