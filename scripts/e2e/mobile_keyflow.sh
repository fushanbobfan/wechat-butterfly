#!/usr/bin/env bash
set -euo pipefail
SCENARIO="mobile_5min_keyflow"
source "$(dirname "$0")/lib.sh"

require_cmd curl
log_event "INFO" "bootstrap" "start mobile keyflow"

api_call "study_start" "POST" "/api/v1/mobile/study-session/start" '{"duration_minutes":5}' >/dev/null
api_call "mini_game" "POST" "/api/v1/mobile/mini-game/complete" '{"game_id":"butterfly-memory","score":95}' >/dev/null
api_call "identify" "POST" "/api/v1/mobile/identify" '{"image_url":"https://example.com/specimen.jpg"}' >/dev/null
api_call "encyclopedia_search" "GET" "/api/v1/mobile/encyclopedia/search?q=butterfly" '' >/dev/null

log_event "INFO" "done" "mobile keyflow completed"
echo "[PASS] ${SCENARIO}"
