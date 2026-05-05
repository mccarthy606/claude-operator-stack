import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Plain CSS modules; no extra image domains by default — add as needed.
  images: {
    remotePatterns: [],
  },

  // Solo-ops convention: surface security headers from day one.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            // Sane default for a Next.js + GA4 + Sentry app. Tighten before going live:
            //   - replace 'unsafe-inline' on script-src with nonce-based loading once on Next 15.2+
            //   - audit connect-src for any third-party endpoints your product calls
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.sentry.io",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

// Sentry sourcemap upload happens during build only when SENTRY_AUTH_TOKEN is set
// (typically in CI / Vercel project env, not in .env.local).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Stay quiet on local builds. The token is the real signal that sourcemap
  // upload is configured — keying off CI alone is noisy on local `pnpm build`
  // and silent in CI environments that don't set CI=true.
  silent: !process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
