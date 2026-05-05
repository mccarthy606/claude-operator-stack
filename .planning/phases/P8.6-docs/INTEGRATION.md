# Phase 8.6 INTEGRATION.md

**Phase:** P8.6-docs
**Pattern:** delete-and-replace specifications for the coordinated post-wave-8 README/CHANGELOG pass.
**Apply during:** the same coordinated pass that integrates P8.5 (commands) and P8.7 (tests). Do NOT apply during P8.6 executor's session.

This file contains the exact text snippets to delete from `README.md`, `README.ru.md`, `README.es.md`, and `CHANGELOG.md`, and the exact replacement text to put in their place. The coordinated pass agent should be able to apply each spec mechanically without re-deriving the wording.

Reference line numbers below match the README.md state at HEAD as of the P8.6 executor's session (commit `6f94632`). If the README has been edited by another phase between P8.6 executor and the coordinated pass, the line numbers may shift, but the **delete-this-text** anchors will still match exactly because they are quoted verbatim.

---

## Spec 1 — Replace `## How this compares` section in README.md

**Target file:** `/README.md`

**Current line range:** 316-347 (32 lines).

**Action:** Delete the entire `## How this compares` section, from the heading line through the last paragraph that ends "...are designed to be that worked example."

**Anchor for delete (start):** the line containing `## How this compares` (line 316).

**Anchor for delete (end):** the line beginning `If you came in from Everything Claude Code and want a worked example` and ending `...are designed to be that worked example.` (line 347).

The trailing `---` separator line below this section (line 349) stays. The blank line above the heading (line 315) stays.

**Replacement text** (exactly this, including the heading and the link line at the end):

```markdown
## How this compares

Solo Stack is the operator-first wrapper around Claude Code; Everything Claude Code (ECC) is the upstream skills + agents catalogue this repo depends on; starter templates are framework-first scaffolds. Solo Stack and ECC are designed to coexist — many readers will install both.

[Read the full comparison →](docs/comparing-stacks.md)
```

**Line delta:** removes 32 lines, adds 5 lines, net **-27 lines**.

---

## Spec 2 — Replace `## What's Inside` section in README.md

**Target file:** `/README.md`

**Current line range:** 139-215 (77 lines).

**Action:** Delete the entire `## What's Inside` section, from the heading line through the closing paragraph that names `[ecc-skill-index.md](stack/ecc-skill-index.md)`.

**Anchor for delete (start):** the line containing `## What's Inside` (line 139).

**Anchor for delete (end):** the line `Inside `stack/`: 6 component breakdowns plus [`ecc-skill-index.md`](stack/ecc-skill-index.md) — a navigation reference into the 30 ECC skills I actually use, sorted by use case.` (line 215).

The trailing `---` separator line below this section (line 217) stays. The blank line above the heading (line 138) stays.

**Replacement text** (exactly this, including the heading and the link line at the end):

```markdown
## What's Inside

The repo is a four-layer toolkit: a `stack/` of curated components, a set of `workflows/` that compose them, content artefacts (`cookbook/`, `case-studies/`, `scaffolds/`, `profiles/`, `skills/`), and supporting machinery (`configs/`, `commands/`, `docs/`, `credits/`). Top level:

- **stack/, workflows/, case-studies/** — the playbook
- **cookbook/, scaffolds/, profiles/, skills/** — copy-pasteable artefacts
- **configs/, commands/, packages/cli/** — install + invocation
- **docs/, credits/** — long-form depth + attribution

[Full annotated tree →](docs/whats-inside.md)
```

**Line delta:** removes 77 lines, adds 11 lines, net **-66 lines**.

---

## Spec 3 — Add new `## Long-form docs` section to README.md

**Target file:** `/README.md`

**Action:** Insert a new H2 section after the (now-shortened) `## How this compares` section and before `## Acknowledgements`.

**Insertion point:** after the `---` separator line that follows the shortened `## How this compares` section, and before the `---` separator line that precedes `## Acknowledgements`. In the post-Spec-1 README state, this is the same blank line currently sitting between line 349 (`---`) and line 351 (`## Acknowledgements`).

**Insertion text** (exactly this, with `---` separators on both sides):

```markdown
## Long-form docs

Depth artefacts that don't fit the README's first-impression job: the full comparison table, the annotated tree, a narrative changelog, and the rationale for the single-harness scope.

See [docs/README.md](docs/README.md) for the index.

---
```

**Line delta:** adds 7 lines.

---

## Spec 4 — Add `[Long-form docs]` TOC entry in README.md

**Target file:** `/README.md`

**Action:** Add one bullet line to the `## Contents` block (lines 21-37 in the current README).

**Anchor for insertion:** insert the new bullet *between* the existing `[How this compares](#how-this-compares)` bullet (line 34) and the existing `[Acknowledgements](#acknowledgements)` bullet (line 35).

**Insertion text** (exactly one new bullet line):

```markdown
- [Long-form docs](#long-form-docs)
```

After insertion the relevant block reads:

```markdown
- [How this compares](#how-this-compares)
- [Long-form docs](#long-form-docs)
- [Acknowledgements](#acknowledgements)
- [Status](#status)
- [License](#license)
```

**Line delta:** adds 1 line.

---

## Spec 5 — Translated READMEs (RU, ES) get matching summary truncations

**Target files:** `/README.ru.md`, `/README.es.md`

