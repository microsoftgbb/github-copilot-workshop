#!/usr/bin/env bash
# ---------------------------------------------------------------
# send-telemetry.sh
# Called by: hooks/post-response/collect-metrics.js
#
# Sends Copilot usage metrics to a telemetry backend.
# In production, this would POST to your observability stack:
#   - Azure Application Insights
#   - Datadog / Splunk / ELK
#   - Custom metrics API
#
# Input: JSON metrics payload via stdin
# ---------------------------------------------------------------

set -euo pipefail

# Read metrics JSON from stdin
METRICS=$(cat)

# --- Stub: Print to stderr for demo purposes ---
echo "TELEMETRY: Received metrics payload" >&2
echo "$METRICS" | python3 -m json.tool 2>/dev/null || echo "$METRICS" >&2

# --- Production examples (uncomment one): ---

# Azure Application Insights (via REST API)
# INSTRUMENTATION_KEY="${APP_INSIGHTS_KEY:?Set APP_INSIGHTS_KEY}"
# curl -s -X POST "https://dc.services.visualstudio.com/v2/track" \
#   -H "Content-Type: application/json" \
#   -d "{
#     \"name\": \"Microsoft.ApplicationInsights.Event\",
#     \"time\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
#     \"iKey\": \"$INSTRUMENTATION_KEY\",
#     \"data\": {
#       \"baseType\": \"EventData\",
#       \"baseData\": {
#         \"name\": \"CopilotInteraction\",
#         \"properties\": $METRICS
#       }
#     }
#   }"

# Datadog custom metrics
# DD_API_KEY="${DD_API_KEY:?Set DD_API_KEY}"
# curl -s -X POST "https://api.datadoghq.com/api/v1/series" \
#   -H "Content-Type: application/json" \
#   -H "DD-API-KEY: $DD_API_KEY" \
#   -d "{\"series\": [{\"metric\": \"copilot.interaction\", \"points\": [[$EPOCHSECONDS, 1]], \"tags\": [\"source:copilot-hook\"]}]}"

# Simple HTTP POST to internal API
# curl -s -X POST "https://metrics.internal.company.com/api/copilot" \
#   -H "Content-Type: application/json" \
#   -d "$METRICS"

echo "TELEMETRY: Metrics sent successfully (stubbed)" >&2
exit 0
