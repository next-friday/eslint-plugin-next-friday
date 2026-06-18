import rule from "../../src/rules/test-filename.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("test-filename", rule, {
  valid: [
    {
      name: "describe in .test.ts file",
      filename: "/src/features/user/user.test.ts",
      code: `describe("user", () => {});`,
    },
    {
      name: "it in .test.ts file",
      filename: "/src/features/user/user.test.ts",
      code: `it("works", () => {});`,
    },
    {
      name: "test in .test.tsx file",
      filename: "/src/features/user/UserCard.test.tsx",
      code: `test("renders", () => {});`,
    },
    {
      name: "beforeEach in .test.ts file",
      filename: "/src/utils/format.test.ts",
      code: `beforeEach(() => {});`,
    },
    {
      name: "non-test code in any file",
      filename: "/src/utils/format.ts",
      code: `export function formatDate(d: Date) { return d.toISOString(); }`,
    },
    {
      name: "non-test function calls in plain .ts file",
      filename: "/src/utils/format.ts",
      code: `console.log("hello");`,
    },
    {
      name: "call on a non-identifier callee root in plain .ts file",
      filename: "/src/utils/format.ts",
      code: `"value".concat("suffix");`,
    },
  ],
  invalid: [
    {
      name: "describe in .spec.ts file",
      filename: "/src/features/user/user.spec.ts",
      code: `describe("user", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "it in plain .ts file",
      filename: "/src/features/user/user-tests.ts",
      code: `it("works", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "test in plain .ts file",
      filename: "/src/features/user/user.ts",
      code: `test("works", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "beforeAll in non-test file",
      filename: "/src/setup.ts",
      code: `beforeAll(() => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "report only once even with multiple test calls",
      filename: "/src/features/user/user.spec.ts",
      code: `describe("a", () => {}); describe("b", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "describe.only member-expression call in plain .ts file",
      filename: "/src/foo.ts",
      code: `describe.only("x", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "it.skip member-expression call in plain .ts file",
      filename: "/src/foo.ts",
      code: `it.skip("x", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
    {
      name: "test.each chained call in plain .ts file",
      filename: "/src/foo.ts",
      code: `test.each([])("x", () => {});`,
      errors: [{ messageId: "requireTestFilename" }],
    },
  ],
});
