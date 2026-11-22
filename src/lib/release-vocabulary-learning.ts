import images from '@/data/release-vocabulary-images.json';
import type { Item } from './content';
import { parseReleaseState, type ReleaseCourse, type ReleaseState } from './a13-release';

export function releaseVocabularyItems(course: ReleaseCourse): Item[] {
  return course.cards.map(card => {
    const visual = images.find(entry => entry.id === card.id);
    if (!visual) throw Error(`Missing vocabulary illustration: ${card.id}`);
    return {
      id: card.id, lessonId: course.lessonId, skill: 'vocabulary', collection: 'core',
      group: visual.group, title: card.title, answer: card.title, meaning: card.purpose,
      image: visual.image, audio: card.wordAudio ?? undefined,
      ...(card.noun ? { word: card.noun.word, article: card.noun.article, pluralOnly: card.noun.plural, type: 'noun' } : {}),
    };
  });
}

export function learnReleaseVocabulary(raw: string | null, course: ReleaseCourse, ids: readonly string[]): ReleaseState {
  const state = parseReleaseState(raw, course);
  const matched = new Set(ids);
  return { ...state, learned: [...new Set([...state.learned, ...course.cards.filter(card => matched.has(card.id)).map(card => card.id)])] };
}
