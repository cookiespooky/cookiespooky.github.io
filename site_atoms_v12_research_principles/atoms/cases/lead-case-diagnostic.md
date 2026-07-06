---
id: lead-case-diagnostic
title: Диагностика кейса
slug: lead-case-diagnostic
kind: action
hub: products
summary: Лидовое действие для пользователя, который узнал свою ситуацию в одном из кейсов и хочет понять структуру собственного запроса.
status: public
links:
- id: case-pattern-library
  rel: uses
- id: case-route
  rel: produces
- id: situation-map
  rel: produces
- id: cognitive-reconstruction
  rel: related_to
actions:
- label: Описать свою ситуацию
  target: lead-case-diagnostic
  help: Поможет сопоставить ваш запрос с похожими кейсами и выбрать точку разбора.
seo:
  title: Диагностика кейса
  description: Лидовое действие для пользователя, который узнал свою ситуацию в одном из кейсов и хочет понять структуру собственного запроса.
---

# Диагностика кейса

Диагностика кейса помогает связать конкретную ситуацию пользователя с уже существующими маршрутами графа. На выходе можно получить первичную карту проблемы, список ключевых узлов и рекомендацию следующего шага: маркетинг, реконструкция, self-tracking, продуктовая проверка или работа с контентом.

Связанные элементы графа: [[case-pattern-library]], [[case-route]], [[situation-map]], [[cognitive-reconstruction]].

## Связи

- [[case-pattern-library]] — uses
- [[case-route]] — produces
- [[situation-map]] — produces
- [[cognitive-reconstruction]] — related_to

## Следующие действия

- **Описать свою ситуацию** → [[lead-case-diagnostic]]: Поможет сопоставить ваш запрос с похожими кейсами и выбрать точку разбора.
