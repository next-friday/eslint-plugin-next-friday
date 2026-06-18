import { withSeverity } from "./build-rules.js";
import type { FlatConfig, PluginShape, Severity } from "./types.js";

export const buildAll = (
  plugin: PluginShape,
  severity: Severity,
): FlatConfig => ({
  plugins: { "next-friday": plugin },
  rules: withSeverity(Object.keys(plugin.rules), severity),
});
