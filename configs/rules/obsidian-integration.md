# Obsidian Vault Integration

Custom rule that wires `~/Brain` (Obsidian vault) into Claude Code's session lifecycle.

## Vault Location

`~/Brain` — synced via Obsidian Git plugin to a private GitHub repo.

(If your vault lives elsewhere, change the path below in all sections.)

## Automatic Behaviors

### On Session Start (any project)

Before starting work, check if the current project has a note in `~/Brain/Projects/`. If it does, read it for context about goals, architecture, open tasks, and decisions.

### After Completing Work

After finishing a significant task (feature, fix, research), update the relevant Obsidian note:

- Update task checkboxes in the project note
- Add new findings to "## Notes" section
- If new reusable knowledge was gained, create or update a file in `~/Brain/Knowledge/`
- If a new project was created, create a project note from `~/Brain/Templates/project.md`

### After Research

When research is done for the user, save key findings to `~/Brain/Knowledge/<topic>.md` so they persist across sessions.

### Content Work

When working on YouTube scripts or content, use `~/Brain/Content/` for drafts and the relevant `~/Brain/Projects/<brand>.md` for tracking.

## Vault Structure

```
~/Brain/
├── Projects/     ← one note per project (status, stack, tasks, decisions)
├── Ideas/        ← raw inbox
├── Daily/        ← daily notes (YYYY-MM-DD.md)
├── Knowledge/    ← reusable solutions, patterns, gotchas
├── People/       ← contacts (counterparties, partners, customers)
├── Content/      ← scripts, drafts, research briefs
├── Templates/    ← note templates
└── Archive/      ← completed / frozen
```

## Project Note Frontmatter

```yaml
---
tags: [project, status/active]
status: active | paused | done | archived
repo: https://github.com/you/...
url: https://...
stack: [TypeScript, Next.js, ...]
created: YYYY-MM-DD
---
```

## Rules

- Always use the operator's first language for vault content (set yours below)
- Use `[[wikilinks]]` for cross-references between notes
- Keep notes concise and actionable
- Update project status when it changes
- Don't create duplicate notes; update existing ones
- After updating vault files, let Obsidian Git handle the sync

## Operator language

Set this to your vault's primary language. The default below is English.

```
VAULT_LANGUAGE=en
```

(Examples: `en`, `ru`, `es`, `pt`. The vault language overrides any session default for prose written into vault files.)
