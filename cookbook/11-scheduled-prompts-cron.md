# Scheduled Prompts via the cron MCP

> **Time:** ~45m
> **Stack:** `scheduled-tasks` MCP, Claude Code, Obsidian vault as the source of truth
> **Used in:** ops-side automation across the operator's [parallel projects](../workflows/parallel-projects.md)

## The problem

You want Claude Code to do something on a schedule without you opening a session. A weekly cost rollup across all your products. A daily check that all production sites are returning 200. A reminder when a project deadline in your Obsidian vault is within 7 days. A monthly sweep of stale GitHub branches across the org.

Cron and a shell script can do all of this. But you do not want to wire up four cron jobs that each call a different bash script you have to maintain. The `scheduled-tasks` MCP lets you define recurring prompts that fire a Claude Code session with a specific instruction at a chosen cadence. The result is "the agent does it" rather than "I maintain four shell scripts."

## Solution overview

`scheduled-tasks` is an MCP server that registers cron-style triggers. Each trigger invokes Claude Code with a prompt and (optionally) a context file. The agent runs autonomously, does its work, and stores results back to your Obsidian vault or wherever you direct it.

The discipline is "one task = one prompt." Do not write a 200-line prompt that does seven things on a weekly cron. Write seven small tasks that each do one thing well.

## Step-by-step

### 1. Install the MCP

In `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "scheduled-tasks": {
      "command": "npx",
      "args": ["-y", "@anthropic/scheduled-tasks-mcp@latest"]
    }
  }
}
```

Restart Claude Code. Run `/mcp` and confirm `scheduled-tasks` is listed.

> Verify the actual package name and source against the [stack/mcp-servers.md](../stack/mcp-servers.md) reference; package names occasionally move, and your tooling may report a different identifier than the one shown here.

### 2. Create your first task — production health check

In a Claude Code session:

```text
Use the scheduled-tasks MCP to create a task:
- name: production-health-check
- cron: "0 9 * * *"   (9am daily)
- prompt: |
    Check that the following URLs all return HTTP 200:
    - https://product-a.example
    - https://product-b.example
    - https://product-c.example

    For any URL that does not return 200:
    1. Log the failure to ~/Brain/Daily/$(date +%Y-%m-%d).md under "## Health alerts"
    2. Send a Telegram message via the bot configured in TELEGRAM_BOT_TOKEN

    If all URLs return 200, write a single line to the daily note: "All production URLs healthy."
```

The agent registers the task. From now on, every day at 9am a fresh Claude Code session runs this prompt.

### 3. Weekly cost rollup

```text
Create a scheduled task:
- name: weekly-cost-rollup
- cron: "0 10 * * 1"   (Mondays 10am)
- prompt: |
    Pull last week's cost data from:
    1. Anthropic Console (read latest invoice from ~/.config/anthropic-billing if available, otherwise note "manual")
    2. Vercel API for each project in ~/Brain/Projects/
    3. Supabase API for each project that uses Supabase
    4. Cloudflare API for analytics + bandwidth

    Summarize total spend by product into a markdown table.
    Append to ~/Brain/Knowledge/cost-tracking.md under a "## Week of YYYY-MM-DD" heading.
    Flag any product whose week-over-week spend grew by more than 50%.
```

### 4. Deadline reminders from Obsidian

```text
Create a scheduled task:
- name: deadline-sweep
- cron: "0 8 * * *"   (8am daily)
- prompt: |
    Read every file under ~/Brain/Projects/.
    For any project note with a `deadline:` field in the frontmatter that is within 7 days:

    1. Append a line to ~/Brain/Daily/$(date +%Y-%m-%d).md under "## Upcoming deadlines"
    2. If deadline is within 48h, also send a Telegram message

    Format: "[<project>] <deadline> — <days remaining> days"
    Skip projects with status: archived or status: paused.
```

### 5. List + manage tasks

```text
List all scheduled-tasks
```

The MCP returns active tasks with name, cron, and last-run status.

```text
Disable scheduled-tasks task production-health-check
```

```text
Show last 5 runs of scheduled-tasks task weekly-cost-rollup
```

### 6. Where the output goes

The convention that pays off: every scheduled task writes its output to the Obsidian vault, never just to stdout. Reasons:

- Daily notes accumulate a real audit trail of what the agent saw
- Knowledge notes capture trends across runs (weekly cost over months)
- The vault syncs across machines, so the data is portable
- You can read the agent's outputs in the same place you read everything else

If a task does not produce something worth writing down, it probably should not exist.

### 7. Test before scheduling

Always run the prompt manually first in a Claude Code session before registering it as a task. Tasks fire without you watching. A subtly broken prompt runs every day for a week before you notice the daily note is empty.

## Pitfalls

- **Cron in the wrong timezone.** The MCP's cron usually runs in the machine's local timezone, but verify on first install. A "9am" check that fires at 9am UTC when you are in Argentina (UTC-3) means 6am local. Set explicit timezone if the MCP supports it, or write cron times in UTC and do the math.
- **Tasks accumulate and nobody knows what they do.** Maintain a single `~/Brain/Knowledge/scheduled-tasks.md` note that lists every active task with its purpose, schedule, and the file it writes to. Keep it in sync with `list scheduled-tasks` output.
- **Prompts that need interactive input.** Scheduled tasks have no human in the loop. A prompt that asks "do you want me to also do X?" stalls. Phrase prompts as instructions, not questions.
- **Sensitive data in prompts.** The prompt is stored in the MCP's task registry. Do not embed secrets — reference env vars or files (`Read the API key from ~/.config/whatever`).
- **Network failures on long-running tasks.** A daily 30-minute task is fragile to transient failures. Build retry logic into the prompt itself ("if a fetch fails, retry up to 3 times with 30s backoff") or split the task into smaller ones.

## References

- [stack/mcp-servers.md](../stack/mcp-servers.md) — full MCP loadout for the operator stack
- [workflows/parallel-projects.md](../workflows/parallel-projects.md) — the broader context where these tasks fit
- [workflows/obsidian-as-context.md](../workflows/obsidian-as-context.md) — why everything writes back to the vault
- [recipe 09 — Telegram notifications](09-telegram-bot-leads-v0.md) — used by the alert side of these tasks
