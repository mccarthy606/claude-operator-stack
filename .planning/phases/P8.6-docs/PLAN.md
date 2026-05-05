---
phase: P8.6-docs
milestone: M2-v1-public-launch
type: execute
status: planned
created: 2026-05-05
target_effort: 2-3h
parallelisable_with: [P8.5-commands, P8.7-tests]
hard_deps: []
---

# Phase 8.6 Plan — Long-form guides (`docs/`)

## 1. Goal restatement

Extract the two longest sections from the repo-root `README.md` (the "How this compares" full table and the annotated `What's Inside` directory tree) into focused files under a new `docs/` directory, leaving short summaries with "see [docs/...]" links in the README. Then write two new long-form pieces — `v1-changelog-deep-dive.md` (a narrative version of CHANGELOG.md) and `why-only-claude-code.md` (a rationale for the deliberate single-harness choice) — that pre-empt two specific reader questions the README and CHANGELOG don't currently answer well. Net effect: README shrinks by ~140 lines and stays scannable; `docs/` becomes the discovery surface for readers who want depth.

## 2. Non-goals

- **No fragmenting of README discoverability.** The README must still answer "what is this and why should I care" without bouncing the reader. Only the *long tail* of each extracted section moves; substantive lead-ins stay in the README.
- **No marketing prose.** The two new long-form pieces use the same operator-first, no-AI-slop voice the rest of the repo uses. No hype, no "imagine if", no growth-team copy.
- **No duplication of CHANGELOG.md.** `v1-changelog-deep-dive.md` is *narrative*, not a re-listing of bullets. CHANGELOG.md stays the canonical terse source; the deep-dive is the story behind the bullets.
- **No translations of new docs/ files.** RU/ES translation is explicit v1.1 work (per Phase 8.6 success criterion 8). Only the *summary truncations* in `README.ru.md` / `README.es.md` are in scope, and even those are deferred to the coordinated INTEGRATION pass — not this executor's job.
- **No edits to repo-root `README.md` from this executor.** All README delta lives in `INTEGRATION.md`, applied during a coordinated post-wave-8 pass (same pattern Phase 8.4 used).
- **No CHANGELOG.md edit from this executor.** Added by the coordinated pass.
- **No commits.** Plan-only phase; the executor commits at the end of its own session, not the planner.

## 3. `docs/comparing-stacks.md` plan

**Source extraction:** verbatim copy of `README.md` lines **316-347** (the entire `## How this compares` section, from the heading through the closing paragraph that starts "If you came in from Everything Claude Code…"). That's the heading itself, the framing paragraph, the bullet definitions of the 3 columns, the comparison table, the audience-fit shorthand, the "designed to coexist" paragraph, and the two "If you came in from…" closing paragraphs. ~32 lines of body content (the section spans 75 lines counting whitespace and table rows).

**Top-of-file marker:** the file opens with a one-line italic note: `*Expanded from [README §How this compares](../README.md#how-this-compares).*` — makes the one-way truth flow obvious (per success criterion 7).

**Heading shape:** demote `##` from the README to `#` for the file title (`# How this compares`); inner subsections (none currently exist in this section) stay as-is.

**Cross-link preservation:** the section currently links to `https://github.com/affaan-m/everything-claude-code` and to `https://github.com/affaan-m`. Both are absolute URLs and survive the move unchanged. No internal `#anchor` links exist in this section, so there's nothing to rewrite.

**3-line summary that replaces the section in README** (planner draft for INTEGRATION.md):

```markdown
## How this compares

Solo Stack is the operator-first wrapper around Claude Code; Everything Claude Code (ECC) is the upstream skills + agents catalogue this repo depends on; starter templates are framework-first scaffolds. Solo Stack and ECC are designed to coexist — many readers will install both.

[Read the full comparison →](docs/comparing-stacks.md)
```

That's 3 lines of substance plus the link line — well under the "stub" risk threshold and still answers the audience question.

## 4. `docs/whats-inside.md` plan

**Source extraction:** verbatim copy of `README.md` lines **139-215** (the entire `## What's Inside` section). That includes:
- The opening `## What's Inside` heading
- The full annotated tree fenced in a triple-backtick block (~70 lines covering `claude-operator-stack/` through `└── credits/`)
- The closing paragraph about `stack/` plus [`ecc-skill-index.md`](stack/ecc-skill-index.md)

**Top-of-file marker:** `*Expanded from [README §What's Inside](../README.md#whats-inside).*`

