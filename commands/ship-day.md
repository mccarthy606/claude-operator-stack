---
name: ship-day
description: Turn a one-line product hypothesis into the 8 ship-day blocks from `workflows/ship-a-product-in-a-day.md` — night-before frame, domain + repo, skeleton, forms + analytics, deploy, SEO baseline, first content piece, post-day update — each timeboxed with the specific commands or skills to invoke.
origin: claude-operator-stack
---

# /ship-day

Plan a single focused day from a one-line hypothesis to a live URL with lead capture, real analytics, and a first content piece. The command forces the hypothesis into a quoted positional arg (vague input gets pushed back), inlines the canonical 8-block schedule, and produces a structured day-plan with timeboxes, "done when" criteria, and pointers to the skill or command that owns each block.

When invoked, this command runs the [`ship-day-planner`](../skills/ship-day-planner/SKILL.md) skill with the args and defaults below.

## When to use

- You just decided "I want to ship X tomorrow" and need the 8 blocks before you open VS Code.
- You opened a fresh Claude Code session in a new product directory and want the day's structure first.
- You returned from a stalled prototype and need to re-enter the ship-day loop with a tightened scope.
- You are teaching another founder the workflow and want a worked example for their idea.

## Usage

```
/ship-day "<one-line product hypothesis>" [--ask "<one-line ask>"] [--inputs-only] [--stack <override>]
```

| Arg / flag | Type | Default | Notes |
|------------|------|---------|-------|
| `<hypothesis>` | required, quoted | — | One sentence answering "what do I believe about this market that I want to test?". Vague hypotheses get pushed back, not planned. |
| `--ask` | optional | prompted | One sentence answering "what is the visitor expected to do?" — booking, signup, lead capture, click-to-WhatsApp. Prompted for if missing. |
| `--inputs-only` | optional flag | off | Returns the 8 blocks but skips the night-before frame. Use when you already wrote the frame the night before. |
| `--stack` | optional | `Next.js 15 + Supabase + Vercel + GA4 + Cloudflare` | Stack override (e.g. `Astro` instead of `Next`, `Mercado Pago` instead of `Stripe` for LATAM). Honoured throughout the plan. |

The hypothesis is a positional arg because the rest of the plan keys off it. A hypothesis-shaped sentence ("tiny pricing-calculator microsite for indie SaaS founders sized 5-50k MRR") makes the plan crisp; "an app that helps people" produces a plan that doesn't survive contact with the day.

## Examples

```
/ship-day "tiny pricing-calculator microsite for indie SaaS founders sized 5-50k MRR"
```
Builds the 8 blocks with the default stack. Block 0 lands the night-before frame in `~/Brain/Projects/<name>.md`; blocks 1-7 cover domain/repo through post-day update.

```
/ship-day "AI-assisted Spanish flashcard PWA for adult learners" --inputs-only
```
Skips block 0 (you already wrote the frame the night before), returns blocks 1-7 with timeboxes, tools, and "done when" criteria.

```
/ship-day "scroll-tracking Webflow alternative" --stack "Astro + Cloudflare Pages + Plausible"
```
Default 8 blocks but with the alternate stack threaded into block 2 (skeleton) and block 3 (analytics). Surfaces any block where the override pushes the timebox past 30 min over the workflow default.

### Example output shape

```markdown
## Ship Day Plan — pricing-calc — 2026-05-05
**Hypothesis.** tiny pricing-calculator microsite for indie SaaS founders sized 5-50k MRR
**Ask.** Visitor enters MRR + plan; sees 3 tier recommendations and a Calendly CTA.

### Block 0: Night-before frame [15 min]
- Create `~/Brain/Projects/pricing-calc.md` with the 5-line frame.

### Block 1: Domain + repo [30 min]
- Buy `pricing-calc.example` on Cloudflare; `gh repo create pricing-calc --private --clone`.
- Done when: empty README pushed; cert pending.

[... blocks 2-7 in the same shape ...]

| Block | Duration |
|-------|----------|
| 0-7   | ~6h 45min total |
```

## Behavior

1. Confirm the hypothesis sentence. If vague, push back for a tightened version before producing the plan.
2. Confirm the ask sentence. If `--ask` was not supplied, prompt for it before producing the plan.
3. Build block 0 (night-before frame, 15 min) — output the 5-line Obsidian frame template with hypothesis + ask filled in. Tag the destination as `~/Brain/Projects/<name>.md`. Skipped if `--inputs-only` is set.
4. Build blocks 1-7 in order, each as `### Block N: <name> [<duration>]` followed by actions, the tool or skill that owns the block, and a single-line "done when" criterion. Block 1 is domain + repo (30 min), block 2 is skeleton + visual direction (90 min), block 3 is forms + analytics (60 min), block 4 is deploy (30 min), block 5 is SEO baseline (45 min), block 6 is first content piece (60 min), block 7 is post-day update (15 min).
5. Append the `## Don't drift here` block — the four anti-patterns from the workflow + any operator-supplied out-of-scope item.
6. Append the `## Day budget` table summing timeboxes (~6h 45min total of focused work). If a stack override pushes any block past 30 min over the default, surface that explicitly so you decide whether to trim scope or extend the day.

Full protocol — including how the night-before frame gets persisted and when to push back on a stack mismatch — lives in the wrapped skill.

## Defaults and conventions

- **Default stack**: Next.js 15 + Supabase + Vercel + GA4 + Cloudflare. Honoured everywhere unless `--stack` overrides.
- **Default schedule**: 8 blocks summing to ~6h 45min of focused work. The 8 blocks are the workflow; do not collapse them to fit a shorter day. If you only have 4 hours, ship a smaller scope of one block (block 0 + block 1 today, the rest tomorrow), not a compressed block 2.
- **Visual direction**: block 2 starts with "pin direction" — the operator picks (editorial, brutalism, glass, dark luxury, etc.); the command does not default to "clean minimal".
- **Content for block 6**: cite ECC `content-engine`. Block 7 chains to [`/sync-brain`](sync-brain.md) for the post-day update.
- **Read-only**: never auto-creates the Obsidian project note; you place the frame text yourself.

## Related

- Wrapped skill: [`skills/ship-day-planner/SKILL.md`](../skills/ship-day-planner/SKILL.md)
- Workflow: [`workflows/ship-a-product-in-a-day.md`](../workflows/ship-a-product-in-a-day.md) — the canonical 8 blocks; the command's source of truth.
- Stack: [`stack/frontend-design.md`](../stack/frontend-design.md) — the visual-direction pin block 2 leans on.
- Cookbook: [`cookbook/09-telegram-bot-leads-v0.md`](../cookbook/09-telegram-bot-leads-v0.md) — block 3's recommended v0 lead capture.
- Cookbook: [`cookbook/05-ga4-cloudflare-analytics.md`](../cookbook/05-ga4-cloudflare-analytics.md) — block 3's analytics layer.
- Adjacent: [`/sync-brain`](sync-brain.md) — chains from block 7 for the verified post-day update.
