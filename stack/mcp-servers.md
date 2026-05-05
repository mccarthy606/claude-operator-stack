# MCP Servers

The MCP (Model Context Protocol) servers I run, what each is for, and how to authenticate them. Full sanitized config in [`configs/mcp-servers.json.example`](../configs/mcp-servers.json.example).

## Active servers

| Server | Purpose | Auth |
|--------|---------|------|
| **github** | repo ops, issue/PR triage, code search | GitHub PAT |
| **supabase** | DB, edge functions, migrations | Supabase access token + project ref |
| **railway** | deploys, logs, env management | Railway token |
| **scrapling** | stealthy web scraping with browser stealth | none (local) |
| **playwright** | browser automation for testing | none (local) |
| **filesystem** | sandboxed file ops outside CWD | path allowlist |
| **memory** (Anthropic ref) | persistent KV memory | none (local) |
| **graphify** | knowledge-graph layer — BFS/DFS traversal + community detection over project notes and code | none (local) |
| **context7** | live docs lookup for libraries | optional API key |
| **sequential-thinking** | structured chain-of-thought | none |
| **vercel** | deploys, project management | Vercel token |
| **clickhouse** | analytics queries | OAuth |
| **mcp-registry** | discover other MCP servers | none |
| **scheduled-tasks** | cron-style scheduled prompts | none (local) |

## Servers I tested and dropped

- **token-optimizer** — too many tools (~80), bloats context. Specific operations are useful but the surface area cost was too high for daily use.
- **browser-use** — overlaps with Playwright + scrapling for my use cases.
- **Claude_in_Chrome / computer-use** — keep installed but only enable when the task genuinely needs them. They consume context fast.

## Setup pattern

Each server in `mcp-servers.json` has the same shape:

```json
{
  "mcpServers": {
    "<name>": {
      "type": "stdio" | "http",
      "command": "...",
      "args": [...],
      "env": { "API_KEY": "${YOUR_API_KEY}" }
    }
  }
}
```

Use `${VAR}` style placeholders in the example config — they get replaced from your shell env or a `.env` you load before starting Claude Code.

Never commit the resolved file. Keep `mcp-servers.json` gitignored and ship the `.example` only.

## OAuth servers

Several servers (Cloudflare, Vercel under the new flow, Toprank/NotFair, ClickHouse) use OAuth instead of static tokens. First call triggers a browser auth flow; tokens get stored in your OS keychain.

Pros: no token rotation drama. Cons: first session on a new machine has a one-time browser dance.

## Loading tokens safely

Pattern I use:

```bash
# ~/.zshrc (excerpt)
export GITHUB_PAT="$(security find-generic-password -s github-pat -w)"
export SUPABASE_ACCESS_TOKEN="$(security find-generic-password -s supabase-token -w)"
```

Tokens live in macOS keychain (`security` CLI on macOS). On Linux, use `pass` or `secret-tool`. Do not put raw tokens in your dotfiles — even private ones get accidentally pasted into screenshots and tweets.

## Auditing what's loaded

Inside Claude Code:

```
/mcp list
```

Shows which servers connected, which need auth, and which failed.

## Performance note

Every MCP server costs context tokens at session start (tool schemas are loaded). Run only what you actually use. The full list above is what I keep enabled because each pulls its weight at least weekly. Prune yours similarly.
