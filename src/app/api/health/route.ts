export const dynamic = "force-dynamic";
export function GET() {
  return Response.json({ status: "ok", app: "deutsch-mit-sun", version: "5.0.0", runtime: process.versions.bun ? "bun" : "node", vocabulary: 181 });
}
