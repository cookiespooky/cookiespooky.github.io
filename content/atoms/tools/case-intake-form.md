---
type: article
id: "case-intake-form"
title: "Форма сбора кейса"
slug: "case-intake-form"
kind: "tool"
hub:
  - "tools"
summary: "Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты."
description: "Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты."
status: "public"
lang: "ru"
links:
  - id: "case-route"
    rel: "produces"
  - id: "situation-map"
    rel: "produces"
  - id: "lead-case-diagnostic"
    rel: "leads_to"
  - id: "cognitive-reconstruction"
    rel: "compatible_with"
actions:
  - label: "Собрать вводные"
    target: "lead-case-diagnostic"
    help: "Поможет начать разбор с фактов и контекста."
---
# Форма сбора кейса

Форма сбора кейса должна получать только материал, нужный для первичной диагностики: что происходит, что уже пробовали, какой результат нужен, где застревание, какие есть факты. Ее задача — подготовить данные для [[case-route|Маршрут кейса]], [[situation-map|Карта ситуации]] и [[lead-case-diagnostic|Диагностика кейса]].

Связанные элементы графа: [[case-route|Маршрут кейса]], [[situation-map|Карта ситуации]], [[lead-case-diagnostic|Диагностика кейса]], [[cognitive-reconstruction|Когнитивная реконструкция]].

## Связи

- [[case-route|Маршрут кейса]] — produces
- [[situation-map|Карта ситуации]] — produces
- [[lead-case-diagnostic|Диагностика кейса]] — leads_to
- [[cognitive-reconstruction|Когнитивная реконструкция]] — compatible_with

## Следующие действия

- **Собрать вводные** → [[lead-case-diagnostic|Диагностика кейса]]: Поможет начать разбор с фактов и контекста.
