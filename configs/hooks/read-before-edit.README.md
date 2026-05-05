# read-before-edit

**Type:** PreToolUse
**Matcher:** `Write|Edit`
**Requires ECC:** no
**Lines of code:** 65

## What it does

Detects when **Write** or **Edit** is about to touch an existing file and reminds the agent to call **Read** on it first. The warning is injected as `additionalContext` so the agent reads it on the same turn the rejection would have come from the runtime. The hook only fires when the target path already exists on disk; new file creation passes through silently.

## When it fires

Before every **Write** and **Edit** where the target file exists. Auto-disabled when running inside Claude Code itself (detected via `CLAUDE_SESSION_ID` or `CLAUDECODE`), since Claude already enforces read-before-edit at the runtime layer and a second reminder would just be noise.

## Why install it

- Eliminates the retry loop on runtimes that lack native read-before-edit enforcement (OpenCode, Kilo, Gemini CLI variants)
- Saves agent budget — one advisory turn beats burning attempts against a runtime rejection
- Auto-skips on Claude Code so you can keep the same `settings.json` across runtimes
- Harmless if installed and the runtime turns out to enforce already
- No external dependencies

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
            "command": "node ~/.claude/hooks/read-before-edit.js",
            "description": "Remind to Read existing files before Write/Edit"
          }
        ]
      }
    ]
  }
}
```

## Caveats

- Only useful on non-Claude runtimes; on Claude Code the hook is a no-op by design
- Does not actually verify whether the file was read in-session; it just nudges
- If your workflow legitimately overwrites untouched files (codegen output, build artefacts), expect the reminder to be wrong sometimes
