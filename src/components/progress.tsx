"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Search, Download, Upload, X, CheckCircle2, AlertTriangle, Database, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

import { mergeStore, parseBackup, type Store, type Settings } from "@/lib/engine";
import { useStore } from "./store";
import { SectionTitle } from "./ui";
import type { StartSession } from "./trainer";

export function SettingsPage() {
  const { data, commit, reset } = useStore();
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const [pending, setPending] = useState<Store | null>(null);
  const [resetStep, setResetStep] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function update(partial: Partial<Settings>) { try { await commit({ ...data, settings: { ...data.settings, ...partial } }); setMessage("บันทึกการตั้งค่าแล้ว"); setError(""); } catch(e) { setError((e as Error).message); } }
  function download() {
    const blob = new Blob([JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `deutsch-progress-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage("สร้างไฟล์สำรองแล้ว เก็บไฟล์นี้เพื่อนำเข้าในอุปกรณ์อื่นได้");
  }
  async function readFile(file?: File) {
    if (!file) return;
    setError(""); setMessage("");
    try { if (file.size > 5 * 1024 * 1024) throw new Error("ไฟล์ใหญ่เกิน 5 MB"); const parsed = parseBackup(JSON.parse(await file.text())); setPending(parsed); }
    catch(e) { setError(`นำเข้าไม่สำเร็จ: ${(e as Error).message}`); }
    if (input.current) input.current.value = "";
  }
  async function importFile() { if (!pending) return; try { await commit(mergeStore(data, pending)); setMessage(`รวมประวัติ ${Object.keys(pending.progress).length} รายการแล้ว เก็บรายการที่ใหม่กว่าของแต่ละข้อ`); setPending(null); } catch(e) { setError((e as Error).message); } }
  return <><div className="page-heading"><div><span className="eyebrow">DEIN LERNRAUM, DEINE DATEN</span><h1>ตั้งค่าและข้อมูลของฉัน</h1><p>ปรับรอบฝึกให้เหมาะกับคุณ และพาประวัติการเรียนไปด้วยทุกที่</p></div></div><div className="settings-layout"><section className="panel"><SectionTitle title="รอบฝึกของคุณ" eyebrow="PREFERENCES" /><label className="setting-label">จำนวนข้อเริ่มต้นต่อรอบ</label><div className="count-options">{[5, 10, 20, 0].map(n => <button key={n} className={data.settings.sessionSize === n ? "selected" : ""} onClick={() => void update({ sessionSize: n })}>{n || "ทั้งหมด"}{n > 0 && <small>ข้อ</small>}</button>)}</div><label className="setting-label" htmlFor="default-direction">ทิศทางเริ่มต้นของ Quiz คำศัพท์</label><select id="default-direction" value={data.settings.direction} onChange={e => void update({ direction: e.target.value as Settings["direction"] })}><option value="de-th">เยอรมัน → ไทย</option><option value="th-de">ไทย → เยอรมัน</option></select><p className="muted-text">ตัวเลือกคำตอบจะสุ่มใหม่ในแต่ละรอบ เพื่อฝึกจำจากเนื้อหา</p></section><section className="panel"><SectionTitle title="สำรองข้อมูลระบบเดิม" eyebrow="YOUR PROGRESS" /><div className="data-summary"><span className="icon-tile large green"><Database size={25} /></span><div><strong>{Object.keys(data.progress).length} รายการมีประวัติ</strong><span>บันทึกส่วนกลางในบัญชีของคุณ</span></div></div><p>ส่วนนี้จัดการคะแนนสะสมของระบบเดิมเท่านั้น ไม่รวมประวัติ Learn, คำตอบ และ session ใหม่ การนำเข้าไม่ทำให้เนื้อหาถูกนับว่าเคยเรียน</p><div className="settings-actions"><button className="button primary" onClick={download}><Download size={17} />ส่งออก Progress เดิม</button><button className="button secondary" onClick={() => input.current?.click()}><Upload size={17} />นำเข้า Progress เดิม</button><input ref={input} type="file" accept=".json,application/json" className="sr-only" aria-label="เลือกไฟล์ Progress" onChange={e => readFile(e.target.files?.[0])} /></div><small className="muted-text">รองรับไฟล์เดิมที่มี progress และรหัส V001–V181 นำเข้าโดยเก็บประวัติที่ใหม่กว่ารายข้อ</small></section></div>
    {pending && <section className="panel import-preview"><h3>พร้อมนำเข้าข้อมูล</h3><p>พบประวัติ {Object.keys(pending.progress).length} รายการ ระบบจะรวมกับข้อมูลในเครื่องโดยไม่ลบข้ออื่น และใช้ประวัติที่ใหม่กว่าของแต่ละข้อ</p><div className="settings-actions"><button className="button primary" onClick={importFile}>ยืนยันรวมประวัติ</button><button className="button secondary" onClick={() => setPending(null)}>ยกเลิก</button></div></section>}
    {message && <div role="status" className="notice success"><CheckCircle2 size={19} />{message}</div>}{error && <div role="alert" className="notice error">{error}</div>}
    <section className="panel data-info"><span className="icon-tile yellow"><CheckCircle2 size={21} /></span><div><h3>คำศัพท์หลักครบทุกคำ</h3><p>181 คำหลักจากข้อมูลเดิม · 12 บท · ศัพท์เสริมเก็บแยก · เพิ่มเนื้อหาได้โดยรักษารหัส Progress เดิม</p><p>หากย้ายจากเว็บเดิมบน GitHub Pages ให้ส่งออกจากเว็บเดิมแล้วนำเข้าที่นี่ เพราะแต่ละที่อยู่เว็บเก็บประวัติแยกกัน</p></div></section>
    <section className="reset-section"><div><h3>ล้างข้อมูลระบบเดิม</h3><p>ล้างเฉพาะ Progress เดิมและการตั้งค่า ไม่รวมประวัติ Learn และ Practice ใหม่</p></div>{resetStep === 0 ? <button className="button danger-outline" onClick={() => setResetStep(1)}>รีเซ็ต Progress เดิม</button> : <div className="reset-confirm"><strong><AlertTriangle size={17} />ขั้นที่ 1: ยืนยันว่าต้องการล้างข้อมูล</strong>{resetStep === 1 ? <button className="button danger-outline" onClick={() => setResetStep(2)}>เข้าใจแล้ว ไปขั้นยืนยันสุดท้าย</button> : <><label htmlFor="reset-confirmation">ขั้นที่ 2: พิมพ์ RESET เพื่อยืนยัน</label><input id="reset-confirmation" value={confirmation} onChange={e => setConfirmation(e.target.value)} placeholder="RESET" /><button className="button danger" disabled={confirmation !== "RESET"} onClick={async () => { try { await reset(); setResetStep(0); setConfirmation(""); setMessage("รีเซ็ตประวัติและการตั้งค่าแล้ว"); setError(""); } catch(e) { setError((e as Error).message); } }}>ล้าง Progress เดิม</button></>}<button className="text-link" onClick={() => { setResetStep(0); setConfirmation(""); }}>ยกเลิก</button></div>}</section>
  </>;
}
