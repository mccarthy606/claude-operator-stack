#!/usr/bin/env bash
# E2E: tests/integration/install-sh.test.sh
#
# Asserts install.sh's contract from a fresh, isolated HOME:
#   1. With a stub `claude` shim and `--dry-run --yes`, install.sh exits 0
#      and prints the sidecar paths.
#   2. After the dry-run, no files exist outside `$STUB_HOME/.claude/`.
#   3. With no `claude` on PATH, install.sh exits 1 and warns "claude CLI
#      not found".
#
# Hard rule: the developer's real ~/.claude/ is NEVER touched. Defence in
# depth lives at three layers:
#   - HOME is reassigned to a freshly-minted `mktemp -d` before any
#     install.sh invocation; the original HOME is captured in REAL_HOME
#     and never used again.
#   - A guard immediately after the override aborts if HOME does not start
#     with one of the platform's tmp prefixes (/tmp/, /private/tmp/,
#     /var/folders/ on macOS, /tmp/ on Linux).
#   - PATH is pinned to `$STUB_HOME/bin:/usr/bin:/bin` so the only `claude`
#     binary in scope is the stub we wrote.
#
# Cleanup runs unconditionally via `trap '...' EXIT`.
set -euo pipefail

# ---------- locate the repo root ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INSTALL_SH="$REPO_ROOT/install.sh"

if [[ ! -f "$INSTALL_SH" ]]; then
  echo "FATAL: install.sh not found at $INSTALL_SH" >&2
  exit 1
fi

# ---------- preserve real HOME, then sandbox ----------
REAL_HOME="${HOME:-}"
STUB_HOME="$(mktemp -d -t cos-install-test.XXXXXX)"
LOG_DIR="$(mktemp -d -t cos-install-log.XXXXXX)"

cleanup() {
  rm -rf "$STUB_HOME" "$LOG_DIR" 2>/dev/null || true
}
trap cleanup EXIT

# Override HOME for the rest of this script.
export HOME="$STUB_HOME"

