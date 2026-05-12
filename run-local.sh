#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if command -v docker >/dev/null 2>&1; then
  echo "Starting local development stack with Docker Compose..."
  docker compose up --build
  exit $?
fi

cat <<'EOF'
Docker is not installed or not available in this shell.
To use this helper, install Docker Desktop and run:
  ./run-local.sh

If you prefer to run manually, follow these steps:
  1) cd backend && npm install && npm start
  2) cd frontend && npm install && npm run dev

EOF
exit 1
