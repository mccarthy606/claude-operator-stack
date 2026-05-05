/**
 * Single source of truth for the CLI version printed in banners and `--version`.
 *
 * Kept as a constant rather than read from package.json at runtime so the bundled
 * binary has zero runtime fs reads for self-introspection.
 *
 * IMPORTANT: keep this in sync with `packages/cli/package.json` `version` field.
 * Bumping one without the other is a release-blocker.
 */
export const VERSION = "0.1.0" as const;
