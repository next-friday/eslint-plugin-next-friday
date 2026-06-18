import rule from "../../src/rules/jsx-no-data-array.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-no-data-array", rule, {
  valid: [
    {
      name: "primitive constant",
      code: "const TIMEOUT_MS = 1000;",
      filename: "Component.tsx",
    },
    {
      name: "array of string primitives",
      code: 'const labels = ["Home", "About", "Contact"];',
      filename: "Component.tsx",
    },
    {
      name: "array of number primitives",
      code: "const numbers = [1, 2, 3];",
      filename: "Component.tsx",
    },
    {
      name: "flat map of primitives",
      code: 'const ROUTES = { home: "/", about: "/about" };',
      filename: "Component.tsx",
    },
    {
      name: "array of objects in non-jsx file is allowed",
      code: 'const stores = [{ name: "x" }, { name: "y" }];',
      filename: "utils.ts",
    },
    {
      name: "array of objects in plain ts file is allowed",
      code: 'const stores = [{ name: "x" }];',
      filename: "data.ts",
    },
    {
      name: "sparse array of only holes",
      code: "const holes = [, ,];",
      filename: "Component.tsx",
    },
    {
      name: "array of only spread elements",
      code: "const spread = [...other];",
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "array of single object literal in tsx",
      code: 'const stores = [{ name: "Koh Samui" }];',
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "stores" } }],
    },
    {
      name: "array of multiple object literals in tsx",
      code: 'const stores = [{ name: "x" }, { name: "y" }];',
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "stores" } }],
    },
    {
      name: "typed array of object literals",
      code: "const items: Item[] = [{ id: 1 }];",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "items" } }],
    },
    {
      name: "as const assertion",
      code: "const items = [{ id: 1 }] as const;",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "items" } }],
    },
    {
      name: "satisfies expression",
      code: "const items = [{ id: 1 }] satisfies readonly { id: number }[];",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "items" } }],
    },
    {
      name: "exported array of object literals",
      code: "export const items = [{ id: 1 }];",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "items" } }],
    },
    {
      name: "jsx file is checked too",
      code: 'const stores = [{ name: "x" }];',
      filename: "Component.jsx",
      errors: [{ messageId: "noDataArray", data: { name: "stores" } }],
    },
    {
      name: "sparse array with an object literal",
      code: "const items = [, { id: 1 }];",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "items" } }],
    },
    {
      name: "array with a spread before an object literal",
      code: "const items = [...other, { id: 1 }];",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "items" } }],
    },
    {
      name: "destructured declarator names the array as destructured",
      code: "const [first] = [{ id: 1 }];",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataArray", data: { name: "<destructured>" } }],
    },
  ],
});
