import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/next-friday/eslint-plugin-friday/blob/main/packages/eslint-plugin-friday/docs/rules/${name}.md`,
);
