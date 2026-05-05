import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runListStack } from "../src/commands/list-stack.js";
import { STACK } from "../src/lib/stack.js";

const captured: string[] = [];

beforeEach(() => {
  captured.length = 0;
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: unknown) => {
    captured.push(typeof chunk === "string" ? chunk : String(chunk));
    return true;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runListStack", () => {
  it("table mode prints the 4-core / 2-opt-in header and every component layer", () => {
    const code = runListStack();
    expect(code).toBe(0);
    const out = captured.join("");
    expect(out).toContain("Claude Operator Stack");
    expect(out).toContain("4 core + 2 opt-in");
    for (const c of STACK) {
      expect(out).toContain(c.layer);
    }
  });

  it("table mode renders core and opt-in subheaders", () => {
    runListStack();
    const out = captured.join("");
    expect(out).toContain("Core (always install)");
    expect(out).toContain("Opt-in (install when the use case fits)");
  });

  it("core subheader appears before opt-in subheader", () => {
    runListStack();
    const out = captured.join("");
    const coreIdx = out.indexOf("Core (always install)");
    const optInIdx = out.indexOf("Opt-in (install when the use case fits)");
    expect(coreIdx).toBeGreaterThanOrEqual(0);
    expect(optInIdx).toBeGreaterThan(coreIdx);
  });

  it("--json mode emits parseable JSON of length 6 with tier fields", () => {
    const code = runListStack({ json: true });
    expect(code).toBe(0);
    const out = captured.join("");
    const parsed = JSON.parse(out) as Array<Record<string, unknown>>;
    expect(parsed.length).toBe(6);
    const tiers = parsed.map((c) => c.tier);
    expect(tiers.filter((t) => t === "core").length).toBe(4);
    expect(tiers.filter((t) => t === "opt-in").length).toBe(2);
  });
});
