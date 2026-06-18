import rule from "../../src/rules/no-inline-nested-object.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("no-inline-nested-object", rule, {
  valid: [
    {
      name: "data declaration with primitive values is allowed",
      code: `
const obj = {
  a: true,
  b: "sm",
};
        `,
    },
    {
      name: "data declaration with inline array of objects is allowed",
      code: `
const obj = {
  items: [{ a: 1 }, { b: 2 }],
};
        `,
    },
    {
      name: "data declaration with inline nested arrays is allowed",
      code: `
const obj = {
  matrix: [[1, 2], [3, 4]],
};
        `,
    },
    {
      name: "data declaration with deeply nested inline object is allowed",
      code: `
const obj = {
  layer: { inner: { leaf: 1 } },
};
        `,
    },
    {
      name: "data declaration with nested array inside object is allowed",
      code: `
const obj = {
  wrap: { items: [1, 2, 3] },
};
        `,
    },
    {
      name: "data declaration with array of wrapper objects is allowed",
      code: `
const dependencyRules = [
  { from: source.modules, allow: [{ to: { type: "templates" } }] },
];
        `,
    },
    {
      name: "inline flat object value in declaration is allowed",
      code: `
const obj = {
  config: { enabled: true, timeout: 5000 },
};
        `,
    },
    {
      name: "function call with empty object is allowed",
      code: `
useState({});
        `,
    },
    {
      name: "function call with flat object is allowed",
      code: `
useState({ a: 1, b: 2 });
        `,
    },
    {
      name: "function call with flat array is allowed",
      code: `
useState([1, 2, 3]);
        `,
    },
    {
      name: "function call with multiline nested object is allowed",
      code: `
useState({
  a: { b: 1 },
});
        `,
    },
    {
      name: "return statement with flat object is allowed",
      code: `
function getConfig() {
  return { enabled: true };
}
        `,
    },
    {
      name: "return statement with multiline nested object is allowed",
      code: `
function getConfig() {
  return {
    nested: { value: 1 },
  };
}
        `,
    },
    {
      name: "arrow implicit return with flat object is allowed",
      code: `
const factory = () => ({ enabled: true });
        `,
    },
    {
      name: "bare return without argument is allowed",
      code: `
function noop() {
  return;
}
        `,
    },
    {
      name: "function call with primitive argument is allowed",
      code: `
useState(5);
        `,
    },
    {
      name: "new expression with primitive argument is allowed",
      code: `
new Thing("config");
        `,
    },
    {
      name: "arrow implicit return with primitive is allowed",
      code: `
const factory = () => 5;
        `,
    },
    {
      name: "function call with spread argument is allowed",
      code: `
f(...items);
        `,
    },
    {
      name: "arrow with block body is allowed",
      code: `
const factory = () => {
  doThing();
};
        `,
    },
    {
      name: "JSX expression container with empty expression is allowed",
      code: `
const el = <Comp>{/* placeholder */}</Comp>;
        `,
    },
  ],
  invalid: [
    {
      name: "function call argument with inline nested object is reported",
      code: `
useState({ a: { b: 1 } });
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
useState({
  a: { b: 1 },
});
        `,
    },
    {
      name: "function call argument with inline array of objects is reported",
      code: `
doThing([{ a: 1 }, { b: 2 }]);
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
doThing([
  { a: 1 },
  { b: 2 },
]);
        `,
    },
    {
      name: "new expression argument with inline nested object is reported",
      code: `
new Thing({ config: { enabled: true } });
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
new Thing({
  config: { enabled: true },
});
        `,
    },
    {
      name: "return statement with inline nested object is reported",
      code: `
function build() {
  return { user: { id: 1 } };
}
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
function build() {
  return {
    user: { id: 1 },
  };
}
        `,
    },
    {
      name: "arrow implicit return with inline nested object is reported",
      code: `
const factory = () => ({ a: { b: 1 } });
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
const factory = () => ({
  a: { b: 1 },
});
        `,
    },
    {
      name: "JSX attribute with inline nested object is reported",
      code: `
const el = <Comp prop={{ a: { b: 1 } }} />;
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
const el = <Comp prop={{
  a: { b: 1 },
}} />;
        `,
    },
    {
      name: "inline nested object fix preserves inter-element comments",
      code: `
f({ a: 1, /* keep me */ nested: { b: 2 } });
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
f({
  a: 1,
  /* keep me */
  nested: { b: 2 },
});
        `,
    },
    {
      name: "inline nested object fix preserves trailing comment before close",
      code: `
f({ a: 1, nested: { b: 2 } /* trailing */ });
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
f({
  a: 1,
  nested: { b: 2 },
  /* trailing */
});
        `,
    },
    {
      name: "inline nested array fix preserves trailing comment before close",
      code: `
f([[1], [2] /* trailing */]);
        `,
      errors: [{ messageId: "requireMultiline" }],
      output: `
f([
  [1],
  [2],
  /* trailing */
]);
        `,
    },
  ],
});
