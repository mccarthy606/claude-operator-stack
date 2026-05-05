/**
 * E2E: `claude-operator-stack list-stack --json`.
 *
 * Cheapest test in the suite. No fixtures, no fs writes, no stub binary —
 * `list-stack` reads only the compiled-in `STACK` constant (see
 * packages/cli/src/lib/stack.ts) and returns 0 unconditionally.
 *
 * Why this test exists in addition to the unit snapshot
 * (packages/cli/tests/stack.test.ts):
 *   - The unit test asserts the in-memory STACK array.
 *   - This test asserts that the *bundled* dist/cli.js still emits the same
 *     6-component contract after tsup. A breakage here means the build wiring
 *     is wrong (e.g. tree-shaking ate `STACK`) — the unit suite would pass
 *     and we'd ship a broken bin.
 */
import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const CLI_PATH = path.join(REPO_ROOT, "packages", "cli", "dist", "cli.js");

type Spawned = { code: number; stdout: string; stderr: string };

function spawnCli(args: readonly string[]): Promise<Spawned> {
  return new Promise((resolve, reject) => {
    // Always spawn with array argv (no shell), NO_COLOR=1 so picocolors emits
    // plain ASCII, and `process.execPath` for the runtime so the test works
    // when invoked under nvm/n/asdf without depending on `node` resolving
    // identically across shells.
    const child = spawn(process.execPath, [CLI_PATH, ...args], {
      cwd: REPO_ROOT,
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (c: Buffer) => {
      stdout += c.toString("utf8");
    });
    child.stderr.on("data", (c: Buffer) => {
      stderr += c.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
  });
}

describe("E2E: list-stack --json", () => {
  it("exits 0 and emits exactly 6 components with the documented schema", async () => {
    const { code, stdout } = await spawnCli(["list-stack", "--json"]);
    expect(code).toBe(0);

    const out = JSON.parse(stdout) as readonly Record<string, unknown>[];
    expect(Array.isArray(out)).toBe(true);
    expect(out.length).toBe(6);

    const expectedKeys = ["id", "name", "layer", "tier", "author", "repo", "kind"] as const;
    for (const entry of out) {
      for (const key of expectedKeys) {
        expect(entry).toHaveProperty(key);
        expect(typeof entry[key]).toBe("string");
      }
    }
  });

  it("groups 4 core + 2 opt-in by tier and locks the IDs", async () => {
    const { code, stdout } = await spawnCli(["list-stack", "--json"]);
    expect(code).toBe(0);

    const out = JSON.parse(stdout) as { id: string; tier: string }[];
    const core = out.filter((c) => c.tier === "core");
    const optIn = out.filter((c) => c.tier === "opt-in");
    expect(core.length).toBe(4);
    expect(optIn.length).toBe(2);

    expect(core.map((c) => c.id).sort()).toEqual(
      ["claude-code", "frontend-design", "graphify", "obsidian"],
    );
    expect(optIn.map((c) => c.id).sort()).toEqual(
      ["everything-claude-code", "toprank"],
    );
  });

  it("has no ID collisions", async () => {
    const { code, stdout } = await spawnCli(["list-stack", "--json"]);
    expect(code).toBe(0);

    const out = JSON.parse(stdout) as { id: string }[];
    const ids = out.map((c) => c.id);
    expect(new Set(ids).size).toBe(6);
  });
});
