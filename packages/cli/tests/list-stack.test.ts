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
  it("table mode prints header and all 6 components", () => {
    const code = runListStack();
    expect(code).toBe(0);
    const out = captured.join("");
    expect(out).toContain("Claude Operator Stack");
    for (const c of STACK) {
      expect(out).toContain(c.layer);
    }
  });

  it("--json mode emits parseable JSON of length 6", () => {
    const code = runListStack({ json: true });
    expect(code).toBe(0);
    const out = captured.join("");
    const parsed = JSON.parse(out) as unknown[];
    expect(parsed.length).toBe(6);
  });
});
