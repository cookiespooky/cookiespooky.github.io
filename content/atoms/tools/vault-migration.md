---
type: article
id: "vault-migration"
title: "Миграция vault"
slug: "vault-migration"
kind: "method"
hub:
  - "tools"
summary: "Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц."
description: "Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц."
status: "public"
lang: "ru"
links:
  - id: "obsidian"
    rel: "starts_from"
  - id: "atomic-notes"
    rel: "produces"
  - id: "public-vault"
    rel: "produces"
  - id: "graph-hygiene"
    rel: "requires"
  - id: "note-to-site-pipeline"
    rel: "part_of"
  - id: "lead-notes-analysis"
    rel: "leads_to"
actions:
  - label: "Разобрать мои заметки"
    target: "lead-notes-analysis"
    help: "Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить."
  - label: "Собрать публикацию из заметок"
    target: "lead-notepub-setup"
    help: "Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива."
seo:
  title: "Миграция vault"
  description: "Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц."
---
# Миграция vault

Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц.

Связанные элементы графа: [[obsidian|Obsidian]], [[atomic-notes|Атомарные заметки]], [[public-vault|Публичный vault]], [[graph-hygiene|Гигиена графа]], [[note-to-site-pipeline|Пайплайн заметки → сайт]], [[lead-notes-analysis|Разбор заметок]].

## Связи

- [[obsidian|Obsidian]] — starts_from
- [[atomic-notes|Атомарные заметки]] — produces
- [[public-vault|Публичный vault]] — produces
- [[graph-hygiene|Гигиена графа]] — requires
- [[note-to-site-pipeline|Пайплайн заметки → сайт]] — part_of
- [[lead-notes-analysis|Разбор заметок]] — leads_to

## Следующие действия

- **Разобрать мои заметки** → [[lead-notes-analysis|Разбор заметок]]: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
- **Собрать публикацию из заметок** → [[lead-notepub-setup|Собрать публикацию из заметок]]: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
