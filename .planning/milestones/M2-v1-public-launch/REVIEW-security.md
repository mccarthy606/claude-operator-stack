# Security review — opus 4.7

**Date:** 2026-05-05
**Scope:** secrets, sanitization, install safety, hook safety, recipe abuse vectors, scaffold env hygiene.

## Summary
- Files audited: 129 (excluding .git/ and assets/hero.svg)
- Findings: CRITICAL 0 · HIGH 0 · MEDIUM 3 · LOW 6
- Verdict: **GO** (with optional MEDIUM mitigations before flip; none of them block the launch)

The repo is clean from a security-flip standpoint. No real secrets are committed, no install-script abuse vectors, no RCE in any hook, no missing webhook signature verification in the recipes. The MEDIUM findings are about (a) one borderline anonymisation call in a case study, (b) one recipe pattern that nudges readers toward an HTML-escape footgun, and (c) one missing-by-design guard in the lead-form route. The LOWs are pure hardening notes for v1.1.

## CRITICAL — public flip would burn the launch

None.

## HIGH — fix before flip

None.

## MEDIUM — fix in v1.1 (or now if time allows)

### M1. `case-studies/niche-booking-trio.md` lines 15-17 — discipline names triangulate to operator's real brands

**File:** `case-studies/niche-booking-trio.md` lines 11-19
**What:** The case study names three sites in title case ("Drift School", "Drift Taxi", "Track Days") and combines them with strong locator signals: "Latin American market" (line 4), "city with strong car culture" (line 11), "same operator, same physical location" (line 19). The terms `drifttaxi`, `driftschool`, `trackdays` are on the operator's explicit anonymisation checklist. The README publicly states the operator is in Buenos Aires and runs car-related products. Anyone in the Argentine motorsport scene — or anyone who runs a domain search — can triangulate to the actual brand names within minutes.

The case study's own preamble says "URLs and customer specifics are deliberately omitted; the patterns are the part worth sharing" — which is technically respected (no domains shipped) but the discipline names do most of the de-anonymising work that domains would have done.

**Why MEDIUM not HIGH:** no secret is leaked, no PII is exposed, no actual customers are named. The operator may have already decided the trade-off ("the case study is more credible with concrete service categories named") and shipped this knowingly. But it is the single place in the repo where a reader hostile to anonymisation could connect the playbook to specific brands.

**Suggested fix:** soften to fully generic descriptors — "instructional", "experiential", "scheduled-event" — or rewrite as anonymised aliases ("Discipline A / B / C") matching the pattern already used in `workflows/content-pipeline.md` lines 81-83 ("Brand A / B / C"). 10 minutes of editing.

### M2. `cookbook/09-telegram-bot-leads-v0.md` line 74 + lines 50-66 — HTML parse_mode with raw user input is a quiet XSS-equivalent

**File:** `cookbook/09-telegram-bot-leads-v0.md` lines 50-66
**What:** The Next.js example handler interpolates `name`, `email`, and `message` from the lead form directly into a string that is then sent with `parse_mode: 'HTML'`. A submitter who puts `<b>` or `<a href="...">` in the name or message field will get HTML rendered in the bot recipient's chat. A malicious submitter could send formatted phishing text that looks like it came from the operator's bot.

The recipe's own pitfalls section (line 139) does mention HTML escaping as a concern, but the code block above does not implement it. A reader who copies the code as-is ships the issue.

**Why MEDIUM:** the impact is limited (the only target is the bot owner — the operator who is already alerted to "new lead") and Telegram's HTML subset is restrictive. But the recipe is consumed by readers who treat it as copy-pasteable, so the working code should not contain a footgun.

**Suggested fix:** either (a) drop `parse_mode: 'HTML'` from the example (raw text is fine for lead notifications), or (b) add a small escape helper inline (`text.replace(/[<>&]/g, c => ({...})[c])`) before interpolation. The scaffold's `web-saas/app/api/lead/route.ts` already handles this correctly by sending plain text without `parse_mode`, so the recipe is the only inconsistency.

### M3. `scaffolds/web-saas/app/api/lead/route.ts` — no rate limiting, no CSP

