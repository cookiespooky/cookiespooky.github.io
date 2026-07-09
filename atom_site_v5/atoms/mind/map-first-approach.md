---
id: map-first-approach
title: Подход от карты
slug: map-first-approach
kind: principle
hub: methods
summary: Принцип, при котором решение ищется после построения карты ситуации, а не до понимания связей между элементами.
status: public
links:
- id: situation-map
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: cognitive-reconstruction
  rel: principle_of
  strength: 0.55
  visibility: public
  can_surface: false
- id: action-point
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: complexity-preservation
  rel: related_to
  strength: 0.5
  visibility: hidden
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Построить карту до решения
  target: lead-cognitive-reconstruction
  help: Поможет не выбирать действие из тумана и сначала увидеть структуру ситуации.
- label: Понять карту ситуации
  target: situation-map
  help: Поможет увидеть основной артефакт подхода.
- label: Найти точку действия
  target: action-point
  help: Поможет перейти от карты к практическому шагу.
seo:
  title: Подход от карты
  description: Принцип, при котором решение ищется после построения карты ситуации, а не до понимания связей между элементами.
visibility: public
role: mechanism
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Принцип, при котором решение ищется после построения карты ситуации, а не до понимания связей между элементами.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Подход от карты

Принцип, при котором решение ищется после построения карты ситуации, а не до понимания связей между элементами.

В карте ситуации это помогает назвать повторяющийся элемент, увидеть его связи с другими частями системы и найти место, где возможно действие.
