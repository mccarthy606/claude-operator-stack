# Screenshots

Visual proof beats prose. This directory holds the SVG illustrations referenced from the README and other docs.

## What's here

| File | What it shows | Status |
|------|---------------|--------|
| `obsidian-vault.svg` | A `~/Brain/Projects/` view in Obsidian — the project notes that Claude reads at session start | Shipped |
| `claude-reads-note.svg` | A Claude Code session opening a project directory and reading the corresponding `~/Brain/Projects/<name>.md` | Shipped |
| `install-dryrun.svg` | A static rendering of `./install.sh --dry-run` running end-to-end | Shipped |

## How to refresh

### `obsidian-vault.svg`

1. Open your Obsidian vault. Navigate to `Projects/` in the file pane.
2. Pick a project note that demonstrates the structure (open tasks, decisions, open questions). Make sure no private project names are visible — use a demo note if needed.
3. Capture at retina resolution and convert to SVG, or hand-author the SVG to match the current vault layout.
4. Save as `obsidian-vault.svg` in this directory.

### `claude-reads-note.svg`

1. Open Claude Code in a project directory that has a corresponding `~/Brain/Projects/` note.
2. Start a fresh session — let the integration rule fire and read the note.
3. Capture the moment Claude prints the project context summary at session start, or render a representative SVG of the same.
4. Save as `claude-reads-note.svg`.

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

## Why these specific assets

Each one closes a credibility gap that prose cannot:

- **`obsidian-vault.svg`** — proves the Obsidian integration is real, not aspirational
- **`claude-reads-note.svg`** — proves the read-on-session-start loop actually fires
- **`install-dryrun.svg`** — proves the installer is friendly and inspectable, not scary

These screenshots are the proof that the prose claims actually fire on a real machine.

## Privacy

Before saving any screenshot:

- Blur or crop out real product names (use the generic labels: Niche Booking Trio, P2P Marketplace, etc.)
- Blur API keys, even partial
- Blur internal customer names, emails, phone numbers
- Make sure window title bars don't leak private repo names

When in doubt, capture from a fresh demo vault rather than your real one.
