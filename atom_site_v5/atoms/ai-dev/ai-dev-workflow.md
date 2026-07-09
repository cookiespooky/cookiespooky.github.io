---
id: ai-dev-workflow
title: AI-dev workflow
slug: ai-dev-workflow
kind: method
hub: methods
summary: AI-dev workflow — порядок работы, в котором человек формулирует цель, готовит контекст, модель меняет код, а результат проверяется короткими итерациями.
status: public
links:
- id: vibe-coding
  rel: explains
  strength: 0.75
  visibility: contextual
  can_surface: false
- id: context-package
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: prompt-brief
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: technical-spec-from-idea
  rel: starts_with
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-assisted-refactoring
  rel: includes
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: lead-ai-mvp-build
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Посмотреть структуру задачи
  target: prompt-brief
  help: Поможет понять, какие данные нужны модели для точной разработки.
- label: Обсудить AI-MVP
  target: lead-ai-mvp-build
  help: Поможет собрать первый проход разработки без лишней архитектурной магии.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: AI-dev workflow — порядок работы, в котором человек формулирует цель, готовит контекст, модель меняет код, а результат проверяется короткими итерациями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# AI-dev workflow

AI-dev workflow — порядок работы, в котором человек формулирует цель, готовит контекст, модель меняет код, а результат проверяется короткими итерациями.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
