import phrasePracticeVersion from "@/data/phrase-practice-upgrade-version.json";
import practiceVersion from "@/data/a13-practice-version.json";
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
  const phraseUpgrade = await db.rpc('phrase_practice_upgrade_readiness');
  const phraseReady = !phraseUpgrade.error && phraseUpgrade.data?.schemaVersion >= phrasePracticeVersion.schemaVersion && phraseUpgrade.data?.lessons === 14 && phraseUpgrade.data?.extensionTasks >= phrasePracticeVersion.extensionTasks && phraseUpgrade.data?.metadataTasks >= phrasePracticeVersion.metadataTasks && phraseUpgrade.data?.contextCatalogReady === true;
  const ready = !release.error && release.data?.courses === 12 && release.data?.cards === 136 && release.data?.tasks === 372 && release.data?.phraseTasks === 64 && release.data?.practiceSyncReady === true && release.data?.practiceVersion === practiceVersion.schemaVersion && release.data?.extensionTasks === practiceVersion.extensionTasks && release.data?.contextCatalogReady === true;
  return Response.json(
    {
      status: error || !ready || !phraseReady ? "unavailable" : "ok",
      app: "deutsch-mit-sun",
      version: "5.0.0",
      runtime: process.versions.bun ? "bun" : "node",
      contentSource: "supabase",
      vocabulary: error ? null : count,
      phrasePracticeRelease: phraseReady ? 'l01-l14-practice-v1' : 'schema-pending',
      lessonRelease: ready ? 'l15-l18-practice-v2' : 'schema-pending',
    },
    { status: error || !ready || !phraseReady ? 503 : 200 },
  );
}
