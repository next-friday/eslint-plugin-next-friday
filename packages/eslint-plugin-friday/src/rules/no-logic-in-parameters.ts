import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { ALLOW_OPTION_SCHEMA } from "../constants/allow-option-schema.js";
import { COMPARISON_OPERATORS } from "../constants/comparison-operators.js";
import { createRule } from "../core/create-rule.js";

const isComplexExpression = (
  node: TSESTree.Expression | TSESTree.SpreadElement,
): boolean => {
  if (
    node.type === AST_NODE_TYPES.ConditionalExpression ||
    node.type === AST_NODE_TYPES.LogicalExpression
  ) {
    return true;
  }

  if (node.type === AST_NODE_TYPES.BinaryExpression) {
    return COMPARISON_OPERATORS.has(node.operator);
  }

  if (node.type === AST_NODE_TYPES.UnaryExpression) {
    return node.operator === "!";
  }

  return false;
};

const getCalleeName = (callee: TSESTree.Node): string | undefined => {
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return callee.name;
  }

  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return callee.property.name;
  }

  return undefined;
};

export default createRule<[{ allow: string[] }], "noLogicInParams">({
  name: "no-logic-in-parameters",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow logic or conditions in function parameters - extract to a const variable first",
    },
    messages: {
      noLogicInParams:
        "Avoid logic or conditions in function parameters. Extract to a const variable first for better readability.",
    },
    schema: [ALLOW_OPTION_SCHEMA],
    defaultOptions: [{ allow: [] }],
  },
  defaultOptions: [{ allow: [] }],
  create(context, [{ allow }]) {
    const allowed = new Set(allow);

    const checkArguments = (
      arguments_: readonly TSESTree.CallExpressionArgument[],
    ): void => {
      for (const argument of arguments_) {
        if (isComplexExpression(argument)) {
          context.report({ node: argument, messageId: "noLogicInParams" });
        }

        if (argument.type === AST_NODE_TYPES.ArrayExpression) {
          for (const element of argument.elements) {
            if (element && isComplexExpression(element)) {
              context.report({
                node: element,
                messageId: "noLogicInParams",
              });
            }
          }
        }
      }
    };

    const checkCallee = (
      callee: TSESTree.Node,
      arguments_: readonly TSESTree.CallExpressionArgument[],
    ): void => {
      const name = getCalleeName(callee);
      if (name !== undefined && allowed.has(name)) {
        return;
      }
      checkArguments(arguments_);
    };

    return {
      CallExpression(node) {
        checkCallee(node.callee, node.arguments);
      },
      NewExpression(node) {
        checkCallee(node.callee, node.arguments);
      },
    };
  },
});
