# Operator profile: content-creator operator

> If you describe yourself as "running YouTube and Instagram as a real revenue line, while also shipping software products on the side," this is your install path.

## Who this profile is for

You have two engines: a content brand that earns through ads, sponsorships, courses, or affiliate, and a software product (or two) that earns through Stripe. Each engine compounds the other — your audience trusts the product because you teach in public, and the product gives you something real to teach about. Without both, neither works as well.

The Tuesday morning shape: open the laptop, decide whether today is a content day or a product day. If content: open `~/Brain/Content/`, pick the topic from the backlog, draft the script, set up the camera. If product: open the project, ship a feature, write the build-log post that becomes Wednesday's short-form clip. The thing that breaks for you is mode-switching — the cognitive cost of going from "directing a video" to "debugging a webhook" is what makes most creator-builders give up on one of the two engines within six months.

You arrived at this stack because you saw the pattern of "ship in public, post about it, repeat" working for someone you follow, and you want the operating system that makes it sustainable past month three. The specific outcomes on your list: content backlog and product backlog living in one Obsidian vault, cross-posting from one source asset to four platforms becoming a one-line command, and a humanizer pass running on every caption before it goes live.

## Install priority

The full stack has six layers (see [stack/](../stack/)). For this profile, install in this order — Obsidian goes earlier than usual because it doubles as the content backlog.

| Order | Component | Why for this profile |
|-------|-----------|----------------------|
| 1 | **Claude Code** | The runtime. |
| 2 | **Obsidian Brain** ([stack/obsidian-brain.md](../stack/obsidian-brain.md)) | Doubles as content backlog (`~/Brain/Content/`) and project memory (`~/Brain/Projects/`). Single source of truth for both engines. |
| 3 | **Everything Claude Code** ([stack/ecc.md](../stack/ecc.md)) | The skill backbone. The `crosspost`, `humanizer`, `content-engine`, and `brand-voice` skills are why you are here. |
| 4 | **MCP servers** ([stack/mcp-servers.md](../stack/mcp-servers.md)) | GitHub for product, scrapling for content research, x-api for posting, scheduled-tasks for cadence. |
| 5 | **OMEGA Memory** ([stack/omega-memory.md](../stack/omega-memory.md)) | Cross-session memory for the product side. Less critical for content (Obsidian covers it). |
| 6 | **Frontend-Design** ([stack/frontend-design.md](../stack/frontend-design.md)) | For when the product needs a landing page or a launch surface that does not look like every other indie SaaS. |

Skip Toprank unless you also run paid ads — most creators do not need it for the audience-funded path.

## Workflows to read first

The full operator playbook has [five workflows](../workflows/). For this profile, read in this order:

1. **[content-pipeline](../workflows/content-pipeline.md)** — the six-step pipeline (research, draft, record, edit, publish, distribute) is the spine of the content engine. Three of six steps are Claude-assisted. Read this first.
2. **[obsidian-as-context](../workflows/obsidian-as-context.md)** — the Obsidian loop is what keeps the content backlog and the project backlog from drifting apart. The integration rule is non-optional for this profile.
3. **[parallel-projects](../workflows/parallel-projects.md)** — but with a twist: your "projects" include a YouTube channel and an Instagram account alongside the software products. Same Monday review, same Friday touchpoint.
4. **[ship-a-product-in-a-day](../workflows/ship-a-product-in-a-day.md)** — for the product-engine half of your week.

[solo-ops](../workflows/solo-ops.md) is read-once-later. Audience-engagement comms are real but slow-moving for most creators; the urgent ops surface is the deploy and the inbox, both covered elsewhere.

## Cookbook recipes you will reach for

Pick from [the cookbook](../cookbook/) in this order:

