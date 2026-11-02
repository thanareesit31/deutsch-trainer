import type { Item } from "./content";
import type { LearningFlow } from "./guided-learning";
import { vocabularyTrackActivities } from "./guided-learning";
import { prepareL02VocabularyFlow } from "./l02-number-learning";
import { lessonVocabularyImageGroups } from "./vocabulary-image-content";

export function l02VocabularyProgress({ items, flow, exposureIds, imageLearnedIds }: {
  items: Item[];
  flow: LearningFlow | undefined;
  exposureIds: readonly string[];
  imageLearnedIds: readonly string[];
}) {
  const vocabulary = items.filter(item => item.lessonId === "L02" && item.skill === "vocabulary");
  const prepared = flow ? prepareL02VocabularyFlow(flow, items) : undefined;
  const activeIds = prepared ? new Set([
    ...vocabularyTrackActivities(prepared, items, "numbers").flatMap(activity => activity.contentIds),
    ...vocabularyTrackActivities(prepared, items, "core").flatMap(activity => activity.contentIds),
    ...lessonVocabularyImageGroups(items, "L02", ["Familienstand"]).flatMap(group => group.wordOrder),
  ]) : new Set(vocabulary.map(item => item.id));
  const targets = vocabulary.filter(item => activeIds.has(item.id));
  const learnedIds = new Set([...exposureIds, ...imageLearnedIds]);
  const learned = targets.filter(item => learnedIds.has(item.id)).length;
  return { targets, learned, total: targets.length, percentage: targets.length ? Math.round(learned * 100 / targets.length) : 0 };
}
