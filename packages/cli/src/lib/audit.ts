/**
 * Pure verify logic. Takes a stack list, a parsed settings object (or null),
 * and a `fileExists` predicate; returns `AuditRow[]` plus a summary.
 *
 * No fs imports — the caller (`commands/verify.ts`) does all I/O. This keeps
 * the function trivially testable and forces the tests for branch coverage.
 *
 * Branch matrix:
 *   - kind=plugin   × settings null    → missing
 *   - kind=plugin   × key true         → enabled
 *   - kind=plugin   × key false/absent → missing
 *   - kind=file     × exists           → present
 *   - kind=file     × missing          → missing
 *   - kind=optional × *                → skipped
 */
import type { AuditReport, AuditRow, StackComponent } from "../types.js";

export type AuditInput = {
  readonly stack: readonly StackComponent[];
  readonly settings: Record<string, unknown> | null;
  readonly fileExists: (relPath: string) => boolean;
};

function isEnabledPlugins(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function isPluginEnabled(
  settings: Record<string, unknown> | null,
  key: string
): boolean {
  if (settings === null) return false;
  const ep = settings.enabledPlugins;
  if (!isEnabledPlugins(ep)) return false;
  return ep[key] === true;
}

function rowFor(
  component: StackComponent,
  settings: Record<string, unknown> | null,
  fileExists: (p: string) => boolean
): AuditRow {
  switch (component.kind) {
    case "plugin": {
      const enabled = isPluginEnabled(settings, component.pluginKey);
      return {
        id: component.id,
        name: component.pluginKey,
        status: enabled ? "enabled" : "missing",
        source: "enabledPlugins",
        notes: enabled
          ? "via enabledPlugins"
          : settings === null
            ? "settings.json not found"
            : "add to enabledPlugins",
      };
    }
    case "file": {
      const present = fileExists(component.relPath);
      return {
        id: component.id,
        name: component.name,
        status: present ? "present" : "missing",
        source: "filesystem",
        notes: present
          ? "file present"
          : `copy from configs/${component.relPath.startsWith("rules/") ? "rules/" : ""}`,
      };
    }
    case "optional":
      return {
        id: component.id,
        name: component.name,
        status: "skipped",
        source: "opt-in",
        notes: component.note,
      };
  }
}

export function audit(input: AuditInput): AuditReport {
  const rows = input.stack.map((c) => rowFor(c, input.settings, input.fileExists));
  let wired = 0;
  let missing = 0;
  let skipped = 0;
  for (const r of rows) {
    if (r.status === "enabled" || r.status === "present") wired++;
    else if (r.status === "missing") missing++;
    else skipped++;
  }
  return { rows, summary: { wired, missing, skipped } };
}
