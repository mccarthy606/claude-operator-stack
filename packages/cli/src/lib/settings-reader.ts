/**
 * Read + parse `~/.claude/settings.json`. Read-only; verify never mutates.
 *
 * Returns a sum-type so callers can branch on the failure mode without
 * try/catch and without leaking fs errors into the audit logic.
 */
import * as fs from "node:fs";
import * as path from "node:path";

export type SettingsResult =
  | { kind: "ok"; settings: Record<string, unknown> }
  | { kind: "missing"; path: string }
  | { kind: "unparsable"; path: string; error: string };

export function readSettings(claudeDir: string): SettingsResult {
  const settingsPath = path.join(claudeDir, "settings.json");
  if (!fs.existsSync(settingsPath)) {
    return { kind: "missing", path: settingsPath };
  }
  try {
    const raw = fs.readFileSync(settingsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        kind: "unparsable",
        path: settingsPath,
        error: "settings.json must be a JSON object",
      };
    }
    return { kind: "ok", settings: parsed as Record<string, unknown> };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { kind: "unparsable", path: settingsPath, error: msg };
  }
}
