---
id: lens-analysis
title: Линзирование
slug: lens-analysis
kind: method
hub: methods
summary: 'Метод просмотра одной ситуации через разные аналитические рамки: продуктовую, языковую, поведенческую, маркетинговую или сценарную.'
status: public
links:
- id: cognitive-reconstruction
  rel: extends
  strength: 0.55
  visibility: public
  can_surface: false
- id: situation-map
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: lat
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: product-thinking
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: marketing-os
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Наложить линзы на ситуацию
  target: lead-cognitive-reconstruction
  help: Поможет посмотреть на одну ситуацию с нескольких сторон и не застрять в единственном объяснении.
- label: Посмотреть связь с картой
  target: situation-map
  help: Поможет понять, на какие элементы карты накладываются линзы.
- label: Перейти к Marketing OS
  target: marketing-os
  help: Поможет применить линзирование к маркетингу и продукту.
seo:
  title: Линзирование
  description: 'Метод просмотра одной ситуации через разные аналитические рамки: продуктовую, языковую, поведенческую, маркетинговую или сценарную.'
visibility: public
role: method
audience:
- entrepreneur
- founder
- expert
routes:
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Метод просмотра одной ситуации через разные аналитические рамки: продуктовую, языковую, поведенческую, маркетинговую или сценарную.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Линзирование

Линзирование — способ анализировать одну и ту же ситуацию через несколько рамок. Линза задает, какие элементы считать важными и какие связи искать.

Одна линза может показать агентность, другая — продуктовую логику, третья — повторяющийся сценарий. Это снижает риск принять одну интерпретацию за всю реальность.
