---
paths:
  - "**/*.json"
  - "**/*.yaml"
  - "**/*.yml"
  - "**/*.config.ts"
  - "**/*.config.mjs"
---

# No default noise rule

- Omit any config key whose value equals the tool's documented default. A key that restates the default adds noise without changing behavior, such as `fixed: []`, `linked: []`, and `ignore: []` in a changesets config.
- Keep a key only when its value differs from the default or the tool requires it explicitly, such as `access: public` in a changesets config where the default is `restricted`.
- Do not scaffold empty or placeholder fields for later. Add a key when a real value needs it.
- Before adding a setting, check the tool's default. When the value matches, leave it out.
