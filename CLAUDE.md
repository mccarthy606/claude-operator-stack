# CLAUDE.md — Claude Operator Stack

Project-level Claude config for this repo (the public stack itself, not the private projects it powers).

## What this repo is

A curated stack + operator playbook for solo founders shipping multiple AI products in parallel. See `README.md` for the public framing.

## Working in this repo

When editing or adding to this repo:

- **Voice:** operator-first, not engineer-first. The audience is fellow solo founders, not AI researchers.
- **Tone:** terse, opinionated, no marketing fluff. State the thing, give a reason, move on.
- **No emojis** in any documentation file unless explicitly asked.
- **Attribution discipline:** every component this stack uses has its original author credited. If you add a new component, add it to `credits/README.md` in the same PR, not later.
- **No real URLs** of the operator's private products. Patterns and case studies are anonymized at the URL level.
- **Skill content is not reproduced.** This stack does not redistribute upstream skills. It documents which ones are used, why, and how — with links back to the source repo.

## When asked to extend this stack

- New stack component → add a file under `stack/`, follow the existing template (`stack/ecc.md` is a good model)
- New workflow → add a file under `workflows/`, follow the existing structure (clear before/after, mechanical steps, anti-patterns)
- New case study → add to `case-studies/`, anonymize URLs, focus on transferable lessons not promotion
- New custom hook → add to `configs/hooks/` with a README block explaining what it does
- New rule → add to `configs/rules/` with a clear description

## When asked to review this stack

- Check that every linked external repo still exists (some projects move or rename)
- Check `credits/README.md` is in sync with what the stack actually depends on
- Flag any prose that drifts toward marketing-speak — strip it
- Flag any stack component that is no longer maintained or has a security advisory

## Scope

This is the repo's own CLAUDE.md — opinions about how to work on the stack itself. It is not the user's project-level CLAUDE.md when they install the stack; that one lives at `~/.claude/CLAUDE.md` after install and is shaped by the user's own work.
