# configs/

Sanitized configuration examples. Nothing here contains real secrets — every credential is a `${VAR}` placeholder or a `YOUR_*_HERE` token.

## Files

| File | Destination | Notes |
|------|-------------|-------|
| `settings.json.example` | `~/.claude/settings.json` | Plugin enablement + minimal hook scaffolding. Audit and trim. |
| `mcp-servers.json.example` | `~/.claude/mcp-configs/mcp-servers.json` | The MCP servers I run. Comment out what you don't need. |
| `rules/obsidian-integration.md` | `~/.claude/rules/obsidian-integration.md` | Tells Claude to read `~/Brain/Projects/<name>.md` at session start. |
| `hooks/` | `~/.claude/hooks/` | Custom hook scripts. Audit before installing. |

## Setup pattern

The `install.sh` at the repo root copies these files as sidecars, writing them to `<dest>.from-operator-stack` so you can diff and merge into your existing config by hand. It does not silently overwrite your `settings.json`.

If you want to apply them directly:

```bash
# Backup first
cp ~/.claude/settings.json ~/.claude/settings.json.backup.$(date +%s)
cp ~/.claude/mcp-configs/mcp-servers.json ~/.claude/mcp-configs/mcp-servers.json.backup.$(date +%s) 2>/dev/null || true

# Then copy
cp configs/settings.json.example ~/.claude/settings.json
cp configs/mcp-servers.json.example ~/.claude/mcp-configs/mcp-servers.json
cp configs/rules/*.md ~/.claude/rules/
```

## Tokens and `${VAR}` substitution

`${VAR}` placeholders in `mcp-servers.json` are resolved from your shell environment. Export your tokens before launching Claude Code:

```bash
# Pattern using macOS keychain
export GITHUB_PAT="$(security find-generic-password -s github-pat -w)"
export EXA_API_KEY="$(security find-generic-password -s exa-key -w)"
```

On Linux, use `pass` or `secret-tool`. On Windows, use `cmdkey` + `wincred`.

Never put raw tokens in shell rc files that get committed to git or screenshot.

## What's deliberately not here

- My actual `settings.json` — it has hooks specific to ECC's runtime + paths I'd have to scrub
- My OAuth-resolved tokens (those live in the keychain)
- Project-level overrides — those live in each project's own `.claude/`

If you want to see how I wire all this together end-to-end, see [stack/mcp-servers.md](../stack/mcp-servers.md) and [stack/obsidian-brain.md](../stack/obsidian-brain.md).
