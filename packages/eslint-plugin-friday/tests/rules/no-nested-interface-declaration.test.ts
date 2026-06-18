import rule from "../../src/rules/no-nested-interface-declaration.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-nested-interface-declaration", rule, {
  valid: [
    {
      code: `
        interface Baz {
          baz: string;
        }
        interface Foo {
          bar: Baz;
        }
      `,
    },
    {
      code: `
        interface Props {
          name: string;
          age: number;
          isActive: boolean;
        }
      `,
    },
    {
      code: `
        type Item = { id: number; label: string };
        interface Props {
          items: Item[];
        }
      `,
    },
    {
      code: `
        interface Config {
          timeout: number;
        }
        interface Props {
          config: Readonly<Config>;
        }
      `,
    },
    {
      code: `
        interface Props {
          ids: string[];
        }
      `,
    },
    {
      code: `
        interface Props {
          callback: () => void;
        }
      `,
    },
    {
      code: `
        interface Props {
          bar;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        interface Foo {
          bar: {
            baz: string;
          };
        }
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
    {
      code: `
        interface Props {
          user: {
            name: string;
            age: number;
          };
        }
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
    {
      code: `
        interface Props {
          items: {
            id: number;
            label: string;
          }[];
        }
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
    {
      code: `
        interface Props {
          data: Readonly<{
            id: number;
            name: string;
          }>;
        }
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
    {
      code: `
        type Props = {
          config: {
            theme: string;
            lang: string;
          };
        };
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
    {
      code: `
        interface Props {
          first: {
            a: string;
          };
          second: {
            b: number;
          };
        }
      `,
      errors: [
        { messageId: "noNestedInterface" },
        { messageId: "noNestedInterface" },
      ],
    },
    {
      code: `
        interface Props {
          nested: {
            deep: {
              value: string;
            };
          };
        }
      `,
      errors: [
        { messageId: "noNestedInterface" },
        { messageId: "noNestedInterface" },
      ],
    },
    {
      code: `
        interface Props {
          x: { a: string } | null;
        }
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
    {
      code: `
        interface Props {
          x: { a: string } | Readonly<{ b: number }>;
        }
      `,
      errors: [{ messageId: "noNestedInterface" }],
    },
  ],
});
