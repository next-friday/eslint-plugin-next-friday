import rule from "../../src/rules/sort-exports.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("sort-exports", rule, {
  valid: [
    {
      name: "correct order: all 3 groups",
      code: `
export { foo } from "@/lib/foo";
export { bar } from "../bar";
export { baz };`,
    },
    {
      name: "single local export",
      code: `export { foo };`,
    },
    {
      name: "all same group (external re-exports)",
      code: `
export { foo } from "react";
export { bar } from "@scope/pkg";`,
    },
    {
      name: "all relative re-exports",
      code: `
export { foo } from "../foo";
export { bar } from "./bar";`,
    },
    {
      name: "all local exports",
      code: `
export { foo };
export { bar };`,
    },
    {
      name: "non-contiguous exports reset context",
      code: `
export { foo } from "react";

const x = 1;

export { bar };`,
    },
    {
      name: "export default is skipped",
      code: `
export default function main() {}
export { foo };`,
    },
    {
      name: "export all is skipped (breaks contiguity)",
      code: `
export * from "react";
export { foo };`,
    },
    {
      name: "alias re-exports then relative",
      code: `
export { utils } from "@/lib/utils";
export { helpers } from "~/helpers";
export { foo } from "./foo";`,
    },
    {
      name: "export declaration breaks contiguity, remaining is valid",
      code: `
export const x = 1;
export { foo } from "./foo";
export { bar };`,
    },
  ],
  invalid: [
    {
      name: "skips autofix when a comment is present",
      code: `
export { bar };
// re-export foo from react
export { foo } from "react";`,
      errors: [{ messageId: "unsortedExports" }],
    },
    {
      name: "local before external re-export",
      code: `
export { bar };
export { foo } from "react";`,
      output: `
export { foo } from "react";
export { bar };`,
      errors: [{ messageId: "unsortedExports" }],
    },
    {
      name: "local before relative re-export",
      code: `
export { bar };
export { foo } from "../foo";`,
      output: `
export { foo } from "../foo";
export { bar };`,
      errors: [{ messageId: "unsortedExports" }],
    },
    {
      name: "relative re-export before external re-export",
      code: `
export { bar } from "../bar";
export { foo } from "react";`,
      output: `
export { foo } from "react";
export { bar } from "../bar";`,
      errors: [{ messageId: "unsortedExports" }],
    },
    {
      name: "local then relative then external (reports first violation)",
      code: `
export { baz };
export { bar } from "../bar";
export { foo } from "react";`,
      output: `
export { foo } from "react";
export { bar } from "../bar";
export { baz };`,
      errors: [{ messageId: "unsortedExports" }],
    },
  ],
});
