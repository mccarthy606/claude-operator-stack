---
phase: P8.2-compare-matrix
milestone: M2-v1-public-launch
type: execute
status: ready
created: 2026-05-05
effort: 1-2h
depends_on: []
parallel_with: [P8.1-hero-animated, P8.3-npm-cli, P8.4-own-skills]
files_modified:
  - README.md
  - README.ru.md
  - README.es.md
  - CHANGELOG.md
autonomous: true
---

# PLAN — Phase 8.2: Compare matrix in README

## Goal

Add a brief, honest "How this compares" section to `README.md` (EN canonical) plus parallel sections in `README.ru.md` and `README.es.md`. The section is a 3-column markdown table contrasting **Solo Stack · Everything Claude Code · Starter templates** across 5–7 rows of non-overlapping value, written in a neutral, factual voice — no trash-talking, no marketing fluff, no superlatives.

A first-time visitor should leave the section with a clear mental map of *when to pick each* of the three options, not the impression that one is "better."

---

## Non-goals (scope guard)

To prevent the agent from drifting into a longer feature, this phase **does not**:

- Compare against more than three options (no 4th column for Cursor configs, dotfiles repos, etc.)
- Write more than 5–7 rows
- Add a section longer than ~50 lines of markdown including the table
- Touch the 4 stub READMEs (`README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`) — they get the matrix later via community PR
- Critique or rank ECC vs starter templates — only describe non-overlapping fit
- Add bold-axiom maxims, "X is not Y. It is Z." patterns, or emoji
- Update the hero block, badges, or any other section beyond the explicit insertion point
- Add screenshots, diagrams, or images (text + table only)

---

## Insertion point (precise)

**EN — `README.md`:**
- Insert a new H2 section titled `## How this compares` between the existing `## Why this exists` (currently H2 starting at **line 256**) and `## Acknowledgements` (currently H2 starting at **line 266**).
- Rationale: "Why this exists" answers the *philosophical* "is this for me?" question; "How this compares" answers the *map-the-landscape* "is this just an ECC fork?" question. Putting the comparison directly after sets reader expectations before they hit credits + status. Putting it before "Why this exists" (above line 256) would interrupt the narrative flow from playbook → cookbook → scaffolds → profiles → why → compare.
- The horizontal rule on line 264 (`---`) stays as the separator before the new section; insert a fresh `---` after the new section before `## Acknowledgements`.

**RU — `README.ru.md`:**
- Insert between `## Зачем это нужно` (line 172) and `## Благодарности` (line 182), mirroring the EN position.

**ES — `README.es.md`:**
- Insert between `## Por qué existe` (line 172) and `## Agradecimientos` (line 182), mirroring the EN position.

---

## Section content (EN canonical)

### Heading
`## How this compares`

### Intro paragraph (≤4 lines, neutral voice)

> A few people land here asking: is this just a fork of [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), or is it just another starter template? Neither, and the table below is the honest map. Pick the column that fits how you work.

### Table (5–7 rows, three columns)

Columns (in this order, left to right):

1. **Solo Stack** (this repo)
2. **[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)**
3. **Starter templates** (e.g. `create-next-app`, vanilla Tailwind starters, T3 stack)

**Final row set (6 rows):**

| Dimension | Solo Stack | Everything Claude Code | Starter templates |
|-----------|------------|------------------------|-------------------|
| Audience | Solo founder running 2+ products at once | Engineers and AI dev teams | Web app newcomers and quick prototypers |
| Tone | Operator-first — the workflow comes before the code | Engineer-first — depth across language ecosystems | Framework-first — Next.js / Vite / etc. set the shape |
| Stack scope | Curated 6-component set with one opinionated install path | 182 skills + 48 agents across 12+ language ecosystems | Single framework + auth/db starter |
| Multi-harness | Claude Code only | Claude Code, Cursor, Codex, OpenCode, Gemini, Antigravity | Framework-specific |
| Real shipped proof | 4 anonymised case studies from one operator's products | Author's own product (`zenith.chat`) and template configs | None — meant as a starting point |
| Custom contributions | Workflows, cookbook of 12 recipes, 6 hooks, 5–7 originals skills | Vast skills + agents catalogue, two npm packages | Scaffold + boilerplate |

