---
name: multi-project-context-bridge
description: Bridge OMEGA-tagged decisions from a source project into the current project's session, applying the operator's anonymisation rules so cross-project lookups stop feeling siloed without leaking real names, URLs, or keys across product boundaries.
origin: claude-operator-stack
---

# Multi-Project Context Bridge

The operator runs 7 projects in parallel. Each session is loaded in one project's context window only — that is the discipline from `workflows/parallel-projects.md` Habit 3 (no two projects deploy in the same session). The unintended cost is a "where was I on project A?" tax when the operator references a decision from another project mid-session. OMEGA tagging closes the gap, but only if the bridge is honest: tagged decisions cross over, real names and URLs do not. This skill is the bridge.

## When to Use

- The operator is in project A's directory and references a decision from project B ("what did we decide about Stripe Connect on the marketplace?", "the equivalent for the legal tool was…").
- The operator says "bridge context from <project>" or "pull decisions from <project>" while working in a different project's session.
- The operator is at the start of a session after switching focus between the 2-of-N picks from the Monday review and wants the prior project's last decisions surfaced as background.
- The operator is writing a case study or post-mortem and wants the cross-project decisions made over the last quarter, anonymised, as raw material.
- ECC has `context-budget` (token budgeting) and `strategic-compact` (compaction). Both operate **inside** one session and do not bridge across OMEGA-tagged projects with anonymisation; use this one for cross-project lookups.

## Inputs

- The source project name. The OMEGA tag the operator has used to scope decisions. If the operator does not name it, derive candidates from `~/Brain/Projects/*.md` and ask before querying.
- The target project. Default: the basename of the current working directory (`pwd | xargs basename`). Honour any override.
- The anonymisation level. Default `strict` — full alias map per `case-studies/niche-booking-trio.md` (project name → `Project-A`, partner names → `Counterparty-N`, URLs stripped, keys stripped). Honour `loose` if the user passes it (URLs and keys still stripped, but project names and partner names retained). Never default to `loose` — strict is the safe stance.
- Optional decision-tag filter. If the operator wants only architectural decisions, only product decisions, or only ops decisions, pass the OMEGA tag class as a filter. Defaults to all decision-class tags.
- Optional time window. Default last 30 days. Honour wider windows when the operator is preparing a quarterly post-mortem; honour narrower windows when the operator only wants the last week's bridge.
- The operator's question or current decision. If the session has a clear pending question ("what should we use for payments here?"), pass it in so the bridge can rank by relevance, not just recency. If no question is provided, fall back to recency-only ranking and note that in the meta-summary.
- An optional list of known-real identifiers to anonymise — same shape as `case-study-anonymiser` consumes. If a `.anonymisation-map.local` file exists at the repo root (gitignored), read it. The bridge inherits the operator's existing alias scheme rather than inventing a parallel one.

## How It Works

1. Confirm source and target.
   - If the source is missing, list the operator's `~/Brain/Projects/*.md` filenames as candidates and ask.
   - If source equals target, stop and report — bridging within the same project is not a use case for this skill.
   - If the target project does not have an Obsidian note yet, surface that fact but proceed; OMEGA tags can exist without a corresponding project note.
2. Query OMEGA for decisions tagged with the source project name. Use the operator's existing OMEGA query convention (see `stack/omega-memory.md`). Constrain by the optional time window and optional decision-tag class.
3. Apply the anonymisation pass. For each decision, replace the project name with the agreed alias (`Project-A` for the source, `Project-B` for the target if cross-references appear). Strip absolute URLs containing the operator's known domains. Strip API key patterns (`sk-…`, `pk_…`, etc.). Replace counterparty names with `Counterparty-N` using a stable map within this response (the same real → alias mapping applies to every decision in the bridge).
4. Rank by recency and relevance. Recency is the OMEGA-stored timestamp; relevance is keyword overlap with the operator's current question (passed in or inferred from the recent session turn). Cap the bridge at 5 decisions by default — the bridge is a context primer, not a dump. Honour an explicit `--limit N` if the operator wants more.
5. Render each decision as `**[YYYY-MM-DD]** <anonymised decision text> _(from <Project-A>)_`. Preserve the decision's structure (rationale, alternative considered, what got picked) but strip identifying details. If a decision was made jointly with a counterparty, surface the counterparty as `Counterparty-N` rather than dropping the context entirely.
6. Append a one-line meta-summary: "Bridged N decisions from <Project-A> to <Project-B>, time window <X>, anonymisation level <strict/loose>."
7. Offer one optional follow-up: store the bridge as a cross-project reference under the target project's OMEGA tags. Read-only by default; require explicit confirmation. Do not auto-store — the operator decides whether the bridge is worth persisting against the target project's namespace.
8. If the OMEGA query returns zero results, do not pad the bridge with hallucinated history. Return a single line: "No tagged decisions in <Project-A> within the last <window>. Either the tag is wrong or the project does not have decisions logged in this window — confirm before assuming context is missing." Then stop.
9. If the bridged decisions reference each other (decision X cites decision Y from the same project), preserve the citation with both anonymised aliases. Internal references inside one project survive the bridge; external references that escape to a third project are stripped because that is a separate bridge invocation.
10. Track which alias was assigned to which real identifier in this response so the meta-summary can confirm the mapping was stable end-to-end. Do not surface the real identifiers in the output, but do confirm "alias map applied consistently to N decisions" so the operator knows the discipline ran.

