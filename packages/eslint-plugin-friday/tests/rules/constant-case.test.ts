import rule from "../../src/rules/constant-case.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("constant-case", rule, {
  valid: [
    {
      name: "SCREAMING_SNAKE_CASE string constant",
      code: `const DEFAULT_COVER = "/images/default.jpg";`,
    },
    {
      name: "SCREAMING_SNAKE_CASE number constant",
      code: `const PAGE_LIMIT = 10;`,
    },
    {
      name: "SCREAMING_SNAKE_CASE url constant",
      code: `const API_URL = "https://api.example.com";`,
    },
    {
      name: "SCREAMING_SNAKE_CASE negative number",
      code: `const NEGATIVE_VALUE = -1;`,
    },
    {
      name: "non-arithmetic unary operator ignored",
      code: `const notReady = !ready;`,
    },
    {
      name: "exported SCREAMING_SNAKE_CASE constant",
      code: `export const MAX_RETRY = 3;`,
    },
    { name: "boolean constant ignored", code: `const isEnabled = true;` },
    {
      name: "boolean constant ignored regardless of prefix",
      code: `const hasAccess = false;`,
    },
    {
      name: "boolean constant without is/has prefix",
      code: `const featureEnabled = true;`,
    },
    {
      name: "static template literal ignored",
      code: "const template = `hello world`;",
    },
    {
      name: "SCREAMING_SNAKE_CASE RegExp literal",
      code: `const PHONE_REGEX = /^[0-9]{10}$/;`,
    },
    {
      name: "SCREAMING_SNAKE_CASE new RegExp()",
      code: `const EMAIL_PATTERN = new RegExp("^.+@.+$");`,
    },
    {
      name: "SCREAMING_SNAKE_CASE new RegExp() with flags",
      code: `const EMAIL_PATTERN = new RegExp("^.+@.+$", "g");`,
    },
    {
      name: "new RegExp() with dynamic argument",
      code: `const dynamicPattern = new RegExp(userInput);`,
    },
    {
      name: "new RegExp() with function-call argument",
      code: `const dynamicPattern = new RegExp(getPattern(), "i");`,
    },
    {
      name: "new non-RegExp constructor ignored",
      code: `const cache = new Map();`,
    },
    {
      name: "new member-expression constructor ignored",
      code: `const node = new foo.Bar();`,
    },
    {
      name: "SCREAMING_SNAKE_CASE bigint constant",
      code: `const BIG_LIMIT = 9007199254740993n;`,
    },
    {
      name: "SCREAMING_SNAKE_CASE negative bigint",
      code: `const NEGATIVE_BIG = -1n;`,
    },
    {
      name: "array literal ignored",
      code: `const skeletonItems = [1, 2, 3, 4, 5];`,
    },
    {
      name: "object literal ignored",
      code: `const mapStyle = { height: "320px", width: "100%" };`,
    },
    {
      name: "as const object ignored",
      code: `const statusMap = { ACTIVE: "active" } as const;`,
    },
    {
      name: "as const array ignored",
      code: `const categories = [{ id: "1" }] as const;`,
    },
    {
      name: "framework metadata export ignored",
      code: `export const metadata: Metadata = { title: "404" };`,
    },
    {
      name: "framework viewport export ignored",
      code: `export const viewport: Viewport = { themeColor: "#fff" };`,
    },
    {
      name: "object with dynamic values ignored",
      code: `const config = { key: getValue() };`,
    },
    { name: "function ignored", code: `const handleClick = () => {};` },
    { name: "component ignored", code: `const MyComponent = () => {};` },
    {
      name: "object destructuring declarator ignored",
      code: `const { defaultCover } = config;`,
    },
    {
      name: "array destructuring declarator ignored",
      code: `const [firstItem] = items;`,
    },
    {
      name: "ambient declaration without initializer ignored",
      code: `declare const apiUrl: string;`,
    },
    {
      name: "let declaration ignored",
      code: `let defaultCover = "/images/default.jpg";`,
    },
    {
      name: "local scope constant ignored",
      code: `function foo() { const maxRetry = 3; }`,
    },
    {
      name: "dynamic template literal ignored",
      code: "const pendingHref = `/branch/${branch}`;",
    },
    { name: "dynamic value ignored", code: `const result = getData();` },
    {
      name: "process.env assignment ignored",
      code: `const API_URL = process.env.API_URL;`,
    },
    {
      name: "skip rule in next.config.ts",
      code: `const nextConfig = { reactStrictMode: true };`,
      filename: "next.config.ts",
    },
    {
      name: "skip rule in vite.config.ts",
      code: `const config = { plugins: ["foo"] };`,
      filename: "vite.config.ts",
    },
    {
      name: "skip rule in tailwind.config.ts",
      code: `const config = { content: ["./src/**/*.tsx"] };`,
      filename: "tailwind.config.ts",
    },
    {
      name: "skip rule in postcss.config.mjs",
      code: `const config = { plugins: { "@tailwindcss/postcss": {} } };`,
      filename: "postcss.config.mjs",
    },
    {
      name: "skip rule in stylelint.config.ts",
      code: `const config = { extends: ["stylelint-config-standard"] };`,
      filename: "stylelint.config.ts",
    },
    {
      name: "leading underscore screaming snake constant",
      code: `const _DEFAULT = 5;`,
    },
    {
      name: "trailing underscore screaming snake constant",
      code: `const FOO_ = "bar";`,
    },
  ],
  invalid: [
    {
      name: "camelCase global string constant",
      code: `const defaultCover = "/images/default.jpg";`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "defaultCover", suggestion: "DEFAULT_COVER" },
        },
      ],
    },
    {
      name: "camelCase global number constant",
      code: `const pageLimit = 10;`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "pageLimit", suggestion: "PAGE_LIMIT" },
        },
      ],
    },
    {
      name: "camelCase global URL constant",
      code: `const apiBaseUrl = "https://api.example.com";`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "apiBaseUrl", suggestion: "API_BASE_URL" },
        },
      ],
    },
    {
      name: "camelCase global negative number constant",
      code: `const negativeOne = -1;`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "negativeOne", suggestion: "NEGATIVE_ONE" },
        },
      ],
    },
    {
      name: "camelCase exported global magic number",
      code: `export const maxRetryCount = 3;`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "maxRetryCount", suggestion: "MAX_RETRY_COUNT" },
        },
      ],
    },
    {
      name: "snake_case global magic text",
      code: `const default_theme = "dark";`,
      errors: [
        {
          messageId: "noSnakeCase",
          data: { name: "default_theme", suggestion: "DEFAULT_THEME" },
        },
      ],
    },
    {
      name: "camelCase global RegExp literal",
      code: `const phoneRegex = /^[0-9]{10}$/;`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "phoneRegex", suggestion: "PHONE_REGEX" },
        },
      ],
    },
    {
      name: "camelCase global new RegExp()",
      code: `const emailPattern = new RegExp("^.+@.+$");`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "emailPattern", suggestion: "EMAIL_PATTERN" },
        },
      ],
    },
    {
      name: "camelCase global bigint constant",
      code: `const bigLimit = 9007199254740993n;`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "bigLimit", suggestion: "BIG_LIMIT" },
        },
      ],
    },
    {
      name: "camelCase global negative bigint",
      code: `const negativeBig = -1n;`,
      errors: [
        {
          messageId: "useScreamingSnakeCase",
          data: { name: "negativeBig", suggestion: "NEGATIVE_BIG" },
        },
      ],
    },
  ],
});
