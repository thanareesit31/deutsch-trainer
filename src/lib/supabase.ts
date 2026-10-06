import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const testWorkspaceId = process.env.NEXT_PUBLIC_TEST_WORKSPACE_ID;
// Keep browser requests on the app's origin; Next proxies to the loopback API.
const clientUrl =
  testWorkspaceId && typeof window !== "undefined"
    ? `${window.location.origin}/__test-db`
    : url;
export const supabase =
  clientUrl && key
    ? createClient(clientUrl, key, {
        ...(testWorkspaceId
          ? {
              auth: { storageKey: `deutsch-trainer-test-${testWorkspaceId}` },
            }
          : {}),
      })
    : null;
