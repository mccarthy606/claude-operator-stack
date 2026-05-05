/**
 * The six-component stack — single in-code source of truth for `verify` and
 * `list-stack`. Kept in sync by hand with `stack/README.md`. Drift is caught
 * by `tests/stack.test.ts` snapshot.
 *
 * Adding a component: also add to `stack/README.md` table; update test snapshot.
 */
import type { StackComponent } from "../types.js";

export const STACK: readonly StackComponent[] = [
  {
    id: "everything-claude-code",
    name: "Everything Claude Code",
    layer: "Skills + Agents",
    author: "@affaan-m",
    repo: "https://github.com/affaan-m/everything-claude-code",
    kind: "plugin",
    pluginKey: "everything-claude-code@everything-claude-code",
  },
  {
    id: "toprank",
    name: "Toprank",
    layer: "SEO + Ads",
    author: "nowork-studio",
    repo: "https://github.com/nowork-studio/toprank",
    kind: "plugin",
    pluginKey: "toprank@nowork-studio",
  },
  {
    id: "frontend-design",
    name: "Frontend-Design",
    layer: "UI generation",
    author: "Anthropic",
    repo: "https://github.com/anthropics/claude-plugins-official",
    kind: "plugin",
    pluginKey: "frontend-design@claude-plugins-official",
  },
  {
    id: "mcp-servers",
    name: "~/.claude/mcp-configs/mcp-servers.json",
    layer: "MCP integrations",
    author: "operator-curated",
    repo: "https://github.com/mccarthy606/claude-operator-stack",
    kind: "file",
    relPath: "mcp-configs/mcp-servers.json",
  },
  {
    id: "obsidian-rule",
    name: "~/.claude/rules/obsidian-integration.md",
    layer: "Operator-curated context",
    author: "operator-curated",
    repo: "https://github.com/mccarthy606/claude-operator-stack",
    kind: "file",
    relPath: "rules/obsidian-integration.md",
  },
  {
    id: "operator-hooks",
    name: "operator-stack hooks (configs/hooks/*)",
    layer: "Custom hooks",
    author: "operator-curated",
    repo: "https://github.com/mccarthy606/claude-operator-stack",
    kind: "optional",
    note: "opt-in; not audited",
  },
] as const;
