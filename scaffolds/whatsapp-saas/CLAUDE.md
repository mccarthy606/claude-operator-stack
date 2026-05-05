# CLAUDE.md — &lt;your-product-name&gt;

> Project-level Claude config for a WhatsApp-first service built from the [whatsapp-saas scaffold](../../scaffolds/whatsapp-saas/).

## What this project is

&lt;one paragraph: what the product does, which vertical, who pays for it, what the "good outcome per inbound message" looks like&gt;

## Stack

- **Framework:** FastAPI on Python 3.12, ASGI via uvicorn.
- **Toolchain:** [uv](https://github.com/astral-sh/uv) for env + deps. No pip, no Poetry. `uv add`, `uv sync`, `uv run`.
- **Channel:** Meta WhatsApp Cloud API (official). No third-party WhatsApp wrapper — they get numbers banned.
- **DB:** Supabase Postgres for dedupe, conversations, leads. Service role from server, never the anon key.
- **AI:** Anthropic SDK. Default classification model: `claude-sonnet-4-5`. Switch to Haiku for trivial classification once you have measured what you actually need.
- **Errors:** Sentry, signature headers in the scrubber denylist.
- **Deploy:** Docker. Railway or Fly.io are both fine; pick one. See `README-deploy.md`.

## Conventions

- Async everywhere in the request path. WhatsApp will retry on a slow handler — keep p99 well below 10s.
- Verify the `X-Hub-Signature-256` header against the **raw bytes** of the request body. Never against `request.json()` output. The recipe in `cookbook/03-whatsapp-cloud-api-webhook.md` is the canonical pattern.
- Every Meta `message.id` goes through the dedupe table before processing. Idempotency is non-negotiable — Meta retries on any 5xx.
- Use Pydantic models for inbound payloads. No raw `dict[str, Any]` past the parser.
- Conventional Commits. The [`validate-commit-message`](../../configs/hooks/validate-commit-message.README.md) hook enforces this on `git commit -m`.
- TDD for the webhook + classifier path. The happy-path test in `tests/test_webhook.py` is the seed; extend it as you add behaviour.
- Files <800 lines. Functions <50 lines. Many small modules.

## Visual / product direction

This service has no UI. Its &ldquo;design&rdquo; is the inbound message taxonomy, the reply latency budget, and the escalation rules. Pin those decisions in this file before writing more handlers.

- **Inbound classes:** &lt;list yours; the scaffold ships with question / lead / complaint / spam — adjust&gt;
- **Reply latency target:** &lt;e.g. p95 under 5s for auto-replies&gt;
- **Escalation:** &lt;what happens for `lead` and `complaint`; who gets the Telegram ping; when to fall back to a human&gt;

## Reach for these cookbook recipes

- The webhook + verification + signature path is built from [recipe 03](../../cookbook/03-whatsapp-cloud-api-webhook.md). Read it before touching `app/webhook.py`.
- Local dev needs a public URL — [recipe 04](../../cookbook/04-cloudflare-argo-local-dev.md) for Cloudflare Tunnel.
- Sentry + scrubbing — [recipe 06](../../cookbook/06-sentry-fullstack.md). The scaffold already extends the denylist with signature headers; do not regress it.
- Scheduled ops checks against this service (uptime, queue depth, daily message volume) — [recipe 11](../../cookbook/11-scheduled-prompts-cron.md).
- First-session orientation — [recipe 01](../../cookbook/01-claude-code-from-zero.md).

## Hooks expected

- [`validate-commit-message`](../../configs/hooks/validate-commit-message.README.md) — Conventional Commits gate.
- [`statusline`](../../configs/hooks/statusline.README.md) + `context-monitor` — context-budget visibility while building.

## Out of scope this session

&lt;list things Claude should not touch — multi-tenant routing, billing, dealer dashboard, etc.&gt;

## Solo-ops conventions

- Webhook reliability matters more than feature breadth. A flaky handler costs more in churn than a missing feature does in conversion.
- Errors and Sentry ship in the first deploy, not the second.
- Outbound replies stay inside the 24h customer-service window unless explicitly using a pre-approved template.
- The classification prompt lives in `app/classifier.py` — change it once, deploy once. No prompt drift across files.
- Never push to `main` without local verification.
