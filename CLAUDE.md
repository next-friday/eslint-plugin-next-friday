# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Turborepo + pnpm monorepo publishing `eslint-plugin-friday` — an opinionated set of 45 ESLint rules for consistent, LLM-friendly TypeScript and React code. The publishable package lives in `packages/eslint-plugin-friday`; the repo root holds workspace tooling only.

## Commands

Run from the repo root, where Turborepo fans out to the package:

| Task                                  | Command                             |
| ------------------------------------- | ----------------------------------- |
| Build (tsdown → ESM+CJS+d.ts)         | `pnpm build`                        |
| Test (all)                            | `pnpm test`                         |
| Type-check                            | `pnpm typecheck`                    |
| Lint                                  | `pnpm lint`                         |
| Dead-code / deps check                | `pnpm knip`                         |
| Module-graph / layering check         | `pnpm depcruise`                    |
| Format / check                        | `pnpm format` / `pnpm format:check` |
| Sort package.json / check             | `pnpm sort` / `pnpm sort:check`     |
| Regenerate rule + README docs / check | `pnpm doc` / `pnpm doc:check`       |
| Smoke-test rules on real repos        | `pnpm remote-test`                  |
| Add a changeset                       | `pnpm changeset`                    |

Coverage runs on v8 and is gated at 100 statements, branches, functions, and lines:

```sh
pnpm --filter eslint-plugin-friday test:coverage
```

**Single test** with vitest, run from the package:

```sh
pnpm --filter eslint-plugin-friday exec vitest run tests/rules/<rule-name>.test.ts
```

Watch mode alias: `pnpm --filter eslint-plugin-friday test:watch`. `turbo.json` declares no `build` dependency for `test` or `typecheck`; both run against `src`. CI runs `pnpm build` before the `lint` check because the flat config loads the plugin from its built entry point.

## Architecture

The plugin is assembled in `packages/eslint-plugin-friday/src/index.ts`: it imports the `rules` registry and builds six flat configs — `base`, `base/recommended`, `react`, `react/recommended`, `all`, `all/recommended`. The `/recommended` variants are `error`; the bare variants are `warn`. Severities come from `withSeverity()` in `configs/build-rules.ts` applied to the rule-name arrays in `configs/base.ts` and `configs/react.ts`. The `all`/`all/recommended` configs in `configs/all.ts` are built dynamically from `Object.keys(plugin.rules)` — every rule added to `src/rules/index.ts` is automatically included with no further wiring required.

A rule reaches consumers only when it is wired in **three** places:

1. `src/rules/<name>.ts` — the rule, built with `createRule` from `core/create-rule.js`, a preconfigured `ESLintUtils.RuleCreator` that you must never recreate.
2. `src/rules/index.ts` — imported and added to the `rules` map.
3. `src/configs/base.ts` **or** `react.ts` — its name added to the right severity array.

The rule name in the array must match the `name` passed to `createRule`, or the preset enables a rule that doesn't exist. Rules in `all`/`all/recommended` need no step 3 — they are picked up automatically.

### Shared layer — reuse, don't reimplement

Cross-rule logic lives in five domain folders below `src/`, split by what each module operates on, and MUST be reused:

- `core/` — rule infrastructure: `create-rule.ts`, the `createRule` factory.
- `constants/` — static literal data, one constant per file. Each file exports a single named constant such as `boolean-prefixes.ts` or `node-builtins.ts`. A rule imports the exact constant files it needs.
- `ast/` — helpers over the TSESTree: `nodes.ts` for generic node predicates and walkers, and `jsx.ts` for JSX and React node helpers.
- `fixers/` — `RuleFix` builders: `sorting.ts` for comparison and reorder fixes.
- `text/` — pure string helpers: `casing.ts` for case checks and transforms and `filename.ts` for filename classification.

Add to the matching folder rather than duplicating logic in a rule. A module belongs to the folder named after the kind of value it operates on, never a catch-all `utils/`. A new constant is its own file under `constants/`.

### Per-rule symmetry

