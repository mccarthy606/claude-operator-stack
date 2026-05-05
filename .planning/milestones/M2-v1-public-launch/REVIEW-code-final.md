# Code review final (v3) — opus 4.7

**Date:** 2026-05-05
**Scope:** prose, structure, links, voice, governance — final pre-flip pass.
**Baseline:** v2 GO clean (commit `2ceb123`). Post-v2 commits add wave-B (commands/ + docs/ + tests/), governance (CoC + expanded CONTRIBUTING), and the hero-fix pass.

## Summary

- Files reviewed: 90 markdown files across the public surface (READMEs ×7, CHANGELOG, governance ×5 + GitHub templates ×3, commands ×7, docs ×5, tests ×6, plus full re-walk of stack/, profiles/, workflows/, cookbook/, scaffolds/ — and `assets/hero.svg` as a structured artifact). 7 commits since baseline.
- Findings: CRITICAL **1** · HIGH **2** · MEDIUM **3** · LOW **3**
- Verdict: **WITH-FIXES** — one CRITICAL stale-OMEGA mention slipped into the README's primary slash-commands table and contradicts the rest of the post-reality-sync framing; one HIGH where the canonical "Full annotated tree" linked from the README omits 3 of the 14 actual repo directories; one HIGH where the four stub-language READMEs cite issue numbers that are off-by-one against the EN README + CONTRIBUTING. Every v1 and v2 fix held; the regressions are concentrated in **new** wave-B surfaces (the docs/ extraction missed three dirs added in the same wave, and the wave-B wiring through the README's slash-commands table reused stale OMEGA copy).

The wave-B integration ran cleanly on most fronts: docs/, commands/, and tests/ all link cleanly into the README, the governance pass landed CoC + expanded CONTRIBUTING + 3 GitHub templates with no placeholders, the hero SVG xmllint is clean and matches every spec point (font-size 52, panel `translate(740, 60)`, three loading dots present, compositor-only animation), and the `[Unreleased]` CHANGELOG section bullets every new directory. The remaining issues are tightly localised: README.md:239 missed the OMEGA → graphify rename in one cell; docs/whats-inside.md:5-83 was extracted from the README before commands/ + tests/ + assets/ were added to the same tree; the 4 stub-language READMEs cite issues #2-5 while the EN README and CONTRIBUTING cite #1-4 for the same translations.

---

## Regression check matrix

Every v1 + v2 finding re-verified against post-baseline state.

