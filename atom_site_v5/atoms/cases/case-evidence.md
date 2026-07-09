---
id: case-evidence
title: Доказательства в кейсе
slug: case-evidence
kind: concept
hub: research
summary: Факты, цитаты, действия, метрики и повторения, которые подтверждают выводы в разборе кейса.
status: public
links:
- id: lat
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: self-tracking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: diary
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: case-pattern-library
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
actions:
- label: Собрать факты кейса
  target: lead-case-diagnostic
  help: Поможет строить выводы на материале, а не на ощущении.
- label: Посмотреть LAT
  target: lat
  help: Поможет использовать речь как источник признаков.
seo:
  title: Доказательства в кейсе
  description: Факты, цитаты, действия, метрики и повторения, которые подтверждают выводы в разборе кейса.
visibility: contextual
role: concept
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Факты, цитаты, действия, метрики и повторения, которые подтверждают выводы в разборе кейса.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Доказательства в кейсе

Доказательства удерживают кейс от превращения в литературный диагноз. В качестве доказательств могут выступать формулировки клиента, повторяющиеся решения, статистика контента, история заявок, заметки из дневника и последовательность действий. Они связывают Библиотека кейсов с LAT и Self-tracking.
