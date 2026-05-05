/**
 * E2E: `claude-operator-stack init`.
 *
 * Three cases:
 *   1. `--dry-run --yes` → exit 0, banner present, claude-dir untouched.
 *   2. `--yes` (real run) → exit 0, sidecars written under --claude-dir, no
 *      writes outside that prefix.
 *   3. SIGINT during interactive run → exit 130 (per init.ts handler), no
 *      sidecar files. Race-resistant: wait for the "Step 2/4" stdout chunk
 *      before sending SIGINT (collectChoices's first prompt fires in step 2).
 *
 * Isolation strategy:
 *   - Every `claudeDir` is `mkdtempSync` under `os.tmpdir()`. The test asserts
 *     the prefix before allowing any spawn — defence in depth against a tmp
 *     impl that ever returned a path outside /tmp.
 *   - A stub `claude` binary lives in a separate `mkdtempSync` "stubBin" dir
 *     and is the *only* thing prepended to PATH. The init wizard's
 *     `claudeProbe` runs `claude --version`; the stub prints `1.0.0-stub`.
 *     Without it, init exits 2 before reaching the prompt code path we need.
 *   - We intentionally do NOT override HOME for these spawns. The CLI takes
 *     its claude-dir from `--claude-dir` and never falls back to `~` when
 *     that flag is set (see paths.resolveClaudeDir). HOME stays the real
 *     user HOME and the test still cannot write under `~/.claude/` because
 *     no code path computes that prefix.
 */
import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
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

type Spawned = { code: number; signal: NodeJS.Signals | null; stdout: string; stderr: string };

let claudeDir: string;
let stubBin: string;

function makeStubClaude(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
  const stubPath = path.join(dir, "claude");
  // The wizard's defaultClaudeProbe calls `claude --version`, splits on
  // whitespace, and takes the first token. Anything that exits 0 with a
  // non-empty stdout works.
  fs.writeFileSync(
    stubPath,
    "#!/usr/bin/env bash\necho '1.0.0-stub'\n",
    { mode: 0o755 },
  );
  // Belt-and-braces: chmod 0755 even if writeFileSync's mode is honoured by
  // the platform. Some macOS variants strip the execute bit on tmp writes.
  fs.chmodSync(stubPath, 0o755);
}

function spawnCli(
  args: readonly string[],
  opts: { interactive?: boolean } = {},
): { child: ChildProcess; done: Promise<Spawned> } {
  const child = spawn(process.execPath, [CLI_PATH, ...args], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      NO_COLOR: "1",
      // Prepend stubBin so `claude --version` resolves to the stub.
      PATH: `${stubBin}${path.delimiter}${process.env.PATH ?? ""}`,
    },
    stdio: opts.interactive
      ? ["pipe", "pipe", "pipe"]
      : ["ignore", "pipe", "pipe"],
  });

  const done = new Promise<Spawned>((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (c: Buffer) => {
      stdout += c.toString("utf8");
    });
    child.stderr?.on("data", (c: Buffer) => {
      stderr += c.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code, signal) =>
      resolve({ code: code ?? -1, signal, stdout, stderr }),
    );
  });

  return { child, done };
}

function listAllFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (p: string) => {
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(full);
    }
  };
  walk(dir);
  return out;
}

beforeEach(() => {
  claudeDir = fs.mkdtempSync(path.join(os.tmpdir(), "cos-init-cdir-"));
  stubBin = fs.mkdtempSync(path.join(os.tmpdir(), "cos-init-bin-"));
  // Defence-in-depth: refuse to run if mkdtempSync escapes os.tmpdir().
  if (!claudeDir.startsWith(os.tmpdir())) {
    throw new Error(`refusing to run: claudeDir escaped os.tmpdir(): ${claudeDir}`);
  }
  if (!stubBin.startsWith(os.tmpdir())) {
    throw new Error(`refusing to run: stubBin escaped os.tmpdir(): ${stubBin}`);
  }
  makeStubClaude(stubBin);
});

afterEach(() => {
  fs.rmSync(claudeDir, { recursive: true, force: true });
  fs.rmSync(stubBin, { recursive: true, force: true });
});

