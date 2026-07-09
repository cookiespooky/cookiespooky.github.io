---
id: decision-log
title: Журнал решений
slug: decision-log
kind: practice
hub: tools
summary: Журнал решений фиксирует выбор, причину выбора, альтернативы, ожидание и фактический результат.
status: public
links:
- id: self-tracking
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: agency
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: no-selection-criterion
  rel: explains
  strength: 0.75
  visibility: public
  can_surface: true
- id: product-choice
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: weekly-review
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: cognitive-reconstruction
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Найти критерии выбора
  target: no-selection-criterion
  help: Поможет понять, почему выбор зависает и какие параметры нужны для решения.
- label: Связать с продуктовым выбором
  target: product-choice
  help: Поможет применить журнал решений к выбору продукта или направления.
- label: Разобрать решения за период
  target: lead-self-tracking-setup
  help: Поможет увидеть повторяющийся способ выбора и точки, где решение распадается.
seo:
  title: Журнал решений
  description: Журнал решений фиксирует выбор, причину выбора, альтернативы, ожидание и фактический результат.
visibility: contextual
role: concept
audience:
- expert
- founder
- researcher
- entrepreneur
routes: &id001
- situation-to-map
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Журнал решений фиксирует выбор, причину выбора, альтернативы, ожидание и фактический результат.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Журнал решений

Журнал решений — способ сохранять не только итоговый выбор, но и логику, которая к нему привела. В записи фиксируются варианты, критерии, ожидания, риски и последующая проверка результата.

Такой журнал помогает увидеть, где человек принимает решения осознанно, а где действует из страха потери вариантов, внешнего давления или привычного сценария.
