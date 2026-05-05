# Ship a Product in a Day

How a focused day takes a product from idea to live URL.

This is not "build a SaaS in 24 hours." It's the cadence I run when I need to validate a niche idea fast and get something publicly visible — a landing page with one clear ask (booking, signup, lead capture), real domain, real analytics.

## The day, in blocks

### 0. Before the day (15 min the night before)

In Obsidian, create the project note:

```yaml
---
tags: [project, status/active]
status: active
stack: [Next.js, Supabase, ...]
created: YYYY-MM-DD
---

## Hypothesis
One sentence. What do I believe about this market that I want to test?

## The ask
One sentence. What is the visitor expected to do?

## Out of scope
- ...
- ...
```

Without this 5-line frame, the day drifts.

### 1. Domain + repo (30 min)

- Buy the domain (Cloudflare or Porkbun, no Squarespace)
- `gh repo create <name> --private --clone`
- Push an empty README so the repo is real

Do not skip the domain step until the end. Buying the domain *first* commits the day.

### 2. Skeleton (90 min)

Open Claude Code in the new repo. Pin the visual direction up front (see `stack/frontend-design.md`). Then:

```
/feature-dev landing page for <product>, hero + value prop + lead form + footer.
   Stack: Next.js 16 app router, Tailwind, Vercel deploy.
   Tone: <pin direction here, never "clean minimal">.
```

ECC's `feature-dev` runs codebase context first, then plans, then implements. For a fresh repo, "codebase context" is empty so it goes straight to planning.

Verify locally with the preview tools before you push.

### 3. Forms + analytics (60 min)

- Lead form goes to either Supabase (if you'll need a DB anyway) or just a Telegram bot for the first week. Telegram bot wins for v0 — you get instant notifications and can validate demand before paying for infra.
- GA4 + Cloudflare web analytics. Both free, both 5 minutes. Without analytics the day was wasted.

### 4. Deploy (30 min)

```
gh repo edit --visibility private
vercel --prod
```

Or Railway, or Cloudflare Pages — whatever you know best. Speed > optimization.

Connect the domain. Wait for the cert.

### 5. SEO baseline (45 min)

```
/seo-audit https://<live-url>
```

Toprank gives you a baseline list. Don't fix everything — fix the top 5: title, description, OG image, sitemap.xml, robots.txt. The rest is week-2 work.

### 6. First content piece (60 min)

A single blog post or case page that gives the domain *something* for indexers. Use ECC's `content-engine` to draft.

Topic should be the one keyword you most want to rank for, written for the actual buyer not for SEO.

### 7. Post-day (15 min)

Update the Obsidian project note:

- Live URL added to frontmatter
- "## Decisions" block — what stack choices, what's deferred
- "## Open questions" block — what to test in week 2

Without this update, day-2 starts from zero.

## What this is not

This is not the day you build the *product*. This is the day you build the *evidence that the product is worth building*. Landing page + lead capture + content baseline = enough to start running paid ads or organic outreach in week 2.

If the lead form is dead after 2 weeks of effort, you killed the idea cheaply. That is the whole point.

## Anti-patterns I've fallen into

- Skipping the domain because "I'll buy it tomorrow" — tomorrow becomes never
- Designing the dashboard before validating the landing page works
- Optimizing the SEO checklist past the top 5 on day 1
- Adding auth before there are users to authenticate
- Writing a "blog" instead of one specific keyword-targeted page
