import rule from "../../src/rules/no-misleading-service-prefix.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-misleading-service-prefix", rule, {
  valid: [
    {
      name: "get prefix in service file",
      code: `export async function getArticles() {}`,
      filename: "article.service.ts",
    },
    {
      name: "fetch prefix in service file",
      code: `export async function fetchArticles() {}`,
      filename: "article.service.ts",
    },
    {
      name: "load prefix in service file",
      code: `export async function loadData() {}`,
      filename: "data.service.ts",
    },
    {
      name: "search prefix",
      code: `export async function searchArticles(query: string) {}`,
      filename: "article.service.ts",
    },
    {
      name: "create prefix",
      code: `export async function createOrder() {}`,
      filename: "order.service.ts",
    },
    {
      name: "update prefix",
      code: `export async function updateProfile() {}`,
      filename: "profile.service.ts",
    },
    {
      name: "remove prefix",
      code: `export async function removeComment() {}`,
      filename: "comment.service.ts",
    },
    {
      name: "verify prefix",
      code: `export async function verifyEmail() {}`,
      filename: "auth.service.ts",
    },
    {
      name: "set prefix in non-service file",
      code: `export async function setProfile() {}`,
      filename: "profile.ts",
    },
    {
      name: "delete prefix in non-service file",
      code: `export async function deleteComment() {}`,
      filename: "comment.ts",
    },
    {
      name: "set prefix for non-async functions",
      code: `export function setProfile() {}`,
      filename: "profile.service.ts",
    },
    {
      name: "delete prefix for non-exported functions",
      code: `function deleteComment() {}`,
      filename: "comment.service.ts",
    },
    {
      name: "'set' as full function name",
      code: `export async function set() {}`,
      filename: "article.service.ts",
    },
    {
      name: "'handle' as full function name",
      code: `export async function handle() {}`,
      filename: "article.service.ts",
    },
    {
      name: "fetch prefix with arrow function",
      code: `export const fetchUsers = async () => {}`,
      filename: "user.service.ts",
    },
    {
      name: "not camelCase boundary (settings)",
      code: `export async function settings() {}`,
      filename: "config.service.ts",
    },
    {
      name: "not camelCase boundary (domestic)",
      code: `export async function domestic() {}`,
      filename: "shipping.service.ts",
    },
    {
      name: "destructured export const binding",
      code: `export const { setUsers } = config`,
      filename: "user.service.ts",
    },
  ],
  invalid: [
    {
      name: "set prefix in service file",
      code: `export async function setProfile(data: ProfileRequest) {}`,
      filename: "profile.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "set",
            name: "setProfile",
            suggestions: "update, save, patch",
          },
        },
      ],
    },
    {
      name: "delete prefix in service file",
      code: `export async function deleteComment(id: string) {}`,
      filename: "comment.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "delete",
            name: "deleteComment",
            suggestions: "remove, archive",
          },
        },
      ],
    },
    {
      name: "do prefix in service file",
      code: `export async function doLogin(credentials: LoginRequest) {}`,
      filename: "auth.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "do",
            name: "doLogin",
            suggestions: "submit, process",
          },
        },
      ],
    },
    {
      name: "handle prefix in service file",
      code: `export async function handlePayment(data: PaymentRequest) {}`,
      filename: "payment.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "handle",
            name: "handlePayment",
            suggestions: "create, verify",
          },
        },
      ],
    },
    {
      name: "set prefix with arrow function",
      code: `export const setUsers = async () => {}`,
      filename: "user.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "set",
            name: "setUsers",
            suggestions: "update, save, patch",
          },
        },
      ],
    },
    {
      name: "handle prefix with arrow function",
      code: `export const handleOrder = async () => {}`,
      filename: "order.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "handle",
            name: "handleOrder",
            suggestions: "create, verify",
          },
        },
      ],
    },
    {
      name: "set prefix with digit boundary",
      code: `export async function set2FactorAuth() {}`,
      filename: "x.service.ts",
      errors: [
        {
          messageId: "bannedPrefix",
          data: {
            prefix: "set",
            name: "set2FactorAuth",
            suggestions: "update, save, patch",
          },
        },
      ],
    },
  ],
});
