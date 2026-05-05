# Changelog

All notable changes to the Claude Operator Stack will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The stack uses calendar-versioning aligned with major iterations, not strict semver.

## [Unreleased]

### Added

- **skills/** — 6 original `SKILL.md` packages targeting solo-founder use-cases ECC's catalog doesn't cover: `solo-billing-monitor`, `multi-project-context-bridge`, `obsidian-sync-helper`, `case-study-anonymiser`, `weekly-monday-review`, `ship-day-planner`. Each is an invocable prompt for Claude (not a how-to doc), 80-95 lines, with `origin: claude-operator-stack` frontmatter, leaning on existing `workflows/`, `cookbook/`, `stack/`, and `case-studies/` files. README integration deferred to a coordinated post-wave-8 pass — see `.planning/phases/P8.4-own-skills/INTEGRATION.md`.
- **packages/cli/** — npm CLI package `claude-operator-stack` with three commands (`init`, `verify`, `list-stack`). Built and locally runnable; not yet published. Sibling to `install.sh`; same target files, same sidecar safety, different ergonomics. Pinned at `0.1.0`; publish coordinates with the public visibility flip in Phase 9.
- **commands/** — 6 operator slash-commands wrapping the own skills as one-keystroke verbs in Claude Code's slash-picker: `/solo-monday-review`, `/anonymise-case-study`, `/ship-day`, `/cost-rollup`, `/bridge-context`, `/sync-brain`. Each parses operator-friendly args, applies sensible defaults, and delegates to its wrapped skill. Names checked against ECC's 67-command catalog — zero collisions. Indexed by `commands/README.md`.
- **docs/** — long-form guides directory. Two extractions from README (`comparing-stacks.md`, `whats-inside.md`) plus two new pieces (`v1-changelog-deep-dive.md` — narrative version of the CHANGELOG; `why-only-claude-code.md` — rationale for the single-harness choice). Indexed by `docs/README.md`. Shrinks README by ~85 lines on the mechanical delta.
- **tests/** — E2E integration suite at the repo root. Bash test for `install.sh` HOME-safety plus three vitest suites for the CLI (`init`, `verify`, `list-stack`). Run with `npm run test:integration`; isolation guaranteed via per-test `mkdtempSync` / `mktemp -d`. Documented in `tests/README.md`.

### Changed

- Replaced static hero with animated SVG (P8.1)
- Replaced OMEGA Memory with `graphify` knowledge-graph layer across the stack
- Renamed `stack/omega-memory.md` → `stack/graphify.md`
- Updated stack table, all 7 READMEs, configs, profiles, skills, workflows, credits to reference graphify
- Added `Graphify/`, `Weekly/`, `graphify-out/` to documented Brain vault structure
- Reframed stack as 4 core components (Claude Code, Obsidian, graphify, Frontend-Design) + 2 opt-in extensions (Everything Claude Code, Toprank). Updated stack tables in all 7 READMEs, stack/README, ecc.md, toprank.md status sections, profile install tables, cookbook 01 install steps, configs/settings.json.example, install.sh wizard messaging.

## [1.0.0] — 2026-05-05

### Added

- **cookbook/** — 12 copy-pasteable recipes from real shipped products (Stripe Connect, WhatsApp Cloud API, Cloudflare Tunnel, GA4 + CF analytics, Sentry full-stack, Supabase + Vercel pooling, yt-dlp + Whisper, Telegram lead capture, Mercado Pago, scheduled prompts, content cross-post pipeline, Claude Code from zero). Each ≤200 lines.
- **configs/hooks/** — 6 sanitized hooks with per-hook README: statusline, prompt-injection-guard, read-before-edit, validate-commit-message, read-injection-scanner, context-monitor. Plus `hooks.json.example` with consolidated wiring.
- **stack/ecc-skill-index.md** — navigation reference into the 30 monthly-driver ECC skills (plus 36 occasional-use entries) sorted by use case (building, marketing, research, GSD, solo ops, security, memory).
- **scaffolds/** — two runnable starting points:
  - `web-saas/` (24 files): Next.js 15 + Supabase + Sentry + GA4 with real lead form + `/api/lead` route.
  - `whatsapp-saas/` (18 files): FastAPI + Docker + Meta Cloud API + Anthropic SDK with HMAC verification, classifier, happy-path pytest.
- **profiles/** — 4 archetype install paths (indie hacker, non-technical founder, freelancer/agency, content creator + operator). Each picks recipes, hooks, scaffold, workflow read order, and what to skip.
- **assets/screenshots/** — three SVG visualisations: install dry-run, Obsidian project note, Claude Code session reading the note. Embedded in README under Quick Start and Workflow #3.
- **README.md** — added Cookbook / Scaffolds / Profiles sections; updated "What's Inside" tree to show new directories; embedded screenshots; updated "Currently looking for" with translation sync issue.
- **credits/README.md** — extended with cookbook references and scaffold dependencies (Next.js, React, Sentry, Supabase, FastAPI, Anthropic SDK, Docker, Stripe, Mercado Pago, yt-dlp, Whisper, Telegram, Cloudflare, Google Analytics, Vercel MCP).
- **.planning/** — PROJECT.md + ROADMAP for M2 v1.0 (10-phase plan), AUDIT.md from pre-launch sweep, launch-surfaces/ (X thread, Show HN body, founder DMs, GitHub meta, launch checklist).

### Fixed

- Full fix-wave (commit `368abb2`) closed all CRITICAL and HIGH findings from 4 parallel reviews — security hardening across cookbook recipes, hook scripts, scaffold sanitization, and case-study redactions.

### Process notes

Built in 5 waves with parallel opus-4.7 1M-context subagents:
- Wave 1 (parallel): cookbook + hooks + skill index
- Wave 2: scaffolds
- Wave 3: profiles
- Wave 4: pre-launch audit (verdict WARN, all HIGH findings addressed)
- Wave 5: README updates + screenshots + launch surfaces
- Fix-wave: post-review CRITICAL + HIGH closeouts

Pre-launch audit found 0 CRITICAL issues (no secrets, no broken links, no real product names leaked).

## [0.2.0] — 2026-05-04

### Added

- **assets/hero.svg** — visual identity hero banner used at the top of every README variant.
- **Mermaid diagrams** — stack-overview and workflow diagrams that render natively on github.com.
- **7-language navigation** — language switcher in every README (English, Русский, Español, Português (BR), Türkçe, 中文, 日本語).
- **README.ru.md** — full Russian translation.
- **README.es.md** — full Spanish translation.
- **README.pt-br.md, README.tr.md, README.zh.md, README.ja.md** — stub translations linking back to the English source while contributors translate the full bodies.

### Notes on this release

The visual identity and language nav land before the v1.0 content additions, so translators can target a stable surface. Stub language READMEs are tracked as open `good first issue`s in GitHub.

## [0.1.0] — 2026-05-04

### Added

- **README.md** — public framing, stack table, 7-products-in-4-months hook, install path
- **install.sh** — non-destructive installer with `--dry-run` and `--yes` flags. Copies sanitized configs as sidecars (`*.from-operator-stack`) so existing user configs are not silently overwritten
- **stack/** — six-component breakdown with attribution: ECC, Toprank, Frontend-Design, Obsidian, OMEGA Memory, MCP servers
- **workflows/** — five operator playbooks: ship-a-product-in-a-day, parallel-projects, obsidian-as-context, content-pipeline, solo-ops
- **case-studies/** — four real-product case studies with anonymized URLs: Niche Booking Trio (3 sites), AI Legal Tool, WhatsApp B2B SaaS, YouTube production pipeline
- **configs/** — sanitized examples for `settings.json` and `mcp-servers.json`, plus the `obsidian-integration` rule
- **credits/README.md** — full attribution chain back to original authors of every component
- **CONTRIBUTING.md** — what's in scope, what's out, how to PR
- **SECURITY.md** — private vulnerability disclosure policy
- **CLAUDE.md** — repo-internal Claude config (voice, tone, attribution discipline)
- **LICENSE** — MIT
- **.gitignore** — secrets, machine-state files, vault paths

### Notes on this release

Initial public release. The stack is small and opinionated by design. Future releases will:

- Add Windows-native installer (`install.ps1`)
- Add Russian translation of the README
- Expand case studies as more products ship
- Add a `quickstart/` directory with scaffolds for common new-project shapes
