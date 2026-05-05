# Solo-founder Skills (Originals)

Six original `SKILL.md` packages targeting solo-founder use-cases ECC's 182-skill catalog doesn't cover. Each skill is a prompt Claude executes when its description matches your situation — copy the directory under `~/.claude/skills/<name>/` and Claude Code discovers it automatically.

These ship alongside [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), not instead of it. Both directories coexist under `~/.claude/skills/`; Claude dispatches by `description` matching.

## Cookbook vs Skills

| | Cookbook | Skills |
|---|----------|--------|
| **Audience** | The human operator reads it | Claude executes it |
| **Shape** | How-to doc, ~100-200 lines, problem → solution → code → pitfalls → references | Invocable prompt, ~80-200 lines, frontmatter + numbered steps for the agent |
| **When to read** | When you sit down to wire X for the first time | Never — Claude fires it when the situation triggers |
| **Example** | `cookbook/02-stripe-connect-p2p.md` walks you through Stripe Connect | `skills/solo-billing-monitor/SKILL.md` runs your weekly cost rollup |

## The 6 skills

| Skill | Use case | Path |
|-------|----------|------|
| `solo-billing-monitor` | Weekly cost rollup across cloud + AI APIs; flags >30% W/W jumps | [./solo-billing-monitor/SKILL.md](./solo-billing-monitor/SKILL.md) |
| `multi-project-context-bridge` | Bridge cross-project decisions via graphify queries with anonymisation | [./multi-project-context-bridge/SKILL.md](./multi-project-context-bridge/SKILL.md) |
| `obsidian-sync-helper` | Verify `~/Brain/Projects/<name>.md` matches the project's actual git state | [./obsidian-sync-helper/SKILL.md](./obsidian-sync-helper/SKILL.md) |
| `case-study-anonymiser` | Apply the operator's redaction playbook to a draft case study | [./case-study-anonymiser/SKILL.md](./case-study-anonymiser/SKILL.md) |
| `weekly-monday-review` | Monday review producing the 2-of-N focus pick + paused-project status | [./weekly-monday-review/SKILL.md](./weekly-monday-review/SKILL.md) |
| `ship-day-planner` | Turn a one-line product hypothesis into the 8 ship-day blocks | [./ship-day-planner/SKILL.md](./ship-day-planner/SKILL.md) |

## Install

These ship in this repo. To make Claude discover them, copy the desired skill subdirectory under `~/.claude/skills/`:

```bash
cp -r skills/solo-billing-monitor ~/.claude/skills/
```

Or use the install script (see [`install.sh`](../install.sh)).

## Convention

Every SKILL.md in this directory:

- Has frontmatter with `name`, `description`, `origin: claude-operator-stack`
- Mirrors ECC's section convention so the loader and the audience treat them identically
- Is non-overlapping with ECC at the trigger-condition level (verified at plan-time against `affaan-m/everything-claude-code/skills/`)
- References at least one concrete repo file (`workflows/...md`, `cookbook/...md`, `stack/...md`, or `case-studies/...md`)

## Related

- [cookbook/](../cookbook/) — how-to recipes for the human operator
- [workflows/](../workflows/) — the operator playbook these skills lean on
- [stack/ecc-skill-index.md](../stack/ecc-skill-index.md) — the curated reading order into ECC's 182 skills
