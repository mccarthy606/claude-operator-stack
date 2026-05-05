/**
 * picocolors-backed formatting helpers — mirrors the colour palette of
 * `install.sh` so the CLI feels like a sibling, not a stranger.
 *
 * Single state bit: a module-local `colorEnabled` flag flipped by `--no-color`.
 * Test-only: `setColorEnabled(false)` makes assertions plain-text.
 */
import pc from "picocolors";

let colorEnabled = true;

export function setColorEnabled(enabled: boolean): void {
  colorEnabled = enabled;
}

function paint<T extends (s: string) => string>(fn: T, s: string): string {
  return colorEnabled ? fn(s) : s;
}

export function say(msg: string): void {
  process.stdout.write(`${paint(pc.cyan, "▶")} ${msg}\n`);
}

export function ok(msg: string): void {
  process.stdout.write(`${paint(pc.green, "✓")} ${msg}\n`);
}

export function warn(msg: string): void {
  process.stderr.write(`${paint(pc.yellow, "!")} ${msg}\n`);
}

export function die(msg: string): void {
  process.stderr.write(`${paint(pc.red, "✗")} ${msg}\n`);
}

export function dim(s: string): string {
  return paint(pc.gray, s);
}

export function bold(s: string): string {
  return paint(pc.bold, s);
}

export function banner(version: string, dryRun: boolean): string {
  const tag = dryRun ? `v${version} · dry-run` : `v${version}`;
  const line = (s: string) => `  ${s}`;
  // Width is fixed; layout matches install.sh banner so visuals are siblings.
  return [
    "",
    line("╔═══════════════════════════════════════════════════╗"),
    line("║      Claude Operator Stack — installer (npm)      ║"),
    line("║      curated stack for solo founders              ║"),
    line(`║      ${tag.padEnd(45)}║`),
    line("╚═══════════════════════════════════════════════════╝"),
    "",
  ].join("\n");
}

/**
 * Render a fixed-column table with a header row and a separator line.
 * Used by `verify` and `list-stack`. Kept here so width logic lives in one
 * place and is colour-agnostic.
 */
export function renderTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  widths: readonly number[]
): string {
  const padCell = (s: string, w: number) => {
    if (s.length >= w) return s;
    return s + " ".repeat(w - s.length);
  };
  const join = (cells: readonly string[]) =>
    cells.map((c, i) => padCell(c, widths[i] ?? c.length)).join("  ");
  const sep = widths.map((w) => "─".repeat(w)).join("  ");
  return [join(headers), sep, ...rows.map(join)].join("\n");
}
