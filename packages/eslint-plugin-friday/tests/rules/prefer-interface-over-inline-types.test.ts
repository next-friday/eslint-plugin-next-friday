import rule from "../../src/rules/prefer-interface-over-inline-types.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("prefer-interface-over-inline-types", rule, {
  valid: [
    {
      code: `
        interface Props {
          children: ReactNode;
          title: string;
        }
        const Component = (props: Props) => <div>{props.children}</div>;
      `,
    },
    {
      code: `
        const Component = (props: string) => <div>{props}</div>;
      `,
    },
    {
      code: `
        const Component = (props: number) => <div>{props}</div>;
      `,
    },
    {
      code: `
        const helper = (props: { value: number; name: string; data: object }) => {
          return props.value + props.name.length;
        };
      `,
    },
    {
      code: `
        const Component = () => <div>Hello</div>;
      `,
    },
    {
      code: `
        const Component = (props: { title: string }, ref: any) => <div>{props.title}</div>;
      `,
    },
    {
      code: `
        type ComponentProps = { children: ReactNode; title: string; onClick: () => void };
        const Component = (props: ComponentProps) => <div>{props.children}</div>;
      `,
    },
  ],
  invalid: [
    {
      code: `
        const Component = (props: { children: ReactNode }) => <div>{props.children}</div>;
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const RootLayout = (props: Readonly<{ children: ReactNode }>) => {
          const { children } = props;
          return <html><body>{children}</body></html>;
        };
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const Component = (props: { title: string; onClick: () => void }) => (
          <div onClick={props.onClick}>{props.title}</div>
        );
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const Component = (props: { children: ReactNode; title: string; onClick: () => void }) => (
          <div onClick={props.onClick}>
            <h1>{props.title}</h1>
            {props.children}
          </div>
        );
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const Component = (props: { user: { name: string; age: number }; isActive: boolean }) => (
          <div>{props.user.name}</div>
        );
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const Component = (props: { items: string[]; title: string }) => (
          <div>
            <h1>{props.title}</h1>
            {props.items.map(item => <span key={item}>{item}</span>)}
          </div>
        );
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const Component = (props: { status: 'loading' | 'success' | 'error'; message: string }) => (
          <div className={props.status}>{props.message}</div>
        );
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        function Component(props: { data: { id: number; name: string }; isVisible: boolean }) {
          return <div>{props.data.name}</div>;
        }
      `,
      errors: [{ messageId: "useInterface" }],
    },
    {
      code: `
        const Component = function(props: { config: { theme: string; lang: string }; children: ReactNode }) {
          return <div className={props.config.theme}>{props.children}</div>;
        };
      `,
      errors: [{ messageId: "useInterface" }],
    },
  ],
});
