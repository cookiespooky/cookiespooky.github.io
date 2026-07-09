---
id: principle-graph-over-linear-content
title: Граф сильнее линейной ленты
slug: principle-graph-over-linear-content
kind: principle
hub: research
summary: Граф позволяет связывать темы, продукты, кейсы, методы и действия без необходимости каждый раз писать новый длинный текст.
status: public
links:
- id: knowledge-graph
  rel: explains
  strength: 0.75
  visibility: public
  can_surface: true
- id: llm-site
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: notepub
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Собрать публикацию из заметок
  target: lead-notepub-setup
  help: Поможет превратить разрозненные заметки в публичный граф с маршрутами пользователя.
- label: Посмотреть LLM-сайт
  target: llm-site
  help: Поможет понять, как граф работает как интерфейс для человека и модели.
seo:
  title: Граф сильнее линейной ленты
  description: Граф позволяет связывать темы, продукты, кейсы, методы и действия без необходимости каждый раз писать новый длинный текст.
visibility: public
role: mechanism
audience:
- expert
- founder
- researcher
- entrepreneur
routes:
- situation-to-map
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Граф позволяет связывать темы, продукты, кейсы, методы и действия без необходимости каждый раз писать новый длинный текст.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Граф сильнее линейной ленты

Граф позволяет связывать темы, продукты, кейсы, методы и действия без необходимости каждый раз писать новый длинный текст.

Линейная статья фиксирует один порядок чтения. Граф позволяет разным людям двигаться разными маршрутами: от продукта, проблемы, метода, инструмента или кейса.

Для LLM-сайта это особенно важно: модель может собирать локальный подграф под конкретный интерес пользователя, не отправляя в контекст всю базу.

## Связанные элементы

Граф знаний · LLM-сайт · Атомарные заметки · Notepub
