# GA4 + Cloudflare Analytics, No Cookie Banner

> **Time:** ~1h
> **Stack:** GA4 (server-side via Measurement Protocol), Cloudflare Web Analytics, Next.js
> **Used in:** every landing page in the [Niche Booking Trio](../case-studies/niche-booking-trio.md) and other public sites

## The problem

You shipped a new landing page. You want analytics. You do not want a cookie banner blocking the hero on first paint, you do not want to ship 80KB of GA4 client JS, and you do not want to choose between "GDPR-compliant" and "useful data."

The standard GA4 install drops a cookie, fires `_ga` from the client, and forces a consent dialog in any region that takes ePrivacy seriously. Cloudflare Web Analytics is cookieless and free but lacks event tracking. The combination below uses each for what it does best.

## Solution overview

Cloudflare Web Analytics handles client-side traffic counting (pageviews, referrers, country, device). It is cookieless, ships zero JS to the user, and runs from Cloudflare's edge. GA4 handles event tracking via the Measurement Protocol — server-side calls from your backend after a real action (form submit, signup, purchase). No client-side GA4 means no cookie, no banner, no consent dialog.

You lose: client-side GA4's automatic scroll/engagement tracking. You gain: a clean page with proper Core Web Vitals and no consent UI.

## Step-by-step

### 1. Cloudflare Web Analytics — client side

In the Cloudflare dashboard, **Analytics & Logs → Web Analytics → Add a site**. You get a snippet:

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "<your-token>"}'></script>
```

In Next.js (`app/layout.tsx`):

```typescript
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_BEACON}"}`}
        />
      </body>
    </html>
  );
}
```

Use `strategy="afterInteractive"` so it never blocks first paint. Cloudflare's beacon is ~3KB gzipped and stateless.

### 2. GA4 property — set up Measurement Protocol

In GA4 admin:

1. Create a property (no Universal Analytics, GA4 only)
2. Add a **Web Data Stream** to get the `Measurement ID` (looks like `G-XXXXXXXXXX`)
3. In the stream details, click **Measurement Protocol API secrets → Create**, name it `server`, copy the secret

Store both in `.env.local`:

```bash
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=<your-secret>
```

### 3. Server-side event helper

`lib/analytics.ts`:

```typescript
import { randomUUID } from 'crypto';

const ENDPOINT = 'https://www.google-analytics.com/mp/collect';

type GA4Event = {
  name: string;
  params?: Record<string, string | number>;
};

export async function trackServerEvent(
  clientId: string,
  events: GA4Event[],
  userId?: string,
) {
  const url = `${ENDPOINT}?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`;

  const body = {
    client_id: clientId,
    user_id: userId,
    events,
  };

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

export function newClientId() {
  return randomUUID();
}
```

`client_id` is required by the Measurement Protocol. Generate one per session and stash it in a non-tracking cookie (`HttpOnly`, `SameSite=Lax`, no third-party domain) or in your database against the user row.

### 4. Fire events from server actions

Example: lead form submit in a Next.js server action.

```typescript
'use server';
import { trackServerEvent, newClientId } from '@/lib/analytics';
import { cookies } from 'next/headers';

export async function submitLead(formData: FormData) {
  const cookieStore = cookies();
  let cid = cookieStore.get('cid')?.value;

  if (!cid) {
    cid = newClientId();
    cookieStore.set('cid', cid, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  await db.lead.create({ data: { email: String(formData.get('email')) } });

  await trackServerEvent(cid, [
    { name: 'lead_submitted', params: { source: 'landing_v3' } },
  ]);
}
```

### 5. Validate

Use the GA4 DebugView. Add `&debug_mode=1` to the API call URL during development:

```typescript
const url = `${ENDPOINT}?measurement_id=...&api_secret=...&debug_mode=1`;
```

Events appear in DebugView within 30s. Without `debug_mode` they take ~10 minutes.

### 6. What to skip

Do not skip the Cloudflare Web Analytics setup thinking server-side GA4 covers it. They are different signals — Cloudflare counts everyone (including bots that you can filter), GA4 counts the small subset who triggered an event. You need both to read traffic.

Do skip:

- The GA4 client snippet (the `gtag.js` blob)
- Google Tag Manager (only useful if marketing wants client-side experiments and is not worth the bytes for a v0 landing page)
- Cookie consent banners (you have nothing to consent to)
- Any "consent mode v2" implementation guide that runs on the GA4 client lib

## Pitfalls

- **Forgetting `client_id` consistency.** If you regenerate `client_id` on every request, GA4 sees one user as N users and `engaged_sessions` is meaningless. Persist it per session.
- **Calling Measurement Protocol from the browser.** It works, but you have just shipped client-side GA4 again with extra steps. Always call from the server.
- **Putting the GA4 secret in `NEXT_PUBLIC_` env var.** That ships it in the bundle. The secret must stay server-only.
- **Counting bots in Cloudflare numbers.** Cloudflare's dashboard lets you filter by bot signals. Turn the filter on or your traffic chart looks like a hockey stick that does not exist.
- **Reading conversion funnels in GA4 with sparse server events.** GA4 funnel reports are tuned for the high-volume client SDK. With server events only, prefer custom reports over the prebuilt funnel UI.

## References

- [GA4 Measurement Protocol docs](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Cloudflare Web Analytics docs](https://developers.cloudflare.com/web-analytics/)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [recipe 06 — Sentry for the form submit error path](06-sentry-fullstack.md)
