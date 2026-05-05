---
milestone: M2 — v1.0 Public Launch
project: claude-operator-stack
status: active
created: 2026-05-04
updated: 2026-05-05
target: launch-quality public artefact with organic-traction shape
---

# Roadmap: claude-operator-stack — v1.0 Public Launch

## Overview

Ten integer phases plus seven decimal "doubling-down" phases that take the v0.2 minimum-viable repo to a launch-quality v1.0. The shape: depth before flip. First add the operator-grade content that earns the launch (cookbook, hooks, skill index, scaffolds, profiles), then add credibility artefacts (screenshots, asciinema), then double down on the four highest-leverage non-overlapping artefacts vs ECC (animated hero, compare matrix, npm CLI, original skills marketplace), then add the three "structural depth" surfaces a v1.0 launch should ship with (operator slash-commands, long-form docs, e2e integration tests), then do the one-shot public flip with launch surfaces. Every phase is atomically shippable inside a 2-8h focus session and, except where noted, can be merged to `main` without depending on later phases. The final two phases (public flip + launch+72h response) are the only ones that gate the visibility flip.

**Ordering principle — "revenue of attention":** the audience that lands on this repo within the first 72h after launch will skim three things — the README hero, the case studies, and one randomly-chosen artefact. The cookbook (Phase 1) and the hooks (Phase 2) are the highest-probability "random artefact" pulls because they are copy-pasteable and don't require buying into the whole stack. They get built first. Skill index (Phase 3) anchors the credibility-of-curation claim. Scaffolds (Phase 4) and profiles (Phase 5) deepen self-identification but are heavier; they come after the lighter wins. Screenshots (Phase 7) require the user's manual capture and asciinema setup so they sit just before launch. Phases 8.1-8.4 are the post-audit doubling-down layer: each is a non-overlapping artefact vs ECC, sized to ship in one focus session, and adds reasons to star without surface-area-for-surface-area's-sake. Phases 8.5-8.7 are the structural-depth layer added 2026-05-05 after a top-level structure comparison vs ECC (31 root dirs vs our 15): they close real gaps (slash-commands as invocable shorthand, long-form docs as discovery surface, integration tests as trust signal) without becoming cargo cult — each adds non-overlap, not surface-for-surface. Launch (Phase 9) is the irreversible action and goes last.

**Why the 8.x doubling-down phases (8.1-8.4 added earlier on 2026-05-05):** after closing all 5 CRITICAL + 14 HIGH + 24 MEDIUM + 22 LOW review findings (commits `368abb2` and `24d5eb7`), an honest ECC gap analysis showed v1.0 is technically clean but visually + economically light vs ECC's 4-month head start, 170-contributor surface, multi-harness coverage, real npm packages, and lander site. We can't replicate that surface area but we **can** double down on what makes us non-overlapping with ECC: operator-first voice, solo-founder use-cases, real shipped products, anonymisation discipline, native RU/ES authoring. The four 8.x phases each ship a different non-overlapping artefact and slot in cleanly between launch-prep and the irreversible flip.

**Why the 8.5-8.7 structural-depth phases (added 2026-05-05 after 8.1-8.4 shipped):** with 8.1-8.4 complete (commits `c883ddf`, `2ceb123`, etc.), a top-level structure compare vs ECC showed three surfaces v1.0 should ship rather than defer to v1.1: (a) `commands/` — slash-command shorthand wrapping our 6 own skills, the same convention ECC uses, makes our skills invocable as `/cost-rollup` not just discoverable as files; (b) `docs/` — extracts ~140 lines of long-form content out of the README into focused files (`comparing-stacks.md`, `whats-inside.md`, `v1-changelog-deep-dive.md`, `why-only-claude-code.md`), shrinks the README and adds a discovery surface; (c) `tests/` — 4 e2e integration tests (install.sh dry-run, CLI init/verify/list-stack) that turn "trust me, the installer is safe" into "here's the assertion suite that proves it." Each of the three is osmysmlennoye, not cargo-cult: they target real gaps that show up the moment a launch reader compares our repo against any mature open-source toolkit.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (e.g. 4.1, 8.1): Urgent insertions or doubling-down content discovered mid-milestone

- [ ] **Phase 1: Cookbook of recipes** — 12 markdown how-tos from real shipped projects, indexed and cross-linked
- [ ] **Phase 2: Sanitized custom hooks** — 6 hooks copied from `~/.claude/hooks/`, scrubbed, with per-hook README
- [ ] **Phase 3: Skill index** — reference table mapping ECC skills to operator use-cases with call examples
- [ ] **Phase 4: Project scaffolds** — 2 boilerplate templates (Next.js+Supabase web app, FastAPI+Docker WhatsApp service) with pre-configured CLAUDE.md
- [ ] **Phase 5: Operator profiles** — 4 stack variations (indie hacker, freelancer, agency owner, content creator) as opinionated install paths
- [ ] **Phase 6: Pre-launch audit pass** — broken-link check, attribution audit, sanitisation re-sweep, README front-page polish
- [ ] **Phase 7: Credibility capture (user-driven)** — 3 screenshots + 1 asciinema cast, embedded in README
- [ ] **Phase 8: Launch surfaces prep** — GitHub Topics, social preview image, About text, X-thread draft, Show HN draft, founder shortlist
- [x] **Phase 8.1: Animated hero visual** — replace static `assets/hero.svg` with an animated operator-loop visual that leapfrogs ECC visually
- [x] **Phase 8.2: Compare matrix in README** — honest 3-column table (Solo Stack vs ECC vs Starter templates) so readers leave with a clear mental map
- [x] **Phase 8.3: npm CLI package — `claude-operator-stack`** — real `npx claude-operator-stack init` wizard at `packages/cli/`, `init`/`verify`/`list-stack` only
- [x] **Phase 8.4: Solo-founder skills marketplace** — 5-7 original SKILL.md packages targeting solo-founder use-cases ECC's catalog doesn't cover
- [ ] **Phase 8.5: Operator slash-commands (`commands/`)** — 6 slash-command files wrapping our 6 own skills with args, examples, and back-links
- [ ] **Phase 8.6: Long-form guides (`docs/`)** — extract ~140 README lines into `docs/comparing-stacks.md`, `docs/whats-inside.md`, plus 2 new long-form pieces (`v1-changelog-deep-dive.md`, `why-only-claude-code.md`)
- [ ] **Phase 8.7: E2E integration tests (`tests/`)** — 4 integration tests (install.sh dry-run, CLI init/verify/list-stack) plus a `tests/run-all.sh` runner and root `test:integration` script
- [ ] **Phase 9: Public flip + launch** — `gh repo edit --visibility public`, post X thread, submit Show HN, send founder DMs, publish npm package
- [ ] **Phase 10: Launch+72h response** — triage incoming issues/PRs/discussions, hot-fix obvious cuts, write retro

## Phase Details

### Phase 1: Cookbook of recipes
**Effort:** ~6-8h (one focus session, possibly split across two if recipes overrun)
**Depends on:** Nothing (greenfield content directory)
**Goal:** Ship a `cookbook/` directory with 12 practical, copy-pasteable how-to recipes drawn from the operator's actual shipped products. Each recipe is one markdown file (~100-200 lines), follows a fixed shape (problem → solution → code snippets → pitfalls → references), and is anonymised at the URL level.

**Why:** Recipes are the single highest-leverage artefact for launch. They survive out-of-context reading (someone arrives via a Show HN link, opens one recipe, gets value, stars). They demonstrate the "operator-not-engineer" tone with concrete proof. They are markdown-only, so deployment friction is near zero. And they are the most credible signal that this repo is written by someone who has actually shipped, not someone packaging other people's work.

**Success criteria:**
1. `cookbook/README.md` exists with a categorised index (Payments, Messaging, Infra, Auth, Data, Content) and one-line summary per recipe
2. 12 recipe files exist under `cookbook/`, each following the fixed template and each ~100-200 lines
3. Every recipe has a "Pitfalls" section with at least 2 real failure modes the operator hit
4. Every recipe references upstream docs by URL (Stripe docs, Supabase docs, Cloudflare docs, etc.) — no recipe is self-referential
5. No recipe leaks a real product URL, real API key, real customer name, or real revenue number
6. Cookbook is linked from the main README under a new "Cookbook" section
7. CHANGELOG entry for the cookbook addition

