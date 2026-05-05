---
name: bridge-context
description: Bridge decisions and concepts from a source project into the current session via the graphify knowledge graph, applying the operator's anonymisation rules so cross-project context surfaces without leaking real names, URLs, or keys.
origin: claude-operator-stack
---

# /bridge-context

Surface cross-project context without leaving the current session's discipline. The command takes a source project name, walks the graphify knowledge graph against that project's subgraph, applies the standard `Discipline A/B/C` anonymisation pass, and returns up to 5 bridged decisions ranked by graph centrality and recency.

When invoked, this command runs the [`multi-project-context-bridge`](../skills/multi-project-context-bridge/SKILL.md) skill with the args and defaults below.

## When to use

- You are in project B's session and reference a decision from project A ("what did we pick for payments on the marketplace?").
- You are starting a focused session after a Monday review pick and want the prior project's last decisions surfaced as background.
- You are writing a case study or post-mortem and want the cross-project decisions made over the last quarter as raw material, anonymised.
- You explicitly say "bridge from <project>" or "pull decisions from <project>" mid-session.

## Usage

```
/bridge-context <source-project> [--target <project>] [--anonymisation strict|loose] [--limit N]
```

| Arg / flag | Type | Default | Notes |
|------------|------|---------|-------|
| `<source-project>` | required | — | Matches a `~/Brain/Projects/<name>.md` filename (basename without `.md`). |
| `--target` | optional | basename of `pwd` | Target project name; default is the current working directory. |
| `--anonymisation` | optional | `strict` | `strict` = full alias map; `loose` = URLs and keys still stripped, project and partner names retained. Never default to `loose`. |
| `--limit` | optional | `5` | Cap on the number of bridged items returned. Bridges are primers, not dumps. |

The source project is required upfront so Claude does not have to ask mid-session — it derives candidates from `~/Brain/Projects/*.md` only when you omit the arg.

## Examples

```
/bridge-context omega-launch
```
Bridges from `~/Brain/Projects/omega-launch.md`'s subgraph into the current project (target = `pwd`), strict anonymisation, top 5 items by centrality + recency.

```
/bridge-context omega-launch --target side-saas --limit 3
```
Same source, explicit target, capped at 3 bridged items. Use for focused project-pair bridging instead of "from A to all".

```
/bridge-context legal-tool --anonymisation loose
```
Loose anonymisation (real project and counterparty names retained, URLs and keys still stripped). Use only when the bridge stays internal — never paste loose-mode output into a public artefact without running it through `/anonymise-case-study` first.

### Example output shape

```markdown
## Bridged context — Project-A → Project-B
Traversal: graphify path · marketplace_payments → onboarding_flow

- **[2026-04-22]** Picked Stripe Connect Standard over Express for marketplace because the operator already had Stripe Atlas; saved 2 weeks of compliance setup. _(from Project-A)_
- **[2026-04-15]** Chose Telegram bot for v0 lead capture before promoting to Supabase. _(from Project-A)_

Bridged 2 items from Project-A to Project-B · time window: last 30 days · anonymisation: strict.
Alias map applied consistently to 2 items (1 project alias, 1 counterparty alias).
```

## Behavior

1. Verify `.anonymisation-map.local` is gitignored before reading it; refuse if not (the alias map is the most sensitive artefact in the discipline).
2. Confirm source and target. If source equals target, stop — bridging within one project is not a use case. If the target lacks a project note, surface that fact but proceed.
3. Pick the traversal: concept lookup (`/graphify query`), two-concept bridge (`/graphify path`), or recency dump (filtered by `source_file` prefix + `captured_at` window). Default time window is 30 days.
4. Apply the anonymisation pass — replace project names with the agreed alias, strip URLs containing known-real domains, strip API key patterns, replace counterparty names with stable `Counterparty-N` mapping.
5. Rank by graph centrality (node degree within the source's subgraph) + recency. Cap at 5 items by default.
6. Render each item as `**[YYYY-MM-DD]** <anonymised content> _(from <Project-A>)_`, append a one-line meta-summary, and confirm the alias map applied consistently end-to-end.

Full protocol — including how internal cross-references are preserved and how zero-match traversals are reported — lives in the wrapped skill.

## Defaults and conventions

- **Alias scheme**: same as [`/anonymise-case-study`](anonymise-case-study.md) — `Project-A/B`, `Counterparty-N`, `Customer-N`. Consistency across commands is the point.
- **Time window**: last 30 days against `captured_at` or file mtime; widen for quarterly post-mortems, narrow for last-week-only bridges.
- **Limit**: 5 items max by default. A 30-node dump is a backlog import, not a bridge.
- **Direction**: one direction per call. Bridging A→B and B→A in the same response collapses the namespace and the alias map stops being stable.
- **Read-only**: never auto-writes the bridge into the target project's note. The bridge is ephemeral context unless you explicitly persist it.

## Related

- Wrapped skill: [`skills/multi-project-context-bridge/SKILL.md`](../skills/multi-project-context-bridge/SKILL.md)
- Adjacent: [`/anonymise-case-study`](anonymise-case-study.md) — shares the alias scheme; the bridge is the cross-project specialisation of the same anonymisation discipline.
- Workflow: [`workflows/parallel-projects.md`](../workflows/parallel-projects.md) — Habit 3 + the "context windows" section establish the cross-session bridge discipline.
- Stack: [`stack/graphify.md`](../stack/graphify.md) — the knowledge-graph layer this command traverses.
