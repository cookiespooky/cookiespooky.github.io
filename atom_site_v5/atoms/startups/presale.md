---
id: "presale"
title: "Предпродажа"
slug: "presale"
kind: "method"
hub: "topics"
summary: "Предпродажа — проверка готовности платить до полной разработки продукта."
status: "public"
links:
- id: "demand-validation"
  rel: "uses"
  strength: 0.7
  visibility: public
  can_surface: true
- id: "traction-signal"
  rel: "produces"
  strength: 0.8
  visibility: public
  can_surface: true
- id: "concierge-mvp"
  rel: "compatible_with"
  strength: 0.55
  visibility: public
  can_surface: false
- id: "offer"
  rel: "uses"
  strength: 0.7
  visibility: public
  can_surface: true
actions:
- label: "Проверить предпродажу"
  target: "lead-startup-diagnostic"
  help: "Поможет понять, можно ли тестировать оплату до разработки."
- label: "Посмотреть concierge MVP"
  target: "concierge-mvp"
  help: "Поможет проверить решение вручную."
- label: "Уточнить оффер"
  target: "offer"
  help: "Поможет сформулировать предмет оплаты."
seo:
  title: "Предпродажа"
  description: "Предпродажа — проверка готовности платить до полной разработки продукта."
visibility: public
role: method
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Предпродажа — проверка готовности платить до полной разработки продукта.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Предпродажа

Предпродажа — проверка готовности платить до полной разработки продукта.

В продуктовой работе это помогает перейти от идеи к проверке: выбрать риск, минимальный формат, критерий результата и ближайшее действие.
