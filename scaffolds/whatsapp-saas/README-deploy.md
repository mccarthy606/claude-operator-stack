# Deploy notes

Pick one host. Do not run two in parallel — pay-per-idle and divided attention will eat the savings.

## Pre-deploy

1. Provision a Supabase project; copy the URL + service role key into `.env`.
2. Create the `inbound_dedupe` table:

   ```sql
   create table if not exists public.inbound_dedupe (
       message_id  text         primary key,
       received_at timestamptz  not null default now()
   );
   ```

3. Create the WhatsApp app per [cookbook recipe 03](../../cookbook/03-whatsapp-cloud-api-webhook.md): app of type Business, add WhatsApp product, get System User access token, phone number ID, app secret, and verify token.
4. Choose your host (below). Get a public HTTPS URL.
5. In the Meta console, set the webhook callback URL to `https://<your-host>/webhook/whatsapp` with the verify token from your `.env`. Subscribe to the `messages` field.

## Option A — Railway

```bash
# Login
railway login

# Create + link
railway init
railway link <project-id>

# Set env vars (or paste from .env via the dashboard)
railway variables set WA_VERIFY_TOKEN=...
# ...repeat for every var in .env.example

# Deploy from the Dockerfile
railway up
railway domain          # generate a public domain
```

Railway healthcheck reads `HEALTHCHECK` from the Dockerfile. Confirm `/healthz` returns 200 in the deployment logs before pointing Meta at the URL.

## Option B — Fly.io

```bash
flyctl launch --no-deploy        # generates fly.toml; pick a region close to your customers
flyctl secrets set WA_VERIFY_TOKEN=... WA_APP_SECRET=...   # one call per group of vars
flyctl deploy
```

Fly's healthcheck config goes in `fly.toml`:

```toml
[[services.http_checks]]
  interval = "30s"
  timeout = "5s"
  grace_period = "10s"
  method = "get"
  path = "/healthz"
  protocol = "http"
```

## Option C — any container host

This is a stock Dockerfile that listens on `$PORT` (default 8000). Anywhere that can run a container with environment variables works: ECS, Cloud Run, your own VPS with `docker compose up -d`. Wire the healthcheck to `GET /healthz`.

## After deploy

- Verify the Meta webhook subscription succeeds (the GET handshake will fire once; the Meta console shows green status when it works).
- Send a test WhatsApp message to the business number. Confirm a row lands in `public.inbound_dedupe` and Sentry reports no errors.
- Check `/healthz` from outside your network.
- See [cookbook recipe 11](../../cookbook/11-scheduled-prompts-cron.md) for adding a scheduled uptime check that pings `/healthz` daily and Telegrams on failure.
