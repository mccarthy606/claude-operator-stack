/**
 * Shared types across the claude-operator-stack CLI.
 *
 * Intentionally narrow — only the shapes that cross module boundaries.
 */

/**
 * One row of the curated stack. The list lives in `lib/stack.ts` and is
 * cross-referenced against `stack/README.md` (the human-facing single source
 * of truth). `tests/stack.test.ts` snapshot-asserts shape and length so drift
 * is loud.
 */
export type StackComponent =
  | {
      readonly id: string;
      readonly name: string;
      readonly layer: string;
      readonly author: string;
      readonly repo: string;
      readonly kind: "plugin";
      /** Key under `settings.enabledPlugins` we expect to see set to `true`. */
      readonly pluginKey: string;
    }
  | {
      readonly id: string;
      readonly name: string;
      readonly layer: string;
      readonly author: string;
      readonly repo: string;
      readonly kind: "file";
      /** Path relative to `~/.claude/` we check for presence. */
      readonly relPath: string;
    }
  | {
      readonly id: string;
      readonly name: string;
      readonly layer: string;
      readonly author: string;
      readonly repo: string;
      readonly kind: "optional";
      readonly note: string;
    };

/**
 * One row in the verify report. Status is fully determined by `audit()` from
 * a `(stack, settings, fileExists)` tuple — no fs / network in the audit logic.
 */
export type AuditRow = {
  readonly id: string;
  readonly name: string;
  readonly status: "enabled" | "missing" | "present" | "skipped";
  readonly source: "enabledPlugins" | "filesystem" | "opt-in";
  readonly notes: string;
};

/**
 * Aggregated verify result printed at the bottom and emitted as `--json`.
 */
export type AuditSummary = {
  readonly wired: number;
  readonly missing: number;
  readonly skipped: number;
};

export type AuditReport = {
  readonly rows: readonly AuditRow[];
  readonly summary: AuditSummary;
};

/**
 * Frozen-snapshot of wizard answers used by `init`. Pulled out of the prompt
 * stack into a single value so `--yes` / `--dry-run` can construct it without
 * touching `prompts`.
 */
export type WizardChoices = {
  readonly marketplaces: readonly string[];
  readonly copyHooks: boolean;
  readonly selectedHooks: readonly string[];
  readonly vaultPath: string;
};

/**
 * Test-time injection point for `init` — the real implementation passes the
 * `prompts` library; tests pass canned answers. Async to match `prompts`'s
 * signature.
 */
export type PromptFn = (
  questions: unknown,
  options?: { onCancel?: () => boolean }
) => Promise<Record<string, unknown>>;

/**
 * Test-time injection point for child-process detection of the `claude` CLI.
 * Returns `null` if the binary is missing.
 */
export type ClaudeProbe = () => { found: false } | { found: true; version: string };

/**
 * Result of a single `copyIfSafe` operation — exhaustively enumerated so the
 * caller can format the right line without re-reading the filesystem.
 */
export type CopyResult =
  | { readonly action: "missing-source"; readonly src: string }
  | { readonly action: "would-write"; readonly dst: string }
  | { readonly action: "wrote"; readonly dst: string }
  | { readonly action: "would-write-sidecar"; readonly dst: string }
  | { readonly action: "wrote-sidecar"; readonly dst: string };
