import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const ALLOWED_EXPRESSION_TYPES: ReadonlySet<AST_NODE_TYPES> = new Set([
  AST_NODE_TYPES.Identifier,
  AST_NODE_TYPES.Literal,
  AST_NODE_TYPES.JSXElement,
  AST_NODE_TYPES.JSXFragment,
  AST_NODE_TYPES.MemberExpression,
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.FunctionExpression,
]);

export default createRule({
  name: "jsx-simple-properties",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce JSX props to only contain strings, simple variables, or ReactNode elements",
    },
    messages: {
      noComplexProp:
        "JSX props should only contain strings, simple variables, or ReactNode elements. Extract complex expressions to a variable first.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    return {
      JSXAttribute(node) {
        if (
          !node.value ||
          node.value.type !== AST_NODE_TYPES.JSXExpressionContainer
        ) {
          return;
        }

        const { expression } = node.value;

        if (expression.type === AST_NODE_TYPES.JSXEmptyExpression) {
          return;
        }

        if (!ALLOWED_EXPRESSION_TYPES.has(expression.type)) {
          context.report({
            node: node.value,
            messageId: "noComplexProp",
          });
        }
      },
    };
  },
});
