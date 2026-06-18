import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { GHOST_WRAPPER_TAGS } from "../constants/ghost-wrapper-tags.js";
import { createRule } from "../core/create-rule.js";

const isKeyAttribute = (
  attribute: TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute,
): boolean =>
  attribute.type === AST_NODE_TYPES.JSXAttribute &&
  attribute.name.type === AST_NODE_TYPES.JSXIdentifier &&
  attribute.name.name === "key";

export default createRule({
  name: "no-ghost-wrapper",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow bare <div> and <span> elements that have no meaningful attributes, known as Divitis or ghost wrappers",
    },
    messages: {
      noGhostWrapper:
        "Ghost <{{ tag }}> has no meaningful attributes. Use a Fragment (<>...</>), a semantic element (section, article, header, etc.), or add a meaningful attribute (className, role, data-*, ref, etc.). Note: 'key' alone does not count as meaningful.",
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
        if (node.name.type !== AST_NODE_TYPES.JSXIdentifier) {
          return;
        }

        const tag = node.name.name;
        if (!GHOST_WRAPPER_TAGS.has(tag)) {
          return;
        }

        const meaningfulAttributes = node.attributes.filter(
          (attribute) => !isKeyAttribute(attribute),
        );

        if (meaningfulAttributes.length === 0) {
          context.report({
            node,
            messageId: "noGhostWrapper",
            data: { tag },
          });
        }
      },
    };
  },
});
