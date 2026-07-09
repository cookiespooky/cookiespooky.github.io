---
id: content-diagnostics
title: Диагностика контента
slug: content-diagnostics
kind: method
hub: methods
summary: Разбор публикаций по роли, аудитории, боли, офферу, переходам и фактическим реакциям. Диагностика показывает, где контент теряет связь с заявкой.
status: public
links:
- id: content-system
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: threads
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: positioning
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: content-to-leads
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Проверить роли постов
  target: pillar-content
  help: Поможет понять, какие публикации удерживают главную тему.
- label: Найти разрыв до заявки
  target: content-to-leads
  help: Поможет увидеть, где человек понимает текст, но не делает следующий шаг.
- label: Разобрать мой контент
  target: lead-content-map
  help: Поможет собрать карту тем, действий и лидовых переходов.
seo:
  title: Диагностика контента
  description: Разбор публикаций по роли, аудитории, боли, офферу, переходам и фактическим реакциям. Диагностика показывает, где контент теряет связь с заявкой.
visibility: public
role: method
audience:
- entrepreneur
- founder
- expert
routes:
- product-to-offer
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Разбор публикаций по роли, аудитории, боли, офферу, переходам и фактическим реакциям. Диагностика показывает, где контент теряет связь с заявкой.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Диагностика контента

Разбор публикаций по роли, аудитории, боли, офферу, переходам и фактическим реакциям. Диагностика показывает, где контент теряет связь с заявкой.

В маркетинговой логике это помогает сделать предложение понятнее: кому оно подходит, какую проблему закрывает, почему важно сейчас и какой следующий шаг ожидается от человека.