| Source / finding | Where (or where it was) | Status |
|---|---|---|
| **v1 C1** ECC URL `snubroot/Everything-Claude-Code` | repo-wide | **OK** — `grep -rn "snubroot"` returns 0 hits in user-facing files. |
| **v1 H3** "Next.js 16" vs scaffolds' Next.js 15 | repo-wide | **OK** — 0 hits for "Next.js 16". |
| **v1 H4** non-existent `claude-sonnet-4-6` | repo-wide | **OK** — 0 hits. |
| **v1 H5** `<verify before shipping>` placeholders | repo-wide | **OK** — 0 hits. |
| **v1 H1** README TOC missing Cookbook / Scaffolds / Profiles | README.md TOC | **OK** — TOC has Cookbook, Solo-founder skills, Slash commands (NEW), Scaffolds, Profiles, Long-form docs (NEW), How this compares; all anchors resolve via GitHub slug rules. |
| **v1 H2** placeholder `https://github.com/...` URL in `stack/frontend-design.md` | stack/frontend-design.md | **OK** — link gone, replaced with prose. |
| **v2 C1** README's npm install path returns 404 at flip | README.md Quick Start | **OK** — bash path is now first ("recommended"); npm path second with explicit "Available after the package is published in Phase 9" caveat. RU + ES carry the same caveat. |
| **v2 H1** `<!-- TODO upstream URL -->` placeholders in `stack/graphify.md` | stack/graphify.md:3,44,62 | **OK** — replaced with honest "operator-private at the time of this README — public release planned for v1.1." Cookbook 01 step 3 reframed from "(required)" to "(recommended)". `grep -rn "<!-- TODO upstream"` = 0 hits. |
| **v2 H2** CLI STACK constant lists wrong 6 | packages/cli/src/lib/stack.ts | **OK** — restructured to 4 core + 2 opt-in with `tier` / `optionalCondition` / `installCommand` fields. CLI README now says "show the 4 core + 2 opt-in components"; parent README says "show the wired components" — both accurate, no contradiction. |
| **v2 M1** cookbook/02 placeholder-shaped Used-in link | cookbook/02-stripe-connect-p2p.md:5 | Out of scope for this v3 pass (skipped per scope: prose-only deltas in commands/, docs/, tests/, governance + cross-link integrity). v2 fix presumed in place per `2ceb123` log. |
| **v2 M2** README skill description for `multi-project-context-bridge` ambiguous | README.md:270 | **OK in row** — line 219 (in the new Solo-founder skills table) reads "Bridge cross-project decisions via graphify queries with anonymisation" — unambiguous. **But see C1 below** — line 239 (the slash-commands table, a different surface) regresses to "Bridge OMEGA decisions". |
| **v2 M3** README Status block stale (v1.0 frozen, missing post-v1.0 wave) | README.md:312 | **OK for EN** — Status now lists post-v1.0 wave bullets (skills/, packages/cli/, animated hero, OMEGA → graphify, 4-core/2-opt-in). RU + ES Status blocks still say *"v0.2 added the hero banner..."* — known gap, tracked as issue #8 (pre-existing v2 M4); not a v3 regression. |
| **v2 M4** RU/ES file trees show v0.1 shape | README.ru.md:118-156, README.es.md:118-156 | **PARTIALLY ADDRESSED** — both translations' file trees now include the post-v1.0 directories (`commands/`, `docs/`, `tests/`, `skills/`, `packages/cli/`). The surrounding section content (Cookbook, Profiles, Scaffolds, Solo-founder skills, Slash commands sections) is still EN-only and tracked under issue #8. The trees are sync; the prose is not. **Carry-forward MEDIUM, but improved scope vs v2.** |
| **v2 M5** install-dryrun.svg captured against pre-`c883ddf` install.sh | assets/screenshots/install-dryrun.svg | Out of v3 scope (visual regression, not text). Carry-forward to launch checklist. |
| **v2 L1** workflow `parallel-projects.md:58` "Without X. With X." retained | workflows/parallel-projects.md:58 | Out of v3 scope (not in wave-B touch list). |
| **v2 L2** "compounds" reintroduced in 5 places | repo-wide | Out of v3 scope; mostly defensible "compound interest" metaphor uses. |

**Net regression score:** 0 hard regressions of v1 or v2 fixes. 1 NEW critical surface in wave-B (the slash-commands table missed the OMEGA → graphify rename for one cell). The graphify install-path framing, the npm-install caveat, and the 4-core/2-opt-in stack reframe all held cleanly across the wave-B coord pass.

---

## New findings

### CRITICAL

