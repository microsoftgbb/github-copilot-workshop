#!/usr/bin/env bash
# ---------------------------------------------------------------
# lint-output.sh
# Called by: hooks/post-response/enforce-standards.js
#
# Runs a lightweight lint pass on generated code.
# Accepts a file path as $1 and checks for common issues.
#
# In production, this would call your real linter:
#   npx eslint "$1" --format compact
#   or: checkstyle -c /google_checks.xml "$1"
# ---------------------------------------------------------------

set -euo pipefail

FILE="${1:?Usage: lint-output.sh <file>}"

if [[ ! -f "$FILE" ]]; then
  echo "ERROR: File not found: $FILE" >&2
  exit 1
fi

ISSUES=0

# Check for 'var' usage (JavaScript)
VAR_COUNT=$(grep -c '\bvar\b' "$FILE" 2>/dev/null || true)
if [[ "$VAR_COUNT" -gt 0 ]]; then
  echo "LINT: Found $VAR_COUNT use(s) of 'var' — prefer 'const' or 'let'"
  ISSUES=$((ISSUES + VAR_COUNT))
fi

# Check for console.log (should use structured logging)
LOG_COUNT=$(grep -c 'console\.\(log\|warn\|error\)' "$FILE" 2>/dev/null || true)
if [[ "$LOG_COUNT" -gt 0 ]]; then
  echo "LINT: Found $LOG_COUNT console.* call(s) — prefer structured logger"
  ISSUES=$((ISSUES + LOG_COUNT))
fi

# Check for TODO/FIXME/HACK comments
TODO_COUNT=$(grep -ciE '(TODO|FIXME|HACK|XXX):' "$FILE" 2>/dev/null || true)
if [[ "$TODO_COUNT" -gt 0 ]]; then
  echo "LINT: Found $TODO_COUNT TODO/FIXME/HACK comment(s)"
  ISSUES=$((ISSUES + TODO_COUNT))
fi

# Check for hardcoded localhost URLs
LOCALHOST_COUNT=$(grep -c 'localhost\|127\.0\.0\.1' "$FILE" 2>/dev/null || true)
if [[ "$LOCALHOST_COUNT" -gt 0 ]]; then
  echo "LINT: Found $LOCALHOST_COUNT hardcoded localhost reference(s)"
  ISSUES=$((ISSUES + LOCALHOST_COUNT))
fi

# --- Stub: Real linter call ---
# Uncomment to use ESLint:
# npx eslint "$FILE" --format compact --no-eslintrc --rule '{"no-var": "error", "no-console": "warn"}' 2>/dev/null || true

if [[ "$ISSUES" -eq 0 ]]; then
  echo "LINT: All checks passed"
fi

exit 0
