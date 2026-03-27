#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
API_PORT="${API_PORT:-8000}"
echo "Starting uvicorn from $(pwd) on port ${API_PORT}"
exec uvicorn app.main:app --reload --host 127.0.0.1 --port "${API_PORT}"
