import { describe, expect, it } from "vitest";
import {
  ALL_PROMPT_DEFS,
  buildHooksMultiselectPrompt,
  marketplacePrompt,
  copyHooksPrompt,
  vaultPathPrompt,
  continueConfirmPrompt,
} from "../src/lib/prompts.js";

describe("prompt definitions — well-formed, no TTY assertions", () => {
  it("every prompt def has a type and a name", () => {
    for (const [k, p] of Object.entries(ALL_PROMPT_DEFS)) {
      expect(typeof p.type, `prompt ${k} type`).toBe("string");
      expect(typeof p.name, `prompt ${k} name`).toBe("string");
      expect(typeof p.message, `prompt ${k} message`).toBe("string");
    }
  });

  it("marketplace prompt has 3 choices, two preselected", () => {
    expect(marketplacePrompt.type).toBe("multiselect");
    const choices = (marketplacePrompt as { choices: { selected?: boolean }[] })
      .choices;
    expect(choices.length).toBe(3);
    expect(choices.filter((c) => c.selected === true).length).toBe(2);
  });

  it("copyHooks prompt is a confirm with initial=false", () => {
    expect(copyHooksPrompt.type).toBe("confirm");
    expect(copyHooksPrompt.initial).toBe(false);
  });

  it("vaultPath prompt has ~/Brain default", () => {
    expect(vaultPathPrompt.type).toBe("text");
    expect(vaultPathPrompt.initial).toBe("~/Brain");
  });

  it("continueConfirm prompt has initial=true (assume yes for the gate)", () => {
    expect(continueConfirmPrompt.type).toBe("confirm");
    expect(continueConfirmPrompt.initial).toBe(true);
  });

  it("buildHooksMultiselectPrompt builds choices for the given hook list", () => {
    const p = buildHooksMultiselectPrompt(["a.js", "b.sh"]);
    expect(p.type).toBe("multiselect");
    const choices = (p as { choices: { value: string }[] }).choices;
    expect(choices.map((c) => c.value)).toEqual(["a.js", "b.sh"]);
  });
});
