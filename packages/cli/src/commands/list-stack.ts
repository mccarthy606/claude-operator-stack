/**
 * `list-stack` — print the 6-component stack as a table or JSON, grouped by
 * tier (4 core, then 2 opt-in) to mirror README + stack/README.md framing.
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

  const renderGroup = (
    title: string,
    rows: ReadonlyArray<readonly string[]>
  ): string => {
    return (
      bold(title) + "\n\n" + renderTable(headers, rows, widths) + "\n\n"
    );
  };

  const toRow = (c: typeof STACK[number]): readonly string[] => [
    c.name.length > widths[0] - 1 ? c.name.slice(0, widths[0] - 1) : c.name,
    c.layer,
    c.author,
    c.repo,
  ];

  const coreRows = STACK.filter((c) => c.tier === "core").map(toRow);
  const optInRows = STACK.filter((c) => c.tier === "opt-in").map(toRow);

  process.stdout.write("\n");
  process.stdout.write(
    bold("The Claude Operator Stack — 4 core + 2 opt-in") + "\n\n"
  );
  process.stdout.write(
    renderGroup("Core (always install)", coreRows)
  );
  process.stdout.write(
    renderGroup("Opt-in (install when the use case fits)", optInRows)
  );
  process.stdout.write(dim("Bash installer:  ./install.sh") + "\n");
  process.stdout.write(dim("npm installer:   npx claude-operator-stack init") + "\n\n");
  return 0;
}
