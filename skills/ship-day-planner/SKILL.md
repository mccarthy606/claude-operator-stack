---
name: ship-day-planner
description: Turn the operator's one-line product hypothesis into the 8 ship-day blocks from `workflows/ship-a-product-in-a-day.md` — night-before frame, domain + repo, skeleton, forms + analytics, deploy, SEO baseline, first content piece, post-day update — each timeboxed with the specific commands or skills to invoke.
origin: claude-operator-stack
---

# Ship Day Planner

The 8-block ship-day in `workflows/ship-a-product-in-a-day.md` is the most-quoted workflow in the repo: from a one-line idea to a live URL with lead capture, real analytics, and a first content piece, in a single focused day. This skill takes a hypothesis sentence and produces the structured day-plan — every block timeboxed, every block named with the tool or skill that owns it, every block with a "done when" criterion. The plan is what the operator opens at 8:00 AM; the workflow is what the plan executes against.

## When to Use

- The operator says "let's plan a ship day", "split this into the 8 blocks", "I want to ship <X> tomorrow", or any variant.
- The operator opens a fresh Claude Code session in a new product directory and asks for the day's structure before doing any of the work.
- The operator returns from a stalled prototype and needs to re-enter the ship-day loop with a tightened scope.
- The operator is teaching another founder the workflow and wants a concrete worked example for their idea.
- ECC has `blueprint` (architecture decisions) and `team-builder` (multi-agent setup). Neither targets the one-day-to-live-URL cadence with the 8 specific blocks; use this one for the ship-day plan.

## Inputs

- The hypothesis sentence. One line answering "what do I believe about this market that I want to test?" — the night-before frame from block 0 of the workflow. If the operator has not provided one, prompt for it before producing any blocks.
- The ask sentence. One line answering "what is the visitor expected to do?" — the second half of the night-before frame. Booking, signup, lead capture, click-through to WhatsApp.
- Optional pre-pinned visual direction per `stack/frontend-design.md`. If the operator has already pinned a direction (editorial, brutalism, glass, dark luxury), thread it into block 2; if not, block 2 includes "pin direction" as its first sub-step rather than defaulting to "clean minimal".
- Optional stack overrides. Default: Next.js 15 + Supabase + Vercel + GA4 + Cloudflare per the workflow. Honour any override the operator gives (e.g. Astro instead of Next, Mercado Pago instead of Stripe for LATAM markets).
- Optional out-of-scope list. Anything the operator has explicitly decided not to ship today (auth, dashboard, payments past lead capture, blog past one post). Threaded into the anti-patterns block at the end of the plan as "do not drift here".

## How It Works

1. Confirm the hypothesis sentence and the ask sentence. If either is missing or vague ("a marketplace for stuff"), prompt for the tightened version before producing the plan. The plan is only as good as those two sentences.
2. Build block 0 (night-before frame, 15 min). Output the 5-line Obsidian frame template from the workflow with the operator's hypothesis and ask filled in. Tag it with `~/Brain/Projects/<name>.md` as the destination path.
3. Build blocks 1-7 in order, each as `### Block N: <name> [<duration>]` followed by the actions for the block, the tool or skill to invoke, and a single-line "done when" criterion. Block 1 is domain + repo (30 min). Block 2 is skeleton + visual direction (90 min) — cite ECC `feature-dev` and reference `stack/frontend-design.md` for the direction pin. Block 3 is forms + analytics (60 min) — cite cookbook recipe `09-telegram-bot-leads-v0.md` for the v0 lead capture and `05-ga4-cloudflare-analytics.md` for the analytics layer. Block 4 is deploy (30 min). Block 5 is SEO baseline (45 min) — cite Toprank's `seo-audit`. Block 6 is first content piece (60 min) — cite ECC `content-engine`. Block 7 is post-day update (15 min) — cite `skills/obsidian-sync-helper` for the post-update verification.
4. Append the `## Don't drift here` block listing the four anti-patterns from the workflow: skipping the domain, designing the dashboard before validating the landing page, optimising SEO past the top 5, adding auth before there are users. Append any operator-supplied out-of-scope item.
5. Append the `## Day budget` table summing the timeboxes — total should land at ~6h 45min of focused work, leaving buffer. If the operator's stack overrides push any block past 30 min over the workflow default, surface that explicitly so the operator decides whether to trim scope or extend the day.
6. Offer one optional follow-up: write the night-before frame from block 0 directly into `~/Brain/Projects/<name>.md`. Read-only by default; require explicit confirmation. Do not auto-create the project note without confirmation.
7. If the operator's hypothesis sentence implies a stack the workflow does not natively address (e.g. a mobile app, a CLI tool, a Telegram bot as the primary surface rather than as v0 lead capture), name the mismatch and ask whether the ship-day workflow is the right frame at all — the workflow is opinionated about a landing page with one ask.

