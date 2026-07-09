---
id: state-log
title: Журнал состояний
slug: state-log
kind: practice
hub: tools
summary: Журнал состояний фиксирует энергию, внимание, настроение, телесные сигналы и контекст дня в короткой форме.
status: public
links:
- id: self-tracking
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: energy-tracking
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: attention-tracking
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: baseline-state
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
- id: weekly-review
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: lead-self-tracking-setup
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Понять, что фиксировать
  target: self-tracking-signals
  help: Поможет отделить полезные наблюдения от случайного дневникового шума.
- label: Собрать еженедельный обзор
  target: weekly-review
  help: Поможет увидеть повторения в состояниях и действиях.
- label: Настроить мою систему отслеживания
  target: lead-self-tracking-setup
  help: Поможет выбрать минимальный набор полей, чтобы наблюдение не превратилось в еще одну обязанность.
seo:
  title: Журнал состояний
  description: Журнал состояний фиксирует энергию, внимание, настроение, телесные сигналы и контекст дня в короткой форме.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Журнал состояний фиксирует энергию, внимание, настроение, телесные сигналы и контекст дня в короткой форме.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Журнал состояний

Журнал состояний — короткая запись о том, как человек функционирует в конкретный день. В него можно включать энергию, внимание, настроение, сон, нагрузку, действия и заметный контекст.

Задача журнала не в тотальном контроле, а в накоплении наблюдений, из которых позже видны связи между состояниями, решениями и повторяющимися сценариями.
