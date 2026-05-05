# Telegram Bot as v0 Lead Capture

> **Time:** ~30m
> **Stack:** Telegram Bot API, Python (or any language with HTTP), Vercel/Cloudflare/anywhere
> **Used in:** every v0 landing page in the [Niche Booking Trio](../case-studies/niche-booking-trio.md) and several pre-product validation experiments

## The problem

You shipped a landing page yesterday. Today someone fills out the lead form. You want to know about it now, not when you check your inbox tomorrow. You also do not want to spin up Supabase or any DB just to capture leads while you are still validating whether the page works at all.

A Telegram bot solves this in 30 minutes. Form submit -> POST to bot -> instant phone notification with the lead's data. When demand is real you swap it out for a proper DB; until then this is enough.

## Solution overview

Create a bot via @BotFather, get a token, get your own Telegram user ID, and POST to `https://api.telegram.org/bot<TOKEN>/sendMessage` from your form handler. No webhook, no polling, no library. Three env vars and one `fetch` call.

The whole point is friction removal. Do not build a "lead management bot" — build the smallest thing that surfaces the lead in your hand.

## Step-by-step

### 1. Create the bot

1. Open Telegram, message **@BotFather**
2. Send `/newbot`
3. Pick a name (`yourproduct-leads-bot`) and a username (`yourproduct_leads_bot`)
4. BotFather replies with a token like `1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ`

Save the token. Treat it as a secret — anyone with it can send messages as your bot.

### 2. Get your own Telegram user ID

Message **@userinfobot**. It replies with your numeric ID, looks like `123456789`.

If the bot needs to message a group instead of you personally, add the bot to the group, send any message, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and look for the chat ID (negative number for groups).

### 3. Test from the terminal

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d "chat_id=<YOUR_USER_ID>" \
  -d "text=Hello from the bot"
```

You should get a Telegram notification within a second. If not, double-check the token and that you have started a chat with the bot at least once (Telegram blocks bots from messaging users who have never opened the chat).

### 4. Wire it into your form handler

Server action / API route in Next.js:

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  const { email, name, message } = await req.json();

  const text = [
    `New lead from ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    `Name: ${name ?? '(none)'}`,
    `Email: ${email}`,
    `Message: ${message ?? '(none)'}`,
    `Time: ${new Date().toISOString()}`,
  ].join('\n');

  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text,
    }),
  });

  return NextResponse.json({ ok: true });
}
```

FastAPI version:

```python
import os
import httpx
from fastapi import FastAPI, Request

app = FastAPI()
TG_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
TG_CHAT_ID = os.environ["TELEGRAM_CHAT_ID"]

@app.post("/leads")
async def lead(request: Request):
    data = await request.json()
    text = f"New lead\nEmail: {data.get('email')}\nMessage: {data.get('message')}"
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT_ID, "text": text},
        )
    return {"ok": True}
```

### 5. (Optional) Echo back from the bot

If you want the bot to also reply to messages in Telegram (for two-way ops), set up a webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://yourdomain.com/api/telegram-webhook"
```

Then handle incoming `message` updates the same way you do for any webhook. For most v0 lead-capture cases you do not need this — the one-way notification is the whole product.

### 6. When to graduate

The bot is the right answer when:

- You have fewer than ~50 leads/day
- You want zero infra cost
- You need instant notification on your phone
- Lead data is small enough to read in a notification

Move to a real DB the moment any of:

- Leads start arriving faster than you can read them
- You need to query leads by date, source, or status
- You want to assign leads to teammates
- You ship a thank-you autoresponder beyond Telegram

At that point keep the Telegram notification *in addition* to the DB write — the instant signal is still useful, the DB is the system of record.

## Pitfalls

- **Token in client-side code.** The bot token must never reach the browser. Always send from a server route. If it leaks, revoke via @BotFather (`/revoke`) and rotate.
- **Forgetting to chat with the bot once.** Telegram requires the user to have initiated a chat with the bot before the bot can message them. The first time you set this up, send the bot any message manually.
- **Rate limits.** Telegram allows ~30 messages per second per bot, ~1 per second to the same chat. For a v0 form this never matters. If you somehow have a flood, queue the sends.
- **HTML formatting is intentionally omitted.** This recipe uses plain text to avoid the escape footgun: with `parse_mode: 'HTML'`, an attacker can submit `<a href="...">` or `<b>` payloads that render as styled phishing inside your bot notification. If you want bold or links in the bot message, escape every interpolated value first — `text.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[c])` — and add `parse_mode: 'HTML'` back. Otherwise a submitter can ship a phishing message styled as your bot. See [Telegram Bot API formatting docs](https://core.telegram.org/bots/api#html-style) for the full grammar.
- **Treating it as durable storage.** Telegram is the notification layer, not the database. If you need to retrieve a lead from last week, you are scrolling chat history. Move to a DB before you are doing that daily.

## References

- [Telegram Bot API docs](https://core.telegram.org/bots/api)
- [@BotFather](https://t.me/BotFather)
- [@userinfobot](https://t.me/userinfobot)
- [recipe 05 — server-side GA4 to count the conversions](05-ga4-cloudflare-analytics.md)
- [workflows/ship-a-product-in-a-day.md](../workflows/ship-a-product-in-a-day.md)
