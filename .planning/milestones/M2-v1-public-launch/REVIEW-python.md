# Python review — opus 4.7

**Date:** 2026-05-04
**Scope:** scaffolds/whatsapp-saas/ — Python, FastAPI, Anthropic SDK, Supabase, Sentry, Docker, pytest.

## Summary

- Files reviewed: 18 (8 Python source/test files, pyproject.toml, Dockerfile, docker-compose.yml, .dockerignore, .env.example, .gitignore, CLAUDE.md, README.md, README-deploy.md)
- Findings: CRITICAL 2 · HIGH 5 · MEDIUM 8 · LOW 9
- Runs after `cp + .env + uv sync + uv run uvicorn app.main:app`? **WITH-FIXES** — uvicorn will start and the verification handshake will pass, but the first inbound text message will fail because `CLASSIFIER_MODEL=claude-sonnet-4-6` is not a real Anthropic model ID. Process will not crash; classifier will catch the 404 and silently fallback to `"spam"`, which is a worse failure mode than crashing.
- Tests pass after `uv run pytest`? **YES** — the 5 tests in `tests/test_webhook.py` mock the Anthropic and Supabase clients, so neither the bad model ID nor the sync-in-async problem surfaces in CI. Tests pass while the real handler is broken — a classic test-mocks-the-bug case.

## Verdict per area

- Python correctness: **NEEDS-WORK** — modern typing (`from __future__ import annotations`, `|` unions, `dict[str, str]`) is consistently applied. Public functions have hints. The blocker is the sync clients used inside `async def` handlers.
- FastAPI idioms: **OK** — `lifespan` context, `APIRouter` with prefix/tags, dependency factories cached with `lru_cache`. Missing `BackgroundTasks` for offloading slow work and missing global exception handler. No CORS, but this is webhook-only so that's fine.
- Webhook handling (HMAC + idempotency): **GOOD on HMAC, NEEDS-WORK on idempotency.** Signature is verified against `await request.body()` raw bytes with `hmac.compare_digest` and `sha256=` prefix check — this is the exact pattern Meta requires and it is the most common bug. The dedupe path uses the sync supabase client inside an async handler and references a missing `init_tables` helper.
- Anthropic SDK usage: **NEEDS-WORK** — sync client used in async handler (event-loop blocker), model ID is fictional, no retry/backoff for 429/5xx, no `tool_use`/structured output for the classifier (it parses text and falls back to `"spam"` on any parse miss).
- Supabase usage: **NEEDS-WORK** — `supabase-py` 2.10 ships an async client (`acreate_client` / `AClient`) but the scaffold uses the sync `create_client`/`Client`. Service-role key is server-side only, which is correct.
- Sentry init: **OK** — DSN-from-env, denylist extended with the signature header (the recipe-quality detail), `send_default_pii=False`, FastAPI integration. Init runs inside `lifespan`, which means the very first request can theoretically arrive before init completes — harmless in practice but worth noting.
- pyproject.toml: **OK** — `requires-python >= 3.12`, real version pins (`>=` floors, no `*`), PEP 735 `[dependency-groups]`, ruff configured with sensible rules. No `[build-system]` block; uv treats this as an application project and skips the build, which is fine.
- Dockerfile + compose: **OK** — multi-stage with `python:3.12-slim`, uv pinned to a real release tag (`0.5.10`), `--no-install-project` then full `uv sync` for cache friendliness, non-root user, `HEALTHCHECK` wired, `EXPOSE 8000` matches the bind. `.dockerignore` is correct. `docker-compose.yml` env-from-file, no inline secrets.
- Tests: **OK on coverage of the routes, NEEDS-WORK on what they actually verify.** Five tests cover verification handshake (pass + fail), inbound happy path, bad signature, and `/healthz`. They mock `_claim_message`, `classify_message`, and `send_text`, which means the tests will pass even when the real classifier model ID is wrong and the real dedupe is sync-in-async. No test for the duplicate-message path or the `WhatsAppSendError` branch in `handle_message`.

---

## CRITICAL

### [CRITICAL] Anthropic model ID `claude-sonnet-4-6` is not a real model

