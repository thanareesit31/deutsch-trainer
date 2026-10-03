import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    return Response.json({ status: "unavailable" }, { status: 503 });
  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { count, error } = await db
    .from("content_items")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .eq("skill", "vocabulary")
    .eq("data->>collection", "core");
  return Response.json(
    {
      status: error ? "unavailable" : "ok",
      app: "deutsch-mit-sun",
      version: "5.0.0",
      runtime: process.versions.bun ? "bun" : "node",
      contentSource: "supabase",
      vocabulary: error ? null : count,
    },
    { status: error ? 503 : 200 },
  );
}
