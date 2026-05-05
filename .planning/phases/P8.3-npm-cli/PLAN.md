---
phase: P8.3-npm-cli
milestone: M2-v1-public-launch
title: npm CLI package — `claude-operator-stack`
status: planned
created: 2026-05-05
target_effort: 6-8h
parallelisable_with: [P8.1-hero-animated, P8.2-compare-matrix, P8.4-own-skills]
depends_on: []
ships_to: packages/cli/
---

# Phase 8.3 — npm CLI package `claude-operator-stack`

## TL;DR

Ship a real, buildable, locally-runnable npm package at `packages/cli/` that mirrors `install.sh` as a node-native wizard. Three commands and only three: `init`, `verify`, `list-stack`. **Not publishing to npm in this phase** — publish coordinates with the public visibility flip in Phase 9. The bash `install.sh` stays as the audit-and-run path. The CLI is the node-native path. They coexist; one does not replace the other.

The whole phase is one risk: scope creep. The hard cap below is the spine of the plan.

---

## Hard non-goals (do not build, do not start, do not "while we're here")

These are not deferred — they are explicitly off-limits for Phase 8.3. If a candidate task falls into any bucket below, it is a v1.1 ticket, not a Phase 8.3 task.

1. **No marketplace browser.** Listing or installing marketplaces is a Claude Code interactive action; the CLI prints the commands the user must run, identical to step 2 of `install.sh`. It does not call `claude` or shell into Claude Code.
2. **No MCP server installer.** `mcp-servers.json.example` is copied verbatim as a sidecar. No interactive MCP picker, no env-var injection, no token prompts.
3. **No plugin runtime.** We are an installer wizard for an existing stack. ECC owns runtime; we own installer ergonomics.
4. **No npm publish in this phase.** `package.json` declares `"version": "0.1.0"` and `publishConfig.access: "public"`, with a comment that publish is a Phase 9 action. No `npm publish` command in any task. No CI publish workflow.
5. **No oclif, no Ink, no React-for-terminal, no chalk.** Stick to commander + prompts + picocolors + (optionally) zod. Anything else is rejected by the dependency review in Plan 03.
6. **No port of `install.sh` in shape.** The bash script is procedural and audit-friendly. The CLI is interactive and ergonomic. They share intent and target paths, not source lines.
7. **No new top-level repo conventions.** Repo root gets one `package.json` with `workspaces: ["packages/*"]` and one dev-deps stanza. Nothing else changes at the root level outside this and a small `.gitignore` patch.
8. **No second package in this phase.** `packages/cli/` is the only thing under `packages/`. Future packages (e.g. `packages/skills/`) are P8.4 or later.

If during execution a tempting feature appears that doesn't fit `init` / `verify` / `list-stack`, write it as a `TODO(v1.1)` line in the relevant source file and move on. Do not add it to PLAN.md mid-flight.

---

## Architecture — the directory tree we end the phase with

```
claude-operator-stack/
├── package.json                         # NEW: workspace root
├── pnpm-workspace.yaml                  # NEW: workspace resolver
├── .gitignore                           # MODIFIED: add packages/*/dist + node_modules
├── README.md                            # MODIFIED: Quick Start gets "via npm" subsection
├── CHANGELOG.md                         # MODIFIED: unreleased entry
└── packages/
    └── cli/
        ├── package.json                 # name: claude-operator-stack, version 0.1.0
        ├── tsconfig.json                # strict, ES2022, declaration off (we bundle)
        ├── tsup.config.ts               # bundle config — esm + cjs + declaration false, single bin
        ├── README.md                    # CLI usage docs (linked from repo README)
        ├── LICENSE                      # MIT — symlink or copy of repo root LICENSE
        ├── .npmignore                   # tests, fixtures, src, tsconfig, tsup config
        ├── src/
        │   ├── cli.ts                   # commander entrypoint; bin target
        │   ├── commands/
        │   │   ├── init.ts              # interactive wizard (orchestrates lib/*)
        │   │   ├── verify.ts            # read-only audit
        │   │   └── list-stack.ts        # static stack table printer
        │   ├── lib/
        │   │   ├── paths.ts             # resolveClaudeDir, resolveRepoRoot, sidecarFor
        │   │   ├── fs-safe.ts           # copyIfSafe (sidecar logic, mtime backup)
        │   │   ├── prompts.ts           # wizard prompt definitions (pure data)
        │   │   ├── stack.ts             # static stack components list — single source of truth
        │   │   ├── settings-reader.ts   # parse ~/.claude/settings.json (verify input)
        │   │   ├── audit.ts             # pure verify logic (settings → report rows)
        │   │   └── format.ts            # picocolors helpers (ok/warn/say/die)
        │   ├── types.ts                 # WizardChoices, AuditRow, StackComponent
        │   └── version.ts               # generated at build time from package.json
        └── tests/
            ├── audit.test.ts            # verify pure logic — full coverage of branches
            ├── fs-safe.test.ts          # copyIfSafe with tmp dirs, sidecar pattern
            ├── stack.test.ts            # list-stack output shape
            ├── prompts.test.ts          # prompt definitions are well-formed
            ├── init.test.ts             # smoke test of init --dry-run with stubbed prompts
            └── fixtures/
                ├── settings-empty.json
                ├── settings-partial.json
                └── settings-complete.json
```

