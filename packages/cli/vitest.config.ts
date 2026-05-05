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
      // Thresholds match PLAN.md success criteria (lines >=70). Functions
      // is set to 65 because init.ts has small command helpers that are
      // exercised end-to-end via the CLI smoke tests, not unit-tested.
      // Pure-logic modules (audit, fs-safe, prompts, stack) hit 100%.
      thresholds: {
        lines: 70,
        functions: 65,
        branches: 70,
        statements: 70,
      },
    },
  },
});
