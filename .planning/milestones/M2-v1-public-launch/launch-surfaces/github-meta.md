# GitHub repo metadata for flip

Everything that needs to be set on `github.com/mccarthy606/claude-operator-stack` at the moment of going public. Two-thirds of this is one-time configuration. The rest is reviewed once and rarely touched again.

The repo's first impression on a logged-out browser is the About box, the social preview, the topics, and the README hero — in that order. Get those four right and the rest of the repo gets read; get them wrong and the rest of the repo does not.

---

## About box (top-right of repo page)

GitHub caps the description at 350 characters. Use closer to 200 for skim-readability.

### Three description variants

**Variant 1 (recommended) — operator-first framing:**

> Curated stack and playbook for solo founders running multiple AI products on Claude Code. 4 core components (Claude Code, Obsidian, graphify, Frontend-Design) + 2 opt-in extensions (Everything Claude Code, Toprank). Install path, cookbook, hooks, scaffolds, profiles.

(266 chars.)

**Variant 2 — metric-first framing:**

> The stack and playbook one operator used to ship 7 AI products in 4 months solo. Install path, cookbook, sanitized hooks, scaffolds, profiles. 4 core components (Claude Code, Obsidian, graphify, Frontend-Design) + 2 opt-in extensions (Everything Claude Code, Toprank).

(265 chars.)

**Variant 3 — outcome-first framing:**

> A non-engineer's install path for Claude Code as orchestrator across multiple products. Twelve recipes, six hooks, two scaffolds, four profiles. MIT. 4 core (Claude Code, Obsidian, graphify, Frontend-Design) + 2 opt-in (Everything Claude Code, Toprank).

(252 chars.)

**Recommended default: Variant 1.** It leads with the audience, names the artefacts, and acknowledges the credits chain in the same sentence. Variant 2 leans on the metric, which is true but reads as the kind of claim every launch makes. Variant 3 is solid but slightly longer and less specific.

### Website field

Leave blank for v1.0. The repo's README is the landing page. A separate website does not exist yet, and pointing at the operator's personal site dilutes the "this repo is the artefact" framing. Revisit at v1.1 if a project page actually gets built.

(GitHub Pages off `mccarthy606/claude-operator-stack` is technically possible, but rendering README.md as a Pages site without a custom theme looks worse than the GitHub repo view itself. Skip.)

### Topics (10-20 keywords)

GitHub allows up to 20 topics. Use 12-14 — every topic should be a search term someone would actually type. Avoid topic-stuffing for SEO; that flag-bait is recognized.

Recommended set:

- `claude-code`
- `claude`
- `anthropic`
- `ai-agents`
- `mcp`
- `claude-skills`
- `solo-founder`
- `operator-playbook`
- `indie-hackers`
- `ai-tooling`
- `obsidian`
- `cookbook`
- `scaffolds`
- `developer-experience`

The operator-tilted ones (`solo-founder`, `operator-playbook`, `indie-hackers`) are the differentiator from ECC's topic set. Keep them. They are how the right audience finds the repo via Topic browse rather than via Show HN.

Skip these even though they are tempting:

- `awesome` — implies a list-of-links repo. This is not that.
- `productivity` — too broad to surface anyone useful.
- `automation` — same problem.
- `ai-engineering` — wrong audience signal; this is operator-first, not engineer-first.

---

## Social preview image

GitHub's recommended dimensions: **1280 × 640 PNG** (2:1 ratio). Below the fold this is what shows in every share preview on X, Slack, Discord, and HN.

**Recommended path:** generate a launch-specific OG image rather than reusing `assets/hero.svg` rendered to PNG. The hero SVG is designed for the README header (full width, narrative arrangement); an OG image is a single-glance asset and needs different composition.

**File location:** `assets/social-preview.png`

**Required elements:**

1. Repo name (`Claude Operator Stack`) at large size, top-left
2. The one-line tagline (use the chosen About-box variant, truncated if needed)
3. The "7 products · 4 months · 1 person" metric as a single line, bottom-third
4. Author handle (`@mccarthy606`) bottom-right, small
5. No screenshots — they do not survive 1280×640 thumbnailing
6. No emoji
7. Dark background or strong typographic palette — should remain readable as a 600×300 thumbnail in a Slack preview

**Once generated, upload via:**

```
gh api -X PATCH /repos/mccarthy606/claude-operator-stack \
  --field social_preview_image=@assets/social-preview.png
```

(If the gh CLI does not support this directly at flip time, the GitHub UI route is Settings → Social preview → Upload. Either works.)

**Verification after upload:** test the preview render at https://opengraph.xyz/url/https%3A%2F%2Fgithub.com%2Fmccarthy606%2Fclaude-operator-stack before posting the X thread. Cached previews can take up to an hour to refresh.

---

## Pinned issues

