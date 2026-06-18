#!/usr/bin/env bash
set -euo pipefail

title="${ISSUE_TITLE:-}"
number="${ISSUE_NUMBER:-}"
repo="${REPO:-}"

if [[ -z "$title" || -z "$number" || -z "$repo" ]]; then
  echo "::error::ISSUE_TITLE, ISSUE_NUMBER, and REPO are required" >&2
  exit 2
fi

type=$(printf '%s' "$title" | sed -nE 's/^([a-z]+)\([^)]+\)!?: .+/\1/p')

if [[ -z "$type" ]]; then
  echo "Title carries no recognized conventional type — leaving labels unchanged."
  exit 0
fi

want="type:$type"
current=$(gh issue view "$number" --repo "$repo" --json labels --jq '.labels[].name' | grep '^type:' || true)

for existing in $current; do
  if [[ "$existing" != "$want" ]]; then
    gh issue edit "$number" --repo "$repo" --remove-label "$existing" 2>/dev/null || true
  fi
done

gh issue edit "$number" --repo "$repo" --add-label "$want"
echo "Labeled issue #$number as $want"
