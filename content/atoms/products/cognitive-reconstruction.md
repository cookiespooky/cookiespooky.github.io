---
type: article
id: "cognitive-reconstruction"
title: "Когнитивная реконструкция"
slug: "cognitive-reconstruction"
kind: "method"
hub:
  - "products"
summary: "Метод восстановления карты ситуации, скрытых связей, повторяющихся сценариев и точек действия."
description: "Метод восстановления карты ситуации, скрытых связей, повторяющихся сценариев и точек действия."
status: "public"
lang: "ru"
links:
  - id: "situation-map"
    rel: "produces"
  - id: "lat"
    rel: "uses"
  - id: "repeating-scenarios"
    rel: "related_to"
  - id: "agency"
    rel: "related_to"
  - id: "obsidian"
    rel: "compatible_with"
  - id: "lead-cognitive-reconstruction"
    rel: "leads_to"
  - id: "lead-notes-analysis"
    rel: "leads_to"
  - id: "cognitive-gaps"
    rel: "detects"
  - id: "lens-analysis"
    rel: "uses"
  - id: "situation-graph"
    rel: "produces"
  - id: "source-material"
    rel: "uses"
  - id: "action-point"
    rel: "produces"
  - id: "reconstruction-session"
    rel: "implemented_as"
actions:
  - label: "Построить карту ситуации"
    target: "lead-cognitive-reconstruction"
    help: "Поможет собрать карту ситуации и увидеть связи, которые трудно удержать в голове."
  - label: "Понять метод"
    target: "situation-map"
    help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
  - label: "Посмотреть связь с LAT"
    target: "situation-map"
    help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
  - label: "Разобрать мою ситуацию"
    target: "reconstruction-session"
    help: "Поможет применить метод к личному материалу и получить карту с точками действия."
  - label: "Найти когнитивные пустоты"
    target: "cognitive-gaps"
    help: "Поможет увидеть недостающие звенья в описании ситуации."
seo:
  title: "Когнитивная реконструкция"
  description: "Метод восстановления карты ситуации, скрытых связей, повторяющихся сценариев и точек действия."
---
# Когнитивная реконструкция

Когнитивная реконструкция — метод восстановления структуры сложной ситуации. Метод выделяет элементы, связи, повторяющиеся сценарии, когнитивные пустоты и точки действия.

Реконструкция работает с исходным материалом: заметками, диалогом, списком проектов, постами или дневником. Итогом становится карта ситуации или граф, пригодный для дальнейшего анализа.

Связанные элементы графа: [[situation-map|Карта ситуации]], [[lat|LAT]], [[repeating-scenarios|Повторяющиеся сценарии]], [[agency|Агентность]], [[obsidian|Obsidian]], [[lead-cognitive-reconstruction|Разбор ситуации]], [[lead-notes-analysis|Разбор заметок]].

## Связи

- [[situation-map|Карта ситуации]] — produces
- [[lat|LAT]] — uses
- [[repeating-scenarios|Повторяющиеся сценарии]] — related_to
- [[agency|Агентность]] — related_to
- [[obsidian|Obsidian]] — compatible_with
- [[lead-cognitive-reconstruction|Разбор ситуации]] — leads_to
- [[lead-notes-analysis|Разбор заметок]] — leads_to
- [[cognitive-gaps|Когнитивные пустоты]] — detects
- [[lens-analysis|Линзирование]] — uses
- [[situation-graph|Граф ситуации]] — produces
- [[source-material|Исходный материал]] — uses
- [[action-point|Точка действия]] — produces
- [[reconstruction-session|Сессия разбора ситуации]] — implemented_as

## Следующие действия

- **Построить карту ситуации** → [[lead-cognitive-reconstruction|Разбор ситуации]]: Поможет собрать карту ситуации и увидеть связи, которые трудно удержать в голове.
- **Понять метод** → [[situation-map|Карта ситуации]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Посмотреть связь с LAT** → [[situation-map|Карта ситуации]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Разобрать мою ситуацию** → [[reconstruction-session|Сессия разбора ситуации]]: Поможет применить метод к личному материалу и получить карту с точками действия.
- **Найти когнитивные пустоты** → [[cognitive-gaps|Когнитивные пустоты]]: Поможет увидеть недостающие звенья в описании ситуации.
