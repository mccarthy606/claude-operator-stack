# Claude Code from Zero

> **Time:** ~1h
> **Stack:** Claude Code CLI, ECC, Toprank, Frontend-Design, graphify, MCPs
> **Used in:** every project in the [stack](../stack/), referenced by all other recipes

## The problem

You have just opened a fresh project directory. Maybe a new product, maybe a sandbox for an experiment, maybe a contractor handed you a repo. You want Claude Code to be useful in this directory within the first session, not after a week of trial-and-error config drift.

The default Claude Code install is a chat box. To get from that to "operator-grade orchestrator," you need a project-level `CLAUDE.md`, a coherent `~/.claude/` setup, the ECC + Toprank + Frontend-Design skill base, and a small curated MCP loadout. This recipe is the install path.

## Solution overview

Three layers, in order. First the global `~/.claude/` config (only done once per machine — skip if already set up). Second the project's `CLAUDE.md` (always per-project). Third the per-session priming move.

Skip any layer and you will pay for it. Do all three and Claude Code reads the project on session start, knows the stack, knows the conventions, and knows which skills to reach for.

## Step-by-step

### 1. Install the CLI

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

You need Node 18+. Verify the binary is on `PATH`. The first invocation will prompt for an Anthropic API key or browser login.

### 2. Install the global skill base

The three pieces every operator project benefits from:

```bash
# Everything Claude Code (skill index, slash commands, agents)
git clone https://github.com/affaan-m/everything-claude-code.git ~/.claude/ECC
bash ~/.claude/ECC/install.sh

# Toprank (curated content + SEO skills)
git clone https://github.com/toprankhq/toprank ~/.claude/toprank

# Frontend-Design (production-grade frontend skill)
git clone https://github.com/anthropics/skills ~/.claude/anthropic-skills
```

Verify that skills are discoverable from a Claude Code session by running `/help` and confirming the slash commands show up.

### 3. Skeleton `~/.claude/CLAUDE.md`

This file is global instructions for every project on the machine. Keep it short and operator-flavored. A reasonable skeleton:

```markdown
## Memory
- ~/Brain Obsidian vault is canonical project memory
- Before non-trivial tasks, check ~/Brain/Projects/ for context
- Knowledge graph: trigger `/graphify` in any project root to build/refresh the graph; use `/graphify query "<concept>"` mid-session for cross-file context

## Voice
- Operator-first, terse, opinionated
- No marketing fluff, no emojis in docs
- State the thing, give a reason, move on

## Workflow defaults
- TDD for non-trivial changes
- Commit after every working step, not at the end
- Never push to main without local verification
```

### 4. The MCP loadout

The minimum useful set for an operator project, configured in `~/.claude/mcp.json`:

| MCP | Why |
|-----|-----|
| `context7` | Current library docs, beats stale training data |
| `supabase` | Direct DB ops when the project uses Supabase |
| `playwright` | Real browser automation for E2E + screenshots |
| `github` | Issues, PRs, repo ops without leaving the session |
| `scheduled-tasks` | Cron-style recurring prompts (see [recipe 11](11-scheduled-prompts-cron.md)) |

Install only what each project actually needs. Do not enable a heavy MCP in a project that does not use it — the tool list grows and the model picks worse.

### 5. Per-project `CLAUDE.md`

Inside the new project root, create `CLAUDE.md`:

```markdown
# CLAUDE.md — <project-name>

## What this is
<one paragraph: what the product does, who it's for>

## Stack
- Frontend: Next.js 15 (app router) / Tailwind / shadcn
- Backend: FastAPI / Python 3.12 / uv
- DB: Supabase (Postgres + Auth + Storage)
- Deploy: Vercel (frontend) / Railway (backend)
- Errors: Sentry
- Analytics: GA4 + Cloudflare Web Analytics

## Conventions
- TDD required for backend logic
- Server components by default, mark client components explicitly
- Tailwind utility classes, no inline styles
- Type-safe DB access via supabase generated types

## Out of scope this session
- <whatever you want Claude to skip — auth refactor, design polish, etc.>
```

### 6. First-session checklist

When you open Claude Code in the new project the first time:

1. Confirm the project `CLAUDE.md` is read (it will appear in the system context)
2. Run `/gsd-progress` if using the GSD skills, or just `ls .planning/` if not
3. Ask Claude to summarize the repo structure as a sanity check before any edits
4. Verify the relevant MCP tools are loaded (`/mcp` lists them)
5. If you want a knowledge graph for the project, run `/graphify` once at the root — output lands in `~/Brain/graphify-out/<project>/` and `~/Brain/Graphify/<project>/`. Rebuild incrementally with `--update`.

### Knowledge graph (optional but recommended)

Trigger: `/graphify`. Run once in your project root to build the initial graph; use `/graphify query "<concept>"` mid-session to pull cross-file context.

Output appears in `~/Brain/graphify-out/<project>/` and `~/Brain/Graphify/<project>/`. The graph rebuilds incrementally with `--update` and live with `--watch`.

## Pitfalls

- **Skipping the per-project `CLAUDE.md`.** Without it, every session starts from zero and the operator-first voice does not apply. The global file is not a substitute.
- **Enabling every MCP "just in case."** Each MCP adds tools to the model's choice space. A bloated MCP list makes the model pick worse. Enable per-project, not globally.
- **Cloning ECC and Toprank into the project repo.** They go in `~/.claude/`, not the project. Cloning them in-repo bloats the working tree and confuses git.
- **Forgetting to verify skills are discoverable.** If `/help` does not list the ECC slash commands, the install path failed. Re-run `bash ~/.claude/ECC/install.sh` and check for errors.
- **Editing the global `CLAUDE.md` per-project.** That file is global. Per-project goes in the project root. Mixing them up means every project gets the last project's conventions.

## References

- [Claude Code docs](https://docs.claude.com/en/docs/claude-code/overview)
- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)
- [stack/ecc.md](../stack/ecc.md) — the ECC reference in this stack
- [stack/mcp-servers.md](../stack/mcp-servers.md) — full MCP reference
- [workflows/parallel-projects.md](../workflows/parallel-projects.md) — how this setup compounds when you run several projects