**File:** `.env.example:22`, `app/deps.py:40` (default value)

**Issue:** The default `CLASSIFIER_MODEL` is `claude-sonnet-4-6`. There is no Anthropic model with that ID. As of late 2025/early 2026 the canonical IDs follow the pattern `claude-sonnet-4-5-<date>`, `claude-opus-4-5`, etc. The Cloud API will return a 400 `not_found_error` on the very first inbound message.

The failure mode is worse than a crash: `app/classifier.py:50` catches `Exception` and returns `ClassificationResult(label="spam", raw="")`. So every inbound message will be silently classified as spam, no auto-reply will be sent, and the operator will not know the integration is broken until they wonder why no `question` replies are firing. Sentry will capture the exception via `logger.exception`, which helps, but the user-visible behavior is "the bot is silent."

**Fix:** Pin to a real model ID. Two options:

1. Date-pinned for reproducibility: `claude-sonnet-4-5-20250929` (or whichever release is current at v1 ship — verify against `https://docs.anthropic.com/en/docs/about-claude/models`).
2. Alias for auto-upgrade: `claude-sonnet-4-5`.

Update both `.env.example:22` and the default in `app/deps.py:40`. The CLAUDE.md and README also reference `claude-sonnet-4-6` in three places — fix those too.

### [CRITICAL] Sync Anthropic + sync Supabase clients used inside `async def` handlers

**File:** `app/deps.py:57-65`, `app/classifier.py:43`, `app/webhook.py:114`

**Issue:** `get_anthropic_client()` returns `anthropic.Anthropic` (sync). `get_supabase()` returns `supabase.Client` (sync). Both are called from `async def` handlers:

- `classifier.py:43`: `response = client.messages.create(...)` blocks the event loop for the full Anthropic round-trip (typically 0.5–3s).
- `webhook.py:114`: `supabase.table("inbound_dedupe").insert(...).execute()` blocks the event loop for the Supabase round-trip.

Under any concurrency (Meta retries on 5xx and can fan out), this serialises requests onto the single event-loop thread. uvicorn's default worker count is 1; without `--workers N` or moving to threads, the service degrades to single-request-at-a-time as soon as load picks up. Worse, a slow Anthropic call will hold up unrelated webhook deliveries from Meta and trigger Meta's retry logic, which causes the dedupe table to actually do its job — masking the bug as "duplicates" rather than "blocked event loop."

**Fix:** Use the async clients.

```python
# app/deps.py
import anthropic
from supabase import acreate_client, AClient

@lru_cache(maxsize=1)
def get_anthropic_client() -> anthropic.AsyncAnthropic:
    s = get_settings()
    return anthropic.AsyncAnthropic(api_key=s.anthropic_api_key)

# Supabase async client construction is itself async — cache the coroutine
# result on app startup in `lifespan` and stash on app.state, or accept
# a small wrapper:
_supabase: AClient | None = None

async def get_supabase() -> AClient:
    global _supabase
    if _supabase is None:
        s = get_settings()
        _supabase = await acreate_client(s.supabase_url, s.supabase_service_role_key)
    return _supabase
```

Then `classifier.py` becomes `response = await client.messages.create(...)` and `webhook.py:_claim_message` becomes `await (await get_supabase()).table(...).insert(...).execute()` (or stash the client on `app.state` in lifespan and inject via `Depends`).

This is the highest-impact fix on the list. The brief explicitly called it out.

---

## HIGH

### [HIGH] `init_tables` is referenced in code and README but does not exist

**File:** `app/webhook.py:111` (docstring), `README.md:64`

**Issue:** The `_claim_message` docstring says *"The table is created lazily on first use (see `init_tables` in deps)."* The README customisation section says *"Edit the dedupe + leads schema in `app/deps.py` (the `init_tables` helper)."* There is no `init_tables` symbol in `app/deps.py`. The dedupe table actually needs to be created via the SQL in `README-deploy.md:11-15` before the first request — otherwise the first POST will throw an undefined-table error and (because the catch-all in `_claim_message` swallows non-`23505` errors as "process anyway") the message will be processed but never deduped, and Sentry will see a different error class than the docstring suggests.

