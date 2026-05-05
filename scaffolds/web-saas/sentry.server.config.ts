import * as Sentry from "@sentry/nextjs";

// Server-side Sentry init. Loaded by instrumentation.ts.
// Reads from SENTRY_DSN (server-only) — distinct from NEXT_PUBLIC_SENTRY_DSN
// which is bundled into the browser payload.
Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.0,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? "development",
  release: process.env.SENTRY_RELEASE,
  sendDefaultPii: false,
  // Scrub the WhatsApp signature header and any auth cookies before send.
  beforeSend(event) {
    if (event.request?.headers) {
      const h = event.request.headers as Record<string, string>;
      delete h["x-hub-signature-256"];
      delete h["authorization"];
      delete h["cookie"];
    }
    return event;
  },
});
