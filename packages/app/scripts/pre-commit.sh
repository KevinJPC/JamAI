#!/bin/sh
WORKSPACE_PATH="packages/app"
staged_files=$(git diff --cached --name-only --diff-filter=ACMR --relative=$WORKSPACE_PATH)

echo "Linting staged files"

npx eslint $staged_files --fix
lint_result=$?

if [ $lint_result -ne 0 ]; then
    echo "Fix the linter issues and try to commit again"
    exit 1
fi

git update-index --again