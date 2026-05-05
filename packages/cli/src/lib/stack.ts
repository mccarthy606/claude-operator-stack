/**
 * The 6-component stack — single in-code source of truth for `verify` and
 * `list-stack`. Mirrors the README + stack/README.md framing: 4 core
 * (Claude Code, Obsidian, graphify, Frontend-Design) + 2 opt-in (Everything
 * Claude Code, Toprank). Drift is caught by `tests/stack.test.ts` snapshot.
 *
 * `tier` is the user-facing core/opt-in classification. `kind` describes how
 * `verify` audits the component:
 *   - "external" — runtime/app/private package not wired by the installer.
 *     Reported as advisory `skipped` (e.g. Claude Code, Obsidian, graphify).
 *   - "plugin"   — Claude Code marketplace plugin keyed under enabledPlugins.
 *   - "file"     — sanitized file the installer copies under ~/.claude/.
 *
 * Adding a component: also add to README.md + stack/README.md tables; update
 * the test snapshot in `tests/stack.test.ts`.
 */
import type { StackComponent } from "../types.js";

export const STACK: readonly StackComponent[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    layer: "Orchestration",
    tier: "core",
    author: "Anthropic",
    repo: "https://www.anthropic.com/claude-code",
    kind: "external",
    installCommand: "npm install -g @anthropic-ai/claude-code",
    note: "Runtime — install once per machine. Verified by the installer's `claude --version` probe, not by enabledPlugins.",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    layer: "Second Brain",
    tier: "core",
    author: "Obsidian",
    repo: "https://obsidian.md",
    kind: "external",
    installCommand: "https://obsidian.md/download",
    note: "Vault `~/Brain` is project + identity context. Wired into Claude via the obsidian-integration rule (see file row).",
  },
  {
    id: "graphify",
    name: "graphify",
    layer: "Knowledge graph",
    tier: "core",
    author: "operator-built",
    repo: "https://github.com/mccarthy606/claude-operator-stack/blob/main/stack/graphify.md",
    kind: "external",
    installCommand: "operator-private until v1.1; see stack/graphify.md for the interface contract",
    note: "Knowledge-graph layer. Operator-private at the time of this CLI; treat as the interface contract for any equivalent graph-extraction tool.",
  },
  {
    id: "frontend-design",
    name: "Frontend-Design",
    layer: "UI generation",
    tier: "core",
    author: "Anthropic",
    repo: "https://github.com/anthropics/claude-plugins-official",
    kind: "plugin",
    pluginKey: "frontend-design@claude-plugins-official",
  },
  {
    id: "everything-claude-code",
    name: "Everything Claude Code",
    layer: "Skills + Agents",
    tier: "opt-in",
    author: "@affaan-m",
    repo: "https://github.com/affaan-m/everything-claude-code",
    kind: "plugin",
    pluginKey: "everything-claude-code@everything-claude-code",
    optionalCondition: "Install when you want a broad skill + agent catalog (182 skills, 48 agents).",
  },
  {
    id: "toprank",
    name: "Toprank",
    layer: "SEO + Ads",
    tier: "opt-in",
    author: "nowork-studio",
    repo: "https://github.com/nowork-studio/toprank",
    kind: "plugin",
    pluginKey: "toprank@nowork-studio",
    optionalCondition: "Install when you do SEO audits or run Google/Meta Ads.",
  },
] as const;
