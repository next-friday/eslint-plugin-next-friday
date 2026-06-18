import { type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import {
  isJsxElementOrFragment,
  isSingleLine,
  isWhitespaceJsxText,
} from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "jsx-no-newline-single-line-elements",
  meta: {
    type: "layout",
    docs: {
      description:
        "Disallow empty lines between single-line sibling JSX elements",
    },
    fixable: "whitespace",
    messages: {
      forbidNewline:
        "Unexpected empty line between single-line sibling JSX elements.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const checkSiblings = (children: readonly TSESTree.JSXChild[]): void => {
      const elements = children.filter((child) => !isWhitespaceJsxText(child));

      for (const [index, next] of elements.entries()) {
        if (index === 0) {
          continue;
        }

        const current = elements[index - 1];

        if (!isJsxElementOrFragment(current) || !isJsxElementOrFragment(next)) {
          continue;
        }

        if (!isSingleLine(current) || !isSingleLine(next)) {
          continue;
        }

        if (next.loc.start.line - current.loc.end.line < 2) {
          continue;
        }

        context.report({
          node: next,
          messageId: "forbidNewline",
          fix(fixer) {
            const indent = " ".repeat(next.loc.start.column);

            return fixer.replaceTextRange(
              [current.range[1], next.range[0]],
              `\n${indent}`,
            );
          },
        });
      }
    };

    return {
      JSXElement(node) {
        if (node.children.length > 0) {
          checkSiblings(node.children);
        }
      },
      JSXFragment(node) {
        if (node.children.length > 0) {
          checkSiblings(node.children);
        }
      },
    };
  },
});
