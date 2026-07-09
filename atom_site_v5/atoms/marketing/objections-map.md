---
id: objections-map
title: Карта возражений
slug: objections-map
kind: tool
hub: tools
summary: Список типовых сомнений, рисков и вопросов аудитории, связанных с продуктом, ценой, форматом, результатом и доверием.
status: public
links:
- id: sales-conversation
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: offer
  rel: explains
  strength: 0.75
  visibility: public
  can_surface: true
- id: icp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: content-system
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
- label: Найти темы для контента
  target: content-system
  help: Поможет превратить возражения в полезные объяснения.
- label: Уточнить оффер
  target: offer
  help: Поможет снять лишнюю неопределенность.
- label: Собрать карту возражений
  target: lead-content-map
  help: Поможет подготовить контент и диалоги без давления.
seo:
  title: Карта возражений
  description: Список типовых сомнений, рисков и вопросов аудитории, связанных с продуктом, ценой, форматом, результатом и доверием.
visibility: public
role: support_context
audience:
- entrepreneur
- founder
- expert
routes:
- product-to-offer
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Список типовых сомнений, рисков и вопросов аудитории, связанных с продуктом, ценой, форматом, результатом и доверием.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Карта возражений

Список типовых сомнений, рисков и вопросов аудитории, связанных с продуктом, ценой, форматом, результатом и доверием.

В маркетинговой логике это помогает сделать предложение понятнее: кому оно подходит, какую проблему закрывает, почему важно сейчас и какой следующий шаг ожидается от человека.
