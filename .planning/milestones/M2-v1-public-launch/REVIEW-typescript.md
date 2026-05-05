# TypeScript review — opus 4.7

**Date:** 2026-05-04
**Scope:** scaffolds/web-saas/ — TypeScript, Next.js 15, Supabase, Sentry, GA4 wiring.

## Summary
- Files reviewed: 24 (all TS/TSX/CSS/SQL/MD/config in `scaffolds/web-saas/`)
- Findings: CRITICAL 2 · HIGH 3 · MEDIUM 7 · LOW 5
- Runs after `cp + .env + npm install + npm run dev`? **WITH-FIXES** — the dev server will boot, but the Sentry pipeline will throw / spam warnings on the very first request because two required config files are missing, and source-maps upload will fail in CI. See CRITICAL-1.

## Verdict per area
- TypeScript correctness: **GOOD** — `strict: true` is on, `unknown` used at the request boundary, proper discriminated unions on form state, no explicit `any`.
- Next.js 15 idioms: **OK** — server components by default, metadata + viewport API split correctly, route handler shape correct. Issues: GA4 inline `<Script>` runs unconditionally on every page (no consent guard), and `images.remotePatterns: []` will block any future remote image without a clearer comment.
- Supabase wiring: **OK** — service-role kept server-side, module-level cache is reasonable. But the URL is read from the **public** env var (`NEXT_PUBLIC_SUPABASE_URL`), which is a minor smell rather than a bug, and there is no anon/browser client at all — so the README claim "auth-ready" is overstated.
- Sentry init: **NEEDS-WORK** — only `sentry.client.config.ts` exists. The scaffold's own cookbook recipe 06 says `sentry.server.config.ts` + `sentry.edge.config.ts` + `instrumentation.ts` are all required for Sentry v8 + Next 15. Server errors captured by `lib/sentry.ts` will not actually be sent until those land. Source-maps upload via `withSentryConfig` will also warn loudly on first build because `release` cannot be resolved without auth-token wiring.
- GA4 server-side: **OK** — secret stays server-side, anonymous client_id helper is reasonable, fail-soft. Event name `generate_lead` follows GA4 recommended events.
- Lead form + /api/lead: **OK** — input validation is present and server-side, honeypot is wired, dedupe-by-unique-violation pattern is sound. Missing: rate limiting (acceptable for v1), origin/CSRF check (acceptable for a same-origin form, but worth a comment), and Sentry will silently swallow the `notifyTelegram` and `sendServerEvent` failures inside `Promise.allSettled` because neither branch reports rejected promises to Sentry.
- package.json + configs: **GOOD** — pinned `next@15.1.0` and `react@19.0.0`, caret on supporting libs only, `engines.node >= 20.11.0`, scripts cover dev/build/start/lint/type-check. `tsconfig.json` is clean for Next 15 + bundler resolution.

---

## CRITICAL

### CRITICAL-1 — Sentry server + edge configs are missing; instrumentation hook is missing
**Files:** `scaffolds/web-saas/` (root) — `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts` all absent.
**Evidence:**
- `lib/sentry.ts:1-7` says: *"The Next.js Sentry SDK auto-initialises via instrumentation hooks"* — but no `instrumentation.ts` exists at the project root.
- `next.config.ts:34` wraps the config with `withSentryConfig(...)`, which expects the standard Sentry-Next 15 file layout.
- The repo's own `cookbook/06-sentry-fullstack.md:32` explicitly states the wizard creates all three (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`).
- Sentry SDK v8 + Next 15 specifically requires either an `instrumentation.ts` that re-exports server/edge inits, or both `sentry.server.config.ts` and `sentry.edge.config.ts` at the project root. Without them:
  - `captureError(...)` calls from `app/api/lead/route.ts` will reach a Sentry SDK that was never initialised on the server → no events sent.
  - On Next 15 `withSentryConfig` will print build-time warnings on every `pnpm build`.

**Why CRITICAL:** the README sells "Sentry catches any thrown error" as a v0 promise. The first server error in production will be silently dropped. Operators will trust a monitor that does not exist.

**Fix:** add `sentry.server.config.ts`, `sentry.edge.config.ts` (mirroring the existing client config but with appropriate sample rates and no replay), and an `instrumentation.ts` per the Next 15 + Sentry v8 docs. Update `lib/sentry.ts:1-7` to stop claiming the hooks are "auto-init" — they are explicit files.

### CRITICAL-2 — `images.remotePatterns: []` plus blank `<img>` would break OG/avatar use
**File:** `scaffolds/web-saas/next.config.ts:9-11`, `scaffolds/web-saas/app/layout.tsx:22, 28` (references `/og.png`).
**Evidence:** `metadata.openGraph.images` and `metadata.twitter.images` both reference `/og.png`, but the file does not exist in `public/` (no `public/` directory in the scaffold). On first build, the metadata works (it is just a URL), but actual OG previews on social will 404. Operators reading the README ("the hero renders") will not catch this until they paste the URL into Slack.

