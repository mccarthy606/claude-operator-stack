# Credits

The Claude Operator Stack is a curator's toolkit, not original software. Almost every component is built by someone else; the value this repo adds is the curation, the workflows, and the case studies that show how the components compose.

Below is the full list of authors whose work this stack depends on. If your work appears in the stack and is not credited here, please open an issue or PR — fixes are merged the same day.

## Core components

| Component | Author | Repo | License |
|-----------|--------|------|---------|
| **Claude Code** | Anthropic | [docs](https://docs.anthropic.com/en/docs/claude-code/overview) | proprietary |
| **Everything Claude Code (ECC)** | [@affaan-m](https://github.com/affaan-m) | [github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | MIT |
| **Toprank** | nowork-studio | [github.com/nowork-studio/toprank](https://github.com/nowork-studio/toprank) | see upstream |
| **Frontend-Design plugin** | Anthropic | [github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | MIT |
| **Obsidian** | Obsidian team | [obsidian.md](https://obsidian.md) | proprietary, free for personal use |
| **OMEGA Memory** | local protocol | — | — |

## MCP servers used in the example config

| Server | Author |
|--------|--------|
| `@modelcontextprotocol/server-github` | Anthropic |
| `@supabase/mcp-server-supabase` | Supabase |
| `@railway/mcp-server` | Railway |
| `@playwright/mcp` | Microsoft |
| `scrapling-mcp` | scrapling community |
| `@modelcontextprotocol/server-filesystem` | Anthropic |
| `@modelcontextprotocol/server-memory` | Anthropic |
| `@upstash/context7-mcp` | Upstash |
| `@modelcontextprotocol/server-sequential-thinking` | Anthropic |
| `exa-mcp-server` | Exa |
| `firecrawl-mcp` | Firecrawl |
| `fal-ai-mcp-server` | fal.ai |
| `claude-scheduled-tasks-mcp` | scheduled-tasks community |

(Each MCP server has its own license — check upstream.)

## ECC skills credited explicitly

ECC ships with `origin:` frontmatter in every skill, so derived works can preserve the credit chain. The skills this stack references most often, with their original authors as recorded in ECC's own repo:

- All ECC core skills — credited to ECC and its contributor list

If you depend on a specific ECC skill in your own derived stack, copy the `origin:` line into your derived skill's frontmatter and add your delta separately. That's the convention ECC itself follows.

## Contributors to this stack

The list below grows as PRs land. To opt out, mention it in your PR.

- Dmitry McCarthy ([@mccarthy606](https://github.com/mccarthy606)) — author of the stack and operator playbook

## Inspiration

The structure of the README and the "operator playbook" framing is influenced by:

- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) by [@affaan-m](https://github.com/affaan-m) — both the success pattern and the format
- The broader open-source AI tooling community

## A note on attribution

Open source works because credit chains stay intact. If you fork this stack:

- Keep the upstream component links in `stack/` files
- Keep this `credits/README.md` (add yourself, don't replace)
- If you publish derived case studies, name the stack
- If you build a commercial product on top, that's allowed under MIT, but a one-line "based on Claude Operator Stack by @mccarthy606" in your README is the courteous move

The goal is to make it easy for others to find the same building blocks, not to demand royalties.
