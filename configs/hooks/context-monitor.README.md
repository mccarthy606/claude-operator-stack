# context-monitor

**Type:** PostToolUse
**Matcher:** `*`
**Requires ECC:** no
**Lines of code:** 95

## What it does

Reads context-window metrics from a bridge file written by `statusline.js` and emits an `additionalContext` message to the agent when remaining context drops below 35% (WARNING) or 25% (CRITICAL). The statusline shows you the bar; this hook makes the agent aware of the same signal so it can stop spinning up new work as the budget shrinks.

## When it fires

After every tool call, but only acts when:
- A statusline-written bridge file exists at `<tmpdir>/claude-ctx-<session_id>.json`
- The metric is fresher than 60 seconds
- Remaining context is at or below 35%
- At least 5 tool calls have passed since the last warning (escalations bypass)

## Why install it

- Gives the agent the same context-pressure signal you already see in the statusline
- Cuts down on agents starting expensive new work right before auto-compaction
- Severity escalation (WARNING to CRITICAL) bypasses debounce so you don't miss the cliff
- No network, no logging, no state outside the temp directory
- Drops in alongside `statusline.js` with no extra config

## settings.json wiring

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/context-monitor.js",
            "description": "Inject context-budget warnings into agent context"
          }
        ]
      }
    ]
  }
}
```

`statusLine` block (so the bridge file gets written):

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/hooks/statusline.js"
  }
}
```

## Caveats

- Requires `statusline.js` to be active — without it the bridge file is never written and this hook is a no-op
- Subagents typically don't have a statusline; the hook silently no-ops in that case
- Threshold tuning (35/25) is hard-coded; edit the constants at the top of the file to change them
