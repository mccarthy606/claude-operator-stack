# Changelog

All notable changes to the Claude Operator Stack will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The stack uses calendar-versioning aligned with major iterations, not strict semver.

## [1.0.0] — 2026-05-04 (in progress, awaiting public flip)

### Added

- **cookbook/** — 12 copy-pasteable recipes from real shipped products (Stripe Connect, WhatsApp Cloud API, Cloudflare Tunnel, GA4 + CF analytics, Sentry full-stack, Supabase + Vercel pooling, yt-dlp + Whisper, Telegram lead capture, Mercado Pago, scheduled prompts, content cross-post pipeline, Claude Code from zero). Each ≤200 lines.
- **configs/hooks/** — 6 sanitized hooks with per-hook README: statusline, prompt-injection-guard, read-before-edit, validate-commit-message, read-injection-scanner, context-monitor. Plus `hooks.json.example` with consolidated wiring.
- **stack/ecc-skill-index.md** — navigation reference into 60+ ECC skills sorted by use case (building, marketing, research, GSD, solo ops, security, memory).
- **scaffolds/** — two runnable starting points:
  - `web-saas/` (24 files): Next.js 15 + Supabase + Sentry + GA4 with real lead form + `/api/lead` route.
  - `whatsapp-saas/` (18 files): FastAPI + Docker + Meta Cloud API + Anthropic SDK with HMAC verification, classifier, happy-path pytest.
- **profiles/** — 4 archetype install paths (indie hacker, non-technical founder, freelancer/agency, content creator + operator). Each picks recipes, hooks, scaffold, workflow read order, and what to skip.
- **assets/screenshots/** — three SVG visualisations: install dry-run, Obsidian project note, Claude Code session reading the note. Embedded in README under Quick Start and Workflow #3.
- **README.md** — added Cookbook / Scaffolds / Profiles sections; updated "What's Inside" tree to show new directories; embedded screenshots; updated "Currently looking for" with translation sync issue.
- **.planning/** — PROJECT.md + ROADMAP for M2 v1.0 (10-phase plan), AUDIT.md from pre-launch sweep, launch-surfaces/ (X thread, Show HN body, founder DMs, GitHub meta, launch checklist).

### Process notes

Built in 5 waves with parallel opus-4.7 1M-context subagents:
- Wave 1 (parallel): cookbook + hooks + skill index
- Wave 2: scaffolds
- Wave 3: profiles
- Wave 4: pre-launch audit (verdict WARN, all HIGH findings addressed)
- Wave 5: README updates + screenshots + launch surfaces

Pre-launch audit found 0 CRITICAL issues (no secrets, no broken links, no real product names leaked).

### Pending before public flip

- Operator review of all v1.0 additions
- Operator picks X-thread variant + Show HN title from drafts
- Public flip itself (Phase 9 of ROADMAP — explicit operator action)

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
