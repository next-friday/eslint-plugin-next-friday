import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "prefer-guard-clause",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce guard clause pattern instead of nested if statements",
    },
    messages: {
      preferGuardClause:
        "Avoid nested if statements. Use guard clauses (early returns) instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        const { consequent } = node;

        if (consequent.type === AST_NODE_TYPES.BlockStatement) {
          const hasNestedIf = consequent.body.some(
            (statement) => statement.type === AST_NODE_TYPES.IfStatement,
          );

          if (hasNestedIf && consequent.body.length === 1) {
            context.report({ node, messageId: "preferGuardClause" });
          }
        }

        if (consequent.type === AST_NODE_TYPES.IfStatement) {
          context.report({ node, messageId: "preferGuardClause" });
        }
      },
    };
  },
});
