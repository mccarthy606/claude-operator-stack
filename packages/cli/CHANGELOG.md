# Changelog

All notable changes to the `claude-operator-stack` npm package are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and the version aligns with the `version` field in `package.json` and `src/version.ts`.

## [Unreleased]

### Added

- Bundled `configs/` directory inside the published tarball so `init` is self-sufficient. The build pipeline (`tsup` `onSuccess`) stages `settings.json.example`, `mcp-servers.json.example`, `rules/obsidian-integration.md`, and the sanitized hook scripts from the monorepo root into `packages/cli/configs/` before pack.
- `lint` script and a minimal `eslint.config.js` extending `@eslint/js` recommended plus `typescript-eslint` recommended.
- `noUncheckedIndexedAccess` enabled in `tsconfig.json`. Index access now widens to `T | undefined` so the compiler catches `process.argv[1]` style bugs.
- `WizardAbortedError` plumbing in `init` — Ctrl-C through any prompt now throws and exits with code 130 instead of silently treating the cancel as "user said no".

### Changed

- `resolveRepoRoot()` resolves the package root from `import.meta.url` directly. The old "walk up looking for a `workspaces` field" was a leftover from the monorepo development environment and broke once the published tarball had no parent monorepo.
- `cli.ts` no longer compares `import.meta.url` to `process.argv[1]` to decide whether to call `main`. The check failed under symlinks (`npm install -g`, `npx`, macOS `/tmp`) and silently turned the bin into a no-op. The bin always runs `main`; tests import named exports (`buildProgram`, `main`) and never reach the top-level call site. Set `COS_CLI_SKIP_MAIN=1` to opt out from a future test harness.
- `runInit` is split into `collectChoices`, `applyChoices`, and `printNextSteps` to honour the 50-line guideline and make each step independently testable.

### Fixed

- `node:` prefix preserved in the bundled `dist/cli.js` via `external: [/^node:/]` in `tsup.config.ts`. The source consistently uses `node:fs`, `node:path`, etc.; the bundle now matches.
- `expandHome(vaultPath)` in `init` now forwards the same `env` parameter the rest of the file threads through. The previous default-`process.env` call dropped the test injection point.

## [0.1.0] — 2026-05-05

### Added

- Initial CLI release with three commands:
  - `init` — interactive wizard that walks the four `install.sh` steps in `prompts` form. Detects the `claude` CLI, picks marketplaces, copies sanitized configs as sidecars, opt-in copy of custom hooks, records the Obsidian vault path, and prints the manual `/plugin marketplace add` and `/plugin install` commands.
  - `verify` — read-only audit of `~/.claude/`. Reports which stack components are wired and which are missing as a table or `--json`.
  - `list-stack` — static printout of the six components in the stack as a table or `--json`.
- `*.from-operator-stack` sidecar safety for `settings.json` and `mcp-servers.json` — the wizard never overwrites these silently.
- `--dry-run`, `--yes`, `--claude-dir`, `--no-color` flags.
- ESM-only build via `tsup` targeting Node 20 with a `#!/usr/bin/env node` shebang preserved on the bin file.