Every rule file follows one skeleton: external `@typescript-eslint/utils` imports → local shared-module imports from `core/`, `ast/`, `fixers/`, and `text/`, each ending in `.js` → `createRule({ name, meta, defaultOptions, create })` → `export default`. Each rule pairs with `tests/rules/<name>.test.ts`, which runs on vitest and `@typescript-eslint/rule-tester` through `tests/setup.ts`, and with `docs/rules/<name>.md`. Match the existing files exactly.

`tests/setup.ts` exports `createRuleTester(jsx = false)`. JSX/React rules must call `createRuleTester(true)` or the parser won't handle JSX syntax.

## Hard conventions

These are enforced by the rules in `.claude/rules/`, CI, and review — follow them:

- **NodeNext imports:** every relative import ends in `.js`; type-only imports use `import type`. The tsconfig is NodeNext with verbatimModuleSyntax.
- **No source comments:** intent lives in names, commits, and `docs/`.
- **DRY + symmetric:** extract shared helpers/constants before writing logic twice; keep every similar file structurally identical.
- **Never disable a check to pass:** fix the root cause; suppressing a lint rule, gate, or guard is a last resort needing explicit approval.

## Workflow

Every change ships as: **issue → branch → PR → green checks + 1 review → squash merge**.

- Branch from the issue with `gh issue develop <n> --checkout` so the head is `<n>-<kebab>`. `pr-validate.yml` rejects any other branch shape.
- PR body must carry `Closes #<n>`; the title carries no `#N`, since the squash appends `(#PR)`.
- `feat|fix|perf|refactor` PRs require a changeset from `pnpm changeset`.

## Commits, CI, release

- **Commit/PR titles** follow the Hybrid Convention in `.commitlintrc.json`: `type(scope): subject`, with the type from the `build|chore|ci|docs|feat|fix|perf|refactor|revert|setup|style|test` enum, a **required** scope, all lowercase, a subject of 50 characters or fewer, and no body or footer. Commitlint enforces this through the commit-msg hook and `pr-validate.yml`.
- **CI** in `.github/workflows/ci.yml` runs a `quality` matrix of lint, typecheck, knip, format:check, depcruise, actionlint, and zizmor, `test` on Node 22 and 24, and `build`, all aggregated behind a single **`CI Success`** gate job. Security workflows run in parallel: SonarCloud and `pnpm audit`; CodeQL runs through GitHub's default code-scanning setup rather than a workflow file in the repo. Secret scanning is handled by GitHub-native push protection and secret scanning rather than a dedicated workflow. The `main` ruleset requires every check, allows no bypass, and requires branches to be up to date — a single red check blocks merge for everyone.
- **Local gates** mirror CI: the `commit-msg` hook runs commitlint and fails immediately on a non-conforming title; the `pre-commit` hook runs `lint-staged` scoped to staged files for speed; the `pre-push` hook runs the full suite — gitleaks, format:check, sort:check, doc:check, lint, knip, depcruise, typecheck, build, test, and `pnpm audit`. A commit can pass while a push fails because the scopes differ.
- **Whole-repo typecheck**: `pnpm typecheck` runs the package across `src`, `tests`, and `*.config.ts`, then a root `tsc -p tsconfig.json` covering root TS such as `eslint-remote-tester.config.ts`; the root config maps `eslint-plugin-friday` to source so it needs no build.
- **Release** is changesets-driven in `release.yml`: a push to `main` touching `.changeset/**` opens a "version packages" PR that bumps `packages/eslint-plugin-friday/package.json`; the follow-up run publishes to npm with provenance. Never hand-edit the package version.

## Required-check coupling

The ruleset lists individual CI check names as required. **Renaming, adding, or removing a CI job means updating the ruleset's required-status-checks list to match** — otherwise the merge gate waits on a check name that never reports. `CI Success` is also required and aggregates the `ci.yml` jobs, so it catches any `ci.yml` job that is dropped from the list.

## Protected files

A pre-write hook at `.claude/hooks/protect-files.sh` blocks `Write`/`Edit` on `eslint.config.mjs`, `knip.json`, `.prettierrc.json`, `.prettierignore`, `pnpm-lock.yaml`, and `.env*`. Edit these through Bash such as with a heredoc instead. A post-write hook formats and `eslint --fix`es each saved file.
