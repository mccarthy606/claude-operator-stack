## How this compares

A few people land here asking: is this just a fork of [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), or another starter template? Neither.

The three options below are the ones first-time visitors usually weigh. They overlap in places, but each one targets a different kind of work. The table is meant as a map, not a ranking — pick the column that fits how you actually spend your week.

A note on what each column is:

- **Solo Stack** is this repo. A 6-component install with the workflow, cookbook, and case studies wrapped around it.
- **Everything Claude Code** is the upstream skills + agents library this repo depends on. Built and maintained by [@affaan-m](https://github.com/affaan-m).
- **Starter templates** is the bucket for `create-next-app`, vanilla Vite + Tailwind, T3 stack, and similar single-framework scaffolds.

| Dimension | Solo Stack | Everything Claude Code | Starter templates |
|-----------|------------|------------------------|-------------------|
| Audience | Solo founder running 2+ products at once | Engineers and AI dev teams | Web app newcomers and quick prototypers |
| Tone | Operator-first — the workflow comes before the code | Engineer-first — depth across language ecosystems | Framework-first — Next.js / Vite / etc. set the shape |
| Stack scope | Curated 6-component set with one opinionated install path | 182 skills + 48 agents across 12+ language ecosystems | Single framework + auth/db starter |
| Multi-harness | Claude Code only | Claude Code, Cursor, Codex, OpenCode, Gemini, Antigravity | Framework-specific |
| Real shipped proof | 4 anonymised case studies from one operator's products | Author's own product (`zenith.chat`) and template configs | None — meant as a starting point |
| Custom contributions | Workflows, cookbook of 12 recipes, 6 hooks, 5–7 original skills | Wide skills + agents catalogue, two npm packages | Scaffold + boilerplate |

Audience-fit shorthand:

- Pick **Solo Stack** if you run several products at once and want a workflow as much as a config.
- Pick **Everything Claude Code** if you want a wide skills + agents catalogue and multi-harness coverage.
- Pick a **Starter template** if you're starting your first web app and want one framework's happy path.

Solo Stack and Everything Claude Code are designed to coexist — many readers here will install both. The cookbook recipes, profiles, and case studies in this repo assume an install of ECC's skill catalogue is sitting next to them; the workflows here describe how to use that catalogue across 2+ products in parallel.

If you came in from a starter template and ended up with 3 of them open in different folders, the gap Solo Stack tries to fill is the part that sits *above* the template — the workflow, the cookbook, the per-profile install path, and the case studies showing what happened on real products.

If you came in from Everything Claude Code and want a worked example of how an operator runs the catalogue across a product list rather than a single repo, the case studies and workflows in this repo are designed to be that worked example.
