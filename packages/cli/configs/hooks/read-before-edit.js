#!/usr/bin/env node
// read-before-edit — PreToolUse hook
// Injects an advisory reminder when Write or Edit targets an existing file.
// Useful primarily for non-Claude runtimes (OpenCode, Kilo, Gemini CLI)
// that don't natively enforce the read-before-edit pattern. On Claude Code,
// the runtime already enforces this, so the hook detects that and exits
// silently to avoid duplicating the message.
//
// Triggers on: Write and Edit tool calls
// Action: Advisory only — does not block. Fires only when the target file
// already exists on disk; new file creation does not need a prior Read.

const fs = require('fs');
const path = require('path');

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name;

    if (toolName !== 'Write' && toolName !== 'Edit') {
      process.exit(0);
    }

    // Claude Code natively enforces read-before-edit — skip
    if (process.env.CLAUDE_SESSION_ID || process.env.CLAUDECODE) {
      process.exit(0);
    }

    const filePath = data.tool_input?.file_path || '';
    if (!filePath) process.exit(0);

    let fileExists = false;
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      fileExists = true;
    } catch {
      // new file — runtime allows direct creation
    }

    if (!fileExists) process.exit(0);

    const fileName = path.basename(filePath);

    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext:
          `READ-BEFORE-EDIT REMINDER: You are about to modify "${fileName}" which already exists. ` +
          'If you have not already used the Read tool to read this file in the current session, ' +
          'you MUST Read it first before editing. The runtime will reject edits to files that ' +
          'have not been read. Use the Read tool on this file path, then retry your edit.',
      },
    };

    process.stdout.write(JSON.stringify(output));
  } catch {
    process.exit(0);
  }
});
