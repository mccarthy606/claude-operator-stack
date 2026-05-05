# Operator profile: non-technical founder

> If you describe yourself as "the founder of the company, not the engineer of the codebase — Claude is my engineer," this is your install path.

## Who this profile is for

You either never wrote production code, or you used to and you stopped. Either way, your job now is product and distribution decisions — what gets built, who pays for it, how it reaches them. The actual code-writing is delegated — historically to a developer or a small team, currently to Claude Code.

The thing that breaks: you have product instinct and momentum but every technical conversation costs a half-day of context. The Tuesday morning shape: open the laptop, open Obsidian, look at the three open project notes. Decide that today is the day the WhatsApp service gets the renewal-reminder feature. Open Claude Code, paste the project context, describe the feature in product language, then watch it ship. What you are really wrestling with is not coding — it is keeping Claude pointed at the right thing for long enough to produce work you can ship to customers without surprise.

You arrived at this stack because the "vibe coding" videos make it look easy and your own attempts produced 60% of a feature, then a bug you could not debug, then a Cursor session that ate three hours. The setup you want is one where Claude is treated as a real engineer — onboarded against a real project doc, expected to remember decisions across sessions, held to a commit format you did not have to invent. Without you having to learn the difference between a hook and a skill.

## Install priority

The stack ships as 4 core components (always installed) and 2 opt-in components. See [stack/](../stack/). For this profile, the memory layer goes early because without it Claude has no continuity across sessions, which is the difference between an engineer and a chat box.

| Order | Component | Status | Why for this profile |
|-------|-----------|--------|----------------------|
| 1 | **Claude Code** | **Required** | The runtime. |
| 2 | **Obsidian** ([stack/obsidian-brain.md](../stack/obsidian-brain.md)) | **Required** | Your project memory. Where you write goals, requirements, decisions in plain language. Claude reads this on every session. |
| 3 | **graphify** ([stack/graphify.md](../stack/graphify.md)) | **Recommended** (operator-private until v1.1) | Knowledge-graph layer over your folders. Sits underneath Obsidian — when you have multiple projects, point it at the parent directory and ask cross-project questions in plain language. Skip if you do not have access — Obsidian alone covers the cross-session memory layer. |
| 4 | **Frontend-Design** ([stack/frontend-design.md](../stack/frontend-design.md)) | **Required** | Generated UI that does not look like a template. The visible-quality lever you can pull without designing. |
| 5 | **Everything Claude Code** ([stack/ecc.md](../stack/ecc.md)) | **Opt-in (recommend)** | The skill catalog matters most when you cannot write code from scratch — `chief-of-staff`, `gsd-*`, and review skills are how you delegate without losing oversight. Install when you are ready to lean on those flows; the 4 core work without it. |
| 6 | **Toprank** ([stack/toprank.md](../stack/toprank.md)) | **Opt-in (skip day 1)** | Paid ads and SEO are real surfaces, but you should not run them yourself in the first 90 days. Hire a freelancer or skip until the product is real. |

## Workflows to read first

The full operator playbook has [five workflows](../workflows/). For this profile, read in this order:

1. **[obsidian-as-context](../workflows/obsidian-as-context.md)** — the loop that makes Claude treat your Obsidian notes as the authoritative project source. This is the single most important workflow for you. Read it twice.
2. **[parallel-projects](../workflows/parallel-projects.md)** — the Monday review and the Friday touchpoint cadence. The discipline that keeps three products from collapsing into none.
3. **[solo-ops](../workflows/solo-ops.md)** — the moment you have customers, ops eats the day. The `chief-of-staff` skill is your second pair of hands here.

[ship-a-product-in-a-day](../workflows/ship-a-product-in-a-day.md) is useful but secondary — your day-shape will lean on the Obsidian loop more than on the time-boxed sprint.

## Cookbook recipes you will reach for

Pick from [the cookbook](../cookbook/) in this order:

- **[01 — Claude Code from zero](../cookbook/01-claude-code-from-zero.md)** — read on day one. The CLAUDE.md skeleton is the document you will rely on more than any other.
- **[03 — WhatsApp Cloud API webhook](../cookbook/03-whatsapp-cloud-api-webhook.md)** — even if you are not building a WhatsApp product, this is the clearest example of "describe what you want, point Claude at the right doc, get a verified webhook running."
- **[06 — Sentry across Next.js + FastAPI](../cookbook/06-sentry-fullstack.md)** — because when something breaks in production, you want Claude to be able to read the error, not guess.
- **[07 — Supabase pooling on Vercel](../cookbook/07-supabase-vercel-pooling.md)** — the kind of bug that takes a non-engineer days to even understand. Have the recipe open before you deploy.
- **[10 — Mercado Pago for LATAM](../cookbook/10-mercado-pago-latam.md)** — or whichever payment recipe matches your geography. Payment integration is the area where Claude needs the most explicit guidance.

## Hooks to install

From [configs/hooks/](../configs/hooks/):

- **statusline** ([configs/hooks/statusline.README.md](../configs/hooks/statusline.README.md)) — orientation. You do not want to lose track of which project Claude is working in.
- **read-before-edit** ([configs/hooks/read-before-edit.README.md](../configs/hooks/read-before-edit.README.md)) — forces Claude to read existing files before changing them. Catches the "rewrote the whole file from memory" failure mode that costs non-technical founders the most.
- **validate-commit-message** ([configs/hooks/validate-commit-message.README.md](../configs/hooks/validate-commit-message.README.md)) — Conventional Commits. Makes the project history readable without you having to enforce style yourself.

## Scaffold to copy

[scaffolds/web-saas](../scaffolds/web-saas/) is the closest fit for most non-technical founders, because the default product shape is a web app with a landing page and a real backend. The pre-configured CLAUDE.md is the most important file in the scaffold for you — it is the briefing document Claude reads before doing anything.

If you are building WhatsApp-first, use [scaffolds/whatsapp-saas](../scaffolds/whatsapp-saas/).

## What to skip

The stack has parts that do not earn their keep for this profile:

- **content-pipeline workflow** — content is its own job. Skip unless content is your distribution channel.
- **Custom hook authoring** — installing hooks is fine. Writing your own is engineering work. Stay with the six shipped here.
- **The full GSD skill family** (see [stack/ecc-skill-index.md](../stack/ecc-skill-index.md)) — adopt selectively. `gsd-new-project` and `gsd-progress` are the two worth your time. The rest is engineer-shaped overhead.
- **MCP server authoring** — never. The shipped set is enough.

## A typical week for this profile

- Monday morning: review all open Obsidian project notes. Decide which two products are the focus this week. Update each project note's "this week" section.
- Tuesday and Wednesday: deep work on Product A. Open Claude Code, let it read the Obsidian note, describe the feature in plain language, review the diff before commit.
- Thursday: switch to Product B. Same shape. Update the Obsidian note as you go.
- Friday morning: `chief-of-staff` triage on email and WhatsApp. Send the replies it drafted after reviewing them.
- Friday afternoon: 30-minute touchpoint on Product C. Update its status. Decide if it is paused or active for next week.

## What to do in your first session

A 30-60 minute first session should produce:

1. Claude Code installed. Frontend-Design plugin enabled. ECC opt-in added on day one if you want the chief-of-staff and review skills available before you delegate your first task.
2. Obsidian installed, the `~/Brain/` vault structure created (Projects, Knowledge, Daily folders), graphify wired in, and the [obsidian-integration rule](../configs/rules/obsidian-integration.md) wired into `~/.claude/`.
3. One project note created in `~/Brain/Projects/` describing the product you are working on right now — goals, stack, current open task. Do this in plain language, not technical jargon.
