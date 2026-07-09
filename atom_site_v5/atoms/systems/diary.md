---
id: diary
title: Дневник
slug: diary
kind: practice
hub: tools
summary: Поток личных наблюдений, событий, мыслей и решений, который со временем становится материалом для анализа.
status: public
links:
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: repeating-scenarios
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: daily-notes
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: self-tracking-signals
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: personal-knowledge-base
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
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
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: trigger-map
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
actions:
- label: Проанализировать дневник
  target: obsidian
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с графом
  target: obsidian
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Найти повторения
  target: obsidian
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет превратить хаотичные заметки в атомы, связи и карту тем.
- label: Собрать self-tracking из дневника
  target: lead-self-tracking-setup
  help: Поможет превратить дневниковый поток в простую систему наблюдений.
seo:
  title: Дневник
  description: Поток личных наблюдений, событий, мыслей и решений, который со временем становится материалом для анализа.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Поток личных наблюдений, событий, мыслей и решений, который со временем становится материалом для анализа.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Дневник

Поток личных наблюдений, событий, мыслей и решений, который со временем становится материалом для анализа.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
