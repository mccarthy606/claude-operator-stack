---
name: solo-monday-review
description: Run the operator's Monday 30-minute review across `~/Brain/Projects/*.md`, ranking active projects by needle-mover heuristic and producing the 2-of-N focus pick, the 3 Friday touchpoints, the paused list, and a force-visible flag for any project silent more than 4 days.
origin: claude-operator-stack
---

# /solo-monday-review

Run the Monday 30-minute focus loop. The command defaults the project corpus to `~/Brain/Projects/*.md` so you do not have to specify it every Monday, applies the needle-mover ranking from `workflows/parallel-projects.md` Habit 2, and produces the four-section weekly classification: 2 focus, 3 Friday touchpoint, paused, force-visible.

When invoked, this command runs the [`weekly-monday-review`](../skills/weekly-monday-review/SKILL.md) skill with the args and defaults below.

## When to use

- It is Monday morning and you say "weekly review", "Monday review", or "what should I focus on this week".
- You are running the discipline on a non-Monday after a holiday or interrupted week (`--force` mode).
- You just finished a launch and want a re-rank — major events shift the needle-mover calculus and last week's classification is stale.
- A new session opens and no review has been recorded in the last 8 days (auto-fire trigger from the wrapped skill).

## Usage

```
/solo-monday-review [--dry-run] [--force] [--projects-dir <path>] [--write-status]
```

| Arg / flag | Type | Default | Notes |
|------------|------|---------|-------|
| `--dry-run` | optional flag | off | Prints the 2-of-N pick + paused list without offering any frontmatter writes. Useful for "show me the pick before I commit". |
| `--force` | optional flag | off | Runs the review on a non-Monday (holiday recovery, post-launch re-rank). The discipline is Monday but the mechanism is the same. |
| `--projects-dir` | optional | `~/Brain/Projects/` | Override the project notes directory. |
| `--write-status` | optional flag | off | Offers (per-project, with explicit confirmation) to update the `status:` frontmatter field to reflect the week's classification. Read-only by default. |

No required args. The command picks up your project notes automatically every Monday.

## Examples

```
/solo-monday-review
```
Runs the standard ritual against `~/Brain/Projects/*.md`. Returns the 2 focus picks, 3 Friday touchpoints, paused list, and any force-visible projects silent more than 4 days.

```
/solo-monday-review --dry-run
```
Same scan, but skips the optional follow-up to update frontmatter status fields. Use when you want to preview the pick before committing to the week's shape.

```
/solo-monday-review --force --write-status
```
Run on a non-Monday (e.g. coming back from a holiday on Wednesday) and offer per-project status writes after presenting the classification. Each write still requires explicit confirmation.

### Example output shape

```markdown
## Focus this week (2)
- **Project Alpha** — live URL waiting on a paid-ad test; data lands Wednesday · ship the conversion-fix PR Monday morning
- **Project Bravo** — customer commit Friday; PR open since Saturday · land + deploy the PR before EOD Monday

## Friday touchpoint (3)
- **Project Charlie** — research-only this week · 30-min Friday content draft
- **Project Delta** — paused on infra hardening · 30-min Friday Sentry review
- **Project Echo** — partner conversation pending · 30-min Friday inbox check

## Force-visible
- **Project Hotel** — silent 6 days, third-rail fires · push an interim README update before Wednesday EOD.
```

## Behavior

1. Glob `<projects-dir>/*.md` for project notes. Parse frontmatter, skip `archived` / `done`, carry forward `paused` and `active` as the week's universe.
2. Gather signals per candidate — open-tasks count, days-since-last-commit (via `git log -1` against the repo URL), open-questions count, last decision timestamp, recent mentions in `~/Brain/Daily/*.md` from the last 7 days.
3. Apply the needle-mover ranking. Boost: imminent revenue evidence, recent daily-note mentions, recent `feat:` or `ship:` commits. Penalise: silent 4+ days (Habit 3 third-rail), open questions outnumbering open tasks, no live URL after 60+ days.
4. Produce the four-section classification — top 2 to `## Focus this week`, next 3 to `## Friday touchpoint`, remaining to `## Paused`, every project silent more than 4 days to `## Force-visible` regardless of rank.
5. Render each project as `- **<name>** — <one-line rationale> · <next concrete action>`.
6. Detect drift signals during the scan (404 repo URLs, status contradicting commit history, decision-log entries over 30 days old on `active` projects). List them in `## Drift detected` and chain to [`/sync-brain`](sync-brain.md) for any project where drift looks load-bearing.

Full protocol — including the optional `--write-status` follow-up flow — lives in the wrapped skill.

## Defaults and conventions

- **Project corpus**: `~/Brain/Projects/*.md` by default. Override only if you keep notes elsewhere.
- **Capacity caps**: 2 focus + 3 Friday touchpoints + remaining paused. The 2-cap is structural; relaxing to 3 has produced a worse week every time.
- **Silence threshold**: 4 days no commit triggers `## Force-visible` regardless of rank. Habit 3 third-rail rule.
- **Read-only**: status frontmatter writes are off by default; even with `--write-status`, every write requires per-project confirmation.
- **Empty force-visible block**: kept visible. An empty section means the third-rail is quiet this week.

## Related

- Wrapped skill: [`skills/weekly-monday-review/SKILL.md`](../skills/weekly-monday-review/SKILL.md)
- Workflow: [`workflows/parallel-projects.md`](../workflows/parallel-projects.md) — Habit 2 is the source-of-truth for the Monday loop and the 2-of-N cap; Habit 3 third-rail rules drive the force-visible logic.
- Stack: [`stack/obsidian-brain.md`](../stack/obsidian-brain.md) — the project-note frontmatter convention this command reads from.
- Adjacent: [`/sync-brain`](sync-brain.md) — chained when drift is detected during the scan.
- Adjacent: [`/cost-rollup`](cost-rollup.md) — many operators run the cost rollup the same Monday morning.
