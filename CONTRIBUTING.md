# Contributing

Contributions are welcome. The stack is small on purpose — adds need to clear a bar.

## Code of Conduct

This project follows the [Contributor Covenant 2.1](CODE_OF_CONDUCT.md). By participating you agree to its terms. Reports go to `dimana503@gmail.com`.

## What's in scope

- Fixes to existing files (broken links, stale info, factual corrections)
- New stack components that solve a problem the existing six don't already solve
- New workflows for solo / small-team operators (not enterprise)
- New case studies of shipped products (your own only, with URLs anonymized at your discretion)
- New cookbook recipes (real shipped integrations, ≤200 lines each)
- New skills under `skills/` (must not duplicate ECC; see "Skill contributions" below)
- New slash-commands under `commands/` that wrap an existing skill
- Translations of `README.md` into other languages
- Better install scripts (Windows native, NixOS, etc.)
- Issue templates that catch real problems
- Long-form guides under `docs/` (deep dives extracted from the README, or new topics)
- E2E integration tests under `tests/`

## What's out of scope

- Adding skills or agents that duplicate Everything Claude Code (ECC) content. Link to ECC instead.
- Marketing pages, landing pages, branding work. This is a tool, not a product.
- Forks of the stack that just rename and repackage. Fork freely, but those are forks, not contributions.
- Tooling specific to one cloud provider, one stack, or one ecosystem unless it's clearly opt-in.
- Multi-harness `.cursor/`, `.codex/`, `.gemini/` config dirs. The stack is Claude Code-only by design — see [`docs/why-only-claude-code.md`](docs/why-only-claude-code.md) once that file lands.

## Dev setup

The repo is a pnpm/npm workspace. From a fresh clone:

```bash
git clone https://github.com/mccarthy606/claude-operator-stack.git
cd claude-operator-stack
npm install                          # installs root + workspaces
npm --workspace packages/cli run build
npm --workspace packages/cli test    # 65 tests, ~3s
```

If you're going to touch the WhatsApp scaffold:

```bash
cd scaffolds/whatsapp-saas
uv sync                              # generates uv.lock if missing
uv run pytest -q                     # 10 tests
uv run ruff check .                  # lint must be clean
```

If you're going to touch the web scaffold:

```bash
cd scaffolds/web-saas
npm install
npm run lint && npm run typecheck
```

Audit `install.sh` before running it on your real `~/.claude/`. The installer is designed to be safe (sidecar files, `--dry-run`, `--yes`), but read the script first regardless.

## How to contribute

