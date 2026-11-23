"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useReducer } from 'react';
import { type ReleaseCourse, parseReleaseState, releaseStateKey } from '@/lib/a13-release';
import { learnReleaseVocabulary, releaseVocabularyItems } from '@/lib/release-vocabulary-learning';
import { readLearnedImageVocabularyIds } from '@/lib/vocabulary-image-learning-storage';
import { lessonVocabularyImageGroups } from '@/lib/vocabulary-image-content';
import { lessonStateKeys, useLessonState } from './lesson-state-provider';
import { VocabularyImageMatching } from './vocabulary-image-matching';
import { A13ReleaseCourse } from './a13-release-course';
import { useLearning } from './learning-store';

export function ReleaseVocabularyLearning({ course, path, resumePrevious = false }: { course: ReleaseCourse; path: string; resumePrevious?: boolean }) {
  const storage = useLessonState();
  const history = useLearning();
  const [, refresh] = useReducer((value: number) => value + 1, 0);
  const items = useMemo(() => releaseVocabularyItems(course), [course]);
  const groups = useMemo(() => lessonVocabularyImageGroups(items, course.lessonId), [items, course]);
  const group = groups.find(entry => entry.route === path);
  const state = parseReleaseState(storage.read(releaseStateKey(course)), course);
  useEffect(() => {
    const raw = storage.read(releaseStateKey(course));
    const previous = parseReleaseState(raw, course);
    const legacy = [...readLearnedImageVocabularyIds(storage.read(lessonStateKeys.vocabularyImages(course.lessonId))), ...history.exposures.map(exposure => exposure.item_id)];
    const next = learnReleaseVocabulary(raw, course, legacy);
    if (next.learned.length > previous.learned.length) {
      storage.write(releaseStateKey(course), JSON.stringify(next));
      refresh();
    }
  }, [storage.read, storage.write, course, history.exposures]);
  if (resumePrevious && state.active) return <A13ReleaseCourse course={course} mode="learn" onTrialComplete={refresh} />;
  if (group) return <VocabularyImageMatching key={path} items={items} groupId={group.id} lessonId={course.lessonId} releaseCourse={course} />;
  return <main className="vocabulary-learning">
    <header className="page-heading"><h1>คำศัพท์</h1></header>
    {groups.map(entry => {
      const first = items.find(item => item.id === entry.wordOrder[0]);
      const learned = entry.wordOrder.filter(id => state.learned.includes(id)).length;
      return <Link key={entry.id} className="alphabet-entry-card vocabulary-image-entry-card" href={entry.route}>
        <span className="vocabulary-image-entry-art" aria-hidden="true">{first?.image && <Image src={first.image} alt="" width={240} height={160} />}</span>
        <span className="alphabet-entry-copy"><span className="eyebrow">BILDER WORTSCHATZ</span><span className="alphabet-entry-title"><strong>{entry.germanTitle}</strong></span><small>{entry.title} · เรียนแล้ว {learned} / {entry.wordOrder.length} คำ</small></span>
      </Link>;
    })}
    {state.active && <Link href={`/learn/${course.lessonId}/vocabulary?resume=previous`}>ทำโจทย์ที่ค้างไว้ต่อ</Link>}
  </main>;
}
