# Claude Code from Zero

> **Time:** ~1h
> **Stack:** 4 core (Claude Code CLI, Obsidian, graphify, Frontend-Design) + 2 opt-in (Everything Claude Code, Toprank), MCPs
> **Used in:** every project in the [stack](../stack/), referenced by all other recipes

## The problem

You have just opened a fresh project directory. Maybe a new product, maybe a sandbox for an experiment, maybe a contractor handed you a repo. You want Claude Code to be useful in this directory within the first session, not after a week of trial-and-error config drift.

The default Claude Code install is a chat box. To get from that to "operator-grade orchestrator," you need a project-level `CLAUDE.md`, a coherent `~/.claude/` setup, the 4 core components (graphify is recommended where you have access — see step 3), optionally the 2 opt-in marketplaces, and a small curated MCP loadout. This recipe is the install path.

## Solution overview

The stack splits into 4 core components (always installed where available) and 2 opt-in marketplaces (install when the use case earns it):

- **Core:** Claude Code, Obsidian, graphify (recommended; operator-private until v1.1), Frontend-Design
- **Opt-in:** Everything Claude Code (broad skill catalog), Toprank (SEO + paid ads)

Three layers, in order. First the global `~/.claude/` config (only done once per machine — skip if already set up). Second the project's `CLAUDE.md` (always per-project). Third the per-session priming move.

Skip any of the always-installed core layers and you will pay for it. graphify is the one core piece that is currently operator-private — the cookbook documents it as the interface contract and readers who do not have it can substitute another knowledge-graph layer or proceed without one. Do the four available core layers and Claude Code reads the project on session start, knows the stack, knows the conventions, and knows which skills to reach for. The two opt-in marketplaces are real layers but only earn their keep once specific use cases show up.

## Step-by-step

### 1. Install Claude Code (required)

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

You need Node 18+. Verify the binary is on `PATH`. The first invocation will prompt for an Anthropic API key or browser login.

### 2. Install Obsidian + create `~/Brain` (required)

Obsidian is the cross-session memory layer. Without it Claude has no continuity across sessions.

```bash
# Install Obsidian: https://obsidian.md/download
# Then create the vault skeleton:
mkdir -p ~/Brain/{Projects,Knowledge,Daily,Content,Templates,Archive}
```

Open Obsidian, point it at `~/Brain`, and confirm you can create a note. Wire the [obsidian-integration rule](../configs/rules/obsidian-integration.md) into `~/.claude/rules/` so Claude reads `~/Brain/Projects/<name>.md` on session start.

### 3. Install graphify (recommended)

graphify is the cross-project knowledge-graph layer. It is operator-private at the time of this README — public release is planned for v1.1. Skip this step if you do not have local access; the cookbook's `/graphify` references will be inactive but the rest of the stack works without it. See [stack/graphify.md](../stack/graphify.md) for the interface contract and the full setup once you have it installed. Once installed, run `/graphify` once at the root of any project to build the initial graph.

### 4. Install Frontend-Design (required)

Frontend-Design ships UI generation that does not look like every other shadcn template. It is part of the official Anthropic plugin marketplace.

Inside Claude Code:

```text
/plugin marketplace add anthropics/claude-plugins-official
/plugin install frontend-design@claude-plugins-official
```

Verify the skill is loaded with `/help`.

### 5. Install Everything Claude Code (opt-in)

ECC is the broad skill + agent catalog. Install when you want the GSD family, the chief-of-staff orchestration, code review skills, and the marketing skill cluster available globally. Skip if you are not sure you want the full catalog yet — you can come back to it.

