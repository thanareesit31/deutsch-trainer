import type { Item } from "./content";
import type { LearningFlow } from "./guided-learning";

export type GrammarTrack = "pronouns" | "verbs" | "sentences" | "es-gibt" | "dativ" | "lokale-praepositionen" | "possessivartikel";
// Filter only the visible route. Keep the complete flow for restoring old evidence.
export function grammarTrackActivities(
  flow: LearningFlow,
  items: Item[],
  track: GrammarTrack,
) {
  return flow.activities.filter((activity) => {
    if (track === "es-gibt") return activity.id.startsWith("L13-es-gibt-");
    if (track === "dativ") return activity.id.startsWith("L13-dativ-");
    if (track === "lokale-praepositionen") return activity.id.startsWith("L14-position-");
    if (track === "possessivartikel") return activity.id.startsWith("L15-possessive-");
    if (track === "pronouns") return flow.activities.some(a => a.id === "L02-pronoun-images-v4-1") ? activity.id.startsWith("L02-pronoun-images-v4-") : flow.activities.some(a => a.id === "L02-pronoun-images-v2-1") ? activity.id.startsWith("L02-pronoun-images-v2-") : flow.activities.some(a => a.type === "pronoun_matching") ? activity.type === "pronoun_matching" : activity.type === "pronoun_choice";
    if (track === "verbs")
      return !!activity.verbId && items.some(
        (item) => item.id === activity.verbId && !!item.verbContent,
      );
    return activity.type !== "pronoun_choice" && activity.type !== "pronoun_matching"
      && !activity.verbId && activity.id !== "L02-sein-reuse";
  });
}
