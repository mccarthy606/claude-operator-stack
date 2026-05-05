/**
 * Safe-copy primitive used by `init`. The inviolable rule:
 *
 *   `~/.claude/settings.json` and `~/.claude/mcp-configs/mcp-servers.json`
 *   are NEVER overwritten silently. They go to a `*.from-operator-stack`
 *   sidecar regardless of whether the destination exists. The user diffs +
 *   merges by hand.
 *
 * Other files (rules, hooks) write directly when the destination is empty,
 * and fall back to sidecar if it already exists.
 *
 * `--dry-run` returns the same shape but performs no fs writes.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { sidecarFor } from "./paths.js";
import type { CopyResult } from "../types.js";

export type CopyMode =
  /** Settings + MCP files: always sidecar even if dst doesn't exist. */
  | "always-sidecar"
  /** Rules + hooks: direct unless dst exists, then sidecar. */
  | "additive";

export type CopyOpts = {
  mode: CopyMode;
  dryRun?: boolean;
  /** Permission bits to chmod the destination to (e.g. 0o755 for shell hooks). */
  chmod?: number;
  /**
   * Test-only override for the fs read/write side. Defaults to real fs.
   * Kept narrow so tests don't have to mock out node:fs entirely.
   */
  fsImpl?: {
    existsSync: (p: string) => boolean;
    mkdirSync: (p: string, opts: { recursive: true }) => void;
    copyFileSync: (src: string, dst: string) => void;
    chmodSync: (p: string, mode: number) => void;
  };
};

const realFs = {
  existsSync: fs.existsSync,
  mkdirSync: (p: string, opts: { recursive: true }) =>
    void fs.mkdirSync(p, opts),
  copyFileSync: fs.copyFileSync,
  chmodSync: fs.chmodSync,
};

export function copyIfSafe(
  src: string,
  dst: string,
  opts: CopyOpts
): CopyResult {
  const f = opts.fsImpl ?? realFs;

  if (!f.existsSync(src)) {
    return { action: "missing-source", src };
  }

  // `always-sidecar` is the load-bearing safety bit for settings + mcp-servers.
  if (opts.mode === "always-sidecar") {
    const sidecar = sidecarFor(dst);
    if (opts.dryRun) {
      return { action: "would-write-sidecar", dst: sidecar };
    }
    f.mkdirSync(path.dirname(sidecar), { recursive: true });
    f.copyFileSync(src, sidecar);
    if (opts.chmod !== undefined) f.chmodSync(sidecar, opts.chmod);
    return { action: "wrote-sidecar", dst: sidecar };
  }

  // additive: prefer direct write; fall back to sidecar if dst exists.
  if (f.existsSync(dst)) {
    const sidecar = sidecarFor(dst);
    if (opts.dryRun) {
      return { action: "would-write-sidecar", dst: sidecar };
    }
    f.mkdirSync(path.dirname(sidecar), { recursive: true });
    f.copyFileSync(src, sidecar);
    if (opts.chmod !== undefined) f.chmodSync(sidecar, opts.chmod);
    return { action: "wrote-sidecar", dst: sidecar };
  }

  if (opts.dryRun) {
    return { action: "would-write", dst };
  }
  f.mkdirSync(path.dirname(dst), { recursive: true });
  f.copyFileSync(src, dst);
  if (opts.chmod !== undefined) f.chmodSync(dst, opts.chmod);
  return { action: "wrote", dst };
}

/**
 * Format a CopyResult for stdout. Pure — used by `init` after each call.
 */
export function describeCopy(r: CopyResult): string {
  switch (r.action) {
    case "missing-source":
      return `missing source: ${r.src} — skipped`;
    case "would-write":
      return `would write ${r.dst}`;
    case "would-write-sidecar":
      return `would write sidecar ${r.dst}`;
    case "wrote":
      return `wrote ${r.dst}`;
    case "wrote-sidecar":
      return `wrote sidecar ${r.dst} (existing file kept)`;
  }
}
