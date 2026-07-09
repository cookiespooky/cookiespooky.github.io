---
id: llm-backend
title: LLM-бэкенд
slug: llm-backend
kind: concept
hub: topics
summary: LLM-бэкенд — серверная часть приложения, которая управляет запросами к модели, контекстом, инструментами, памятью, логами и безопасными действиями.
status: public
links:
- id: llm-apps
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: tool-calling
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: context-package
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: ai-product-prototype
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
actions:
- label: Спроектировать LLM-приложение
  target: ai-product-prototype
  help: Поможет разложить идею на модель, данные, инструменты, интерфейс и ограничения.
- label: Обсудить AI-проект
  target: lead-ai-mvp-build
  help: Поможет выбрать минимальную серверную архитектуру без лишнего космолета.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: LLM-бэкенд — серверная часть приложения, которая управляет запросами к модели, контекстом, инструментами, памятью, логами и безопасными действиями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# LLM-бэкенд

LLM-бэкенд — серверная часть приложения, которая управляет запросами к модели, контекстом, инструментами, памятью, логами и безопасными действиями.

Связанные элементы графа: [[llm-apps]], [[tool-calling]], [[context-package]], [[ai-product-prototype]].

## Связи

- [[llm-apps]] — part_of
- [[tool-calling]] — uses
- [[context-package]] — uses
- [[ai-product-prototype]] — supports

## Следующие действия

- **Спроектировать LLM-приложение** → [[ai-product-prototype]]: Поможет разложить идею на модель, данные, инструменты, интерфейс и ограничения.
- **Обсудить AI-проект** → [[lead-ai-mvp-build]]: Поможет выбрать минимальную серверную архитектуру без лишнего космолета.
