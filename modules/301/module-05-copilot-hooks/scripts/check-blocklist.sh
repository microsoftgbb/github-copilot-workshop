#!/usr/bin/env bash
# ---------------------------------------------------------------
# check-blocklist.sh
# Called by: hooks/pre-request/compliance-gate.js
#
# Checks input text against an external blocklist.
# In production, this would call a policy service or read from
# a centralized blocklist (e.g., Azure Key Vault, HashiCorp Vault).
#
# Exit 0 = pass, Exit 1 = blocked
# ---------------------------------------------------------------

set -euo pipefail

# Read the prompt from stdin
PROMPT=$(cat)

# --- Stubbed blocklist patterns ---
# In production, fetch these from a centralized policy service:
#   curl -s https://policy.internal.company.com/api/blocklist | jq -r '.patterns[]'

BLOCKLIST_PATTERNS=(
  "DROP TABLE"
  "DELETE FROM.*WHERE 1=1"
  "xp_cmdshell"
  "UNION SELECT"
  "INTO OUTFILE"
  "LOAD_FILE"
)

for pattern in "${BLOCKLIST_PATTERNS[@]}"; do
  if echo "$PROMPT" | grep -iqE "$pattern"; then
    echo "BLOCKED: matched pattern '$pattern'" >&2
    exit 1
  fi
done

echo "PASS: no blocklist matches found" >&2
exit 0
