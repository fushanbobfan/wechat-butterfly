#!/usr/bin/env bash
set -euo pipefail
SCENARIO="admin_add_review_publish"
source "$(dirname "$0")/lib.sh"

require_cmd curl
log_event "INFO" "bootstrap" "start admin flow"

create_rsp="$(api_call "create_taxon" "POST" "/api/v1/admin/taxa" '{"scientific_name":"Papilio demo","common_name":"示例凤蝶"}')"
if [[ -z "${TAXON_ID:-}" ]]; then
  TAXON_ID="$(sed -n 's/.*"taxon_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' <<<"$create_rsp" | head -n1)"
fi
[[ -n "${TAXON_ID:-}" ]] || fail_step "create_taxon" "missing taxon_id in response"

submit_rsp="$(api_call "submit_review" "POST" "/api/v1/admin/review-jobs" "{\"taxon_id\":\"${TAXON_ID}\"}")"
if [[ -z "${JOB_ID:-}" ]]; then
  JOB_ID="$(sed -n 's/.*"job_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' <<<"$submit_rsp" | head -n1)"
fi
[[ -n "${JOB_ID:-}" ]] || fail_step "submit_review" "missing job_id in response"

api_call "approve_review" "POST" "/api/v1/admin/review-jobs/${JOB_ID}/approve" "{\"taxon_id\":\"${TAXON_ID}\"}" >/dev/null
api_call "verify_front_visible" "GET" "/api/v1/mobile/encyclopedia/taxa/${TAXON_ID}" '' >/dev/null

log_event "INFO" "done" "admin flow completed"
echo "[PASS] ${SCENARIO}"
