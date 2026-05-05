# Integration instructions — P8.2 compare matrix

This document tells the coordinated README pass exactly where to inject the
three SECTION files into `README.md`, `README.ru.md`, and `README.es.md`.

The README pass owns the live README files. This phase only produced section
copy in `SECTION-en.md`, `SECTION-ru.md`, `SECTION-es.md`. Do not freelance —
the line numbers and TOC entries below are the contract.

## File sources

| Section copy | Target README | Heading goes between |
|--------------|---------------|----------------------|
| `SECTION-en.md` | `README.md` | `## Why this exists` and `## Acknowledgements` |
| `SECTION-ru.md` | `README.ru.md` | `## Зачем это нужно` and `## Благодарности` |
| `SECTION-es.md` | `README.es.md` | `## Por qué existe` and `## Agradecimientos` |

## EN — README.md

**Body insert:**
- Insertion point: after line 264 (`---` separator that closes `## Why this exists`),
  before line 266 (`## Acknowledgements`).
- Insert the full contents of `SECTION-en.md` as-is.
- Add a single `---` separator on its own line *after* the section body, *before* `## Acknowledgements`.

**TOC entry:**
- Current TOC sits at lines 21–35 of `README.md`.
- Insert the new entry between line 32 (`- [Why this exists](#why-this-exists)`) and
  line 33 (`- [Acknowledgements](#acknowledgements)`):

  ```markdown
  - [How this compares](#how-this-compares)
  ```

- Anchor slug: `#how-this-compares` (lower-case, spaces → hyphens, no special chars).

## RU — README.ru.md

**Body insert:**
- Insertion point: after line 180 (`---` separator that closes `## Зачем это нужно`),
  before line 182 (`## Благодарности`).
- Insert the full contents of `SECTION-ru.md` as-is, **including the leading HTML
  comment** `<!-- canonical: README.md § How this compares — keep in sync -->`.
- Add a single `---` separator on its own line after the section body, before `## Благодарности`.

**TOC entry:**
- Current TOC sits at lines 21–32 of `README.ru.md`.
- Insert between line 29 (`- [Зачем это нужно](#зачем-это-нужно)`) and
  line 30 (`- [Благодарности](#благодарности)`):

  ```markdown
  - [Как это сравнивается](#как-это-сравнивается)
  ```

- Anchor slug: `#как-это-сравнивается` (GitHub-flavoured-markdown keeps Cyrillic
  in the slug, lower-case, spaces → hyphens).

## ES — README.es.md

**Body insert:**
- Insertion point: after line 180 (`---` separator that closes `## Por qué existe`),
  before line 182 (`## Agradecimientos`).
- Insert the full contents of `SECTION-es.md` as-is, **including the leading HTML
  comment** `<!-- canonical: README.md § How this compares — keep in sync -->`.
- Add a single `---` separator on its own line after the section body, before `## Agradecimientos`.

**TOC entry:**
- Current TOC sits at lines 21–32 of `README.es.md`.
- Insert between line 29 (`- [Por qué existe](#por-qué-existe)`) and
  line 30 (`- [Agradecimientos](#agradecimientos)`):

  ```markdown
  - [Cómo se compara](#cómo-se-compara)
  ```

- Anchor slug: `#cómo-se-compara` (GitHub keeps the accented `ó` in the slug,
  lower-case, spaces → hyphens).

## CHANGELOG.md

Add a single bullet under the unreleased section:

```markdown
- Add "How this compares" section to README, README.ru, README.es (P8.2)
```

## Files NOT to touch

These stub READMEs do not get the section in this phase — community PR mirrors
the section into them later:

- `README.pt-br.md`
- `README.tr.md`
- `README.zh.md`
- `README.ja.md`

## Post-integration verification (run after all three README inserts land)

```bash
# 1. Section heading present in all three READMEs
grep -c "^## How this compares$" README.md           # expect 1
grep -c "^## Как это сравнивается$" README.ru.md      # expect 1
grep -c "^## Cómo se compara$" README.es.md           # expect 1

# 2. TOC entries present
grep -c "(#how-this-compares)" README.md             # expect 1
grep -c "(#как-это-сравнивается)" README.ru.md        # expect 1
grep -c "(#cómo-se-compara)" README.es.md             # expect 1

# 3. ECC URL present in EN section
grep -c "github.com/affaan-m/everything-claude-code" README.md   # expect ≥1

# 4. Section length budget
awk '/^## How this compares$/,/^## /' README.md | wc -l    # expect 30–55 lines

# 5. Banned words inside the new sections
grep -niE "\b(best|most|ultimate|easiest|simplest|empower|leverage|unleash|supercharge)\b" README.md README.ru.md README.es.md
# expect zero hits inside the new sections

# 6. Stub READMEs untouched
git diff --name-only HEAD -- README.pt-br.md README.tr.md README.zh.md README.ja.md
# expect empty output
```

If any of these fail after integration, fix before commit.
