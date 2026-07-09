---
id: llm-site
title: LLM-сайт
slug: llm-site
kind: concept
hub: topics
summary: Сайт, где модель использует граф знаний для генерации текста, ссылок и маршрутов пользователя.
status: public
links:
- id: notepub
  rel: related_product
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-graph
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: llm-apps
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: seo
  rel: related_to
  strength: 0.5
  visibility: internal
  can_surface: false
- id: llm-readable-notes
  rel: requires
  strength: 0.7
  visibility: public
  can_surface: true
- id: public-vault
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: knowledge-garden
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
actions:
- label: Понять архитектуру сайта
  target: notepub
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с Notepub
  target: lead-notes-analysis
  help: Поможет превратить заметки в понятный граф тем, сценариев и точек действия.
- label: Открыть главную логику
  target: notepub
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
seo:
  title: LLM-сайт
  description: Сайт, где модель использует граф знаний для генерации текста, ссылок и маршрутов пользователя.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Сайт, где модель использует граф знаний для генерации текста, ссылок и маршрутов пользователя.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# LLM-сайт

Сайт, где модель использует граф знаний для генерации текста, ссылок и маршрутов пользователя.

В продуктовой работе это помогает перейти от идеи к проверке: выбрать риск, минимальный формат, критерий результата и ближайшее действие.
