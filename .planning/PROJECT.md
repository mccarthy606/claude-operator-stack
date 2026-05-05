---
project: claude-operator-stack
owner: Dmitry McCarthy (@mccarthy606)
repo: https://github.com/mccarthy606/claude-operator-stack
type: open-source curator-toolkit + operator playbook
license: MIT
status: v0.2 ready-for-public, working toward v1.0 launch
created: 2026-05-04
---

# Claude Operator Stack

## What This Is

A curated toolkit and operator playbook for solo founders running multiple AI products in parallel using Claude Code. Documents which stack to install (Everything Claude Code, Toprank, Frontend-Design, graphify, Obsidian, curated MCP set) and how to compose those parts into real shipping workflows. It is not a fork, not a redistribution, not a runtime — it is the install path, the workflows, the case studies, and the credits chain that pulls one operator's output across seven products into a single replicable stack.

## Core Value

A non-engineer running multiple AI products at once can clone this repo, follow the install path, and within one session be set up with the same stack, the same workflows, and the same Claude Code mental model that produced 7 products in 4 months — without redistributing anyone else's skills and without any cargo cult.

## Milestones

### M1 — v0.2 Foundation (✅ shipped 2026-05-04)

Minimum-viable public-ready repo: README in 3 full languages + 4 stubs, 6 stack files, 5 workflow files, 4 case studies, sanitized configs, install.sh with dry-run, attribution chain, contributing/security policies, 7 open good-first-issues, slap-cleanup applied. 43 files, ~250 KB. Private but ready to flip public.

### M2 — v1.0 Public Launch (🚧 active)

Convert the v0.2 minimum-viable foundation into a launch-quality public artifact with a real chance of traction. Adds operator-grade depth (cookbook of recipes from real shipped projects, sanitized custom hooks, skill index, project scaffolds, profile variants), credibility assets (screenshots, asciinema), and the actual public flip with launch surfaces (X thread, Show HN, social preview, topics). Defers translation expansion of stub languages (PT-BR/TR/ZH/JA) to community.

### M3 — v1.1+ Post-launch (📋 planned, scope shaped by M2 traction)

Iteration based on what M2 launch surfaces actually attract: contributor onboarding, RFC process if PRs accumulate, a v1.1 deepening of whichever section gets the most pull (recipes vs scaffolds vs case studies), Windows-native installer if the audience demands it.

## Requirements

### Validated (M1)