# ---------- HOME-is-tmp guard (PLAN §10, ROADMAP success criterion #6) ----------
# Run AFTER the override so we are validating the new HOME, never the real one.
case "$HOME" in
  /tmp/*|/private/tmp/*|/var/folders/*) ;;
  *)
    echo "FATAL: HOME is not under a tmp prefix: $HOME" >&2
    echo "       (REAL_HOME was $REAL_HOME — refused to run to protect ~/.claude/)" >&2
    exit 99
    ;;
esac

# Cross-check: HOME must not equal REAL_HOME under any circumstance.
if [[ -n "$REAL_HOME" && "$HOME" == "$REAL_HOME" ]]; then
  echo "FATAL: HOME equals REAL_HOME after override; refusing to run" >&2
  exit 99
fi

# ---------- helpers ----------
fail() {
  echo "FAIL: $*" >&2
  exit 1
}
pass() {
  echo "PASS: $*"
}

# ---------- build a stub `claude` shim ----------
mkdir -p "$STUB_HOME/bin"
cat > "$STUB_HOME/bin/claude" <<'EOS'
#!/usr/bin/env bash
echo "1.0.0-stub"
EOS
chmod +x "$STUB_HOME/bin/claude"

# ---------- TEST 1: --dry-run --yes with stub claude → exit 0 ----------
echo "▶ Test 1: install.sh --dry-run --yes (stub claude on PATH)"

STDOUT_LOG="$LOG_DIR/dry-run.stdout.log"
STDERR_LOG="$LOG_DIR/dry-run.stderr.log"

# Sentinel file BEFORE the run — we'll diff with -newer afterwards to catch
# any write outside `$STUB_HOME/.claude/`.
SENTINEL="$LOG_DIR/.timestamp"
touch -t 197001020000 "$SENTINEL" 2>/dev/null || touch "$SENTINEL"
sleep 1  # ensure mtime resolution doesn't lose us writes done in the same second

set +e
PATH="$STUB_HOME/bin:/usr/bin:/bin" \
  HOME="$STUB_HOME" \
  bash "$INSTALL_SH" --dry-run --yes \
    >"$STDOUT_LOG" 2>"$STDERR_LOG"
EXIT_CODE=$?
set -e

if [[ "$EXIT_CODE" -ne 0 ]]; then
  echo "--- stdout ---" >&2
  cat "$STDOUT_LOG" >&2
  echo "--- stderr ---" >&2
  cat "$STDERR_LOG" >&2
  fail "install.sh --dry-run --yes exited $EXIT_CODE (expected 0)"
fi
pass "install.sh --dry-run --yes exited 0"

# ---------- TEST 2: no writes outside $STUB_HOME/.claude/ ----------
# Dry-run must not write anything. We check writes anywhere under STUB_HOME
# that fell outside `.claude/` and also anywhere outside STUB_HOME at all.
WRITES_OUTSIDE_CLAUDE="$(
  find "$STUB_HOME" -newer "$SENTINEL" -type f \
    ! -path "$STUB_HOME/.claude/*" \
    ! -path "$STUB_HOME/bin/*" 2>/dev/null || true
)"

if [[ -n "$WRITES_OUTSIDE_CLAUDE" ]]; then
  fail "dry-run wrote outside \$STUB_HOME/.claude/: $WRITES_OUTSIDE_CLAUDE"
fi

# Belt-and-braces: install.sh's specific artefacts must NOT have appeared
# under the real ~/.claude/. We deliberately do not blanket-check mtime:
# Claude Code itself writes telemetry under ~/.claude/ continuously
# (~/.claude/metrics/, ~/.claude/bash-commands.log) and that is unrelated
# to install.sh. We check only for the *installer's specific sidecar
# names* — if those appear under the real HOME, that is a genuine leak.
if [[ -n "$REAL_HOME" && -d "$REAL_HOME/.claude" ]]; then
  REAL_LEAKS=()
  if [[ -e "$REAL_HOME/.claude/settings.json.from-operator-stack" ]]; then
    REAL_LEAKS+=("$REAL_HOME/.claude/settings.json.from-operator-stack")
  fi
  if [[ -e "$REAL_HOME/.claude/mcp-configs/mcp-servers.json.from-operator-stack" ]]; then
    REAL_LEAKS+=("$REAL_HOME/.claude/mcp-configs/mcp-servers.json.from-operator-stack")
  fi
  # Also catch anything matching the from-operator-stack suffix anywhere
  # under the real ~/.claude/ that is *newer* than the sentinel — narrow
  # enough to avoid host-Claude telemetry false positives.
  RECENT_SIDECAR_LEAKS="$(
    find "$REAL_HOME/.claude" -name '*.from-operator-stack' \
      -newer "$SENTINEL" -type f 2>/dev/null || true
  )"
  if [[ -n "$RECENT_SIDECAR_LEAKS" ]]; then
    REAL_LEAKS+=("$RECENT_SIDECAR_LEAKS")
  fi
  if [[ "${#REAL_LEAKS[@]}" -gt 0 ]]; then
    fail "real ~/.claude/ has installer-specific artefacts: ${REAL_LEAKS[*]}"
  fi
fi
pass "no writes escaped \$STUB_HOME/.claude/"

# ---------- TEST 3: dry-run prints expected sidecar paths ----------
EXPECTED_SETTINGS="$STUB_HOME/.claude/settings.json.from-operator-stack"
EXPECTED_MCP="$STUB_HOME/.claude/mcp-configs/mcp-servers.json.from-operator-stack"

if ! grep -F -q "$EXPECTED_SETTINGS" "$STDOUT_LOG"; then
  echo "--- stdout ---" >&2
  cat "$STDOUT_LOG" >&2
  fail "settings sidecar path not printed in dry-run output"
fi
if ! grep -F -q "$EXPECTED_MCP" "$STDOUT_LOG"; then
  echo "--- stdout ---" >&2
  cat "$STDOUT_LOG" >&2
  fail "mcp sidecar path not printed in dry-run output"
fi
pass "dry-run printed both expected sidecar paths"

# ---------- TEST 4: no `claude` on PATH → exit 1 ----------
echo "▶ Test 4: install.sh --dry-run --yes (no claude on PATH)"

STDOUT_LOG2="$LOG_DIR/no-claude.stdout.log"
STDERR_LOG2="$LOG_DIR/no-claude.stderr.log"

set +e
PATH="/usr/bin:/bin" \
  HOME="$STUB_HOME" \
  bash "$INSTALL_SH" --dry-run --yes \
    >"$STDOUT_LOG2" 2>"$STDERR_LOG2"
EXIT_CODE2=$?
set -e

if [[ "$EXIT_CODE2" -ne 1 ]]; then
  echo "--- stdout ---" >&2
  cat "$STDOUT_LOG2" >&2
  echo "--- stderr ---" >&2
  cat "$STDERR_LOG2" >&2
  fail "install.sh without claude exited $EXIT_CODE2 (expected 1)"
fi

# install.sh's helper writes "claude CLI not found" to stderr (`warn`).
# Allow either stream defensively in case the helper is refactored.
if ! grep -F -q "claude CLI not found" "$STDOUT_LOG2" "$STDERR_LOG2"; then
  echo "--- stdout ---" >&2
  cat "$STDOUT_LOG2" >&2
  echo "--- stderr ---" >&2
  cat "$STDERR_LOG2" >&2
  fail "expected 'claude CLI not found' in output"
fi
pass "install.sh without claude exited 1 with the expected message"

echo "✓ install-sh.test.sh: all assertions passed"
