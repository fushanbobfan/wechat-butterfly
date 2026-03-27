#!/usr/bin/env bash
set -euo pipefail

: "${API_BASE_URL:?API_BASE_URL is required}"

curl -sS "${API_BASE_URL}/api/v1/games/configs" >/dev/null
curl -sS "${API_BASE_URL}/api/v1/recognition/jobs/rec_001" >/dev/null
curl -sS -X POST "${API_BASE_URL}/api/analytics/events" \
  -H "content-type: application/json" \
  -d '{"event_name":"topic_enter","payload":{"user_role":"teacher","taxon_id":"demo","session_id":"smoke","model_version":"v1","event_ts":"2026-03-27T00:00:00.000Z"}}' >/dev/null

echo "[PASS] real smoke checks"
