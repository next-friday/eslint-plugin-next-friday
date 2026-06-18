---
paths:
  - "**/*.md"
---

# Prose style rules

## Parentheses

Parentheses belong to code, not to prose. The test is whether the parentheses are part of a code token or wrap a parenthetical aside.

- Keep parentheses only when they form code or markup: a call like `withSeverity()`, a signature like `type(scope): subject`, an object argument like `createRule({ ... })`, a literal token being quoted like `(#PR)`, or a Markdown link target like `[text](url)`.
- Rewrite every parenthetical aside as a full sentence or inline prose, even when the aside contains code. A file path reads `in configs/all.ts`, never `(configs/all.ts)`. A command reads inline, never `(gh issue develop <n>)`. An example reads `such as dayjs`, never `(e.g. dayjs)`. An enumeration reads `a prefix such as is, has, or should`, never `a prefix (is, has, should)`.
- Never put a requirement, caveat, governance point, clarification, example, or enumeration in parentheses.
