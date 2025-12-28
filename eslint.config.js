import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default [
  // Ignore patterns
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      ".vscode/**",
      ".idea/**",
    ],
  },

  // Base recommended configuration for all files
  eslint.configs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Astro configuration
  ...eslintPluginAstro.configs.recommended,

  // Global settings for all files
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Node.js globals
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        // ES2022 globals are included by default with ecmaVersion: 'latest'
      },
    },
  },

  // TypeScript files configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  // TypeScript definition files - allow triple-slash references
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // Astro files configuration
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
    },
  },

  // Prettier configuration (must be last to override other configs)
  eslintPluginPrettier,
];
