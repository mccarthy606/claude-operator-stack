import { describe, expect, it } from "vitest";
import { STACK } from "../src/lib/stack.js";

describe("STACK — single source of truth shape", () => {
  it("has exactly 6 components", () => {
    expect(STACK.length).toBe(6);
  });

  it("every component has the required base fields including tier", () => {
    for (const c of STACK) {
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBeGreaterThan(0);
      expect(typeof c.name).toBe("string");
      expect(typeof c.layer).toBe("string");
      expect(typeof c.author).toBe("string");
      expect(typeof c.repo).toBe("string");
      expect(["core", "opt-in"]).toContain(c.tier);
      expect(["plugin", "file", "external"]).toContain(c.kind);
    }
  });

  it("partitions into 4 core + 2 opt-in", () => {
    const core = STACK.filter((c) => c.tier === "core");
    const optIn = STACK.filter((c) => c.tier === "opt-in");
    expect(core.length).toBe(4);
    expect(optIn.length).toBe(2);
  });

  it("plugin components have a pluginKey of shape <name>@<source>", () => {
    const plugins = STACK.filter((c) => c.kind === "plugin");
    expect(plugins.length).toBe(3);
    for (const p of plugins) {
      if (p.kind === "plugin") {
        expect(p.pluginKey).toMatch(/^[\w-]+@[\w-]+$/);
      }
    }
  });

  it("external components carry a non-empty installCommand", () => {
    const externals = STACK.filter((c) => c.kind === "external");
    expect(externals.length).toBe(3);
    for (const e of externals) {
      if (e.kind === "external") {
        expect(typeof e.installCommand).toBe("string");
        expect(e.installCommand.length).toBeGreaterThan(0);
      }
    }
  });

  it("opt-in components carry an optionalCondition string", () => {
    const optIn = STACK.filter((c) => c.tier === "opt-in");
    for (const o of optIn) {
      expect(typeof o.optionalCondition).toBe("string");
      expect((o.optionalCondition ?? "").length).toBeGreaterThan(0);
    }
  });

  it("ids are unique", () => {
    const ids = new Set(STACK.map((c) => c.id));
    expect(ids.size).toBe(STACK.length);
  });

  it("snapshot of names — fails loudly on drift (4 core, then 2 opt-in)", () => {
    const ids = STACK.map((c) => c.id);
    expect(ids).toEqual([
      "claude-code",
      "obsidian",
      "graphify",
      "frontend-design",
      "everything-claude-code",
      "toprank",
    ]);
  });

  it("first four entries are the core tier in documented order", () => {
    const coreIds = STACK.slice(0, 4).map((c) => c.id);
    expect(coreIds).toEqual([
      "claude-code",
      "obsidian",
      "graphify",
      "frontend-design",
    ]);
    for (const c of STACK.slice(0, 4)) expect(c.tier).toBe("core");
  });

  it("last two entries are the opt-in tier", () => {
    const optInIds = STACK.slice(4).map((c) => c.id);
    expect(optInIds).toEqual([
      "everything-claude-code",
      "toprank",
    ]);
    for (const c of STACK.slice(4)) expect(c.tier).toBe("opt-in");
  });
});
