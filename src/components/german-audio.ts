"use client";

import { useEffect, useState } from "react";

type AudioSession = { type: string };
let activeSpeechSessions = 0;
let previousAudioSession: AudioSession | undefined;
let previousAudioSessionType: string | undefined;

function acquireSpeechAudioSession() {
  if (typeof navigator === "undefined") return () => {};
  const session = (navigator as Navigator & { audioSession?: AudioSession }).audioSession;
  if (!session) return () => {};
  if (activeSpeechSessions === 0) {
    previousAudioSession = session;
    previousAudioSessionType = session.type;
  }
  activeSpeechSessions++;
  try {
    session.type = "playback";
  } catch {
    // Safari versions without writable AudioSession support keep their default route.
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeSpeechSessions--;
    if (activeSpeechSessions > 0) return;
    const restoreSession = previousAudioSession;
    const restoreType = previousAudioSessionType;
    previousAudioSession = undefined;
    previousAudioSessionType = undefined;
    if (!restoreSession || !restoreType || restoreSession.type === restoreType) return;
    try {
      restoreSession.type = restoreType;
    } catch {
      // Keep playback functional if Safari rejects restoring the previous session.
    }
  };
}

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
  pitch = 1,
): boolean {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return false;
  }
  const synth = window.speechSynthesis;
  let releaseAudioSession = () => {};
  try {
    const availableVoices = synth.getVoices();
    const selectedVoice = voice
      ?? availableVoices.find(candidate => candidate.lang.toLowerCase().startsWith("de"))
      ?? availableVoices.find(candidate => candidate.default)
      ?? availableVoices[0];
    if (!selectedVoice) {
      callbacks.onError?.();
      return false;
    }
    releaseAudioSession = acquireSpeechAudioSession();
    if (synth.speaking || synth.pending || synth.paused) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = callbacks.onStart ?? null;
    utterance.onend = () => {
      try {
        callbacks.onEnd?.();
      } finally {
        releaseAudioSession();
      }
    };
    utterance.onerror = () => {
      try {
        callbacks.onError?.();
      } finally {
        releaseAudioSession();
      }
    };
    synth.speak(utterance);
    return true;
  } catch {
    releaseAudioSession();
    callbacks.onError?.();
    return false;
  }
}
