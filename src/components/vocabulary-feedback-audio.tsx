"use client";

import { Volume2 } from "lucide-react";
import type { Item } from "@/lib/content";
import { nounPresentation } from "@/lib/noun-presentation";
import { useVocabularyAudio } from "./vocabulary-audio";

export function VocabularyFeedbackAudio({ text, item }: { text: string; item?: Item }) {
  const { play, error } = useVocabularyAudio();
  const spokenText = nounPresentation(item)?.label ?? text;
  return <>
    <button type="button" className="vocabulary-feedback-audio" aria-label={`ฟังเสียง ${spokenText}`} onClick={() => play(spokenText)}>
      <Volume2 size={17} aria-hidden="true" /> ฟังเสียง
    </button>
    {error && <span role="status" className="audio-listen-error">{error}</span>}
  </>;
}
