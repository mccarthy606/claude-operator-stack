---
name: multi-project-context-bridge
description: Bridge concepts and decisions across the operator's multi-project Brain corpus by traversing the graphify knowledge graph, applying the operator's anonymisation rules so cross-project lookups stop feeling siloed without leaking real names, URLs, or keys across product boundaries.
origin: claude-operator-stack
---

# Multi-Project Context Bridge

The operator runs 7 projects in parallel. Each session is loaded in one project's context window only — that is the discipline from `workflows/parallel-projects.md` Habit 3 (no two projects deploy in the same session). The unintended cost is a "where was I on project A?" tax when the operator references a decision from another project mid-session. graphify closes the gap by treating the entire `~/Brain/` corpus as a single knowledge graph: project notes, decisions, daily logs, and code all become nodes, and the bridge is a graph traversal — but only if the bridge is honest. Found references cross over, real names and URLs do not. This skill is the bridge.

## When to Use

- The operator is in project A's directory and references a concept from project B ("what did we decide about Stripe Connect on the marketplace?", "the equivalent for the legal tool was…").
- The operator says "bridge context from <project>" or "pull decisions from <project>" while working in a different project's session.
- The operator is at the start of a session after switching focus between the 2-of-N picks from the Monday review and wants the prior project's last decisions surfaced as background.
- The operator is writing a case study or post-mortem and wants the cross-project decisions made over the last quarter, anonymised, as raw material.
- ECC has `context-budget` (token budgeting) and `strategic-compact` (compaction). Both operate **inside** one session; this skill operates **across** the multi-project graph and adds the anonymisation pass on top. Note: this skill is graph-traversal-based — it walks the graphify knowledge graph to find cross-project context. Earlier versions of this stack used a typed-tag memory layer with key/value queries against tagged decisions; that paradigm has been replaced. This skill does not assume any tag taxonomy and does not call any typed-memory query API.

## Inputs

