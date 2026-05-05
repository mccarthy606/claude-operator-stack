# Custom Hooks

Audit any hook before installing. Hooks run on every matching tool use — they can read tool input, modify behavior, and access your shell environment.

## What ships here

This stack does not ship custom hook scripts in v0.1. The reason: ECC ships a comprehensive hook suite (gateguard, suggest-compact, doc-file-warning, continuous-learning observer, and more) that handles most of what a solo operator needs out of the box. Layering custom hooks on top should be additive and intentional.

## When you need your own hooks

You probably want a custom hook when:

- You're enforcing a project-specific check (e.g., "no `console.log` in PR diffs for one specific repo")
- You want a pre-commit safety guard for one repo only
- You're tracking a custom metric (e.g., per-session token usage to a local SQLite)
- You want to format on save with a tool ECC doesn't know about

## How to add one safely

1. Write the script in this directory (`configs/hooks/<name>.{sh,js}`)
2. Test it in isolation with sample inputs before wiring it into `settings.json`
3. Add the hook entry under `"hooks": {}` in `settings.json`, scoped narrowly:
   - Match the smallest set of tools (e.g., `"Edit|Write"` not `"*"`)
   - Add a `description` that says what it does
   - Add an `id` so you can find it again
4. Run a session with it enabled. Watch for unexpected blocks or noise.
5. If a hook starts misbehaving, remove the entry from `settings.json` first, debug second.

## Hook ordering

Hooks within the same matcher run in declaration order. ECC's hooks come first if its plugin is enabled. Your custom hooks run after.

If you need to run *before* ECC, you'd have to disable that ECC hook and re-implement what you need — usually not worth it.

## What hooks should never do

- Auto-commit or push (silent state changes are dangerous)
- Send data over the network without explicit logging
- Modify files outside the current working directory
- Block on long-running operations without a timeout

If a hook violates any of these, it's a deploy script, not a hook. Move it elsewhere.