**Why CRITICAL:** OG image is part of the marketing surface this scaffold exists to ship on day one. A 404 on the first share is an embarrassing failure mode.

**Fix:** ship a placeholder `public/og.png` (1200x630) that obviously says "replace me" or remove the OG references with a TODO comment.

---

## HIGH

### HIGH-1 — `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` are duplicated in `.env.example` but only one is used
**Files:** `scaffolds/web-saas/.env.example:18-20`, `scaffolds/web-saas/sentry.client.config.ts:4`.
**Evidence:** the client config reads `NEXT_PUBLIC_SENTRY_DSN`. There is no server config, so `SENTRY_DSN` is currently unused. The example file lists both with the same DSN, which encourages operators to paste the same value twice without knowing why. Tied to CRITICAL-1: once the server config is added it should read `SENTRY_DSN` (the non-public one), but if both DSNs are documented as "same DSN for client + server", the public one ends up bundled into the JS payload regardless.

**Fix:** either keep two distinct env vars and document why, or use `NEXT_PUBLIC_SENTRY_DSN` everywhere and drop the duplicate. Today's comment "Same DSN for client + server" is misleading because nothing on the server side actually reads `SENTRY_DSN`.

### HIGH-2 — `getServerSupabase()` reads the public URL var; there is no startup validation
**File:** `scaffolds/web-saas/lib/supabase.ts:18-26`.
**Evidence:** the URL comes from `NEXT_PUBLIC_SUPABASE_URL`. That works (the URL is not secret), but the env vars are validated lazily on first call. If `SUPABASE_SERVICE_ROLE_KEY` is missing, the first lead POST returns a generic 500 because the thrown `Error("SUPABASE_SERVICE_ROLE_KEY is not set")` is caught by the route's outer `try/catch` and swapped for `"Server error. Try again shortly."`. Operators will tail logs trying to figure out why submissions fail.

**Fix:** either (a) validate required env vars at module load (top of `lib/supabase.ts`), or (b) special-case the env-missing error in the route handler so it logs a clear message and returns 503. At minimum, keep the `captureError` path so Sentry sees it — once Sentry is actually initialised on the server (CRITICAL-1).

### HIGH-3 — Server-side GA4 fetch has no timeout and runs in the request critical path
**Files:** `scaffolds/web-saas/lib/analytics.ts:35-43`, `scaffolds/web-saas/app/api/lead/route.ts:99-110`.
**Evidence:** `sendServerEvent()` uses `fetch(url, { method: "POST", ... })` with no `AbortSignal.timeout(...)`. It is called inside `Promise.allSettled([...])` in the lead route, which means a slow GA4 endpoint extends the response time the user sees. `notifyTelegram()` (lead route lines 47-69) has the same problem. Telegram's `sendMessage` API typically responds in <300ms but can hang under throttling, and the spec explicitly says "Never break a request because analytics failed" — but the current code lets analytics block the request.

**Fix:** wrap both fetches with `AbortSignal.timeout(2000)` (Node 18+ / Next 15 supports it natively), or genuinely fire-and-forget by not awaiting the `Promise.allSettled` and instead returning the response immediately while letting Vercel's `waitUntil` handle the side-effects.

---

## MEDIUM

### MED-1 — `_err` is caught but never reported in the form
**File:** `scaffolds/web-saas/components/lead-form.tsx:69-74`.
**Evidence:** `catch (_err)` discards the error. For a v0 lead form this is acceptable, but Sentry already wraps the client (per `sentry.client.config.ts`); the error should be `Sentry.captureException(_err)` so the team sees network failures on the lead form. Minor since `next.config.ts` instruments client-side, but the conscious choice should be a comment, not silent drop.

### MED-2 — `lead-form.tsx` reads `payload?.error` after `payload` is typed `{}` from a failed `.catch`
**File:** `scaffolds/web-saas/components/lead-form.tsx:58-63`.
**Evidence:**
```ts
const payload = await res.json().catch(() => ({}));
const detail = typeof payload?.error === "string" ? payload.error : "...";
```
With `strict: true` and `noUncheckedIndexedAccess` defaults, `payload` is inferred as `any` because `Response.json()` returns `Promise<any>` in TS 5.7. Optional chaining on `any` is fine but defeats the type-safety story the rest of the file pushes. Tight up by typing the expected response: `type LeadResponse = { error?: string; ok?: boolean }; const payload = (await res.json().catch(() => ({}))) as LeadResponse;`.

### MED-3 — `Promise.allSettled` rejections are swallowed without Sentry visibility
**File:** `scaffolds/web-saas/app/api/lead/route.ts:99-110`.
**Evidence:** `Promise.allSettled` resolves with statuses; rejected sub-promises never bubble out. `notifyTelegram` already self-handles errors (line 67-69), but `sendServerEvent` only logs to `console.warn` — and on Vercel `console.warn` is structured logs, not alerts. After fixing CRITICAL-1, route either both side-effects through `captureError`, or iterate the settled results and capture rejections.

