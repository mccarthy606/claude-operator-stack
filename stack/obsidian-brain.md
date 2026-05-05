# Obsidian as Second Brain

**Tool:** [Obsidian](https://obsidian.md) (free, local-first)
**Sync:** Obsidian Git (free) → private GitHub repo
**Vault location:** `~/Brain` (this is convention, you can name yours anything)

The Obsidian vault is the shared context surface that Claude Code reads from automatically at the start of every session — not just a notes app.

## Why it matters

When you ship 7 products in parallel, the bottleneck is context recovery, not code. "Where was I on the marketplace?" "What did I decide about Stripe Connect for the WhatsApp SaaS?" "What's the open question on the legal-tool MVP?" A structured vault that Claude reads means every session starts loaded instead of from zero.

## Vault structure

```
~/Brain/
├── Projects/        ← one note per project (status, stack, open tasks, decisions)
├── Ideas/           ← raw inbox
├── Daily/           ← daily notes (YYYY-MM-DD.md)
├── Weekly/          ← Monday review notes (separate from Daily for cadence)
├── Knowledge/       ← reusable solutions, patterns, gotchas
├── People/          ← contacts (counterparties, partners, customers)
├── Content/         ← YouTube scripts, blog drafts, research
├── Templates/       ← note templates
├── Graphify/        ← per-project knowledge graph outputs (HTML viz, GraphRAG JSON, GRAPH_REPORT.md)
├── graphify-out/    ← graphify pipeline output buffer
└── Archive/         ← completed / frozen
```

`Graphify/<project>/` is the curated, human-readable layer per project: an interactive HTML visualization, a `GRAPH_REPORT.md` summarizing communities and key concepts, and the GraphRAG JSON consumed by `/graphify query`. Treat this directory as durable artifacts you can browse and link to from project notes.

`graphify-out/` is the pipeline's output buffer — the cache, intermediate JSON, and raw artifacts produced during graph builds. It rebuilds on every `/graphify` run (incremental with `--update`, continuous with `--watch`) and is safe to delete; the curated `Graphify/` outputs survive.

`Weekly/` exists separately from `Daily/` because the cadence is different — daily notes are scratch and capture, weekly notes are the Monday review described in [workflows/parallel-projects.md](../workflows/parallel-projects.md).

## The integration rule

The piece that closes the loop: a custom rule installed at `~/.claude/rules/obsidian-integration.md`. It tells Claude:

1. **On session start:** check if the current project has a note in `~/Brain/Projects/`. If yes, read it for goals, architecture, open tasks.
2. **After completing work:** update the relevant project note — tick checkboxes, add findings.
3. **After research:** save key findings to `~/Brain/Knowledge/` so they survive across sessions.
4. **Always Russian** (or whatever your vault language is) for vault content.

This rule ships with the stack — `configs/rules/obsidian-integration.md`.

## Project note frontmatter

```yaml
---
tags: [project, status/active]
status: active | paused | done | archived
repo: https://github.com/you/...
url: https://...
stack: [TypeScript, Next.js, ...]
created: 2026-01-15
---
```

The frontmatter is structured so Dataview queries can produce a live "what's in flight" dashboard inside Obsidian. See `~/Brain/Home.md` for the dashboard pattern.

## The Me/ section

A vault-within-vault for self-context: `~/Brain/Me/` holds biography, current state, principles, and goals. Claude reads it before giving career or strategy advice (not before code edits), which stops generic startup-coach answers and produces ones grounded in your actual situation.

This is a personal section. It does not ship with the stack, since installing someone else's identity would be invasive. The structure is documented, and the install script can scaffold an empty `~/Brain/Me/` with templates if you opt in.

## Sync

Use the Obsidian Git plugin (free) and a private GitHub repo. Auto-commit every 10 minutes is a sensible default. Resolve conflicts manually — they are rare if you only edit on one device at a time.

## Scope

Obsidian is operator-curated. You write the notes, you decide the structure, Claude reads from it but does not own it. That ownership boundary is what keeps the second brain honest.