- ✓ README with TOC, hero banner, 7-language nav, status badges
- ✓ Three full README translations (EN, RU, ES) and four stubs (PT-BR, TR, ZH, JA)
- ✓ Six `stack/` files documenting each component with attribution
- ✓ Five `workflows/` operator playbooks with Mermaid diagrams
- ✓ Four anonymized `case-studies/` files (no real URLs leaked)
- ✓ Sanitized `configs/` for settings.json and mcp-servers.json + obsidian-integration rule
- ✓ `credits/README.md` with full attribution chain
- ✓ `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `CLAUDE.md`
- ✓ `install.sh` with `--dry-run` and `--yes`
- ✓ Issue + PR templates
- ✓ 7 good-first-issues opened
- ✓ Slap-cleanup applied across the corpus

### Active (M2)

- [ ] **Cookbook** — 10-15 practical recipes (~100-200 lines each) for real integrations the operator has shipped
- [ ] **Sanitized hooks** — 5-8 hook scripts from `~/.claude/hooks/` with per-hook README
- [ ] **Skill index** — reference table mapping ECC skill → use-case → call example, without duplicating ECC content
- [ ] **Project scaffolds** — 2-3 boilerplate templates with pre-configured `CLAUDE.md` for common shapes (Next.js + Supabase + Sentry + GA4; FastAPI + Docker + WhatsApp Cloud API; possibly Python + Whisper + yt-dlp content rig)
- [ ] **Operator profiles** — 3-5 stack variations targeted at indie hacker, freelancer, agency owner, content creator, non-technical founder
- [ ] **Credibility screenshots** — 3 image/asciinema artefacts (Obsidian vault view, Claude Code reading project note, `install.sh --dry-run` cast)
- [ ] **Public launch** — `gh repo edit --visibility public`, X thread, Show HN submission, GitHub social preview, Topics, primer message to 5-10 founders

### Out of Scope (this milestone)

- **Stub language translations (PT-BR / TR / ZH / JA full content)** — issues already open, deferred to community PRs to avoid solo-translation drift
- **Windows-native install.ps1** — issue open, defer to community PR or v1.1
- **Custom skills that duplicate ECC** — explicit anti-pattern; the stack documents ECC, it does not re-implement it
- **Marketing/growth automation** — no Twitter bots, no autoposters, no list-building scripts; launch is a one-shot human action
- **Paid components or sponsorships** — repo stays MIT and credits-first
- **AGENTS.md / CLAUDE.md style files for downstream user projects** — that's per-project work, not stack work
- **Video tutorial / course material** — separate effort, possibly own product, not stack content

## Context

**Author:** Dmitry McCarthy, AI+automotive entrepreneur in Argentina. Started writing code January 2026 via Cursor + Claude. Four months later — 7 products in various states (3 live, 4 code-complete, 1 daily-use assistant). Operator-not-engineer framing is real and lived, not marketing posture.

**Why now:** v0.2 is publishable but thin compared to the obvious comparison point (Everything Claude Code at 173K stars / 26.8K forks / ~5000 files). Going public with 43 files invites "thin repo" reaction. M2 is the depth pass that earns the launch — not by padding but by adding the parts that an operator audience actually clicks on (recipes, hooks they can copy, scaffolds they can clone, profile variants they self-identify with).

**The audience asymmetry:** ECC's audience is engineers extending Claude Code. This stack's audience is operators using Claude Code to ship products. They want different artefacts: not skill source, but skill *application*; not yet-another-agent, but the recipe for getting Stripe Connect onboarding live in one session. M2 doubles down on that asymmetry instead of trying to compete on file count.

**Risk model:** organic growth target. Goal of launch is a small, high-signal first wave (50-200 stars in week 1, 1-3 quality PRs, mindshare among solo-founder corner of X / HN). Not viral. Bigger wave only if the artefact justifies it. Slap-cleanup and operator-first tone are the moat.

## Constraints

- **Solo capacity:** all work done by one person, one focus session at a time. Phases must be 2-8 hours each. No phase that requires multi-day stamina or external coordination.
- **No skill redistribution:** never copy ECC skill content into this repo. Reference, link, document — never bundle. Same rule for Toprank, Frontend-Design, any third-party plugin.
- **Operator-first tone:** terse, opinionated, no marketing fluff, no emojis in docs. Every artefact must pass the "would an operator click this past the first paragraph" test.
- **Anonymisation:** no real URLs of the operator's private products in case studies. Patterns and lessons only. Exception: link to *this* repo and to the operator's public profiles.
- **Attribution discipline:** every new component referenced gets a `credits/` line in the same PR, not later. No exceptions.
- **No cargo cult depth:** padding the repo with files just to look bigger is forbidden. Each artefact must answer "what does this give the reader they don't have yet."
- **Sanitisation gate:** every hook, config, and example shipped must be passed through the slap pattern (no real keys, no machine-specific paths, no PII). If a file can't be sanitised, it doesn't ship.
- **Public-launch is a one-shot:** flip-to-public happens once, in the final phase, after all content is in place. No partial public flips.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Curator-toolkit shape, not a fork | Avoid maintenance burden of upstream skills; let operators install upstream and add the glue | ✓ Good — defines the differentiated niche |
| Stay private through v0.2, flip at v1.0 | Avoid showing "thin" version to public; only one first-impression | — Pending — verifies at launch |
| Defer stub language full translations to community | Solo translator drift; community PRs are higher-signal | ✓ Good — issues already open as good-first-issues |
| Cookbook before scaffolds | Recipes have lower deployment friction (markdown only) than scaffolds (multi-file boilerplate) | — Pending — review after Phase 1 |
| Screenshots phase is user-driven (manual) | Cannot automate Obsidian capture or asciinema cast from agent | ✓ Good — explicitly carved out as user phase |
| Public flip is the final phase, not first | Launch with full depth in place; no rolling reveal | — Pending — verifies at M2 close |
| No real URLs in case studies | Avoid leaking operator's private products; protect anonymity even after launch | ✓ Good — already enforced in v0.2 |

---
*Last updated: 2026-05-04 after M1 v0.2 ship and M2 milestone definition*
