# Case Study: WhatsApp B2B SaaS

WhatsApp-first AI assistant for used-car dealerships. Inbound lead qualification and back-and-forth answering, all in the dealer's own WhatsApp Business account.

> **Status:** Code complete, awaiting first pilot dealer.
> **Months in:** ~2.5.
> **Time-to-MVP:** ~4 weeks.

## Market hypothesis

Used-car dealerships in this market run their entire customer pipeline on WhatsApp. The dealer's owner or a single sales rep handles inbound on their personal WhatsApp Business — meaning leads sit unanswered overnight, on weekends, and during test drives. A tool that integrates *into* the dealer's existing WhatsApp number (not a new chatbot URL the customer has to find) and qualifies leads + answers basic inventory questions can pay for itself in one extra closed deal per month.

## Product shape

- Dealer connects their WhatsApp Business account via the Cloud API (Meta's official channel)
- Dealer uploads inventory (CSV initially, scrape-from-website in v2)
- Inbound messages from customers are routed: simple questions (price, availability, photos, financing eligibility heuristics) get answered automatically; complex or high-intent messages get flagged for the human dealer
- Dealer dashboard shows handled vs. flagged conversations, performance per inventory item
- Pricing: monthly subscription per dealer, sized for sub-fleet operations

## Stack and why

| Choice | Why |
|--------|-----|
| **FastAPI + Python** | WhatsApp Cloud API webhooks + Python ecosystem for the inference orchestration |
| **Postgres + Supabase** | Conversations, inventory, dealer accounts |
| **Docker + Railway** | Containerized deploy, easy scaling per dealer |
| **WhatsApp Cloud API (Meta)** | The official channel — no third-party WhatsApp wrapper that risks number bans |
| **Claude API** | Structured output for classification (handle vs. flag), longer-context for inventory matching |
| **Sentry + Logfire** | Webhook reliability matters — errors are silent failures |

Rejected:

- **Twilio + WhatsApp** — works, but Meta Cloud API is cheaper and the dealer keeps full ownership of their number
- **Building a separate chatbot URL** — the entire point is using the dealer's existing number; a new URL is friction the customer doesn't accept
- **Off-the-shelf chatbot platforms** — none had the inventory + qualification logic specific to this vertical

## What got shipped

- Webhook receiver that processes inbound messages reliably
- Lead classification (high intent / low intent / spam / question)
- Auto-reply for the question tier with inventory lookup
- Flag-and-notify-dealer for the high-intent tier
- Simple dealer dashboard (Next.js, separate repo) for setup + monitoring
- CSV-based inventory import
- Docker container for self-hosting + Railway deploy template
- Conversation audit log for transparency

## What's open

- **First pilot dealer.** Conversations with two prospective pilots in progress. Until one is live, all this is theoretical.
- Inventory scrape-from-website (eliminates CSV friction)
- Multi-language (the market is bilingual in some areas)
- Photo + condition reports — currently text-only
- Stripe billing integration (subscription)
- Dealer onboarding flow (guided wizard for first-time setup)

## What I'd do differently in v2

- **Talk to 5 dealers in week 1, not week 8.** Same lesson as AI Legal Tool but with extra force: B2B SaaS where I am not the buyer's profile means I cannot guess the workflow correctly. The first pilot conversation revealed a feature priority I had completely wrong (dealers care about lead-quality scoring more than auto-reply speed).
- **Pick one feature, ship it, sell it.** I built the full classification + auto-reply + flagging system before I had a customer. Should have shipped just lead classification + manual reply, sold it for a small fee, then expanded based on what dealers actually paid for.
- **Build the billing + onboarding before the inference improvements.** Currently the inference works great but the dealer onboarding is "DM me." First pilot will expose that gap immediately.

## Estimated time + cost

- **Build time:** ~4 weeks of focused work for the end-to-end MVP, plus ~1 week of integration debugging with WhatsApp Cloud API quirks.
- **Cash cost so far:** ~$40 (domain, Meta Business verification, Anthropic API during prompt tuning).
- **Projected monthly per dealer at typical volume:** ~$15 infra + ~$40 inference = ~$55 cost. Pricing has to be set with comfortable margin above that.

## What I'm watching

The first pilot dealer's reaction in week 1 is the only real signal. Everything before that is hypothetical. Once one dealer is live and paying, I can iterate; until then I am writing fiction about what dealers want.

The pattern repeats: **for B2B, the first paying customer matters more than the first 10 features.**

## Lessons that transferred elsewhere

- **B2B requires customer conversations before product.** Applied to all subsequent B2B ideas — no code before 5 conversations.
- **Webhook reliability is its own engineering surface.** Sentry + Logfire from day 1 surfaced delivery edge cases I would have shipped past otherwise.
- **Self-host option matters for trust in a vertical with sensitive customer data.** Docker template + clear self-host docs unlocked one of the prospective pilots from "no" to "interested."
