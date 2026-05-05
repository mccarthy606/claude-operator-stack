---
name: anonymise-case-study
description: Apply the operator's redaction playbook to a draft case study at the given path, replacing real product names with `Discipline A/B/C` aliases, stripping URLs and API keys, and returning a redacted draft plus a substitution diff.
origin: claude-operator-stack
---

# /anonymise-case-study

Run the case-study anonymisation playbook against a draft before you publish. The command takes a draft file path, applies the standard `Discipline A/B/C` alias scheme, strips URLs and key patterns, and returns the redacted draft alongside a substitution diff so you can sanity-check what changed.

When invoked, this command runs the [`case-study-anonymiser`](../skills/case-study-anonymiser/SKILL.md) skill with the args and defaults below.

## When to use

- You have a draft case study, blog post, or launch thread that mentions real products, customers, or domains.
- You are about to land a file under `case-studies/` for the public repo and want a sanitisation pass first.
- You want to share an internal note externally and the original references real partners or counterparties.
- You are preparing a LinkedIn or X post that names a product by its real brand.
- Skip this for `.claude/` directory sanitisation — `cookbook/ops-sanitising-claude-directory.md` covers that.

## Usage

```
/anonymise-case-study <path-to-draft> [--aliases "Alias 1,Alias 2,..."] [--strict-urls]
```

| Arg / flag | Type | Default | Notes |
|------------|------|---------|-------|
| `<path>` | required | — | Path to the draft (`case-studies/_drafts/foo.md`, an absolute path, or an Obsidian note). |
| `--aliases` | optional | `Discipline A,Discipline B,Discipline C` | Comma-separated alias scheme; matches `case-studies/niche-booking-trio.md` by default. |
| `--strict-urls` | optional flag | off | Strips every absolute URL, not only those matching known-real domains. Off keeps third-party reference URLs intact. |

The command reads the draft but never auto-writes the redacted version back over the source — it returns the redacted draft inline so you can review before persisting.

## Examples

```
/anonymise-case-study drafts/launch-post.md
```
Runs the default `Discipline A/B/C` scheme, strips known-real URLs and API key patterns, returns the redacted draft + substitution diff.

```
/anonymise-case-study case-studies/_drafts/saas-boilerplate.md --aliases "Boiler A,Boiler B"
```
Same playbook with two custom aliases instead of the default trio. Useful when the draft only references two related products.

```
/anonymise-case-study posts/2026-04-launch.md --strict-urls
```
As above, but also strips third-party reference URLs (vendor docs, blog links). Use when even the URL pattern feels too revealing.

### Example output shape

```markdown
## Redacted draft
<full redacted markdown of the draft, fenced>

## Redaction diff
- Substitutions applied: 26
  - Discipline A — 14 occurrences
  - Discipline B — 9 occurrences
  - Counterparty-1 — 3 occurrences
- URLs stripped: 4
- API key patterns stripped: 1

## Final grep result
Known-real identifier matches in redacted draft: 0
```

## Behavior

1. Load the draft from the given path. Echo back the first and last 30 chars so you catch a wrong-file mistake before substitution.
2. Build the substitution map from the alias scheme + the known-real identifier set (from `.anonymisation-map.local` if gitignored, otherwise asked inline).
3. Apply substitutions longest-identifier-first; strip absolute URLs with known-real domains; strip API key patterns (`sk-…`, `pk_…`, GitHub PATs, Telegram bot tokens, JWTs, PEM blocks, DSN with credentials).
4. Run a final paranoia grep for the full known-real identifier set against the redacted draft. Zero matches required; if anything survives, report and rewrite.
5. Build the alias-only diff (suppressing real values from the diff itself), count substitutions, flag any single identifier substituted more than 20 times.
6. Return the redacted draft, the diff, and the final-grep result. Offer to write to a sibling `<original>.redacted.md` only if you ask.

Full protocol lives in the wrapped skill — this command is the shorthand.

## Defaults and conventions

- **Alias scheme**: `Discipline A/B/C` for related products in one market (matches `case-studies/niche-booking-trio.md`); `Project-1/2/3` for unrelated products; `Counterparty-N` for partners; `Customer-N` for individuals.
- **Strict URLs**: off by default — leaves third-party doc and reference URLs intact unless the flag is passed.
- **Read-only**: the source file is never overwritten; redacted output is returned inline.
- **Final grep gate**: the draft is not returned until the known-real identifier grep is clean. No exceptions.
- **Image flagging**: `![]()` blocks are flagged as manual review items; image OCR is out of scope.

## Related

- Wrapped skill: [`skills/case-study-anonymiser/SKILL.md`](../skills/case-study-anonymiser/SKILL.md)
- Example: [`case-studies/niche-booking-trio.md`](../case-studies/niche-booking-trio.md) — the live `Discipline A/B/C` aliasing pattern this command applies.
- Adjacent: [`/bridge-context`](bridge-context.md) — uses the same alias scheme for cross-project context bridging.
- Workflow: [`workflows/parallel-projects.md`](../workflows/parallel-projects.md) — the discipline that produces the case studies this command redacts before they go public.
