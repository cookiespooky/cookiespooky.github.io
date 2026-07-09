---
id: case-pattern-library
title: Библиотека кейсов
slug: case-pattern-library
kind: concept
hub: research
summary: Набор повторяющихся кейсов, из которых можно извлекать типовые проблемы, механизмы, маршруты и лидовые действия.
status: public
links:
- id: case-psychologist-no-positioning
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: case-founder-too-many-projects
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: case-evidence
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: research-notes
  rel: related_to
  strength: 0.5
  visibility: hidden
  can_surface: false
- id: lead-case-diagnostic
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Подобрать похожий кейс
  target: lead-case-diagnostic
  help: Поможет начать разбор с узнаваемой ситуации.
- label: Посмотреть доказательства
  target: case-evidence
  help: Поможет отличить наблюдение от красивой догадки.
seo:
  title: Библиотека кейсов
  description: Набор повторяющихся кейсов, из которых можно извлекать типовые проблемы, механизмы, маршруты и лидовые действия.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Набор повторяющихся кейсов, из которых можно извлекать типовые проблемы, механизмы, маршруты и лидовые действия.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Библиотека кейсов

Набор повторяющихся кейсов, из которых можно извлекать типовые проблемы, механизмы, маршруты и лидовые действия.

В карте ситуации такие понятия полезны осторожно: они помогают заметить повторяющиеся роли, объяснения и конфликты, но не должны заменять факты, решения и конкретные действия.
