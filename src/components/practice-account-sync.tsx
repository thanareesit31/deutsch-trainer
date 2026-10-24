"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { l13PracticeStores, parsePracticeHistory, practiceStorageKey } from '@/lib/practice-planner';

type Snapshot = { version: 1; sessions: Record<string, unknown>[]; activeId: string | null };
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function parseSnapshot(raw: string | null, href: string): Snapshot {
  parsePracticeHistory(raw, href);
  if (!raw) return { version: 1, sessions: [], activeId: null };
  const value: unknown = JSON.parse(raw);
  if (!record(value) || !Array.isArray(value.sessions) || !value.sessions.every(record)) throw new Error('Invalid history');
  return { version: 1, sessions: value.sessions, activeId: typeof value.activeId === 'string' ? value.activeId : null };
}
function stableSnapshot(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableSnapshot);
  if (record(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableSnapshot(value[key])]));
  return value;
}
function timestamp(session: Record<string, unknown>) {
  return typeof session.updatedAt === 'string' ? session.updatedAt : typeof session.createdAt === 'string' ? session.createdAt : '';
}
function mergeSession(local: Record<string, unknown>, remote: Record<string, unknown>) {
  if (!Array.isArray(local.items) || !Array.isArray(remote.items) || local.items.length !== remote.items.length) throw new Error('Invalid session');
  const latest = timestamp(local) > timestamp(remote) ? local : remote;
  const latestItems = latest.items;
  if (!Array.isArray(latestItems)) throw new Error('Invalid items');
  const items = latestItems.map((item: unknown, index: number) => {
    const localItem: unknown = local.items instanceof Array ? local.items[index] : null;
    const remoteItem: unknown = remote.items instanceof Array ? remote.items[index] : null;
    if (!record(item) || !record(localItem) || !record(remoteItem)) throw new Error('Invalid item');
    const remoteAttempt = remoteItem.attempt;
    const localAttempt = localItem.attempt;
    if (record(remoteAttempt) && record(localAttempt) && (remoteAttempt.status === 'pending' || remoteAttempt.confidence == null && localAttempt.confidence === 'guess') && localAttempt.status === 'completed' && remoteAttempt.submittedAt === localAttempt.submittedAt && remoteAttempt.response === localAttempt.response) return localItem;
    return remoteAttempt ? remoteItem : localAttempt ? localItem : item;
  });
  return { ...latest, items, completed: local.completed === true || remote.completed === true, position: Math.max(Number(local.position), Number(remote.position)) };
}

