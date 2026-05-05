# OMEGA Memory

**Status:** local protocol + helper tools
**Layer:** persistent memory across Claude Code conversations

OMEGA is the **memory tier** of this stack. Where Obsidian is the operator-curated brain, OMEGA is the **agent-curated memory** — Claude writes to it, Claude reads from it, with a small, opinionated set of memory types.

## Memory types

OMEGA distinguishes:

- **decision** — "we picked Postgres over SQLite for X reason"
- **lesson** — "last time we did Y, it broke because Z"
- **user_preference** — "user prefers parallel tool calls"
- **pattern** — reusable approach
- **architecture** — system-level design choices

Typing memories is what makes them retrievable. Untyped memory is just a journal.

## How it integrates with Claude Code

The CLAUDE.md in this stack pins these calls at session start:

```
omega_welcome()      # context briefing
omega_protocol()     # operating instructions for the session
```

And these as needed during work:

```
omega_query(text)               # find relevant prior context
omega_store(content, "decision") # save key outcomes
omega_checkpoint()              # save state when context fills
```

Claude calls them automatically per the protocol — you don't need to type them.

## Why a separate tier from Obsidian

Different write patterns:

- **Obsidian**: high-value, human-edited, structured, slow-moving
- **OMEGA**: high-frequency, agent-edited, fine-grained, fast-moving

If you tried to put OMEGA-style decisions into Obsidian, the vault would become a wall of agent text and the human-curated structure would erode. Splitting them keeps both honest.

OMEGA is also queryable in a way Obsidian Markdown is not — typed memories with similarity search across past sessions.

## The MCP server

OMEGA exposes itself to Claude Code via an MCP server. The connection lives in `mcp-servers.json` under the `omega-memory` entry.

Install path is `uvx omega-memory serve` (preferred) or a local pipx venv (legacy). The example config in `configs/mcp-servers.json.example` ships with `uvx`.

## What ships in this stack

The OMEGA protocol entries in CLAUDE.md and the MCP server config in mcp-servers.json. The OMEGA package itself is installed separately — see the comment block in the example config for installation.

## When to use it vs. Obsidian

| Want to remember... | Where it goes |
|---------------------|---------------|
| A project's status, stack, open issues | Obsidian project note |
| A decision Claude made during a refactor | OMEGA `decision` memory |
| A bug pattern that bit me twice | OMEGA `lesson` memory |
| My rules, principles, goals | Obsidian `Me/` |
| User preference Claude learned this session | OMEGA `user_preference` |
| A reusable solution with code | Obsidian `Knowledge/` |

Both layers, separate jobs. Together they make Claude Code feel like a teammate that doesn't forget.
