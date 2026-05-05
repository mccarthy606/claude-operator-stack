# claude-operator-stack

Wizard installer for the [Claude Operator Stack][repo] — a curated stack of skills, agents, MCP servers, and operator workflows for Claude Code.

```bash
npx claude-operator-stack init --dry-run    # preview
npx claude-operator-stack init              # apply
npx claude-operator-stack verify            # audit ~/.claude/
npx claude-operator-stack list-stack        # show the 4 core + 2 opt-in components
```

This CLI is the node-native sibling of [`install.sh`][install] in the parent repo. It targets the same files (`~/.claude/settings.json`, `~/.claude/mcp-configs/mcp-servers.json`, `~/.claude/rules/obsidian-integration.md`) and obeys the same safety rule:

> **`settings.json` and `mcp-servers.json` are NEVER overwritten silently.** They go to `*.from-operator-stack` sidecar files. Diff and merge by hand.

Pick whichever path you trust. Both produce the same result. Don't run them back-to-back on a fresh `~/.claude/` — they will create duplicate sidecars.

## Commands

### `init`

Interactive wizard that walks the four `install.sh` steps in `prompts` form:

1. Detect `claude` CLI (exits with `2` if not found).
2. Pick which marketplaces to enable.
3. Copy sanitized configs as sidecars; opt-in copy of custom hooks; record vault path.
4. Print the manual `/plugin marketplace add` and `/plugin install` commands you'll run inside Claude Code.

```text
Usage: claude-operator-stack init [options]

Options:
  --dry-run               show what would happen, write nothing
  -y, --yes               accept all defaults; non-interactive
  --claude-dir <path>     override ~/.claude/ resolution (test injection)
  -h, --help              show help
```

Exit codes: `0` success · `1` user aborted · `2` `claude` CLI missing · `3` filesystem error.

### `verify`

Read-only audit of `~/.claude/`. Reports which stack components are wired and which are missing. Never writes.

```text
Usage: claude-operator-stack verify [options]

Options:
  --json                  emit machine-readable JSON instead of a table
  --claude-dir <path>     override ~/.claude/ resolution (test injection)
  -h, --help              show help
```

Exit codes: `0` all wired · `1` `settings.json` not found · `2` `settings.json` unparsable · `10` at least one component missing.

### `list-stack`

Static printout of the stack components, grouped by tier (4 core, then 2 opt-in) — name, layer, author, repo. Mirrors the README + stack/README.md framing. Useful as a sanity check before you run `init`.

```text
Usage: claude-operator-stack list-stack [options]

Options:
  --json                  emit JSON instead of a table
  -h, --help              show help
```

Exit code: always `0`.

## What this CLI does NOT do

- It does not call the `claude` CLI. Marketplace install is interactive inside Claude Code; this wizard prints the commands, the user runs them.
- It does not install MCP servers. `mcp-servers.json.example` is copied as a sidecar; you replace tokens by hand.
- It does not run a plugin runtime. ECC owns runtime; this CLI owns installer ergonomics.
- It does not publish itself. Pinned at `0.1.0`; publishing coordinates with the public visibility flip in Phase 9 of the [parent repo roadmap][roadmap].

## Local development

The CLI lives in `packages/cli/` of the [parent monorepo][repo]. From the repo root:

```bash
npm install                                # installs the workspace
npm --workspace packages/cli run build     # produces dist/cli.js
npm --workspace packages/cli test          # vitest run

# Direct invocation against the source (no build needed)
npm --workspace packages/cli run dev -- list-stack

# Verify the built bin
node packages/cli/dist/cli.js --help
node packages/cli/dist/cli.js init --dry-run --claude-dir /tmp/cos-test
```

The package is built with `tsup` to a bundled ESM module (`dist/cli.js`, ~24 KB) with a `#!/usr/bin/env node` shebang on the bin file, plus three small runtime dependencies pulled by `npm install`: `commander`, `prompts`, and `picocolors`. Node-built-in imports keep their `node:` prefix in the bundled artefact. Configs ship inside the tarball under `configs/` so `init` is self-sufficient — no monorepo or network access required at runtime. Node 20 or newer is required.

## License

MIT — see [LICENSE](./LICENSE). Third-party components installed by `init` are licensed by their respective authors; see [`credits/README.md`][credits] in the parent repository.

[repo]: https://github.com/mccarthy606/claude-operator-stack
[install]: https://github.com/mccarthy606/claude-operator-stack/blob/main/install.sh
[credits]: https://github.com/mccarthy606/claude-operator-stack/blob/main/credits/README.md
[roadmap]: https://github.com/mccarthy606/claude-operator-stack/tree/main/.planning
