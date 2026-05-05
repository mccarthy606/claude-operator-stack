# Security review v2 — opus 4.7

**Date:** 2026-05-05
**Scope:** Pre-flip security audit. Regression check on v1 findings + full coverage of new surfaces (`packages/cli/`, 6 own skills, animated hero SVG, reframe, graphify rename, `uv.lock`).
**Baseline:** v1 GO (0C/0H/3M/6L), all closed in 368abb2 + 24d5eb7.

## Summary

- Files reviewed: 190 committed (full repo) plus the 4-file npm tarball (`npm pack --dry-run`)
- Findings: **CRITICAL 0 · HIGH 0 · MEDIUM 1 · LOW 4**
- Verdict: **GO** — flip is safe. No regressions on the three v1 MEDIUMs (all three remain closed). The single new MEDIUM (M1 below) is the same operator-trade-off the v1 review already discussed: the operator deliberately exempts `.planning/` from sanitisation so the build process is transparent, and the absolute paths inside `.planning/` are entirely the operator's own home tree. The four new LOWs are polish items for v1.1, not flip blockers.

The repo is genuinely well-disciplined for a public flip. The new `packages/cli/` is the largest new attack surface and it ships clean: pure-stdlib + commander/prompts/picocolors, one well-scoped `spawnSync("claude", ["--version"])`, no `eval`, no dynamic require, every fs operation gated through a tested `copyIfSafe()` with the `always-sidecar` invariant for settings + mcp-servers. The 6 own skills under `skills/*/SKILL.md` are pure prompt artefacts — they instruct Claude to do confirmation-gated, read-mostly work and explicitly forbid auto-write, auto-anonymise without grep, and silent vault edits. The animated hero SVG uses generic project names (marketplace, saas-kit, pipeline). The graphify replacement of OMEGA touched config examples and stack docs without introducing any new credential surface.

## Pre-flip checklist

