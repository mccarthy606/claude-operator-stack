import { defineConfig } from "tsup";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Stage `configs/` from the monorepo root into `packages/cli/configs/` so the
 * published tarball is self-sufficient. `npm pack` only ships from the package
 * directory and `files` does not support parent-relative paths, so we copy.
 *
 * Sources we ship:
 *   - settings.json.example
 *   - mcp-servers.json.example
 *   - rules/obsidian-integration.md   (the only rule installed by `init`)
 *   - hooks/*.{js,sh,json}            (init filters by extension at runtime)
 *
 * READMEs are dropped — users don't need them in their `~/.claude/`. Per-hook
 * .README.md files are dropped for the same reason.
 */
function stageConfigs(): void {
  const monorepoRoot = path.resolve(__dirname, "../..");
  const srcRoot = path.join(monorepoRoot, "configs");
  const dstRoot = path.join(__dirname, "configs");

  if (!fs.existsSync(srcRoot)) {
    // Local dev: no monorepo root configs/ — fail loudly so we don't ship empty.
    throw new Error(
      `tsup stageConfigs: monorepo configs/ not found at ${srcRoot}. ` +
        `Run from the monorepo, not from a checkout that excluded configs/.`,
    );
  }

  fs.rmSync(dstRoot, { recursive: true, force: true });
  fs.mkdirSync(dstRoot, { recursive: true });

  // Top-level templates
  copyIfExists(
    path.join(srcRoot, "settings.json.example"),
    path.join(dstRoot, "settings.json.example"),
  );
  copyIfExists(
    path.join(srcRoot, "mcp-servers.json.example"),
    path.join(dstRoot, "mcp-servers.json.example"),
  );

  // Rules — only obsidian-integration.md is part of the audited stack.
  const rulesSrc = path.join(srcRoot, "rules");
  const rulesDst = path.join(dstRoot, "rules");
  if (fs.existsSync(rulesSrc)) {
    fs.mkdirSync(rulesDst, { recursive: true });
    for (const f of fs.readdirSync(rulesSrc)) {
      if (!f.endsWith(".md")) continue;
      copyIfExists(path.join(rulesSrc, f), path.join(rulesDst, f));
    }
  }

  // Hooks — filter to .js / .sh / .json at copy time so we don't ship READMEs.
  const hooksSrc = path.join(srcRoot, "hooks");
  const hooksDst = path.join(dstRoot, "hooks");
  if (fs.existsSync(hooksSrc)) {
    fs.mkdirSync(hooksDst, { recursive: true });
    for (const f of fs.readdirSync(hooksSrc)) {
      if (!/\.(?:js|sh|json|json\.example)$/.test(f)) continue;
      // Skip per-hook README markdown.
      if (f.endsWith(".README.md")) continue;
      copyIfExists(path.join(hooksSrc, f), path.join(hooksDst, f));
    }
  }
}

function copyIfExists(src: string, dst: string): void {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

/**
 * Restore the `node:` prefix on built-in imports in the bundled artefact.
 *
 * tsup (via esbuild on `platform: "node"`) strips the prefix by default. The
 * source tree uses `node:fs`, `node:path`, etc. consistently and we want that
 * to survive into the artefact for clarity and to match Node's documented
 * preferred form for built-ins. esbuild's plugin layer doesn't expose enough
 * to override this cleanly, so we do a single regex sweep over the built file
 * after `tsup` finishes — the import lines are at the top and the pattern is
 * unambiguous.
 */
const NODE_BUILTINS: readonly string[] = [
  "assert",
  "buffer",
  "child_process",
  "crypto",
  "dns",
  "events",
  "fs",
  "fs/promises",
  "http",
  "https",
  "module",
  "net",
  "os",
  "path",
  "process",
  "querystring",
  "readline",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "worker_threads",
  "zlib",
];

function restoreNodePrefix(distFile: string): void {
  if (!fs.existsSync(distFile)) return;
  let src = fs.readFileSync(distFile, "utf8");
  for (const mod of NODE_BUILTINS) {
    // Match: from 'fs' or from "fs"  (single or double quotes), at import sites.
    const re = new RegExp(
      `(\\bfrom\\s+)(['"])${mod.replace(/\//g, "\\/")}\\2`,
      "g",
    );
    src = src.replace(re, `$1$2node:${mod}$2`);
  }
  fs.writeFileSync(distFile, src);
}

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  format: ["esm"],
  target: "node20",
  platform: "node",
  bundle: true,
  splitting: false,
  shims: false,
  clean: true,
  sourcemap: false,
  minify: false,
  dts: false,
  treeshake: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  outExtension() {
    return { js: ".js" };
  },
  async onSuccess() {
    restoreNodePrefix(path.join(__dirname, "dist", "cli.js"));
    stageConfigs();
  },
});
