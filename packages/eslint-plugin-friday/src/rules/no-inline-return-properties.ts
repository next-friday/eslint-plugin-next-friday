import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

const isShorthandProperty = (property: TSESTree.Property): boolean =>
  property.shorthand;

const getKeyName = (key: TSESTree.PropertyName): string | undefined => {
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name;
  }

  if (key.type === AST_NODE_TYPES.Literal) {
    return String(key.value);
  }

  return undefined;
};

export default createRule({
  name: "no-inline-return-properties",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require return object properties to use shorthand notation by extracting non-shorthand values to const variables",
    },
    messages: {
      noInlineProperty:
        "Property '{{ name }}' should use shorthand notation. Extract the value to a const variable before the return statement.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ReturnStatement(node) {
        if (
          !node.argument ||
          node.argument.type !== AST_NODE_TYPES.ObjectExpression
        ) {
          return;
        }

        for (const property of node.argument.properties) {
          if (
            property.type !== AST_NODE_TYPES.Property ||
            isShorthandProperty(property)
          ) {
            continue;
          }

          if (
            property.method ||
            property.kind === "get" ||
            property.kind === "set"
          ) {
            continue;
          }

          context.report({
            node: property,
            messageId: "noInlineProperty",
            data: { name: getKeyName(property.key) ?? "unknown" },
          });
        }
      },
    };
  },
});
