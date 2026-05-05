---
name: solo-billing-monitor
description: Run a weekly cost rollup across the operator's solo-founder cloud and AI services (default Vercel, Railway, Supabase, Anthropic, OpenAI, Cloudflare), comparing this-week to last-week spend and flagging any line item up more than 30% week-over-week as INVESTIGATE.
origin: claude-operator-stack
---

# Solo Billing Monitor

Cost-creep on a paused project is the silent killer for a solo founder running 7 things at once — Surface 4 of `workflows/solo-ops.md` calls it out explicitly. This skill takes current-week and prior-week spend across the operator's stack of services and produces the weekly rollup: a sorted markdown table, a delta column, and a watch list. Most-likely invocation is end-of-week, after Friday touchpoints, before the Monday review.

## When to Use

- The user asks for the weekly cost rollup, the cost-creep audit, or any variant of "where is my money going across the stack".
- The user pastes usage exports from Vercel, Railway, Supabase, Anthropic, OpenAI, or Cloudflare and asks for a comparison against last week.
- The user invokes the skill explicitly on a non-default cadence (mid-week spike check, post-incident audit) and supplies the numbers.
- The user just shipped a new product on a paused stack and wants a baseline before the next billing cycle lands.
- ECC has `customer-billing-ops` (billing customers), `finance-billing-ops` (financial-ops), and `ecc-tools-cost-audit` (audits ECC's own tooling cost). None do solo-founder cross-cloud cost rollup; use this one for the operator's personal infra spend.

## Inputs

- The list of services in scope. Default set: Vercel, Railway, Supabase, Anthropic, OpenAI, Cloudflare. Honour any added or removed service the user names (e.g. add Sentry, Mercado Pago, Cloudflare R2; remove anything pre-revenue free-tier).
- Current-week spend per service, either pasted by the user or read from CSV exports the user provides. Each row is `(service, line item, amount in USD, optional usage units)`.
- Prior-week spend per service, in the same shape. If the user does not provide it, run the rollup with absolute spend only and note that no delta column was produced.
- The W/W flag threshold, default 30%. Honour the user's override if they specify one (operators on tight runway may want 15%; operators in growth mode may want 50%).
- The watch-list threshold, default 15%. Items between the watch threshold and the flag threshold land on the watch list rather than the INVESTIGATE list.
- The reporting currency, default USD. If the user supplies numbers in a different currency, do not auto-convert — ask for the rate or run the rollup in the supplied currency throughout.
- An optional project tag per line item, when the operator runs multiple products on the same vendor account. The tag drives the per-project subtotal block at the bottom of the table.

## How It Works

1. Parse the current-week input. For each service, normalise to a `service / line item / amount / units` shape. If the user pasted a screenshot or a vendor's HTML dashboard, ask for the underlying numbers — do not guess.
2. Parse the prior-week input the same way. If the user provided one number per service rather than per line item, downgrade the comparison to service-level only and note the loss of granularity in the output.
3. Compute the delta for each line item: `((this − last) / last) * 100`. Handle the new-line-item case (last == 0) by emitting `NEW` rather than infinity. Handle the dropped-line-item case (this == 0, last > 0) by emitting `DROPPED` and including it in the table for one week before falling off.
4. Classify each line item: `OK` (delta below watch threshold), `WATCH` (between watch and flag), `INVESTIGATE` (at or above flag threshold), `NEW`, or `DROPPED`. Sort the table by absolute current-week spend descending.
5. Build the markdown table with columns `Service | Line item | This week | Last week | Δ% | Status`. Append a one-paragraph summary: total this-week spend, total last-week spend, total delta percent, count of `INVESTIGATE` rows.
6. If any `INVESTIGATE` rows exist, append a `## Watch list` H2 listing each row with a one-line operator hypothesis prompt: `<service / line item> — likely cause? recent deploy, paused project still running, traffic spike, vendor pricing change?`. Do not pretend to know which cause is right — the operator decides.
7. Offer one optional follow-up: store this rollup as a dated entry in `~/Brain/Knowledge/billing-rollups/<YYYY-MM-DD>.md`. Read-only by default; require explicit confirmation before writing.
8. If the operator declines a project that produced an `INVESTIGATE` row, suggest opening that project's Obsidian note and adding a question to the open-questions block. Do not auto-write the question — the suggestion is enough.

The flow assumes the operator has already pulled the raw numbers from each vendor dashboard. Pulling those numbers via vendor MCPs (where they exist) is a separate step; this skill is the rollup, not the collection.

## Output shape

```markdown
## Weekly cost rollup — week ending <YYYY-MM-DD>

| Service | Line item | This week | Last week | Δ% | Status |
|---------|-----------|-----------|-----------|-----|--------|
| Anthropic | API usage | $42.10 | $18.30 | +130% | INVESTIGATE |
| Vercel | Pro seat | $20.00 | $20.00 | 0% | OK |
| Railway | Compute | $8.40 | $7.10 | +18% | WATCH |
| Supabase | Pro plan | $25.00 | $25.00 | 0% | OK |

Total this week: $95.50 · last week: $70.40 · Δ +35.7% · 1 line on INVESTIGATE.

## Watch list

- Anthropic / API usage — likely cause? recent deploy, paused project still running, traffic spike, vendor pricing change?
```

If the operator did not supply prior-week numbers, the table omits the `Last week` and `Δ%` columns and the watch-list section is replaced by a single line: `No prior-week comparison supplied — baseline established for next rollup.`

## Anti-patterns

- Do not invent line items the user did not supply. If the user pastes Vercel and Railway only, the rollup covers Vercel and Railway only — do not extrapolate Anthropic spend from a guess.
- Do not auto-investigate flagged lines. The skill produces hypotheses for the operator to choose from; it does not call vendor APIs to drill in. That is a separate ops session.
- Do not include forecasts or "projected monthly" columns. The skill is week-over-week, not predictive — projection adds error and the operator has not asked for it.
- Do not write the rollup to disk without the user's explicit confirmation. The default path is `~/Brain/Knowledge/billing-rollups/<date>.md` only when asked.
- Do not use marketing language. "Spend grew 35.7% week-over-week" is the right tone, not "an exciting cost story".
- Do not collapse multi-project spend into a single number when the operator runs multiple products on the same vendor account. Surfacing per-project subtotals is what makes a paused-project creep visible.
- Do not silently move the flag threshold to make the report look quieter. If a week has 8 INVESTIGATE rows, the report has 8 INVESTIGATE rows — masking the count is how cost-creep wins.
- Do not chain into a "let me also pull current numbers from Vercel for you" tangent. Number collection is the operator's job; this skill is the rollup.

## Related

- [`workflows/solo-ops.md`](../../workflows/solo-ops.md) — Surface 4 establishes the weekly cost rollup as a separate ops loop, distinct from the daily dashboard glance.
- [`cookbook/05-ga4-cloudflare-analytics.md`](../../cookbook/05-ga4-cloudflare-analytics.md) — the analytics layer that lets the operator correlate a cost spike with a traffic spike.
- [`workflows/parallel-projects.md`](../../workflows/parallel-projects.md) — the third-rail rule that paused projects can creep silently is what motivates this skill.
- [`stack/mcp-servers.md`](../../stack/mcp-servers.md) — vendor MCPs (where they exist) are how the operator pulls the numbers this skill consumes.
- ECC `customer-billing-ops`, `finance-billing-ops`, and `ecc-tools-cost-audit` — disambiguated above; this skill is operator-internal cross-cloud cost monitoring, not buyer-facing billing.
