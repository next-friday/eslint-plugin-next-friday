import rule from "../../src/rules/no-ghost-wrapper.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("no-ghost-wrapper", rule, {
  valid: [
    {
      name: "div with className",
      code: '<div className="container">x</div>',
      filename: "Component.tsx",
    },
    {
      name: "span with className",
      code: '<span className="muted">x</span>',
      filename: "Component.tsx",
    },
    {
      name: "div with data-* attribute",
      code: '<div data-testid="root">x</div>',
      filename: "Component.tsx",
    },
    {
      name: "div with role",
      code: '<div role="button">x</div>',
      filename: "Component.tsx",
    },
    {
      name: "div with aria-* attribute",
      code: '<div aria-label="close">x</div>',
      filename: "Component.tsx",
    },
    {
      name: "div with ref",
      code: "<div ref={ref}>x</div>",
      filename: "Component.tsx",
    },
    {
      name: "div with event handler",
      code: "<div onClick={handleClick}>x</div>",
      filename: "Component.tsx",
    },
    {
      name: "div with id",
      code: '<div id="anchor">x</div>',
      filename: "Component.tsx",
    },
    {
      name: "div with inline style",
      code: "<div style={{ color: 'red' }}>x</div>",
      filename: "Component.tsx",
    },
    {
      name: "div with spread attributes",
      code: "<div {...props}>x</div>",
      filename: "Component.tsx",
    },
    {
      name: "div with tabIndex",
      code: "<div tabIndex={0}>x</div>",
      filename: "Component.tsx",
    },
    {
      name: "semantic section element without attributes",
      code: "<section>x</section>",
      filename: "Component.tsx",
    },
    {
      name: "semantic article element without attributes",
      code: "<article>x</article>",
      filename: "Component.tsx",
    },
    {
      name: "fragment shorthand is not handled by this rule",
      code: "<>x</>",
      filename: "Component.tsx",
    },
    {
      name: "custom component is not a ghost wrapper",
      code: "<MyComponent>x</MyComponent>",
      filename: "Component.tsx",
    },
    {
      name: "self-closing span with className",
      code: '<span className="badge" />',
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is skipped",
      code: "const x = 1;",
      filename: "Component.ts",
    },
    {
      name: "member-expression tag is not a ghost wrapper",
      code: "<Foo.Bar>x</Foo.Bar>",
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "bare div with content",
      code: "<div>x</div>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "div" } }],
    },
    {
      name: "bare span with text",
      code: "<span>text</span>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "span" } }],
    },
    {
      name: "bare empty div",
      code: "<div></div>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "div" } }],
    },
    {
      name: "bare div with whitespace",
      code: "<div> </div>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "div" } }],
    },
    {
      name: "self-closing bare div",
      code: "<div />",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "div" } }],
    },
    {
      name: "self-closing bare span",
      code: "<span />",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "span" } }],
    },
    {
      name: "div with only key prop is still ghost",
      code: "<div key={item.id}>x</div>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "div" } }],
    },
    {
      name: "span with only key prop is still ghost",
      code: "<span key={i}>x</span>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "span" } }],
    },
    {
      name: "bare div wrapping children expression",
      code: "<div>{children}</div>",
      filename: "Component.tsx",
      errors: [{ messageId: "noGhostWrapper", data: { tag: "div" } }],
    },
  ],
});
