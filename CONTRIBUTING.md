# Contributing

Thanks for your interest in improving `eslint-plugin-friday`.

## Development setup

```sh
pnpm install
pnpm build
```

## Workflow

Every change ships through one issue and one pull request.

1. Open an issue or pick an existing one, then create a branch from it: `gh issue develop <n> --checkout`.
2. Make the change, following the conventions in [`.claude/rules/`](.claude/rules/).
3. Add a changeset for any behavior change: `pnpm changeset`.
4. Run the gates locally; the pre-push hook runs them too.
5. Open a pull request whose body closes the issue with `Closes #<n>`.

## Quality gates

All of these must pass before a pull request can merge:

```sh
pnpm format:check
pnpm sort:check
pnpm lint
pnpm knip
pnpm depcruise
pnpm typecheck
pnpm build
pnpm test
```

## Adding a rule

A rule is wired in three places:

1. `packages/eslint-plugin-friday/src/rules/<name>.ts` — the rule, built with `createRule`.
2. `packages/eslint-plugin-friday/src/rules/index.ts` — registered in the `rules` map.
3. `packages/eslint-plugin-friday/src/configs/{base,react}.ts` — added to the right preset.

Each rule pairs with a test at `tests/rules/<name>.test.ts` and docs at `docs/rules/<name>.md`.

## Commit and title convention

Commits and pull request titles follow `<type>(<scope>): <subject>`:

- Type is one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test`.
- Scope is required and lowercase.
- Subject is lowercase and at most 50 characters.

Issue references go in the pull request body as `Closes #<n>`, never the title.
