---
paths:
  - "packages/eslint-plugin-friday/src/core/**"
  - "packages/eslint-plugin-friday/src/constants/**"
  - "packages/eslint-plugin-friday/src/ast/**"
  - "packages/eslint-plugin-friday/src/fixers/**"
  - "packages/eslint-plugin-friday/src/text/**"
  - "packages/eslint-plugin-friday/tests/core/**"
  - "packages/eslint-plugin-friday/tests/constants/**"
  - "packages/eslint-plugin-friday/tests/ast/**"
  - "packages/eslint-plugin-friday/tests/fixers/**"
  - "packages/eslint-plugin-friday/tests/text/**"
---

# Shared layer structure rules

- The shared layer is split into five domain folders below `packages/eslint-plugin-friday/src/`, named after the kind of value each module operates on:
  - `core/` — rule infrastructure. `create-rule.ts` is the `createRule` factory.
  - `constants/` — static literal data, one constant per file. Each file exports a single named constant, named in kebab-case after that constant, such as `boolean-prefixes.ts` for `BOOLEAN_PREFIXES`. A rule imports the exact constant files it needs; never group unrelated constants in one file.
  - `ast/` — helpers over the TSESTree. `nodes.ts` holds generic node predicates and walkers; `jsx.ts` holds JSX and React node helpers.
  - `fixers/` — `RuleFix` builders. `sorting.ts` compares and reorders nodes.
  - `text/` — pure string helpers. `casing.ts` checks and transforms case; `filename.ts` classifies filenames.
- Never create a catch-all `utils/` folder. A catch-all hides the concern a module belongs to and becomes a dumping ground.
- A new shared module goes in the folder named after the value it operates on. AST node in, fix out belongs in `fixers/`; string in, string out belongs in `text/`. When a module fits none of the five, add a new domain folder rather than a generic one.
- The five folders are the bottom layer. They may import each other but must never import from `rules/` or `configs/`. This is enforced by the `shared-stays-leaf` rule in `.dependency-cruiser.mjs`.
- Tests mirror the source layout: a module under `src/<domain>/` is tested by `tests/<domain>/<name>.test.ts`.
