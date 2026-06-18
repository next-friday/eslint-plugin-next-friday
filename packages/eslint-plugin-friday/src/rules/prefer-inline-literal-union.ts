import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

const LITERAL_UNION_MEMBER_TYPES = [
  AST_NODE_TYPES.TSLiteralType,
  AST_NODE_TYPES.TSNullKeyword,
  AST_NODE_TYPES.TSUndefinedKeyword,
] as const;

const isLiteralUnionType = (node: TSESTree.TypeNode): boolean =>
  node.type === AST_NODE_TYPES.TSUnionType &&
  node.types.every((member) =>
    (LITERAL_UNION_MEMBER_TYPES as readonly AST_NODE_TYPES[]).includes(
      member.type,
    ),
  );

const removeAliasDeclaration = (
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>,
  node: TSESTree.TSTypeAliasDeclaration,
): TSESLint.RuleFix => {
  const lineStart = node.range[0] - node.loc.start.column;
  const lineBreak = /^[ \t]*\r?\n/.exec(sourceCode.text.slice(node.range[1]));
  const lineEnd = node.range[1] + (lineBreak ? lineBreak[0].length : 0);

  return fixer.removeRange([lineStart, lineEnd]);
};

export default createRule({
  name: "prefer-inline-literal-union",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce inlining literal union types in interface properties instead of using type aliases for better IDE hover information",
    },
    fixable: "code",
    messages: {
      inlineLiteralUnion:
        "Inline the literal union type instead of using a type alias for better IDE hover information",
      removeUnusedAlias:
        "Remove the '{{ name }}' alias; inlining its only usages leaves it unused.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;
    const literalUnionAliases = new Map<
      string,
      TSESTree.TSTypeAliasDeclaration
    >();
    const candidateReferences: {
      typeAnnotation: TSESTree.TSTypeReference;
      name: string;
    }[] = [];
    const referenceCounts = new Map<string, number>();

    const increment = (counts: Map<string, number>, key: string): void => {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    };

    return {
      TSTypeAliasDeclaration(node) {
        if (isLiteralUnionType(node.typeAnnotation)) {
          literalUnionAliases.set(node.id.name, node);
        }
      },
      TSTypeReference(node) {
        if (node.typeName.type === AST_NODE_TYPES.Identifier) {
          increment(referenceCounts, node.typeName.name);
        }
      },
      ExportSpecifier(node) {
        if (node.local.type === AST_NODE_TYPES.Identifier) {
          increment(referenceCounts, node.local.name);
        }
      },
      TSPropertySignature(node) {
        if (!node.typeAnnotation) {
          return;
        }

        const { typeAnnotation } = node.typeAnnotation;

        if (
          typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference ||
          typeAnnotation.typeName.type !== AST_NODE_TYPES.Identifier
        ) {
          return;
        }

        candidateReferences.push({
          typeAnnotation,
          name: typeAnnotation.typeName.name,
        });
      },
      "Program:exit"() {
        const inlinedCounts = new Map<string, number>();

        for (const { typeAnnotation, name } of candidateReferences) {
          const aliasDeclaration = literalUnionAliases.get(name);

          if (!aliasDeclaration) {
            continue;
          }

          const unionText = sourceCode.getText(aliasDeclaration.typeAnnotation);
          increment(inlinedCounts, name);

          context.report({
            node: typeAnnotation,
            messageId: "inlineLiteralUnion",
            fix: (fixer) => fixer.replaceText(typeAnnotation, unionText),
          });
        }

        for (const [name, aliasDeclaration] of literalUnionAliases) {
          if (
            aliasDeclaration.parent.type ===
            AST_NODE_TYPES.ExportNamedDeclaration
          ) {
            continue;
          }

          const inlined = inlinedCounts.get(name) ?? 0;
          const total = referenceCounts.get(name) ?? 0;

          if (inlined === 0 || inlined !== total) {
            continue;
          }

          context.report({
            node: aliasDeclaration,
            messageId: "removeUnusedAlias",
            data: { name },
            fix: (fixer) =>
              removeAliasDeclaration(fixer, sourceCode, aliasDeclaration),
          });
        }
      },
    };
  },
});
