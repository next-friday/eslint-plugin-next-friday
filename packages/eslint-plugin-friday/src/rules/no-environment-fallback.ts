import { isEnvironmentAccess } from "../ast/nodes.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "no-environment-fallback",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow fallback values for environment variables as they can be dangerous in production",
    },
    messages: {
      noEnvFallback:
        "Avoid using fallback values with process.env. Environment variables should fail explicitly when missing rather than silently using a default value.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      LogicalExpression(node) {
        if (
          (node.operator === "||" || node.operator === "??") &&
          isEnvironmentAccess(node.left)
        ) {
          context.report({ node, messageId: "noEnvFallback" });
        }
      },
      ConditionalExpression(node) {
        if (isEnvironmentAccess(node.test)) {
          context.report({ node, messageId: "noEnvFallback" });
        }
      },
    };
  },
});
