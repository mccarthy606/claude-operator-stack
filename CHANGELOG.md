# Changelog

All notable changes to the Claude Operator Stack will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The stack uses calendar-versioning aligned with major iterations, not strict semver.

## [0.1.0] — 2026-05-04

### Added

- **README.md** — public framing, the stack table, the 7-products-in-4-months hook, install path
- **install.sh** — non-destructive installer with `--dry-run` and `--yes` flags. Copies sanitized configs as sidecars (`*.from-operator-stack`) so existing user configs are not silently overwritten
- **stack/** — six-component breakdown with attribution: ECC, Toprank, Frontend-Design, Obsidian, OMEGA Memory, MCP servers
- **workflows/** — five operator playbooks: ship-a-product-in-a-day, parallel-projects, obsidian-as-context, content-pipeline, solo-ops
- **case-studies/** — four real-product case studies with anonymized URLs: Niche Booking Trio (3 sites), AI Legal Tool, WhatsApp B2B SaaS, YouTube production pipeline
- **configs/** — sanitized examples for `settings.json` and `mcp-servers.json`, plus the `obsidian-integration` rule
- **credits/README.md** — full attribution chain back to original authors of every component
- **CONTRIBUTING.md** — what's in scope, what's out, how to PR
- **SECURITY.md** — private vulnerability disclosure policy
- **CLAUDE.md** — repo-internal Claude config (voice, tone, attribution discipline)
- **LICENSE** — MIT
- **.gitignore** — secrets, machine-state files, vault paths

### Notes on this release

Initial public release. The stack is small and opinionated by design. Future releases will:

- Add Windows-native installer (`install.ps1`)
- Add Russian translation of the README
- Expand case studies as more products ship
- Add a `quickstart/` directory with scaffolds for common new-project shapes
