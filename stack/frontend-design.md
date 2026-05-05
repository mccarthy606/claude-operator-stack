# Frontend-Design

**Original repo:** https://github.com/anthropics/claude-plugins-official
**Author:** Anthropic
**License:** MIT

The Frontend-Design skill produces UIs that don't look like a Tailwind template. It is one skill, but it makes the difference between "shipped a landing page" and "shipped a landing page someone screenshots."

## What it does

`frontend-design` is a generation skill biased toward distinctive, opinionated, production-grade UI. It refuses generic patterns (default cards, centered hero with gradient blob, gray-on-white with an accent color) and pushes for at least four of these qualities per surface:

- Hierarchy through scale contrast
- Intentional rhythm in spacing
- Depth or layering through overlap, shadows, surfaces, motion
- Typography with character
- Color used semantically, not decoratively
- Designed hover/focus/active states
- Grid-breaking editorial or bento composition
- Texture, grain, or atmosphere
- Motion that clarifies flow
- Data viz as part of the design system

These qualities are codified in the operator's web design-quality rules — anti-template policy, banned patterns list.

## Where I use it

- New product landing pages
- Case-study pages on a blog
- Demo dashboards for internal tools (still better than admin defaults)
- Any time a screenshot is going to be on Twitter or in a pitch deck

## Setup

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin install frontend-design@claude-plugins-official
```

Restart Claude Code. Then invoke via `/frontend-design` or just describe the surface and the skill triggers automatically when relevant.

## My usage convention

Before any session that touches frontend, I pin the visual direction up front: editorial, neo-brutalism, glassmorphism with depth, dark luxury, bento, scrollytelling, swiss, retro-futurism. Never "clean minimal" — that's the default that produces template-looking UI. Pinning the direction first means Claude isn't guessing tone halfway through a build, and the skill respects the pinned direction throughout the session.

## Updating

`/plugin` inside Claude Code, or:

```bash
# (if the plugin supports it)
git -C ~/.claude/plugins/cache/claude-plugins-official/frontend-design pull
```

The Frontend-Design plugin currently ships as a snapshot rather than a git clone, so updating goes through Claude Code's plugin manager.
