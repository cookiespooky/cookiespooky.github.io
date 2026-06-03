---
type: article
title: "Демо сайта из Obsidian и Markdown"
slug: "notepub-site-demo"
description: "Как будет выглядеть пример превращения Obsidian или Markdown-архива в публичный SEO-сайт через Notepub."
draft: false
noindex: true
---
# Демо сайта из Obsidian и Markdown

Эта демо-страница находится в процессе подготовки.

Здесь будет пример того, как личный или командный Markdown-архив превращается в публичный SEO-сайт через Notepub.

## Что будет показано

```text
папка заметок
→ frontmatter
→ типы страниц
→ внутренняя перелинковка
→ SEO-метаданные
→ публичный сайт
```

## Какой архив подойдет для демо

Для демонстрации нужен небольшой набор заметок:

- 1 главная страница;
- 3–5 хабов;
- 10–20 supporting articles;
- несколько офферов или CTA;
- внутренние ссылки между страницами.

Важно: папки в vault нужны для удобства автора. URL-структура в Notepub может строиться отдельно через `slug`.

## Черновая структура будущего демо

### 1. Исходный архив

Будет показана структура Markdown-файлов:

```text
/pages
  home.md
  about.md
  notepub.md
  markdown-to-seo-site.md
```

### 2. Frontmatter

Пример:

```yaml
type: hub
title: "Notepub — SEO-сайт из Obsidian и Markdown"
slug: "notepub"
description: "..."
draft: false
noindex: false
```

### 3. Карта страниц

Будет показано, как заметки разделяются на:

- home;
- hub;
- offer;
- article;
- demo;
- service pages;
- supporting content.

### 4. Перелинковка

Демо покажет, как `[wiki links]` становятся маршрутами пользователя и поисковых роботов.

### 5. Результат

На выходе должен быть быстрый сайт, где знание не потеряло структуру, но стало доступным для поиска и чтения.

## Связанные страницы

- [[notepub|Notepub]]
- [[notepub-offer|Сайт из заметок]]
- [[markdown-to-seo-site|Markdown в SEO-сайт]]
- [[obsidian-as-website|Obsidian как сайт]]
- [[proof-library|Библиотека доказательств]]
