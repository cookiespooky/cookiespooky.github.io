---
type: article
id: "knowledge-graph"
title: "Граф знаний"
slug: "knowledge-graph"
kind: "tool"
hub:
  - "tools"
summary: "Сеть связанных понятий, заметок, продуктов, методов, кейсов и отношений между ними."
description: "Сеть связанных понятий, заметок, продуктов, методов, кейсов и отношений между ними."
status: "public"
lang: "ru"
links:
  - id: "atomic-notes"
    rel: "uses"
  - id: "obsidian"
    rel: "compatible_with"
  - id: "llm-site"
    rel: "related_to"
  - id: "situation-map"
    rel: "produces"
  - id: "lead-notes-analysis"
    rel: "leads_to"
  - id: "bidirectional-links"
    rel: "uses"
  - id: "graph-hygiene"
    rel: "requires"
  - id: "knowledge-garden"
    rel: "published_as"
actions:
  - label: "Посмотреть структуру графа"
    target: "atomic-notes"
    help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
  - label: "Связать с атомами"
    target: "atomic-notes"
    help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
  - label: "Открыть LLM-сайт"
    target: "atomic-notes"
    help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
  - label: "Разобрать мои заметки"
    target: "lead-notes-analysis"
    help: "Поможет превратить хаотичные заметки в атомы, связи и карту тем."
  - label: "Собрать публикацию из заметок"
    target: "lead-notepub-setup"
    help: "Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива."
seo:
  title: "Граф знаний"
  description: "Сеть связанных понятий, заметок, продуктов, методов, кейсов и отношений между ними."
---
# Граф знаний

Сеть связанных понятий, заметок, продуктов, методов, кейсов и отношений между ними.

Связанные элементы графа: [[atomic-notes|Атомарные заметки]], [[obsidian|Obsidian]], [[llm-site|LLM-сайт]], [[situation-map|Карта ситуации]], [[lead-notes-analysis|Разбор заметок]], [[bidirectional-links|Двусторонние связи]], [[graph-hygiene|Гигиена графа]], [[knowledge-garden|Сад знаний]].

## Связи

- [[atomic-notes|Атомарные заметки]] — uses
- [[obsidian|Obsidian]] — compatible_with
- [[llm-site|LLM-сайт]] — related_to
- [[situation-map|Карта ситуации]] — produces
- [[lead-notes-analysis|Разбор заметок]] — leads_to
- [[bidirectional-links|Двусторонние связи]] — uses
- [[graph-hygiene|Гигиена графа]] — requires
- [[knowledge-garden|Сад знаний]] — published_as

## Следующие действия

- **Посмотреть структуру графа** → [[atomic-notes|Атомарные заметки]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Связать с атомами** → [[atomic-notes|Атомарные заметки]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Открыть LLM-сайт** → [[atomic-notes|Атомарные заметки]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Разобрать мои заметки** → [[lead-notes-analysis|Разбор заметок]]: Поможет превратить хаотичные заметки в атомы, связи и карту тем.
- **Собрать публикацию из заметок** → [[lead-notepub-setup|Собрать публикацию из заметок]]: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
