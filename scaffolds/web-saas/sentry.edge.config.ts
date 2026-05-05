import * as Sentry from "@sentry/nextjs";

// Edge runtime Sentry init (middleware + edge route handlers).
// Use a lower sample rate than server to control costs on edge invocations.
Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.05,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? "development",
  release: process.env.SENTRY_RELEASE,
  sendDefaultPii: false,
});
