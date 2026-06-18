import rule from "../../src/rules/properties-suffix.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("properties-suffix", rule, {
  valid: [
    {
      name: "allow-listed type name",
      code: `interface Theme {}`,
      filename: "Button.tsx",
      options: [{ allow: ["Theme"] }],
    },
    {
      name: "interface with Props suffix",
      code: `interface ButtonProps {}`,
      filename: "Button.tsx",
    },
    {
      name: "interface with StylesProps suffix",
      code: `interface ButtonStylesProps {}`,
      filename: "Button.tsx",
    },
    {
      name: "type with Props suffix",
      code: `type CardProps = { title: string }`,
      filename: "Card.tsx",
    },
    {
      name: "interface with properties",
      code: `interface HeaderProps { title: string }`,
      filename: "Header.tsx",
    },
    {
      name: "any name in non-component files",
      code: `interface Button {}`,
      filename: "button.ts",
    },
    {
      name: "any type name in .ts files",
      code: `type ButtonType = {}`,
      filename: "types.ts",
    },
    {
      name: "union types without Props suffix",
      code: `type Status = "active" | "inactive"`,
      filename: "Button.tsx",
    },
    {
      name: "type aliases referencing other types",
      code: `type ButtonState = SomeOtherType`,
      filename: "Button.tsx",
    },
    {
      name: "function type aliases",
      code: `type Callback = () => void`,
      filename: "Button.tsx",
    },
  ],
  invalid: [
    {
      name: "interface without Props suffix",
      code: `interface Button {}`,
      filename: "Button.tsx",
      errors: [
        {
          messageId: "missingPropsSuffix",
          data: { name: "Button", suggestion: "ButtonProps" },
        },
      ],
    },
    {
      name: "interface with properties but no Props suffix",
      code: `interface Card { title: string }`,
      filename: "Card.tsx",
      errors: [
        {
          messageId: "missingPropsSuffix",
          data: { name: "Card", suggestion: "CardProps" },
        },
      ],
    },
    {
      name: "type literal without Props suffix",
      code: `type ButtonType = { disabled: boolean }`,
      filename: "Button.tsx",
      errors: [
        {
          messageId: "missingPropsSuffix",
          data: { name: "ButtonType", suggestion: "ButtonTypeProps" },
        },
      ],
    },
    {
      name: "applies to JSX files too",
      code: `interface Header {}`,
      filename: "Header.jsx",
      errors: [
        {
          messageId: "missingPropsSuffix",
          data: { name: "Header", suggestion: "HeaderProps" },
        },
      ],
    },
    {
      name: "multiple interfaces",
      code: `interface Button {}\ninterface Card {}`,
      filename: "Components.tsx",
      errors: [
        {
          messageId: "missingPropsSuffix",
          data: { name: "Button", suggestion: "ButtonProps" },
        },
        {
          messageId: "missingPropsSuffix",
          data: { name: "Card", suggestion: "CardProps" },
        },
      ],
    },
  ],
});
