---
id: self-tracking-dashboard
title: Дашборд self-tracking
slug: self-tracking-dashboard
kind: artifact
hub: tools
summary: Дашборд self-tracking собирает ключевые сигналы, обзоры и повторения в одном месте для быстрого просмотра.
status: public
links:
- id: self-tracking
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: state-log
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: decision-log
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
- id: notepub
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
actions:
- label: Выбрать показатели
  target: tracking-questions
  help: Поможет определить, что должно попасть в дашборд.
- label: Связать с Obsidian
  target: obsidian
  help: Поможет встроить дашборд в существующий vault.
- label: Собрать мой дашборд
  target: lead-self-tracking-setup
  help: Поможет сделать минимальную панель без лишней аналитической мишуры.
seo:
  title: Дашборд self-tracking
  description: Дашборд self-tracking собирает ключевые сигналы, обзоры и повторения в одном месте для быстрого просмотра.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Дашборд self-tracking собирает ключевые сигналы, обзоры и повторения в одном месте для быстрого просмотра.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Дашборд self-tracking

Дашборд self-tracking — обзорный экран для ключевых сигналов: состояние, энергия, внимание, решения, повторения, эксперименты и выводы недели.

Он нужен не для красивой статистики, а для быстрого доступа к тому, что помогает принимать решения и замечать изменения в собственной системе.
