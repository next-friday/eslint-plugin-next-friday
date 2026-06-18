import rule from "../../src/rules/no-inline-return-properties.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-inline-return-properties", rule, {
  valid: [
    {
      name: "should allow all shorthand properties",
      code: `function foo() { return { a, b, c }; }`,
    },
    {
      name: "should allow shorthand properties with descriptive names",
      code: `function foo() { return { error, isSubmitting, onJoin }; }`,
    },
    {
      name: "should allow many shorthand properties",
      code: `function foo() { return { admins, branch, courses, members, news, stats }; }`,
    },
    {
      name: "should allow spread elements with shorthand",
      code: `function foo() { return { ...props, name }; }`,
    },
    {
      name: "should allow non-object return",
      code: `function foo() { return 42; }`,
    },
    {
      name: "should allow empty return",
      code: `function foo() { return; }`,
    },
    {
      name: "should allow spread-only return",
      code: `function foo() { return { ...data }; }`,
    },
    {
      name: "should not check non-return objects",
      code: `const obj = { key: value };`,
    },
    {
      name: "should allow extracted value with shorthand",
      code: `function foo() { const membersHref = \`/branch/\${branchNumber}/members\`; return { membersHref }; }`,
    },
    {
      name: "should allow object method",
      code: `function f(){ return { foo() { return 1; } }; }`,
    },
    {
      name: "should allow getter",
      code: `function f(){ return { get foo() { return 1; } }; }`,
    },
    {
      name: "should allow setter",
      code: `function f(){ return { set foo(value) { this._foo = value; } }; }`,
    },
  ],
  invalid: [
    {
      name: "should reject renamed property",
      code: `function foo() { return { name: value }; }`,
      errors: [{ messageId: "noInlineProperty", data: { name: "name" } }],
    },
    {
      name: "should reject renamed handler property",
      code: `function foo() { return { onJoin: handleJoin }; }`,
      errors: [{ messageId: "noInlineProperty", data: { name: "onJoin" } }],
    },
    {
      name: "should reject renamed variable property",
      code: `function foo() { return { coursesCurrentPage: coursePage }; }`,
      errors: [
        { messageId: "noInlineProperty", data: { name: "coursesCurrentPage" } },
      ],
    },
    {
      name: "should reject computed value property",
      code: `function foo() { return { total: Math.ceil(items.length / PAGE_SIZE) }; }`,
      errors: [{ messageId: "noInlineProperty", data: { name: "total" } }],
    },
    {
      name: "should reject template literal value property",
      code: `function foo() { return { membersHref: \`/branch/\${branchNumber}/members\` }; }`,
      errors: [
        { messageId: "noInlineProperty", data: { name: "membersHref" } },
      ],
    },
    {
      name: "should reject multiple non-shorthand properties",
      code: `function foo() { return { newsCurrentPage: newsData?.currentPage ?? 1, newsTotalPages: newsData?.pages ?? 1 }; }`,
      errors: [
        { messageId: "noInlineProperty", data: { name: "newsCurrentPage" } },
        { messageId: "noInlineProperty", data: { name: "newsTotalPages" } },
      ],
    },
    {
      name: "should reject mixed shorthand and non-shorthand",
      code: `function foo() { return { admins, coursesCurrentPage: coursePage, members }; }`,
      errors: [
        { messageId: "noInlineProperty", data: { name: "coursesCurrentPage" } },
      ],
    },
    {
      name: "should reject function call value property",
      code: `function foo() { return { data: getData() }; }`,
      errors: [{ messageId: "noInlineProperty", data: { name: "data" } }],
    },
    {
      name: "should reject string-literal key property",
      code: `function foo() { return { "members-href": value }; }`,
      errors: [
        { messageId: "noInlineProperty", data: { name: "members-href" } },
      ],
    },
    {
      name: "should reject computed member-expression key property",
      code: `function foo() { return { [config.key]: value }; }`,
      errors: [{ messageId: "noInlineProperty", data: { name: "unknown" } }],
    },
  ],
});
