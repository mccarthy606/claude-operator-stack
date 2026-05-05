# graphify

**Original repo / install path:** <!-- TODO upstream URL -->
**Author:** local (operator-built layer — not in any public marketplace yet)
**License:** see upstream

graphify is the **knowledge-graph memory tier** of this stack. Where Obsidian is the operator-curated brain, graphify is the **agent-traversable graph** — Claude reads it, Claude writes to it, with explicit + inferred edges and community-detected clusters.

## What it does

- Takes any folder of files (code, docs, transcripts, images) and turns it into a navigable knowledge graph
- Outputs three artefacts: interactive HTML viz · GraphRAG-ready JSON · plain-language `GRAPH_REPORT.md`
- Communities (clusters) detected automatically; nodes group by semantic + structural proximity
- Edges are tagged EXTRACTED (explicit in source — imports, citations, "see §3.2") or INFERRED (semantic similarity, shared data structure, latent coupling), with confidence scores attached so the audit trail is honest
- Query interface: BFS for broad context, DFS for specific paths, shortest-path between two concepts
- Optional MCP server (`/graphify <path> --mcp`) so agents can query the graph mid-session
- Watch mode for auto-rebuild on file change; incremental `--update` mode for fast re-extraction
- Audio and video transcribed via Whisper before extraction; images interpreted via vision

## How it integrates with Claude Code

Trigger: `/graphify` (or `/graphify <path>`).

Common operating shape:

- Run `/graphify ~/Projects/<project>` once to build the initial graph
- Use `/graphify add <url>` to ingest external articles, PDFs, tweets, or YouTube transcripts into the corpus
- Use `/graphify query "<question>"` mid-session to pull cross-file context that would be expensive to assemble manually
- Use `/graphify path "<concept-a>" "<concept-b>"` to find the shortest conceptual path between two ideas
- Use `/graphify explain "<concept>"` for a plain-language readout of one node and its connections
- Run `/graphify <path> --watch` in the background while working — graph re-builds on save (code changes need no LLM; docs trigger semantic re-extraction)

## Why a separate tier from Obsidian

Different access patterns:

- **Obsidian:** human-curated, hand-organized, browsable
- **graphify:** algorithm-clustered, query-able, agent-friendly

Vault prose stays human-shaped. Graph extraction sits next to it and answers questions the prose alone cannot — "what touches authentication across all my projects," "shortest path from billing to onboarding," "which files cluster around the marketplace's payment flow." Obsidian holds the operator's intent; graphify holds the structure the operator never explicitly wrote down.

## What ships in this stack

The CLAUDE.md skeleton documents the trigger; mcp-servers.json.example carries the legacy memory MCP entry that is being phased out in favor of graphify's optional MCP server. graphify itself is installed separately — see the trigger documentation for the install command.

## When to use graphify vs Obsidian

| Want to find... | Where to look |
|-----------------|---------------|
| A specific decision the operator made | Obsidian project note |
| All places "Stripe Connect" appears across projects | graphify query |
| The shortest conceptual path between two ideas | graphify path |
| A reusable how-to with code | Obsidian Knowledge/ |
| A cluster of files that move together when one changes | graphify community |
| Project status, stack, open tasks | Obsidian project note |
| The 12 surprising connections between this codebase and last quarter's notes | graphify GRAPH_REPORT.md |

Two layers, separate jobs. Obsidian is the brain the operator writes; graphify is the graph the corpus reveals when it is read structurally.

## Setup

1. Install graphify (see upstream — <!-- TODO upstream URL -->)
2. Run `/graphify` in any project directory to build the first graph
3. Optional: `/graphify <path> --mcp` to expose the MCP server for in-session queries
4. Optional: `/graphify <path> --watch` for live updates while you edit
5. Optional: `/graphify add <url>` to keep adding external sources to the corpus over time

The graph output lands in `~/Brain/graphify-out/<project>/` and `~/Brain/Graphify/<project>/` by default. The vault stays untouched; graphify writes alongside, not into.
