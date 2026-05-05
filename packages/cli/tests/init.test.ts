import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { runInit, WizardAbortedError } from "../src/commands/init.js";
import type { ClaudeProbe, PromptFn } from "../src/types.js";

function silenceStdout() {
  return vi.spyOn(process.stdout, "write").mockImplementation(() => true);
}
function silenceStderr() {
  return vi.spyOn(process.stderr, "write").mockImplementation(() => true);
}

let tmp: string;
const fakeRepoRoot = (root: string) => {
  // Build a minimal fake repo root with the source files init.ts copies.
  fs.mkdirSync(path.join(root, "configs", "rules"), { recursive: true });
  fs.mkdirSync(path.join(root, "configs", "hooks"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "configs", "settings.json.example"),
    JSON.stringify({ enabledPlugins: {} })
  );
  fs.writeFileSync(
    path.join(root, "configs", "mcp-servers.json.example"),
    JSON.stringify({ mcpServers: {} })
  );
  fs.writeFileSync(
    path.join(root, "configs", "rules", "obsidian-integration.md"),
    "# rule"
  );
  fs.writeFileSync(
    path.join(root, "configs", "hooks", "statusline.js"),
    "// statusline"
  );
  fs.writeFileSync(
    path.join(root, "configs", "hooks", "validate-commit-message.sh"),
    "#!/usr/bin/env bash\necho hi\n"
  );
};

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cos-init-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("runInit — orchestration smoke tests", () => {
  it("returns 2 when claude CLI not found and writes nothing", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: false });
    const promptFn: PromptFn = vi.fn(async () => ({}));

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
      yes: true,
      dryRun: true,
    });
    expect(code).toBe(2);
    expect(fs.existsSync(claudeDir)).toBe(false);
    expect(promptFn).not.toHaveBeenCalled();
  });

  it("--yes --dry-run: completes successfully and writes nothing under claude-dir", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async () => ({}));

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
      yes: true,
      dryRun: true,
    });
    expect(code).toBe(0);
    expect(fs.existsSync(claudeDir)).toBe(false);
    expect(promptFn).not.toHaveBeenCalled();
  });

  it("--yes (real run, no dry-run): writes sidecars + rule, hooks skipped", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async () => ({}));

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
      yes: true,
      dryRun: false,
    });
    expect(code).toBe(0);
    expect(
      fs.existsSync(
        path.join(claudeDir, "settings.json.from-operator-stack")
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          claudeDir,
          "mcp-configs",
          "mcp-servers.json.from-operator-stack"
        )
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(claudeDir, "rules", "obsidian-integration.md")
      )
    ).toBe(true);
    // Hooks always opt-in even with --yes
    expect(
      fs.existsSync(path.join(claudeDir, "hooks", "statusline.js"))
    ).toBe(false);
  });

  it("interactive --dry-run with stubbed prompts writes nothing", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async (qs: unknown) => {
      const arr = qs as { name: string }[];
      const q = arr[0];
      if (q?.name === "marketplaces") return { marketplaces: ["toprank@nowork-studio"] };
      if (q?.name === "continue") return { continue: true };
      if (q?.name === "copyHooks") return { copyHooks: false };
      if (q?.name === "vaultPath") return { vaultPath: "~/Brain" };
      return {};
    });

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
      dryRun: true,
    });
    expect(code).toBe(0);
    expect(fs.existsSync(claudeDir)).toBe(false);
    // marketplaces, continue, copyHooks, vaultPath = 4 prompt calls
    expect(vi.mocked(promptFn).mock.calls.length).toBe(4);
  });

  it("interactive abort at continue prompt returns exit 1", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async (qs: unknown) => {
      const arr = qs as { name: string }[];
      const q = arr[0];
      if (q?.name === "marketplaces") return { marketplaces: [] };
      if (q?.name === "continue") return { continue: false };
      return {};
    });

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
    });
    expect(code).toBe(1);
  });

  it("interactive aborted at marketplace prompt (cancel returns no array) → exit 1", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async () => ({}));

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
    });
    expect(code).toBe(1);
  });

  it("hooks: copyHooks=true with selectedHooks copies them to claude-dir/hooks", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async (qs: unknown) => {
      const arr = qs as { name: string }[];
      const q = arr[0];
      if (q?.name === "marketplaces") return { marketplaces: [] };
      if (q?.name === "continue") return { continue: true };
      if (q?.name === "copyHooks") return { copyHooks: true };
      if (q?.name === "selectedHooks") return { selectedHooks: ["statusline.js"] };
      if (q?.name === "vaultPath") return { vaultPath: "~/Brain" };
      return {};
    });

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
    });
    expect(code).toBe(0);
    expect(fs.existsSync(path.join(claudeDir, "hooks", "statusline.js"))).toBe(true);
  });

  it("Ctrl-C at marketplace prompt → onCancel throws → exit 130 (no sidecar writes yet)", async () => {
    silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    // Simulate the prompts library calling our onCancel hook on Ctrl-C: invoke
    // it directly so the WizardAbortedError propagates up just like at runtime.
    const promptFn: PromptFn = vi.fn(async (_qs, options) => {
      options?.onCancel?.();
      return {};
    });

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
    });
    expect(code).toBe(130);
    // No sidecar writes happened before abort — the abort fired at the very first prompt.
    expect(fs.existsSync(claudeDir)).toBe(false);
  });

  it("--yes forwards env override to expandHome (vault path resolves against stub HOME)", async () => {
    const stdout = silenceStdout();
    silenceStderr();
    const repoRoot = path.join(tmp, "repo");
    const claudeDir = path.join(tmp, "claude");
    const fakeHome = path.join(tmp, "fake-home");
    fakeRepoRoot(repoRoot);

    const probe: ClaudeProbe = () => ({ found: true, version: "1.2.3" });
    const promptFn: PromptFn = vi.fn(async () => ({}));

    const code = await runInit({
      claudeDirOverride: claudeDir,
      repoRoot,
      claudeProbe: probe,
      promptFn,
      yes: true,
      dryRun: true,
      env: { HOME: fakeHome } as NodeJS.ProcessEnv,
    });
    expect(code).toBe(0);
    // The vault path should have resolved against the stub HOME, not the user's real HOME.
    const out = stdout.mock.calls.map((c) => String(c[0])).join("");
    expect(out).toContain(path.join(fakeHome, "Brain"));
  });

  it("WizardAbortedError is exported and instances are detectable", () => {
    const e = new WizardAbortedError();
    expect(e).toBeInstanceOf(WizardAbortedError);
    expect(e).toBeInstanceOf(Error);
    expect(e.name).toBe("WizardAbortedError");
  });
});
