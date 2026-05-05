<div align="center">

<img src="assets/hero.svg" alt="Claude Operator Stack — 7 products · 4 months · 1 person" width="100%"/>

**English** · [Русский](README.ru.md) · [Español](README.es.md) · [Português (BR)](README.pt-br.md) · [Türkçe](README.tr.md) · [中文](README.zh.md) · [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Claude_Code_+_4_marketplaces-7c3aed)](#the-stack)
[![Status](https://img.shields.io/badge/status-active-22c55e)](#)
[![Last commit](https://img.shields.io/github/last-commit/mccarthy606/claude-operator-stack)](https://github.com/mccarthy606/claude-operator-stack/commits/main)
[![Built by](https://img.shields.io/badge/built_by-%40mccarthy606-orange)](https://github.com/mccarthy606)

**7 products · 4 months · 0 funding · 0 team · 1 person**

> I started writing code in January 2026 with Cursor + Claude.
> Four months later: 3 live sites, 4 ready-to-ship SaaS products, 1 active YouTube channel.
> Solo. No team. No CS degree.
>
> This repo is the stack and the playbook that made it possible.

</div>

---

## Contents

- [What this is](#what-this-is)
- [The Stack](#the-stack)
- [The 7 products in 4 months](#the-7-products-in-4-months)
- [Quick Start](#quick-start)
- [What's Inside](#whats-inside)
- [The Operator Playbook](#the-operator-playbook)
- [Why this exists](#why-this-exists)
- [Acknowledgements](#acknowledgements)
- [Status](#status)
- [License](#license)

---

## What this is

**Claude Operator Stack is not a fork.** It's a curator's toolkit + the operator playbook for solo founders who want to ship multiple AI products in parallel without a team.

Most "awesome Claude" repos dump skills and call it a day. This one does the opposite: it picks the **smallest set of high-leverage components** that actually compose into a daily workflow, attributes the original authors, and explains *how to use them together* through real shipped projects.

If you are:

- A solo founder shipping 2+ products at once
- A non-CS person using AI to compress the build cycle
- An operator who wants Claude Code to be a real teammate, not a chatbot

— this is for you.

---

## The Stack

| Layer | Component | Author | What it does for me |
|-------|-----------|--------|---------------------|
| **Skills + Agents** | [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | [@affaan-m](https://github.com/affaan-m) | 182 skills, 48 agents — backbone for any task |
| **SEO + Ads** | [Toprank](https://github.com/nowork-studio/toprank) | nowork-studio | Google Ads, Meta Ads, GEO, broken-link checks |
| **UI generation** | [Frontend-Design](https://github.com/anthropics/claude-plugins-official) | Anthropic | Distinctive, production-grade UI |
| **Memory** | OMEGA Memory | local | Persistent context across conversations |
| **Second Brain** | [Obsidian](https://obsidian.md) | Obsidian | `~/Brain` vault as project + identity context |
| **Orchestration** | [Claude Code](https://www.anthropic.com/claude-code) | Anthropic | The runtime |

Every skill, every agent, every prompt in this stack credits its original author. **Nothing here is rebadged.** If a piece comes from somewhere else, that's where the link goes.

See [stack/](stack/) for component-by-component setup notes.

---

## The 7 products in 4 months

What this stack actually shipped between January and May 2026.

| # | Product | Status | Stack |
|---|---------|--------|-------|
| 1 | Niche Booking Trio — 3 niche booking sites | **Live** (3 domains) | Next.js · Supabase · GA4 · Sentry |
| 2 | P2P Marketplace — P2P classic-car rental | Code complete | Next.js · Stripe Connect · Prisma |
| 3 | WhatsApp B2B SaaS — WhatsApp SaaS for dealers | Code complete | FastAPI · Docker · Whatsapp Cloud API |
| 4 | AI Legal Tool — AI traffic-fine appeals | Code complete | Next.js · Prisma · Claude API |
| 5 | YouTube production pipeline | **Live** (active) | Python · yt-dlp · Whisper · Claude |
| 6 | Jarvis Workspace — personal AI assistant | **Live** (daily use) | Claude Code · Obsidian · OMEGA |
| 7 | Internal ops automation | **Live** | hooks + skills + cron |

See [case-studies/](case-studies/) for the *how*.

---

## Quick Start

Bootstraps the entire stack on a fresh machine in under 5 minutes. macOS + Linux supported, Windows via WSL.

> **Pick one path only.** This stack is opinionated about install methods. Don't stack `curl | bash` on top of a manual clone — they will conflict.

**Recommended — clone, audit, run:**

```bash
git clone https://github.com/mccarthy606/claude-operator-stack.git
cd claude-operator-stack
less install.sh           # audit it first
./install.sh --dry-run    # preview every change
./install.sh              # apply
```

The installer will:

1. Verify `claude` CLI is installed (and abort with instructions if missing)
2. Print the marketplace + plugin commands you'll run inside Claude Code
3. Copy sanitized `settings.json` and `mcp-servers.json` templates to `~/.claude/` as **sidecar files** — your existing config is never silently overwritten
4. Print the next-step checklist for adding your own API keys

Nothing is committed to your `~/.claude/` without explicit confirmation. The installer supports `--dry-run` and `--yes` flags.

---

## What's Inside

```
claude-operator-stack/
├── README.md                    ← you are here
├── install.sh                   ← one-liner installer (audit before running)
├── CLAUDE.md                    ← my project-level Claude config (sanitized)
│
├── stack/                       ← component-by-component setup
│   ├── ecc.md                   ← Everything Claude Code: what I use, why
│   ├── toprank.md               ← Toprank: SEO + Ads workflow
│   ├── frontend-design.md       ← UI generation
│   ├── obsidian-brain.md        ← Obsidian as second brain
│   ├── omega-memory.md          ← OMEGA persistent memory
│   └── mcp-servers.md           ← The MCP servers I run + what they do
│
├── workflows/                   ← how I actually work
│   ├── ship-a-product-in-a-day.md
│   ├── parallel-projects.md     ← managing 7 in flight at once
│   ├── obsidian-as-context.md   ← the "second brain" loop
│   ├── content-pipeline.md      ← YouTube + IG automation
│   └── solo-ops.md              ← running a company of one
│
├── case-studies/                ← real shipped products, not demos
│   ├── niche-booking-trio.md
│   ├── ai-legal-tool.md
│   ├── whatsapp-b2b-saas.md
│   └── youtube-pipeline.md
│
├── configs/                     ← sanitized configs you can copy
│   ├── settings.json.example
│   ├── mcp-servers.json.example
│   ├── hooks/                   ← my custom hooks (audit them)
│   └── rules/                   ← my project rules
│
└── credits/                     ← attribution to every original author
    └── README.md
```

---

## The Operator Playbook

Five workflows that actually run my week.

### 1. Ship a product in a day
From idea to live URL in one focused session. See [workflows/ship-a-product-in-a-day.md](workflows/ship-a-product-in-a-day.md).

### 2. Parallel projects
How seven projects stay in flight without context collapse. See [workflows/parallel-projects.md](workflows/parallel-projects.md).

### 3. Obsidian as context
Why every project is also a note in `~/Brain` — and how Claude Code reads from it. See [workflows/obsidian-as-context.md](workflows/obsidian-as-context.md).

### 4. Content pipeline
YouTube + Instagram + drive2 across 3 brands, mostly automated. See [workflows/content-pipeline.md](workflows/content-pipeline.md).

### 5. Solo ops
Running customer support, billing, scheduling, and infra from one person's calendar. See [workflows/solo-ops.md](workflows/solo-ops.md).

---

## Why this exists

Most AI-tooling content is written by AI engineers, for AI engineers. This is written by an operator, for operators.

I am not trying to convince you that AI replaces engineers. I am showing you that a **non-engineer with a clear project list, a curated stack, and a loop that compounds** can ship more than a small team — if the stack is set up right.

The tools in this repo are ~95% other people's work. The other 5% is the **glue, the workflows, and the case studies that make the stack work as one thing instead of seven.**

---

## Acknowledgements

This stack stands on the shoulders of:

- **[@affaan-m](https://github.com/affaan-m)** — Everything Claude Code. The skill + agent backbone.
- **nowork-studio** — Toprank. SEO, Google Ads, Meta Ads.
- **Anthropic** — Claude Code, Frontend-Design, the API.
- **Obsidian team** — the second-brain runtime.
- **Every individual skill author** credited in `origin:` frontmatter and in [credits/README.md](credits/README.md).

If your work is in here and not credited, open an issue — I will fix it the same day.

---

## Status

This repo is **young**. v0.2 ships visual identity (hero banner, Mermaid diagrams, 7-language nav, RU + ES full translations). Case studies are filled in shipping order. The CHANGELOG tracks what's done.

Issues, PRs, and forks welcome. Especially forks — the stack is meant to be customized to your operator profile, not copied verbatim.

### Currently looking for

Open `good first issue`s if you want to contribute:

- [Translate README to PT-BR](https://github.com/mccarthy606/claude-operator-stack/issues/1) · [TR](https://github.com/mccarthy606/claude-operator-stack/issues/2) · [中文](https://github.com/mccarthy606/claude-operator-stack/issues/3) · [日本語](https://github.com/mccarthy606/claude-operator-stack/issues/4) (stubs in place, replace with full translations)
- [Add native Windows install script](https://github.com/mccarthy606/claude-operator-stack/issues/5) (`install.ps1`)
- [Capture 3 README screenshots](https://github.com/mccarthy606/claude-operator-stack/issues/6) (Obsidian + Claude Code + asciinema of installer)
- [Add Mermaid to content-pipeline.md](https://github.com/mccarthy606/claude-operator-stack/issues/7) (~30 min)

See [all open issues](https://github.com/mccarthy606/claude-operator-stack/issues) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT. See [LICENSE](LICENSE).

The components this stack depends on each carry their own licenses — see each component's repo and [credits/README.md](credits/README.md).