> Audience-fit shorthand: pick **Solo Stack** if you run several products at once and want a workflow as much as a config. Pick **Everything Claude Code** if you want the deepest skills + agents catalogue and multi-harness coverage. Pick a **Starter template** if you're starting your first web app and want one framework's happy path.

### Closing line (one sentence, neutral)

> Solo Stack and Everything Claude Code are designed to coexist — most readers here will install both.

**Total target length:** 30–50 lines of markdown including the table, intro, and closer.

---

## Tone rules (enforced before commit)

The section MUST avoid:

- Superlatives — no "best", "most", "ultimate", "easiest", "simplest"
- Marketing verbs — no "empower", "unleash", "supercharge", "leverage"
- Defensive framing — no "X is not just Y", "we are more than Z"
- Comparative inflation — no "unlike X" or "where X falls short"
- Bold-axiom maxims — e.g. *"the playbook is the product"*
- Emoji
- Capitalised superlative columns — no row labels like "VALUE" or "WINNER"

The section MUST use:

- Neutral verbs: *is, ships, covers, targets, provides, includes*
- Concrete numbers where they exist (182 skills, 48 agents, 4 case studies, 6 hooks)
- Direct addressing of audience-fit ("pick X if Y")
- Lower-case across most table cells (not Title Case Marketing Voice)
- Each row passes the "would I be happy if the ECC author read this" test

---

## TOC entries

**EN — `README.md`** (current TOC at lines 21–35):
- After line 32 (`- [Why this exists](#why-this-exists)`) and before line 33 (`- [Acknowledgements](#acknowledgements)`), insert:
  ```markdown
  - [How this compares](#how-this-compares)
  ```
- The GitHub-flavoured-markdown anchor for `## How this compares` resolves to `#how-this-compares` (lower-case, spaces → hyphens, no special characters in this heading).

**RU — `README.ru.md`** (current TOC at lines 21–32):
- Heading will be `## Как это сравнивается` (anchor `#как-это-сравнивается`).
- Insert TOC entry after `- [Зачем это нужно](#зачем-это-нужно)` and before `- [Благодарности](#благодарности)`:
  ```markdown
  - [Как это сравнивается](#как-это-сравнивается)
  ```

**ES — `README.es.md`** (current TOC at lines 21–32):
- Heading will be `## Cómo se compara` (anchor `#cómo-se-compara` — note: GitHub keeps the accented `ó` in the slug).
- Insert TOC entry after `- [Por qué existe](#por-qué-existe)` and before `- [Agradecimientos](#agradecimientos)`:
  ```markdown
  - [Cómo se compara](#cómo-se-compara)
  ```

---

## Translation strategy

### Principles

1. **Preserve structure.** Same row count (6), same column count (3), same column order. A reader who toggles between language tabs should see one-to-one alignment.
2. **Translate row labels naturally** — do not transliterate or calque awkwardly.
3. **Keep proper nouns in English.** "Everything Claude Code", "Solo Stack", "create-next-app", "Claude Code", "Cursor", "Codex", "OpenCode", "Gemini", "Antigravity", "Next.js", "Vite", "Tailwind", "T3 stack", "WhatsApp Cloud API", and other product names stay as-is.
4. **Numbers stay numerals** (182, 48, 4, 6, 12+).
5. **Same length budget** — RU and ES sections target the same 30–50 line bound. Russian compounds may run slightly longer per row; trim cell prose if a translation balloons past the EN line count.
6. **Cross-reference comment.** At the top of each translated section, add an HTML comment: `<!-- canonical: README.md § How this compares — keep in sync -->` so future edits propagate.

### RU translation key