## Output shape

```markdown
## Bridged decisions — Project-A → Project-B

- **[2026-04-22]** Picked Stripe Connect Standard over Express for marketplace because the operator already had Stripe Atlas; saved 2 weeks of compliance setup. _(from Project-A)_
- **[2026-04-15]** Chose Telegram bot for v0 lead capture before promoting to Supabase; instant operator notification was worth more than persistence in week 1. _(from Project-A)_
- **[2026-04-08]** Rejected Webflow because of code-level control needed for SEO-shaped page generation. _(from Project-A)_

Bridged 3 decisions from Project-A to Project-B · time window: last 30 days · anonymisation: strict.

Alias map applied consistently to 3 decisions (1 project alias, 2 counterparty aliases).
```

If the operator asked for `loose` anonymisation, the meta-summary surfaces that explicitly so the operator knows the bridge contains real names that should not flow into a public artefact without a second pass through `case-study-anonymiser`.

## Anti-patterns

- Do not skip the anonymisation pass even when the operator says "this stays internal". OMEGA contents leak across surfaces (logs, exports, future case studies); the bridge is one more place to enforce the discipline.
- Do not auto-store the bridge against the target project's OMEGA tags. The bridge is ephemeral context unless the operator explicitly persists it.
- Do not bridge decisions whose tags do not match the OMEGA decision-class. Random session memory or incidental notes are noise; the bridge is for tagged, intentional decisions.
- Do not return more than 5 decisions by default. A 30-decision dump is not a bridge, it is a backlog import — and the operator stops reading after the third bullet anyway.
- Do not invent decisions that "probably" were made. If OMEGA returns nothing, the bridge is empty and that is the answer; padding the output with hallucinated history is a worse failure than an empty result.
- Do not bridge in both directions in one invocation. Bridging from Project-A → Project-B and Project-B → Project-A in one response collapses the two namespaces and the alias map stops being stable. One direction per call.
- Do not interpret the bridged decisions for the target project. Surfacing `Project-A` decided X is enough; deciding whether the same answer applies to `Project-B` is the operator's call, not the skill's.
- Do not paste the bridge into a public artefact without running it through `case-study-anonymiser` first when in `loose` mode. The bridge is internal context by default; publishing requires the second pass.

## Related

- [`workflows/parallel-projects.md`](../../workflows/parallel-projects.md) — Habit 3 + the "What about context windows?" section establish OMEGA tagging as the cross-session bridge mechanism.
- [`stack/omega-memory.md`](../../stack/omega-memory.md) — the OMEGA convention for storing and querying tagged decisions this skill consumes.
- [`case-studies/niche-booking-trio.md`](../../case-studies/niche-booking-trio.md) — the live `Discipline A/B/C` aliasing pattern this skill mirrors for anonymisation.
- [`skills/case-study-anonymiser`](../case-study-anonymiser/SKILL.md) — the standalone anonymisation skill; this one is the cross-project specialisation.
- [`skills/weekly-monday-review`](../weekly-monday-review/SKILL.md) — Monday review picks the 2-of-N focus projects; the bridge runs at the start of each focused session against the prior week's other focus.
- [`stack/obsidian-brain.md`](../../stack/obsidian-brain.md) — project notes are the canonical place to look up the source project name when the operator is unsure which OMEGA tag is in play.
- ECC `context-budget` and `strategic-compact` — disambiguated above; neither bridges across OMEGA-tagged projects.
