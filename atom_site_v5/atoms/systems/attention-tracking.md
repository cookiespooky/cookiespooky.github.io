---
id: attention-tracking
title: Отслеживание внимания
slug: attention-tracking
kind: practice
hub: tools
summary: Отслеживание внимания помогает увидеть, на что уходит фокус и где возникает распыление между задачами, идеями и тревогами.
status: public
links:
- id: state-log
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: too-many-ideas
  rel: related_to
  strength: 0.5
  visibility: hidden
  can_surface: false
- id: choice-paralysis
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: focus-window
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
actions:
- label: Связать с избытком идей
  target: too-many-ideas
  help: Поможет понять, какие идеи реально требуют действия, а какие забирают внимание.
- label: Посмотреть окно фокуса
  target: focus-window
  help: Поможет оценить, когда и в каком формате лучше делать важные задачи.
- label: Настроить отслеживание внимания
  target: lead-self-tracking-setup
  help: Поможет собрать легкую систему без лишнего микроменеджмента.
seo:
  title: Отслеживание внимания
  description: Отслеживание внимания помогает увидеть, на что уходит фокус и где возникает распыление между задачами, идеями и тревогами.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Отслеживание внимания помогает увидеть, на что уходит фокус и где возникает распыление между задачами, идеями и тревогами.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Отслеживание внимания

Отслеживание внимания показывает, куда уходит фокус в течение дня. Важны не только задачи, но и переключения, зависания, тревожные циклы и моменты ясности.

Такой слой полезен при избытке идей: он показывает, какие направления получают реальное внимание, а какие существуют как шум, долг или фантазия о будущем.
