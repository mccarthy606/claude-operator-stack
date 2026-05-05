# read-injection-scanner

**Type:** PostToolUse
**Matcher:** `Read`
**Requires ECC:** no
**Lines of code:** 124

## What it does

Inspects content returned by every **Read** call for prompt-injection signatures, including patterns specifically designed to survive context compaction (instructions tagged "preserve through summarisation"). Tags findings as **LOW** for one or two pattern matches, **HIGH** for three or more, and emits the warning as `additionalContext` so the agent sees it inline with the file content.

## When it fires

After every successful Read. Skipped automatically for known-safe paths (`configs/hooks/`, `REVIEW.md`, files named `CHECKPOINT*`) and for any path substring listed in `READ_SCAN_EXCLUDE`.

## Why install it

- Defends the ingestion edge, not just the writing edge — most injection attempts arrive via files you Read
- Catches "preserve through summarisation" payloads that survive context compression
- Detects invisible Unicode and Unicode tag blocks (E0000-E007F), which are common stealth vectors
- Severity scaling cuts noise on documentation that legitimately mentions injection
- Runs in under a millisecond for typical files

## settings.json wiring

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/read-injection-scanner.js",
            "description": "Scan Read output for prompt injection patterns"
          }
        ]
      }
    ]
  }
}
```

To exclude additional paths from scanning:

```bash
export READ_SCAN_EXCLUDE="docs/security/,fixtures/injection/"
```

## Caveats

- Regex-based — security writeups, threat-model docs, and the hook source files themselves are common false positives; exclude them
- Advisory only; cannot prevent malicious content from entering context if the agent ignores the warning
- The 20-character minimum content length skips trivially short files; tune in code if your reads are mostly snippets
