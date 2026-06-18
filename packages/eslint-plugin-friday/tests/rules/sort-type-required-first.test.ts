import rule from "../../src/rules/sort-type-required-first.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("sort-type-required-first", rule, {
  valid: [
    {
      name: "required first then optional",
      code: `
interface Props {
  alt: string;
  size: string;
  src: string;
  label?: string;
}`,
    },
    {
      name: "single property",
      code: `
interface Props {
  name: string;
}`,
    },
    {
      name: "all required, any order is fine",
      code: `
interface Props {
  c: boolean;
  a: string;
  b: number;
}`,
    },
    {
      name: "all optional, any order is fine",
      code: `
interface Props {
  b?: number;
  a?: string;
  c?: boolean;
}`,
    },
    {
      name: "empty interface",
      code: `interface Props {}`,
    },
    {
      name: "type alias with required first then optional",
      code: `
type Props = {
  src: string;
  alt: string;
  label?: string;
}`,
    },
    {
      name: "required first then optional, not alphabetical",
      code: `
interface Props {
  src: string;
  alt: string;
  visible?: boolean;
  label?: string;
}`,
    },
    {
      name: "type alias that is not an object type",
      code: `type Foo = string;`,
    },
    {
      name: "type alias with union type",
      code: `type Foo = string | number;`,
    },
    {
      name: "required with function type first then optional",
      code: `
interface Props {
  onClick: () => void;
  title: string;
  className?: string;
}`,
    },
  ],
  invalid: [
    {
      name: "skips autofix when a comment is present",
      code: `
interface Props {
  label?: string;
  // the alt text
  alt: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "optional mixed in with required properties",
      code: `
interface Props {
  alt: string;
  label?: string;
  size: string;
  src: string;
}`,
      output: `
interface Props {
  alt: string;
  size: string;
  src: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "optional before required",
      code: `
interface Props {
  label?: string;
  alt: string;
  src: string;
}`,
      output: `
interface Props {
  alt: string;
  src: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "type alias with optional before required",
      code: `
type Props = {
  label?: string;
  alt: string;
  size: string;
  src: string;
}`,
      output: `
type Props = {
  alt: string;
  size: string;
  src: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "multiple optional mixed with required",
      code: `
interface Props {
  visible?: boolean;
  alt: string;
  label?: string;
  size: string;
  src: string;
}`,
      output: `
interface Props {
  alt: string;
  size: string;
  src: string;
  visible?: boolean;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "optional in middle of required properties",
      code: `
interface HeroBannerRootProps {
  alt: string;
  label?: string;
  size: "detail" | "highlight" | "main";
  src: string;
}`,
      output: `
interface HeroBannerRootProps {
  alt: string;
  size: "detail" | "highlight" | "main";
  src: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "required after optional",
      code: `
interface Props {
  a: string;
  b: string;
  c?: string;
  d: string;
}`,
      output: `
interface Props {
  a: string;
  b: string;
  d: string;
  c?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
  ],
});
