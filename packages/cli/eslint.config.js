// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Minimal ESLint config for the CLI. Extends `@eslint/js` recommended plus
 * `typescript-eslint` recommended. Tests run under the same rules but with
 * a couple of test-pragmatic relaxations.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "configs/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
);
