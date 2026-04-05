#!/usr/bin/env bash
set -euo pipefail

FUNCTION_NAME="${FUNCTION_NAME:-np-speech-agency-analyzer}"
RUNTIME="${RUNTIME:-nodejs22}"
ENTRYPOINT="${ENTRYPOINT:-index.handler}"
MEMORY="${MEMORY:-256m}"
TIMEOUT="${TIMEOUT:-15s}"
ZIP_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../speech-analyzer.zip"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
  echo "DEEPSEEK_API_KEY is required"
  exit 1
fi

(
  cd "$SRC_DIR"
  zip -rq "$ZIP_PATH" index.js
)

if ! yc serverless function get --name "$FUNCTION_NAME" >/dev/null 2>&1; then
  yc serverless function create --name "$FUNCTION_NAME" >/dev/null
fi

yc serverless function version create \
  --function-name "$FUNCTION_NAME" \
  --runtime "$RUNTIME" \
  --entrypoint "$ENTRYPOINT" \
  --memory "$MEMORY" \
  --execution-timeout "$TIMEOUT" \
  --source-path "$ZIP_PATH" \
  --environment "DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}" >/dev/null

yc serverless function allow-unauthenticated-invoke --name "$FUNCTION_NAME" >/dev/null

URL="$(yc serverless function get --name "$FUNCTION_NAME" --format json | jq -r '.http_invoke_url')"
echo "Deployed: $FUNCTION_NAME"
echo "URL: $URL"
