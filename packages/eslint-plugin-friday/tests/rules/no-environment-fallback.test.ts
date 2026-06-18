import rule from "../../src/rules/no-environment-fallback.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-environment-fallback", rule, {
  valid: [
    {
      name: "should allow environment variable without fallback",
      code: `const apiKey = process.env.API_KEY;`,
    },
    {
      name: "should allow direct environment variable access",
      code: `const port = process.env.PORT;`,
    },
    {
      name: "should allow environment variable in conditional",
      code: `if (process.env.NODE_ENV) { console.log("dev mode"); }`,
    },
    {
      name: "should allow environment variable in object",
      code: `const config = { apiKey: process.env.API_KEY };`,
    },
    {
      name: "should allow logical OR without process.env",
      code: `const fallback = "default" || "value";`,
    },
    {
      name: "should allow nullish coalescing without process.env",
      code: `const value = someVariable ?? "default";`,
    },
    {
      name: "should allow ternary without process.env",
      code: `const result = someCondition ? "yes" : "no";`,
    },
    {
      name: "should allow accessing process.env directly",
      code: `const envObj = process.env;`,
    },
    {
      name: "should allow OR on a non-namespace member",
      code: `const value = config.value || "default";`,
    },
    {
      name: "should allow OR on a computed env-like member",
      code: `const value = config["env"].MODE || "default";`,
    },
    {
      name: "should allow OR on a non-env namespace",
      code: `const href = window.location.href || "/";`,
    },
    {
      name: "should allow OR on a non-process env object",
      code: `const mode = settings.env.MODE || "dev";`,
    },
  ],
  invalid: [
    {
      name: "should disallow logical OR operator with process.env",
      code: `const apiKey = process.env.API_KEY || "default-key";`,
      errors: [{ messageId: "noEnvFallback", line: 1, column: 16 }],
    },
    {
      name: "should disallow nullish coalescing operator with process.env",
      code: `const dbUrl = process.env.DATABASE_URL ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback", line: 1, column: 15 }],
    },
    {
      name: "should disallow ternary operator with process.env",
      code: `const port = process.env.PORT ? "8080" : "3000";`,
      errors: [{ messageId: "noEnvFallback", line: 1, column: 14 }],
    },
    {
      name: "should disallow string literal fallback with OR",
      code: `const token = process.env.AUTH_TOKEN || "abc123";`,
      errors: [{ messageId: "noEnvFallback", line: 1, column: 15 }],
    },
    {
      name: "should disallow fallback in object property",
      code: `const config = {
        apiUrl: process.env.API_URL ?? "https://api.example.com",
      };`,
      errors: [{ messageId: "noEnvFallback", line: 2, column: 17 }],
    },
    {
      name: "should disallow ternary with different fallback values",
      code: `const region = process.env.AWS_REGION ? "us-east-1" : "us-west-2";`,
      errors: [{ messageId: "noEnvFallback", line: 1, column: 16 }],
    },
    {
      name: "should disallow fallback in return statement",
      code: `function getConfig() {
        return process.env.CONFIG_PATH || "/default/path";
      }`,
      errors: [{ messageId: "noEnvFallback", line: 2, column: 16 }],
    },
    {
      name: "should disallow empty string as fallback",
      code: `const secret = process.env.SECRET_KEY ?? "";`,
      errors: [{ messageId: "noEnvFallback", line: 1, column: 16 }],
    },
    {
      name: "should disallow OR fallback with import.meta.env",
      code: `const mode = import.meta.env.MODE || "dev";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
  ],
});
