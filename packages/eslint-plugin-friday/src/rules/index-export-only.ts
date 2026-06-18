import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";
import { getBaseName } from "../text/filename.js";

const isAllowedExportNamed = (
  node: TSESTree.ExportNamedDeclaration,
): boolean => {
  if (!node.declaration) {
    return true;
  }

  return (
    node.declaration.type === AST_NODE_TYPES.TSTypeAliasDeclaration ||
    node.declaration.type === AST_NODE_TYPES.TSInterfaceDeclaration
  );
};

const isAllowedTopLevel = (node: TSESTree.ProgramStatement): boolean => {
  switch (node.type) {
    case AST_NODE_TYPES.ImportDeclaration:
    case AST_NODE_TYPES.ExportAllDeclaration:
    case AST_NODE_TYPES.TSTypeAliasDeclaration:
    case AST_NODE_TYPES.TSInterfaceDeclaration:
    case AST_NODE_TYPES.TSImportEqualsDeclaration: {
      return true;
    }
    case AST_NODE_TYPES.ExpressionStatement: {
      return (
        node.expression.type === AST_NODE_TYPES.Literal &&
        typeof node.expression.value === "string"
      );
    }
    case AST_NODE_TYPES.ExportNamedDeclaration: {
      return isAllowedExportNamed(node);
    }
    case AST_NODE_TYPES.ExportDefaultDeclaration: {
      return node.declaration.type === AST_NODE_TYPES.Identifier;
    }
    default: {
      return false;
    }
  }
};

export default createRule({
  name: "index-export-only",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require index files to contain only imports, re-exports, and type declarations",
    },
    messages: {
      indexExportOnly:
        "Index files must contain only imports, re-exports, and type declarations. Move runtime code to a separate module and re-export it from here.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (getBaseName(context.filename) !== "index") {
      return {};
    }

    return {
      Program(node) {
        for (const statement of node.body) {
          if (!isAllowedTopLevel(statement)) {
            context.report({ node: statement, messageId: "indexExportOnly" });
          }
        }
      },
    };
  },
});
