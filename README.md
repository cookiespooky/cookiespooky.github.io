# Notepub Personal Portal Recipe

A minimal personal portal with hubs and a blog, styled in a clean Vercel‑like theme.

## Quick start
1) In your repo Settings → Pages, set Source = GitHub Actions.
2) Open `config.yaml` and replace `https://USERNAME.github.io/REPO/` with your real URL (must end with `/`).
3) Edit or add Markdown in `content/`.
4) Push to `main`.

## Content
Markdown lives in `content/`. Each page needs frontmatter:

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
Search is SSR‑friendly: `/search` renders without JS, while JS enhances autocomplete.

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
