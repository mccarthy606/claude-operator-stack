/**
 * Server-side Sentry capture wrapper.
 *
 * Initialisation is explicit, not auto: see sentry.client.config.ts,
 * sentry.server.config.ts, and sentry.edge.config.ts at the project root,
 * registered via instrumentation.ts. Env-var convention is split per runtime:
 * the server/edge configs read SENTRY_DSN, while the client config reads
 * NEXT_PUBLIC_SENTRY_DSN (the latter is bundled into the browser payload).
 *
 * This wrapper keeps capture call-sites honest and gives us one place to add
 * scrubbing logic that should apply to every server-side call.
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
  context?: Record<string, unknown>,
  level: Severity = "info",
): void {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureMessage(message);
  });
}

export { Sentry };
