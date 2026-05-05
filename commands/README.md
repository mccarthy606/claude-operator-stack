# Slash Commands

Six slash-commands that wrap the [`skills/`](../skills/) packages as one-keystroke verbs in Claude Code's slash-picker. Each command file is a thin shorthand: it parses operator-friendly args, applies sensible defaults, and delegates to its wrapped skill for the actual protocol.

These commands ship alongside [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), not instead of it. Both sets coexist under `~/.claude/commands/`; the names below were checked against ECC's full 67-command catalog at plan-time and re-checked at execute-time. Zero collisions.

## Skills vs commands

| | Skills | Commands |
|---|--------|----------|
| **Where it lives** | `~/.claude/skills/<name>/SKILL.md` | `~/.claude/commands/<name>.md` |
| **How Claude finds it** | Description-matching against your message | Slash-picker UI, exact name match |
| **What carries the protocol** | The skill body (numbered steps, anti-patterns, output shape) | Lives in the skill — the command is shorthand |
| **What the command adds** | n/a | Args parsing, default values, worked examples, cross-links |

The skill is the source of truth. The command is the verb you type. If the two ever drift, the skill wins.

## The 6 commands

| Command | Use case | Wrapped skill |
|---------|----------|---------------|
| [`/solo-monday-review`](solo-monday-review.md) | Monday 30-min ritual → 2-of-N focus pick + Friday touchpoints | [`weekly-monday-review`](../skills/weekly-monday-review/SKILL.md) |
| [`/anonymise-case-study`](anonymise-case-study.md) | Apply the redaction playbook to a draft before publishing | [`case-study-anonymiser`](../skills/case-study-anonymiser/SKILL.md) |
| [`/ship-day`](ship-day.md) | One-line idea → 8 timeboxed ship-day blocks | [`ship-day-planner`](../skills/ship-day-planner/SKILL.md) |
| [`/cost-rollup`](cost-rollup.md) | Weekly cross-cloud + AI cost rollup with W/W deltas | [`solo-billing-monitor`](../skills/solo-billing-monitor/SKILL.md) |
| [`/bridge-context`](bridge-context.md) | Bridge cross-project decisions via graphify, anonymised | [`multi-project-context-bridge`](../skills/multi-project-context-bridge/SKILL.md) |
| [`/sync-brain`](sync-brain.md) | Verify the Brain note matches the project's git state | [`obsidian-sync-helper`](../skills/obsidian-sync-helper/SKILL.md) |

## Install

These commands ship in this repo. To make them available to Claude Code's slash-picker, copy them into your local commands directory:

```bash
cp commands/*.md ~/.claude/commands/
```

Or use the install script (see [`install.sh`](../install.sh)) once it grows command-pass support.

## Convention

Every command file in this directory:

- Has frontmatter with `name` (matching the filename stem), `description` (one imperative sentence ≤200 chars naming trigger + output), and `origin: claude-operator-stack`.
- Cross-links to its wrapped skill in both the opening paragraph and the `## Related` footer.
- Contains `## Usage`, `## Examples`, `## Behavior`, `## Defaults and conventions`, and `## Related` sections in that order.
- Is 80-150 lines. Below 80 means cargo-cult shim; above 150 means duplicating skill content.
- Names are kebab-case. Where the wrapped skill name is too long for a verb, the command uses a shorter form (e.g. `cost-rollup` instead of `solo-billing-monitor`, `sync-brain` instead of `obsidian-sync-helper`).

## Related

- [`skills/README.md`](../skills/README.md) — the source-of-truth skills these commands wrap.
- [`cookbook/README.md`](../cookbook/README.md) — how-to recipes for the human operator (cookbook = human reads, skills = Claude executes, commands = operator types).
- [Everything Claude Code commands/](https://github.com/affaan-m/everything-claude-code/tree/main/commands) — the 67-command catalog these coexist alongside; see [`stack/ecc-skill-index.md`](../stack/ecc-skill-index.md) for the curated ECC reading order.
