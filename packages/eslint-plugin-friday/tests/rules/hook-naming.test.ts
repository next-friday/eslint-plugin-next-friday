import rule from "../../src/rules/hook-naming.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("hook-naming", rule, {
  valid: [
    {
      name: "use prefix in hook file",
      code: `export function useSearchParamsHandler() {}`,
      filename: "search-params.hook.ts",
    },
    {
      name: "default export with use prefix",
      code: `export default useSearchParamsHandler;`,
      filename: "search-params.hook.ts",
    },
    {
      name: "use prefix for auth hook",
      code: `export function useAuth() { return useState(); }`,
      filename: "auth.hook.ts",
    },
    {
      name: "use prefix with arrow function",
      code: `export const useModal = () => {}`,
      filename: "modal.hook.ts",
    },
    {
      name: "default function export with use prefix",
      code: `export default function useCustomHook() {}`,
      filename: "custom.hook.ts",
    },
    {
      name: "use prefix in .hooks.ts file",
      code: `export function useData() {}`,
      filename: "data.hooks.ts",
    },
    {
      name: "any name in non-hook files",
      code: `export function searchHandler() {}`,
      filename: "search.ts",
    },
    {
      name: "any name in utility files",
      code: `export function handleSearch() {}`,
      filename: "search.utils.ts",
    },
    {
      name: "default export without use prefix in non-hook files",
      code: `export default handleSearch;`,
      filename: "search.ts",
    },
    {
      name: "bare use name is exempt",
      code: `export function use() {}`,
      filename: "context.hook.ts",
    },
    {
      name: "destructuring export is ignored",
      code: `export const [first] = items;`,
      filename: "context.hook.ts",
    },
    {
      name: "object destructuring export is ignored",
      code: `export const { value } = config;`,
      filename: "context.hook.ts",
    },
  ],
  invalid: [
    {
      name: "missing use prefix in named export",
      code: `export function searchParamsHandler() {}`,
      filename: "search-params.hook.ts",
      errors: [
        {
          messageId: "missingUsePrefix",
          data: {
            name: "searchParamsHandler",
            suggestion: "useSearchParamsHandler",
          },
        },
      ],
    },
    {
      name: "default export without use prefix",
      code: `export default handleSearch;`,
      filename: "search.hook.ts",
      errors: [
        {
          messageId: "defaultExportMissingUsePrefix",
          data: { name: "handleSearch", suggestion: "useHandleSearch" },
        },
      ],
    },
    {
      name: "arrow function without use prefix",
      code: `export const modalHandler = () => {}`,
      filename: "modal.hook.ts",
      errors: [
        {
          messageId: "missingUsePrefix",
          data: { name: "modalHandler", suggestion: "useModalHandler" },
        },
      ],
    },
    {
      name: "missing use prefix in .hooks.ts file",
      code: `export function authManager() {}`,
      filename: "auth.hooks.ts",
      errors: [
        {
          messageId: "missingUsePrefix",
          data: { name: "authManager", suggestion: "useAuthManager" },
        },
      ],
    },
    {
      name: "default function export without use prefix",
      code: `export default function customHook() {}`,
      filename: "custom.hook.ts",
      errors: [
        {
          messageId: "defaultExportMissingUsePrefix",
          data: { name: "customHook", suggestion: "useCustomHook" },
        },
      ],
    },
    {
      name: "multiple functions without use prefix",
      code: `export function getData() {}\nexport function fetchItems() {}`,
      filename: "data.hook.ts",
      errors: [
        {
          messageId: "missingUsePrefix",
          data: { name: "getData", suggestion: "useGetData" },
        },
        {
          messageId: "missingUsePrefix",
          data: { name: "fetchItems", suggestion: "useFetchItems" },
        },
      ],
    },
    {
      name: "use prefix followed by lowercase is not a hook",
      code: `export const username = () => {};`,
      filename: "auth.hook.ts",
      errors: [
        {
          messageId: "missingUsePrefix",
          data: { name: "username", suggestion: "useUsername" },
        },
      ],
    },
  ],
});
