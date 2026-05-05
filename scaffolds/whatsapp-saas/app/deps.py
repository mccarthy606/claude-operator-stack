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
from supabase import Client as SupabaseClient
from supabase import create_client


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
    classifier_model: str = "claude-sonnet-4-6"

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
def get_anthropic_client() -> anthropic.Anthropic:
    s = get_settings()
    return anthropic.Anthropic(api_key=s.anthropic_api_key)


@lru_cache(maxsize=1)
def get_supabase() -> SupabaseClient:
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_service_role_key)


@lru_cache(maxsize=1)
def get_http_client() -> httpx.AsyncClient:
    """Shared httpx client for outbound WhatsApp calls.

    A single connection-pooled client is reused across requests. The lifespan
    handler in main.py is responsible for closing it on shutdown.
    """
    return httpx.AsyncClient(timeout=httpx.Timeout(10.0, connect=5.0))
