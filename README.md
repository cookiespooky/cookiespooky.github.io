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
