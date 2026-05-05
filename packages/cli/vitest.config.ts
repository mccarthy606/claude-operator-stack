import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/cli.ts",
        "src/version.ts",
        "src/types.ts",
        "src/lib/format.ts",
      ],
      // Thresholds match PLAN.md success criteria (lines >=70). After the
      // M2-v2 fix-wave the orchestrator was split into `collectChoices`,
      // `applyChoices`, and `printNextSteps`, each independently testable —
      // function coverage jumped from 30% to ~80% on init.ts. Threshold is
      // set just below current at 75 so future drift is loud without being
      // brittle. Pure-logic modules (audit, fs-safe, prompts, stack) stay
      // at 100% and pull the average up.
      thresholds: {
        lines: 70,
        functions: 75,
        branches: 70,
        statements: 70,
      },
    },
  },
});
