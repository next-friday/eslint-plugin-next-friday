import rule from "../../src/rules/sort-type-alphabetically.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("sort-type-alphabetically", rule, {
  valid: [
    {
      name: "required A-Z then optional A-Z",
      code: `
interface Props {
  alt: string;
  size: string;
  src: string;
  className?: string;
  label?: string;
  onClick?: () => void;
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
      name: "all required sorted A-Z",
      code: `
interface Props {
  a: string;
  b: number;
  c: boolean;
}`,
    },
    {
      name: "all optional sorted A-Z",
      code: `
interface Props {
  a?: string;
  b?: number;
  c?: boolean;
}`,
    },
    {
      name: "empty interface",
      code: `interface Props {}`,
    },
    {
      name: "type alias with A-Z within groups",
      code: `
type Props = {
  alt: string;
  size: string;
  src: string;
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
      name: "optional mixed with required but each group A-Z",
      code: `
interface Props {
  className?: string;
  alt: string;
  src: string;
  label?: string;
}`,
    },
  ],
  invalid: [
    {
      name: "skips autofix when a comment is present",
      code: `
interface Props {
  src: string;
  // the alt text
  alt: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "skips autofix when a leading comment is present",
      code: `
interface Props {
  // the source
  src: string;
  alt: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "required not sorted A-Z",
      code: `
interface Props {
  src: string;
  alt: string;
}`,
      output: `
interface Props {
  alt: string;
  src: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "optional not sorted A-Z",
      code: `
interface Props {
  b?: number;
  a?: string;
}`,
      output: `
interface Props {
  a?: string;
  b?: number;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "both groups unsorted",
      code: `
interface Props {
  src: string;
  alt: string;
  label?: string;
  className?: string;
}`,
      output: `
interface Props {
  alt: string;
  src: string;
  className?: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "type alias with unsorted required group",
      code: `
type Props = {
  size: string;
  alt: string;
  label?: string;
}`,
      output: `
type Props = {
  alt: string;
  size: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "required A-Z but optional not A-Z",
      code: `
interface Props {
  alt: string;
  size: string;
  src: string;
  label?: string;
  className?: string;
}`,
      output: `
interface Props {
  alt: string;
  size: string;
  src: string;
  className?: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
    {
      name: "required group not sorted A-Z",
      code: `
interface HeroBannerRootProps {
  size: "detail" | "highlight" | "main";
  alt: string;
  src: string;
  className?: string;
  label?: string;
}`,
      output: `
interface HeroBannerRootProps {
  alt: string;
  size: "detail" | "highlight" | "main";
  src: string;
  className?: string;
  label?: string;
}`,
      errors: [{ messageId: "unsortedTypeMembers" }],
    },
  ],
});