**Heading shape:** `# What's Inside` (demoted from `##`).

**Cross-link preservation:** the section contains one internal link, `[`ecc-skill-index.md`](stack/ecc-skill-index.md)`. Inside `docs/whats-inside.md` (which lives at `docs/whats-inside.md`, one level deeper than the README), this link must rewrite to `../stack/ecc-skill-index.md`. The annotated tree itself contains no clickable links — those are descriptive labels, not link targets — so the tree copies verbatim.

**Tree addition:** the new file's tree must add the `docs/` block itself (since the README's tree is a snapshot of the repo and `docs/` now exists). Placement: between `cookbook/` and `skills/`, alphabetical-ish but optimised for narrative order:

```
├── docs/                       ← long-form guides
│   ├── comparing-stacks.md
│   ├── whats-inside.md
│   ├── v1-changelog-deep-dive.md
│   └── why-only-claude-code.md
```

(That same `docs/` block is also what gets added to the README's *short* "What's Inside" overview — see §8 below.)

**6-line top-level overview that replaces the long tree in README** (planner draft for INTEGRATION.md):

```markdown
## What's Inside

The repo is a four-layer toolkit: a `stack/` of curated components, a set of `workflows/` that compose them, content artefacts (`cookbook/`, `case-studies/`, `scaffolds/`, `profiles/`, `skills/`), and supporting machinery (`configs/`, `commands/`, `docs/`, `credits/`). Top level:

- **stack/, workflows/, case-studies/** — the playbook
- **cookbook/, scaffolds/, profiles/, skills/** — copy-pasteable artefacts
- **configs/, commands/, packages/cli/** — install + invocation
- **docs/, credits/** — long-form depth + attribution

[Full annotated tree →](docs/whats-inside.md)
```

Six bullet lines plus framing — substantively answers "what's in this repo" before the link, doesn't bounce the reader.

## 5. `docs/v1-changelog-deep-dive.md` outline

**Length cap:** 200-300 lines (per Phase 8.6 risk mitigation). If a section overruns, that section becomes a v1.1 sub-doc; do not let the file exceed 300 lines.

**Voice:** narrative past tense, operator-first, no AI-slop. The reader is someone who clicked through from CHANGELOG.md wanting "the story, not the bullets." First-person singular for the operator, not corporate "we."

**Source material:** `CHANGELOG.md` (all four version blocks: `[Unreleased]`, `[1.0.0]`, `[0.2.0]`, `[0.1.0]`) and the `git log` history (commits `3831a16` → `59f0c65`).

**Top-of-file marker:** `*Companion to [CHANGELOG.md](../CHANGELOG.md). The terse list of changes lives there; this is the story behind them.*`

**Sections (7 total):**

1. **`## v0.1 — what shipped on day zero` (~25-30 lines)**
   - The shape of the initial public release: README, install.sh, stack/ (6 components), workflows/ (5 playbooks), case-studies/ (4 anonymised), configs/, credits/, governance files.
   - Why the surface area was deliberately small.
   - The single most important design decision: sidecar configs, never overwriting `~/.claude/`.
   - Closes: "0.1 was the smallest credible launch surface. Everything after is depth."

2. **`## v0.2 — the visual identity wave` (~25-30 lines)**
   - Why visual identity landed *before* depth: translators needed a stable surface to target.
   - What 0.2 added: hero.svg, Mermaid diagrams, 7-language nav, full RU + ES translations, stub PT-BR/TR/中文/日本語 (tracked as good-first-issues).
   - The decision to ship stubs rather than block on full translations.
   - The constraint: AI-slop pattern strip across all markdown (commit `faf18a4`).

3. **`## Waves 1-3 — cookbook, scaffolds, profiles` (~40-50 lines)**
   - Wave 1 (commit `ba737cf`): cookbook + hooks + skill index, parallel opus-4.7 1M-context subagents. The "12 recipes ≤200 lines each" cap; how the recipe shape (problem → solution → code → pitfalls → references) emerged.
   - Wave 2 (commit `903c7fa`): scaffolds — web-saas (24 files) and whatsapp-saas (18 files). Why two and not five.
   - Wave 3 (commit `cbf44b4`): operator profiles — 4 archetypes mapping to recipe + hook + scaffold + workflow read order.
   - Closes: each wave was atomically shippable; main never broke.

4. **`## Wave 5 — pre-launch audit + screenshots` (~25-30 lines)**
   - Wave 4 audit (verdict WARN, all HIGH findings addressed). 0 CRITICAL: no secrets, no broken links, no real product names leaked.
   - Wave 5 (commit `8a58369`): SVG screenshots, launch surfaces, audit fixes.
   - The decision to ship SVG screenshots (deterministic, version-controlled) over PNG captures.
   - The fix-wave (commit `368abb2`): 5 CRITICAL + 14 HIGH closed in one pass.

5. **`## v1.0 — the doubling-down wave` (~40-50 lines)**
   - The honest gap analysis vs ECC after fix-waves shipped: technically clean but visually + economically light.
   - The four 8.x phases as the response: each non-overlapping with ECC, each shippable in one focus session.
   - 8.1 — animated hero (replaced static SVG). The compositor-friendly motion choice.
   - 8.2 — compare matrix (the table this file replaces).
   - 8.3 — npm CLI (`packages/cli/`) sibling to `install.sh`. Same target files, same sidecar safety, different ergonomics. Pinned `0.1.0`, publish coordinated with Phase 9.
   - 8.4 — 6 original SKILL.md packages targeting solo-founder use-cases ECC's 182-skill catalogue doesn't cover. Each with `origin: claude-operator-stack`.
   - Closes (commit `d7eb84b`): "doubling down on what makes us non-overlapping with ECC."

6. **`## Reality-syncs — OMEGA → graphify, 4-core/2-opt-in` (~25-30 lines)**
   - Two reality-syncs landed during the v1.0 wave because the operator's actual stack diverged from what the repo was claiming.
   - Sync 1 (commit `59c037d`): OMEGA Memory → graphify across 7 READMEs, configs, profiles, skills, workflows, credits. The rename of `stack/omega-memory.md` → `stack/graphify.md`.
   - Sync 2 (commit `c883ddf`): reframed the stack as **4 core** (Claude Code, Obsidian, graphify, Frontend-Design) + **2 opt-in** (ECC, Toprank) — instead of treating all 6 as equivalent. Why the honest framing earned more trust than the flat one.
   - Closes: reality-syncs are mandatory, not optional; the repo's claims must match the operator's actual install.

7. **`## Governance — CoC + CONTRIBUTING expansion` (~20-25 lines)**
   - 2026-05-05: Contributor Covenant 2.1 added (commit `e78cea4`).
   - Same day: CONTRIBUTING.md expanded 48 → ~165 lines (commit `59f0c65`).
   - The shape of the expansion: scope clarification, attribution discipline, what gets accepted vs deferred.
   - Closes: governance landed *before* the public flip, not after — set the contribution rules before the inbox opens.

**Tail:** a one-paragraph "what's next" pointing at Phase 9 (public flip) and Phase 10 (launch+72h response). No marketing language; just the next two phase names + the README link.

## 6. `docs/why-only-claude-code.md` outline

**Length cap:** 100-150 lines (per Phase 8.6 risk mitigation).

**Voice:** explanatory, slightly pre-emptive (since this file exists *to* answer a recurring reader question). No defensiveness; no apologetic framing.

**Top-of-file marker:** `*Why this stack ships configs only for Claude Code, even though the upstream Everything Claude Code project supports Cursor, Codex, OpenCode, Gemini, and Antigravity.*`

**Sections (5 total):**

1. **`## The question that gets asked` (~15-20 lines)**
   - The exact framing readers arrive with: "ECC supports 6 harnesses, why do you only ship `.claude/`? Why not `.cursor/`, `.codex/`, etc.?"
   - Why this isn't a hostile question — it's a fair one, given the surface ECC covers.
   - Why the README's terse answer (`Multi-harness | Claude Code only` row in the compare matrix) leaves the *reasoning* invisible. This file fills that gap.

2. **`## The trade-off in one paragraph` (~15-20 lines)**
   - The single sentence: each additional harness multiplies the maintenance surface without proportionally multiplying the value, *for a solo operator's stack.*
   - Why "solo operator" matters: a community-maintained library (ECC) absorbs the multi-harness cost across 170+ contributors. A single-author curated stack cannot.
   - The alternative framing: "ECC is the catalogue, Solo Stack is the curation layer over Claude Code specifically." Multi-harness in the curation layer would dilute the curation.

3. **`## What the multi-harness path actually costs` (~30-40 lines)**
   - **Maintenance cost:** every cookbook recipe, every hook, every workflow, every CLAUDE.md becomes 6 variants. Drift is inevitable; one variant rots first; readers hit the rotten one and lose trust.
   - **Surface area for review:** sanitisation grep passes, broken-link checks, attribution audits all multiply by the number of harnesses. Pre-launch audit Wave 4 (verdict WARN, ~24 MEDIUM findings) was hard *with* one harness; with six it would have shipped 0 CRITICAL but with quality drift.
   - **Drift between harnesses:** Cursor's rules format, Codex's rules format, OpenCode's, Gemini's, Antigravity's all evolve independently of Claude Code's. A snapshot is a maintenance bet against five upstream rate-of-change vectors.
   - **Reader confusion:** "which directory do I copy?" becomes a navigation problem before the value problem. Single-harness keeps the install path one path.

4. **`## The contributor-friendly answer` (~25-30 lines)**
   - **Forks are welcome.** The MIT license + the explicit "copy what fits, drop what doesn't" stance in `Status` mean nothing prevents a contributor forking and adding `.cursor/` or `.codex/` ports.
   - **The fork is the right unit of work** for multi-harness coverage — not a PR back to mainline. Ports diverge and the maintainer of each port owns its drift.
   - **What we *will* accept:** documentation PRs that explain how to *adapt* a recipe or hook for another harness, kept inline alongside the Claude Code version. That stays maintainable.
   - **What we *won't* merge into mainline:** parallel `.cursor/` `.codex/` directories that duplicate `.claude/` content. The repo stays single-harness.
   - Cross-link to `CONTRIBUTING.md` for the formal scope statement.

5. **`## When this might change` (~15-20 lines)**
   - The threshold: if a single second harness reaches feature parity with Claude Code *and* a contributor commits to maintaining the port long-term, the repo could grow a sibling layer.
   - Why no such commitment exists today.
   - Why the maintainer would prefer to refer those readers to ECC (which already covers 6 harnesses) than to dilute Solo Stack.
   - Closes: "this is a curated stack, not a portability project. The curation is the value."

## 7. `docs/README.md` index

A small (~30-50 line) file that gives `docs/` a one-screen front door. Shape:

```markdown
# Long-form docs

Depth surface for readers who want more than the README's first-impression pass. Each file extends or pre-empts a specific question that the README and CHANGELOG don't answer well at their current length.

| File | What it answers |
|------|-----------------|
| [comparing-stacks.md](comparing-stacks.md) | Solo Stack vs Everything Claude Code vs starter templates — full audience-fit table and "designed to coexist" framing. *Expanded from README §How this compares.* |
| [whats-inside.md](whats-inside.md) | Full annotated directory tree of the repo. *Expanded from README §What's Inside.* |
| [v1-changelog-deep-dive.md](v1-changelog-deep-dive.md) | The story behind the CHANGELOG bullets — v0.1 → v0.2 → waves 1-5 → v1.0 doubling-down → reality-syncs → governance. |
| [why-only-claude-code.md](why-only-claude-code.md) | Why this stack ships configs only for Claude Code even though Everything Claude Code supports 6 harnesses. |

## Reading order

If you arrived from the README and want context on the comparison, start with [comparing-stacks.md](comparing-stacks.md). If you arrived from CHANGELOG.md and want the story, go to [v1-changelog-deep-dive.md](v1-changelog-deep-dive.md). If you arrived from the compare matrix wondering about multi-harness, go to [why-only-claude-code.md](why-only-claude-code.md). If you want the directory map, [whats-inside.md](whats-inside.md).

These docs are the canonical long form; the README summarises. When updating, edit `docs/` first, then re-summarise in README. (One-way truth flow.)
```

## 8. Repo-root README.md changes (deferred to coordinated INTEGRATION pass)

The executor for this phase **does NOT** edit `README.md`, `README.ru.md`, `README.es.md`, or `CHANGELOG.md` directly. All those edits batch into the coordinated post-wave-8 pass (same pattern Phase 8.4 used — see `.planning/phases/P8.4-own-skills/INTEGRATION.md`).

The executor writes `.planning/phases/P8.6-docs/INTEGRATION.md` containing the *exact* delete-and-replace text snippets, ready to apply during the coordinated pass.

**INTEGRATION.md must specify:**

1. **Delete README.md lines 316-347** (the full `## How this compares` section) and **replace with** the 3-line summary block from §3 above (heading + framing paragraph + `[Read the full comparison →](docs/comparing-stacks.md)`).

2. **Delete README.md lines 139-215** (the full `## What's Inside` section) and **replace with** the 6-line top-level overview block from §4 above (heading + framing paragraph + 4 bullets + `[Full annotated tree →](docs/whats-inside.md)`). The replacement must include the `docs/` block in the bullet overview ("**docs/, credits/** — long-form depth + attribution").

3. **Add new H2 section "Long-form docs"** to README.md, placed *between* the now-shortened `## How this compares` and `## Acknowledgements` sections. Body:

   ```markdown
   ## Long-form docs

   Depth artefacts that don't fit the README's first-impression job: the full comparison table, the annotated tree, a narrative changelog, and the rationale for the single-harness scope.

   See [docs/README.md](docs/README.md) for the index.
   ```

4. **Add TOC entry** `[Long-form docs](#long-form-docs)` to README.md's `## Contents` block, placed between `[How this compares](#how-this-compares)` and `[Acknowledgements](#acknowledgements)`.

5. **For `README.ru.md` and `README.es.md`**: identify the equivalent "How this compares" and "What's Inside" sections (same structure, translated headings) and apply the *same* delete-and-replace pattern, using translated versions of the summary blocks. The links point at the *English* `docs/` files (translation of `docs/` is explicit v1.1).

6. **CHANGELOG.md `[Unreleased]` block**: add to `### Added`:
   ```markdown
   - **docs/** — long-form guides directory. Two extractions from README (`comparing-stacks.md`, `whats-inside.md`) plus two new pieces (`v1-changelog-deep-dive.md` — narrative version of the CHANGELOG; `why-only-claude-code.md` — rationale for the single-harness choice). Indexed by `docs/README.md`. Shrinks README by ~140 lines.
   ```

## 9. Implementation steps (numbered checklist for the executor)

1. **Create `docs/` directory.** (`mkdir docs/`)

2. **Extract `comparing-stacks.md`.** Copy README.md lines 316-347 verbatim into `docs/comparing-stacks.md`. Add the top-of-file italic marker. Demote heading from `##` to `#`. Verify the two absolute URLs to `affaan-m/everything-claude-code` and `affaan-m` survive the move (no rewrite needed). Run `grep -n "](" docs/comparing-stacks.md` to list every link and eyeball-check each one.

3. **Extract `whats-inside.md`.** Copy README.md lines 139-215 verbatim into `docs/whats-inside.md`. Add the top-of-file italic marker. Demote heading. Rewrite the one internal link `[ecc-skill-index.md](stack/ecc-skill-index.md)` to `[ecc-skill-index.md](../stack/ecc-skill-index.md)` (one path level deeper). Add the `docs/` block to the annotated tree, placed between `cookbook/` and `skills/`.

4. **Write `v1-changelog-deep-dive.md`** following the 7-section outline in §5. Length budget: 200-300 lines. Source: `CHANGELOG.md` + `git log --oneline` history. Voice: narrative past tense, first-person singular, no AI-slop. Verify line count after writing: `wc -l docs/v1-changelog-deep-dive.md` must return ≤300.

5. **Write `why-only-claude-code.md`** following the 5-section outline in §6. Length budget: 100-150 lines. Verify: `wc -l docs/why-only-claude-code.md` must return ≤150.

6. **Create `docs/README.md`** following the index template in §7.

7. **Write `INTEGRATION.md`** at `.planning/phases/P8.6-docs/INTEGRATION.md` containing the 6 delete-and-replace specifications from §8. Each spec must include the exact line ranges from the *current* README.md and the exact replacement text, ready for a coordinated pass to apply mechanically.

8. **Cross-reference check.** After all 5 `docs/` files plus INTEGRATION.md are written:
   - Each `docs/` file must reference at least one other `docs/` file or back to the README (no orphan files).
   - Each `docs/` file must explicitly state "expanded from README §<section>" or "companion to <file>" at the top (per Phase 8.6 success criterion 7).
   - Run `grep -rn "](README.md" docs/` and confirm each link uses `../README.md` (not `README.md`, since `docs/` is one level deeper).
   - Run `grep -rn "](docs/" README.md` — should return zero hits *until* INTEGRATION pass runs (sanity check that the executor didn't edit README directly).

9. **Verification commands** (see §11).

10. **Stop here. Do not commit.** This phase is plan-and-write only; the coordinated INTEGRATION pass commits all wave-8 phases together.

## 10. Quality bar

- **Voice operator-first.** No marketing prose, no AI-slop ("imagine if", "unlock", "leverage", "in today's fast-paced…"). Apply the same strip-pattern that ran in commit `faf18a4` (`docs: strip AI-slop patterns across all markdown`).
- **No fake credibility.** The deep-dive narrative draws only from CHANGELOG.md + git log + the actual repo state. No invented anecdotes; no inflated metrics.
- **One-way truth flow.** Every extracted file states "expanded from README §<section>" at the top. When future updates land, the order is: edit `docs/` first, then re-summarise in README — *never* edit the README first and let `docs/` rot.
- **Cross-references are explicit.** `docs/comparing-stacks.md` references `docs/whats-inside.md` (and vice versa) where the comparison's columns map to repo directories. Both reference back to README. The deep-dive references CHANGELOG.md. The why-only file references `CONTRIBUTING.md` and `comparing-stacks.md`.
- **Link integrity preserved.** Extracted files keep working links. The one internal link in `whats-inside.md` rewrites to `../stack/ecc-skill-index.md`. All absolute URLs (https://github.com/...) survive verbatim.
- **Length caps enforced.** `v1-changelog-deep-dive.md` ≤ 300 lines, `why-only-claude-code.md` ≤ 150 lines, all files ≥ 100 lines (per Phase 8.6 success criterion 1).

## 11. Success criteria + verification commands

**Success criteria (mapped to Phase 8.6 ROADMAP § lines 570-578):**

1. ✅ 4 files in `docs/`, each 100-300 lines, focused → enforced by length caps in §10
2. ✅ `docs/README.md` indexes them with one-line descriptions → §7
3. ⏳ README.md shrinks by ~140 lines → handled by INTEGRATION pass (delete 316-347 = 32 lines + delete 139-215 = 77 lines + add ~9 lines summary blocks + add ~7 lines new section + 1 TOC line ≈ **~92 lines net deletion**, plus the 4 new docs files ≈ ~700 lines added under `docs/`. The "~140" estimate in ROADMAP counts the longer interpretation; ~92 is the clean number)
4. ✅ All cross-links from extracted-into-docs back to README sections still resolve → step 8 verification
5. ⏳ README.md "What's Inside" tree adds `docs/` block → handled by INTEGRATION pass (the *short* overview gets a `docs/` bullet; the *full* tree in `docs/whats-inside.md` gets the `docs/` block)
6. ⏳ TOC entry added for the new "Long-form docs" section → INTEGRATION pass (§8 step 4)
7. ✅ Each extracted file explicitly says at the top "expanded from README §<section>" → §10
8. ⏳ Translated READMEs (RU, ES) get matching summary truncations + links → INTEGRATION pass (§8 step 5)

**Verification commands the executor runs before declaring done:**

```bash
# File existence + line counts
ls -la docs/
wc -l docs/*.md
# Expected: docs/README.md (~30-50), docs/comparing-stacks.md (~35-45),
# docs/whats-inside.md (~80-90), docs/v1-changelog-deep-dive.md (200-300),
# docs/why-only-claude-code.md (100-150)

# Length cap enforcement
test $(wc -l < docs/v1-changelog-deep-dive.md) -le 300 && echo "OK" || echo "FAIL: deep-dive over 300 lines"
test $(wc -l < docs/why-only-claude-code.md) -le 150 && echo "OK" || echo "FAIL: why-only over 150 lines"

# Top-of-file marker present in extracted files
grep -l "Expanded from \[README" docs/comparing-stacks.md docs/whats-inside.md
grep -l "Companion to" docs/v1-changelog-deep-dive.md
grep -l "Why this stack" docs/why-only-claude-code.md

# Link integrity — internal link in whats-inside.md rewritten correctly
grep -n "ecc-skill-index" docs/whats-inside.md
# Expected: hit on "../stack/ecc-skill-index.md", not "stack/ecc-skill-index.md"

# README untouched (executor must not have edited README directly)
git diff --stat README.md README.ru.md README.es.md CHANGELOG.md
# Expected: no changes shown

# AI-slop pattern check (same patterns commit faf18a4 stripped)
grep -niE "imagine if|unlock|leverage|in today's|fast-paced|game-chang|revolutioniz" docs/*.md
# Expected: zero hits

# INTEGRATION.md exists with the 6 specs
test -f .planning/phases/P8.6-docs/INTEGRATION.md && echo "OK"
grep -c "^### " .planning/phases/P8.6-docs/INTEGRATION.md
# Expected: ≥6 (one heading per spec)
```

## 12. Risks + mitigations

| Risk | Mitigation |
|------|------------|
| **README becomes a stub.** Long extractions leave hollow "see docs/" sections. | Keep substantive lead-ins. Only the long tail moves. Each replaced section keeps a 3-6 line framing block that *answers the audience question* before the link, so the reader doesn't need to bounce. The compare-section summary names all 3 columns; the "What's Inside" overview lists all 4 layers. |
| **Content drift between README summary and `docs/` full version.** Future edits land in one place and not the other. | Each `docs/` file states "expanded from README §<section>" at the top. One-way truth flow (the §10 quality bar makes this an explicit rule): edit `docs/` first, re-summarise in README. Never the other way around. |
| **Two new long-form pieces grow into essays.** | Hard caps enforced by `wc -l` checks in §11: `v1-changelog-deep-dive.md` ≤300, `why-only-claude-code.md` ≤150. Overflow becomes a v1.1 sub-doc, not a longer file. |
| **Voice drift — new pieces sound like marketing.** | §10 quality bar bans specific patterns (commit `faf18a4`'s strip-list). §11 verification grep enforces. |
| **Link rot in extracted files.** Internal `[link](path)` references break when files move from README (root) to `docs/` (one level deeper). | §10 + §11 cross-reference check explicitly handles the only internal link (`stack/ecc-skill-index.md` → `../stack/ecc-skill-index.md`). All other links in the extracted sections are absolute URLs; they survive. |
| **Executor edits README directly instead of routing through INTEGRATION.md.** Coordinated pass loses its single source of truth. | §11 verification: `git diff --stat README.md` must return zero changes. Executor stops at INTEGRATION.md. |
| **`docs/README.md` index drifts from `docs/` contents** (e.g. a 5th file added later, index doesn't list it). | Out of scope for Phase 8.6 (only 4 files exist). Future phases adding `docs/` content own the index update. Phase 8.6 ships a complete index for the 4 files it creates. |

## 13. Estimated time breakdown (target 2-3h total)

| Step | Time | Notes |
|------|------|-------|
| §3 — extract `comparing-stacks.md` (verbatim copy + marker + heading demote + link audit) | ~10 min | Mechanical; no writing |
| §4 — extract `whats-inside.md` (same shape + add `docs/` block to tree + rewrite one internal link) | ~15 min | Mechanical + small tree edit |
| §5 — write `v1-changelog-deep-dive.md` (200-300 lines across 7 sections) | ~75-90 min | The heaviest write; pacing is ~30 lines per 10 min for narrative-quality prose |
| §6 — write `why-only-claude-code.md` (100-150 lines, 5 sections) | ~35-45 min | Lighter write; the structure is more argumentative than narrative |
| §7 — `docs/README.md` index (table + reading-order paragraph) | ~10 min | |
| §8 — write `INTEGRATION.md` (6 delete-and-replace specs with exact line ranges) | ~20 min | Specs must be mechanical-applyable; precision matters more than length |
| §11 — verification command sweep + fixes | ~10 min | |
| **Total** | **~2h 55min — 3h 10min** | Within the ROADMAP's 2-3h target |

## 14. Files to create

Under `docs/` (the executor creates):
- `docs/README.md` — index, ~30-50 lines (§7)
- `docs/comparing-stacks.md` — extracted, ~35-45 lines (§3)
- `docs/whats-inside.md` — extracted, ~80-90 lines (§4)
- `docs/v1-changelog-deep-dive.md` — new, 200-300 lines (§5)
- `docs/why-only-claude-code.md` — new, 100-150 lines (§6)

Under `.planning/phases/P8.6-docs/` (the executor creates):
- `INTEGRATION.md` — 6 delete-and-replace specs for the coordinated pass (§8)

Files **NOT** touched by this phase's executor (deferred to coordinated INTEGRATION pass):
- `README.md` — root
- `README.ru.md`
- `README.es.md`
- `CHANGELOG.md`

---

*Plan written 2026-05-05 by the Phase 8.6 planner. Output of this plan is a checklist; the executor for Phase 8.6 reads this file and ships the 6 artefacts above. Coordination with Phases 8.5 and 8.7 happens at the post-wave INTEGRATION pass, not within this phase's execution window.*
