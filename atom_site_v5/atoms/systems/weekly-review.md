---
id: weekly-review
title: Еженедельный обзор
slug: weekly-review
kind: practice
hub: tools
summary: Еженедельный обзор собирает разрозненные записи недели в короткую карту состояний, решений, действий и повторений.
status: public
links:
- id: diary
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
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
- id: repeating-scenarios
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: situation-map
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-self-tracking-setup
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Собрать повторения недели
  target: repeating-scenarios
  help: Поможет увидеть, что повторялось в действиях, состояниях и решениях.
- label: Связать с картой ситуации
  target: situation-map
  help: Поможет перенести наблюдения недели в общую карту.
- label: Настроить обзор под себя
  target: lead-self-tracking-setup
  help: Поможет сделать еженедельный обзор коротким и устойчивым.
seo:
  title: Еженедельный обзор
  description: Еженедельный обзор собирает разрозненные записи недели в короткую карту состояний, решений, действий и повторений.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Еженедельный обзор собирает разрозненные записи недели в короткую карту состояний, решений, действий и повторений.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Еженедельный обзор

Еженедельный обзор переводит поток заметок в структуру. Вместо полного перечитывания недели человек выделяет ключевые состояния, решения, события, повторения и незавершенные вопросы.

Такой обзор удерживает self-tracking в практическом режиме: записи используются для понимания и действия, а не копятся как личный архив без выхода.
