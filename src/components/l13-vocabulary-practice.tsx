"use client";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import catalog from '@/data/l13-vocabulary-catalog.json';
import { l13VocabularyTopics } from '@/lib/practice-planner';
import { GrammarPilot } from './dative-pilot';
import { L13VocabularyChallenge } from './l13-vocabulary-challenge';
import { ArticleLegend } from './profession-matching';
import { useL13VocabularyEligibility } from './use-l13-vocabulary-eligibility';
import { isTestWorkspaceUser, isVocabularyPracticeAvailable, useStore } from './store';
import { PracticeLanding } from './practice-landing';

const topics = {
  urban: 'vocabUrban', culture: 'vocabCulture', leisure: 'vocabLeisure', extra: 'vocabExtra', basic: 'vocabBasic', daily: 'vocabDaily',
} satisfies Record<string, Parameters<typeof GrammarPilot>[0]['topic']>;

export function L13VocabularyPractice({ slug }: { slug?: string }) {
  const { user } = useStore();
  const eligibility = useL13VocabularyEligibility();
  if (!user || !isVocabularyPracticeAvailable(user)) return <p>กำลังเตรียมแบบฝึกหัด</p>;
  if (eligibility.error) return <div role="alert"><p>โหลดประวัติคำศัพท์ไม่ได้ กรุณาลองใหม่</p><button className="button secondary" onClick={() => { void eligibility.retry(); }}>ลองใหม่</button></div>;
  if (!eligibility.ready) return <p role="status">กำลังโหลดคำศัพท์ที่คุณเรียนแล้ว…</p>;
  const topic = slug === 'urban' || slug === 'culture' || slug === 'leisure' || slug === 'extra' || slug === 'basic' || slug === 'daily' ? topics[slug] : null;
  if (slug === 'challenge') return <L13VocabularyChallenge />;
  if (slug === 'picture-article') return <L13VocabularyChallenge format="pictureArticle" />;
  if (topic) return <div className="l13-vocab-basic-practice"><ArticleLegend /><GrammarPilot userId={user.id} topic={topic} learnedItemIds={eligibility.ids} /></div>;
  const learned = new Set(eligibility.ids);
  return <PracticeLanding
    eyebrow="WORTSCHATZ · LEKTION 13"
    title={learned.size ? "ฝึกคำศัพท์ที่เรียนแล้ว" : "เริ่มเรียนคำศัพท์บท 13"}
    description={learned.size ? "ฝึกต่อเนื่องจากคำที่เรียนแล้ว แล้วกลับมาทบทวนได้อีก" : "จับคู่คำกับภาพก่อน แล้วกลับมาฝึกจากคำที่เรียนแล้ว"}
    href={learned.size ? "/practice/L13/vocabulary/basic" : "/learn/L13/vocabulary"}
    action={learned.size ? "เริ่มฝึก" : "ไปเรียน"}
    ariaLabel="ชุดฝึกคำศัพท์บท 13"
  >
    <>
    <section className="practice-landing-extra" aria-label="แบบฝึกคำศัพท์ขั้นสูงบท 13">
      <div><h2>ใช้คำศัพท์ในบริบท</h2><p>เติมคำในเรื่องสั้น หาคำต่างกลุ่ม ดูภาพ ทายสถานที่ จัดหมวด ประกอบคำ ปริศนาคำศัพท์ และเลือก Artikel จากภาพ · คลัง 88 กิจกรรม ฝึกครั้งละไม่เกิน 15 กิจกรรม</p></div>
      <Link href="/practice/L13/vocabulary/challenge">ฝึกขั้นสูง <ArrowRight size={18} /></Link>
    </section>
    <section className="practice-landing-extra" aria-label="ฝึก Artikel จากภาพ">
      <div><h2>ดูภาพแล้วเลือกเพศคำนาม</h2><p>ดูภาพพร้อมชื่อคำนาม แล้วเลือก der, die หรือ das ฝึกจากคำที่เรียนแล้วครั้งละไม่เกิน 15 คำ</p></div>
      <Link href="/practice/L13/vocabulary/picture-article">ฝึก Artikel จากภาพ <ArrowRight size={18} /></Link>
    </section>
      {l13VocabularyTopics.map(entry => {
        const group = catalog.groups.find(group => group.topicId === entry.id);
        const ids = group?.ids.filter(id => learned.has(id)) ?? [];
        const count = catalog.questions.filter(q => q.topicId === entry.id && learned.has(q.itemId)).length;
        const content = <><div><h2>{entry.title}</h2><p>{ids.length ? `${ids.length} คำที่เรียนแล้ว · ครั้งละไม่เกิน 5 ข้อ` : 'เรียนคำศัพท์ในกลุ่มนี้ก่อนเริ่มฝึก'}</p></div>{count > 0 && <span>ทำแบบฝึกหัด <ArrowRight size={18} /></span>}</>;
        return count > 0 ? <Link key={entry.id} className="practice-grammar-topic" href={entry.href}>{content}</Link> : <div key={entry.id} className="practice-grammar-topic unavailable">{content}<Link href="/learn/L13/vocabulary">ไปเรียน</Link></div>;
      })}
    </>
    <p className="practice-catalog-note">บันทึกผลเพื่อแนะนำการฝึกครั้งถัดไป แยกจากความก้าวหน้าหลัก</p>
  </PracticeLanding>;
}
