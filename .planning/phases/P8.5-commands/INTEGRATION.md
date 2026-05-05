# P8.5 Integration Snippets — README updates (NOT applied by this executor)

The repo root `README.md` is owned by a coordinated pass after all 3 wave-B executors (P8.5, P8.6, P8.7) land. This file contains the exact snippets the README-pass executor should insert. Do not apply these from inside this phase.

## Constraint

Per the user's directive for this phase: this executor does NOT edit `README.md`, `README.<lang>.md`, or `CHANGELOG.md`. The snippets below are the integration spec for whoever runs the README + CHANGELOG pass after waves 8.5, 8.6, 8.7 land. Mirrors the P8.4 convention exactly — see `.planning/phases/P8.4-own-skills/INTEGRATION.md` for the precedent.

## 1. Table of Contents entry

In `README.md`, the Contents block currently includes (after P8.4's INTEGRATION pass landed):

```markdown
- [Cookbook](#cookbook)
- [Solo-founder skills (originals)](#solo-founder-skills-originals)
- [Scaffolds](#scaffolds)
```

Insert a new TOC entry between `Solo-founder skills (originals)` and `Scaffolds`:

```markdown
- [Cookbook](#cookbook)
- [Solo-founder skills (originals)](#solo-founder-skills-originals)
- [Slash commands](#slash-commands)
- [Scaffolds](#scaffolds)
```

## 2. New H2 section

In `README.md`, between the existing `## Solo-founder skills (originals)` H2 (added by P8.4's INTEGRATION pass) and the `## Scaffolds` H2, insert the following block. The `---` separator that currently sits before `## Scaffolds` becomes the separator before the new H2; add another `---` separator between the new H2 and `## Scaffolds`.

```markdown
---

## Slash commands

Six slash-commands that wrap the six original skills as one-keystroke verbs in Claude Code's slash-picker. Each command parses operator-friendly args, applies sensible defaults, and delegates to its wrapped skill for the protocol. The skill is the source of truth; the command is the shorthand.

| Command | Use case | Wrapped skill |
|---------|----------|---------------|
| [`/solo-monday-review`](commands/solo-monday-review.md) | Monday 30-min ritual → 2-of-N focus pick | [`weekly-monday-review`](skills/weekly-monday-review/SKILL.md) |
| [`/anonymise-case-study`](commands/anonymise-case-study.md) | Apply the redaction playbook to a draft | [`case-study-anonymiser`](skills/case-study-anonymiser/SKILL.md) |
| [`/ship-day`](commands/ship-day.md) | One-line idea → 8 ship-day blocks | [`ship-day-planner`](skills/ship-day-planner/SKILL.md) |
| [`/cost-rollup`](commands/cost-rollup.md) | Weekly cross-cloud + AI cost rollup | [`solo-billing-monitor`](skills/solo-billing-monitor/SKILL.md) |
| [`/bridge-context`](commands/bridge-context.md) | Bridge OMEGA decisions across projects, anonymised | [`multi-project-context-bridge`](skills/multi-project-context-bridge/SKILL.md) |
| [`/sync-brain`](commands/sync-brain.md) | Verify Brain note vs git state | [`obsidian-sync-helper`](skills/obsidian-sync-helper/SKILL.md) |

These coexist with [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)'s 67 commands under `~/.claude/commands/`. Names checked at plan-time and execute-time against ECC's catalog — zero collisions. See [commands/README.md](commands/README.md) for the full index.
```

## 3. "What's Inside" tree update

In `README.md`, the `## What's Inside` code block shows the directory tree. After P8.4's INTEGRATION pass landed, the tree includes a `skills/` block. Insert the following `commands/` block immediately after the `skills/` block and before the `├── scaffolds/` line:

```text
├── commands/                   ← 6 slash-commands wrapping the originals
│   ├── solo-monday-review.md
│   ├── anonymise-case-study.md
│   ├── ship-day.md
│   ├── cost-rollup.md
│   ├── bridge-context.md
│   └── sync-brain.md
│
```

The block of `skills/` entries currently ends with `│   └── ship-day-planner/` followed by `│`. Insert the `commands/` block immediately after that trailing `│` line and before the `├── scaffolds/` line.

## 4. Translated READMEs (deferred)

The repo has 6 translated READMEs (`README.ru.md`, `README.es.md`, `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`). Translation sync is explicitly out of scope for Phase 8.5 per the PLAN's non-goals (matches P8.4 precedent for v1.0 → v1.1 translation pass). The README-pass executor should skip these unless the coordinated pass explicitly includes them.

## 5. CHANGELOG.md entry

Add a single line under the v1.0 unreleased section. The exact line:

```markdown
- Added `commands/` directory with 6 slash-commands wrapping the solo-founder skills (P8.5)
```

If the coordinated pass groups all three wave-B phases into one CHANGELOG block, the P8.5 line sits alongside P8.6 and P8.7 entries. If the pass keeps phases separate, this line stands alone under a `### Slash commands` sub-heading.

## 6. skills/README.md cross-link

Per consistency with how P8.4 cross-linked cookbook/skills, `skills/README.md` may get one new bullet under its `## Related` section pointing to the new commands directory:

```markdown
- [commands/](../commands/) — slash-commands that wrap these skills as one-keystroke verbs (skills = Claude executes, commands = operator types)
```

This is also held for the coordinated pass; this executor does not modify `skills/README.md` to keep all cross-link edits in one place.

## Verification after the README pass applies these

```bash
# 1. New H2 exists with correct slug
grep -c "^## Slash commands$" README.md                       # 1
grep -c "Slash commands" README.md                            # >=2 (TOC + H2)

# 2. Tree has the commands block
grep -c "├── commands/" README.md                             # 1

# 3. All 6 command links resolve from README
for cmd in solo-monday-review anonymise-case-study ship-day cost-rollup bridge-context sync-brain; do
  grep -q "commands/${cmd}.md" README.md || echo "MISSING: $cmd"
done

# 4. CHANGELOG mentions P8.5
grep -c "P8.5" CHANGELOG.md                                   # >=1

# 5. skills/README.md has the back-pointer
grep -c "../commands/" skills/README.md                       # >=1
```

All checks pass cleanly = the README + CHANGELOG pass landed correctly.
