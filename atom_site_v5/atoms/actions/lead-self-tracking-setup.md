---
id: lead-self-tracking-setup
title: Настроить self-tracking систему
slug: lead-self-tracking-setup
kind: action
hub: products
summary: Сборка простой системы наблюдения за состояниями, решениями, энергией и повторяющимися сценариями.
status: public
links:
- id: self-tracking-toolkit
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: state-log
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: weekly-review
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Связать с Obsidian
  target: obsidian
  help: Поможет понять, где хранить записи и как сохранить связи.
- label: Перейти к когнитивной реконструкции
  target: cognitive-reconstruction
  help: Поможет превратить накопленные наблюдения в карту ситуации.
- label: Посмотреть шаблон отслеживания
  target: tracking-questions
  help: Поможет начать с минимального набора вопросов.
seo:
  title: Настроить self-tracking систему
  description: Сборка простой системы наблюдения за состояниями, решениями, энергией и повторяющимися сценариями.
visibility: contextual
role: lead_action
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
- 'Можно использовать утверждения, прямо опирающиеся на смысл атома: Сборка простой системы наблюдения за состояниями, решениями, энергией и повторяющимися сценариями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---

# Настроить self-tracking систему

Self-tracking нужен, когда хочется перестать полагаться только на память и настроение. Система фиксирует состояния, решения, энергию, события и повторяющиеся сценарии в таком виде, чтобы их можно было потом увидеть на карте.

Минимальная настройка не должна превращаться в бюрократию над собой. Достаточно нескольких вопросов, регулярного формата записи и обзора, который показывает не красивые графики ради графиков, а реальные повторения.

Итог — простая система наблюдения: что фиксировать, как часто смотреть назад и какие сигналы считать важными для решений.
