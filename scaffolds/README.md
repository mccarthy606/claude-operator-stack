# scaffolds

Two project starting points the operator reaches for when bootstrapping a new product. Each one is a runnable directory tree you copy into `~/Projects/<your-product>/`, fill the env file, and run.

These are not frameworks. They are opinionated starting shapes — drop what does not fit.

## What's here

| Scaffold | When to reach for it | Stack |
|----------|----------------------|-------|
| [`web-saas/`](web-saas/) | Solo web product. Landing page → real product over a month. | Next.js 15, Supabase, Sentry, GA4, plain CSS modules |
| [`whatsapp-saas/`](whatsapp-saas/) | B2B WhatsApp-first service. Webhook in, Claude classifies, you reply. | FastAPI, Python 3.12, uv, Docker, Meta Cloud API, Anthropic SDK |

Each scaffold ships with:

- A pre-configured `CLAUDE.md` tuned to its stack, with cookbook recipe links and hook references.
- A short `README.md` with install steps, when-to-use / when-not-to-use, and what is pre-wired.
- Real source files — the lead form actually renders, the webhook actually verifies signatures. Not skeleton stubs.
- An `.env.example` listing every variable, grouped and commented.
- A `.gitignore` so you can `git init` immediately.

## Pick one

- Building a UI users see in a browser. Use `web-saas/`.
- Building a service users reach via WhatsApp. Use `whatsapp-saas/`.
- Building both. Start with one, add the other once the first is real.

## What these scaffolds are not

- Not maintained against vendor API changes. Verify package versions and API shapes against current vendor docs before shipping anything past v0.
- Not framework-agnostic. Each one picks a stack the operator has shipped on.
- Not a substitute for reading the [cookbook](../cookbook/). The scaffolds bring the shape; the cookbook brings the integrations.

## Related

- [cookbook/](../cookbook/) — recipes the scaffolds reference
- [configs/hooks/](../configs/hooks/) — hooks the scaffold CLAUDE.md expects
- [stack/](../stack/) — the components every scaffold assumes are installed
- [workflows/ship-a-product-in-a-day.md](../workflows/ship-a-product-in-a-day.md) — the cadence these scaffolds support
