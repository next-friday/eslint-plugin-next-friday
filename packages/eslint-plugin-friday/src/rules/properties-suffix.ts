import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { ALLOW_OPTION_SCHEMA } from "../constants/allow-option-schema.js";
import { isJsxFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

export default createRule<[{ allow: string[] }], "missingPropsSuffix">({
  name: "properties-suffix",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce 'Props' suffix for interfaces and types in *.tsx files",
    },
    messages: {
      missingPropsSuffix:
        "Interface/type '{{ name }}' should end with 'Props'. Rename to '{{ suggestion }}'.",
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

    const checkTypeName = (name: string, node: TSESTree.Node): void => {
      if (!allowed.has(name) && !name.endsWith("Props")) {
        context.report({
          node,
          messageId: "missingPropsSuffix",
          data: { name, suggestion: `${name}Props` },
        });
      }
    };

    return {
      TSInterfaceDeclaration(node) {
        checkTypeName(node.id.name, node.id);
      },
      TSTypeAliasDeclaration(node) {
        if (
          node.id.type === AST_NODE_TYPES.Identifier &&
          node.typeAnnotation.type === AST_NODE_TYPES.TSTypeLiteral
        ) {
          checkTypeName(node.id.name, node.id);
        }
      },
    };
  },
});
