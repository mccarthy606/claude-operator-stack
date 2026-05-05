#!/usr/bin/env bash
# Claude Operator Stack — installer
#
# Bootstraps the curator's stack on a fresh machine.
# Audit this script before running. It does not run sudo. It does not
# overwrite anything in ~/.claude/ without prompting.
#
# Usage:
#   ./install.sh              # interactive
#   ./install.sh --yes        # non-interactive, accept all defaults
#   ./install.sh --dry-run    # show what would happen, do nothing

set -euo pipefail

# -------- args --------
ASSUME_YES=0
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --yes|-y) ASSUME_YES=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --help|-h)
      sed -n '2,12p' "$0"
      exit 0
      ;;
  esac
done

# -------- helpers --------
say() { printf '\033[1;36m▶\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }

confirm() {
  local prompt="$1"
  if [ "$ASSUME_YES" -eq 1 ]; then
    return 0
  fi
  printf '%s [y/N] ' "$prompt"
  read -r answer
  case "$answer" in
    [yY]|[yY][eE][sS]) return 0 ;;
    *) return 1 ;;
  esac
}

run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '\033[1;90m[dry-run]\033[0m %s\n' "$*"
  else
    "$@"
  fi
}

# -------- start --------
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

cat <<'EOF'

  ╔═══════════════════════════════════════════════════╗
  ║      Claude Operator Stack — installer            ║
  ║      curated stack for solo founders              ║
  ╚═══════════════════════════════════════════════════╝

EOF

# -------- step 1: check claude CLI --------
say "Step 1/4 — checking Claude Code CLI"
if ! command -v claude >/dev/null 2>&1; then
  warn "claude CLI not found"
  echo
  echo "Install it first:"
  echo "  npm install -g @anthropic-ai/claude-code"
  echo
  echo "Then re-run this installer."
  exit 1
fi
# Cosmetic only — used for the printed "detected version" message. A locally-installed
# shim could spoof this, but the user has already trusted the `claude` binary in PATH.
CLAUDE_VERSION=$(claude --version 2>/dev/null | awk '{print $1}' || echo "unknown")
ok "claude CLI found (version $CLAUDE_VERSION)"

# -------- step 2: marketplace + plugin instructions --------
say "Step 2/4 — marketplaces and plugins"
cat <<'EOF'

The stack splits into 4 core components and 2 opt-in marketplaces.

  Core (always installed):
    1. Claude Code           — already detected above
    2. Obsidian              — install from https://obsidian.md/download
    3. graphify              — see stack/graphify.md
    4. Frontend-Design       — official Anthropic marketplace (REQUIRED)

  Opt-in (install when the use case earns it):
    5. Everything Claude Code  — broad skill + agent catalog
    6. Toprank                 — SEO + paid-ads skill cluster

Marketplace add and plugin install are interactive operations inside
Claude Code itself (the CLI does not expose stable non-interactive
subcommands for them yet).

After this installer finishes, open Claude Code and run the commands
matching what you want to install.

  Required (always run these):

    /plugin marketplace add anthropics/claude-plugins-official
    /plugin install frontend-design@claude-plugins-official

  Opt-in — Everything Claude Code (recommend for most operators):

    /plugin marketplace add affaan-m/everything-claude-code
    /plugin install everything-claude-code@everything-claude-code

  Opt-in — Toprank (only if you do SEO or paid ads):

    /plugin marketplace add nowork-studio/toprank
    /plugin install toprank@nowork-studio

(Skip any you already have, and skip the opt-ins you do not need yet —
you can come back later.)

EOF
if ! confirm "Acknowledge and continue?"; then
  die "aborted by user"
fi

# Per-component opt-in prompts (informational — the actual install runs in Claude Code).
# These let the user mark intent so the next step's printed reminder lines up with what
# they actually plan to install.
INSTALL_ECC=0
INSTALL_TOPRANK=0
if confirm "Plan to install Everything Claude Code? (broad skill + agent catalog) [opt-in]"; then
  INSTALL_ECC=1
  ok "noted: ECC will be installed via /plugin in Claude Code"
else
  ok "noted: ECC skipped — re-run installer or add later via /plugin"
fi
if confirm "Plan to install Toprank? (SEO + paid ads) [opt-in]"; then
  INSTALL_TOPRANK=1
  ok "noted: Toprank will be installed via /plugin in Claude Code"
else
  ok "noted: Toprank skipped — add later via /plugin when you start SEO or paid traffic"
fi

# -------- step 3: copy sanitized configs --------
say "Step 3/4 — copying sanitized configs to ~/.claude/"

mkdir -p "$CLAUDE_DIR"
mkdir -p "$CLAUDE_DIR/mcp-configs"
mkdir -p "$CLAUDE_DIR/rules"
mkdir -p "$CLAUDE_DIR/hooks"

# Hooks are intentional opt-in — copy from configs/hooks/ manually after auditing each one.
echo "Note: hooks are opt-in. Audit and copy from configs/hooks/ to ~/.claude/hooks/ as needed; see configs/hooks/README.md."

copy_if_safe() {
  local src="$1"
  local dst="$2"
  if [ ! -f "$src" ]; then
    warn "missing source: $src — skipping"
    return 0
  fi
  if [ -f "$dst" ]; then
    if ! confirm "$dst already exists — overwrite?"; then
      ok "kept existing $dst"
      return 0
    fi
    run cp "$dst" "$dst.backup.$(date +%s)"
  fi
  run cp "$src" "$dst"
  ok "wrote $dst"
}

copy_if_safe "$REPO_ROOT/configs/settings.json.example" \
             "$CLAUDE_DIR/settings.json.from-operator-stack"
copy_if_safe "$REPO_ROOT/configs/mcp-servers.json.example" \
             "$CLAUDE_DIR/mcp-configs/mcp-servers.json.from-operator-stack"

# Custom rules — additive, not overwriting
if [ -d "$REPO_ROOT/configs/rules" ]; then
  for rule in "$REPO_ROOT/configs/rules"/*.md; do
    [ -e "$rule" ] || continue
    base=$(basename "$rule")
    copy_if_safe "$rule" "$CLAUDE_DIR/rules/$base"
  done
fi

# -------- step 4: next steps --------
say "Step 4/4 — next steps"
cat <<EOF

  ${REPO_ROOT}/configs/settings.json.example  →  copied as a sidecar to
  ~/.claude/settings.json.from-operator-stack so you can diff and merge
  with your existing settings.json by hand.

  Same pattern for mcp-servers.json.

  Read these next:

    1. configs/README.md            — what each config does
    2. stack/mcp-servers.md         — which MCP servers to authenticate
    3. workflows/parallel-projects.md — how to actually use the stack

  Final step (manual): open Claude Code and run the /plugin commands
  from step 2 above for each component you said yes to.

  Your recorded plan:
    Frontend-Design (required)        : install
    Everything Claude Code (opt-in)   : $( [ "$INSTALL_ECC" -eq 1 ] && echo install || echo skip )
    Toprank (opt-in)                  : $( [ "$INSTALL_TOPRANK" -eq 1 ] && echo install || echo skip )

  Then restart Claude Code.

EOF
ok "done"
