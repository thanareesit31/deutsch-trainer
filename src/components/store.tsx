"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  emptyStore,
  mergeStore,
  parseBackup,
  STORAGE_KEY,
  type Store,
} from "@/lib/engine";
import { supabase } from "@/lib/supabase";

interface StoreContext {
  data: Store;
  ready: boolean;
  error: string;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  commit: (next: Store) => Promise<void>;
  reset: () => Promise<void>;
}
const Context = createContext<StoreContext | null>(null);

async function loadUserStore(userId: string): Promise<Store> {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");
  const [progressResult, settingsResult, daysResult] = await Promise.all([
    supabase
      .from("learner_progress")
      .select("item_id, progress")
      .eq("user_id", userId),
    supabase
      .from("learner_settings")
      .select("settings")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("learner_days")
      .select("day_key, count")
      .eq("user_id", userId),
  ]);
  if (progressResult.error || settingsResult.error || daysResult.error)
    throw new Error(
      "โหลดข้อมูลจากฐานข้อมูลไม่สำเร็จ ตรวจสอบตารางและนโยบาย RLS ใน Supabase"
    );
  const store = emptyStore();
  for (const row of progressResult.data || [])
    store.progress[row.item_id] = row.progress;
  const settings = settingsResult.data?.settings;
  if (settings) store.settings = { ...store.settings, ...settings };
  for (const row of daysResult.data || []) store.days[row.day_key] = row.count;
  return store;
}

async function persistStore(previous: Store, next: Store, userId: string) {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");
  const progressRows = Object.entries(next.progress)
    .filter(
      ([id, value]) =>
        JSON.stringify(previous.progress[id]) !== JSON.stringify(value)
    )
    .map(([item_id, progress]) => ({ user_id: userId, item_id, progress }));
  const dayRows = Object.entries(next.days)
    .filter(([day, count]) => previous.days[day] !== count)
    .map(([day_key, count]) => ({ user_id: userId, day_key, count }));
  if (progressRows.length) {
    for (const row of progressRows) {
      const { error } = await supabase.rpc("save_learner_progress", {
        p_item_id: row.item_id,
        p_progress: row.progress,
      });
      if (error)
        throw new Error(
          "บันทึกความก้าวหน้าไม่สำเร็จ ตรวจสอบ migration ใน Supabase"
        );
    }
  }
  if (JSON.stringify(previous.settings) !== JSON.stringify(next.settings)) {
    const { error } = await supabase
      .from("learner_settings")
      .upsert({ user_id: userId, settings: next.settings });
    if (error) throw new Error("บันทึกการตั้งค่าไม่สำเร็จ");
  }
  if (dayRows.length) {
    const { error } = await supabase
      .from("learner_days")
      .upsert(dayRows, { onConflict: "user_id,day_key" });
    if (error) throw new Error("บันทึกสถิติรายวันไม่สำเร็จ");
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Store>(emptyStore);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const dataRef = useRef(data);
  const userRef = useRef<User | null>(null);
  const loading = useRef(false);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setError(
        "ไม่พบ NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ในการตั้งค่า"
      );
      setReady(true);
      return;
    }
    let alive = true;
    async function hydrate(nextUser: User | null) {
      if (!alive) return;
      if (!nextUser) {
        userRef.current = null;
        setUser(null);
        dataRef.current = emptyStore();
        setData(emptyStore());
        setReady(true);
        setError("");
        return;
      }
      if (loading.current) return;
      loading.current = true;
      setReady(false);
      setError("");
      try {
        let loaded = await loadUserStore(nextUser.id);
        const localRaw =
          localStorage.getItem(STORAGE_KEY) ??
          localStorage.getItem("deutschProgress");
        if (localRaw) {
          const imported = parseBackup(JSON.parse(localRaw));
          const merged = mergeStore(loaded, imported);
          if (
            !Object.keys(loaded.progress).length &&
            !Object.keys(loaded.days).length
          )
            merged.settings = imported.settings;
          if (JSON.stringify(merged) !== JSON.stringify(loaded))
            await persistStore(loaded, merged, nextUser.id);
          loaded = merged;
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("deutschProgress");
        }
        if (!alive) return;
        userRef.current = nextUser;
        setUser(nextUser);
        dataRef.current = loaded;
        setData(loaded);
      } catch (cause) {
        if (alive)
          setError(
            cause instanceof Error
              ? cause.message
              : "เชื่อมต่อฐานข้อมูลไม่สำเร็จ"
          );
      } finally {
        loading.current = false;
        if (alive) setReady(true);
      }
    }
    void client.auth
      .getSession()
      .then(async ({ data: result, error: sessionError }) => {
        if (sessionError) throw sessionError;
        if (!result.session) {
          await hydrate(null);
          return;
        }
        const { data: verified, error: authError } =
          await client.auth.getUser();
        if (authError) throw authError;
        await hydrate(verified.user);
      })
      .catch((cause: unknown) => {
        if (alive) {
          const details = cause as {
            message?: string;
            status?: number;
            code?: string;
          };
          const reason = [
            details.message,
            details.code,
            details.status ? `HTTP ${details.status}` : "",
          ]
            .filter(Boolean)
            .join(" · ");
          setError(
            `ตรวจสอบบัญชีไม่สำเร็จ${
              reason ? `: ${reason}` : " ลองโหลดหน้าใหม่"
            }`
          );
          setReady(true);
        }
      });
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        void hydrate(session?.user ?? null);
      }
    );
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed"))
        throw new Error(
          "อีเมลนี้ยังไม่ได้ยืนยัน กรุณาเปิดลิงก์ยืนยันจากอีเมลก่อนเข้าสู่ระบบ"
        );
      throw new Error(error.message);
    }
  }
  async function signUp(email: string, password: string) {
    if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw new Error(error.message);
    return !data.session;
  }
  async function resendConfirmation(email: string) {
    if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw new Error(error.message);
  }
  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  async function commit(next: Store) {
    const currentUser = userRef.current;
    if (!currentUser) throw new Error("กรุณาเข้าสู่ระบบก่อนบันทึก");
    try {
      await persistStore(dataRef.current, next, currentUser.id);
      dataRef.current = next;
      setData(next);
      setError("");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "บันทึกข้อมูลไม่สำเร็จ";
      setError(message);
      throw cause;
    }
  }
  async function reset() {
    if (!supabase || !userRef.current)
      throw new Error("กรุณาเข้าสู่ระบบก่อนล้างข้อมูล");
    const id = userRef.current.id;
    const results = await Promise.all([
      supabase.from("learner_progress").delete().eq("user_id", id),
      supabase.from("learner_settings").delete().eq("user_id", id),
      supabase.from("learner_days").delete().eq("user_id", id),
    ]);
    if (results.some((result) => result.error))
      throw new Error("ล้างข้อมูลไม่สำเร็จ");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("deutschProgress");
    const next = emptyStore();
    dataRef.current = next;
    setData(next);
    setError("");
  }
  return (
    <Context.Provider
      value={{
        data,
        ready,
        error,
        user,
        signIn,
        signUp,
        resendConfirmation,
        signOut,
        commit,
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error("StoreProvider is required");
  return value;
}
