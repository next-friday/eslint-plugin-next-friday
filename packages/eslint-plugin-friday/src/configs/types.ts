import type { TSESLint } from "@typescript-eslint/utils";

export interface PluginShape {
  meta: { name: string; version: string };
  rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>>;
}

export type Severity = "warn" | "error";

export interface FlatConfig {
  name?: string;
  plugins: Record<string, PluginShape>;
  rules: Record<string, Severity>;
}
