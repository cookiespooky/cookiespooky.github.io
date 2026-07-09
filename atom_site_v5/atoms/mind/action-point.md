---
id: action-point
title: Точка действия
slug: action-point
kind: concept
hub: methods
summary: Конкретное место в карте ситуации, где можно сделать следующий шаг без полной перестройки всей системы.
status: public
links:
- id: situation-map
  rel: visible_on
  strength: 0.55
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: agency
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: product-choice
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Найти точку действия
  target: lead-cognitive-reconstruction
  help: Поможет выбрать один следующий шаг вместо попытки чинить всю систему сразу.
- label: Связать с агентностью
  target: agency
  help: Поможет увидеть, где появляется действующий субъект.
- label: Перейти к выбору продукта
  target: product-choice
  help: Поможет применить точку действия к продуктовой развилке.
seo:
  title: Точка действия
  description: Конкретное место в карте ситуации, где можно сделать следующий шаг без полной перестройки всей системы.
visibility: public
role: concept
audience:
- entrepreneur
- founder
- expert
routes:
- chaos-to-focus
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Конкретное место в карте ситуации, где можно сделать следующий шаг без полной перестройки всей системы.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Точка действия

Точка действия — элемент ситуации, где возможен практический шаг. Она отличается от общей цели тем, что находится внутри текущих ограничений и не требует полной ясности по всей системе.

Хорошая точка действия снижает перегрузку. Она переводит карту из режима описания в режим проверки.
