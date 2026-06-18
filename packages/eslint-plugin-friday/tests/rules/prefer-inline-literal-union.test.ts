import rule from "../../src/rules/prefer-inline-literal-union.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("prefer-inline-literal-union", rule, {
  valid: [
    {
      code: `
        interface Props {
          status: string;
        }
      `,
    },
    {
      code: `
        interface Props {
          activeCategoryId?: "articles" | "dharma" | "faq";
        }
      `,
    },
    {
      code: `
        type User = { name: string; age: number };
        interface Props {
          user: User;
        }
      `,
    },
    {
      code: `
        type Callback = () => void;
        interface Props {
          onClick: Callback;
        }
      `,
    },
    {
      code: `
        type Status = "loading" | "success" | "error";
        function getStatus(s: Status): string { return s; }
      `,
    },
    {
      code: `
        type MixedUnion = "a" | string;
        interface Props {
          value: MixedUnion;
        }
      `,
    },
    {
      code: `
        type ObjectType = { key: string };
        interface Props {
          data: ObjectType;
        }
      `,
    },
    {
      code: `
        interface Props {
          status;
        }
      `,
    },
    {
      code: `
        interface Props {
          node: React.ReactNode;
        }
      `,
    },
    {
      code: `
        type Unused = "a" | "b";
        interface Props {
          name: string;
        }
      `,
    },
    {
      code: `export { "a" as b } from "./m";`,
    },
  ],
  invalid: [
    {
      code: `
        type ArticleFaqCategoryId = "articles" | "dharma" | "faq";
        interface ArticleFaqCategoryFilterProps {
          activeCategoryId?: ArticleFaqCategoryId;
        }
      `,
      output: `
        interface ArticleFaqCategoryFilterProps {
          activeCategoryId?: "articles" | "dharma" | "faq";
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        type Status = "loading" | "success" | "error";
        interface Props {
          status: Status;
        }
      `,
      output: `
        interface Props {
          status: "loading" | "success" | "error";
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        type Size = 1 | 2 | 3 | 4;
        interface Props {
          size: Size;
        }
      `,
      output: `
        interface Props {
          size: 1 | 2 | 3 | 4;
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        type Theme = "light" | "dark";
        interface Props {
          theme: Theme;
          fallbackTheme: Theme;
        }
      `,
      output: `
        interface Props {
          theme: "light" | "dark";
          fallbackTheme: "light" | "dark";
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        type Nullable = "yes" | "no" | null;
        interface Props {
          value: Nullable;
        }
      `,
      output: `
        interface Props {
          value: "yes" | "no" | null;
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        type MaybeStatus = "active" | "inactive" | undefined;
        interface Props {
          status: MaybeStatus;
        }
      `,
      output: `
        interface Props {
          status: "active" | "inactive" | undefined;
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        type IsEnabled = true | false;
        interface Props {
          enabled: IsEnabled;
        }
      `,
      output: `
        interface Props {
          enabled: true | false;
        }
      `,
      errors: [
        { messageId: "removeUnusedAlias" },
        { messageId: "inlineLiteralUnion" },
      ],
    },
    {
      code: `
        interface Props {
          status: Status;
        }
        type Status = "loading" | "success" | "error";
      `,
      output: `
        interface Props {
          status: "loading" | "success" | "error";
        }
      `,
      errors: [
        { messageId: "inlineLiteralUnion" },
        { messageId: "removeUnusedAlias" },
      ],
    },
    {
      code: `
        type Status = "loading" | "success" | "error";
        interface Props {
          status: Status;
        }
        function check(value: Status): void {}
      `,
      output: `
        type Status = "loading" | "success" | "error";
        interface Props {
          status: "loading" | "success" | "error";
        }
        function check(value: Status): void {}
      `,
      errors: [{ messageId: "inlineLiteralUnion" }],
    },
    {
      code: `interface Props {
  status: Status;
}
type Status = "a" | "b";`,
      output: `interface Props {
  status: "a" | "b";
}
`,
      errors: [
        { messageId: "inlineLiteralUnion" },
        { messageId: "removeUnusedAlias" },
      ],
    },
    {
      code: `
        export type Status = "a" | "b";
        interface Props {
          status: Status;
        }
      `,
      output: `
        export type Status = "a" | "b";
        interface Props {
          status: "a" | "b";
        }
      `,
      errors: [{ messageId: "inlineLiteralUnion" }],
    },
    {
      code: `
        type Status = "a" | "b";
        interface Props {
          status: Status;
        }
        export { Status };
      `,
      output: `
        type Status = "a" | "b";
        interface Props {
          status: "a" | "b";
        }
        export { Status };
      `,
      errors: [{ messageId: "inlineLiteralUnion" }],
    },
  ],
});
