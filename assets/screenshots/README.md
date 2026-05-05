# Screenshots

Visual proof beats prose. This directory holds screenshots and recordings that demonstrate the stack in action. Currently a placeholder — the screenshots themselves require running on the operator's actual machine and cannot be auto-generated.

## What goes here

| File | What it shows | Status |
|------|---------------|--------|
| `obsidian-vault.png` | A `~/Brain/Projects/` view in Obsidian — the project notes that Claude reads at session start | TODO |
| `claude-reads-note.png` | A Claude Code session opening a project directory and reading the corresponding `~/Brain/Projects/<name>.md` | TODO |
| `install-dryrun.svg` | An [asciinema](https://asciinema.org) recording (or static SVG) of `./install.sh --dry-run` running end-to-end | TODO |
| `mermaid-stack-overview.png` | Rendered preview of the stack overview Mermaid diagram | optional — GitHub renders Mermaid natively |

## How to capture

### `obsidian-vault.png`

1. Open your Obsidian vault. Navigate to `Projects/` in the file pane.
2. Pick a project note that demonstrates the structure (open tasks, decisions, open questions). Make sure no private project names are visible — use a demo note if needed.
3. Take a screenshot at retina resolution (Cmd-Shift-4 on macOS).
4. Save as `obsidian-vault.png` in this directory.

### `claude-reads-note.png`

1. Open Claude Code in a project directory that has a corresponding `~/Brain/Projects/` note.
2. Start a fresh session — let the integration rule fire and read the note.
3. Screenshot the moment Claude prints the project context summary at session start.
4. Save as `claude-reads-note.png`.

### `install-dryrun.svg`

```bash
# install asciinema
brew install asciinema agg

# record
asciinema rec install-dryrun.cast \
  -c "cd ~/Projects/claude-operator-stack && ./install.sh --dry-run" \
  --idle-time-limit 1

# convert to SVG (better than gif for repos)
agg install-dryrun.cast install-dryrun.svg
```

Save the resulting `install-dryrun.svg` here.

## Why these specific screenshots

Each one closes a credibility gap that prose cannot:

- **`obsidian-vault.png`** — proves the Obsidian integration is real, not aspirational
- **`claude-reads-note.png`** — proves the read-on-session-start loop actually fires
- **`install-dryrun.svg`** — proves the installer is friendly and inspectable, not scary

Without these, the README is "trust me." With them, it's "here's the receipt."

## Privacy

Before saving any screenshot:

- Blur or crop out real product names (use the generic labels: Niche Booking Trio, P2P Marketplace, etc.)
- Blur API keys, even partial
- Blur internal customer names, emails, phone numbers
- Make sure window title bars don't leak private repo names

When in doubt, capture from a fresh demo vault rather than your real one.