### MED-4 — `event.currentTarget.reset()` is called after async work without a null-guard
**File:** `scaffolds/web-saas/components/lead-form.tsx:67-68`.
**Evidence:** `event.currentTarget` can be `null` after the await if React reuses the synthetic event under concurrent rendering (React 19 is more aggressive about this than 18). Capture the form ref synchronously: `const formEl = event.currentTarget;` at the top of the handler, then `formEl.reset()` later.

### MED-5 — GA4 inline script runs without consent guard
**File:** `scaffolds/web-saas/app/layout.tsx:55-70`.
**Evidence:** the gtag script loads as soon as `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set. For an EU/UK audience this is non-compliant without prior consent. The `cookbook/05-ga4-cloudflare-analytics.md` recipe specifically discusses cookie-banner-free analytics, but the scaffold ships a default that requires either (a) a consent gate or (b) a deliberate "this product is not in EU" decision. At minimum, leave a `// TODO: gate behind consent for EU traffic` comment where the script loads.

### MED-6 — `next.config.ts` `withSentryConfig` will print warnings during local `pnpm build` because `SENTRY_AUTH_TOKEN` is intentionally unset locally
**File:** `scaffolds/web-saas/next.config.ts:34-41`.
**Evidence:** `silent: !process.env.CI` partially mutes this — but only because operators are expected to set `CI=true` in local builds, which most won't. Either invert the conventionm (silent unless `SENTRY_AUTH_TOKEN` is set), or add a one-line README note ("expect Sentry warnings on local `pnpm build` — they only matter when shipping").

### MED-7 — `lib/sentry.ts` `captureMessage` ignores `context`
**File:** `scaffolds/web-saas/lib/sentry.ts:28-33`.
**Evidence:** `captureError` accepts a `context` map and threads it via `Sentry.withScope(...)`. `captureMessage` does not — but the docstring above the file says the wrapper exists "to add scrubbing logic that should apply to every server-side call." Either drop `captureMessage` or give it the same `withScope` treatment so it is consistent.

---

## LOW

### LOW-1 — `Body` type uses `unknown` field-by-field when a single `Record<string, unknown>` would convey "trust nothing"
**File:** `scaffolds/web-saas/app/api/lead/route.ts:12-17`. Current shape works; `Record<string, unknown>` would be marginally more idiomatic.

### LOW-2 — `validate()` returns a discriminated `{ error: string }` but the discriminator is structural ("error" key existence) rather than a tag
**File:** `scaffolds/web-saas/app/api/lead/route.ts:19-45`. With `strict: true` this works because `LeadInsert` has no `error` field, but a `kind` tag would be more robust if `LeadInsert` ever grows an `error?` field by accident.

### LOW-3 — `noUncheckedIndexedAccess` and `noFallthroughCasesInSwitch` are not enabled in `tsconfig.json`
**File:** `scaffolds/web-saas/tsconfig.json:7`. `strict: true` covers most of what matters, but `noUncheckedIndexedAccess: true` would have caught MED-2's implicit `any`. Optional for v1.0, recommended for v1.1.

### LOW-4 — `anonymousClientId()` uses `Math.random` for an analytics ID
**File:** `scaffolds/web-saas/lib/analytics.ts:61-63`. Acceptable for analytics (collision is irrelevant at GA4 scale and the value is unauthenticated), but `crypto.randomUUID()` is more idiomatic in Node 20+ and conveys intent better.

### LOW-5 — `comment on table public.leads` SQL is fine; missing `comment on column` for `source` enum-like field
**File:** `scaffolds/web-saas/supabase/migrations/0001_init.sql:32-33`. Helpful for the next operator opening the Supabase Studio.

---

## Recommendations for v1.0 ship

**Must-fix before flipping public:**
1. Add `sentry.server.config.ts`, `sentry.edge.config.ts`, and `instrumentation.ts` (CRITICAL-1). Without these, the scaffold's headline promise — "errors and analytics ship in the first deploy" — is false on the server.
2. Ship a placeholder `public/og.png` or remove the OG image references with a TODO (CRITICAL-2). This is two minutes of work and prevents an embarrassing first-share failure.
3. Reconcile `.env.example`'s dual Sentry DSN keys (HIGH-1) so operators don't paste the same value twice without understanding which side reads which.

**Defensible at v1.0, fix in v1.1:**
4. Wrap server-side `fetch` calls (Telegram, GA4) with `AbortSignal.timeout(2000)` and route their failures through `captureError` (HIGH-3, MED-3). Until then, expect occasional slow lead-form responses.
5. Add a `// TODO consent-gate for EU` comment on the GA4 script in `app/layout.tsx` (MED-5) so the next operator does not assume the default is GDPR-safe.

**Polish (v1.x):**
6. Tighten `tsconfig.json` with `noUncheckedIndexedAccess` (LOW-3), capture client-side form errors via Sentry (MED-1), and snapshot `event.currentTarget` before await (MED-4).
