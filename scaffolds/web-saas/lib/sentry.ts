/**
 * Server-side Sentry init wrapper.
 *
 * The Next.js Sentry SDK auto-initialises via instrumentation hooks, but a
 * narrow wrapper here keeps capture call-sites honest and gives us one place
 * to add scrubbing logic that should apply to every server-side call.
 */
import * as Sentry from "@sentry/nextjs";

type Severity = "fatal" | "error" | "warning" | "log" | "info" | "debug";

export function captureError(
  err: unknown,
  context?: Record<string, unknown>,
  level: Severity = "error",
): void {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureException(err);
  });
}

export function captureMessage(
  message: string,
  level: Severity = "info",
): void {
  Sentry.captureMessage(message, level);
}

export { Sentry };
