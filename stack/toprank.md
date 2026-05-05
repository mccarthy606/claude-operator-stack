# Toprank

**Original repo:** https://github.com/nowork-studio/toprank
**Author:** nowork-studio
**License:** see upstream
**Current version pinned:** 0.17.0+

Toprank is the SEO and paid-ads layer. Without it, I would be writing GSC analyzers, broken-link checkers, and Google Ads loaders by hand; with it, the loop is one slash command per audit.

## Status: opt-in

Toprank is **opt-in** in this stack. Add it when:

- You do SEO audits regularly (technical SEO, on-page, schema, broken links)
- You run paid Google Ads, Meta Ads, or both
- You want GEO (generative engine optimization) — surfacing in ChatGPT, Perplexity, Gemini, AI Overviews

Skip Toprank when:

- You're pre-product and not running ads or doing SEO yet
- Your traffic strategy is community-driven (HN, X, word of mouth) rather than search

The plugin's preamble guides you through OAuth on first use; nothing breaks if it's not installed.

## What I use from Toprank

### SEO
- `/seo-audit` — full technical + on-page audit on any URL
- `/seo` — ongoing SEO optimization across content + structure
- `seo-analysis/` — connects to GSC, runs PageSpeed, inspects URLs
- `/broken-link-checker` — find 404s on internal + external links
- `/geo-optimizer` — Generative Engine Optimization for AI-search citations (ChatGPT, Perplexity, Gemini, Google AI Overviews)

### Paid ads
- `google-ads/` — campaign loader + auditor against Google Ads accounts via OAuth
- `meta-ads/` (new in 0.17) — same shape for Meta Ads (audit + manage)

### Business context
Toprank's `business-context` system is what makes its recommendations actually useful — instead of generic "add more H2s," it weights suggestions against your actual site, keywords, and competitors. Required step before any SEO proposal.

## Setup

1. The installer in this repo prints the marketplace + plugin command. Run it inside Claude Code:

```
/plugin marketplace add nowork-studio/toprank
/plugin install toprank@nowork-studio
```

2. Restart Claude Code.

3. First time you invoke `/seo` or `/google-ads`, Toprank's preamble will guide you through OAuth — you sign in to NotFair (Toprank's auth backend) in a browser and the token is stored in your OS keychain. No `ADSAGENT_API_KEY` env var anymore as of 0.15.0.

## Where it pays for itself

For my Niche Booking Trio (3 sites in one regional market), I run a Toprank weekly review every Monday morning. Output: a prioritized list of pages with the largest CTR-vs-rank gap, what queries they're losing, and which to optimize first. Without this loop I would not know which page to touch this week.

For paid ads, `/google-ads` audits campaigns against the same business context, flagging stale keywords, mismatches between ad copy and landing page, and budget pacing issues — Google Ads as a code review.

## Updating

```bash
git -C ~/.claude/plugins/marketplaces/toprank pull --ff-only
```

Then restart Claude Code.

## Notes

- `business-context` is sticky — once you set it for a project, every SEO recommendation will be filtered through it. Don't skip this step.
- Toprank's recent releases moved the namespace from `.adsagent` → `.notfair`. If you have an older install, the preamble migrates automatically on first invocation.
