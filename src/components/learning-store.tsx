"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "./store";
import type {
  ItemExposure,
  LearningAttempt,
  AttemptEvidence,
  KnowledgeState,
  PracticeSession,
  SessionItem,
} from "@/lib/learning";
interface History {
  exposures: ItemExposure[];
  attempts: LearningAttempt[];
  evidence: AttemptEvidence[];
  knowledge: KnowledgeState[];
  sessions: PracticeSession[];
  sessionItems: SessionItem[];
}
const empty = (): History => ({
  exposures: [],
  attempts: [],
  evidence: [],
  knowledge: [],
  sessions: [],
  sessionItems: [],
});
const Context = createContext<
  | (History & {
      ready: boolean;
      error: string;
      busy: boolean;
      reload: () => Promise<void>;
      act: (action: string, payload: Record<string, unknown>) => Promise<void>;
    })
  | null
>(null);
export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const [history, setHistory] = useState(empty);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const owner = useRef(user?.id);
  owner.current = user?.id;
  async function reload() {
    const id = user?.id;
    if (!supabase || !id) return;
    try {
      // Page reads so Supabase's row limit cannot silently truncate history.
      async function read(table: string) {
        const rows: unknown[] = [];
        for (let offset = 0; ; offset += 500) {
          let query = supabase!
            .from(table)
            .select("*")
            .eq("user_id", id)
            .order(
              table === "item_exposures" || table === "knowledge_state"
                ? "item_id"
                : table === "practice_sessions"
                ? "id"
                : "session_id"
            );
          if (
            ["session_items", "learning_attempts", "attempt_evidence"].includes(
              table
            )
          )
            query = query.order("ordinal");
          if (table === "attempt_evidence") query = query.order("dimension");
          const { data, error } = await query.range(offset, offset + 499);
          if (error) throw error;
          rows.push(...data);
          if (data.length < 500) break;
        }
        return rows;
      }
      const [exposures, attempts, evidence, knowledge, sessions, sessionItems] =
        await Promise.all(
          [
            "item_exposures",
            "learning_attempts",
            "attempt_evidence",
            "knowledge_state",
            "practice_sessions",
            "session_items",
          ].map(read)
        );
      if (owner.current !== id) return;
      setHistory({
        exposures,
        attempts,
        evidence,
        knowledge,
        sessions,
        sessionItems,
      } as History);
      setError("");
      setReady(true);
    } catch (cause) {
      if (owner.current === id) {
        setError(
          `โหลดประวัติการเรียนไม่สำเร็จ ตรวจสอบการเชื่อมต่อและ migration: ${
            (cause as Error).message
          }`
        );
        setReady(false);
      }
      throw cause;
    }
  }
  useEffect(() => {
    setHistory(empty());
    setReady(false);
    setError("");
    if (user) void reload().catch(() => {});
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  async function act(action: string, payload: Record<string, unknown>) {
    if (!supabase || !user || !ready || lock.current)
      throw new Error("ยังไม่พร้อมบันทึก กรุณาลองใหม่");
    lock.current = true;
    setBusy(true);
    try {
      const { error } = await supabase.rpc("learning_action", {
        action,
        payload,
      });
      if (error) throw error;
      await reload();
    } catch (cause) {
      setError(
        `บันทึกหรือโหลดผลไม่สำเร็จ กรุณาลองใหม่: ${(cause as Error).message}`
      );
      throw cause;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Context.Provider value={{ ...history, ready, error, busy, reload, act }}>
      {children}
    </Context.Provider>
  );
}
export function useLearning() {
  const value = useContext(Context);
  if (!value) throw new Error("LearningProvider required");
  return value;
}