**File:** `scaffolds/web-saas/app/api/lead/route.ts` + `scaffolds/web-saas/next.config.ts`
**What:** The lead route validates email format, caps message length, dedupes on unique-constraint without leaking whether email exists, fires Telegram + GA4 fire-and-forget — all good. What it does not have: rate limiting (an attacker can pound `/api/lead` to fill the operator's leads table or burn GA4 quota), and the `next.config.ts` security headers omit `Content-Security-Policy` (X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy are all set — CSP is the gap).

The honeypot field in the form (`lead-form.tsx` lines 102-106) is a partial mitigation but trivial to bypass.

**Why MEDIUM:** these are best-practice gaps in a starter scaffold, not exploits. The operator audience copies these files and adds their own deploy-platform rate limiting (Vercel firewall, Cloudflare WAF). A motivated adversary can absolutely flood the route, but the harm is limited to leads-table noise, not data loss or compromise.

**Suggested fix for v1.1:** add a tiny token-bucket via `@upstash/ratelimit` or even a Vercel Edge Middleware example. Add a default CSP block to `headers()` with a comment about per-product tuning. Document both in `scaffolds/web-saas/CLAUDE.md` as "before going live" items.

## LOW — hardening notes for v1.1

### L1. `cookbook/05-ga4-cloudflare-analytics.md` line 87 — GA4 secret in URL query string

The example concatenates `api_secret=${process.env.GA4_API_SECRET}` directly into the request URL. GA4's Measurement Protocol requires it (Google's design), but URL query strings are logged by middleboxes, proxies, and many server access logs. The recipe should at minimum note "your reverse proxy and any APM agent will log this URL — confirm scrubbing rules cover the full path." Not exploitable as written; just an awareness note.

### L2. `configs/hooks/statusline.js` line 51 — temp-file race window

The bridge file at `path.join(os.tmpdir(), \`claude-ctx-${session}.json\`)` is written without `O_EXCL` or unique-suffix randomisation. Session IDs are validated for path traversal (line 48), so this is not exploitable, but on a multi-user machine where two users share the same session id (vanishingly unlikely) one could overwrite the other's metrics. Acceptable for the v1.0 audience; flag for hardening if anyone reports issues.

### L3. `scaffolds/whatsapp-saas/app/webhook.py` — bare exception swallow in `_claim_message`

Line 116-124 catches `Exception` and only inspects the string for `23505 / "duplicate key"`. Any other DB error is logged and treated as "fresh insert," which deliberately favours processing duplicates over dropping messages. The choice is documented in the comment, but the bare `Exception` catch could mask wholly unexpected failures (auth revoked, schema drift). Not security-critical; classify as resilience-vs-paranoia tradeoff worth re-reading post-pilot.

### L4. `cookbook/04-cloudflare-argo-local-dev.md` line 36-37 — `curl | install` without checksum

