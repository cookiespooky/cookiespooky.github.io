---
id: system-before-sales
title: Система вместо продаж
slug: system-before-sales
kind: pattern
hub: topics
summary: Паттерн, в котором человек строит инфраструктуру до проверки спроса и живого контакта с рынком.
status: public
links:
- id: hypothesis-testing
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: mvp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: false-preparation
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: repeating-scenarios
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: technical-spec-from-idea
  rel: balances
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-product-prototype
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
- id: build-trap
  rel: example_of
  strength: 0.6
  visibility: public
  can_surface: true
- id: demand-validation
  rel: counterbalance
  strength: 0.55
  visibility: public
  can_surface: false
- id: concierge-mvp
  rel: alternative
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Найти ближайшую проверку
  target: hypothesis-testing
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Сократить инфраструктуру
  target: hypothesis-testing
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с повторяющимся сценарием
  target: hypothesis-testing
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Собрать минимальный прототип
  target: lead-ai-mvp-build
  help: Поможет не строить космодром до проверки, есть ли вообще ракета.
- label: Проверить, не строю ли лишнее
  target: lead-startup-diagnostic
  help: Поможет отличить нужную разработку от избегания проверки спроса.
seo:
  title: Система вместо продаж
  description: Паттерн, в котором человек строит инфраструктуру до проверки спроса и живого контакта с рынком.
visibility: public
role: concept
audience:
- founder
- entrepreneur
routes:
- idea-to-mvp
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Паттерн, в котором человек строит инфраструктуру до проверки спроса и живого контакта с рынком.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Система вместо продаж

Паттерн, в котором человек строит инфраструктуру до проверки спроса и живого контакта с рынком.

В продуктовой работе это помогает перейти от идеи к проверке: выбрать риск, минимальный формат, критерий результата и ближайшее действие.
