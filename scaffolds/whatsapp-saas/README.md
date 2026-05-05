# whatsapp-saas

> A FastAPI + Docker + WhatsApp Cloud API starting point for B2B WhatsApp-first products.
> Stack: FastAPI, Python 3.12, uv, Meta Cloud API, Anthropic SDK, Supabase, Sentry, Docker.
> Used in: [WhatsApp B2B SaaS](../../case-studies/whatsapp-b2b-saas.md).

## When to use this scaffold

- You are building a webhook-driven service where customers reach you via WhatsApp Business and a backend classifies and replies.
- You want a Docker image you can deploy to Railway, Fly.io, or any container host on day one.
- You want Claude to do the inbound classification and you want the prompt + model pinned in code, not buried in a vendor dashboard.
- You want signature verification, idempotency, and Sentry wired before any business logic.

## When NOT to use

- You are building a web product. Use [web-saas](../web-saas/) for Next.js.
- You only need to send outbound WhatsApp messages (no inbound). A simple script + the Cloud API send endpoint is enough.
- You need a WhatsApp wrapper that bypasses Meta. Do not. Use the official Cloud API. See [recipe 03](../../cookbook/03-whatsapp-cloud-api-webhook.md).
- You need multi-tenant routing on day one. Add tenant routing once a second customer exists, not before.

## Install

```bash
# Copy the scaffold
cp -r scaffolds/whatsapp-saas/ ~/Projects/<your-product>/
cd ~/Projects/<your-product>/

# Init git
git init && git add -A && git commit -m "chore: initial scaffold from claude-operator-stack"

# Install deps with uv (https://github.com/astral-sh/uv)
uv sync

# Set env
cp .env.example .env
# fill in WhatsApp Cloud API credentials, Anthropic key, Supabase URL + service role,
# Sentry DSN. See README-deploy.md for getting a public URL for the Meta webhook subscription.

# Run locally
uv run uvicorn app.main:app --reload --port 8000

# Or via Docker
docker compose up --build
```

The healthcheck at `GET /healthz` returns `{"status":"ok"}`. The webhook lives at `/webhook/whatsapp` (GET for verification, POST for inbound). For Meta to actually POST to it during dev, expose port 8000 with Cloudflare Tunnel (see [recipe 04](../../cookbook/04-cloudflare-argo-local-dev.md)).

## What's pre-wired

- **Webhook verification + signature validation** in `app/webhook.py`. Real `X-Hub-Signature-256` HMAC-SHA256 against the raw body, constant-time compare. See [recipe 03](../../cookbook/03-whatsapp-cloud-api-webhook.md).
- **Inbound message parser** with typed Pydantic models in `app/models.py`. Handles text messages today; image/audio extension is mechanical.
- **Idempotency** — every Meta message ID is checked against a Supabase dedupe table before processing. Meta retries on any 5xx, this scaffold does not double-process.
- **Claude classification** in `app/classifier.py`. Inbound text gets classified into `question | lead | complaint | spam` via `claude-sonnet-4-6`. Replace the prompt in one place.
- **WhatsApp send helper** in `app/reply.py`. Outbound text within the 24h customer-service window; logs and surfaces the error if you try to send outside it.
- **Sentry** init in `app/main.py` with PII scrubbing on and signature headers added to the denylist. See [recipe 06](../../cookbook/06-sentry-fullstack.md).
- **Scheduled prompt hooks** — see [recipe 11](../../cookbook/11-scheduled-prompts-cron.md) for how to wire daily ops checks against this service.
- **CLAUDE.md** pre-tuned to FastAPI + Python 3.12 + uv work, with cookbook recipe links and hook references.
- **Dockerfile + docker-compose** — multi-stage slim build, healthcheck wired, ready for Railway or Fly.io.

## Customize after copying

- Replace placeholders in `CLAUDE.md`: project name, the verticals you target, what counts as `lead` vs `question` for your domain.
- Edit the classifier prompt in `app/classifier.py`. Domain context belongs there, not in the orchestration code.
- Edit the dedupe + leads schema in `app/deps.py` (the `init_tables` helper) once you know your real columns.
- Replace the placeholder reply logic in `app/webhook.py:handle_message` with whatever your product actually does — auto-reply for `question`, route for `lead`, ignore `spam`, escalate `complaint`.
- Pick a host: Railway and Fly.io notes are in `README-deploy.md`. Pick one, do not run both.

## Pre-wired hooks

The CLAUDE.md references two hooks from this stack:

- [`validate-commit-message`](../../configs/hooks/validate-commit-message.README.md) keeps commit messages on Conventional Commits as you go.
- [`statusline`](../../configs/hooks/statusline.README.md) plus `context-monitor` to track context budget while building.

Wire them per the per-hook README; they are not auto-installed by copying the scaffold.

## References

- [recipe 01 — Claude Code from zero](../../cookbook/01-claude-code-from-zero.md)
- [recipe 03 — WhatsApp Cloud API webhook](../../cookbook/03-whatsapp-cloud-api-webhook.md)
- [recipe 04 — Cloudflare Tunnel for local webhook dev](../../cookbook/04-cloudflare-argo-local-dev.md)
- [recipe 06 — Sentry across Next.js + FastAPI](../../cookbook/06-sentry-fullstack.md)
- [recipe 11 — Scheduled prompts via the cron MCP](../../cookbook/11-scheduled-prompts-cron.md)
- [case-studies/whatsapp-b2b-saas.md](../../case-studies/whatsapp-b2b-saas.md)