The Linux install command is `curl -L https://github.com/.../cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && chmod +x ...`. Cloudflare publishes SHA256 sums next to each release. The recipe should either link to the apt/rpm package path (which Cloudflare signs) or include a `sha256sum -c` step. Not a critical issue (the binary comes from Cloudflare's official releases), but the recipe is a teaching artefact and the missing checksum step normalises a bad pattern.

### L5. `configs/mcp-servers.json.example` line 47 — filesystem MCP scope

The filesystem MCP is scoped to `${HOME}/Projects` by default. The line comment explicitly says "set the path to your projects root" but a copy-paste user who keeps the default and stores their `.env` files inside `~/Projects/<repo>/` (the typical layout) gives the agent read access to all of those. The MCP itself is well-designed, but the example would benefit from a stronger inline warning: "this grants the agent read/write across the entire projects tree — narrow it before enabling it on a machine that holds production secrets."

### L6. `install.sh` line 80 — `claude --version` parser is trivially spoofable

`CLAUDE_VERSION=$(claude --version 2>/dev/null | awk '{print $1}' || echo "unknown")` — fine for cosmetic display, but the variable is then printed to the user as the trusted version. A locally-installed shim that prints arbitrary text could pass through here. Not exploitable in any meaningful way (the user has already trusted the `claude` binary in their PATH), just a note that the displayed version is whatever the binary chose to emit.

## Sanitization grep results

- `mccarthy606` hits: 30+ (all legit: badges, LICENSE, README clone URLs, .planning/ launch surfaces, credits, gh repo example commands)
- `/Users/` hits: 1 (cookbook/04-cloudflare-argo-local-dev.md line 79: `/Users/<you>/.cloudflared/<uuid>.json` — properly templated)
- Real product name hits: **0** for `Rarento`, `MultasArgentina`, `Autodealer AI`, `Racing Rental`, `maji97`, `UREMONT`, `Cartronic`, `BOX3D`, `Level Performance`. **3** for `drifttaxi/driftschool/trackdays` — all in `case-studies/niche-booking-trio.md` lines 11-17 (see M1)
- Personal name hits (`Дмитрий`, `Лионелл`, `Lionella`, `Mariano`, `Леонардо`): **0**
- Email hits other than `dimana503@gmail.com`: **0** (the operator's email is not in the repo at all; only `@mccarthy606` GitHub handle)
- Phone-number hits matching `+5491168333342` or any operator number: **0** (the only long numerics are obvious mock data: `5491100000000`, `5491111111111`, `1234567890` — all in `tests/test_webhook.py` as fixtures)
- API-key-fragment hits (`sk-`, `pk_test_`, `pk_live_`, `xox[bp]-`, `ghp_`, `gho_`, `eyJ`, `Bearer `): **1** — `tests/test_webhook.py` line 21 has `ANTHROPIC_API_KEY=sk-ant-test` which is a clearly-fake test fixture
- Vercel `team_*`, Stripe `cus_*` / `acct_*` / `pi_*` / `seti_*`, Supabase `--project-ref=<real>`: **0**
- `wa.me/` / personal Telegram handles: **0** (only `@BotFather` and `@userinfobot` in cookbook/09)
- Internal infra URLs / staging hosts: **0**

## install.sh review

Walked end-to-end. Per-check status:

- **No `sudo` calls:** PASS — never invoked, never required.
- **No `rm -rf` in dangerous places:** PASS — no `rm` calls of any kind.
- **No silent overwrite of user files:** PASS — `copy_if_safe()` (line 113) prompts on every existing target and writes a `*.backup.<epoch>` before clobbering. Files copied as `*.from-operator-stack` sidecars by default, so `~/.claude/settings.json` itself is never touched.
- **No remote-code execution without confirm:** PASS — script never invokes `curl | bash` or downloads anything. Step 2 (line 84-100) tells the user to run `/plugin marketplace add` and `/plugin install` interactively in Claude Code — and gates that step behind a `confirm()` (line 101).
- **Env-var injection safety:** PASS — placeholder strings in `${VAR}` form are passed through to Claude Code's runtime, never `eval`'d in the shell.
- **Path-traversal safety:** PASS — `REPO_ROOT` is computed from `$(cd "$(dirname "$0")" && pwd)` (line 57) so it resolves to a real path; copies use absolute source paths and absolute destinations under `$HOME/.claude/`. No user input flows into a path.
- **Shell-injection in `confirm()` / `run()`:** PASS — `confirm()` uses `read -r answer` (line 41) which is safe; `run()` (line 48) splats `"$@"` without `eval`, no command-string concatenation.
- **Backup-on-overwrite actually backs up:** PASS — `cp "$dst" "$dst.backup.$(date +%s)"` (line 125) runs before the new write, and is wrapped in `run` so `--dry-run` is honoured.
- **`--dry-run` actually skips writes:** PASS — `run()` (line 48-54) prints `[dry-run] <args>` instead of executing when `DRY_RUN=1`. Every state-changing call goes through `run`. `mkdir -p "$CLAUDE_DIR"` and the inner `mkdir`s on lines 108-111 are direct (not via `run`) which is a minor exception — they create empty directories under `~/.claude/` even in dry-run mode. Cosmetic, not dangerous (an empty `~/.claude/hooks/` is the only new artefact and was going to exist anyway).
- **`--yes` doesn't bypass safety checks that should remain:** PASS — `--yes` only skips the interactive `confirm()` prompts. It does not bypass overwrite-with-backup behaviour. The script ends after the marketplace step regardless of `--yes`; no irreversible action is gated on user input that `--yes` could short-circuit dangerously.

Two notes from the walkthrough that are not pass/fail:

1. The `mkdir -p "$CLAUDE_DIR/hooks"` (line 111) creates an empty directory which the installer never populates. The pre-launch audit (`AUDIT.md` M5) already flagged this. Not a security issue; the directory just looks unfinished.
2. The script's `set -euo pipefail` (line 13) is correct. No subshell or pipe context where the `-e` would silently skip a failure.

## Recipe abuse vector spot-check

| Recipe | Signature verify? | Secrets in env? | Footguns? |
|---|---|---|---|
| 01 — Claude Code from zero | n/a | n/a | none |
| 02 — Stripe Connect P2P | YES (`stripe.webhooks.constructEvent`, `request.text()` for raw body) | YES (`process.env.STRIPE_SECRET_KEY` with explicit early-throw if missing) | none beyond pitfalls section |
| 03 — WhatsApp Cloud API webhook | YES (HMAC-SHA256 with `hmac.compare_digest`, raw bytes) | YES (verify token, app secret, access token all from `.env`) | pitfalls explicitly call out signature-vs-parsed-body trap |
| 04 — Cloudflare Tunnel | n/a (infra setup) | uses local cert files | L4: missing checksum on Linux curl install |
| 05 — GA4 + Cloudflare | n/a (server-side analytics) | YES (`GA4_API_SECRET` server-only, explicitly NOT in `NEXT_PUBLIC_`) | L1: secret in URL query (Google's design) |
| 06 — Sentry fullstack | n/a | YES (`SENTRY_AUTH_TOKEN` build-time only, denylist for sig headers + cookies) | none — recipe explicitly scrubs PII |
| 07 — Supabase pooling | n/a | YES (DATABASE_URL with pgbouncer flag, DIRECT_URL only for migrations) | none |
| 08 — yt-dlp + Whisper | n/a (read-only, local) | n/a | none — explicit "transcripts stay on your machine" framing |
| 09 — Telegram bot | n/a (outbound only) | YES (TELEGRAM_BOT_TOKEN server-only, explicit "never reach the browser" pitfall) | **M2: HTML parse_mode with un-escaped user input** |
| 10 — Mercado Pago LATAM | YES (re-fetch via `payment.get()` rather than trusting body; signed-header path noted as optional) | YES (MP_ACCESS_TOKEN with explicit early-throw) | none — "trust the re-fetch, not the body" framing is correct |
| 11 — Scheduled prompts | n/a | references env vars in pitfalls ("do not embed secrets in prompts") | none |
| 12 — Content cross-post | n/a | n/a | none |

Twelve recipes; one footgun (M2 above), one missing-checksum note (L4 above). The signature-verify discipline across all webhook recipes is strong — every recipe that handles inbound POSTs from a third party either uses HMAC properly or uses a re-fetch pattern that does not trust the body.

## Hook safety

| Hook | Network? | RCE vectors? | FS scope | Notes |
|---|---|---|---|---|
| `prompt-injection-guard.js` | NONE | none — pure regex over stdin JSON, no `eval`, no shell-out | none (read-only) | Stdin parsing has 3s timeout (line 52), advisory-only output, exits 0 on any failure. Clean. |
| `read-injection-scanner.js` | NONE | none — same shape as guard | none (read-only) | 5s stdin timeout, advisory-only with HIGH/LOW severity, excludes `configs/hooks/` and `REVIEW.md` from scans (line 57-58) to avoid self-trigger. Clean. |
| `read-before-edit.js` | NONE | none | reads target file path with `fs.accessSync` only (line 41) | Auto-disables under Claude Code (line 31). Clean. |
| `validate-commit-message.sh` | NONE | none — uses `node -e` to parse JSON without eval, then `[[ =~ ]]` regex | none | Hard-blocks via `{"decision": "block"}` and `exit 2` on violation. Verified — this actually blocks, not just warns. Clean. |
| `statusline.js` | NONE | none | writes to `os.tmpdir()/claude-ctx-${sessionId}.json` only | Session ID validated against `[/\\]|\.\./` (line 48) before path concat. Clean. L2 above is a tiny race-window note. |
| `context-monitor.js` | NONE | none — reads bridge file written by `statusline`, parses metrics, writes warning state | reads/writes only inside `os.tmpdir()` | Same session-ID validation (line 40). 10s stdin timeout. Clean. |

All six hooks: zero network calls (matches the README claim), zero `eval` / `Function()` / `require()` of dynamic strings, zero spawn / exec, no privileged operations, all fail-silently to `exit 0` on any error. The two filesystem-touching hooks scope writes to `os.tmpdir()` and reject session IDs containing path separators or traversal sequences. `validate-commit-message.sh` correctly returns `exit 2` for blocks (Claude Code's required block code), not just `exit 1` or stderr-only. This is genuinely the safest hook bundle I would expect to see in a public repo.

## Threat model summary

Realistic worst case for a public-facing user of this repo: a user clones the repo, audits the install script as the README instructs, runs `./install.sh`, and ends up with sidecar config files at `~/.claude/settings.json.from-operator-stack` and `~/.claude/mcp-configs/mcp-servers.json.from-operator-stack`. They then read those files, copy substitution patterns into their real config, and authenticate the MCP servers they actually want. That whole path involves no remote code execution, no privileged access, no network egress from the installer, and no silent overwrite of existing config.

A hostile reader who runs the installer with malicious intent can: (a) point `$HOME` at a path they don't own — the installer will fail or write into that path, but `set -euo pipefail` plus `mkdir -p` make this a noisy local error, not an exploit; (b) symlink `~/.claude/settings.json.from-operator-stack` to something dangerous — but the installer's `cp $src $dst` will follow the symlink and overwrite, which is a self-DoS, not an attack on someone else; (c) run as root — the script doesn't ask for root, doesn't `sudo`, and would just write the sidecar files into root's `~/.claude/` (annoying, not exploitable). None of these reach a remote-impact ceiling.

The single soft-spot in the threat surface is M1 (the case-studies/niche-booking-trio.md de-anonymisation). It is a privacy concern for the operator personally — a reader hostile to the operator's anonymity can connect the playbook to specific brands. The operator may have already accepted that trade-off; flagging it here so it is an explicit decision rather than a quiet leak. The repo is safe to flip public; the operator may want to soften M1 first.

**Verdict: GO.** No CRITICAL or HIGH findings. M2 (recipe HTML XSS footgun) is the most worth fixing pre-flip if there is bandwidth; it's a 5-minute edit. M1 (anonymisation) and M3 (scaffold rate-limit / CSP) can ship as v1.1 issues.
