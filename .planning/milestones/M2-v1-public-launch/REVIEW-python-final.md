# Python review final (v3) — opus 4.7

**Date:** 2026-05-05
**Scope:** `scaffolds/whatsapp-saas/` final pre-flip regression check
**Baseline:** v2 OK / NO REGRESSION (commit `1466ed2` — uv.lock added)

## Summary

- Files reviewed: 11 (full scaffold tree, with focus on the 2 modified files)
- Findings: **CRITICAL 0 · HIGH 0 · MEDIUM 0 · LOW 0**
- **Verdict: OK — NO REGRESSION**

Two minor post-v2 micro-edits landed inside the scaffold (one `from err` exception chain, one test formatting cleanup, plus removal of a now-unused `noqa: BLE001`). They are net improvements, not regressions. Every v1 + v2 fix survives. `uv sync` clean, `ruff check .` reports "All checks passed!", `pytest -q` reports `10 passed in 8.26s`.

The `tail -10` ruff window in v2 had captured stale pre-existing lints; with the `from err` and `noqa` cleanup applied in `2ceb123` ("close all CRITICAL + HIGH + MED + LOW from review v2"), ruff is now fully clean — so v3 is strictly better than v2 on lint surface.

Ship-ready.

## Diff vs baseline

`git diff 1466ed2..HEAD -- scaffolds/whatsapp-saas/` returns **two file changes**, both cosmetic / quality-positive:

### `app/webhook.py` — 2 hunks

```diff
@@ -43,8 +43,8 @@ async def verify_webhook(request: Request) -> int:
     if mode == "subscribe" and token == settings.wa_verify_token and challenge:
         try:
             return int(challenge)
-        except ValueError:
-            raise HTTPException(status_code=400, detail="invalid challenge")
+        except ValueError as err:
+            raise HTTPException(status_code=400, detail="invalid challenge") from err
```

This is **B904** (raise-without-from-inside-except) compliance. Adds proper exception chaining. Ruff-positive, semantically equivalent at the wire (FastAPI returns the same 400 either way).

```diff
@@ -173,7 +173,7 @@ async def handle_message(message: InboundMessage) -> None:
                     logger.info("reply_skipped_session_expired", extra={"sender": sender})
                 else:
                     logger.warning("reply_send_failed", extra={"status": err.status})
-    except Exception:  # noqa: BLE001
+    except Exception:
```

The `noqa` was no longer needed because `BLE001` was already removed from the active ruff selection (or the swallowed-exception heuristic on this exact line is satisfied by the comment block + `logger.exception` immediately below). Drive-by cleanup. **Note:** the broad `except Exception` here is intentional and well-justified by the inline comment ("one bad message must not stop the batch or trigger a Meta retry storm") — so even if ruff did still flag it, the code is correct. Today ruff is silent. Confirmed clean.

### `tests/test_webhook.py` — 2 hunks

```diff
@@ -122,7 +122,10 @@ async def test_inbound_message_classifies_and_replies() -> None:
             "app.webhook.classify_message",
             new=AsyncMock(return_value=ClassificationResult(label="question", raw="question")),
         ),
-        patch("app.webhook.send_text", new=AsyncMock(return_value={"messages": [{"id": "x"}]})) as send_mock,
+        patch(
+            "app.webhook.send_text",
+            new=AsyncMock(return_value={"messages": [{"id": "x"}]}),
+        ) as send_mock,
```

Pure line-length / black-style reformat. Ruff `E501` cleanup. No semantic change.

```diff
@@ -136,7 +139,7 @@ async def test_inbound_message_classifies_and_replies() -> None:
     send_mock.assert_awaited_once()
-    args, kwargs = send_mock.call_args
+    kwargs = send_mock.call_args.kwargs
     assert kwargs.get("to_number") == "5491111111111"
```

Removes unused `args` (ruff `F841`) and uses the cleaner `.kwargs` accessor on `call_args`. Equivalent runtime behaviour, slightly more idiomatic.

**Verdict on diff:** all four edits are quality-positive cleanup against ruff. No regression vector.

## Suite output

### `uv sync 2>&1 | tail -5`

```
Resolved 74 packages in 22ms
Checked 72 packages in 13ms
```

Lockfile resolves cleanly, no advisory or version drift since v2. (v2 reported the same 74 packages.)

### `uv run ruff check . 2>&1 | tail -5`

```
All checks passed!
```

Strict improvement over v2, which had 4 stale LOW ruff lints. The `from err` chain and the `args` removal in the post-v2 cleanup commit closed every one of them.

### `uv run pytest -q 2>&1 | tail -10`

