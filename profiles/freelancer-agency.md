# Operator profile: freelancer or small agency

> If you describe yourself as "shipping client work across two to five accounts a month, sometimes with one or two collaborators on a Slack channel," this is your install path.

## Who this profile is for

You are paid to deliver. The work is not yours to keep — it ships into a client's repo, runs on the client's infra, and your invoice goes out at the end of the month. You do this either alone or with one or two trusted collaborators (a designer, a junior dev, a project manager) who use the same tools you do.

The Tuesday morning shape: open the client's repo (cloned under `~/Projects/clients/<name>/`), check the Linear or GitHub Project board, do the day's scope, push to a branch, open a PR, switch to the next client. You probably bill hourly or in fixed-scope sprints, so visible, defensible delivery matters more than time-saved-on-internal-tooling. The thing that breaks for you is repo-level configuration drift — Client A wants a strict commit format, Client B has its own linter rules, Client C banned auto-commits after a junior dev pushed a secret.

You arrived at this stack because you saw what one operator can ship in four months and thought "I want this leverage on every client account, with safety rails strong enough that I can hand a worktree to a contractor without losing sleep." You want a setup where the same install works across N client repos, and where each repo can override the global config without contaminating the others.

## Install priority

The full stack has six layers (see [stack/](../stack/)). For this profile, install in this order — the per-client override discipline starts on day one, not later.

| Order | Component | Why for this profile |
|-------|-----------|----------------------|
| 1 | **Claude Code** | The runtime, installed once globally. |
| 2 | **Everything Claude Code** ([stack/ecc.md](../stack/ecc.md)) | The skill and agent backbone, with the GSD family for client-shaped delivery. |
| 3 | **MCP servers** ([stack/mcp-servers.md](../stack/mcp-servers.md)) | GitHub is non-negotiable. Add Linear, Jira, or Supabase per the client mix. |
| 4 | **graphify** ([stack/graphify.md](../stack/graphify.md)) | Run per client folder so a knowledge graph of Client A stays scoped to Client A. The cross-client query is opt-in, not default. |
| 5 | **Frontend-Design** ([stack/frontend-design.md](../stack/frontend-design.md)) | Only if you do UI work. The visible polish lever clients pay for. |
| 6 | **Toprank** ([stack/toprank.md](../stack/toprank.md)) | Only if SEO and ads are part of your delivery scope. |

Per-client `~/.claude/` overrides are documented at the end of [stack/ecc.md](../stack/ecc.md) — read that section before installing anything. The pattern: one global config, one per-client `.claude/settings.json` inside the client repo that narrows or extends it.

## Workflows to read first

The full operator playbook has [five workflows](../workflows/). For this profile, read in this order:

1. **[parallel-projects](../workflows/parallel-projects.md)** — your weekly review is across clients, not products, but the discipline transfers exactly. The Friday touchpoint is when you write the client status update.
2. **[solo-ops](../workflows/solo-ops.md)** — billing, scheduling, customer comms. For freelancers, the "customer" is the client. The `chief-of-staff` triage is how you keep five accounts from overwhelming the inbox.
3. **[ship-a-product-in-a-day](../workflows/ship-a-product-in-a-day.md)** — for the discovery-sprint you sometimes do at the start of an engagement, when the client wants something visible by Friday.

[obsidian-as-context](../workflows/obsidian-as-context.md) is optional — if you keep client context in Linear, Notion, or a shared doc, that is your operator brain. Add Obsidian later if you want a private layer on top.

## Cookbook recipes you will reach for

Pick from [the cookbook](../cookbook/) in this order:

