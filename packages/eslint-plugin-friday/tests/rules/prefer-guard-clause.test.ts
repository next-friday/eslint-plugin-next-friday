import rule from "../../src/rules/prefer-guard-clause.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("prefer-guard-clause", rule, {
  valid: [
    {
      name: "guard clauses with early returns - allowed",
      code: `
function process(data) {
  if (!data) return [];
  if (!data.items) return [];
  return data.items.map(toItem);
}
      `.trim(),
    },
    {
      name: "multiple guard clauses - allowed",
      code: `
function validate(input) {
  if (!input) return false;
  if (!input.name) return false;
  if (!input.email) return false;
  return true;
}
      `.trim(),
    },
    {
      name: "if with multiple statements (no nested if) - allowed",
      code: `
if (condition) {
  doA();
  doB();
}
      `.trim(),
    },
    {
      name: "if with other statements before nested if - allowed",
      code: `
if (a) {
  doSomething();
  if (b) {
    doSomethingElse();
  }
}
      `.trim(),
    },
    {
      name: "simple single-line if - allowed",
      code: `if (condition) doSomething();`,
    },
  ],
  invalid: [
    {
      name: "nested if statements - disallowed",
      code: `
function process(data) {
  if (data) {
    if (data.items) {
      return data.items.map(toItem);
    }
  }
  return [];
}
      `.trim(),
      errors: [{ messageId: "preferGuardClause" }],
    },
    {
      name: "nested if with single statement - disallowed",
      code: `
if (a) {
  if (b) {
    doSomething();
  }
}
      `.trim(),
      errors: [{ messageId: "preferGuardClause" }],
    },
    {
      name: "nested if checking property - disallowed",
      code: `
if (user) {
  if (user.isAdmin) {
    return adminDashboard();
  }
}
      `.trim(),
      errors: [{ messageId: "preferGuardClause" }],
    },
    {
      name: "blockless if directly nesting another if - disallowed",
      code: `if (a) if (b) doSomething();`,
      errors: [{ messageId: "preferGuardClause" }],
    },
  ],
});
