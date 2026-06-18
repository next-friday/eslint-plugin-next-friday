import rule from "../../src/rules/type-declaration-order.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("type-declaration-order", rule, {
  valid: [
    {
      name: "consumer before dependency (interface)",
      code: `
interface Foo {
  bar: Baz;
}
interface Baz {
  baz: string;
}`,
    },
    {
      name: "nested consumers before dependencies",
      code: `
interface Parent {
  child: Child;
}
interface Child {
  grandchild: Grandchild;
}
interface Grandchild {
  value: string;
}`,
    },
    {
      name: "consumer before dependency (type alias)",
      code: `
type Props = {
  config: Config;
};
type Config = {
  theme: string;
};`,
    },
    {
      name: "no referenced local types",
      code: `
interface Props {
  name: string;
  age: number;
}`,
    },
    {
      name: "external type reference",
      code: `
interface Props {
  items: ExternalType[];
}`,
    },
    {
      name: "consumer before dependency with wrapper type",
      code: `
interface Props {
  data: Readonly<Item>;
}
interface Item {
  id: number;
}`,
    },
    {
      name: "independent declarations",
      code: `
interface Foo {
  bar: string;
}
interface Baz {
  qux: string;
}`,
    },
    {
      name: "generic type parameter shadowing a declared type name",
      code: `
interface T {
  x: string;
}
interface Container<T> {
  value: T;
}`,
    },
    {
      name: "qualified name type reference (non-identifier typeName)",
      code: `
interface Props {
  data: NS.Item;
}`,
    },
    {
      name: "self-referential interface declared in valid order",
      code: `
interface Node {
  next: Node;
}`,
    },
  ],
  invalid: [
    {
      name: "dependency before consumer (interface)",
      code: `
interface Baz {
  baz: string;
}
interface Foo {
  bar: Baz;
}`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "Baz", consumer: "Foo" },
        },
      ],
    },
    {
      name: "dependency before consumer (type alias)",
      code: `
type Config = {
  theme: string;
};
type Props = {
  config: Config;
};`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "Config", consumer: "Props" },
        },
      ],
    },
    {
      name: "child declared before parent",
      code: `
interface Child {
  value: string;
}
interface Parent {
  child: Child;
}`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "Child", consumer: "Parent" },
        },
      ],
    },
    {
      name: "wrapper type dependency before consumer",
      code: `
interface Item {
  id: number;
}
interface Props {
  data: Readonly<Item>;
}`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "Item", consumer: "Props" },
        },
      ],
    },
    {
      name: "multiple dependencies before consumer",
      code: `
interface A {
  value: string;
}
interface B {
  value: number;
}
interface C {
  a: A;
  b: B;
}`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "A", consumer: "C" },
        },
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "B", consumer: "C" },
        },
      ],
    },
    {
      name: "type alias dependency before interface consumer",
      code: `
type Item = {
  id: number;
};
interface Props {
  items: Item[];
}`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "Item", consumer: "Props" },
        },
      ],
    },
    {
      name: "same dependency referenced twice reports once",
      code: `
interface Dep {
  x: string;
}
interface Consumer {
  a: Dep;
  b: Dep;
}`,
      errors: [
        {
          messageId: "dependencyBeforeConsumer",
          data: { dependency: "Dep", consumer: "Consumer" },
        },
      ],
    },
  ],
});
