# Code review — opus 4.7

**Date:** 2026-05-04
**Scope:** prose, structure, links, voice — not secrets, not TS code, not Python code.
**Files reviewed:** 76 markdown files (root + stack/ + workflows/ + case-studies/ + cookbook/ + profiles/ + scaffolds/ + configs/ + credits/ + .github/ + assets/screenshots/)

## Summary

- Files reviewed: 76 markdown files
- Findings: CRITICAL **1** · HIGH **6** · MEDIUM **6** · LOW **5**
- Verdict: **BLOCK** — one CRITICAL link points at a non-existent GitHub repo and lives in the headline cookbook recipe (`01-claude-code-from-zero.md`) where every install path starts. Fix the URL, then this becomes WARN.

The repo's voice, structure, and formatting are in genuinely good shape — first-person singular throughout, no emojis, hooks system documented consistently, code-fence language tags consistent (bash/typescript/python/javascript), all 311+ relative cross-links resolve, no broken anchors, sub-READMEs index their files. The two structural problems are: (a) one wrong upstream URL repeated across the cookbook, and (b) the front README's TOC + Status block didn't get updated when v1.0 sections were added below them.

A previous AUDIT.md from the same milestone caught most of the v0.2-vs-v1.0 staleness (the Russian/Spanish translations being stale, etc.). The remaining issues this pass surfaces are: the CRITICAL link, the `claude-sonnet-4-6` / Next.js 16 vs 15 contradictions, the `<verify before shipping>` placeholder in cookbook 11, and slop-pattern reuse across the four profiles.

---

## CRITICAL findings

### C1. `cookbook/01-claude-code-from-zero.md` clones a 404 GitHub repo

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/01-claude-code-from-zero.md` line 36 (and reference line 132)
- **Also broken in:** `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/12-content-cross-post-pipeline.md` line 154
- **Issue:** The cookbook tells the reader to run `git clone https://github.com/snubroot/Everything-Claude-Code.git ~/.claude/ECC`. That URL returns **404 Not Found** (verified via `curl`). The actual ECC repo, used everywhere else in this stack, is `https://github.com/affaan-m/everything-claude-code` (200 OK). The wrong URL is repeated in the References block of the same recipe and in cookbook 12's References.
- **Why CRITICAL:** Recipe 01 is the entrypoint cookbook recipe — it's the first one any new reader follows, it's listed first in every profile's recommended cookbook order, and its job is "install ECC." A 404 on day one burns the install path and the credibility of the cookbook simultaneously. Every other ECC reference in the repo (README, credits, stack/, profiles/, ecc-skill-index.md) uses `affaan-m/everything-claude-code` correctly. This is one drift, not a different upstream — it has to be fixed before launch.
- **Fix:**
  - cookbook/01-claude-code-from-zero.md:36 → `git clone https://github.com/affaan-m/everything-claude-code.git ~/.claude/ECC`
  - cookbook/01-claude-code-from-zero.md:132 → `[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)`
  - cookbook/12-content-cross-post-pipeline.md:154 → `[ECC \`crosspost\` skill](https://github.com/affaan-m/everything-claude-code) (browse skills directory)`
  - The marketplace command in `stack/ecc.md` line 54 (`/plugin marketplace add affaan-m/everything-claude-code`) is correct and confirms the right slug. Also re-verify the install command path actually exists in the upstream repo (`bash ~/.claude/ECC/install.sh`).

---

## HIGH findings

