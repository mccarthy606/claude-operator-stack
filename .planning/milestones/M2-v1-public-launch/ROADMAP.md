---
milestone: M2 — v1.0 Public Launch
project: claude-operator-stack
status: active
created: 2026-05-04
target: launch-quality public artefact with organic-traction shape
---

# Roadmap: claude-operator-stack — v1.0 Public Launch

## Overview

Ten phases that take the v0.2 minimum-viable repo to a launch-quality v1.0. The shape: depth before flip. First add the operator-grade content that earns the launch (cookbook, hooks, skill index, scaffolds, profiles), then add credibility artefacts (screenshots, asciinema), then do the one-shot public flip with launch surfaces. Every phase is atomically shippable inside a 2-8h focus session and, except where noted, can be merged to `main` without depending on later phases. The final two phases (credibility capture + launch) are the only ones that gate the visibility flip.

**Ordering principle — "revenue of attention":** the audience that lands on this repo within the first 72h after launch will skim three things — the README hero, the case studies, and one randomly-chosen artefact. The cookbook (Phase 1) and the hooks (Phase 2) are the highest-probability "random artefact" pulls because they are copy-pasteable and don't require buying into the whole stack. They get built first. Skill index (Phase 3) anchors the credibility-of-curation claim. Scaffolds (Phase 4) and profiles (Phase 5) deepen self-identification but are heavier; they come after the lighter wins. Screenshots (Phase 7) require the user's manual capture and asciinema setup so they sit just before launch. Launch (Phase 9) is the irreversible action and goes last.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (e.g. 4.1): Reserved for urgent insertions discovered mid-milestone

- [ ] **Phase 1: Cookbook of recipes** — 12 markdown how-tos from real shipped projects, indexed and cross-linked
- [ ] **Phase 2: Sanitized custom hooks** — 6 hooks copied from `~/.claude/hooks/`, scrubbed, with per-hook README
- [ ] **Phase 3: Skill index** — reference table mapping ECC skills to operator use-cases with call examples
- [ ] **Phase 4: Project scaffolds** — 2 boilerplate templates (Next.js+Supabase web app, FastAPI+Docker WhatsApp service) with pre-configured CLAUDE.md
- [ ] **Phase 5: Operator profiles** — 4 stack variations (indie hacker, freelancer, agency owner, content creator) as opinionated install paths
- [ ] **Phase 6: Pre-launch audit pass** — broken-link check, attribution audit, sanitisation re-sweep, README front-page polish
- [ ] **Phase 7: Credibility capture (user-driven)** — 3 screenshots + 1 asciinema cast, embedded in README
- [ ] **Phase 8: Launch surfaces prep** — GitHub Topics, social preview image, About text, X-thread draft, Show HN draft, founder shortlist
- [ ] **Phase 9: Public flip + launch** — `gh repo edit --visibility public`, post X thread, submit Show HN, send founder DMs
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

### Phase 9: Public flip + launch
**Effort:** ~2h (the irreversible session)
**Depends on:** Phases 1-8 (all content shipped, all surfaces prepared, audit clean)
**Goal:** The one-shot public launch. Walk the pre-flip checklist, flip visibility, apply Topics + social preview + About, post the X thread, submit Show HN, send the founder DMs. Tag v1.0.0.

**Why:** Launch is intentionally one phase, intentionally late, intentionally minimal-thought. By the time this phase starts, every decision should be locked in; this phase is execution only. That keeps the irreversible action calm.

**Success criteria:**
1. Pre-flip checklist (from Phase 8) walked top to bottom; every item ticked
2. `gh repo edit mccarthy606/claude-operator-stack --visibility public` executed successfully
3. Topics, social preview, About text applied via gh CLI
4. v1.0.0 tag created and pushed; GitHub release published with curated changelog
5. X thread posted; URL recorded in `.planning/launch/launch-log.md`
6. Show HN submitted; URL recorded
7. Founder DMs sent (5-10); recipient list + send timestamps recorded
8. README badges updated to reflect public state if any were placeholder
9. Repo is reachable at `https://github.com/mccarthy606/claude-operator-stack` from a logged-out browser

**Risks:**
- **A late-discovered sanitisation issue blocks the flip mid-phase.** Mitigation: the pre-flip checklist runs the sanitisation grep one final time; if it fails, abort the flip and return to Phase 6. Better to delay than to flip dirty.
- **gh CLI auth lapses or repo permissions are wrong at flip-time.** Mitigation: the pre-flip checklist includes `gh auth status` and `gh repo view --json viewerPermission` checks.
- **Show HN or X thread under-performs and the founder shortlist is wasted.** Mitigation: this is acceptable. Launch outcome is shaped by content + surfaces, not by perfect timing. If first wave is small, Phase 10 covers iteration.

**Files to create/modify:**
- `.planning/launch/launch-log.md` (new — runtime log of what got posted where, when)
- `CHANGELOG.md` (modify: tag v1.0.0 entry with release notes)
- README badges (modify if any need update)
- GitHub repo metadata (Topics, social preview, About) — applied via gh CLI

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
5. `.planning/launch/launch-retro.md` written at hour 72 with: stars/forks/PRs/discussions counts, what worked, what didn't, what to change for v1.1
6. v1.0.1 patch tag if any hot-fixes warranted it
7. Issues opened by the audience are triaged into `good first issue` / `enhancement` / `wontfix` with labels

**Risks:**
- **Volume overwhelms one-person response.** Mitigation: prioritisation order — security > PRs > issues > X replies > Show HN comments. If volume is genuinely too high (a flood scenario), pin a "I'm reviewing all incoming, please give me 24h" notice.
- **A critical bug is reported in launch+24h.** Mitigation: hot-fix lane is open in this phase; that's the point. Address, ship v1.0.1, move on.
- **Retro is skipped because launch-fatigue.** Mitigation: retro is part of Phase 10's success criteria, not optional; even a 30-line retro counts.

**Files to create/modify:**
- `.planning/launch/launch-retro.md` (new — 72h retro)
- Hot-fix commits to wherever real issues land
- `CHANGELOG.md` (modify if v1.0.1 ships)

---

## Progress

**Execution order:** Phase 1 → 2 (parallelisable with 1; can swap) → 3 → 4 (depends on 1,2) → 5 (depends on 1-4) → 6 (audit) → 7 (user-driven capture) → 8 (launch prep) → 9 (flip) → 10 (response)

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
| 9. Public flip + launch | 2h | 1-8 | Not started | - |
| 10. Launch+72h response | 2-4h | 9 | Not started | - |

**Total effort estimate:** ~30-41h of focused work, 8-12 focus sessions, 2-3 calendar weeks at typical solo-founder cadence.

## Notes for downstream workflows

- `/gsd-discuss-phase 1` should pull `cookbook/` recipe shortlist and confirm which 12 of the 15 candidates ship
- `/gsd-plan-phase 1` should produce 12 micro-plans (one per recipe), or 3 macro-plans (4 recipes each), depending on user preference
- `/gsd-execute-phase` ordering: do the recipes the operator remembers most vividly first; energy is the bottleneck, not knowledge
- Phase 7 must be flagged as user-driven in the discuss step — the agent cannot capture screenshots
- Phase 9 must include a manual "are you sure?" gate before `gh repo edit --visibility public`
