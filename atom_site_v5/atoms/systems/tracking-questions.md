---
id: tracking-questions
title: Вопросы для self-tracking
slug: tracking-questions
kind: tool
hub: tools
summary: Вопросы для self-tracking задают минимальный набор наблюдений, который помогает отслеживать состояние без перегруза.
status: public
links:
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: state-log
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: decision-log
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: weekly-review
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: self-tracking-signals
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
actions:
- label: Выбрать сигналы
  target: self-tracking-signals
  help: Поможет собрать короткий набор показателей для наблюдения.
- label: Связать с дневником
  target: diary
  help: Поможет встроить вопросы в уже существующие записи.
- label: Собрать шаблон отслеживания
  target: lead-self-tracking-setup
  help: Поможет превратить вопросы в рабочий шаблон для Obsidian или другой системы.
seo:
  title: Вопросы для self-tracking
  description: Вопросы для self-tracking задают минимальный набор наблюдений, который помогает отслеживать состояние без перегруза.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Вопросы для self-tracking задают минимальный набор наблюдений, который помогает отслеживать состояние без перегруза.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Вопросы для self-tracking

Вопросы для self-tracking ограничивают наблюдение несколькими устойчивыми точками: что произошло, какое было состояние, что было выбрано, что повторилось, что стало яснее.

Хороший набор вопросов не требует длинного отчета. Он помогает регулярно сохранять данные, которые потом можно связать с графом, реконструкцией и обзором недели.
