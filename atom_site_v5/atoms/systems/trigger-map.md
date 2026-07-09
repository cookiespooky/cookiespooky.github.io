---
id: trigger-map
title: Карта триггеров
slug: trigger-map
kind: artifact
hub: tools
summary: Карта триггеров связывает повторяющиеся реакции с ситуациями, словами, людьми, задачами и внутренними ожиданиями.
status: public
links:
- id: self-tracking
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: repeating-scenarios
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: behavior-pattern
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: cognitive-reconstruction
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: situation-map
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
actions:
- label: Найти повторяющиеся реакции
  target: behavior-pattern
  help: Поможет отличить одиночное событие от устойчивого паттерна.
- label: Связать с картой ситуации
  target: situation-map
  help: Поможет увидеть триггеры как часть общей системы, а не отдельные вспышки.
- label: Разобрать мои наблюдения
  target: lead-self-tracking-setup
  help: Поможет собрать карту триггеров по дневнику, заметкам или трекеру.
seo:
  title: Карта триггеров
  description: Карта триггеров связывает повторяющиеся реакции с ситуациями, словами, людьми, задачами и внутренними ожиданиями.
visibility: contextual
role: support_context
audience:
- expert
- founder
- researcher
- entrepreneur
routes: &id001
- situation-to-map
- notes-to-system
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Карта триггеров связывает повторяющиеся реакции с ситуациями, словами, людьми, задачами и внутренними ожиданиями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Карта триггеров

Карта триггеров описывает условия, после которых регулярно появляется одна и та же реакция: избегание, спешка, раздражение, замирание, импульсивное решение или уход в объяснения.

Она полезна в реконструкции, потому что связывает событие, интерпретацию, состояние и действие в один наблюдаемый сценарий.
