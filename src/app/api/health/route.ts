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
  const release = await db.rpc('release_course_readiness');
  const ready = !release.error && release.data?.courses === 12 && release.data?.cards === 136 && release.data?.tasks === 372 && release.data?.phraseTasks === 64 && release.data?.practiceSyncReady === true;
  return Response.json(
    {
      status: error || !ready ? "unavailable" : "ok",
      app: "deutsch-mit-sun",
      version: "5.0.0",
      runtime: process.versions.bun ? "bun" : "node",
      contentSource: "supabase",
      vocabulary: error ? null : count,
      lessonRelease: ready ? 'l15-l18-v1' : 'schema-pending',
    },
    { status: error || !ready ? 503 : 200 },
  );
}