Pin three issues at flip time so first-time visitors see explicit on-ramps. The existing good-first-issues are the right candidates — they are scoped, attributable, and do not require deep context.

Pin order (top first):

- [issue #1] — Translate README to PT-BR
- [issue #5] — Add native Windows install script (`install.ps1`)
- [issue #6] — Capture three README screenshots (Obsidian + Claude Code + asciinema of installer)

(Numbers reflect the existing v0.2 issue set referenced in `README.md` lines 210-213. Verify before pinning — if numbering shifted, use the actual issue numbers.)

Why these three:

- The PT-BR translation is the most-likely-completed contributor task — low context, high visibility.
- The Windows install script earns the Windows-on-WSL audience without forcing a v1.0 deliverable.
- The screenshots issue may close before flip if Phase 7 lands cleanly; if so, replace with `[issue #7]` (the Mermaid diagram for content-pipeline.md).

---

## Discussions

**Decision: enable GitHub Discussions at flip time.**

Reasoning: a launch wave will surface "how do I…" and "have you considered…" questions that are not bug-shaped. Issues for those creates noise; Discussions is the right channel.

Three starter discussions to seed at flip (so the Discussions tab is not empty on day one):

1. **Welcome — read this first** — pinned. Restates the operator audience, the curator-toolkit framing, the no-skill-redistribution rule, and the credits chain. Closes with "what would you want to see in v1.1?"
2. **Show your stack** — invitation thread. Each commenter shares the components and workflows they use. Useful both for the audience to see itself and for v1.1 prioritization.
3. **Profiles that don't fit** — invitation for readers whose archetype is not one of the four to describe their shape. If a fifth profile shows up here organically, that is a v1.1 win.

---

## README badges to verify post-flip

Existing badges in the README hero (lines 7-11) — verify each renders correctly after the public flip. Some of them do not work on private repos.

- License badge (`License: MIT`) — static, will render fine.
- Stack badge (custom) — static, will render fine.
- Status badge (`status: active`) — static, will render fine.
- **Last commit badge** (`shields.io/github/last-commit/mccarthy606/claude-operator-stack`) — currently does not work because the repo is private. Will render automatically after the flip; verify within 5 minutes of going public.
- **Built by badge** (`@mccarthy606`) — static, will render fine.

Add post-flip (only when there is real data to show):

- **Stars badge** — once star count exceeds 50, add `shields.io/github/stars/mccarthy606/claude-operator-stack`. Below 50, the badge looks like vanity.
- **Issues badge** — only if open issues exceed 10 and are being responded to in <48h. Otherwise it advertises a maintenance gap.
- **Contributors badge** — only after at least 3 external contributors have merged a PR. Premature contributors badges read as desperate.

---

## Releases

Tag and publish v1.0.0 at flip-time:

```
git tag -a v1.0.0 -m "v1.0.0 — public launch"
git push origin v1.0.0
gh release create v1.0.0 \
  --title "v1.0.0 — public launch" \
  --notes-from-tag
```

The release notes pull from the v1.0.0 tag annotation. If a longer changelog is preferred, generate it from `CHANGELOG.md` and pass via `--notes-file CHANGELOG.md` instead.

---

## Branch protection

**Decision: enable basic branch protection on `main` at flip-time.** Solo maintainer, but external PRs are about to start arriving and the rules should be in place before the first one lands, not after.

Settings:

- Require pull request before merging: ON
- Require approvals: OFF (solo maintainer; self-approval would be theatre)
- Dismiss stale reviews: ON
- Require status checks: OFF for now (no CI yet; revisit when CI lands)
- Require linear history: ON (cleaner log for post-launch retro)
- Restrict who can push: leave default

Apply via Settings → Branches → Add rule, or:

```
gh api -X PUT /repos/mccarthy606/claude-operator-stack/branches/main/protection \
  --input branch-protection.json
```

(The `branch-protection.json` payload is small enough to inline if needed; see GitHub's [REST docs](https://docs.github.com/en/rest/branches/branch-protection) for the schema.)

---

## Funding / Sponsors

**Decision: do not enable GitHub Sponsors at v1.0.** Reasoning: the repo positioning is "playbook + curated stack." Sponsorship CTA in week one undermines the "this is here because it might help you" framing. Revisit at v1.1 if the audience explicitly asks how to support the work.

If asked at launch, the right answer is "honest read + share with one operator who would use it." Money does not need a place yet.

---

## Insights and traffic

After flip, GitHub Insights → Traffic becomes available. Check at T+24h, T+72h, T+1 week. Useful signals:

- **Referring sites** — confirms which channel actually converted (X, HN, DM, search)
- **Popular content** — which files inside the repo are getting clicked
- **Visitors vs unique** — distinguishes one viral spike from sustained interest

These data points feed the Phase 10 retro.
