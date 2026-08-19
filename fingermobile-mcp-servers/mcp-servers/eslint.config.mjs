import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        node: true,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-redeclare": ["error", { builtinGlobals: false }],
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  js.configs.recommended,
];
