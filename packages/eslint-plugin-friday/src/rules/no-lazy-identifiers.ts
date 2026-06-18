import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { ALLOW_OPTION_SCHEMA } from "../constants/allow-option-schema.js";
import { KEYBOARD_ROWS } from "../constants/keyboard-rows.js";
import { createRule } from "../core/create-rule.js";
import { splitIdentifierWords } from "../text/casing.js";

const MIN_LENGTH = 3;
const MIN_SEQUENCE_LENGTH = 4;

const hasRepeatedChars = (name: string): boolean =>
  [...name].some((char, index) => {
    if (index > name.length - 3) {
      return false;
    }
    return char === name[index + 1] && char === name[index + 2];
  });

const KEYBOARD_RUNS = KEYBOARD_ROWS.flatMap((row) => [
  row,
  [...row].toReversed().join(""),
]);

const isKeyboardRun = (segment: string): boolean => {
  const lower = segment.toLowerCase();
  if (lower.length < MIN_SEQUENCE_LENGTH) {
    return false;
  }

  return KEYBOARD_RUNS.some((run) => run.includes(lower));
};

const hasKeyboardSegment = (name: string): boolean =>
  splitIdentifierWords(name).some((segment) => isKeyboardRun(segment));

const isLazyIdentifier = (name: string): boolean => {
  if (name.length < MIN_LENGTH || name.startsWith("_")) {
    return false;
  }

  return hasRepeatedChars(name) || hasKeyboardSegment(name);
};

type CheckIdentifier = (node: TSESTree.Identifier) => void;

const checkIfIdentifier = (
  node: TSESTree.Node,
  check: CheckIdentifier,
): void => {
  if (node.type === AST_NODE_TYPES.Identifier) {
    check(node);
  }
};

const checkObjectPatternProperty = (
  property: TSESTree.ObjectPattern["properties"][number],
  check: CheckIdentifier,
): void => {
  if (property.type === AST_NODE_TYPES.RestElement) {
    checkIfIdentifier(property.argument, check);
    return;
  }

  checkIfIdentifier(property.value, check);
};

const checkArrayPatternElement = (
  element: TSESTree.ArrayPattern["elements"][number],
  check: CheckIdentifier,
): void => {
  if (!element) {
    return;
  }

  if (element.type === AST_NODE_TYPES.RestElement) {
    checkIfIdentifier(element.argument, check);
    return;
  }

  checkIfIdentifier(element, check);
};

export default createRule<[{ allow: string[] }], "noLazyIdentifier">({
  name: "no-lazy-identifiers",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow lazy, meaningless variable names that hurt code readability",
    },
    messages: {
      noLazyIdentifier:
        "Avoid lazy identifier '{{name}}'. Use a descriptive name that clearly indicates the purpose.",
    },
    schema: [ALLOW_OPTION_SCHEMA],
    defaultOptions: [{ allow: [] }],
  },
  defaultOptions: [{ allow: [] }],
  create(context, [{ allow }]) {
    const allowed = new Set(allow);

    const checkIdentifier = (node: TSESTree.Identifier): void => {
      if (!allowed.has(node.name) && isLazyIdentifier(node.name)) {
        context.report({
          node,
          messageId: "noLazyIdentifier",
          data: { name: node.name },
        });
      }
    };

    const checkPattern = (pattern: TSESTree.Node): void => {
      if (pattern.type === AST_NODE_TYPES.ObjectPattern) {
        for (const property of pattern.properties) {
          checkObjectPatternProperty(property, checkIdentifier);
        }
        return;
      }

      if (pattern.type === AST_NODE_TYPES.ArrayPattern) {
        for (const element of pattern.elements) {
          checkArrayPatternElement(element, checkIdentifier);
        }
        return;
      }

      if (pattern.type === AST_NODE_TYPES.AssignmentPattern) {
        checkIfIdentifier(pattern.left, checkIdentifier);
        return;
      }

      if (pattern.type === AST_NODE_TYPES.RestElement) {
        checkIfIdentifier(pattern.argument, checkIdentifier);
        return;
      }

      checkIfIdentifier(pattern, checkIdentifier);
    };

    const checkNamedFunction = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): void => {
      if ("id" in node && node.id) {
        checkIdentifier(node.id);
      }
      for (const parameter of node.params) {
        checkPattern(parameter);
      }
    };

    return {
      VariableDeclarator(node) {
        checkPattern(node.id);
      },
      FunctionDeclaration: checkNamedFunction,
      FunctionExpression: checkNamedFunction,
      ArrowFunctionExpression: checkNamedFunction,
      CatchClause(node) {
        if (node.param) {
          checkPattern(node.param);
        }
      },
      ClassDeclaration(node) {
        if (node.id) {
          checkIdentifier(node.id);
        }
      },
      TSTypeAliasDeclaration(node) {
        checkIdentifier(node.id);
      },
      TSInterfaceDeclaration(node) {
        checkIdentifier(node.id);
      },
    };
  },
});
