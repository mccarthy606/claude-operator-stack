# Pre-launch audit — M2 v1.0

**Auditor:** opus 4.7 (subagent)
**Date:** 2026-05-05
**Scope:** entire repo as of HEAD (cbf44b4) before Phase 6.

## Summary

- Files audited: 117 total (68 markdown, 49 non-md)
- Issues found: 14 (CRITICAL: 0 · HIGH: 4 · MEDIUM: 6 · LOW: 4)
- Issues fixed in place: 1 (one casing typo in main README)
- Issues remaining: 13
- **Verdict: WARN**

No CRITICAL findings — there are no real secrets leaked, no operator domain leaks, no real customer names, no PII, no broken relative links, no broken anchors. The repo is safe to flip public from a sanitisation standpoint.

The HIGH findings are about "the launch undersells what shipped": the README's "What's Inside" tree and "Operator Playbook" sections still describe the v0.2 shape and don't surface cookbook/, scaffolds/, profiles/, hooks/, or the skill index. A first-time visitor won't find the densest content. None of this blocks the flip; all of it shrinks the launch.

---

## CRITICAL — would burn the public flip

None.

---

## HIGH — should fix before launch

### H1. Main `README.md` "What's Inside" tree is stale (Wave 1-3 content not surfaced)

**File:** `README.md` lines 110-151
**What:** The tree shows `stack/`, `workflows/`, `case-studies/`, `profiles/` (one line, no detail), `scaffolds/` (one line, no detail), `configs/`, `credits/`. It does **not** show:
- `cookbook/` (12 recipes added in Wave 1)
- `stack/ecc-skill-index.md` (added in Wave 1)
- The 4 profile files inside `profiles/`
- The 6 hook scripts and their READMEs inside `configs/hooks/`

A first-time visitor scanning the README will not learn the cookbook exists. That's the single highest-converting artefact and the README hides it.

**Why HIGH not MEDIUM:** the cookbook is the "random artefact pull" specified by the roadmap as the #1 launch lever. If the README doesn't introduce it, the launch loses its sharpest hook.

**Why not fix in place:** this is a content/emphasis decision (how prominently each new section appears, exact wording for the playbook section). Operator should make the call.

### H2. Main `README.md` "Operator Playbook" only lists 5 workflows, no cookbook section

**File:** `README.md` lines 155-173
**What:** The "Operator Playbook" still says "Five workflows that run my week" and links the 5 workflow files. There is no parallel section for the 12 cookbook recipes, the 4 profiles, or the 2 scaffolds.

After Waves 1-3 the operator playbook is no longer five workflows — it's now five workflows + twelve recipes + four profiles + two scaffolds + an index of ECC skills. The README still claims the smaller scope.

**Suggested fix shape (operator decides):** add a "Cookbook" section after the playbook (3-4 lines, link to `cookbook/README.md`), add a "Pick your profile" section (4 lines, link to `profiles/README.md`), add a "Scaffolds" line under What's Inside.

### H3. Translated READMEs (RU, ES, PT-BR, TR, ZH, JA) all out of sync with main README

**Files:** `README.ru.md`, `README.es.md`, `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`
**What:** The full RU and ES translations also describe only v0.2 (5 workflows, no cookbook, no skill index, no scaffolds, no profiles, no hooks). The 4 stub translations (PT-BR, TR, ZH, JA) point at the English README and don't need to change yet, but the Russian and Spanish ones are full mirrors and now significantly stale relative to the codebase.

**Why HIGH:** RU and ES are advertised as "full translations" in the README. A reader in either language sees an incomplete repo that doesn't match the English version's actual surface. Either update both or downgrade the badge to "partial".

**Why not fix in place:** translation requires the operator's voice judgement.

### H4. Phase 2 deliverable missing: `configs/hooks/hooks.json.example`

**File:** does not exist; should exist per `ROADMAP.md` Phase 2 success criterion #5
**What:** Phase 2 explicitly required: *"Operator's actual `hooks.json` is sanitised and published at `configs/hooks/hooks.json.example`"*. The 6 hook scripts and their per-hook READMEs shipped, but there is no consolidated wiring file. A reader has to assemble the `settings.json` `hooks: {}` block by hand from 6 separate per-hook READMEs.

