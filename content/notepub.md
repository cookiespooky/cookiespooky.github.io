---
type: hub
slug: notepub
title: "Notepub"
description: "Декларативный движок публикации контента без CMS и фреймворков, где структура и поведение задаются правилами, а не интерфейсом."
favorite: true
image: "/assets/placeholder.svg"
---

Notepub позволяет быстро запускать SEO-дружелюбные сайты, блоги, digital gardens, базы знаний, каталоги и многое другое. Вы описываете модель контента, Notepub исполняет её.

- Интуитивное управление контентом
- Сайты собираются за секунды
- Нулевые серверные расходы
- Полный контроль над контентом и структурой
- SEO по умолчанию: sitemap, OpenGraph, JSON-LD, canonical, robots.txt

**Задача**  
Создать систему, которая позволяет быстро запускать SEO-дружелюбные сайты и базы знаний без CMS, серверов и vendor lock-in.

**Что сделано**

- Разработан генератор статического контента на базе Markdown
- Поддержка Obsidian-совместимого frontmatter
- Генерация чистого HTML + JS-острова
- SEO по умолчанию: sitemap, OpenGraph, JSON-LD, canonical, robots.txt
- Гибкая система правил (`rules.yaml`) вместо жёсткой структуры CMS
- Деплой на GitHub Pages / Vercel / VPS

**Технологии**  
Go, Markdown, YAML, GitHub Pages, S3-совместимые хранилища