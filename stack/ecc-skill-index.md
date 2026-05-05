# ECC Skill Index

A navigation aid into [Everything Claude Code](https://github.com/affaan-m/everything-claude-code). One row per skill the operator actually reaches for, with the use case and an example invocation.

This file is **not a duplication** of ECC content. ECC remains the source of truth for what each skill does and how it works. This index is the "which one do I want right now" lookup.

ECC ships ~180 skills. The honest answer to "where do I start" is not "read them all" — it is "here are the 30 I touch in a given month, organised by what I'm trying to do." Read this when you have a task and need a starting point. Browse `/skill` inside Claude Code when you have time and want to discover.

## How to use this index

Skim by section heading until you hit the surface area you're working on. Copy the example invocation, swap your context in, and run it. If a skill exists in ECC but is missing from this list, that is on purpose — it is either redundant with one already here, or I have not found a real use for it yet.

Source links go to the upstream ECC repo. Skill bodies are not reproduced here. If the upstream skill changes, this index does not.

## Building things

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `feature-dev` | Guided feature work with codebase context — plan first, then implement. | `/feature-dev landing page hero with lead form, Next.js + Tailwind` |
| `tdd-workflow` | Write tests first when the surface is non-trivial. | `/tdd-workflow` at the start of a new module |
| `frontend-design` | Distinctive UI generation, anti-template by default. | After pinning a style direction in `CLAUDE.md`, just describe the surface |
| `frontend-patterns` | React/Next.js component patterns, state management, hooks. | `/frontend-patterns` when you need a consistent shape, not a one-off |
| `frontend-slides` | Animation-rich HTML decks for product launches and demos. | `/frontend-slides talk: <topic>, 12 slides, dark editorial direction` |
| `feature-dev` + `tdd-workflow` | Combined for production features that need test coverage from day one. | Run `/tdd-workflow` first, then `/feature-dev` inside the failing-test loop |
| `build-fix` | Route the right resolver agent at a broken build. | `/build-fix` after a failing CI run, paste the error |
| `code-review` | Review uncommitted local changes before push, or a GitHub PR. | `/code-review` for working tree, or `/code-review <PR#>` for a remote PR |
| `simplify` | Audit a recent diff for redundant code, weak naming, missed reuse. | `/simplify` right after a feature lands and before the PR goes up |
| `plankton-code-quality` | Write-time enforcement — formatting, linting, complexity budget. | `/plankton-code-quality` as a project-level rule, runs on save |
| `documentation-lookup` | Current library docs via Context7 instead of stale training data. | `/documentation-lookup how does Next.js 15 handle parallel routes` |
| `skill-create` | Codify a repeatable workflow into a reusable skill. | `/skill-create` after the third time you do the same multi-step task |

## Marketing and content

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `content-engine` | Multi-platform content production for X, LinkedIn, TikTok, YouTube. | `/content-engine` with a topic brief from `~/Brain/Content/` |
| `content-production` | Full pipeline — blank page to scheduled posts. | `/content-production topic: <one line>, target: <platform>` |
| `content-strategy` | Decide what content to make, which platforms, which cadence. | `/content-strategy` before launching a new brand or content track |
| `article-writing` | Long-form articles, guides, blog posts, newsletter issues. | `/article-writing topic: <X>, audience: <who>, length: 1500w` |
| `copywriting` | Headlines, ad copy, page copy, hooks. | `/copywriting hero headline for <product>, audience <X>, tone <Y>` |
| `copy-editing` | Polish existing marketing copy without rewriting from scratch. | `/copy-editing` against a draft, ask for clarity + tightening |
| `humanizer` | Strip AI patterns out of generated prose. | `/humanizer` against any AI-drafted long-form before publishing |
| `content-humanizer` | Same idea, content-specific — keep voice, kill slop. | `/content-humanizer` on YouTube descriptions and Instagram captions |
| `marketing-psychology` | Apply mental models and frames to messaging. | `/marketing-psychology` when a page reads logically but converts badly |
| `brand-voice` | Build a voice profile from real posts, then write to it. | `/brand-voice` once per brand, store the profile in `~/Brain/` |
| `crosspost` | Take one source asset, produce platform-native variants. | `/crosspost` from a YouTube script to X thread + LinkedIn post + Threads |
| `seo` | Ongoing SEO work — content, structure, internal linking. | `/seo` against the URL you want to rank |
| `seo-audit` | Full technical + on-page audit on a single URL. | `/seo-audit https://your-site.com/page` |
| `ai-seo` | Optimise content for ChatGPT, Perplexity, Gemini citations. | `/ai-seo` after `seo-audit`, before publishing key money pages |
| `programmatic-seo` | SEO-driven pages at scale via templates and structured data. | `/programmatic-seo` for marketplaces and directory-shaped products |
| `paid-ads` | Google + Meta ad campaigns, copy + targeting + budgeting. | `/paid-ads` when planning a launch with paid distribution |
| `email-sequence` | Drip campaigns, lifecycle email, cold sequences. | `/email-sequence post-signup onboarding, 5 emails over 14 days` |
| `cold-email` | B2B cold outreach, single-thread or sequence. | `/cold-email` with target persona + value prop + one ask |
| `x-twitter-growth` | Audience building, viral patterns, engagement loops. | `/x-twitter-growth` for monthly growth review on a brand account |

## Research and decision-making

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `deep-research` | Multi-source research using firecrawl + exa. | `/deep-research <question>` when the answer isn't in your training data |
| `documentation-lookup` | Library and framework docs via Context7. | `/documentation-lookup` before writing any non-trivial integration |
| `exa-search` | Neural search via Exa for web, code, and company research. | `/exa-search` for finding adjacent prior art and competitor patterns |
| `market-research` | Competitive analysis, investor due diligence, market sizing. | `/market-research` before committing to a niche or pivoting |
| `council` | Convene a four-voice council for ambiguous calls. | `/council` when stuck between two paths and the tradeoffs aren't clean |
| `executive-mentor` | Adversarial thinking partner for hard tradeoffs. | `/executive-mentor` to stress-test a decision before you commit |
| `prompt-optimizer` | Improve a raw prompt before it eats tokens. | `/prompt-optimizer` against any prompt you'll run more than three times |

## GSD workflow

The Get Shit Done skill family is the closest thing ECC has to a project methodology. It is opinionated. Adopt it whole or skip it whole — picking three GSD skills out of context creates more friction than value.

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `gsd-new-project` | Initialize a project with deep context gathering and `PROJECT.md`. | `/gsd-new-project` on day zero of any new repo |
| `gsd-explore` | Socratic ideation — think through an idea before committing to a phase. | `/gsd-explore` when you have a vague idea and want to route it |
| `gsd-spec-phase` | Clarify *what* a phase delivers before planning *how*. | `/gsd-spec-phase` when the goal is fuzzy or the success criteria are missing |
| `gsd-plan-phase` | Create a detailed phase plan with verification loop. | `/gsd-plan-phase` after spec is locked |
| `gsd-execute-phase` | Run all plans in a phase with wave-based parallelism. | `/gsd-execute-phase` to actually do the work |
| `gsd-verify-work` | Validate built features through conversational UAT. | `/gsd-verify-work` before marking a phase complete |
| `gsd-ship` | PR + review + merge prep after verification passes. | `/gsd-ship` as the last step in any phase |
| `gsd-progress` | Check project state, route to next action. | `/gsd-progress` when you open a project after time away |

## Solo ops

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `chief-of-staff` | Triage email + WhatsApp + Slack into action tiers, draft replies. | `/chief-of-staff` once per morning, batch-process the action_required tier |
| `email-ops` | Evidence-first mailbox triage, drafting, send verification. | `/email-ops` for a deep inbox session beyond chief-of-staff triage |
| `messages-ops` | Live messaging workflow — WhatsApp, Telegram, Discord. | `/messages-ops` for cross-channel reply drafting |
| `dashboard-builder` | Build a real monitoring dashboard from real telemetry. | `/dashboard-builder` once per project, then check the output daily |
| `github-ops` | GitHub repo operations, issue triage, PR babysitting. | `/github-ops` for cross-repo issue sweeps |
| `google-workspace-ops` | Drive + Docs + Sheets + Slides as one workspace. | `/google-workspace-ops` when working across the suite, not a single doc |
| `scheduled-tasks` MCP | Cron-style reminders for deadlines, renewals, follow-ups. | Used inline — `mcp__scheduled-tasks__create_scheduled_task` for any 7/3/1-day reminder |
| `terminal-ops` | Evidence-first repo execution workflow. | `/terminal-ops` when a multi-step shell sequence needs to be reproducible |
| `automation-audit-ops` | Inventory automations, find overlap and gaps. | `/automation-audit-ops` quarterly, before adding a new automation |

## Security and quality

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `security-review` | Auth, input handling, webhooks, secrets — full review pass. | `/security-review` before any commit that touches auth or money |
| `ai-regression-testing` | Sandbox-based regression checks for AI-assisted changes. | `/ai-regression-testing` after a refactor that AI did most of |
| `code-review` | General review of working tree or PR — not security-specific. | `/code-review` after a feature lands, before opening the PR |
| `verification-loop` | Comprehensive verification — build, lint, types, tests in one loop. | `/verification-loop` as a stop-gap before pushing to main |
| `simplify` | Audit recent code for reuse, redundancy, unclear naming. | `/simplify` paired with `/code-review` for a two-pass review |
| `safety-guard` | Prevent destructive operations on the wrong branch. | Configure once at project scope; runs as a pre-tool guard |

## Memory and context

| Skill | Use case | Example invocation |
|-------|----------|--------------------|
| `knowledge-ops` | Knowledge base management, ingestion, retrieval across projects. | `/knowledge-ops` to bring a folder of docs into searchable context |
| `repo-scan` | Cross-stack source code asset audit. | `/repo-scan` on an unfamiliar codebase to get the lay of the land |
| `workspace-surface-audit` | Audit the active repo, MCP servers, plugins, env surface. | `/workspace-surface-audit` once per quarter to catch drift |
| `context-budget` | Audit Claude Code context window consumption across agents/skills. | `/context-budget` when sessions feel slower than they should |
| `update-codemaps` | Generate token-lean architecture codemaps. | `/update-codemaps` after a structural refactor |

## Skills I considered but do not use

A short list to keep the curator-toolkit positioning honest. Each was tested. Each has reasons it does not fit my loop, not yours.

- **`autonomous-loops` / `continuous-agent-loop`** — interesting, but I prefer sequential focus. Autonomous loops add a debugging layer I do not want for solo ops.
- **`council` for routine calls** — works for ambiguous strategic calls. Overkill for daily decisions; collapses signal-to-noise.
- **Most C-suite advisor skills** (`cmo-advisor`, `cto-advisor`, etc.) — useful framing, but I run my own thinking through `executive-mentor` rather than role-playing a fictional exec.
- **`board-meeting` and `board-deck-builder`** — reserved for when there's an actual board. Solo, pre-revenue, not yet.
- **Most language-specific testing skills** (`golang-testing`, `kotlin-testing`, `rust-testing`, etc.) — I touch them only when the project's language demands it. Not in the daily set.
- **`multi-frontend` / `multi-backend` / `multi-execute`** — multi-model workflows that burn tokens for marginal quality wins on most operator tasks. Reach for them on truly hard problems only.
- **`skill-comply` / `skill-stocktake` / `skill-health`** — meta-tools for managing the skill library itself. Useful when curating; not part of the day.

## Updating

ECC ships frequently. This index is point-in-time. When in doubt about whether a skill still exists, run `/skill` inside Claude Code or check the [upstream ECC repo](https://github.com/affaan-m/everything-claude-code).

A v1.x sweep should add a `verified-as-of: YYYY-MM-DD` micro-tag per row so drift is visible at a glance.

## Source

- ECC repo: https://github.com/affaan-m/everything-claude-code
- Author: [@affaan-m](https://github.com/affaan-m)
- License: MIT
- This index sits alongside the rest of the stack in [`stack/ecc.md`](ecc.md).
