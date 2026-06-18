import { type JSONSchema } from "@typescript-eslint/utils";

export const ALLOW_OPTION_SCHEMA: JSONSchema.JSONSchema4 = {
  type: "object",
  properties: {
    allow: {
      type: "array",
      items: { type: "string" },
      description: "Names exempt from this rule.",
    },
  },
  additionalProperties: false,
};
