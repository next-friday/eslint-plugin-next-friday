#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
FILE_NAME=$(basename "$FILE_PATH")

if [[ "$FILE_NAME" == .env* && "$FILE_NAME" != *.example ]]; then
  echo "Cannot edit protected credential file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == "pnpm-lock.yaml" ]]; then
  echo "Cannot edit protected lock file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == "eslint.config.mjs" ]]; then
  echo "Cannot edit protected eslint file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == "knip.json" ]]; then
  echo "Cannot edit protected knip file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == ".prettierrc.json" || "$FILE_NAME" == ".prettierignore" ]]; then
  echo "Cannot edit protected prettier file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_PATH" == .git/* || "$FILE_PATH" == node_modules/* || "$FILE_PATH" == dist/* || "$FILE_PATH" == coverage/* ]]; then
  echo "Cannot edit file in generated or protected directory: $FILE_PATH" >&2
  exit 2
fi

exit 0
