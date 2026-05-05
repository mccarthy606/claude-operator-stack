# prompt-injection-guard

**Type:** PreToolUse
**Matcher:** `Write|Edit`
**Requires ECC:** no
**Lines of code:** 96

## What it does

Scans the content of every **Write** and **Edit** call against a list of common prompt-injection signatures (jailbreak phrasing, role-override instructions, system-tag impersonation, invisible Unicode). When a pattern matches, it injects an advisory warning into the agent context. The tool call still proceeds. The intent is detection, not enforcement.

## When it fires

On every **Write** and **Edit** tool call. If `PROMPT_GUARD_PATHS` is set, the scan only runs when the target path contains one of the listed substrings.

## Why install it

- Catches obvious jailbreak text before it ends up persisted in your repo
- Surfaces invisible Unicode tricks that survive copy-paste
- Zero blocking behaviour means false positives never deadlock a session
- No external dependencies, runs anywhere Node.js is installed
- Pairs cleanly with `read-injection-scanner.js` for ingestion-side coverage

## settings.json wiring

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/prompt-injection-guard.js",
            "description": "Scan Write/Edit content for prompt injection signatures"
          }
        ]
      }
    ]
  }
}
```

To scope the scan, set `PROMPT_GUARD_PATHS` in your shell profile, for example:

```bash
export PROMPT_GUARD_PATHS=".claude/,docs/agents/,prompts/"
```

## Caveats

- Pure regex matching — false positives are expected on docs that discuss prompt injection
- Does not block, so a malicious automated pipeline could ignore the warning; treat this as a tripwire, not a wall
- The pattern list is deliberately small and conservative; extend it for your own threat model
