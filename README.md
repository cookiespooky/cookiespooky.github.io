# Notepub Personal Portal Recipe

A minimal personal portal with hubs and a blog, styled in a clean Vercel‑like theme.

## Quick start
1) In your repo Settings → Pages, set Source = GitHub Actions.
2) Edit or add Markdown in `content/`.
3) Push to `main`.

## Content source
The deploy workflow uses only local content from this repository: `content/`.

No repository variables for content source are required.

## Base URL
`base_url` is auto-set in CI for GitHub Pages. Local `config.yaml` can stay at `http://127.0.0.1:8080/`.

## Build locally
Recommended pinned engine version: `v0.1.7`

Use the build script:

```bash
NOTEPUB_BIN=/path/to/notepub ./scripts/build.sh
```

Or with explicit config:

```bash
NOTEPUB_BIN=/path/to/notepub NOTEPUB_CONFIG=./config.yaml ./scripts/build.sh
```

## Runtime streaming locally
Локально можно работать либо через локальный runtime server, либо через облачный Yandex Cloud backend.

1. Создайте `.env.graph-runtime.local`:

```bash
cat > .env.graph-runtime.local <<'EOF'
DEEPSEEK_API_KEY=your_key
GRAPH_RUNTIME_PROVIDER=deepseek
GRAPH_RUNTIME_MODEL=deepseek-v4-flash
EOF
```

2. Запустите runtime:

```bash
./scripts/start-graph-runtime.sh
```

3. Соберите фронт против локального stream endpoint:

```bash
GRAPH_ENDPOINT=http://127.0.0.1:8787/v1/graph/article \
NOTEPUB_BIN=/path/to/notepub \
./scripts/build.sh
```

Для такого `GRAPH_ENDPOINT` сборщик автоматически добавит `graph_stream_endpoint=http://127.0.0.1:8787/v1/graph/article/stream`.

4. Откройте `dist/` через один origin, например:

```bash
cd dist && python3 -m http.server 8080 --bind 127.0.0.1
```

Открывайте именно `http://127.0.0.1:8080/`, а не `localhost`, чтобы не ловить лишние origin-расхождения.

## Runtime modes
Есть три рабочих режима для главной страницы:

`local generator`

```bash
./scripts/start-graph-runtime.sh
./scripts/build-with-local-runtime.sh
```

`Yandex Cloud runtime`

```bash
export GRAPH_ENDPOINT="https://functions.yandexcloud.net/<function-id>"
export GRAPH_STREAM_ENDPOINT="wss://<gateway-domain>.apigw.yandexcloud.net/ws"
./scripts/build-with-yc-runtime.sh
```

Если `GRAPH_STREAM_ENDPOINT` задан как `wss://...`, фронт будет использовать WebSocket transport и сохранит тот же UX `start/delta/meta/done`.

`Yandex Cloud function only`

```bash
export GRAPH_ENDPOINT="https://functions.yandexcloud.net/<function-id>"
unset GRAPH_STREAM_ENDPOINT
./scripts/build-with-yc-runtime.sh
```

В этом режиме фронт работает через обычный HTTP JSON endpoint без realtime stream.

## Content
Markdown usually lives in `content/` (for `local` mode). Each page needs frontmatter:

```yaml
---
type: article
slug: my-post
title: "My Post"
description: "Short summary."
hub: "notepub"
tags:
  - notepub
---
```

## Theme
Templates and CSS live in `theme/`.

## Search
Search is SSR-friendly: `/search` renders without JS, while JS enhances autocomplete.

## SEO + LLM indexing

This recipe includes:

- Canonical URLs, robots, OpenGraph, Twitter tags in layout metadata.
- JSON-LD fallback (`WebSite`, `WebPage`, `BlogPosting`, breadcrumbs).
- `llms.txt` and `llms-full.txt` in `theme/assets/`.
- Build script that copies `llms*.txt` to site root and appends `LLM:` pointer to `robots.txt`.

Use the build script:

```bash
NOTEPUB_BIN=/path/to/notepub ./scripts/build.sh
```
