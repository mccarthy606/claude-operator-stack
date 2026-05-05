# Case Study: Niche Booking Trio

A trio of niche booking sites in a single Latin American market. Three domains, one shared codebase, three distinct go-to-market angles.

> **Status:** Live (3 sites), pre-revenue.
> **Months in:** 4.
> **Time-to-first-shipped-version:** ~2 weeks per site.

## Market hypothesis

In a city with strong car culture but no domestic motorsport infrastructure, there's underserved demand for **paid driving experiences** — track days, drift training, and high-performance ride-alongs. The hypothesis: native-audience landing pages with clear booking flow + local language + photography that doesn't look stock can convert organic search and Instagram DMs into paying bookings.

Three angles, three sites:

- **Drift School** — paid lessons for civilians who want to learn drift in a controlled setting
- **Drift Taxi** — passenger ride-alongs at events
- **Track Days** — open-track events for owner-drivers

Same operator, same physical location, different audiences and price points.

## Product shape

Static-leaning marketing sites with:

- Hero section per discipline
- Pricing page with clear options
- Booking flow (lead form v1, full calendar v2)
- Blog for SEO
- WhatsApp click-to-chat as primary CTA

Three sites share one Next.js codebase and one design system. Each site has its own theme tokens, copy, and brand assets.

## Stack and why

| Choice | Why |
|--------|-----|
| **Next.js 16 (app router)** | Static + dynamic mix, good defaults for SEO, strong Vercel deploy story |
| **Supabase** | Postgres + auth + storage in one. Free tier covers pre-revenue. |
| **Vercel** | Zero-config preview deploys, fastest path to public URL |
| **Cloudflare DNS + Web Analytics** | Free, no cookie banner needed |
| **GA4** | The customer (eventually advertisers) expects it |
| **Sentry** | Error monitoring early, before real users hit edge cases |
| **WhatsApp Cloud API** | Booking confirmations + customer comms in the channel locals actually use |

Rejected:

- **Webflow / Framer** — needed code-level control over the booking flow and SEO-shaped page generation
- **Single-domain "products" subpages** — diluted SEO across discipline-specific keywords; three brands win on each search term
- **Headless CMS for blog** — Markdown files in the repo + Claude-assisted writing was faster than spinning up Sanity or Contentful

## What got shipped

- 3 live sites, each on its own `.com.ar` domain
- Shared design system (tokens, components, motion library)
- Booking lead form → Telegram bot for instant operator notification
- 5–8 SEO-targeted pages per site (pricing, what to expect, FAQ, etc.)
- Blog scaffold + first 2–3 posts per site
- GA4 + Cloudflare analytics + Sentry on all 3
- WhatsApp Business number live for customer comms

## What's open

- Stripe Connect or Mercado Pago integration for online deposits (currently deposits are taken offline)
- Customer-facing dashboard for managing booked sessions
- Email automation post-booking (confirmation, reminder, post-session ask for review)
- Partnerships page for sponsors and ride-along providers
- More SEO pages around the long-tail of "<discipline> in <city>" queries

## What I'd do differently in v2

- **Build the booking + payment flow first, marketing pages second.** Currently the marketing surface is bigger than the conversion machinery. If I shipped the conversion path first, the marketing pages would have been written backward from the booking funnel and converted better.
- **Pick one site to launch publicly first, not all three at once.** Three brands at once split focus during the noisiest week (launch). One-at-a-time would have produced sharper learning per launch.
- **Set up the email list before the first paid ad.** Currently traffic arrives, books or bounces; the bounce is unrecoverable. Pre-launch I should have wired up a lead-magnet email list to recover bounces into a slow-marinating audience.

## Estimated time + cost

- **Build time (3 sites):** ~6 weeks total, with significant code reuse from the second site onward. Site 1 took 4 weeks (designing the system); sites 2 and 3 were 1 week each.
- **Cash cost so far:** ~$60 (3 domains × 1 year + 1 month of cheapest Cloudflare paid tier for some advanced features). Vercel + Supabase + Sentry + Cloudflare base + GA4 all on free tiers.
- **Recurring monthly:** ~$5 across all infra at current pre-revenue traffic.

## What I'm watching

The leading indicator is **organic search impressions** in GSC, not bookings yet. Bookings are a lagging signal at this volume — a single paid promotion would distort them. Until impressions for target keywords cross a threshold (~10× current), throwing paid traffic at the funnel would burn money.

Once organic ranks land for the top 5 keywords per site, that's the cue to start paid acquisition + influencer micro-collabs.

## Lessons that transferred to other case studies

- Three brands sharing one codebase is **fine** technically, **bad** brand-wise during launch — split focus killed momentum. (Applied this to AI Legal Tool by keeping it strictly single-brand from day 1.)
- WhatsApp click-to-chat outperforms web forms in this market by a wide margin. The web form is for the audit, the chat is for the conversion. (Applied to WhatsApp B2B SaaS from the start.)
- Sentry on day 1 is cheaper than Sentry on day 30. Two real bugs were caught in the first week that would have shipped silently otherwise.
