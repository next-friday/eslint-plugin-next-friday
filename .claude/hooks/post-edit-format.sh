#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

resolve_dir() {
  local dir
  dir=$(dirname "$1")
  while true; do
    if [[ -f "$dir/package.json" ]]; then
      echo "$dir"
      return 0
    fi
    [[ "$dir" == "/" || "$dir" == "." ]] && break
    dir=$(dirname "$dir")
  done
  echo "$CLAUDE_PROJECT_DIR"
}

PKG_DIR=$(resolve_dir "$FILE_PATH")

if [[ "$FILE_PATH" =~ \.(ts|js|mjs|cjs|mts|cts|json|md|css)$ ]]; then
  if pnpm --dir "$PKG_DIR" exec prettier --version >/dev/null 2>&1; then
    FORMAT_OUT=$(pnpm --dir "$PKG_DIR" exec prettier --write "$FILE_PATH" 2>&1)
    if [[ $? -ne 0 ]]; then
      {
        echo "Syntax or formatting error in $FILE_PATH:"
        echo ""
        echo "$FORMAT_OUT"
      } >&2
      exit 2
    fi
  fi
fi

if [[ "$FILE_PATH" =~ \.(ts|js|mjs|cjs|mts|cts)$ ]]; then
  if pnpm --dir "$PKG_DIR" exec eslint --version >/dev/null 2>&1; then
    LINT_OUT=$(pnpm --dir "$PKG_DIR" exec eslint --fix "$FILE_PATH" 2>&1)
    if [[ $? -ne 0 ]]; then
      {
        echo "Lint errors remaining in $FILE_PATH after auto-fix:"
        echo ""
        echo "$LINT_OUT"
      } >&2
      exit 2
    fi
  fi
fi

exit 0
