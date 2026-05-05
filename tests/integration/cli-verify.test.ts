/**
 * E2E: `claude-operator-stack verify --claude-dir <tmp> --json`.
 *
 * Locks the exit-code matrix from packages/cli/src/commands/verify.ts:
 *   - settings.json missing       → exit 1
 *   - settings.json unparsable    → exit 2
 *   - settings.json wired/partial → exit 0 OR 10 (advisory)
 *
 * No stub `claude` binary needed: `verify` is read-only and never probes the
 * Claude CLI. Each test gets a fresh `mkdtempSync` directory; no test writes
 * outside `os.tmpdir()`.
 *
 * The wired-case test asserts the *contract* (settingsStatus parses ok AND
 * the exit code matches the report's missing count) rather than a fragile
 * exit-code literal — the stack ships with two opt-in plugins, so the steady
 * state is "advisory 10" until someone enables them.
 */
import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
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

let claudeDir: string;

beforeEach(() => {
  claudeDir = fs.mkdtempSync(path.join(os.tmpdir(), "cos-verify-"));
  // Defence-in-depth: every fixture path under this test must live in tmp.
  // If mkdtempSync ever returned anything else, fail loudly here rather than
  // letting downstream writes hit the real ~/.claude/.
  if (!claudeDir.startsWith(os.tmpdir())) {
    throw new Error(`refusing to run: tmp dir escaped os.tmpdir(): ${claudeDir}`);
  }
});

afterEach(() => {
  fs.rmSync(claudeDir, { recursive: true, force: true });
});

describe("E2E: verify --claude-dir --json", () => {
  it("empty claude-dir → settingsStatus=missing, exit 1, JSON shape ok", async () => {
    const { code, stdout } = await spawnCli([
      "verify",
      "--claude-dir",
      claudeDir,
      "--json",
    ]);

    expect(code).toBe(1);

    const parsed = JSON.parse(stdout) as {
      claudeDir: string;
      settingsStatus: string;
      rows: readonly { status: string }[];
      summary: { wired: number; missing: number; skipped: number };
    };
    expect(parsed.claudeDir).toBe(claudeDir);
    expect(parsed.settingsStatus).toBe("missing");
    expect(Array.isArray(parsed.rows)).toBe(true);
    expect(parsed.rows.length).toBeGreaterThan(0);
    expect(parsed.summary.missing).toBeGreaterThanOrEqual(1);
  });

  it("malformed settings.json → settingsStatus=unparsable, exit 2", async () => {
    fs.writeFileSync(path.join(claudeDir, "settings.json"), "{not valid json");

    const { code, stdout } = await spawnCli([
      "verify",
      "--claude-dir",
      claudeDir,
      "--json",
    ]);

    expect(code).toBe(2);

    const parsed = JSON.parse(stdout) as { settingsStatus: string };
    expect(parsed.settingsStatus).toBe("unparsable");
  });

  it("wired settings.json + obsidian rule → status=ok, exit code matches report", async () => {
    fs.writeFileSync(
      path.join(claudeDir, "settings.json"),
      JSON.stringify({
        enabledPlugins: {
          "frontend-design@claude-plugins-official": true,
        },
      }),
    );
    fs.mkdirSync(path.join(claudeDir, "rules"), { recursive: true });
    fs.writeFileSync(
      path.join(claudeDir, "rules", "obsidian-integration.md"),
      "# rule\n",
    );

    const { code, stdout } = await spawnCli([
      "verify",
      "--claude-dir",
      claudeDir,
      "--json",
    ]);

    const parsed = JSON.parse(stdout) as {
      settingsStatus: string;
      rows: readonly { status: string }[];
      summary: { missing: number };
    };
    expect(parsed.settingsStatus).toBe("ok");

    // Contract: code==0 iff zero missing, else code==10.
    const missingCount = parsed.rows.filter((r) => r.status === "missing").length;
    expect(parsed.summary.missing).toBe(missingCount);
    if (missingCount === 0) {
      expect(code).toBe(0);
    } else {
      expect(code).toBe(10);
    }
  });
});
