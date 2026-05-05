"""Outbound message helper for the WhatsApp Cloud API.

Sends text messages within the 24h customer-service window. Outside that
window Meta requires a pre-approved template message — that path is not
implemented here; raise an error and surface it instead of silently failing.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

from .deps import get_http_client, get_settings

logger = logging.getLogger(__name__)


class WhatsAppSendError(Exception):
    """Raised when the Cloud API rejects a send.

    Includes the HTTP status and Meta's error code/subcode if present so
    higher-level handlers can branch on `messages_after_session_expired`.
    """

    def __init__(self, status: int, payload: dict[str, Any]):
        self.status = status
        self.payload = payload
        super().__init__(f"WhatsApp send failed: {status} {payload}")


async def send_text(to_number: str, body: str) -> dict[str, Any]:
    """Send a plain-text message to ``to_number`` (E.164, no leading '+').

    Returns Meta's response JSON on success.
    """
    settings = get_settings()
    client = get_http_client()

    url = (
        f"https://graph.facebook.com/{settings.wa_graph_api_version}"
        f"/{settings.wa_phone_number_id}/messages"
    )

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_number,
        "type": "text",
        "text": {"preview_url": False, "body": body[:4096]},
    }

    headers = {
        "Authorization": f"Bearer {settings.wa_access_token}",
        "Content-Type": "application/json",
    }

    try:
        response = await client.post(url, json=payload, headers=headers)
    except httpx.HTTPError as err:
        logger.exception("whatsapp_send_network_error", extra={"to": to_number})
        raise WhatsAppSendError(status=0, payload={"network_error": str(err)}) from err

    if response.status_code >= 400:
        body_json = _safe_json(response)
        logger.warning(
            "whatsapp_send_rejected",
            extra={
                "to": to_number,
                "status": response.status_code,
                "error": body_json.get("error"),
            },
        )
        raise WhatsAppSendError(status=response.status_code, payload=body_json)

    return _safe_json(response)


def _safe_json(response: httpx.Response) -> dict[str, Any]:
    try:
        return response.json()
    except ValueError:
        return {"raw": response.text[:500]}