1. **Open an issue first** for anything bigger than a typo. Five minutes of "is this in scope" beats hours of writing then rejection.
2. **Keep PRs small.** One change per PR. Multiple unrelated changes get bounced.
3. **Test locally** — run the relevant build and test commands above before submitting.
4. **Use clear commit messages** in conventional-commit shape: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`, `refactor: ...`, `test: ...`. Scope is optional but useful: `feat(cli): ...`, `docs(workflows): ...`.
5. **Read the prose out loud** before submitting. If it sounds like marketing copy or contains AI-slop patterns (antitheses "X is not Y. It is Z.", tricolons, "Without X. With X.", bold-axiom maxims, anaphora, "actually" / "essentially" / "earn its keep"), rewrite. See [`CLAUDE.md`](CLAUDE.md) §Voice for the operator-first standard.

## PR review process

What I look for, in order:

1. **In scope** — see the lists above. If unclear, an issue is the cheaper path.
2. **No new dependencies** without justification in the PR description. Especially in `packages/cli/` and the scaffolds.
3. **Tests pass** — `npm test` for the CLI, `pytest -q` for the WhatsApp scaffold, lint clean for both.
4. **Sanitisation** — no real product URLs, no real customer names, no API keys (even partial), no operator-private paths in committed files.
5. **Voice consistency** — operator-first, no marketing fluff, no emojis in docs unless the file already uses them.
6. **Attribution** — every new external component referenced gets a line in `credits/README.md` in the same PR.

I aim to review within 72h. If a PR sits longer, ping the issue.

## Translation contributions

Four stub translations live in the repo: `README.pt-br.md`, `README.tr.md`, `README.zh.md`, `README.ja.md`. Full translations are tracked as good-first-issues:

- [#1 PT-BR](https://github.com/mccarthy606/claude-operator-stack/issues/1)
- [#2 TR](https://github.com/mccarthy606/claude-operator-stack/issues/2)
- [#3 中文](https://github.com/mccarthy606/claude-operator-stack/issues/3)
- [#4 日本語](https://github.com/mccarthy606/claude-operator-stack/issues/4)

Use `README.ru.md` and `README.es.md` as full-translation references — they mirror the EN structure section by section. Keep the language nav in sync (only the current language is bold-unlinked; others are linked).

## Hook contributions

Hooks live under `configs/hooks/`. Each hook ships with its own `*.README.md` explaining what it does, when it fires, and the `settings.json` wiring snippet.

To add a hook:

1. Drop the script under `configs/hooks/<name>.{js,sh}`.
2. Write `configs/hooks/<name>.README.md` following the existing pattern (see `configs/hooks/statusline.README.md` as a reference).
3. Add a row to the table in `configs/hooks/README.md`.
4. Add the wiring block to `configs/hooks/hooks.json.example`.
5. The hook should be standalone — no dependencies beyond Node.js (or Bash for shell hooks). No project-local imports.

Hooks must not auto-commit, auto-push, send data over the network silently, modify files outside the working directory, or block on long-running operations without a timeout.

## Skill contributions

Original skills (not duplicating ECC) live under `skills/<name>/SKILL.md`. The 6 own skills shipped today target solo-founder use-cases ECC doesn't cover.

To add a skill:

1. Cross-check the name against [ECC's skill catalog](https://github.com/affaan-m/everything-claude-code/tree/main/skills) — name must not collide.
2. Create `skills/<name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <kebab-name>
   description: <single sentence — Claude uses this to decide when to fire>
   origin: claude-operator-stack
   ---
   ```
3. Body follows the fixed shape: `## When to Use → Inputs → How It Works (≥4 numbered steps) → Output → Anti-patterns → Related`.
4. Length 80-200 lines. The skill must be invocable, not just describe a workflow.
5. At least one cross-reference to a repo file (workflow, cookbook recipe, or stack doc).
6. Add a row to `skills/README.md` index.
7. If the skill should also be invocable as a slash-command, add a wrapper under `commands/<name>.md`.

## New cookbook recipe

Cookbook recipes live under `cookbook/`. Each one is a single integration done end-to-end, drawn from a real shipped product.

Shape:

1. **The problem** — the scenario that triggers using this recipe (1-2 paragraphs)
2. **Solution overview** — the key idea before any code (2-3 paragraphs)
3. **Step-by-step** — commands and code, in order
4. **Pitfalls** — what broke the first time (3-6 bullets)
5. **References** — official docs and related recipes

Hard cap: ~200 lines. If a recipe outgrows that, split it. Recipes assume the reader has already installed the [stack](stack/).

## New case study

Case studies live under `case-studies/`. Each describes one shipped product with URLs anonymized.

Required sections:

- The market hypothesis
- The shape of the product
- The stack and why
- What got shipped (concrete features that exist)
- What's open (the honest list of unfinished)
- What I'd do differently in v2
- Estimated time + cost
- Lessons that transferred elsewhere

No customer names, no real URLs, no exact revenue. Patterns and lessons only.

## Style

- Markdown files: under ~400 lines unless there's a strong reason
- Code blocks: language-tagged so syntax highlighting works
- Tables for comparisons; bullets for lists; prose for arguments
- No emojis in docs unless the file already uses them
- Attribute every external claim with a link
- No marketing fluff in case studies — describe what was built, what worked, what didn't
- Cross-links use relative paths (`workflows/x.md`), never absolute URLs to github.com unless pointing at external repos

## License

By contributing, you agree your contribution is licensed under MIT (the same as the rest of the stack).

## Recognition

Contributors are listed in the README and in `credits/README.md` once their PR is merged. If you'd prefer not to be listed, say so in the PR.

## Questions

Open a GitHub Discussion if you want to talk through an approach before writing the PR. Issues are for bugs and concrete feature proposals; Discussions are for "should I do X?" or "how does Y work?".
