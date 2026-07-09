---
id: scenario-detection
title: Поиск сценариев
slug: scenario-detection
kind: method
hub: methods
summary: Метод выявления повторяющихся последовательностей решений, реакций и объяснений в разных ситуациях.
status: public
links:
- id: repeating-scenarios
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: diary
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: cognitive-reconstruction
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: agency
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: understand-but-do-not-act
  rel: example_of
  strength: 0.6
  visibility: public
  can_surface: true
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Найти мой повторяющийся сценарий
  target: lead-cognitive-reconstruction
  help: Поможет увидеть, где разные ситуации повторяют одну и ту же внутреннюю схему.
- label: Посмотреть примеры сценариев
  target: repeating-scenarios
  help: Поможет распознать типовые последовательности.
- label: Связать с дневником
  target: diary
  help: Поможет понять, как сценарии находят в заметках.
seo:
  title: Поиск сценариев
  description: Метод выявления повторяющихся последовательностей решений, реакций и объяснений в разных ситуациях.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Метод выявления повторяющихся последовательностей решений, реакций и объяснений в разных ситуациях.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Поиск сценариев

Поиск сценариев выявляет повторяющиеся схемы поведения и объяснения. Сценарий может проявляться в разных темах: работе, продуктах, отношениях, деньгах, контенте или выборе направления.

Повторение обычно заметно не по отдельному событию, а по последовательности: импульс, объяснение, действие, избегание, результат и новая рационализация.
