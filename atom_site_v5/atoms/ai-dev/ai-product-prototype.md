---
id: ai-product-prototype
title: AI-прототип продукта
slug: ai-product-prototype
kind: artifact
hub: products
summary: 'AI-прототип продукта — минимальная рабочая версия идеи, где модель уже выполняет ключевое действие: анализирует, генерирует, связывает, ищет, классифицирует или управляет инструментом.'
status: public
links:
- id: llm-apps
  rel: example_of
  strength: 0.6
  visibility: contextual
  can_surface: false
- id: mvp
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: llm-backend
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: vibe-coding
  rel: built_with
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: lead-ai-mvp-build
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Собрать первый AI-прототип
  target: lead-ai-mvp-build
  help: Поможет определить главное действие модели, входные данные и минимальный интерфейс.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: AI-прототип продукта — минимальная рабочая версия идеи, где модель уже выполняет ключевое действие: анализирует, генерирует, связывает, ищет, классифицирует или управляет инструментом.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# AI-прототип продукта

AI-прототип продукта — минимальная рабочая версия идеи, где модель уже выполняет ключевое действие: анализирует, генерирует, связывает, ищет, классифицирует или управляет инструментом.

В продуктовой работе это не самоцель, а способ проверить один риск: спрос, ценность, формат, дистрибуцию или техническую реализуемость без строительства большой системы заранее.
