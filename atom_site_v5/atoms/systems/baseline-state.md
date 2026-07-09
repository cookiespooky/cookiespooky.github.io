---
id: baseline-state
title: Базовое состояние
slug: baseline-state
kind: concept
hub: tools
summary: Базовое состояние описывает обычный уровень энергии, внимания, настроения и нагрузки, от которого удобно замечать отклонения.
status: public
links:
- id: state-log
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: energy-tracking
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: attention-tracking
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: self-tracking-signals
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: intervention-log
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
actions:
- label: Определить базовую линию
  target: state-log
  help: Поможет сравнивать состояние не с идеалом, а с собственным обычным уровнем.
- label: Связать с изменениями
  target: intervention-log
  help: Поможет понять, какие действия действительно меняют состояние.
- label: Настроить наблюдение
  target: lead-self-tracking-setup
  help: Поможет выбрать простые показатели базового состояния.
seo:
  title: Базовое состояние
  description: Базовое состояние описывает обычный уровень энергии, внимания, настроения и нагрузки, от которого удобно замечать отклонения.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Базовое состояние описывает обычный уровень энергии, внимания, настроения и нагрузки, от которого удобно замечать отклонения.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Базовое состояние

Базовое состояние — личная точка отсчета. Оно описывает, как обычно выглядят энергия, внимание, настроение и нагрузка, когда нет сильного провала или подъема.

Без базовой линии сложно понять, что именно изменилось. Наблюдение начинает путать обычное состояние, временную усталость и устойчивый сдвиг.
