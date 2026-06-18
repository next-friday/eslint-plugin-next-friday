import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

const isComplexExpression = (
  node: TSESTree.Expression | null | undefined,
): boolean =>
  node?.type === AST_NODE_TYPES.ConditionalExpression ||
  node?.type === AST_NODE_TYPES.LogicalExpression ||
  node?.type === AST_NODE_TYPES.NewExpression;

export default createRule({
  name: "no-complex-inline-return",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow complex inline expressions in return statements - prefer extracting to a const first",
    },
    messages: {
      noComplexInlineReturn:
        "Avoid returning complex expressions directly. Extract to a const variable first for better readability.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ReturnStatement(node) {
        if (node.argument && isComplexExpression(node.argument)) {
          context.report({
            node: node.argument,
            messageId: "noComplexInlineReturn",
          });
        }
      },
    };
  },
});
