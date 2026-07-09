---
id: intervention-log
title: Журнал вмешательств
slug: intervention-log
kind: practice
hub: tools
summary: Журнал вмешательств фиксирует действия, которые человек пробует для изменения состояния, поведения или результата.
status: public
links:
- id: self-tracking
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: baseline-state
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: weekly-review
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: hypothesis-testing
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Связать с гипотезами
  target: hypothesis-testing
  help: Поможет проверять изменения как маленькие эксперименты, а не как веру в новый ритуал.
- label: Сравнить с базовым состоянием
  target: baseline-state
  help: Поможет увидеть эффект действия относительно обычного уровня.
- label: Собрать систему экспериментов
  target: lead-self-tracking-setup
  help: Поможет выбрать, что проверять и как понять, что это работает.
seo:
  title: Журнал вмешательств
  description: Журнал вмешательств фиксирует действия, которые человек пробует для изменения состояния, поведения или результата.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Журнал вмешательств фиксирует действия, которые человек пробует для изменения состояния, поведения или результата.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Журнал вмешательств

Журнал вмешательств сохраняет попытки изменить состояние или поведение: отдых, спорт, ограничение соцсетей, новый режим работы, разговор, продажное действие, изменение среды.

Он связывает self-tracking с проверкой гипотез. Действие становится наблюдаемым экспериментом: что было сделано, в каком контексте и какой эффект появился.
