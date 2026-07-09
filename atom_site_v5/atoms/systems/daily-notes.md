---
id: daily-notes
title: Ежедневные заметки
slug: daily-notes
kind: tool
hub: tools
summary: Формат регулярных записей, в которых фиксируются события, мысли, решения, сигналы состояния и повторяющиеся сценарии.
status: public
links:
- id: diary
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: self-tracking
  rel: supports
  strength: 0.55
  visibility: public
  can_surface: false
- id: self-tracking-signals
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: repeating-scenarios
  rel: reveals
  strength: 0.55
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: source_for
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
seo:
  title: Ежедневные заметки
  description: Формат регулярных записей, в которых фиксируются события, мысли, решения, сигналы состояния и повторяющиеся сценарии.
visibility: contextual
role: support_context
audience:
- expert
- founder
- researcher
- entrepreneur
- developer
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Формат регулярных записей, в которых фиксируются события, мысли, решения, сигналы состояния и повторяющиеся сценарии.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Ежедневные заметки

Формат регулярных записей, в которых фиксируются события, мысли, решения, сигналы состояния и повторяющиеся сценарии.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
