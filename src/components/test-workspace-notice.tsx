"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { isTestWorkspaceUser, useStore } from './store';
import { returnToLastLessonPage } from '@/lib/test-workspace-last-page';

export function TestWorkspaceNotice() {
  const { user } = useStore();
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState('');
  if (!isTestWorkspaceUser(user)) return null;
  async function control(action: 'learn_all' | 'reset') {
    if (!supabase || !user || busy) return;
    setBusy(true);
    setError('');
    if (action === 'reset') window.dispatchEvent(new Event('test-workspace-changing'));
    try {
      const { data, error: requestError } = await supabase.rpc('test_workspace_control', { action });
      if (requestError) throw requestError;
      if (action === 'reset') {
        for (const key of Object.keys(localStorage)) {
          if ((key.startsWith('deutsch-trainer:review-prototype:') && key.includes(`-account-${user.id}`)) || key === `deutsch-trainer-pending-lessons:${user.id}`) localStorage.removeItem(key);
        }
        const response: unknown = data;
        if (!response || typeof response !== 'object' || !('session' in response)) throw new Error('Missing reset session');
        const session = response.session;
        if (!session || typeof session !== 'object' || !('access_token' in session) || !('refresh_token' in session) || typeof session.access_token !== 'string' || typeof session.refresh_token !== 'string') throw new Error('Invalid reset session');
        const { error: authError } = await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
        if (authError) throw authError;
      }
      if (action === 'learn_all' && window.location.pathname.startsWith('/learn/')) {
        returnToLastLessonPage();
      } else if (action === 'learn_all' && window.location.pathname.startsWith('/lesson/')) {
        window.location.reload();
      } else {
        window.location.assign('/practice');
      }
    } catch {
      setError('ทำรายการไม่สำเร็จ กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง');
      setBusy(false);
    }
  }
  return (
    <aside className="test-workspace-notice" aria-label="พื้นที่ทดสอบ">
      <strong>พื้นที่ทดสอบบนเครื่อง — ข้อมูลแยกจากบัญชีจริง</strong>
      <span>บัญชี {user?.email} · รหัสผ่าน TestOnly123!</span>
      <span>เปิดพื้นที่ทดสอบอีกครั้งจะเรียนต่อได้</span>
      <div className="test-workspace-controls">
        <button className="button secondary" disabled={busy} onClick={() => void control('learn_all')}>เรียนแล้วทั้งหมด</button>
        <button className="button secondary" disabled={busy} onClick={() => setConfirmReset(true)}>รีเซตการทดลอง</button>
      </div>
      <span>ใช้กับบัญชีทดลองนี้เท่านั้น · เรียนแล้วทั้งหมดไม่เพิ่มคะแนนหรือความชำนาญ</span>
      {busy && <span role="status">กำลังปรับข้อมูลทดลอง…</span>}
      {confirmReset && !busy && <div role="group" aria-label="ยืนยันรีเซตการทดลอง">
        <p>ล้างประวัติเรียน ผลฝึก และรอบค้างทุกบทของบัญชีนี้ เพื่อเริ่มทดลองใหม่หรือไม่? การตั้งค่าบัญชีจะยังอยู่</p>
        <div className="test-workspace-controls"><button className="button secondary" onClick={() => setConfirmReset(false)}>ยกเลิก</button><button className="button primary" onClick={() => void control('reset')}>ยืนยันรีเซต</button></div>
      </div>}
      {error && <div role="alert">{error} <button className="button secondary" onClick={() => window.location.reload()}>โหลดหน้าใหม่</button></div>}
    </aside>
  );
}
