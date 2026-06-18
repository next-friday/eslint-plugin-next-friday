import rule from "../../src/rules/no-lazy-identifiers.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-lazy-identifiers", rule, {
  valid: [
    { name: "descriptive variable name", code: "const userName = 'john';" },
    { name: "meaningful variable name", code: "const itemCount = 10;" },
    {
      name: "descriptive function and parameter names",
      code: "function calculateTotal(price, quantity) { return price * quantity; }",
    },
    {
      name: "descriptive arrow function",
      code: "const getUserById = (userId) => users.find(u => u.id === userId);",
    },
    { name: "descriptive class name", code: "class UserService {}" },
    { name: "descriptive interface name", code: "interface UserProps {}" },
    { name: "descriptive type alias", code: "type UserId = string;" },
    {
      name: "underscore-prefixed variables",
      code: "const _unused = getValue();",
    },
    {
      name: "underscore-prefixed even with lazy pattern",
      code: "const _xxx = 'ignored';",
    },
    {
      name: "descriptive destructured properties",
      code: "const { name, age } = user;",
    },
    {
      name: "descriptive array destructuring",
      code: "const [first, second] = array;",
    },
    { name: "short but meaningful names", code: "const id = 1;" },
    { name: "common abbreviations", code: "const db = getDatabase();" },
    { name: "two repeated chars (not lazy)", code: "const aa = 1;" },
    {
      name: "compound names with repeated chars across boundaries",
      code: "const ProfileProgressSkeleton = () => {};",
    },
    { name: "short keyboard patterns under threshold", code: "const qwe = 1;" },
    {
      name: "common word embedding a keyboard run",
      code: "const property = obj.value;",
    },
    {
      name: "plural common word embedding a keyboard run",
      code: "const properties = obj.data;",
    },
    {
      name: "allowlisted name is not flagged",
      code: "const asdf = 1;",
      options: [{ allow: ["asdf"] }],
    },
    {
      name: "descriptive object rest element",
      code: "const { name, ...rest } = user;",
    },
    {
      name: "descriptive array rest element",
      code: "const [first, ...others] = array;",
    },
    {
      name: "array hole with descriptive element",
      code: "const [, second] = array;",
    },
    {
      name: "descriptive default parameter",
      code: "function greet(message = 'hi') { return message; }",
    },
    {
      name: "descriptive rest parameter",
      code: "function sum(...numbers) { return numbers; }",
    },
    {
      name: "catch clause without binding",
      code: "try { run(); } catch { handle(); }",
    },
    {
      name: "catch clause with descriptive binding",
      code: "try { run(); } catch (error) { handle(error); }",
    },
    {
      name: "nested object pattern value",
      code: "const { outer: { inner } } = config;",
    },
    {
      name: "anonymous default class declaration",
      code: "export default class {}",
    },
  ],
  invalid: [
    {
      name: "repeated character variable xxx",
      code: "const xxx = 'value';",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
    {
      name: "repeated character variable yyy",
      code: "const yyy = 123;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "yyy" } }],
    },
    {
      name: "repeated character variable zzz",
      code: "const zzz = true;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "zzz" } }],
    },
    {
      name: "repeated character variable aaa",
      code: "const aaa = [];",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "aaa" } }],
    },
    {
      name: "longer repeated character variable",
      code: "const aaaa = [];",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "aaaa" } }],
    },
    {
      name: "keyboard pattern asdf",
      code: "const asdf = 'keyboard';",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "asdf" } }],
    },
    {
      name: "keyboard pattern qwerty",
      code: "const qwerty = 'keyboard';",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "qwerty" } }],
    },
    {
      name: "keyboard pattern zxcv",
      code: "const zxcv = 'keyboard';",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "zxcv" } }],
    },
    {
      name: "keyboard pattern hjkl",
      code: "const hjkl = 'vim keys';",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "hjkl" } }],
    },
    {
      name: "variable containing keyboard pattern",
      code: "const myAsdfVar = 'contains pattern';",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "myAsdfVar" } }],
    },
    {
      name: "lazy function name",
      code: "function xxx() { return 1; }",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
    {
      name: "lazy parameter name",
      code: "const fn = (xxx) => xxx * 2;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
    {
      name: "lazy class name",
      code: "class aaaa {}",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "aaaa" } }],
    },
    {
      name: "lazy destructured variable",
      code: "const { xxx } = obj;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
    {
      name: "multiple lazy array destructured variables",
      code: "const [aaa, bbb] = array;",
      errors: [
        { messageId: "noLazyIdentifier", data: { name: "aaa" } },
        { messageId: "noLazyIdentifier", data: { name: "bbb" } },
      ],
    },
    {
      name: "lazy interface name",
      code: "interface xxxType {}",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxxType" } }],
    },
    {
      name: "lazy type alias name",
      code: "type aaaAlias = string;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "aaaAlias" } }],
    },
    {
      name: "lazy object rest element",
      code: "const { name, ...xxx } = user;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
    {
      name: "lazy array rest element",
      code: "const [first, ...aaa] = array;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "aaa" } }],
    },
    {
      name: "array hole before lazy element",
      code: "const [, asdf] = array;",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "asdf" } }],
    },
    {
      name: "lazy default parameter",
      code: "function greet(xxx = 'hi') { return xxx; }",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
    {
      name: "lazy rest parameter",
      code: "function sum(...aaa) { return aaa; }",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "aaa" } }],
    },
    {
      name: "lazy catch clause binding",
      code: "try { run(); } catch (xxx) { handle(xxx); }",
      errors: [{ messageId: "noLazyIdentifier", data: { name: "xxx" } }],
    },
  ],
});
