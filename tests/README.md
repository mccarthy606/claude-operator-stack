# `tests/` — integration suite

End-to-end integration tests for the install path: `install.sh`, plus the
three CLI commands shipped in v0.1.0 (`init`, `verify`, `list-stack`).

This suite is additive, not a replacement, for the unit tests under
`packages/cli/tests/` — those mock external dependencies and run fast;
these spawn the real binary against real (tmp) filesystems.

## How to run

From the repo root:

```bash
npm install
npm run test:integration
```

Prereqs: Node ≥20, npm. Total wall-clock under 60 seconds on a clean
machine. No network access required. **No real `~/.claude/` is touched** —
see "Isolation guarantees" below.

The runner script is `tests/run-all.sh`. It builds `packages/cli/dist/cli.js`
first; running stale dist against new tests is a debugging trap, so the
runner aborts early if the build fails.

## Test inventory

| File | Layer | Asserts |
|------|-------|---------|
| `integration/install-sh.test.sh` | bash | install.sh exits 0 with `--dry-run --yes` and a stub `claude` shim; sidecar paths are printed; install.sh exits 1 with no `claude` on PATH; nothing escapes `$STUB_HOME/.claude/`. |
| `integration/cli-init.test.ts` | vitest | `init --dry-run --yes` writes nothing; `init --yes` writes only under `--claude-dir`; SIGINT during interactive run returns exit 130 with no sidecars on disk. |
| `integration/cli-verify.test.ts` | vitest | `verify --json` exit-code matrix: 1 for missing settings, 2 for unparsable, 0/10 for wired (advisory). |
| `integration/cli-list-stack.test.ts` | vitest | `list-stack --json` returns 6 components grouped 4 core / 2 opt-in, with no ID collisions. |

## Why this set, not more

Out of scope for v1.0 (per `.planning/phases/P8.7-tests/PLAN.md` §2):

- No CI workflow — Phase 9 owns that wiring.
- No flakiness budget tooling — tests are deterministic or they get fixed.
- No coverage thresholds — the unit suite already publishes coverage.
- No marketplace/plugin install tests — those run inside Claude Code itself.
- No `bats` dependency — pure bash with `set -euo pipefail`.

## Where unit tests live

`packages/cli/tests/`. Run with `npm test`.

The boundary:
- **Unit** = mocked dependencies, fast feedback, branch coverage.
- **Integration** = real binary, real filesystem, end-to-end contract.

A breakage in only the integration suite usually means the dist build is
emitting different behaviour than the source. Worth investigating, never
worth weakening the assertion.

## Isolation guarantees

Hard rule: no test in this suite writes to the developer's real `~/.claude/`.

Three layers of defence:

1. **HOME / claude-dir always tmp.** Vitest tests use `mkdtempSync(os.tmpdir())`
   for the `--claude-dir` override and never override `HOME`. The bash test
   reassigns `HOME` to a freshly-minted `mktemp -d`.
2. **Top-of-file guards.** The bash test asserts `HOME` starts with `/tmp/`,
   `/private/tmp/`, or `/var/folders/` *after* the override, and refuses to
   run if the override accidentally evaluated to the real HOME. The vitest
   tests assert the tmp dir starts with `os.tmpdir()` in `beforeEach`.
3. **Stub `PATH`.** The bash test pins `PATH="$STUB_HOME/bin:/usr/bin:/bin"`
   so the only `claude` binary in scope is the stub it writes. The vitest
   `init` test uses the same pattern via `process.env.PATH` prefixing.

Vitest spawns use `child_process.spawn(process.execPath, [...])` (array
argv form, no shell). `child_process.exec` is never used — shell injection
would still be a vulnerability even in tests.

## Adding a test

1. Filename: `integration/<surface>.test.ts` (vitest) or `<surface>.test.sh` (bash).
2. Vitest tests are auto-discovered by `tests/vitest.config.ts`'s `include`
   glob. Bash tests are auto-discovered by `run-all.sh`'s `*.test.sh` loop.
3. New tmp dirs always go through `mkdtempSync(os.tmpdir())` (TS) or
   `mktemp -d -t cos-...XXXXXX` (bash). Never `~/`, never `process.env.HOME`.
4. Spawns: array argv, `cwd: REPO_ROOT`, `env: { ...process.env, NO_COLOR: "1" }`.
   Never `exec` with a shell string.
5. Cleanup: `afterEach` (TS) / `trap '...' EXIT` (bash).
