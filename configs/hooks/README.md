# Custom Hooks

Audit any hook before installing. Hooks run on every matching tool use — they can read tool input, modify behavior, and access your shell environment.

## Hooks shipped here

Snapshot from the operator's running setup, sanitised for general use. Each hook has a companion `*.README.md` with full wiring instructions and caveats. Sorted by trigger type.

| Trigger | Hook | One-liner |
|---|---|---|
| StatusLine | [`statusline`](./statusline.README.md) | Compact status line with model, current task, dir, and a context-usage bar; also writes the bridge file `context-monitor` reads |
| PreToolUse `Write\|Edit` | [`prompt-injection-guard`](./prompt-injection-guard.README.md) | Scans content being written for prompt-injection patterns; advisory only |
| PreToolUse `Write\|Edit` | [`read-before-edit`](./read-before-edit.README.md) | Reminds the agent to Read existing files first; auto-disabled inside Claude Code |
| PreToolUse `Bash` | [`validate-commit-message`](./validate-commit-message.README.md) | Blocks `git commit -m` calls that violate Conventional Commits |
| PostToolUse `Read` | [`read-injection-scanner`](./read-injection-scanner.README.md) | Scans Read output for injection signatures at ingestion, before they enter context |
| PostToolUse `*` | [`context-monitor`](./context-monitor.README.md) | Surfaces context-budget warnings to the agent at 35% and 25% remaining |

All scripts are standalone — no plugin runtime, no project-local dependencies beyond Node.js (and Bash for `validate-commit-message`).

## Install pattern

1. Copy the hook script to `~/.claude/hooks/` (or wherever you keep them — `command:` paths are absolute)
2. Make it executable: `chmod +x ~/.claude/hooks/<name>.{js,sh}`
3. Add the wiring block from the per-hook README into `~/.claude/settings.json`
4. Run a session with the hook enabled and watch for unexpected blocks or noise
5. If a hook misbehaves, comment it out in `settings.json` first, debug second

## When you need your own hooks

You probably want a custom hook when:

- You're enforcing a project-specific check (e.g., "no `console.log` in PR diffs for one specific repo")
- You want a pre-commit safety guard for one repo only
- You're tracking a custom metric (e.g., per-session token usage to a local SQLite)
- You want to format on save with a tool nothing else knows about

## How to add one safely

1. Write the script in this directory (`configs/hooks/<name>.{sh,js}`)
2. Test it in isolation with sample inputs before wiring it into `settings.json`
3. Add the hook entry under `"hooks": {}` in `settings.json`, scoped narrowly:
   - Match the smallest set of tools (e.g., `"Edit|Write"` not `"*"`)
   - Add a `description` that says what it does
4. Run a session with it enabled. Watch for unexpected blocks or noise.
5. If a hook starts misbehaving, remove the entry from `settings.json` first, debug second.

## What hooks should never do

- Auto-commit or push (silent state changes are dangerous)
- Send data over the network without explicit logging
- Modify files outside the current working directory
- Block on long-running operations without a timeout

If a hook violates any of these, it's a deploy script, not a hook. Move it elsewhere.

## Snapshot, not auto-sync

These hooks were captured from the operator's `~/.claude/hooks/` and sanitised. They are not auto-updated against the source. If the upstream evolves, this directory will drift. Treat each hook as a reference implementation you own, not a managed dependency.