### H1. README.md TOC is missing 3 H2 sections that exist in the body

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md` lines 21–32 (TOC) vs lines 213–247 (body)
- **Issue:** The README body has H2 sections **Cookbook** (line 213), **Scaffolds** (line 227), and **Profiles** (line 238) — these are the three highest-leverage v1.0 additions. None of them appear in the Contents TOC at the top. A first-time visitor scanning the TOC sees the v0.2 shape (10 items) and never learns the cookbook exists from the table of contents. The previous AUDIT (H1, H2) flagged the body — these were added — but the TOC was never updated to match.
- **Fix:** Insert into TOC after `- [The Operator Playbook](#the-operator-playbook)`:
  ```
  - [Cookbook](#cookbook)
  - [Scaffolds](#scaffolds)
  - [Profiles](#profiles)
  ```

### H2. `cookbook/01` placeholder URL `https://github.com/...` in stack/frontend-design.md

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/stack/frontend-design.md` line 24
- **Issue:** *"These qualities are codified in my [`rules/web/design-quality.md`](https://github.com/...)"* — the URL is a literal `https://github.com/...` placeholder that survived past editing. It will render as a clickable broken link on github.com (lands on an invalid URL).
- **Fix:** Either point at the actual rule file in this repo (e.g. `[`configs/rules/...`](../configs/rules/web-design-quality.md)` if added), or unlink it: `These qualities are codified in my web design-quality rules — anti-template policy, banned patterns list.`

### H3. `cookbook/02`, `cookbook/06`, `cookbook/01`, `case-studies/niche-booking-trio.md` cite Next.js 16 while scaffold pins Next.js 15

- **Files:**
  - `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/01-claude-code-from-zero.md` line 94 (CLAUDE.md skeleton: `Next.js 16 (app router)`)
  - `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/02-stripe-connect-p2p.md` line 4 (`Stack: Next.js 16`)
  - `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/06-sentry-fullstack.md` line 4 (`Stack: Sentry, Next.js 16`)
  - `/Users/mccarthy606/Projects/claude-operator-stack/case-studies/niche-booking-trio.md` line 37 (`Next.js 16 (app router)`)
  - `/Users/mccarthy606/Projects/claude-operator-stack/workflows/ship-a-product-in-a-day.md` line 48 (sample prompt: `Next.js 16 app router`)
  - `/Users/mccarthy606/Projects/claude-operator-stack/stack/ecc-skill-index.md` line 29 (sample doc lookup: `Next.js 16`)
- **Conflicts with:** `/Users/mccarthy606/Projects/claude-operator-stack/scaffolds/web-saas/CLAUDE.md` line 11 — *"**Framework:** Next.js 15 (app router, server components by default). **Stay on 15** — some recipes have not yet been verified against 16."*
- **Issue:** The scaffold explicitly says "stay on 15, recipes not verified against 16," yet the recipes those scaffolds reference declare Next.js 16. A reader who copies the scaffold and then opens cookbook 02 sees a stack mismatch in the very first reference. Pick one version and propagate; the parallel typescript-reviewer also flagged that the scaffold ships with Next.js 15.
- **Fix:** Either downgrade all six places to "Next.js 15" (matches scaffold + typescript-reviewer's verified set), or upgrade the scaffold + remove the "stay on 15" warning. The first option is safer for v1.0.

### H4. cookbook/08 + scaffold cite non-existent Anthropic model `claude-sonnet-4-6`

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/08-ytdlp-whisper-research.md` line 143 (in `brief.py` prose code block: `model="claude-sonnet-4-6"`)
- **Also in:** `/Users/mccarthy606/Projects/claude-operator-stack/scaffolds/whatsapp-saas/CLAUDE.md` line 15 and `/Users/mccarthy606/Projects/claude-operator-stack/scaffolds/whatsapp-saas/README.md` line 53 (covered by python-reviewer)
- **Issue:** The cookbook prose declares a model ID that the parallel python-reviewer flagged as not a real Anthropic model. The reader copy-pasting the cookbook code block will hit a 400 `not_found_error` from the API. This is in cookbook prose (my scope) as well as in scaffold code (python-reviewer's scope). The cookbook reference makes the prose authoritatively wrong even before any code runs.
- **Fix:** Replace with a real model ID — for prose-level documentation, `claude-sonnet-4-5` (or a date-pinned variant like `claude-sonnet-4-5-20250929`) is the canonical alias — verify against `https://docs.anthropic.com/en/docs/about-claude/models` at ship time. Same fix applies to cookbook/03 line 142 (`claude-haiku-4-5` may also need verification).

### H5. cookbook/11 has a broken-grammar `<verify before shipping>` placeholder

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/11-scheduled-prompts-cron.md` line 38
- **Issue:** *"package names move and `<verify before shipping>` if your tooling reports a different identifier."* The literal placeholder `<verify before shipping>` was inserted as a TODO that needed prose around it; the surrounding sentence was never finished. The result is ungrammatical. The previous AUDIT (M6) caught the same placeholder in cookbook/08 line 185 in a context where it nearly works (`'yt-dlp>=<verify before shipping>'` reads as a literal version stub) — but here it breaks the sentence.
- **Fix:** Rewrite the line. Suggested: *"Verify the actual package name and source against the [stack/mcp-servers.md](../stack/mcp-servers.md) reference; package names move occasionally, and your tooling may report a different identifier than the one shown here."*
- Also fix cookbook/08 line 185 — replace `'yt-dlp>=<verify before shipping>'` with a real pinned version (e.g. `'yt-dlp>=2024.12.13'`) or rephrase: *"Always pin yt-dlp to a recent version (`uv add 'yt-dlp>=<your-pinned-version>'`)."*

### H6. README "What's Inside" tree omits sub-files that the reader needs

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md` lines 116–175
- **Issue:** The tree shows `configs/hooks/   ← 6 sanitized hooks + per-hook README` but does not list the consolidated `hooks.json.example` even though it's referenced from the per-hook setup pattern. Similarly, `configs/rules/` is shown as `← project-level rules` without naming any rule file (`obsidian-integration.md` is the actual content). For an operator-aimed repo, "what's actually in this directory" is the most-referenced part of the tree; it should reflect what the reader will find when they `ls` the dir.
- **Fix:** In the tree, expand:
  ```
  ├── configs/
  │   ├── settings.json.example
  │   ├── mcp-servers.json.example
  │   ├── hooks/
  │   │   ├── 6 hook scripts (.js + .sh)
  │   │   ├── per-hook README.md files
  │   │   └── hooks.json.example       ← consolidated wiring
  │   └── rules/
  │       └── obsidian-integration.md
  ```
  Or whatever shape matches the operator's preferred density.

---

## MEDIUM findings

### M1. Skill count drift — README says "60+", ecc-skill-index.md says "30", actual count is 66

- **Files:**
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.md` line 177 — *"a navigation reference into 60+ ECC skills sorted by use case"*
  - `/Users/mccarthy606/Projects/claude-operator-stack/stack/ecc-skill-index.md` line 7 — *"here are the 30 I touch in a given month"*
  - `/Users/mccarthy606/Projects/claude-operator-stack/profiles/README.md` line 3 — *"~30 indexed ECC skills"*
  - Actual skill rows in stack/ecc-skill-index.md: **66 rows**
- **Issue:** README says 60+, ecc-skill-index.md and profiles/README say 30, the file actually documents 66. Pick one anchor number — "30 the operator touches monthly" is a real stat (matches the file's prose framing); "60+" is a count of total table rows. Either is fine, but the same number should appear in both places.
- **Fix:** Either drop the "60+" claim from README.md line 177 and align with "~30 ECC skills the operator actually uses" (matches stack/README.md line 46 wording); or change the ecc-skill-index.md prose to *"~60 skills, organised in 7 categories, with the 30 I touch monthly highlighted."* Pick one; keep them in sync.

### M2. README "Status" section talks from a v0.2 perspective

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md` line 277
- **Issue:** *"Young repo. v0.2 added the hero banner, Mermaid diagrams, the 7-language nav, and full RU and ES translations. Case studies get filled in as products ship. CHANGELOG tracks the rest."* — this is the v0.2 perspective and never mentions v1.0 (cookbook, scaffolds, profiles, hooks, skill index, screenshots). The CHANGELOG correctly logs v1.0 contents; the Status section in the README does not. A reader scanning Status sees a smaller-than-actual scope.
- **Fix:** Rewrite the Status block to reflect the v1.0 candidate state. Suggested: *"Young repo. v1.0 adds the cookbook (12 recipes), scaffolds (web + WhatsApp), profiles (4 archetypes), 6 hooks, the ECC skill index, and screenshots. Earlier v0.2 added the hero banner, Mermaid diagrams, 7-language nav, and full RU/ES translations (RU/ES translations of the v1.0 additions are tracked in issue #8). Case studies get filled in as products ship. CHANGELOG tracks the rest."*

### M3. Stub READMEs (PT-BR, TR, ZH, JA) use a different positioning line than EN/ES/RU

- **Files:**
  - PT-BR: `**7 produtos · 4 meses · 0 funding · 0 time · 1 pessoa**`
  - TR: `**7 ürün · 4 ay · 0 yatırım · 0 ekip · 1 kişi**`
  - ZH: `**7 个产品 · 4 个月 · 0 融资 · 0 团队 · 1 个人**`
  - JA: `**7 プロダクト · 4 ヶ月 · 0 資金 · 0 チーム · 1 人**`
  - EN/ES/RU: `7 products in 4 months · solo · pre-revenue` (consistent across all three)
- **Issue:** The 4 stub languages all use the "0 funding · 0 team · 1 person" framing while EN/ES/RU all use "solo · pre-revenue." The "0 funding" framing appears in no other file in the repo. The translations diverged from the source on the headline tagline. Either the stubs need to be updated to match the canonical EN tagline, or the canonical tagline needs to change.
- **Fix:** Update the stubs to match EN. Example for PT-BR: `**7 produtos em 4 meses · solo · pré-receita**`. Same shape for the other 3 stubs.

### M4. `assets/screenshots/README.md` claims `obsidian-vault.png` is "TODO" but `.svg` files actually exist

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/assets/screenshots/README.md`
- **Issue:** The table at line 5–11 lists every screenshot as `TODO`, with `.png` filenames. The directory actually contains the three `.svg` files (`obsidian-vault.svg`, `claude-reads-note.svg`, `install-dryrun.svg`) which the main README references and embeds correctly. The screenshots README is stale.
- **Fix:** Update the screenshots README to:
  - List the three `.svg` files as shipped, with a brief description of what each shows.
  - Move the "How to capture" instructions to a "How to refresh / regenerate" section (since they're useful when the operator updates them).
  - Remove the `optional` line for `mermaid-stack-overview.png` if Mermaid renders natively.

### M5. Profiles all use the identical "Tuesday morning shape: ... The thing that breaks for you is ..." structural template

- **Files:** all four profiles — `indie-hacker.md` line 9, `freelancer-agency.md` line 9, `non-technical-founder.md` line 9, `content-creator-operator.md` line 9
- **Issue:** Each profile opens with the verbatim sentence-template *"The Tuesday morning shape: ... The thing that breaks for you is ..."*. The four profiles read like a Mad Lib of the same paragraph. This is structural slop — the prose is voicing the same shape 4 times so the reader registers "AI template" rather than "different audience archetypes." The previous AUDIT noted "earn its keep" reuse 6 times in profiles (L2); this is the same pattern at the opening hook level.
- **Fix:** Rewrite at least 2 of the 4 openings to break the cadence. Each profile can still open with a concrete day-shape, but the syntactic pattern should differ — e.g. one starts with the day-shape, one starts with the failure mode, one starts with what the operator wants instead. Keep one or two as the canonical form; vary the rest.

### M6. credits/README.md still missing several attribution lines (subset of prior AUDIT M2 + new gap)

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/credits/README.md`
- **Issue:** Per the previous AUDIT M2, scaffolds and cookbook reference ~12 components (Stripe, Mercado Pago, yt-dlp, Whisper, Telegram, Cloudflare, GA4, Sentry, FastAPI, etc.) that are not in `credits/README.md`. Additionally, `configs/mcp-servers.json.example` lists a `vercel` MCP server pointing at `https://mcp.vercel.com` — Vercel is referenced in the MCP config but not in the credits MCP table. The CLAUDE.md says "every component this stack uses has its original author credited" — currently breached.
- **Fix:** Either add the missing entries (Vercel + ~12 cookbook/scaffold dependencies under a new "Cookbook references" + "Scaffold dependencies" subsection), or downgrade the CLAUDE.md attribution claim to "every Claude-extension component is credited; cookbook recipes link to upstream vendor docs in the recipe itself."

---

## LOW findings

### L1. Trailing whitespace on YAML frontmatter examples

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/workflows/content-pipeline.md` lines 43–44 (`record_date: ` and `publish_date: ` both end with a single trailing space)
- **Issue:** Trailing whitespace inside a fenced YAML example. Probably an artifact of how the example was authored. Renders fine; some linters flag it.
- **Fix:** Strip trailing whitespace, or change the YAML to use `record_date: ~` (YAML null) for the placeholder shape if the reader's editor would benefit from a literal value.

### L2. `<rules>/web/design-quality.md` reference is broken/orphaned

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/stack/frontend-design.md` line 24 (also covered by H2)
- **Issue:** The line refers to `rules/web/design-quality.md` which does not exist in the public repo (it lives in the operator's private `~/.claude/rules/`). The link target is the placeholder URL caught in H2; even if the URL is fixed, the reference itself either needs to point at the `frontend-design` skill upstream or at an in-repo equivalent (none exists).
- **Fix:** Either ship `configs/rules/web-design-quality.md` based on the operator's `~/.claude/rules/web/design-quality.md` (drops the placeholder, makes the claim verifiable), or remove the link and just say "anti-template policy is enforced by the skill itself."

### L3. CHANGELOG version date is `2026-05-04 (in progress)` for both 1.0.0 and 0.1.0

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/CHANGELOG.md` lines 7, 39
- **Issue:** Both [1.0.0] and [0.1.0] are dated `2026-05-04`. The 0.1.0 entry says it shipped on the same day v1.0 is being prepped for. Implausible. Either 0.1.0 actually shipped on a different earlier date (verify via `git log --reverse | head`), or the CHANGELOG was authored in one sweep and assigned both the same date. Also, the unreleased v0.2 contents (hero banner, Mermaid, translations) are not in the CHANGELOG at all — the previous AUDIT M1 caught the same gap.
- **Fix:** Backfill v0.2 as its own entry with the correct ship date. Verify v0.1.0 actual ship date and correct it.

### L4. "earn its keep" / "earning its keep" still used 6 times in profiles (carryover from AUDIT L2)

- **Files:** `/Users/mccarthy606/Projects/claude-operator-stack/profiles/README.md` line 20, `indie-hacker.md` lines 58 and 68, `freelancer-agency.md` line 66, `non-technical-founder.md` line 62, `content-creator-operator.md` line 65
- **Issue:** Carryover from the previous AUDIT L2; not addressed. The phrase reads as a structural ritual rather than fresh prose. Combined with M5 above, the four profiles share too many template-level cadences.
- **Fix:** Rewrite at least one of the 4 "the stack has parts that do not earn their keep for this profile" headings to break the pattern (e.g. one profile uses "What this profile drops:", another "Skip these parts:", another "The components below are friction for this profile:"). Keep one or two with the canonical phrasing if the operator wants a recurring marker.

### L5. `assets/screenshots/README.md` line 55 has the "Without X. With X." antithesis pattern (carryover from AUDIT L1)

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/assets/screenshots/README.md` line 55
- **Issue:** *"Without these, the README is "trust me." With them, it's "here's the receipt.""* — flagged in prior AUDIT L1, still in place. It earns its place in this one slot, but it's the only place in the post-Wave 3 repo where this slop pattern still triggers.
- **Fix:** Optional — operator may keep it deliberately. If softening: *"These screenshots are the proof that the prose claims actually fire on a real machine."*

---

## Cross-link integrity

- Broken relative links: **0** out of 311+ (all `../foo/bar.md` / `./baz.md` / `LICENSE` / `assets/...` paths resolve).
- Broken anchors (within-file): **0 confirmed broken** — the slug-checker flagged ~30 maybes in TOCs because GitHub's anchor-slug rules don't trivially round-trip Cyrillic and accented characters; spot-checked the README anchors (#what-this-is, #the-stack, #stack, etc.) and they all resolve correctly when rendered on github.com.
- Sub-READMEs index their files: `cookbook/`, `workflows/`, `case-studies/`, `profiles/`, `stack/` all cross-list every file in their directory.
- Sampled external links: **18 sampled, 17 ok, 1 broken** — the one break is the CRITICAL `https://github.com/snubroot/Everything-Claude-Code` (404). All other GitHub upstreams (`affaan-m`, `nowork-studio`, `anthropics`, `yt-dlp`, `astral-sh`, `SYSTRAN`), vendor docs (Anthropic, Stripe, Meta, Supabase, Cloudflare, Telegram, Mercado Pago, Drizzle), and reference sites (Obsidian, Conventional Commits, Keep-a-Changelog) returned 200. The `mccarthy606/claude-operator-stack/issues/{1..8}` URLs all 404 today because the repo is still private — that's expected pre-launch but is also the launch checklist's job to confirm.

---

## Voice / slop check

Per-file slop count (only files with ≥1 slop pattern triggered):

| File | Slop pattern hits | Notes |
|---|---|---|
| `profiles/indie-hacker.md` | 4 | "Tuesday morning shape" template, "earn its keep" 2× |
| `profiles/freelancer-agency.md` | 4 | same template + "earn its keep" 1× |
| `profiles/non-technical-founder.md` | 4 | same template + "earn its keep" 1× |
| `profiles/content-creator-operator.md` | 4 | same template + "earn its keep" 1× |
| `profiles/README.md` | 1 | "earn its keep" |
| `assets/screenshots/README.md` | 1 | "Without X. With X." antithesis |
| `stack/mcp-servers.md` | 1 | "pulls its weight" |

Voice consistency: first-person singular ("I") used consistently across `case-studies/`, `workflows/`, `stack/`, `cookbook/`. Profiles use second-person ("you") deliberately for the audience-targeting hook, then first-person singular when describing the stack — that's correct profile voice. No drift to "we" anywhere except inside quoted OMEGA examples (`stack/omega-memory.md` lines 12–13), which is fine.

Overall slop count is low; the concentration is in the four profiles, all sharing one structural template. Fixing M5 + L4 addresses 90% of the remaining slop in the repo.

---

## Headline observations

If the operator only fixes 5 things before flipping public:

1. **C1** — fix the `snubroot/Everything-Claude-Code` URL in cookbook/01 and cookbook/12. 5 minutes. Recipe 01 is the launch entrypoint; this 404 will burn the install path and the credibility of the cookbook. It's the only **block-the-flip** finding.

2. **H1** — add Cookbook + Scaffolds + Profiles to the README TOC. 2 minutes. The body has the sections; the TOC at line 21 doesn't surface them. The single highest-leverage launch artifact (cookbook) is currently invisible from the table of contents.

3. **H3** — pick a Next.js version and propagate it. The scaffold says "stay on 15," cookbook 02/06 say "Next.js 16." A reader copying the scaffold and the recipe sees a contradiction in the first hour. 10 minutes if going with Next.js 15.

4. **H4** — replace `claude-sonnet-4-6` in cookbook/08 with `claude-sonnet-4-5` (or whatever Anthropic's current alias is). 2 minutes. Cross-checks with the parallel python-reviewer's CRITICAL finding on the same model ID in the scaffold.

5. **H2 + H5** — the literal placeholder `https://github.com/...` in stack/frontend-design.md and the `<verify before shipping>` in cookbook/11 line 38 are both unfinished-prose artifacts that read as "this doc was never finalised." 5 minutes total.

Fixing those 5 takes ~25 minutes and converts the verdict from BLOCK to GO. The remaining MEDIUM/LOW findings can ship as v1.1 / post-launch issues.
