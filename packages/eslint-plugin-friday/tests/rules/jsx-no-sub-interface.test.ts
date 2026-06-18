import rule from "../../src/rules/jsx-no-sub-interface.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-no-sub-interface", rule, {
  valid: [
    {
      name: "single main interface used by component",
      code: `
        interface StoreCardProps { name: string }
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "main interface without Readonly wrapper",
      code: `
        interface StoreCardProps { name: string }
        const StoreCard = (props: StoreCardProps) => <div />;
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "main type alias used by component",
      code: `
        type StoreCardProps = { name: string }
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "default-exported function declaration component",
      code: `
        interface StoreCardProps { name: string }
        export default function StoreCard(props: Readonly<StoreCardProps>) { return <div />; }
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "named-exported component",
      code: `
        interface StoreCardProps { name: string }
        export const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "exported main interface",
      code: `
        export interface StoreCardProps { name: string }
        export const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "multiple components each with their own main props",
      code: `
        interface CardProps { x: number }
        interface HeaderProps { y: string }
        const Card = (props: Readonly<CardProps>) => <div />;
        const Header = (props: Readonly<HeaderProps>) => <div />;
      `,
      filename: "Card.tsx",
    },
    {
      name: "function-expression component with its own main props",
      code: `
        interface StoreCardProps { name: string }
        const StoreCard = function (props: Readonly<StoreCardProps>) { return <div />; };
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "pascal-case non-component binding alongside component",
      code: `
        interface StoreCardProps { name: string }
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
        const VERSION = "1.0";
      `,
      filename: "StoreCard.tsx",
    },
    {
      name: "non-jsx file is not checked",
      code: `
        interface StoreCardAddressProps { label: string; mapUrl: string }
      `,
      filename: "store-card-address.types.ts",
    },
    {
      name: "tsx file with no component is not checked",
      code: `
        interface Foo { x: number }
        interface Bar { y: string }
        export { Foo, Bar };
      `,
      filename: "types.tsx",
    },
  ],
  invalid: [
    {
      name: "sub-interface alongside main",
      code: `
        interface StoreCardProps { address: StoreCardAddressProps }
        interface StoreCardAddressProps { label: string }
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        {
          messageId: "noSubInterface",
          data: { name: "StoreCardAddressProps" },
        },
      ],
    },
    {
      name: "multiple sub-interfaces",
      code: `
        interface StoreCardProps { name: string }
        interface StoreCardAddressProps { label: string }
        interface StoreCardImageProps { src: string }
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        {
          messageId: "noSubInterface",
          data: { name: "StoreCardAddressProps" },
        },
        { messageId: "noSubInterface", data: { name: "StoreCardImageProps" } },
      ],
    },
    {
      name: "helper type alias alongside main interface",
      code: `
        interface StoreCardProps { name: string }
        type StoreCardKind = "phone" | "whatsapp";
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        { messageId: "noSubInterface", data: { name: "StoreCardKind" } },
      ],
    },
    {
      name: "helper type alias alongside main type alias",
      code: `
        type StoreCardProps = { name: string };
        type StoreCardKind = "a" | "b";
        const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        { messageId: "noSubInterface", data: { name: "StoreCardKind" } },
      ],
    },
    {
      name: "sub-interface alongside named-exported component",
      code: `
        interface StoreCardProps { name: string }
        interface StoreCardAddressProps { label: string }
        export const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        {
          messageId: "noSubInterface",
          data: { name: "StoreCardAddressProps" },
        },
      ],
    },
    {
      name: "component without props still flags any top-level type",
      code: `
        interface SpinnerKind { variant: string }
        const Spinner = () => <div />;
      `,
      filename: "Spinner.tsx",
      errors: [{ messageId: "noSubInterface", data: { name: "SpinnerKind" } }],
    },
    {
      name: "exported sub-interface is still flagged",
      code: `
        export interface StoreCardProps { name: string }
        export interface StoreCardAddressProps { label: string }
        export const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        {
          messageId: "noSubInterface",
          data: { name: "StoreCardAddressProps" },
        },
      ],
    },
    {
      name: "inline object props type leaves sibling interface unmatched",
      code: `
        interface StoreCardProps { name: string }
        const StoreCard = (props: { title: string }) => <div />;
      `,
      filename: "StoreCard.tsx",
      errors: [
        { messageId: "noSubInterface", data: { name: "StoreCardProps" } },
      ],
    },
    {
      name: "function-declaration component without props flags sibling interface",
      code: `
        interface StoreCardProps { name: string }
        function StoreCard() { return <div />; }
      `,
      filename: "StoreCard.tsx",
      errors: [
        { messageId: "noSubInterface", data: { name: "StoreCardProps" } },
      ],
    },
  ],
});
