import rule from "../../src/rules/no-emoji.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-emoji", rule, {
  valid: [
    {
      name: "should allow regular text without emoji",
      code: `const message = "Hello World";`,
    },
    {
      name: "should allow console logs without emoji",
      code: `console.log("Testing functionality");`,
    },
    {
      name: "should allow functions without emoji",
      code: `function test() { return "success"; }`,
    },
    {
      name: "should allow comments without emoji",
      code: `// This is a comment without emoji`,
    },
    {
      name: "should allow objects without emoji",
      code: `const obj = { key: "value" };`,
    },
  ],
  invalid: [
    {
      name: "should disallow string with grinning face emoji",
      code: `const message = "Hello 😀 World";`,
      errors: [{ messageId: "noEmoji", line: 1, column: 24 }],
    },
    {
      name: "should disallow console log with rocket emoji",
      code: `console.log("Testing 🚀 functionality");`,
      errors: [{ messageId: "noEmoji", line: 1, column: 22 }],
    },
    {
      name: "should disallow comments with emoji",
      code: `// This is a comment with 💯 emoji`,
      errors: [{ messageId: "noEmoji", line: 1, column: 27 }],
    },
    {
      name: "should disallow object values with emoji",
      code: `const obj = { key: "🔑 value" };`,
      errors: [{ messageId: "noEmoji", line: 1, column: 21 }],
    },
    {
      name: "should disallow multiline strings with emoji",
      code: `const multiline = \`
        Line 1 without emoji
        Line 2 with 🎉 emoji
        Line 3 without emoji
      \`;`,
      errors: [{ messageId: "noEmoji", line: 3, column: 21 }],
    },
    {
      name: "should detect multiple emojis in single string",
      code: `const multiple = "First 🚀 Second 🎯 Third";`,
      errors: [
        { messageId: "noEmoji", line: 1, column: 25 },
        { messageId: "noEmoji", line: 1, column: 35 },
      ],
    },
  ],
});
