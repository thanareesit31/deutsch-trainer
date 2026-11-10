"use client";
import { useEffect, useRef, useState } from "react";
import type { DialogueAnnotatedPart } from "@/lib/phrase-dialogue-learning";
import { FeedbackDialogueAudio } from "./phrase-dialogue-media";

function mobileSentenceRole(part: DialogueAnnotatedPart) {
  switch (part.role) {
    case 'auxiliary': return 'กริยาช่วย';
    case 'participle': return 'Partizip II';
    case 'verb':
      if (part.label.includes('Infinitiv')) return 'Infinitiv';
      if (part.label.includes('ส่วนแยก')) return 'ส่วนแยกกริยา';
      if (part.label.includes('geht + es')) return 'geht + es';
      return 'กริยาหลัก';
    default: return part.label;
  }
}
function AnnotatedSentence({ parts }: { parts: DialogueAnnotatedPart[] }) {
  const sentence = useRef<HTMLDListElement | null>(null);
  const [fontSize, setFontSize] = useState(16);
  useEffect(() => {
    const element = sentence.current;
    if (!element) return;
    const context = document.createElement('canvas').getContext('2d');
    const measure = () => {
      const word = element.querySelector('dt');
      if (!context || !word) return;
      const style = getComputedStyle(word);
      context.font = `${style.fontWeight} 16px ${style.fontFamily}`;
      const metrics = Array.from(element.children, child => ({ width: context.measureText(child.querySelector('dt')?.textContent ?? '').width, minimum: parseFloat(getComputedStyle(child).minWidth) || 0 }));
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const available = element.clientWidth - gap * (metrics.length - 1);
      let low = 0, high = 16;
      for (let count = 0; count < 16; count++) {
        const size = (low + high) / 2;
        if (metrics.reduce((sum, metric) => sum + Math.max(metric.minimum, metric.width * size / 16), 0) <= available) low = size;
        else high = size;
      }
      setFontSize(Math.max(1, Math.floor(low * 10) / 10));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('resize', measure);
    document.fonts.addEventListener('loadingdone', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); document.fonts.removeEventListener('loadingdone', measure); };
  }, [parts]);
  return <div className="phrase-annotated-row"><dl ref={sentence} className="phrase-annotated-sentence" style={{fontSize: `${fontSize}px`}} aria-label="โครงสร้างประโยค">{parts.map((part, at) => <div className={`phrase-annotated-part phrase-sentence-role ${part.role}`} key={at}>
    <dt lang="de">{part.text}</dt>
    <dd><span className="phrase-annotation-arrow" aria-hidden="true">↓</span><span className="phrase-annotation-label">{part.label}</span><span className="phrase-mobile-role-label" aria-hidden="true">{mobileSentenceRole(part)}</span>{part.position && <small className="phrase-annotation-position">{part.position}</small>}</dd>
  </div>)}</dl></div>;
}
export function AnnotatedReply({ sentences }: { sentences: DialogueAnnotatedPart[][] }) {
  return <div className="phrase-annotated-reply">{sentences.map((parts, index) => <AnnotatedSentence parts={parts} key={index} />)}</div>;
}
export function AnnotatedTurn({ speaker, sentences, meaning, audio }: { speaker: 'A' | 'B'; sentences: DialogueAnnotatedPart[][]; meaning: string; audio?: Parameters<typeof FeedbackDialogueAudio>[0] }) {
  return <div className={`phrase-discovery-turn${speaker === 'B' ? ' reply' : ''}`}><span lang="de">{speaker}</span><div>
    <AnnotatedReply sentences={sentences} /><p lang="th">{meaning}</p>
    {audio && <div className="phrase-annotated-audio"><FeedbackDialogueAudio {...audio} /></div>}
  </div></div>;
}
