import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "jsx-spread-properties-last",
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce JSX spread attributes appear after all other props",
    },
    messages: {
      spreadNotLast: "JSX spread attributes must come after all other props.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const { attributes } = node;

        let lastNonSpreadIndex = -1;
        for (const [index, attribute] of attributes.entries()) {
          if (attribute.type !== AST_NODE_TYPES.JSXSpreadAttribute) {
            lastNonSpreadIndex = index;
          }
        }

        for (const [index, attribute] of attributes.entries()) {
          if (
            attribute.type === AST_NODE_TYPES.JSXSpreadAttribute &&
            index < lastNonSpreadIndex
          ) {
            context.report({
              node: attribute,
              messageId: "spreadNotLast",
            });
          }
        }
      },
    };
  },
});
