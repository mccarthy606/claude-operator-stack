"""WhatsApp webhook routes — verification (GET) and inbound (POST).

The signature path follows cookbook recipe 03 line for line. Two non-negotiable
properties:

1. The signature is verified against the **raw request bytes**, not the parsed
   JSON. Re-encoding changes byte representation and breaks HMAC.
2. Every Meta `message.id` is checked against a dedupe table before processing.
   Meta retries on any 5xx, so non-idempotent handlers create duplicates.
"""

from __future__ import annotations

import hashlib
import hmac
import logging

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import ValidationError

from .classifier import classify_message
from .deps import get_settings, get_supabase
from .models import InboundMessage, WebhookPayload
from .reply import WhatsAppSendError, send_text

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhook", tags=["webhook"])


# --- Verification (subscribe handshake) ----------------------------------


@router.get("/whatsapp")
async def verify_webhook(request: Request) -> int:
    settings = get_settings()
    params = request.query_params

    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == settings.wa_verify_token and challenge:
        try:
            return int(challenge)
        except ValueError:
            raise HTTPException(status_code=400, detail="invalid challenge")

    logger.warning("webhook_verification_failed", extra={"mode": mode})
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="verification failed")


# --- Inbound POST --------------------------------------------------------


@router.post("/whatsapp")
async def receive_webhook(request: Request) -> dict[str, str]:
    raw = await request.body()
    sig_header = request.headers.get("X-Hub-Signature-256", "")

    if not _verify_signature(raw, sig_header):
        # Logged at warning, not error — invalid signatures are usually noise
        # from scanners, not a real failure.
        logger.warning("webhook_bad_signature")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="bad signature")

    try:
        payload = WebhookPayload.model_validate_json(raw)
    except ValidationError as err:
        logger.warning("webhook_invalid_payload", extra={"errors": err.errors()})
        # Return 200 — Meta should not retry payloads we cannot parse.
        return {"status": "ignored"}

    for entry in payload.entry:
        for change in entry.changes:
            for message in change.value.messages:
                if not await _claim_message(message.id):
                    logger.info("webhook_duplicate_skipped", extra={"id": message.id})
                    continue
                await handle_message(message)

    return {"status": "ok"}


# --- Signature -----------------------------------------------------------


def _verify_signature(raw_body: bytes, signature_header: str) -> bool:
    settings = get_settings()
    if not signature_header.startswith("sha256="):
        return False

    expected = hmac.new(
        settings.wa_app_secret.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    received = signature_header.removeprefix("sha256=")
    return hmac.compare_digest(expected, received)


# --- Idempotency ---------------------------------------------------------


async def _claim_message(message_id: str) -> bool:
    """Insert ``message_id`` into the dedupe table.

    Returns ``True`` on a fresh insert, ``False`` if the row already existed.
    The table is created lazily on first use (see ``init_tables`` in deps).
    """
    supabase = get_supabase()
    try:
        supabase.table("inbound_dedupe").insert({"message_id": message_id}).execute()
        return True
    except Exception as err:
        # supabase-py raises on unique-violation (Postgres error code 23505).
        msg = str(err)
        if "23505" in msg or "duplicate key" in msg.lower():
            return False
        # Any other error gets logged but does not block processing — better to
        # risk a duplicate than to drop a real message.
        logger.exception("dedupe_insert_unexpected_error", extra={"id": message_id})
        return True


# --- Per-message handler -------------------------------------------------


async def handle_message(message: InboundMessage) -> None:
    """Route a single inbound message.

    The default behaviour here is intentionally minimal — classify, log,
    auto-reply for ``question``, ignore everything else. Replace with your
    real routing once the verticals are decided.
    """
    if message.type != "text" or message.text is None:
        logger.info("non_text_message_ignored", extra={"type": message.type})
        return

    text = message.text.body
    sender = message.from_

    result = await classify_message(text)
    logger.info(
        "message_classified",
        extra={"sender": sender, "label": result.label, "raw": result.raw[:64]},
    )

    if result.label == "question":
        try:
            await send_text(
                to_number=sender,
                body=(
                    "Thanks — we got your message and will reply shortly. "
                    "If this is urgent, reply with URGENT."
                ),
            )
        except WhatsAppSendError as err:
            error_block = err.payload.get("error", {})
            subcode = error_block.get("error_subcode")
            if subcode == 2018278:
                # messages_after_session_expired — outside the 24h window
                logger.info("reply_skipped_session_expired", extra={"sender": sender})
            else:
                logger.warning("reply_send_failed", extra={"status": err.status})
