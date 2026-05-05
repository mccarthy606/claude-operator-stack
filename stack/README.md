# The Stack

Six components, one curated layout, full attribution.

```mermaid
flowchart TB
    subgraph runtime[" "]
        CC[Claude Code<br/><sub>Anthropic · runtime</sub>]
    end

    subgraph plugins["Plugin marketplaces (skills + agents + commands)"]
        ECC[Everything Claude Code<br/><sub>@affaan-m</sub>]
        TR[Toprank<br/><sub>nowork-studio · SEO + Ads</sub>]
        FD[Frontend-Design<br/><sub>Anthropic · UI generation</sub>]
    end

    subgraph memory["Two-tier memory"]
        OB[Obsidian Brain<br/><sub>operator-curated context</sub>]
        OM[OMEGA Memory<br/><sub>agent-curated typed memory</sub>]
    end

    subgraph integrations["MCP servers (~15)"]
        MCP[github · supabase · railway · vercel<br/>scrapling · playwright · omega-memory<br/>filesystem · context7 · exa · firecrawl · ...]
    end

    CC --> ECC
    CC --> TR
    CC --> FD
    CC --> OB
    CC --> OM
    CC --> MCP

    classDef rt fill:#0a0a0f,stroke:#22c55e,stroke-width:2px,color:#f4f4f5
    classDef plug fill:#0a0a0f,stroke:#7c3aed,color:#e4e4e7
    classDef mem fill:#0a0a0f,stroke:#22d3ee,color:#e4e4e7
    classDef int fill:#0a0a0f,stroke:#f59e0b,color:#e4e4e7
    class CC rt
    class ECC,TR,FD plug
    class OB,OM mem
    class MCP int
```

| Component | Layer | Original author | Notes |
|-----------|-------|-----------------|-------|
| [Everything Claude Code](ecc.md) | Skills + Agents | [@affaan-m](https://github.com/affaan-m) | 182 skills, 48 agents — the backbone |
| [Toprank](toprank.md) | SEO + Paid Ads | nowork-studio | Google Ads, Meta Ads, GEO, GSC analysis |
| [Frontend-Design](frontend-design.md) | UI generation | Anthropic | Distinctive, opinionated UI, anti-template |
| [Obsidian as Second Brain](obsidian-brain.md) | Operator-curated context | local | `~/Brain` vault as shared context surface |
| [OMEGA Memory](omega-memory.md) | Agent-curated memory | local | Persistent typed memory across sessions |
| [MCP Servers](mcp-servers.md) | Integrations | various | The MCP servers I actually run |

## Read order

If you are setting this up for the first time, read in this order:

1. **mcp-servers.md** — the integrations are the foundation. Without GitHub + Supabase + scrapling + omega-memory, the workflows below don't have anything to call.
2. **ecc.md** — the skill + agent layer that sits on top of MCP.
3. **toprank.md** — only if you do SEO or paid ads (most operators do).
4. **frontend-design.md** — only if you ship UIs.
5. **obsidian-brain.md** — once you have more than one project in flight.
6. **omega-memory.md** — once Obsidian alone stops being enough.

## Why these six

Everyone's stack has skills and agents. The combination that makes this one different:

- **ECC + Toprank** = code work + business work share one runtime
- **Obsidian + OMEGA** = two-tier memory (operator-curated + agent-curated) instead of one
- **MCP set chosen for solo operator load** — not the maximum, the minimum that earns its keep

Adding more components is easy. The discipline is removing components that don't earn their keep.

## What is *not* in the stack

Deliberately:

- **Cursor** — I use it for some tasks, but the stack is built around Claude Code as the orchestrator. Cursor is a tool, not a layer.
- **General-purpose computer-use** — installed but rarely enabled. Burns context.
- **Anything with auto-commit + auto-push enabled** — too risky for solo ops where there's no second pair of eyes.
