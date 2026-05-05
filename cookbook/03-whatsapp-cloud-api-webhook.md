# WhatsApp Cloud API Webhook

> **Time:** ~2h (clean run; longer if Meta Business verification is involved)
> **Stack:** FastAPI, Python 3.12, Meta WhatsApp Cloud API
> **Used in:** [case-studies/whatsapp-b2b-saas.md](../case-studies/whatsapp-b2b-saas.md)

## The problem

You are building a WhatsApp-first product. A customer sends a message to a business number, your backend receives it, classifies it, and decides whether to auto-reply, route to a human, or take an action. To get there you need a verified webhook receiver that Meta will actually POST to, signature validation that does not break under their slightly non-standard HMAC scheme, and a clean hand-off to whatever inference layer you are using.

This recipe gets you the webhook receiver. The classification step is a separate decision but the structure is shown at the end.

## Solution overview

A FastAPI app with two routes on the same path. `GET /webhook` handles Meta's verification challenge once. `POST /webhook` handles every inbound message thereafter, with HMAC-SHA256 signature validation against the raw request body. Inbound messages get parsed into a typed object and passed to the classifier.

Get the GET route working first. Without verification you cannot subscribe the webhook at all and nothing else matters.

## Step-by-step

### 1. Meta Business setup

Before any code, in the Meta for Developers console:

1. Create an app of type **Business**
2. Add the **WhatsApp** product to the app
3. Generate a **System User access token** with `whatsapp_business_messaging` scope (long-lived, not the temporary 24h token)
4. Get your **Phone Number ID** and **WhatsApp Business Account ID** from the WhatsApp config tab
5. Set a **Verify Token** (any random string, store it in `.env`)

Cache these four values in a password manager now. You will use them constantly.

### 2. FastAPI skeleton

```bash
uv init wa-webhook && cd wa-webhook
uv add fastapi uvicorn httpx pydantic-settings
```

`config.py`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    wa_verify_token: str
    wa_app_secret: str
    wa_access_token: str
    wa_phone_number_id: str

    class Config:
        env_file = ".env"

settings = Settings()
```

### 3. The verification (GET) route

```python
from fastapi import FastAPI, Request, HTTPException
from config import settings

app = FastAPI()

@app.get("/webhook")
async def verify(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == settings.wa_verify_token:
        return int(challenge)

    raise HTTPException(status_code=403, detail="verification failed")
```

Meta hits this once when you subscribe the webhook in the console. You must echo `hub.challenge` as plain integer, not JSON.

### 4. Signature validation

Meta signs every POST with `X-Hub-Signature-256: sha256=<hex>` over the raw body using your **App Secret** (not the access token).

```python
import hmac
import hashlib

def verify_signature(raw_body: bytes, signature_header: str) -> bool:
    if not signature_header or not signature_header.startswith("sha256="):
        return False

    expected = hmac.new(
        settings.wa_app_secret.encode(),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    received = signature_header.removeprefix("sha256=")
    return hmac.compare_digest(expected, received)
```

Use `hmac.compare_digest`, not `==`. Constant-time comparison prevents timing attacks on the signature.

### 5. The inbound (POST) route

```python
@app.post("/webhook")
async def receive(request: Request):
    raw = await request.body()
    sig = request.headers.get("X-Hub-Signature-256", "")

    if not verify_signature(raw, sig):
        raise HTTPException(status_code=403, detail="bad signature")

    payload = await request.json()
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for message in value.get("messages", []):
                await handle_message(message, value)

    return {"status": "ok"}
```

Always read the raw body before `request.json()` for signature verification. Otherwise FastAPI buffers and downstream calls succeed but the signature byte-comparison fails on whitespace differences.

### 6. Handing off to Claude for classification

```python
import anthropic

client = anthropic.Anthropic()

async def handle_message(message: dict, value: dict) -> None:
    msg_type = message.get("type")
    if msg_type != "text":
        return

    text = message["text"]["body"]
    sender = message["from"]

    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=200,
        system="Classify the inbound WhatsApp message as one of: question, lead, complaint, spam. Reply with one word only.",
        messages=[{"role": "user", "content": text}],
    )
    label = response.content[0].text.strip().lower()

    await route_by_label(sender, text, label)
```

Use Haiku for classification. It is cheap, fast, and the classification task is well within its capability. Save Sonnet/Opus for the actual reply generation.

### 7. Local dev — get a public URL

WhatsApp Cloud API will not POST to `localhost`. See [recipe 04 — Cloudflare Tunnel for local webhook dev](04-cloudflare-argo-local-dev.md). Persistent hostnames matter here because changing the webhook URL in the Meta console requires re-verification.

## Pitfalls

- **Verifying signature against `request.json()` output.** The signature is computed over the raw bytes. If you JSON-decode and re-encode you change byte-for-byte representation and signature checks fail. Always validate against raw bytes.
- **Using a 24h temporary token in production.** Meta's quickstart hands you a temporary token that expires in 24 hours. The first time it expires at 3am you will understand. Use a System User access token from day one.
- **Replying with un-templated messages outside the 24h window.** WhatsApp imposes a 24h customer-service window. Outside it you can only send pre-approved template messages. Code defensively for the `messages_after_session_expired` error and surface it to the dealer / user, do not retry blindly.
- **Subscribing to the wrong webhook fields.** Default subscriptions are minimal. Subscribe to `messages` at minimum; add `message_status` if you care about delivery receipts.
- **No retry handling.** Meta retries failed deliveries with exponential backoff. If your handler raises a 5xx, the same message arrives again. Make `handle_message` idempotent — check `message.id` against a dedupe table before processing.

## References

- [WhatsApp Cloud API webhook docs](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Webhook security guide](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#payload)
- [System User token guide](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started)
- [recipe 04 — Cloudflare Tunnel](04-cloudflare-argo-local-dev.md)
- [case-studies/whatsapp-b2b-saas.md](../case-studies/whatsapp-b2b-saas.md)
