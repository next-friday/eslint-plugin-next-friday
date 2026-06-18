---
paths:
  - "packages/eslint-plugin-friday/src/**"
---

# DRY rules

- Never duplicate logic. Before writing the same block twice, extract a shared helper or constant.
- The shared layer lives in five domain folders below `packages/eslint-plugin-friday/src/`, split by what each module operates on:
  - `core/` — rule infrastructure: the `create-rule.ts` factory.
  - `constants/` — static literal data, one constant per file such as `boolean-prefixes.ts`, `node-builtins.ts`, and the case regexes. A rule imports the exact constant files it needs.
  - `ast/` — helpers over the TSESTree: `nodes.ts` such as `forEachFunctionParameter` and `isBooleanLiteral`, plus `jsx.ts`.
  - `fixers/` — `RuleFix` builders: `sorting.ts`.
  - `text/` — pure string helpers: `casing.ts` such as `capitalize` and `isPascalCase`, plus `filename.ts` for filename classification.
- Reuse existing helpers. Do not re-implement.
- Never add a catch-all `utils/`. A new module goes in the folder named after the kind of value it operates on.
