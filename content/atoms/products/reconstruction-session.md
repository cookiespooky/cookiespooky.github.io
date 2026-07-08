---
type: article
id: "reconstruction-session"
title: "Сессия разбора ситуации"
slug: "reconstruction-session"
kind: "action"
hub:
  - "products"
summary: "Практический формат работы, в котором ситуация разбирается через диалог, заметки, атомизацию и построение карты."
description: "Практический формат работы, в котором ситуация разбирается через диалог, заметки, атомизацию и построение карты."
status: "public"
lang: "ru"
links:
  - id: "cognitive-reconstruction"
    rel: "implements"
  - id: "situation-map"
    rel: "produces"
  - id: "source-material"
    rel: "uses"
  - id: "action-point"
    rel: "produces"
  - id: "lead-cognitive-reconstruction"
    rel: "leads_to"
actions:
  - label: "Оставить заявку на разбор"
    target: "lead-cognitive-reconstruction"
    help: "Поможет применить метод к вашей ситуации и получить карту вместо общей рефлексии."
  - label: "Понять метод"
    target: "cognitive-reconstruction"
    help: "Поможет увидеть, из чего состоит разбор."
  - label: "Посмотреть результат"
    target: "situation-map"
    help: "Поможет понять, какой артефакт появляется после работы."
seo:
  title: "Сессия разбора ситуации"
  description: "Практический формат работы, в котором ситуация разбирается через диалог, заметки, атомизацию и построение карты."
---
# Сессия разбора ситуации

Сессия разбора ситуации — формат применения когнитивной реконструкции к конкретному материалу. В работе используются диалог, заметки, список проектов, контент, дневниковые записи или описание текущей развилки.

Результатом становится карта ситуации, где видны ключевые элементы, связи, повторяющиеся сценарии, пустоты и ближайшие точки действия.

Связанные элементы графа: [[cognitive-reconstruction|Когнитивная реконструкция]], [[situation-map|Карта ситуации]], [[source-material|Исходный материал]], [[action-point|Точка действия]], [[lead-cognitive-reconstruction|Разбор ситуации]].

## Связи

- [[cognitive-reconstruction|Когнитивная реконструкция]] — implements
- [[situation-map|Карта ситуации]] — produces
- [[source-material|Исходный материал]] — uses
- [[action-point|Точка действия]] — produces
- [[lead-cognitive-reconstruction|Разбор ситуации]] — leads_to

## Следующие действия

- **Оставить заявку на разбор** → [[lead-cognitive-reconstruction|Разбор ситуации]]: Поможет применить метод к вашей ситуации и получить карту вместо общей рефлексии.
- **Понять метод** → [[cognitive-reconstruction|Когнитивная реконструкция]]: Поможет увидеть, из чего состоит разбор.
- **Посмотреть результат** → [[situation-map|Карта ситуации]]: Поможет понять, какой артефакт появляется после работы.
