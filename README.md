<div align="center">

<img src="assets/hero.svg" alt="Claude Operator Stack — 7 products · 4 months · 1 person" width="100%"/>

**English** · [Русский](README.ru.md) · [Español](README.es.md) · [Português (BR)](README.pt-br.md) · [Türkçe](README.tr.md) · [中文](README.zh.md) · [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Claude_Code_+_4_marketplaces-7c3aed)](#the-stack)
[![Status](https://img.shields.io/badge/status-active-22c55e)](#)
[![Last commit](https://img.shields.io/github/last-commit/mccarthy606/claude-operator-stack)](https://github.com/mccarthy606/claude-operator-stack/commits/main)
[![Built by](https://img.shields.io/badge/built_by-%40mccarthy606-orange)](https://github.com/mccarthy606)

**7 products in 4 months · solo · pre-revenue**

> I started writing code in January 2026 with Cursor and Claude. Four months later: 3 live sites, 4 SaaS codebases ready to deploy, 1 active YouTube channel. This repo is the stack and the playbook I run from.

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

A curated toolkit and a playbook for solo founders running several AI products at once.

The stack is what I install and update. The playbook is how I use it across the week — which components to reach for in which order, what to read first, where the seams are.

Most parts of the stack are other people's work, credited where used. What's added here: the install path, the workflows that compose the parts together, and four case studies of products built on top.

It's aimed at people running 2+ products at the same time, founders without a CS background, and anyone who wants Claude Code to do real work instead of being a chat companion.

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

Every skill and agent in this stack credits its original author. If a piece comes from somewhere else, the link goes there.

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

Sets up the stack on a fresh machine. macOS and Linux supported; Windows via WSL.

> Pick one install path. Don't run `curl | bash` on top of a manual clone — they conflict.

Clone, audit, run:

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
├── profiles/                    ← opinionated install paths by operator archetype
│
├── scaffolds/                   ← copy-and-run starting points (web-saas, whatsapp-saas)
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

Five workflows that run my week.

### 1. Ship a product in a day
From idea to live URL in one session. See [workflows/ship-a-product-in-a-day.md](workflows/ship-a-product-in-a-day.md).

### 2. Parallel projects
Keeping seven projects in flight without losing context between them. See [workflows/parallel-projects.md](workflows/parallel-projects.md).

### 3. Obsidian as context
Every project also has a note in `~/Brain`; Claude Code reads it on session start. See [workflows/obsidian-as-context.md](workflows/obsidian-as-context.md).

### 4. Content pipeline
YouTube, Instagram, and drive2 across three brands with most of the production steps automated. See [workflows/content-pipeline.md](workflows/content-pipeline.md).

### 5. Solo ops
Customer support, billing, scheduling, and infra handled from one person's calendar. See [workflows/solo-ops.md](workflows/solo-ops.md).

---

## Why this exists

Most AI-tooling material is written for engineers. This is written for operators.

The bet: a non-engineer with a tight project list, a curated stack, and a workflow that compounds can ship more than a small team, given the right setup. I am not trying to argue AI replaces engineers; I am documenting what one operator can do with the right tools loaded.

Most components here are other people's work. What's mine is the glue: the install path, the workflows, and the case studies that pull seven separate projects into one stack.

---

## Acknowledgements

Built with:

- [@affaan-m](https://github.com/affaan-m) — Everything Claude Code (skills and agents)
- nowork-studio — Toprank (SEO, Google Ads, Meta Ads)
- Anthropic — Claude Code, Frontend-Design, the API
- Obsidian team — the second-brain runtime
- Every skill author credited individually in `origin:` frontmatter and in [credits/README.md](credits/README.md)

If your work is in here and not credited, open an issue and I'll fix it the same day.

---

## Status

Young repo. v0.2 added the hero banner, Mermaid diagrams, the 7-language nav, and full RU and ES translations. Case studies get filled in as products ship. CHANGELOG tracks the rest.

Issues, PRs, and forks welcome. The stack is designed to be customized: copy what fits, drop what doesn't.

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
