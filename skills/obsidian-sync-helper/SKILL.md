---
name: obsidian-sync-helper
description: Verify that the project's `~/Brain/Projects/<name>.md` Obsidian note matches the project's actual git state, parsing the note's frontmatter and checklist, comparing against recent commits and the live remote, and producing a drift report with three sections (drift detected, suggested updates, OK).
origin: claude-operator-stack
---

# Obsidian Sync Helper

The Obsidian-as-context loop only works if `~/Brain/Projects/<name>.md` reflects what the project actually looks like in git. Drift kills the loop silently — the next session loads a stale note, makes a decision against an outdated picture, and the project diverges from its own documentation.

This skill plugs the leak. It reads the project note, walks recent git history, and tells the operator where the two have drifted apart. Read-only by default — the operator owns the vault; the skill produces a candidate diff, never a silent edit.

## When to Use

- The operator is in a project directory and asks to "verify the Obsidian note", "sync the brain", "check the project note", or any variant.
- The skill is chained from `weekly-monday-review` when drift is detected during the Monday scan.
- The operator just shipped something significant (a deploy, a feature, a deprecation) and wants a checkpoint before closing the session — the post-day update from `workflows/ship-a-product-in-a-day.md` block 7.
- The operator returns to a project after a paused week and wants to re-establish what the note says vs what the repo actually contains.
- ECC has no Obsidian skill in its 182-skill catalog. Adjacent skills (`knowledge-ops`, `project-flow-ops`) are generic project-state and do not know about the `~/Brain/Projects/<name>.md` convention; use this one specifically for the operator's vault loop.

## Inputs

- The project name. Default: derive from the basename of the current working directory (`pwd | xargs basename`). Honour any override the user gives.
- The path to the Obsidian vault. Default `~/Brain`. The skill expects `~/Brain/Projects/<name>.md` to exist; if it does not, the first action is to surface that fact, not to silently move on.
- A read-only flag. Default `true` — never write into the vault without explicit confirmation. Honour `--write` if the operator passes it, but still confirm each edit per-line before applying.
- Optional commit-window override. Default: walk the last 10 commits and the last 30 days. Operators returning from a longer paused window can request a wider window.
- An optional list of frontmatter fields to verify. Default: `status`, `repo`, `url`, `stack`. Honour the user's expansion if they have customised the operator's project-note schema.

## How It Works

1. Locate the project note at `<vault>/Projects/<name>.md`. If it is missing, stop and report — drift verification on a non-existent note is a different problem (the note needs to be created first, which is outside this skill's scope).
2. Parse the frontmatter. Pull `status`, `repo`, `url`, `stack`, `created`, and any other fields the operator has standardised on. Capture the body's structured blocks: open tasks (unchecked checklist items), open questions, decisions log entries.
3. Compare `repo` to the actual remote. Run `git remote get-url origin` from the project directory. If the URL differs from the frontmatter (typo, repo renamed, repo moved), flag as drift.
4. Compare `status` to recent git activity. If frontmatter says `paused` but the last commit was in the last 48 hours, that is drift in one direction. If frontmatter says `active` but the last commit was more than 14 days ago, that is drift in the other direction. Both go on the report.
5. Compare open tasks to recent commit messages. For each unchecked checklist item, scan the last 10 commit messages for keyword overlap. Items whose keywords appear in `feat:`, `fix:`, or `ship:` commits are candidates for "tick" — surface them as suggestions, never auto-tick.
6. Compare decisions log entries to recent commits. Decisions that map to an already-shipped commit (`feat:` or `refactor:` prefixes referencing the decision's subject) are likely already executed; suggest moving them to a "Decisions shipped" subsection.
7. Build the report with three sections — `## Drift detected` (concrete mismatches with file paths and line refs), `## Suggested updates` (specific edits framed as "consider changing X to Y", never auto-applied), `## OK` (what matches, kept short to confirm the verification ran end-to-end).
8. If the operator passed `--write`, offer each suggested edit one at a time. Apply only on explicit confirmation per edit. Never batch-apply, never silently amend frontmatter.

## Output shape

```markdown
## Drift detected

- Frontmatter `repo` says `https://github.com/operator/old-name`, actual remote is `https://github.com/operator/new-name`.
- Frontmatter `status: paused` but 4 commits in the last 48 hours.
- Decision "Ship Stripe Connect onboarding" logged 12 days ago, but `feat: Stripe Connect onboarding flow` shipped in commit `abc1234` 6 days ago — likely already executed.

## Suggested updates

- Update frontmatter `repo` to match actual remote.
- Change frontmatter `status` to `active` or revisit whether the recent commits were intentional in a paused state.
- Move "Ship Stripe Connect onboarding" from open decisions to a Decisions-shipped subsection with the commit hash.

## OK

- Stack matches: Next.js 15, Supabase, Vercel.
- 3 of 5 open tasks have no recent commit overlap; carry forward as still-open.
- Live URL in frontmatter resolves with HTTP 200.
```

## Anti-patterns

- Do not auto-tick tasks based on commit-message keyword overlap. Keyword overlap is a candidate signal, not a green light. The operator decides which tasks are actually done.
- Do not edit the vault without explicit per-line confirmation when `--write` is on. Vault ownership is operator-owned; this skill is read-first by default.
- Do not flag frontmatter fields the operator has not asked to verify. If the operator added a custom field for a personal experiment (`mood: heads-down`), it is not drift if it is missing context — it is the operator's note.
- Do not produce a multi-page diff. The report is a checkpoint, not an audit log; if drift is large, surface the top 5 items and recommend a scheduled clean-up session.
- Do not claim parity when one of the structured blocks (open tasks, open questions, decisions log) was missing from the note. Missing blocks go in the report under "schema gaps", not silently treated as zero-drift.
- Do not propose creating the project note when it does not exist. The skill is verification, not authoring; if the note is missing, the right action is to surface that and stop.
- Do not run the verification across multiple projects in a single invocation. The skill is per-project — bulk verification is what `weekly-monday-review` chains it from, one project at a time.

## Related

- [`stack/obsidian-brain.md`](../../stack/obsidian-brain.md) — the project-note frontmatter convention and the integration rule that makes the loop work.
- [`workflows/parallel-projects.md`](../../workflows/parallel-projects.md) — Habit 1 ("if it isn't in the note, it doesn't exist") is what makes drift load-bearing.
- [`workflows/obsidian-as-context.md`](../../workflows/obsidian-as-context.md) — the second-brain loop this skill keeps honest.
- [`workflows/ship-a-product-in-a-day.md`](../../workflows/ship-a-product-in-a-day.md) — block 7's post-day update is a recurring trigger for this skill.
- [`skills/weekly-monday-review`](../weekly-monday-review/SKILL.md) — chains here when drift is detected during the Monday scan.
- [`skills/case-study-anonymiser`](../case-study-anonymiser/SKILL.md) — sibling vault-adjacent skill; case studies are usually authored from project-note content, so a synced note feeds a cleaner draft into the anonymiser.
- ECC has no Obsidian skill; nothing to disambiguate from beyond the note in `## When to Use`.
