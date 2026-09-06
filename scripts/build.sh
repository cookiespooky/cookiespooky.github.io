#!/usr/bin/env bash
# Сборка статического сайта: проверка контента -> индекс -> проверка ссылок -> dist/
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NOTEPUB_REF="${NOTEPUB_REF:-888541390225d487d760cc32acf003e4ed9b3141}"
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

# файлы, которые должны лежать в корне сайта как есть:
# подтверждения владения для поисковиков и прочее, что движок не генерирует
if [[ -d static ]]; then
  cp -R static/. dist/
fi

# CNAME обязан попасть в артефакт: деплой идёт через upload-pages-artifact,
# и без файла GitHub Pages сбрасывает привязку своего домена.
if [[ -f CNAME ]]; then
  cp CNAME dist/CNAME
fi

touch dist/.nojekyll
# GitHub Pages отдаёт кастомную страницу ошибки только из /404.html в корне.
# Каталог dist/404/ после копирования удаляется: иначе адрес /404/ отвечает 200
# с текстом «страница не найдена» — это soft-404, на который ругаются Яндекс и
# Google. Без каталога тот же адрес попадает в общий обработчик и отдаёт
# честный 404. Заодно снимается canonical: он указывал на /404/, а страница
# подставляется под любой несуществующий адрес, так что смысла в нём нет.
if [[ -f dist/404/index.html ]]; then
  cp dist/404/index.html dist/404.html
  rm -rf dist/404
  if command -v python3 >/dev/null 2>&1; then
    python3 - <<'PY'
import io, re
p = "dist/404.html"
h = io.open(p, encoding="utf-8").read()
h = re.sub(r'\s*<link rel="canonical"[^>]*>', "", h, count=1)
io.open(p, "w", encoding="utf-8").write(h)
PY
  fi
fi

# карта сайта для языковых моделей: собирается из frontmatter, поэтому
# не расходится с содержимым сайта
if command -v python3 >/dev/null 2>&1; then
  python3 "$ROOT_DIR/scripts/llms.py"
else
  echo "python3 не найден — llms.txt не собран" >&2
fi

echo "Готово: $ROOT_DIR/dist"