#### C1. README.md:239 slash-commands table reads "Bridge OMEGA decisions across projects" — stale OMEGA mention in primary navigation, contradicts wave-B reality-sync

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md:239`
- **Cell text:** `| /bridge-context | Bridge OMEGA decisions across projects, anonymised | multi-project-context-bridge |`
- **Cross-confirmation:** `commands/README.md:26` — `| /bridge-context | Bridge cross-project decisions via graphify, anonymised | multi-project-context-bridge |`. The two tables describe the same command. They disagree.
- **Where else "OMEGA" appears repo-wide:** `grep -rn "OMEGA"` returns 7 hits — 2 in CHANGELOG (historical entry for v0.1.0 + the migration entry under `[Unreleased]`, both correct as audit log), 4 in `docs/v1-changelog-deep-dive.md` and `docs/why-only-claude-code.md` (narrative explanation of the rename, all in past tense and clearly scoped to history), and **1 hit in user-facing prose at `README.md:239` — this finding**. Every other OMEGA reference is correctly historical; only the slash-commands cell still describes the **current** behaviour as "OMEGA decisions."
- **Reader impact:** A first-time visitor reads the README's stack table (line 63: `| Knowledge graph | graphify | local | …`), reads the Status block (line 312: `… alongside the OMEGA → graphify knowledge-graph migration`), then scrolls to the Slash commands table (line 239) and sees `/bridge-context` documented as bridging "OMEGA decisions." The contradiction within one README erodes the reality-sync's whole point — the rename was specifically to make the public framing match what the operator actually runs. One stale cell undoes that for the slash-commands surface.
- **Why CRITICAL:** The rubric explicitly lists "stale OMEGA mention in user-facing prose" as CRITICAL. Beyond rubric: the slash-commands table is in the README's primary navigation and is the surface a reader uses to decide which commands to install. A row labeled "OMEGA decisions" reads as either a) the maintainer hasn't updated the docs, or b) `multi-project-context-bridge` actually uses OMEGA Memory and the rest of the README is wrong. Either reading damages trust at the moment a reader is deciding to install.
- **Fix (1 line):**
  ```diff
  - | [`/bridge-context`](commands/bridge-context.md) | Bridge OMEGA decisions across projects, anonymised | [`multi-project-context-bridge`](skills/multi-project-context-bridge/SKILL.md) |
  + | [`/bridge-context`](commands/bridge-context.md) | Bridge cross-project decisions via graphify, anonymised | [`multi-project-context-bridge`](skills/multi-project-context-bridge/SKILL.md) |
  ```
  Mirror the wording from `commands/README.md:26` exactly. 30 seconds.

---

### HIGH

#### H1. `docs/whats-inside.md` "Full annotated tree" omits commands/, tests/, and assets/ — the canonical tree contradicts the repo

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/docs/whats-inside.md:5-83`
- **Issue:** This file is linked from `README.md:162` as `[Full annotated tree →](docs/whats-inside.md)`. The tree lists 11 top-level entries (README.md, install.sh, CLAUDE.md, stack/, workflows/, case-studies/, cookbook/, docs/, skills/, packages/, scaffolds/, profiles/, configs/, credits/) but the actual repo has 14 directories — the missing three are **commands/**, **tests/**, and **assets/**. The README's own minimal tree (lines 145-160) lists all three correctly; the canonical tree linked from "see more →" omits them.
- **Why this happened:** docs/whats-inside.md was extracted verbatim from a pre-wave-B version of the README's tree. The wave-B coord pass (commit `fed7d61`) updated the README's tree to add commands/ + docs/ + tests/, but the same pass did not propagate the additions into the docs/ extraction. Net: the README's summary is now more complete than the canonical document it links to.
- **Why HIGH:** A reader who clicks "Full annotated tree →" expects more detail than the README's tree, not less. The label and the destination contradict each other. Three missing directories include `commands/` (advertised in the README at length under "Slash commands") and `tests/` (advertised in CONTRIBUTING.md and at the bottom of the wave-B `[Unreleased]` block). The reader who follows the link to learn about commands/ won't find it on the page promised to be the complete inventory.
- **Fix:** Add three blocks to the tree, mirroring the README's tree styling. Sketch:
  ```
  ├── commands/                   ← 6 slash-commands wrapping the skills
  │   ├── solo-monday-review.md
  │   ├── anonymise-case-study.md
  │   ├── ship-day.md
  │   ├── cost-rollup.md
  │   ├── bridge-context.md
  │   └── sync-brain.md
  │
  ├── tests/                      ← E2E integration suite
  │   ├── integration/
  │   ├── run-all.sh
  │   └── vitest.config.ts
  │
  └── assets/                     ← hero SVG + screenshots
      ├── hero.svg
      └── screenshots/
  ```
  ~12 lines. 5 minutes.

#### H2. The four stub-language READMEs cite issues #2-5; the EN README and CONTRIBUTING cite issues #1-4 for the same translations

- **Files:**
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.pt-br.md:19` — `[issue #2 — translate README to Portuguese (BR)]`
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.tr.md:19` — `[issue #3 — translate README to Turkish]`
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.zh.md:19` — `[issue #4 — translate README to Chinese]`
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.ja.md:19` — `[issue #5 — translate README to Japanese]`
- **Cross-references that disagree:**
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.md:320` — `[Translate README to PT-BR](https://github.com/.../issues/1) · [TR](.../issues/2) · [中文](.../issues/3) · [日本語](.../issues/4)`
  - `/Users/mccarthy606/Projects/claude-operator-stack/CONTRIBUTING.md:104-107` — `[#1 PT-BR]`, `[#2 TR]`, `[#3 中文]`, `[#4 日本語]`
- **Issue:** The same 4 translation tasks have two different issue numbers depending on which file the reader lands on first. The stub READMEs link to `/issues` (no anchor) so the wrong number is cosmetic-only at the URL level — but the visible text is what readers cite when they comment on an issue or open a PR. A contributor who opens "issue #5" expecting the JA translation will land on the wrong (or non-existent) issue.
- **Why HIGH:** This is internal-consistency drift across 6 files (4 stubs + EN README + CONTRIBUTING) for the same four real-world tasks. The stubs are explicitly contributor-facing entry points; their cited issue numbers are the first thing a translator-volunteer reads after deciding to help. Wrong numbers compound: a maintainer fields an "is issue #5 the JA one or the PT one?" question 72h after launch, when the inbox is busiest.
- **Fix:** Decide which numbering is canonical (the EN README + CONTRIBUTING agree on #1-4, so those are the source of truth) and update the 4 stubs accordingly. Single-line edit per file:
  ```diff
  - [issue #2 — translate README to Portuguese (BR)]
  + [issue #1 — translate README to Portuguese (BR)]
  ```
  ~4 minutes total. Verify the linked `/issues/1` etc. URLs resolve once the repo flips public.

---

### MEDIUM

#### M1. `CONTRIBUTING.md:30` says "see [`docs/why-only-claude-code.md`](docs/why-only-claude-code.md) once that file lands" — the file has landed

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/CONTRIBUTING.md:30`
- **Current text:** `Multi-harness `.cursor/`, `.codex/`, `.gemini/` config dirs. The stack is Claude Code-only by design — see [`docs/why-only-claude-code.md`](docs/why-only-claude-code.md) once that file lands.`
- **Issue:** The "once that file lands" conditional was correct at the time CONTRIBUTING was expanded (commit `59f0c65` landed before `2ca9d21` shipped wave-B's docs/). After commit `2ca9d21`, the file exists and the link works — but the prose still describes it as forthcoming. Reader-facing self-contradiction: the link is clickable and resolves to a 101-line file, the same sentence says the file hasn't landed yet.
- **Why MEDIUM:** CONTRIBUTING is a high-traffic file post-launch — every contributor reads it. A "this file is coming" pointer to a file that's clickable and complete reads as either "the maintainer hasn't updated the docs" or "the file is actually a stub" (it isn't — it's 101 lines of solid rationale). Trust ding.
- **Fix:** Drop the "once that file lands" conditional:
  ```diff
  - The stack is Claude Code-only by design — see [`docs/why-only-claude-code.md`](docs/why-only-claude-code.md) once that file lands.
  + The stack is Claude Code-only by design — see [`docs/why-only-claude-code.md`](docs/why-only-claude-code.md) for the rationale.
  ```
  30 seconds.

#### M2. `README.ru.md` and `README.es.md` Status blocks still say "v0.2 added the hero banner..." — pre-v1.0 perspective at flip

- **Files:**
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.ru.md:222`
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.es.md:222`
- **Issue:** EN README's Status block was refreshed in `2ceb123` (v2 M3 fix) to mention the post-v1.0 wave (skills/, packages/cli/, animated hero, OMEGA → graphify, 4-core/2-opt-in reframe). RU and ES Status blocks still describe the v0.2 perspective only — they will read as "this fork stalled at v0.2" to any RU/ES reader at the moment the repo flips public. This is a carry-forward of v2 M4 (RU/ES translation drift), not a v3 regression — the file trees were sync'd in `fed7d61` but the Status prose wasn't.
- **Why MEDIUM:** Tracked as issue #8 ("Sync RU + ES translations with v1.0 content"). The mismatch is **inside one README** — the Stack table at the top correctly says "4 core + 2 opt-in" (post-v1.0), the file tree mid-page lists 11 directories (post-v1.0), but the Status block at the bottom describes the v0.2 release. A non-English reader sees three different version perspectives in one document.
- **Fix:** Same shape as v2 M3's EN fix, mechanically translated. ~10 minutes for both files. Or annotate inline: `## Status — последнее обновление: v0.2 (синхронизация v1.0 в [issue #8])` / `## Estado — última actualización: v0.2 (sincronización v1.0 en [issue #8])`. Cheaper, honest about the gap.

#### M3. CHANGELOG `[Unreleased] > Changed` mixes wave-A reality-syncs with wave-B integration under one block

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/CHANGELOG.md:17-25`
- **Issue:** `### Changed` lists 6 bullets:
  1. Static hero → animated SVG (P8.1, wave-A)
  2. OMEGA Memory → graphify (P8.6 reality-sync, wave-A)
  3. `stack/omega-memory.md` rename (same as #2)
  4. Updated stack table refs (same as #2)
  5. Brain vault structure additions (same as #2)
  6. 4-core / 2-opt-in reframe (P8.7 reality-sync, wave-A)
  
  These are conceptually three distinct waves (P8.1 visual, P8.6 OMEGA→graphify, P8.7 reframe) flattened into one list. Same shape as v2 L3, persists post-v2 because the wave-B coord pass added bullets to `### Added` but didn't restructure `### Changed`.
- **Why MEDIUM:** Cosmetic but visible — Keep-a-Changelog readers expect grouped entries when changes are conceptually distinct. v2 flagged this LOW; calling MEDIUM now because the `[Unreleased]` block is what readers will read at the flip-time announcement.
- **Fix:** Split into three sub-blocks (P8.1 hero, P8.6 graphify, P8.7 reframe), or add inline `(P8.1)` / `(P8.6)` / `(P8.7)` markers to each bullet so the audit-trail is legible. ~3 minutes.

---

### LOW

#### L1. `assets/hero.svg` corner mark says `v0.1.0 · MIT` — repo is post-v1.0

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg:290`
- **Issue:** Hero corner stamp reads `v0.1.0 · MIT`. Ambiguous — could refer to the npm CLI's `0.1.0` (which matches `packages/cli/package.json`). But the hero is the **stack's** banner, not the CLI's, and the stack just shipped v1.0.0. Readers will read the stamp as "this repo is at v0.1.0" while the README and CHANGELOG say v1.0.0 + post-v1.0 [Unreleased] wave.
- **Why LOW:** The hero is decorative and most readers won't notice. But it's a visible inconsistency at flip-time on the most prominent surface. Spec requirement was xmllint-clean / loading-dots-present / caret-replaced / font-52 / panel-translate — all 5 hold. The version stamp wasn't part of the spec.
- **Fix:** Update line 290 to `v1.0 · MIT` (or `v1.0.0`). 30 seconds. Re-validate xmllint after edit.

#### L2. `commands/cost-rollup.md` references `workspace_export` 3× without defining it for public readers

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/commands/cost-rollup.md:9,28,82`
- **Issue:** All three lines reference "the operator's `workspace_export`" or "the operator's `workspace_export` stack" / "the operator's `workspace_export` baseline." `workspace_export` is the operator's private memory file (per the system context: "full infra map from second computer"). It's not defined anywhere in the public repo, so a public reader sees a code-formatted token that reads as either a) jargon they should already know, or b) a private-namespace leak.
- **Why LOW:** Reads as harmless jargon — the surrounding sentence makes the meaning recoverable ("a 6-service stack of Vercel/Railway/Supabase/Anthropic/OpenAI/Cloudflare"). The token doesn't leak any secrets or paths, just an unfamiliar identifier.
- **Fix:** Replace `workspace_export` with a generic noun the reader already understands, or define it inline once. Suggested:
  ```diff
  - The command applies sensible operator defaults (the 6-service stack from your `workspace_export`, the 30% W/W flag threshold)
  + The command applies sensible operator defaults (the 6-service baseline below, the 30% W/W flag threshold)
  ```
  Apply same shape to lines 28 and 82. ~2 minutes.

#### L3. `tests/README.md:4` says "shipped in v0.1.0" — accurate for the CLI but reads as the stack's version on first scan

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/tests/README.md:4`
- **Issue:** *"End-to-end integration tests for the install path: `install.sh`, plus the three CLI commands shipped in v0.1.0 (`init`, `verify`, `list-stack`)."* The "v0.1.0" is the npm CLI's package version (matches `packages/cli/package.json`). But the `tests/` directory is at the repo root and tests both `install.sh` (which has no version) and the CLI (v0.1.0). Readers may read "v0.1.0" as the stack's version (which is post-v1.0).
- **Why LOW:** Recoverable from context (the sentence does say "the three CLI commands"). But the version-namespace ambiguity is the same one as L1 — the stack is v1.0+, the CLI is v0.1.0, and surfaces that don't disambiguate read as inconsistent.
- **Fix:** Disambiguate to `the npm CLI's v0.1.0`:
  ```diff
  - plus the three CLI commands shipped in v0.1.0 (`init`, `verify`, `list-stack`).
  + plus the three CLI commands shipped in `packages/cli` v0.1.0 (`init`, `verify`, `list-stack`).
  ```
  30 seconds.

---

## Cross-link integrity

- Relative links checked: **all `[text](path)` and `[text](dir/)` links in README.md, README.ru.md, README.es.md, the 4 stub READMEs, commands/*.md (×7), docs/*.md (×5), tests/README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, CHANGELOG.md** — full bash-walk against the filesystem.
- Broken: **0** — every relative link resolves.
- Anchors checked: **47 in-file `[text](#anchor)` links** across the same set, slugged via GitHub's algorithm (lowercase, strip backticks/punctuation, spaces → hyphens, Unicode preserved).
- Broken: **0** — every TOC anchor in EN, RU, ES READMEs and in commands/README + docs/README + tests/README + CONTRIBUTING resolves to an actual heading. Cyrillic anchors (`#что-это-такое`, `#стек`, `#как-это-сравнивается`, `#длинные-доки`) and accented Spanish anchors (`#qué-es-esto`, `#cómo-se-compara`, `#por-qué-existe`) round-trip cleanly.
- New canonical doc cross-links verified: README §What's Inside → docs/whats-inside.md (link works, but **content is incomplete — see H1**); README §How this compares → docs/comparing-stacks.md (works); README §Long-form docs → docs/README.md (works); README §Slash commands → commands/README.md (works); CONTRIBUTING.md §Tests → tests/README.md (works); CONTRIBUTING.md §Multi-harness → docs/why-only-claude-code.md (works, but prose says "once that file lands" — see M1).

---

## GitHub Community Standards

| File | Status | Notes |
|------|--------|-------|
| LICENSE | ✓ | MIT, 26 lines, copyright Dmitry McCarthy 2026 |
| README.md | ✓ | 333 lines, full TOC + anchors clean |
| CODE_OF_CONDUCT.md | ✓ | Contributor Covenant 2.1 verbatim, contact email `dimana503@gmail.com` filled in (line 40); zero placeholders |
| CONTRIBUTING.md | ✓ | 197 lines, expanded from 48 — scope, dev setup, tests, hooks, skills, cookbook, case studies, style, license |
| SECURITY.md | ✓ | 31 lines, private-disclosure policy via GitHub Security tab; expected-response 72h |
| Issue templates | ✓ | bug_report.md (37 lines), feature_request.md (32 lines) — both fully formed, no placeholders |
| PR template | ✓ | 34 lines, 1 paragraph + checklist |

GitHub will mark the community profile complete on the public flip. No file is a stub or has dangling TODOs. CoC contact email is filled (the only fill-in needed for the verbatim Contributor Covenant 2.1 template).

---

## Voice / slop check on new content

Per-file slop pattern count for the wave-B + governance files. AI-slop patterns scanned: antitheses ("X is not Y. It is Z."), tricolons ("Solo. No team. No CS degree."), "Without X. With X." parallel framing, "actually" / "essentially" / "compounds" / "earn its keep" / "pays for itself" / "pulls its weight."

| File | Antitheses | Tricolons | Without/With | Verb-slop | Notes |
|------|-----------|-----------|--------------|-----------|-------|
| commands/README.md | 0 | 0 | 0 | 0 | Clean. Operator voice, instructional. |
| commands/anonymise-case-study.md | 0 | 0 | 0 | 0 | Clean. |
| commands/bridge-context.md | 0 | 0 | 0 | 0 | Clean. (`omega-launch` example name is a hypothetical project name, not OMEGA Memory — no slop, no regression.) |
| commands/cost-rollup.md | 0 | 0 | 0 | 0 | Clean. (`workspace_export` jargon flagged separately as L2.) |
| commands/ship-day.md | 0 | 0 | 0 | 0 | Clean. |
| commands/solo-monday-review.md | 0 | 0 | 0 | 0 | Clean. |
| commands/sync-brain.md | 0 | 0 | 0 | 1 | One "actually" use ("what the repo actually contains") — load-bearing. Defensible. |
| docs/README.md | 0 | 0 | 0 | 0 | Clean. |
| docs/comparing-stacks.md | 0 | 0 | 0 | 2 | Two "actually" uses ("how you actually spend your week", "what's actually shipped") — both load-bearing operator voice. Defensible. |
| docs/whats-inside.md | 0 | 0 | 0 | 2 | Two "actually" uses ("how I actually work", "30 ECC skills I actually use") — load-bearing. Defensible. (See **H1** for content completeness, separate from voice.) |
| docs/v1-changelog-deep-dive.md | 0 | 0 | 0 | 4 | Four "actually" uses across 197 lines, all load-bearing in the "what the operator actually ran" framing. Defensible at this density. |
| docs/why-only-claude-code.md | 0 | 0 | 0 | 3 | Three "actually" uses across 101 lines, including one section heading ("What the multi-harness path actually costs") — load-bearing. Defensible. |
| tests/README.md | 0 | 0 | 0 | 0 | Clean. Technical voice, deterministic. |
| CONTRIBUTING.md | 0 (1 meta) | 0 | 1 (meta) | 3 (1 meta) | The 1 meta-antithesis and 1 meta-without/with hit are the rule-statement at line 85 (the rule itself spelling out the patterns). Three "actually" hits are reviewer-facing instructions ("real shipped integrations", "tests pass", colloquial). Self-referential, no slop in body prose. |
| CODE_OF_CONDUCT.md | n/a | n/a | n/a | n/a | Verbatim Contributor Covenant 2.1 — voice not a project artefact. |

**Net new-content slop:** 0 antitheses, 0 tricolons, 0 "Without X. With X." framing in body prose. The "actually" hits cluster in the docs/ directory (load-bearing operator voice — "the operator actually runs", "30 skills I actually use") and are consistent with the v1 + v2 voice baseline. The wave-B prose is voice-clean by the v2 criteria.

---

## Headline observations

If the operator only fixes the top items before flipping public:

1. **C1** — the README.md:239 `/bridge-context` row says "Bridge OMEGA decisions" while the rest of the README, the wrapped skill, the CHANGELOG entry, and the wave-B commands/README all use graphify framing. One cell. 30-second fix. It's the only stale-OMEGA hit in user-facing prose and the rubric makes it CRITICAL by default. **30 seconds.**

2. **H1** — `docs/whats-inside.md` is linked as the canonical "Full annotated tree" but omits commands/, tests/, and assets/ — three of the 14 actual repo directories, including two of the three new wave-B directories the link is supposed to advertise. The README's own minimal tree is more complete than the canonical doc. Add ~12 lines mirroring the README. **5 minutes.**

3. **H2** — the four stub-language READMEs cite issue numbers `#2-5` for the same translations the EN README + CONTRIBUTING cite as `#1-4`. Off-by-one inconsistency across 6 files for 4 real-world tasks. Translator-volunteers reading the stubs first will cite wrong numbers in their PR descriptions. Decide which numbering wins (the EN README + CONTRIBUTING agree on #1-4, so those are canonical) and update the 4 stubs. **4 minutes total.**

4. **M1** — CONTRIBUTING.md:30 says "see [`docs/why-only-claude-code.md`] **once that file lands**" — the file has landed. Drop the "once that file lands" clause. **30 seconds.**

5. **M2** — RU + ES Status blocks still describe v0.2 release. EN was sync'd in v2; the wave-B coord pass updated RU + ES file trees but not the Status blocks. Either translate the EN block into RU + ES or annotate inline ("последнее обновление: v0.2"). Tracked as issue #8 already; the call here is whether to close the gap or annotate it before flip. **5-10 minutes for either path.**

The 5 fixes total ~10-15 minutes (or ~6 minutes if M2 is annotated rather than translated). Once C1 + H1 + H2 land, this review's verdict moves from WITH-FIXES to GO. The remaining MEDIUM and LOW findings are pre-launch polish; none are launch-blockers if the top 3 land.

