"use client";
import { Sun } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Catalog, Item, Lesson } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { prepareProfessionItem } from "@/lib/profession-learning";
import { prepareL02PhraseItem } from "@/lib/l02-phrase-content";
import { prepareL13VerbItem } from "@/lib/l13-grammar-learning";

type Content = Catalog & { coreVocabulary: Item[]; extraVocabulary: Item[] };
const ContentContext = createContext<Content | null>(null);
class CatalogNotInstalled extends Error {}

// Explicit pagination also supports future imports larger than Supabase's row limit.
async function readRows<T>(table: string): Promise<T[]> {
  if (!supabase) throw new Error("ยังไม่ได้ตั้งค่าการเชื่อมต่อฐานข้อมูล");
  const rows: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase
      .from(table)
      .select("data")
      .eq("status", "published")
      .order("position")
      .order("id")
      .range(offset, offset + 499);
    if (error?.code === "PGRST205") throw new CatalogNotInstalled();
    if (error) throw new Error("โหลดเนื้อหาบทเรียนไม่สำเร็จ กรุณาลองอีกครั้ง");
    rows.push(...(data ?? []).map((row) => row.data as T));
    if (!data || data.length < 500) return rows;
  }
}
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    Promise.all([
      readRows<Lesson>("content_lessons"),
      readRows<Item>("content_items"),
    ])
      .catch(async (error): Promise<[Lesson[], Item[]]> => {
        // Deployment bridge only: never hide network/auth/data errors with stale content.
        if (!(error instanceof CatalogNotInstalled)) throw error;
        const { default: seed } =
          await import("../../supabase/seed/catalog.json");
        const catalog = seed as Catalog;
        return [catalog.lessons, catalog.items];
      })
      .then(([lessons, allItems]) => {
        if (!active) return;
        if (!lessons.length) throw new Error("ยังไม่มีบทเรียนที่เผยแพร่");
        const lessonIds = new Set(lessons.map((l) => l.id));
        const items = allItems.filter((i) => lessonIds.has(i.lessonId)).map(prepareProfessionItem).map(prepareL02PhraseItem).map(prepareL13VerbItem);
        setContent({
          lessons,
          items,
          coreVocabulary: items.filter(
            (i) => i.skill === "vocabulary" && i.collection === "core",
          ),
          extraVocabulary: items.filter(
            (i) => i.skill === "vocabulary" && i.collection === "extra",
          ),
        });
      })
      .catch((err) => {
        if (active)
          setError(err instanceof Error ? err.message : "โหลดเนื้อหาไม่สำเร็จ");
      });
    return () => {
      active = false;
    };
  }, [retry]);
  if (!content)
    return (
      <main className="loading">
        <Sun className="spin" size={32} />
        <p role={error ? "alert" : "status"}>
          {error || "กำลังเชื่อมต่อพื้นที่เรียนรู้ของคุณ…"}
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
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
export function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error("ContentProvider is required");
  return value;
}
