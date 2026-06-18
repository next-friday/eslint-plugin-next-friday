import rule from "../../src/rules/index-export-only.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("index-export-only", rule, {
  valid: [
    {
      name: "should allow named re-export from another module",
      code: `export { cn } from "./cn";`,
      filename: "index.ts",
    },
    {
      name: "should allow star re-export",
      code: `export * from "./types";`,
      filename: "index.ts",
    },
    {
      name: "should allow namespace re-export",
      code: `export * as utils from "./utils";`,
      filename: "index.ts",
    },
    {
      name: "should allow type re-export",
      code: `export type { Props } from "./props";`,
      filename: "index.ts",
    },
    {
      name: "should allow default re-export",
      code: `export { default } from "./button";`,
      filename: "index.ts",
    },
    {
      name: "should allow renamed default re-export",
      code: `export { foo as default } from "./foo";`,
      filename: "index.ts",
    },
    {
      name: "should allow import followed by specifier-only export",
      code: `
import { cn } from "./cn";

export { cn };
`,
      filename: "index.ts",
    },
    {
      name: "should allow default export of imported identifier",
      code: `
import button from "./button";

export default button;
`,
      filename: "index.ts",
    },
    {
      name: "should allow top-level type alias declaration",
      code: `
type Foo = string;

export type { Foo };
`,
      filename: "index.ts",
    },
    {
      name: "should allow top-level interface declaration",
      code: `
interface Bar {
  id: string;
}

export type { Bar };
`,
      filename: "index.ts",
    },
    {
      name: "should allow exported type alias declaration",
      code: `export type Foo = string;`,
      filename: "index.ts",
    },
    {
      name: "should allow exported interface declaration",
      code: `export interface Bar { id: string; }`,
      filename: "index.ts",
    },
    {
      name: "should allow empty file",
      code: ``,
      filename: "index.ts",
    },
    {
      name: "should allow side-effect imports",
      code: `import "./side-effect";`,
      filename: "index.ts",
    },
    {
      name: "should allow string directive prologue",
      code: `
"use strict";

export { cn } from "./cn";
`,
      filename: "index.ts",
    },
    {
      name: "should allow string directive prologue in tsx",
      code: `
"use strict";

export { cn } from "./cn";
`,
      filename: "index.tsx",
    },
    {
      name: "should not lint non-index files",
      code: `
function cn() {
  return "x";
}

export { cn };
`,
      filename: "src/utils/cn.ts",
    },
    {
      name: "should not lint files like index.test.ts",
      code: `
function cn() {
  return "x";
}

export { cn };
`,
      filename: "index.test.ts",
    },
  ],
  invalid: [
    {
      name: "should reject local function declaration",
      code: `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { cn };
`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject local variable declaration",
      code: `
const value = 42;

export { value };
`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject local class declaration",
      code: `
class Service {}

export { Service };
`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject inline named const export",
      code: `export const foo = 1;`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject inline named function export",
      code: `export function bar() { return 1; }`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject inline named class export",
      code: `export class Baz {}`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject inline anonymous default function",
      code: `export default function() { return 1; }`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject inline anonymous default class",
      code: `export default class {}`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject inline default literal",
      code: `export default 42;`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject top-level expression statements",
      code: `console.log("side effect");`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should reject top-level control flow",
      code: `
if (process.env.NODE_ENV === "production") {
  console.log("prod");
}
`,
      filename: "index.ts",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should report each disallowed statement",
      code: `
function helper() {}

class Service {}

const value = 1;
`,
      filename: "index.ts",
      errors: [
        { messageId: "indexExportOnly" },
        { messageId: "indexExportOnly" },
        { messageId: "indexExportOnly" },
      ],
    },
    {
      name: "should lint index.tsx files",
      code: `
function cn() {
  return "x";
}

export { cn };
`,
      filename: "index.tsx",
      errors: [{ messageId: "indexExportOnly" }],
    },
    {
      name: "should lint index.js files",
      code: `
function cn() {
  return "x";
}

export { cn };
`,
      filename: "index.js",
      errors: [{ messageId: "indexExportOnly" }],
    },
  ],
});
