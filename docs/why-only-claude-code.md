*Why this stack ships configs only for Claude Code, even though the upstream Everything Claude Code project supports Cursor, Codex, OpenCode, Gemini, and Antigravity.*

# Why only Claude Code

## The question that gets asked

Readers who came in from [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) often arrive with a fair question.

ECC supports six harnesses — Claude Code, Cursor, Codex, OpenCode, Gemini, Antigravity. So why does Solo Stack only ship `.claude/` configs? Why no `.cursor/`, no `.codex/`, no `.gemini/`?

The question isn't hostile. It's the natural next question after looking at the [comparison table](comparing-stacks.md) and noticing that the **Multi-harness** row is one of the dimensions where ECC has wider coverage than this repo.

The compare matrix gives the terse answer ("Claude Code only" vs ECC's six-harness coverage). It doesn't show the reasoning behind the scoping choice. This file fills that gap.

## The trade-off in one paragraph

Each additional harness multiplies the maintenance surface without proportionally multiplying the value, *for a solo operator's stack*.

ECC absorbs the multi-harness cost across 170+ contributors who collectively maintain it. A single-author curated stack like Solo Stack cannot absorb that cost without diluting the curation that is actually the value.

The honest framing: ECC is the catalogue across harnesses; Solo Stack is the curation layer over Claude Code specifically. Multi-harness in the curation layer would dilute the curation.

Why "solo operator" matters here is worth saying out loud. A community-maintained library distributes upkeep across many shoulders, so adding harnesses costs each maintainer a slice. A single-author stack centralises every slice on one person, so adding harnesses multiplies that person's load directly. The same architectural change costs ECC roughly 1/170 of a maintainer-month per harness; it would cost Solo Stack a full maintainer-month per harness. That asymmetry is the whole rationale.

## What the multi-harness path actually costs

Four costs land any time a single-author repo tries to ship across N harnesses.

**Maintenance cost.** Every cookbook recipe, every hook, every workflow, every CLAUDE.md becomes N variants. Solo Stack ships 12 recipes, 6 hooks, 5 workflows, and a project CLAUDE.md. With six harnesses that's 24 + 12 + 10 + 2 = 48 variant files instead of 8. Drift between variants is inevitable; one variant rots first; readers hit the rotten one and lose trust. The cookbook and hooks would degrade faster than the operator could keep them current alone.

**Surface area for review.** The pre-launch audit (Wave 4 in the v1.0 changelog) ran four parallel reviewers — security, attribution, link-rot, redaction — against a single-harness corpus. The verdict was WARN with ~24 MEDIUM findings. With six harnesses the same four reviewers would have run against six times the surface. Either the audit gets six times longer (not feasible in one focus session) or each pass goes shallower (defeats the point of the audit). The single-harness scope keeps audits tractable.

**Drift between harnesses.** Cursor's rules format, Codex's rules format, OpenCode's, Gemini's, Antigravity's all evolve independently of Claude Code's. A snapshot of all six is a maintenance bet against five independent rate-of-change vectors. Solo Stack's value depends on its content matching how the operator actually works. That match has to be re-verified every time any harness ships a config-format change. With one harness it's a tractable check; with six it becomes a quarterly chore that gets skipped, and skipped chores become drift.

**Reader confusion.** "Which directory do I copy?" becomes a navigation problem before the value problem. New readers spend their first attention budget on figuring out which subset of the repo applies to them, rather than on the workflows or the cookbook. Single-harness keeps the install path one path: clone, run `install.sh`, follow the README. No conditional reading.

A concrete example of how those four costs interact: when the OMEGA Memory → graphify reality-sync landed (commit `59c037d` in the v1.0 wave), the rename touched 7 READMEs, configs, profiles, skills, workflows, and credits. With six harnesses the same sync would have touched roughly 7 × 6 = 42 surfaces. The maintainer's budget for that sync was a single focus session. At 6× the surface, the sync would have either taken six sessions (during which the repo's claims would diverge from reality across the gap) or shipped partial (which is the same as drift). Single-harness made the reality-sync tractable.

## The contributor-friendly answer

The single-harness scope is a maintainer constraint, not a hostile stance toward other harnesses or their users.

**Forks are welcome.** The MIT license plus the explicit "copy what fits, drop what doesn't" stance in `Status` mean nothing prevents a contributor from forking and adding `.cursor/` or `.codex/` ports. If you want a Cursor-flavoured Solo Stack, fork and rename. The MIT license makes that frictionless.

**The fork is the right unit of work** for multi-harness coverage. A maintained fork lets the porter own the drift on their port without coupling that drift to mainline. Two ports of two recipes can diverge cleanly when each lives in its own repository; the same two ports inside one mainline produce coupling that's hard to unwind later.

**What does land in mainline:** documentation PRs that explain how to *adapt* a recipe or hook for another harness, kept inline alongside the Claude Code version. A short "On Cursor, the equivalent rule lives at X with format Y" block is maintainable and helpful. A duplicate `.cursor/rules/...` directory mirroring `.claude/rules/...` is not.

