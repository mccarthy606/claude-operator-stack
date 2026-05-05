/**
 * Path resolution — keeps `~` / `${HOME}` / override logic in one tested place.
 *
 * Pure relative to its inputs: every function takes `env` as a parameter so
 * tests can inject a stub HOME without polluting `process.env`.
 */
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export type PathOptions = {
  /** Override for `~/.claude/` resolution. Used by `--claude-dir` and tests. */
  override?: string | undefined;
  /** Stubbed env for tests. Defaults to `process.env`. */
  env?: NodeJS.ProcessEnv;
};

/**
 * Expand `~` and `${HOME}` / `$HOME` at the start of a path. We only handle
 * the common shapes — the wizard never accepts arbitrary shell expressions.
 */
export function expandHome(p: string, env: NodeJS.ProcessEnv = process.env): string {
  const home = env.HOME ?? os.homedir();
  if (p === "~") return home;
  if (p.startsWith("~/")) return path.join(home, p.slice(2));
  if (p.startsWith("${HOME}/")) return path.join(home, p.slice("${HOME}/".length));
  if (p === "${HOME}") return home;
  if (p.startsWith("$HOME/")) return path.join(home, p.slice("$HOME/".length));
  if (p === "$HOME") return home;
  return p;
}

export function resolveClaudeDir(opts: PathOptions = {}): string {
  const env = opts.env ?? process.env;
  if (opts.override !== undefined) {
    return path.resolve(expandHome(opts.override, env));
  }
  const home = env.HOME ?? os.homedir();
  return path.join(home, ".claude");
}

/**
 * Resolve the package root (the directory that contains `configs/`).
 *
 * The CLI ships its own `configs/` snapshot inside the npm tarball — the build
 * pipeline (`tsup` `onSuccess`) copies the relevant repo-root templates into
 * `packages/cli/configs/` before publish, and `package.json` `files` includes
 * `configs/` so the directory survives `npm pack`.
 *
 * At runtime this function points at that bundled directory regardless of how
 * the bin was invoked — symlink (npm install -g), npx shim, direct
 * `node dist/cli.js`, or `tsx src/cli.ts` during local dev. No filesystem walk,
 * no dependence on the user's monorepo state.
 *
 * Layouts:
 *   • Built artefact:    `<pkg>/dist/cli.js`  → returns `<pkg>` (configs at `<pkg>/configs`)
 *   • Local dev (tsx):   `<pkg>/src/lib/paths.ts` → returns `<pkg>` via two-up
 *
 * The `startFromUrl` parameter exists purely for tests so they can inject a
 * fake module URL.
 */
export function resolveRepoRoot(startFromUrl: string = import.meta.url): string {
  const here = path.dirname(fileURLToPath(startFromUrl));
  // `here` is one of:
  //   <pkg>/dist               (bundled cli.js sits at <pkg>/dist/cli.js)
  //   <pkg>/src/lib            (paths.ts in source tree)
  //   <test-fake-root>/...     (test injection — return as-is, the test owns it)
  const baseName = path.basename(here);
  if (baseName === "dist") {
    return path.dirname(here);
  }
  if (baseName === "lib" && path.basename(path.dirname(here)) === "src") {
    return path.dirname(path.dirname(here));
  }
  // Fallback: the directory we started from. Tests that inject a custom URL
  // hit this branch and treat the start dir itself as the package root.
  return here;
}

/** `${dst}.from-operator-stack` — central so the suffix only appears once. */
export function sidecarFor(dst: string): string {
  return `${dst}.from-operator-stack`;
}
