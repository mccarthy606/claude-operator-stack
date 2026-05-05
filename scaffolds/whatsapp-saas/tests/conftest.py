"""Test environment bootstrap.

Settings are read at import time (e.g. ``app.main`` evaluates ``get_settings()``
at module level to gate ``/docs`` on env). Pytest's ``monkeypatch`` only kicks
in once a test function runs, which is too late for those module-level reads.

This conftest sets the required env vars before any ``app.*`` import is
resolved, so the first ``Settings()`` construction succeeds. Per-test fixtures
in individual test modules can still override values via ``monkeypatch.setenv``
followed by ``get_settings.cache_clear()``.
"""

from __future__ import annotations

import os

_DEFAULTS = {
    "WA_VERIFY_TOKEN": "test-verify",
    "WA_APP_SECRET": "test-app-secret",
    "WA_ACCESS_TOKEN": "test-access-token",
    "WA_PHONE_NUMBER_ID": "1234567890",
    "ANTHROPIC_API_KEY": "sk-ant-test",
    "SUPABASE_URL": "https://test.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "test-service-role",
}

for _k, _v in _DEFAULTS.items():
    os.environ.setdefault(_k, _v)
