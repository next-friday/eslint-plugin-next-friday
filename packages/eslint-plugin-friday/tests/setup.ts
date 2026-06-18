import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

export const createRuleTester = (jsx = false): RuleTester =>
  new RuleTester(
    jsx
      ? {
          languageOptions: {
            parserOptions: {
              ecmaFeatures: { jsx: true },
            },
          },
        }
      : undefined,
  );
