"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { useVocabularyAudio } from "./vocabulary-audio";

export function DialogueAudio({ source, onComplete, label = 'ฟังบทสนทนา' }: { source: string; onComplete?: () => void; label?: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false), [error, setError] = useState('');
  useEffect(() => () => { if (ref.current) { ref.current.onended = null; ref.current.onerror = null; ref.current.pause(); } }, []);
  function play() {
    setError(''); setPlaying(true);
    const audio = new Audio(source); ref.current = audio;
    const failed = () => { setPlaying(false); setError('เล่นเสียงไม่สำเร็จ กดฟังอีกครั้ง'); };
    audio.onended = () => { setPlaying(false); onComplete?.(); }; audio.onerror = failed;
    void audio.play().catch(failed);
  }
  return <div className="l02-dialogue-audio"><button type="button" className="button secondary" disabled={playing} onClick={play}><Volume2 size={20} aria-hidden="true" />{playing ? 'กำลังเล่นเสียง' : label}</button>{error && <p role="alert">{error}</p>}</div>;
}
export function FeedbackDialogueAudio({ source, text }: { source?: string; text: string }) {
  const { play, error } = useVocabularyAudio();
  return <><button type="button" className="german-listen-text" aria-label="ฟังบทสนทนา A และ B" onClick={() => play(text, source)}><Volume2 size={16} aria-hidden="true" /></button>{error && <span role="status" className="audio-listen-error">{error}</span>}</>;
}