- **[12 — Multi-brand content cross-post pipeline](../cookbook/12-content-cross-post-pipeline.md)** — the recipe that turns one source asset (a YouTube script) into platform-native variants for X, LinkedIn, Threads, Instagram. Your highest-leverage automation.
- **[08 — yt-dlp + Whisper research pipeline](../cookbook/08-ytdlp-whisper-research.md)** — the research engine for "what is everyone in my niche actually saying, and what is the angle nobody covered." Surfaces the angle you draft from.
- **[11 — Scheduled prompts via cron MCP](../cookbook/11-scheduled-prompts-cron.md)** — for the publishing cadence and the weekly-content-review reminders that hold the pipeline together.
- **[01 — Claude Code from zero](../cookbook/01-claude-code-from-zero.md)** — the foundation, with extra attention to the MCP loadout (you want scrapling, x-api, scheduled-tasks installed early).
- **[05 — GA4 + Cloudflare Analytics, no cookie banner](../cookbook/05-ga4-cloudflare-analytics.md)** — for the product-engine landing pages. Track without being a creep.

## Hooks to install

From [configs/hooks/](../configs/hooks/):

- **statusline** ([configs/hooks/statusline.README.md](../configs/hooks/statusline.README.md)) — orientation when you are flipping between content drafts and product code in the same session.
- **read-injection-scanner** ([configs/hooks/read-injection-scanner.README.md](../configs/hooks/read-injection-scanner.README.md)) — you read a lot of third-party content (competitor transcripts, scraped articles, audience replies). The injection surface is real and the scanner catches the worst of it before it enters context.
- **context-monitor** ([configs/hooks/context-monitor.README.md](../configs/hooks/context-monitor.README.md)) — content sessions can balloon (a single research pull can be enormous). The 35% and 25% warnings keep you from burning a session you cannot recover.

## Scaffold to copy

[scaffolds/web-saas](../scaffolds/web-saas/) is the closest fit for the product half of this profile — a landing page that becomes a product over a month, with analytics and Sentry pre-wired.

For the content-engine half, no scaffold fits — the Obsidian vault structure (`~/Brain/Content/`, `~/Brain/Projects/`) is your scaffold there, set up by the [obsidian-as-context](../workflows/obsidian-as-context.md) workflow.

## What to skip

The stack has parts that do not earn their keep for this profile:

- **Toprank** ([stack/toprank.md](../stack/toprank.md)) — paid distribution rarely matches what an organic content engine can do. Skip unless you are also running a paid creator-business funnel.
- **The full GSD skill family** (see [stack/ecc-skill-index.md](../stack/ecc-skill-index.md)) — adopt selectively. `gsd-new-project` is useful at the start of a product. The rest is engineer-shaped overhead that fights with the content rhythm.
- **Most C-suite advisor skills** — interesting framing, irrelevant for the audience-and-product two-engine setup.
- **Custom hook authoring beyond the three above** — the temptation is to build a hook for every content step. Use the shipped scheduled-tasks MCP and the `crosspost` skill instead.
- **The `whatsapp-saas` scaffold** unless your product is WhatsApp-shaped.

## A typical week for this profile

- Monday morning: review content backlog (`~/Brain/Content/`) and product backlog (`~/Brain/Projects/`). Decide which long-form content piece ships this week and which product feature ships this week.
- Tuesday: content day. Research, draft, record. Update the content note in Obsidian.
- Wednesday: product day. Ship the feature. Write the build-log post that becomes the short-form clip on Friday.
- Thursday: edit Tuesday's recording. Run the cross-post pipeline. Schedule.
- Friday morning: publish, post the clips, respond to comments and DMs. Light product touchpoint if needed.
- Friday afternoon: weekly review of both engines — what shipped this week, what slipped, what next week's two priorities are.

## What to do in your first session

A 30-60 minute first session should produce:

1. Claude Code installed, ECC marketplace added, the `crosspost` and `humanizer` skills test-invoked once.
2. Obsidian installed, the `~/Brain/` vault structure created (Content, Projects, Knowledge folders), the [obsidian-integration rule](../configs/rules/obsidian-integration.md) wired in.
3. One content brief drafted in `~/Brain/Content/` for the next video, and one project note in `~/Brain/Projects/` for the active product.
