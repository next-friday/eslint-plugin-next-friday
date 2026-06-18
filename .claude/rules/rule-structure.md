---
paths:
  - "packages/eslint-plugin-friday/src/rules/**"
  - "packages/eslint-plugin-friday/src/configs/**"
  - "packages/eslint-plugin-friday/tests/rules/**"
  - "packages/eslint-plugin-friday/docs/rules/**"
---

# Rule structure rules

- Every rule file follows ONE skeleton, in this order:
  1. External imports from `@typescript-eslint/utils`.
  2. Local shared-module imports from `core/`, `ast/`, `fixers/`, and `text/`. They are relative and MUST end in `.js`.
  3. `createRule({ name, meta: { type, docs, messages, schema }, defaultOptions, create })`.
  4. `export default <rule>;`
- Use `createRule` from `src/core/create-rule.js`. Do not recreate `ESLintUtils.RuleCreator`.
- Register every rule in `src/rules/index.ts` and add it to the right preset in `src/configs/{base,react}.ts` through `withSeverity`.
- One test file per rule under `tests/rules/`, using vitest and `@typescript-eslint/rule-tester` through the `tests/setup.ts` helper `createRuleTester`.
- One doc per rule under `docs/rules/` on an identical template: summary, rationale, valid and invalid examples, options, and when-not-to-use.
