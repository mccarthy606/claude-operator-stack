---
phase: P8.5-commands
title: Operator slash-commands
milestone: M2 — v1.0 Public Launch
status: ready
created: 2026-05-05
target_effort_hours: 3-4
parallelisable_with: [P8.6, P8.7]
depends_on: []
files_modified:
  - commands/README.md
  - commands/solo-monday-review.md
  - commands/anonymise-case-study.md
  - commands/ship-day.md
  - commands/cost-rollup.md
  - commands/bridge-context.md
  - commands/sync-brain.md
  - .planning/phases/P8.5-commands/INTEGRATION.md
autonomous: true
---

# PLAN — P8.5 — Operator slash-commands

## 0. Frame

### Goal

Ship a `commands/` directory at the repo root containing **6** slash-command files that wrap the **6** original SKILL.md packages shipped in P8.4 (under `skills/`). Each command file is a single markdown file with ECC-shaped frontmatter (`name`, `description`, optional `allowed_tools`) plus a body that delegates to its wrapped skill. The command file makes the skill **invocable as a one-keystroke verb** in Claude Code's slash-picker; the skill itself remains the source of truth for the actual protocol. Plus a `commands/README.md` index. Plus an `INTEGRATION.md` sidecar with README delta snippets for the post-wave coordinated pass — this executor does **not** edit the repo-root README.

### Non-goals (anti-scope-creep — enforce hard)