**Fix:** Either implement an actual `init_tables()` helper that runs in `lifespan` and CREATE-IF-NOT-EXISTS the dedupe table, or remove the references in both `webhook.py` and `README.md` and rely solely on the SQL in `README-deploy.md`. The latter is simpler and more honest.

### [HIGH] Webhook handler blocks on Anthropic + outbound httpx before returning 200

**File:** `app/webhook.py:74-82`

**Issue:** Meta's docs recommend returning 200 within a few seconds; longer responses risk delivery retries and (under load) webhook subscription degradation. The current handler iterates entries → changes → messages and `await`s `handle_message`, which itself awaits `classify_message` (Anthropic call, ~1–3s) and possibly `send_text` (Meta call, ~200–500ms). For a payload with multiple messages, those run sequentially. A bad-day p99 here easily exceeds 5s.

The brief explicitly mentions this: *"Returns 200 quickly, doesn't block on long Anthropic calls (offload via background task or queue)."*

**Fix:** Use FastAPI's `BackgroundTasks` to offload `handle_message` after returning 200:

```python
from fastapi import BackgroundTasks

@router.post("/whatsapp")
async def receive_webhook(request: Request, background: BackgroundTasks) -> dict[str, str]:
    raw = await request.body()
    # ... signature + parse ...
    for entry in payload.entry:
        for change in entry.changes:
            for message in change.value.messages:
                if not await _claim_message(message.id):
                    continue
                background.add_task(handle_message, message)
    return {"status": "ok"}
```

For higher scale, replace `BackgroundTasks` with a real queue (Postgres `LISTEN/NOTIFY`, Redis Streams, or a worker process). For v1, `BackgroundTasks` is the right call.

Bonus improvement once async clients are in place: `asyncio.gather(*[handle_message(m) for m in messages])` to parallelise per-payload.

### [HIGH] Dockerfile uses `--frozen` but the scaffold ships no `uv.lock`

**File:** `Dockerfile:17,19,23`

**Issue:** `COPY pyproject.toml uv.lock* ./` uses a glob to tolerate a missing lockfile, then `uv sync --frozen --no-install-project` and `uv sync --frozen` will both fail if `uv.lock` is absent. The `.gitignore` (line 14) excludes `uv.lock`, so a fresh `cp scaffolds/whatsapp-saas/ ~/Projects/foo/` followed by `docker compose up --build` will fail on the first `uv sync --frozen` step.

The intended workflow is presumably: `uv sync` locally first (which generates the lockfile), then `docker build`. This is a reasonable flow but it is not documented in the README install section and the user will hit a confusing error otherwise.

**Fix:** Three options ranked by preference:

1. Commit a baseline `uv.lock` to the scaffold (and remove the entry from `.gitignore`). This is what most uv-using scaffolds do — the lockfile is part of the scaffold.
2. Document the order in README: "Run `uv sync` once locally before `docker compose up --build` to generate `uv.lock`."
3. Drop `--frozen` from the first `uv sync` in the Dockerfile and accept slower/non-reproducible builds. Worst option.

Option 1 is the standard answer.

### [HIGH] `webhook.py` mutates per-message state inside three nested loops with no error isolation

**File:** `app/webhook.py:74-82`

**Issue:** A single message that throws inside `handle_message` will propagate up, abort the loop, and the remaining messages in the same payload will be skipped entirely. They will not be re-delivered by Meta because Meta only retries on 5xx and the exception will bubble to FastAPI's default 500 handler, returning a 500 — which now triggers a Meta retry, which will hit the dedupe table for the messages that *did* succeed and skip them, but the messages *after* the failure will be reprocessed cleanly.

So the practical effect is "one bad message poisons the rest of the batch and forces Meta to re-deliver, which mostly works because of dedupe." It is correct under the dedupe invariant but wasteful and surprising.

**Fix:** Wrap the per-message call in try/except and log:

```python
for message in change.value.messages:
    if not await _claim_message(message.id):
        continue
    try:
        await handle_message(message)
    except Exception:
        logger.exception("handle_message_failed", extra={"id": message.id})
        # Continue processing the rest of the batch.
```

