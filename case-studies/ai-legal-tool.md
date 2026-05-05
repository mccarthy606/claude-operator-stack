# Case Study: AI Legal Tool

AI-assisted appeals tool for traffic fines, targeted at a single national market.

> **Status:** Code complete, awaiting compliance review and pilot launch.
> **Months in:** ~2.
> **Time-to-MVP:** 3 weeks.

## Market hypothesis

Traffic fines in this market are issued frequently, often improperly, and the appeals process is bureaucratic enough that most drivers pay rather than fight. A tool that drafts a compliant appeal letter from a photo of the citation + a short interview should monetize at a small fee per appeal — high enough to be a real business, low enough to be cheaper than half a billable lawyer-hour.

## Product shape

Web app:

- User uploads citation (photo or PDF)
- Claude extracts: violation type, jurisdiction, deadline, fine amount
- Short structured interview (5–8 questions specific to violation type) collects the user's facts and context
- Generates a jurisdictionally-appropriate appeal letter with proper citations to local code
- Outputs a PDF the user can print, sign, and submit through official channels (or with optional submit-on-behalf in v2)

Pricing: tiered fee per appeal, free first appeal as the trial.

## Stack and why

| Choice | Why |
|--------|-----|
| **Next.js + app router** | Same as Niche Booking Trio — repeatable starting point |
| **Prisma + Postgres (Supabase)** | Need real DB for users, citations, appeal records |
| **Claude API directly** | Inference happens server-side, structured output, prompt versioning matters |
| **Stripe** | Recurring + one-off payments, mature SDK |
| **Sentry** | Error tracking on the inference + PDF pipeline |
| **PDFKit / react-pdf** | Generating the actual filing document |

Rejected:

- **OpenAI for extraction** — Claude's structured output and reasoning quality is what this product depends on; commitment to one provider is a feature
- **No-code form builder for the interview** — needed branching logic per violation type; no-code costs more time than 200 lines of React
- **Off-the-shelf "AI legal" SaaS** — none target this jurisdiction; building specific is the moat

## What got shipped

- Full upload → extraction → interview → letter pipeline working end-to-end
- 6 violation types covered with jurisdiction-specific templates
- Stripe billing wired up (test mode)
- Admin dashboard for me to inspect inference outputs before the model is unsupervised
- PDF generator with proper formatting per local convention
- Audit log of every prompt + completion for legal-review traceability

## What's open

- **Compliance review** before public launch — having a local lawyer review the templates and the extraction pipeline. This is the real blocker.
- Submit-on-behalf flow (optional v2 feature)
- Email notifications for users at each step
- Marketing site (intentionally separate from the app)
- Onboarding for the first 10 pilot users

## What I'd do differently in v2

- **Talk to a lawyer in week 1, not week 8.** I wrote the prompts and templates without legal review and now compliance is the critical-path blocker. A 2-hour conversation with a local lawyer in week 1 would have shaped the schema, the disclaimers, and the boundaries of what the tool can claim. Building first, validating legality second was the wrong order for a regulated domain.
- **Pilot the manual version before building the automated version.** A spreadsheet, a Telegram bot, and me hand-drafting appeals for 10 users would have validated whether people will actually pay before I built the pipeline — cheaper and with much sharper learning.
- **Pick a narrower violation set for v1.** I built 6 violation types because Claude could draft them all. Should have shipped 1 type, validated conversion, then expanded.

## Estimated time + cost

- **Build time:** ~3 weeks of focused work (4–5 hr/day) for the end-to-end MVP.
- **Cash cost so far:** ~$50 (domain, Stripe processing fees on test transactions, Anthropic API for prompt iteration during build).
- **Projected monthly at 100 appeals/mo:** ~$30 infra + ~$50 inference = ~$80. Per-appeal inference cost dominates, so pricing has to be set with that in mind.

## What I'm watching

The unlock is the compliance review. With it, the path to first revenue is clear (paid ads + organic for "appeal traffic fine in <jurisdiction>" queries). Without it, the product can't ship publicly without exposing me to legal risk. The takeaway: in a regulated domain, compliance is part of product, not a release-blocker to discover at the end.

## Lessons that transferred elsewhere

- **For regulated products: lawyer first, code second.** Applied retroactively to WhatsApp B2B SaaS's data-handling claims.
- **Audit log of every model interaction from day 1.** Cheap to add up front, expensive to retrofit. Now standard in every project that uses the API.
- **Admin dashboard for inspecting inferences.** I would not have shipped this voluntarily, but being able to spot-check what the model says before users see it has saved at least one bad output from going live.
