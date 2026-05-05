import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Conservative sampling — tune via the Sentry Performance tab once there is real traffic.
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,

  // Strip cookies and obvious PII before send. Extend with your own patterns
  // (e.g. query params that may leak emails) as the product grows.
  beforeSend(event) {
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
