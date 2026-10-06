import type { NextConfig } from "next";
const testWorkspace = process.env.DEUTSCH_TEST_WORKSPACE === "1";
if (
  (testWorkspace || process.env.NEXT_PUBLIC_TEST_WORKSPACE_ID) &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("The local test workspace cannot be built or deployed.");
}
if (testWorkspace || process.env.NEXT_PUBLIC_TEST_WORKSPACE_ID) {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://invalid");
  if (
    !testWorkspace ||
    !process.env.NEXT_PUBLIC_TEST_WORKSPACE_ID ||
    url.protocol !== "http:" ||
    url.hostname !== "127.0.0.1" ||
    !url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Start the test workspace with npm run dev:test and its local database API.",
    );
  }
}
const config: NextConfig = {
  poweredByHeader: false,
  ...(testWorkspace
    ? {
        distDir: ".tools/test-workspace-next",
        typescript: { tsconfigPath: ".tools/test-workspace-tsconfig.json" },
        rewrites() {
          return {
            beforeFiles: [
              {
                source: "/__test-db/:path*",
                destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/:path*`,
              },
            ],
          };
        },
      }
    : {}),
};
export default config;
