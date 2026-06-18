# Pull Request

<!--
Conditional sections below carry the suffix "(when touched)". Remove any
conditional section that does not apply rather than filling it with "N/A".
Keeping only the relevant sections keeps the review surface short.

Conditional sections:
- New or Changed Rule (when touched)
- Config / Preset (when touched)
- Tooling / CI (when touched)
-->

## Title Format

`type(scope): subject` — conventional commits, strict. Subject 50 characters or fewer, lowercase first word, no trailing period.

- The title carries no `#N` reference. The squash merge auto-appends `(#<this-PR>)`; adding `(#N)` duplicates it on `main`.
- Issue closures go in the body, one `Closes #N` per line. `Closes #1, #2` closes only `#1`.
- Do not use `+` as shorthand. Use `and` or commas.
- Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test`.

Examples:

- `feat(rules): add no-floating-promise rule`
- `fix(casing): treat single-letter prefix boundaries`
- `ci(github): pin actions to commit sha`

---

Closes #

<!-- Multiple issues: one per line:
Closes #1
Closes #2
-->

## Summary

Two or three bullets describing what changed and why.

## Architecture Compliance

- [ ] Relative imports end in `.js` (NodeNext); type-only imports use `import type`.
- [ ] No source comments — intent lives in names, commits, and `docs/`.
- [ ] DRY — reused shared helpers in the `core`, `ast`, `fixers`, `text`, and `constants` folders; no duplicated logic.
- [ ] No lint rule disabled, gate skipped, or guard bypassed to make checks pass.

## Release Impact

- Semver bump: <!-- patch | minor | major | none -->

## New or Changed Rule (when touched)

- [ ] Rule in `packages/eslint-plugin-friday/src/rules/<name>.ts`, built with `createRule`.
- [ ] Registered in `packages/eslint-plugin-friday/src/rules/index.ts`.
- [ ] Added to the right preset in `src/configs/base.ts` or `react.ts`; the array name matches the `createRule` name.
- [ ] Test `tests/rules/<name>.test.ts` covers valid, invalid, fixes, and options.
- [ ] Docs `docs/rules/<name>.md` follow the standard template of rationale, valid and invalid examples, options, and when-not-to-use.

## Config / Preset (when touched)

- [ ] Severities applied through `withSeverity`; `base/recommended` and `react/recommended` reflect the intended levels.
- [ ] The plugin still exposes every rule across its presets; run `pnpm build`, then verify `plugin.configs`.

## Tooling / CI (when touched)

- [ ] Workflows pass `actionlint` and `zizmor`.
- [ ] Required status checks in the `main` ruleset updated if a CI job was renamed, added, or removed.
