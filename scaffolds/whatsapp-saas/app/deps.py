"""Settings and shared client factories.

One module owns env parsing and external client construction. Other modules
import the cached factories instead of re-reading env vars or re-constructing
clients per request.
"""

from __future__ import annotations

from functools import lru_cache

import anthropic
import httpx
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

try:
    # supabase-py >= 2.10 exposes an async client. Prefer it so handlers in the
    # request path do not block the event loop.
    from supabase import AClient, acreate_client  # type: ignore[attr-defined]

    _HAS_ASYNC_SUPABASE = True
except ImportError:  # pragma: no cover - fallback for older supabase-py
    from supabase import Client as AClient  # type: ignore[assignment]
    from supabase import create_client as acreate_client  # type: ignore[assignment]

    _HAS_ASYNC_SUPABASE = False


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    env: str = "development"
    log_level: str = "info"

    # WhatsApp Cloud API (Meta)
    wa_verify_token: str
    wa_app_secret: str
    wa_access_token: str
    wa_phone_number_id: str
    wa_graph_api_version: str = "v21.0"

    # Anthropic
    anthropic_api_key: str
    classifier_model: str = "claude-sonnet-4-5"

    # Supabase
    supabase_url: str
    supabase_service_role_key: str

    # Sentry
    sentry_dsn: str | None = None
    git_sha: str | None = Field(default=None)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


@lru_cache(maxsize=1)
def get_anthropic_client() -> anthropic.AsyncAnthropic:
    settings = get_settings()
    return anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


_supabase: AClient | None = None


async def get_supabase() -> AClient:
    """Return the cached Supabase async client, constructing it on first call.

    The supabase-py async client is built via ``acreate_client`` which itself
    is awaitable; an ``lru_cache`` would not work here. A module-level singleton
    is fine because the FastAPI lifecycle is single-process.
    """
    global _supabase
    if _supabase is None:
        settings = get_settings()
        if _HAS_ASYNC_SUPABASE:
            _supabase = await acreate_client(
                settings.supabase_url, settings.supabase_service_role_key
            )
        else:  # pragma: no cover - sync fallback for older supabase-py
            # TODO: bump supabase>=2.10 in pyproject.toml so the async client is
            # always available. The sync client below will block the event loop.
            _supabase = acreate_client(
                settings.supabase_url, settings.supabase_service_role_key
            )
    return _supabase


@lru_cache(maxsize=1)
def get_http_client() -> httpx.AsyncClient:
    """Shared httpx client for outbound WhatsApp calls.

    A single connection-pooled client is reused across requests. The lifespan
    handler in main.py is responsible for closing it on shutdown.
    """
    return httpx.AsyncClient(timeout=httpx.Timeout(10.0, connect=5.0))
