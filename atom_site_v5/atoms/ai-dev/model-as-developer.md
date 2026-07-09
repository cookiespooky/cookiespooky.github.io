---
id: model-as-developer
title: Модель как разработчик
slug: model-as-developer
kind: concept
hub: topics
summary: Модель как разработчик — подход, где LLM выполняет часть технической работы, а человек задает цель, ограничения, проверку и направление изменений.
status: public
links:
- id: ai-development
  rel: explains
  strength: 0.75
  visibility: contextual
  can_surface: false
- id: codex
  rel: implemented_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: human-in-the-loop
  rel: requires
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: vibe-coding
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
actions:
- label: Понять роль человека
  target: human-in-the-loop
  help: Поможет разделить ответственность между моделью и автором проекта.
- label: Собрать MVP с моделью
  target: lead-ai-mvp-build
  help: Поможет определить, какие части проекта можно быстрее собрать через AI.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Модель как разработчик — подход, где LLM выполняет часть технической работы, а человек задает цель, ограничения, проверку и направление изменений.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Модель как разработчик

Модель как разработчик — подход, где LLM выполняет часть технической работы, а человек задает цель, ограничения, проверку и направление изменений.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