## Output shape

```markdown
## Ship Day Plan — <project name> — <YYYY-MM-DD>

**Hypothesis.** <operator's one-line hypothesis>
**Ask.** <operator's one-line ask>

### Block 0: Night-before frame [15 min]
- Create `~/Brain/Projects/<name>.md` with the 5-line frame.
- Tool: Obsidian.
- Done when: hypothesis + ask + out-of-scope are written and saved.

### Block 1: Domain + repo [30 min]
- Buy domain on Cloudflare or Porkbun.
- `gh repo create <name> --private --clone`.
- Done when: empty README pushed; cert pending on the new domain.

[... blocks 2-7 in the same shape ...]

## Don't drift here

- Skipping the domain because "I'll buy it tomorrow".
- Designing the dashboard before validating the landing page works.
- Optimising the SEO checklist past the top 5 on day 1.
- Adding auth before there are users to authenticate.

## Day budget

| Block | Duration |
|-------|----------|
| 0 | 15 min |
| 1 | 30 min |
| 2 | 90 min |
| 3 | 60 min |
| 4 | 30 min |
| 5 | 45 min |
| 6 | 60 min |
| 7 | 15 min |
| **Total** | **~6h 45min** |
```

## Anti-patterns

- Do not produce a plan without a tightened hypothesis sentence. "An app that helps people" is not a hypothesis. Push back until the operator names the market and the belief.
- Do not collapse blocks to fit a shorter day. The 8 blocks are the workflow; if the operator only has 4 hours, the right answer is to ship a smaller scope of one block (e.g. block 0 + block 1 today, the rest tomorrow), not to compress block 2 to 20 minutes.
- Do not invent block content the workflow does not specify. If the operator wants a 9th block (mobile app, dashboard, paid ads), say it is out of scope for this skill and out of scope for the workflow.
- Do not auto-create the Obsidian project note. The operator owns the vault; the skill produces the frame text, the operator places it.
- Do not generate marketing copy for the visual direction. Block 2 says "pin direction" — the operator picks, the skill does not.

## Related

- [`workflows/ship-a-product-in-a-day.md`](../../workflows/ship-a-product-in-a-day.md) — the source-of-truth workflow this skill produces a plan for.
- [`stack/frontend-design.md`](../../stack/frontend-design.md) — the visual-direction pin that block 2 leans on.
- [`cookbook/09-telegram-bot-leads-v0.md`](../../cookbook/09-telegram-bot-leads-v0.md) — block 3's recommended v0 lead capture.
- [`cookbook/05-ga4-cloudflare-analytics.md`](../../cookbook/05-ga4-cloudflare-analytics.md) — block 3's analytics layer.
- [`cookbook/04-cloudflare-argo-local-dev.md`](../../cookbook/04-cloudflare-argo-local-dev.md) — supports block 4's deploy if a webhook surface is in scope.
- [`skills/obsidian-sync-helper`](../obsidian-sync-helper/SKILL.md) — block 7's post-day update can run through this skill for a verified post-day note.
- ECC `blueprint` and `team-builder` — disambiguated above; neither targets the one-day-to-live-URL cadence.
