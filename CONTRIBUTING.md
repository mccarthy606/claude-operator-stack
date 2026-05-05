# Contributing

Contributions are welcome. The stack is small on purpose — adds need to clear a bar.

## What's in scope

- Fixes to existing files (broken links, stale info, factual corrections)
- New stack components that solve a problem the existing six don't already solve
- New workflows for solo / small-team operators (not enterprise)
- New case studies of shipped products (your own only, with URLs anonymized at your discretion)
- Translations of the README into other languages
- Better install scripts (Windows native, NixOS, etc.)
- Issue templates that catch real problems

## What's out of scope

- Adding skills/agents that duplicate ECC content (link to ECC instead)
- Marketing pages, landing pages, branding work (this is a tool, not a product)
- Forks of the stack that just rename + repackage — fork freely, but those are forks, not contributions
- Tooling specific to one cloud provider, one stack, or one ecosystem unless it's clearly opt-in

## How to contribute

1. **Open an issue first** for anything bigger than a typo. Five minutes of "is this in scope" beats hours of writing then rejection.
2. **Keep PRs small.** One change per PR. Multiple unrelated changes get bounced.
3. **Test locally** — run `./install.sh --dry-run` after editing the installer, and read your prose out loud before submitting.
4. **Use clear commit messages** in conventional-commit shape: `feat: ...`, `fix: ...`, `docs: ...`.

## Style

- Markdown files: under ~400 lines unless there's a strong reason
- Code blocks: language-tagged so syntax highlighting works
- Tables for comparisons; bullets for lists; prose for arguments
- No emojis in files
- Attribute every external claim with a link
- No marketing fluff in case studies — describe what was built, what worked, what didn't

## License

By contributing, you agree your contribution is licensed under MIT (the same as the rest of the stack).

## Code of Conduct

Be civil. Disagree with ideas, not people. If a PR or issue feels personal, open a separate conversation with the maintainer instead of escalating in the thread.

## Recognition

Contributors are listed in the README and in `credits/README.md` once their PR is merged. If you'd prefer not to be listed, say so in the PR.
