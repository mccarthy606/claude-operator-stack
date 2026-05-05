"""FastAPI app entrypoint."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.scrubber import DEFAULT_DENYLIST, EventScrubber

from .deps import get_http_client, get_settings
from .webhook import router as webhook_router

logger = logging.getLogger("app")


def _init_sentry() -> None:
    settings = get_settings()
    if not settings.sentry_dsn:
        return

    extra_denylist = [
        "x-hub-signature-256",
        "x-hub-signature",
        "stripe-signature",
        "authorization",
    ]
    denylist = list({*DEFAULT_DENYLIST, *extra_denylist})

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.env,
        release=settings.git_sha,
        traces_sample_rate=0.1,
        integrations=[FastApiIntegration()],
        event_scrubber=EventScrubber(denylist=denylist),
        send_default_pii=False,
    )


def _configure_logging() -> None:
    settings = get_settings()
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    _configure_logging()
    _init_sentry()
    logger.info("app_startup", extra={"env": get_settings().env})
    try:
        yield
    finally:
        client = get_http_client()
        await client.aclose()
        # Drop the cached client so a hypothetical re-startup builds a fresh
        # one rather than reusing the closed instance.
        get_http_client.cache_clear()
        logger.info("app_shutdown")


_settings = get_settings()
_is_prod = _settings.env == "production"

app = FastAPI(
    title="whatsapp-saas",
    version="0.1.0",
    lifespan=lifespan,
    # Cloud API webhooks do not need OpenAPI exposed in production. Gate the
    # docs endpoints on env so prod builds do not leak the schema.
    docs_url=None if _is_prod else "/docs",
    redoc_url=None,
    openapi_url=None if _is_prod else "/openapi.json",
)

app.include_router(webhook_router)


@app.exception_handler(Exception)
async def _global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch any unhandled exception and return a sanitised 500.

    Sentry's middleware still receives the exception via the FastAPI
    integration, so observability is not lost. The response body is
    intentionally minimal — never echo internal error details to clients.
    """
    logger.exception("unhandled_exception", extra={"path": request.url.path})
    return JSONResponse(
        status_code=500,
        content={"status": "error", "detail": "Internal server error"},
    )


@app.get("/healthz", tags=["health"])
async def healthz() -> dict[str, str]:
    return {"status": "ok"}
