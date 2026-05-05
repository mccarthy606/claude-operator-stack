# Cloudflare Tunnel for Local Webhook Dev

> **Time:** ~30m (one-time setup, then a single command per session)
> **Stack:** Cloudflare account, `cloudflared` CLI, your local dev server
> **Used in:** referenced by [recipe 02](02-stripe-connect-p2p.md), [recipe 03](03-whatsapp-cloud-api-webhook.md), and any webhook-driven flow

## The problem

You are wiring up a Stripe webhook, a WhatsApp webhook, a Twilio callback, or any service that POSTs to your URL. The service refuses to POST to `localhost`. You have three options:

1. Pay for ngrok pro (or live with the free random URL that resets every restart)
2. Set up port forwarding on your router (not portable, breaks behind NAT)
3. Cloudflare Tunnel — free, persistent hostname on a domain you already own

This recipe covers option 3. The first run takes 30 minutes. Every subsequent project takes 30 seconds.

## Solution overview

`cloudflared` opens a long-lived outbound connection from your machine to Cloudflare's edge. Cloudflare assigns one of your subdomains to that tunnel. Inbound traffic to `dev-stripe.yourdomain.com` lands on Cloudflare and gets forwarded down the tunnel to whatever port your local dev server runs on.

You get a real, TLS-terminated, persistent HTTPS hostname for free. The webhook URL you register in Stripe / Meta / wherever stays the same across restarts, reboots, and laptop sleep cycles.

## Step-by-step

### 1. Have a domain on Cloudflare

If you do not already have one, point any domain you own at Cloudflare nameservers. The Cloudflare dashboard walks you through it. You do not need a paid plan.

### 2. Install `cloudflared`

```bash
# macOS
brew install cloudflared

# Linux
# Verify against Cloudflare's published SHA256 sum:
#   https://github.com/cloudflare/cloudflared/releases
# For apt/rpm-managed installs (signed by Cloudflare): https://pkg.cloudflare.com/
EXPECTED_SHA="<paste from cloudflare release page>"
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared
echo "${EXPECTED_SHA}  /usr/local/bin/cloudflared" | sha256sum -c -
chmod +x /usr/local/bin/cloudflared

# Verify
cloudflared --version
```

### 3. Authenticate

```bash
cloudflared tunnel login
```

This opens a browser. Pick the domain you want to use. Cloudflare drops a cert at `~/.cloudflared/cert.pem`.

### 4. Create a named tunnel

```bash
cloudflared tunnel create dev
```

This prints a tunnel UUID and writes credentials to `~/.cloudflared/<uuid>.json`. The tunnel name (`dev`) is just a local label; you can have many.

### 5. Route a hostname to the tunnel

```bash
cloudflared tunnel route dns dev dev.yourdomain.com
```

Cloudflare creates a CNAME record pointing `dev.yourdomain.com` to the tunnel. The DNS propagates in seconds because Cloudflare proxies it.

### 6. Run the tunnel

For a single ad-hoc session:

```bash
cloudflared tunnel --url http://localhost:3000 run dev
```

For day-to-day work, write a config so you can just say `cloudflared tunnel run dev`. Create `~/.cloudflared/config.yml`:

```yaml
tunnel: dev
credentials-file: /Users/<you>/.cloudflared/<uuid>.json

ingress:
  - hostname: dev.yourdomain.com
    service: http://localhost:3000
  - hostname: dev-fastapi.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
```

Now `cloudflared tunnel run dev` starts the tunnel and routes both Next.js (3000) and FastAPI (8000) under different subdomains.

### 7. Use it

```bash
# terminal 1
pnpm dev          # Next.js on :3000

# terminal 2
uv run uvicorn main:app --port 8000   # FastAPI on :8000

# terminal 3
cloudflared tunnel run dev
```

Stripe webhook URL: `https://dev.yourdomain.com/api/webhooks/stripe`. WhatsApp callback URL: `https://dev-fastapi.yourdomain.com/webhook`. Both stay the same forever.

### 8. Shut it down

`Ctrl+C` on the `cloudflared` process. Tunnel goes offline; subdomain returns a tunnel-error page until you start it again. The DNS record persists.

## Pitfalls

- **Mixing `--url` flag and config file.** The flag overrides the config. If you run `cloudflared tunnel --url http://localhost:8080 run dev`, the config's ingress block is ignored. Pick one mode and stick with it.
- **Localhost not bound to `0.0.0.0`.** Some dev servers bind only to `127.0.0.1`. The tunnel runs in the same network namespace so this usually works, but inside Docker it does not. If you run dev servers in Docker, point the tunnel at the Docker host bridge or expose the container's port to the host.
- **Cloudflare proxy interfering with WebSocket upgrades.** The tunnel supports WebSockets but the Cloudflare proxy may close idle connections after ~100s. For long-lived sockets, increase the timeout in the Cloudflare dashboard or use `noTLSVerify: true` only as a last resort.
- **Forgetting the CNAME is proxied.** If you accidentally toggle the DNS record from "Proxied" (orange cloud) to "DNS only" (gray cloud) in the dashboard, the tunnel breaks instantly. The orange cloud is what makes the routing work.
- **Auth lapsing silently.** `cert.pem` rotates every few months for a given account. If `cloudflared tunnel run` errors with `failed to get tunnel`, re-run `cloudflared tunnel login`.

## References

- [Cloudflare Tunnel docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Tunnel ingress configuration](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/configuration-file/)
- [recipe 02 — Stripe Connect](02-stripe-connect-p2p.md)
- [recipe 03 — WhatsApp Cloud API webhook](03-whatsapp-cloud-api-webhook.md)
