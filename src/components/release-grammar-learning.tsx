"use client";

import Link from 'next/link';
import { parseReleaseState, releaseStateKey, type ReleaseCourse } from '@/lib/a13-release';
import { releaseGrammarTopics } from '@/lib/release-grammar-topics';
import { useLessonState } from './lesson-state-provider';
import {L15GrammarLearning} from './l15-grammar-learning';

export function ReleaseGrammarLearning({ course, topicSlug }: { course: ReleaseCourse; topicSlug?: string }) {
  const storage = useLessonState();
  const state = parseReleaseState(storage.read(releaseStateKey(course)), course);
  const topics = releaseGrammarTopics.filter(topic => topic.lessonId === course.lessonId);
  const topic = topics.find(topic => topic.slug === topicSlug);
  const card = topic && course.cards.find(card => card.id === `${course.lessonId}-${topic.slug}`);
  if (course.lessonId==='L15'&&card) return <L15GrammarLearning course={course}/>;
  return <main className="vocabulary-learning">
    {topics.map((topic, index) => {
      const card = course.cards.find(card => card.id === `${course.lessonId}-${topic.slug}`);
      if (!card) return null;
      const available = course.cards.slice(0, index).every(card => state.learned.includes(card.id));
      const content = <>
        <span className="alphabet-entry-symbols" aria-hidden="true">{topic.lessonId === 'L15' ? <span className="ownership-topic-symbol"><span>ihr</span><span>sein</span></span> : topic.symbol}</span>
        <span className="alphabet-entry-copy"><span className="eyebrow">GRAMMATIK</span><span className="alphabet-entry-title"><strong lang="de">{topic.title}</strong></span>{topic.lessonId === 'L15' ? <small>คำแสดงความเป็นเจ้าของ</small> : <small>{card.purpose} · {state.learned.includes(card.id) ? 'เรียนแล้ว' : available ? 'ยังเรียนไม่ครบ' : 'เรียนหัวข้อก่อนหน้าก่อน'}</small>}</span>
        <span className="alphabet-entry-arrow" aria-hidden="true">→</span>
      </>;
      return available ? <Link key={card.id} className="alphabet-entry-card" href={`/learn/${course.lessonId}/grammar/${topic.slug}`}>{content}</Link>
        : <div key={card.id} className="alphabet-entry-card" aria-disabled="true">{content}</div>;
    })}
  </main>;
}
