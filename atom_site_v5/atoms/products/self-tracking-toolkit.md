---
id: self-tracking-toolkit
title: Self-tracking toolkit
slug: self-tracking-toolkit
kind: product
hub: products
summary: Набор подходов для наблюдения за состояниями, действиями, решениями и повторяющимися паттернами.
status: public
links:
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: diary
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: repeating-scenarios
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: state-log
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: decision-log
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: weekly-review
  rel: contains
  strength: 0.55
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
- label: Понять, что отслеживать
  target: self-tracking
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с дневником
  target: self-tracking
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Посмотреть сценарии анализа
  target: self-tracking
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Собрать мою систему self-tracking
  target: lead-self-tracking-setup
  help: Поможет определить, что отслеживать и как использовать наблюдения для решений.
seo:
  title: Self-tracking toolkit
  description: Набор подходов для наблюдения за состояниями, действиями, решениями и повторяющимися паттернами.
visibility: contextual
role: offer
audience:
- entrepreneur
- founder
- expert
routes: &id001
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Набор подходов для наблюдения за состояниями, действиями, решениями и повторяющимися паттернами.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Self-tracking toolkit

Набор подходов для наблюдения за состояниями, действиями, решениями и повторяющимися паттернами.

В карте ситуации это помогает назвать повторяющийся элемент, увидеть его связи с другими частями системы и найти место, где возможно действие.