Combined with the BackgroundTasks fix above, this becomes mostly moot for the request path, but background tasks also need the same isolation.

### [HIGH] No retry/backoff on Anthropic 429/5xx or WhatsApp 429/5xx

**File:** `app/classifier.py:42-52`, `app/reply.py:59-77`

**Issue:** The classifier catches all exceptions and falls back to "spam" — a 429 from Anthropic during a traffic spike will result in **every message being classified as spam for the duration of the throttle**. The send helper raises `WhatsAppSendError` on any 4xx/5xx, with no retry on transient 429.

The brief asks for "Retry / fallback logic for rate limits."

**Fix:** Use `httpx.AsyncClient` with `httpx.HTTPTransport(retries=...)` for connect-level retries (limited; only retries connection errors), or wrap with a small retry helper using `tenacity` (already pyproject-friendly). At minimum, add `tenacity` to deps and decorate:

```python
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=8),
    retry=retry_if_exception_type((anthropic.RateLimitError, anthropic.APITimeoutError)),
)
async def classify_message(text: str) -> ClassificationResult:
    ...
```

For `send_text`, retry on 429 and 5xx with exponential backoff and respect `Retry-After`.

---

## MEDIUM

### [MEDIUM] `lru_cache(maxsize=1)` on `get_settings()` makes test isolation brittle

**File:** `app/deps.py:51-53`, `tests/test_webhook.py:17-23`

**Issue:** `Settings()` is parsed once and cached for the life of the process. Tests use `os.environ.setdefault` (not `os.environ[...] = ...`), which means if a developer runs `pytest` with their dev `.env` already exported, the test secrets will be ignored and the real values used. More subtly, if a future test wants to override `CLASSIFIER_MODEL` via monkeypatch, it cannot — the cached Settings still holds the original value.

**Fix:** Use `monkeypatch.setenv` in a `pytest` fixture and clear the cache:

```python
@pytest.fixture(autouse=True)
def _settings(monkeypatch):
    monkeypatch.setenv("WA_VERIFY_TOKEN", "test-verify")
    # ...
    from app.deps import get_settings
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
```

This also removes the awkward `# noqa: E402` block at the top of the test file.

### [MEDIUM] `lifespan` closes the cached httpx client but leaves it in the cache

**File:** `app/main.py:59-60`, `app/deps.py:69-75`

**Issue:** On shutdown, `client = get_http_client()` returns the cached client and `await client.aclose()` closes it. The `lru_cache` still holds the closed client. If any code path runs after shutdown begins (background tasks, late callbacks) and calls `get_http_client()`, it will get a closed client and the next `.post()` will raise `RuntimeError: Cannot send a request, as the client has been closed`. Unlikely in practice for a single-process uvicorn shutdown, but the pattern is wrong.

**Fix:** Either move client construction into `lifespan` and stash on `app.state.http_client` (FastAPI-idiomatic), or after `aclose()` call `get_http_client.cache_clear()`.

### [MEDIUM] `classify_message` catches bare `Exception`

**File:** `app/classifier.py:50`

**Issue:** Catching `Exception` here is intentional (the docstring explains the spam-fallback rationale), but it also swallows programmer errors like `AttributeError` from a future SDK version change, or `KeyError` from refactor. The fallback semantics are right; the catch is too wide.

**Fix:** Catch specific Anthropic errors, let everything else bubble:

```python
try:
    response = await client.messages.create(...)
except (anthropic.APIError, anthropic.APITimeoutError):
    logger.exception("classifier_call_failed")
    return ClassificationResult(label="spam", raw="")
```

A genuine bug should still 500 — Sentry will catch it and the operator will fix it. A misclassification ceiling is one bad route, not a silent codebase rot.

### [MEDIUM] `FastAPI` instance has no global exception handler

**File:** `app/main.py:64-72`

**Issue:** Unhandled exceptions in handlers will return FastAPI's default 500 with a generic body. With Sentry initialised the stack trace gets captured, which is good, but the response body to Meta is `{"detail":"Internal Server Error"}` and Meta will retry. This is probably fine, but a global handler that returns 200 with `{"status":"error"}` for non-signature errors would prevent Meta retry storms during a deploy bug. Trade-off: you lose at-least-once delivery for the broken message.

