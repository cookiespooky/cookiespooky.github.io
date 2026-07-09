---
id: ai-assisted-refactoring
title: AI-рефакторинг
slug: ai-assisted-refactoring
kind: method
hub: methods
summary: AI-рефакторинг — изменение структуры кода с помощью модели, при котором сохраняется поведение системы, а человек проверяет цель, риски и результат.
status: public
links:
- id: codex
  rel: implemented_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: repo-map
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: human-in-the-loop
  rel: requires
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: full-stack-mvp
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Проверить проект на рефакторинг
  target: lead-ai-mvp-build
  help: Поможет понять, где модель может безопасно упростить код, а где лучше не трогать проводку под напряжением.
visibility: contextual
role: implementation
audience:
- founder
- entrepreneur
- developer
routes: &id001
- idea-to-mvp
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: AI-рефакторинг — изменение структуры кода с помощью модели, при котором сохраняется поведение системы, а человек проверяет цель, риски и результат.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# AI-рефакторинг

AI-рефакторинг — изменение структуры кода с помощью модели, при котором сохраняется поведение системы, а человек проверяет цель, риски и результат.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