**File count target:** 22-26 new files, 3 modified. Comfortably inside the "15-25 files" estimate from the ROADMAP.

---

## Dependencies — pinned exactly

These versions are the contract. Bumping them is a separate task, not a Phase 8.3 task.

### Runtime dependencies (`packages/cli/package.json` → `dependencies`)

| Package | Version | Why this one |
|---|---|---|
| `commander` | `^12.1.0` | Stable, mature, ~30 KB, no transitive bloat. Industry-standard CLI parser. |
| `prompts` | `^2.4.2` | Lightweight (~30 KB), no dependencies, async/await native, supports types we need (select, multiselect, text, confirm). Picked over `inquirer` (which pulls in 20+ deps). |
| `picocolors` | `^1.0.1` | ~3 KB, zero deps, drop-in for chalk. Picked over chalk per ROADMAP guidance. |

**Optional / conditional:**

| Package | Version | When |
|---|---|---|
| `zod` | `^3.23.8` | Only if `verify` ends up needing schema validation of `settings.json` shape. Default: skip. The audit logic operates on duck-typed JSON; explicit schema is yagni for v0.1.0. |

### Dev dependencies (`packages/cli/package.json` → `devDependencies`)

| Package | Version | Why |
|---|---|---|
| `typescript` | `^5.5.4` | Strict mode target. |
| `tsup` | `^8.2.4` | Bundle to `dist/cli.js` (single file, esm) + shebang preservation. No `tsc` watch loop to maintain. |
| `vitest` | `^2.0.5` | Test runner, fast, native ESM, picks up `tsconfig` paths cleanly. Picked over `node:test` because we want `expect()` ergonomics and fixture isolation, and the bundle cost is dev-only. |
| `@types/node` | `^20.14.10` | Types for `fs`, `path`, `os`, `child_process`. |
| `@types/prompts` | `^2.4.9` | Type defs for `prompts` (it ships JS only). |

### Workspace root (`package.json` at repo root)

```json
{
  "name": "claude-operator-stack-monorepo",
  "private": true,
  "version": "0.0.0",
  "description": "Workspace root — see packages/cli for the published package.",
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "pnpm --filter ./packages/cli build",
    "test": "pnpm --filter ./packages/cli test",
    "dev": "pnpm --filter ./packages/cli dev"
  },
  "packageManager": "pnpm@9.7.0"
}
```

The root `package.json` is **private**. Only `packages/cli/package.json` is publishable.

---

## Command surface — exit codes, flags, output shape

### `init`

```
Usage: claude-operator-stack init [options]

Options:
  --dry-run          Show what would happen, write nothing
  --yes              Accept all defaults; non-interactive
  --no-color         Disable picocolors output
  --claude-dir <p>   Override ~/.claude/ resolution (test injection)
  -h, --help         Show help
```

**Exit codes:**
- `0` — wizard completed (or `--dry-run` reported successfully)
- `1` — user aborted at a confirm prompt
- `2` — `claude` CLI not found in `PATH`
- `3` — filesystem error (permission denied, etc.)

**Example session — `init --dry-run` (interactive flow stubbed for ASCII):**

