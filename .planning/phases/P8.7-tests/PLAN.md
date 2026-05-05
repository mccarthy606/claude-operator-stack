---
phase: P8.7
plan: 01
type: execute
wave: 1
depends_on: [P8.3]
files_modified:
  - tests/integration/install-sh.test.sh
  - tests/integration/cli-init.test.ts
  - tests/integration/cli-verify.test.ts
  - tests/integration/cli-list-stack.test.ts
  - tests/run-all.sh
  - tests/vitest.config.ts
  - tests/README.md
  - package.json
  - .planning/phases/P8.7-tests/INTEGRATION.md
autonomous: true
requirements: [P8.7]
must_haves:
  truths:
    - "`npm run test:integration` runs from a fresh clone and exits 0"
    - "All 4 tests isolate HOME and --claude-dir to /tmp; the developer's real ~/.claude/ is never touched"
    - "install.sh dry-run is asserted end-to-end (no mocks at the script level)"
    - "Each CLI command (init, verify, list-stack) has an e2e file invoked via `node packages/cli/dist/cli.js`"
    - "Total runtime <60s on the operator's machine"
  artifacts:
    - { path: tests/integration/install-sh.test.sh, provides: "Bash e2e for install.sh --dry-run --yes" }
    - { path: tests/integration/cli-init.test.ts, provides: "Vitest e2e for init incl. SIGINT/exit-130" }
    - { path: tests/integration/cli-verify.test.ts, provides: "Vitest e2e for verify JSON + exit codes" }
    - { path: tests/integration/cli-list-stack.test.ts, provides: "Vitest e2e for list-stack --json" }
    - { path: tests/run-all.sh, provides: "Single entry point: build + vitest + bash loop" }
    - { path: tests/vitest.config.ts, provides: "Scoped config, 30s timeout, no coverage" }
    - { path: tests/README.md, provides: "Testing strategy + isolation guarantees" }
    - { path: .planning/phases/P8.7-tests/INTEGRATION.md, provides: "README/CONTRIBUTING delta snippet" }
  key_links:
    - { from: "package.json (root)", to: tests/run-all.sh, via: "scripts.test:integration" }
    - { from: tests/run-all.sh, to: packages/cli/dist/cli.js, via: "build + node spawn" }
    - { from: "tests/integration/cli-*.test.ts", to: packages/cli/dist/cli.js, via: "child_process.spawn (no shell)" }
---

<objective>
Add an end-to-end integration suite under `tests/` that exercises the install path
(install.sh + the three CLI commands shipped in P8.3) against /tmp-isolated stub
HOME and claude-dir. Wired into a root-level npm script (`npm run test:integration`)
so a launch reader, a contributor, or Phase 9's pre-flip checklist can prove the
installer is safe in <60s without unit-test mocking.

Purpose: turn "trust me, the installer is safe" into a deterministic assertion
suite. v1.0's install surface currently has no e2e proof that running install.sh
or the CLI never writes outside `~/.claude/`. This phase closes that gap with the
smallest credible test set (4 tests + 1 runner), additive to — not replacing —
the unit tests already in `packages/cli/tests/`.

Output: 4 integration test files, 1 runner, 1 vitest config, 1 strategy README,
1 root-`package.json` script delta, 1 `INTEGRATION.md` snippet for the coordinated
repo-root README pass.
</objective>

<context>
@.planning/milestones/M2-v1-public-launch/ROADMAP.md
@install.sh
@packages/cli/src/cli.ts
@packages/cli/src/commands/init.ts
@packages/cli/src/commands/verify.ts
@packages/cli/src/commands/list-stack.ts
@packages/cli/src/lib/stack.ts
@packages/cli/src/lib/format.ts
@packages/cli/tests/init.test.ts
@package.json

<interfaces>
<!-- Contracts extracted from source so the executor does not have to re-discover. -->

CLI bin (after `npm --workspace packages/cli run build`):
  packages/cli/dist/cli.js — invoked as `node <path>`

