/**
 * Scoped vitest config for the integration suite.
 *
 * Why a separate config (vs. extending packages/cli/vitest.config.ts):
 *   - The unit suite already publishes coverage; double-counting from a second
 *     run confuses the threshold gate. `coverage.enabled: false` here.
 *   - Integration tests spawn child processes and write to tmp dirs. `pool:
 *     "forks"` enforces test isolation so one test's tmp cleanup never races
 *     another's spawn. `threads` would share the parent's fd table.
 *   - 30s timeouts are the per-test budget from PLAN §10. The cheapest test
 *     (`list-stack`) returns in <1s; the SIGINT case in `cli-init` waits on a
 *     specific stdout chunk, which is the longest single hop.
 *
 * Include glob is intentionally narrow: `tests/integration/*.test.ts`. Bash
 * tests live alongside but are picked up by `tests/run-all.sh`, not vitest.
 */
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import * as path from "node:path";

// Resolve `tests/` regardless of where vitest is invoked from (repo root,
// inside packages/, or via npx). Without this, vitest's `root` defaults to
// process.cwd() and the `include` glob can silently miss the integration
// directory when the script is run from a subdirectory.
const TESTS_DIR = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    root: TESTS_DIR,
    include: ["integration/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    pool: "forks",
    reporters: ["default"],
    coverage: { enabled: false },
  },
});
