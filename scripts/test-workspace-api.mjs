// Development-only adapter: real migration SQL/RLS, simulated Supabase Auth/REST.
// Never reads .env.local, DATABASE_URL or connects to a hosted database.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createDatabase } from "../tests/learning-database.mjs";

export const password = "TestOnly123!";
const tables = new Set([
  "content_lessons",
  "content_items",
  "learner_progress",
  "learner_settings",
  "learner_days",
  "learner_lesson_states",
  "item_exposures",
  "practice_sessions",
  "session_items",
  "learning_attempts",
  "attempt_evidence",
  "knowledge_state",
]);
const writable = {
  learner_lesson_states: { keys: ["user_id", "lesson_key"], values: ["state"] },
  learner_settings: { keys: ["user_id"], values: ["settings"] },
  learner_days: { keys: ["user_id", "day_key"], values: ["count"] },
};
function identifier(value) {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) throw new Error("Unsupported column");
  return `"${value}"`;
}
function expression(value) {
  if (value === "data->>collection") return "data->>'collection'";
  return identifier(value);
}
function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}
async function bodyOf(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 2_000_000) throw httpError(413, "Request too large");
  }
  return data ? JSON.parse(data) : {};
}

export async function startTestApi({ port = 54329, webPort = 3002 } = {}) {
  const db = await createDatabase();
  await db.exec("reset role");
  const accounts = ["tester@deutsch.test", "tester2@deutsch.test"].map(
    (email) => ({
      id: randomUUID(),
      email,
      aud: "authenticated",
      role: "authenticated",
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: {},
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
    }),
  );
  for (const account of accounts)
    await db.query("insert into auth.users(id) values ($1)", [account.id]);
  const sessions = new Map();
  const refreshTokens = new Map();
  const origins = new Set([
    `http://localhost:${webPort}`,
    `http://127.0.0.1:${webPort}`,
  ]);
  function issueSession(user) {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const encode = (object) =>
      Buffer.from(JSON.stringify(object)).toString("base64url");
    const access_token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: user.id, role: "authenticated", exp: expiresAt, jti: randomUUID() })}.${randomUUID()}`;
    const session = {
      access_token,
      refresh_token: randomUUID(),
      token_type: "bearer",
      expires_in: 3600,
      expires_at: expiresAt,
      user,
    };
    sessions.set(access_token, session);
    refreshTokens.set(session.refresh_token, session);
    return session;
  }
  function revoke(session) {
    if (!session) return;
    sessions.delete(session.access_token);
    refreshTokens.delete(session.refresh_token);
  }
  const server = createServer(async (req, res) => {
    const send = (status, data) => {
      res.statusCode = status;
      res.end(
        req.method === "HEAD" || status === 204
          ? undefined
          : JSON.stringify(data),
      );
    };
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    const origin = req.headers.origin;
    if (origin && !origins.has(origin))
      return send(403, { message: "Local test origin required" });
    // Reject cross-site requests, even when no Origin was supplied.
    if (!origin && req.headers["sec-fetch-site"] === "cross-site")
      return send(403, { message: "Local test origin required" });
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "apikey,authorization,content-type,x-client-info,prefer,range,range-unit,x-supabase-api-version",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,POST,DELETE,OPTIONS",
    );
    res.setHeader("Access-Control-Expose-Headers", "content-range");
    if (req.method === "OPTIONS") return send(204);
    try {
      const url = new URL(req.url, "http://127.0.0.1");
      const token = req.headers.authorization?.replace(/^Bearer /i, "");
      const found = sessions.get(token);
      const session = found?.expires_at > Date.now() / 1000 ? found : undefined;
      if (url.pathname === "/health" && req.method === "GET")
        return send(200, { status: "ok", testWorkspace: true });
      if (url.pathname.startsWith("/auth/v1/")) {
        if (url.pathname === "/auth/v1/token" && req.method === "POST") {
          const body = await bodyOf(req);
          if (url.searchParams.get("grant_type") === "refresh_token") {
            const old = refreshTokens.get(body.refresh_token);
            if (!old) throw httpError(401, "Invalid test refresh token");
            revoke(old);
            return send(200, issueSession(old.user));
          }
          if (url.searchParams.get("grant_type") !== "password")
            throw httpError(400, "Unsupported test login");
          const user = accounts.find(
            (account) => account.email === body.email?.toLowerCase().trim(),
          );
          if (!user || body.password !== password)
            throw httpError(400, "Invalid test email or password");
          return send(200, issueSession(user));
        }
        if (!session) throw httpError(401, "Test login required");
        if (url.pathname === "/auth/v1/user" && req.method === "GET")
          return send(200, session.user);
        if (url.pathname === "/auth/v1/logout" && req.method === "POST") {
          for (const active of sessions.values())
            if (active.user.id === session.user.id) revoke(active);
          return send(204);
        }
        throw httpError(
          404,
          "Use the predefined test accounts; email delivery and registration are not simulated.",
        );
      }
      if (!url.pathname.startsWith("/rest/v1/"))
        throw httpError(404, "Unknown test endpoint");
      const parts = url.pathname.slice("/rest/v1/".length).split("/");
      const table = parts[0];
      if (!session && !["content_lessons", "content_items"].includes(table))
        throw httpError(401, "Test login required");
      // PGlite serializes transactions. SET LOCAL prevents role/identity leaking across concurrent requests.
      const result = await db.transaction(async (tx) => {
        await tx.exec(`set local role ${session ? "authenticated" : "anon"}`);
        await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [
          session?.user.id ?? "",
        ]);
        if (table === "rpc" && req.method === "POST") {
          const body = await bodyOf(req);
          if (parts[1] === "learning_action")
            await tx.query("select public.learning_action($1,$2::jsonb)", [
              body.action,
              JSON.stringify(body.payload),
            ]);
          else if (parts[1] === "save_learner_progress")
            await tx.query(
              "select public.save_learner_progress($1,$2::jsonb)",
              [body.p_item_id, JSON.stringify(body.p_progress)],
            );
          else throw httpError(404, "Unsupported test RPC");
          return null;
        }
        if (parts.length !== 1 || !tables.has(table))
          throw httpError(404, "Unknown test table");
        const sqlTable = `public.${identifier(table)}`;
        const params = [];
        const filters = [];
        for (const [column, filter] of url.searchParams) {
          if (
            ["select", "order", "limit", "offset", "on_conflict"].includes(
              column,
            )
          )
            continue;
          if (!filter.startsWith("eq."))
            throw httpError(400, "Only equality filters are implemented");
          params.push(filter.slice(3));
          filters.push(`${expression(column)}=$${params.length}`);
        }
        const where = filters.length ? ` where ${filters.join(" and ")}` : "";
        if (req.method === "GET" || req.method === "HEAD") {
          let sql = `select * from ${sqlTable}${where}`;
          const order = url.searchParams.get("order");
          if (order)
            sql +=
              " order by " +
              order
                .split(",")
                .map((part) => {
                  const [column, direction = "asc"] = part.split(".");
                  if (!["asc", "desc"].includes(direction))
                    throw httpError(400, "Unsupported sort");
                  return `${identifier(column)} ${direction}`;
                })
                .join(",");
          const rows = (await tx.query(sql, params)).rows;
          res.setHeader("Content-Range", `*/${rows.length}`);
          const range = req.headers.range?.split("-").map(Number);
          const offset = Number(
            url.searchParams.get("offset") ?? range?.[0] ?? 0,
          );
          const limit = Number(
            url.searchParams.get("limit") ??
              (range ? range[1] - range[0] + 1 : rows.length),
          );
          if (
            !Number.isSafeInteger(offset) ||
            !Number.isSafeInteger(limit) ||
            offset < 0 ||
            limit < 0
          )
            throw httpError(400, "Invalid range");
          let data = rows.slice(offset, offset + limit);
          const select = url.searchParams.get("select");
          if (select && select !== "*") {
            const columns = select.split(",");
            columns.forEach(identifier);
            data = data.map((row) =>
              Object.fromEntries(
                columns.map((column) => [column, row[column]]),
              ),
            );
          }
          if (req.headers.accept?.includes("vnd.pgrst.object")) {
            if (data.length !== 1)
              throw Object.assign(httpError(406, "Expected one row"), {
                code: "PGRST116",
                details: `The result contains ${data.length} rows`,
              });
            return data[0];
          }
          return data;
        }
        if (req.method === "POST" && writable[table]) {
          const body = await bodyOf(req);
          const { keys, values } = writable[table];
          const columns = [...keys, ...values];
          for (const row of Array.isArray(body) ? body : [body]) {
            if (Object.keys(row).some((column) => !columns.includes(column)))
              throw httpError(400, "Unsupported write column");
            const update = req.headers.prefer?.includes("ignore-duplicates")
              ? "do nothing"
              : `do update set ${values.map((column) => `${identifier(column)}=excluded.${identifier(column)}`).join(",")}`;
            await tx.query(
              `insert into ${sqlTable} (${columns.map(identifier).join(",")}) values (${columns.map((_, index) => "$" + (index + 1)).join(",")}) on conflict (${keys.map(identifier).join(",")}) ${update}`,
              columns.map((column) =>
                typeof row[column] === "object"
                  ? JSON.stringify(row[column])
                  : row[column],
              ),
            );
          }
          return null;
        }
        if (
          req.method === "DELETE" &&
          ["learner_progress", "learner_settings", "learner_days"].includes(
            table,
          )
        ) {
          await tx.query(`delete from ${sqlTable}${where}`, params);
          return null;
        }
        throw httpError(405, "Unsupported test operation");
      });
      send(200, result);
    } catch (error) {
      send(error.status ?? 400, {
        message: error.message,
        code: error.code ?? "LOCAL_TEST_ERROR",
        details: error.details ?? null,
      });
    }
  });
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, "127.0.0.1", resolve);
    });
  } catch (error) {
    await db.close();
    throw error;
  }
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    accounts,
    async close() {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      await db.close();
    },
  };
}
