#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="${LOG_DIR:-artifacts/e2e-logs}"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_FILE:-$LOG_DIR/$(date -u +%Y%m%dT%H%M%SZ)-${SCENARIO:-unknown}.jsonl}"

REQUEST_ID=""
TAXON_ID=""
JOB_ID=""

json_escape() {
  sed 's/\\/\\\\/g; s/"/\\"/g' <<<"${1:-}"
}

log_event() {
  local level="$1"
  local step="$2"
  local message="$3"
  local extra="${4:-}"
  printf '{"ts":"%s","level":"%s","scenario":"%s","step":"%s","message":"%s","request_id":"%s","taxon_id":"%s","job_id":"%s"%s}\n' \
    "$(date -u +%FT%TZ)" \
    "$(json_escape "$level")" \
    "$(json_escape "${SCENARIO:-unknown}")" \
    "$(json_escape "$step")" \
    "$(json_escape "$message")" \
    "$(json_escape "${REQUEST_ID:-}")" \
    "$(json_escape "${TAXON_ID:-}")" \
    "$(json_escape "${JOB_ID:-}")" \
    "${extra}" | tee -a "$LOG_FILE"
}

fail_step() {
  local step="$1"
  local message="$2"
  log_event "ERROR" "$step" "$message"
  echo "[${SCENARIO}] FAIL ${step}: ${message}" >&2
  echo "log_file=$LOG_FILE" >&2
  exit 1
}

extract_json_field() {
  local file="$1"
  local field="$2"
  sed -n "s/.*\"${field}\"[[:space:]]*:[[:space:]]*\"\{0,1\}\([^\",}]*\)\"\{0,1\}.*/\1/p" "$file" | head -n1
}

api_call() {
  local name="$1"
  local method="$2"
  local path="$3"
  local payload="${4:-}"

  local base_url="${API_BASE_URL:-}"
  local token="${API_TOKEN:-}"
  local tmpdir
  tmpdir="$(mktemp -d)"
  local headers="$tmpdir/headers.txt"
  local body="$tmpdir/body.txt"

  if [[ "${MOCK_MODE:-1}" == "1" ]]; then
    REQUEST_ID="mock-$(date +%s%N)"
    case "$name" in
      create_taxon)
        TAXON_ID="taxon-$(date +%s)"
        printf '{"taxon_id":"%s"}\n' "$TAXON_ID" > "$body"
        ;;
      submit_review)
        JOB_ID="job-$(date +%s)"
        printf '{"job_id":"%s"}\n' "$JOB_ID" > "$body"
        ;;
      *)
        printf '{"ok":true}\n' > "$body"
        ;;
    esac
    log_event "INFO" "$name" "mock call success" ",\"http_status\":200"
    cat "$body"
    rm -rf "$tmpdir"
    return 0
  fi

  [[ -n "$base_url" ]] || fail_step "$name" "API_BASE_URL is required when MOCK_MODE=0"

  local auth_header=()
  if [[ -n "$token" ]]; then
    auth_header=(-H "Authorization: Bearer $token")
  fi

  local status
  status=$(curl -sS -X "$method" "${base_url}${path}" \
    -H "Content-Type: application/json" \
    "${auth_header[@]}" \
    -d "$payload" \
    -D "$headers" \
    -o "$body" \
    -w "%{http_code}") || fail_step "$name" "curl failed"

  REQUEST_ID="$(awk 'BEGIN{IGNORECASE=1} /^x-request-id:/{gsub("\r",""); print $2}' "$headers" | tail -n1)"
  if [[ -z "${REQUEST_ID:-}" ]]; then
    REQUEST_ID="$(awk 'BEGIN{IGNORECASE=1} /^request-id:/{gsub("\r",""); print $2}' "$headers" | tail -n1)"
  fi

  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    local body_preview
    body_preview="$(tr '\n' ' ' < "$body" | cut -c1-400)"
    log_event "ERROR" "$name" "http request failed" ",\"http_status\":${status},\"response_preview\":\"$(json_escape "$body_preview")\""
    rm -rf "$tmpdir"
    fail_step "$name" "HTTP ${status}"
  fi

  local maybe_taxon maybe_job
  maybe_taxon="$(extract_json_field "$body" taxon_id || true)"
  maybe_job="$(extract_json_field "$body" job_id || true)"
  [[ -n "$maybe_taxon" ]] && TAXON_ID="$maybe_taxon"
  [[ -n "$maybe_job" ]] && JOB_ID="$maybe_job"

  log_event "INFO" "$name" "http request success" ",\"http_status\":${status}"
  cat "$body"
  rm -rf "$tmpdir"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail_step "bootstrap" "missing command: $1"
}
