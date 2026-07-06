---
id: lead-notepub-setup
title: Собрать публикацию из заметок
slug: lead-notepub-setup
kind: action
hub: products
summary: Лидовое действие для пользователя, который хочет превратить Obsidian, Markdown-заметки
  или базу знаний в публичный граф и сайт.
status: public
links:
- id: notepub
  rel: related_product
- id: obsidian
  rel: starts_from
- id: note-to-site-pipeline
  rel: uses
- id: public-vault
  rel: produces
- id: markdown-publishing
  rel: uses
actions:
- label: Подготовить структуру публикации
  target: lead-notepub-setup
  help: Поможет выбрать, какие заметки публиковать, какие оставить черновиками и какие
    связи нужны для сайта.
seo:
  title: Собрать публикацию из заметок
  description: Лидовое действие для превращения Obsidian или Markdown-базы в публичный
    граф знаний и сайт.
---

# Собрать публикацию из заметок

Это действие подходит, когда уже есть заметки, архив, Obsidian-vault или набор Markdown-файлов, но пока непонятно, как превратить их в понятный сайт.

Задача — выделить публичную часть базы, разрезать длинные материалы на атомы, задать явные связи, определить хабы и собрать первый маршрут пользователя.

Связанные элементы графа: [[notepub]], [[obsidian]], [[note-to-site-pipeline]], [[public-vault]], [[markdown-publishing]].

## Что это даст

- станет ясно, какие материалы можно публиковать сразу;
- появится структура атомов и хабов;
- граф останется совместимым с Obsidian;
- сайт сможет использовать заметки как контекст для модели;
- появится понятный следующий шаг для развития Notepub или личного knowledge site.
