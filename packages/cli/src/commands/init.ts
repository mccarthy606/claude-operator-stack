/**
 * `init` — interactive wizard. Mirrors `install.sh` 4-step structure.
 *
 * Exit codes:
 *   0  success (or dry-run completed)
 *   1  user aborted at confirm prompt
 *   2  `claude` CLI not found in PATH
 *   3  filesystem error
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
import type { ClaudeProbe, PromptFn } from "../types.js";

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
};

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
 * List the hook basenames available in `configs/hooks/` for the multiselect.
 * Filtered to .js / .sh; READMEs and json examples skipped.
 */
function discoverHooks(repoRoot: string): readonly string[] {
  const dir = path.join(repoRoot, "configs", "hooks");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(?:js|sh)$/.test(name))
    .sort();
}

function printNextSteps(
  marketplaces: readonly string[],
  vaultPath: string,
  writes: readonly string[],
  dryRun: boolean
): void {
  process.stdout.write("\n");
  say("Step 4/4 — next steps");
  process.stdout.write("\n");

  if (marketplaces.length > 0) {
    process.stdout.write(
      "After applying" +
        (dryRun ? " (without --dry-run)" : "") +
        ", open Claude Code and run:\n\n"
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
      (dryRun ? "Files that would be written:\n" : "Files written:\n")
    );
    for (const w of writes) process.stdout.write(`  ${dim("·")} ${w}\n`);
    process.stdout.write("\n");
  }

  process.stdout.write(`Vault path recorded: ${vaultPath}\n`);
  process.stdout.write(
    "Next, run " + dim("npx claude-operator-stack verify") + " to confirm the install.\n\n"
  );

  if (dryRun) {
    ok("dry-run complete. No files were written.");
  } else {
    ok("done");
  }
}

export async function runInit(opts: InitOpts = {}): Promise<number> {
  const dryRun = Boolean(opts.dryRun);
  const yes = Boolean(opts.yes);
  const promptFn = opts.promptFn ?? defaultPromptFn;
  const claudeProbe = opts.claudeProbe ?? defaultClaudeProbe;
  const repoRoot = opts.repoRoot ?? resolveRepoRoot();
  const claudeDir = resolveClaudeDir({ override: opts.claudeDirOverride });

  process.stdout.write(banner(VERSION, dryRun));

  // Step 1 — claude CLI check
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

  // Step 2 — marketplace selection
  say("Step 2/4 — marketplaces and plugins");
  process.stdout.write(
    [
      "",
      "The stack uses three marketplaces. Marketplace add and plugin install",
      "are interactive operations inside Claude Code itself — this CLI prints",
      "the commands you'll run, it does not execute them.",
      "",
    ].join("\n")
  );

  let selectedMarketplaces: readonly string[] = [];
  if (yes) {
    selectedMarketplaces = [
      "frontend-design@claude-plugins-official",
      "toprank@nowork-studio",
      "everything-claude-code@everything-claude-code",
    ];
    ok("--yes: selected all three marketplaces");
  } else {
    const answer = await promptFn([marketplacePrompt], {
      onCancel: () => true,
    });
    const marketplaces = answer.marketplaces;
    if (!Array.isArray(marketplaces)) {
      die("aborted by user");
      return 1;
    }
    selectedMarketplaces = marketplaces.filter(
      (v): v is string => typeof v === "string"
    );

    const cont = await promptFn([continueConfirmPrompt], {
      onCancel: () => true,
    });
    if (cont.continue !== true) {
      die("aborted by user");
      return 1;
    }
  }

  // Step 3 — copy sidecar configs
  process.stdout.write("\n");
  say("Step 3/4 — copying configs as sidecars");
  process.stdout.write("\n");

  const writes: string[] = [];

  // Settings + MCP — always sidecar
  try {
    const settingsResult = copyIfSafe(
      path.join(repoRoot, "configs", "settings.json.example"),
      path.join(claudeDir, "settings.json"),
      { mode: "always-sidecar", dryRun }
    );
    process.stdout.write(`  ${describeCopy(settingsResult)}\n`);
    if ("dst" in settingsResult) writes.push(settingsResult.dst);

    const mcpResult = copyIfSafe(
      path.join(repoRoot, "configs", "mcp-servers.json.example"),
      path.join(claudeDir, "mcp-configs", "mcp-servers.json"),
      { mode: "always-sidecar", dryRun }
    );
    process.stdout.write(`  ${describeCopy(mcpResult)}\n`);
    if ("dst" in mcpResult) writes.push(mcpResult.dst);

    // Rules — additive
    const rulesDir = path.join(repoRoot, "configs", "rules");
    if (fs.existsSync(rulesDir)) {
      for (const f of fs.readdirSync(rulesDir).sort()) {
        if (!f.endsWith(".md")) continue;
        const r = copyIfSafe(
          path.join(rulesDir, f),
          path.join(claudeDir, "rules", f),
          { mode: "additive", dryRun }
        );
        process.stdout.write(`  ${describeCopy(r)}\n`);
        if ("dst" in r) writes.push(r.dst);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    die(`filesystem error: ${msg}`);
    return 3;
  }

  // Hooks — opt-in even with --yes
  let copyHooks = false;
  let selectedHooks: readonly string[] = [];
  if (!yes) {
    const hooksAnswer = await promptFn([copyHooksPrompt], {
      onCancel: () => true,
    });
    copyHooks = hooksAnswer.copyHooks === true;
    if (copyHooks) {
      const hooks = discoverHooks(repoRoot);
      if (hooks.length === 0) {
        warn("no hooks found in configs/hooks/ — skipping");
      } else {
        const pick = await promptFn(
          [buildHooksMultiselectPrompt(hooks)],
          { onCancel: () => true }
        );
        const sel = pick.selectedHooks;
        selectedHooks = Array.isArray(sel)
          ? sel.filter((s): s is string => typeof s === "string")
          : [];
        for (const h of selectedHooks) {
          const r = copyIfSafe(
            path.join(repoRoot, "configs", "hooks", h),
            path.join(claudeDir, "hooks", h),
            {
              mode: "additive",
              dryRun,
              chmod: h.endsWith(".sh") ? 0o755 : undefined,
            }
          );
          process.stdout.write(`  ${describeCopy(r)}\n`);
          if ("dst" in r) writes.push(r.dst);
        }
      }
    }
  } else {
    process.stdout.write(
      `  ${dim("--yes: hooks skipped (always opt-in, even with --yes)")}\n`
    );
  }

  // Vault path
  let vaultPath = "~/Brain";
  if (!yes) {
    const vaultAnswer = await promptFn([vaultPathPrompt], {
      onCancel: () => true,
    });
    if (typeof vaultAnswer.vaultPath === "string" && vaultAnswer.vaultPath.length > 0) {
      vaultPath = vaultAnswer.vaultPath;
    }
  }
  // Resolve once for the printout so the user sees what was actually recorded.
  vaultPath = expandHome(vaultPath);

  // Step 4 — next steps
  printNextSteps(selectedMarketplaces, vaultPath, writes, dryRun);

  return 0;
}