- The source project name. The label that appears on graph nodes belonging to that project (typically the basename of `~/Brain/Projects/<project>.md` plus all nodes whose `source_file` traces back to that project's directory or repo). If the operator does not name it, derive candidates from `~/Brain/Projects/*.md` and ask before querying.
- The target project. Default: the basename of the current working directory (`pwd | xargs basename`). Honour any override.
- The anonymisation level. Default `strict` — full alias map per `case-studies/niche-booking-trio.md` (project name → `Project-A`, partner names → `Counterparty-N`, URLs stripped, keys stripped). Honour `loose` if the user passes it (URLs and keys still stripped, but project names and partner names retained). Never default to `loose` — strict is the safe stance.
- Optional concept filter. The operator's question or topic. Drives which graph traversal to run: a specific question ("what did we pick for payments?") becomes a `/graphify query` against the source project's subgraph; a two-concept bridge ("how does the marketplace's billing relate to the legal tool's onboarding?") becomes a `/graphify path` between the two named concepts.
- Optional time window. Default last 30 days, evaluated against the `captured_at` or file mtime of each node. Honour wider windows when the operator is preparing a quarterly post-mortem; honour narrower when the operator only wants the last week's bridge.
- An optional list of known-real identifiers to anonymise — same shape as `case-study-anonymiser` consumes. If a `.anonymisation-map.local` file exists at the repo root (gitignored), read it. The bridge inherits the operator's existing alias scheme rather than inventing a parallel one.

## How It Works

1. Confirm source and target.
   - If the source is missing, list the operator's `~/Brain/Projects/*.md` filenames as candidates and ask.
   - If source equals target, stop and report — bridging within the same project is not a use case for this skill.
   - If the target project does not have an Obsidian note yet, surface that fact but proceed; the graph can hold project nodes that pre-date a note.
2. Pick the traversal.
   - **Concept lookup** (operator's question is a single topic): run `/graphify query "<question>"` and constrain the result subgraph to nodes whose `source_file` traces to the source project. BFS by default — the operator wants broad context.
   - **Two-concept bridge** (operator names a source-project decision and a target-project decision): run `/graphify path "<source-concept>" "<target-concept>"`. The shortest path through the graph is the bridge; community boundary crossings on the path are the load-bearing hops.
   - **Recency dump** (operator wants "last week from project A"): query graph nodes filtered by `source_file` prefix and `captured_at` window, then rank by node degree (more connections = more load-bearing decision).
3. Apply the anonymisation pass. For each surfaced node and edge, replace the project name with the agreed alias (`Project-A` for the source, `Project-B` for the target if cross-references appear). Strip absolute URLs containing the operator's known domains. Strip API key patterns (`sk-…`, `pk_…`, etc.). Replace counterparty names with `Counterparty-N` using a stable map within this response (the same real → alias mapping applies to every node and edge in the bridge).
4. Rank by graph centrality and recency. Centrality is the node's degree within the source project's subgraph (god nodes from `GRAPH_REPORT.md` rank high); recency is the `captured_at` timestamp. Cap the bridge at 5 items by default — the bridge is a context primer, not a dump. Honour an explicit `--limit N` if the operator wants more.
5. Render each item as `**[YYYY-MM-DD]** <anonymised content> _(from <Project-A>)_`. For path traversals, render the full hop sequence with anonymised edge relations. For query traversals, render the top-ranked nodes with their anonymised one-line summary. If a node was made jointly with a counterparty, surface the counterparty as `Counterparty-N` rather than dropping the context entirely.
6. Append a one-line meta-summary: "Bridged N items from <Project-A> to <Project-B> via <traversal>, time window <X>, anonymisation level <strict/loose>."
7. Offer one optional follow-up: paste the bridged block into the target project's `~/Brain/Projects/<target>.md` Decisions section. Read-only by default; require explicit confirmation. Do not auto-write — the operator decides whether the bridge is worth persisting.
8. If the graph traversal returns zero matches, do not pad the bridge with hallucinated history. Return a single line: "No matching nodes in <Project-A>'s subgraph for <concept> within the last <window>. Either the concept name does not match any node label or the project's graph is stale — try `/graphify <project-path> --update` and retry, or confirm the concept is logged at all." Then stop.
9. If the bridged subgraph contains internal cross-references (node X links to node Y inside the same project), preserve them with both anonymised aliases. Internal references survive the bridge; references that escape to a third project are stripped because that is a separate bridge invocation.
10. Track which alias was assigned to which real identifier in this response so the meta-summary can confirm the mapping was stable end-to-end. Do not surface the real identifiers in the output, but do confirm "alias map applied consistently to N items" so the operator knows the discipline ran.

## Output shape

```markdown
## Bridged context — Project-A → Project-B

Traversal: graphify path · Project-A · marketplace_payments → onboarding_flow

- **[2026-04-22]** Picked Stripe Connect Standard over Express for marketplace because the operator already had Stripe Atlas; saved 2 weeks of compliance setup. _(from Project-A)_
- **[2026-04-15]** Chose Telegram bot for v0 lead capture before promoting to Supabase; instant operator notification was worth more than persistence in week 1. _(from Project-A)_
- **[2026-04-08]** Rejected Webflow because of code-level control needed for SEO-shaped page generation. _(from Project-A)_

Bridged 3 items from Project-A to Project-B via graphify path · time window: last 30 days · anonymisation: strict.

Alias map applied consistently to 3 items (1 project alias, 2 counterparty aliases).
```

If the operator asked for `loose` anonymisation, the meta-summary surfaces that explicitly so the operator knows the bridge contains real names that should not flow into a public artefact without a second pass through `case-study-anonymiser`.

## Anti-patterns

- Do not skip the anonymisation pass even when the operator says "this stays internal". Graph contents leak across surfaces (logs, exports, future case studies, agent memories); the bridge is one more place to enforce the discipline.
- Do not auto-write the bridge into the target project's note. The bridge is ephemeral context unless the operator explicitly persists it.
- Do not bridge nodes whose `source_file` cannot be traced back to the source project. Loose graph hits from random ingested URLs in the corpus are noise; the bridge is for the source project's actual subgraph.
- Do not return more than 5 items by default. A 30-node dump is not a bridge, it is a backlog import — and the operator stops reading after the third bullet anyway.
- Do not invent decisions that "probably" were made. If the graph traversal returns nothing, the bridge is empty and that is the answer; padding the output with hallucinated history is a worse failure than an empty result.
- Do not bridge in both directions in one invocation. Bridging from Project-A → Project-B and Project-B → Project-A in one response collapses the two namespaces and the alias map stops being stable. One direction per call.
- Do not interpret the bridged items for the target project. Surfacing `Project-A` decided X is enough; deciding whether the same answer applies to `Project-B` is the operator's call, not the skill's.
- Do not paste the bridge into a public artefact without running it through `case-study-anonymiser` first when in `loose` mode. The bridge is internal context by default; publishing requires the second pass.
- Do not run a fresh `/graphify <project>` build from inside the bridge. If the source project's graph is stale, surface that and let the operator decide whether to rebuild — building blows the session's token budget and is the operator's call.

## Related

- [`workflows/parallel-projects.md`](../../workflows/parallel-projects.md) — Habit 3 + the "What about context windows?" section establish the cross-session bridge discipline this skill implements.
- [`stack/graphify.md`](../../stack/graphify.md) — the graphify knowledge-graph layer this skill traverses for cross-project lookups.
- [`case-studies/niche-booking-trio.md`](../../case-studies/niche-booking-trio.md) — the live `Discipline A/B/C` aliasing pattern this skill mirrors for anonymisation.
- [`skills/case-study-anonymiser`](../case-study-anonymiser/SKILL.md) — the standalone anonymisation skill; this one is the cross-project specialisation.
- [`skills/weekly-monday-review`](../weekly-monday-review/SKILL.md) — Monday review picks the 2-of-N focus projects; the bridge runs at the start of each focused session against the prior week's other focus.
- [`stack/obsidian-brain.md`](../../stack/obsidian-brain.md) — project notes are the canonical place to look up the source project name when the operator is unsure which subgraph to traverse.
- ECC `context-budget` and `strategic-compact` — disambiguated above; neither bridges across the multi-project graph.
