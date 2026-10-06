"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "./store";

export const lessonStateKeys = {
  alphabet: "deutsch-trainer-alphabet-learning-v1-L01",
  images: "deutsch-trainer-vocabulary-image-learning-v1-L01",
  verbs: "deutsch-trainer-verb-learning-L01",
} as const;
type Snapshot = Record<string, string>;
const Context = createContext<{
  read: (key: string) => string | null;
  write: (key: string, value: string) => void;
} | null>(null);

export function LessonStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useStore();
  // Changing accounts unmounts all lesson drafts, including in-flight callbacks.
  return (
    <AccountLessonState key={user?.id ?? "signed-out"} userId={user?.id}>
      {children}
    </AccountLessonState>
  );
}

function AccountLessonState({
  userId,
  children,
}: {
  userId?: string;
  children: React.ReactNode;
}) {
  const values = useRef<Snapshot>({});
  const pending = useRef<Snapshot>({});
  const saving = useRef(false);
  const active = useRef(false);
  const [ready, setReady] = useState(!userId);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const pendingKey = `deutsch-trainer-pending-lessons:${userId}`;
  const cachePending = useCallback(() => {
    try {
      if (Object.keys(pending.current).length)
        localStorage.setItem(pendingKey, JSON.stringify(pending.current));
      else localStorage.removeItem(pendingKey);
    } catch {
      /* A failed save is still visible and retryable in this tab. */
    }
  }, [pendingKey]);

  const flush = useCallback(async () => {
    if (saving.current || !supabase || !userId || !active.current) return;
    saving.current = true;
    try {
      while (active.current && Object.keys(pending.current).length) {
        const [key, value] = Object.entries(pending.current)[0];
        const { error } = await supabase.from("learner_lesson_states").upsert(
          {
            user_id: userId,
            lesson_key: key,
            state: JSON.parse(value),
          },
          { onConflict: "user_id,lesson_key" },
        );
        if (error) throw error;
        if (!active.current) return;
        if (pending.current[key] === value) delete pending.current[key];
        cachePending();
      }
      if (active.current) setError("");
    } catch {
      if (active.current)
        setError(
          "บันทึกบทเรียนไม่สำเร็จ ข้อมูลที่ทำไว้ยังรอส่ง กรุณาลองอีกครั้ง",
        );
    } finally {
      saving.current = false;
    }
  }, [userId, cachePending]);

  useEffect(() => {
    active.current = true;
    if (!userId || !supabase)
      return () => {
        active.current = false;
      };
    let cancelled = false;
    void (async () => {
      try {
        const { data, error } = await supabase!
          .from("learner_lesson_states")
          .select("lesson_key,state")
          .eq("user_id", userId);
        if (error) throw error;
        if (cancelled) return;
        const loaded: Snapshot = {};
        for (const row of data ?? [])
          loaded[row.lesson_key] = JSON.stringify(row.state);
        // Only the explicitly designated owner may claim the unowned prototype data.
        const legacyOwner = process.env.NEXT_PUBLIC_LEGACY_LESSON_OWNER_ID;
        if (legacyOwner && userId === legacyOwner) {
          const verified = await supabase!.auth.getUser();
          if (verified.error || verified.data.user?.id !== userId)
            throw new Error("Account changed during migration");
          for (const key of Object.values(lessonStateKeys)) {
            let raw: string | null = null;
            try {
              raw = localStorage.getItem(key);
            } catch {
              /* Cloud lessons work without browser storage. */
            }
            if (!raw) continue;
            if (!loaded[key]) {
              try {
                const state = JSON.parse(raw);
                if (!state || typeof state !== "object") continue;
                const { error } = await supabase!
                  .from("learner_lesson_states")
                  .upsert(
                    {
                      user_id: userId,
                      lesson_key: key,
                      state,
                    },
                    {
                      onConflict: "user_id,lesson_key",
                      ignoreDuplicates: true,
                    },
                  );
                if (error) throw error;
                // Re-read after insert so an existing cloud record always wins.
                const result = await supabase!
                  .from("learner_lesson_states")
                  .select("state")
                  .eq("user_id", userId)
                  .eq("lesson_key", key)
                  .single();
                if (result.error) throw result.error;
                loaded[key] = JSON.stringify(result.data.state);
              } catch (cause) {
                if (cause instanceof SyntaxError) continue; // Preserve malformed legacy data for manual recovery.
                throw cause;
              }
            }
            try {
              localStorage.removeItem(key);
            } catch {
              /* Re-import is idempotent if cleanup is unavailable. */
            }
          }
        }
        if (cancelled) return;
        try {
          const cached: unknown = JSON.parse(
            localStorage.getItem(pendingKey) ?? "{}",
          );
          if (cached && typeof cached === "object" && !Array.isArray(cached)) {
            for (const [key, raw] of Object.entries(cached)) {
              if (
                !Object.values(lessonStateKeys).includes(
                  key as typeof lessonStateKeys.alphabet,
                ) ||
                typeof raw !== "string"
              )
                continue;
              try {
                const state = JSON.parse(raw);
                if (state && typeof state === "object")
                  pending.current[key] = raw;
              } catch {
                /* Ignore corrupt pending drafts. */
              }
            }
          }
        } catch {
          /* Storage may be unavailable. Cloud state remains authoritative. */
        }
        values.current = { ...loaded, ...pending.current };
        setError("");
        setReady(true);
        await flush();
      } catch {
        if (!cancelled) setError("โหลดสถานะบทเรียนไม่สำเร็จ กรุณาลองอีกครั้ง");
      }
    })();
    return () => {
      cancelled = true;
      active.current = false;
    };
  }, [userId, retry, pendingKey, flush]);

  useEffect(() => {
    const reconnect = () => {
      void flush();
    };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.keys(pending.current).length) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("online", reconnect);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("online", reconnect);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [flush]);

  const read = useCallback((key: string) => values.current[key] ?? null, []);
  const write = useCallback(
    (key: string, value: string) => {
      if (!userId || !active.current || values.current[key] === value) return;
      values.current[key] = value;
      pending.current[key] = value;
      cachePending();
      void flush();
    },
    [userId, cachePending, flush],
  );

  if (!ready)
    return (
      <main className="loading" aria-busy={!error}>
        <p role={error ? "alert" : "status"}>
          {error || "กำลังโหลดบทเรียนของคุณ…"}
        </p>
        {error && (
          <button
            className="button primary"
            onClick={() => setRetry((n) => n + 1)}
          >
            ลองอีกครั้ง
          </button>
        )}
      </main>
    );
  return (
    <Context.Provider value={{ read, write }}>
      {error && (
        <div className="lesson-save-error" role="alert">
          <p>{error}</p>
          <button
            className="button secondary"
            onClick={() => {
              void flush();
            }}
          >
            ลองอีกครั้ง
          </button>
        </div>
      )}
      {children}
    </Context.Provider>
  );
}

export function useLessonState() {
  const value = useContext(Context);
  if (!value) throw new Error("LessonStateProvider required");
  return value;
}
