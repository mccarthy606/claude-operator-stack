*Companion to [CHANGELOG.md](../CHANGELOG.md). The terse list of changes lives there; this is the story behind them.*

# v1 changelog deep-dive

CHANGELOG.md tells you what shipped on which date. This file tells you why each block landed in the order it did, and what each one was trying to fix in the surface the previous block left behind.

If you arrived from the changelog wanting the reasoning, this is that. If you want the dated bullets, go back to CHANGELOG.md — it stays the canonical source. The split is intentional. CHANGELOG.md is the contract for "what changed when"; this file is the operator's notebook for "why each change was the right next step."

## v0.1 — what shipped on day zero

The initial public release in May 2026 was deliberately small.

README.md, install.sh, six component breakdowns under `stack/`, five workflows, four anonymised case studies, sanitised `configs/` examples, the credits chain, and a handful of governance files (CONTRIBUTING.md, SECURITY.md, the repo's own CLAUDE.md, an MIT LICENSE, and .gitignore). The README came in around 200 lines. Nothing else was shipped that day.

The surface was small for two reasons.

First, I wanted to commit to a public surface I could actually maintain alone. A curated stack stops being curated the moment its maintainer runs out of time to vet what's in it. Shipping with 12 cookbook recipes on day one would have meant 12 recipes I'd later have to keep current as upstream libraries versioned forward, and I didn't want to start that maintenance treadmill until the rest of the surface was stable.

Second, the install path needed to be reviewable by a stranger in one sitting before they ran it on their machine. A 200-line README, a `--dry-run` flag on `install.sh`, and a sidecar-only file model made that review feasible. If the install script had been 600 lines or had touched files in `~/.claude/` without first writing siblings, no reasonable reader would have run it without auditing every line — and the friction of that audit would have killed adoption before the workflows mattered.

The single most important design decision shipped on day zero was sidecar configs.

`install.sh` never overwrites `~/.claude/settings.json` or any other existing config. It writes `*.from-operator-stack` siblings next to whatever the user already has. That choice locked in a property the rest of the repo has had to keep: the operator stack is something you copy *from*, never something that silently mutates state on your machine. Every cookbook recipe, every hook, every scaffold downstream of v0.1 inherits that constraint. Phase 8.3's npm CLI inherits it too — different ergonomics, same target files, same sidecar safety.

A third constraint shipped on day zero, less visible but equally load-bearing: attribution discipline. Every component the stack uses had its original author credited in `credits/README.md` from commit one, with the rule baked into the repo's own `CLAUDE.md` that any new component must land with its credits in the same PR rather than as a follow-up. That rule has held through every subsequent wave. The credits file has grown by an entry every time a recipe pulled in a library; no follow-up commits have been needed to backfill missing attribution.

0.1 was the smallest credible launch surface. Everything after is depth.

## v0.2 — the visual identity wave

The next release landed the day after the initial commit.

It wasn't content depth — that was queued for the v1.0 wave. It was visual identity. A hero banner (`assets/hero.svg`), Mermaid diagrams for stack overview and workflow loops, a 7-language navigation strip in every README, a full Russian translation, a full Spanish translation, and stub READMEs in Portuguese (BR), Turkish, Chinese, and Japanese.

Visual identity landing before depth was a sequencing decision.

Translators needed a stable surface to target. If the README kept reshuffling its sections every week, every translation would be stale within days of merge. By freezing the high-level shape and the section order in v0.2, the four stub-language READMEs and the two full translations could ship against a known target. The four stubs were tracked as `good first issue`s in GitHub so contributors could pick up the full bodies later, which is where they still live as of v1.0.

The choice to ship stubs rather than block on full translations was also deliberate. Waiting until all seven languages had complete translations would have meant either a) writing them myself in languages I don't speak well enough, or b) holding the public release until contributors arrived — and contributors don't arrive on a private repo. Stubs that link back to the English source plus a `good first issue` flag are a working compromise: each stub language has a real entry point, the language nav is functional, and the maintainer's bar for accepting a translation PR stays high without blocking the release.

The other constraint that landed in v0.2 was the AI-slop pattern strip.

Commit `faf18a4` swept the entire markdown corpus and removed the patterns that signal LLM-generated marketing copy: "imagine if", "unlock", "leverage", "in today's fast-paced", "revolutionize". That sweep set the voice baseline every subsequent commit had to match. Once that baseline existed, the v1.0 content waves could ship more aggressively without diluting tone — every recipe, every profile, every scaffold README went through the same strip before it landed in main.

The strip was a one-time pass against the existing corpus, but the patterns it encoded became reviewer ammunition. Every PR since v0.2 that drifted toward those patterns got flagged in review. The list of banned phrases sits in the repo's `CLAUDE.md` as a directive, so any subsequent contributor (human or assistant) inherits the constraint by default rather than having to be told about it after the fact.

