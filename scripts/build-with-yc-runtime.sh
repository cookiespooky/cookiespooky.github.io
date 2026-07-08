#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${GRAPH_ENDPOINT:-}" ]]; then
  echo "GRAPH_ENDPOINT is required, for example: https://functions.yandexcloud.net/<function-id>" >&2
  exit 1
fi

NOTEPUB_BIN="${NOTEPUB_BIN:-../np-obsidian-template/.np/bin/notepub}" \
GRAPH_ENDPOINT="$GRAPH_ENDPOINT" \
GRAPH_STREAM_ENDPOINT="${GRAPH_STREAM_ENDPOINT:-}" \
./scripts/build.sh
