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
  callbacks: { onStart?: () => void; onEnd?: () => void; onError?: () => void } = {},
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
  try {
    const availableVoices = synth.getVoices();
    const selectedVoice = availableVoices.find(candidate => candidate.lang.toLowerCase().startsWith("de"))
      ?? voice
      ?? availableVoices.find(candidate => candidate.default)
      ?? availableVoices[0];
    if (!selectedVoice) {
      callbacks.onError?.();
      return false;
    }
    if (synth.speaking || synth.pending || synth.paused) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.onstart = callbacks.onStart ?? null;
    utterance.onend = callbacks.onEnd ?? null;
    utterance.onerror = callbacks.onError ?? null;
    synth.speak(utterance);
    return true;
  } catch {
    callbacks.onError?.();
    return false;
  }
}
