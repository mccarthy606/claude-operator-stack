---
name: weekly-monday-review
description: Run the operator's Monday 30-minute review across `~/Brain/Projects/*.md`, ranking active projects by needle-mover heuristic and producing the 2-of-N focus pick, the 3 Friday touchpoints, the paused list, and a force-visible flag for any project silent more than 4 days.
origin: claude-operator-stack
---

# Weekly Monday Review

The Monday 30-minute "where are we" loop is the keystone of the parallel-projects discipline (`workflows/parallel-projects.md` Habit 2). Without it, all 7 projects compete for attention every day; with it, 2 win the week and the others get a 30-minute Friday touchpoint.

This skill scans the operator's project notes, applies the needle-mover ranking, and produces the four-section weekly classification. It is a focus filter, not a status report — the goal is to be honest about which projects are explicitly *not* getting attention this week so they stop owing the operator mental load.

## When to Use

- It is Monday morning and the operator says "let's do the weekly review", "Monday review", or "what should I focus on this week".
- The operator runs the skill on a non-Monday with `--force` (the discipline is Monday but the mechanism is the same; e.g. coming back from a holiday on a Wednesday, the review still needs to happen once before focused work resumes).
- The operator just finished a launch and asks for a re-rank — major events shift the needle-mover calculus and the previous Monday's classification is stale.
- Auto-fires from the start of the operator's workspace if no review has been recorded in the last 8 days.
- ECC has `dashboard-builder` (builds dashboards as artefacts) and `project-flow-ops` (generic project ops). Neither produces the 2-of-N focus pick + paused-project status update specific to Habit 2; use this one for the Monday loop.

## Inputs

- The path to the operator's project notes directory. Default `~/Brain/Projects/`. Honour any override the user gives.
- The weekly capacity, default 2 focus + 3 Friday touchpoint + remaining paused per `workflows/parallel-projects.md` Habit 2. Honour any override (a holiday-shortened week may warrant 1 focus + 2 touchpoints).
- The needle-mover criterion. Default: revenue evidence pending or imminent milestone within the next 14 days ranks high; stale silent work (more than 4 days no commit, per Habit 3 third-rail rule) ranks lower because it needs a small visible step before more focus is warranted.
- An optional reading of recent activity for each project name from the prior week — `~/Brain/Daily/<date>.md` notes that mention the project, or a `/graphify query "<project> last week"` against the Brain corpus. Recent activity is a tiebreaker when two projects look equally needle-moving from the notes alone.
- An optional `--write-status` flag from the user. Defaults off; when on, the skill offers to update the `status:` field in each note's frontmatter to reflect the week's classification (still requires explicit confirmation per project).

## How It Works

1. Glob the project notes directory for `*.md` files. For each, parse the frontmatter and extract `status`, `repo`, `url`, `stack`, `created`. Skip any file whose status is `archived` or `done`. Carry forward `paused` and `active` files as the week's universe of candidates.
2. For each candidate, gather signals: open-tasks count from the unchecked checklist items, days-since-last-commit from `git log -1 --format=%cd` against the repo URL in the frontmatter, open-questions count, last decision timestamp from the decisions log, and any mentions of the project name in `~/Brain/Daily/*.md` notes from the last 7 days (or a `/graphify query` against the Brain corpus if the operator has built it).
3. Apply the needle-mover ranking. Boost a project for: imminent revenue evidence (live URL with traffic, customer commitment in the next 14 days), recent mentions in daily notes, recent commits with `feat:` or `ship:` prefixes. Penalise a project for: silent for more than 4 days with no commit (Habit 3 third-rail), open questions outnumbering open tasks (means the project is stuck rather than executing), no live URL after more than 60 days (likely a research project that should be reframed).
4. Produce the four-section classification. `## Focus this week` gets the top 2 by rank. `## Friday touchpoint` gets the next 3. `## Paused` gets every remaining `active`/`paused` candidate. `## Force-visible` gets every project silent for more than 4 days regardless of rank — Habit 3 says the third-rail fires on time, not on rank.
5. For each project line, render `- **<name>** — <one-line rationale> · <next concrete action>`. The rationale names the signal that drove the ranking; the next action is the smallest visible step (commit, PR, lead-form change, customer reply) that moves the project this week.
6. Detect drift signals during the scan — repo URLs that 404, frontmatter status that contradicts recent git activity, decision-log entries older than 30 days on an `active` project. List these in a `## Drift detected` block at the end and chain to `obsidian-sync-helper` for any project where drift looks load-bearing.
7. Offer one optional follow-up: write the new `status:` value into each project's frontmatter (`status/focus`, `status/touchpoint`, `status/paused`, `status/force-visible`). Read-only by default; require per-project confirmation before writing. Never batch-write all projects in one yes.

## Output shape

```markdown
## Focus this week (2)

- **Project Alpha** — live URL waiting on a paid-ad test; data lands Wednesday · ship the conversion-fix PR Monday morning
- **Project Bravo** — customer commit Friday; PR open since Saturday · land + deploy the PR before EOD Monday

## Friday touchpoint (3)

- **Project Charlie** — research-only this week, no shipping pressure · 30-min Friday content draft
- **Project Delta** — paused on infra hardening, no urgency · 30-min Friday Sentry review
- **Project Echo** — partner conversation pending · 30-min Friday inbox check

## Paused

- Project Foxtrot, Project Golf — status updated to paused, no work this week.

## Force-visible

- **Project Hotel** — silent 6 days, third-rail fires · push an interim README update before Wednesday EOD.

## Drift detected

- Project Foxtrot — frontmatter says active but no commits in 18 days. Suggest running `obsidian-sync-helper` on Foxtrot.
```

## Anti-patterns

- Do not auto-write status fields without per-project confirmation. Habit 2 is operator-owned; the skill proposes, the operator confirms.
- Do not pick more than 2 focus projects regardless of how the rank shakes out. The cap is structural — relaxing it to 3 has produced a worse week every time the operator has tried.
- Do not skip the force-visible block when no project triggers it. An empty `## Force-visible` section is the signal that the third-rail is quiet this week, which is itself information.
- Do not generate a status report when the operator asked for a focus filter. Long prose about each project's history is documentation drift; one rationale line + one action line is the bar.
- Do not pull in projects with `status: done` or `status: archived` to "round out" the list. Done projects are done.

## Related

- [`workflows/parallel-projects.md`](../../workflows/parallel-projects.md) — Habit 2 is the source-of-truth for the Monday loop and the 2-of-N cap; Habit 3 third-rail rules drive the force-visible logic.
- [`stack/obsidian-brain.md`](../../stack/obsidian-brain.md) — the project-note frontmatter convention this skill reads from.
- [`skills/obsidian-sync-helper`](../obsidian-sync-helper/SKILL.md) — chained when drift is detected during the scan.
- [`skills/solo-billing-monitor`](../solo-billing-monitor/SKILL.md) — adjacent weekly ritual; many operators run the cost rollup the same Monday.
- ECC `dashboard-builder` and `project-flow-ops` — disambiguated above; neither produces the focus filter.
