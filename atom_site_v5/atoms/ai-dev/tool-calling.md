---
id: tool-calling
title: Tool calling
slug: tool-calling
kind: concept
hub: topics
summary: 'Tool calling — способ дать модели доступ к внешним функциям: поиску, базе данных, календарю, браузеру, генерации файлов или действиям внутри продукта.'
status: public
links:
- id: llm-backend
  rel: used_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: ai-agents
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: llm-apps
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: automation
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Понять архитектуру агента
  target: ai-agents
  help: Поможет увидеть, чем агент отличается от обычного чата с моделью.
- label: Обсудить AI-функции продукта
  target: lead-ai-mvp-build
  help: Поможет выбрать инструменты, которые реально нужны MVP.
visibility: internal
role: implementation
audience:
- founder
- entrepreneur
- developer
routes:
- idea-to-mvp
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  use_for_generation_context: true
  public_link_replacement: use_nearest_public_atom
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Tool calling — способ дать модели доступ к внешним функциям: поиску, базе данных, календарю, браузеру, генерации файлов или действиям внутри продукта.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Tool calling

Tool calling — способ дать модели доступ к внешним функциям: поиску, базе данных, календарю, браузеру, генерации файлов или действиям внутри продукта.

Связанные элементы графа: [[llm-backend]], [[ai-agents]], [[llm-apps]], [[automation]].

## Связи

- [[llm-backend]] — used_by
- [[ai-agents]] — uses
- [[llm-apps]] — part_of
- [[automation]] — supports

## Следующие действия

- **Понять архитектуру агента** → [[ai-agents]]: Поможет увидеть, чем агент отличается от обычного чата с моделью.
- **Обсудить AI-функции продукта** → [[lead-ai-mvp-build]]: Поможет выбрать инструменты, которые реально нужны MVP.
