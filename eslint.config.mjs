import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import { config, configs } from "typescript-eslint";

export default config(
  { ignores: ["**/dist/**", "**/coverage/**", ".changeset/**", "**/*.d.*ts"] },
  js.configs.recommended,
  ...configs.recommended,
  sonarjs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  eslintPlugin.configs.recommended,
  jsdoc.configs["flat/recommended-typescript"],
  unicorn.configs["flat/recommended"],
  {
    settings: {
      "import/resolver": {
        typescript: {
          project: ["tsconfig.json", "packages/*/tsconfig.json"],
          noWarnOnMultipleProjects: true,
        },
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  prettier,
);
