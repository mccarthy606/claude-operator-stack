/**
 * `list-stack` — print the six-component stack as a table or JSON.
 *
 * Always exits 0. Static; no fs reads beyond the compiled-in `STACK` constant.
 */
import { STACK } from "../lib/stack.js";
import { renderTable, dim, bold } from "../lib/format.js";

export type ListStackOpts = {
  json?: boolean;
};

export function runListStack(opts: ListStackOpts = {}): number {
  if (opts.json) {
    process.stdout.write(JSON.stringify(STACK, null, 2) + "\n");
    return 0;
  }

  const headers = ["Component", "Layer", "Author", "Repo"] as const;
  const widths = [26, 24, 22, 60] as const;

  const rows = STACK.map((c) => [
    c.name.length > widths[0] - 1
      ? c.name.slice(0, widths[0] - 1)
      : c.name,
    c.layer,
    c.author,
    c.repo,
  ]);

  process.stdout.write("\n");
  process.stdout.write(bold("The Claude Operator Stack — six components") + "\n\n");
  process.stdout.write(renderTable(headers, rows, widths) + "\n\n");
  process.stdout.write(dim("Bash installer:  ./install.sh") + "\n");
  process.stdout.write(dim("npm installer:   npx claude-operator-stack init") + "\n\n");
  return 0;
}
