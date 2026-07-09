---
id: lead-ai-mvp-build
title: Собрать AI-MVP
slug: lead-ai-mvp-build
kind: action
hub: products
summary: Контекстный технический маршрут для проектов, где MVP действительно требует AI, прототипа, ТЗ или работы с репозиторием.
status: public
links:
- id: ai-development
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: vibe-coding
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: codex
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: technical-spec-from-idea
  rel: starts_with
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-product-prototype
  rel: produces
  strength: 0.8
  visibility: contextual
  can_surface: false
actions:
- label: Начать с идеи
  target: technical-spec-from-idea
  help: Поможет быстро описать продукт так, чтобы его можно было собирать.
- label: Подготовить контекст проекта
  target: context-package
  help: Поможет собрать файлы и правила для первого прохода модели.
visibility: contextual
role: lead_action
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
  superseded_by: lead-startup-diagnostic
  public_label_replacement: первый MVP
allowed_claims:
- 'Можно использовать утверждения, прямо опирающиеся на смысл атома: Контекстный технический маршрут для проектов, где MVP действительно требует AI, прототипа, ТЗ или работы с репозиторием.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя подавать MVP как обязательно AI-MVP; AI — только частный случай.
seo:
  description: Контекстный технический маршрут для проектов, где MVP действительно требует AI, прототипа, ТЗ или работы с репозиторием.
---

# Собрать AI-MVP

AI-MVP нужен только там, где AI действительно является частью решения, а не декоративной наклейкой на обычной задаче. Сначала определяется пользовательская проблема, критерий проверки и минимальный сценарий, а уже потом выбирается модель, интерфейс и техническая сборка.

Такой MVP может быть прототипом, внутренним инструментом, автоматизацией, агентным процессом или первым техническим проходом по существующему репозиторию.

Итог — конкретный скоуп: что должна сделать первая версия, какие данные нужны, где нужен человек в контуре и какой сигнал покажет, что проект стоит развивать.
