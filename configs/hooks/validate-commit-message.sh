#!/bin/bash
# validate-commit-message — PreToolUse hook (Bash matcher)
# Blocks `git commit -m "..."` when the message does not follow Conventional Commits.
# Allows conforming messages and any non-commit Bash command. Silent on success.
#
# Uses Node.js for JSON parsing (no jq dependency) so it runs on stock macOS,
# Debian, Alpine, etc. without extra packages.
#
# Conventional Commits spec: https://www.conventionalcommits.org/
# Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Subject:       <= 72 characters
#
# Optional environment variables:
#   COMMIT_TYPES_OVERRIDE  Pipe-separated type list to replace the defaults.
#                          Example: COMMIT_TYPES_OVERRIDE="feat|fix|chore|wip"

INPUT=$(cat)

CMD=$(echo "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{process.stdout.write(JSON.parse(d).tool_input?.command||'')}catch{}})" 2>/dev/null)

# Only check git commit commands
if [[ ! "$CMD" =~ ^git[[:space:]]+commit ]]; then
  exit 0
fi

# Extract message from -m flag, supporting both single and double quotes
MSG=""
if [[ "$CMD" =~ -m[[:space:]]+\"([^\"]+)\" ]]; then
  MSG="${BASH_REMATCH[1]}"
elif [[ "$CMD" =~ -m[[:space:]]+\'([^\']+)\' ]]; then
  MSG="${BASH_REMATCH[1]}"
fi

# No -m message means heredoc or editor — let it through (can't validate)
if [ -z "$MSG" ]; then
  exit 0
fi

SUBJECT=$(echo "$MSG" | head -1)
TYPES="${COMMIT_TYPES_OVERRIDE:-feat|fix|docs|style|refactor|perf|test|build|ci|chore}"

if ! [[ "$SUBJECT" =~ ^($TYPES)(\(.+\))?:[[:space:]].+ ]]; then
  echo "{\"decision\": \"block\", \"reason\": \"Commit message must follow Conventional Commits: <type>(<scope>): <subject>. Allowed types: ${TYPES//|/, }. Subject must be <=72 chars, lowercase, imperative mood, no trailing period.\"}"
  exit 2
fi

if [ ${#SUBJECT} -gt 72 ]; then
  echo '{"decision": "block", "reason": "Commit subject must be 72 characters or less."}'
  exit 2
fi

exit 0
