/**
 * Entrypoint for the `claude-operator-stack` CLI.
 *
 * Three commands and only three: init, verify, list-stack. New commands are
 * out of scope for v0.1.0 — see `.planning/phases/P8.3-npm-cli/PLAN.md`.
 */
import { Command, Option } from "commander";
import { VERSION } from "./version.js";
import { runInit } from "./commands/init.js";
import { runVerify } from "./commands/verify.js";
import { runListStack } from "./commands/list-stack.js";
import { setColorEnabled } from "./lib/format.js";

function buildProgram(): Command {
  const program = new Command();

  program
    .name("claude-operator-stack")
    .description(
      "Wizard installer for the Claude Operator Stack — six-component curated stack for Claude Code."
    )
    .version(VERSION, "-v, --version", "print the CLI version and exit")
    .addOption(
      new Option("--no-color", "disable picocolors output").default(undefined)
    )
    .hook("preAction", (thisCommand) => {
      const opts = thisCommand.opts<{ color?: boolean }>();
      if (opts.color === false) {
        setColorEnabled(false);
      }
    });

  program
    .command("init")
    .description("Run the interactive installer wizard.")
    .option("--dry-run", "show what would happen, write nothing")
    .option("-y, --yes", "accept all defaults; non-interactive")
    .option("--claude-dir <path>", "override ~/.claude/ resolution (test injection)")
    .action(async (opts) => {
      const code = await runInit({
        dryRun: Boolean(opts.dryRun),
        yes: Boolean(opts.yes),
        claudeDirOverride: typeof opts.claudeDir === "string" ? opts.claudeDir : undefined,
      });
      process.exit(code);
    });

  program
    .command("verify")
    .description("Audit ~/.claude/ for stack components. Read-only.")
    .option("--json", "emit machine-readable JSON instead of a table")
    .option("--claude-dir <path>", "override ~/.claude/ resolution (test injection)")
    .action((opts) => {
      const code = runVerify({
        json: Boolean(opts.json),
        claudeDirOverride: typeof opts.claudeDir === "string" ? opts.claudeDir : undefined,
      });
      process.exit(code);
    });

  program
    .command("list-stack")
    .description("Print the six-component stack as a table or JSON.")
    .option("--json", "emit JSON instead of a table")
    .action((opts) => {
      const code = runListStack({ json: Boolean(opts.json) });
      process.exit(code);
    });

  return program;
}

async function main(argv: readonly string[]): Promise<void> {
  const program = buildProgram();
  await program.parseAsync(argv as string[]);
}

// Bin entrypoint. `cli.ts` is referenced from `package.json` `bin`; no other
// module in the package imports from this file (commands import from
// `./commands/*`). Running `main` unconditionally is safe — and survives every
// install path: bare `node dist/cli.js`, `npm install -g`'s symlinked bin
// shim, `npx`, and macOS `/tmp` symlink resolution. Tests call `buildProgram`
// directly and never reach this top-level call site (vitest imports modules,
// it doesn't execute `cli.ts` as a script).
//
// Set `COS_CLI_SKIP_MAIN=1` to opt out (kept for any future test harness that
// imports this module directly without going through commander).
if (process.env.COS_CLI_SKIP_MAIN !== "1") {
  main(process.argv).catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}

export { buildProgram, main };
