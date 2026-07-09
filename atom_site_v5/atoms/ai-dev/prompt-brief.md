---
id: prompt-brief
title: Промпт-бриф
slug: prompt-brief
kind: tool
hub: tools
summary: 'Промпт-бриф — короткое техническое задание для модели: цель изменения, текущий контекст, ограничения, ожидаемый результат и критерии проверки.'
status: public
links:
- id: context-package
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: codex
  rel: used_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: technical-spec-from-idea
  rel: extends
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-dev-workflow
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
actions:
- label: Собрать бриф проекта
  target: technical-spec-from-idea
  help: Поможет превратить идею в задачу, которую можно дать модели или разработчику.
- label: Обсудить AI-MVP
  target: lead-ai-mvp-build
  help: Поможет быстро собрать первый контекст для разработки.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Промпт-бриф — короткое техническое задание для модели: цель изменения, текущий контекст, ограничения, ожидаемый результат и критерии проверки.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Промпт-бриф

Промпт-бриф — короткое техническое задание для модели: цель изменения, текущий контекст, ограничения, ожидаемый результат и критерии проверки.

Связанные элементы графа: [[context-package]], [[codex]], [[technical-spec-from-idea]], [[ai-dev-workflow]].

## Связи

- [[context-package]] — uses
- [[codex]] — used_by
- [[technical-spec-from-idea]] — extends
- [[ai-dev-workflow]] — part_of

## Следующие действия

- **Собрать бриф проекта** → [[technical-spec-from-idea]]: Поможет превратить идею в задачу, которую можно дать модели или разработчику.
- **Обсудить AI-MVP** → [[lead-ai-mvp-build]]: Поможет быстро собрать первый контекст для разработки.
