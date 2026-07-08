---
type: article
id: "lead-case-diagnostic"
title: "Диагностика кейса"
slug: "lead-case-diagnostic"
kind: "action"
hub:
  - "products"
summary: "Лидовое действие для пользователя, который узнал свою ситуацию в одном из кейсов и хочет понять структуру собственного запроса."
description: "Лидовое действие для пользователя, который узнал свою ситуацию в одном из кейсов и хочет понять структуру собственного запроса."
status: "public"
lang: "ru"
links:
  - id: "case-pattern-library"
    rel: "uses"
  - id: "case-route"
    rel: "produces"
  - id: "situation-map"
    rel: "produces"
  - id: "cognitive-reconstruction"
    rel: "related_to"
actions:
  - label: "Описать свою ситуацию"
    target: "lead-case-diagnostic"
    help: "Поможет сопоставить ваш запрос с похожими кейсами и выбрать точку разбора."
---
# Диагностика кейса

Диагностика кейса помогает связать конкретную ситуацию пользователя с уже существующими маршрутами графа. На выходе можно получить первичную карту проблемы, список ключевых узлов и рекомендацию следующего шага: маркетинг, реконструкция, self-tracking, продуктовая проверка или работа с контентом.

Связанные элементы графа: [[case-pattern-library|Библиотека кейсов]], [[case-route|Маршрут кейса]], [[situation-map|Карта ситуации]], [[cognitive-reconstruction|Когнитивная реконструкция]].

## Связи

- [[case-pattern-library|Библиотека кейсов]] — uses
- [[case-route|Маршрут кейса]] — produces
- [[situation-map|Карта ситуации]] — produces
- [[cognitive-reconstruction|Когнитивная реконструкция]] — related_to

## Следующие действия

- **Описать свою ситуацию** → [[lead-case-diagnostic|Диагностика кейса]]: Поможет сопоставить ваш запрос с похожими кейсами и выбрать точку разбора.
