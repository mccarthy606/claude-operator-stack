/**
 * `verify` — read-only audit of `~/.claude/` against the stack.
 *
 * Exit codes:
 *   0  all wired
 *   1  settings.json not found (with --json, still emits)
 *   2  settings.json present but unparsable
 *   10 at least one component missing (advisory)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { resolveClaudeDir } from "../lib/paths.js";
import { readSettings } from "../lib/settings-reader.js";
import { audit } from "../lib/audit.js";
import { STACK } from "../lib/stack.js";
import { renderTable, ok as printOk, warn as printWarn, say, dim, bold } from "../lib/format.js";

export type VerifyOpts = {
  json?: boolean;
  claudeDirOverride?: string;
};

export function runVerify(opts: VerifyOpts = {}): number {
  const claudeDir = resolveClaudeDir({ override: opts.claudeDirOverride });
  const settingsResult = readSettings(claudeDir);

  // For verify, missing settings.json doesn't abort — we still report the
  // file-presence checks. Exit code differs.
  let baseExit = 0;
  let settingsObj: Record<string, unknown> | null = null;
  if (settingsResult.kind === "ok") {
    settingsObj = settingsResult.settings;
  } else if (settingsResult.kind === "missing") {
    baseExit = 1;
  } else {
    // unparsable
    baseExit = 2;
  }

  const fileExists = (relPath: string) =>
    fs.existsSync(path.join(claudeDir, relPath));

  const report = audit({ stack: STACK, settings: settingsObj, fileExists });

  if (opts.json) {
    process.stdout.write(
      JSON.stringify(
        {
          claudeDir,
          settingsStatus: settingsResult.kind,
          ...report,
        },
        null,
        2
      ) + "\n"
    );
    if (baseExit !== 0) return baseExit;
    return report.summary.missing > 0 ? 10 : 0;
  }

  // Human table
  process.stdout.write("\n");
  say(`Auditing ${dim(claudeDir)}`);
  process.stdout.write("\n");

  if (settingsResult.kind === "missing") {
    printWarn(`settings.json not found at ${settingsResult.path}`);
    process.stdout.write("\n");
  } else if (settingsResult.kind === "unparsable") {
    printWarn(`settings.json present but unparsable: ${settingsResult.error}`);
    process.stdout.write("\n");
  } else {
    printOk(`settings.json parsed (${path.join(claudeDir, "settings.json")})`);
    process.stdout.write("\n");
  }

  const headers = ["Component", "Status", "Notes"] as const;
  const widths = [50, 10, 30] as const;
  const rows = report.rows.map((r) => {
    const statusGlyph =
      r.status === "enabled" || r.status === "present"
        ? "✓ ok"
        : r.status === "missing"
          ? "⚠ missing"
          : "— skipped";
    return [r.name, statusGlyph, r.notes];
  });
  process.stdout.write(renderTable(headers, rows, widths) + "\n\n");
  process.stdout.write(
    bold(
      `${report.summary.wired} wired · ${report.summary.missing} missing · ${report.summary.skipped} skipped (opt-in)\n`
    )
  );

  if (baseExit !== 0) return baseExit;
  return report.summary.missing > 0 ? 10 : 0;
}
