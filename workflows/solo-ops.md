# Solo Ops

How customer support, billing, scheduling, and infra get handled by one person without consuming the day.

The mistake most solo founders make: treating ops as background noise that you'll "automate later." Then ops eats the week and the product doesn't ship. The fix is to treat ops as a **first-class workflow** with the same Claude Code support as building.

## The four ops surfaces

For my setup, ops breaks into:

1. **Customer-facing comms** — email, WhatsApp, support inboxes
2. **Money** — billing, refunds, invoicing, taxes (separate)
3. **Calendar + scheduling** — meetings, deadlines, follow-ups
4. **Infra** — uptime, deploys, error monitoring, costs

Each gets its own Claude Code workflow, all triggered from the same `~/ops/` directory.

## Surface 1: Customer comms

ECC's `chief-of-staff` skill is the entrypoint. Triages email + WhatsApp + Slack into 4 tiers:

- **skip** — newsletters, system notifications
- **info_only** — FYI, no reply needed
- **meeting_info** — scheduling, calendar
- **action_required** — needs a real reply

For action_required, it drafts the reply. I review and send. Time per inbox: 10–15 minutes most days.

The `chief-of-staff` skill does not auto-send. Human in the loop on every reply that goes to a real person. **Auto-reply is a trap** — one wrong tone in a customer escalation costs more than a week of saved time.

## Surface 2: Money

Three subdomains:

- **Billing the customer** — Stripe (or Mercado Pago for AR market). Webhooks → Supabase row → Telegram notification when a payment lands.
- **Paying my own bills** — annual review only, scripts generate the spreadsheet from bank exports. Not Claude territory yet.
- **Taxes** — quarterly with my accountant, manually. AI in this loop is too risky for jurisdictional rules.

The pattern is: **automate notification, do not automate decision.** I should know within 5 minutes when something paid; I should not have a script transferring money around.

## Surface 3: Calendar

Calendar lives in Google Calendar. Claude Code reaches it via the Google Workspace MCP. ECC's `chief-of-staff` flags scheduling threads from email and proposes time slots; I confirm.

For deadlines (legal filings, domain renewals, customer commitments), I keep a list in `~/Brain/Projects/_ops.md` with dates, and a cron-style scheduled prompt (via `mcp__scheduled-tasks__create_scheduled_task`) reminds me 7 / 3 / 1 days before.

## Surface 4: Infra

Three telemetry sources, all piped to a single Telegram channel:

- **Sentry** — errors per app
- **Cloudflare web analytics** — traffic + uptime
- **Vercel / Railway** — deploy status, build failures

The `dashboard-builder` skill from ECC produced the original layout. I check it once a day at the start of work, not throughout the day.

Cost monitoring is separate — once a week I run a cost rollup script across Vercel + Railway + Supabase + Anthropic + OpenAI usage. If any single line item is up >30% week-over-week without a known reason, I investigate. Without this check costs creep silently.

## The daily ops routine

8:00–8:30 AM:
1. Open the ops dashboard (Telegram channel + browser tabs for Stripe + Sentry)
2. Run `/chief-of-staff` on email + WhatsApp
3. Process the action_required tier (10–15 min)
4. Glance at deploy status across active projects

That's 30 minutes. Done by 8:30. Day is clear for product work.

If ops is taking more than 60 minutes a day, something is wrong — usually it means a customer escalation needs a real conversation, or a piece of infra needs hardening.

## What I refuse to automate

- Replies to angry customers
- Refund decisions
- Hiring decisions (when there's eventually team)
- Any money movement
- Legal correspondence
- Press / media replies

Each of these has been bitten by founders who automated and regretted it. The cost of typing the reply is small. The cost of an auto-reply that misses tone is large.

## What I gladly automate

- Sorting and triaging inbound
- Drafting routine confirmations
- Surface alerts (uptime, payment, error)
- Recurring reports (weekly cost rollup, monthly metrics)
- Scheduling follow-ups
- Cross-posting outputs

## The principle

**AI handles inbound classification and outbound drafting. Humans handle decisions and tone.**

If a workflow can be expressed as "given X input, classify or draft Y" — automate. If it requires judgment about a person, money, or risk — keep a human in the chair.

## What this is not

This is not "build a one-person company so big it doesn't need a team." It is "build the muscle to stay solo through pre-revenue without operations eating the runway."

When the projects start producing money and need a real team, hire. The point is not to be solo forever — the point is to be solo *productively* until hiring is a decision instead of a desperate move.
