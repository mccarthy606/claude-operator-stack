"""Happy-path test for the webhook signature + parse path.

Extends the seed test by mocking out the Supabase dedupe call and the
classifier so the test stays hermetic. Add more cases (bad signature,
duplicate message, non-text payload) as you build out behaviour.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
from unittest.mock import AsyncMock, patch

# Set env *before* importing the app so Settings() picks them up.
os.environ.setdefault("WA_VERIFY_TOKEN", "test-verify")
os.environ.setdefault("WA_APP_SECRET", "test-app-secret")
os.environ.setdefault("WA_ACCESS_TOKEN", "test-access-token")
os.environ.setdefault("WA_PHONE_NUMBER_ID", "1234567890")
os.environ.setdefault("ANTHROPIC_API_KEY", "sk-ant-test")
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402
from app.models import ClassificationResult  # noqa: E402

client = TestClient(app)


def _sign(body: bytes, secret: str = "test-app-secret") -> str:
    digest = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return f"sha256={digest}"


def _inbound_payload(message_id: str = "wamid.TEST") -> dict:
    return {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
                "changes": [
                    {
                        "field": "messages",
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "5491100000000",
                                "phone_number_id": "1234567890",
                            },
                            "contacts": [
                                {"wa_id": "5491111111111", "profile": {"name": "Test User"}}
                            ],
                            "messages": [
                                {
                                    "id": message_id,
                                    "from": "5491111111111",
                                    "timestamp": "1700000000",
                                    "type": "text",
                                    "text": {"body": "Do you have stock?"},
                                }
                            ],
                        },
                    }
                ],
            }
        ],
    }


def test_verify_handshake_returns_challenge() -> None:
    response = client.get(
        "/webhook/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "test-verify",
            "hub.challenge": "1234567",
        },
    )
    assert response.status_code == 200
    assert response.json() == 1234567


def test_verify_handshake_rejects_wrong_token() -> None:
    response = client.get(
        "/webhook/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "wrong",
            "hub.challenge": "1234567",
        },
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_inbound_message_classifies_and_replies() -> None:
    payload = _inbound_payload()
    raw = json.dumps(payload).encode()
    sig = _sign(raw)

    with (
        patch("app.webhook._claim_message", new=AsyncMock(return_value=True)),
        patch(
            "app.webhook.classify_message",
            new=AsyncMock(return_value=ClassificationResult(label="question", raw="question")),
        ),
        patch("app.webhook.send_text", new=AsyncMock(return_value={"messages": [{"id": "x"}]})) as send_mock,
    ):
        response = client.post(
            "/webhook/whatsapp",
            content=raw,
            headers={
                "X-Hub-Signature-256": sig,
                "Content-Type": "application/json",
            },
        )

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    send_mock.assert_awaited_once()
    args, kwargs = send_mock.call_args
    assert kwargs.get("to_number") == "5491111111111"


def test_inbound_rejects_bad_signature() -> None:
    payload = _inbound_payload()
    raw = json.dumps(payload).encode()
    response = client.post(
        "/webhook/whatsapp",
        content=raw,
        headers={
            "X-Hub-Signature-256": "sha256=deadbeef",
            "Content-Type": "application/json",
        },
    )
    assert response.status_code == 403


def test_healthz_ok() -> None:
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