## Waves 1-3 — cookbook, scaffolds, profiles

The v1.0 content additions shipped in three waves between commits `ba737cf` and `cbf44b4`.

Each wave was atomically committable. Main never broke between waves. The test for "shippable" was simply whether the README's existing section order still made sense after the wave landed.

### Wave 1 — cookbook + hooks + skill index

Wave 1 was the cookbook, the configs/hooks bundle, and `stack/ecc-skill-index.md`. Twelve recipes, each capped at 200 lines, each pulled from a real shipped product rather than a hypothetical demo.

The shape that emerged from writing the first three recipes became the template for the other nine: problem statement up top, solution sketch, the actual code, pitfalls section at the bottom, references to the upstream library docs. The 200-line cap was chosen because anything longer turned into a tutorial; anything shorter lost the pitfalls that made the recipe useful. The cap also made the cookbook scannable as a set — twelve recipes at 200 lines each is 2,400 lines of operator-tested material, but the cap means a reader can skim recipe titles, pick one, and read it end-to-end in 5 minutes.

Six hooks shipped alongside, each with a per-hook README in `configs/hooks/`. The hooks cover statusline rendering, prompt-injection guarding, read-before-edit enforcement, commit message validation, read-injection scanning, and context-window monitoring.

The skill index was a navigation reference into the 30 ECC skills I actually use day-to-day plus 36 occasional-use ones, sorted by use case rather than alphabetically — the alphabetical sort was already in ECC's own skill catalogue, so duplicating it would have added no information. Sorting by use case (building, marketing, research, GSD, solo ops, security, memory) gave readers a different way to find what they needed.

Wave 1 ran as parallel opus-4.7 1M-context subagents. Three subagents working in parallel on separate recipe groups, each opening its own commit, with the wave-level commit `ba737cf` capturing the integrated result. That parallelism is why the wave landed in one focus session rather than three.

### Wave 2 — scaffolds

Wave 2 was the scaffolds. Two of them.

`web-saas/` ships 24 files: Next.js 15 + Supabase + Sentry + GA4 with a real lead form and a real `/api/lead` route. `whatsapp-saas/` ships 18 files: FastAPI + Docker + Meta Cloud API + Anthropic SDK with HMAC verification, a Claude classifier, and a happy-path pytest.

The choice to ship two and not five was deliberate. Two was enough to demonstrate the shape — a runnable directory you clone, fill in `.env`, ship — and five would have meant five surfaces to keep updated as upstream dependencies versioned forward. Each scaffold ships with a `CLAUDE.md` block tuned for its stack, with placeholder visual-direction fields marked deliberately rather than left as fake-looking defaults. The placeholders read as placeholders, which is the honest signal that the operator should fill them in rather than the dishonest signal of a default that pretends to be a finished design.

### Wave 3 — operator profiles

Wave 3 was the operator profiles — four archetypes (indie hacker, non-technical founder, freelancer/agency, content creator + operator).

Each profile is an install path: which 6 cookbook recipes to read first, which 2-4 hooks to wire, which scaffold to clone, which workflow read order to follow, and explicitly what to skip. The profiles exist because the cookbook + scaffolds + workflow set is large enough that "where do I start" became the most common reader question after `install.sh`. Profiles answer it with a triage table.

Each wave was atomically shippable. Main never broke. The README's existing section order accommodated the new directories with one-paragraph summaries plus a "see [path]" link.

## Wave 5 — pre-launch audit + screenshots

Wave 4 was the pre-launch audit. Verdict was WARN — meaning shippable but with HIGH findings to address.