```
$ npx claude-operator-stack init --dry-run

  ╔════════════════════════════════════════════════════╗
  ║      Claude Operator Stack — installer (npm)       ║
  ║      curated stack for solo founders               ║
  ║      v0.1.0 · dry-run                              ║
  ╚════════════════════════════════════════════════════╝

▶ Step 1/4 — checking Claude Code CLI
✓ claude CLI found (version 1.0.42)

▶ Step 2/4 — marketplaces and plugins
The stack uses three marketplaces. Pick which to wire up.

? Select marketplaces to enable › (Press <space> to toggle)
  ◉ frontend-design@claude-plugins-official  (Anthropic — UI generation)
  ◉ toprank@nowork-studio                    (SEO + Ads)
  ◯ everything-claude-code@everything-claude-code  (already enabled? check verify)

▶ Step 3/4 — copying configs as sidecars
✓ would write ~/.claude/settings.json.from-operator-stack
✓ would write ~/.claude/mcp-configs/mcp-servers.json.from-operator-stack
✓ would write ~/.claude/rules/obsidian-integration.md

? Copy custom hooks too? › (y/N)
  (skipped in dry-run — would prompt per hook)

? Vault path (Obsidian) › ~/Brain
  (skipped in dry-run — would write rules/obsidian-integration.md with this path)

▶ Step 4/4 — next steps
After applying (without --dry-run), open Claude Code and run:

  /plugin marketplace add anthropics/claude-plugins-official
  /plugin marketplace add nowork-studio/toprank
  /plugin install frontend-design@claude-plugins-official
  /plugin install toprank@nowork-studio

✓ dry-run complete. No files were written.
```

### `verify`

```
Usage: claude-operator-stack verify [options]

Options:
  --json             Emit machine-readable JSON instead of table
  --claude-dir <p>   Override ~/.claude/ resolution (test injection)
  -h, --help         Show help
```

**Exit codes:**
- `0` — all stack components wired
- `1` — `~/.claude/settings.json` not found
- `2` — settings.json present but unparsable
- `10` — at least one stack component unwired (advisory exit code; `--json` still emits)

**Example session:**

```
$ npx claude-operator-stack verify

▶ Auditing ~/.claude/settings.json

Component                                          Status     Notes
─────────────────────────────────────────────────  ─────────  ─────────────────────────
frontend-design@claude-plugins-official            ✓ enabled  via enabledPlugins
toprank@nowork-studio                              ✓ enabled  via enabledPlugins
everything-claude-code@everything-claude-code      ⚠ missing  add to enabledPlugins
~/.claude/mcp-configs/mcp-servers.json             ✓ present  16 servers configured
~/.claude/rules/obsidian-integration.md            ⚠ missing  copy from configs/rules/
operator-stack hooks (configs/hooks/*)             — skipped  opt-in; not audited

3 of 6 wired · 2 missing · 1 skipped (opt-in)
```

### `list-stack`

```
Usage: claude-operator-stack list-stack [options]

Options:
  --json             Emit JSON instead of table
  -h, --help         Show help
```

**Exit codes:**
- `0` — always

**Example session:**

```
$ npx claude-operator-stack list-stack

The Claude Operator Stack — six components

Component                Layer                  Author              Repo
─────────────────────    ───────────────────    ──────────────────  ──────────────────────────────
Everything Claude Code   Skills + Agents        @affaan-m           github.com/affaan-m/everything-claude-code
Toprank                  SEO + Ads              nowork-studio       github.com/nowork-studio/toprank
Frontend-Design          UI generation          Anthropic           github.com/anthropics/claude-plugins-official
OMEGA Memory             Agent-curated memory   local               (operator stack)
Obsidian as 2nd Brain    Operator-curated ctx   local               obsidian.md
Claude Code              Runtime                Anthropic           anthropic.com/claude-code

Bash installer:  ./install.sh
npm installer:   npx claude-operator-stack init
```

---

## `init` flow — step-by-step contract

Mirrors `install.sh`'s 4-step structure exactly. Each step has the same intent; the surface is wizardised.

### Step 1: Banner + claude CLI check

- Print boxed banner with `v0.1.0` and `dry-run` flag if applicable.
- Run `child_process.spawnSync("claude", ["--version"], { stdio: "pipe" })`.
- On `ENOENT`: print error matching `install.sh` lines 71-78, exit 2.
- On success: parse first whitespace-delimited token as version, print `✓ claude CLI found (version X)`.

### Step 2: Marketplace selection