**Fix:** Optional. Add an exception handler that returns 500 (Meta retries) for transient infra errors and 200 (Meta does not retry) for code bugs you've already captured to Sentry. The current behaviour is defensible — note this as a v1.1 polish.

### [MEDIUM] `Contact.profile: dict | None = None` uses bare `dict`

**File:** `app/models.py:36`

**Issue:** Pydantic v2 accepts bare `dict`, but it loses type information. Should be `dict[str, Any] | None` or a typed `Profile(BaseModel)` class.

**Fix:**

```python
from typing import Any

class Contact(BaseModel):
    wa_id: str
    profile: dict[str, Any] | None = None
```

Two-character fix. Same applies to any other bare collection annotations.

### [MEDIUM] `WebhookPayload.entry[*].changes[*].value.messages` is iterated sequentially per-payload

**File:** `app/webhook.py:74-80`

**Issue:** Once async clients are in place, multiple messages in one payload can be classified in parallel. Currently they're awaited one at a time. For Meta's typical batch sizes (1–3 messages) this is negligible; for larger batches it's a real latency win.

**Fix:** After moving to BackgroundTasks (HIGH item above), this becomes a non-issue for the request path. For the background-task body, `asyncio.gather` if you keep them in-process.

### [MEDIUM] Test suite does not exercise the duplicate-message path or the `WhatsAppSendError` branches

**File:** `tests/test_webhook.py`

**Issue:** The dedupe path is critical to correctness (idempotency is the second non-negotiable property called out in the docstring). It is not tested. Similarly, the 24h-window-expired branch (subcode 2018278) in `webhook.py:162` has documented behaviour but no test.

**Fix:** Add three tests:

1. `test_inbound_duplicate_message_skipped` — patch `_claim_message` to return `False`, assert `send_text` is not called.
2. `test_inbound_session_expired_logs_and_swallows` — patch `send_text` to raise `WhatsAppSendError(400, {"error": {"error_subcode": 2018278}})`, assert response is still 200 and no exception bubbles.
3. `test_inbound_non_text_message_ignored` — payload with `type: "image"`, assert no classifier or send call.

### [MEDIUM] `app/main.py` ships `/docs` enabled in production by default

**File:** `app/main.py:70`

**Issue:** The Swagger UI is exposed at `/docs` regardless of `ENV`. The comment acknowledges "flip when you want internal-only" but for a webhook-only service there's no reason to expose the schema publicly.

**Fix:** Gate on env:

```python
docs_url = "/docs" if get_settings().env != "production" else None
app = FastAPI(..., docs_url=docs_url, redoc_url=None, openapi_url=docs_url and "/openapi.json")
```

---

## LOW

### [LOW] `WebhookPayload.object` shadows the builtin `object`

**File:** `app/models.py:66`

**Issue:** Pydantic field name matches Meta's payload key, so it is necessary, but ruff's RUF rules may flag it. Suppress with a per-line ignore or use `Field(alias="object")` and rename the attribute to `object_type`.

### [LOW] `_safe_json` returns `dict[str, Any]` but Meta error responses can be non-dict JSON

**File:** `app/reply.py:80-84`

**Issue:** `response.json()` could return a list or a string. The type hint promises a dict; the runtime will return whatever JSON parses to. Edge case for Meta but cleaner to coerce:

```python
def _safe_json(response: httpx.Response) -> dict[str, Any]:
    try:
        data = response.json()
    except ValueError:
        return {"raw": response.text[:500]}
    return data if isinstance(data, dict) else {"raw": data}
```

### [LOW] `InboundMessage.type` Literal omits sticker, reaction, contacts, order, system

**File:** `app/models.py:25`

**Issue:** Meta sends more types than listed. Unknown types will fail Pydantic validation, the parse will raise, and `webhook.py:73` returns `{"status": "ignored"}` with 200 — so behaviour is fine. But the developer extending the scaffold will be surprised.

**Fix:** Add the missing variants or change to `str` and gate behavior on the known set in `handle_message`. The Literal-then-parse-fail-then-200 path is defensible; just document it.

### [LOW] `pyproject.toml` has no `[build-system]` block

