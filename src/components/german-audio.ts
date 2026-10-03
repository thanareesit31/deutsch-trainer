"use client";

import { useEffect, useState } from "react";

export function useGermanVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () =>
      setVoice(
        window.speechSynthesis
          .getVoices()
          .find((candidate) => candidate.lang.toLowerCase().startsWith("de")) ||
          null,
      );
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);
  return voice;
}

export function speakGermanText(
  text: string,
  voice: SpeechSynthesisVoice | null,
  callbacks: { onEnd?: () => void; onError?: () => void } = {},
  rate = 0.8,
): boolean {
  if (
    !voice ||
    typeof window === "undefined" ||
    !("speechSynthesis" in window)
  ) {
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.voice = voice;
  utterance.rate = rate;
  utterance.onend = callbacks.onEnd ?? null;
  utterance.onerror = callbacks.onError ?? null;
  window.speechSynthesis.speak(utterance);
  return true;
}
