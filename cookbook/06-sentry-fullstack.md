# Sentry Across Next.js + FastAPI

> **Time:** ~1.5h
> **Stack:** Sentry, Next.js 16, FastAPI, single Sentry project for both
> **Used in:** [WhatsApp B2B SaaS](../case-studies/whatsapp-b2b-saas.md), every shipped product in the stack

## The problem

You have a Next.js frontend and a FastAPI backend in the same product. You want one Sentry dashboard that shows errors from both, with sourcemaps so the JS stack traces are readable, release tagging so you can blame the right deploy, and PII scrubbing so you never accidentally ingest a password into Sentry.

Sentry's docs cover each piece in isolation. This recipe wires them together so you stop thinking about errors except when a real one fires.

## Solution overview

One Sentry project per product (not one per service). Both Next.js and FastAPI report to the same DSN with different `environment` and `server_name` tags. Sourcemaps upload via Sentry's Webpack plugin during the Next.js build. Release tags come from the same git SHA on both services. PII scrubbing is on by default; you only need to add the project-specific patterns (Stripe IDs, JWTs, anything in your URL paths).

## Step-by-step

### 1. Create the Sentry project

In the Sentry dashboard create a single project, **Platform: JavaScript** (you will add Python later — the platform is just the default and does not restrict it). Copy the **DSN**.

Generate an **Auth Token** under Settings → Account → Auth Tokens with scope `project:releases`, `project:write`, `org:read`. Store it as `SENTRY_AUTH_TOKEN` in CI (used during build for sourcemap upload, never at runtime).

### 2. Next.js — install + configure

```bash
pnpm add @sentry/nextjs
pnpm dlx @sentry/wizard@latest -i nextjs
```

The wizard creates `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. Trim them to:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
  beforeSend(event) {
    if (event.request?.cookies) delete event.request.cookies;
    return event;
  },
});
```

Server config is the same shape minus replays.

### 3. Next.js — sourcemaps

In `next.config.js`:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  { /* your existing config */ },
  {
    org: 'your-org-slug',
    project: 'your-project-slug',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
  },
);
```

`hideSourceMaps: true` keeps source maps off the public URL but still uploads them to Sentry. `widenClientFileUpload: true` catches the dynamic import chunks Webpack splits out.

Vercel needs `SENTRY_AUTH_TOKEN` as an environment variable in build settings. Without it the upload is silently skipped and your stack traces stay obfuscated.

### 4. FastAPI — install + configure

```bash
uv add 'sentry-sdk[fastapi]'
```

In `main.py`:

```python
import os
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.scrubber import EventScrubber, DEFAULT_DENYLIST
from fastapi import FastAPI

extra_denylist = ["stripe-signature", "x-hub-signature-256"]
denylist = list(set(DEFAULT_DENYLIST + extra_denylist))

sentry_sdk.init(
    dsn=os.environ["SENTRY_DSN"],
    environment=os.environ.get("ENV", "development"),
    release=os.environ.get("GIT_SHA"),
    traces_sample_rate=0.1,
    integrations=[FastApiIntegration()],
    event_scrubber=EventScrubber(denylist=denylist),
    send_default_pii=False,
)

app = FastAPI()
```

Critical flags:

- `send_default_pii=False` keeps request bodies and cookies out of error events
- `event_scrubber` extends the default denylist with project-specific signing headers
- `release` ties errors to a deploy; if you skip it you lose the "this regression started in v0.4.2" UX

### 5. Release tagging — same SHA on both services

Vercel exposes `VERCEL_GIT_COMMIT_SHA` automatically. For the FastAPI service, inject `GIT_SHA` from your CI:

```yaml
# .github/workflows/deploy.yml
env:
  GIT_SHA: ${{ github.sha }}
```

Or in a Dockerfile:

```dockerfile
ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}
```

Build with `--build-arg GIT_SHA=$(git rev-parse HEAD)`.

Both services now tag every error with the same SHA. Sentry's Releases tab shows one release with two service breakdowns.

### 6. Test it

Before deploy, fire a manual error in dev and confirm it lands in Sentry within 60s:

```typescript
// Next.js
throw new Error('Sentry test from web');
```

```python
# FastAPI
@app.get("/sentry-test")
def trigger():
    raise ValueError("Sentry test from api")
```

Then check that the stack trace is readable (Next.js: should show `.tsx` lines, not `chunks/main-abc123.js`). If it shows the obfuscated chunk, sourcemaps did not upload — check the build log for a Sentry warning, usually a missing or invalid auth token.

### 7. Add useful context

For inbound requests with a known user:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.setUser({ id: user.id, email: user.email });
Sentry.setTag('plan', user.plan);
```

For long-running tasks (cron jobs, webhook handlers), wrap in a transaction:

```python
with sentry_sdk.start_transaction(op="webhook", name="whatsapp.inbound"):
    process_message(message)
```

## Pitfalls

- **Sourcemaps not uploading from Vercel.** The `SENTRY_AUTH_TOKEN` env var must be set in Vercel's project settings, not just `.env.local`. Check the Vercel build log for the Sentry plugin output. A silent skip looks like "no Sentry plugin output" rather than an error.
- **Too high `tracesSampleRate` in production.** 1.0 is fine for dev. In production it costs real money on the Sentry plan and most spans are noise. Start at 0.1, tune based on the Performance tab.
- **Forgetting to scrub the WhatsApp / Stripe signature headers.** The default denylist covers `Authorization` and `Cookie` but not vendor-specific signing headers. Add them explicitly or you ship signatures into your error reports.
- **Two Sentry projects per product.** Tempting because the wizard creates one per service. Resist. Cross-service tracing is far more useful when both services live in one project.
- **PII through GA4-style query params.** A user clicks a link with `?email=foo@bar.com` and Sentry captures the URL on the next error. Use `beforeSend` to strip known PII query params from `event.request.url`.

## References

- [Sentry Next.js docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry FastAPI docs](https://docs.sentry.io/platforms/python/integrations/fastapi/)
- [Sentry sourcemaps for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/)
- [Sentry data scrubbing](https://docs.sentry.io/data-management/sensitive-data/)
- [recipe 02 — Stripe Connect (where the webhook scrubber matters)](02-stripe-connect-p2p.md)
