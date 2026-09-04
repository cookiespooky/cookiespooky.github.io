#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FUNC_DIR="$ROOT_DIR/ycf/graph-runtime"
ZIP_PATH="$FUNC_DIR/graph-runtime.zip"

: "${YCF_FUNCTION_NAME:=np-personal-graph-runtime}"
: "${YCF_GATEWAY_NAME:=np-personal-graph-runtime-ws}"
: "${YCF_RUNTIME_SA_NAME:=np-personal-runtime-sa}"
: "${YCF_MEMORY:=128m}"
: "${YCF_TIMEOUT:=45s}"

if ! command -v yc >/dev/null 2>&1; then
  echo "yc CLI is required" >&2
  exit 1
fi

if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
  echo "DEEPSEEK_API_KEY is required" >&2
  exit 1
fi

"$FUNC_DIR/build.sh"

if ! yc iam service-account get --name "$YCF_RUNTIME_SA_NAME" >/dev/null 2>&1; then
  yc iam service-account create --name "$YCF_RUNTIME_SA_NAME" >/dev/null
fi

RUNTIME_SA_ID="$(yc iam service-account get --name "$YCF_RUNTIME_SA_NAME" --format json | jq -r '.id')"
FOLDER_ID="$(yc config get folder-id)"

if ! yc serverless function get --name "$YCF_FUNCTION_NAME" >/dev/null 2>&1; then
  yc serverless function create --name "$YCF_FUNCTION_NAME"
fi

yc serverless function version create \
  --function-name "$YCF_FUNCTION_NAME" \
  --runtime nodejs22 \
  --entrypoint index.handler \
  --memory "$YCF_MEMORY" \
  --execution-timeout "$YCF_TIMEOUT" \
  --service-account-id "$RUNTIME_SA_ID" \
  --source-path "$ZIP_PATH" \
  --environment GRAPH_RUNTIME_PROVIDER=deepseek,GRAPH_RUNTIME_MODEL=deepseek-v4-flash,GRAPH_RUNTIME_REQUEST_TIMEOUT_MS=30000,DEEPSEEK_API_KEY="$DEEPSEEK_API_KEY"

yc resource-manager folder add-access-binding "$FOLDER_ID" \
  --role api-gateway.websocketBroadcaster \
  --subject serviceAccount:"$RUNTIME_SA_ID" >/dev/null 2>&1 || true

yc resource-manager folder add-access-binding "$FOLDER_ID" \
  --role functions.functionInvoker \
  --subject serviceAccount:"$RUNTIME_SA_ID" >/dev/null 2>&1 || true

TMP_SPEC="$(mktemp)"
trap 'rm -f "$TMP_SPEC"' EXIT
sed \
  -e "s/__FUNCTION_ID__/$(yc serverless function get --name "$YCF_FUNCTION_NAME" --format json | jq -r '.id')/g" \
  -e "s/__SERVICE_ACCOUNT_ID__/$RUNTIME_SA_ID/g" \
  "$FUNC_DIR/ws-gateway.openapi.yaml" > "$TMP_SPEC"

if yc serverless api-gateway get --name "$YCF_GATEWAY_NAME" >/dev/null 2>&1; then
  yc serverless api-gateway update "$YCF_GATEWAY_NAME" --spec "$TMP_SPEC" >/dev/null
else
  yc serverless api-gateway create "$YCF_GATEWAY_NAME" --spec "$TMP_SPEC" >/dev/null
fi

GATEWAY_JSON="$(yc serverless api-gateway get --name "$YCF_GATEWAY_NAME" --format json)"
HTTP_URL="$(yc serverless function get --name "$YCF_FUNCTION_NAME" --format json | jq -r '.http_invoke_url')"
WS_DOMAIN="$(printf '%s' "$GATEWAY_JSON" | jq -r '.domain // .connect_url // .service_domain // .url // empty')"

echo
echo "Function HTTP endpoint:"
echo "  $HTTP_URL"
echo
echo "Make function public if needed:"
echo "  yc serverless function allow-unauthenticated-invoke --name $YCF_FUNCTION_NAME"
if [[ -n "$WS_DOMAIN" && "$WS_DOMAIN" != "null" ]]; then
  echo
  echo "Gateway WebSocket endpoint:"
  echo "  wss://${WS_DOMAIN}/ws"
fi
