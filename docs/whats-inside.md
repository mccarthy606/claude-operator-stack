*Expanded from [README §What's Inside](../README.md#whats-inside).*

# What's Inside

```
claude-operator-stack/
├── README.md                    ← you are here
├── install.sh                   ← one-liner installer (audit before running)
├── CLAUDE.md                    ← my project-level Claude config (sanitized)
│
├── assets/                      ← hero banner + screenshots embedded in docs
│   ├── hero.svg                 ← animated SVG hero shown atop README
│   └── screenshots/             ← stack-in-action SVG screenshots
│       ├── install-dryrun.svg
│       ├── obsidian-vault.svg
│       ├── claude-reads-note.svg
│       └── README.md
│
├── stack/                       ← component-by-component setup
│   ├── ecc.md                   ← Everything Claude Code: what I use, why
│   ├── toprank.md               ← Toprank: SEO + Ads workflow
│   ├── frontend-design.md       ← UI generation
│   ├── obsidian-brain.md        ← Obsidian as second brain
│   ├── graphify.md              ← graphify knowledge-graph layer
│   └── mcp-servers.md           ← The MCP servers I run + what they do
│
├── workflows/                   ← how I actually work
│   ├── ship-a-product-in-a-day.md
│   ├── parallel-projects.md     ← managing 7 in flight at once
│   ├── obsidian-as-context.md   ← the "second brain" loop
│   ├── content-pipeline.md      ← YouTube + IG automation
│   └── solo-ops.md              ← running a company of one
│
├── case-studies/                ← real shipped products, not demos
│   ├── niche-booking-trio.md
│   ├── ai-legal-tool.md
│   ├── whatsapp-b2b-saas.md
│   └── youtube-pipeline.md
│
├── commands/                    ← 6 slash-commands wrapping the original skills
│   ├── solo-monday-review.md
│   ├── anonymise-case-study.md
│   ├── ship-day.md
│   ├── cost-rollup.md
│   ├── bridge-context.md
│   ├── sync-brain.md
│   └── README.md                ← convention + skills-vs-commands index
│
├── cookbook/                    ← 12 copy-pasteable how-to recipes
│   ├── 01-claude-code-from-zero.md
│   ├── 02-stripe-connect-p2p.md
│   ├── 03-whatsapp-cloud-api-webhook.md
│   ├── 04-cloudflare-argo-local-dev.md
│   ├── 05-ga4-cloudflare-analytics.md
│   ├── 06-sentry-fullstack.md
│   ├── 07-supabase-vercel-pooling.md
│   ├── 08-ytdlp-whisper-research.md
│   ├── 09-telegram-bot-leads-v0.md
│   ├── 10-mercado-pago-latam.md
│   ├── 11-scheduled-prompts-cron.md
│   └── 12-content-cross-post-pipeline.md
│
├── docs/                        ← long-form guides
│   ├── comparing-stacks.md
│   ├── whats-inside.md
│   ├── v1-changelog-deep-dive.md
│   └── why-only-claude-code.md
│
├── skills/                      ← 6 original SKILL.md packages (invocable prompts)
│   ├── solo-billing-monitor/
│   ├── multi-project-context-bridge/
│   ├── obsidian-sync-helper/
│   ├── case-study-anonymiser/
│   ├── weekly-monday-review/
│   └── ship-day-planner/
│
├── packages/                    ← npm-publishable packages (workspaces)
│   └── cli/                     ← claude-operator-stack: init | verify | list-stack
│
├── scaffolds/                   ← copy-and-run starting points
│   ├── web-saas/                ← Next.js 15 + Supabase + Sentry + GA4
│   └── whatsapp-saas/           ← FastAPI + Docker + WhatsApp Cloud API + Anthropic SDK
│
├── profiles/                    ← opinionated install paths by archetype
│   ├── indie-hacker.md
│   ├── non-technical-founder.md
│   ├── freelancer-agency.md
│   └── content-creator-operator.md
│
├── configs/                     ← sanitized configs you can copy
│   ├── settings.json.example
│   ├── mcp-servers.json.example
│   ├── hooks.json.example
│   ├── hooks/                   ← 6 sanitized hooks + per-hook README
│   └── rules/
│       └── obsidian-integration.md
│
├── tests/                       ← integration tests for install.sh + CLI
│   ├── integration/
│   │   ├── install-sh.test.sh
│   │   ├── cli-init.test.ts
│   │   ├── cli-verify.test.ts
│   │   └── cli-list-stack.test.ts
│   ├── run-all.sh               ← entrypoint that runs all integration tests
│   ├── vitest.config.ts
│   └── README.md
│
└── credits/                     ← attribution to every original author
    └── README.md
```

Inside `stack/`: 6 component breakdowns plus [`ecc-skill-index.md`](../stack/ecc-skill-index.md) — a navigation reference into the 30 ECC skills I actually use, sorted by use case.

For the audience-fit comparison against Everything Claude Code and starter templates, see [comparing-stacks.md](comparing-stacks.md). For the rationale on the single-harness scope of `configs/` and `stack/`, see [why-only-claude-code.md](why-only-claude-code.md).
