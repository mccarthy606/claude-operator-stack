# statusline

**Type:** StatusLine
**Matcher:** n/a (statusLine block, not hooks block)
**Requires ECC:** no
**Lines of code:** 110

## What it does

Renders a compact status line in the Claude Code prompt area: `model | current task | directory | context bar`. The current task is pulled from the most recent in-progress todo for the session. The context bar shows USED percentage scaled to the usable window (auto-compact buffer subtracted), colour-shifted from green to amber to red as you approach the cliff. Also writes a JSON bridge file to your temp directory so `context-monitor.js` can surface the same signal to the agent.

## When it fires

Whenever Claude Code re-renders the prompt — typically after every assistant turn or tool call. Uses a 3-second stdin timeout so a misbehaving terminal pipe never freezes the prompt.

## Why install it

- The default Claude statusline is information-poor; this one earns its row
- Context bar tells you when to wrap up before auto-compaction destroys nuance
- Honours `CLAUDE_CODE_AUTO_COMPACT_WINDOW` if you have early-compaction set
- The bridge file is the unlock for `context-monitor.js` (agent-side context warnings)
- No external dependencies; degrades silently on any error

## settings.json wiring

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/hooks/statusline.js"
  }
}
```

If you also want agent-side context warnings, install **context-monitor** alongside it; the bridge file written here is what that hook reads.

## Caveats

- Reads `~/.claude/todos/` to find current task — if you set `CLAUDE_CONFIG_DIR`, it honours that, otherwise it falls back to `~/.claude/`
- Bridge file is written to `os.tmpdir()` per-session; orphaned files survive crashes but the OS cleans temp eventually
- ANSI colour codes assume a terminal that supports them; in plain logs you'll see the escape sequences raw
