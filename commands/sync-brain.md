---
name: sync-brain
description: Verify the project's `~/Brain/Projects/<name>.md` Obsidian note matches the project's actual git state, parsing the note's frontmatter and checklist, comparing against recent commits and the live remote, and producing a drift report with three sections (drift detected, suggested updates, OK).
origin: claude-operator-stack
---

# /sync-brain

Plug the leak between your Obsidian project note and the actual git state. The command auto-detects the project name from `git config --get remote.origin.url` or the current directory (so you do not have to name it), parses the project note's frontmatter and checklist, and produces a three-section drift report. Read-only by default — vault ownership stays with the operator.

When invoked, this command runs the [`obsidian-sync-helper`](../skills/obsidian-sync-helper/SKILL.md) skill with the args and defaults below.

## When to use

- You are in a project directory and ask to "verify the note", "sync the brain", or "check the project note".
- Block 7 of [`/ship-day`](ship-day.md) — the post-day update wants a verified Obsidian note before the session closes.
- You just shipped something significant (deploy, feature, deprecation) and want a checkpoint.
- You return to a project after a paused week and want to re-establish what the note says vs what the repo actually contains.
- Chained automatically from [`/solo-monday-review`](solo-monday-review.md) when drift is detected during the Monday scan.

## Usage

```
/sync-brain [<project-name>] [--commit] [--quiet] [--vault <path>] [--write]
```

| Arg / flag | Type | Default | Notes |
|------------|------|---------|-------|
| `<project-name>` | optional | auto-detect | From `git config --get remote.origin.url` basename, falling back to `pwd | xargs basename`. Override only when the directory name does not match the Brain note name. |
| `--commit` | optional flag | off | After generating the drift report, asks Claude to write suggested updates back to the Brain note as a new commit (still requires per-line confirmation). |
| `--quiet` | optional flag | off | Suppresses output for the OK case (no drift). Useful when chaining from another command. |
| `--vault` | optional | `~/Brain` | Override the vault path. |
| `--write` | optional flag | off | Enables per-line edit prompts. Off keeps the report read-only. Different from `--commit`, which bundles the writes into one commit. |

Auto-detection means most invocations are simply `/sync-brain` with no args.

## Examples

```
/sync-brain
```
Auto-detects the project from the current directory. Returns the three-section drift report (`## Drift detected`, `## Suggested updates`, `## OK`).

```
/sync-brain claude-operator-stack --commit
```
Explicit project name, drift report + per-line edit prompts + a single commit bundling the accepted updates back into the Brain note. Each write still requires confirmation.

```
/sync-brain --quiet
```
OK-case suppression. Returns nothing if no drift; returns the full report otherwise. Useful when chained from `/solo-monday-review` or `/ship-day` and you only want output on a positive drift signal.

### Example output shape

```markdown
## Drift detected
- Frontmatter `repo` says `https://github.com/operator/old-name`, actual remote is `https://github.com/operator/new-name`.
- Frontmatter `status: paused` but 4 commits in the last 48 hours.
- Decision "Ship Stripe Connect onboarding" logged 12 days ago, but `feat: Stripe Connect onboarding flow` shipped 6 days ago in `abc1234` — likely already executed.

## Suggested updates
- Update frontmatter `repo` to match actual remote.
- Change frontmatter `status` to `active` or revisit whether recent commits were intentional in a paused state.
- Move "Ship Stripe Connect onboarding" from open decisions to a Decisions-shipped subsection with the commit hash.

## OK
- Stack matches: Next.js 15, Supabase, Vercel.
- Live URL in frontmatter resolves with HTTP 200.
```

## Behavior

1. Locate the project note at `<vault>/Projects/<name>.md`. If missing, stop and report — drift verification on a non-existent note is a different problem.
2. Parse the frontmatter (`status`, `repo`, `url`, `stack`, `created`) and structured body blocks (open tasks, open questions, decisions log).
3. Compare `repo` to actual `git remote get-url origin`. URL diffs flag as drift.
4. Compare `status` to recent git activity — `paused` with commits in the last 48 hours = drift one way; `active` with no commits in 14+ days = drift the other way.
5. Compare open tasks to recent commit messages (last 10 commits). Items whose keywords appear in `feat:`, `fix:`, or `ship:` commits get surfaced as candidates for ticking — never auto-ticked.
6. Build the three-section report — `## Drift detected` (concrete mismatches), `## Suggested updates` (specific edits framed as "consider changing X to Y"), `## OK` (what matches, kept short to confirm the verification ran end-to-end).

Full protocol — including the `--write` and `--commit` flows and the schema-gap handling — lives in the wrapped skill.

## Defaults and conventions

- **Project name**: auto-detected from git remote basename or `pwd` basename. Pass an explicit name only when they diverge.
- **Vault**: `~/Brain` by default. The command expects `~/Brain/Projects/<name>.md` to exist; if it does not, the first action is to surface that fact, not to silently move on.
- **Read-only**: every edit requires explicit confirmation per line; never batch-applies, never silently amends frontmatter.
- **Commit window**: last 10 commits and last 30 days by default. Operators returning from longer paused windows can request wider.
- **No multi-project bulk runs**: the command is per-project. Bulk verification is what `/solo-monday-review` chains it from, one project at a time.

## Related

- Wrapped skill: [`skills/obsidian-sync-helper/SKILL.md`](../skills/obsidian-sync-helper/SKILL.md)
- Stack: [`stack/obsidian-brain.md`](../stack/obsidian-brain.md) — the project-note frontmatter convention and the integration rule that makes the loop work.
- Workflow: [`workflows/parallel-projects.md`](../workflows/parallel-projects.md) — Habit 1 ("if it isn't in the note, it doesn't exist") is what makes drift load-bearing.
- Workflow: [`workflows/obsidian-as-context.md`](../workflows/obsidian-as-context.md) — the second-brain loop this command keeps honest.
- Adjacent: [`/solo-monday-review`](solo-monday-review.md) — chains here when drift is detected during the Monday scan.
- Adjacent: [`/ship-day`](ship-day.md) — block 7 (post-day update) calls this command for the verified close-of-day note.
