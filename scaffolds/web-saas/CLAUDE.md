# CLAUDE.md — &lt;your-product-name&gt;

> Project-level Claude config for a web product built from the [web-saas scaffold](../../scaffolds/web-saas/).

## What this project is

&lt;one paragraph: what the product does, who it is for, what hypothesis it tests&gt;

## Stack

- **Framework:** Next.js 15 (app router, server components by default). Stay on 15 — some recipes have not yet been verified against 16.
- **DB:** Supabase Postgres, accessed via `@supabase/supabase-js` server client through the pooler.
- **Errors:** Sentry, single project for client + server, PII scrubbing on.
- **Analytics:** GA4 via gtag (client) + Measurement Protocol (server) for conversion events.
- **Lead alerts:** optional Telegram bot via the `lead/route.ts` notify call.
- **Styling:** plain CSS modules + tokens in `styles/tokens.css`. No Tailwind, no shadcn — keep the visual direction intentional.

## Visual direction

&lt;fill in: editorial / brutalism / glassmorphism / dark luxury / bento / scrollytelling / Swiss / retro-futurism&gt;

Pick one before generating UI. Default Tailwind-template aesthetics are the failure mode this scaffold exists to avoid. Reference: [stack/frontend-design.md](../../stack/frontend-design.md).

## Conventions

- Server components by default. Mark client components with `"use client"` only when they need state or browser APIs.
- Server actions for mutations; route handlers only for third-party webhooks or polling endpoints.
- No client-side Supabase access using the service role key. Service role is server-only.
- Type-safe DB access — generate types with `supabase gen types typescript --project-id <ref> > lib/database.types.ts` after every schema change.
- Conventional Commits. The [`validate-commit-message`](../../configs/hooks/validate-commit-message.README.md) hook enforces this on `git commit -m`.
- TDD for non-trivial server logic. UI changes verify visually.
- Files <800 lines. Functions <50 lines. Many small files.

## Reach for these cookbook recipes

- Lead capture flow already wired — extend it via [recipe 09](../../cookbook/09-telegram-bot-leads-v0.md) for Telegram alerts.
- Errors and sourcemaps — [recipe 06](../../cookbook/06-sentry-fullstack.md) for Sentry across both client + server.
- DB pooling under serverless — [recipe 07](../../cookbook/07-supabase-vercel-pooling.md). The scaffold already follows the pooled-URL pattern; do not regress it.
- Analytics without a cookie banner — [recipe 05](../../cookbook/05-ga4-cloudflare-analytics.md).
- Payments later — [recipe 02](../../cookbook/02-stripe-connect-p2p.md) for Stripe Connect when the product earns it.
- First-session orientation — [recipe 01](../../cookbook/01-claude-code-from-zero.md).

## Hooks expected

- [`validate-commit-message`](../../configs/hooks/validate-commit-message.README.md) — Conventional Commits gate.
- [`statusline`](../../configs/hooks/statusline.README.md) + `context-monitor` — context-budget visibility while building.

## Out of scope this session

&lt;list things Claude should not touch this session — auth refactor, design polish, billing, etc.&gt;

## Solo-ops conventions

- Commit after every working step, not at the end.
- Never push to `main` without local verification.
- Errors and analytics ship in the first deploy, not the second.
- Lead capture lands in Postgres or a Telegram message before any UI polish.
- The visual direction is set once at the top of this file. Do not drift to "clean minimal" by default.