| EN | RU |
|----|----|
| How this compares | Как это сравнивается |
| Audience | Аудитория |
| Tone | Голос |
| Stack scope | Объём стека |
| Multi-harness | Поддержка нескольких сред |
| Real shipped proof | Реально запущенное |
| Custom contributions | Что добавлено своего |
| Solo Stack | Solo Stack *(brand, untranslated)* |
| Starter templates | Стартовые шаблоны |
| Operator-first | Operator-first — оператор перед инженером |
| Engineer-first | Engineer-first — инженерная глубина |
| Framework-first | Framework-first — фреймворк задаёт форму |
| Solo founder running 2+ products at once | Соло-фаундер, который ведёт 2+ продукта одновременно |
| Engineers and AI dev teams | Инженеры и AI dev-команды |
| Web app newcomers and quick prototypers | Новички в веб-разработке и быстрые прототипы |

Closing line:
> Solo Stack и Everything Claude Code задуманы как совместимые — большинство читателей поставит и то, и другое.

Audience-fit shorthand:
> Коротко по аудитории: возьми **Solo Stack**, если ведёшь несколько продуктов одновременно и тебе нужен workflow, а не только конфиг. Возьми **Everything Claude Code**, если нужен самый глубокий каталог skills + agents и поддержка нескольких сред. Возьми **стартовый шаблон**, если делаешь свой первый веб-проект и хочешь happy path одного фреймворка.

### ES translation key

| EN | ES |
|----|----|
| How this compares | Cómo se compara |
| Audience | Audiencia |
| Tone | Voz |
| Stack scope | Alcance del stack |
| Multi-harness | Soporte multi-runtime |
| Real shipped proof | Productos realmente lanzados |
| Custom contributions | Aportes propios |
| Solo Stack | Solo Stack *(marca, sin traducir)* |
| Starter templates | Plantillas starter |
| Operator-first | Operator-first — el workflow antes que el código |
| Engineer-first | Engineer-first — profundidad por ecosistema |
| Framework-first | Framework-first — el framework define la forma |
| Solo founder running 2+ products at once | Fundador solo con 2+ productos al mismo tiempo |
| Engineers and AI dev teams | Ingenieros y equipos de AI dev |
| Web app newcomers and quick prototypers | Quienes recién arrancan con web apps y prototipos rápidos |

Closing line:
> Solo Stack y Everything Claude Code están pensados para coexistir — la mayoría de los lectores acá va a instalar los dos.

Audience-fit shorthand:
> En corto: agarrá **Solo Stack** si llevás varios productos en paralelo y querés un workflow además del config. Agarrá **Everything Claude Code** si querés el catálogo más profundo de skills + agents y soporte multi-runtime. Agarrá una **plantilla starter** si estás arrancando tu primera web app y querés el happy path de un solo framework.

---

## Implementation steps (numbered, ordered)

### Step 1 — Read surrounding prose (voice match)
Re-read `README.md` lines 256–276 (`## Why this exists` and `## Acknowledgements`) and the playbook section (lines 186–214). The new section's voice must match the surrounding paragraphs: short sentences, lower-case after the first word, concrete numbers, no marketing.

### Step 2 — Draft EN section in scratch
Write the full section (heading, intro, table, audience-fit shorthand, closer) in a scratch buffer first. Read it back twice; check every row against the tone rules. Confirm row count is 5–7, total lines 30–50.

### Step 3 — Insert EN section into `README.md`
- Insert the new section between current line 264 (`---` after "Why this exists") and line 266 (`## Acknowledgements`).
- Add the TOC entry (`- [How this compares](#how-this-compares)`) between current line 32 and line 33.
- Confirm a fresh `---` separator sits before `## Acknowledgements` after the insert.

### Step 4 — Verify EN section renders
- `grep -n "## How this compares" README.md` → expects exactly 1 match.
- `grep -n "How this compares" README.md` → expects exactly 2 matches (TOC entry + heading).
- Visual scan: open in a markdown previewer (or `gh repo view --web` if locally previewing); confirm the table renders with three columns and 6 rows.

