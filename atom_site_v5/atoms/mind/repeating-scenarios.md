---
id: repeating-scenarios
title: Повторяющиеся сценарии
slug: repeating-scenarios
kind: concept
hub: topics
summary: Устойчивые паттерны решений, реакций и действий, которые повторяются в разных ситуациях.
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
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: system-before-sales
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: scenario-detection
  rel: detected_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: source-material
  rel: derived_from
  strength: 0.55
  visibility: public
  can_surface: false
- id: behavior-pattern
  rel: contains
  strength: 0.55
  visibility: public
  can_surface: false
- id: weekly-review
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: trigger-map
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
actions:
- label: Найти сценарий
  target: self-tracking
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с дневником
  target: self-tracking
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Посмотреть пример
  target: self-tracking
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Разобрать мою ситуацию
  target: lead-cognitive-reconstruction
  help: Поможет увидеть структуру ситуации, повторяющиеся сценарии и ближайшие действия.
- label: Найти сценарии в моих заметках
  target: lead-notes-analysis
  help: Поможет обнаружить повторяющиеся схемы в дневнике, постах или описаниях ситуаций.
- label: Найти сценарии в наблюдениях
  target: lead-self-tracking-setup
  help: Поможет связать записи, состояния и решения в повторяющиеся паттерны.
seo:
  title: Повторяющиеся сценарии
  description: Устойчивые паттерны решений, реакций и действий, которые повторяются в разных ситуациях.
visibility: public
role: concept
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Устойчивые паттерны решений, реакций и действий, которые повторяются в разных ситуациях.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Повторяющиеся сценарии

Устойчивые паттерны решений, реакций и действий, которые повторяются в разных ситуациях.

В карте ситуации это помогает назвать повторяющийся элемент, увидеть его связи с другими частями системы и найти место, где возможно действие.
