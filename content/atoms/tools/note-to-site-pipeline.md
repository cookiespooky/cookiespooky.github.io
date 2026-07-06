---
type: article
id: "note-to-site-pipeline"
title: "Пайплайн заметки → сайт"
slug: "note-to-site-pipeline"
kind: "method"
hub: "tools"
summary: "Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели."
description: "Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели."
status: "public"
lang: "ru"
links:
  - id: "obsidian"
    rel: "starts_from"
  - id: "atomic-notes"
    rel: "uses"
  - id: "llm-readable-notes"
    rel: "requires"
  - id: "notepub"
    rel: "published_by"
  - id: "knowledge-garden"
    rel: "produces"
  - id: "lead-notepub-setup"
    rel: "leads_to"
actions:
  - label: "Собрать публикацию из заметок"
    target: "lead-notepub-setup"
    help: "Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива."
  - label: "Разобрать мои заметки"
    target: "lead-notes-analysis"
    help: "Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить."
seo:
  title: "Пайплайн заметки → сайт"
  description: "Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели."
---
# Пайплайн заметки → сайт

Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели.

Связанные элементы графа: [[obsidian]], [[atomic-notes]], [[llm-readable-notes]], [[notepub]], [[knowledge-garden]], [[lead-notepub-setup]].

## Связи

- [[obsidian]] — starts_from
- [[atomic-notes]] — uses
- [[llm-readable-notes]] — requires
- [[notepub]] — published_by
- [[knowledge-garden]] — produces
- [[lead-notepub-setup]] — leads_to

## Следующие действия

- **Собрать публикацию из заметок** → [[lead-notepub-setup]]: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
- **Разобрать мои заметки** → [[lead-notes-analysis]]: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
