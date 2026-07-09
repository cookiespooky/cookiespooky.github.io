---
id: llm-apps
title: LLM-приложения
slug: llm-apps
kind: concept
hub: tools
summary: Приложения, в которых языковая модель работает с контекстом, данными и действиями пользователя.
status: public
links:
- id: ai-development
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: llm-site
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: ai-agents
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: knowledge-graph
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-ai-development
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
- id: llm-backend
  rel: part_of
  strength: 0.65
  visibility: internal
  can_surface: false
- id: tool-calling
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: ai-product-prototype
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
actions:
- label: Посмотреть интерфейсы без чата
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с сайтом
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Понять архитектуру
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Обсудить AI-проект
  target: lead-ai-development
  help: Поможет определить MVP, сценарий разработки и роль модели в продукте.
- label: Спроектировать LLM-приложение
  target: lead-ai-mvp-build
  help: Поможет определить интерфейс, контекст, инструменты и минимальную серверную архитектуру.
seo:
  title: LLM-приложения
  description: Приложения, в которых языковая модель работает с контекстом, данными и действиями пользователя.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Приложения, в которых языковая модель работает с контекстом, данными и действиями пользователя.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# LLM-приложения

Приложения, в которых языковая модель работает с контекстом, данными и действиями пользователя.

В продуктовой работе это помогает перейти от идеи к проверке: выбрать риск, минимальный формат, критерий результата и ближайшее действие.
