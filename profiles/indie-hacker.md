# Operator profile: indie hacker

> If you describe yourself as "shipping three micro-products at once, posting build logs on X, and optimising for time-to-stripe-charge," this is your install path.

## Who this profile is for

You can write code. You shipped your first thing alone, and now you are running two to four small bets in parallel because you learned that one bet is the same as no bet. Your time horizon per product is weeks, not quarters. You measure progress by deploys, paying users, and replies to the build-in-public thread.

The Tuesday morning shape: open a coffee shop, pick which of the three live products gets attention today, push a feature, write the X post about it, check Stripe, close the laptop. The thing that breaks for you is context — by Thursday you cannot remember which env var was missing on Product B, what the open issue on Product C was, or why you decided to drop the Postgres extension on Product A.

You arrived at this stack because you saw a tweet about somebody shipping seven products in four months and thought "the multiplier is real but the orchestration looks expensive." The thing you are after is the multiplier without spending three weekends becoming a stack-tinkerer first.

## Install priority

The stack ships as 4 core components (always installed) and 2 opt-in components (install when the use case earns it). See [stack/](../stack/). For this profile, the priority is:

| Order | Component | Status | Why for this profile |
|-------|-----------|--------|----------------------|
| 1 | **Claude Code** | **Required** | The runtime. Everything else loads on top. |
| 2 | **Obsidian** ([stack/obsidian-brain.md](../stack/obsidian-brain.md)) | **Required** | Where your projects live — `~/Brain/Projects/<name>.md` is the cross-session memory that fixes "by Thursday I forgot what I decided on Product B." |
| 3 | **graphify** ([stack/graphify.md](../stack/graphify.md)) | **Recommended** (operator-private until v1.1) | Knowledge-graph queries across all your project folders. Compounds with Obsidian. Skip if you do not have access — the cookbook's `/graphify` calls become inactive, but Obsidian still gives you the cross-session memory layer. |
| 4 | **Frontend-Design** ([stack/frontend-design.md](../stack/frontend-design.md)) | **Required** | UI generation that does not look like every other shadcn template. |
| 5 | **Everything Claude Code** ([stack/ecc.md](../stack/ecc.md)) | **Opt-in (recommend)** | Broad skill + agent catalog. Worth installing on day one when you ship multiple products — the GSD family, code review skills, and chief-of-staff pay back fast at three-product cadence. |
| 6 | **Toprank** ([stack/toprank.md](../stack/toprank.md)) | **Opt-in (skip day 1)** | Add when you start running paid traffic experiments on a product that has cleared its first paying-user threshold. Skip until then. |

The 4 core install at any point — they are the runtime, the memory, the cross-project context, and the visible-quality lever. The 2 opt-in are real layers but only earn their keep once specific use cases show up.

## Workflows to read first

The full operator playbook has [five workflows](../workflows/). For this profile, read in this order:

1. **[parallel-projects](../workflows/parallel-projects.md)** — the Monday review and 80/20 split is the spine of how you stay sane with three products in flight.
2. **[ship-a-product-in-a-day](../workflows/ship-a-product-in-a-day.md)** — the day-shape that turns "I have an idea" into "the URL is live." Your validation loop.
3. **[solo-ops](../workflows/solo-ops.md)** — the moment your first product gets paying users, support and infra start eating evenings. Read this before that happens, not after.

Skip [content-pipeline](../workflows/content-pipeline.md) and [obsidian-as-context](../workflows/obsidian-as-context.md) for now.

## Cookbook recipes you will reach for

Pick from [the cookbook](../cookbook/) in this order:

- **[01 — Claude Code from zero](../cookbook/01-claude-code-from-zero.md)** — read once on day one, then again after week one when half of it makes more sense.
- **[02 — Stripe Connect for a P2P marketplace](../cookbook/02-stripe-connect-p2p.md)** — even if you are not building a marketplace, the webhook handling and idempotency notes apply to every Stripe integration.
- **[04 — Cloudflare Tunnel for local webhook dev](../cookbook/04-cloudflare-argo-local-dev.md)** — the moment you start integrating Stripe or any other webhook source, this saves you a day.
- **[05 — GA4 + Cloudflare Analytics, no cookie banner](../cookbook/05-ga4-cloudflare-analytics.md)** — minimum viable instrumentation for every new landing page.
- **[06 — Sentry across Next.js + FastAPI](../cookbook/06-sentry-fullstack.md)** — install before you have users, not after the first 500 error.
- **[07 — Supabase pooling on Vercel](../cookbook/07-supabase-vercel-pooling.md)** — the connection-exhaustion bug that bites every solo Next.js + Supabase deploy.
- **[09 — Telegram bot as v0 lead capture](../cookbook/09-telegram-bot-leads-v0.md)** — for the bet that needs to validate before it earns a real signup form.

## Hooks to install

From [configs/hooks/](../configs/hooks/):

- **statusline** ([configs/hooks/statusline.README.md](../configs/hooks/statusline.README.md)) — shows model, dir, and context usage. Cheap orientation when you are switching between three repos in a day.
- **context-monitor** ([configs/hooks/context-monitor.README.md](../configs/hooks/context-monitor.README.md)) — warns at 35% and 25% remaining. Stops you mid-feature instead of mid-broken-deploy.
- **validate-commit-message** ([configs/hooks/validate-commit-message.README.md](../configs/hooks/validate-commit-message.README.md)) — Conventional Commits enforced, which makes the auto-generated changelog usable when you launch.

Skip the read scanners for now — they earn their keep on long-running projects, not on week-long bets.

## Scaffold to copy

[scaffolds/web-saas](../scaffolds/web-saas/) is the closest fit because the indie hacker default shape is "Next.js + Supabase landing page that becomes a product over a month." Clone it, fill the env file, ship.

If you are building a WhatsApp-first service, use [scaffolds/whatsapp-saas](../scaffolds/whatsapp-saas/) instead.

## What to skip

The stack has parts that do not earn their keep for this profile:

- **Toprank** ([stack/toprank.md](../stack/toprank.md)) — opt-in. Paid distribution is rarely the bottleneck on a product that has not validated. Skip until your first product clears its first paying-user threshold, then revisit when you start a paid traffic experiment.
- **content-pipeline workflow** — only relevant if content is part of your distribution. If your distribution is X build-in-public posts, you do not need a pipeline yet.
- **GSD skill family** (see [stack/ecc-skill-index.md](../stack/ecc-skill-index.md)) — opinionated, slows you down at three-product cadence. Adopt later when one product becomes a real long-running build.
- **Most C-suite advisor skills** — interesting framing for board-stage companies. Overkill for week-long bets.

## A typical week for this profile

- Monday morning: 30-minute review of all three products. Pick two for focused work. The third gets a Friday touchpoint.
- Tuesday and Wednesday: deep work on Product A. Ship one feature, push, write the build-log post.
- Thursday: switch to Product B. Run a graphify query against the project folder to surface the last decisions. Ship one feature.
- Friday morning: 30 minutes on Product C — respond to issues, merge a small PR, update the project status.
- Friday afternoon: ops sweep across all three. Sentry, Stripe, customer messages.

## What to do in your first session

A 30-60 minute first session should produce:

1. Claude Code installed, Obsidian + `~/Brain/` skeleton up, graphify wired in, Frontend-Design plugin enabled. ECC opt-in added in the same pass if you want the broad skill catalog from day one.
2. The three hooks above copied into `~/.claude/hooks/` and registered in `settings.json`.
3. One product cloned from [scaffolds/web-saas](../scaffolds/web-saas/), env file filled, dev server running locally.
