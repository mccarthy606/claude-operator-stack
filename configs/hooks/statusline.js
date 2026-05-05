#!/usr/bin/env node
// statusline — StatusLine hook
// Renders a compact status line: model | current task (from todos) | dir | context bar.
// Also writes context metrics to a bridge file so context-monitor.js can warn the
// agent when usage gets high.
//
// Format: "Claude Sonnet | refactoring auth | my-repo |  ████░░░░░░ 42%"
//
// The context bar normalises around the auto-compact buffer so the percentage
// reflects USABLE context, not raw token count.

const fs = require('fs');
const path = require('path');
const os = require('os');

function runStatusline() {
  let input = '';
  const stdinTimeout = setTimeout(() => process.exit(0), 3000);
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { input += chunk; });
  process.stdin.on('end', () => {
    clearTimeout(stdinTimeout);
    try {
      const data = JSON.parse(input);
      const model = data.model?.display_name || 'Claude';
      const dir = data.workspace?.current_dir || process.cwd();
      const session = data.session_id || '';
      const remaining = data.context_window?.remaining_percentage;
      const totalCtx = data.context_window?.total_tokens || 1_000_000;

      // Auto-compact buffer — Claude reserves ~16.5% of total context.
      // CLAUDE_CODE_AUTO_COMPACT_WINDOW (token count) overrides this.
      const acw = parseInt(process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW || '0', 10);
      const AUTO_COMPACT_BUFFER_PCT = acw > 0
        ? Math.min(100, (acw / totalCtx) * 100)
        : 16.5;

      let ctx = '';
      if (remaining != null) {
        const usableRemaining = Math.max(
          0,
          ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100,
        );
        const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

        // Bridge file for context-monitor.js. Reject session IDs containing
        // path separators or traversal to prevent escape from temp directory.
        const sessionSafe = session && !/[/\\]|\.\./.test(session);
        if (sessionSafe) {
          try {
            // Per-session bridge file. Session IDs are validated for path traversal above (line 48).
            // On a multi-user shared machine where two users somehow share the same session id,
            // one could overwrite the other's metrics — vanishingly unlikely but worth flagging.
            const bridgePath = path.join(os.tmpdir(), `claude-ctx-${session}.json`);
            fs.writeFileSync(bridgePath, JSON.stringify({
              session_id: session,
              remaining_percentage: remaining,
              used_pct: used,
              timestamp: Math.floor(Date.now() / 1000),
            }));
          } catch {
            // best-effort
          }
        }

        const filled = Math.floor(used / 10);
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

        if (used < 50) {
          ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
        } else if (used < 65) {
          ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
        } else if (used < 80) {
          ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
        } else {
          ctx = ` \x1b[5;31m${bar} ${used}%\x1b[0m`;
        }
      }

      // Current task from todos (if Claude Code is writing them)
      let task = '';
      const homeDir = os.homedir();
      const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
      const todosDir = path.join(claudeDir, 'todos');
      if (session && fs.existsSync(todosDir)) {
        try {
          const files = fs.readdirSync(todosDir)
            .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
            .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
            .sort((a, b) => b.mtime - a.mtime);

          if (files.length > 0) {
            try {
              const todos = JSON.parse(fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'));
              const inProgress = todos.find(t => t.status === 'in_progress');
              if (inProgress) task = inProgress.activeForm || '';
            } catch {
              // ignore malformed todos
            }
          }
        } catch {
          // ignore fs errors
        }
      }

      const dirname = path.basename(dir);
      const middle = task ? `\x1b[1m${task}\x1b[0m` : null;

      if (middle) {
        process.stdout.write(`\x1b[2m${model}\x1b[0m │ ${middle} │ \x1b[2m${dirname}\x1b[0m${ctx}`);
      } else {
        process.stdout.write(`\x1b[2m${model}\x1b[0m │ \x1b[2m${dirname}\x1b[0m${ctx}`);
      }
    } catch {
      // silent fail — never break the statusline
    }
  });
}

if (require.main === module) runStatusline();
