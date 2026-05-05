import { describe, expect, it } from "vitest";
import { audit } from "../src/lib/audit.js";
import { STACK } from "../src/lib/stack.js";
import settingsEmpty from "./fixtures/settings-empty.json" with { type: "json" };
import settingsPartial from "./fixtures/settings-partial.json" with { type: "json" };
import settingsComplete from "./fixtures/settings-complete.json" with { type: "json" };

const NEVER_EXISTS = () => false;
const ALWAYS_EXISTS = () => true;

describe("audit() — pure logic, full branch coverage", () => {
  it("settings === null marks every plugin as missing and uses 'settings.json not found' note", () => {
    const report = audit({ stack: STACK, settings: null, fileExists: NEVER_EXISTS });
    const plugins = report.rows.filter((r) => r.source === "enabledPlugins");
    expect(plugins.length).toBe(3);
    for (const p of plugins) {
      expect(p.status).toBe("missing");
      expect(p.notes).toBe("settings.json not found");
    }
  });

  it("settings is empty object — plugins missing, uses 'add to enabledPlugins' note", () => {
    const report = audit({
      stack: STACK,
      settings: settingsEmpty as Record<string, unknown>,
      fileExists: NEVER_EXISTS,
    });
    const plugins = report.rows.filter((r) => r.source === "enabledPlugins");
    for (const p of plugins) {
      expect(p.status).toBe("missing");
      expect(p.notes).toBe("add to enabledPlugins");
    }
  });

  it("partial settings — two plugins enabled, one missing", () => {
    const report = audit({
      stack: STACK,
      settings: settingsPartial as Record<string, unknown>,
      fileExists: NEVER_EXISTS,
    });
    const enabled = report.rows.filter((r) => r.status === "enabled");
    const missingPlugins = report.rows.filter(
      (r) => r.source === "enabledPlugins" && r.status === "missing"
    );
    expect(enabled.length).toBe(2);
    expect(missingPlugins.length).toBe(1);
    expect(missingPlugins[0]?.name).toBe(
      "everything-claude-code@everything-claude-code"
    );
  });

  it("complete settings — three plugins wired; three external rows always skipped", () => {
    const report = audit({
      stack: STACK,
      settings: settingsComplete as Record<string, unknown>,
      fileExists: ALWAYS_EXISTS,
    });
    expect(report.summary.wired).toBe(3);
    expect(report.summary.missing).toBe(0);
    expect(report.summary.skipped).toBe(3);
  });

  it("external kind always returns 'skipped' regardless of inputs", () => {
    const reportNull = audit({
      stack: STACK,
      settings: null,
      fileExists: NEVER_EXISTS,
    });
    const reportFull = audit({
      stack: STACK,
      settings: settingsComplete as Record<string, unknown>,
      fileExists: ALWAYS_EXISTS,
    });
    const externalIds = ["claude-code", "obsidian", "graphify"];
    for (const id of externalIds) {
      expect(reportNull.rows.find((r) => r.id === id)?.status).toBe("skipped");
      expect(reportFull.rows.find((r) => r.id === id)?.status).toBe("skipped");
    }
  });

  it("external row notes carry the install command or note text", () => {
    const report = audit({
      stack: STACK,
      settings: null,
      fileExists: NEVER_EXISTS,
    });
    const claudeCode = report.rows.find((r) => r.id === "claude-code");
    expect(claudeCode?.source).toBe("opt-in");
    expect(typeof claudeCode?.notes).toBe("string");
    expect((claudeCode?.notes ?? "").length).toBeGreaterThan(0);
  });

  it("malformed enabledPlugins (array, primitive) is treated as missing — defensive parsing", () => {
    const cases: unknown[] = [
      { enabledPlugins: ["frontend-design@claude-plugins-official"] },
      { enabledPlugins: "yes" },
      { enabledPlugins: 1 },
      { enabledPlugins: null },
    ];
    for (const settings of cases) {
      const report = audit({
        stack: STACK,
        settings: settings as Record<string, unknown>,
        fileExists: NEVER_EXISTS,
      });
      const plugins = report.rows.filter((r) => r.source === "enabledPlugins");
      for (const p of plugins) expect(p.status).toBe("missing");
    }
  });

  it("plugin set to false is missing, set to true is enabled — strict equality", () => {
    const settings = {
      enabledPlugins: {
        "toprank@nowork-studio": false,
        "frontend-design@claude-plugins-official": true,
      },
    };
    const report = audit({
      stack: STACK,
      settings: settings as Record<string, unknown>,
      fileExists: NEVER_EXISTS,
    });
    const tp = report.rows.find((r) => r.name === "toprank@nowork-studio");
    const fd = report.rows.find(
      (r) => r.name === "frontend-design@claude-plugins-official"
    );
    expect(tp?.status).toBe("missing");
    expect(fd?.status).toBe("enabled");
  });

  it("summary tally adds up to total rows", () => {
    const report = audit({
      stack: STACK,
      settings: settingsPartial as Record<string, unknown>,
      fileExists: ALWAYS_EXISTS,
    });
    const total =
      report.summary.wired + report.summary.missing + report.summary.skipped;
    expect(total).toBe(report.rows.length);
    expect(total).toBe(STACK.length);
  });
});
