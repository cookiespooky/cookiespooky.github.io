---
id: prompt-engineering
title: Промпт-инжиниринг
slug: prompt-engineering
kind: method
hub: methods
summary: Проектирование инструкций, контекста и формата работы модели для стабильного результата.
status: public
links:
- id: ai-development
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: llm-apps
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: vibe-coding
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: prompt-brief
  rel: produces
  strength: 0.8
  visibility: internal
  can_surface: false
- id: context-package
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
actions:
- label: Улучшить промпт
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с продуктом
  target: lead-product-choice
  help: Поможет выбрать один фокус и проверить его на спросе.
- label: Посмотреть шаблон
  target: ai-development
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Собрать промпт-бриф
  target: prompt-brief
  help: Поможет дать модели точную задачу и снизить количество бессмысленных итераций.
seo:
  title: Промпт-инжиниринг
  description: Проектирование инструкций, контекста и формата работы модели для стабильного результата.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Проектирование инструкций, контекста и формата работы модели для стабильного результата.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Промпт-инжиниринг

Проектирование инструкций, контекста и формата работы модели для стабильного результата.

Связанные элементы графа: [[ai-development|AI-разработка]], [[llm-apps|LLM-приложения]], [[vibe-coding|Vibe coding]], [[atomic-notes|Атомарные заметки]].

## Связи

- [[ai-development]] — related_to
- [[llm-apps]] — related_to
- [[vibe-coding]] — uses
- [[atomic-notes]] — uses

## Следующие действия

- **Улучшить промпт** → [[ai-development]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Связать с продуктом** → [[lead-product-choice]]: Поможет выбрать один фокус и проверить его на спросе.
- **Посмотреть шаблон** → [[ai-development]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
