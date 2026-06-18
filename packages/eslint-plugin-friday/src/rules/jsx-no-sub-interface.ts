import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { isPascalCase } from "../text/casing.js";
import { PROPS_WRAPPER_TYPES } from "../constants/properties-wrapper-types.js";
import { createRule } from "../core/create-rule.js";

const unwrapWrapperType = (node: TSESTree.TypeNode): TSESTree.TypeNode => {
  if (
    node.type === AST_NODE_TYPES.TSTypeReference &&
    node.typeName.type === AST_NODE_TYPES.Identifier &&
    PROPS_WRAPPER_TYPES.has(node.typeName.name) &&
    node.typeArguments &&
    node.typeArguments.params.length > 0
  ) {
    return unwrapWrapperType(node.typeArguments.params[0]);
  }
  return node;
};

const getMainTypeName = (typeNode: TSESTree.TypeNode): string | undefined => {
  const unwrapped = unwrapWrapperType(typeNode);
  return unwrapped.type === AST_NODE_TYPES.TSTypeReference &&
    unwrapped.typeName.type === AST_NODE_TYPES.Identifier
    ? unwrapped.typeName.name
    : undefined;
};

const getComponentMainTypeName = (
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression,
): string | undefined => {
  const firstParameter = node.params[0];
  if (
    firstParameter &&
    "typeAnnotation" in firstParameter &&
    firstParameter.typeAnnotation
  ) {
    return getMainTypeName(firstParameter.typeAnnotation.typeAnnotation);
  }
  return undefined;
};

const getDeclarationFromExportWrapper = (
  node: TSESTree.ProgramStatement,
): TSESTree.Node => {
  if (node.type === AST_NODE_TYPES.ExportNamedDeclaration && node.declaration) {
    return node.declaration;
  }
  if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
    return node.declaration;
  }
  return node;
};

interface ComponentInfo {
  count: number;
  mainTypes: readonly string[];
}

const collectComponentInfo = (declaration: TSESTree.Node): ComponentInfo => {
  if (
    declaration.type === AST_NODE_TYPES.FunctionDeclaration &&
    declaration.id &&
    isPascalCase(declaration.id.name)
  ) {
    const mainType = getComponentMainTypeName(declaration);
    return { count: 1, mainTypes: mainType ? [mainType] : [] };
  }

  if (declaration.type === AST_NODE_TYPES.VariableDeclaration) {
    const mainTypes: string[] = [];
    let count = 0;
    for (const declarator of declaration.declarations) {
      const { init } = declarator;
      const isComponentInit =
        declarator.id.type === AST_NODE_TYPES.Identifier &&
        isPascalCase(declarator.id.name) &&
        (init?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
          init?.type === AST_NODE_TYPES.FunctionExpression);
      if (isComponentInit) {
        count += 1;
        const mainType = getComponentMainTypeName(init);
        if (mainType) {
          mainTypes.push(mainType);
        }
      }
    }
    return { count, mainTypes };
  }

  return { count: 0, mainTypes: [] };
};

const getTypeDeclaration = (
  declaration: TSESTree.Node,
): { name: string; node: TSESTree.Node } | undefined =>
  declaration.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
  declaration.type === AST_NODE_TYPES.TSTypeAliasDeclaration
    ? { name: declaration.id.name, node: declaration }
    : undefined;

export default createRule({
  name: "jsx-no-sub-interface",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow sub-interfaces and helper types in component files; keep only the main component props and extract the rest",
    },
    messages: {
      noSubInterface:
        "Sub-interface or helper type '{{ name }}' should not live in a component file. Extract it to a sibling module (e.g., a *.types.ts file or its own component file).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    return {
      Program(programNode) {
        const mainTypes = new Set<string>();
        const typeDeclarations: Array<{ name: string; node: TSESTree.Node }> =
          [];
        let componentCount = 0;

        for (const statement of programNode.body) {
          const declaration = getDeclarationFromExportWrapper(statement);
          const { count, mainTypes: foundTypes } =
            collectComponentInfo(declaration);
          componentCount += count;
          for (const mainType of foundTypes) {
            mainTypes.add(mainType);
          }
          const typeDeclaration = getTypeDeclaration(declaration);
          if (typeDeclaration) {
            typeDeclarations.push(typeDeclaration);
          }
        }

        if (componentCount === 0) {
          return;
        }

        for (const declaration of typeDeclarations) {
          if (!mainTypes.has(declaration.name)) {
            context.report({
              node: declaration.node,
              messageId: "noSubInterface",
              data: { name: declaration.name },
            });
          }
        }
      },
    };
  },
});
