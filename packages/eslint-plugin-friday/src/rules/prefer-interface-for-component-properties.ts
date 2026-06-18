import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "prefer-interface-for-component-properties",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce 'interface' over 'type' alias for component prop declarations in *.tsx and *.jsx files",
    },
    fixable: "code",
    messages: {
      preferInterface:
        "Component props '{{ name }}' should use 'interface' instead of 'type' alias.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const { sourceCode } = context;

    return {
      TSTypeAliasDeclaration(node) {
        if (
          node.id.type !== AST_NODE_TYPES.Identifier ||
          !node.id.name.endsWith("Props") ||
          node.typeAnnotation.type !== AST_NODE_TYPES.TSTypeLiteral
        ) {
          return;
        }

        const { name } = node.id;

        context.report({
          node: node.id,
          messageId: "preferInterface",
          data: { name },
          fix(fixer) {
            const typeText = sourceCode.getText(node.typeAnnotation);
            const typeParametersText = node.typeParameters
              ? sourceCode.getText(node.typeParameters)
              : "";
            const newText = `interface ${name}${typeParametersText} ${typeText}`;

            const tokenAfter = sourceCode.getTokenAfter(node);
            if (tokenAfter?.value === ";") {
              return fixer.replaceTextRange(
                [node.range[0], tokenAfter.range[1]],
                newText,
              );
            }
            return fixer.replaceText(node, newText);
          },
        });
      },
    };
  },
});