- [x] No real secrets in any committed file (verified across 11 secret-pattern regexes — 0 hits)
- [x] No de-anonymisation vectors beyond what operator approved (M1 documents the one operator-known trade-off, and v1's M1 — the niche-booking-trio softening — has held)
- [x] `packages/cli/` safe to publish (`npm pack --dry-run` shows exactly 4 files: LICENSE, README, dist/cli.js, package.json — no tests, no fixtures, no src, no coverage, no .tsbuildinfo)
- [x] `install.sh` sidecar safety preserved (diff vs v1 closure adds two extra `confirm()` prompts and a printed plan; no new write paths, no new injection surface, sidecar discipline intact bit-for-bit)
- [x] `configs/*.example` use placeholders only (every credential is `${VAR}` or a `<placeholder-text-here>` marker)
- [x] Skills don't instruct dangerous Claude actions (every skill has explicit "do not auto-write" / "require explicit confirmation" / "produce candidate, not commit" guards; no skill phones home, no skill bypasses the operator)
- [x] Hooks don't phone home / overwrite without consent (unchanged from v1; same six hooks, no new ones, no diff in hook scripts)

## Regression check matrix

| v1 finding | Where | Status (post-368abb2 + 24d5eb7 + d7eb84b + 59c037d + c883ddf + 1466ed2) |
|---|---|---|
| **M1** Discipline names triangulating to operator brands | `case-studies/niche-booking-trio.md` 11-19 | **OK** — file now uses `Discipline A/B/C` aliases (lines 15-17). No reference to drift-school / drift-taxi / track-days remains anywhere in the public-facing repo. |
| **M2** HTML parse_mode w/ unescaped user input | `cookbook/09-telegram-bot-leads-v0.md` 50-79 | **OK** — recipe now sends plain text (`{ chat_id, text }` only), no `parse_mode`. Both Next.js (lines 50-79) and FastAPI (lines 81-102) examples are clean. |
| **M3** No rate limiting / no CSP on lead route | `scaffolds/web-saas/app/api/lead/route.ts` + `next.config.ts` | **OK** — `lib/rate-limit.ts` token-bucket added; `route.ts` lines 77-87 enforce `lead:${ip}` 10/60s with a 429 + Retry-After. `next.config.ts` lines 27-42 ship a tuned CSP (Next + GA4 + Sentry origins explicitly allow-listed; `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`). |
| **L1** GA4 secret in URL query | `cookbook/05-ga4-cloudflare-analytics.md` | OK — same recipe; not a regression vector. Carry forward as L (Google's design). |
| **L2** Temp-file race window | `configs/hooks/statusline.js` 51-54 | OK — same hook, line 48 still validates session ID against `[/\\]|\.\./`. Comment now explicitly notes the race-window trade-off (line 53). |
| **L3** Bare exception swallow | `scaffolds/whatsapp-saas/app/webhook.py` 116-124 | OK — closed in `REVIEW-python-v2.md` (separate review). Out of scope here. |
| **L4** `curl \| install` w/o checksum | `cookbook/04-cloudflare-argo-local-dev.md` | OK — same recipe; not a regression vector. Carry forward as L. |
| **L5** Filesystem MCP scope | `configs/mcp-servers.json.example` 47 | OK — `_comment` warning in lines 47-48 is now explicit ("grants read/write across the entire path…narrow before enabling on a machine with production secrets"). Stronger than v1. |
| **L6** `claude --version` parser | `install.sh` 80-83 | OK — same script; comment now states the cosmetic-only nature explicitly (lines 80-82). |

**All v1 MEDIUMs and LOWs that should have closed have closed. None regressed.**

## New findings

### CRITICAL

None.

### HIGH

None.

### MEDIUM

#### M1 (v2). Operator absolute paths repeated 55× across `.planning/` files

- **Files:** `.planning/milestones/M2-v1-public-launch/REVIEW-code.md` (26 hits), `.planning/phases/P8.1-hero-animated/PLAN.md` (28 hits), `.planning/milestones/M2-v1-public-launch/launch-surfaces/checklist.md` (1 hit). Total 55 occurrences of `/Users/mccarthy606/Projects/claude-operator-stack/...`.
- **What:** The committed planning files use absolute paths from the operator's macOS user account. Anyone reading `.planning/` learns: (a) operator's macOS short username is `mccarthy606`, (b) operator stores projects under `~/Projects/`. Both are inferable from the GitHub handle and `mccarthy606` clone URLs already in the public README, but the absolute path makes it explicit and machine-greppable.
- **Why MEDIUM not HIGH:** the operator's own pre-flip `checklist.md` (line 16) shows this is a *known and accepted* trade-off — the sanitisation grep is `(/Users/mccarthy606/(?!Projects/claude-operator-stack)|<real-product-name>|<real-url>)`, deliberately allowing `/Users/mccarthy606/Projects/claude-operator-stack/...` paths because those are within the project tree. The operator's stated reason: showing how the project was built, including absolute review paths, is part of the public artefact's transparency value. No secret, no PII, no credential is exposed.
- **Why still MEDIUM:** the matrix `.planning/` exposes is greater than what `mccarthy606`-the-handle leaks alone. A reader hostile to the operator's anonymity gets confirmation that the GitHub handle equals the macOS short username, which strengthens any future correlation attack across other surfaces that use one of those identifiers.
- **Suggested fix (optional):** for v1.1, post-process the `.planning/` files on commit to strip the absolute prefix to a relative path (e.g., `cookbook/01-claude-code-from-zero.md` instead of the absolute form). Or: add `.planning/` to `.gitignore` outright and ship only `RETRO.md` and `ROADMAP.md` after the launch wave. Either fix preserves the transparency goal while shrinking the leak surface. **Not a flip blocker** — operator has already weighed and accepted this.

### LOW

#### L1 (v2). `stack/graphify.md` ships two `<!-- TODO upstream URL -->` placeholder comments on a public-facing component page

- **File:** `stack/graphify.md` lines 3 and 62.
- **What:** Two visible HTML comments mark missing upstream URLs for the graphify install path. They render as comments (invisible in the rendered markdown) but the raw markdown a reader fetches via `gh repo clone` shows them.
- **Why LOW:** not a security issue per se; just signals the artefact ships incomplete on a component the README treats as core. A reader wanting to install graphify hits a dead end at the install step.
- **Suggested fix:** either point at a real upstream (or the operator's own gist / private package) before flip, or restate the line as "graphify is not publicly distributed yet — this stack documents the trigger and integration shape; the install layer ships separately."

#### L2 (v2). `case-study-anonymiser` skill cites a regex set that misses GitHub PAT shapes and Telegram bot tokens

- **File:** `skills/case-study-anonymiser/SKILL.md` step 3 (line 34).
- **What:** The skill enumerates `sk-[A-Za-z0-9]{20,}`, `pk_[a-zA-Z0-9_]{20,}`, `AIA[A-Za-z0-9]{30,}`, and bearer tokens. It does not list `ghp_`, `gho_`, `ghu_`, `github_pat_`, the Telegram bot shape `\d{8,10}:[A-Za-z0-9_-]{30,}`, or modern OpenAI shapes (`sk-proj-`).
- **Why LOW:** the skill's final paranoia grep is against a user-provided "known-real identifier set" anyway, so a missing pattern in the heuristic strip-step is recoverable. But the skill is meant to be a credible anonymisation playbook; the documented regex list is the visible quality bar.
- **Suggested fix:** expand the regex list in step 3 to cover modern token shapes. 5-line diff to that one section.

#### L3 (v2). `multi-project-context-bridge` reads `.anonymisation-map.local` if present without warning the operator the file MUST be in `.gitignore`

- **File:** `skills/multi-project-context-bridge/SKILL.md` "Inputs" line ("If a `.anonymisation-map.local` file exists at the repo root (gitignored), read it.")
- **What:** The skill mentions `(gitignored)` parenthetically but does not surface a hard verification step. A user who creates the file and forgets to add `.anonymisation-map.local` to `.gitignore` could accidentally commit the alias map (which contains real names mapped to aliases — the most sensitive artefact in the anonymisation discipline).
- **Why LOW:** the skill itself is read-only; the risk is on the operator's discipline. But the skill is a teaching artefact and the parenthetical is easy to miss.
- **Suggested fix:** make step 1 of the skill flow be "verify `.anonymisation-map.local` is in `.gitignore`; refuse to read otherwise." 3-line addition.

#### L4 (v2). `packages/cli/dist/cli.js` is a bundled artefact published to npm, but the source map is not stripped or shipped

- **File:** `packages/cli/dist/cli.js` (built from `tsup`, 23.4 kB unminified, 702 lines).
- **What:** The compiled `dist/cli.js` is human-readable JS — no minification, no `.js.map`. Variable names from the source are preserved (`copyIfSafe`, `resolveClaudeDir`, etc.). The `.npmignore` excludes `coverage/`, `tsconfig.json`, etc. but does not include a sourcemap.
- **Why LOW:** keeping the dist readable is actually good for an installer-class CLI (auditability) — a publisher who wants to confirm the npm tarball matches the public source can `diff` directly. But it means `npm publish` ships a copy that includes the test-injection hooks (`fsImpl?`, `promptFn?`, `claudeProbe?`) and dev-only branches in tree-shake form. Not a security issue; just larger-than-needed surface for end users to read.
- **Suggested fix (optional):** consider `tsup --minify` for v1.1 if package size matters. For v1.0, the 9.1 kB tarball is already tiny — no urgency.

## Specific checks performed

### Secret-pattern grep

11 regexes run via `git ls-files -z | xargs -0 grep -lE` against the **committed** file set (190 files, excluding gitignored `.venv/`, `__pycache__/`, `.ruff_cache/`, `node_modules/`, `dist/`, `coverage/`):

| Pattern | Hits |
|---|---|
| `sk-ant-(api\|admin)[a-zA-Z0-9_-]{20,}` (Anthropic real key) | 0 |
| `sk-proj-[A-Za-z0-9]{20,}` (OpenAI project key) | 0 |
| `AIza[0-9A-Za-z_-]{30,}` (Google API key) | 0 |
| `ghp_[A-Za-z0-9]{30,}` / `gho_` / `ghu_` / `github_pat_` (GitHub) | 0 |
| `sk_live_[A-Za-z0-9]{20,}` / `pk_live_` / `rk_live_` (Stripe live) | 0 |
| `[0-9]{9,10}:[A-Za-z0-9_-]{30,}` (Telegram bot token) | 0 |
| `-----BEGIN [A-Z ]*PRIVATE KEY-----` (PEM/SSH/RSA private key) | 0 |
| `ya29\.[A-Za-z0-9_-]{20,}` (Google OAuth token) | 0 |
| `eyJ[A-Z0-9_-]{20,}\.[A-Z0-9_-]{20,}\.[A-Z0-9_-]{20,}` (JWT 3-part) | 0 |
| `https?://[^/]+:[^@]+@` (DSN with embedded creds) | 0 |
| Test fixtures in `tests/test_webhook.py` (`sk-ant-test`, `test-app-secret`) | 1 file — clearly fake (`monkeypatch.setenv` only) |

**Result: zero real secrets across 190 committed files.**

### De-anonymisation grep

Patterns run against all committed markdown:

| Pattern | Hits in public-facing files | Hits in `.planning/` only |
|---|---|---|
| `rarento`, `multas-?argentina`, `autodealer`, `racing-?rental`, `maji97`, `UREMONT`, `cartronic`, `BOX3D`, `level[ -]?performance` | 0 (one false positive in `README.es.md` — Spanish noun "multas" meaning "traffic fines", not the brand "MultasArgentina"; full sentence: "AI Legal Tool — apelación de multas con AI") | 0 |
| `drift[ -]?taxi`, `drift[ -]?school`, `track[ -]?days` | 0 — v1's M1 close holds; case-studies/niche-booking-trio.md uses Discipline A/B/C aliases | 0 |
| `dimana`, `dimana503`, `leonardo[ -]?fer`, `lionell`, `mariano`, `Дмитрий`, `Лионелл`, `Леонардо` | 0 | 1 file (`REVIEW-security.md` line 88) — the v1 review's own meta-statement that the operator's email is "not in the repo at all" — quoting the email is part of the audit log |
| `/Users/mccarthy606` | 0 | 55 hits across 3 planning files — see M1 above |
| `dimana503@gmail.com` | 0 | 1 mention in v1 REVIEW-security.md |

**Public-facing zone is clean. Planning zone is operator-acknowledged trade-off (M1).**

### `packages/cli/` inspection

- **Bundled file count:** 4 (LICENSE, README.md, dist/cli.js, package.json) per `npm pack --dry-run`. No tests, fixtures, or build configs ship.
- **`files` field in package.json:** `["dist", "README.md", "LICENSE", "CHANGELOG.md"]` — strict allow-list. The ".npmignore" file is also present as a defense-in-depth (excludes `src/`, `tests/`, `coverage/`, `*.tgz`, etc.).
- **Bin script:** `dist/cli.js` line 1 = `#!/usr/bin/env node`. Set executable by `tsup`. No imports of unsafe modules. No `child_process.exec`; only `child_process.spawnSync("claude", ["--version"], { stdio: ["ignore", "pipe", "pipe"] })` — safe (array form, no shell, hardcoded args, hardcoded binary name).
- **Dependency surface:** runtime deps are `commander@^12.1.0`, `picocolors@^1.0.1`, `prompts@^2.4.2`. All three are widely-used, well-maintained, no known CVEs at this version. Dev deps include vitest, tsup, tsx — none ship.
- **Fs writes:** every fs operation in the CLI flows through `copyIfSafe()` which always either (a) writes to a `.from-operator-stack` sidecar when `mode === "always-sidecar"`, or (b) checks `dst` existence and falls back to sidecar in `additive` mode. The two settings/mcp files are `always-sidecar`; rules and hooks are `additive`. The wizard never writes outside `~/.claude/` (modulo `--claude-dir <override>` which is intentional test injection).
- **Path expansion:** `expandHome()` only handles `~`, `~/`, `${HOME}`, `${HOME}/`, `$HOME`, `$HOME/` — does not invoke a shell, does not parse arbitrary `${VAR}` references. The wizard prompts for `vaultPath` and runs it through the same expansion before printing — no shell injection.
- **Test-injection points:** `claudeProbe`, `promptFn`, `claudeDirOverride`, `repoRoot`, `fsImpl` are all explicit dependency-injection seams used by tests. None of them are reachable from CLI flags except `--claude-dir` (which is a path the user owns) and `--dry-run` / `--yes` (booleans). Sound.
- **Test fixtures (3 files in `tests/fixtures/`):** all contain literal placeholder JSON; the largest hits are `"frontend-design@claude-plugins-official": true` — a public marketplace identifier. No secrets.

### `skills/` inspection

Six SKILL.md files reviewed in full:

| Skill | Dangerous instruction? | Vault auto-write? | Network egress? |
|---|---|---|---|
| `case-study-anonymiser` | None — explicit "Do not auto-write the redacted draft over the original file" anti-pattern | None — produces candidate, not commit | None |
| `multi-project-context-bridge` | None — "Read-only by default; require explicit confirmation"; "Do not auto-write the bridge into the target project's note" | None | None — uses graphify which is local |
| `obsidian-sync-helper` | None — "Read-first by default"; `--write` requires per-edit confirmation | None — read-only default | None |
| `ship-day-planner` | None — "Read-only by default; require explicit confirmation. Do not auto-create the project note without confirmation" | None | None |
| `solo-billing-monitor` | None — "Do not auto-investigate flagged lines"; "Do not chain into a 'let me also pull current numbers from Vercel for you' tangent" | None — explicit ask before writing rollup | None — number collection is operator's job |
| `weekly-monday-review` | None — "Do not auto-write status fields without per-project confirmation"; "Do not pick more than 2 focus projects" | None — proposal, not commit | None |

**All six skills are read-mostly with explicit confirmation gates on every write path. No skill instructs Claude to phone home, upload data to third parties without operator acknowledgement, or anonymise without the safety checks (`case-study-anonymiser` itself enforces the final paranoia grep).**

L2 (above) flags one quality gap in the regex enumeration of `case-study-anonymiser`; L3 flags a missing gitignore-verification step in `multi-project-context-bridge`. Neither is a flip blocker.

### `install.sh` review (post-reframe)

Diff vs v1 closure: two new `confirm()` prompts (ECC and Toprank intent), reformatted step-2 copy, printed plan summary at step-4. No new fs writes, no new injection surface, no new network egress.

- **Sidecar safety preserved:** lines 178-181 still copy to `*.from-operator-stack`. Check `copy_if_safe()` (lines 160-176) — unchanged from v1.
- **`--yes` still narrow:** the new ECC/Toprank prompts also bow to `ASSUME_YES=1` (via `confirm()` line 37-39), but the only thing they affect is a printed plan string, not any actual install action. The actual `/plugin install` runs interactively in Claude Code, not from this script.
- **Path-injection safety preserved:** `REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"` (line 57), `CLAUDE_DIR="$HOME/.claude"` (line 58), all subsequent file operations use these absolute paths with proper quoting. No user input flows into a path.
- **Variable interpolation in heredoc (line 213-214):** `$( [ "$INSTALL_ECC" -eq 1 ] && echo install || echo skip )` — safe (literal echo, no user input).
- **No new `curl`, no new `sudo`, no new `rm`.** Verified by `grep -E '(curl|wget|sudo|rm[[:space:]])' install.sh` — only the existing pre-existing line that documents `npm install -g @anthropic-ai/claude-code` (which is a printed instruction, not an executed one).

### `configs/settings.json.example`

The `_disabled_*` opt-in pattern is safe:

- Keys with the `_disabled_` prefix do not match any real plugin key, so Claude Code's `enabledPlugins` parser will not treat them as enabled. Verified by `audit.ts` `isPluginEnabled()` (line 28) which strict-matches the plugin key string with no prefix-stripping.
- Values are descriptive strings (e.g. `"set to true after /plugin install ..."`), not boolean `true`. Even a lenient parser that stripped the `_disabled_` prefix would see the value `"set to true after..."`, which is truthy in JS but is checked against `=== true` in `audit.ts` line 35 — so it would still register as missing, not enabled.
- One real plugin enabled by default: `frontend-design@claude-plugins-official`. The other two are commented out via the prefix pattern.

### `configs/mcp-servers.json.example`

Every credential is `${VAR}` substitution or `YOUR_*_HERE` placeholder. The graphify entry (lines 57-61) has no surprising flags — `command: "graphify"`, `args: ["--mcp"]`, no auto-expose. The `_comment` on the filesystem MCP (line 47-48) is now stronger than v1 (explicit warning about read/write scope on a machine with production secrets).

### `.env.example` files in scaffolds

Both `web-saas/.env.example` and `whatsapp-saas/.env.example` use only placeholders:

- `WA_VERIFY_TOKEN=<random-string-you-choose>`, `WA_APP_SECRET=<meta-app-secret>`, etc. (whatsapp-saas)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>`, `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`, `SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project-id>` (web-saas)

Telegram pair is intentionally blank (`TELEGRAM_BOT_TOKEN=`, `TELEGRAM_CHAT_ID=`) so the route degrades gracefully when the operator hasn't set up Telegram yet — confirmed by `route.ts` line 51-53 (`if (!token || !chatId) return;`).

### `assets/screenshots/*.svg`

- `obsidian-vault.svg` — uses generic project names ("Niche Booking Trio.md", "P2P Marketplace.md", "WhatsApp B2B SaaS.md", "AI Legal Tool.md", "YouTube Pipeline.md", "Jarvis Workspace.md", "Internal Ops.md"). No real brand names. The `repo:` line uses `github.com/<owner>/whatsapp-saas` — properly templated.
- `claude-reads-note.svg` — generic "WhatsApp B2B SaaS" project, no operator-specific identifiers.
- `install-dryrun.svg` — terminal output with public marketplace commands (`anthropics/claude-plugins-official`, `nowork-studio/toprank`). No operator paths.
- `assets/hero.svg` — animated hero. Tree shows generic `marketplace.md`, `saas-kit.md`, `pipeline.md`. No real brand names. The `~/Projects/` prefix is present but generic.

The `assets/screenshots/README.md` (line 60) explicitly states the privacy rule: "use the generic labels: Niche Booking Trio, P2P Marketplace, etc." — discipline matches output.

### GitHub Actions / workflows

`.github/workflows/` directory is empty (no `.yml` files committed). No CI secrets surface. Out of scope.

### Hooks (`configs/hooks/*`)

Same six hooks as v1; no diff in the `.js` / `.sh` files since the v1 closure commit. Re-verified:

| Hook | Network? | RCE? | FS scope | Self-disable? |
|---|---|---|---|---|
| `prompt-injection-guard.js` | NONE | none — pure regex over JSON stdin | none (read-only) | 3s stdin timeout, exits 0 on any failure |
| `read-injection-scanner.js` | NONE | none | none (read-only) | 5s stdin timeout, advisory-only |
| `read-before-edit.js` | NONE | none | reads target with `fs.accessSync` only | auto-disables under Claude Code |
| `validate-commit-message.sh` | NONE | none — `node -e` for JSON parsing only, then `[[ =~ ]]` | none | hard-blocks via `exit 2` on violation |
| `statusline.js` | NONE | none | writes `os.tmpdir()/claude-ctx-${session}.json` only | session ID validated against `[/\\]\|\.\./` |
| `context-monitor.js` | NONE | none | reads/writes only inside `os.tmpdir()` | same session-ID validation |

**Zero phone-home, zero `eval` / `Function()`, zero spawn / exec, no privileged operations, all fail-silently to `exit 0` on any error. No regression.**

### `scaffolds/whatsapp-saas/uv.lock` (new in 1466ed2)

Reviewed. The lock file pins specific package versions (anthropic, fastapi, supabase, etc.). It contains:
- No secrets (only hashes and version pins)
- No personal paths (the `name = "whatsapp-saas"` is the scaffold's own name)
- Standard hash lines from PyPI

Committing the lock file is the right discipline for reproducibility. No security concern.

## Threat model summary (delta vs v1)

The biggest new attack surface in this round is `packages/cli/`. Its threat model is the same shape as `install.sh` was in v1: a user clones the repo (or runs `npx claude-operator-stack init`), the wizard prompts for marketplace selection and an optional vault path, and the only writes are sidecar copies of `settings.json.example` and `mcp-servers.json.example` plus optional rules and hooks. No remote code execution, no network egress from the CLI, no privileged operations, no silent overwrite.

A hostile reader who runs the npm CLI with malicious intent can: (a) point `--claude-dir` at a path they don't own — the CLI will fail or write into that path, but mkdir-recursive plus `copyFileSync` will fail with a noisy local error, not an exploit; (b) symlink `~/.claude/settings.json.from-operator-stack` to something dangerous — but `copyFileSync` follows the symlink and overwrites, which is a self-DoS; (c) run as root — the CLI doesn't ask for root, doesn't `sudo`, would just write the sidecars into root's `~/.claude/`. None reach a remote-impact ceiling.

The 6 own skills add prompt-execution surface, but every skill explicitly enforces "candidate, not commit" and "explicit confirmation" before any write to the vault or filesystem. They are read-mostly artefacts that produce text the operator decides whether to act on.

The single soft-spot is M1 (operator absolute paths in `.planning/`). It is operator-known, operator-acknowledged, and the threat surface is "a reader hostile to operator anonymity" — the same ceiling as v1's M1. The repo is safe to flip; the operator may want to address M1 as part of v1.1's polish pass if the absolute-path leak feels worse in production than expected.

## Verdict + recommendation

**Verdict: GO.** No CRITICAL or HIGH findings. The single MEDIUM is operator-known and the four LOWs are polish items, not flip blockers.

**Order of operations for the flip:**

1. (Optional, 5 min) Replace the two `<!-- TODO upstream URL -->` comments in `stack/graphify.md` with either a real upstream URL or an explicit "graphify is not publicly distributed yet — see install layer notes" line. Closes L1.
2. Run the operator's pre-flip sanitisation grep one final time as documented in `launch-surfaces/checklist.md` line 13-19.
3. Flip via `gh repo edit mccarthy606/claude-operator-stack --visibility public --accept-visibility-change-consequences`.
4. (Defer to v1.1) Address M1 by either gitignoring `.planning/` outright or scrubbing absolute paths to relative.
5. (Defer to v1.1) Expand `case-study-anonymiser` regex coverage (L2) and add gitignore-verification step to `multi-project-context-bridge` (L3).
6. (Defer to v1.1) Decide whether to minify the published CLI dist (L4).

**Confidence: high.** The repo's discipline carries through the new surfaces — same sidecar pattern, same placeholder hygiene, same explicit-confirmation skill design as the v1 audit found. The flip is operationally safe.
