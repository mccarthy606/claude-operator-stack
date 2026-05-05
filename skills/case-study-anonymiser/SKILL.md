---
name: case-study-anonymiser
description: Apply the operator's redaction playbook to a draft case study, blog post, or public artefact, replacing real product names with `Discipline A/B/C` style aliases, stripping URLs and API keys, and returning a redacted draft plus a substitution diff.
origin: claude-operator-stack
---

# Case Study Anonymiser

You are about to publish something public — a case study, a blog post, a launch thread — that mentions the operator's actual products, customers, or domains. Anonymisation is a recurring pre-publish step, and slipping a real domain into a public artefact is reputational. This skill takes a draft and runs the same redaction playbook used in `case-studies/niche-booking-trio.md`: stable aliases, URL stripping, API key stripping, jurisdictional name removal, and a final paranoia grep.

## When to Use

- The user pastes a draft and says "scrub this", "anonymise this", or "redact before I post".
- The user is preparing a case study under `case-studies/` for the public repo and asks for a sanitisation pass.
- The user wants to share an internal note or ops doc externally and the original references real customers, partners, or counterparties.
- The user is about to post a launch thread or LinkedIn write-up that mentions products by their real brand names.
- Do not use this for `.claude/` directory sanitisation — `cookbook/ops-sanitising-claude-directory.md` covers that adjacent discipline.

## Inputs

Ask the user for whatever is missing:

- The draft itself, either as a file path (`case-studies/<name>.md`, an Obsidian note, an arbitrary markdown file) or pasted inline.
- The known-real identifier set: real product names, real domains, real customer names, real partner names. If a `.anonymisation-map.local` file exists at the repo root (gitignored), read it. Otherwise ask the user to list them.
- The alias scheme. Defaults: `Discipline A/B/C` for related products in one market (mirroring `case-studies/niche-booking-trio.md`), `Project-1/2/3` for unrelated products, `Counterparty-N` for partners or vendors, `Customer-N` for individuals. Honour the user's override if they specify one.
- An optional `--strict-urls` flag from the user that strips every absolute URL, not only those matching known-real domains. Defaults off; default behaviour leaves third-party docs and reference URLs intact.

If the draft is referenced as a file path, read it before substituting. Never silently overwrite the source — produce the redacted version inline in your response and let the operator decide whether to write it back.

## How It Works

1. Load the draft — either from the file path the user gave or from the pasted block. Confirm the content range you are about to redact (first and last 30 chars echoed back) so the user catches a wrong-file mistake before substitution starts.
2. Build the substitution map. For every known-real identifier the user supplied, assign a stable alias from the agreed scheme. The same real → alias mapping must be consistent across the entire draft (if `RealProductX` becomes `Discipline A` once, every other mention also becomes `Discipline A`). Echo the map back to the user before applying.
3. Apply the substitutions in order: longest identifier first to avoid partial-match collisions (e.g. `RealProductXYZ` substituted before `RealProduct`). Replace absolute URLs that contain the operator's known domains with `[redacted]`. Strip API key patterns matching the modern token shapes — at minimum `sk-[A-Za-z0-9]{20,}` and the OpenAI project variant `sk-proj-[A-Za-z0-9]{20,}`, Stripe-style `pk_(live|test)_[a-zA-Z0-9_]{20,}` and `sk_(live|test)_[a-zA-Z0-9_]{20,}`, Google API `AIza[A-Za-z0-9_-]{30,}` and OAuth `ya29\.[A-Za-z0-9_-]{20,}`, GitHub PATs `(ghp_|gho_|ghu_|github_pat_)[A-Za-z0-9_]{20,}`, Telegram bot tokens matching `\d{8,10}:[A-Za-z0-9_-]{30,}`, JWT three-part tokens `eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}`, PEM/SSH private-key blocks (`-----BEGIN [A-Z ]*PRIVATE KEY-----`), DSN strings with embedded credentials (`https?://[^/]+:[^@]+@`), and obvious bearer tokens. Strip jurisdiction-specific legal entity names if the user listed them. <!-- regex list expanded to cover GitHub PAT and Telegram bot shapes per security review v2 L2 -->.
4. Run a final paranoia grep over the redacted draft against the full known-real identifier set. Zero matches required. If anything survives — partial spelling, capitalisation variant, possessive form — report the surviving match and rewrite. Do not return the draft until grep is clean.
5. Build the diff section. List every substitution actually applied as `<real> → <alias>`, every URL stripped, every key pattern stripped. Suppress the real values from the diff itself — alias only — so the diff is also publish-safe. Count substitutions and flag any single identifier substituted more than 20 times (likely a structural reference that may need rephrasing entirely).
6. Return the redacted draft as a fenced markdown block, followed by `## Redaction diff` (substitution count + alias-only listing) and `## Final grep result` confirming zero matches. Offer to write the redacted version to a sibling file (e.g. `<original>.redacted.md`) only if the user explicitly asks; never auto-write.
7. If the draft contains screenshots or image references (`![]()` blocks), flag each image as a manual review item — image OCR is out of scope for this skill, and a screenshot of the operator's dashboard with the real product name in the browser title bar is the most common slip-through.

## Output shape

A single response containing:

```markdown
## Redacted draft

<full redacted markdown of the draft, fenced>

## Redaction diff

- Substitutions applied: N
  - Discipline A — 14 occurrences
  - Discipline B — 9 occurrences
  - Counterparty-1 — 3 occurrences
- URLs stripped: M
- API key patterns stripped: K
- Legal entity names stripped: L

## Final grep result

Known-real identifier matches in redacted draft: 0
```

If grep returns non-zero, the response stops at step 4 with the surviving match reported and a rewrite proposal. The draft is not returned until the grep is clean.

## Anti-patterns

- Do not auto-write the redacted draft over the original file. The operator owns the final review pass; this skill produces a candidate, not a commit.
- Do not invent aliases the user did not approve. If the user did not specify a scheme and `case-studies/` lacks an obvious analogue, ask before substituting.
- Do not redact words that merely look proprietary (capitalised nouns, codenames in passing) unless they appear in the known-real identifier set. Over-redaction makes the case study unreadable.
- Do not skip the final paranoia grep, even when the substitution map is short. The cost of one missed match in a public artefact is larger than the cost of running the grep.
- Do not use marketing language when summarising the redaction. The diff is mechanical: count, alias, count, alias.
- Do not redact in batches across multiple drafts in one pass. The substitution map must be re-confirmed per draft, because the same real product can map to different aliases in different case studies.

## Related

- [`case-studies/niche-booking-trio.md`](../../case-studies/niche-booking-trio.md) — the live `Discipline A/B/C` aliasing pattern this skill mirrors.
- [`case-studies/README.md`](../../case-studies/README.md) — the operator's stated rule that URLs and customer specifics are deliberately omitted.
- [`workflows/parallel-projects.md`](../../workflows/parallel-projects.md) — the parallel-projects discipline that produces the case studies this skill redacts before they go public.
- ECC has no anonymisation skill in its 182-skill catalog. Closest adjacent skills (`seo`, `brand-voice`) operate on tone, not on identifier scrubbing — there is no overlap to disambiguate from.