- **[01 — Claude Code from zero](../cookbook/01-claude-code-from-zero.md)** — read once, then re-read the CLAUDE.md section. You will be writing one of these per client repo.
- **[02 — Stripe Connect for a P2P marketplace](../cookbook/02-stripe-connect-p2p.md)** — payments work shows up in client engagements often. The webhook handling notes apply broadly.
- **[06 — Sentry across Next.js + FastAPI](../cookbook/06-sentry-fullstack.md)** — clients always ask for error monitoring, and never agree on the setup. This is the one that has held up across multiple stacks.
- **[07 — Supabase pooling on Vercel](../cookbook/07-supabase-vercel-pooling.md)** — the bug that has cost clients production downtime more than once. Have it ready.
- **[11 — Scheduled prompts via cron MCP](../cookbook/11-scheduled-prompts-cron.md)** — the foundation for client-facing automated reports (weekly status digests, deploy notifications).
- **[12 — Multi-brand content cross-post pipeline](../cookbook/12-content-cross-post-pipeline.md)** — for the agency that delivers content alongside engineering.

## Hooks to install

From [configs/hooks/](../configs/hooks/):

- **statusline** ([configs/hooks/statusline.README.md](../configs/hooks/statusline.README.md)) — orientation. When you are switching across five client repos in a day, "which dir am I in" is the first question that needs answering.
- **validate-commit-message** ([configs/hooks/validate-commit-message.README.md](../configs/hooks/validate-commit-message.README.md)) — Conventional Commits enforced. Most clients will thank you for it; for the rare client that wants a different format, override at the per-client `.claude/settings.json` level.
- **read-before-edit** ([configs/hooks/read-before-edit.README.md](../configs/hooks/read-before-edit.README.md)) — the safety guard that prevents the worst version of "Claude rewrote half a file from memory" inside a client codebase you do not fully know yet.
- **prompt-injection-guard** ([configs/hooks/prompt-injection-guard.README.md](../configs/hooks/prompt-injection-guard.README.md)) — when client repos contain customer data or third-party content you did not author, the injection surface is real. Advisory-only, but the audit log is what you point at when a client asks "how do you handle this."

## Scaffold to copy

[scaffolds/web-saas](../scaffolds/web-saas/) is the closest fit when a client wants a discovery-sprint MVP — a landing page that becomes a product over the engagement. The pre-configured CLAUDE.md is a useful starting template even if you delete most of it for the client's stack.

For client work that does not match either scaffold, see [scaffolds/README.md](../scaffolds/README.md) and prune from `web-saas` to match the client's stack.

## What to skip

What this profile drops:

- **Obsidian Brain** ([stack/obsidian-brain.md](../stack/obsidian-brain.md)) — only if your client context already lives somewhere shared. If clients live in Linear or Notion, Obsidian becomes a duplicate brain. Add it for your private operator layer if you want, not as the project source of truth.
- **content-pipeline workflow** — only relevant if your engagements include content delivery. Most do not.
- **Custom hooks per client** — tempting, becomes maintenance debt. Use the shipped six and override at the `settings.json` level when needed.
- **Frontend-Design** if you only do backend or infra work — visible polish is irrelevant if the client never sees a UI.
- **The `crosspost` skill family** unless content is in scope.

## A typical week for this profile

- Monday morning: 45-minute review across all active client engagements. Decide what each client gets this week. Send each client a one-paragraph status note before noon.
- Tuesday through Thursday: deep work in client repos. One client per half-day, branched and PR'd by end of session. Per-client graphify runs scoped to that repo's folder.
- Friday morning: PR review, merge what is ready, request changes on what is not. Ops sweep across all clients.
- Friday afternoon: invoicing, scheduling, the audit-trail tasks that protect the engagement. Close the week clean.

## What to do in your first session

A 30-60 minute first session should produce:

1. Claude Code installed globally, ECC and the four hooks above wired into `~/.claude/settings.json`.
2. One client repo cloned under `~/Projects/clients/<name>/`, with a `.claude/settings.json` that overrides only what that client needs (e.g., a different commit format, a project-specific permitted-tool list).
3. A one-page CLAUDE.md inside the client repo describing the engagement scope, the client's stack, the audit and reporting expectations.
