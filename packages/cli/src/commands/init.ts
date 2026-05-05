/**
 * `init` — interactive wizard. Mirrors `install.sh` 4-step structure.
 *
 * Exit codes:
 *   0    success (or dry-run completed)
 *   1    user aborted at confirm prompt (the "no" path)
 *   2    `claude` CLI not found in PATH
 *   3    filesystem error
 *   130  user aborted via Ctrl-C (the SIGINT path) — sidecar writes that
 *        already happened are reported in the abort message
 */
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import promptsLib from "prompts";
import {
  resolveClaudeDir,
  resolveRepoRoot,
  expandHome,
} from "../lib/paths.js";
import { copyIfSafe, describeCopy } from "../lib/fs-safe.js";
import {
  marketplacePrompt,
  copyHooksPrompt,
  buildHooksMultiselectPrompt,
  vaultPathPrompt,
  continueConfirmPrompt,
} from "../lib/prompts.js";
import {
  banner,
  say,
  ok,
  warn,
  die,
  dim,
} from "../lib/format.js";
import { VERSION } from "../version.js";
import type { ClaudeProbe, PromptFn, WizardChoices } from "../types.js";

export type InitOpts = {
  dryRun?: boolean;
  yes?: boolean;
  claudeDirOverride?: string;
  /** Test injection — defaults to real `prompts`. */
  promptFn?: PromptFn;
  /** Test injection — defaults to spawning `claude --version`. */
  claudeProbe?: ClaudeProbe;
  /** Test injection — defaults to `resolveRepoRoot()`. */
  repoRoot?: string;
  /** Test injection — defaults to `process.env`. */
  env?: NodeJS.ProcessEnv;
};

/**
 * Thrown when any prompt's `onCancel` fires (the user hit Ctrl-C). The outer
 * `runInit` translates this into exit code 130 and reports any sidecar files
 * that were already written before the abort.
 */
export class WizardAbortedError extends Error {
  constructor() {
    super("wizard aborted by user (Ctrl-C)");
    this.name = "WizardAbortedError";
  }
}

