---
phase: P8.4-own-skills
title: Solo-founder skills marketplace
milestone: M2 — v1.0 Public Launch
status: ready
created: 2026-05-05
target_effort_hours: 6-8
parallelisable_with: [P8.1, P8.2, P8.3]
depends_on: []
files_modified:
  - skills/solo-billing-monitor/SKILL.md
  - skills/multi-project-context-bridge/SKILL.md
  - skills/obsidian-sync-helper/SKILL.md
  - skills/case-study-anonymiser/SKILL.md
  - skills/weekly-monday-review/SKILL.md
  - skills/ship-day-planner/SKILL.md
  - skills/README.md
  - README.md
  - cookbook/README.md
  - CHANGELOG.md
autonomous: true
---

# PLAN — P8.4 — Solo-founder skills marketplace

## 0. Frame

Ship **6** original `skills/<name>/SKILL.md` files at the repo root that target solo-founder use-cases ECC's 182-skill catalog doesn't cover. Each SKILL.md is an **invocable prompt for Claude**, not a doc the human reads — the loader places it under `~/.claude/skills/<name>/` and Claude fires it when the description matches the user's situation.

Hard cap: **6 skills**, no slip to 7 or 8. If a 7th candidate emerges mid-execution, log it as a v1.1 task and ship the 6.

### Goals

1. Every skill is **non-overlapping** with ECC (cross-checked against the live `affaan-m/everything-claude-code/skills/` directory listing pulled at plan-time — see §10).
2. Every SKILL.md is a **prompt for Claude**, not a how-to doc for the human (cookbook owns how-tos).
3. Frontmatter mirrors ECC's convention exactly so the skill loader discovers them when copied to `~/.claude/skills/`.
4. Each skill leans on a concrete repo file (`workflows/...md`, `cookbook/...md`, `stack/...md`, `case-studies/...md`).
5. New `skills/` directory is wired into the README tree + a new H2 section + the TOC, and cross-linked from `cookbook/README.md` so the cookbook-vs-skills distinction is explicit.

### Non-goals (anti-scope-creep)

- **Not** adding a skill loader / runtime — Claude Code already loads SKILL.md files; we're adding content, not infrastructure.
- **Not** writing tests for skills — they're prompts, not code.
- **Not** wiring an MCP server, hook, or CLI command — the npm CLI in P8.3 owns installer ergonomics; this phase ships pure markdown.
- **Not** translating skills into RU/ES/etc. — translations are a separate v1.1 task; English-only for v1.0.
- **Not** duplicating ECC functionality — if a skill is even adjacent to an ECC skill, the `## When to Use` section disambiguates.
- **Not** shipping more than 6 skills — `cookbook-add-recipe` from the suggested seven is **deferred** (rationale in §1).

---

## 1. Skill selection — final 6 + non-overlap claims

ROADMAP suggests 7 candidates. Final cut: **6**. Drop `cookbook-add-recipe` because (a) cookbook authoring is a one-time act per recipe, not a recurring workflow, so the skill would fire too rarely to earn its slot, and (b) adding a recipe is mechanically a copy-the-template-and-fill-it action, which doesn't need an invocable prompt — a `cookbook/_template.md` file would serve the same purpose more cheaply. Logged for v1.1 reconsideration.

