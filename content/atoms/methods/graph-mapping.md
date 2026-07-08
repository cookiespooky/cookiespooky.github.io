---
type: article
id: "graph-mapping"
title: "Построение графа"
slug: "graph-mapping"
kind: "method"
hub:
  - "methods"
summary: "Процесс выделения сущностей и связей из текста, заметок, диалога или описания ситуации."
description: "Процесс выделения сущностей и связей из текста, заметок, диалога или описания ситуации."
status: "public"
lang: "ru"
links:
  - id: "situation-graph"
    rel: "produces"
  - id: "atomic-notes"
    rel: "uses"
  - id: "knowledge-graph"
    rel: "related_to"
  - id: "cognitive-reconstruction"
    rel: "part_of"
  - id: "obsidian"
    rel: "compatible_with"
  - id: "lead-notes-analysis"
    rel: "leads_to"
actions:
  - label: "Разобрать мои заметки"
    target: "lead-notes-analysis"
    help: "Поможет превратить хаотичные записи в карту связанных смыслов."
  - label: "Посмотреть граф ситуации"
    target: "situation-graph"
    help: "Поможет понять результат построения графа."
  - label: "Связать с атомизацией"
    target: "atomic-notes"
    help: "Поможет увидеть, как заметки становятся узлами графа."
seo:
  title: "Построение графа"
  description: "Процесс выделения сущностей и связей из текста, заметок, диалога или описания ситуации."
---
# Построение графа

Построение графа начинается с выделения сущностей. Затем между ними задаются связи: причина, часть, следствие, инструмент, метод, продукт, действие или пример.

Граф полезен, когда линейный текст скрывает структуру. Он показывает, какие элементы ситуации действительно связаны, а какие просто находятся рядом в одном описании.

Связанные элементы графа: [[situation-graph|Граф ситуации]], [[atomic-notes|Атомарные заметки]], [[knowledge-graph|Граф знаний]], [[cognitive-reconstruction|Когнитивная реконструкция]], [[obsidian|Obsidian]], [[lead-notes-analysis|Разбор заметок]].

## Связи

- [[situation-graph|Граф ситуации]] — produces
- [[atomic-notes|Атомарные заметки]] — uses
- [[knowledge-graph|Граф знаний]] — related_to
- [[cognitive-reconstruction|Когнитивная реконструкция]] — part_of
- [[obsidian|Obsidian]] — compatible_with
- [[lead-notes-analysis|Разбор заметок]] — leads_to

## Следующие действия

- **Разобрать мои заметки** → [[lead-notes-analysis|Разбор заметок]]: Поможет превратить хаотичные записи в карту связанных смыслов.
- **Посмотреть граф ситуации** → [[situation-graph|Граф ситуации]]: Поможет понять результат построения графа.
- **Связать с атомизацией** → [[atomic-notes|Атомарные заметки]]: Поможет увидеть, как заметки становятся узлами графа.
