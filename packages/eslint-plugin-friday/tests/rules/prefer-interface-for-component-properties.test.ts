import rule from "../../src/rules/prefer-interface-for-component-properties.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("prefer-interface-for-component-properties", rule, {
  valid: [
    {
      name: "interface props",
      code: "interface FooProps { x: number }",
      filename: "Comp.tsx",
    },
    {
      name: "intersection type alias",
      code: "type FooProps = OtherProps & { x: number };",
      filename: "Comp.tsx",
    },
    {
      name: "object type alias without Props suffix",
      code: "type Theme = { dark: boolean };",
      filename: "Comp.tsx",
    },
    {
      name: "union type alias",
      code: "type Variant = 'a' | 'b';",
      filename: "Comp.tsx",
    },
    {
      name: "reference type alias",
      code: "type FooProps = ReactNode;",
      filename: "Comp.tsx",
    },
    {
      name: "object type alias in .ts file",
      code: "type FooProps = { x: number };",
      filename: "Comp.ts",
    },
    {
      name: "object type alias in plain ts file",
      code: "type ButtonProps = { label: string };",
      filename: "utils.ts",
    },
  ],
  invalid: [
    {
      name: "object type alias with Props suffix",
      code: "type FooProps = { x: number };",
      filename: "Comp.tsx",
      errors: [{ messageId: "preferInterface" }],
      output: "interface FooProps { x: number }",
    },
    {
      name: "Props type alias",
      code: "type Props = { trigger: ReactNode };",
      filename: "StorePopover.tsx",
      errors: [{ messageId: "preferInterface" }],
      output: "interface Props { trigger: ReactNode }",
    },
    {
      name: "exported object type alias",
      code: "export type FooProps = { x: number };",
      filename: "Comp.tsx",
      errors: [{ messageId: "preferInterface" }],
      output: "export interface FooProps { x: number }",
    },
    {
      name: "generic object type alias",
      code: "type FooProps<T> = { value: T };",
      filename: "Comp.tsx",
      errors: [{ messageId: "preferInterface" }],
      output: "interface FooProps<T> { value: T }",
    },
    {
      name: "object type alias with multiple members",
      code: "type FooProps = { x: number; y: string };",
      filename: "Comp.tsx",
      errors: [{ messageId: "preferInterface" }],
      output: "interface FooProps { x: number; y: string }",
    },
    {
      name: "object type alias with trailing empty statement",
      code: "type FooProps = { x: number };;",
      filename: "Comp.tsx",
      errors: [{ messageId: "preferInterface" }],
      output: "interface FooProps { x: number }",
    },
  ],
});
