#!/usr/bin/env bash
# tests/run-all.sh — single entrypoint for the integration suite.
#
# Steps:
#   1. Build packages/cli so dist/cli.js is fresh. Abort on failure with a
#      clear message — running stale dist against new tests is a debugging
#      trap we want to slam shut.
#   2. Run the vitest integration tests via the scoped tests/vitest.config.ts.
#   3. Loop over tests/integration/*.test.sh and run each as bash. Each test
#      script is responsible for its own isolation/cleanup.
#
# Hard rule (PLAN §10): no test in either layer touches the developer's real
# ~/.claude/. The bash test enforces this with a HOME-is-tmp guard; the
# vitest tests enforce it by passing `--claude-dir` and never overriding HOME.
#
# Exposed at the repo root as `npm run test:integration`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

START_TS="$(date +%s)"

echo "▶ Building packages/cli..."
if ! npm --workspace packages/cli run build; then
  echo "✗ Build failed — aborting integration suite. Fix the build, then re-run." >&2
  exit 1
fi

# Sanity-check: the CLI bin must actually exist after build.
if [[ ! -f "$REPO_ROOT/packages/cli/dist/cli.js" ]]; then
  echo "✗ packages/cli/dist/cli.js missing after build — investigate tsup output." >&2
  exit 1
fi

echo "▶ Running vitest integration tests..."
npx vitest run --config "$SCRIPT_DIR/vitest.config.ts"

echo "▶ Running bash integration tests..."
shopt -s nullglob
BASH_FAILED=0
for f in "$SCRIPT_DIR"/integration/*.test.sh; do
  echo "  · $(basename "$f")"
  if ! bash "$f"; then
    echo "✗ bash test failed: $f" >&2
    BASH_FAILED=1
  fi
done
shopt -u nullglob

if [[ "$BASH_FAILED" -ne 0 ]]; then
  exit 1
fi

ELAPSED=$(( $(date +%s) - START_TS ))
echo "✓ Integration suite passed (${ELAPSED}s)."
