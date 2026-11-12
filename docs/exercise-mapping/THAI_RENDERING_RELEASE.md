# Thai rendering release verification

Verified on 12 November 2026 at https://deutsch-trainer-gamma.vercel.app.

The Thai tokenizer fix was deployed in `1d8916b`. The additional `orange` presentation correction was deployed in `11b90a5`. Vercel reported both deployments successful. Production health returned HTTP 200 with `status: ok`, Bun runtime, and the existing lesson, phrase-practice and reporting releases ready.

## Rendering

Chromium checked all 104 shared preview banks, covering 3,879 question entries before answering and after feedback at 375px and 1280px. These are entries across banks, not a claim of 3,879 unique learning targets. The actual React text component also passed its focused rendering test.

Safari 15.6.1 checked the same 104 bank artifacts and 3,879 entries at 390px with no detached Thai vowel or tone-mark nodes. This used the actual Safari renderer with locally served published bank artifacts. It did not authenticate to the hosted application.

The complete hosted application does not boot on this machine's Safari 15.6.1. The deployed application chunk contains a lookbehind expression and the framework chunk contains a static class block that this Safari cannot parse. Next.js defaults to Safari 16.4 or newer, as documented in `node_modules/next/dist/docs/03-architecture/supported-browsers.md`. Experiments targeting older Safari did not remove all framework syntax, were reverted, and were not deployed. Do not claim full application compatibility with Safari 15.6 or a physical iPhone verification from these results.

## Ordinary learner accounts

Two fresh, confirmed accounts were created with the ordinary `authenticated` role in hosted Supabase. They had no tester or administrator membership. No authentication response, learner eligibility, account state or network response was substituted.

The Chrome browser test at 375px verified:

- Before Learn, L05 vocabulary Practice showed no eligible tasks and stored no session.
- Matching all 30 L05 words through the ordinary Learn UI persisted their lesson state to the account. The `orange` option retained its color meaning.
- Practice selected only learned targets. The deployed tokenizer included combining marks. A first answer was checked and saved through the hosted RPC.
- After signing out, signing in in a fresh browser context and using the actual resume dialog restored the exact session, question queue and first answer.
- A second unsubmitted answer persisted as a draft. The first answer remained unchanged when the second answer was checked.
- The second account could read neither the first account's lesson state nor its practice session. Directly submitting the copied queue was rejected by the server because its targets had not been learned. No second-account practice session was created.
- No browser page errors occurred.

The full Safari account-flow check remains blocked on the available Safari version. The ordinary-account persistence and isolation results above are Chrome results, not Safari results. A physical-iPhone check was requested separately and is pending unless recorded below.

Both disposable accounts were deleted afterward, and deletion was independently checked through the admin API. Their verification-only history was removed by the account cascade. Existing learners' accounts and history were untouched. Temporary account credentials were removed from the repository's ignored tools directory; privileged API keys were never written to the repository or test output.

## Evidence and reruns

Reports are in `artifacts/thai-word-help/`: `report.json`, `safari-bank-report.json`, `production-account-report.json` and `account-cleanup.json`. The existing L05 mobile feedback image shows the original Thai example after the tokenizer fix.

Run the focused checks with Node 20.9 or newer:

```sh
node --test tests/thai-word-help.test.mjs tests/thai-word-help-react.test.mjs
node --import tsx --test tests/noun-presentation.test.mjs
node tests/thai-word-help-browser.mjs
```

`tests/thai-release-account-browser.mjs` requires two freshly provisioned disposable confirmed ordinary accounts. Supply a private JSON file containing an array of `{ "email": "...", "password": "..." }` objects through `THAI_AUDIT_ACCOUNTS_FILE`; names must match `thai-release-<timestamp>-0@deutsch.test` and `thai-release-<timestamp>-1@deutsch.test`. Never use an existing learner account. Public project configuration is read from `.env.local`. Provisioning and cleanup need authorized account administration and are separate from this test. Do not commit credentials.

On a machine with a supported Safari and an active Safari WebDriver session, the default test also verifies Safari draft resume and answer persistence; its session descriptor is read from the ignored `.tools/thai-safari-session.json`. For a clearly scoped Chrome account test, set `THAI_AUDIT_SKIP_SAFARI=1`. The report explicitly distinguishes that limitation. The Safari bank-rendering sweep in this session used the same rendering audit function as the Chromium sweep through WebDriver.

This release changes presentation only. It preserves task IDs, targets, subskills, difficulty, assistance, accepted answers, grading, historical first answers and adaptive-selection rules. Comparing the 770 catalog display strings changed only `orange`; nouns and plurals kept their existing Artikel presentation. No database schema or curriculum release was changed.
