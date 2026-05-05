# P8.3 — README integration snippets

This file is the deliverable that replaces direct edits to `README.md` from this phase. The coordinated README pass (after P8.1, P8.2, P8.3, P8.4 all land) takes these snippets and stitches them in alongside the other phases' contributions.

**Owner of the integration pass:** whoever runs the coord step. Until then, `README.md` stays untouched.

---

## Tooling note for the integration agent

This phase was built with **`npm` workspaces**, not pnpm. Reason: pnpm is not installed on this machine. The PLAN's intent was pnpm, but `pnpm-workspace.yaml` is present at the repo root so any pnpm user picks the same shape up cleanly. Both work — the workspace layout, lockfile generation, and `--workspace` filter syntax are equivalent for this project's needs (single publishable package under `packages/cli/`).

If the integration pass wants to standardise on pnpm, replace npm commands in the README snippets below with their pnpm equivalents. Both are documented inline in `packages/cli/README.md` so users can pick.

---

## 1. Quick Start — `Via npm` subsection (insert ABOVE the existing bash block)

Locate this in `README.md`:

```markdown
## Quick Start

Sets up the stack on a fresh machine. macOS and Linux supported; Windows via WSL.

> Pick one install path. Don't run `curl | bash` on top of a manual clone — they conflict.

Clone, audit, run:
```

Insert the block below **between the `> Pick one install path.` blockquote and `Clone, audit, run:`**. The two install paths become symmetric subsections.

```markdown
### Via npm (node-native path)

```bash
npx claude-operator-stack init --dry-run    # preview
npx claude-operator-stack init              # apply
npx claude-operator-stack verify            # audit your existing setup
npx claude-operator-stack list-stack        # show the six components
```

Same outcome as `install.sh`, different ergonomics. The wizard prompts you through marketplace selection, copies sanitized configs as sidecar files (`*.from-operator-stack`), and prints the manual `/plugin` commands you'll run inside Claude Code.

The bash path stays for users who prefer to read every line before running it. Pick whichever you trust.

> Don't run both back-to-back on a fresh `~/.claude/` — they target the same files and the second run will create duplicate sidecars.

### Via bash (audit-and-run path)
```

Then the existing `Clone, audit, run:` block stays as-is, just under the new `### Via bash` heading. No content removed.

---

## 2. What's Inside — append `packages/` to the tree

Locate the tree block in `README.md` `## What's Inside` (currently around lines 117-180). Find this trailing fragment:

```markdown
└── credits/                     ← attribution to every original author
    └── README.md
```

Replace it with:

```markdown
├── packages/                   ← npm-publishable packages (workspaces)
│   └── cli/                    ← claude-operator-stack: init | verify | list-stack
│
└── credits/                    ← attribution to every original author
    └── README.md
```

Note the change of `└──` to `├──` on `credits/` so the trailing branch falls on `credits/` (the actual last directory). If P8.4 introduces additional packages under `packages/`, the integration pass updates the inner subtree at that point.

---

## 3. (No further README sections need changes from P8.3)

P8.3 deliberately keeps its surface small. Other sections (`The Stack`, `Workflows`, `Cookbook`, etc.) are unchanged. The `Quick Start` and `What's Inside` patches above are sufficient.

---

## Verification after integration

After the coord pass merges these snippets, run:

```bash
grep -q "Via npm" README.md && echo "✓ README mentions npm path"
grep -q "Via bash" README.md && echo "✓ README still has bash path"
grep -q "claude-operator-stack init" README.md && echo "✓ npm command shown"
grep -q "packages/" README.md && echo "✓ tree updated"
[ -f install.sh ] && [ -x install.sh ] && echo "✓ install.sh untouched"
```

All five lines should print their `✓` checks. The bash path must remain present and executable — the npm CLI is a *sibling*, not a replacement.

---

## Files this phase touched directly (no coordination needed)

These were modified by the executor in-place because they don't sit in the `README.md`-coordination zone:

- `package.json` (created — workspace root)
- `pnpm-workspace.yaml` (created)
- `.gitignore` (modified — appended packages/* artefact ignores)
- `CHANGELOG.md` (modified — `[Unreleased] Added` line for the package)
- everything under `packages/cli/`

Files this phase **did not** touch:

- `README.md` — owned by coord pass (this document is the input)
- `install.sh` — sibling, must coexist
- `configs/`, `stack/` — read-only sources for the wizard

## Publishing — explicitly NOT done in this phase

`packages/cli/package.json` declares:
- `"version": "0.1.0"`
- `"publishConfig": { "access": "public" }`
- a `_publishNote` comment field reminding any future agent that publish is a Phase 9 action.

No `npm publish` was run. No CI publish workflow was added. The package is built and locally invokable — that's the full deliverable for P8.3.
