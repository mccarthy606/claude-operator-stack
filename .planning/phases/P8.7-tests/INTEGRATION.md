# INTEGRATION.md — coordinated README + CONTRIBUTING delta for P8.7

This file stages the README.md and CONTRIBUTING.md edits that Phase 8.7
introduces but does **not** commit. Phase 8 has many parallel waves all
editing README.md; landing one wave's edit per commit produces merge
churn. The coordinator pass at the end of Phase 8 picks up snippets from
each wave's `INTEGRATION.md` and lands them in a single commit.

## 1. README.md — "What's Inside" tree delta

Add the `tests/` block under the project's repository tree (typically
near the existing `packages/`, `configs/`, `stack/` entries). Insert
above any "case-studies" / "credits" entries to keep test-related
infrastructure grouped near `packages/`.

```text
tests/                                  # E2E integration suite
  integration/
    install-sh.test.sh                  # bash, asserts install.sh dry-run is HOME-safe
    cli-init.test.ts                    # vitest, asserts init wizard end-to-end
    cli-verify.test.ts                  # vitest, asserts verify exit-code matrix + JSON
    cli-list-stack.test.ts              # vitest, asserts 6-component stack contract
  run-all.sh                            # build + vitest + bash loop
  vitest.config.ts                      # 30s timeout, no coverage
  README.md                             # testing strategy + isolation guarantees
```

If README.md uses translated-tree blocks (it does — `README.es.md`,
`README.ru.md`, etc. mirror the structure), apply the same insertion
to each translated tree. Translation of comments is fine; preserve the
filenames verbatim.

## 2. CONTRIBUTING.md — new "Tests" section

Insert this section above any existing "Pull request workflow" /
"Style" sections, immediately after the project's "Setup" or "Local
development" block.

```markdown
## Tests

Two layers:

- **Unit tests** — `packages/cli/tests/`. Run with `npm test`.
  Fast (<10s), mocks external dependencies, asserts branch coverage.
- **Integration tests** — `tests/integration/`. Run with `npm run test:integration`.
  Slower (~30s wall-clock on a clean machine), spawns the real CLI
  binary, asserts the bash installer is HOME-safe.

Before sending a PR:

```bash
npm test
npm run test:integration
```

Both suites use freshly-minted tmp directories (`mkdtempSync` /
`mktemp -d`) for every HOME and `--claude-dir` override. Neither
suite touches your real `~/.claude/`. See `tests/README.md` for the
isolation guarantees in detail.
```

## 3. Notes for the coordinator

- The README tree block above is the **canonical** structure for the
  `tests/` directory. Future test additions update the same block.
- Do **not** add a "Testing" subsection to the main README front matter.
  README.md is operator-facing (it sells the stack); test details belong
  in CONTRIBUTING.md and `tests/README.md`.
- Phase 9's pre-flip checklist references `npm run test:integration` as
  one of the gating commands. The script must remain reachable as
  `bash tests/run-all.sh` from the repo root.
