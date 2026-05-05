"""FastAPI app entrypoint."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
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
        logger.info("app_shutdown")


app = FastAPI(
    title="whatsapp-saas",
    version="0.1.0",
    lifespan=lifespan,
    # Cloud API webhooks do not need OpenAPI exposed in production; flip when
    # you want internal-only docs.
    docs_url="/docs",
    redoc_url=None,
)

app.include_router(webhook_router)


@app.get("/healthz", tags=["health"])
async def healthz() -> dict[str, str]:
    return {"status": "ok"}
