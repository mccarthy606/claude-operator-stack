"""Outbound send_text tests with mocked Meta endpoint.

Uses ``respx`` to intercept the httpx call so we can assert URL composition,
auth header, and JSON body without making real network calls.
"""

from __future__ import annotations

import httpx
import pytest
import respx


@pytest.fixture(autouse=True)
def _settings(monkeypatch: pytest.MonkeyPatch):
    """Inject test env vars and clear cached singletons.

    The httpx client is cached via ``lru_cache``; clearing it ensures the
    test sees a fresh client without any closed sockets from other tests.
    """
    monkeypatch.setenv("WA_VERIFY_TOKEN", "test-verify")
    monkeypatch.setenv("WA_APP_SECRET", "test-app-secret")
    monkeypatch.setenv("WA_ACCESS_TOKEN", "test-access-token")
    monkeypatch.setenv("WA_PHONE_NUMBER_ID", "1234567890")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test")
    monkeypatch.setenv("SUPABASE_URL", "https://test.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role")

    from app.deps import get_http_client, get_settings

    get_settings.cache_clear()
    get_http_client.cache_clear()
    yield
    get_settings.cache_clear()
    get_http_client.cache_clear()


@pytest.mark.asyncio
@respx.mock
async def test_send_text_posts_to_meta_with_auth_header() -> None:
    """``send_text`` should POST to the Cloud API with bearer auth + JSON body."""
    from app.reply import send_text

    route = respx.post(
        "https://graph.facebook.com/v21.0/1234567890/messages"
    ).mock(
        return_value=httpx.Response(
            200, json={"messages": [{"id": "wamid.OUT"}]}
        )
    )

    result = await send_text(to_number="5491111111111", body="hello")

    assert result == {"messages": [{"id": "wamid.OUT"}]}
    assert route.called
    request = route.calls.last.request
    assert request.headers["Authorization"] == "Bearer test-access-token"
    assert request.headers["Content-Type"] == "application/json"


@pytest.mark.asyncio
@respx.mock
async def test_send_text_raises_on_4xx() -> None:
    """A 4xx from Meta should raise ``WhatsAppSendError`` carrying the payload."""
    from app.reply import WhatsAppSendError, send_text

    error_payload = {
        "error": {
            "message": "session expired",
            "error_subcode": 2018278,
        }
    }
    respx.post(
        "https://graph.facebook.com/v21.0/1234567890/messages"
    ).mock(return_value=httpx.Response(400, json=error_payload))

    with pytest.raises(WhatsAppSendError) as exc_info:
        await send_text(to_number="5491111111111", body="hi")

    assert exc_info.value.status == 400
    assert exc_info.value.payload == error_payload
