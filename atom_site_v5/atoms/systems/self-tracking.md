---
id: self-tracking
title: Self-tracking
slug: self-tracking
kind: method
hub: methods
summary: Регулярное наблюдение за состояниями, действиями, событиями и повторяющимися связями.
status: public
links:
- id: diary
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: repeating-scenarios
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: self-tracking-toolkit
  rel: related_product
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: daily-notes
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: self-tracking-signals
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: personal-knowledge-base
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: state-log
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: decision-log
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: weekly-review
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: tracking-questions
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: self-tracking-dashboard
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: lead-self-tracking-setup
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Выбрать метрики
  target: lead-product-choice
  help: Поможет выбрать один фокус и проверить его на спросе.
- label: Связать с дневником
  target: diary
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Найти сценарии
  target: diary
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Настроить систему наблюдения
  target: lead-self-tracking-setup
  help: Поможет выбрать минимальные поля, вопросы и обзор недели под вашу задачу.
seo:
  title: Self-tracking
  description: Регулярное наблюдение за состояниями, действиями, событиями и повторяющимися связями.
visibility: public
role: method
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Регулярное наблюдение за состояниями, действиями, событиями и повторяющимися связями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Self-tracking

Регулярное наблюдение за состояниями, действиями, событиями и повторяющимися связями.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