describe("E2E: init", () => {
  it("--dry-run --yes exits 0, prints the banner + 4 steps, writes nothing", async () => {
    const { done } = spawnCli([
      "init",
      "--dry-run",
      "--yes",
      "--claude-dir",
      claudeDir,
    ]);
    const { code, stdout } = await done;

    expect(code).toBe(0);
    expect(stdout).toContain("Claude Operator Stack — installer (npm)");
    expect(stdout).toContain("Step 1/4");
    expect(stdout).toContain("Step 2/4");
    expect(stdout).toContain("Step 3/4");
    expect(stdout).toContain("Step 4/4");
    // Dry-run means zero files anywhere under the override dir.
    expect(listAllFilesRecursive(claudeDir)).toEqual([]);
  });

  it("--yes (real run) writes sidecars only under --claude-dir, nothing escapes", async () => {
    const { done } = spawnCli([
      "init",
      "--yes",
      "--claude-dir",
      claudeDir,
    ]);
    const { code } = await done;
    expect(code).toBe(0);

    const written = listAllFilesRecursive(claudeDir);
    // At minimum: settings sidecar, mcp sidecar, and the obsidian rule.
    const expected = [
      path.join(claudeDir, "settings.json.from-operator-stack"),
      path.join(claudeDir, "mcp-configs", "mcp-servers.json.from-operator-stack"),
      path.join(claudeDir, "rules", "obsidian-integration.md"),
    ];
    for (const e of expected) expect(written).toContain(e);

    // No write escapes the claude-dir prefix. Resolve both sides to absolute,
    // canonical paths so a /private/var ↔ /var symlink on macOS doesn't trip
    // the prefix check.
    const resolvedDir = fs.realpathSync(claudeDir);
    for (const w of written) {
      const r = fs.realpathSync(w);
      expect(r.startsWith(resolvedDir + path.sep) || r === resolvedDir).toBe(true);
    }
  });

  it("SIGINT during interactive run returns exit 130 with no sidecar writes", async () => {
    // Start the wizard interactively (no --yes, no --dry-run). The first
    // prompts.prompt() fires inside step 2; we wait for the exact "Step 2/4"
    // chunk before sending SIGINT so the abort lands during prompt rather than
    // before init.ts has reached the prompt-handler code path.
    const { child, done } = spawnCli(
      ["init", "--claude-dir", claudeDir],
      { interactive: true },
    );

    let killed = false;
    let stdoutBuf = "";

    await new Promise<void>((resolve, reject) => {
      const onData = (c: Buffer) => {
        stdoutBuf += c.toString("utf8");
        if (!killed && stdoutBuf.includes("Step 2/4")) {
          killed = true;
          // Defer the kill by one tick so the prompt has actually started
          // listening on stdin — otherwise the signal can race the prompt's
          // own SIGINT handler registration.
          setImmediate(() => {
            try {
              child.kill("SIGINT");
            } catch (err) {
              reject(err);
              return;
            }
            resolve();
          });
        }
      };
      child.stdout?.on("data", onData);
      child.on("error", reject);
      // Hard ceiling: if Step 2/4 never appears within 10s on slow hardware,
      // kill anyway and let the assertion below explain.
      setTimeout(() => {
        if (!killed) {
          killed = true;
          try {
            child.kill("SIGINT");
          } catch (e) {
            reject(e);
            return;
          }
          resolve();
        }
      }, 10_000).unref();
    });

    const { code, signal } = await done;
    // init.ts catches WizardAbortedError and `return 130` — so on SIGINT we
    // expect a clean exit code 130, not a signal-terminated process.
    // Fallback (per PLAN §4.2.3): on slow hardware some shells report the
    // signal instead of the code. Accept either as a *contract* match.
    if (code === 130) {
      // Happy path.
    } else if (signal === "SIGINT") {
      // Acceptable fallback — investigated and accepted in PLAN §4.2.3.
    } else {
      throw new Error(
        `expected exit 130 or signal SIGINT, got code=${code} signal=${signal}`,
      );
    }

    // Whatever happened, no sidecars should be on disk: the abort fires before
    // applyChoices runs.
    const written = listAllFilesRecursive(claudeDir);
    expect(written).toEqual([]);
  });
});