export function PracticeAccountSync({ userId, children }: { userId: string; children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saveError, setSaveError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [recoveredHistory, setRecoveredHistory] = useState(false);
  const [loadMessage, setLoadMessage] = useState('โหลดประวัติแบบฝึกหัดไม่ได้ กรุณาลองใหม่ ข้อมูลในเครื่องยังอยู่');
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let alive = true;
    let running = false;
    let requested = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const acknowledged = new Map<string, string>();
    const snapshots = () => l13PracticeStores.map(entry => ({ entry, key: practiceStorageKey(entry.storage, entry.frame, userId), snapshot: parseSnapshot(localStorage.getItem(practiceStorageKey(entry.storage, entry.frame, userId)), entry.href) }));
    async function upload() {
      requested = true;
      if (running) return;
      running = true;
      try {
        while (requested && alive) {
          requested = false;
          for (const { entry, snapshot } of snapshots()) for (const session of snapshot.sessions) {
            if (!alive) return;
            const id = `${entry.storage}:${session.id}`;
            const serialized = JSON.stringify(stableSnapshot(session));
            if (acknowledged.get(id) === serialized) continue;
            const { error } = await client.rpc('sync_practice_session', { p_bank_key: entry.storage, p_state: session });
            if (error) {
              if (error.code === 'PGRST301' || error.code === 'PGRST303') await client.auth.signOut({ scope: 'local' });
              throw error;
            }
            acknowledged.set(id, serialized);
          }
        }
        if (alive) setSaveError(false);
      } catch {
        if (alive) setSaveError(true);
      } finally { running = false; }
    }
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { void upload(); }, 400);
    };
    const pauseForTestControl = () => { alive = false; clearTimeout(timer); };
    window.addEventListener('test-workspace-changing', pauseForTestControl);
    async function load() {
      try {
        const rows: unknown[] = [];
        for (let offset = 0; ; offset += 200) {
          const readPage = () => client.from('learner_practice_sessions').select('bank_key,state').eq('user_id', userId).order('bank_key').order('session_id').range(offset, offset + 199);
          let result = await readPage();
          if (result.status === 401) {
            const refreshed = await client.auth.refreshSession();
            if (refreshed.error || !refreshed.data.session) {
              if (refreshed.error?.status === 400 || refreshed.error?.status === 401 || refreshed.error?.status === 403 || !refreshed.error) {
                await client.auth.signOut({ scope: 'local' });
              }
              throw new Error('Session refresh failed');
            }
            result = await readPage();
          }
          const { data, error } = result;
          if (error) throw error;
          if (!alive) return;
          const page: unknown = data;
          if (!Array.isArray(page)) throw new Error('Invalid history');
          rows.push(...page);
          if (page.length < 200) break;
        }
        const stores = l13PracticeStores.map(entry => {
          const key = practiceStorageKey(entry.storage, entry.frame, userId);
          const raw = localStorage.getItem(key);
          try {
            return { entry, key, snapshot: parseSnapshot(raw, entry.href) };
          } catch {
            // Keep the original bytes before recovering valid sessions or writing server history.
            if (raw !== null) localStorage.setItem(`${key}:recovery:${new Date().toISOString()}`, raw);
            const snapshot: Snapshot = { version: 1, sessions: [], activeId: null };
            let value: unknown;
            try { value = JSON.parse(raw ?? 'null'); } catch { value = null; }
            if (record(value) && value.version === 1 && Array.isArray(value.sessions)) {
              for (const session of value.sessions) {
                try {
                  snapshot.sessions.push(...parseSnapshot(JSON.stringify({ version: 1, sessions: [session] }), entry.href).sessions);
                } catch { /* The original session remains in the recovery copy. */ }
              }
            }
            if (alive) setRecoveredHistory(true);
            return { entry, key, snapshot };
          }
        });
        for (const row of rows) {
          if (!record(row) || typeof row.bank_key !== 'string' || !record(row.state)) throw new Error('Invalid session');
          const store = stores.find(s => s.entry.storage === row.bank_key);
          if (!store) throw new Error('Unknown bank');
          parsePracticeHistory(JSON.stringify({ version: 1, sessions: [row.state] }), store.entry.href);
          const remoteSession = row.state;
          acknowledged.set(store.entry.storage+':'+remoteSession.id, JSON.stringify(stableSnapshot(remoteSession)));
          const index = store.snapshot.sessions.findIndex(s => s.id === remoteSession.id);
          if (index < 0) store.snapshot.sessions.push(row.state);
          else store.snapshot.sessions[index] = mergeSession(store.snapshot.sessions[index], row.state);
        }
        for (const store of stores) {
          const latest = [...store.snapshot.sessions].sort((a, b) => timestamp(b).localeCompare(timestamp(a)))[0];
          store.snapshot.activeId = latest && typeof latest.id === 'string' ? latest.id : null;
          localStorage.setItem(store.key, JSON.stringify(store.snapshot));
        }
        window.addEventListener('practice-progress-updated', schedule);
        window.addEventListener('storage', schedule);
        window.addEventListener('online', schedule);
        window.addEventListener('focus', schedule);
        setStatus('ready');
        await upload();
      } catch (error) {
        if (alive) {
          setLoadMessage(error instanceof DOMException && error.name === 'QuotaExceededError'
            ? 'พื้นที่เก็บข้อมูลในเบราว์เซอร์เต็ม จึงยังโหลดประวัติไม่ได้ ข้อมูลเดิมยังอยู่'
            : 'โหลดประวัติแบบฝึกหัดไม่ได้ กรุณาลองใหม่ ข้อมูลในเครื่องยังอยู่');
          setStatus('error');
        }
      }
    }
    void load();
    return () => {
      alive = false;
      window.removeEventListener('test-workspace-changing', pauseForTestControl);
      clearTimeout(timer);
      window.removeEventListener('practice-progress-updated', schedule);
      window.removeEventListener('storage', schedule);
      window.removeEventListener('online', schedule);
      window.removeEventListener('focus', schedule);
    };
  }, [userId, retry]);
  if (status === 'loading') return <div className="loading">กำลังโหลดประวัติแบบฝึกหัดของคุณ…</div>;
  if (status === 'error') return <div className="loading" role="alert"><p>{loadMessage}</p><button onClick={() => { setStatus('loading'); setRetry(r => r + 1); }}>ลองใหม่</button><button onClick={() => { void supabase?.auth.signOut({ scope: 'local' }); }}>เข้าสู่ระบบใหม่</button></div>;
  return <>{recoveredHistory && <div role="status" className="notice">มีประวัติบางส่วนในเครื่องที่อ่านไม่ได้ ระบบเก็บสำเนาเดิมไว้แล้ว และโหลดประวัติที่ใช้ได้ให้คุณฝึกต่อ</div>}{saveError && <div role="status" className="notice"><span>เก็บคำตอบในเครื่องแล้ว แต่ยังบันทึกเข้าบัญชีไม่ได้ </span><button onClick={() => { setStatus('loading'); setRetry(r => r + 1); }}>ลองบันทึกอีกครั้ง</button></div>}{children}</>;
}