### Step 5 — Translate to RU and insert into `README.ru.md`
- Use the translation key above; write the section body once in scratch.
- Insert between line 180 (`---` after `## Зачем это нужно`) and line 182 (`## Благодарности`).
- Add TOC entry between current line 29 and line 30.
- Add the canonical-sync HTML comment at the top of the new section.

### Step 6 — Translate to ES and insert into `README.es.md`
- Same as Step 5 but for ES; insert between line 180 and line 182; add TOC entry between current line 29 and line 30.
- Add the canonical-sync HTML comment.

### Step 7 — Verify all 3 anchors resolve
Run the verification grep block (see "Verification" below). Every anchor must resolve; line counts must match the budget.

### Step 8 — Update `CHANGELOG.md`
Add a single bullet under the unreleased section:
```markdown
- Add "How this compares" section to README, README.ru, README.es (P8.2)
```
Do not invent any other changes.

### Step 9 — Final sanitisation grep
Run the operator-domain grep (see "Verification") over the three modified READMEs. Must return zero matches.

### Step 10 — Stage and commit
```bash
git add README.md README.ru.md README.es.md CHANGELOG.md
git commit -m "docs(readme): add How this compares section in EN/RU/ES (P8.2)"
```

---

## Success criteria

1. `README.md` has a new H2 section `## How this compares` placed between `## Why this exists` and `## Acknowledgements`.
2. The section contains exactly one 3-column markdown table with 6 rows of body content, plus an intro paragraph (≤4 lines), an audience-fit shorthand line, and a closer line.
3. The total new section length sits between 30 and 50 lines of markdown.
4. `README.ru.md` has the parallel `## Как это сравнивается` section in the matching position with identical row count and column structure.
5. `README.es.md` has the parallel `## Cómo se compara` section in the matching position with identical row count and column structure.
6. Each of the three READMEs has a TOC entry pointing to the new section, and the anchor resolves on github.com.
7. The section references ECC by full URL (`https://github.com/affaan-m/everything-claude-code`) at least once.
8. The section contains zero superlatives (`best`, `most`, `ultimate`, `easiest`, `simplest`), zero marketing verbs (`empower`, `leverage`, `unleash`, `supercharge`), and zero "X is not Y" patterns.
9. The section contains zero emoji.
10. The section does not leak any operator-specific identifiers (real product URLs, real client names, OMEGA-specific paths).
11. `CHANGELOG.md` has a single P8.2 bullet under the unreleased section.
12. The 4 stub READMEs (`README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`) are not touched.

---

## Verification (grep commands)

Run from repo root after edits, before commit:

```bash
# 1. Section present in all three READMEs
grep -c "^## How this compares$" README.md          # expect 1
grep -c "^## Как это сравнивается$" README.ru.md     # expect 1
grep -c "^## Cómo se compara$" README.es.md          # expect 1

# 2. TOC entries present
grep -c "(#how-this-compares)" README.md            # expect 1
grep -c "(#как-это-сравнивается)" README.ru.md       # expect 1
grep -c "(#cómo-se-compara)" README.es.md            # expect 1

# 3. ECC URL present in EN section (link works)
grep -c "github.com/affaan-m/everything-claude-code" README.md   # expect ≥1

# 4. Section length budget — extract from heading to next ## and count
awk '/^## How this compares$/,/^## /' README.md | wc -l    # expect 30–55 lines

# 5. Banned words check (case-insensitive)
grep -niE "\b(best|most|ultimate|easiest|simplest|empower|leverage|unleash|supercharge)\b" README.md README.ru.md README.es.md
# expect zero matches inside the new sections (manual inspection of any hits — pre-existing prose may have legitimate uses)

# 6. Emoji check (rough — any high-codepoint char in the new section)
awk '/^## How this compares$/,/^## /' README.md | grep -P "[^\x00-\x7F]"
# expect zero matches in EN (RU/ES will have non-ASCII for translated text — only check EN)

# 7. Operator-domain sanitisation
grep -niE "(jarvis-workspace|niche-booking|brain-vault|mccarthy-internal)" README.md README.ru.md README.es.md
# expect zero matches

# 8. Stub READMEs untouched
git diff --name-only HEAD~1 -- README.pt-br.md README.tr.md README.zh.md README.ja.md
# expect empty output
```

