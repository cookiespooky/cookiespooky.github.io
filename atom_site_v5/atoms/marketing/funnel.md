---
id: "funnel"
title: "Воронка"
slug: "funnel"
kind: "tool"
hub: "topics"
summary: "Последовательность шагов, через которые человек проходит от первого контакта до покупки или заявки."
status: "public"
links:
- id: "offer"
  rel: "related_to"
  strength: 0.5
  visibility: public
  can_surface: false
- id: "content-system"
  rel: "compatible_with"
  strength: 0.55
  visibility: public
  can_surface: false
- id: "threads"
  rel: "related_to"
  strength: 0.5
  visibility: internal
  can_surface: false
- id: "recca"
  rel: "related_product"
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: "Посмотреть путь клиента"
  target: "offer"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
- label: "Связать с контентом"
  target: "offer"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
- label: "Найти слабое место"
  target: "offer"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
seo:
  title: "Воронка"
  description: "Последовательность шагов, через которые человек проходит от первого контакта до покупки или заявки."
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Последовательность шагов, через которые человек проходит от первого контакта до покупки или заявки.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Воронка

Последовательность шагов, через которые человек проходит от первого контакта до покупки или заявки.

В маркетинговой логике это помогает сделать предложение понятнее: кому оно подходит, какую проблему закрывает, почему важно сейчас и какой следующий шаг ожидается от человека.
