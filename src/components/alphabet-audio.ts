"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AlphabetItem } from "@/lib/alphabet-learning";
import { speakGermanText, useGermanVoice } from "./german-audio";

export function useAlphabetAudio() {
  const voice = useGermanVoice();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState("");

  const play = useCallback(
    (item: AlphabetItem, onEnd?: () => void) => {
      setError("");
      audioRef.current?.pause();
      audioRef.current = null;
      if (item.audio) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        const audio = new Audio(item.audio);
        audioRef.current = audio;
        audio.onended = () => onEnd?.();
        audio.onerror = () => setError("เล่นไฟล์เสียงไม่สำเร็จ ลองฟังอีกครั้ง");
        void audio.play().catch(() => {
          setError("เล่นไฟล์เสียงไม่สำเร็จ ลองฟังอีกครั้ง");
        });
        return true;
      }

      const started = speakGermanText(
        item.pronunciation,
        voice,
        {
          onEnd,
          onError: () => setError("เล่นเสียงสังเคราะห์ไม่สำเร็จ ลองฟังอีกครั้ง"),
        },
        0.8,
      );
      if (!started) {
        setError("อุปกรณ์นี้ไม่สามารถเล่นเสียงภาษาเยอรมันได้");
      }
      return started;
    },
    [voice],
  );

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  return {
    play,
    error,
  };
}
