import type { Severity } from "./types.js";

export const withSeverity = (
  ruleNames: readonly string[],
  severity: Severity,
): Record<string, Severity> =>
  Object.fromEntries(
    ruleNames.map((name) => [`next-friday/${name}`, severity]),
  );