**Recipe shortlist (final 12 picked from this 15, drop the 3 least-useful at draft time):**
1. Stripe Connect onboarding for marketplaces
2. WhatsApp Cloud API setup (webhook + verification + first message)
3. Mercado Pago integration for LATAM payments
4. Cloudflare Argo Tunnel + local dev for webhook testing
5. Supabase pooled connection gotchas (PgBouncer + Prisma)
6. GA4 + Sentry minimum viable instrumentation for a new site
7. Next.js + Supabase auth with magic links (no third-party auth)
8. yt-dlp + Whisper pipeline for content extraction
9. Cron + claude CLI for scheduled ops automation
10. Multi-domain DNS routing on Cloudflare for niche-site portfolio
11. Postgres → typed SDK in 5 minutes with Supabase + Prisma
12. Sanitising a `.claude/` directory before publishing it (the slap pattern)
13. Setting up an Obsidian project note that Claude Code reads on session start
14. WhatsApp template message approval workflow (Meta business manager)
15. Sentry source-maps + Vercel + Next.js (the fragile combo)

**Risks:**
- **Scope creep — recipes balloon to essays.** Mitigation: hard 200-line cap, enforce in slap-pass; if a recipe exceeds, split it.
- **Anonymisation slip — a recipe accidentally references a real product URL.** Mitigation: post-draft grep pass for known operator domains; failing the grep blocks the commit.
- **Quality drift across recipes — first 3 are great, last 3 are skeletal.** Mitigation: write recipes in a shuffled order rather than top-to-bottom; if energy wanes, the lower-quality ones fall in the middle, not the end.

**Files to create/modify:**
- `cookbook/README.md` (new)
- `cookbook/payments-stripe-connect-onboarding.md` (new)
- `cookbook/payments-mercadopago-integration.md` (new)
- `cookbook/messaging-whatsapp-cloud-api-setup.md` (new)
- `cookbook/messaging-whatsapp-template-approval.md` (new)
- `cookbook/infra-cloudflare-argo-tunnel-local-dev.md` (new)
- `cookbook/infra-multi-domain-dns-routing.md` (new)
- `cookbook/infra-sentry-sourcemaps-vercel-nextjs.md` (new)
- `cookbook/data-supabase-pooled-connections.md` (new)
- `cookbook/data-postgres-typed-sdk.md` (new)
- `cookbook/auth-supabase-magic-links.md` (new)
- `cookbook/content-yt-dlp-whisper-pipeline.md` (new)
- `cookbook/ops-cron-claude-cli-automation.md` (new)
- `cookbook/ops-sanitising-claude-directory.md` (new)
- `cookbook/ops-obsidian-project-note-loop.md` (new)
- `cookbook/ops-ga4-sentry-min-viable.md` (new)
- `README.md` (modify: add Cookbook section + TOC entry)
- `CHANGELOG.md` (modify: add unreleased entry)

---

### Phase 2: Sanitized custom hooks
**Effort:** ~3-4h
**Depends on:** Nothing (parallelisable with Phase 1, can swap order)
**Goal:** Copy 6 of the operator's most-useful hooks from `~/.claude/hooks/` into `configs/hooks/`, sanitise them (strip absolute paths, real domains, machine-specific assumptions), and write a per-hook README explaining what it does, when it fires, and why an operator would want it.

**Why:** Hooks are the single most "show, don't tell" piece of evidence that the operator actually uses Claude Code as orchestrator and not as chat. They're also high-curiosity artefacts — anyone landing on this repo via "what hooks does a power user run" search will dig in. And they slot cleanly into the existing `configs/hooks/` directory, which currently only has a placeholder README.

**Success criteria:**
1. 6 hook scripts exist under `configs/hooks/`, each sanitised (no real paths, no real domains, no real keys)
2. `configs/hooks/README.md` rewritten with a table: hook name → trigger event → what it does → safety notes
3. Each hook has either inline header comments OR a per-hook `.md` companion explaining its behaviour
4. Each hook's `hooks.json` registration snippet is included so a reader can wire it up
5. Operator's actual `hooks.json` is sanitised and published at `configs/hooks/hooks.json.example`
6. No hook breaks if run in a fresh `~/.claude/` (no hard dependencies on user-specific files)
7. Cross-link from `stack/ecc.md` and `workflows/parallel-projects.md` to the hooks directory

**Hook shortlist (pick 6 from these 8 candidates):**
1. `gsd-statusline.js` — custom status line with project + phase context
2. `gsd-session-state.sh` — read project state on session start
3. `gsd-prompt-guard.js` — block obviously-bad prompts pre-tool
4. `gsd-read-injection-scanner.js` — scan files being read for prompt injection
5. `gsd-validate-commit.sh` — pre-commit hook for sanitisation rules
6. `gsd-context-monitor.js` — warn when context window approaches threshold
7. `graphify-post-edit.sh` — auto-update knowledge graph after edits
8. `gsd-workflow-guard.js` — enforce workflow phase ordering

