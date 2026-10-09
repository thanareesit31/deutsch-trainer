"use client";

import { useEffect, useRef, useState } from "react";
import { speakGermanText, useGermanVoice } from "./german-audio";

// One player per board, shared by tap-to-listen and correct-match playback.
export function useVocabularyAudio() {
  const voice = useGermanVoice();
  const audio = useRef<HTMLAudioElement | null>(null);
  const active = useRef(true);
  const attempt = useRef(0);
  const [error, setError] = useState("");
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; audio.current?.pause(); };
  }, []);
  function play(text: string, source?: string | null) {
    const current = ++attempt.current;
    audio.current?.pause();
    audio.current = null;
    window.speechSynthesis?.cancel();
    setError("");
    const failed = () => {
      if (active.current && current === attempt.current) setError("เล่นเสียงไม่สำเร็จ กดคำศัพท์เพื่อลองฟังอีกครั้ง");
    };
    if (source) {
      const sound = new Audio(source);
      audio.current = sound;
      sound.onerror = failed;
      void sound.play().catch(failed);
    } else if (!speakGermanText(text, voice, { onError: failed })) {
      setError("อุปกรณ์นี้ยังไม่มีเสียงภาษาเยอรมัน กรุณาเปิด German voice แล้วกดคำศัพท์อีกครั้ง");
    }
  }
  return { play, error };
}
