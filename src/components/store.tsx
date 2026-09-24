"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { emptyStore, parseBackup, STORAGE_KEY, type Store } from "@/lib/engine";

interface StoreContext { data: Store; ready: boolean; error: string; commit: (next: Store) => void; reset: () => void }
const Context = createContext<StoreContext | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Store>(emptyStore);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const blocked = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const legacy = raw === null ? localStorage.getItem("deutschProgress") : null;
      if (raw || legacy) setData(parseBackup(JSON.parse(raw || legacy || "{}")));
    } catch {
      blocked.current = true;
      setError("อ่านประวัติในเบราว์เซอร์ไม่ได้ ระบบเก็บข้อมูลเดิมไว้ กรุณาตรวจการอนุญาตพื้นที่จัดเก็บ หรือสำรองข้อมูลก่อนรีเซ็ตในหน้าตั้งค่า");
    }
    setReady(true);
  }, []);
  function commit(next: Store) {
    if (blocked.current) throw new Error("ยังบันทึกไม่ได้ เพราะอ่านข้อมูลเดิมไม่สำเร็จ กรุณาตรวจพื้นที่จัดเก็บก่อน");
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { setError("บันทึกประวัติไม่ได้ พื้นที่จัดเก็บอาจเต็มหรือถูกปิดกั้น กรุณาสำรองข้อมูลและเปิดพื้นที่จัดเก็บ"); throw new Error("บันทึกไม่สำเร็จ กรุณาลองใหม่หลังเปิดพื้นที่จัดเก็บ"); }
    setData(next); setError("");
  }
  function reset() {
    const next = emptyStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    blocked.current = false; setData(next); setError("");
  }
  return <Context.Provider value={{ data, ready, error, commit, reset }}>{children}</Context.Provider>;
}
export function useStore() { const value = useContext(Context); if (!value) throw new Error("StoreProvider is required"); return value; }
