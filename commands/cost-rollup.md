---
name: cost-rollup
description: Run the weekly cross-cloud + AI cost rollup across the operator's default services (Vercel, Railway, Supabase, Anthropic, OpenAI, Cloudflare), comparing this-week to last-week spend and flagging any line item up more than 30% week-over-week as INVESTIGATE.
origin: claude-operator-stack
---

# /cost-rollup

Roll up your weekly spend across cloud + AI services. The command applies sensible operator defaults (the 6-service stack from your `workspace_export`, the 30% W/W flag threshold), produces a sorted markdown table with a delta column, and flags any line item creeping past the threshold for investigation.

When invoked, this command runs the [`solo-billing-monitor`](../skills/solo-billing-monitor/SKILL.md) skill with the args and defaults below.

## When to use

- End of week, after Friday touchpoints, before the Monday review — the canonical cost-rollup slot.
- You just shipped a new product on a previously-paused stack and want a baseline before the next billing cycle lands.
- You hit a mid-week spike and want a fast audit instead of waiting for the weekly cadence.
- You are running a post-incident review where cost was a symptom (Anthropic API spike correlates with a runaway agent loop).

## Usage

```
/cost-rollup [--services <comma-list>] [--threshold <pct>] [--watch <pct>] [--out <path>]
```

| Arg / flag | Type | Default | Notes |
|------------|------|---------|-------|
| `--services` | optional | `Vercel,Railway,Supabase,Anthropic,OpenAI,Cloudflare` | Comma-separated service set; defaults match the operator's `workspace_export` stack. |
| `--threshold` | optional | `30` | W/W flag threshold (percent). Line items at or above land on `INVESTIGATE`. |
| `--watch` | optional | `15` | Watch threshold (percent). Items between watch and threshold land on `WATCH`. |
| `--out` | optional | stdout | Path to write the rollup; default is to print inline. Honours `--out ~/Brain/Knowledge/billing-rollups/<date>.md` for the canonical archive. |

The command does not pull current numbers from vendor APIs — that is the operator's job, by paste or CSV. This command is the rollup, not the collection.

## Examples

```
/cost-rollup
```
Default 6-service rollup with the 30% threshold. Expects this-week and last-week numbers as input (paste or CSV).

```
/cost-rollup --services "Vercel,Anthropic" --threshold 20
```
Focused rollup for the two services you care about this week, with a tighter alerting threshold. Useful when one product is in growth mode and you want earlier signal.

```
/cost-rollup --out ~/Brain/Knowledge/billing-rollups/2026-05-04.md
```
Same as default but writes the rollup to the canonical archive path (still requires explicit confirmation per the skill's read-only stance).

### Example output shape

```markdown
## Weekly cost rollup — week ending 2026-05-04

| Service   | Line item   | This week | Last week | Δ%    | Status      |
|-----------|-------------|-----------|-----------|-------|-------------|
| Anthropic | API usage   | $42.10    | $18.30    | +130% | INVESTIGATE |
| Vercel    | Pro seat    | $20.00    | $20.00    | 0%    | OK          |
| Railway   | Compute     | $8.40     | $7.10     | +18%  | WATCH       |

Total this week: $95.50 · last week: $70.40 · Δ +35.7% · 1 line on INVESTIGATE.

## Watch list
- Anthropic / API usage — likely cause? recent deploy, paused project still running, traffic spike, vendor pricing change?
```

## Behavior

1. Parse the current-week input. For each service, normalise to `service / line item / amount / units`. Refuse to guess from screenshots or HTML dashboards — ask for the underlying numbers.
2. Parse the prior-week input the same way. If only one number per service was supplied, downgrade the comparison to service-level and surface the loss of granularity.
3. Compute the delta per line item: `((this − last) / last) * 100`. Emit `NEW` for last == 0; `DROPPED` for this == 0 (kept in the table for one week).
4. Classify: `OK` (below watch), `WATCH` (between watch and threshold), `INVESTIGATE` (≥ threshold), `NEW`, or `DROPPED`. Sort by absolute current-week spend descending.
5. Build the table with `Service | Line item | This week | Last week | Δ% | Status` columns + a one-paragraph summary (totals, delta, INVESTIGATE count).
6. If any `INVESTIGATE` rows exist, append a `## Watch list` H2 with one-line operator hypothesis prompts per row (recent deploy? paused project still running? traffic spike? vendor pricing change?) — never pretend to know the cause.

Full protocol — including the optional follow-up to write to `~/Brain/Knowledge/billing-rollups/` — lives in the wrapped skill.

## Defaults and conventions

- **Default services**: `Vercel, Railway, Supabase, Anthropic, OpenAI, Cloudflare` — the operator's `workspace_export` baseline. Add Sentry / Mercado Pago / R2 explicitly when relevant.
- **Default thresholds**: `30%` flag, `15%` watch. Operators on tight runway can tighten with `--threshold 20`; growth-mode operators can loosen with `--threshold 50`.
- **Currency**: USD by default; if you supply other currency, the rollup runs in that currency throughout — never auto-convert without an explicit rate.
- **Hypothesis prompts**: every `INVESTIGATE` row gets a question, never a verdict. The operator decides which cause is right.
- **No forecasts**: week-over-week only. No projected-monthly columns; projection adds error and you did not ask for it.

## Related

- Wrapped skill: [`skills/solo-billing-monitor/SKILL.md`](../skills/solo-billing-monitor/SKILL.md)
- Workflow: [`workflows/solo-ops.md`](../workflows/solo-ops.md) — Surface 4 establishes the weekly cost rollup as a separate ops loop.
- Cookbook: [`cookbook/05-ga4-cloudflare-analytics.md`](../cookbook/05-ga4-cloudflare-analytics.md) — the analytics layer that lets you correlate a cost spike with a traffic spike.
- Stack: [`stack/mcp-servers.md`](../stack/mcp-servers.md) — vendor MCPs (where they exist) for pulling the raw numbers this command consumes.
