# Security Policy

## Reporting a vulnerability

If you find a vulnerability — a leaked secret in a config example, a `curl | bash` pattern that could be abused, an install script that does something unexpected, or any other security concern — please **open a private security advisory** through GitHub's "Security" tab on this repo.

If GitHub Security Advisories are not available to you, email the maintainer (handle in the LICENSE / README). Use a subject prefix of `[security]`.

Please do **not** open a public issue for security concerns. The repo is small enough that a private heads-up is faster and reduces exposure.

## What is in scope

- Real secrets accidentally committed (API keys, tokens, OAuth credentials, private keys)
- Install script behavior that runs with elevated privileges or modifies files outside expected paths
- Hook configurations that could be exploited as a code-execution vector
- Outdated or insecure dependency pins in any example config
- MCP server examples that point to untrusted hosts

## What is out of scope

- General security advice for components this stack depends on (file those upstream)
- Hardening recommendations for someone's own private setup (the stack is opinionated, not prescriptive)
- Theoretical attacks against the broader Claude Code ecosystem — these belong upstream

## Response time

Maintainer is solo. Expect an acknowledgement within 72 hours and a fix or mitigation plan within a week for confirmed issues. If you need urgency beyond that (active exploitation in the wild, real harm), say so explicitly in the report.

## Disclosure

Once a fix is merged, the original reporter is credited in the changelog and (with permission) in `credits/README.md`. The vulnerability summary will be published as a GitHub Security Advisory.
