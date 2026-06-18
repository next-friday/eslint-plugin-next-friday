import rule from "../../src/rules/jsx-no-data-object.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-no-data-object", rule, {
  valid: [
    {
      name: "primitive constant",
      code: "const TIMEOUT_MS = 1000;",
      filename: "Component.tsx",
    },
    {
      name: "flat object map of primitives",
      code: 'const ROUTES = { home: "/", about: "/about", contact: "/contact" };',
      filename: "Component.tsx",
    },
    {
      name: "flat array of primitives",
      code: 'const labels = ["Home", "About"];',
      filename: "Component.tsx",
    },
    {
      name: "empty object",
      code: "const empty = {};",
      filename: "Component.tsx",
    },
    {
      name: "object of mixed primitives",
      code: 'const config = { a: 1, b: "x", c: true };',
      filename: "Component.tsx",
    },
    {
      name: "nested object in non-jsx file is allowed",
      code: 'const config = { home: { url: "/" } };',
      filename: "utils.ts",
    },
    {
      name: "object with only a spread element",
      code: "const config = { ...base };",
      filename: "Component.tsx",
    },
    {
      name: "object property with an assignment-pattern value",
      code: "const config = { a = 1 };",
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "nested object literal value",
      code: 'const config = { home: { url: "/" } };',
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "array of objects as value",
      code: "const config = { items: [{ id: 1 }] };",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "nested array as value",
      code: "const config = { matrix: [[1, 2], [3, 4]] };",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "as const assertion",
      code: "const config = { a: { b: 1 } } as const;",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "satisfies expression",
      code: "const config = { a: { b: 1 } } satisfies Record<string, unknown>;",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "exported nested object",
      code: "export const config = { a: { b: 1 } };",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "jsx file is checked too",
      code: "const config = { a: { b: 1 } };",
      filename: "Component.jsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "spread element precedes a nested object property",
      code: 'const config = { ...base, nav: { url: "/" } };',
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "assignment-pattern value precedes a nested object property",
      code: 'const config = { a = 1, nav: { url: "/" } };',
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "array value with a hole before a nested object element",
      code: "const config = { items: [, { id: 1 }] };",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "array value with a spread before a nested object element",
      code: "const config = { items: [...rest, { id: 1 }] };",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "config" } }],
    },
    {
      name: "destructured declarator id reports as <destructured>",
      code: "const { nav } = { a: { b: 1 } };",
      filename: "Component.tsx",
      errors: [{ messageId: "noDataObject", data: { name: "<destructured>" } }],
    },
  ],
});