Zero CRITICAL: no secrets in the repo, no broken external links, no real product names leaked through the case-study anonymisation. The HIGH findings were security-hardening items in cookbook recipes (a Stripe webhook example that didn't validate the signature header tightly enough, a Supabase recipe that suggested service-role keys in environments where anon-key would suffice, and similar). All of them landed in the fix-wave commits `368abb2` and `24d5eb7` before launch material went out.

The audit ran four parallel reviewers against different slices of the repo: a security-focused pass against `configs/`, `install.sh`, and the recipes; an attribution pass against `credits/` and every `origin:` frontmatter; a link-rot pass against every external URL; and a redaction pass against the four case studies. Running the four passes in parallel meant the audit took one focus session rather than four, and the four findings sets were disjoint enough that the fix-wave commits could close them without the fixes colliding.

Wave 5 was visible artefacts: SVG screenshots, launch surfaces, and the final audit-fix pass.

Three screenshots shipped — `install-dryrun.svg`, `obsidian-vault.svg`, `claude-reads-note.svg` — embedded in the README under Quick Start and Workflow #3.

The choice of SVG over PNG capture was deliberate. PNG screenshots taken from a real terminal would have shown my actual machine's username, project paths, and visible lock-screen artefacts. Sanitising those in post is brittle, and any subsequent re-capture would re-leak them. SVG screenshots are deterministic, version-controlled, and small enough to render inline without bloating the repo. They also re-render cleanly across light and dark GitHub themes without re-export.

The fix-wave commits closed every CRITICAL and HIGH finding from the audit, plus a follow-up pass for MEDIUM and LOW. By the end of Wave 5 the repo's public surface was clean enough to flip to public visibility, even though the actual flip was deferred to Phase 9 to coordinate with content launch.

## v1.0 — the doubling-down wave

The honest gap analysis after the fix-waves shipped: the repo was technically clean but visually and economically light compared to where Everything Claude Code already was.

ECC had 182 skills, 48 agents, and a multi-harness install path. Solo Stack had 12 cookbook recipes, 4 case studies, and a single-harness install. On the comparison surface, Solo Stack looked smaller. The honest fix wasn't to add 170 more skills — that would dilute the curation that was Solo Stack's actual value. The honest fix was to double down on the parts of Solo Stack that ECC didn't cover.

The v1.0 doubling-down wave landed as four 8.x phases. Each phase was non-overlapping with ECC's catalogue, and each was shippable in one focus session.

The shipping-in-one-focus-session constraint mattered. Phases that don't fit one session tend to land in pieces, with main breaking between pieces or with an embarrassing in-flight commit visible in the public history. By scoping each 8.x phase to fit one session, the wave avoided that failure mode — every phase commit on main was a coherent end-state.

### Phase 8.1 — animated hero

Phase 8.1 replaced the static SVG hero with an animated one.

The animation uses compositor-friendly properties only (transform and opacity, no width/height/top/left), so it stays smooth on low-end devices and respects `prefers-reduced-motion`. The static hero stayed as the fallback frame the animation resolves to, so readers with motion preferences disabled or with browsers that don't render the animation still see the same finished image.

### Phase 8.2 — compare matrix

Phase 8.2 was the compare matrix — the table that this `docs/` directory now houses in `comparing-stacks.md`.

The matrix made the audience question explicit (Solo Stack vs ECC vs starter templates) and answered it with six dimensions rather than a marketing paragraph. The dimensions were chosen for what an actual reader would weigh: audience, tone, stack scope, multi-harness coverage, real shipped proof, and custom contributions. The framing paragraph above the table was equally important — it states that the table is a map, not a ranking, so readers who pick a different column don't read the table as adversarial.

### Phase 8.3 — npm CLI

Phase 8.3 was `packages/cli/` — an npm CLI sibling to `install.sh`.

Same target files, same sidecar safety, different ergonomics. The CLI gives the operator a wizard prompt for marketplace selection and prints the manual `/plugin` commands to run inside Claude Code afterwards. Pinned at `0.1.0` until the public visibility flip in Phase 9, at which point the npm publish ships coordinated with the launch. Pinning the version until the publish landed mattered because an unpinned package would have been claimable by anyone observing the repo, and a name-squat on `claude-operator-stack` would have been disruptive to recover from.

### Phase 8.4 — six original SKILL.md packages

Phase 8.4 was the six original `SKILL.md` packages. Each targets a solo-founder use-case ECC's 182-skill catalogue doesn't cover.

`solo-billing-monitor` does cost rollup across cloud and AI APIs. `multi-project-context-bridge` bridges cross-project decisions via graphify queries with anonymisation built in. `obsidian-sync-helper` verifies Brain notes against git state. `case-study-anonymiser` applies the redaction playbook to a draft case study. `weekly-monday-review` runs the Monday review loop down to a 2-of-N focus pick. `ship-day-planner` takes a one-line idea and produces 8 ship-day blocks.

Each carries `origin: claude-operator-stack` in its frontmatter so the attribution stays correct when these end up sitting next to ECC's skills under `~/.claude/skills/`. ECC's skills carry their own `origin:` strings; mixing the two surfaces under the same install path requires both to be honest about who shipped them.

The wave landed as commit `d7eb84b`. The closing message in that commit was simply that this was about doubling down on what makes Solo Stack non-overlapping with ECC, rather than competing with it on catalogue size.

## Reality-syncs — OMEGA → graphify, 4-core/2-opt-in

Two reality-syncs landed during the v1.0 wave because the operator's actual stack diverged from what the repo was claiming.

### Sync 1 — OMEGA Memory to graphify

The first was OMEGA Memory to graphify (commit `59c037d`).

The repo had been documenting OMEGA Memory as the knowledge-graph layer in the stack since v0.1. By the time v1.0's later phases were landing, my actual setup had moved to graphify — a different knowledge-graph approach with a `/graphify` slash command, a dedicated `~/Brain/Graphify/` directory in the vault structure, and a different querying surface.

Sync 1 renamed `stack/omega-memory.md` to `stack/graphify.md` and rewrote every reference across 7 READMEs, configs, profiles, skills, workflows, and credits. The rename was painful because OMEGA had been part of the public framing since launch, but shipping a stack that didn't match what the operator actually used was worse — readers would install OMEGA, find the workflows didn't match their behaviour, and lose trust in the rest of the repo by association.

### Sync 2 — 4 core + 2 opt-in

The second sync (commit `c883ddf`) reframed the stack as 4 core components plus 2 opt-in extensions, instead of treating all 6 as equivalent.

The 4 core are Claude Code, Obsidian, graphify, and Frontend-Design — the components that run every day and that the workflows depend on. The 2 opt-in are Everything Claude Code and Toprank — components that are powerful when they fit but optional for many readers.

The flat-6 framing had been carrying an implicit claim that all six were equally necessary. The honest framing isn't. Reframing earned more trust than the flat one because readers who didn't need ECC or Toprank stopped feeling like the install path was over-prescribed.

Reality-syncs are mandatory, not optional. If the repo's claims drift from what the operator actually runs, the credibility of the entire stack erodes one missed sync at a time.

## Governance — CoC + CONTRIBUTING expansion

Two governance documents landed on 2026-05-05, the same day this deep-dive is being written.

### Contributor Covenant 2.1

Contributor Covenant 2.1 was added (commit `e78cea4`).

The choice of 2.1 over 1.4 or 2.0 was simply that 2.1 is the current version and adds the enforcement-ladder language that the older versions lacked. The CoC sits in repo root as `CODE_OF_CONDUCT.md`, referenced from CONTRIBUTING and from the GitHub community profile.

### CONTRIBUTING.md expansion

Same day, CONTRIBUTING.md expanded from 48 lines to roughly 165 (commit `59f0c65`).

The expansion clarifies scope (what kinds of PR get accepted, what gets deferred, what gets declined politely), attribution discipline (every new component goes in `credits/README.md` in the same PR, not a follow-up), and the difference between contributor work that lands in mainline versus contributor work that's better as a fork.

The fork-friendly stance is explicit because some contributions — multi-harness ports of `configs/`, alternative scaffold stacks — are better as forks than as PRs back to a curated single-author stack. CONTRIBUTING.md says that out loud now, with a cross-reference to [why-only-claude-code.md](why-only-claude-code.md) for the multi-harness rationale specifically.

Both governance documents landed *before* the public visibility flip in Phase 9, not after. The contribution rules need to exist before the inbox opens, not bolted on afterwards once the first awkward PR has already arrived.

The expansion also included a private-vulnerability disclosure flow that defers to `SECURITY.md` rather than relying on public issues for security reports. That flow existed since v0.1, but the expanded CONTRIBUTING makes the routing explicit so a security-conscious contributor sees the right path on first read rather than having to dig.

## What carries through

A few constraints survived from v0.1 to v1.0 without compromise, and naming them helps explain why each subsequent wave looked the way it did.

Sidecar-only file writes from `install.sh` (and now `packages/cli/`). No silent overwrites of user state. Every install path stays auditable in `--dry-run` before it touches the disk.

Attribution at commit time, not as a follow-up. Every component, every recipe library, every scaffold dependency landed in `credits/README.md` in the same commit that introduced it. The credits chain stayed clean across 19 commits.

Voice baseline from the AI-slop strip. The patterns that commit `faf18a4` removed never came back, because they sit in the repo's `CLAUDE.md` as a reviewer directive rather than as tribal knowledge.

Reality-syncs as mandatory drift-correction. The OMEGA → graphify rename and the 4-core/2-opt-in reframe both landed because the repo's claims had drifted from the operator's actual stack, and a curated stack with drift is a stack that has stopped being curated.

These four are the constraints any future wave inherits. v1.1 onwards either keeps them or breaks them visibly — there is no quiet middle.

---

What's next: Phase 9 is the public visibility flip — coordinated launch material, the npm publish, and the README integration pass that pulls the long extractions in this `docs/` directory into the README's summary blocks. Phase 10 is the launch + 72h response window — the period where issues, PRs, and questions land in the inbox and the maintainer's job is to respond fast enough that early contributors stay engaged.

CHANGELOG.md tracks both phases as they ship; this file picks up again when v1.1 lands.
