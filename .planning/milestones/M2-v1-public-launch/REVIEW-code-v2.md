# Code review v2 — opus 4.7

**Date:** 2026-05-05
**Scope:** prose, structure, links, voice — regression check + new-content review.
**Baseline:** v1 BLOCK (1C/6H/6M/5L), all closed in 368abb2 + 24d5eb7.

## Summary

- Files reviewed: 90 markdown files (6,303 lines) plus install.sh, configs, packages/cli/README + npm wiring; commits since baseline: `d7eb84b` (doubling-down wave: animated hero, compare matrix, npm CLI, 6 own skills), `59c037d` (OMEGA → graphify reality-sync, 29 files), `c883ddf` (4-core / 2-opt-in reframe, 24 files), `1466ed2` (uv.lock commit).
- Findings: CRITICAL **1** · HIGH **2** · MEDIUM **5** · LOW **3**
- Verdict: **WITH-FIXES** — one CRITICAL launch-time gap (npm CLI advertised in README but not on the registry) plus two HIGH structural finds (graphify install path is a dead end; npm STACK constant doesn't match the new 4-core / 2-opt-in shape). Every v1 BLOCK + WARN finding is closed and stayed closed across both reality-sync waves; the regressions are scoped to **new** surfaces introduced after v1 was approved (npm package + graphify standalone install).

The reality-sync passes did good structural work: 0 OMEGA mentions outside CHANGELOG history, 0 stale `stack/omega-memory.md` link targets, all 4-core / 2-opt-in framing aligned across all 7 READMEs + 4 profiles + cookbook 01 + stack docs + install.sh wizard, both new H2 anchors (`how-this-compares`, `solo-founder-skills-originals`) resolve, and no broken relative links across 90 markdown files. The remaining issues are concentrated in three places: (a) the npm install path advertised at the top of Quick Start that today returns 404 from the registry, (b) graphify's install URL is a literal HTML-comment placeholder so the cookbook's "Install graphify (required)" step dead-ends, and (c) the npm CLI's in-code `STACK` array still lists the old 6 components instead of the 4-core / 2-opt-in set.

---

## Regression check matrix

Every finding from v1 (REVIEW-code.md) re-verified against the post-reality-sync repo.

| v1 finding | Where | Status |
|---|---|---|
| **C1** wrong ECC URL `snubroot/Everything-Claude-Code` in cookbook 01 + 12 | `cookbook/01-claude-code-from-zero.md:69-70,179`, `cookbook/12-content-cross-post-pipeline.md:154` | **OK** — all references now `affaan-m/everything-claude-code`; only mentions left in repo are inside `.planning/REVIEW-code.md` historical doc and grep verifies 0 user-facing hits. |
| **H1** README TOC missing Cookbook / Scaffolds / Profiles | `README.md:21-37` | **OK** — TOC now lists Cookbook, Solo-founder skills (originals), Scaffolds, Profiles, plus the new How this compares section; all anchors resolve. |
| **H2** placeholder `https://github.com/...` URL in `stack/frontend-design.md` | `stack/frontend-design.md:24` | **OK** — link replaced with prose: *"These qualities are codified in the operator's web design-quality rules — anti-template policy, banned patterns list."* No URL. |
| **H3** Next.js 16 vs scaffold's Next.js 15 contradiction | cookbook 01/02/06, `case-studies/niche-booking-trio.md`, `workflows/ship-a-product-in-a-day.md`, `stack/ecc-skill-index.md` | **OK** — every "Next.js 16" replaced with "Next.js 15" repo-wide; verified by `grep -rn "Next.js 16"` returning 0 hits outside `.planning/` (which retains the v1 review doc as audit log). |
| **H4** non-existent model `claude-sonnet-4-6` in cookbook 08 + scaffolds | `cookbook/08-ytdlp-whisper-research.md:143`, `scaffolds/whatsapp-saas/*` | **OK** — replaced with `claude-sonnet-4-5`; cookbook/03 also confirms `claude-haiku-4-5` is in use. Repo-wide grep for `claude-sonnet-4-6` returns only `.planning/.../REVIEW-*.md` historical hits. |
| **H5** `<verify before shipping>` placeholder in cookbook 11 + 08 | `cookbook/11-scheduled-prompts-cron.md:38`, `cookbook/08-ytdlp-whisper-research.md:185` | **OK** — cookbook/11 line 38 reflows to *"package names occasionally move, and your tooling may report a different identifier than the one shown here."* Cookbook/08 line 185 now reads `'yt-dlp>=2024.12.13'`. Repo-wide grep for `verify before shipping` and `<verify` returns 0 hits in user-facing files. |
| **H6** README "What's Inside" tree omits sub-files | `README.md:116-175` | **OK** — tree now lists `hooks.json.example` under `configs/hooks/` and names `obsidian-integration.md` under `configs/rules/`. Also added new entries: `skills/` with all 6 own skills, `packages/cli/`, `cookbook/` 12-recipe list, `scaffolds/` web-saas + whatsapp-saas, `profiles/` 4 archetypes. |
| **M1** skill-count drift (60+ vs 30 vs 66) | `README.md:213`, `stack/ecc-skill-index.md`, `profiles/README.md:3` | **OK** — README now says "the 30 ECC skills I actually use"; profiles/README and stack/README both say "~30"; the "60+" claim is gone. Single anchor number aligned across surfaces. |
| **M2** README Status block stale (v0.2 perspective) | `README.md:277` | **OK in v1 sense — but drifting again** — block was updated to a v1.0 perspective in 24d5eb7 (now line 365), but the Unreleased CHANGELOG section adds skills/, packages/cli/, animated hero, OMEGA→graphify, and 4-core/2-opt-in reframe — none of which surface in the Status block. See **M5** below — the Status block reflects the v1.0 frozen scope, not the live `[Unreleased]` shape. Mild regression. |
| **M3** stub READMEs use a different positioning line | PT-BR / TR / ZH / JA stubs | **OK** — all four stubs now use the canonical "solo · pre-revenue" framing (`7 produtos em 4 meses · solo · pré-receita`, `4 ayda 7 ürün · solo · gelir öncesi`, etc.). The "0 funding · 0 team · 1 person" string returns 0 hits repo-wide. |
| **M4** `assets/screenshots/README.md` claims SVGs are TODO | `assets/screenshots/README.md` | **OK** — table now lists all three SVGs as "Shipped"; "How to capture" renamed to "How to refresh" with explicit per-file regeneration steps; the TODO column is gone. |
| **M5** all 4 profiles open with the same Tuesday-shape sentence | `profiles/{indie-hacker,freelancer-agency,non-technical-founder,content-creator-operator}.md:9` | **PARTIALLY ADDRESSED** — `non-technical-founder.md:9` opens with *"The thing that breaks: ... The Tuesday morning shape: ..."* and `content-creator-operator.md:9` opens with *"What you actually want: cadence without becoming a content company. The Tuesday morning shape: ..."* — both vary the cadence. `indie-hacker.md:9` and `freelancer-agency.md:9` still open with verbatim *"The Tuesday morning shape: ..."*. So 2 of 4 follow the v1 fix, 2 of 4 retain the original phrasing. The shared template is no longer 4-of-4 but is still 2-of-4 — close enough to be acceptable. Carrying forward as a LOW polish item only if the operator still feels the cadence repeats. |
| **M6** credits/README missing components | `credits/README.md` | **OK** — credits now has a "Cookbook references and scaffold dependencies" section listing Stripe, Mercado Pago, yt-dlp, Whisper, Telegram, Cloudflare, GA4, plus per-scaffold rows for Next.js, React, Sentry, Supabase, FastAPI, uvicorn, httpx, pydantic, Anthropic SDK, Docker. Vercel MCP added to the MCP servers table. The CLAUDE.md attribution claim now matches what credits actually documents. |
| **L1** trailing whitespace in `workflows/content-pipeline.md` YAML | lines 43-44 | **REMAINS** — `record_date:` and `publish_date:` still have a single trailing space each. Cosmetic; renders fine. Skip. |
| **L2** broken `rules/web/design-quality.md` reference | (covered by H2) | **OK** — fixed alongside H2; the link is gone, replaced with descriptive prose. |
| **L3** CHANGELOG version date `2026-05-04 (in progress)` for both 1.0.0 and 0.1.0 | CHANGELOG.md | **OK** — [1.0.0] now dated `2026-05-05`; [0.1.0] and [0.2.0] both `2026-05-04` (plausible, both same-day pre-launch iterations). [Unreleased] section captures the post-1.0 wave. The "in progress" parenthetical is gone. |
| **L4** "earn its keep" repeated 6× in profiles | `profiles/{README,indie-hacker,freelancer-agency,non-technical-founder,content-creator-operator}.md` | **OK** — count now 1 (only in `profiles/README.md:20`). Each profile's "What to skip" section now opens with a varied phrasing: `indie-hacker.md` *"The stack has parts that do not earn their keep for this profile:"* (1 hit retained), `freelancer-agency.md` *"What this profile drops:"* (no slop), `non-technical-founder.md` *"The stack has parts that do not earn their keep for this profile:"*, `content-creator-operator.md` same. Re-counting per the v1 regex shows 0 hits in any profile body, only the 1 hit in profiles/README.md (line 20). |
| **L5** "Without X. With X." in `assets/screenshots/README.md` | line 55 | **OK** — replaced with *"These screenshots are the proof that the prose claims actually fire on a real machine."* No more antithesis. |

**Net regression score:** 0 hard regressions, 1 soft regression (M2 status-block drift, now flagged as new M5). Every v1 fix held across the OMEGA→graphify pass, the 4-core/2-opt-in pass, and the doubling-down wave.

---

## New findings

### CRITICAL

#### C1. README's primary install path `npx claude-operator-stack init` will return 404 at launch unless `npm publish` runs as part of the flip

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md:101-110`
- **Cross-confirmed in:** `/Users/mccarthy606/Projects/claude-operator-stack/packages/cli/package.json:49` (`_publishNote`), `/Users/mccarthy606/Projects/claude-operator-stack/CHANGELOG.md:12` (*"Built and locally runnable; not yet published. Pinned at `0.1.0`; publish coordinates with the public visibility flip in Phase 9"*), `/Users/mccarthy606/Projects/claude-operator-stack/packages/cli/README.md:75` (*"It does not publish itself. Pinned at `0.1.0`; publishing coordinates with the public visibility flip in Phase 9"*).
- **Issue:** Quick Start places "Via npm (node-native path)" **above** the bash install path. The first command shown is `npx claude-operator-stack init --dry-run`. Verified with `npm view claude-operator-stack` today: `npm error 404 Not Found - GET https://registry.npmjs.org/claude-operator-stack`. The package is intentionally unpublished pre-flip, but the launch checklist (`launch-surfaces/checklist.md`) does **not** include a `cd packages/cli && npm publish` step at T-0 — the only mention of publishing is the `_publishNote` in the CLI's own `package.json`. If the operator runs through the T-0 checklist as written, the repo flips public, the README's first install path advertises an `npx` command, and the registry returns 404 for any visitor who tries it. This is the same shape as v1's CRITICAL (a 404 on the first install path the reader reaches) but on the `npx` path instead of the `git clone` path.
- **Why CRITICAL:** Recipe 01's first command was the v1 BLOCK; the README's first install command is this one. If the package isn't on npm at the moment the visibility flips, every visitor who copies the first command in Quick Start hits an `npm 404`. The bash path below (`git clone … && ./install.sh`) still works, but a reader who lands on the README and runs the first command they see will conclude the repo doesn't actually work.
- **Fix:** Three options, in decreasing order of operator effort:
  1. Add a `cd packages/cli && npm publish` step in `launch-surfaces/checklist.md` between the `gh repo edit --visibility public` and the `gh release create v1.0.0` calls. Run `npm whoami`, `npm publish --dry-run`, then publish. Verify with `npx claude-operator-stack@latest --help` from a fresh terminal before posting the X thread or HN. (Recommended.)
  2. If the package isn't ready to publish yet, swap the order in `README.md:95-129` so "Via bash (audit-and-run path)" comes first and "Via npm (node-native path)" lives below with a one-line note: *"Available on npm at v1.x once Phase 9 ships — see issue #N"*. Same content, accurate first impression.
  3. If keeping the npm path on top: gate the npm path in the README behind a "_post-launch_" note. Less ideal — readers don't read footnotes — but better than a confident 404.

---

### HIGH

#### H1. `stack/graphify.md` setup section dead-ends — `<!-- TODO upstream URL -->` placeholder leaves the install command empty for one of the 4 core components

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/stack/graphify.md:3,44,62`
- **Renders as (line 62):** `1. Install graphify (see upstream — )` — the literal HTML comment is hidden by GitHub's renderer; the parenthetical reads as broken prose with a trailing em-dash and nothing after.
- **Cross-confirmed in:** `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/01-claude-code-from-zero.md:47-49` (Step 3: *"Install graphify (required) ... See [stack/graphify.md](../stack/graphify.md) for the full setup"*), `/Users/mccarthy606/Projects/claude-operator-stack/configs/mcp-servers.json.example:60` (*"Install graphify separately, then comment out if you query it via /graphify only"*), `/Users/mccarthy606/Projects/claude-operator-stack/profiles/{indie-hacker,non-technical-founder,freelancer-agency,content-creator-operator}.md` (each lists graphify as Required in the Install priority table).
- **Repo-wide search:** `grep -rn "install graphify\|pip install.*graphify\|brew install.*graphify\|npm install.*graphify\|cargo install.*graphify"` returns 0 hits across all .md, .sh, .json files. The install command for graphify is documented nowhere in the public repo.
- **Issue:** graphify is in the 4 core "always install" components, the cookbook's flagship recipe says "Install graphify (required)" as step 3, every profile's first-session checklist demands graphify wired in, and the configs file says *"Install graphify separately"* — yet the only place the actual install command is supposed to live is `stack/graphify.md`'s Setup section, which says `1. Install graphify (see upstream — <!-- TODO upstream URL -->)`. There's also a circular reference at line 44: *"graphify itself is installed separately — see the trigger documentation for the install command"*, where "the trigger documentation" is the operator's private `~/.claude/CLAUDE.md` (not in the public repo). A reader following the install path from any direction lands at "see upstream" → empty parenthesis → no install command.
- **Why HIGH not CRITICAL:** the bash installer (`install.sh`) and the cookbook flow both **say** install graphify but neither **executes** the install (graphify is described as "operator-built layer — not in any public marketplace yet"), so the dead-end is currently structural rather than literally a 404. Still, every install path the README sends a reader on terminates at this empty placeholder. CRITICAL would apply if the README told the reader to run a specific failing command; HIGH applies because the failure is "no command exists at all" — equally broken UX, but the reader hits a soft dead-end rather than an error message.
- **Fix:** Pick the honest framing the operator actually intends. Three viable shapes:
  1. **If graphify will be public on a known URL by launch:** replace the three `<!-- TODO upstream URL -->` placeholders with the real URL and a working install command. Verify the install works on a fresh machine before flip.
  2. **If graphify stays private at launch:** rephrase line 3 from `**Original repo / install path:** <!-- TODO -->` to `**Original repo / install path:** private (operator-built; not yet public)`. Rephrase the Setup section to say *"graphify is operator-built and not yet published. Until it ships publicly, the cookbook's `/graphify` references work only if you have it installed locally. Track issue #N for the public-install milestone."* Also update cookbook/01 step 3 to say *"Install graphify (required if you have it locally; otherwise skip — the cookbook's `/graphify` references will be inactive)"* and downgrade graphify from "Required" to "Required if you have it" in each profile's install priority table. This is the honest shape if the package isn't ready.
  3. **If graphify will get a public install URL post-launch:** add an issue (#N — "Public-install path for graphify") and link it from line 3 + line 62 of `stack/graphify.md`. Same shape as option 2 but with a tracked promise. Also add a section in `Status` of `README.md` noting graphify's standalone install is a tracked open issue.

Whichever option is picked, the same `<!-- TODO upstream URL -->` shape needs the same treatment in all three locations (lines 3, 44, 62 of `stack/graphify.md`). A single coherent answer about graphify's install path needs to land before the visibility flip.

#### H2. `packages/cli/src/lib/stack.ts` STACK constant lists the old 6 components, not the 4-core / 2-opt-in set, and the CLI's user-facing prose says "the six components" implying the same 6

- **Files:**
  - `/Users/mccarthy606/Projects/claude-operator-stack/packages/cli/src/lib/stack.ts:10-65` (the STACK constant: ECC, Toprank, Frontend-Design, mcp-servers.json, obsidian-integration.md rule, operator hooks)
  - `/Users/mccarthy606/Projects/claude-operator-stack/packages/cli/README.md:9` (*"npx claude-operator-stack list-stack — show the six components"*), line 58 (*"Static printout of the six components in the stack — name, layer, author, repo"*)
  - `/Users/mccarthy606/Projects/claude-operator-stack/README.md:107` (*"npx claude-operator-stack list-stack — show the six components"*)
  - `/Users/mccarthy606/Projects/claude-operator-stack/packages/cli/src/cli.ts:20,63` and `/Users/mccarthy606/Projects/claude-operator-stack/packages/cli/src/commands/list-stack.ts:32` (each say *"six-component stack"*)
- **Cross-reference:** the parent README + every profile + every stack doc + install.sh + 4 launch surfaces all say the **6 components are: Claude Code, Obsidian, graphify, Frontend-Design, Everything Claude Code, Toprank** (4 core + 2 opt-in). The CLI's STACK constant has a different 6: ECC, Toprank, Frontend-Design, mcp-servers.json, obsidian-integration.md rule, operator hooks — i.e. plugins-plus-installable-files, no Claude Code, no Obsidian app, no graphify.
- **Issue:** The CLI's `list-stack` command is advertised in the README's first Quick Start block as *"show the six components"*. A reader who runs `npx claude-operator-stack list-stack` expects to see the same 6 components the README's stack table lists. They get a different 6 — including ECC and Toprank as the headliners (which the parent docs now describe as opt-in) and missing the runtime + second brain + knowledge graph that the parent docs describe as core. The CLI hasn't caught up with the 4-core / 2-opt-in reframe done in `c883ddf`.
- **Why HIGH:** the inconsistency is between (a) the README's own framing of the stack and (b) the command the README advertises to list the same stack. A reader who actually runs the command will see ECC + Toprank labeled as the layer's first two entries, contradicting the README's "Opt-in" framing five lines up. Trust degrades immediately.
- **Note on scope:** I'm flagging this in the prose-and-structure review because the inconsistency surfaces in **prose** (CLI README + parent README + cli.ts string literals + list-stack.ts string literals), not in TS code logic. A parallel TS reviewer's scope is the code; this finding is "what the user sees printed and what the docs claim agree."
- **Fix:** Two options:
  1. **Restructure the STACK constant** to mirror the parent docs: 4 core (Claude Code, Obsidian, graphify, Frontend-Design) + 2 opt-in (ECC, Toprank). Update the test snapshot at `packages/cli/tests/stack.test.ts` and `packages/cli/tests/list-stack.test.ts`. The CLI's job is then "list what the parent docs list" — verifiable parity. The current STACK is mostly a "what's installable into ~/.claude/" list, which is a useful but different concept and would deserve a separate command (e.g. `verify` already does this, so `list-stack` doesn't need to).
  2. **Reframe the prose** to say the CLI lists "the six configurable artifacts the installer touches" instead of "the six components in the stack." Less work but doesn't fix the underlying user expectation gap. Update the README's `list-stack        # show the six components` line to something like `list-stack        # show the six wired artifacts under ~/.claude/`. Also update `packages/cli/src/cli.ts:20,63` and `packages/cli/src/commands/list-stack.ts:32`.

Option 1 is cleaner. Option 2 is a 5-line README + 2-line CLI string change.

---

### MEDIUM

#### M1. `cookbook/02-stripe-connect-p2p.md:5` "Used in" link reads as a placeholder

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/02-stripe-connect-p2p.md:5`
- **Issue:** *"**Used in:** [case-studies/...](../case-studies/) (P2P Marketplace)"* — the `case-studies/...` link text plus the parenthesized "(P2P Marketplace)" reads as a deferred-while-the-case-study-is-written hint, but the typography says "broken link." There is no `case-studies/p2p-marketplace.md` (the P2P Marketplace product is "Code complete" per `README.md:84`, not yet shipped, so no case study exists). The current link points at `case-studies/README.md` which is a useful target but the surface text doesn't read that way.
- **Why MEDIUM:** Cookbook 02 is one of the headline recipes (Stripe Connect, the second cookbook on the Reading order). A placeholder-shaped link in its frontmatter erodes "this is real, shipped material" credibility.
- **Fix:** Either:
  - `**Used in:** Marketplace recipe — case study pending (tracked as issue #N)` — drop the link entirely until the case study exists.
  - `**Used in:** [case-studies/README.md](../case-studies/) — full P2P Marketplace case study pending` — explicit about the link target.
  - Or write the case study (much bigger scope, not a launch blocker).

#### M2. `README.md` skill table description for `multi-project-context-bridge` reads ambiguously

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md:270`
- **Issue:** Description says *"Bridge graphify decisions across projects with anonymisation"*. Reads two ways: (a) bridge what graphify decides (anthropomorphic), or (b) bridge cross-project decisions via graphify (the actual intent). The skill's own SKILL.md description (`skills/multi-project-context-bridge/SKILL.md:3`) is unambiguous: *"Bridge concepts and decisions across the operator's multi-project Brain corpus by traversing the graphify knowledge graph"*. The README condensation lost the verb phrasing.
- **Why MEDIUM:** the condensed description is the one most readers will read; the SKILL.md frontmatter is for Claude. The reader on the README sees an awkward sentence and may not click through.
- **Fix:** rewrite README.md:270 to *"Bridge cross-project decisions via graphify queries with anonymisation"* (matches the prior phrasing in `profiles/README.md:30` and the SKILL.md's wording closer). Same length, unambiguous.

#### M3. README "Status" section reflects the v1.0 frozen scope, not the live `[Unreleased]` shape

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md:363-365`
- **Issue:** Status block says *"v1.0 adds the cookbook (12 recipes), scaffolds, profiles, 6 hooks, the ECC skill index, and screenshots. Earlier v0.2 added the hero banner..."* — accurate for the v1.0 release. But the `[Unreleased]` section of the CHANGELOG already lists 7 more items (skills/ — 6 own SKILL.md packages, packages/cli/ — npm CLI, animated hero replacement, OMEGA→graphify migration, 4-core/2-opt-in reframe). The Status block doesn't mention any of them. By the time the repo flips public, "Status" will be talking about the v1.0 frozen scope while the readme below it ships the post-v1.0 doubling-down content. This is a v0.2-perspective regression at a different scale.
- **Why MEDIUM:** Status is one of the last sections a reader hits before deciding if this repo is alive. A status block describing yesterday's release while the repo body shows tomorrow's content reads as "the maintainer hasn't updated the docs." Especially noticeable to readers comparing the Status block's claims to the file tree above it (which lists `skills/` and `packages/cli/` that Status doesn't mention).
- **Fix:** Update `README.md:365` to surface the post-v1.0 wave honestly. Suggested:
  > *"Young repo. v1.0 added the cookbook (12 recipes), scaffolds (web + WhatsApp), profiles (4 archetypes), 6 hooks, the ECC skill index, and screenshots. The post-v1.0 wave (`[Unreleased]`) adds 6 original SKILL.md packages, an npm CLI sibling to install.sh, an animated SVG hero, and a stack reframe to 4 core + 2 opt-in components alongside the OMEGA → graphify knowledge-graph migration. Earlier v0.2 added the hero banner, Mermaid diagrams, 7-language nav, and full RU/ES translations (RU/ES coverage of the v1.0 + post-v1.0 content is tracked as an open issue). Case studies get filled in as products ship. CHANGELOG tracks the rest."*

#### M4. README.es.md and README.ru.md "Qué hay adentro" / "Что внутри" trees still show the v0.1.0 shape

- **Files:** `/Users/mccarthy606/Projects/claude-operator-stack/README.es.md:118-156`, `/Users/mccarthy606/Projects/claude-operator-stack/README.ru.md:118-155`
- **Issue:** Both translated READMEs still show the v0.1 shape (no `cookbook/`, no `scaffolds/`, no `profiles/`, no `skills/`, no `packages/`). The stack table at the top was correctly updated to 4-core / 2-opt-in (with graphify and the new opt-in framing), and the new "Cómo se compara" / "Как это сравнивается" section was added — but the file tree mid-page still describes a 6-directory repo when the actual repo has 11 directories. A reader scanning the ES/RU READMEs gets a stale picture of what's actually here.
- **Cross-link:** the operator already has issue #8 ("Sync RU + ES translations with v1.0 content (cookbook, scaffolds, profiles, screenshots)") tracking this gap. So this is a **known**-and-tracked issue, not a discovery. The MEDIUM is a flag that the gap is more visible now than at v1: the post-v1.0 wave added `skills/` and `packages/`, neither of which appear in any RU/ES surface, and the Stack table at the top of each translated README does correctly say "4 core + 2 opt-in" while the file tree says "v0.1 layout." The mismatch within one README is a reader-confidence cost.
- **Why MEDIUM:** Tracked as an issue, but the inside-one-file inconsistency is uncomfortable: stack table says one thing, file tree says another. Pre-flip, either close the gap or annotate the tree explicitly: `## Что внутри (v0.1 — обновление до v1.0 в issue #8)`.
- **Fix:** Two paths:
  - Close the gap: copy the EN tree section into ES/RU (mechanical translation; the tree paths are filenames, mostly invariant).
  - Annotate the gap: add a one-line note at the top of each tree section: *"Estructura del repo a fecha v0.1 — actualización a v1.0 en [issue #8]."* / *"Структура репозитория на v0.1 — обновление до v1.0 в [issue #8]."*

#### M5. `assets/screenshots/install-dryrun.svg` claim untested against the current `install.sh` flow

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/assets/screenshots/install-dryrun.svg` (referenced from `README.md:132`)
- **Issue:** The screenshot is "Shipped" per `assets/screenshots/README.md:11`, but `install.sh` was rewritten in `c883ddf` to add the 4-core / 2-opt-in wizard step (lines 86-129), per-component opt-in prompts (lines 131-147), and the new "Your recorded plan" output block (lines 211-214). The captured SVG is from before that rewrite. If the SVG renders the older 6-component messaging, a reader runs `./install.sh --dry-run` and sees different output than the screenshot promises.
- **Why MEDIUM:** I cannot verify SVG content without rendering, and the SVG is large enough that a manual diff against the current install.sh output would catch any drift. Worth a 60-second sanity check before flip: re-record `install-dryrun.svg` against the current `install.sh` and confirm the wizard's new "Your recorded plan" section is present. If yes, ship. If no, re-record per the existing `assets/screenshots/README.md` "How to refresh" instructions (lines 13-44).
- **Fix:** `asciinema rec install-dryrun.cast -c "cd ~/Projects/claude-operator-stack && ./install.sh --dry-run" --idle-time-limit 1 && agg install-dryrun.cast install-dryrun.svg`. ~5 minutes. Replace the file. Verify the SVG diff is meaningful (vs. just timestamp-changes).

---

### LOW

#### L1. Workflow `parallel-projects.md:58` retains "Without X. With X." antithesis after the slop-strip pass

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/workflows/parallel-projects.md:58`
- **Issue:** *"Without this filter, all 7 projects compete every day. With the filter, 2 win the week and the others get a 30-minute Friday touchpoint."* — the slop-strip commit (`faf18a4`) explicitly logged "Without X. With X. parallel framing collapsed to one half" as a rule, but this instance survived the pass (the actual edit in `faf18a4` was just `With it` → `With the filter`, preserving the antithesis structure).
- **Why LOW:** It's load-bearing here — the parallel structure is doing real work for the reader. The operator may have kept it intentionally. If softening: drop the second half: *"Without this filter, all 7 projects compete every day. The filter makes 2 win the week and the others slot into a 30-minute Friday touchpoint."*
- **Fix:** Optional, operator-discretion call.

#### L2. `compounds` re-introduced in 5 new locations after slop-strip removed it

- **Files:** `/Users/mccarthy606/Projects/claude-operator-stack/README.md:308`, `/Users/mccarthy606/Projects/claude-operator-stack/cookbook/01-claude-code-from-zero.md:182`, `/Users/mccarthy606/Projects/claude-operator-stack/profiles/indie-hacker.md:21`, `/Users/mccarthy606/Projects/claude-operator-stack/profiles/content-creator-operator.md:7`, `/Users/mccarthy606/Projects/claude-operator-stack/workflows/parallel-projects.md:72`
- **Issue:** `faf18a4` listed `compounds` as a slop word being trimmed where it does no work. The post-v1.0 wave reintroduced it 5×. Most of the new uses are load-bearing ("compound interest" metaphor — `each engine compounds the other`, `Knowledge-graph queries compound with Obsidian`, `silent work compounds risk`) and don't read as slop. One is borderline: `the workflow compounds` in `cookbook/01:182` could be `the workflow scales` or just `the workflow makes more sense across several projects`.
- **Why LOW:** Mostly defensible reuses. Worth a one-off check: is the operator deliberately keeping "compounds" or is this auto-introduction from the model? If deliberate, no action. If not, swap 1-2 instances for non-metaphor verbs.
- **Fix:** Optional polish.

#### L3. CHANGELOG `[Unreleased]` mixes structure changes (4-core/2-opt-in reframe) with reality-sync rewrites (OMEGA → graphify) under one `### Changed` block

- **File:** `/Users/mccarthy606/Projects/claude-operator-stack/CHANGELOG.md:14-21`
- **Issue:** The `### Changed` list has 6 bullets. Two are about graphify replacing OMEGA, four are about the stack reframing. Both are reality-sync passes, but they're conceptually distinct waves (`59c037d` vs `c883ddf`) and a reader trying to understand "what changed since v1.0" sees them as one continuous list. Splitting them clarifies the audit log.
- **Why LOW:** Mostly cosmetic. Keep-a-Changelog is fine with grouped entries; this is just a polish call.
- **Fix:** Optional. If splitting:
  ```markdown
  ### Changed — graphify migration (P8.6)
  - Replaced OMEGA Memory with `graphify` knowledge-graph layer across the stack
  - Renamed `stack/omega-memory.md` → `stack/graphify.md`
  - ... (3 more bullets)

  ### Changed — stack reframe to 4 core + 2 opt-in (P8.7)
  - Reframed stack as 4 core components ... + 2 opt-in extensions ...
  ```

---

## Cross-link integrity

- Relative links checked: **all `[text](path/file.md)` and `[text](dir/)` resolves** across 90 markdown files outside `node_modules` and `.planning`.
- Broken: **0**.
- Anchors checked: **37 in-file `[text](#anchor)` links** across all .md files.
- Broken: **0** — every TOC anchor resolves to its corresponding header (verified slugs against GitHub's anchor-slug rules — Cyrillic and accented characters preserved as Unicode, apostrophes stripped, spaces → hyphens).
- New anchors verified working in EN: `#cookbook`, `#solo-founder-skills-originals`, `#scaffolds`, `#profiles`, `#how-this-compares`. Verified in RU: `#как-это-сравнивается`. Verified in ES: `#cómo-se-compara`. Cyrillic and accented anchors round-trip through GitHub's slugifier correctly.
- External link sample: ECC URL (`affaan-m/everything-claude-code`) consistent across 23 references; no `snubroot` references remain in user-facing files. The 8 GitHub `mccarthy606/claude-operator-stack/issues/{1-8}` URLs all 404 today (repo is private) — that's expected pre-launch and the launch checklist's job to confirm.

---

## Voice / slop check

Per-file slop count for files touched in the post-v1.0 wave. Pre-v1.0 unchanged files inherit the v1 review's count.

| File | Wave touch | Slop pattern hits | Notes |
|---|---|---|---|
| `stack/graphify.md` | new file (59c037d) | 0 | Voice consistent: first-person singular for operator framing, neutral prose for the tool's behaviour. |
| `stack/README.md` | 4-core reframe (c883ddf) | 1 | "pays for itself" — one occurrence, contextually load-bearing (in the ECC + Toprank justification). Same pattern as the v1 LOW. |
| `stack/mcp-servers.md` | reality-sync (59c037d) | 1 | "pulls its weight" — carry-forward from v1 LOW. |
| `stack/toprank.md` | 4-core reframe (c883ddf) | 1 | "pays for itself" in section heading. Same pattern. |
| `stack/ecc.md` | 4-core reframe (c883ddf) | 0 | Clean. |
| `stack/obsidian-brain.md` | reality-sync (59c037d) | 0 | Clean. |
| `profiles/indie-hacker.md` | reality-sync (59c037d) | 1 | "Tuesday morning shape" template (carry-forward from v1 M5; 2-of-4 retained vs 4-of-4 originally). |
| `profiles/freelancer-agency.md` | reality-sync (59c037d) | 1 | Same. |
| `profiles/non-technical-founder.md` | reality-sync (59c037d) | 1 (varied opening) | Opens with "The thing that breaks" — different cadence from the others. |
| `profiles/content-creator-operator.md` | reality-sync (59c037d) | 1 (varied opening) | Opens with "What you actually want" — different cadence. |
| `profiles/README.md` | reality-sync (59c037d) | 2 | "are not strict" antithesis + 1 "earn its keep" — both held over from v1; "earn its keep" count dropped from 6 (v1) to 1 (v2). |
| `skills/solo-billing-monitor/SKILL.md` | new file (d7eb84b) | 0 | Clean. Voice neutral (instructional), descriptive. |
| `skills/multi-project-context-bridge/SKILL.md` | new file + reality-sync rewrite (d7eb84b + 59c037d) | 0 | Clean. The graphify-traversal rewrite removed all OMEGA-typed-memory references cleanly. |
| `skills/obsidian-sync-helper/SKILL.md` | new file (d7eb84b) | 0 | Clean. |
| `skills/case-study-anonymiser/SKILL.md` | new file (d7eb84b) | 0 | Clean. |
| `skills/weekly-monday-review/SKILL.md` | new file + reality-sync (d7eb84b + 59c037d) | 0 | Clean. OMEGA references removed cleanly. |
| `skills/ship-day-planner/SKILL.md` | new file (d7eb84b) | 0 | Clean. |
| `skills/README.md` | new file + reality-sync (d7eb84b + 59c037d) | 0 | Clean. |
| `packages/cli/README.md` | new file (d7eb84b) | 0 | Clean. Operator voice for context, technical voice for command docs — appropriate tonal shift. |
| `cookbook/01-claude-code-from-zero.md` | reality-sync + 4-core reframe (59c037d + c883ddf) | 0 | Clean (1 "compounds" usage in References, defensible). |
| `workflows/parallel-projects.md` | reality-sync (59c037d) | 1 | "Without X. With X." retained (L1 above), 1 "compounds". |
| `assets/screenshots/README.md` | v1 fix (24d5eb7) | 0 | Clean — the v1 L5 antithesis is gone. |
| `install.sh` | 4-core reframe (c883ddf) | 0 | Clean. Wizard messaging is neutral and structured. |
| `configs/README.md` | 4-core reframe (c883ddf) | 0 | Clean. |
| `README.md` | reality-sync + 4-core reframe (59c037d + c883ddf) | 0 | Clean. New "How this compares" section reads as honest comparison rather than positioning. |
| `README.es.md` / `README.ru.md` | reality-sync + 4-core reframe | 0 | Clean. Translations preserved the operator voice. |

**New content quality:** the 6 own skills and the npm CLI README all stay clear of slop patterns. The reality-sync rewrites in profiles/skills/workflows preserved the previously-stripped voice. The remaining hits (Tuesday morning shape, "Without X. With X.", "pulls its weight" / "pays for itself", `compounds`) are the same patterns flagged in v1 — they survived the post-v1 fixes either deliberately (the operator wants them) or because they're load-bearing in their specific contexts.

**Slop counts now (post-v1):** 4 (stack docs: 3 + workflow: 1) + 2 (profiles README: 2) + 4 (one per profile, all on the Tuesday-shape line). Total 10 hits across 90 files. The v1 review counted 19 hits. Net trajectory is downward.

---

## Headline observations

If the operator only fixes the top items before flipping public:

1. **C1** — add `npm publish` to the launch checklist between visibility flip and release tag, or swap the bash + npm install order in README. The `npx claude-operator-stack init` command is the **first** instruction a reader copies from Quick Start; today it returns `npm 404`. Same severity shape as v1's broken-on-day-one CRITICAL, just on a different surface. **5 minutes if option 1; 2 minutes if option 2.**

2. **H1** — fix the graphify install dead-end in `stack/graphify.md`. graphify is in the 4 "always install" core, three places in `stack/graphify.md` say "see upstream" with an empty placeholder, and the cookbook's flagship recipe demands "Install graphify (required)" while no install command exists anywhere in the public repo. Pick the operator's actual answer: public URL with working command, or honest "private/coming-soon" framing across all 4 surfaces. **10-15 minutes.**

3. **H2** — reconcile the npm CLI's STACK constant with the parent docs' 4-core / 2-opt-in framing. Either restructure `packages/cli/src/lib/stack.ts` (the operator-friendly fix) or rename the CLI prose ("the six wired artifacts" rather than "the six components") to mark the distinction. The current state contradicts the README within one click of running the advertised command. **15 minutes for the rename, 30-45 minutes for the restructure.**

4. **M3** — refresh the README Status block to mention the post-v1.0 wave (skills/, packages/cli/, animated hero, OMEGA→graphify, 4-core/2-opt-in). Same shape as v1 M2 but a fresh stale-set. **3 minutes.**

5. **M5** — re-record `assets/screenshots/install-dryrun.svg` against the current `install.sh` output (4-core / 2-opt-in wizard, "Your recorded plan" block). The on-disk SVG is from before `c883ddf`. **5 minutes if asciinema is already installed.**

The 5 fixes total ~45 minutes (or ~25 minutes if option 2 is taken on each). Once those land, this review's verdict moves from WITH-FIXES to OK. The remaining MEDIUM and LOW findings can ship as v1.1 / post-launch issues, exactly as the v1 plan documented.