**Risks:**
- **Sanitisation miss — a real path or domain leaks.** Mitigation: run a known-bad-strings grep (operator's domains, OMEGA-specific identifiers, real names) over the entire `configs/hooks/` directory before commit; failing grep blocks.
- **A hook depends on something not in this repo (e.g. OMEGA Memory binary).** Mitigation: each hook README declares its prerequisites explicitly; hooks with hard prerequisites get a clear "requires X — see [link]" block, no silent failures.
- **Hooks become maintenance burden as the operator's local hooks evolve.** Mitigation: README states "snapshot from YYYY-MM-DD, not auto-synced" — clear contract that this is a reference snapshot.

**Files to create/modify:**
- `configs/hooks/<hook-1..6>.{js,sh}` (new — sanitised copies)
- `configs/hooks/<hook-1..6>.md` (new — per-hook companion docs)
- `configs/hooks/README.md` (modify: full rewrite with table)
- `configs/hooks/hooks.json.example` (new — sanitised registration)
- `stack/ecc.md` (modify: cross-link to `configs/hooks/`)
- `workflows/parallel-projects.md` (modify: reference relevant hooks)
- `CHANGELOG.md` (modify)

---

### Phase 3: Skill index
**Effort:** ~2-3h
**Depends on:** Nothing (independent of Phases 1, 2)
**Goal:** Create a single reference file `stack/ecc-skill-index.md` that maps the ECC skills the operator actually uses to operator use-cases, with one example invocation per skill. The file is a *navigation aid into ECC*, not a duplication of ECC content.

**Why:** ECC is huge (182 skills). An operator landing on this stack and being told "install ECC, then use the skills" has no idea where to start. The skill index is the curation layer — "of the 182, here are the 25 I actually call, organised by what I'm trying to do." This is the most direct expression of the curator-toolkit positioning. It is also small (one file) and high-signal. It must not duplicate ECC content; it must point in.

**Success criteria:**
1. `stack/ecc-skill-index.md` exists with categorised table (Coding, Research, Review, Content, Design, Ops, Memory)
2. Each row contains: skill name, ECC source link, "I use this when…" one-liner, example call snippet (1-3 lines)
3. The index covers 20-30 skills (the operator's actual usage set) — not all 182, not fewer than 20
4. No row contains skill source code; every row links back to `everything-claude-code/skills/<name>/`
5. The file's intro paragraph explicitly states "this is a curated index, not a redistribution; the skills live upstream, this is the operator's reading order"
6. Cross-linked from `stack/ecc.md` and from the main README's "What's Inside" section

**Risks:**
- **Drift — ECC adds/removes skills and the index goes stale.** Mitigation: each row has a `verified-as-of: YYYY-MM-DD` micro-tag in the comment column; a v1.1 task can sweep them.
- **Accidentally crossing the "no redistribution" line by quoting too much skill prose.** Mitigation: hard rule — example call snippets only, no skill body text. Slap-pass enforces.
- **Choosing the wrong 25 — the operator's set isn't the audience's set.** Mitigation: index categorises by use-case so a reader can find their own subset; "operator's usage" is one filter, not the only one.

**Files to create/modify:**
- `stack/ecc-skill-index.md` (new)
- `stack/ecc.md` (modify: add link to index)
- `README.md` (modify: add link under "What's Inside" / stack table)
- `CHANGELOG.md` (modify)

---

### Phase 4: Project scaffolds
**Effort:** ~6-8h (the heaviest content phase)
**Depends on:** Phase 1 (cookbook recipes referenced by scaffolds), Phase 2 (hooks referenced by scaffold CLAUDE.md)
**Goal:** Ship 2 boilerplate project templates under `scaffolds/`. Each scaffold is a directory tree a user can copy/clone and have a working starting point. Each ships with a pre-configured `CLAUDE.md` tuned to its shape and a README explaining the choices.

**Why:** Scaffolds are the most-clicked artefact in any "starter kit" repo because they collapse the install-to-running gap to a single `cp -r`. They are also the deepest expression of the operator's compounding leverage — "here's the actual shape of project I bootstrap when I want to ship in a day." Two scaffolds is enough to demonstrate the pattern without trying to cover the whole space; a third can come in v1.1 driven by audience demand.

**Success criteria:**
1. `scaffolds/README.md` explains the two scaffolds and the philosophy (these are starting points, not frameworks)
2. `scaffolds/web-nextjs-supabase/` is a runnable Next.js skeleton with: Supabase client setup, GA4 + Sentry wiring, sample CLAUDE.md, README, .env.example, no committed secrets
3. `scaffolds/service-fastapi-whatsapp/` is a runnable FastAPI skeleton with: Dockerfile, WhatsApp Cloud API webhook stub, sample CLAUDE.md, README, .env.example, no committed secrets
4. Each scaffold's `CLAUDE.md` references the relevant cookbook recipes (Stripe, Supabase, WhatsApp) by relative path
5. Each scaffold's `CLAUDE.md` declares which custom hooks (from Phase 2) it expects
6. Both scaffolds pass a sanitisation grep before commit
7. Each scaffold's README states "this is a starting point — drop what doesn't fit"
8. Both scaffolds linked from the main README

**Risks:**
- **Scope creep — a scaffold becomes a real product and never ships.** Mitigation: each scaffold is timeboxed to 3h; if it isn't bootable in 3h, the missing piece is documented as a TODO and the scaffold ships as-is.
- **Maintenance burden — scaffolds drift from current best practice.** Mitigation: README declares snapshot date; scaffolds are not promised to be evergreen; v1.1 may include a refresh task.
- **Accidentally vendoring secrets via .env.local instead of .env.example.** Mitigation: `.gitignore` the `.env.local` pattern at scaffold root; pre-commit grep for known key patterns.

**Files to create/modify:**
- `scaffolds/README.md` (new)
- `scaffolds/web-nextjs-supabase/` directory tree (new — ~15-25 files)
- `scaffolds/service-fastapi-whatsapp/` directory tree (new — ~10-15 files)
- `README.md` (modify: add Scaffolds section)
- `CHANGELOG.md` (modify)

---

### Phase 5: Operator profiles
**Effort:** ~3-4h
**Depends on:** Phases 1, 2, 3, 4 (profiles cite cookbook, hooks, skill index, scaffolds)
**Goal:** Ship `profiles/` directory with 4 opinionated install paths, each tailored to a different operator archetype. Each profile is one markdown file (~150-250 lines) that says "if you are X, install these N components from the stack, follow these N workflows, skip these others."

**Why:** Profiles are the self-identification surface — a reader who lands on the repo and is unsure if it applies to them clicks the profile that matches and gets a directly-tailored answer. Profiles also force the stack to articulate which parts are core vs which are situational, which sharpens the rest of the docs as a side effect. Four profiles is enough to cover the obvious archetypes without diluting; non-fitting readers can compose their own from the components.

**Success criteria:**
1. `profiles/README.md` exists with a "which profile fits me?" decision table
2. Four profile files exist: `indie-hacker.md`, `freelancer.md`, `agency-owner.md`, `content-creator.md`
3. Each profile has sections: "Who this is for", "Install this subset", "Skip this", "Daily loop", "First week"
4. Each profile cross-links to specific cookbook recipes, scaffolds, and workflows
5. Each profile is opinionated — recommendations are concrete, not "consider X"
6. Profiles linked from main README under a new "Pick your profile" section
7. None of the profiles claim to be definitive — each says "this is one shape; remix freely"

**Risks:**
- **Profiles read as marketing personas.** Mitigation: each profile opens with a one-paragraph composite description grounded in real operator types the author has seen, not aspirational personas. Slap-pass for marketing-speak.
- **A reader feels excluded because they don't match any of the 4.** Mitigation: README explicitly says "if you don't fit any of these, the stack components are à-la-carte; pick what makes sense"; explicit non-archetype mention.
- **Profiles get stale faster than other content.** Mitigation: minor — profiles update by editing one file at a time; low cost.

**Files to create/modify:**
- `profiles/README.md` (new)
- `profiles/indie-hacker.md` (new)
- `profiles/freelancer.md` (new)
- `profiles/agency-owner.md` (new)
- `profiles/content-creator.md` (new)
- `README.md` (modify: add "Pick your profile" section)
- `CHANGELOG.md` (modify)

---

### Phase 6: Pre-launch audit pass
**Effort:** ~2-3h
**Depends on:** Phases 1-5 (audits everything that has been added)
**Goal:** A full pre-launch sweep that validates link integrity, attribution completeness, sanitisation completeness, README front-page clarity, and consistency of voice across all new content from Phases 1-5. Catches issues before the public flip, when fixing them is cheap.

**Why:** The single biggest reputational risk at launch is a broken link in the README, an unattributed component, or a real key/path that slipped through. Each of those is a 5-minute fix in private but a public embarrassment after launch. This phase is cheap insurance.

**Success criteria:**
1. Every link in README, README.ru, README.es, and all phase-1-to-5 new files resolves (markdown-link-check or equivalent passes)
2. Every component referenced in any new file has a `credits/README.md` entry
3. Sanitisation grep over the full repo passes (no operator domains, no real keys, no PII)
4. README front page reads cleanly with the new sections inserted (TOC matches headings, no duplicate sections, no orphaned references)
5. CHANGELOG has a complete unreleased section listing every Phase 1-5 deliverable
6. CLAUDE.md (repo) updated if any new content category needs voice/style guidance
7. `cookbook/`, `configs/hooks/`, `stack/ecc-skill-index.md`, `scaffolds/`, `profiles/` all linked from README

**Risks:**
- **Broken-link checker is noisy and creates false positives.** Mitigation: maintain a tiny ignore-list (e.g. localhost links in code blocks, deliberately-non-public placeholders) so the audit gate is real.
- **Audit reveals a real issue late in the milestone.** Mitigation: this *is* the function of this phase — issues found here block the public flip; fix and re-run before proceeding.

**Files to create/modify:**
- README files (modify: TOC, links, section order)
- `credits/README.md` (modify: add any missing entries)
- `CHANGELOG.md` (modify: complete unreleased section)
- `CLAUDE.md` (modify if needed)
- No net-new files unless audit reveals a missing one

---

### Phase 7: Credibility capture (USER-DRIVEN)
**Effort:** ~2h (mostly user time; agent only assists with embedding + sizing)
**Depends on:** Phases 1-6 (capture happens against the audited repo state)
**Goal:** Capture 3 screenshots and 1 asciinema cast that demonstrate the stack in real use, then embed them in the README. This is the **USER-DRIVEN** phase — the agent cannot take screenshots of the operator's Obsidian vault or record an asciinema cast on the operator's machine. The agent's role is to prepare the embed locations, file naming convention, image-optimisation steps, and to verify after the fact.

**Why:** Screenshots are the highest-converting credibility artefact for a launch landing page. A reader who sees a real Obsidian vault, a real Claude Code session reading a project note, and a real install run is more likely to star than one who reads claims. asciinema for the install adds the "I can verify what the installer does" trust signal that matters for any `curl | bash`-adjacent flow.

**The 3 screenshots + 1 cast:**
1. **Obsidian vault view** — screenshot of `~/Brain/Projects/` directory showing the project note structure (sanitised: project names anonymised if needed)
2. **Claude Code reading project note** — screenshot of a Claude Code session at the moment it reads `~/Brain/Projects/<sanitised>.md` and uses the context (sanitised: no real project, no real keys)
3. **Stack overview** — screenshot of `~/.claude/` after install, showing the layout (sanitised: no real configs)
4. **asciinema cast** — recorded `./install.sh --dry-run` showing the full installer output

**Success criteria:**
1. 3 screenshot files exist under `assets/screenshots/` (PNG, optimised, < 300KB each, < 1920px wide)
2. 1 asciinema cast file exists under `assets/casts/install-dry-run.cast`
3. README embeds all 4 artefacts in clearly-labelled sections (one near the install step, the others near the relevant playbook)
4. All artefacts are sanitised (no real paths in shell prompts, no real project names visible, no real API keys)
5. Each artefact has alt text describing it for accessibility
6. Issue #6 (the existing screenshots good-first-issue) is closed by this phase

**Risks:**
- **User can't get the right state to screenshot in one session.** Mitigation: agent prepares a checklist for the user (what to open, what to redact, what window size); user can do it asynchronously and the agent picks back up to embed.
- **asciinema cast is too long or noisy.** Mitigation: target 60-90s; cast can be re-recorded cheaply.
- **A screenshot accidentally exposes a real product name in a sidebar.** Mitigation: explicit redaction checklist before commit; agent reviews each PNG and flags anything that looks like a real identifier.

**Files to create/modify:**
- `assets/screenshots/obsidian-vault.png` (new — user captures, agent embeds)
- `assets/screenshots/claude-code-reads-project-note.png` (new)
- `assets/screenshots/claude-config-after-install.png` (new)
- `assets/casts/install-dry-run.cast` (new)
- `README.md` (modify: embed all 4 with alt text and captions)
- `README.ru.md`, `README.es.md` (modify: same embeds, translated captions)
- `CHANGELOG.md` (modify)
- close Issue #6

---

### Phase 8: Launch surfaces prep
**Effort:** ~2-3h
**Depends on:** Phases 1-7 (everything that will be launched must be in place)
**Goal:** Prepare every public-facing surface that the launch will use, *but do not flip the repo public yet*. This phase produces drafts and assets that get reviewed-then-shipped in Phase 9. Separating prep from flip means the irreversible action is small and contained.

**Why:** Launch quality is mostly a function of how well the surfaces around the artefact are prepared. A repo that flips public with no GitHub Topics, no social preview image, and a cold X-thread converts a fraction of what one with all four well-prepared converts. This phase batches all the small things so Phase 9 is just "go".

**Success criteria:**
1. **GitHub Topics:** drafted set of 8-12 topics (e.g. `claude-code`, `claude-skills`, `solo-founder`, `ai-tooling`, `mcp`, `obsidian`, `operator-playbook`, `indie-hackers`)
2. **GitHub Social preview image:** 1280x640 PNG that reuses the hero banner aesthetic, drafted under `assets/social-preview.png`
3. **GitHub About text:** drafted ≤350 chars, no marketing fluff, mentions "operator playbook + curated stack" and links to ECC
4. **GitHub Discussions:** decided whether to enable; if yes, drafted 3 starter discussion topics (Q&A format)
5. **X-thread draft:** 6-10 tweets in `.planning/launch/x-thread.md`, operator-first tone, no emojis, ends with link to repo
6. **Show HN draft:** title + first comment in `.planning/launch/show-hn.md`, follows HN show-rules, links to repo, no marketing language
7. **Founder shortlist:** list of 5-10 solo founders / Claude Code users in `.planning/launch/founder-dms.md` with a draft DM (one variant; personalised at send-time)
8. **Pre-flip checklist:** a single `.planning/launch/PRE-FLIP-CHECKLIST.md` that Phase 9 walks through

**Risks:**
- **X-thread or Show HN draft leans into marketing voice and undermines operator positioning.** Mitigation: explicit constraint in this phase — every line must pass "would I cringe if I read this on someone else's launch"; slap-pass.
- **Founder DM list is too small or too off-target.** Mitigation: 5 minimum is acceptable; quality > quantity; agent does not pick founders, the user does.
- **Topics overlap with ECC's topics in a way that looks copycat.** Mitigation: pick 2-3 distinct operator-tilted topics (`solo-founder`, `operator-playbook`) that ECC doesn't claim.

**Files to create/modify:**
- `assets/social-preview.png` (new)
- `.planning/launch/x-thread.md` (new)
- `.planning/launch/show-hn.md` (new)
- `.planning/launch/founder-dms.md` (new)
- `.planning/launch/PRE-FLIP-CHECKLIST.md` (new)

---

### Phase 8.1: Animated hero visual ✅ COMPLETED
**Effort:** ~3-4h
**Depends on:** Nothing (replaces existing static `assets/hero.svg`; parallelisable with 8.2/8.3/8.4)
**Goal:** Replace `assets/hero.svg` with an animated SVG (or short video loop, ≤15 seconds) that shows the operator-loop in motion: project directory open → Claude reads `~/Brain/Projects/<name>.md` → ships a PR → screen flashes the next project. Static visual is currently an SVG; ECC has none, this is a place where we can demonstrably leapfrog them visually.

**Why:** The hero visual is the single most-viewed pixel on the repo — every visitor sees it before reading a word. ECC ships *no* hero animation; their README leads with text. An animated operator-loop visual is the fastest way to communicate "this is what running the stack looks like" to a reader who hasn't installed anything yet. It also reinforces the "operator-first" voice (ECC's voice is engineer-first / framework-first). Animated SVG is preferred over MP4 because SVG loops cleanly inline on github.com and respects prefers-reduced-motion if authored well.

**Success criteria:**
1. New `assets/hero.{svg|webm|mp4}` (pick the format that renders inline on github.com)
2. README.md `<img>` tag updated to point at the new asset
3. Loop ≤15 seconds, file ≤500KB (GitHub clips larger inline images)
4. Preview in dark and light theme — no white background that breaks dark mode
5. Captures the "solo operator running the loop" feeling without literal screenshots of the operator's vault (privacy-safe — generic project names like "marketplace", "saas", "pipeline")
6. All 6 translated READMEs (RU, ES, ZH, JA, FR, DE if present) updated to point at the new asset
7. Animation respects `prefers-reduced-motion` (animation pauses or shows static frame for users with the setting)

**Risks:**
- **SVG animations can be inconsistent across browsers.** Mitigation: if going SVG, test on Chrome + Firefox + Safari before commit; if any breaks, fall back to animated PNG (apng).
- **Video files don't loop natively in GitHub markdown.** Mitigation: use animated SVG or animated PNG (apng) for true loop; MP4/webm only as last resort with explicit autoplay+loop attributes.
- **Animation crosses the privacy line and shows real project names.** Mitigation: hard rule — only generic placeholder names (`marketplace`, `saas`, `pipeline`); slap-pass before commit.
- **File size balloons past 500KB and GitHub clips it.** Mitigation: target 200KB; if over, simplify the animation rather than cropping.

**Files to create/modify:**
- `assets/hero.svg` (replace) OR `assets/hero.webm` + `assets/hero-fallback.svg`
- `README.md` (update `<img>` tag in the hero block)
- All translated READMEs (`README.ru.md`, `README.es.md`, etc. — update `<img>` tags to point at the same asset)
- `CHANGELOG.md` (modify)

---

### Phase 8.2: Compare matrix in README ✅ COMPLETED
**Effort:** ~1-2h
**Depends on:** Nothing (parallelisable with 8.1/8.3/8.4)
**Goal:** Add a brief, honest "How this compares" section to README.md. Three columns: Solo Stack, Everything Claude Code, Starter templates (e.g., create-next-app, tailwind starter). Three rows that highlight the **non-overlapping** value: tone/audience, depth-of-stack, real shipped proof. Reader leaves the page with a clear mental map of when to pick each, instead of "this is yet another claude config."

**Why:** Readers landing on the repo for the first time often ask "is this just an ECC fork?" or "is this just another starter template?" within 30 seconds. The compare matrix answers both questions in one scan. It also forces the operator to articulate the non-overlap clearly — which sharpens positioning across the rest of the README as a side effect. Honest comparison (no trash-talking) reads as confidence, not insecurity. The translated RU + ES versions ensure the bilingual identity carries through to this surface.

**Success criteria:**
1. New section in README.md (between "Why this exists" and "Status" works well; or as a Decision Helper block right before Quick Start)
2. 3-column markdown table with 5-7 honest comparison rows
3. Section linked from README TOC
4. No trash-talking — neutral, factual; reader trusts the author who knows their borders
5. Same section translated into RU + ES (ES is the AR market, RU is the bilingual identity)
6. Each row passes a "would I be happy if the ECC author read this" check
7. Compare matrix references ECC by URL (github.com/affaan-m/everything-claude-code), giving credit and showing this is informed positioning, not ignorance

**Risks:**
- **Compare matrix is tone-sensitive.** Mitigation: an agent left to its own devices will produce marketing copy. Plan must specify exact rows and a no-marketing rule. Slap-pass for marketing-speak before commit.
- **Comparison reads as defensive ("we are not just X").** Mitigation: phrase rows in terms of audience-fit ("if you want X, pick this column"), not in terms of what we are not.
- **Translated versions go stale when README compare matrix changes.** Mitigation: cross-reference between RU/ES and the canonical EN section in a comment so future edits are easy to sync.

**Files to create/modify:**
- `README.md` (insert section + TOC entry)
- `README.ru.md` (translate)
- `README.es.md` (translate)
- `.planning/phases/P8.2-compare-matrix/PLAN.md` (planning artefact)
- `CHANGELOG.md` (modify)

---

### Phase 8.3: npm CLI package — `claude-operator-stack` ✅ COMPLETED
**Effort:** ~6-8h (the heaviest of the four 8.x phases)
**Depends on:** Nothing (separate `packages/cli/` directory; doesn't touch existing repo content; parallelisable with 8.1/8.2/8.4)
**Goal:** Ship a real npm package — `npx claude-operator-stack init` — that runs an interactive installer wizard. Replaces the bash `install.sh` for users who prefer node, AND adds the kind of "real software" artefact that ECC has and we don't (their `ecc-universal` npm package + `ecc-agentshield`). One npm package = one provable software thing we built; massive credibility lift over "here's a bash script."

**Why:** ECC ships real npm packages. We ship a bash script. The credibility delta from "I run a bash script" to "I run `npx <thing>`" is enormous for an audience that lives in node-land — and a sizeable chunk of solo-founder operators do. The package also doubles as a verification surface: `npx claude-operator-stack verify` reads `~/.claude/settings.json` and reports which stack components are wired, which is a maintenance trust signal. Critically, the bash path stays — they coexist. CLI is the "node-native" path; bash is the "audit-and-run" path. Different audiences, both served.

**Success criteria:**
1. New `packages/cli/` directory with:
   - `package.json` (real `name: claude-operator-stack`, `version: 0.1.0`, MIT, repo URL, author)
   - `src/index.ts` (CLI entrypoint with `init`, `verify`, `list-stack` commands)
   - `src/init.ts` (interactive wizard — prompts for which marketplaces, which hooks, vault path; mirrors `install.sh` flow)
   - `src/verify.ts` (read `~/.claude/settings.json` and report which stack components are wired)
   - README, LICENSE, basic tests with vitest or `node:test`
2. Buildable: `pnpm build` produces `dist/` with sourcemaps
3. Runnable locally: `pnpm dev init --dry-run` works end-to-end
4. Uses zero net-new heavy deps — only `commander`, `prompts`, `chalk` (or `picocolors`), `zod` if needed for config validation
5. Keeps `install.sh` working — they coexist; CLI is the "node-native" path, bash is the "audit-and-run" path
6. `npx claude-operator-stack init --dry-run` works without publishing (via local link or direct invocation in repo)
7. Top-level README adds a "Quick Start (npm path)" alongside the existing bash path
8. Test coverage ≥ 70% on `init.ts` and `verify.ts` (lower than the 80% rule because this is a CLI wizard, not business logic — interactive prompts are harder to test)

**Risks:**
- **Heaviest phase by far. Scope must be clamped:** `init` + `verify` + `list-stack` only. No marketplace browser, no MCP server installer (those are v1.1).
- **Scope creep into building a plugin runtime.** Mitigation: hard rule in PLAN.md — we are NOT writing a plugin runtime; we're writing an installer wizard for an existing stack. ECC owns runtime; we own installer ergonomics. PLAN.md must list explicit non-goals.
- **npm publishing is not part of this phase.** Mitigation: that's a P9 decision (publish coordinated with public flip). Phase 8.3 ships the package buildable + locally runnable; publishing is the irreversible step coordinated with the visibility flip.
- **Interactive wizards are hard to test.** Mitigation: factor pure logic out of prompts; test the pure logic; smoke-test the prompts with a `--dry-run` mode. 70% coverage is the realistic bar.
- **TypeScript build configuration drift from rest of repo.** Mitigation: `packages/cli/tsconfig.json` extends a root `tsconfig.base.json` if one exists, else stands alone with sensible strict defaults.

**Files to create/modify:**
- `packages/cli/` (new — full directory; ~15-25 files including src, tests, package.json, tsconfig, README, LICENSE)
- `README.md` (Quick Start gets new "via npm" subsection)
- `package.json` at repo root (add `workspaces` field if going pnpm/yarn workspaces)
- `pnpm-workspace.yaml` or equivalent (new if going pnpm workspaces)
- `.gitignore` (modify: add `packages/*/dist/` and `packages/*/node_modules/`)
- `.planning/phases/P8.3-npm-cli/PLAN.md` (planning artefact)
- `CHANGELOG.md` (modify)

---

### Phase 8.4: Solo-founder skills marketplace ✅ COMPLETED
**Effort:** ~6-8h
**Depends on:** Nothing (new `skills/` directory at repo root, doesn't touch existing repo content; parallelisable with 8.1/8.2/8.3)
**Goal:** Ship 5-7 *original* skill packages that target solo-founder use-cases ECC's catalog doesn't cover. Each skill is a single SKILL.md file with frontmatter, mirroring ECC's skill convention so it can be discovered by Claude Code. **Not duplicating ECC** — these target gaps.

**Why:** ECC has 182 skills targeting general engineering use-cases. Solo founders have a different daily loop: cost monitoring across 5+ services, multi-project context-switching, anonymisation discipline before publishing, weekly review rituals, ship-in-a-day workflows. None of these are well-covered by ECC's catalog. Shipping 5-7 original skills that target *those gaps* gives the repo a non-overlapping skills surface — readers can install ours alongside ECC's, not instead of. It also demonstrates that we understand ECC's conventions deeply enough to extend them, which earns credibility with the ECC audience.

**Suggested skill set (pick 5-7 the agent decides are most coherent):**
1. `solo-billing-monitor` — daily cost rollup across Vercel + Railway + Supabase + Anthropic + OpenAI; flags >30% week-over-week jumps
2. `multi-project-context-bridge` — copy decisions tagged with project name from one OMEGA session into another, with anonymisation
3. `obsidian-sync-helper` — verify `~/Brain/Projects/<name>.md` matches the project's actual git state (open tasks vs uncommitted, decisions vs commit messages)
4. `case-study-anonymiser` — apply the operator's anonymisation playbook to a draft case study (URL stripping, name redaction, "Discipline A/B/C" alias mapping)
5. `cookbook-add-recipe` — interactive wizard to add a new cookbook recipe in the existing fixed shape (problem → stack → recipe → pitfalls → references)
6. `weekly-monday-review` — Monday review skill: open the dashboard, surface stale projects, suggest the 2-of-7 to focus on this week
7. `ship-day-planner` — turn a one-line product idea into the "ship in a day" workflow split into the 8 blocks from `workflows/ship-a-product-in-a-day.md`

**Success criteria:**
1. New `skills/` directory at repo root with 5-7 skill subdirectories
2. Each subdirectory has SKILL.md with frontmatter (`name`, `description`, `origin: claude-operator-stack`)
3. Each SKILL.md follows the convention: `# Title → ## When to Use → ## Core Concepts → ## How It Works (numbered steps)`
4. Each skill is *invocable* — when installed at `~/.claude/skills/`, Claude Code discovers it via standard skill loading
5. README.md `What's Inside` tree gets `skills/` added
6. New section in README "Solo-founder skills (originals)" with one-line descriptions and the count
7. `skills/README.md` indexes the set with a one-line use-case per skill
8. Each skill has a 30-90 line body that actually instructs Claude on what to do, not a stub
9. Distinct from cookbook: cookbook = how-to docs the operator reads; skills = invocable prompts Claude executes (this distinction stated in `skills/README.md`)

**Risks:**
- **Scope creep — must clamp at 5-7.** Mitigation: if candidates overflow, pick the 5 most non-overlapping with ECC. PLAN.md lists the cut-line explicitly.
- **Each skill needs to be real, not just a stub.** Mitigation: SKILL.md must instruct Claude on what to actually do, not just describe. Slap-pass enforces a minimum body length and concrete steps.
- **Skills accidentally duplicate ECC functionality.** Mitigation: PLAN.md cross-references the candidate against ECC's skill index before writing; if ECC has equivalent, drop the candidate or sharpen the differentiation.
- **Confusion between cookbook and skills.** Mitigation: explicit distinction in `skills/README.md` and `cookbook/README.md` cross-link block.

**Files to create/modify:**
- `skills/<5-7 skill names>/SKILL.md` (new each)
- `skills/README.md` (new — index)
- `README.md` ("What's Inside" tree update + new "Solo-founder skills" section)
- `cookbook/README.md` (modify: cross-link to `skills/` with the cookbook-vs-skills distinction)
- `.planning/phases/P8.4-own-skills/PLAN.md` (planning artefact)
- `CHANGELOG.md` (modify)

---

### Phase 8.5: Operator slash-commands (`commands/`)
**Effort:** ~3-4h
**Depends on:** Nothing (new `commands/` directory; doesn't touch existing repo content except README at the end; parallelisable with 8.6 and 8.7)
**Goal:** Ship a `commands/` directory with 6 slash-command files that wrap our 6 own skills under `skills/`. Each command is one markdown file in the convention ECC uses for slash-commands (frontmatter + body that delegates to a skill). The command file gives Claude Code the slash-picker entry; the body instructs Claude to load the wrapped skill and execute its protocol with the given args.

**Why:** Skills under `skills/` are discoverable but not invocable as shorthand — a user has to type out the protocol or remember to ask Claude to load the skill. Slash-commands convert each skill into a one-keystroke verb. ECC ships a `commands/` directory using exactly this pattern; mirroring it makes our 6 own skills first-class citizens of the same operator UX. This is the difference between `skills/` being a passive library and an active toolbelt. Crucially, this is not cargo cult: each command adds args, examples, and usage clarification beyond the skill body — the value-add is operator ergonomics, not just a shim.

**The 6 commands (1:1 with `skills/`):**
- `/solo-monday-review` → invokes `weekly-monday-review` skill
- `/anonymise-case-study` → invokes `case-study-anonymiser` skill
- `/ship-day` → invokes `ship-day-planner` skill
- `/cost-rollup` → invokes `solo-billing-monitor` skill
- `/bridge-context <source-project>` → invokes `multi-project-context-bridge` skill
- `/sync-brain` → invokes `obsidian-sync-helper` skill

**Command file shape (each `commands/<name>.md`):**
```markdown
---
name: <kebab-name>
description: <one sentence — usable by Claude Code's slash-command picker>
---

# /<command-name>

<one-paragraph what-it-does, written for the operator>

When invoked, this command runs the [`<skill-name>`](../skills/<skill-name>/SKILL.md) skill with the following parameters:

- ...

## Usage
\`\`\`
/<command-name> [args]
\`\`\`

## Examples
[2-3 examples]

## Behavior
<numbered list mirroring the skill's How It Works>
```

**Success criteria:**
1. 6 command files in `commands/<name>.md` (one per own skill, exactly)
2. `commands/README.md` indexes them as a table (command name → use case → links to wrapped skill)
3. Each command's `description` frontmatter is a single sentence usable by Claude Code's slash picker
4. Each command links back to its wrapped skill explicitly via relative path
5. Command names match the skill names by convention (kebab-case)
6. Naming verified to not collide with ECC's commands (verify via `gh api repos/affaan-m/everything-claude-code/contents/commands` before finalising)
7. README.md "What's Inside" tree adds `commands/` block
8. README.md adds a "Slash commands" section between "Solo-founder skills (originals)" and "Scaffolds" (or wherever fits the flow), 4-6 lines linking to `commands/README.md`
9. Translated READMEs (RU, ES) get matching TOC entries and section

**Risks:**
- **Cargo cult — commands that just say "run the skill" without adding value.** Mitigation: each command MUST have args, examples, and usage clarification beyond the underlying skill. Slap-pass enforces — a command file with no args section and no examples gets rejected.
- **Naming collision with ECC's command set.** Mitigation: verify via `gh api repos/affaan-m/everything-claude-code/contents/commands` before finalising names; if any of our chosen names collide, prefix with `solo-` or `op-`.
- **Drift between command body and underlying skill.** Mitigation: command body is intentionally thin and points at the skill for the actual protocol; the skill is the source of truth, the command is the shorthand. Cross-link is one-way (command → skill, never inlined).

**Files to create/modify:**
- `commands/README.md` (new — index)
- `commands/solo-monday-review.md` (new)
- `commands/anonymise-case-study.md` (new)
- `commands/ship-day.md` (new)
- `commands/cost-rollup.md` (new)
- `commands/bridge-context.md` (new)
- `commands/sync-brain.md` (new)
- `README.md` ("What's Inside" tree + new "Slash commands" section + TOC entry)
- `README.ru.md`, `README.es.md` (matching TOC + section)
- `.planning/phases/P8.5-commands/PLAN.md` (planning artefact)
- `.planning/phases/P8.5-commands/INTEGRATION.md` (README delta snippet for coordinated pass)
- `CHANGELOG.md` (modify)

---

### Phase 8.6: Long-form guides (`docs/`)
**Effort:** ~2-3h
**Depends on:** Nothing (new `docs/` directory; touches README at the end; parallelisable with 8.5 and 8.7)
**Goal:** Extract 3-4 long sections from README.md into focused `docs/` files, leaving short summaries with "see [docs/...]" links in the README. Net effect: README shorter and more scannable; `docs/` becomes a discovery surface for readers who want depth. Two of the four files are extractions (move existing prose); two are net-new long-form pieces written for this phase.

**Why:** The README has crossed the threshold where two long sections (the "How this compares" full version and the full annotated `What's Inside` tree) make the page hard to skim on first land. Extraction shrinks README by ~140 lines and gives `docs/` a purpose: it becomes the first place readers go for depth, separate from the README's first-impression job. The two new long-form pieces (`v1-changelog-deep-dive.md`, `why-only-claude-code.md`) pre-empt two specific reader questions that `CHANGELOG.md` and the README don't currently answer well.

**The 4 docs files:**

1. **`docs/comparing-stacks.md`** — full "How this compares" content (currently ~75 lines in README). README keeps a 3-line summary + link.
2. **`docs/whats-inside.md`** — full annotated directory tree (currently ~70 lines in README). README keeps a compact 6-line top-level overview + link.
3. **`docs/v1-changelog-deep-dive.md`** — narrative changelog of waves 1-8 + reality-syncs (200-300 lines). New content. For readers who want the story, not just CHANGELOG.md's terse format.
4. **`docs/why-only-claude-code.md`** — 100-150 lines explaining the deliberate choice not to ship multi-harness `.cursor/`, `.codex/`, etc. Pre-empts "why don't you support X?" issues. New content.

**Success criteria:**
1. 4 files in `docs/`, each 100-300 lines, focused
2. `docs/README.md` indexes them with one-line descriptions
3. README.md shrinks by ~140 lines (extracted sections replaced with summaries pointing at the docs/ versions)
4. All cross-links from extracted-into-docs back to README sections still resolve
5. README.md "What's Inside" tree adds `docs/` block
6. TOC entry added for the new "Long-form docs" section in README (link to `docs/README.md`)
7. Each extracted file explicitly says at the top "expanded from README §<section>" so the one-way truth flow is obvious
8. Translated READMEs (RU, ES) get matching summary truncations + links to the (English) docs/ files (translation of long-form docs is explicit v1.1 work, not v1.0)

**Risks:**
- **README becomes a stub ("see docs/" everywhere).** Mitigation: keep substantive lead-ins; only the *long tail* of each section moves to `docs/`. README still answers "what is this and why should I care" without bouncing the reader.
- **Content drift between README summary and docs/full version.** Mitigation: docs/ files explicitly state "expanded from README §<section>"; one-way truth flow (docs/ is the canonical long form, README is the summary). When updating, change docs/ first then re-summarise in README.
- **Two new long-form pieces grow into essays.** Mitigation: hard cap — `v1-changelog-deep-dive.md` ≤300 lines; `why-only-claude-code.md` ≤150 lines. If a piece overflows, the surplus becomes a separate v1.1 doc.

**Files to create/modify:**
- `docs/README.md` (new — index)
- `docs/comparing-stacks.md` (new — extracted from README)
- `docs/whats-inside.md` (new — extracted from README)
- `docs/v1-changelog-deep-dive.md` (new — written)
- `docs/why-only-claude-code.md` (new — written)
- `README.md` (3 sections shortened with "see docs/..." links + TOC entry)
- `README.ru.md`, `README.es.md` (matching summary truncations + links)
- `.planning/phases/P8.6-docs/PLAN.md` (planning artefact)
- `.planning/phases/P8.6-docs/INTEGRATION.md` (README delta snippet for coordinated pass)
- `CHANGELOG.md` (modify)

---

### Phase 8.7: E2E integration tests (`tests/`)
**Effort:** ~3-4h
**Depends on:** P8.5 (some commands tests reference command files — but if P8.5 lands first or in parallel, P8.7 just adds tests for them; can run in parallel against expected file paths). Otherwise no hard deps.
**Goal:** Top-level `tests/integration/` directory with E2E tests for the install path. Tests run from repo root via `pnpm test:integration` (which dispatches to a runner script). Turns "trust me, the installer is safe" into "here's the assertion suite that proves it" — a credibility delta for any reader evaluating whether to run our installer on their machine.

**Why:** v1.0's install surface (`install.sh` plus the new `packages/cli/` from P8.3) currently has no end-to-end test that runs the full flow. Unit tests in `packages/cli/` cover pure logic; the assertion that "running install.sh in a fresh environment doesn't write outside `~/.claude/`" or "the CLI's `init --dry-run` exits cleanly with the expected stdout shape" lives only in the operator's head. Integration tests close that gap. They also make the repo a more credible target for contributors — a PR can be evaluated against a deterministic test suite, not just code review. Test count is intentionally small (4): coverage for the highest-risk surfaces, no test theatre.

**The 4 integration tests:**

1. **`tests/integration/install-sh.test.sh`** (pure-bash with `set -euo pipefail`, or bats if available) — runs `./install.sh --dry-run --yes` against a stub `~/.claude/` (mocked via `HOME=/tmp/test-home-$$`). Asserts:
   - Script exits 0
   - Sidecar files written to `<HOME>/.claude/<name>.from-operator-stack`
   - No write outside `<HOME>/.claude/`
   - `claude` CLI absence handled gracefully

2. **`tests/integration/cli-init.test.ts`** — runs the CLI's `init --dry-run --yes --claude-dir /tmp/test-claude-$$` end-to-end via `node packages/cli/dist/cli.js`. Asserts:
   - Process exits 0
   - Stdout contains the 4-step wizard banner
   - `--claude-dir` is honoured (no write outside that path)
   - Sidecar files staged from `packages/cli/configs/`
   - `WizardAbortedError` semantics (simulated SIGINT) returns exit 130

3. **`tests/integration/cli-verify.test.ts`** — runs `verify --claude-dir <empty-tmp>` and asserts JSON output shape, exit code matrix (0 = all wired, 1 = something missing, 2 = settings.json malformed).

4. **`tests/integration/cli-list-stack.test.ts`** — runs `list-stack --json` and asserts the 6 components, the tier grouping, and that no two component IDs collide.

**Plus a runner:**

`tests/run-all.sh` — single entry point that:
1. Builds `packages/cli` first (`pnpm --filter @claude-operator-stack/cli build`)
2. Runs the .ts integration tests via `vitest run --config tests/vitest.config.ts`
3. Runs the .sh integration tests via pure-bash loop (or bats if present)
4. Returns non-zero if any sub-test failed

`package.json` (root) gets a `"test:integration": "bash tests/run-all.sh"` script.

**Success criteria:**
1. 4 integration test files (3 .ts + 1 .sh) under `tests/integration/`
2. `tests/run-all.sh` works end-to-end from a fresh clone
3. Root `package.json` has `test:integration` script
4. All tests pass (run before committing)
5. Total integration suite runs in <60s on the operator's machine
6. Every shell-based test asserts `HOME` is set to a `/tmp/...` path before running install.sh (defence-in-depth so a misconfigured run cannot touch the developer's real `~/.claude/`)
7. README.md "What's Inside" tree adds `tests/` block
8. New "Tests" section in README.md (or in CONTRIBUTING.md) describing how to run the integration suite
9. `tests/README.md` explains the testing strategy (what's covered, what's not, why this set)

**Risks:**
- **E2E tests touch the developer's real `~/.claude/` if HOME is misset.** Mitigation: every test asserts `HOME` is a `/tmp/...` path before running install.sh; the assertion is in the test itself, not just the runner.
- **bats not installed on CI/dev machines.** Mitigation: pick pure-bash with `set -euo pipefail` over bats; document `brew install bats-core` only as an optional upgrade. Pure-bash is the default.
- **Integration tests slow the loop.** Mitigation: budget <60s total; if any single test exceeds 30s, refactor or split. Integration suite runs on demand, not on every save.
- **Test coverage of the CLI dips below 70% if integration tests subsume unit tests.** Mitigation: integration tests are additive, not a replacement; unit tests in `packages/cli/__tests__/` continue to enforce the 70% bar from P8.3's success criteria.

**Files to create/modify:**
- `tests/integration/install-sh.test.sh` (new)
- `tests/integration/cli-init.test.ts` (new)
- `tests/integration/cli-verify.test.ts` (new)
- `tests/integration/cli-list-stack.test.ts` (new)
- `tests/run-all.sh` (new)
- `tests/vitest.config.ts` (new — minimal, points at tests/integration)
- `tests/README.md` (new — explains the testing strategy)
- `package.json` (root — add `test:integration` script)
- `README.md` ("What's Inside" tree + brief Tests section)
- `.planning/phases/P8.7-tests/PLAN.md` (planning artefact)
- `.planning/phases/P8.7-tests/INTEGRATION.md` (README delta snippet for coordinated pass)
- `CHANGELOG.md` (modify)

---

### Phase 9: Public flip + launch
**Effort:** ~2-3h (the irreversible session; +30min if npm publish is included)
**Depends on:** Phases 1-8.7 (all content shipped, all surfaces prepared, audit clean, doubling-down phases complete, structural-depth phases complete)
**Goal:** The one-shot public launch. Walk the pre-flip checklist, flip visibility, apply Topics + social preview + About, post the X thread, submit Show HN, send the founder DMs. Tag v1.0.0. **Coordinate npm publish of `claude-operator-stack` package** with the visibility flip (the package can't resolve a public repo URL until the repo is public).

**Why:** Launch is intentionally one phase, intentionally late, intentionally minimal-thought. By the time this phase starts, every decision should be locked in; this phase is execution only. That keeps the irreversible action calm. The npm publish piggybacks on this phase because publishing a package referencing a private repo creates a confusing user experience — better to publish at the moment the repo flips public.

**Success criteria:**
1. Pre-flip checklist (from Phase 8) walked top to bottom; every item ticked
2. `gh repo edit mccarthy606/claude-operator-stack --visibility public` executed successfully
3. Topics, social preview, About text applied via gh CLI
4. v1.0.0 tag created and pushed; GitHub release published with curated changelog
5. **npm publish executed for `claude-operator-stack@0.1.0`** (from Phase 8.3); package resolves on `npmjs.com/package/claude-operator-stack`
6. `npx claude-operator-stack@0.1.0 init --dry-run` works from a clean machine
7. X thread posted; URL recorded in `.planning/launch/launch-log.md`
8. Show HN submitted; URL recorded
9. Founder DMs sent (5-10); recipient list + send timestamps recorded
10. README badges updated to reflect public state if any were placeholder
11. Repo is reachable at `https://github.com/mccarthy606/claude-operator-stack` from a logged-out browser
12. Integration test suite (from Phase 8.7) passes on the launch commit before the flip — a green test suite is the last thing the operator sees before `--visibility public`

**Risks:**
- **A late-discovered sanitisation issue blocks the flip mid-phase.** Mitigation: the pre-flip checklist runs the sanitisation grep one final time; if it fails, abort the flip and return to Phase 6. Better to delay than to flip dirty.
- **gh CLI auth lapses or repo permissions are wrong at flip-time.** Mitigation: the pre-flip checklist includes `gh auth status` and `gh repo view --json viewerPermission` checks.
- **npm publish fails because of name conflict.** Mitigation: verify `claude-operator-stack` is available on npm during Phase 8.3 (not at flip-time); if taken, pivot name early.
- **npm publish succeeds but package is broken on a clean machine.** Mitigation: smoke-test `npx claude-operator-stack@0.1.0 init --dry-run` from a fresh node install before counting Phase 9 done; if broken, `npm unpublish` within 72h window and ship v0.1.1.
- **Show HN or X thread under-performs and the founder shortlist is wasted.** Mitigation: this is acceptable. Launch outcome is shaped by content + surfaces, not by perfect timing. If first wave is small, Phase 10 covers iteration.

**Files to create/modify:**
- `.planning/launch/launch-log.md` (new — runtime log of what got posted where, when, including npm publish output)
- `CHANGELOG.md` (modify: tag v1.0.0 entry with release notes)
- README badges (modify if any need update)
- GitHub repo metadata (Topics, social preview, About) — applied via gh CLI
- `packages/cli/package.json` (modify: bump to 0.1.0 if not already, ensure repo URL is correct)

---

### Phase 10: Launch+72h response
**Effort:** ~2-4h spread over 72h after Phase 9 (not one focus session — checkpoints across 3 days)
**Depends on:** Phase 9
**Goal:** Triage incoming attention. Respond to issues, PRs, discussions, X-thread replies, and Show HN comments. Hot-fix any obvious cuts (broken links, typos, an unattributed component someone notices). Write a short retro at the end.

**Why:** The first 72h after launch is the only window where attention is dense enough that responsiveness has compounding effect. A PR merged within 24h of being opened earns a contributor; one merged a week later doesn't. A Show HN comment answered within an hour reads as a real maintainer; one answered a day later reads as abandoned. This phase is the "land the launch" follow-through.

**Success criteria:**
1. Every issue opened in launch+72h has at least one response within 24h of opening
2. Every PR opened in launch+72h has either a merge, a request-for-changes, or an explicit decline within 48h
3. Every X-thread reply that asks a question gets an answer
4. At least 3 hot-fix commits land if real issues are surfaced (typos, broken links, missing attribution)
5. `.planning/launch/launch-retro.md` written at hour 72 with: stars/forks/PRs/discussions counts, npm install counts (from `npm-stat` or similar), what worked, what didn't, what to change for v1.1
6. v1.0.1 patch tag if any hot-fixes warranted it (and a corresponding npm v0.1.1 if CLI hot-fixed)
7. Issues opened by the audience are triaged into `good first issue` / `enhancement` / `wontfix` with labels

**Risks:**
- **Volume overwhelms one-person response.** Mitigation: prioritisation order — security > PRs > issues > X replies > Show HN comments. If volume is genuinely too high (a flood scenario), pin a "I'm reviewing all incoming, please give me 24h" notice.
- **A critical bug is reported in launch+24h.** Mitigation: hot-fix lane is open in this phase; that's the point. Address, ship v1.0.1, move on.
- **Retro is skipped because launch-fatigue.** Mitigation: retro is part of Phase 10's success criteria, not optional; even a 30-line retro counts.

**Files to create/modify:**
- `.planning/launch/launch-retro.md` (new — 72h retro)
- Hot-fix commits to wherever real issues land
- `CHANGELOG.md` (modify if v1.0.1 ships)
- `packages/cli/package.json` (modify if CLI hot-fix ships at v0.1.1)

---

## Progress

**Execution order:** Phase 1 → 2 (parallelisable with 1; can swap) → 3 → 4 (depends on 1,2) → 5 (depends on 1-4) → 6 (audit) → 7 (user-driven capture) → 8 (launch prep) → **Wave A: 8.1, 8.2, 8.3, 8.4 in parallel** ✅ DONE → **Wave B: 8.5, 8.6, 8.7 in parallel** (3 agents, ~30-45 min wallclock for the heaviest, then a coordinated README pass ~10 min) → 9 (flip + npm publish) → 10 (response).

**If sequential is preferred for the 8.x wave** (cheap-to-expensive, builds confidence in the surface before the heavy phases): **8.2 → 8.4 → 8.1 → 8.3** (Wave A, done) → **8.6 → 8.5 → 8.7** (Wave B, sequential alternative).

**Wave-B coordination (8.5/8.6/8.7):** all three touch `README.md` at the end. Strategy mirrors the Wave-A pattern: each executor writes its README updates to `.planning/phases/<phase>/INTEGRATION.md` and a coordinated README pass lands them all in one Edit batch.

| Phase | Effort | Depends on | Status | Completed |
|-------|--------|------------|--------|-----------|
| 1. Cookbook of recipes | 6-8h | — | Not started | - |
| 2. Sanitized custom hooks | 3-4h | — | Not started | - |
| 3. Skill index | 2-3h | — | Not started | - |
| 4. Project scaffolds | 6-8h | 1, 2 | Not started | - |
| 5. Operator profiles | 3-4h | 1-4 | Not started | - |
| 6. Pre-launch audit pass | 2-3h | 1-5 | Not started | - |
| 7. Credibility capture (user-driven) | 2h | 1-6 | Not started | - |
| 8. Launch surfaces prep | 2-3h | 1-7 | Not started | - |
| 8.1. Animated hero visual | 3-4h | — (post-8) | ✅ Completed | 2026-05-05 |
| 8.2. Compare matrix in README | 1-2h | — (post-8) | ✅ Completed | 2026-05-05 |
| 8.3. npm CLI package | 6-8h | — (post-8) | ✅ Completed | 2026-05-05 |
| 8.4. Solo-founder skills | 6-8h | — (post-8) | ✅ Completed | 2026-05-05 |
| 8.5. Operator slash-commands | 3-4h | — (post-8.4; touches README) | Not started | - |
| 8.6. Long-form guides (`docs/`) | 2-3h | — (post-8.4; touches README) | Not started | - |
| 8.7. E2E integration tests | 3-4h | P8.5 (loose) (post-8.4) | Not started | - |
| 9. Public flip + launch | 2-3h | 1-8.7 | Not started | - |
| 10. Launch+72h response | 2-4h | 9 | Not started | - |

**Total effort estimate:** ~54-74h of focused work (was ~46-63h before 8.5-8.7 insertions; 8.5-8.7 adds ~8-11h), 13-18 focus sessions, 3-5 calendar weeks at typical solo-founder cadence. Wave-B parallelism on 8.5-8.7 can compress wallclock to ~30-45 min if 3 agents run concurrently, plus ~10 min for the coordinated README pass.

## Two risks to watch (updated 2026-05-05)

1. **Cargo cult on P8.5 and structural drift on P8.6** (the new top risk after the 8.5-8.7 insertions). The slash-commands phase wants to grow into "command for every skill including ECC's" (no — only our 6 own); the docs phase wants to grow into a full documentation site (no — 4 files, hard cap). Both PLAN.md docs must enforce explicit non-goals: P8.5 = 6 commands wrapping our 6 own skills, no commands for ECC's skills, no command without args/examples; P8.6 = 4 docs files, README shrinks by ~140 lines, no documentation site generator. PLAN.md authors must list non-goals in addition to goals.
2. **Sanitisation slip in the new artefacts** (the standing risk, now applies to 7 more surfaces between 8.1-8.7). Hero animation must use generic project names, compare matrix must not leak operator domains, npm CLI must not vendor real `~/.claude/settings.json`, skills must not encode operator-specific paths, slash-commands must not reference real project names, docs/ extractions must not leak content the README sanitised away, integration tests must mock HOME so a misrun doesn't touch real `~/.claude/`. The pre-flip sanitisation grep in Phase 9 covers this, but each phase should run its own grep before commit so the audit gate isn't the only safety net.

## Notes for downstream workflows

- `/gsd-discuss-phase 1` should pull `cookbook/` recipe shortlist and confirm which 12 of the 15 candidates ship
- `/gsd-plan-phase 1` should produce 12 micro-plans (one per recipe), or 3 macro-plans (4 recipes each), depending on user preference
- `/gsd-plan-phase 8.1` through `/gsd-plan-phase 8.4` produced the four PLAN.md docs in `.planning/phases/P8.{1,2,3,4}-*/PLAN.md` — those phases are now complete
- `/gsd-plan-phase 8.5` through `/gsd-plan-phase 8.7` produce the three PLAN.md docs in `.planning/phases/P8.{5,6,7}-*/PLAN.md`; each PLAN.md must include explicit non-goals (cargo cult is the new top risk for P8.5 specifically)
- `/gsd-execute-phase` ordering: do the recipes the operator remembers most vividly first; energy is the bottleneck, not knowledge
- For the Wave-B set: prefer parallel execution (3 agents simultaneously) since the 3 phases are mutually independent at the directory level (`commands/`, `docs/`, `tests/`); cross-references happen only in README, which is the last touch — same pattern as Wave A
- Phase 7 must be flagged as user-driven in the discuss step — the agent cannot capture screenshots
- Phase 8.1 must be flagged as potentially user-driven (user may have aesthetic preferences for the animated visual that override the agent's first draft) — done
- Phase 9 must include a manual "are you sure?" gate before `gh repo edit --visibility public` AND before `npm publish`; both are irreversible. Phase 9 also runs `pnpm test:integration` (from Phase 8.7) one final time before the flip — a green suite is the last green light.
