import { describe, expect, it } from "vitest";
import { STACK } from "../src/lib/stack.js";

describe("STACK — single source of truth shape", () => {
  it("has exactly 6 components", () => {
    expect(STACK.length).toBe(6);
  });

  it("every component has the required base fields", () => {
    for (const c of STACK) {
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBeGreaterThan(0);
      expect(typeof c.name).toBe("string");
      expect(typeof c.layer).toBe("string");
      expect(typeof c.author).toBe("string");
      expect(typeof c.repo).toBe("string");
      expect(["plugin", "file", "optional"]).toContain(c.kind);
    }
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

  it("file components have a relPath under .claude/", () => {
    const files = STACK.filter((c) => c.kind === "file");
    expect(files.length).toBe(2);
    for (const f of files) {
      if (f.kind === "file") {
        expect(f.relPath.startsWith("/")).toBe(false);
      }
    }
  });

  it("optional components carry a note string", () => {
    const opts = STACK.filter((c) => c.kind === "optional");
    expect(opts.length).toBeGreaterThanOrEqual(1);
    for (const o of opts) {
      if (o.kind === "optional") expect(o.note.length).toBeGreaterThan(0);
    }
  });

  it("ids are unique", () => {
    const ids = new Set(STACK.map((c) => c.id));
    expect(ids.size).toBe(STACK.length);
  });

  it("snapshot of names — fails loudly on drift", () => {
    const names = STACK.map((c) => c.id);
    expect(names).toEqual([
      "everything-claude-code",
      "toprank",
      "frontend-design",
      "mcp-servers",
      "obsidian-rule",
      "operator-hooks",
    ]);
  });
});
