---
id: case-intake-form
title: Форма сбора кейса
slug: case-intake-form
kind: tool
hub: tools
summary: Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты.
status: public
links:
- id: case-route
  rel: produces
- id: situation-map
  rel: produces
- id: lead-case-diagnostic
  rel: leads_to
- id: cognitive-reconstruction
  rel: compatible_with
actions:
- label: Собрать вводные
  target: lead-case-diagnostic
  help: Поможет начать разбор с фактов и контекста.
seo:
  title: Форма сбора кейса
  description: Минимальная форма, которая собирает контекст кейса без превращения пользователя в заложника анкеты.
---

# Форма сбора кейса

Форма сбора кейса должна получать только материал, нужный для первичной диагностики: что происходит, что уже пробовали, какой результат нужен, где застревание, какие есть факты. Ее задача — подготовить данные для [[case-route]], [[situation-map]] и [[lead-case-diagnostic]].

Связанные элементы графа: [[case-route]], [[situation-map]], [[lead-case-diagnostic]], [[cognitive-reconstruction]].

## Связи

- [[case-route]] — produces
- [[situation-map]] — produces
- [[lead-case-diagnostic]] — leads_to
- [[cognitive-reconstruction]] — compatible_with

## Следующие действия

- **Собрать вводные** → [[lead-case-diagnostic]]: Поможет начать разбор с фактов и контекста.
