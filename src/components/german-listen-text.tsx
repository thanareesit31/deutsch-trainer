"use client";

import { Volume2 } from "lucide-react";
import { useVocabularyAudio } from "./vocabulary-audio";

export function GermanListenText({ text }: { text: string }) {
  const { play, error } = useVocabularyAudio();
  return <>
    <button type="button" className="german-listen-text" lang="de"
      aria-label={`ฟังเสียง ${text}`} onClick={() => play(text)}>
      {text} <Volume2 size={16} aria-hidden="true" />
    </button>
    {error && <span role="status" className="audio-listen-error">{error}</span>}
  </>;
}
