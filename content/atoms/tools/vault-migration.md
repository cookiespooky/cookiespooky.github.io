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

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
