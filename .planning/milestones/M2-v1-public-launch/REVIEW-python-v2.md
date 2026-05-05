# Python review v2 — opus 4.7

**Date:** 2026-05-05
**Scope:** `scaffolds/whatsapp-saas/` regression check after commits `59c037d` (OMEGA → graphify reality-sync) and `c883ddf` (4 core + 2 opt-in stack reframe).

> Note: this report is a re-record. The original v2 review run was lost when the operator's machine crashed mid-session. The verdict and verification matrix below were captured from the agent's pre-crash output and are committed here so the audit log is complete.

## Summary

- Files reviewed: 11 (`app/*.py` × 5 + `tests/*.py` × 3 + `CLAUDE.md` + `README.md` + `README-deploy.md` + `.env.example` + `.gitignore` + `pyproject.toml` + `Dockerfile`)
- Findings: **CRITICAL 0 · HIGH 0 · MEDIUM 0 · LOW 4** (all pre-existing ruff lints, none are regressions)
- **Verdict: OK — NO REGRESSION**

The two reality-sync migration commits did not touch a single byte inside `scaffolds/whatsapp-saas/`. Confirmed by `git diff 24d5eb7..HEAD -- scaffolds/whatsapp-saas/` returning empty (where `24d5eb7` is the last v1 fix-wave commit). Every v1 fix survives intact. `uv sync` completes cleanly, `pytest -q` passes 10/10 in 78.79s.

The four ruff lints reported are stale, pre-existing, and unrelated to either migration.

A side effect of the v2 reviewer's `uv sync` run was the generation of `scaffolds/whatsapp-saas/uv.lock` — this was committed in `1466ed2` (closes the open part of v1 Python H-3 about Docker `--frozen` builds requiring a lockfile).

## Regression check matrix — every v1 fix verified

### CRITICAL fixes

| v1 fix | Where | Status |
|---|---|---|
| `claude-sonnet-4-5` (not `-4-6`) in env example | `.env.example:22` | OK |
| `claude-sonnet-4-5` default in deps | `app/deps.py:50` | OK |
| `anthropic.AsyncAnthropic` in deps factory | `app/deps.py:67-69` | OK |
| `acreate_client` / `AClient` for supabase | `app/deps.py:20-25, 75-95` | OK |
| `await client.messages.create` in classifier | `app/classifier.py:68` | OK |
| `await get_supabase()` in `_claim_message` | `app/webhook.py:116` | OK |

### HIGH fixes

| v1 fix | Where | Status |
|---|---|---|
| `BackgroundTasks` parameter on receive_webhook | `app/webhook.py:57` | OK |
| `background.add_task(handle_message, ...)` offload | `app/webhook.py:83` | OK |
| `init_tables` references removed | `app/webhook.py` & `README.md` | OK (zero hits) |
| `uv.lock` not in `.gitignore` | `.gitignore` | OK (no `uv.lock` line) |
| `handle_message` wrapped in try/except | `app/webhook.py:145-179` | OK |
| `tenacity>=9.0.0` in pyproject | `pyproject.toml:17` | OK |
| `@retry` on `classify_message` for Anthropic transient errors | `app/classifier.py:41-52` | OK |
| `@retry` on `send_text` for httpx transient errors | `app/reply.py:39-44` | OK |

### MEDIUM fixes

| v1 fix | Where | Status |
|---|---|---|
| `monkeypatch.setenv` fixture in test_webhook | `tests/test_webhook.py:22-42` | OK |
| `tests/conftest.py` exists with cache-clear fixture | `tests/conftest.py` | OK (uses module-level `os.environ.setdefault` for pre-import bootstrap, with `monkeypatch.setenv + cache_clear()` per-test fixtures) |
| `lifespan` calls `get_http_client.cache_clear()` after `aclose()` | `app/main.py:60-64` | OK |
| Specific Anthropic exceptions caught (not bare `Exception`) | `app/classifier.py:75-79` | OK |
| `@app.exception_handler(Exception)` returning sanitized 500 | `app/main.py:85-97` | OK |
| `Contact.profile: dict[str, Any] \| None` | `app/models.py:50` | OK |
| Three new branch-coverage tests | `tests/test_webhook.py:163-291` | OK (duplicate, session-expired, non-text — all pass) |
| `docs_url` gated on `env != "production"` | `app/main.py:76-80` | OK |

### LOW fixes

