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
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return false;
  }
  const synth = window.speechSynthesis;
  const selectedVoice = synth.getVoices().find(candidate => candidate.lang.toLowerCase().startsWith("de")) ?? voice;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = rate;
  utterance.onend = callbacks.onEnd ?? null;
  utterance.onerror = callbacks.onError ?? null;
  try {
    synth.speak(utterance);
    return true;
  } catch {
    callbacks.onError?.();
    return false;
  }
}
