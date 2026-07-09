#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FUNC_DIR="$ROOT_DIR/ycf/graph-runtime"
BUILD_DIR="$FUNC_DIR/.build"
ZIP_PATH="$FUNC_DIR/graph-runtime.zip"

rm -rf "$BUILD_DIR" "$ZIP_PATH"
mkdir -p "$BUILD_DIR/data" "$BUILD_DIR/prompts"

cp "$FUNC_DIR/index.js" "$FUNC_DIR/package.json" "$BUILD_DIR/"
cp "$ROOT_DIR/theme/assets/site-graph.json" "$BUILD_DIR/data/site-graph.json"
cp "$ROOT_DIR/atom_site_v5/prompts/system-prompt.md" "$BUILD_DIR/prompts/system-prompt.md"

(
  cd "$BUILD_DIR"
  zip -qr "$ZIP_PATH" .
)

echo "Built $ZIP_PATH"
