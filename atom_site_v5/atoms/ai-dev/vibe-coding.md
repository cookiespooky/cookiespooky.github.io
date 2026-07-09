---
id: vibe-coding
title: Vibe coding
slug: vibe-coding
kind: method
hub: topics
summary: Разработка через быструю итерацию с AI, где человек управляет направлением, а модель ускоряет реализацию.
status: public
links:
- id: ai-development
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: mvp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: prompt-engineering
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: full-stack-mvp
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: lead-ai-development
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
- id: codex
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: ai-dev-workflow
  rel: explains
  strength: 0.75
  visibility: contextual
  can_surface: false
- id: prompt-brief
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: lead-ai-mvp-build
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Собрать MVP
  target: lead-ai-development
  help: Поможет быстро перейти от идеи к рабочему прототипу или понятному техническому плану.
- label: Понять ограничения
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Перейти к AI-разработке
  target: lead-ai-development
  help: Поможет быстро перейти от идеи к рабочему прототипу или понятному техническому плану.
- label: Собрать AI-MVP
  target: lead-ai-mvp-build
  help: Поможет перейти от вайба к рабочему прототипу, а не к священному лесу незакоммиченного кода.
seo:
  title: Vibe coding
  description: Разработка через быструю итерацию с AI, где человек управляет направлением, а модель ускоряет реализацию.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Разработка через быструю итерацию с AI, где человек управляет направлением, а модель ускоряет реализацию.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Vibe coding

Разработка через быструю итерацию с AI, где человек управляет направлением, а модель ускоряет реализацию.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
