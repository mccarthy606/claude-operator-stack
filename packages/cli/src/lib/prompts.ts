/**
 * Prompt definitions used by `init`. Pure data — never invokes `prompts()`
 * itself. The orchestrator (commands/init.ts) calls `prompts(definitionList)`
 * with a real or stubbed prompts function.
 *
 * Keeps prompt copy in one place and lets tests assert on the shapes without
 * pulling in a TTY.
 */
import type { PromptObject } from "prompts";

/**
 * Step 2 — marketplace selection. The first two are preselected because most
 * users will not yet have them. ECC is unselected because most users picking
 * up the operator stack already have it.
 */
export const marketplacePrompt: PromptObject = {
  type: "multiselect",
  name: "marketplaces",
  message: "Select marketplaces to enable",
  hint: "space to toggle, enter to confirm",
  instructions: false,
  choices: [
    {
      title: "frontend-design@claude-plugins-official",
      description: "Anthropic — UI generation",
      value: "frontend-design@claude-plugins-official",
      selected: true,
    },
    {
      title: "toprank@nowork-studio",
      description: "SEO + Ads",
      value: "toprank@nowork-studio",
      selected: true,
    },
    {
      title: "everything-claude-code@everything-claude-code",
      description: "the backbone — only check if you don't already have ECC",
      value: "everything-claude-code@everything-claude-code",
      selected: false,
    },
  ],
};

export const copyHooksPrompt: PromptObject = {
  type: "confirm",
  name: "copyHooks",
  message: "Copy custom hooks too?",
  initial: false,
};

/**
 * Build the per-hook multiselect once we know which hooks are available on
 * disk. Caller passes the list of basenames.
 */
export function buildHooksMultiselectPrompt(
  hooks: readonly string[]
): PromptObject {
  return {
    type: "multiselect",
    name: "selectedHooks",
    message: "Pick hooks to copy",
    instructions: false,
    choices: hooks.map((h) => ({
      title: h,
      value: h,
      selected: false,
    })),
    hint: "space to toggle, enter to confirm",
  };
}

export const vaultPathPrompt: PromptObject = {
  type: "text",
  name: "vaultPath",
  message: "Vault path (Obsidian)",
  initial: "~/Brain",
};

export const continueConfirmPrompt: PromptObject = {
  type: "confirm",
  name: "continue",
  message: "Acknowledge and continue?",
  initial: true,
};

/**
 * For `tests/prompts.test.ts` — single export so the test can iterate.
 */
export const ALL_PROMPT_DEFS = {
  marketplace: marketplacePrompt,
  copyHooks: copyHooksPrompt,
  vaultPath: vaultPathPrompt,
  continueConfirm: continueConfirmPrompt,
} as const;
