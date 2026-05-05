/**
 * GA4 server-side helper using the Measurement Protocol.
 *
 * Use this for events that originate server-side (lead form submission,
 * webhook-triggered conversions). For client interactions, use gtag in the
 * browser via the script wired in app/layout.tsx.
 *
 * Docs: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 */
const GA4_ENDPOINT = "https://www.google-analytics.com/mp/collect";

type GA4Event = {
  name: string;
  params?: Record<string, string | number | boolean>;
};

type SendOptions = {
  clientId: string;
  userId?: string;
  events: GA4Event[];
};

export async function sendServerEvent(options: SendOptions): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  // No-op cleanly when analytics env is not configured (typical in local dev).
  if (!measurementId || !apiSecret) {
    return;
  }

  const url = `${GA4_ENDPOINT}?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: options.clientId,
        user_id: options.userId,
        events: options.events,
      }),
      signal: AbortSignal.timeout(2000),
    });

    // GA4 returns 204 on success; any 4xx/5xx is worth logging but not fatal.
    if (!res.ok) {
      console.warn(`[analytics] GA4 returned ${res.status}`);
    }
  } catch (err) {
    // Never break a request because analytics failed.
    console.warn("[analytics] GA4 send failed", err);
  }
}

/**
 * Generate a stable client_id when one is not provided by a cookie.
 * This is acceptable for server-only events that have no browser session
 * (e.g. webhook-triggered). For client-tied events, prefer to read the
 * `_ga` cookie value parsed for the client_id.
 */
export function anonymousClientId(): string {
  return `srv.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
}
