import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";
import { startTestApi } from "./test-workspace-api.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const webPort = Number(process.env.TEST_WORKSPACE_PORT ?? 3002);
const apiPort = Number(process.env.TEST_WORKSPACE_API_PORT ?? 54329);
for (const port of [webPort, apiPort]) {
  if (
    !Number.isSafeInteger(port) ||
    port < 1024 ||
    port > 65535 ||
    port === 3000
  )
    throw new Error(
      "Use dedicated test ports between 1024 and 65535 (not 3000).",
    );
}
if (webPort === apiPort)
  throw new Error("The web and database ports must differ.");
// Fail before starting Next, without stopping any existing server.
await new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once("error", reject);
  probe.listen(webPort, "127.0.0.1", () => probe.close(resolve));
});
await mkdir(".tools", { recursive: true });
await writeFile(
  ".tools/test-workspace-tsconfig.json",
  JSON.stringify(
    {
      extends: "../tsconfig.json",
      include: [
        "../next-env.d.ts",
        "../src/**/*.ts",
        "../src/**/*.tsx",
        "./test-workspace-next/dev/types/**/*.ts",
      ],
      exclude: ["../node_modules"],
    },
    null,
    2,
  ) + "\n",
);
const originalNextEnv = await readFile("next-env.d.ts", "utf8");
const recovery = process.env.TEST_WORKSPACE_RECOVERY === "1"
  ? JSON.parse(await readFile(".tools/test-workspace-recovery.json", "utf8"))
  : undefined;
const api = await startTestApi({ port: apiPort, webPort, restore: recovery });
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(webPort),
  ],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "development",
      DEUTSCH_TEST_WORKSPACE: "1",
      NEXT_PUBLIC_TEST_WORKSPACE_ID: randomUUID(),
      NEXT_PUBLIC_SUPABASE_URL: api.url,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "local-test-publishable-key",
      NEXT_PUBLIC_LEGACY_LESSON_OWNER_ID: "",
      DATABASE_URL: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      SUPABASE_SECRET_KEY: "",
    },
  },
);
console.log(
  `\nพื้นที่ทดสอบ: http://localhost:${webPort}\nบัญชี: tester@deutsch.test หรือ tester2@deutsch.test\nรหัสผ่าน: TestOnly123!\n${recovery ? "คืนประวัติทดสอบเดิมแล้ว พร้อม catalog ปัจจุบัน; กรุณาล็อกอินใหม่" : "ข้อมูลเริ่มว่างทุกครั้งที่เปิดคำสั่งนี้; refresh หน้าเว็บยังเรียนต่อได้"}\nเริ่มใหม่: Ctrl+C แล้ว npm run dev:test\n`,
);
let closing = false;
async function cleanup(code = 0) {
  if (closing) return;
  closing = true;
  if (child.exitCode === null && child.signalCode === null) {
    const stopped = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM");
    const timeout = setTimeout(() => child.kill("SIGKILL"), 5000);
    await stopped;
    clearTimeout(timeout);
  }
  await api.close();
  // Next generates this root declaration even with a custom tsconfig/distDir.
  const generated = await readFile("next-env.d.ts", "utf8");
  if (generated.includes("./.tools/test-workspace-next/"))
    await writeFile("next-env.d.ts", originalNextEnv);
  process.exitCode = code;
}
process.on("SIGINT", () => void cleanup());
process.on("SIGTERM", () => void cleanup());
child.once("exit", (code) => void cleanup(code ?? 0));
child.once("error", (error) => {
  console.error(error.message);
  void cleanup(1);
});