If any check fails, fix before commit. The grep block is part of the success bar, not just a suggestion.

---

## Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tonal drift toward marketing voice while writing | High | High (defeats the section's purpose) | Step 1 explicitly re-reads surrounding prose before drafting. Step 2 keeps the section in scratch and reads it back twice. The verification grep blocks superlatives + marketing verbs as a hard check. |
| Defensive framing creeps in ("we are not just X") | Medium | High (reads as insecurity) | Tone rules explicitly ban "X is not Y" patterns. Closing line is explicitly cooperative ("designed to coexist"). |
| Row count balloons past 7 | Medium | Low | Hard cap of 7 stated in non-goals. Final row set fixed at 6 in this plan. |
| Translation goes stale when EN section changes | Medium (long-term) | Low | Add HTML comment at top of each translated section: `<!-- canonical: README.md § How this compares — keep in sync -->`. |
| RU/ES translations distort nuance | Low | Medium | Translation key in this PLAN.md fixes row labels and prose; agent does not improvise translations beyond the key. |
| ECC author reads this and feels mischaracterised | Low | High (relationship damage) | "Each row passes the would-the-ECC-author-be-happy test" is in tone rules. Numbers (182, 48, 12+ ecosystems) come straight from ECC's README — not estimates. ECC strengths are explicitly named, not buried. |
| Section length breaks budget | Low | Low | Step 7 verifies awk-extracted line count is 30–55 lines. |
| Touching the 4 stub READMEs by mistake | Low | Low | Explicit non-goal; verification grep #8 confirms they're untouched in the commit. |

---

## Estimated time breakdown

| Step | Time |
|------|------|
| 1. Read surrounding prose (voice match) | 5 min |
| 2. Draft EN section in scratch + tone-rule pass | 25 min |
| 3. Insert EN section + TOC entry | 5 min |
| 4. Verify EN section renders | 5 min |
| 5. Translate to RU + insert + TOC entry | 20 min |
| 6. Translate to ES + insert + TOC entry | 15 min |
| 7. Run verification grep block | 5 min |
| 8. Update CHANGELOG | 2 min |
| 9. Final sanitisation grep | 3 min |
| 10. Stage + commit | 5 min |
| **Total** | **~90 min (1.5h)** |

Sits in the middle of the ROADMAP's 1–2h estimate. If the EN draft takes longer than 25 min, the agent is over-engineering — return to the row set in this plan and trust it.

---

## Files affected

**Modified:**
- `README.md` — insert `## How this compares` section + TOC entry
- `README.ru.md` — insert `## Как это сравнивается` section + TOC entry
- `README.es.md` — insert `## Cómo se compara` section + TOC entry
- `CHANGELOG.md` — single bullet under unreleased

**Created:** none (text-only addition; no images, scaffolds, or asset files)

**Untouched (explicit):**
- `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md` — community PR will mirror the section into the stub languages later
- `assets/` — no images added in this phase
- All other repo content

---

## Notes for the executing agent

- The row labels and translation keys in this PLAN.md are the contract. If you find a row that you think reads better differently, propose the change to the user before writing — do not freelance.
- Read EN surrounding prose (lines 256–276 of `README.md`) before drafting. The voice match matters more than the table content.
- If the closing line "designed to coexist" reads forced after you write the section, replace with the simpler: "Most readers here will install both." — but no further softening.
- Do not add images, badges, mermaid diagrams, or links to external comparison sites. The whole section is text + one table.