| # | Skill | Why it ships | Non-overlap claim vs ECC |
|---|-------|--------------|--------------------------|
| 1 | `solo-billing-monitor` | Weekly cost rollup across Vercel + Railway + Supabase + Anthropic + OpenAI is a real recurring solo-founder pain point (referenced in `workflows/solo-ops.md` Surface 4). High-frequency invocation. | ECC has `customer-billing-ops` (billing **customers**), `finance-billing-ops` (financial-ops), `ecc-tools-cost-audit` (audits ECC's own tooling cost). None do solo-founder cross-cloud cost rollup. |
| 2 | `multi-project-context-bridge` | The "where was I on project A?" tax compounds across 7 projects (per `workflows/parallel-projects.md`). Bridging OMEGA decisions tagged by project — with anonymisation — is what makes context-window-isolated sessions stop feeling siloed. | ECC has `context-budget` (token budgeting) and `strategic-compact` (compaction). Both operate **inside** one session. None bridge **across** OMEGA-tagged projects with anonymisation. |
| 3 | `obsidian-sync-helper` | The Obsidian-as-context loop only works if `~/Brain/Projects/<name>.md` matches the project's actual git state. Drift kills the loop silently. Verification skill plugs the leak. | ECC has zero `obsidian-*` skills. The closest adjacent skills (`knowledge-ops`, `project-flow-ops`) are generic project-state and don't know about `~/Brain/Projects/<name>.md` convention. |
| 4 | `case-study-anonymiser` | The anonymisation discipline (`Discipline A/B/C` aliases, URL stripping, name redaction) is a recurring pre-publish step — see `case-studies/niche-booking-trio.md` for the playbook in action. Errors here are reputational. | ECC has zero anonymisation/redaction skills. `seo` and `brand-voice` operate on tone, not on PII/identifier scrubbing. **Hard non-overlap.** |
| 5 | `weekly-monday-review` | The Monday 30-min "where are we" loop in `workflows/parallel-projects.md` Habit 2 is the keystone of the parallel-projects discipline. A skill that runs it consistently is the highest-leverage ritual to encode. | ECC has `dashboard-builder` (builds dashboards as artefacts) and `project-flow-ops` (generic). Neither does the **2-of-N focus pick** + paused-project status update specific to the Monday loop. |
| 6 | `ship-day-planner` | The 8-block ship-day in `workflows/ship-a-product-in-a-day.md` is the most-quoted workflow in the repo. A skill that takes a one-line idea and produces the 8 blocks lets Claude run the workflow directly. | ECC has `blueprint` (architecture decisions) and `team-builder` (multi-agent setup). Neither targets the **one-day-to-live-URL** cadence with the specific 8 blocks (domain → skeleton → forms → deploy → SEO → content → post-day). |

**Cross-check evidence:** ECC catalog pulled via `gh api repos/affaan-m/everything-claude-code/contents/skills --jq '.[].name'` at plan-time. None of the 6 chosen kebab-case names exist in the catalog. Re-run the same command at execute-time before creating each directory; abort and rename if a collision appears (vanishingly unlikely in 6-8h window but the check is cheap).

---

## 2. Skill anatomy — frontmatter shape

Every SKILL.md opens with this exact YAML block. Mirrors ECC's `accessibility/SKILL.md` convention so the loader treats our skills identically.

```yaml
---
name: <kebab-name>
description: <single sentence — Claude uses this to decide when to fire. Must read like an "if-then": "Use when ... to ...". Past tense or aspirational tense both fail.>
origin: claude-operator-stack
---
```

Rules for the `description` field (enforced in §11 quality bar):

- One sentence, ≤200 chars.
- Starts with a verb in imperative mood (`Audit`, `Bridge`, `Verify`, `Anonymise`, `Run`, `Plan`).
- Names the trigger condition (`when reviewing the week`, `before publishing a case study`).
- Names the output (`producing a 2-of-N focus list`, `returning a redacted draft`).
- No marketing language. No emojis. No exclamation marks.

`origin: claude-operator-stack` is the discriminator. ECC uses `origin: ECC`. The two coexist — Claude can have both directories under `~/.claude/skills/` and dispatches by `description` matching.

---

## 3. SKILL.md content template

Every SKILL.md uses this exact section ordering. The body is **a prompt for Claude**, second person ("you"), not third person ("the skill does X").

```markdown
---
name: <kebab-name>
description: <one-sentence trigger + output>
origin: claude-operator-stack
---

# <Title Case Name>

<One-paragraph framing — what situation triggered this skill, what it produces, why it earns its slot vs hand-rolling. ≤120 words.>

## When to Use

- <3-5 concrete situations. Each bullet starts with a verb. Each is a real moment, not a category.>
- <First bullet should be the most-common trigger. Last bullet covers an edge case.>
- <If there is any chance of overlap with an ECC skill, include a bullet: "ECC's `<name>` skill is similar but operates on <X>; use this one when <Y>.">

## Inputs

- <What the skill needs from the user or context. File paths, config locations, what to ask the user for if missing.>
- <Be explicit about defaults — "if the user doesn't specify, assume `~/Brain/Projects/`".>
- <If the skill reads OMEGA, list the tags it queries. If it reads files, list the paths.>

## How It Works

Numbered steps. **Minimum 4 steps**, ideally 5-8. Each step is an **instruction to Claude**, not a description of the skill.

1. <First action — usually "load context" or "read input".>
2. <Second action — usually a transform or query.>
3. <Third action — usually a check or branch.>
4. <Fourth action — usually output formatting.>
5. <Optional 5th-8th — refinement, follow-up offers, persistence.>

## Output shape

<Exact shape of what the skill returns to the user. Markdown table? Bulleted list? File written to disk? Be concrete — Claude needs to know whether to print, write, or both.>

```
<Optional code-block sketch of the output format.>
```

## Anti-patterns

- <When NOT to use this skill — situations that look similar but warrant a different tool.>
- <Things the skill must refuse to do — e.g. auto-send, auto-commit, money movement.>
- <Voice anti-patterns — e.g. "do not output emojis", "do not use marketing language".>

## Related

- `workflows/<file>.md` — <one-line link reason>
- `cookbook/<file>.md` — <one-line link reason if cookbook recipe exists>
- `stack/<file>.md` — <one-line link reason if stack component is involved>
- ECC `<skill-name>` — <one-line link reason if disambiguation needed>
```

**Length envelope:** 80-200 lines per SKILL.md (enforced in §11). The framing paragraph + 5 H2 sections + numbered steps gets you to ~80 lines naturally; capping at 200 keeps each skill scannable.

---

## 4. Per-skill 1-paragraph specs

Each spec below is the brief the executor writes against. Trigger (when Claude fires the skill), Input shape (what it consumes), Algorithm (what it does in plain English), Output (what it returns), Cross-references (which repo file it leans on).

### 4.1 `solo-billing-monitor`

**Trigger:** the user asks for a cost rollup, a weekly cost check, or any variant of "how much am I spending across the stack" across cloud/AI services. Most-likely invocation: end-of-week cost-creep audit per `workflows/solo-ops.md` Surface 4. **Input:** the user names the services in scope (default set: Vercel, Railway, Supabase, Anthropic, OpenAI, Cloudflare); current usage data either pasted by the user or read from CSV exports the user provides. **Algorithm:** for each service, parse current-week spend; compare to prior-week spend (if provided); flag any line item >30% week-over-week as `INVESTIGATE`; produce a markdown table sorted by absolute weekly spend descending; append a "watch list" section for items at 15-30% delta. **Output:** a markdown table (`Service | This week | Last week | Δ% | Status`) plus a 1-3 line summary of total spend and any flagged lines. **Cross-references:** leans on `workflows/solo-ops.md` Surface 4 ("Cost monitoring is separate") and on the principle in `workflows/parallel-projects.md` that cost-creep on a paused project is the silent killer. Disambiguates from ECC `customer-billing-ops`, `finance-billing-ops`, `ecc-tools-cost-audit` in `## When to Use`.

### 4.2 `multi-project-context-bridge`

**Trigger:** the user is in project A's directory and references context from project B ("we decided X for the marketplace, what was the equivalent for the legal tool?"); or the user explicitly says "bridge context from <project>". Frequently fires at the start of a session when switching between the 2-of-N focus projects from the Monday review. **Input:** a source project name (the one the decisions were tagged under) and a target project (current working directory inferred from `pwd`); optional anonymisation level (`strict` = full alias map, `loose` = strip URLs/keys only, default `strict`). **Algorithm:** query OMEGA for decisions tagged with the source project name; for each decision, run the anonymisation pass (replace project name with `Project-A`, strip URLs, strip API keys, replace counterparty names with `Counterparty-N`); rank by recency and decision-tag relevance to the user's current question; return the top 5 anonymised decisions with their original timestamps. **Output:** a markdown list of bridged decisions, each as `**[YYYY-MM-DD]** <anonymised decision text> _(from <Project-A>)_`. Optional follow-up: "store as a cross-project reference in current project's OMEGA?" **Cross-references:** `workflows/parallel-projects.md` Habit 3 + "What about context windows?" section that establishes OMEGA tagging. Disambiguates from ECC `context-budget` and `strategic-compact` in `## When to Use`.

### 4.3 `obsidian-sync-helper`

**Trigger:** the user is in a project directory and asks to "verify the Obsidian note", "sync the brain", or any variant. Also fires when the user is about to do a Monday review (chained from `weekly-monday-review`). **Input:** project name (default: derive from `pwd` basename); path to Obsidian vault (default `~/Brain`); read-only flag (default `true` — never write to the vault without explicit confirmation). **Algorithm:** locate `~/Brain/Projects/<name>.md`; parse frontmatter (`status`, `repo`, `url`, `stack`); compare `repo` URL to current `git remote get-url origin`; compare `status` to git activity (last commit timestamp; uncommitted changes count); compare open-tasks checklist to recent commit messages (heuristic: words in unchecked tasks that appear in last 10 commit messages may be candidates for "tick"); compare decisions log entries to recent commit messages with `feat:`/`refactor:`/`fix:` prefixes (decisions that map to commits may be already-shipped). **Output:** a markdown report with three sections — `## Drift detected` (concrete mismatches), `## Suggested updates` (specific edits to the note, never auto-applied), `## OK` (what matches). **Cross-references:** `stack/obsidian-brain.md` for the integration rule + project-note frontmatter convention; `workflows/parallel-projects.md` Habit 1 for the "if it isn't in the note, it doesn't exist" principle. No ECC overlap — disambiguation in `## Anti-patterns` notes that ECC has no Obsidian skill.

### 4.4 `case-study-anonymiser`

**Trigger:** the user is about to publish a case study, blog post, or public artefact that references their actual products and asks to anonymise it; or the user pastes a draft and says "scrub this". **Input:** a draft markdown file path (or pasted content); the operator's known-real identifiers (real product names, real domains, real customer names — supplied by user or read from a `.anonymisation-map.local` file in the repo, gitignored); target alias scheme (`Discipline A/B/C` for related products, `Project-1/2/3` for unrelated, `Counterparty-N` for partners — see `case-studies/niche-booking-trio.md` for the live example). **Algorithm:** load the draft; for each known-real identifier, replace with the agreed alias (the same real → alias mapping must be consistent within the draft); strip absolute URLs (replace `https://example.com/page` with `[redacted]`); strip API key patterns (`sk-…`, `pk_…`, `AIA…`, etc.); strip jurisdiction-specific legal names; run a final grep over the redacted draft for the operator's known-real identifier set and fail loudly if any survived; return both the redacted draft AND a one-section diff showing what changed. **Output:** the redacted draft as a fenced markdown block + a `## Redaction diff` section listing every substitution + a `## Final grep result` confirming zero matches of known-real identifiers. **Cross-references:** `case-studies/README.md` ("URLs and customer specifics are deliberately omitted; the patterns are the part worth sharing") and `case-studies/niche-booking-trio.md` (the live `Discipline A/B/C` aliasing pattern). The `cookbook/ops-sanitising-claude-directory.md` slap pattern is mentioned in `## Related` as the adjacent discipline for `.claude/` directories.

### 4.5 `weekly-monday-review`

**Trigger:** Monday morning; user says "let's do the weekly review", "Monday review", or invokes the skill explicitly. May also auto-fire if the user runs the skill on any other day with `--force` (the discipline is Monday but the mechanism is the same). **Input:** path to the operator's project notes directory (default `~/Brain/Projects/`); the operator's stated weekly capacity (default: 2 focus projects + 3 Friday-touchpoint projects + remaining paused, per `workflows/parallel-projects.md` Habit 2). **Algorithm:** scan `~/Brain/Projects/*.md` for files with `status: active` in frontmatter; for each, extract: open tasks count, days-since-last-commit (via `git log` against the project's repo URL from frontmatter), open questions count, last decision timestamp; rank by a "needle-mover" heuristic — projects with revenue evidence pending or imminent milestones rank high, projects with stale silent work (>4 days no commit, per Habit 3 third-rail rule) rank lower because they need a small visible step before more focus is warranted; produce 4 sections — `## Focus this week (2)`, `## Friday touchpoint (3)`, `## Paused (rest)`, `## Force-visible (any silent-for-4+-days)`. **Output:** a markdown report with the four sections, each project a bulleted line `- **<project>** — <one-line rationale> · <next concrete action>`. Optional follow-up: "update the `status:` field in each project's note to reflect this week's classification?" (read-only by default; require user confirmation to write). **Cross-references:** `workflows/parallel-projects.md` Habit 2 for the loop, Habit 3 third-rail rules for the force-visible logic. Chains to `obsidian-sync-helper` if drift is detected during the scan.

### 4.6 `ship-day-planner`

**Trigger:** the user has a one-line product idea and says "let's plan a ship day for this", "split this into the 8 blocks", or any variant; also fires at the start of a focused day-of-shipping session. **Input:** a one-sentence product hypothesis from the user (the "what do I believe about this market" sentence from `workflows/ship-a-product-in-a-day.md` block 0); optional pre-pinned visual direction (per `stack/frontend-design.md`); optional stack overrides (default: Next.js 15 + Supabase + Vercel + GA4 + Cloudflare per the workflow). **Algorithm:** prompt the user for the hypothesis sentence and the "ask" sentence if not provided; produce the 8 blocks from the workflow as a structured day-plan with timeboxes — (0) night-before Obsidian frame [15 min], (1) domain + repo [30 min], (2) skeleton + visual direction [90 min], (3) forms + analytics [60 min], (4) deploy [30 min], (5) SEO baseline [45 min], (6) first content piece [60 min], (7) post-day update [15 min]; for each block, include the specific commands or skills to invoke (e.g. block 2 cites ECC `feature-dev`; block 5 cites Toprank `seo-audit`); list the 4 anti-patterns from the workflow as a `## Don't drift here` block. **Output:** a markdown day-plan with 8 numbered blocks, each as `### Block N: <name> [<duration>]` followed by what to do, what tool/skill/command to invoke, and a one-line "done when" criterion. Ends with the anti-patterns block. **Cross-references:** `workflows/ship-a-product-in-a-day.md` (entire workflow is the source-of-truth); `stack/frontend-design.md` for the visual-direction pin; `cookbook/04-cloudflare-argo-local-dev.md` and `cookbook/05-ga4-cloudflare-analytics.md` referenced in blocks 3 and 4.

---

## 5. `skills/README.md` index design

Single file at `skills/README.md` that introduces the directory, states the cookbook-vs-skills distinction, and tables the 6 skills.

```markdown
# Solo-founder Skills (Originals)

Six original SKILL.md packages targeting solo-founder use-cases ECC's 182-skill catalog doesn't cover. Each skill is a prompt Claude executes when its description matches your situation — copy the directory under `~/.claude/skills/<name>/` and Claude Code discovers it automatically.

These ship alongside [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), not instead of it. Both directories coexist under `~/.claude/skills/`; Claude dispatches by `description` matching.

## Cookbook vs Skills

| | Cookbook | Skills |
|---|----------|--------|
| **Audience** | The human operator reads it | Claude executes it |
| **Shape** | How-to doc, ~100-200 lines, problem → solution → code → pitfalls → references | Invocable prompt, ~80-200 lines, frontmatter + numbered steps for the agent |
| **When to read** | When you sit down to wire X for the first time | Never — Claude fires it when the situation triggers |
| **Example** | `cookbook/02-stripe-connect-p2p.md` walks you through Stripe Connect | `skills/solo-billing-monitor/SKILL.md` runs your weekly cost rollup |

## The 6 skills

| Skill | Use case | Path |
|-------|----------|------|
| `solo-billing-monitor` | Weekly cost rollup across cloud + AI APIs; flags >30% W/W jumps | [./solo-billing-monitor/SKILL.md](./solo-billing-monitor/SKILL.md) |
| `multi-project-context-bridge` | Bridge OMEGA decisions from one project into another with anonymisation | [./multi-project-context-bridge/SKILL.md](./multi-project-context-bridge/SKILL.md) |
| `obsidian-sync-helper` | Verify `~/Brain/Projects/<name>.md` matches the project's actual git state | [./obsidian-sync-helper/SKILL.md](./obsidian-sync-helper/SKILL.md) |
| `case-study-anonymiser` | Apply the operator's redaction playbook to a draft case study | [./case-study-anonymiser/SKILL.md](./case-study-anonymiser/SKILL.md) |
| `weekly-monday-review` | Monday review producing the 2-of-N focus pick + paused-project status | [./weekly-monday-review/SKILL.md](./weekly-monday-review/SKILL.md) |
| `ship-day-planner` | Turn a one-line product hypothesis into the 8 ship-day blocks | [./ship-day-planner/SKILL.md](./ship-day-planner/SKILL.md) |

## Install

These ship in this repo. To make Claude discover them, copy the desired skill subdirectory under `~/.claude/skills/`:

\`\`\`bash
cp -r skills/solo-billing-monitor ~/.claude/skills/
\`\`\`

Or use the install script (see [`install.sh`](../install.sh) — Phase 8.3 npm CLI will add a `claude-operator-stack add-skill <name>` flow as a first-class option).

## Convention

Every SKILL.md in this directory:

- Has frontmatter with `name`, `description`, `origin: claude-operator-stack`
- Mirrors ECC's section convention so the loader and the audience treat them identically
- Is non-overlapping with ECC at the trigger-condition level (verified at plan-time against `affaan-m/everything-claude-code/skills/`)
- References at least one concrete repo file (`workflows/...md`, `cookbook/...md`, `stack/...md`, or `case-studies/...md`)

## Related

- [cookbook/](../cookbook/) — how-to recipes for the human operator
- [workflows/](../workflows/) — the operator playbook these skills lean on
- [stack/ecc-skill-index.md](../stack/ecc-skill-index.md) — the curated reading order into ECC's 182 skills
```

The cross-link to `cookbook/README.md` is bidirectional — `cookbook/README.md` gets a "Related" addition (see §6) that points back here.

---

## 6. Repo-root README.md changes

Three precise insertions, no rewrites:

### 6.1 TOC entry (after "Cookbook", before "Scaffolds")

In the `## Contents` block (currently lines ~22-35), insert after the "Cookbook" line:

```markdown
- [Solo-founder skills (originals)](#solo-founder-skills-originals)
```

### 6.2 New H2 section (between "Cookbook" H2 and "Scaffolds" H2)

After the existing `## Cookbook` section ends (currently at the line before `---` separating it from `## Scaffolds`), insert:

```markdown
---

## Solo-founder skills (originals)

Six original `SKILL.md` packages targeting solo-founder use-cases ECC's 182-skill catalog doesn't cover. They ship alongside ECC, not instead — both directories coexist under `~/.claude/skills/`.

| Skill | Use case |
|-------|----------|
| [`solo-billing-monitor`](skills/solo-billing-monitor/SKILL.md) | Weekly cost rollup across cloud + AI APIs |
| [`multi-project-context-bridge`](skills/multi-project-context-bridge/SKILL.md) | Bridge OMEGA decisions across projects with anonymisation |
| [`obsidian-sync-helper`](skills/obsidian-sync-helper/SKILL.md) | Verify Brain notes vs git state |
| [`case-study-anonymiser`](skills/case-study-anonymiser/SKILL.md) | Apply the redaction playbook to a draft case study |
| [`weekly-monday-review`](skills/weekly-monday-review/SKILL.md) | Monday review → 2-of-N focus pick |
| [`ship-day-planner`](skills/ship-day-planner/SKILL.md) | One-line idea → 8 ship-day blocks |

Distinction from cookbook: cookbook = how-to docs the operator reads, skills = invocable prompts Claude executes. See [skills/README.md](skills/README.md).
```

### 6.3 "What's Inside" tree update

In the `## What's Inside` code block (currently lines ~119-180), insert a `skills/` block after the `cookbook/` block and before `scaffolds/`:

```text
├── skills/                     ← 6 original SKILL.md packages (invocable prompts)
│   ├── solo-billing-monitor/
│   ├── multi-project-context-bridge/
│   ├── obsidian-sync-helper/
│   ├── case-study-anonymiser/
│   ├── weekly-monday-review/
│   └── ship-day-planner/
│
```

No other README sections change. The Russian/Spanish/etc. translated READMEs are out of scope for this phase per the non-goals — translation pass is a v1.1 task.

### 6.4 `cookbook/README.md` cross-link

In `cookbook/README.md`, the existing `## Related` section (currently lines ~52-56) gets one new bullet:

```markdown
- [skills/](../skills/) — invocable SKILL.md packages Claude executes (cookbook = human reads, skills = Claude executes)
```

---

## 7. Implementation steps — numbered checklist

The executor walks this top-to-bottom. Each step is small enough to verify in isolation.

1. **Re-verify ECC catalog non-overlap.** Run `gh api repos/affaan-m/everything-claude-code/contents/skills --jq '.[].name'` and grep for each of the 6 chosen names. If any collision (vanishingly unlikely), abort and rename to `solo-<original>` variant.
2. **Create skill directories.** `mkdir -p skills/{solo-billing-monitor,multi-project-context-bridge,obsidian-sync-helper,case-study-anonymiser,weekly-monday-review,ship-day-planner}`.
3. **Write `skills/solo-billing-monitor/SKILL.md`** per the spec in §4.1, the template in §3, and the frontmatter in §2. Verify length ≥80 lines and ≤200 lines. Verify `## How It Works` has ≥4 numbered steps. Verify at least one `workflows/...md` reference resolves.
4. **Write `skills/multi-project-context-bridge/SKILL.md`** per §4.2. Same checks.
5. **Write `skills/obsidian-sync-helper/SKILL.md`** per §4.3. Same checks; additionally verify the `stack/obsidian-brain.md` reference resolves.
6. **Write `skills/case-study-anonymiser/SKILL.md`** per §4.4. Same checks; additionally verify the `case-studies/niche-booking-trio.md` reference resolves.
7. **Write `skills/weekly-monday-review/SKILL.md`** per §4.5. Same checks; verify the chain-to-`obsidian-sync-helper` cross-reference resolves to the file written in step 5.
8. **Write `skills/ship-day-planner/SKILL.md`** per §4.6. Same checks; verify `workflows/ship-a-product-in-a-day.md` reference resolves.
9. **Write `skills/README.md`** per §5 verbatim (substituting the actual table content); verify all 6 skill links resolve.
10. **Update repo-root `README.md`** with the three insertions in §6.1, §6.2, §6.3.
11. **Update `cookbook/README.md`** with the one bullet in §6.4.
12. **Run frontmatter verification:** `grep -l "origin: claude-operator-stack" skills/*/SKILL.md | wc -l` must equal 6.
13. **Run skill-count verification:** `find skills/ -name "SKILL.md" -type f | wc -l` must equal 6.
14. **Run cross-reference resolution check:** for each `\.\./` reference inside any SKILL.md, verify the file exists. Also verify `skills/README.md` has no broken links.
15. **Run sanitisation grep:** scan all 6 SKILL.md files for the operator's known-real identifiers (real product names, real domains, real customer names from the operator's `.anonymisation-map.local` if present). Zero matches required. If any match, rewrite using the alias scheme from §4.4.
16. **Run length-bound check:** for each SKILL.md, `wc -l` between 80 and 200 inclusive.
17. **Run "is-this-a-prompt" voice check:** grep for third-person phrases that would indicate documentation drift — `the skill does`, `this skill will`, `users can`. Zero matches required (these phrases mean the file became docs, not prompt). Acceptable second-person: `you`, `you should`, `do not`.
18. **Add CHANGELOG entry** under the unreleased section: `### Added — Phase 8.4: Solo-founder skills marketplace · 6 original SKILL.md packages targeting solo-founder gaps in ECC's catalog`.
19. **Final review:** read all 6 SKILL.md files in one pass to check tone consistency. They should read as if written by the same operator, in the same voice, on the same day.
20. **Commit:** single commit per the operator's preferred granularity. Suggested message: `feat(skills): add 6 original SKILL.md packages for solo-founder use-cases (Phase 8.4)`.

---

## 8. Quality bar — gate before commit

Each SKILL.md must satisfy **every** check below. Failing any one blocks the commit; do not soften the bar.

- [ ] Reads like a prompt for Claude, not a doc for a human (second person, imperative voice in steps).
- [ ] Frontmatter has exactly the three keys: `name`, `description`, `origin: claude-operator-stack`. No extras, no missing.
- [ ] `description` is one sentence, ≤200 chars, starts with imperative verb, names trigger + output.
- [ ] `## When to Use` has 3-5 concrete bullets, each starting with a verb.
- [ ] `## How It Works` has ≥4 numbered steps, each phrased as instruction-to-Claude.
- [ ] At least one cross-reference to a concrete repo file (`workflows/`, `cookbook/`, `stack/`, or `case-studies/`) and the reference resolves.
- [ ] `## Anti-patterns` exists with at least 2 bullets — one "when not to use", one "what the skill must refuse".
- [ ] `## Related` exists with at least 2 entries.
- [ ] File length ≥80 lines and ≤200 lines.
- [ ] No marketing language. No emojis. No exclamation marks.
- [ ] No real product URLs, no real customer names, no API key patterns. Sanitisation grep returns zero hits.
- [ ] No phrase from the third-person blacklist: `the skill does`, `this skill will`, `users can`, `the user will`. (Voice in `## When to Use` and `## Anti-patterns` is naturally third-person describing the operator; the bar applies to the *body* of `## How It Works` and the framing paragraph.)
- [ ] If there is any chance of overlap with an ECC skill, `## When to Use` includes the explicit disambiguation line ("ECC's `<x>` skill is similar but operates on `<y>`; use this one when `<z>`.").

---

## 9. Success criteria + verification commands

Each of the following commands run from the repo root must produce the stated output. Verification is mechanical so a checker can run it in <60 seconds.

| # | Check | Command | Expected |
|---|-------|---------|----------|
| 1 | 6 SKILL.md files exist | `find skills/ -name "SKILL.md" -type f \| wc -l` | `6` |
| 2 | All have `origin: claude-operator-stack` frontmatter | `grep -l "origin: claude-operator-stack" skills/*/SKILL.md \| wc -l` | `6` |
| 3 | All have `name:` frontmatter | `grep -l "^name: " skills/*/SKILL.md \| wc -l` | `6` |
| 4 | All have `description:` frontmatter | `grep -l "^description: " skills/*/SKILL.md \| wc -l` | `6` |
| 5 | `skills/README.md` exists with index table | `test -f skills/README.md && grep -c "\| \`solo-billing-monitor\` \|" skills/README.md` | exit 0 + `1` |
| 6 | Repo README has the new H2 section | `grep -c "^## Solo-founder skills (originals)$" README.md` | `1` |
| 7 | Repo README has TOC entry | `grep -c "Solo-founder skills (originals)" README.md` | `>=2` (TOC + H2) |
| 8 | Repo README tree includes `skills/` | `grep -c "├── skills/" README.md` | `1` |
| 9 | `cookbook/README.md` cross-links to skills | `grep -c "skills/" cookbook/README.md` | `>=1` |
| 10 | No SKILL.md duplicates an ECC skill name | `for s in skills/*/; do n=$(basename "$s"); gh api repos/affaan-m/everything-claude-code/contents/skills/$n 2>/dev/null \| grep -c "Not Found"; done` | every line `1` (i.e. ECC returns 404 for each) |
| 11 | All length-bounded | `for f in skills/*/SKILL.md; do l=$(wc -l <"$f"); test "$l" -ge 80 -a "$l" -le 200 \|\| echo "FAIL $f $l"; done` | empty output |
| 12 | Sanitisation grep clean | `grep -rE "(<known-real-domain>\|<known-real-product-name>\|sk-[a-zA-Z0-9]{20,})" skills/` | empty output |
| 13 | CHANGELOG has Phase 8.4 entry | `grep -c "Phase 8.4" CHANGELOG.md` | `>=1` |

Checks 1-9, 11, 13 are pure-local. Check 10 is the upstream non-overlap re-verification. Check 12 requires the operator to supply the known-real identifier list at execute-time.

---

## 10. Risks + mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Scope creep — slip from 6 to 8 skills.** | High | Hard cap stated in §0; the dropped 7th candidate (`cookbook-add-recipe`) is logged as v1.1, not as a stretch goal. Executor must not add skills beyond the 6 listed in §1 without re-opening the plan. |
| **Voice drift — SKILL.md becomes documentation.** | High | Quality bar in §8 + verification step 17 (third-person blacklist grep) catches this mechanically. Voice rule stated explicitly: SKILL.md is a prompt for Claude, not a doc for the human. |
| **Accidental ECC overlap discovered post-write.** | Medium | Step 1 re-verifies the catalog at execute-time; step 14 verifies cross-references resolve. The disambiguation rule in §3 ("if any chance of overlap") forces the executor to declare the ECC counterpart in `## When to Use`, which surfaces overlap by exposing it. |
| **Sanitisation slip — a real domain or product name lands in a SKILL.md.** | Medium | Verification check 12 + step 15 in §7. The skill bodies are mostly mechanical (steps + output shape), so the surface area for accidental real-identifier inclusion is small — the risk concentrates in the framing paragraphs and `## When to Use` examples. |
| **Cross-references rot if a referenced file doesn't yet exist.** | Low | All references in §4 already exist in the repo (verified at plan-time). The only forward-reference is `cookbook/ops-sanitising-claude-directory.md` mentioned in §4.4 — but that's in `## Related`, not load-bearing, and it's a Phase 1 file (Phase 1 ships before P8.4 in the milestone order). |
| **Skill discovery not actually triggered by description.** | Low | `description` field rules in §2 enforce the "if-then" shape that the skill loader ranks against. Manual smoke test: copy one SKILL.md to `~/.claude/skills/test-<name>/`, ask Claude a trigger sentence, verify the skill fires. Not part of the verification gate (would require a real Claude session) but part of the execute-phase checkpoint. |
| **Quality drift across the 6 — first 2 are great, last 2 are skeletal.** | Low | Same risk pattern as the cookbook (per ROADMAP §1). Mitigation: write skills in shuffled order — `case-study-anonymiser` → `solo-billing-monitor` → `weekly-monday-review` → `obsidian-sync-helper` → `ship-day-planner` → `multi-project-context-bridge`. If energy wanes, the lower-quality ones fall in the middle, not at the end. |

The two top risks (scope creep + voice drift) are exactly the ones flagged in ROADMAP §"Two risks to watch" — restated here so the executor sees them at the gate.

---

## 11. Estimated time breakdown

Target ~6-8h total. Block budget:

| Block | Activity | Time |
|-------|----------|------|
| 0 | Re-verify ECC catalog + create directories (steps 1-2) | 15 min |
| 1 | `case-study-anonymiser` (step 6) — heaviest because of the redaction algorithm spec | 60 min |
| 2 | `solo-billing-monitor` (step 3) | 50 min |
| 3 | `weekly-monday-review` (step 7) — touches OMEGA + Obsidian + git heuristics | 60 min |
| 4 | `obsidian-sync-helper` (step 5) | 50 min |
| 5 | `ship-day-planner` (step 8) — leans heavily on existing `workflows/ship-a-product-in-a-day.md` so writing time is shorter | 40 min |
| 6 | `multi-project-context-bridge` (step 4) | 50 min |
| 7 | `skills/README.md` + repo `README.md` + `cookbook/README.md` updates (steps 9-11) | 45 min |
| 8 | Verification (steps 12-17), CHANGELOG (step 18), final review (step 19), commit (step 20) | 30 min |
| | **Total** | **~6h 20 min** |

Buffer of ~1-1.5h before hitting the 8h cap, absorbing one stuck skill or one round of voice-drift rework. If any single skill block runs past 90 min, that's a signal to drop a section depth and ship the skill — the bar is "earns its slot", not "exhaustive".

---

## 12. Files affected

| Path | New / Modified | Purpose |
|------|----------------|---------|
| `skills/solo-billing-monitor/SKILL.md` | New | Skill 1 |
| `skills/multi-project-context-bridge/SKILL.md` | New | Skill 2 |
| `skills/obsidian-sync-helper/SKILL.md` | New | Skill 3 |
| `skills/case-study-anonymiser/SKILL.md` | New | Skill 4 |
| `skills/weekly-monday-review/SKILL.md` | New | Skill 5 |
| `skills/ship-day-planner/SKILL.md` | New | Skill 6 |
| `skills/README.md` | New | Index + cookbook-vs-skills distinction |
| `README.md` | Modified | TOC entry + new H2 section + tree update (§6.1, §6.2, §6.3) |
| `cookbook/README.md` | Modified | One cross-link bullet (§6.4) |
| `CHANGELOG.md` | Modified | Phase 8.4 entry under unreleased |

Total: **8 new files, 3 modified files**, plus this PLAN.md as the planning artefact.

Translated READMEs (`README.ru.md`, `README.es.md`, `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`) are explicitly **out of scope** for this phase — translation sync is a v1.1 task tracked in issue #8 per the existing ROADMAP §"Currently looking for".
