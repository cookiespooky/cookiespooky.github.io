#!/usr/bin/env bash
# Сборка статического сайта: проверка контента -> индекс -> проверка ссылок -> dist/
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NOTEPUB_REF="${NOTEPUB_REF:-ff6d7902b9675cca01363b81ab6a3afedcddd565}"
NOTEPUB_BIN="${NOTEPUB_BIN:-}"

if [[ -z "$NOTEPUB_BIN" ]]; then
  if [[ -x "$ROOT_DIR/.bin/notepub" ]]; then
    NOTEPUB_BIN="$ROOT_DIR/.bin/notepub"
  elif command -v notepub >/dev/null 2>&1; then
    NOTEPUB_BIN="$(command -v notepub)"
  else
    if ! command -v go >/dev/null 2>&1; then
      echo "Ошибка: не найден notepub и не установлен Go." >&2
      exit 1
    fi
    mkdir -p "$ROOT_DIR/.bin"
    echo "Устанавливаю Notepub @ ${NOTEPUB_REF}"
    GOBIN="$ROOT_DIR/.bin" go install "github.com/cookiespooky/notepub/cmd/notepub@${NOTEPUB_REF}"
    NOTEPUB_BIN="$ROOT_DIR/.bin/notepub"
  fi
fi

rm -rf dist .notepub artifacts
mkdir -p dist

echo "1/4 Проверяю frontmatter и маршруты"
"$NOTEPUB_BIN" validate --config ./config.yaml --rules ./rules.yaml

echo "2/4 Строю индекс"
"$NOTEPUB_BIN" index --config ./config.yaml --rules ./rules.yaml

RESOLVE_FILE="./.notepub/artifacts/resolve.json"
if [[ ! -f "$RESOLVE_FILE" ]]; then
  echo "Ошибка: после index не создан $RESOLVE_FILE" >&2
  exit 1
fi

echo "3/4 Проверяю ссылки и Markdown"
"$NOTEPUB_BIN" validate --config ./config.yaml --rules ./rules.yaml --resolve "$RESOLVE_FILE" --links --markdown

echo "4/4 Собираю статический сайт"
"$NOTEPUB_BIN" build --config ./config.yaml --rules ./rules.yaml --dist ./dist --artifacts ./.notepub/artifacts

# медиа для og-превью и иконок
if [[ -d media ]]; then
  mkdir -p dist/media
  cp -R media/. dist/media/
fi

# CNAME обязан попасть в артефакт: деплой идёт через upload-pages-artifact,
# и без файла GitHub Pages сбрасывает привязку своего домена.
if [[ -f CNAME ]]; then
  cp CNAME dist/CNAME
fi

touch dist/.nojekyll
if [[ -f dist/404/index.html ]]; then
  cp dist/404/index.html dist/404.html
fi

echo "Готово: $ROOT_DIR/dist"
