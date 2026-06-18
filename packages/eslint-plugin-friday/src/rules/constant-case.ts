import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import {
  stripSurroundingUnderscores,
  toScreamingSnakeCase,
} from "../text/casing.js";
import { SCREAMING_SNAKE_CASE_REGEX } from "../constants/screaming-snake-case-regex.js";
import { SNAKE_CASE_REGEX } from "../constants/snake-case-regex.js";
import { isGlobalScope } from "../ast/nodes.js";
import { isConfigFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const isMagicLiteral = (init: TSESTree.Expression): boolean => {
  if (init.type === AST_NODE_TYPES.Literal) {
    return (
      typeof init.value === "string" ||
      typeof init.value === "number" ||
      typeof init.value === "bigint" ||
      "regex" in init
    );
  }

  if (init.type === AST_NODE_TYPES.UnaryExpression) {
    const { argument, operator } = init;
    if (operator !== "-" && operator !== "+") {
      return false;
    }
    return (
      argument.type === AST_NODE_TYPES.Literal &&
      (typeof argument.value === "number" || typeof argument.value === "bigint")
    );
  }

  if (init.type === AST_NODE_TYPES.NewExpression) {
    if (
      init.callee.type !== AST_NODE_TYPES.Identifier ||
      init.callee.name !== "RegExp"
    ) {
      return false;
    }
    return init.arguments.every(
      (argument) =>
        argument.type === AST_NODE_TYPES.Literal &&
        typeof argument.value === "string",
    );
  }

  return false;
};

export default createRule({
  name: "constant-case",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce SCREAMING_SNAKE_CASE for global magic-number, magic-text, bigint, and RegExp constants",
    },
    messages: {
      useScreamingSnakeCase:
        "Constant '{{ name }}' should use SCREAMING_SNAKE_CASE. Rename to '{{ suggestion }}'.",
      noSnakeCase:
        "Global constant '{{ name }}' should not use snake_case. Rename to '{{ suggestion }}'.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (isConfigFile(context.filename)) {
      return {};
    }

    return {
      VariableDeclaration(node) {
        if (node.kind !== "const" || !isGlobalScope(node)) {
          return;
        }

        for (const declarator of node.declarations) {
          if (
            declarator.id.type !== AST_NODE_TYPES.Identifier ||
            !declarator.init
          ) {
            continue;
          }

          if (!isMagicLiteral(declarator.init)) {
            continue;
          }

          const { name } = declarator.id;

          if (
            SCREAMING_SNAKE_CASE_REGEX.test(stripSurroundingUnderscores(name))
          ) {
            continue;
          }

          if (SNAKE_CASE_REGEX.test(name)) {
            context.report({
              node: declarator.id,
              messageId: "noSnakeCase",
              data: { name, suggestion: toScreamingSnakeCase(name) },
            });
            continue;
          }

          context.report({
            node: declarator.id,
            messageId: "useScreamingSnakeCase",
            data: { name, suggestion: toScreamingSnakeCase(name) },
          });
        }
      },
    };
  },
});