Exit codes (from src/commands/*.ts):
  init        → 0 success / 1 user-aborted-no / 2 claude CLI not found / 3 fs error / 130 SIGINT
  verify      → 0 all-wired / 1 settings.json missing / 2 unparsable / 10 advisory missing
  list-stack  → 0 always

Banner (from src/lib/format.ts):
  "Claude Operator Stack — installer (npm)"
  Steps: "Step 1/4 — checking Claude Code CLI" / "Step 2/4 — marketplaces and plugins"
         "Step 3/4 — copying configs as sidecars" / "Step 4/4 — next steps"

Sidecars (init writes; install.sh writes the same paths under $HOME):
  <claude-dir>/settings.json.from-operator-stack
  <claude-dir>/mcp-configs/mcp-servers.json.from-operator-stack
  <claude-dir>/rules/<file>.md            (additive, no .from-operator-stack suffix)

STACK (from src/lib/stack.ts) — emitted by `list-stack --json`:
  6 entries; IDs: claude-code, obsidian, graphify, frontend-design,
                  everything-claude-code, toprank
  tier === "core":   first 4 IDs above
  tier === "opt-in": last 2
</interfaces>
</context>

# 1. Goal restatement

Top-level `tests/integration/` directory containing four e2e tests — one for `install.sh`, one each for the three CLI commands shipped in P8.3 — wired into a single `tests/run-all.sh` runner exposed at the repo root as `npm run test:integration`. The suite is the deterministic answer to "does running this installer write outside `~/.claude/`?" and is the last green light Phase 9 looks at before flipping the repo public.

# 2. Non-goals

- **No CI workflow.** GitHub Actions wiring is separate (Phase 9 or v1.1). This phase makes the suite *runnable*, not *automated*.
- **No flakiness budget tooling.** Tests pass deterministically the first time on a clean machine, or they get fixed.
- **No coverage thresholds for integration.** The 70% bar from P8.3 lives in unit tests; integration is additive.
- **No marketplace/plugin install tests.** Install runs inside Claude Code itself — out of scope for this repo.
- **No bats dependency.** Pure-bash with `set -euo pipefail` only.
- **No unit-test relocation.** `packages/cli/tests/` stays put; integration is a new directory.

# 3. Test runner — `tests/run-all.sh`

Pure bash, ~30 lines:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "▶ Building packages/cli..."
npm --workspace packages/cli run build

echo "▶ Running vitest integration tests..."
npx vitest run --config tests/vitest.config.ts

echo "▶ Running bash integration tests..."
shopt -s nullglob
for f in tests/integration/*.test.sh; do
  echo "  · $f"
  bash "$f"
done

echo "✓ Integration suite passed."
```

`set -euo pipefail` makes any single failure kill the runner. `npx vitest` resolves the workspace-hoisted vitest from root `node_modules/.bin/`. The runner does **not** install dependencies — that's the developer's responsibility (`npm install` at the root).

# 4. Per-test spec

## 4.1 `tests/integration/install-sh.test.sh` (pure bash)

Test cases (assertions inside one script via `[[ ... ]] || die "msg"`):

1. **Tmp-HOME sanity gate** (always first):
   - `STUB_HOME="$(mktemp -d -t cos-install-test.XXXXXX)"`
   - Assert `STUB_HOME` starts with `/tmp/`, `/private/tmp/`, or `/var/folders/` (macOS default). Reject anything matching `$REAL_HOME`.
   - `trap 'rm -rf "$STUB_HOME"' EXIT`
   - Top-of-file guard (defence-in-depth, ROADMAP success criterion #6):
     ```bash
     [[ "${HOME:-}" == /tmp/* || "${HOME:-}" == /private/tmp/* || "${HOME:-}" == /var/folders/* ]] \
       || { echo "FATAL: HOME not tmp: ${HOME:-<unset>}"; exit 99; }
     ```
     This guard runs **after** `HOME` is set to the stub, never against the real `HOME`.

2. **Exit-zero with `--dry-run --yes` and a stub `claude` shim:**
   - Build a stub at `$STUB_HOME/bin/claude` that prints `1.0.0-stub` and exits 0; `chmod +x`.
   - `PATH="$STUB_HOME/bin:/usr/bin:/bin" HOME="$STUB_HOME" bash ./install.sh --dry-run --yes`
   - Assert exit 0.

3. **No write outside `$STUB_HOME/.claude/`:**
   - Touch `$STUB_HOME/.timestamp` before the run; after the run, `find "$STUB_HOME" -newer "$STUB_HOME/.timestamp" -type f` must yield nothing outside `$STUB_HOME/.claude/`. (Dry-run is the path being tested, so even non-claude-dir writes would be a bug.)

4. **Sidecar paths printed at expected locations** (dry-run prints them):
   - `grep -F "$STUB_HOME/.claude/settings.json.from-operator-stack" "$STDOUT_LOG"`
   - `grep -F "$STUB_HOME/.claude/mcp-configs/mcp-servers.json.from-operator-stack" "$STDOUT_LOG"`

5. **`claude` CLI absence path** (second invocation, same script):
   - `PATH="/usr/bin:/bin" HOME="$STUB_HOME" bash ./install.sh --dry-run --yes`
   - Assert exit 1 (install.sh `die`s when `command -v claude` fails).
   - Assert stdout/stderr contains `claude CLI not found`.

Fixtures: synthesised inside `mktemp -d`. Isolation: `HOME` overridden, `PATH` overridden, no `~`.

## 4.2 `tests/integration/cli-init.test.ts` (vitest)

3 test cases. All spawns use `child_process.spawn(process.execPath, ["packages/cli/dist/cli.js", ...args], { cwd: REPO_ROOT, env: { ...process.env, NO_COLOR: "1", PATH: stubBin + ":" + process.env.PATH } })`. The `stubBin` dir contains an executable `claude` shim that prints `1.0.0-stub` (otherwise `init` exits 2 on the CLI probe).

1. **`--dry-run --yes` exits 0 against a fresh tmp claude-dir:**
   - `claudeDir = mkdtempSync(path.join(os.tmpdir(), "cos-init-test-"))`
   - Args: `init --dry-run --yes --claude-dir <claudeDir>`
   - Assert exit 0; stdout contains `"Claude Operator Stack — installer (npm)"`, `"Step 1/4"`..`"Step 4/4"`.
   - Assert `fs.readdirSync(claudeDir)` is `[]` (dry-run wrote nothing).

2. **`--yes` (real run) writes sidecars only under `--claude-dir`:**
   - Same setup minus `--dry-run`.
   - After exit 0: walk `claudeDir` recursively; assert `settings.json.from-operator-stack`, `mcp-configs/mcp-servers.json.from-operator-stack`, and at least one `rules/*.md` exist.
   - Assert no path written escapes `claudeDir` (resolve and check prefix).

3. **SIGINT during interactive run returns exit 130:**
   - No `--yes`, no `--dry-run`. `stdio: ["pipe", "pipe", "pipe"]`.
   - Listen on stdout; on the first chunk containing `"Step 2/4"` (printed before the first `prompts` call resolves), call `child.kill("SIGINT")`.
   - Assert exit 130.
   - Assert `claudeDir` contains no files (the abort fired before any sidecar write).
   - Fallback rule: if timing proves racy on slow hardware, accept exit-code-only assertion. **Investigate before relaxing.** Do not silently weaken at first failure.

## 4.3 `tests/integration/cli-verify.test.ts` (vitest)

3 test cases. No stub `claude` binary needed (verify does not probe the CLI).

1. **Empty claude-dir → settings missing → JSON shape + exit 1:**
   - `claudeDir = mkdtempSync(...)` (empty).
   - Args: `verify --claude-dir <dir> --json`
   - Parse stdout JSON; assert keys `claudeDir`, `settingsStatus`, `rows`, `summary`.
   - Assert `settingsStatus === "missing"`, `summary.missing >= 1`.
   - Assert exit code 1 (per verify.ts: missing settings.json returns baseExit=1 before falling through to advisory 10).

2. **Malformed `settings.json` → exit 2:**
   - Write `<claudeDir>/settings.json` with content `{not valid json`.
   - Args: `verify --claude-dir <dir> --json`
   - Assert exit code 2; JSON `settingsStatus === "unparsable"`.

3. **Wired claude-dir → exit 0 OR advisory 10 (assert the contract, not a fragile code):**
   - `<claudeDir>/settings.json` = `{ "enabledPlugins": { "frontend-design@claude-plugins-official": true } }`
   - `<claudeDir>/rules/obsidian-integration.md` = `# rule`
   - Parse JSON; assert `settingsStatus === "ok"`.
   - Assert exit code is `0` OR `10`, AND `summary.missing` matches the count of `rows.filter(r => r.status === "missing")`. (Opt-in plugins missing → advisory 10 is acceptable; the contract is "code matches the report".)

## 4.4 `tests/integration/cli-list-stack.test.ts` (vitest)

3 test cases. No fixtures — output is compiled-in `STACK`.

1. **Exits 0 and emits 6 components:**
   - Args: `list-stack --json`
   - Parse JSON; `Array.isArray(out)` true, `out.length === 6`.
   - Each entry has keys `id`, `name`, `layer`, `tier`, `author`, `repo`, `kind`.

2. **Tier grouping is 4 core + 2 opt-in:**
   - `out.filter(c => c.tier === "core").length === 4`
   - `out.filter(c => c.tier === "opt-in").length === 2`
   - Core IDs: `["claude-code", "obsidian", "graphify", "frontend-design"]`
   - Opt-in IDs: `["everything-claude-code", "toprank"]`

3. **No ID collisions:** `new Set(out.map(c => c.id)).size === 6`.

# 5. `tests/vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/integration/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    pool: "forks",            // child_process + tmp dirs need fork isolation
    reporters: ["default"],
    coverage: { enabled: false },
  },
});
```

`pool: "forks"` because tests spawn child processes and write to tmp dirs — fork isolation prevents one test's tmp cleanup from racing another. `coverage.enabled: false` because the unit suite already publishes coverage; double-counting confuses tooling.

# 6. `tests/README.md`

Sections (target ~80 lines):
1. **What this directory is** — e2e integration tests for the install path; additive to `packages/cli/tests/`.
2. **How to run** — `npm install && npm run test:integration` from repo root. Prereqs: Node ≥20, npm. No real `~/.claude/` is touched.
3. **Test inventory** — table mapping each file to what it asserts.
4. **Why this set, not more** — explicit reference to the non-goals (Section 2).
5. **Where unit tests live** — `packages/cli/tests/`. Boundary: integration = real binary, real fs; unit = mocked deps, fast feedback.
6. **Isolation guarantees** — every test uses `mkdtempSync` for HOME / claude-dir; no test references `~/` or `process.env.HOME` directly; the bash test asserts HOME is `/tmp/...` before invoking install.sh.
7. **Adding a test** — short checklist (filename convention, registration, what to mock vs. spawn).

No installation steps, no marketing — this is a test directory README.

# 7. Root `package.json` changes

```json
{
  "scripts": {
    "build": "npm --workspace packages/cli run build",
    "test": "npm --workspace packages/cli test",
    "test:integration": "bash tests/run-all.sh",   // NEW
    "dev": "npm --workspace packages/cli run dev"
  }
}
```

`devDependencies`: with npm workspaces, `vitest@^2.0.5` and `@types/node@^20.14.10` from `packages/cli/package.json` typically hoist to root `node_modules/`, so `npx vitest` from root resolves without root devDeps.

**Executor decision rule:** run `npx vitest --version` at repo root *before* editing root `devDependencies`. If it resolves, leave root `devDependencies` empty. If it fails, add:

```json
"devDependencies": { "@types/node": "^20.14.10", "vitest": "^2.0.5" }
```

This avoids version drift between unit and integration suites — both pin to the same vitest major.

# 8. Repo-root README + CONTRIBUTING (deferred to coordinated pass)

Edits do **not** ship in this phase's commits — staged in `INTEGRATION.md` for the Phase 8 coordinated README pass (rationale: README has many phases editing it; one coordinated edit avoids merge thrash).

`INTEGRATION.md` contains:

1. **README.md "What's Inside" tree delta:**
   ```
   tests/                                  # E2E integration suite
     integration/
       install-sh.test.sh                  # bash, asserts install.sh dry-run is HOME-safe
       cli-init.test.ts                    # vitest, asserts init wizard end-to-end
       cli-verify.test.ts                  # vitest, asserts verify exit-code matrix + JSON
       cli-list-stack.test.ts              # vitest, asserts 6-component stack contract
     run-all.sh                            # build + vitest + bash loop
     vitest.config.ts                      # 30s timeout, no coverage
     README.md                             # testing strategy
   ```

2. **CONTRIBUTING.md "Tests" section** (contributor-facing, not user-facing):
   ```markdown
   ## Tests

   Two layers:

   - **Unit tests** — `packages/cli/tests/`. Run with `npm test`. Fast, mocks external deps.
   - **Integration tests** — `tests/integration/`. Run with `npm run test:integration`.
     Slower (~30s), spawns the real CLI, asserts the bash installer is HOME-safe.

   Before sending a PR:
   ```bash
   npm test
   npm run test:integration
   ```

   The integration suite uses `mktemp -d` for every HOME / claude-dir override.
   It does not touch `~/.claude/`.
   ```

# 9. Implementation steps

1. Create `tests/`, `tests/integration/`.
2. Write `tests/vitest.config.ts` (Section 5).
3. Write `tests/integration/cli-list-stack.test.ts` (simplest — no fixtures).
4. Write `tests/integration/cli-verify.test.ts` (file fixtures only).
5. Write `tests/integration/cli-init.test.ts` (stub `claude` on PATH; SIGINT timing).
6. Write `tests/integration/install-sh.test.sh` (pure bash; mirrors cli-init at the bash layer).
7. Write `tests/run-all.sh` (Section 3).
8. Run `npx vitest --version` at repo root; decide whether to add devDeps per Section 7.
9. Update root `package.json`: add `test:integration` script (and devDeps if step 8 said to).
10. `npm install` if devDeps were added.
11. Run `npm run test:integration` end-to-end. Iterate until green.
12. Write `tests/README.md` (Section 6).
13. Write `.planning/phases/P8.7-tests/INTEGRATION.md` (Section 8).
14. Commit: `feat(tests): add e2e integration suite for install path (P8.7)`.

Order rationale: cheapest test first (#3) so the runner skeleton validates before the SIGINT/bash work lands.

# 10. Quality bar

- Each test isolates HOME and claude-dir via `mkdtempSync` (TS) or `mktemp -d` (bash). No test references `~/` or `os.homedir()` for writes.
- Tests must not touch the developer's real `~/.claude/`. Defence-in-depth: bash test has the explicit HOME-is-tmp guard; TS tests pass `--claude-dir` and don't set `HOME`.
- Total runtime <60s on a clean machine. Per-test budget: 30s.
- Bash tests use `set -euo pipefail` and `trap '...' EXIT` for cleanup.
- TS tests use `child_process.spawn` (array argv form, no shell), `cwd: REPO_ROOT`, `env: { ...process.env, NO_COLOR: "1" }`. Never `child_process.exec` (shell injection vector even in tests).
- No test asserts coloured output. `NO_COLOR=1` on every spawn so picocolors emits plain ASCII.
- Tests are independent. `pool: "forks"` enforces this at the vitest layer.

# 11. Success criteria + verification commands

Phase ships when:

- [ ] `tests/integration/` contains 4 files: `install-sh.test.sh`, `cli-init.test.ts`, `cli-verify.test.ts`, `cli-list-stack.test.ts`.
- [ ] `tests/run-all.sh` exists; invocable as `bash tests/run-all.sh` from repo root.
- [ ] `tests/vitest.config.ts` exists; `npx vitest run --config tests/vitest.config.ts` runs only integration tests.
- [ ] `tests/README.md` exists, ≤120 lines.
- [ ] Root `package.json` has `"test:integration": "bash tests/run-all.sh"`.
- [ ] `npm run test:integration` exits 0 from a fresh clone (after `npm install`).
- [ ] Total wall-clock <60s.
- [ ] `.planning/phases/P8.7-tests/INTEGRATION.md` exists with the README tree delta + CONTRIBUTING snippet.

Verification one-liner (executor runs at the end):
```bash
touch /tmp/cos-pre-test-sentinel \
  && npm run test:integration \
  && find "$HOME/.claude" -newer /tmp/cos-pre-test-sentinel -type f 2>/dev/null \
  && echo "PASS: integration suite green and ~/.claude/ untouched"
```

Expected `find` output: empty.

# 12. Risks + mitigations

| Risk | Mitigation |
|------|------------|
| Test touches the developer's real `~/.claude/` if HOME is misset | Top-of-file HOME-is-tmp guard in bash test; TS tests pass `--claude-dir` and never reset `HOME`; verification one-liner re-checks via `find ~/.claude/ -newer <sentinel>` |
| Slow tests inflate the loop | 30s per-test timeout; runner is opt-in (`test:integration` not `test`); SIGINT case can fall back to exit-code-only if racy — investigate before relaxing |
| `bats` not installed | Pure bash with `set -euo pipefail` is the default; `bats` never invoked |
| `npx vitest` not resolvable from root | Step 8 probes with `npx vitest --version` and adds root devDeps only if probe fails |
| SIGINT timing race on slow hardware | Wait for the specific stdout chunk (`"Step 2/4"`) before sending SIGINT — not a blind timeout |
| `--claude-dir` semantics drift later | Unit suite (`packages/cli/tests/init.test.ts`) already locks the contract; integration is a second witness |
| `run-all.sh` rebuilds every run | Acceptable: `tsup` build is <2s. Freshness-check optimisation is premature for v1.0 |

# 13. Estimated time

| Step | Estimate |
|------|----------|
| 1-2: dirs + vitest config | 10m |
| 3: cli-list-stack (simplest) | 20m |
| 4: cli-verify (file fixtures) | 30m |
| 5: cli-init (stub claude, SIGINT) | 60m |
| 6: install-sh.test.sh (bash, HOME guard) | 45m |
| 7: run-all.sh | 15m |
| 8-10: package.json + npm install if needed | 10m |
| 11: first green run + iteration | 30m |
| 12: tests/README.md | 20m |
| 13: INTEGRATION.md | 15m |
| 14: commit + final verification | 10m |
| **Total** | **~3h45m** |

Within ROADMAP's "~3-4h" estimate.

# 14. Files to create

New (committed by this phase):
- `tests/integration/install-sh.test.sh`
- `tests/integration/cli-init.test.ts`
- `tests/integration/cli-verify.test.ts`
- `tests/integration/cli-list-stack.test.ts`
- `tests/run-all.sh`
- `tests/vitest.config.ts`
- `tests/README.md`
- `.planning/phases/P8.7-tests/INTEGRATION.md`

Modified (committed by this phase):
- `package.json` (root) — `scripts.test:integration` added; root `devDependencies` added only if Section 7 step 8 says to.

Deferred to coordinated pass (NOT committed by this phase — staged in `INTEGRATION.md`):
- `README.md` (root) — "What's Inside" tree update
- `CONTRIBUTING.md` — new "Tests" section

<verification>
From repo root after the executor finishes:

```bash
ls -la tests/integration/ tests/run-all.sh tests/vitest.config.ts tests/README.md
npm run test:integration
touch /tmp/cos-pre-test-sentinel && npm run test:integration \
  && find "$HOME/.claude" -newer /tmp/cos-pre-test-sentinel -type f 2>/dev/null
time npm run test:integration
git diff package.json
```

Expected: tree present; suite exits 0; `find` returns empty; wall-clock <60s; package.json diff = 1 new script line plus optional devDeps.
</verification>

<success_criteria>
Every box in Section 11 checked AND every command in `<verification>` passes.
</success_criteria>

<output>
After completion, create `.planning/phases/P8.7-tests/P8.7-01-SUMMARY.md` with:
- Files created (full list from Section 14)
- Final wall-clock runtime of `npm run test:integration`
- Any deviations (e.g. devDeps added to root, SIGINT fallback used)
- Confirmation the verification one-liner returned empty
- Pointer to `INTEGRATION.md` for the coordinated README pass
</output>
