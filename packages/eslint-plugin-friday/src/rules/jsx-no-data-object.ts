import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { unwrapTypeAssertion } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

const isNestedValue = (value: TSESTree.Expression | null): boolean => {
  const unwrapped = unwrapTypeAssertion(value)!;

  if (unwrapped.type === AST_NODE_TYPES.ObjectExpression) {
    return true;
  }

  if (unwrapped.type === AST_NODE_TYPES.ArrayExpression) {
    return unwrapped.elements.some((element) => {
      if (!element || element.type === AST_NODE_TYPES.SpreadElement) {
        return false;
      }
      const inner = unwrapTypeAssertion(element);
      return (
        inner?.type === AST_NODE_TYPES.ObjectExpression ||
        inner?.type === AST_NODE_TYPES.ArrayExpression
      );
    });
  }

  return false;
};

const hasNestedProperty = (object: TSESTree.ObjectExpression): boolean =>
  object.properties.some((property) => {
    if (property.type !== AST_NODE_TYPES.Property) {
      return false;
    }
    if (property.value.type === AST_NODE_TYPES.AssignmentPattern) {
      return false;
    }
    return isNestedValue(property.value as TSESTree.Expression);
  });

const getObjectInitializer = (
  init: TSESTree.Expression | null,
): TSESTree.ObjectExpression | undefined => {
  const unwrapped = unwrapTypeAssertion(init);
  return unwrapped?.type === AST_NODE_TYPES.ObjectExpression
    ? unwrapped
    : undefined;
};

export default createRule({
  name: "jsx-no-data-object",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow top-level nested object literals in .tsx/.jsx files; extract them to a data file",
    },
    messages: {
      noDataObject:
        "Top-level nested object literal belongs in a data file (e.g. *.data.ts), not a .tsx/.jsx component file. Extract '{{ name }}' to a sibling data module.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const checkDeclarator = (node: TSESTree.VariableDeclarator): void => {
      const objectInit = getObjectInitializer(node.init);
      if (!objectInit) {
        return;
      }

      if (!hasNestedProperty(objectInit)) {
        return;
      }

      const name =
        node.id.type === AST_NODE_TYPES.Identifier
          ? node.id.name
          : "<destructured>";

      context.report({
        node,
        messageId: "noDataObject",
        data: { name },
      });
    };

    return {
      "Program > VariableDeclaration > VariableDeclarator": checkDeclarator,
      "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator":
        checkDeclarator,
    };
  },
});
