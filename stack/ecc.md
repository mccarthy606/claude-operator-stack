# Everything Claude Code (ECC)

**Original repo:** https://github.com/affaan-m/everything-claude-code
**Author:** [@affaan-m](https://github.com/affaan-m)
**License:** MIT

ECC is the **skill + agent backbone** of this stack. 182 skills, 48 agents, 68 commands, hooks, rules. All under MIT.

This stack does not redistribute ECC. The installer adds the marketplace and lets ECC update independently — you always pull the latest from upstream.

## What I actually use from ECC, daily

These are the skills I touch most weeks. Full list lives in ECC's own README.

### Building things
- `skill-create` — when I need a repeatable workflow, I codify it as a skill
- `frontend-design` — distinctive UI generation
- `feature-dev` — guided feature dev with codebase awareness
- `tdd-workflow` — write tests first when the surface is non-trivial
- `code-review` — review uncommitted changes locally before push
- `build-fix` — when the build breaks, route to the right resolver agent

### Marketing + content
- `content-engine` — multi-platform content production
- `seo` — technical SEO audits, on-page, schema
- `copywriting` / `humanizer` — drafting + de-AI-ing prose
- `marketing-psychology` — applying mental models to messaging
- `frontend-slides` — animation-rich HTML decks for product launches

### Research + decision-making
- `deep-research` — multi-source research using firecrawl + exa
- `documentation-lookup` — current docs via Context7 instead of stale training data
- `council` — convene a four-voice council for ambiguous calls
- `executive-mentor` — adversarial thinking partner for hard tradeoffs

### GSD (Get Shit Done) workflow
- `gsd-new-project` — initialize a new project with deep context
- `gsd-plan-phase` — create executable phase plans
- `gsd-execute-phase` — run all plans in a phase with parallelism
- `gsd-ship` — PR + review + prep for merge

## Why ECC over rolling my own

I tried both. Rolling your own means the surface area you maintain grows linearly with the number of products. ECC means **the surface area is maintained by an active community**, and I get the long tail of skills (Kotlin testing, Rust patterns, springboot-tdd, etc.) for free even if I only use a handful.

The cost: ECC has its own opinions and conventions. For 90% of cases I align with them. For the 10% where I don't, I add custom rules and hooks in this stack — they sit on top, ECC stays untouched.

## Setup

After running `./install.sh` from the root of this repo, open Claude Code and run:

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

Restart Claude Code. Confirm with `/skill` — you should see the full ECC skill list.

## Updating

ECC ships frequently. Update via Claude Code's `/plugin` command, or pull the marketplace repo manually:

```bash
git -C ~/.claude/plugins/marketplaces/everything-claude-code pull --ff-only
```

## Attribution in derived work

Every ECC skill carries `origin: ECC` in frontmatter. If you build a skill on top of an ECC skill, keep the original `origin:` and add your own delta in a comment block at the bottom. That keeps the credit chain intact.
