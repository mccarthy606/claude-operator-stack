import { describe, expect, it } from "vitest";
import * as path from "node:path";
import { expandHome, resolveClaudeDir, sidecarFor } from "../src/lib/paths.js";

describe("paths — pure helpers", () => {
  it("expandHome resolves ~ via env.HOME", () => {
    expect(expandHome("~", { HOME: "/Users/x" })).toBe("/Users/x");
    expect(expandHome("~/.claude", { HOME: "/Users/x" })).toBe("/Users/x/.claude");
  });

  it("expandHome resolves ${HOME} and $HOME shapes", () => {
    expect(expandHome("${HOME}", { HOME: "/H" })).toBe("/H");
    expect(expandHome("${HOME}/x", { HOME: "/H" })).toBe("/H/x");
    expect(expandHome("$HOME", { HOME: "/H" })).toBe("/H");
    expect(expandHome("$HOME/x", { HOME: "/H" })).toBe("/H/x");
  });

  it("expandHome leaves absolute paths alone", () => {
    expect(expandHome("/absolute/path", { HOME: "/H" })).toBe("/absolute/path");
  });

  it("resolveClaudeDir prefers explicit override", () => {
    expect(
      resolveClaudeDir({ override: "/tmp/claude", env: { HOME: "/H" } })
    ).toBe(path.resolve("/tmp/claude"));
  });

  it("resolveClaudeDir falls back to HOME/.claude", () => {
    expect(resolveClaudeDir({ env: { HOME: "/Users/x" } })).toBe("/Users/x/.claude");
  });

  it("sidecarFor appends .from-operator-stack", () => {
    expect(sidecarFor("/.claude/settings.json")).toBe(
      "/.claude/settings.json.from-operator-stack"
    );
  });
});
