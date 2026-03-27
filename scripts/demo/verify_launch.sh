#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

PORT="${WEB_DEMO_PORT:-3310}"
API_BASE_URL="${API_BASE_URL:-}"

(
  cd apps/web
  PORT="$PORT" API_BASE_URL="$API_BASE_URL" npm start >/tmp/web-demo-launch.log 2>&1
) &
WEB_PID=$!

cleanup() {
  kill "$WEB_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:${PORT}/healthz" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

curl -fsS "http://127.0.0.1:${PORT}/healthz" >/dev/null
curl -fsS "http://127.0.0.1:${PORT}/index.html" >/dev/null
curl -fsS "http://127.0.0.1:${PORT}/browse.html" >/dev/null
curl -fsS "http://127.0.0.1:${PORT}/recognition.html" >/dev/null
curl -fsS "http://127.0.0.1:${PORT}/config.js" >/dev/null

echo "[PASS] web demo launch verification"
