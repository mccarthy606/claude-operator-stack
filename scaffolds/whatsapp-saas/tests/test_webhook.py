"""Happy-path test for the webhook signature + parse path.

Extends the seed test by mocking out the Supabase dedupe call and the
classifier so the test stays hermetic. Add more cases (bad signature,
duplicate message, non-text payload) as you build out behaviour.
"""

from __future__ import annotations

import hashlib
import hmac
import json
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models import ClassificationResult


@pytest.fixture(autouse=True)
def _settings(monkeypatch: pytest.MonkeyPatch):
    """Inject test env vars and clear the Settings cache between runs.

    Using ``monkeypatch.setenv`` plus an explicit ``cache_clear()`` keeps each
    test hermetic — env mutations from one test cannot leak into another, and
    no module-level ``os.environ`` mutation is required at import time.
    """
    monkeypatch.setenv("WA_VERIFY_TOKEN", "test-verify")
    monkeypatch.setenv("WA_APP_SECRET", "test-app-secret")
    monkeypatch.setenv("WA_ACCESS_TOKEN", "test-access-token")
    monkeypatch.setenv("WA_PHONE_NUMBER_ID", "1234567890")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test")
    monkeypatch.setenv("SUPABASE_URL", "https://test.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role")

    from app.deps import get_settings

    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


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


# --- MED-7: extended branch coverage --------------------------------------


@pytest.mark.asyncio
async def test_inbound_duplicate_message_skipped() -> None:
    """Dedupe path: when ``_claim_message`` returns False, no work is done."""
    payload = _inbound_payload(message_id="wamid.DUP")
    raw = json.dumps(payload).encode()
    sig = _sign(raw)

    classify_mock = AsyncMock()
    send_mock = AsyncMock()

    with (
        patch("app.webhook._claim_message", new=AsyncMock(return_value=False)),
        patch("app.webhook.classify_message", new=classify_mock),
        patch("app.webhook.send_text", new=send_mock),
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
    classify_mock.assert_not_awaited()
    send_mock.assert_not_awaited()


@pytest.mark.asyncio
async def test_inbound_session_expired_logs_and_swallows() -> None:
    """A 24h session-expired error (subcode 2018278) must not bubble."""
    from app.reply import WhatsAppSendError

    payload = _inbound_payload(message_id="wamid.EXPIRED")
    raw = json.dumps(payload).encode()
    sig = _sign(raw)

    expired_err = WhatsAppSendError(
        status=400,
        payload={"error": {"error_subcode": 2018278, "message": "session expired"}},
    )

    with (
        patch("app.webhook._claim_message", new=AsyncMock(return_value=True)),
        patch(
            "app.webhook.classify_message",
            new=AsyncMock(return_value=ClassificationResult(label="question", raw="question")),
        ),
        patch("app.webhook.send_text", new=AsyncMock(side_effect=expired_err)),
    ):
        response = client.post(
            "/webhook/whatsapp",
            content=raw,
            headers={
                "X-Hub-Signature-256": sig,
                "Content-Type": "application/json",
            },
        )

    # Webhook returns 200 even when send fails — the error is logged and
    # swallowed inside ``handle_message`` so the rest of the batch survives.
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_inbound_non_text_message_ignored() -> None:
    """Image messages should bypass classifier and send paths entirely."""
    payload = {
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
                                    "id": "wamid.IMAGE",
                                    "from": "5491111111111",
                                    "timestamp": "1700000000",
                                    "type": "image",
                                }
                            ],
                        },
                    }
                ],
            }
        ],
    }
    raw = json.dumps(payload).encode()
    sig = _sign(raw)

    classify_mock = AsyncMock()
    send_mock = AsyncMock()

    with (
        patch("app.webhook._claim_message", new=AsyncMock(return_value=True)),
        patch("app.webhook.classify_message", new=classify_mock),
        patch("app.webhook.send_text", new=send_mock),
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
    classify_mock.assert_not_awaited()
    send_mock.assert_not_awaited()
