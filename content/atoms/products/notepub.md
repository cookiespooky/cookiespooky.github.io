---
type: article
id: "notepub"
title: "Notepub"
slug: "notepub"
kind: "product"
hub:
  - "products"
summary: "Инструмент для публикации заметок и превращения базы знаний в человекочитаемый сайт."
description: "Инструмент для публикации заметок и превращения базы знаний в человекочитаемый сайт."
status: "public"
lang: "ru"
links:
  - id: "obsidian"
    rel: "compatible_with"
  - id: "knowledge-graph"
    rel: "compatible_with"
  - id: "atomic-notes"
    rel: "uses"
  - id: "llm-site"
    rel: "related_to"
  - id: "self-tracking"
    rel: "uses"
  - id: "lead-notes-analysis"
    rel: "leads_to"
  - id: "note-to-site-pipeline"
    rel: "uses"
  - id: "public-vault"
    rel: "produces"
  - id: "markdown-publishing"
    rel: "uses"
  - id: "knowledge-garden"
    rel: "produces"
  - id: "lead-notepub-setup"
    rel: "leads_to"
actions:
  - label: "Посмотреть, как заметки становятся сайтом"
    target: "lead-notes-analysis"
    help: "Поможет превратить заметки в понятный граф тем, сценариев и точек действия."
  - label: "Изучить связь с Obsidian"
    target: "lead-notes-analysis"
    help: "Поможет превратить заметки в понятный граф тем, сценариев и точек действия."
  - label: "Понять модель LLM-сайта"
    target: "obsidian"
    help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
  - label: "Собрать публикацию из заметок"
    target: "lead-notepub-setup"
    help: "Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива."
seo:
  title: "Notepub"
  description: "Инструмент для публикации заметок и превращения базы знаний в человекочитаемый сайт."
---
# Notepub

Инструмент для публикации заметок и превращения базы знаний в человекочитаемый сайт.

Связанные элементы графа: [[obsidian|Obsidian]], [[knowledge-graph|Граф знаний]], [[atomic-notes|Атомарные заметки]], [[llm-site|LLM-сайт]], [[self-tracking|Self-tracking]], [[lead-notes-analysis|Разбор заметок]], [[note-to-site-pipeline|Пайплайн заметки → сайт]], [[public-vault|Публичный vault]], [[markdown-publishing|Публикация Markdown]], [[knowledge-garden|Сад знаний]], [[lead-notepub-setup|Собрать публикацию из заметок]].

## Связи

- [[obsidian|Obsidian]] — compatible_with
- [[knowledge-graph|Граф знаний]] — compatible_with
- [[atomic-notes|Атомарные заметки]] — uses
- [[llm-site|LLM-сайт]] — related_to
- [[self-tracking|Self-tracking]] — uses
- [[lead-notes-analysis|Разбор заметок]] — leads_to
- [[note-to-site-pipeline|Пайплайн заметки → сайт]] — uses
- [[public-vault|Публичный vault]] — produces
- [[markdown-publishing|Публикация Markdown]] — uses
- [[knowledge-garden|Сад знаний]] — produces
- [[lead-notepub-setup|Собрать публикацию из заметок]] — leads_to

## Следующие действия

- **Посмотреть, как заметки становятся сайтом** → [[lead-notes-analysis|Разбор заметок]]: Поможет превратить заметки в понятный граф тем, сценариев и точек действия.
- **Изучить связь с Obsidian** → [[lead-notes-analysis|Разбор заметок]]: Поможет превратить заметки в понятный граф тем, сценариев и точек действия.
- **Понять модель LLM-сайта** → [[obsidian|Obsidian]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Собрать публикацию из заметок** → [[lead-notepub-setup|Собрать публикацию из заметок]]: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
