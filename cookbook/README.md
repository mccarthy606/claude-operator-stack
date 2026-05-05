# Cookbook

Twelve copy-pasteable recipes drawn from the operator's actual shipped projects. Each one is a single integration done end-to-end: the problem that triggered it, the solution shape, the code, the things that broke the first time.

These are not tutorials. They assume you can read code and that you have already installed the [stack](../stack/). They exist so that the next time you sit down to wire Stripe Connect, set up a WhatsApp webhook, or pull a competitor's video transcript, you don't have to reverse-engineer it from a vendor's marketing page.

## Index

| # | Recipe | Stack | Time |
|---|--------|-------|------|
| 01 | [Claude Code from zero](01-claude-code-from-zero.md) | Claude Code, ECC, Toprank | ~1h |
| 02 | [Stripe Connect for a P2P marketplace](02-stripe-connect-p2p.md) | Next.js, Stripe Connect | ~3h |
| 03 | [WhatsApp Cloud API webhook](03-whatsapp-cloud-api-webhook.md) | FastAPI, Meta Cloud API | ~2h |
| 04 | [Cloudflare Tunnel for local webhook dev](04-cloudflare-argo-local-dev.md) | Cloudflare, cloudflared | ~30m |
| 05 | [GA4 + Cloudflare Analytics, no cookie banner](05-ga4-cloudflare-analytics.md) | GA4, Cloudflare Analytics | ~1h |
| 06 | [Sentry across Next.js + FastAPI](06-sentry-fullstack.md) | Sentry, Next.js, FastAPI | ~1.5h |
| 07 | [Supabase pooling on Vercel](07-supabase-vercel-pooling.md) | Supabase, Vercel, Postgres | ~1h |
| 08 | [yt-dlp + Whisper research pipeline](08-ytdlp-whisper-research.md) | Python, yt-dlp, Whisper | ~2h |
| 09 | [Telegram bot as v0 lead capture](09-telegram-bot-leads-v0.md) | Telegram Bot API, Python | ~30m |
| 10 | [Mercado Pago for LATAM](10-mercado-pago-latam.md) | Mercado Pago, Next.js | ~3h |
| 11 | [Scheduled prompts via cron MCP](11-scheduled-prompts-cron.md) | scheduled-tasks MCP, Obsidian | ~45m |
| 12 | [Multi-brand content cross-post pipeline](12-content-cross-post-pipeline.md) | ECC `crosspost`, brand presets | ~1.5h |

## Read order

If you arrived from the README and don't have a specific problem yet:

1. Start with **01 — Claude Code from zero**. Even if you have Claude Code installed, the CLAUDE.md skeleton and MCP loadout are worth a read.
2. Then pick whichever recipe matches the next thing you have to ship. The recipes do not assume you have read the previous ones.

If you arrived because you have a specific integration in front of you, jump straight to its recipe and ignore the rest.

## Shape of every recipe

Each file follows the same structure so you can skim it in 60 seconds:

1. **The problem** — the scenario that triggers using this recipe
2. **Solution overview** — the key idea before any code
3. **Step-by-step** — commands and code, in order
4. **Pitfalls** — what broke the first time
5. **References** — official docs and related recipes

Hard cap of ~200 lines per recipe. If a recipe outgrows that, it gets split.

## What these recipes are not

- Not exhaustive vendor documentation. Every recipe links out to the official docs for the long form.
- Not framework-agnostic. Each one picks a specific stack the operator has shipped on. Port to your own as needed.
- Not maintained against vendor API changes. Each recipe lists a snapshot date in spirit. If something looks off against the vendor's current docs, trust the vendor's docs.

## Related

- [skills/](../skills/) — invocable SKILL.md packages Claude executes (cookbook = human reads, skills = Claude executes)
- [workflows/](../workflows/) — the operator playbook that sits above these recipes
- [case-studies/](../case-studies/) — the products these recipes shipped inside of
- [stack/](../stack/) — the components every recipe assumes are installed