- Show short explanation matching `install.sh` lines 87-101.
- `prompts.multiselect` with three options (preselected: first two only — third is ECC, which most users will already have):
  - `frontend-design@claude-plugins-official` (Anthropic)
  - `toprank@nowork-studio` (SEO + Ads)
  - `everything-claude-code@everything-claude-code` (the backbone — only check if you don't already have ECC)
- The selection feeds Step 4's printout. **The CLI never executes `/plugin marketplace add` itself** — the user runs that inside Claude Code.

### Step 3: Copy configs as sidecars

For each source → destination pair, call `copyIfSafe`:

| Source (in repo) | Destination (in `~/.claude/`) | Strategy |
|---|---|---|
| `configs/settings.json.example` | `settings.json.from-operator-stack` | Always sidecar; never overwrite real `settings.json` |
| `configs/mcp-servers.json.example` | `mcp-configs/mcp-servers.json.from-operator-stack` | Always sidecar |
| `configs/rules/obsidian-integration.md` | `rules/obsidian-integration.md` | Direct (additive; sidecar only if exists) |

Then prompt: **"Copy custom hooks too?"** (default no). On yes:
- `prompts.multiselect` over `configs/hooks/*.{js,sh}` (the 6 sanitised hooks).
- For each selected, copy to `~/.claude/hooks/<name>` and `chmod +x` if `.sh`.
- Print: "Hooks copied. Wire them in `settings.json` per `configs/hooks/hooks.json.example`."

Then prompt: **"Vault path?"** (default `~/Brain`, allow text override or "skip").
- If provided and rules file was copied, do not modify the file's content (the sidecar is already correct for default vault). Just record the path in the printed summary.
- If skipped, suggest editing the rules file later.

### Step 4: Next-step printout

Print the same checklist `install.sh` lines 152-168 prints, **with the marketplace commands filtered to only the ones the user selected in Step 2**. End with:

- The list of files that were (or would be) written.
- A pointer to `npx claude-operator-stack verify` to confirm the install.
- `✓ done` (or `✓ dry-run complete. No files were written.`)

### `--yes` / non-interactive mode

- Step 1: same.
- Step 2: select all three marketplaces.
- Step 3: copy all three sidecars; **do not** copy hooks (hooks are explicit opt-in even with `--yes`); use default vault path `~/Brain`.
- Step 4: same checklist printed.

This matches the `install.sh --yes` behaviour bit-for-bit on the shared subset.

---

## `verify` flow — read-only audit logic

`verify` never writes. It only reads.

### Inputs

1. `~/.claude/settings.json` (or `--claude-dir`-overridden path).
2. `~/.claude/mcp-configs/mcp-servers.json` (presence + parse-only).
3. `~/.claude/rules/obsidian-integration.md` (presence-only).
4. `~/.claude/hooks/*` (presence-only; reported as `— skipped (opt-in)` because we cannot tell if the user intentionally declined them).

### Audit rules

```
For each component in stack.ts:
  - If component.kind === "plugin":
      Check settings.enabledPlugins[component.id] === true
      → emit { component, status: "enabled" | "missing", source: "enabledPlugins" }
  - If component.kind === "file":
      Check fs.existsSync(component.path)
      → emit { component, status: "present" | "missing", notes: ... }
  - If component.kind === "optional":
      → emit { component, status: "skipped", notes: "opt-in; not audited" }
```

The `audit()` function takes a `{ settings: any | null, fileExists: (p: string) => boolean }` shape and returns `AuditRow[]`. **All filesystem and parsing happens in the caller** so the function is pure and trivially testable.

### Output formats

- **Table (default):** picocolors-formatted rows; tally line at the bottom.
- **`--json`:** `{ rows: AuditRow[], summary: { wired: N, missing: M, skipped: K } }` to stdout. Exit 0 if `missing === 0`, else 10.

### What `verify` deliberately does NOT do

- Does not modify any file.
- Does not call `claude` CLI or any network.
- Does not check whether MCP server tokens are present in env. (That would require evaluating `${VAR}` substitutions across an arbitrary shell — out of scope.)

---

## `list-stack` flow

Compiled-in, static. The list lives in `src/lib/stack.ts` as a `const STACK: readonly StackComponent[]`. The single source of truth — if `stack/README.md` changes, this file changes alongside it (manual sync; `tests/stack.test.ts` asserts on the full set so drift is loud).

```ts
// src/lib/stack.ts (sketch — actual file in Plan 02)
export const STACK = [
  {
    id: "everything-claude-code",
    name: "Everything Claude Code",
    layer: "Skills + Agents",
    author: "@affaan-m",
    repo: "https://github.com/affaan-m/everything-claude-code",
    kind: "plugin",
    pluginKey: "everything-claude-code@everything-claude-code",
  },
  // ... 5 more
] as const;
```

`list-stack` prints the table or, with `--json`, dumps `STACK` as-is.

---

## Sidecar safety — the inviolable rule

**`~/.claude/settings.json` and `~/.claude/mcp-configs/mcp-servers.json` are NEVER overwritten by this CLI.**

The implementation in `lib/fs-safe.ts`:

```ts
// Pseudocode
function copyIfSafe(src: string, dst: string, opts: { force?: boolean, dryRun?: boolean }) {
  if (!fs.existsSync(src)) return { skipped: "missing source" };
  if (fs.existsSync(dst) && !opts.force) {
    // sidecar variant: write to dst + ".from-operator-stack"
    const sidecar = dst + ".from-operator-stack";
    if (opts.dryRun) return { wouldWrite: sidecar };
    fs.copyFileSync(src, sidecar);
    return { wrote: sidecar };
  }
  if (opts.dryRun) return { wouldWrite: dst };
  fs.copyFileSync(src, dst);
  return { wrote: dst };
}
```

Two settings files (`settings.json`, `mcp-servers.json`) **always** go to their `.from-operator-stack` sidecar regardless of whether the destination exists, matching `install.sh` lines 136-139. Other files (rules, hooks) write directly to the destination unless one already exists, in which case sidecar.

The `force` option exists for tests and future use; `init` never sets it.

---

## Test coverage — what we test, what we don't

### Pure logic — full coverage required

| Module | Coverage target |
|---|---|
| `lib/audit.ts` | 100% branches — every component kind, every status combo |
| `lib/fs-safe.ts` | 100% — exists/missing × dry-run/real × sidecar path |
| `lib/paths.ts` | 100% — `~`, `${HOME}`, override, default |
| `lib/stack.ts` | snapshot test — STACK shape and length |

### Command orchestration — smoke tests

| Module | What we assert |
|---|---|
| `commands/init.ts` | `--dry-run` with stubbed prompts writes nothing, exits 0; missing claude exits 2 |
| `commands/verify.ts` | Three fixtures (empty / partial / complete `settings.json`) produce the expected `AuditRow[]` and exit code |
| `commands/list-stack.ts` | Output contains all 6 component names; `--json` parses to expected shape |

### Interactive prompts — explicitly NOT tested

We do not snapshot-test `prompts` interactive output. We test the data structures that feed `prompts` (in `lib/prompts.ts`) and we test the orchestration logic with prompts stubbed via dependency injection. Trying to test the TTY rendering produces flake.

### Coverage threshold

`vitest.config.ts` sets `coverage.thresholds.lines: 70` per the ROADMAP success criterion. Pure logic modules sit well above that; interactive paths drag the average down. The 70% bar is honest, not manipulated.

---

## Build + run instructions (these go in `packages/cli/README.md` too)

```bash
# from repo root
pnpm install
pnpm build               # → packages/cli/dist/cli.js
pnpm test                # vitest run

# Local dev — direct invocation without build
pnpm --filter claude-operator-stack dev init --dry-run
pnpm --filter claude-operator-stack dev verify --json
pnpm --filter claude-operator-stack dev list-stack

# Verify the built bin
node packages/cli/dist/cli.js --help
node packages/cli/dist/cli.js init --dry-run

# Local link (simulate npx install — for manual smoke test only)
cd packages/cli && pnpm link --global
claude-operator-stack init --dry-run
pnpm unlink --global    # clean up
```

`tsup.config.ts` produces a single ESM bundle with a `#!/usr/bin/env node` shebang preserved on the bin file. No CJS variant — node ≥20 is required.

`packages/cli/package.json` `bin` field:

```json
{
  "bin": { "claude-operator-stack": "./dist/cli.js" }
}
```

`engines.node`: `">=20"`. Node 18 is EOL by launch date; supporting it costs us nothing operationally and a lot in feature constraints.

---

## README integration (repo root)

In `README.md`, the existing **Quick Start** section gets one new paragraph above the "Clone, audit, run" block:

```markdown
### Via npm (node-native path)

```bash
npx claude-operator-stack init --dry-run    # preview
npx claude-operator-stack init              # apply
npx claude-operator-stack verify            # audit your existing setup
```

Same outcome as `install.sh`, different ergonomics. The wizard prompts you through marketplace selection, copies sanitized configs as sidecar files (`*.from-operator-stack`), and prints the manual `/plugin` commands you'll run inside Claude Code.

The bash path stays for users who prefer to read every line before running it. Pick whichever you trust.
```

The existing "Recommended" bash block becomes the second subsection: `### Via bash (audit-and-run path)`. No content removed; the bash code block stays exactly as-is.

A short note added under the heading: **"Pick one path. Don't run both back-to-back on a fresh `~/.claude/` — they target the same files and the second run will create duplicate sidecars."**

---

## Workspace setup at repo root

This is the smallest possible monorepo footprint. We are not adopting Turborepo, Nx, or changesets in this phase.

### New files at repo root

1. **`package.json`** — workspace root, `private: true`, scripts pass through to `packages/cli/`. (Sketch in the Dependencies section above.)
2. **`pnpm-workspace.yaml`** — single line: `packages:\n  - 'packages/*'`.
3. **`.npmrc`** (optional, only if needed to pin `package-manager-strict=true`) — defer; add only if pnpm complains during execution.

### Modified files at repo root

1. **`.gitignore`** — append:
   ```
   # CLI package build artefacts
   packages/*/dist/
   packages/*/node_modules/
   packages/*/.tsbuildinfo
   packages/*/coverage/
   node_modules/
   ```
2. **`README.md`** — Quick Start section restructure (above).
3. **`CHANGELOG.md`** — `[Unreleased]` entry: `Added: npm CLI package at packages/cli/ — claude-operator-stack init|verify|list-stack. Not yet published; ships locally runnable.`

---

## Implementation steps — the actual checklist

Three plans within this phase, each ~50% context, sequential because each depends on the last. Plans 01 and 02 produce committable units; Plan 03 is the integration + release-readiness pass.

Numbering uses the M2 phase convention `<phase>-<plan>-PLAN.md`, but since this is the phase-level PLAN.md the agent executes the three plans in order.

### Plan 01 — Workspace + package scaffold (context: ~30%)

**Files affected:** 8 new, 2 modified.

1. Create `package.json` at repo root with workspaces config (sketched above).
2. Create `pnpm-workspace.yaml` at repo root.
3. Append the `.gitignore` block.
4. Create `packages/cli/package.json` with name, version `0.1.0`, MIT, repo URL `https://github.com/mccarthy606/claude-operator-stack`, author `Dmitry McCarthy`, `bin`, `engines`, `publishConfig.access: "public"`, scripts (`build`, `dev`, `test`, `test:coverage`), and the dependency lists from above.
5. Create `packages/cli/tsconfig.json` — `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`, `skipLibCheck: true`, `declaration: false`, `outDir: dist`.
6. Create `packages/cli/tsup.config.ts` — entry `src/cli.ts`, format `esm`, bundle, `shims: false`, `clean: true`, banner with shebang for the bin file.
7. Create `packages/cli/.npmignore` — exclude `src/`, `tests/`, `tsconfig.json`, `tsup.config.ts`, `.tsbuildinfo`, `coverage/`, `vitest.config.ts`.
8. Create `packages/cli/LICENSE` — copy of repo root `LICENSE` (MIT, same year + holder).
9. Create empty stubs: `src/cli.ts` (with shebang and a `console.log('todo')`), `src/types.ts`, `src/version.ts` (constant exporting `0.1.0`).
10. Run `pnpm install` from repo root. **Verify:** `pnpm build` succeeds with the stub. `node packages/cli/dist/cli.js` prints `todo`.
11. Commit: `feat(cli): scaffold packages/cli workspace`.

**Acceptance for Plan 01:** Repo builds. `pnpm test` is a no-op (no tests yet) and exits 0 or with a "no test files" warning (acceptable).

### Plan 02 — Core commands + lib (context: ~50%)

**Files affected:** 14 new, 1 modified (`src/cli.ts` filled out).

12. Implement `src/lib/format.ts` — `say`, `ok`, `warn`, `die` matching `install.sh` colours via picocolors. No prompts; pure formatters.
13. Implement `src/lib/paths.ts` — `resolveClaudeDir(opts?: { override?: string }): string` with `~` and `${HOME}` expansion, `resolveRepoRoot(): string` (walks up from `import.meta.url` looking for `package.json` with `workspaces`), `sidecarFor(path: string): string`.
14. Implement `src/lib/fs-safe.ts` — `copyIfSafe(src, dst, opts)` per the contract above. Pure return values; no side effects in `--dry-run`.
15. Implement `src/lib/stack.ts` — the `STACK` array of 6 components. Cross-check against `stack/README.md` table; if drift is found, **stop and update one or the other** so they match.
16. Implement `src/lib/settings-reader.ts` — `readSettings(claudeDir: string): { settings: any | null, error: 'missing' | 'unparsable' | null }`. JSON-parse only; no schema enforcement.
17. Implement `src/lib/audit.ts` — pure `audit({ stack, settings, fileExists }): AuditRow[]`. No fs imports in this file. **This is the file that must hit 100% branch coverage.**
18. Implement `src/lib/prompts.ts` — exports `marketplacePromptDef`, `hooksPromptDef`, `vaultPromptDef`, `confirmPromptDef`. Pure data; no prompts call here. Init.ts is what calls `prompts(...)`.
19. Implement `src/commands/list-stack.ts` — render `STACK` as table (default) or JSON (`--json`). Returns exit code 0.
20. Implement `src/commands/verify.ts` — wires `paths` + `settings-reader` + `audit` + table render or JSON. Exit codes per the surface contract.
21. Implement `src/commands/init.ts` — orchestrates the four steps. Takes a `prompts`-shaped function as DI for testing. Default DI uses real `prompts`; tests pass a stub.
22. Fill out `src/cli.ts` — commander wiring with the three commands, global `--no-color` and `--claude-dir <p>` flags.
23. Smoke-test manually: `pnpm --filter claude-operator-stack dev init --dry-run`, `dev verify`, `dev list-stack`. Each should produce the example output from the Command surface section above (modulo your local `~/.claude/` state).
24. Commit: `feat(cli): implement init, verify, list-stack commands`.

**Acceptance for Plan 02:** All three commands run end-to-end manually. No tests yet — that's Plan 03.

### Plan 03 — Tests + README integration + release-readiness (context: ~45%)

**Files affected:** 7 new test files, 3 fixtures, 2 modified at repo root.

25. Create `packages/cli/vitest.config.ts` — test glob `tests/**/*.test.ts`, coverage provider `v8`, thresholds `lines: 70, functions: 70, branches: 70`.
26. Create `tests/fixtures/settings-empty.json`, `settings-partial.json`, `settings-complete.json` — three states for `verify` to chew on.
27. Write `tests/audit.test.ts` — every branch of `audit()`. Hit 100%.
28. Write `tests/fs-safe.test.ts` — `copyIfSafe` with `tmp` dirs (`os.tmpdir()` + cleanup). Cover: missing source, fresh dst, existing dst (sidecar), dry-run for each.
29. Write `tests/stack.test.ts` — snapshot of `STACK` shape, length === 6, every component has required fields.
30. Write `tests/prompts.test.ts` — assert each prompt def has `type`, `name`, and either `choices` or `initial`.
31. Write `tests/init.test.ts` — drives `init` with a stubbed prompts function returning canned answers, in `--dry-run` mode, against a tmp `--claude-dir`. Asserts: exits 0, no files written, the right step messages emitted (capture stdout).
32. Run `pnpm test --coverage`. **Verify:** thresholds met. If a pure-logic file is below 100% branch coverage, write the missing test before proceeding.
33. Update repo root `README.md` Quick Start per the README integration section.
34. Update `CHANGELOG.md` with the unreleased entry.
35. Write `packages/cli/README.md` — installation, the three commands with examples, link back to repo root, link to CHANGELOG. ~80-150 lines.
36. Final manual smoke pass:
    - `pnpm install && pnpm build && pnpm test` — all green.
    - `node packages/cli/dist/cli.js --help` — three commands listed.
    - `node packages/cli/dist/cli.js init --dry-run` — runs to completion, exits 0, writes nothing.
    - `node packages/cli/dist/cli.js verify` — runs without crash on whatever the local `~/.claude/` state is.
    - `node packages/cli/dist/cli.js list-stack` — prints the 6-component table.
37. Commit: `feat(cli): tests, coverage, README integration`.

**Acceptance for Plan 03:** Phase success criteria below all green.

---

## Phase success criteria — verification commands

These are the gates. Phase 8.3 is not done until every line below executes successfully against a fresh checkout of `main`.

```bash
# from repo root, on a fresh clone
pnpm install
pnpm build
# expect: packages/cli/dist/cli.js exists, executable

pnpm test
# expect: all tests pass; coverage thresholds met (≥70% lines)

node packages/cli/dist/cli.js --help
# expect: stdout shows three commands — init, verify, list-stack

node packages/cli/dist/cli.js init --dry-run --yes --claude-dir /tmp/claude-test
# expect: exit 0; no files written under /tmp/claude-test
[ ! -d /tmp/claude-test ] && echo "✓ no writes confirmed"

node packages/cli/dist/cli.js verify --claude-dir /tmp/claude-test --json
# expect: exit 1 (settings.json not found); JSON emitted to stdout

node packages/cli/dist/cli.js list-stack --json
# expect: exit 0; JSON array of 6 component objects

# Repo-level verification
grep -q "Via npm" README.md && echo "✓ README mentions npm path"
grep -q "Via bash" README.md && echo "✓ README still has bash path"
grep -q "claude-operator-stack init" README.md && echo "✓ npm command shown"
[ -f install.sh ] && [ -x install.sh ] && echo "✓ install.sh untouched"

# Negative: confirm we did NOT publish
[ -z "$(grep '\"private\": false' packages/cli/package.json)" ] && \
  grep -q '"version": "0.1.0"' packages/cli/package.json && \
  echo "✓ package version pinned at 0.1.0; not published"
```

All eight checks must pass. The "negative" check at the end is the structural guarantee that this phase did not silently slip into doing P9's job.

---

## Risks + mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| **Scope creep** — wizard grows a marketplace browser, MCP picker, plugin runtime | Very high | Hard non-goals list above. Any feature outside `init`/`verify`/`list-stack` becomes a `TODO(v1.1)` comment, not a Phase 8.3 commit. |
| **TS build flakiness** with workspace + tsup combos | Medium | Pin tsup to `^8.2.4`; test the build on a fresh `pnpm install` before declaring Plan 01 done. |
| **`prompts` UX feels worse than the bash wizard** | Low-medium | Keep prompt count low (3 prompts max in `init`); match bash text closely; test on real terminal at end of Plan 02. |
| **`verify` mis-reports** because `settings.json` shape varies user-to-user | Medium | Audit function operates on duck-typed JSON; conservative reporting (`missing` if any required key is absent, never assume); fixture coverage of three realistic shapes. |
| **`STACK` drift** from `stack/README.md` | Low (manual sync) | `tests/stack.test.ts` snapshot makes drift loud; CHANGELOG note that `stack/README.md` is the source of truth for adds/removes. |
| **npm name `claude-operator-stack` taken** | Low (checked at Phase 8.3 start) | First task in Plan 01 is `pnpm view claude-operator-stack 2>&1 | grep "404"` — if not 404, **stop** and pivot the package name (with the user) before any other work. |
| **Phase blows past 8h** | Medium | Plans 01/02/03 are independently committable. If time pressure rises, Plan 03 can ship with 70% coverage and a thinner CLI README; the phase still delivers. |
| **TypeScript strict mode + `prompts` types friction** | Medium | `@types/prompts` is included; if a prompts type is wrong, narrow it locally with a `Pick<>` and a `// eslint-disable-next-line` rather than disabling strict mode. |

---

## Estimated effort breakdown

Target ~6-8h focused. Realistic is 7h for the build, 1h for the README integration polish.

| Plan | Estimate | Notes |
|---|---|---|
| Plan 01 — scaffold | 1.5h | Workspace setup, package.json, build config, stub. |
| Plan 02 — implementation | 3.5h | The bulk: lib + commands + manual smoke. |
| Plan 03 — tests + integration | 2h | Tests, README patch, final smoke pass. |
| **Total** | **7h** | |

If the scaffold step exceeds 2h (typical when pnpm + tsup + TS strict fight), pause and re-evaluate before continuing — that's the early signal that scope or tooling has drifted.

---

## Files affected — full list

### New (22 files)

```
package.json                                     [repo root, workspace]
pnpm-workspace.yaml                              [repo root]
packages/cli/package.json
packages/cli/tsconfig.json
packages/cli/tsup.config.ts
packages/cli/vitest.config.ts
packages/cli/.npmignore
packages/cli/LICENSE
packages/cli/README.md
packages/cli/src/cli.ts
packages/cli/src/types.ts
packages/cli/src/version.ts
packages/cli/src/commands/init.ts
packages/cli/src/commands/verify.ts
packages/cli/src/commands/list-stack.ts
packages/cli/src/lib/paths.ts
packages/cli/src/lib/fs-safe.ts
packages/cli/src/lib/format.ts
packages/cli/src/lib/prompts.ts
packages/cli/src/lib/stack.ts
packages/cli/src/lib/settings-reader.ts
packages/cli/src/lib/audit.ts
packages/cli/tests/audit.test.ts
packages/cli/tests/fs-safe.test.ts
packages/cli/tests/stack.test.ts
packages/cli/tests/prompts.test.ts
packages/cli/tests/init.test.ts
packages/cli/tests/fixtures/settings-empty.json
packages/cli/tests/fixtures/settings-partial.json
packages/cli/tests/fixtures/settings-complete.json
```

### Modified (3 files)

```
.gitignore           [add packages/*/dist + node_modules + coverage]
README.md            [Quick Start: add Via npm subsection above bash]
CHANGELOG.md         [unreleased entry]
```

### Untouched (must remain so)

```
install.sh           [audit-and-run path; coexists with the CLI]
configs/             [the source templates the CLI copies]
stack/               [single source of truth for STACK array]
.planning/           [outside this PLAN.md, nothing changes]
```

---

## Cross-references

- ROADMAP entry: `.planning/milestones/M2-v1-public-launch/ROADMAP.md` lines 394-431.
- Bash counterpart this CLI mirrors: `install.sh` (lines 56-170 are the structural template).
- Source templates copied: `configs/settings.json.example`, `configs/mcp-servers.json.example`, `configs/rules/obsidian-integration.md`, `configs/hooks/*` (opt-in only).
- Stack truth source: `stack/README.md` table (lines 43-51).
- Phase 9 coordination: this phase ships the package buildable + locally runnable; **publish (`npm publish`) is a Phase 9 task**, executed at the moment the repo flips public.
