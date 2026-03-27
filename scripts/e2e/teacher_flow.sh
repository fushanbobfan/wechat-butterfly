#!/usr/bin/env bash
set -euo pipefail
SCENARIO="teacher_filter_to_topic"
source "$(dirname "$0")/lib.sh"

require_cmd curl
log_event "INFO" "bootstrap" "start teacher flow"

api_call "teacher_filter" "POST" "/api/v1/teacher/taxa/filter" '{"region":"CN","grade":"primary"}' >/dev/null
api_call "teacher_narrow" "POST" "/api/v1/teacher/taxa/narrow" '{"traits":["blue","striped"]}' >/dev/null
api_call "teacher_detail" "GET" "/api/v1/teacher/taxa/detail?taxon_id=demo-001" '' >/dev/null
api_call "teacher_save_topic" "POST" "/api/v1/teacher/topics" '{"name":"春季蝴蝶专题","taxon_ids":["demo-001","demo-002"]}' >/dev/null

log_event "INFO" "done" "teacher flow completed"
echo "[PASS] ${SCENARIO}"
