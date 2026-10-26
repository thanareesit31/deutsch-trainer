"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export type PhrasePracticeEvidence = {
  correct: boolean;
  topic: string;
};

export function PhrasePracticeInsights({
  evidence,
  recommendation,
  completed = false,
}: {
  evidence: readonly PhrasePracticeEvidence[];
  recommendation: string;
  completed?: boolean;
}) {
  const correct = evidence.filter(item => item.correct).length;
  const incorrectTopics = [...new Set(evidence.filter(item => !item.correct).map(item => item.topic))];
  return (
    <div className="phrase-practice-insights">
      <p className="eyebrow">{completed ? "ผลลัพธ์ของรอบนี้" : "ผลการฝึกที่ผ่านมา"}</p>
      {evidence.length ? (
        <>
          {!completed && <p><strong>ข้อที่ตอบถูก:</strong> {correct}/{evidence.length} ข้อที่ตรวจได้</p>}
          <p><strong>เรื่องที่ควรทบทวน:</strong> {incorrectTopics.length ? incorrectTopics.join(" · ") : completed ? "ระบบบันทึกคำตอบแล้วและจะใช้จัดชุดฝึกครั้งต่อไป" : "ยังไม่มีข้อที่ตอบผิดในข้อมูลชุดนี้"}</p>
          <p><strong>แนะนำให้ฝึกต่อ:</strong> {recommendation}</p>
        </>
      ) : (
        <p>ยังไม่มีผลฝึกสำหรับวิเคราะห์ เริ่มฝึกเพื่อให้ระบบเลือกข้อทบทวนจากคำตอบจริงของคุณ</p>
      )}
    </div>
  );
}

export function ResumePracticeDialog({
  href,
  done,
  total,
  onClose,
}: {
  href: string;
  done: number;
  total: number;
  onClose: () => void;
}) {
  return (
    <div className="phrase-resume-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="phrase-resume-dialog" role="dialog" aria-modal="true" aria-labelledby="phrase-resume-title">
        <div className="phrase-resume-heading"><span className="phrase-resume-icon"><AlertCircle size={22}/></span><h2 id="phrase-resume-title">มีแบบฝึกหัดค้างจากครั้งก่อน</h2></div>
        <div className="phrase-resume-progress-label"><span>ความคืบหน้า</span><strong>{done}/{total} ข้อ</strong></div>
        <div className="phrase-resume-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}><span style={{ width: `${total ? done / total * 100 : 0}%` }}/></div>
        <div className="phrase-resume-actions"><button className="button secondary" type="button" onClick={onClose}>ยกเลิก</button><Link className="button primary" href={href}>ทำต่อ <ArrowRight size={16}/></Link></div>
      </section>
    </div>
  );
}
