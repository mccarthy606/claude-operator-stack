# web-saas

> A Next.js 15 + Supabase + Sentry + GA4 starting point for solo founders.
> Stack: Next.js 15 (app router), Supabase (Postgres + auth-ready), Sentry, GA4, plain CSS modules.
> Used in: [Niche Booking Trio](../../case-studies/niche-booking-trio.md), [AI Legal Tool](../../case-studies/ai-legal-tool.md).

## When to use this scaffold

- You are building a solo web product and want a v0 landing page that becomes a real product over the first month.
- You want server-side lead capture into Postgres on day one, not a third-party form on day fourteen.
- You want errors and analytics wired before the first deploy, not as a follow-up that never happens.
- You want a CLAUDE.md that is already tuned to the stack so the first session does work, not setup.

## When NOT to use

- You are not building a web product. Use [whatsapp-saas](../whatsapp-saas/) for a webhook-driven service.
- You want Tailwind, shadcn, or a component library out of the box. This scaffold deliberately ships plain CSS modules to avoid template feel.
- You need authentication or a billing flow on day one. Add Supabase Auth or Stripe Connect when the product earns it. See [recipe 02](../../cookbook/02-stripe-connect-p2p.md).
- You need a marketing site with no backend. Use a static-site generator instead.

## Install

```bash
# Copy the scaffold
cp -r scaffolds/web-saas/ ~/Projects/<your-product>/
cd ~/Projects/<your-product>/

# Init git
git init && git add -A && git commit -m "chore: initial scaffold from claude-operator-stack"

# Install deps
pnpm install

# Set env
cp .env.example .env.local
# fill in values (Supabase URL + service role key, Sentry DSN, GA4 measurement ID, optional Telegram bot)

# Apply the leads migration to your Supabase project
# Option A: paste supabase/migrations/0001_init.sql into the SQL editor
# Option B: supabase db push (requires Supabase CLI linked to your project)

# Run
pnpm dev
```

Open http://localhost:3000. The hero renders, the lead form posts to `/api/lead`, the row lands in Supabase, Sentry catches any thrown error.

## What's pre-wired

- **Server-side lead capture** at `app/api/lead/route.ts` writes to Supabase and optionally pings a Telegram bot for instant lead alerts. See [recipe 09](../../cookbook/09-telegram-bot-leads-v0.md).
- **Sentry** in `lib/sentry.ts`, `sentry.client.config.ts`, and `next.config.ts` — both client and server, with PII scrubbing on by default. See [recipe 06](../../cookbook/06-sentry-fullstack.md).
- **GA4** in `lib/analytics.ts` — server-side Measurement Protocol helper plus client gtag bootstrap in `app/layout.tsx`. See [recipe 05](../../cookbook/05-ga4-cloudflare-analytics.md).
- **Supabase server client** in `lib/supabase.ts` using the pooled connection URL pattern from [recipe 07](../../cookbook/07-supabase-vercel-pooling.md).
- **Initial migration** at `supabase/migrations/0001_init.sql` creating a `leads` table with RLS off (server-only inserts via service role).
- **Plain CSS modules + design tokens** in `styles/tokens.css` so the visual direction is yours from the first edit, not the framework's.
- **CLAUDE.md** pre-tuned to Next.js 15 + Supabase + Sentry + GA4 work, with cookbook recipe links and hook references.

## Customize after copying

- Replace placeholders in `CLAUDE.md`: project name, visual direction (the file currently lists candidates — pick one or write your own).
- Edit `app/page.tsx` hero copy, `components/lead-form.tsx` field set, and the OG meta in `app/layout.tsx`.
- If you want auth, add Supabase Auth helpers and a server action; do not add it before there are real users.
- If you want Tailwind, you can add it on top, but consider whether you actually need it — the scaffold reaches for plain CSS deliberately.
- Adjust the leads schema in `supabase/migrations/0001_init.sql` for your fields; add new migrations rather than editing this one once you have any production data.

## Pre-wired hooks

The CLAUDE.md references two hooks from this stack:

- [`validate-commit-message`](../../configs/hooks/validate-commit-message.README.md) keeps commit messages on Conventional Commits as you go.
- [`statusline`](../../configs/hooks/statusline.README.md) plus `context-monitor` to track context budget while building.

Wire them per the per-hook README; they are not auto-installed by copying the scaffold.

## References

- [recipe 01 — Claude Code from zero](../../cookbook/01-claude-code-from-zero.md)
- [recipe 05 — GA4 + Cloudflare Analytics](../../cookbook/05-ga4-cloudflare-analytics.md)
- [recipe 06 — Sentry across Next.js + FastAPI](../../cookbook/06-sentry-fullstack.md)
- [recipe 07 — Supabase pooling on Vercel](../../cookbook/07-supabase-vercel-pooling.md)
- [recipe 09 — Telegram bot as v0 lead capture](../../cookbook/09-telegram-bot-leads-v0.md)
- [stack/frontend-design.md](../../stack/frontend-design.md) for visual direction discipline
- [workflows/ship-a-product-in-a-day.md](../../workflows/ship-a-product-in-a-day.md) — the cadence this scaffold is shaped for
