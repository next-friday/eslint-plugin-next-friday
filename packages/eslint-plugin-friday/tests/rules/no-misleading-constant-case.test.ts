import rule from "../../src/rules/no-misleading-constant-case.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-misleading-constant-case", rule, {
  valid: [
    {
      name: "global SCREAMING_SNAKE_CASE for string literal",
      code: `const API_URL = "https://api.example.com";`,
    },
    {
      name: "global SCREAMING_SNAKE_CASE for number literal",
      code: `const MAX = 100;`,
    },
    {
      name: "global SCREAMING_SNAKE_CASE for static array",
      code: `const ITEMS = [1, 2, 3];`,
    },
    {
      name: "global SCREAMING_SNAKE_CASE for static object",
      code: `const CONFIG = { key: "value" };`,
    },
    {
      name: "global SCREAMING_SNAKE_CASE for negated number literal",
      code: `const MIN = -1;`,
    },
    {
      name: "global SCREAMING_SNAKE_CASE for static template literal",
      code: "const GREETING = `hello`;",
    },
    {
      name: "global SCREAMING_SNAKE_CASE for as const",
      code: `const VARIANTS = ["a", "b"] as const;`,
    },
    {
      name: "SCREAMING_SNAKE_CASE in destructuring pattern",
      code: `const { FOO_BAR } = obj;`,
    },
    {
      name: "camelCase for dynamic value",
      code: `const config = getConfig();`,
    },
    {
      name: "camelCase in local scope",
      code: `function foo() { const totalCount = 10; }`,
    },
    {
      name: "exported global SCREAMING_SNAKE_CASE",
      code: `export const API_URL = "https://api.example.com";`,
    },
  ],
  invalid: [
    {
      name: "SCREAMING_SNAKE_CASE with let",
      code: `let API_URL = "https://api.example.com";`,
      errors: [
        {
          messageId: "mutableScreamingCase",
          data: { name: "API_URL", kind: "let" },
        },
      ],
    },
    {
      name: "SCREAMING_SNAKE_CASE with var",
      code: `var MAX_COUNT = 10;`,
      errors: [
        {
          messageId: "mutableScreamingCase",
          data: { name: "MAX_COUNT", kind: "var" },
        },
      ],
    },
    {
      name: "global SCREAMING_SNAKE_CASE for dynamic value",
      code: `const API_URL = getUrl();`,
      errors: [
        { messageId: "dynamicScreamingCase", data: { name: "API_URL" } },
      ],
    },
    {
      name: "global SCREAMING_SNAKE_CASE for dynamic template",
      code: "const PATHNAME = `/news/${slug}`;",
      errors: [
        { messageId: "dynamicScreamingCase", data: { name: "PATHNAME" } },
      ],
    },
    {
      name: "global SCREAMING_SNAKE_CASE for object with dynamic value",
      code: `const CONFIG = { key: getValue() };`,
      errors: [{ messageId: "dynamicScreamingCase", data: { name: "CONFIG" } }],
    },
    {
      name: "global SCREAMING_SNAKE_CASE for as const over dynamic value",
      code: `const CONFIG = { key: getValue() } as const;`,
      errors: [{ messageId: "dynamicScreamingCase", data: { name: "CONFIG" } }],
    },
    {
      name: "SCREAMING_SNAKE_CASE in local scope",
      code: `function foo() { const MAX_RETRY = 3; }`,
      errors: [
        { messageId: "localScreamingCase", data: { name: "MAX_RETRY" } },
      ],
    },
    {
      name: "SCREAMING_SNAKE_CASE in component scope",
      code: `const MyComponent = () => { const ACTIVE_ITEMS = ITEMS.filter(i => i.active); };`,
      errors: [
        { messageId: "localScreamingCase", data: { name: "ACTIVE_ITEMS" } },
      ],
    },
    {
      name: "SCREAMING_SNAKE_CASE static value in local scope",
      code: `function foo() { const TOTAL_COUNT = 10; }`,
      errors: [
        { messageId: "localScreamingCase", data: { name: "TOTAL_COUNT" } },
      ],
    },
  ],
});
