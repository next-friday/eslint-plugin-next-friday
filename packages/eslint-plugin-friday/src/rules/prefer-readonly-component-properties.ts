import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { isReactComponentFunction } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

const isAlreadyReadonly = (node: TSESTree.TypeNode): boolean =>
  node.type === AST_NODE_TYPES.TSTypeReference &&
  node.typeName.type === AST_NODE_TYPES.Identifier &&
  node.typeName.name === "Readonly";

export default createRule({
  name: "prefer-readonly-component-properties",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce Readonly wrapper for React component props when using named types or interfaces",
    },
    fixable: "code",
    messages: {
      useReadonly:
        "Component props should be wrapped with Readonly<> for immutability",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const { sourceCode } = context;

    const checkFunction = (
      node:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression
        | TSESTree.FunctionDeclaration,
    ): void => {
      if (!isReactComponentFunction(node) || node.params.length !== 1) {
        return;
      }

      const parameter = node.params[0];
      if (
        parameter.type !== AST_NODE_TYPES.Identifier ||
        !parameter.typeAnnotation
      ) {
        return;
      }

      const { typeAnnotation } = parameter.typeAnnotation;
      if (
        typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference ||
        isAlreadyReadonly(typeAnnotation)
      ) {
        return;
      }

      const typeText = sourceCode.getText(typeAnnotation);

      context.report({
        node: parameter.typeAnnotation,
        messageId: "useReadonly",
        fix: (fixer) =>
          fixer.replaceText(typeAnnotation, `Readonly<${typeText}>`),
      });
    };

    return {
      ArrowFunctionExpression: checkFunction,
      FunctionExpression: checkFunction,
      FunctionDeclaration: checkFunction,
    };
  },
});
