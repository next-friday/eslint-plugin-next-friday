import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { SCREAMING_SNAKE_CASE_REGEX } from "../constants/screaming-snake-case-regex.js";
import { isGlobalScope } from "../ast/nodes.js";
import { createRule } from "../core/create-rule.js";

const isAsConstAssertion = (node: TSESTree.Expression): boolean =>
  node.type === AST_NODE_TYPES.TSAsExpression &&
  node.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
  node.typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
  node.typeAnnotation.typeName.name === "const";

const isStaticValue = (init: TSESTree.Expression): boolean => {
  if (isAsConstAssertion(init) && init.type === AST_NODE_TYPES.TSAsExpression) {
    return isStaticValue(init.expression);
  }

  if (init.type === AST_NODE_TYPES.Literal) {
    return true;
  }

  if (
    init.type === AST_NODE_TYPES.UnaryExpression &&
    init.argument.type === AST_NODE_TYPES.Literal
  ) {
    return true;
  }

  if (
    init.type === AST_NODE_TYPES.TemplateLiteral &&
    init.expressions.length === 0
  ) {
    return true;
  }

  if (init.type === AST_NODE_TYPES.ArrayExpression) {
    return init.elements.every(
      (element) =>
        element !== null &&
        element.type !== AST_NODE_TYPES.SpreadElement &&
        isStaticValue(element),
    );
  }

  if (init.type === AST_NODE_TYPES.ObjectExpression) {
    return init.properties.every(
      (property) =>
        property.type === AST_NODE_TYPES.Property &&
        isStaticValue(property.value as TSESTree.Expression),
    );
  }

  return false;
};

export default createRule({
  name: "no-misleading-constant-case",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow SCREAMING_SNAKE_CASE for non-constant or non-static values",
    },
    messages: {
      mutableScreamingCase:
        "Variable '{{ name }}' uses SCREAMING_SNAKE_CASE but is declared with '{{ kind }}'. Use camelCase for mutable bindings.",
      dynamicScreamingCase:
        "Constant '{{ name }}' uses SCREAMING_SNAKE_CASE but its value is not a static primitive. Use camelCase for dynamic or computed values.",
      localScreamingCase:
        "Local variable '{{ name }}' should use camelCase. SCREAMING_SNAKE_CASE is reserved for global constants.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclaration(node) {
        for (const declarator of node.declarations) {
          if (declarator.id.type !== AST_NODE_TYPES.Identifier) {
            continue;
          }

          const { name } = declarator.id;

          if (!SCREAMING_SNAKE_CASE_REGEX.test(name)) {
            continue;
          }

          if (node.kind === "let" || node.kind === "var") {
            context.report({
              node: declarator.id,
              messageId: "mutableScreamingCase",
              data: { name, kind: node.kind },
            });
            continue;
          }

          if (!isGlobalScope(node)) {
            context.report({
              node: declarator.id,
              messageId: "localScreamingCase",
              data: { name },
            });
            continue;
          }

          if (declarator.init && !isStaticValue(declarator.init)) {
            context.report({
              node: declarator.id,
              messageId: "dynamicScreamingCase",
              data: { name },
            });
          }
        }
      },
    };
  },
});
