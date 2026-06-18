import type { TSESTree } from "@typescript-eslint/utils";

import {
  getObjectTypeMembers,
  getPropertySignatures,
  partitionByOptional,
  reorderNodesByText,
} from "../fixers/sorting.js";
import { createRule } from "../core/create-rule.js";

const isRequiredBeforeOptional = (
  members: readonly TSESTree.TypeElement[],
): boolean => {
  const properties = getPropertySignatures(members);

  if (properties.length < 2) {
    return true;
  }

  const firstOptionalIndex = properties.findIndex(
    (property) => property.optional,
  );

  if (firstOptionalIndex === -1) {
    return true;
  }

  return properties
    .slice(firstOptionalIndex)
    .every((property) => property.optional);
};

export default createRule({
  name: "sort-type-required-first",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce required properties come before optional properties in TypeScript interfaces and type aliases",
    },
    fixable: "code",
    messages: {
      unsortedTypeMembers:
        "Required type members should come before optional members.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    const check = (
      node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
    ): void => {
      const members = getObjectTypeMembers(node);

      if (members === undefined || isRequiredBeforeOptional(members)) {
        return;
      }

      const properties = getPropertySignatures(members);
      const { required, optional } = partitionByOptional(properties);

      context.report({
        node,
        messageId: "unsortedTypeMembers",
        fix: (fixer) =>
          reorderNodesByText(
            properties,
            [...required, ...optional],
            sourceCode,
            fixer,
          ),
      });
    };

    return {
      TSInterfaceDeclaration: check,
      TSTypeAliasDeclaration: check,
    };
  },
});