```text
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

Verify the slash commands show up in `/help`.

### 6. Install Toprank (opt-in)

Toprank ships curated content + SEO + paid-ads skills. Skip if you do not run SEO or paid traffic — most operators do not need this on day one.

```text
/plugin marketplace add nowork-studio/toprank
/plugin install toprank@nowork-studio
```

### 7. Skeleton `~/.claude/CLAUDE.md`

This file is global instructions for every project on the machine. Keep it short and operator-flavored. The skeleton below assumes only the 4 core components — it works standalone whether you installed the opt-in marketplaces or not.

```markdown
## Memory
- ~/Brain Obsidian vault is canonical project memory
- Before non-trivial tasks, check ~/Brain/Projects/ for context
- Knowledge graph: trigger `/graphify` in any project root to build/refresh the graph; use `/graphify query "<concept>"` mid-session for cross-file context

## UI work
- Use the Frontend-Design skill for any production UI surface — avoid template-default shadcn output

## Voice
- Operator-first, terse, opinionated
- No marketing fluff, no emojis in docs
- State the thing, give a reason, move on

## Workflow defaults
- TDD for non-trivial changes
- Commit after every working step, not at the end
- Never push to main without local verification
```

If you installed Everything Claude Code, you can also reference its skills (e.g., `/gsd-progress`, `chief-of-staff`) in this file. If you skipped ECC, the skeleton above is complete on its own.

### 8. The MCP loadout

The minimum useful set for an operator project, configured in `~/.claude/mcp.json`:

| MCP | Why |
|-----|-----|
| `context7` | Current library docs, beats stale training data |
| `supabase` | Direct DB ops when the project uses Supabase |
| `playwright` | Real browser automation for E2E + screenshots |
| `github` | Issues, PRs, repo ops without leaving the session |
| `scheduled-tasks` | Cron-style recurring prompts (see [recipe 11](11-scheduled-prompts-cron.md)) |

Install only what each project actually needs. Do not enable a heavy MCP in a project that does not use it — the tool list grows and the model picks worse.

### 9. Per-project `CLAUDE.md`

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

### 10. First-session checklist

When you open Claude Code in the new project the first time:

1. Confirm the project `CLAUDE.md` is read (it will appear in the system context)
2. If you installed ECC, run `/gsd-progress`. Otherwise just `ls .planning/` (or skip this step if you do not use a planning directory).
3. Ask Claude to summarize the repo structure as a sanity check before any edits
4. Verify the relevant MCP tools are loaded (`/mcp` lists them)
5. Run `/graphify` once at the root to build the project knowledge graph — output lands in `~/Brain/graphify-out/<project>/` and `~/Brain/Graphify/<project>/`. Rebuild incrementally with `--update`.

### Knowledge graph queries

Trigger: `/graphify`. Already installed in step 3 — use `/graphify query "<concept>"` mid-session to pull cross-file context.

Output appears in `~/Brain/graphify-out/<project>/` and `~/Brain/Graphify/<project>/`. The graph rebuilds incrementally with `--update` and live with `--watch`.

## Pitfalls

- **Skipping the per-project `CLAUDE.md`.** Without it, every session starts from zero and the operator-first voice does not apply. The global file is not a substitute.
- **Enabling every MCP "just in case."** Each MCP adds tools to the model's choice space. A bloated MCP list makes the model pick worse. Enable per-project, not globally.
- **Installing every opt-in on day one.** ECC and Toprank are real layers but only earn their keep once you actually need the catalog or paid-distribution skills. Start with the 4 core, add opt-ins when the use case shows up.
- **Forgetting to verify skills are discoverable.** If `/help` does not list the Frontend-Design slash commands (or the ECC ones if you installed it), the marketplace add or plugin install step failed. Re-run the `/plugin` commands and check for errors.
- **Editing the global `CLAUDE.md` per-project.** That file is global. Per-project goes in the project root. Mixing them up means every project gets the last project's conventions.

## References

- [Claude Code docs](https://docs.claude.com/en/docs/claude-code/overview)
- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)
- [stack/ecc.md](../stack/ecc.md) — the ECC reference in this stack
- [stack/mcp-servers.md](../stack/mcp-servers.md) — full MCP reference
- [workflows/parallel-projects.md](../workflows/parallel-projects.md) — how this setup scales when you run several projects in parallel