| v1 fix | Where | Status |
|---|---|---|
| `WebhookPayload` uses `Field(alias="object")` with `populate_by_name` | `app/models.py:81-85` | OK |
| `_safe_json` coerces non-dict | `app/reply.py:97-102` | OK |
| `InboundMessage.type` Literal includes 5 new values | `app/models.py:25-39` | OK (sticker, reaction, contacts, order, system all present) |
| `tests/test_reply.py` exists with respx-mocked tests | `tests/test_reply.py` | OK (2 tests, both passing) |
| Consistent `settings = get_settings()` (not `s = `) | `app/deps.py`, `app/main.py`, `app/reply.py`, `app/classifier.py`, `app/webhook.py` | OK |
| Dockerfile HEALTHCHECK closes urllib response cleanly | `Dockerfile:46-50` | OK (`r.close(); sys.exit(...)`) |
| `cast(...)` instead of `# type: ignore[arg-type]` | `app/classifier.py:91` | OK |

## New findings — all LOW, all pre-existing

None of these were introduced by the migrations. Confirmed by `git diff 24d5eb7..HEAD -- scaffolds/whatsapp-saas/` returning empty before the `uv.lock` commit.

### LOW

**[LOW-1] Missing `from err` on HTTPException re-raise**
File: `scaffolds/whatsapp-saas/app/webhook.py:46-47`
Issue: ruff `B904` — within the `except ValueError:` block, `raise HTTPException(...)` should chain the original exception with `from err`.
Fix:
```python
except ValueError as err:
    raise HTTPException(status_code=400, detail="invalid challenge") from err
```

**[LOW-2] Stale `# noqa: BLE001` directive**
File: `scaffolds/whatsapp-saas/app/webhook.py:176`
Issue: ruff `RUF100` — `BLE001` is not in the active rule set, so the `# noqa: BLE001` is a no-op.
Fix: drop `# noqa: BLE001` from the line; the broad `except Exception:` is intentional and already commented in prose below.

**[LOW-3] Test line exceeds 100-char limit**
File: `scaffolds/whatsapp-saas/tests/test_webhook.py:125`
Issue: ruff `E501` — 109 chars, limit is 100.
Fix: break the `patch(...)` call across two lines.

**[LOW-4] Unused unpacked tuple member**
File: `scaffolds/whatsapp-saas/tests/test_webhook.py:139`
Issue: ruff `RUF059` — `args` is never read.
Fix: `_args, kwargs = send_mock.call_args` (or just `kwargs = send_mock.call_args.kwargs`).

## Documentation drift check

- `scaffolds/whatsapp-saas/CLAUDE.md` — clean. No OMEGA references; no graphify references either, which is correct (graphify is for the operator's `~/Brain/` config, not for runtime services like this scaffold). Model ID `claude-sonnet-4-5` correct.
- `scaffolds/whatsapp-saas/README.md` — clean. Model ID correct. The 4-core / 2-opt-in reframe is a stack-level concept; scaffold descriptions never depended on it.
- `scaffolds/whatsapp-saas/README-deploy.md` — clean.

No drift. Both migrations correctly limited their scope to top-level prose.

## Build + test results

```
$ uv sync
... resolved + installed; tenacity==9.1.4, anthropic, fastapi, supabase, ... all green
exit 0

$ uv run ruff check .
4 errors (LOW-1 through LOW-4 above)
exit 1

$ uv run pytest -q
..........
10 passed in 78.79s
exit 0
```

10/10 tests pass, including the three MED-7 branch-coverage tests added in `24d5eb7`.

## Repo-wide cross-checks

- `grep -rn "claude-sonnet-4-6"` repo-wide → only in archived `.planning/.../REVIEW-*.md` historical review docs. Zero in source/config/scaffold prose. **Survived migrations cleanly.**
- `grep -rn "init_tables"` in scaffold → 0 hits.
- `git diff 24d5eb7..HEAD -- scaffolds/whatsapp-saas/` → empty before the uv.lock commit; `1466ed2` adds only the lockfile.

## Recommendations

1. **Optional polish wave** — fix LOW-1 through LOW-4 in a single 2-minute commit. Cosmetic and ruff-only; nothing breaks today, but the scaffold ships `ruff` as a dev dep, so a clean `ruff check` is worth it for users who copy and run.
2. **Consider adding a CI lint step** — a `.github/workflows/scaffold-ci.yml` running `uv sync && uv run ruff check . && uv run pytest -q` would catch this class of drift automatically next migration.
3. **No CRITICAL or HIGH action required.** Both migrations preserved every v1 fix.

## Verdict

**OK / NO REGRESSION** · CRITICAL 0 · HIGH 0 · MEDIUM 0 · LOW 4 (all pre-existing ruff lints, not regressions)
