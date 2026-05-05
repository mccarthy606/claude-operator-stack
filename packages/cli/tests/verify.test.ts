import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { runVerify } from "../src/commands/verify.js";

let tmp: string;
const captured: string[] = [];

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cos-verify-"));
  captured.length = 0;
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: unknown) => {
    captured.push(typeof chunk === "string" ? chunk : String(chunk));
    return true;
  });
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("runVerify", () => {
  it("missing settings.json returns 1 (table mode)", () => {
    const code = runVerify({ claudeDirOverride: tmp });
    expect(code).toBe(1);
    expect(captured.join("")).toContain("settings.json not found");
  });

  it("--json with missing settings emits JSON and returns 1", () => {
    const code = runVerify({ claudeDirOverride: tmp, json: true });
    expect(code).toBe(1);
    const out = captured.join("");
    const parsed = JSON.parse(out) as Record<string, unknown>;
    expect(parsed.settingsStatus).toBe("missing");
    expect(typeof parsed.summary).toBe("object");
  });

  it("unparsable settings returns 2", () => {
    fs.writeFileSync(path.join(tmp, "settings.json"), "{ not json");
    const code = runVerify({ claudeDirOverride: tmp });
    expect(code).toBe(2);
  });

  it("complete settings + present files returns 0 (no missing)", () => {
    fs.writeFileSync(
      path.join(tmp, "settings.json"),
      JSON.stringify({
        enabledPlugins: {
          "everything-claude-code@everything-claude-code": true,
          "toprank@nowork-studio": true,
          "frontend-design@claude-plugins-official": true,
        },
      })
    );
    fs.mkdirSync(path.join(tmp, "mcp-configs"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "mcp-configs", "mcp-servers.json"), "{}");
    fs.mkdirSync(path.join(tmp, "rules"), { recursive: true });
    fs.writeFileSync(
      path.join(tmp, "rules", "obsidian-integration.md"),
      "# rule"
    );

    const code = runVerify({ claudeDirOverride: tmp });
    expect(code).toBe(0);
    expect(captured.join("")).toContain("5 wired");
  });

  it("settings present but missing plugins returns 10 (advisory)", () => {
    fs.writeFileSync(
      path.join(tmp, "settings.json"),
      JSON.stringify({ enabledPlugins: {} })
    );
    const code = runVerify({ claudeDirOverride: tmp });
    expect(code).toBe(10);
  });

  it("--json with settings + missing plugins returns 10", () => {
    fs.writeFileSync(
      path.join(tmp, "settings.json"),
      JSON.stringify({ enabledPlugins: {} })
    );
    const code = runVerify({ claudeDirOverride: tmp, json: true });
    expect(code).toBe(10);
  });
});
