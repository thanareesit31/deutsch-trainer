import type { Item } from "./content";
import type { LearningFlow } from "./guided-learning";

export type GrammarTrack = "pronouns" | "verbs" | "sentences";
// Filter only the visible route. Keep the complete flow for restoring old evidence.
export function grammarTrackActivities(
  flow: LearningFlow,
  items: Item[],
  track: GrammarTrack,
) {
  return flow.activities.filter((activity) => {
    if (track === "pronouns") return flow.activities.some(a => a.id === "L02-pronoun-images-v4-1") ? activity.id.startsWith("L02-pronoun-images-v4-") : flow.activities.some(a => a.id === "L02-pronoun-images-v2-1") ? activity.id.startsWith("L02-pronoun-images-v2-") : flow.activities.some(a => a.type === "pronoun_matching") ? activity.type === "pronoun_matching" : activity.type === "pronoun_choice";
    if (track === "verbs")
      return !!activity.verbId && items.some(
        (item) => item.id === activity.verbId && !!item.verbContent,
      );
    return activity.type !== "pronoun_choice" && activity.type !== "pronoun_matching"
      && !activity.verbId && activity.id !== "L02-sein-reuse";
  });
}