**File:** `pyproject.toml`

**Issue:** uv treats application projects without `[build-system]` as non-buildable, which is correct here (the Docker image runs `uv sync` and uvicorn directly). For users who want to install this as a package later, they'll need to add it. Not blocking for v1.

### [LOW] `respx>=0.21.0` is in dev deps but not used by any test

**File:** `pyproject.toml:23`, `tests/test_webhook.py`

**Issue:** Dependency is shipped but nothing imports it. Either add a real respx-based test for `send_text` (mocks Meta's outbound endpoint, exercises the actual httpx code path) or remove the dep until it is used.

### [LOW] Settings and environment access patterns: `s = get_settings()` vs `settings = get_settings()`

**File:** `app/deps.py:58,64`, others use `settings`

**Issue:** Mixed local variable naming (`s` vs `settings`). Trivial style nit.

### [LOW] `.dockerignore` excludes `tests/` and `README.md` but includes `CLAUDE.md`

**File:** `.dockerignore:15-18`

**Issue:** `CLAUDE.md` is listed in `.dockerignore`, which is correct (no need in the container). Same for the READMEs and tests. Confirm `pyproject.toml` is *not* listed — it isn't, good. The list is correct; just calling out so a reviewer doesn't accidentally remove it.

### [LOW] HEALTHCHECK in Dockerfile uses `urllib.request.urlopen` without context manager

**File:** `Dockerfile:46-47`

**Issue:** `urlopen(...)` returns a connection that should be closed. In a healthcheck spawned every 30s for the life of the container, the leaks are small but real (GC will clean them up). Cleaner:

```dockerfile
HEALTHCHECK ... CMD python -c "import urllib.request, sys; \
r = urllib.request.urlopen('http://127.0.0.1:8000/healthz', timeout=3); \
sys.exit(0 if r.status == 200 else 1); r.close()"
```

Or call `curl --fail` if you ship curl in the runtime layer (you don't — slim image).

### [LOW] `classifier.py:62` uses `# type: ignore[arg-type]` instead of `cast`

**File:** `app/classifier.py:62`

**Issue:** Cleaner to use `typing.cast`:

```python
from typing import cast
return ClassificationResult(label=cast(ClassificationLabel, label_candidate), raw=raw)
```

Same runtime, narrower type-check disable.

---

## Recommendations for v1.0 ship

**Must fix before flip (blocking):**

1. **Pin a real Anthropic model ID** (`claude-sonnet-4-5` or a date-pinned variant — verify against Anthropic's current model list). Update `.env.example`, `app/deps.py`, `CLAUDE.md`, and `README.md`. Without this, the scaffold's headline classifier is broken on first message.
2. **Switch to async Anthropic + async Supabase clients** (`anthropic.AsyncAnthropic`, `supabase.acreate_client` / `AClient`). The scaffold's whole pitch is "async-first FastAPI," and the current code violates that in two of its three external calls.
3. **Ship a `uv.lock` with the scaffold** (and remove from `.gitignore`), or document that `uv sync` must run before `docker compose up --build`. Otherwise the Docker path is broken out of the box.
4. **Either implement `init_tables()` in `app/deps.py` or remove the dangling references** in `app/webhook.py:111` and `README.md:64`. Don't ship code that lies about what exists.

**Should fix before flip (high-value polish):**

5. **Offload `handle_message` to `BackgroundTasks`** so the webhook returns 200 in <100ms. This is one new import, one parameter, and one `background.add_task(...)` call — high ROI for v1 reliability.

**Acceptable for v1.1:**

- Retry/backoff on Anthropic 429 (add tenacity).
- Per-message exception isolation in the webhook loop.
- Test coverage for duplicate, session-expired, and non-text branches.
- `/docs` gated on env.
- Bare-`dict` annotations tightened.
- HEALTHCHECK and `_safe_json` edge cases.

The scaffold's bones are good — webhook signature handling, Sentry denylist, Pydantic models, multi-stage Docker, lifespan structure, ruff config, dependency-groups — all reflect a real practitioner who knows the foot-guns. The five blocking items are concentrated in the SDK glue layer and are mechanical to fix.
