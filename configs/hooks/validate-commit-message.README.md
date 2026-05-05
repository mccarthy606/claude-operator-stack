# validate-commit-message

**Type:** PreToolUse
**Matcher:** `Bash`
**Requires ECC:** no
**Lines of code:** 50

## What it does

Intercepts `git commit -m "..."` calls and blocks them when the subject line does not match the [Conventional Commits](https://www.conventionalcommits.org/) shape `<type>(<scope>): <subject>`. Allowed types default to `feat fix docs style refactor perf test build ci chore`. Subject length capped at 72 characters. Heredoc-form commits and editor-driven commits are passed through (the hook cannot see their message) — pair this with a server-side check if you need them gated too.

## When it fires

On every Bash tool call where the command starts with `git commit`. Other Bash commands pass through silently.

## Why install it

- Keeps the agent honest about commit hygiene without you having to police every PR
- Returns a structured `{"decision": "block", "reason": "..."}` payload so the agent gets a corrective message it can act on
- Pure Bash + Node for JSON parsing — no `jq`, no Python, no project-local tooling
- Catches typos like `feet:` or sentence-case subjects before they pollute the log
- Override the type list per project via `COMMIT_TYPES_OVERRIDE`

## settings.json wiring

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/validate-commit-message.sh",
            "description": "Enforce Conventional Commits on git commit -m"
          }
        ]
      }
    ]
  }
}
```

To allow extra types in one project:

```bash
export COMMIT_TYPES_OVERRIDE="feat|fix|chore|wip|hotfix"
```

## Caveats

- Only inspects `-m` messages; commits made via editor or heredoc are not validated by this hook
- The 72-char cap is opinionated; edit the script to change it
- Does not validate commit body or footer — subject only
- Returning exit code 2 hard-blocks the commit; if you want advisory-only behaviour, swap the `exit 2` for a stderr warning and `exit 0`