const defaultClaudeProbe: ClaudeProbe = () => {
  const result = spawnSync("claude", ["--version"], {
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
  if (result.error || result.status !== 0) {
    return { found: false };
  }
  const stdout = (result.stdout ?? "").trim();
  const version = stdout.split(/\s+/)[0] ?? "unknown";
  return { found: true, version };
};

const defaultPromptFn: PromptFn = (questions, options) =>
  promptsLib(
    questions as Parameters<typeof promptsLib>[0],
    options
  ) as Promise<Record<string, unknown>>;

/**
 * `prompts` calls this function when the user hits Ctrl-C. Returning `false`
 * here aborts the prompt loop — but `prompts` then resolves with an empty
 * object, which previous code treated as "user said no". Throwing instead
 * propagates the abort up to the `runInit` boundary where we can report
 * the partial state cleanly.
 */
function abortOnCancel(): boolean {
  throw new WizardAbortedError();
}

/**
 * List the hook basenames available in the package's bundled `configs/hooks/`
 * directory. Filtered to .js / .sh; READMEs and json examples skipped.
 */
function discoverHooks(repoRoot: string): readonly string[] {
  const dir = path.join(repoRoot, "configs", "hooks");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(?:js|sh)$/.test(name))
    .sort();
}

/**
 * Step 2 + step 3.5 + vault-path prompt: gather everything the user picked
 * before any file gets written. Throws `WizardAbortedError` if any prompt
 * is cancelled.
 *
 * Returns `null` if the user explicitly answered "no" to the continue gate
 * (a clean abort, exit code 1).
 */
async function collectChoices(args: {
  yes: boolean;
  promptFn: PromptFn;
  repoRoot: string;
}): Promise<WizardChoices | null> {
  const { yes, promptFn, repoRoot } = args;

  if (yes) {
    return {
      marketplaces: [
        "frontend-design@claude-plugins-official",
        "toprank@nowork-studio",
        "everything-claude-code@everything-claude-code",
      ],
      copyHooks: false,
      selectedHooks: [],
      vaultPath: "~/Brain",
    };
  }

  // Step 2 — marketplace selection.
  const marketplacesAnswer = await promptFn([marketplacePrompt], {
    onCancel: abortOnCancel,
  });
  const rawMarketplaces = marketplacesAnswer.marketplaces;
  if (!Array.isArray(rawMarketplaces)) {
    return null;
  }
  const marketplaces = rawMarketplaces.filter(
    (v): v is string => typeof v === "string",
  );

  const cont = await promptFn([continueConfirmPrompt], {
    onCancel: abortOnCancel,
  });
  if (cont.continue !== true) {
    return null;
  }

  // Step 3.5 — hooks (always opt-in, even after the gate).
  const hooksAnswer = await promptFn([copyHooksPrompt], {
    onCancel: abortOnCancel,
  });
  const copyHooks = hooksAnswer.copyHooks === true;
  let selectedHooks: readonly string[] = [];
  if (copyHooks) {
    const hooks = discoverHooks(repoRoot);
    if (hooks.length === 0) {
      warn("no hooks found in configs/hooks/ — skipping");
    } else {
      const pick = await promptFn([buildHooksMultiselectPrompt(hooks)], {
        onCancel: abortOnCancel,
      });
      const sel = pick.selectedHooks;
      selectedHooks = Array.isArray(sel)
        ? sel.filter((s): s is string => typeof s === "string")
        : [];
    }
  }

  // Vault path prompt.
  const vaultAnswer = await promptFn([vaultPathPrompt], {
    onCancel: abortOnCancel,
  });
  const vaultPath =
    typeof vaultAnswer.vaultPath === "string" && vaultAnswer.vaultPath.length > 0
      ? vaultAnswer.vaultPath
      : "~/Brain";

  return { marketplaces, copyHooks, selectedHooks, vaultPath };
}

/**
 * Step 3: copy sidecar configs and (if asked) hooks. Pure-ish — all writes
 * go through `copyIfSafe`. Returns the list of destination paths that were
 * (or would be) written, in the same order as they ran.
 *
 * Throws on any unexpected fs error so the caller can translate to exit 3.
 */
function applyChoices(args: {
  choices: WizardChoices;
  repoRoot: string;
  claudeDir: string;
  dryRun: boolean;
  yes: boolean;
}): readonly string[] {
  const { choices, repoRoot, claudeDir, dryRun, yes } = args;
  const writes: string[] = [];

  // Settings + MCP — always sidecar.
  const settingsResult = copyIfSafe(
    path.join(repoRoot, "configs", "settings.json.example"),
    path.join(claudeDir, "settings.json"),
    { mode: "always-sidecar", dryRun },
  );
  process.stdout.write(`  ${describeCopy(settingsResult)}\n`);
  if ("dst" in settingsResult) writes.push(settingsResult.dst);

  const mcpResult = copyIfSafe(
    path.join(repoRoot, "configs", "mcp-servers.json.example"),
    path.join(claudeDir, "mcp-configs", "mcp-servers.json"),
    { mode: "always-sidecar", dryRun },
  );
  process.stdout.write(`  ${describeCopy(mcpResult)}\n`);
  if ("dst" in mcpResult) writes.push(mcpResult.dst);

  // Rules — additive.
  const rulesDir = path.join(repoRoot, "configs", "rules");
  if (fs.existsSync(rulesDir)) {
    for (const f of fs.readdirSync(rulesDir).sort()) {
      if (!f.endsWith(".md")) continue;
      const r = copyIfSafe(
        path.join(rulesDir, f),
        path.join(claudeDir, "rules", f),
        { mode: "additive", dryRun },
      );
      process.stdout.write(`  ${describeCopy(r)}\n`);
      if ("dst" in r) writes.push(r.dst);
    }
  }

  // Hooks — additive, opt-in.
  if (yes) {
    process.stdout.write(
      `  ${dim("--yes: hooks skipped (always opt-in, even with --yes)")}\n`,
    );
  } else if (choices.copyHooks) {
    for (const h of choices.selectedHooks) {
      const r = copyIfSafe(
        path.join(repoRoot, "configs", "hooks", h),
        path.join(claudeDir, "hooks", h),
        {
          mode: "additive",
          dryRun,
          chmod: h.endsWith(".sh") ? 0o755 : undefined,
        },
      );
      process.stdout.write(`  ${describeCopy(r)}\n`);
      if ("dst" in r) writes.push(r.dst);
    }
  }

  return writes;
}

function printNextSteps(args: {
  marketplaces: readonly string[];
  vaultPath: string;
  writes: readonly string[];
  dryRun: boolean;
}): void {
  const { marketplaces, vaultPath, writes, dryRun } = args;
  process.stdout.write("\n");
  say("Step 4/4 — next steps");
  process.stdout.write("\n");

  if (marketplaces.length > 0) {
    process.stdout.write(
      "After applying" +
        (dryRun ? " (without --dry-run)" : "") +
        ", open Claude Code and run:\n\n",
    );
    const marketplaceCmds: Record<string, string> = {
      "frontend-design@claude-plugins-official":
        "/plugin marketplace add anthropics/claude-plugins-official",
      "toprank@nowork-studio":
        "/plugin marketplace add nowork-studio/toprank",
      "everything-claude-code@everything-claude-code":
        "/plugin marketplace add affaan-m/everything-claude-code",
    };
    const installCmds: Record<string, string> = {
      "frontend-design@claude-plugins-official":
        "/plugin install frontend-design@claude-plugins-official",
      "toprank@nowork-studio":
        "/plugin install toprank@nowork-studio",
      "everything-claude-code@everything-claude-code":
        "/plugin install everything-claude-code@everything-claude-code",
    };
    for (const m of marketplaces) {
      const c = marketplaceCmds[m];
      if (c) process.stdout.write(`  ${c}\n`);
    }
    process.stdout.write("\n");
    for (const m of marketplaces) {
      const c = installCmds[m];
      if (c) process.stdout.write(`  ${c}\n`);
    }
    process.stdout.write("\n");
  }

  if (writes.length > 0) {
    process.stdout.write(
      dryRun ? "Files that would be written:\n" : "Files written:\n",
    );
    for (const w of writes) process.stdout.write(`  ${dim("·")} ${w}\n`);
    process.stdout.write("\n");
  }

  process.stdout.write(`Vault path recorded: ${vaultPath}\n`);
  process.stdout.write(
    "Next, run " + dim("npx claude-operator-stack verify") + " to confirm the install.\n\n",
  );

  if (dryRun) {
    ok("dry-run complete. No files were written.");
  } else {
    ok("done");
  }
}

function reportAbort(writes: readonly string[]): void {
  if (writes.length === 0) {
    die("Aborted.");
    return;
  }
  die(
    `Aborted. Sidecars written so far: ${writes.length} ` +
      `(review and remove from \`~/.claude/*.from-operator-stack\` if you want a clean retry).`,
  );
}

export async function runInit(opts: InitOpts = {}): Promise<number> {
  const dryRun = Boolean(opts.dryRun);
  const yes = Boolean(opts.yes);
  const promptFn = opts.promptFn ?? defaultPromptFn;
  const claudeProbe = opts.claudeProbe ?? defaultClaudeProbe;
  const repoRoot = opts.repoRoot ?? resolveRepoRoot();
  const env = opts.env ?? process.env;
  const claudeDir = resolveClaudeDir({ override: opts.claudeDirOverride, env });

  process.stdout.write(banner(VERSION, dryRun));

  // Step 1 — claude CLI check.
  say("Step 1/4 — checking Claude Code CLI");
  const probe = claudeProbe();
  if (!probe.found) {
    warn("claude CLI not found");
    process.stdout.write("\nInstall it first:\n");
    process.stdout.write("  npm install -g @anthropic-ai/claude-code\n\n");
    process.stdout.write("Then re-run this installer.\n");
    return 2;
  }
  ok(`claude CLI found (version ${probe.version})`);
  process.stdout.write("\n");

  // Step 2 + 3.5 — collect choices.
  say("Step 2/4 — marketplaces and plugins");
  process.stdout.write(
    [
      "",
      "The stack uses three marketplaces. Marketplace add and plugin install",
      "are interactive operations inside Claude Code itself — this CLI prints",
      "the commands you'll run, it does not execute them.",
      "",
    ].join("\n"),
  );

  let choices: WizardChoices | null;
  try {
    choices = await collectChoices({ yes, promptFn, repoRoot });
  } catch (err: unknown) {
    if (err instanceof WizardAbortedError) {
      reportAbort([]);
      return 130;
    }
    throw err;
  }
  if (choices === null) {
    die("aborted by user");
    return 1;
  }
  if (yes) {
    ok("--yes: selected all three marketplaces");
  }

  // Step 3 — copy sidecar configs.
  process.stdout.write("\n");
  say("Step 3/4 — copying configs as sidecars");
  process.stdout.write("\n");

  let writes: readonly string[] = [];
  try {
    writes = applyChoices({ choices, repoRoot, claudeDir, dryRun, yes });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    die(`filesystem error: ${msg}`);
    return 3;
  }

  // Resolve vault for the printout. `env` threaded through so tests can stub
  // HOME without touching `process.env`.
  const vaultPath = expandHome(choices.vaultPath, env);

  // Step 4 — next steps.
  printNextSteps({
    marketplaces: choices.marketplaces,
    vaultPath,
    writes,
    dryRun,
  });

  return 0;
}
