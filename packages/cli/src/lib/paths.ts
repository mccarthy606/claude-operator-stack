/**
 * Path resolution — keeps `~` / `${HOME}` / override logic in one tested place.
 *
 * Pure relative to its inputs: every function takes `env` as a parameter so
 * tests can inject a stub HOME without polluting `process.env`.
 */
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";

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
 * Walk up from this module's URL until we find a `package.json` with a
 * `workspaces` array — that's the monorepo root, which is also where
 * `configs/` lives.
 */
export function resolveRepoRoot(startFromUrl: string = import.meta.url): string {
  let dir = path.dirname(fileURLToPath(startFromUrl));
  // Hard cap on walks so a misplaced binary never spins forever.
  for (let i = 0; i < 12; i++) {
    const candidate = path.join(dir, "package.json");
    if (fs.existsSync(candidate)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(candidate, "utf8")) as Record<string, unknown>;
        if (Array.isArray(pkg.workspaces)) return dir;
      } catch {
        // ignore parse errors — keep walking
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: the directory we started from. The caller treats missing source
  // files as a soft warning, so we never hard-fail here.
  return path.dirname(fileURLToPath(startFromUrl));
}

/** `${dst}.from-operator-stack` — central so the suffix only appears once. */
export function sidecarFor(dst: string): string {
  return `${dst}.from-operator-stack`;
}