- **Not** wrapping ECC's own commands or skills. Only our 6 own skills get a command. If a contributor proposes `/code-review` or `/skill-create` (both exist in ECC), reject — those are ECC's surface, not ours.
- **Not** adding commands that don't wrap an existing skill. No `/solo-init`, `/onboard`, `/help`, `/list-skills` — all of those are infrastructure or tooling, and the npm CLI from P8.3 owns operator ergonomics outside skills.
- **Not** shipping a 7th command. If a 7th candidate emerges (e.g. `/run-cookbook-recipe`), log to v1.1 and ship the 6.
- **Not** inlining the skill body into the command body. Cross-link is one-way: command → skill, never inlined. Drift is a known failure mode (see §10) and the mitigation is "the skill is the source of truth, the command is the shorthand."
- **Not** translating commands into RU/ES/etc. for v1.0 (matches P8.4's translation deferral).
- **Not** building a slash-command runtime, registry, or installer hook. Claude Code already loads `~/.claude/commands/<name>.md` natively when these files are placed via the existing skill-install path.
- **Not** editing the repo-root `README.md` directly. README delta snippets go to `INTEGRATION.md` for the coordinated post-wave pass (matches the P8.4 convention exactly — see `.planning/phases/P8.4-own-skills/INTEGRATION.md`).
- **Not** editing translated READMEs (`README.ru.md`, `README.es.md`, etc.). Translation sync defers to v1.1 per P8.4 precedent.
- **Not** modifying CHANGELOG.md from inside this phase. CHANGELOG is owned by the same coordinated pass.

---

## 1. Naming collision check (hard step — already executed at plan-time)

Pulled ECC's full command catalog at plan-time:

```bash
gh api repos/affaan-m/everything-claude-code/contents/commands --jq '.[].name' | sort
```

Catalog (67 commands as of 2026-05-05): `aside`, `auto-update`, `build-fix`, `checkpoint`, `code-review`, `cpp-build`, `cpp-review`, `cpp-test`, `evolve`, `feature-dev`, `flutter-build`, `flutter-review`, `flutter-test`, `gan-build`, `gan-design`, `go-build`, `go-review`, `go-test`, `gradle-build`, `harness-audit`, `hookify-configure`, `hookify-help`, `hookify-list`, `hookify`, `instinct-export`, `instinct-import`, `instinct-status`, `jira`, `kotlin-build`, `kotlin-review`, `kotlin-test`, `learn-eval`, `learn`, `loop-start`, `loop-status`, `model-route`, `multi-backend`, `multi-execute`, `multi-frontend`, `multi-plan`, `multi-workflow`, `plan`, `pm2`, `projects`, `promote`, `prp-commit`, `prp-implement`, `prp-plan`, `prp-pr`, `prp-prd`, `prune`, `python-review`, `quality-gate`, `refactor-clean`, `resume-session`, `review-pr`, `rust-build`, `rust-review`, `rust-test`, `santa-loop`, `save-session`, `sessions`, `setup-pm`, `skill-create`, `skill-health`, `test-coverage`, `update-codemaps`, `update-docs`.

Our 6 candidates checked against the list:

| Our command            | ECC has? | Verdict   |
|------------------------|----------|-----------|
| `solo-monday-review`   | no       | clear     |
| `anonymise-case-study` | no       | clear     |
| `ship-day`             | no       | clear     |
| `cost-rollup`          | no       | clear     |
| `bridge-context`       | no       | clear     |
| `sync-brain`           | no       | clear     |

Zero collisions. Names ship as-is. The execute-time check is still cheap (re-run the same `gh api` query before commit) — abort and prefix with `solo-` or `op-` only if the catalog drifts mid-window.

---

## 2. Command anatomy — exact shape

### 2.1 Frontmatter

After auditing ECC's actual command files via `gh api repos/affaan-m/everything-claude-code/contents/commands/<file>`, the convention is:

```yaml
---
name: <kebab-name>                    # required for some, optional for others — we always include
description: <one sentence>           # required, used by the slash-picker UI
allowed_tools: ["Read", "Write", ...] # optional, restrict tool surface
---
```

Examples observed in ECC (raw, base64-decoded from the GitHub contents API):

- `commands/skill-create.md` uses `name`, `description`, `allowed_tools`.
- `commands/aside.md` uses `description` only (no `name` field — Claude Code derives the slash from the filename).

**Our convention (match P8.4's tightening):**

```yaml
---
name: <kebab-name>                  # always present; matches filename stem
description: <one imperative sentence, ≤200 chars, names trigger + output>
origin: claude-operator-stack       # discriminator vs ECC's commands (mirrors our skills convention)
---
```

`description` rules (enforced in §8 quality bar):

- Single sentence, ≤200 chars.
- Starts with imperative verb (`Run`, `Apply`, `Plan`, `Verify`, `Bridge`, `Roll`).
- Names the trigger condition and the output, same disposition as our skill descriptions.
- No marketing language, no emojis, no exclamation marks.
- Should read like the wrapped skill's description, but shorter — the command is the shorthand, the skill carries the full payload.

`allowed_tools` is **omitted** for v1.0. Reason: each wrapped skill defines its own tool surface in its body, and constraining the command frontmatter would create a drift point between command and skill. Revisit in v1.1 if Claude Code's slash-runtime requires it.

### 2.2 Body — required sections, in order

```markdown
# /<command-name>

<2-3 sentence what-it-does, written for the operator>

When invoked, this command runs the [`<skill-name>`](../skills/<skill-name>/SKILL.md) skill with the args and defaults below.

## When to use

<3-5 bullet points naming concrete trigger moments>

## Usage

\`\`\`
/<command-name> [args]
\`\`\`

<table or list defining each arg, its type, default, and example value>

## Examples

<2-3 invocation examples with realistic args, each followed by 1-2 lines describing what Claude does in response>

## Behavior

<numbered list of 4-7 steps mirroring the wrapped skill's "How It Works" section, but compressed — the command body is a pointer, not a re-implementation>

## Defaults and conventions

<bullet list of the defaults the command applies before delegating to the skill — e.g. default project list, default thresholds, default output format>

## Related

- Wrapped skill: [`skills/<skill-name>/SKILL.md`](../skills/<skill-name>/SKILL.md)
- Workflow: [`workflows/<file>.md`](../workflows/<file>.md) (if applicable)
- Cookbook recipe: [`cookbook/NN-<slug>.md`](../cookbook/NN-<slug>.md) (if applicable)
```

**Length cap: 80-150 lines per command file.** Below 80 means the command is a shim with no value-add (ROADMAP risk #1: cargo cult); above 150 means the command is duplicating skill content. Hard reject either side.

---

## 3. Per-command spec

For each of the 6, the wrapped skill is the source of truth; the command adds args parsing, defaults, examples, and one cross-link to a related workflow or cookbook recipe.

### 3.1 `/solo-monday-review`

- **Trigger phrasing:** `/solo-monday-review` (no required args; optional `--dry-run` to print without writing).
- **Wrapped skill:** [`skills/weekly-monday-review/SKILL.md`](../skills/weekly-monday-review/SKILL.md).
- **Value-add beyond skill:** Defaults the project corpus to `~/Brain/Projects/*.md` (so the operator doesn't have to specify it every Monday); inlines the 4-day silence threshold and the 2-of-N pick rule from `workflows/parallel-projects.md` Habit 2 as examples; adds a `--dry-run` flag for "show me the pick before I commit."
- **Examples to include:** (1) plain `/solo-monday-review` running the standard ritual, (2) `/solo-monday-review --dry-run` previewing without updating notes, (3) one example output showing the 2-of-N + 3 Friday touchpoints + paused list shape.
- **Cross-references:** `workflows/parallel-projects.md` (Habit 2), no cookbook recipe.

### 3.2 `/anonymise-case-study`

- **Trigger phrasing:** `/anonymise-case-study <path-to-draft>` (required path arg).
- **Wrapped skill:** [`skills/case-study-anonymiser/SKILL.md`](../skills/case-study-anonymiser/SKILL.md).
- **Value-add beyond skill:** Names the path arg explicitly (skill alone is invoked indirectly via Claude reading a file); inlines the `Discipline A/B/C` alias convention as the default substitution scheme; adds a worked example showing input draft → redacted draft + substitution diff.
- **Examples to include:** (1) `/anonymise-case-study drafts/launch-post.md`, (2) `/anonymise-case-study case-studies/_drafts/saas-boilerplate.md --aliases "Boiler A,Boiler B"` showing custom aliases, (3) one example output showing the diff format.
- **Cross-references:** `case-studies/niche-booking-trio.md` (the playbook in action), `cookbook/` redaction-related recipe if one exists post-P8.6.

### 3.3 `/ship-day`

- **Trigger phrasing:** `/ship-day "<one-line product hypothesis>"` (required quoted arg).
- **Wrapped skill:** [`skills/ship-day-planner/SKILL.md`](../skills/ship-day-planner/SKILL.md).
- **Value-add beyond skill:** Forces the one-line hypothesis into a quoted positional arg (the skill accepts vague input; the command tightens it); inlines the 8-block schedule from `workflows/ship-a-product-in-a-day.md` as the canonical block list in the body; adds an `--inputs-only` flag for "give me the 8 blocks but skip the night-before frame."
- **Examples to include:** (1) `/ship-day "tiny pricing-calculator microsite for indie SaaS"`, (2) `/ship-day "AI-assisted Spanish flashcard PWA" --inputs-only`, (3) example output showing the 8 blocks with timeboxes and command pointers.
- **Cross-references:** `workflows/ship-a-product-in-a-day.md` (the canonical 8 blocks), `case-studies/` for any one-day case study post-launch.

### 3.4 `/cost-rollup`

- **Trigger phrasing:** `/cost-rollup` (no required args; optional `--services <comma-list>` and `--threshold <pct>`).
- **Wrapped skill:** [`skills/solo-billing-monitor/SKILL.md`](../skills/solo-billing-monitor/SKILL.md).
- **Value-add beyond skill:** Defaults the service set to `Vercel,Railway,Supabase,Anthropic,OpenAI,Cloudflare` (the operator's actual stack from `workspace_export`); defaults the WoW alert threshold to `30%`; adds `--threshold 20` example for tighter alerting; adds an `--out <path>` flag to write the rollup to a file instead of stdout.
- **Examples to include:** (1) `/cost-rollup` running the default 6-service rollup, (2) `/cost-rollup --services "Vercel,Anthropic" --threshold 20` for a focused weekly review, (3) one example output showing this-week-vs-last-week per service + INVESTIGATE flags.
- **Cross-references:** `workflows/solo-ops.md` (Surface 4), `cookbook/` cost-related recipe if applicable.

### 3.5 `/bridge-context <source-project>`

- **Trigger phrasing:** `/bridge-context <source-project>` (required project name arg, matches a `~/Brain/Projects/<name>.md` file).
- **Wrapped skill:** [`skills/multi-project-context-bridge/SKILL.md`](../skills/multi-project-context-bridge/SKILL.md).
- **Value-add beyond skill:** Forces the source-project arg upfront so Claude doesn't have to ask; defaults the anonymisation scheme to the same `Discipline A/B/C` aliases used by `/anonymise-case-study` (consistency); adds a `--target <project>` flag for "bridge from A to B specifically" instead of "from A to all."
- **Examples to include:** (1) `/bridge-context omega-launch` bridging from one project's Brain note into the current session, (2) `/bridge-context omega-launch --target side-saas` for project-pair bridging, (3) one example output showing the bridged decisions list with anonymised project names.
- **Cross-references:** `workflows/parallel-projects.md`, `skills/case-study-anonymiser/SKILL.md` (shares the aliasing convention).

### 3.6 `/sync-brain`

- **Trigger phrasing:** `/sync-brain [project-name]` (optional arg; defaults to the current working directory's project name if it matches a `~/Brain/Projects/*.md` file).
- **Wrapped skill:** [`skills/obsidian-sync-helper/SKILL.md`](../skills/obsidian-sync-helper/SKILL.md).
- **Value-add beyond skill:** Auto-detects the project name from `git config --get remote.origin.url` or the current directory name when no arg given (skill alone requires the operator to name it); adds a `--commit` flag that, after generating the drift report, asks Claude to write suggested updates back to the Brain note as a new commit; adds a `--quiet` flag for the OK case (no drift, no output).
- **Examples to include:** (1) `/sync-brain` auto-detecting the project, (2) `/sync-brain claude-operator-stack --commit` running the drift report and committing fixes, (3) one example output showing the three drift-report sections.
- **Cross-references:** `obsidian-integration.md` rule file, `workflows/solo-ops.md` for the broader Brain-as-context loop.

---

## 4. `commands/README.md` index design

Single index file at `commands/README.md`. ~60-80 lines. Sections:

1. **H1 + 1-paragraph intro** — what this directory is (slash-commands wrapping our 6 own skills), how it relates to `skills/` (commands are shorthand verbs, skills are the source of truth), and how it relates to ECC's `commands/` (coexists, doesn't override; both directories live under `~/.claude/commands/`).
2. **The 6 commands — table:**

   | Command | Use case | Wrapped skill |
   |---------|----------|---------------|
   | [`/solo-monday-review`](solo-monday-review.md) | Monday 30-min ritual → 2-of-N focus pick | [`weekly-monday-review`](../skills/weekly-monday-review/SKILL.md) |
   | [`/anonymise-case-study`](anonymise-case-study.md) | Apply redaction playbook to a draft | [`case-study-anonymiser`](../skills/case-study-anonymiser/SKILL.md) |
   | [`/ship-day`](ship-day.md) | One-line idea → 8 ship-day blocks | [`ship-day-planner`](../skills/ship-day-planner/SKILL.md) |
   | [`/cost-rollup`](cost-rollup.md) | Weekly cross-cloud + AI cost rollup | [`solo-billing-monitor`](../skills/solo-billing-monitor/SKILL.md) |
   | [`/bridge-context`](bridge-context.md) | Bridge OMEGA decisions across projects | [`multi-project-context-bridge`](../skills/multi-project-context-bridge/SKILL.md) |
   | [`/sync-brain`](sync-brain.md) | Verify Brain note vs git state | [`obsidian-sync-helper`](../skills/obsidian-sync-helper/SKILL.md) |

3. **Install** — 3-line block matching `skills/README.md`'s install convention: `cp commands/*.md ~/.claude/commands/` (or pointer to the npm CLI if P8.3's installer covers commands).
4. **Convention** — 1 paragraph: command names are kebab-case, mirror the wrapped skill name where natural (or use a shorter verb where the skill name is too long, e.g. `cost-rollup` instead of `solo-billing-monitor`).
5. **Related** — bullets pointing to `skills/README.md`, `cookbook/README.md`, ECC's `commands/` directory.

---

## 5. Repo-root README.md changes (deferred to coordinated pass)

This executor does **not** edit `README.md`. The coordinated post-wave pass (after P8.5, P8.6, P8.7 all land) applies the snippets below from `INTEGRATION.md`. Same convention as P8.4 — see `.planning/phases/P8.4-own-skills/INTEGRATION.md` for the precedent.

Snippets to record in `INTEGRATION.md`:

1. **TOC entry** — between `Solo-founder skills (originals)` and `Scaffolds`, insert `- [Slash commands](#slash-commands)`.
2. **New H2 section "Slash commands"** — between the existing `## Solo-founder skills (originals)` H2 and the `## Scaffolds` H2 (4-6 lines body): one paragraph explaining slash-commands wrap our 6 own skills, table linking each command to its `commands/<name>.md` file, pointer to `commands/README.md` for the full index.
3. **"What's Inside" tree update** — insert a `commands/` block immediately after the `skills/` block (which P8.4's INTEGRATION already inserted), containing the 6 command filenames + the README.
4. **Translated READMEs** — explicitly skipped for v1.0 (matches P8.4 deferral).
5. **CHANGELOG.md entry** — single line under v1.0 unreleased: `- Added \`commands/\` directory with 6 slash-commands wrapping the solo-founder skills (P8.5)`.

---

## 6. Implementation steps — numbered checklist

1. Create `commands/` directory at repo root.
2. For each of the 6 commands (in this order — alphabetical by command name to make review easier):
   1. `commands/anonymise-case-study.md` — frontmatter + body per §3.2 + §2.2 template.
   2. `commands/bridge-context.md` — frontmatter + body per §3.5 + §2.2 template.
   3. `commands/cost-rollup.md` — frontmatter + body per §3.4 + §2.2 template.
   4. `commands/ship-day.md` — frontmatter + body per §3.3 + §2.2 template.
   5. `commands/solo-monday-review.md` — frontmatter + body per §3.1 + §2.2 template.
   6. `commands/sync-brain.md` — frontmatter + body per §3.6 + §2.2 template.
3. Write `commands/README.md` per §4.
4. Write `.planning/phases/P8.5-commands/INTEGRATION.md` per §5 — copy the structure from `.planning/phases/P8.4-own-skills/INTEGRATION.md` exactly (section ordering, snippet format, "do not apply from inside this phase" disclaimer).
5. Re-run the ECC catalog collision check (`gh api repos/affaan-m/everything-claude-code/contents/commands --jq '.[].name'`) before commit; abort and rename if any of our 6 names appeared in the catalog during the work window.
6. Run the verification commands from §9 against the working tree.
7. Stop. Do not commit. Do not edit `README.md`, `README.<lang>.md`, or `CHANGELOG.md`. Hand back to orchestrator.

---

## 7. Quality bar — gate before each command file is considered done

Each command file must satisfy **all** of:

- **Length:** ≥80 lines, ≤150 lines. Below 80 = cargo-cult shim (rejected). Above 150 = duplicating skill content (rejected, compress).
- **Frontmatter:** valid YAML, contains `name` (matches filename stem), `description` (one sentence ≤200 chars, imperative verb start, names trigger + output), `origin: claude-operator-stack`.
- **Cross-link:** body contains exactly one explicit relative link to `../skills/<skill-name>/SKILL.md` in the opening paragraph, plus the same link repeated in the `## Related` footer.
- **Args section:** `## Usage` has at least one runnable invocation example with concrete args; if the command takes no required args, the section names the optional flags and their defaults.
- **Examples section:** ≥2 worked examples, ≤3. Each example is a realistic invocation followed by 1-2 lines naming what Claude does in response.
- **Behavior section:** numbered 4-7 steps that **mirror** the wrapped skill's "How It Works" but do **not** duplicate it word-for-word — compress and point at the skill for full detail.
- **Defaults section:** at least one named default (project list, threshold, output format, alias scheme) the command applies before delegating to the skill. This is the value-add gate (ROADMAP risk #1: cargo cult).
- **Voice:** second person ("you"), imperative mood for behavior steps, no marketing tone, no emojis. Matches the operator-first voice of `workflows/`, `skills/`, and the rest of the repo.
- **No inlined skill body:** the command body must not duplicate the skill's protocol text. If 3+ consecutive lines match the skill verbatim, rewrite as a pointer.

`commands/README.md` quality bar:

- ≥40 lines, ≤80 lines.
- Contains the 6-row table with all three columns populated and all links resolving (relative paths).
- Has install + convention + related sections.

---

## 8. Success criteria + verification commands

Run these from the repo root after writing all files. All must pass before considering the phase complete.

```bash
# 1. Six command files exist + the index
test -d commands
test -f commands/README.md
for cmd in solo-monday-review anonymise-case-study ship-day cost-rollup bridge-context sync-brain; do
  test -f "commands/${cmd}.md" || echo "MISSING: commands/${cmd}.md"
done

# 2. Each command file is between 80 and 150 lines
for cmd in commands/*.md; do
  [ "$(basename "$cmd")" = "README.md" ] && continue
  lines=$(wc -l < "$cmd")
  if [ "$lines" -lt 80 ] || [ "$lines" -gt 150 ]; then
    echo "OUT OF BOUNDS ($lines lines): $cmd"
  fi
done

# 3. Each command has the required frontmatter fields
for cmd in commands/*.md; do
  [ "$(basename "$cmd")" = "README.md" ] && continue
  head -10 "$cmd" | grep -q "^name: " || echo "NO name: in $cmd"
  head -10 "$cmd" | grep -q "^description: " || echo "NO description: in $cmd"
  head -10 "$cmd" | grep -q "^origin: claude-operator-stack" || echo "NO origin: in $cmd"
done

# 4. Each command cross-links its wrapped skill
grep -L "skills/.*SKILL.md" commands/*.md | grep -v README.md && echo "MISSING SKILL CROSS-LINK"

# 5. Each command has Usage + Examples + Behavior + Related sections
for cmd in commands/*.md; do
  [ "$(basename "$cmd")" = "README.md" ] && continue
  for sec in "## Usage" "## Examples" "## Behavior" "## Related"; do
    grep -q "^${sec}" "$cmd" || echo "MISSING SECTION '$sec' in $cmd"
  done
done

# 6. README index has 6-row table linking all commands
grep -c "commands/" commands/README.md  # expect ≥6
grep -c "skills/.*SKILL.md" commands/README.md  # expect ≥6

# 7. INTEGRATION.md exists and references all 6 command files
test -f .planning/phases/P8.5-commands/INTEGRATION.md
grep -c "commands/" .planning/phases/P8.5-commands/INTEGRATION.md  # expect ≥6

# 8. Re-run ECC collision check at execute-time
gh api repos/affaan-m/everything-claude-code/contents/commands --jq '.[].name' | sort > /tmp/ecc_now.txt
for cmd in solo-monday-review anonymise-case-study ship-day cost-rollup bridge-context sync-brain; do
  grep -Fxq "${cmd}.md" /tmp/ecc_now.txt && echo "COLLISION DETECTED: ${cmd}"
done

# 9. README.md / README.<lang>.md / CHANGELOG.md MUST be untouched in this phase
git diff --name-only | grep -E "^README\.(md|.+\.md)$|^CHANGELOG\.md$" && echo "PHASE BOUNDARY VIOLATION"
```

Phase succeeds iff all 9 checks emit no output (or only the expected counts).

---

## 9. Risks + mitigations

| # | Risk | Likelihood | Mitigation |
|---|------|-----------|------------|
| 1 | **Cargo-cult shims** — commands that say "run skill X" with nothing else. | High (ROADMAP risk #1) | §7 quality bar enforces ≥80 lines, args section with concrete defaults, ≥2 worked examples, named defaults. Files under 80 lines fail the gate. Reviewer rejects on missing args/examples. |
| 2 | **Naming collision with ECC** — between plan-time and execute-time, ECC adds a command we picked. | Very low (6h window) | Re-run `gh api .../commands` at execute-time before commit (step 5 in §6); rename to `solo-<name>` or `op-<name>` if collision found. |
| 3 | **Drift between command body and wrapped skill** — operator updates the skill, command body lies. | Medium (post-launch) | Command body is intentionally thin and points at the skill for the protocol. Skill is source of truth. Cross-link is one-way (command → skill, never inlined). §7 enforces no duplicated skill content (3+ consecutive matching lines = rewrite as pointer). |
| 4 | **README contention with parallel P8.6 / P8.7** — three executors all want to edit `README.md`. | High (planned for) | This executor does **not** edit README; writes `INTEGRATION.md` only. Coordinated post-wave pass merges all three INTEGRATION snippets atomically. Same convention as P8.4. |
| 5 | **`origin: claude-operator-stack` rejected by Claude Code's slash-runtime** — if the runtime is strict about extra YAML keys. | Low (skills already use `origin:` and load fine in P8.4) | If runtime rejects, drop `origin:` from commands and rely on the `commands/` directory + `commands/README.md` to discriminate from ECC. Single sed pass at execute-time. Keep the option open. |
| 6 | **Scope creep to 7+ commands** — contributor proposes a 7th during execution. | Low | Hard cap in §0 non-goals: 6 only. 7th candidates log to v1.1 backlog (issue, not branch). Reviewer rejects PR additions. |

---

## 10. Estimated time breakdown (target ~3-4h total)

| Step | Effort | Notes |
|------|--------|-------|
| Re-run ECC collision check at execute-time | 5m | Cheap, runs in step 5 of §6. |
| Write 6 command files (~80-150 lines each, with examples + behavior) | 2h-2.5h | ~20-25 min per command. Copy the §2.2 template once, fill per §3.X spec. |
| Write `commands/README.md` index | 20m | Mostly the table + install + convention block; mirrors `skills/README.md` shape. |
| Write `INTEGRATION.md` README delta snippets | 25m | Copy structure from `.planning/phases/P8.4-own-skills/INTEGRATION.md`; adapt for the new "Slash commands" H2 + tree block. |
| Run the §8 verification commands and fix any failures | 15m | First pass usually catches 1-2 length-bound or section-name issues. |
| Buffer | 20-30m | For example refinement on the harder commands (`/bridge-context` and `/cost-rollup` need realistic data shapes). |
| **Total** | **3-4h** | Matches ROADMAP estimate. |

---

## 11. Files to create

All paths relative to the repo root (`/Users/mccarthy606/Projects/claude-operator-stack/`).

**Created by this phase:**

- `commands/README.md` (new — index file, ~40-80 lines)
- `commands/solo-monday-review.md` (new — 80-150 lines)
- `commands/anonymise-case-study.md` (new — 80-150 lines)
- `commands/ship-day.md` (new — 80-150 lines)
- `commands/cost-rollup.md` (new — 80-150 lines)
- `commands/bridge-context.md` (new — 80-150 lines)
- `commands/sync-brain.md` (new — 80-150 lines)
- `.planning/phases/P8.5-commands/INTEGRATION.md` (new — README delta snippets, ~60-100 lines)

**Explicitly NOT touched by this phase** (deferred to coordinated post-wave pass):

- `README.md`
- `README.ru.md`, `README.es.md`, `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`
- `CHANGELOG.md`

**Read-only references during execution** (do not modify):

- `skills/<each-of-6>/SKILL.md` (source of truth for each wrapped skill)
- `workflows/parallel-projects.md`, `workflows/ship-a-product-in-a-day.md`, `workflows/solo-ops.md` (for cross-references)
- `.planning/phases/P8.4-own-skills/INTEGRATION.md` (template for our INTEGRATION.md)
- `.planning/milestones/M2-v1-public-launch/ROADMAP.md` lines 482-552 (Phase 8.5 spec)