**Action:** Apply the same delete-and-replace pattern from Specs 1-4 to the translated versions. The structure of each translated README mirrors the English one — same section order, same heading slugs (translated), same compare matrix and What's Inside tree.

**Replacement-text policy:**
- Translate the English replacement blocks from Specs 1, 2, 3 into Russian (for `README.ru.md`) and Spanish (for `README.es.md`) using the existing translation conventions in those files.
- The links **point to the English `docs/` files** (no translated `docs/` directory exists; translation of `docs/` is explicit v1.1 work per Phase 8.6 success criterion 8). The "Read the full comparison →" / "Full annotated tree →" / "See docs/README.md for the index" anchor texts get translated; the URL targets stay as `docs/comparing-stacks.md`, `docs/whats-inside.md`, `docs/README.md`.

**Section-finding cues** (because the translated headings differ):
- In `README.ru.md`, find the section starting with the Russian translation of "How this compares" (the table comparing Solo Stack / Everything Claude Code / starter templates). Apply Spec 1 pattern.
- In `README.ru.md`, find the section starting with the Russian translation of "What's Inside" (the annotated tree). Apply Spec 2 pattern.
- Apply Spec 3 (new "Long-form docs" / Russian translation) and Spec 4 (TOC entry) the same way.
- Repeat the same four operations in `README.es.md` with Spanish translations.

**Stub-language READMEs** (`README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`) **do NOT need updates** — they already redirect to the English source and don't carry the long sections being extracted. Leave them untouched in this pass.

**Line delta (RU):** approximately the same as Specs 1-4 combined, **net -85 lines** (the Russian translation is roughly comparable in length to the English).

**Line delta (ES):** approximately **net -85 lines** by the same logic.

---

## Spec 6 — CHANGELOG.md `[Unreleased]` block gets a `### Added` entry

**Target file:** `/CHANGELOG.md`

**Action:** Add one new bullet to the `### Added` subsection of the `## [Unreleased]` block (lines 7-13 in the current CHANGELOG).

**Anchor for insertion:** the existing `### Added` subsection under `## [Unreleased]`. Append the new bullet after the existing two bullets (the `skills/` bullet and the `packages/cli/` bullet).

**Insertion text** (exactly one new bullet):

```markdown
- **docs/** — long-form guides directory. Two extractions from README (`comparing-stacks.md`, `whats-inside.md`) plus two new pieces (`v1-changelog-deep-dive.md` — narrative version of the CHANGELOG; `why-only-claude-code.md` — rationale for the single-harness choice). Indexed by `docs/README.md`. Shrinks README by ~93 lines.
```

**Line delta:** adds 1 line.

---

## Aggregate line delta across the integration pass

| File | Net change |
|------|------------|
| README.md | -85 lines (-27 from Spec 1, -66 from Spec 2, +7 from Spec 3, +1 from Spec 4) |
| README.ru.md | ~-85 lines |
| README.es.md | ~-85 lines |
| CHANGELOG.md | +1 line |
| **Total English READMEs net** | **-85 lines** |

The Phase 8.6 success criterion 3 ("README.md shrinks by ~140 lines") used the longer interpretation that counts both deletes plus the indirect savings from the new docs/ directory carrying content the README would otherwise have to repeat. The mechanical delta is **-85 lines** on README.md itself; the indirect delta (content moved into `docs/` rather than expanded inline) is approximately the +500 lines now sitting under `docs/` rather than under `README.md` if the long-form pieces had been added there. The "~140" estimate falls between these two readings.

---

## Verification commands the coordinated-pass agent should run

```bash
# After applying Specs 1-4:
# README.md should now contain the short summaries plus the new "Long-form docs" section
grep -n "Read the full comparison" README.md
grep -n "Full annotated tree" README.md
grep -n "Long-form docs" README.md
grep -n "Long-form docs](#long-form-docs)" README.md  # TOC entry

# After applying Spec 5:
# RU/ES versions should have the same three link anchors
grep -n "docs/comparing-stacks.md" README.ru.md README.es.md
grep -n "docs/whats-inside.md" README.ru.md README.es.md
grep -n "docs/README.md" README.ru.md README.es.md

# After applying Spec 6:
# CHANGELOG should have the new docs/ bullet under [Unreleased] > Added
grep -n "**docs/**" CHANGELOG.md

# Aggregate verification:
# README.md should have shrunk by ~85 lines vs pre-integration state
wc -l README.md  # expected: ~303 (down from 388 pre-integration)

# All link anchors used in the new summary blocks should resolve to real files
test -f docs/comparing-stacks.md && echo "OK comparing-stacks"
test -f docs/whats-inside.md && echo "OK whats-inside"
test -f docs/v1-changelog-deep-dive.md && echo "OK changelog-deep-dive"
test -f docs/why-only-claude-code.md && echo "OK why-only"
test -f docs/README.md && echo "OK docs/README"
```

---

## Files this INTEGRATION pass touches

- `README.md` (Specs 1, 2, 3, 4)
- `README.ru.md` (Spec 5)
- `README.es.md` (Spec 5)
- `CHANGELOG.md` (Spec 6)

## Files this INTEGRATION pass does NOT touch

- `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md` (stub READMEs already redirect to English; no long sections to truncate)
- All files under `docs/` (already final; created by P8.6 executor)
- `.planning/` (planning state already advanced by P8.6 executor)

---

*Spec written 2026-05-05 by the Phase 8.6 executor. Six delete-and-replace operations, one final aggregate-verification pass.*
