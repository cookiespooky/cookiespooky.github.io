---
id: ai-agents
title: AI-агенты
slug: ai-agents
kind: concept
hub: tools
summary: Системы, где модель выполняет последовательность действий с учетом цели, инструментов и обратной связи.
status: public
links:
- id: ai-development
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: automation
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: prompt-engineering
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: llm-apps
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: tool-calling
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: browser-automation
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: playwright
  rel: compatible_with
  strength: 0.55
  visibility: internal
  can_surface: false
actions:
- label: Понять сценарии агентов
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с автоматизацией
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Посмотреть ограничения
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Разобрать агентный сценарий
  target: lead-ai-mvp-build
  help: Поможет отделить реального агента от чата с бейджиком “агент”.
seo:
  title: AI-агенты
  description: Системы, где модель выполняет последовательность действий с учетом цели, инструментов и обратной связи.
visibility: contextual
role: concept
audience:
- founder
- entrepreneur
- developer
routes: &id001
- idea-to-mvp
surface_policy:
  can_be_main_topic: true
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Системы, где модель выполняет последовательность действий с учетом цели, инструментов и обратной связи.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# AI-агенты

Системы, где модель выполняет последовательность действий с учетом цели, инструментов и обратной связи.

В продуктовой работе это помогает перейти от идеи к проверке: выбрать риск, минимальный формат, критерий результата и ближайшее действие.
