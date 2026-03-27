#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="${LOG_DIR:-artifacts/e2e-logs}"
mkdir -p "$LOG_DIR"

scripts=(
  "scripts/e2e/mobile_keyflow.sh"
  "scripts/e2e/teacher_flow.sh"
  "scripts/e2e/admin_publish_flow.sh"
)

failed=0
for script in "${scripts[@]}"; do
  echo "==> running $script"
  if ! "$script"; then
    failed=1
  fi
done

if [[ "$failed" -ne 0 ]]; then
  echo "Release gate failed. Inspect logs in $LOG_DIR"
  exit 1
fi

echo "All release gates passed."
