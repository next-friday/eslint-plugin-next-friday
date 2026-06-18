import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const isReactNodeType = (typeNode: TSESTree.TypeNode | undefined): boolean => {
  if (!typeNode || typeNode.type !== AST_NODE_TYPES.TSTypeReference) {
    return false;
  }

  const { typeName } = typeNode;

  if (typeName.type === AST_NODE_TYPES.Identifier) {
    return typeName.name === "ReactNode";
  }

  return (
    typeName.type === AST_NODE_TYPES.TSQualifiedName &&
    typeName.left.type === AST_NODE_TYPES.Identifier &&
    typeName.left.name === "React" &&
    typeName.right.name === "ReactNode"
  );
};

const findChildrenReactNode = (
  members: readonly TSESTree.TypeElement[],
): TSESTree.TSPropertySignature | undefined =>
  members.find(
    (member): member is TSESTree.TSPropertySignature =>
      member.type === AST_NODE_TYPES.TSPropertySignature &&
      member.key.type === AST_NODE_TYPES.Identifier &&
      member.key.name === "children" &&
      member.optional === true &&
      isReactNodeType(member.typeAnnotation?.typeAnnotation),
  );

export default createRule({
  name: "prefer-properties-with-children",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer PropsWithChildren<T> over manually declaring children: ReactNode in component props",
    },
    messages: {
      usePropsWithChildren:
        "Use 'PropsWithChildren<T>' instead of manually declaring 'children?: ReactNode'.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    return {
      TSInterfaceDeclaration(node) {
        const childrenMember = findChildrenReactNode(node.body.body);
        if (childrenMember) {
          context.report({
            node: childrenMember,
            messageId: "usePropsWithChildren",
          });
        }
      },
      TSTypeLiteral(node) {
        const childrenMember = findChildrenReactNode(node.members);
        if (childrenMember) {
          context.report({
            node: childrenMember,
            messageId: "usePropsWithChildren",
          });
        }
      },
    };
  },
});
