# P8.4 Integration Snippets — README updates (NOT applied by this executor)

The repo root `README.md` is owned by a coordinated pass after all 4 wave-8 executors. This file contains the exact snippets the README-pass executor should insert. Do not apply these from inside this phase.

## Constraint

Per the user's directive for this phase: this executor does NOT edit `README.md`. The snippets below are the integration spec for whoever runs the README pass after waves 8.1, 8.2, 8.3, 8.4 land.

## 1. Table of Contents entry

In `README.md` line 29, between the `Cookbook` line and the `Scaffolds` line, insert:

```markdown
- [Solo-founder skills (originals)](#solo-founder-skills-originals)
```

The Contents block (lines 21-35) currently reads:

```markdown
- [Cookbook](#cookbook)
- [Scaffolds](#scaffolds)
```

After insertion:

```markdown
- [Cookbook](#cookbook)
- [Solo-founder skills (originals)](#solo-founder-skills-originals)
- [Scaffolds](#scaffolds)
```

## 2. New H2 section

In `README.md`, between the existing `## Cookbook` section (lines 218-228) and the `## Scaffolds` section (lines 232+), insert the following block. The current `---` separator at line 230 becomes the separator before the new H2; add another `---` separator between the new H2 and `## Scaffolds`.

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

## 3. "What's Inside" tree update

In `README.md`, the `## What's Inside` code block (lines 119-180) shows the directory tree. Insert the following block between the existing `cookbook/` block (currently ending around line 158) and the `scaffolds/` block (currently starting around line 160):

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

The block of `cookbook/` entries currently ends with `│   └── 12-content-cross-post-pipeline.md` followed by `│`. Insert the `skills/` block immediately after that trailing `│` line and before the `├── scaffolds/` line.

## 4. Translated READMEs (deferred)

The repo has 6 translated READMEs (`README.ru.md`, `README.es.md`, `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`). Translation sync is explicitly out of scope for Phase 8.4 per the PLAN's non-goals (issue #8 covers v1.1 translation pass). The README-pass executor should skip these unless the coordinated pass explicitly includes them.

## 5. cookbook/README.md cross-link

Per the PLAN §6.4, `cookbook/README.md` should get one new bullet under its `## Related` section:

```markdown
- [skills/](../skills/) — invocable SKILL.md packages Claude executes (cookbook = human reads, skills = Claude executes)
```

This is also held for the coordinated README pass; this executor does not modify `cookbook/README.md` to keep all README-family edits in one place.

## Verification after the README pass applies these

```bash
grep -c "^## Solo-founder skills (originals)$" README.md      # 1
grep -c "Solo-founder skills (originals)" README.md           # >=2 (TOC + H2)
grep -c "├── skills/" README.md                                # 1
grep -c "skills/" cookbook/README.md                          # >=1
```
