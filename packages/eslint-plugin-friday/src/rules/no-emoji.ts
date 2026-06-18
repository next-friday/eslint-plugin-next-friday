import emojiRegex from "emoji-regex";

import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "no-emoji",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow emoji characters in source code",
    },
    messages: {
      noEmoji: "Emoji are not allowed in source code",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    return {
      Program() {
        const text = sourceCode.getText();
        const regex = emojiRegex();

        for (const match of text.matchAll(regex)) {
          context.report({
            loc: sourceCode.getLocFromIndex(match.index),
            messageId: "noEmoji",
          });
        }
      },
    };
  },
});
