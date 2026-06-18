import rule from "../../src/rules/boolean-naming.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("boolean-naming", rule, {
  valid: [
    {
      name: "allow-listed boolean name",
      code: "const loading = true;",
      options: [{ allow: ["loading"] }],
    },
    { name: "is prefix with true", code: "const isValid = true;" },
    { name: "has prefix with false", code: "const hasUser = false;" },
    { name: "can prefix", code: "const canSubmit = true;" },
    { name: "should prefix", code: "const shouldRender = false;" },
    { name: "did prefix", code: "const didLoad = true;" },
    { name: "will prefix", code: "const willUpdate = false;" },
    { name: "was prefix", code: "const wasActive = true;" },
    { name: "are prefix with comparison", code: "const areEqual = a === b;" },
    { name: "does prefix", code: "const doesExist = items.length > 0;" },
    { name: "had prefix", code: "const hadError = false;" },
    {
      name: "is prefix with boolean type annotation",
      code: "const isActive: boolean = true;",
    },
    {
      name: "has prefix with boolean type annotation",
      code: "const hasPermission: boolean = checkPermission();",
    },
    { name: "non-boolean string variable", code: "const name = 'John';" },
    { name: "non-boolean number variable", code: "const count = 42;" },
    {
      name: "non-boolean function call result",
      code: "const user = getUser();",
    },
    { name: "non-boolean array", code: "const items = [1, 2, 3];" },
    { name: "non-boolean object", code: "const config = { key: 'value' };" },
    { name: "arithmetic expression", code: "const result = a + b;" },
    { name: "string concatenation", code: "const message = 'Hello ' + name;" },
    {
      name: "function param with is prefix and boolean type",
      code: "function process(isEnabled: boolean) {}",
    },
    {
      name: "arrow function param with has prefix",
      code: "const fn = (hasAccess: boolean) => {};",
    },
    {
      name: "default param with is prefix",
      code: "function toggle(isActive = true) {}",
    },
    {
      name: "arrow default param with can prefix",
      code: "const fn = (canEdit = false) => {};",
    },
    {
      name: "negation expression with is prefix",
      code: "const isEmpty = !items.length;",
    },
    {
      name: "comparison expression with is prefix",
      code: "const isEqual = a === b;",
    },
    {
      name: "logical AND with has prefix",
      code: "const hasItems = items && items.length > 0;",
    },
    {
      name: "logical OR with is prefix",
      code: "const isValidOrDefault = valid || defaultValue;",
    },
    {
      name: "in operator with is prefix",
      code: "const isInArray = 'key' in obj;",
    },
    {
      name: "instanceof with is prefix",
      code: "const isInstance = obj instanceof MyClass;",
    },
    {
      name: "object destructuring declarator is skipped",
      code: "const { valid } = obj;",
    },
    {
      name: "array destructuring declarator is skipped",
      code: "const [active] = items;",
    },
    {
      name: "object pattern param is skipped",
      code: "function process({ active }) {}",
    },
    {
      name: "array pattern param is skipped",
      code: "const fn = ([enabled]) => {};",
    },
  ],
  invalid: [
    {
      name: "boolean literal without prefix",
      code: "const valid = true;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "valid", suggestedName: "Valid" },
        },
      ],
    },
    {
      name: "false literal without prefix",
      code: "const user = false;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "user", suggestedName: "User" },
        },
      ],
    },
    {
      name: "boolean type annotation without prefix",
      code: "const active: boolean = true;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "active", suggestedName: "Active" },
        },
      ],
    },
    {
      name: "boolean type without prefix even with function call",
      code: "const enabled: boolean = checkEnabled();",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "enabled", suggestedName: "Enabled" },
        },
      ],
    },
    {
      name: "comparison expression without prefix",
      code: "const equal = a === b;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "equal", suggestedName: "Equal" },
        },
      ],
    },
    {
      name: "not equal comparison without prefix",
      code: "const different = a !== b;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "different", suggestedName: "Different" },
        },
      ],
    },
    {
      name: "greater than without prefix",
      code: "const bigger = a > b;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "bigger", suggestedName: "Bigger" },
        },
      ],
    },
    {
      name: "less than without prefix",
      code: "const smaller = a < b;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "smaller", suggestedName: "Smaller" },
        },
      ],
    },
    {
      name: "negation without prefix",
      code: "const negated = !value;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "negated", suggestedName: "Negated" },
        },
      ],
    },
    {
      name: "logical AND without prefix",
      code: "const combined = a && b;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "combined", suggestedName: "Combined" },
        },
      ],
    },
    {
      name: "logical OR without prefix",
      code: "const either = a || b;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "either", suggestedName: "Either" },
        },
      ],
    },
    {
      name: "in operator without prefix",
      code: "const exists = 'key' in obj;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "exists", suggestedName: "Exists" },
        },
      ],
    },
    {
      name: "instanceof without prefix",
      code: "const instance = obj instanceof MyClass;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "instance", suggestedName: "Instance" },
        },
      ],
    },
    {
      name: "function param without prefix",
      code: "function process(active: boolean) {}",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "active", suggestedName: "Active" },
        },
      ],
    },
    {
      name: "arrow function param without prefix",
      code: "const fn = (enabled: boolean) => {};",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "enabled", suggestedName: "Enabled" },
        },
      ],
    },
    {
      name: "default param without prefix",
      code: "function toggle(active = true) {}",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "active", suggestedName: "Active" },
        },
      ],
    },
    {
      name: "arrow function default param without prefix",
      code: "const fn = (enabled = false) => {};",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "enabled", suggestedName: "Enabled" },
        },
      ],
    },
    {
      name: "function expression param without prefix",
      code: "const fn = function(visible: boolean) {};",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "visible", suggestedName: "Visible" },
        },
      ],
    },
    {
      name: "open without prefix",
      code: "const open = true;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "open", suggestedName: "Open" },
        },
      ],
    },
    {
      name: "closed without prefix",
      code: "const closed = false;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "closed", suggestedName: "Closed" },
        },
      ],
    },
    {
      name: "SCREAMING_SNAKE_CASE boolean literal",
      code: "const IS_ACTIVE = false;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "IS_ACTIVE", suggestedName: "IS_ACTIVE" },
        },
      ],
    },
    {
      name: "SCREAMING_SNAKE_CASE boolean expression",
      code: "const HAS_ITEMS = items.length > 0;",
      errors: [
        {
          messageId: "missingPrefix",
          data: { name: "HAS_ITEMS", suggestedName: "HAS_ITEMS" },
        },
      ],
    },
  ],
});
