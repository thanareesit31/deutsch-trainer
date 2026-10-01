"use client";
import { FormEvent, useState } from "react";
import { Sun } from "lucide-react";
import { useStore } from "./store";

export function AuthScreen() {
  const { signIn, signUp, resendConfirmation, error: setupError } = useStore();
  const configMissing = setupError.includes("ไม่พบ NEXT_PUBLIC_SUPABASE_URL");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [needsConfirmation, setNeedsConfirmation] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      if (mode === "signin") await signIn(email.trim(), password);
      else {
        const needsConfirmation = await signUp(email.trim(), password);
        setNeedsConfirmation(needsConfirmation);
        if (needsConfirmation) setMessage("สมัครบัญชีแล้ว แต่ยังเข้าสู่ระบบไม่ได้จนกว่าจะยืนยันอีเมล ตรวจกล่อง Spam หรือส่งลิงก์ยืนยันอีกครั้ง");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "ดำเนินการไม่สำเร็จ"); }
    finally { setBusy(false); }
  }
  async function resend() {
    setBusy(true); setError(""); setMessage("");
    try { await resendConfirmation(email.trim()); setMessage("ขอส่งลิงก์ยืนยันอีกครั้งแล้ว ตรวจกล่องจดหมายและ Spam"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "ส่งลิงก์ยืนยันไม่สำเร็จ"); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><section className="auth-card panel"><div className="auth-brand"><span className="brand-mark"><Sun size={26} /></span><div><strong>Deutsch mit Sun</strong><small>พื้นที่เรียนภาษาเยอรมันของคุณ</small></div></div><span className="eyebrow">DEIN LERNRAUM, ÜBERALL</span><h1>{mode === "signin" ? "เข้าสู่บัญชีของคุณ" : "สร้างบัญชีผู้เรียน"}</h1><p>บันทึกความก้าวหน้าไว้ในบัญชี แล้วเรียนต่อได้จากทุกอุปกรณ์</p>
    <form onSubmit={submit} className="auth-form"><label htmlFor="auth-email">อีเมล</label><input id="auth-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /><label htmlFor="auth-password">รหัสผ่าน</label><input id="auth-password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" />{setupError && <div role="alert" className="notice error">{setupError}</div>}{error && <div role="alert" className="notice error">{error}</div>}{message && <div role="status" className="notice success">{message}</div>}<button className="button primary wide" type="submit" disabled={busy || configMissing}>{busy ? "กำลังดำเนินการ…" : mode === "signin" ? "เข้าสู่ระบบ" : "สมัครบัญชี"}</button>{needsConfirmation && mode === "signup" && <button className="auth-switch" type="button" disabled={busy || !email} onClick={() => void resend()}>ส่งลิงก์ยืนยันอีกครั้ง</button>}</form>
    <button className="auth-switch" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}>{mode === "signin" ? "ยังไม่มีบัญชี? สมัครผู้เรียนใหม่" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}</button><small className="auth-privacy">ข้อมูลความก้าวหน้าจะถูกแยกเก็บตามบัญชีของคุณ</small></section></main>;
}