**Why HIGH:** the brief said "Each hook's `hooks.json` registration snippet is included so a reader can wire it up" (criterion #4) — those individual snippets do exist in the per-hook READMEs, but the consolidated example does not. This is the difference between "copy these 6 blocks one by one and stitch them" and "copy this one file." For an operator-aimed repo, the consolidated file is the better deliverable.

---

## MEDIUM — nice to fix

### M1. `CHANGELOG.md` only contains v0.1.0 entry

**File:** `CHANGELOG.md`
**What:** The CHANGELOG lists only the v0.1.0 release. It does not mention:
- v0.2 (hero banner, Mermaid, 7-language nav, RU/ES translations) — shipped per `git log` commit `c7d86cc`
- v1.0 work in progress (Waves 1-3: cookbook, hooks, skill index, scaffolds, profiles)

Phase 6 success criterion #5 was *"CHANGELOG has a complete unreleased section listing every Phase 1-5 deliverable"* — this is currently empty.

**Why MEDIUM not HIGH:** the launch reader doesn't usually open the CHANGELOG first; they read the README. But anyone returning later (or anyone porting the stack) will be confused.

### M2. `credits/README.md` missing attribution for ~12 components used in scaffolds and cookbook

**File:** `credits/README.md`
**What:** The credits page covers the 6 stack layers and 13 MCP servers from the example config. After Wave 1-3, the repo also actively uses:

In scaffolds (`scaffolds/web-saas/package.json`, `scaffolds/whatsapp-saas/pyproject.toml`):
- Next.js (Vercel)
- React (Meta)
- `@sentry/nextjs`, `sentry-sdk[fastapi]` (Sentry)
- `@supabase/supabase-js`, `supabase` (Supabase) — currently only the MCP server is credited
- FastAPI (Sebastián Ramírez)
- uvicorn (encode)
- httpx (encode)
- pydantic, pydantic-settings (Samuel Colvin)
- anthropic SDK (Anthropic) — partially credited via Claude Code
- pytest, pytest-asyncio, respx, ruff (dev deps)
- Docker / Docker Compose (Docker Inc.)

In cookbook (clearly named libraries/services):
- Stripe (Stripe Inc.) — recipe 02
- Mercado Pago (Mercado Libre) — recipe 10
- yt-dlp (yt-dlp team) — recipe 08
- OpenAI Whisper (OpenAI) — recipe 08
- Telegram Bot API (Telegram) — recipe 09
- Cloudflare (Cloudflare) — recipes 04, 05
- Google Analytics (Google) — recipe 05

**Why MEDIUM:** Phase 6 success criterion #2 was *"Every component referenced in any new file has a `credits/README.md` entry"* — currently missing for all of the above. None of these is a copyright violation; all are legitimate uses with public docs and SDKs. But the repo's stated attribution discipline ("every component this stack uses has its original author credited" — `CLAUDE.md` line 16) is breached.

**Why not fix in place:** ~12 entries to add, each requires a deliberate categorisation (where in credits/README.md does each go? Add a "Scaffold dependencies" section? "Cookbook references"?). Operator's call on structure.

### M3. `configs/mcp-servers.json.example` references `mcp.vercel.com` but Vercel not in credits

**File:** `configs/mcp-servers.json.example` line 27
**What:** The example config includes a `vercel` MCP server (`url: https://mcp.vercel.com`). Vercel is not listed in the MCP table in `credits/README.md`.

Subsumes M2 but worth its own line so the operator notices when patching.

### M4. `SECURITY.md` directs reporters to email "the maintainer (handle in the LICENSE / README)" but no email is exposed

**File:** `SECURITY.md` line 7
**What:** The fallback path for security disclosure is "email the maintainer" but neither `LICENSE` nor any README exposes an email address. Only `@mccarthy606` GitHub handle is published. A reporter with no GitHub Security Advisories access has no way to email.

**Suggested fix:** either (a) add a security email to the LICENSE/README, or (b) reword SECURITY.md to point only to GitHub Security Advisories with no fallback.

### M5. `install.sh` creates `~/.claude/hooks/` but never populates it

**File:** `install.sh` line 111
**What:** Wave 2 added 6 hook scripts under `configs/hooks/`. The installer's Step 3/4 creates `~/.claude/hooks/` directory but never copies any hook script into it. A user running `./install.sh` ends up with the directory and no hooks. Per the per-hook READMEs they're expected to copy hooks manually. Either:
- (a) Document this explicitly in the post-install message ("hooks are intentional opt-in; copy from `configs/hooks/` manually after auditing each one"), or
- (b) Add an interactive "install which hooks?" prompt, or
- (c) Remove the empty directory creation since nothing populates it.

The current shape ships an empty directory which is mildly confusing.

### M6. `cookbook/08-ytdlp-whisper-research.md` line 185 has a literal placeholder

**File:** `cookbook/08-ytdlp-whisper-research.md` line 185
**What:** `uv add 'yt-dlp>=<verify before shipping>'` — the `<verify before shipping>` is a placeholder that survived past the slap-pass. Either pin to a known-good version (`>=2024.12.13` or whatever the operator actually uses) or rephrase to remove the placeholder shape.

---

## LOW — note for later

### L1. `assets/screenshots/README.md` line 55 has one antithesis pattern

**File:** `assets/screenshots/README.md` line 55
**What:** *"Without these, the README is "trust me." With them, it's "here's the receipt.""* — that's the "Without X. With X." antithesis pattern flagged in Phase 6 voice rules. It's a single instance and arguably earns its place (the line lands), but it's the one place in the post-Wave 3 repo where a slop pattern still triggers.

### L2. `profiles/*` uses "earn its keep" / "earning its keep" 6 times

**Files:** `profiles/README.md` line 20, `profiles/indie-hacker.md` lines 58 and 68, `profiles/freelancer-agency.md` line 66, `profiles/non-technical-founder.md` line 62, `profiles/content-creator-operator.md` line 65
**What:** "earn its keep" is on the slop-pattern list. It's used as a structural heading-equivalent in 4 of the profiles ("the stack has parts that do not earn their keep for this profile") so it reads as deliberate rather than accidental flourish, but it's the same idiom 6 times. Consider rewriting at least one to break the cadence.

### L3. README.md line 13 includes a self-claim ("pre-revenue")

**File:** `README.md` line 13
**What:** *"7 products in 4 months · solo · pre-revenue"* — the "pre-revenue" qualifier is honest but draws extra attention to the lack of revenue, which is the question some readers will care about. Operator may want to consider whether this framing helps or undermines the launch positioning. (Not a defect, just worth a beat of thought.)

### L4. `README.es.md` and `README.ru.md` headings use "Stack" / "Стек" but TOC anchors mix language and English

**Files:** `README.es.md`, `README.ru.md`
**What:** Anchor slugs in mixed-language headings sometimes get inconsistent (e.g. `#operator-playbook` vs `#operator-playbook` — the Russian RU keeps `#operator-playbook` in English while the heading is "Operator Playbook"). All anchors resolve (verified by anchor checker), so this is cosmetic. Worth a sweep when the RU/ES translations get refreshed for v1.0.

---

## Fixed in place by audit pass

1. `README.md` line 73 — `Whatsapp Cloud API` → `WhatsApp Cloud API` (consistent capitalisation; matches translated READMEs and project naming)

That's the only edit. Everything else surfaced as findings because every other issue is a content/emphasis decision the operator should own.

---

## Stats

- Total markdown files: 68
- Total markdown lines: 6,013
- Total non-md files: 49
- Sanitisation grep: **clean** (0 hits for operator product names, personal names, real handles, real phone numbers, API key fragments)
- Broken relative links: **0 / 311** (all relative links resolve)
- Broken markdown anchors: **0** (3 false positives for inert `(#)` badge anchors, all valid as no-op convention)
- Broken external links sampled: **0 / 10** (sampled GitHub upstreams, Obsidian, Anthropic docs, arXiv, Telegram BotFather, Asciinema, Keep-a-Changelog; one expected 401 on `mcp.vercel.com` which is a config example, not a link)
- Attribution gaps: **~12 components** (see M2)

---

## Notes on launch readiness

If the operator only has time to fix two things before flipping:

1. **README "What's Inside" + a "Cookbook" section** (HIGH 1 + 2). 30-45 minutes. Highest leverage on launch conversion.
2. **`configs/hooks/hooks.json.example`** (HIGH 4). 15 minutes. Removes the most friction from the hook-curious reader.

Everything else can ship after launch and is not user-visible damage.
