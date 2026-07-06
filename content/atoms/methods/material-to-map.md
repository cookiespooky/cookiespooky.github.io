---
type: article
id: "material-to-map"
title: "От материала к карте"
slug: "material-to-map"
kind: "scenario"
hub: "methods"
summary: "Сценарий работы, в котором исходные заметки или описания превращаются в атомы, связи, карту ситуации и точки действия."
description: "Сценарий работы, в котором исходные заметки или описания превращаются в атомы, связи, карту ситуации и точки действия."
status: "public"
lang: "ru"
links:
  - id: "source-material"
    rel: "starts_from"
  - id: "atomic-notes"
    rel: "uses"
  - id: "graph-mapping"
    rel: "uses"
  - id: "situation-map"
    rel: "produces"
  - id: "action-point"
    rel: "produces"
  - id: "lead-notes-analysis"
    rel: "leads_to"
actions:
  - label: "Разобрать мои заметки"
    target: "lead-notes-analysis"
    help: "Поможет пройти путь от хаотичного материала к карте и следующему действию."
  - label: "Посмотреть исходный материал"
    target: "source-material"
    help: "Поможет понять, что можно использовать для анализа."
  - label: "Понять построение графа"
    target: "graph-mapping"
    help: "Поможет увидеть техническую часть маршрута."
seo:
  title: "От материала к карте"
  description: "Сценарий работы, в котором исходные заметки или описания превращаются в атомы, связи, карту ситуации и точки действия."
---
# От материала к карте

Маршрут от материала к карте начинается с сырых записей. Затем из них выделяются атомы: сущности, проблемы, идеи, цели, продукты, страхи, действия и повторяющиеся формулировки.

После атомизации между элементами задаются связи. Итогом становится карта, где видны узлы, сценарии, пустоты и возможные точки действия.

Связанные элементы графа: [[source-material]], [[atomic-notes]], [[graph-mapping]], [[situation-map]], [[action-point]], [[lead-notes-analysis]].

## Связи

- [[source-material]] — starts_from
- [[atomic-notes]] — uses
- [[graph-mapping]] — uses
- [[situation-map]] — produces
- [[action-point]] — produces
- [[lead-notes-analysis]] — leads_to

## Следующие действия

- **Разобрать мои заметки** → [[lead-notes-analysis]]: Поможет пройти путь от хаотичного материала к карте и следующему действию.
- **Посмотреть исходный материал** → [[source-material]]: Поможет понять, что можно использовать для анализа.
- **Понять построение графа** → [[graph-mapping]]: Поможет увидеть техническую часть маршрута.
