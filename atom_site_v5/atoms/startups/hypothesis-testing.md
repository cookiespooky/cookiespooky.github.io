---
id: hypothesis-testing
title: Проверка гипотез
slug: hypothesis-testing
kind: method
hub: methods
summary: Быстрая проверка предположений о клиенте, проблеме, ценности, канале или продукте.
status: public
links:
- id: mvp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: product-thinking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: offer
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: system-before-sales
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-product-choice
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: startup-hypothesis
  rel: defines
  strength: 0.55
  visibility: public
  can_surface: false
- id: traction-signal
  rel: measures
  strength: 0.55
  visibility: public
  can_surface: false
- id: landing-page-test
  rel: example_of
  strength: 0.6
  visibility: public
  can_surface: true
actions:
- label: Сформулировать гипотезу
  target: lead-product-choice
  help: Поможет выбрать один фокус и проверить его на спросе.
- label: Выбрать тест
  target: lead-product-choice
  help: Поможет выбрать один фокус и проверить его на спросе.
- label: Связать с оффером
  target: mvp
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Собрать проверку гипотезы
  target: lead-startup-diagnostic
  help: Поможет выбрать тест, метрику и минимальный следующий шаг.
seo:
  title: Проверка гипотез
  description: Быстрая проверка предположений о клиенте, проблеме, ценности, канале или продукте.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Быстрая проверка предположений о клиенте, проблеме, ценности, канале или продукте.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Проверка гипотез

Быстрая проверка предположений о клиенте, проблеме, ценности, канале или продукте.

В продуктовой работе это помогает перейти от идеи к проверке: выбрать риск, минимальный формат, критерий результата и ближайшее действие.
