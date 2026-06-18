import rule from "../../src/rules/no-logic-in-parameters.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-logic-in-parameters", rule, {
  valid: [
    "functionFoo(bar);",
    "functionFoo(42);",
    "functionFoo('string');",
    "functionFoo(true);",
    "const foo = bar ?? baz; functionFoo(foo);",
    "const result = condition ? value1 : value2; functionFoo(result);",
    "const checked = a && b; functionFoo(checked);",
    "functionFoo({ a: 1, b: 2 });",
    "functionFoo([1, 2, 3]);",
    "functionFoo(['a', 'b', 'c']);",
    "functionFoo([foo, bar]);",
    "functionFoo([foo.bar, baz]);",
    "functionFoo(getSomeValue());",
    "functionFoo(obj.method());",
    "functionFoo(obj.prop);",
    "functionFoo(obj.nested.prop);",
    "functionFoo(a + b);",
    "functionFoo(a * b);",
    "functionFoo(a - b);",
    "functionFoo(a / b);",
    `functionFoo(\`hello \${world}\`);`,
    "functionFoo(...args);",
    "functionFoo(bar, baz);",
    "const x = a || b; functionFoo(x, y);",
    "new MyClass(value);",
    "new MyClass(obj.prop);",
    {
      code: 'cn(isActive && "active");',
      options: [{ allow: ["cn"] }],
    },
    {
      code: "i18n.t(isError ? a : b);",
      options: [{ allow: ["t"] }],
    },
    {
      code: "new Thing(x ? y : z);",
      options: [{ allow: ["Thing"] }],
    },
  ],
  invalid: [
    {
      code: 'cn(isActive && "active");',
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "render(a && b);",
      options: [{ allow: ["cn"] }],
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: 'handlers["run"](a && b);',
      options: [{ allow: ["cn"] }],
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "handlers[run](a && b);",
      options: [{ allow: ["run"] }],
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(bar ?? baz);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(condition ? value1 : value2);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a && b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a || b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a === b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a !== b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a == b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a != b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    { code: "functionFoo(a > b);", errors: [{ messageId: "noLogicInParams" }] },
    { code: "functionFoo(a < b);", errors: [{ messageId: "noLogicInParams" }] },
    {
      code: "functionFoo(a >= b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(a <= b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(!value);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo('key' in obj);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(obj instanceof MyClass);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(bar, a ?? b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "new MyClass(a || b);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(condition1 ? value1 : condition2 ? value2 : value3);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo((a && b) || c);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo([condition ? value1 : value2]);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo([a && b]);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo([a || b]);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo(['a', condition ? 'b' : 'c', 'd']);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo([a === b]);",
      errors: [{ messageId: "noLogicInParams" }],
    },
    {
      code: "functionFoo([!value]);",
      errors: [{ messageId: "noLogicInParams" }],
    },
  ],
});
