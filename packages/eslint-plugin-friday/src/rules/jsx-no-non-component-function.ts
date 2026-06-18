import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { type FunctionNode } from "../ast/nodes.js";
import { isJsxFile } from "../text/filename.js";
import { isPascalCase } from "../text/casing.js";
import { ALLOW_OPTION_SCHEMA } from "../constants/allow-option-schema.js";
import { createRule } from "../core/create-rule.js";

const COMPONENT_RETURN_TYPES: ReadonlySet<string> = new Set([
  "JSX",
  "ReactElement",
  "ReactNode",
]);

const isReactComponent = (node: FunctionNode): boolean => {
  if (
    node.type === AST_NODE_TYPES.FunctionDeclaration &&
    node.id &&
    isPascalCase(node.id.name)
  ) {
    return true;
  }

  const returnType = node.returnType?.typeAnnotation;
  return (
    returnType?.type === AST_NODE_TYPES.TSTypeReference &&
    returnType.typeName.type === AST_NODE_TYPES.Identifier &&
    COMPONENT_RETURN_TYPES.has(returnType.typeName.name)
  );
};

const getFunctionName = (
  node: FunctionNode,
  declarator?: TSESTree.VariableDeclarator,
): string | undefined => {
  if (declarator?.id.type === AST_NODE_TYPES.Identifier) {
    return declarator.id.name;
  }

  if (node.type === AST_NODE_TYPES.FunctionDeclaration && node.id) {
    return node.id.name;
  }

  return undefined;
};

export default createRule<[{ allow: string[] }], "noTopLevelFunction">({
  name: "jsx-no-non-component-function",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow non-component functions defined at top level in .tsx and .jsx files",
    },
    messages: {
      noTopLevelFunction:
        "Non-component functions should not be defined at the top level of .tsx/.jsx files. Extract it to a separate module so the component file stays focused.",
    },
    schema: [ALLOW_OPTION_SCHEMA],
    defaultOptions: [{ allow: [] }],
  },
  defaultOptions: [{ allow: [] }],
  create(context, [{ allow }]) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const allowed = new Set(allow);

    const checkTopLevelFunction = (
      node:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression
        | TSESTree.FunctionDeclaration,
      declarator?: TSESTree.VariableDeclarator,
    ): void => {
      if (isReactComponent(node)) {
        return;
      }

      if (
        declarator?.id.type === AST_NODE_TYPES.Identifier &&
        isPascalCase(declarator.id.name)
      ) {
        return;
      }

      const name = getFunctionName(node, declarator);
      if (name !== undefined && allowed.has(name)) {
        return;
      }

      context.report({
        node: declarator ?? node,
        messageId: "noTopLevelFunction",
      });
    };

    return {
      "Program > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression":
        (node: TSESTree.ArrowFunctionExpression) => {
          checkTopLevelFunction(
            node,
            node.parent as TSESTree.VariableDeclarator,
          );
        },
      "Program > VariableDeclaration > VariableDeclarator > FunctionExpression":
        (node: TSESTree.FunctionExpression) => {
          checkTopLevelFunction(
            node,
            node.parent as TSESTree.VariableDeclarator,
          );
        },
      "Program > FunctionDeclaration": (node: TSESTree.FunctionDeclaration) => {
        checkTopLevelFunction(node);
      },
    };
  },
});