**What we won't merge into mainline:** parallel `.cursor/`, `.codex/`, `.gemini/`, `.antigravity/`, `.opencode/` directories that duplicate `.claude/` content. The repo stays single-harness.

The full scope statement lives in [`CONTRIBUTING.md`](../CONTRIBUTING.md). The fork-friendly stance there is explicit so contributors don't waste effort opening a multi-harness PR that gets declined.

## What this rationale is meant to do

The single-harness scope is a bandwidth-driven curation choice, written down so readers don't have to infer it from the absence of the other directories.

A few things worth being explicit about.

Cursor, Codex, OpenCode, Gemini, and Antigravity all work well for their respective users; the scoping choice here reflects maintainer bandwidth rather than a quality judgement about any other harness. ECC's multi-harness coverage is genuinely useful, which is why the [comparison table](comparing-stacks.md) recommends ECC for readers who want that depth. The compare matrix and this file agree: if multi-harness matters to you, install ECC alongside or instead of Solo Stack.

The "When this might change" section below is real, the threshold is reachable, and if a contributor crosses it the repo grows. This isn't an attempt to keep other harnesses out of the repo permanently — it's an attempt to be honest about what one maintainer can keep current.

## What to do if you use a non-Claude-Code harness

A short triage list, since this question lands often.

If you want the cookbook recipes' patterns but on Cursor or Codex, the recipes themselves are mostly framework-agnostic — Stripe Connect, WhatsApp Cloud API, Cloudflare Tunnel, Sentry, etc. don't care which harness you run. Read the recipe; the implementation is portable.

If you want the *harness-specific* parts — `.claude/hooks/`, `CLAUDE.md`, the rules format — those are Claude Code-specific by design. The closest equivalents in other harnesses are documented by ECC.

If you want a Cursor-flavoured or Codex-flavoured version of Solo Stack itself (the workflows, the profiles, the curation), that's a fork's job. The MIT license makes the fork frictionless. Open an issue if you've started one and want it linked from this README.

If you want one harness with everything — Solo Stack content adapted across Cursor, Codex, OpenCode, Gemini, Antigravity, all maintained — the honest pointer is back to ECC's catalogue, not back here.

If you want to run *both* — Solo Stack on Claude Code for the workflow layer, plus another harness for editor-side completion or chat — that combination already works. Solo Stack's `~/.claude/` install path doesn't conflict with `.cursor/` or `.codex/` or any other harness's directory. The two installs sit side by side; nothing in `install.sh` or `packages/cli/` writes outside `~/.claude/` and the configured Brain vault path. Operators running Cursor for in-editor work and Claude Code for cookbook recipes is a real combination this stack supports today.

If you want the *workflow* content (parallel projects, obsidian-as-context, content pipeline, solo ops) translated into harness-neutral instructions, those workflows in `workflows/` are mostly harness-agnostic prose anyway — the parts that name Claude Code are usually about the slash command surface or the `~/Brain/` integration, both of which read fine from any other harness's chat window with light substitution.

## How this fits the v1.0 doubling-down framing

The single-harness scope is the same posture as the v1.0 wave's content choices, applied at a different layer.

The v1.0 wave doubled down on what makes Solo Stack non-overlapping with ECC — the operator playbook, the cookbook of 12 recipes pulled from real shipped products, the four anonymised case studies, the six original solo-founder skills. ECC's catalogue covers a different surface (182 skills, 48 agents, six harnesses); Solo Stack's value is the curation layer on top of one harness, not a thinner version of ECC's catalogue spread across all six.

Adding multi-harness coverage to Solo Stack would either replicate work ECC already does well, or take maintainer time away from the curation layer that Solo Stack does well. Both moves dilute the value. The v1.0 wave answered that question one way (don't compete with ECC on catalogue size); this file answers it the same way (don't compete with ECC on harness coverage). The two answers are coherent because they reflect the same underlying scope discipline.

[v1-changelog-deep-dive.md](v1-changelog-deep-dive.md) covers the v1.0 doubling-down wave in narrative form for readers who want the full story behind that posture.

## When this might change

The threshold is straightforward.

If a single second harness reaches feature parity with Claude Code *and* a contributor commits to maintaining the port long-term as part of mainline, the repo could grow a sibling layer. That commitment would mean owning the variant cookbook recipes, the variant hooks, the variant CLAUDE.md, and the audit overhead for that harness's slice — across the lifetime of the repo, not as a one-time port.

No such commitment exists today. Until it does, the maintainer would prefer to refer multi-harness readers to ECC — which already covers six harnesses, with the contributor base to maintain that coverage — than to dilute Solo Stack by attempting it alone.

If a contributor reading this thinks they could be that maintainer for a specific harness, the right first step is to open an issue describing the proposed scope and the maintenance commitment, before the port itself. A scoped commitment up front is cheaper for both sides than a finished PR that gets declined for scope reasons.

This is a curated stack, not a portability project. The curation is the value.

For the audience-fit comparison this rationale supports, see [comparing-stacks.md](comparing-stacks.md). For the contribution scope statement that codifies the mainline/fork split, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).
