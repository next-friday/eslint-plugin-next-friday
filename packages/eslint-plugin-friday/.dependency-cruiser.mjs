const SRC = "^src";

export default {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies make the graph impossible to reason about.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Modules reachable from nothing are usually dead code.",
      from: {
        orphan: true,
        pathNot: [
          String.raw`\.d\.ts$`,
          String.raw`${SRC}/index\.ts$`,
          String.raw`${SRC}/configs/types\.ts$`,
        ],
      },
      to: {},
    },
    {
      name: "shared-stays-leaf",
      severity: "error",
      comment:
        "Shared modules are the bottom layer; they must not import rules or configs.",
      from: { path: `${SRC}/(core|constants|ast|fixers|text)/` },
      to: { path: [`${SRC}/rules/`, `${SRC}/configs/`] },
    },
    {
      name: "rules-no-configs",
      severity: "error",
      comment:
        "Rules depend on shared modules only; preset assembly lives above them.",
      from: { path: `${SRC}/rules/` },
      to: { path: `${SRC}/configs/` },
    },
    {
      name: "configs-no-rule-modules",
      severity: "error",
      comment:
        "Configs reference rules by name string, never by importing rule modules.",
      from: { path: `${SRC}/configs/` },
      to: { path: `${SRC}/rules/` },
    },
    {
      name: "no-test-in-src",
      severity: "error",
      comment: "Production source must not import test files.",
      from: { path: SRC, pathNot: String.raw`\.test\.ts$` },
      to: { path: String.raw`\.test\.ts$` },
    },
  ],
  options: {
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: [".ts", ".js", ".json"],
    },
    doNotFollow: { path: "node_modules" },
    exclude: { path: "node_modules" },
  },
};
