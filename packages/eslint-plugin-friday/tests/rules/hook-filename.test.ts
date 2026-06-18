import rule from "../../src/rules/hook-filename.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("hook-filename", rule, {
  valid: [
    {
      name: "hook export from .hook.ts file",
      filename: "/src/features/user/use-user-data.hook.ts",
      code: `export function useUserData() { return null; }`,
    },
    {
      name: "hook export from .hooks.ts file",
      filename: "/src/features/user/user.hooks.ts",
      code: `export const useUserData = () => null;`,
    },
    {
      name: "non-hook export from any file",
      filename: "/src/features/user/user.service.ts",
      code: `export function fetchUserData() { return null; }`,
    },
    {
      name: "non-hook export from .ts file",
      filename: "/src/utils/format.ts",
      code: `export const formatDate = (d: Date) => d.toISOString();`,
    },
    {
      name: "ignore re-exports of hooks",
      filename: "/src/features/user/index.ts",
      code: `export { useUserData } from "./use-user-data.hook";`,
    },
    {
      name: "do not flag use without capital (user)",
      filename: "/src/features/user/user.service.ts",
      code: `export function user() { return null; }`,
    },
    {
      name: "do not flag 'use' alone",
      filename: "/src/utils/utils.ts",
      code: `export function use() { return null; }`,
    },
    {
      name: "ignore destructured export bindings",
      filename: "/src/features/user/user.utils.ts",
      code: `export const { useUserData } = obj;`,
    },
    {
      name: "ignore anonymous default function export",
      filename: "/src/features/user/use-user-data.ts",
      code: `export default function() { return null; }`,
    },
  ],
  invalid: [
    {
      name: "hook function declaration in plain .ts file",
      filename: "/src/features/user/use-user-data.ts",
      code: `export function useUserData() { return null; }`,
      errors: [
        { messageId: "requireHookFilename", data: { name: "useUserData" } },
      ],
    },
    {
      name: "hook arrow function in plain .ts file",
      filename: "/src/features/user/use-user-data.ts",
      code: `export const useUserData = () => null;`,
      errors: [
        { messageId: "requireHookFilename", data: { name: "useUserData" } },
      ],
    },
    {
      name: "hook function expression in plain .ts file",
      filename: "/src/features/user/use-user-data.ts",
      code: `export const useUserData = function() { return null; };`,
      errors: [
        { messageId: "requireHookFilename", data: { name: "useUserData" } },
      ],
    },
    {
      name: "hook exported from .tsx file",
      filename: "/src/features/user/UserCard.tsx",
      code: `export function useUserCard() { return null; }`,
      errors: [
        { messageId: "requireHookFilename", data: { name: "useUserCard" } },
      ],
    },
    {
      name: "default exported hook from plain .ts file",
      filename: "/src/features/user/use-user-data.ts",
      code: `export default function useUserData() { return null; }`,
      errors: [
        { messageId: "requireHookFilename", data: { name: "useUserData" } },
      ],
    },
    {
      name: "multiple hook exports in one file",
      filename: "/src/features/user/user.utils.ts",
      code: `export function useA() {} export function useB() {}`,
      errors: [
        { messageId: "requireHookFilename", data: { name: "useA" } },
        { messageId: "requireHookFilename", data: { name: "useB" } },
      ],
    },
  ],
});