```
..........                                                               [100%]
10 passed in 8.26s
```

All 10 tests pass. Faster than v2's 78.79s (10x speedup — v2's slowness was probably first-run cold-import cost; warm runs are ~8s, normal). Test inventory:

```
tests/test_reply.py::test_send_text_posts_to_meta_with_auth_header
tests/test_reply.py::test_send_text_raises_on_4xx
tests/test_webhook.py::test_verify_handshake_returns_challenge
tests/test_webhook.py::test_verify_handshake_rejects_wrong_token
tests/test_webhook.py::test_inbound_message_classifies_and_replies
tests/test_webhook.py::test_inbound_rejects_bad_signature
tests/test_webhook.py::test_healthz_ok
tests/test_webhook.py::test_inbound_duplicate_message_skipped
tests/test_webhook.py::test_inbound_session_expired_logs_and_swallows
tests/test_webhook.py::test_inbound_non_text_message_ignored
```

8 in `test_webhook.py` + 2 in `test_reply.py` = 10. The brief mentions "10 tests in test_webhook.py" but the real shape (verified in v2) is 8+2; this matches the suite v2 signed off on.

## Ship-readiness check

| Check | Where | Status |
|---|---|---|
| Anthropic model ID is `claude-sonnet-4-5` (not `-4-6`) | `app/deps.py:50` (`classifier_model: str = "claude-sonnet-4-5"`) | OK |
| Same default also in `.env.example` | not re-checked this round; v2 confirmed at `.env.example:22` and not in diff | OK (unchanged since v2) |
| `app/deps.py` uses `anthropic.AsyncAnthropic` | `app/deps.py:67-69` (`anthropic.AsyncAnthropic(api_key=...)` inside `get_anthropic_client`) | OK |
| `app/deps.py` uses `acreate_client` for Supabase | `app/deps.py:20-25` (try-import) and `:86-94` (await call site) | OK |
| 10 tests pass in `tests/test_webhook.py` (suite-wide) | pytest output above; 8 in test_webhook + 2 in test_reply = 10 collected, 10 passed | OK |
| `Dockerfile` healthcheck closes the urllib response | `Dockerfile:46-50` — `r = urllib.request.urlopen(...); ok = r.status == 200; r.close(); sys.exit(...)` | OK |
| No real WhatsApp Business numbers (`EAA*` access tokens, `wa_phone_number_id`) | grep `EAAB|EAAH|EAAA` in `app/` and `tests/` returns no hits | OK |
| No real Anthropic keys (`sk-ant-...`) | only `sk-ant-test` placeholders in `tests/conftest.py:22`, `tests/test_reply.py:25`, `tests/test_webhook.py:34` | OK |
| No real Supabase project refs (`*.supabase.co`) | only `https://test.supabase.co` placeholders in `tests/conftest.py:23`, `tests/test_webhook.py:35`, `tests/test_reply.py:26` | OK |

All credential-shaped strings in the codebase are clearly-marked test fixtures (`sk-ant-test`, `test.supabase.co`). No real keys, no real numbers, no real project refs. Safe to publish.

## Regression check matrix — every v1+v2 fix still in place

### CRITICAL fixes (from v1, re-verified at v2, re-verified now)

| Fix | Where | Status |
|---|---|---|
| `claude-sonnet-4-5` default in deps | `app/deps.py:50` | OK |
| `anthropic.AsyncAnthropic` in deps factory | `app/deps.py:67-69` | OK |
| `acreate_client` / `AClient` for supabase | `app/deps.py:20-25, 75-95` | OK |

(The other v1/v2 fixes — webhook background offload, signature verification, dedup, `await get_supabase()`, healthcheck close, `uv.lock` present — were untouched by the post-v2 diff and remain intact.)

## Recommendations

None required for ship.

Optional (post-flip, non-blocking):

1. **Bump `uv` pin in Dockerfile** — `0.5.10` is on the older side now; once first users start cloning, a refresh to a current uv pin (whatever's stable at flip-time) keeps the image build resilient. Not urgent.
2. **Drop the `_HAS_ASYNC_SUPABASE` fallback once `supabase>=2.10` is locked** — the fallback in `app/deps.py:22-27` is dead code as long as `pyproject.toml` keeps the `supabase>=2.10.0` floor (which it does). Could simplify in a follow-up. Not urgent — defensive code is fine.
3. **Consider parametrizing `TestClient` setup into a shared fixture** — three test files independently `monkeypatch.setenv` the same env block. Minor DRY win, not a regression.

None of these are blocking. Scaffold is **green-to-flip**.
