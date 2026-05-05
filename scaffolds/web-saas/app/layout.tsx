import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../styles/global.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Your product name",
    template: "%s — Your product name",
  },
  description:
    "One-sentence value prop. Replace this in app/layout.tsx before deploying.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Your product name",
    title: "Your product name",
    description: "One-sentence value prop.",
    // TODO: ship a 1200x630 og.png in public/ before launch
    // images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your product name",
    description: "One-sentence value prop.",
    // TODO: ship a 1200x630 og.png in public/ before launch
    // images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101015" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/*
          TODO: gate behind explicit consent for EU/UK traffic.
          This default loads GA4 unconditionally; for GDPR/UK-GDPR audiences,
          swap in a consent banner (e.g. cookieyes / klaro / your own) and
          conditionally render the <Script> only after `granted`.
        */}
        {ga4Id ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
